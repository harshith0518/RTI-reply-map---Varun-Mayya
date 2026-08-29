'use client';

import { useState } from 'react';
import { NODE_KIND_COPY, type RTICaseData } from '@/src/case-model';
import type { SatisfactionChoice } from '@/src/question-actions';
import { QuestionActionPanel } from './QuestionActionPanel';

type ManualScreen = 'lookup' | 'otp' | 'status' | 'branches' | 'repeat' | 'single-review';

interface ManualJourneyStep {
  screen: ManualScreen;
  pageLabel: string;
  title: string;
  detail: string;
  action: string;
}

function BeforeReplyMap({ data }: { data: RTICaseData }) {
  const portalRecords = data.nodes.filter((node) => node.kind !== 'application' && (
    node.kind === 'registration' ||
    node.kind === 'no_reply' ||
    node.kind === 'fee_notice' ||
    Boolean(node.documentIds?.length)
  ));
  const recordsToShow = portalRecords.length ? portalRecords : data.nodes.filter((node) => node.kind !== 'application');
  const visibleRecords = recordsToShow.slice(0, 6);
  const visibleQuestions = data.questions.slice(0, 4);
  const registrationNumbers = Array.from(new Set(data.nodes.flatMap((node) => node.registrationNumber ? [node.registrationNumber] : [])));
  const registrationCount = registrationNumbers.length;
  const firstRegistration = registrationNumbers[0] ?? 'Registration number';
  const nextRegistration = registrationNumbers[1] ?? firstRegistration;
  const hasRelatedBranches = registrationCount > 1;
  const firstReplyNode = data.nodes.find((node) => node.registrationNumber === firstRegistration && ['reply', 'supplemental_reply', 'fee_notice', 'no_reply'].includes(node.kind));
  const firstDocument = data.documents.find((document) => document.registrationNumber === firstRegistration);
  const registrationRows = registrationNumbers.slice(0, 4).map((registrationNumber) => {
    const linkedNodes = data.nodes.filter((node) => node.registrationNumber === registrationNumber);
    const registrationNode = linkedNodes.find((node) => node.kind === 'registration') ?? linkedNodes[0];
    const document = data.documents.find((item) => item.registrationNumber === registrationNumber);
    return {
      registrationNumber,
      office: registrationNode?.office ?? 'CPIO details in status',
      status: registrationNode?.status ?? linkedNodes.at(-1)?.status ?? 'Check status',
      date: linkedNodes.at(-1)?.date ?? registrationNode?.date,
      document: document?.fileName,
    };
  });
  const [manualStep, setManualStep] = useState(0);
  const openingSteps: ManualJourneyStep[] = [
    {
      screen: 'lookup',
      pageLabel: 'Screen 1 · View Status form',
      title: 'Enter one registration number',
      detail: 'The current portal asks for the registration number, registered email ID and security code.',
      action: 'Submit',
    },
    {
      screen: 'otp',
      pageLabel: 'Screen 2 · OTP verification',
      title: 'Verify the OTP',
      detail: 'An OTP is sent to the registered email and to the mobile number only if one was supplied while filing.',
      action: 'Submit OTP',
    },
    {
      screen: 'status',
      pageLabel: 'Screen 3 · Status report',
      title: 'Application and reply/status for this registration',
      detail: 'You were right: this report can show the application text and reply or remarks. It still covers one registration, not the whole split case question by question.',
      action: hasRelatedBranches ? 'Click here to view details' : 'Review reply / status',
    },
  ];
  const manualJourney: ManualJourneyStep[] = hasRelatedBranches ? [
    ...openingSteps,
    {
      screen: 'branches',
      pageLabel: 'Screen 4 · Status of RTI Request',
      title: 'Related registrations table',
      detail: 'The official manual shows registration, CPIO, current status, date, remarks and document columns here.',
      action: 'Close details',
    },
    {
      screen: 'repeat',
      pageLabel: 'Screen 5 · View Status again',
      title: 'Use the next branch registration',
      detail: 'The manual says each CPIO part is checked with its own registration number. Enter the next number and repeat the verification.',
      action: 'Submit next registration',
    },
  ] : [
    ...openingSteps,
    {
      screen: 'single-review',
      pageLabel: 'Screen 4 · Reply package',
      title: 'No registration repeat in this case',
      detail: 'One registration can still contain a reply and several attachments. The remaining work is matching those passages to the original questions.',
      action: 'Restart example',
    },
  ];
  const currentManualStep = manualJourney[manualStep];

  return (
    <section className="before-reply-map" aria-labelledby="before-reply-title">
      <header className="before-problem-heading">
        <p>Current RTI Online path · evidence-based illustration</p>
        <h3 id="before-reply-title">{hasRelatedBranches ? 'One request. Several IDs. Repeat the lookup.' : 'One registration. One report. Several records to read.'}</h3>
        <span>RTI Online can show the application and reply for one registration. When a request splits, the official manual says each CPIO part has its own registration and reply.</span>
      </header>
      <section className="before-portal-simulator" aria-labelledby="before-portal-simulator-title">
        <header>
          <div><p>Manual click path</p><h4 id="before-portal-simulator-title">Try the repeat-and-match loop</h4></div>
          <span>Illustration only · no RTI Online connection</span>
        </header>
        <div className="before-portal-stage">
          <div className={`before-portal-screen portal-screen-${currentManualStep.screen}`} aria-live="polite">
            <span>{currentManualStep.pageLabel} · {manualStep + 1} of {manualJourney.length}</span>
            <strong>{currentManualStep.title}</strong>
            <p>{currentManualStep.detail}</p>
            {currentManualStep.screen === 'lookup' || currentManualStep.screen === 'repeat' ? (
              <div className="portal-form-fields" aria-label="Illustrated View Status form fields">
                <div><small>Enter Registration Number *</small><code>{currentManualStep.screen === 'repeat' ? nextRegistration : firstRegistration}</code></div>
                <div><small>Enter Email Id *</small><code>registered-email@example.in</code></div>
                <div><small>Enter Security code *</small><code>CAPTCHA + typed code</code></div>
              </div>
            ) : null}
            {currentManualStep.screen === 'otp' ? (
              <div className="portal-otp-box"><small>Enter OTP *</small><code>• • • • • •</code><span>Sent to the registered contact details</span></div>
            ) : null}
            {currentManualStep.screen === 'status' ? (
              <div className="portal-status-report">
                <dl>
                  <div><dt>Registration Number</dt><dd><code>{firstRegistration}</code></dd></div>
                  <div><dt>Text of Application</dt><dd>{visibleQuestions.map((question) => `Q${question.number} ${question.title}`).join(' · ')}</dd></div>
                  <div><dt>Status / Remarks</dt><dd>{firstReplyNode?.summary ?? firstReplyNode?.status ?? 'Status and reply for this registration'}</dd></div>
                  <div><dt>Reply Document</dt><dd>{firstDocument?.fileName ?? 'Shown when a document is available'}</dd></div>
                </dl>
                {hasRelatedBranches ? <p><span>Forwarded to multiple CPIOs</span><u>Click here to view details</u></p> : null}
                <div className="portal-utility-buttons" aria-label="Buttons shown in the official manual"><span>Print RTI Application</span><span>Print Status</span><span>Go Back</span></div>
              </div>
            ) : null}
            {currentManualStep.screen === 'branches' ? (
              <div className="portal-branch-table" role="table" aria-label="Illustrated related registrations table">
                <div className="portal-branch-row portal-branch-head" role="row"><span role="columnheader">Registration Number</span><span role="columnheader">CPIO / office</span><span role="columnheader">Current status</span><span role="columnheader">Document</span></div>
                {registrationRows.map((row) => (
                  <div className="portal-branch-row" role="row" key={row.registrationNumber}>
                    <code role="cell">{row.registrationNumber}</code>
                    <span role="cell">{row.office}</span>
                    <span role="cell">{row.status}{row.date ? <small>{row.date}</small> : null}</span>
                    <span role="cell">{row.document ?? '—'}</span>
                  </div>
                ))}
                {registrationCount > registrationRows.length ? <small>+ {registrationCount - registrationRows.length} more related registrations</small> : null}
              </div>
            ) : null}
            {currentManualStep.screen === 'single-review' ? (
              <ul className="portal-document-list">
                {(data.documents.length ? data.documents : [{ id: 'status-only', fileName: 'Status / reply record' }]).slice(0, 4).map((document) => <li key={document.id}>{document.fileName}</li>)}
              </ul>
            ) : null}
          </div>
          <button type="button" onClick={() => setManualStep((current) => current === manualJourney.length - 1 ? 0 : current + 1)}>
            {currentManualStep.action}<span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="before-portal-progress" style={{ gridTemplateColumns: `repeat(${manualJourney.length}, minmax(0, 1fr))` }} aria-hidden="true">
          {manualJourney.map((step, index) => <span className={index <= manualStep ? 'active' : ''} key={step.action} />)}
        </div>
        <nav className="before-source-links" aria-label="Official workflow references">
          <a href="https://www.rtionline.gov.in/request/status.php" target="_blank" rel="noreferrer">Open current View Status <span>(new tab)</span></a>
          <a href="#why-this-exists">See the official manual screenshots below</a>
        </nav>
      </section>
      <aside className="before-accuracy-note">
        <strong>Important correction</strong>
        <p>The portal can place the application text and reply or remarks on one registration report. The two panels below are our comparison—not an official RTI Online screen. The missing piece is one case-wide map across every related registration.</p>
      </aside>
      <div className="before-workspace">
        <section className="before-records" aria-labelledby="before-records-title">
          <div className="before-column-heading"><strong id="before-records-title">Portal trail to inspect</strong><span>{recordsToShow.length} status or reply records</span></div>
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
          <div className="before-column-heading"><strong id="before-questions-title">Case-wide question check</strong><span>{data.questions.length} original questions</span></div>
          <ol>
            {visibleQuestions.map((question) => (
              <li key={question.id}>
                <span>Q{question.number}</span>
                <div><strong>{question.title}</strong><small>Which branch reply and exact passage?</small></div>
                <b>Still manual</b>
              </li>
            ))}
          </ol>
          {data.questions.length > visibleQuestions.length ? <p>+ {data.questions.length - visibleQuestions.length} more questions</p> : null}
        </section>
      </div>
      <footer className="before-manual-cost">
        <dl aria-label="Manual review workload">
          <div><dt>Registrations in case</dt><dd>{registrationCount}</dd></div>
          <div><dt>Files or notices</dt><dd>{data.documents.length}</dd></div>
          <div><dt>Case-wide Reply Map</dt><dd>Not shown</dd></div>
        </dl>
        <div><strong>Work left to the citizen</strong><p>{hasRelatedBranches ? 'Check each registration, compare its reply and attachments, then rebuild the full answer question by question.' : 'Read the reply and attachments, then locate the exact passage for every original question.'}</p></div>
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
