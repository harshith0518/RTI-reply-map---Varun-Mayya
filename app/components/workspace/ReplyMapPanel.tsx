'use client';

import { useState } from 'react';
import { COVERAGE_COPY, COVERAGE_HELP, type CoverageCode } from '@/src/coverage';
import { NODE_KIND_COPY, type RTICaseData } from '@/src/case-model';
import { StatusBadge } from '../shared';

function BeforeReplyMap({ data }: { data: RTICaseData }) {
  const caseRecords = data.nodes.filter((node) => node.kind !== 'application');
  const recordsToShow = caseRecords.length ? caseRecords : data.nodes;
  const visibleRecords = recordsToShow.slice(0, 6);
  const visibleQuestions = data.questions.slice(0, 4);
  const registrationCount = new Set(data.nodes.flatMap((node) => node.registrationNumber ? [node.registrationNumber] : [])).size;

  return (
    <section className="before-reply-map" aria-labelledby="before-reply-title">
      <header className="before-problem-heading">
        <p>Before change · Illustrative unlinked view</p>
        <h3 id="before-reply-title">Records exist. The answer trail is still manual.</h3>
        <span>{data.painPoint}</span>
      </header>

      <div className="before-workspace">
        <section className="before-records" aria-labelledby="before-records-title">
          <div className="before-column-heading"><strong id="before-records-title">Separate records to open</strong><span>{recordsToShow.length} case events</span></div>
          <div className="before-record-stack">
            {visibleRecords.map((node) => (
              <article key={node.id}>
                <span>{NODE_KIND_COPY[node.kind]}</span>
                <strong>{node.title}</strong>
                <code>{node.registrationNumber ?? node.appealNumber ?? 'No linked registration shown'}</code>
                <small>{node.status ?? node.office ?? 'Open this record for context'}</small>
              </article>
            ))}
            {recordsToShow.length > visibleRecords.length ? <p>+ {recordsToShow.length - visibleRecords.length} more case events to inspect</p> : null}
          </div>
        </section>

        <section className="before-questions" aria-labelledby="before-questions-title">
          <div className="before-column-heading"><strong id="before-questions-title">Questions to trace manually</strong><span>{data.questions.length} original questions</span></div>
          <ol>
            {visibleQuestions.map((question) => (
              <li key={question.id}>
                <span>Q{question.number}</span>
                <div><strong>{question.title}</strong><small>Which registration? Which reply? Which page?</small></div>
                <b>Unlinked</b>
              </li>
            ))}
          </ol>
          {data.questions.length > visibleQuestions.length ? <p>+ {data.questions.length - visibleQuestions.length} more questions to trace</p> : null}
        </section>
      </div>

      <footer className="before-manual-cost">
        <dl aria-label="Manual review workload">
          <div><dt>Registration trails</dt><dd>{registrationCount}</dd></div>
          <div><dt>Files or notices</dt><dd>{data.documents.length}</dd></div>
          <div><dt>Joined Reply Map</dt><dd>No</dd></div>
        </dl>
        <div><strong>The work left to the citizen</strong><p>Open each record, match registration numbers, search pages and remember which branch answered which question.</p></div>
      </footer>
    </section>
  );
}

