'use client';

import { useRef, useState } from 'react';
import { COVERAGE_COPY, type CoverageCode } from '@/src/coverage';
import { summarizeCase, type RTICaseData } from '@/src/case-model';
import { DependencyTree } from './DependencyTree';
import { ReplyMapPanel } from './ReplyMapPanel';

const COVERAGE_CODES = Object.keys(COVERAGE_COPY) as CoverageCode[];

export function CaseWorkspace({
  data,
  reviews,
  onReview,
  onResetReviews,
}: {
  data: RTICaseData;
  reviews: Record<string, CoverageCode>;
  onReview: (mappingId: string, coverage: CoverageCode) => void;
  onResetReviews: () => void;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(data.rootNodeId);
  const [liveMessage, setLiveMessage] = useState('');
  const nodeElements = useRef(new Map<string, HTMLButtonElement>());
  const stats = summarizeCase(data);
  const reviewedCount = Object.keys(reviews).length;
  const effectiveCoverage = Object.fromEntries(COVERAGE_CODES.map((code) => [code, 0])) as Record<CoverageCode, number>;

  for (const mapping of data.mappings) {
    effectiveCoverage[reviews[mapping.id] ?? mapping.coverage] += 1;
  }

  const attentionMappings = data.mappings.filter(
    (mapping) => (reviews[mapping.id] ?? mapping.coverage) !== 'answer_located',
  );

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setLiveMessage('RTI registration number copied.');
    } catch {
      setLiveMessage('Copy is unavailable. Select the number and copy it manually.');
    }
  }

  function reviewMapping(mappingId: string, coverage: CoverageCode) {
    onReview(mappingId, coverage);
    setLiveMessage(`Your check was kept in this tab as “${COVERAGE_COPY[coverage]}”.`);
  }

  function registerNode(nodeId: string, element: HTMLButtonElement | null) {
    if (element) nodeElements.current.set(nodeId, element);
    else nodeElements.current.delete(nodeId);
  }

  function revealNode(nodeId: string) {
    setSelectedNodeId(nodeId);
    window.requestAnimationFrame(() => {
      const element = nodeElements.current.get(nodeId);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      element?.focus({ preventScroll: true });
    });
  }

  return (
    <>
      <section className="case-summary" aria-labelledby="case-title">
        <div>
          <p className="eyebrow">{data.citizenName}&apos;s {data.fictional ? 'fictional case' : 'redacted local case'} · {data.structureLabel}</p>
          <h2 id="case-title" tabIndex={-1}>{data.title}</h2>
          <p className="case-goal">{data.citizenGoal}</p>
        </div>
        <dl className="case-stats">
          <div><dt>Questions</dt><dd>{stats.questions}</dd></div>
          <div><dt>Registrations</dt><dd>{stats.registrations}</dd></div>
          <div><dt>Replies</dt><dd>{stats.replies}</dd></div>
        </dl>
        <div className="case-context"><strong>Why this gets confusing</strong><p>{data.painPoint}</p></div>
        <div className="original-questions">
          <div><strong>What the citizen originally asked</strong><span>Every question gets one visible Reply Map result.</span></div>
          <ol>
            {data.questions.map((question) => (
              <li key={question.id}><span>Q{question.number}</span><div><strong>{question.title}</strong><p>{question.text}</p></div></li>
            ))}
          </ol>
        </div>
        <div className="case-boundary"><strong>{data.source === 'custom' ? 'Local imported case' : 'Fictional demonstration'}</strong><span>{reviewedCount ? `${reviewedCount} result${reviewedCount === 1 ? '' : 's'} checked by you · ` : ''}No automated legal conclusion</span></div>
      </section>
      <div className="workspace-grid" id="workspace">
        <DependencyTree data={data} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} onRegisterNode={registerNode} onCopy={copyValue} />
        <ReplyMapPanel
          data={data}
          selectedNodeId={selectedNodeId}
          reviews={reviews}
          onSelectNode={setSelectedNodeId}
          onRevealNode={revealNode}
          onReview={reviewMapping}
          onResetReviews={() => {
            onResetReviews();
            setLiveMessage('Your checks were reset to the proposed results.');
          }}
        />
      </div>
      <section className="outcome-summary" aria-labelledby="outcome-title">
        <div className="outcome-heading">
          <div>
            <p className="eyebrow">Citizen-ready outcome</p>
            <h2 id="outcome-title">What this Reply Map shows</h2>
          </div>
          <p>{reviewedCount ? `${reviewedCount} local reviewer check${reviewedCount === 1 ? '' : 's'} applied in this tab.` : 'Case JSON evidence labels—not official RTI statuses. Check every result yourself.'}</p>
        </div>
        <dl className="outcome-counts" aria-label="Question coverage summary">
          {COVERAGE_CODES.map((code) => (
            <div className={`outcome-count count-${code}`} key={code}>
              <dt>{COVERAGE_COPY[code]}</dt>
              <dd>{effectiveCoverage[code]}</dd>
            </div>
          ))}
        </dl>
        <div className="outcome-next-step">
          <div>
            <h3>{attentionMappings.length ? `${attentionMappings.length} question${attentionMappings.length === 1 ? ' needs' : 's need'} attention` : 'Every question has a located answer'}</h3>
            <p>{attentionMappings.length ? 'These labels guide review; they do not judge legal compliance. Open each item to inspect its passage, gap, and branch.' : 'Review every passage before relying on it. This prototype does not judge legal adequacy.'}</p>
          </div>
          {attentionMappings.length > 0 && (
            <ul>
              {attentionMappings.map((mapping) => {
                const question = data.questions.find((item) => item.id === mapping.questionId);
                const node = data.nodes.find((item) => item.id === mapping.nodeId);
                const result = reviews[mapping.id] ?? mapping.coverage;
                return (
                  <li key={mapping.id}>
                    <span>Q{question?.number ?? '?'}</span>
                    <div><strong>{question?.title ?? 'Question'}</strong><small>{node?.registrationNumber ?? mapping.registrationNumber ?? 'No branch registration'}</small></div>
                    <em>{COVERAGE_COPY[result]}</em>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="official-handoff">
          <strong>Need to act on a real case?</strong>
          <span>Verify your records, then use the official portal or guidance. This site submits no RTI, payment, or appeal.</span>
          <a href="https://rtionline.gov.in/" target="_blank" rel="noreferrer">Open official RTI Online portal <span>(new tab)</span></a>
          <a href="https://rtionline.gov.in/faq.php" target="_blank" rel="noreferrer">Read official FAQ <span>(new tab)</span></a>
        </div>
      </section>
      <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </>
  );
}
