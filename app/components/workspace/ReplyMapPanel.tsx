'use client';

import { useState } from 'react';
import { COVERAGE_COPY, COVERAGE_HELP, type CoverageCode } from '@/src/coverage';
import type { RTICaseData } from '@/src/case-model';
import { StatusBadge } from '../shared';

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

  return (
    <section className="workspace-panel reply-panel" aria-labelledby="reply-map-title">
      <header className="panel-header">
        <div><p className="panel-kicker">2 · Information found</p><h2 id="reply-map-title">Reply Map</h2></div>
        <span className="structure-chip">{data.mappings.length} mapped · {reviewedCount} checked</span>
      </header>
      <p className="panel-intro">Each question shows its evidence and location—or why none can safely be shown.</p>
      <div className="coverage-key" aria-label="Reply Map status key">
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
                      <span>Your check <small>kept only in this tab</small></span>
                      <select value={effectiveCoverage} onChange={(event) => onReview(mapping.id, event.target.value as CoverageCode)}>
                        {(Object.entries(COVERAGE_COPY) as [CoverageCode, string][]).map(([code, label]) => <option value={code} key={code}>{label}</option>)}
                      </select>
                    </label>
                    {reviews[mapping.id]
                      ? <span className="check-saved" role="status">✓ Check saved</span>
                      : <button className="confirm-review" type="button" onClick={() => onReview(mapping.id, effectiveCoverage)}>Confirm this result</button>}
                  </div>
                </div>
                {reviews[mapping.id] ? <p className="review-note">Original proposal: {COVERAGE_COPY[mapping.coverage]}. Your check is shown above without deleting the original.</p> : null}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