export function ReplyMapPanel({
  data,
  selectedNodeId,
  reviews,
  onSelectNode,
  onRevealNode,
  onReview,
  onResetReviews,
}: {
  data: RTICaseData;
  selectedNodeId: string;
  reviews: Record<string, CoverageCode>;
  onSelectNode: (nodeId: string) => void;
  onRevealNode: (nodeId: string) => void;
  onReview: (mappingId: string, coverage: CoverageCode) => void;
  onResetReviews: () => void;
}) {
  const firstUncertain = data.mappings.find((mapping) => mapping.coverage !== 'answer_located')?.id;
  const defaultOpen = firstUncertain ?? data.mappings[0]?.id;
  const reviewedCount = Object.keys(reviews).length;
  const [openMappings, setOpenMappings] = useState<Set<string>>(() => new Set(defaultOpen ? [defaultOpen] : []));
  const [comparisonView, setComparisonView] = useState<'after' | 'before'>('after');

  return (
    <section className="workspace-panel reply-panel" id="reply-map-panel" aria-labelledby="reply-map-title">
      <header className="panel-header">
        <div><p className="panel-kicker">2 · Evidence coverage</p><h2 id="reply-map-title">Reply Map</h2></div>
        <span className="structure-chip">{comparisonView === 'after' ? `${data.mappings.length} mapped · ${reviewedCount} checked` : `${data.nodes.length} events · ${data.documents.length} files`}</span>
      </header>
      <p className="panel-intro">Switch between this question-by-question map and an illustrative view of the same case as separate records.</p>
      <div className="before-after reply-map-comparison" aria-label="Case-specific before and after comparison">
        <p><span>Before · Without Reply Map</span><strong>{data.painPoint}</strong></p>
        <b aria-hidden="true">→</b>
        <p><span>After · With Reply Map</span><strong>Every original question has one visible result tied to its case event, with an exact passage and location when available—or a clear explanation of what remains incomplete.</strong></p>
      </div>
      <div className="reply-compare-switch">
        <div aria-live="polite">
          <span>Compare this case</span>
          <strong>{comparisonView === 'after' ? 'After change: one answer trail' : 'Before change: manual reconstruction'}</strong>
        </div>
        <div className="reply-view-toggle" role="group" aria-label="Compare before and after views">
          <button type="button" className={comparisonView === 'after' ? 'active' : ''} aria-pressed={comparisonView === 'after'} onClick={() => setComparisonView('after')}><span>After change</span><strong>Reply Map</strong></button>
          <button type="button" className={comparisonView === 'before' ? 'active' : ''} aria-pressed={comparisonView === 'before'} onClick={() => setComparisonView('before')}><span>Before change</span><strong>Scattered records</strong></button>
        </div>
      </div>
      {comparisonView === 'after' ? <>
        <div className="coverage-ownership">
          <strong>Proposed evidence labels</strong>
          <span>They come from the prepared case JSON—not an RTI portal or an assigned officer. “Your evidence check” lets you review them locally without changing the source.</span>
        </div>
        <div className="coverage-key" aria-label="Reply Map evidence-label key">
          {Object.entries(COVERAGE_COPY).map(([code, label]) => (
            <span className={`key-${code}`} key={code}>{data.mappings.filter((mapping) => (reviews[mapping.id] ?? mapping.coverage) === code).length} {label}</span>
          ))}
          {reviewedCount ? <button type="button" onClick={onResetReviews}>Reset my checks</button> : null}
        </div>
        <div className="reply-map-list">
          {data.mappings.map((mapping) => {
          const question = data.questions.find((item) => item.id === mapping.questionId)!;
          const document = data.documents.find((item) => item.id === mapping.documentId);
          const node = data.nodes.find((item) => item.id === mapping.nodeId);
          const displayRegistration = mapping.registrationNumber ?? node?.registrationNumber ?? document?.registrationNumber;
          const effectiveCoverage = reviews[mapping.id] ?? mapping.coverage;
          const proceduralDocument = document ? ['transfer_notice', 'appeal_order', 'fee_notice'].includes(document.kind) : false;
          return (
            <details
              className={`reply-map-item ${selectedNodeId === mapping.nodeId ? 'selected' : ''}`}
              open={openMappings.has(mapping.id)}
              onToggle={(event) => {
                const isOpen = event.currentTarget.open;
                setOpenMappings((current) => {
                  if (current.has(mapping.id) === isOpen) return current;
                  const next = new Set(current);
                  if (isOpen) next.add(mapping.id);
                  else next.delete(mapping.id);
                  return next;
                });
                if (isOpen) onSelectNode(mapping.nodeId);
              }}
              key={`${data.caseId}-${mapping.id}`}
            >
              <summary>
                <span className="map-question-number">Q{question.number}</span>
                <span className="map-question-title"><strong>{question.title}</strong><small>{displayRegistration ?? 'Registration not supplied'}</small></span>
                <StatusBadge code={effectiveCoverage} prefix={reviews[mapping.id] ? 'Your check' : undefined} />
              </summary>
              <div className="mapping-body">
                <p className="question-text"><strong>Citizen asked</strong>{question.text}</p>
                {mapping.passage ? <blockquote><span>Passage located</span>“{mapping.passage}”</blockquote> : <div className="mapping-empty">No supporting passage is available for this result.</div>}
                <dl>
                  <div><dt>{proceduralDocument ? 'Procedural document' : 'Evidence document'}</dt><dd>{document?.fileName ?? 'No substantive document available'}</dd></div>
                  <div><dt>Page / location</dt><dd>{mapping.location ?? 'Not available'}</dd></div>
                  <div><dt>Confidence</dt><dd className="capitalize">{mapping.confidence}</dd></div>
                  <div><dt>Meaning</dt><dd>{COVERAGE_HELP[effectiveCoverage]}</dd></div>
                </dl>
                <p className="mapping-explanation"><strong>Why {COVERAGE_COPY[mapping.coverage]}</strong>{mapping.explanation}</p>
                {mapping.missingDetail ? <p className="missing-record"><strong>Still not located</strong>{mapping.missingDetail}</p> : null}
                {mapping.temporalQualifier ? <p className="temporal-note">Time qualifier: {mapping.temporalQualifier}</p> : null}
                {document?.assetPath ? <a className="document-link" href={document.assetPath} target="_blank" rel="noreferrer">Open watermarked sample PDF <span>(new tab)</span></a> : null}
                {document && !document.assetPath ? <p className="document-metadata-note">{data.source === 'synthetic' ? 'Synthetic document metadata only · sample PDF not attached.' : 'Document metadata from imported JSON · compare it with your redacted source record.'}</p> : null}
                <div className="mapping-actions">
                  <button className="branch-link" type="button" onClick={() => onRevealNode(mapping.nodeId)}>Show this case event in the tree</button>
                  <div className="review-actions">
                    <label className="review-control">
                      <span>Your evidence check <small>optional · this tab only</small></span>
                      <select value={effectiveCoverage} onChange={(event) => onReview(mapping.id, event.target.value as CoverageCode)}>
                        {(Object.entries(COVERAGE_COPY) as [CoverageCode, string][]).map(([code, label]) => <option value={code} key={code}>{label}</option>)}
                      </select>
                    </label>
                    {reviews[mapping.id]
                      ? <span className="check-saved" role="status">✓ Check saved</span>
                      : <button className="confirm-review" type="button" onClick={() => onReview(mapping.id, effectiveCoverage)}>Confirm this label</button>}
                  </div>
                </div>
                {reviews[mapping.id] ? <p className="review-note">Original proposal: {COVERAGE_COPY[mapping.coverage]}. Your check is shown above without deleting the original.</p> : null}
              </div>
            </details>
          );
          })}
        </div>
      </> : <BeforeReplyMap data={data} />}
    </section>
  );
}
