'use client';

import { useState } from 'react';
import { NODE_KIND_COPY, type RTICaseData } from '@/src/case-model';
import type { SatisfactionChoice } from '@/src/question-actions';
import { QuestionActionPanel } from './QuestionActionPanel';

function BeforeReplyMap({ data }: { data: RTICaseData }) {
  const caseRecords = data.nodes.filter((node) => node.kind !== 'application');
  const recordsToShow = caseRecords.length ? caseRecords : data.nodes;
  const visibleRecords = recordsToShow.slice(0, 6);
  const visibleQuestions = data.questions.slice(0, 4);
  const registrationCount = new Set(data.nodes.flatMap((node) => node.registrationNumber ? [node.registrationNumber] : [])).size;

  return (
    <section className="before-reply-map" aria-labelledby="before-reply-title">
      <header className="before-problem-heading">
        <p>The tab-hopping era · simplified illustration</p>
        <h3 id="before-reply-title">Numbers everywhere. Answers somewhere.</h3>
        <span>{data.painPoint}</span>
      </header>
      <div className="before-workspace">
        <section className="before-records" aria-labelledby="before-records-title">
          <div className="before-column-heading"><strong id="before-records-title">Records to open</strong><span>{recordsToShow.length} case events</span></div>
          <div className="before-record-stack">
            {visibleRecords.map((node) => (
              <article key={node.id}>
                <span>{NODE_KIND_COPY[node.kind]}</span>
                <strong>{node.title}</strong>
                <code>{node.registrationNumber ?? node.appealNumber ?? 'No linked registration shown'}</code>
                <small>{node.status ?? node.office ?? 'Open for context'}</small>
              </article>
            ))}
            {recordsToShow.length > visibleRecords.length ? <p>+ {recordsToShow.length - visibleRecords.length} more events</p> : null}
          </div>
        </section>
        <section className="before-questions" aria-labelledby="before-questions-title">
          <div className="before-column-heading"><strong id="before-questions-title">Questions to trace</strong><span>{data.questions.length} original questions</span></div>
          <ol>
            {visibleQuestions.map((question) => (
              <li key={question.id}>
                <span>Q{question.number}</span>
                <div><strong>{question.title}</strong><small>Which registration, reply and page?</small></div>
                <b>Unlinked</b>
              </li>
            ))}
          </ol>
          {data.questions.length > visibleQuestions.length ? <p>+ {data.questions.length - visibleQuestions.length} more questions</p> : null}
        </section>
      </div>
      <footer className="before-manual-cost">
        <dl aria-label="Manual review workload">
          <div><dt>Registration trails</dt><dd>{registrationCount}</dd></div>
          <div><dt>Files or notices</dt><dd>{data.documents.length}</dd></div>
          <div><dt>Question links</dt><dd>None</dd></div>
        </dl>
        <div><strong>Work left to the citizen</strong><p>Open every record, match numbers, search pages and decide which reply answers which question.</p></div>
      </footer>
    </section>
  );
}

function decisionCopy(choice?: SatisfactionChoice) {
  if (choice === 'satisfied') return 'Answered for you';
  if (choice === 'needs_action') return 'Next step ready';
  return 'Check this question';
}

