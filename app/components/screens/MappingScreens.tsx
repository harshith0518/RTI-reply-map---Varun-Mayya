'use client';

import {
  COVERAGE_COPY,
  COVERAGE_HELP,
  type CaseFixture,
  type CoverageCode,
  type DocumentRecord,
  type EffectiveMapping,
  type EvidencePassage,
  type MappingProposal,
  type Question,
} from '@/src/domain';
import { summarizeEffectiveMappings } from '@/src/demo';
import { NavButtons, STATUS_ICON, StatusBadge } from '../shared';

export function ReplyMapScreen({
  fixture,
  effectiveMappings,
  onOpenEvidence,
  onSelectQuestion,
  onNavigate,
}: {
  fixture: CaseFixture;
  effectiveMappings: EffectiveMapping[];
  onOpenEvidence: (questionId: string) => void;
  onSelectQuestion: (questionId: string) => void;
  onNavigate: (step: number) => void;
}) {
  const totals = summarizeEffectiveMappings(effectiveMappings);
  const lastQuestionId = fixture.questions.at(-1)?.id;
  const checkingCopy = totals.needsChecking === 1 ? 'needs checking' : 'need checking';

  return (
    <section className="content-screen" aria-labelledby="map-title">
      <div className="screen-heading map-heading">
        <div>
          <p className="eyebrow">What each reply answers</p>
          <h1 id="map-title" tabIndex={-1} data-step-heading>Maya&apos;s Reply Map</h1>
          <p>Each result keeps the original question, reply file and related RTI registration number together.</p>
        </div>
        <div className="map-total" aria-label={`${totals.answersLocated} answers located; ${totals.needsChecking} ${checkingCopy}`}>
          <strong>{totals.answersLocated}</strong><span>answers located</span><b>{totals.needsChecking} {checkingCopy}</b>
        </div>
      </div>
      <div className="mapping-list">
        {effectiveMappings.map((mapping) => {
          const question = fixture.questions.find((item) => item.id === mapping.questionId)!;
          const evidence = fixture.evidence.find((item) => mapping.evidenceIds.includes(item.id));
          const document = fixture.documents.find((item) => item.id === evidence?.documentId);
          return (
            <article className={`mapping-card mapping-${mapping.effectiveLabel}`} key={mapping.questionId}>
              <div className="mapping-question"><span>Q{question.number}</span><div><h2>{question.shortTitle}</h2><p>{question.text}</p></div></div>
              <div className="mapping-result">
                <StatusBadge code={mapping.effectiveLabel} />
                <p>{mapping.explanation}</p>
                <dl>
                  <div><dt>Reply file</dt><dd>{document?.fileName ?? 'No reply document'}</dd></div>
                  <div><dt>RTI registration</dt><dd>{mapping.branchId}</dd></div>
                </dl>
                <button className="text-button" type="button" onClick={() => onOpenEvidence(question.id)}>
                  Check the exact evidence <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <details className="status-help">
        <summary>What do these results mean?</summary>
        <div>{Object.entries(COVERAGE_COPY).map(([code, label]) => <p key={code}><strong>{label}</strong><span>{COVERAGE_HELP[code as CoverageCode]}</span></p>)}</div>
      </details>
      <NavButtons
        back={3}
        next={5}
        nextLabel="Check Question 3 evidence"
        onNavigate={(next) => {
          if (next === 5 && lastQuestionId) onSelectQuestion(lastQuestionId);
          onNavigate(next);
        }}
      />
    </section>
  );
}

export function EvidenceScreen({
  fixture,
  selectedQuestion,
  selectedProposal,
  selectedEvidence,
  selectedDocument,
  selectedQuestionId,
  onSelectQuestion,
  onCopyRegistration,
  onNavigate,
}: {
  fixture: CaseFixture;
  selectedQuestion: Question;
  selectedProposal: MappingProposal;
  selectedEvidence?: EvidencePassage;
  selectedDocument?: DocumentRecord;
  selectedQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
  onCopyRegistration: (registrationId: string) => void;
  onNavigate: (step: number) => void;
}) {
  return (
    <section className="content-screen" aria-labelledby="evidence-title">
      <div className="screen-heading evidence-heading">
        <div><p className="eyebrow">Question and source passage</p><h1 id="evidence-title" tabIndex={-1} data-step-heading>How this answer was matched</h1></div>
        <div className="question-switcher" aria-label="Choose a question">
          {fixture.questions.map((question) => (
            <button
              key={question.id}
              type="button"
              className={selectedQuestionId === question.id ? 'active' : ''}
              aria-pressed={selectedQuestionId === question.id}
              onClick={() => onSelectQuestion(question.id)}
            >
              Q{question.number}
            </button>
          ))}
        </div>
      </div>
      <div className="evidence-grid">
        <article className="asked-card">
          <span className="card-label">Question asked</span>
          <h2>{selectedQuestion.shortTitle}</h2>
          <p>{selectedQuestion.text}</p>
        </article>
        <article className="passage-card">
          <div className="passage-head"><span className="card-label">Passage found in the reply</span><StatusBadge code={selectedProposal.proposedLabel} /></div>
          {selectedEvidence ? <blockquote>“{selectedEvidence.quote}”</blockquote> : <p>No matching passage was located.</p>}
          <dl className="evidence-meta">
            <div><dt>Sample reply PDF</dt><dd>{selectedDocument?.fileName ?? 'No reply document'}</dd></div>
            <div><dt>Page or attachment</dt><dd>{selectedEvidence?.location.label ?? 'Not available'}</dd></div>
            <div className="registration-field"><dt>Related RTI registration number</dt><dd><code>{selectedProposal.branchId}</code><button className="copy-button" type="button" onClick={() => onCopyRegistration(selectedProposal.branchId)}>Copy number</button></dd></div>
            <div><dt>Match confidence</dt><dd className="capitalize">{selectedProposal.confidence}</dd></div>
          </dl>
          {selectedDocument?.fileName ? (
            <a className="document-link" href={`/replies/${selectedDocument.fileName}`} target="_blank" rel="noreferrer">
              Open the watermarked sample PDF <span className="new-tab-note">(opens in a new tab)</span>
            </a>
          ) : null}
        </article>
      </div>
      <article className="explanation-card">
        <span className="explanation-symbol" aria-hidden="true">{STATUS_ICON[selectedProposal.proposedLabel]}</span>
        <div><strong>Why “{COVERAGE_COPY[selectedProposal.proposedLabel]}” was suggested</strong><p>{selectedProposal.explanation}</p>{selectedEvidence?.missingDetail ? <div className="missing-detail"><b>Not found in the sample reply</b><span>{selectedEvidence.missingDetail}</span></div> : null}</div>
      </article>
      <p className="legal-line">This tool helps locate information in sample records. It does not decide whether an office complied with the RTI Act.</p>
      <NavButtons back={4} next={6} nextLabel="Check this result yourself" onNavigate={onNavigate} />
    </section>
  );
}
