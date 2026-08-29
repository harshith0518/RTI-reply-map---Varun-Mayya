'use client';

import { useRef, useState } from 'react';
import { COVERAGE_COPY, type CoverageCode } from '@/src/coverage';
import { summarizeCase, type RTICaseData } from '@/src/case-model';
import { DependencyTree } from './DependencyTree';
import { ReplyMapPanel } from './ReplyMapPanel';

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

  const attentionMappings = data.mappings.filter(
    (mapping) => (reviews[mapping.id] ?? mapping.coverage) !== 'answer_located',
  );
  const locatedCount = data.mappings.length - attentionMappings.length;

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
        <div className="original-questions">
          <div><strong>Original questions</strong><span>Each points to a passage or a stated gap.</span></div>
          <ol>
            {data.questions.map((question) => (
              <li key={question.id}><span>Q{question.number}</span><div><strong>{question.title}</strong><p>{question.text}</p></div></li>
            ))}
          </ol>
        </div>
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
            <p className="eyebrow">Case result</p>
            <h2 id="outcome-title">What needs attention</h2>
          </div>
          <p>{locatedCount} question{locatedCount === 1 ? ' has' : 's have'} a located answer. {attentionMappings.length} need{attentionMappings.length === 1 ? 's' : ''} a closer look.{reviewedCount ? ` ${reviewedCount} local check${reviewedCount === 1 ? '' : 's'} applied.` : ''}</p>
        </div>
        <div className="outcome-next-step">
          <div>
            <h3>{attentionMappings.length ? `${attentionMappings.length} question${attentionMappings.length === 1 ? ' needs' : 's need'} attention` : 'Every question has a located answer'}</h3>
            <p>{attentionMappings.length ? 'Open the item to inspect its passage, gap and branch.' : 'Review every passage before relying on it.'} These are evidence labels, not legal findings.</p>
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
      </section>
      <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </>
  );
}