export function ReplyMapPanel({
  data,
  selectedNodeId,
  decisions,
  onSelectNode,
  onRevealNode,
  onDecision,
  onResetDecisions,
  onLiveMessage,
}: {
  data: RTICaseData;
  selectedNodeId: string;
  decisions: Record<string, SatisfactionChoice>;
  onSelectNode: (nodeId: string) => void;
  onRevealNode: (nodeId: string) => void;
  onDecision: (mappingId: string, choice: SatisfactionChoice) => void;
  onResetDecisions: () => void;
  onLiveMessage: (message: string) => void;
}) {
  const firstGap = data.mappings.find((mapping) => mapping.missingDetail || !mapping.passage)?.id;
  const defaultOpen = firstGap ?? data.mappings[0]?.id;
  const checkedCount = Object.keys(decisions).length;
  const [openMappings, setOpenMappings] = useState<Set<string>>(() => new Set(defaultOpen ? [defaultOpen] : []));
  const [comparisonView, setComparisonView] = useState<'proposed' | 'current'>('proposed');

  return (
    <section className="workspace-panel reply-panel" id="reply-map-panel" aria-labelledby="reply-map-title">
      <header className="panel-header">
        <div><p className="panel-kicker">2 · The part that matters</p><h2 id="reply-map-title">Cool. But did they answer?</h2></div>
        <span className="structure-chip">{comparisonView === 'proposed' ? `${data.mappings.length} questions · ${checkedCount} checked` : `${data.nodes.length} events · ${data.documents.length} files`}</span>
      </header>
      <p className="panel-intro">Open a question, read the source and say yes or no. Revolutionary, apparently.</p>
      <div className="reply-compare-switch">
        <div aria-live="polite">
          <span>Compare the experience</span>
          <strong>{comparisonView === 'proposed' ? 'Proposed: answer and next step together' : 'Current pattern: separate records to match'}</strong>
        </div>
        <div className="reply-view-toggle" role="group" aria-label="Compare proposed and current views">
          <button type="button" className={comparisonView === 'proposed' ? 'active' : ''} aria-pressed={comparisonView === 'proposed'} onClick={() => setComparisonView('proposed')}><span>Proposed view</span><strong>Reply Map + action</strong></button>
          <button type="button" className={comparisonView === 'current' ? 'active' : ''} aria-pressed={comparisonView === 'current'} onClick={() => setComparisonView('current')}><span>Current pattern</span><strong>Separate records</strong></button>
        </div>
      </div>
      {comparisonView === 'proposed' ? <>
        <div className="human-check-note">
          <strong>You&apos;re the judge here.</strong>
          <span>The JSON links records to questions. Only you can say whether the information is satisfactory.</span>
          {checkedCount ? <button type="button" onClick={onResetDecisions}>Reset my answers</button> : null}
        </div>
        <div className="reply-map-list">
          {data.mappings.map((mapping) => {
            const question = data.questions.find((item) => item.id === mapping.questionId)!;
            const document = data.documents.find((item) => item.id === mapping.documentId);
            const node = data.nodes.find((item) => item.id === mapping.nodeId);
            const displayRegistration = mapping.registrationNumber ?? node?.registrationNumber ?? document?.registrationNumber;
            const choice = decisions[mapping.id];
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
                  <span className={`decision-badge ${choice ?? 'unchecked'}`}>{decisionCopy(choice)}</span>
                </summary>
                <div className="mapping-body">
                  <p className="question-text"><strong>Citizen asked</strong>{question.text}</p>
                  {mapping.passage ? <blockquote><span>Reply passage</span>“{mapping.passage}”</blockquote> : <div className="mapping-empty">No answer passage is available in this case record.</div>}
                  <dl>
                    <div><dt>{proceduralDocument ? 'Procedural record' : 'Record checked'}</dt><dd>{document?.fileName ?? 'No substantive document supplied'}</dd></div>
                    <div><dt>Page / location</dt><dd>{mapping.location ?? 'Not available'}</dd></div>
                    <div><dt>Registration</dt><dd><code>{displayRegistration ?? 'Not supplied'}</code></dd></div>
                    <div><dt>Record date</dt><dd>{document?.issuedOn ?? node?.date ?? 'Not supplied'}</dd></div>
                  </dl>
                  <p className="mapping-explanation"><strong>What this record shows</strong>{mapping.explanation}</p>
                  {mapping.missingDetail ? <p className="missing-record"><strong>Still not found in the record</strong>{mapping.missingDetail}</p> : null}
                  {mapping.temporalQualifier ? <p className="temporal-note"><strong>Time limit in the wording</strong>{mapping.temporalQualifier}</p> : null}
                  {document?.assetPath ? <a className="document-link" href={document.assetPath} target="_blank" rel="noreferrer">Open watermarked sample PDF <span>(new tab)</span></a> : null}
                  {document && !document.assetPath ? <p className="document-metadata-note">{data.source === 'synthetic' ? 'Synthetic record metadata only · sample PDF not attached.' : 'Imported metadata · compare it with your redacted source file.'}</p> : null}
                  <div className="mapping-actions">
                    <button className="branch-link" type="button" onClick={() => onRevealNode(mapping.nodeId)}>Show this record in the tree</button>
                  </div>
                  <QuestionActionPanel data={data} mapping={mapping} choice={choice} onChoice={(nextChoice) => onDecision(mapping.id, nextChoice)} onLiveMessage={onLiveMessage} />
                </div>
              </details>
            );
          })}
        </div>
      </> : <BeforeReplyMap data={data} />}
    </section>
  );
}
