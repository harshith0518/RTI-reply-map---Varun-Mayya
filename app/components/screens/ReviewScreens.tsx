'use client';

import {
  COVERAGE_COPY,
  COVERAGE_HELP,
  type CaseFixture,
  type CoverageCode,
  type EffectiveMapping,
  type MappingProposal,
  type Question,
} from '@/src/domain';
import { STATUS_ICON, StatusBadge } from '../shared';

export function ReviewScreen({
  selectedQuestion,
  selectedProposal,
  draftLabel,
  draftNote,
  storageNotice,
  onDraftLabel,
  onDraftNote,
  onSave,
  onNavigate,
}: {
  selectedQuestion: Question;
  selectedProposal: MappingProposal;
  draftLabel: CoverageCode;
  draftNote: string;
  storageNotice: string;
  onDraftLabel: (code: CoverageCode) => void;
  onDraftNote: (note: string) => void;
  onSave: () => void;
  onNavigate: (step: number) => void;
}) {
  return (
    <section className="content-screen narrow-screen" aria-labelledby="review-title">
      <div className="screen-heading">
        <p className="eyebrow">Check the result yourself</p>
        <h1 id="review-title" tabIndex={-1} data-step-heading>Does the label fit Question {selectedQuestion.number}?</h1>
        <p>Your choice is used in this sample summary. It never changes the reply passage or sends anything outside your browser.</p>
      </div>
      <div className="suggestion-line"><span>Suggested from the sample passage</span><StatusBadge code={selectedProposal.proposedLabel} /></div>
      <fieldset className="review-options">
        <legend>Choose the result that best matches the reply</legend>
        {(Object.keys(COVERAGE_COPY) as CoverageCode[]).map((code) => (
          <label className={draftLabel === code ? 'selected' : ''} key={code}>
            <input
              type="radio"
              name="review-label"
              value={code}
              checked={draftLabel === code}
              onChange={() => onDraftLabel(code)}
            />
            <span className={`review-radio status-${code}`} aria-hidden="true">{STATUS_ICON[code]}</span>
            <span><strong>{COVERAGE_COPY[code]}</strong><small>{COVERAGE_HELP[code]}</small></span>
          </label>
        ))}
      </fieldset>
      <label className="note-field" htmlFor="review-note">
        <span>Add your note <small>Optional</small></span>
        <textarea
          id="review-note"
          value={draftNote}
          maxLength={300}
          onChange={(event) => onDraftNote(event.target.value)}
          placeholder="For example: the total is present, but the category split is missing."
        />
        <small>{draftNote.length}/300 characters</small>
      </label>
      <div className="privacy-note"><strong>Saved on this device only</strong><span>{storageNotice}</span></div>
      <div className="screen-actions">
        <button className="secondary-button" type="button" onClick={() => onNavigate(5)}><span aria-hidden="true">←</span> Back</button>
        <button className="primary-button" type="button" onClick={onSave}>Save and view summary <span aria-hidden="true">→</span></button>
      </div>
    </section>
  );
}

export function SummaryScreen({
  fixture,
  effectiveMappings,
  onOpenEvidence,
  onDownload,
  onReset,
  onNavigate,
}: {
  fixture: CaseFixture;
  effectiveMappings: EffectiveMapping[];
  onOpenEvidence: (questionId: string) => void;
  onDownload: () => void;
  onReset: () => void;
  onNavigate: (step: number) => void;
}) {
  return (
    <section className="content-screen" aria-labelledby="summary-title">
      <div className="summary-hero">
        <span className="summary-check" aria-hidden="true">✓</span>
        <div>
          <p className="eyebrow">Sample review complete</p>
          <h1 id="summary-title" tabIndex={-1} data-step-heading>Maya&apos;s question-by-question summary</h1>
          <p>Each result stays connected to its fictional source passage and RTI registration number.</p>
        </div>
      </div>
      <div className="summary-list">
        {effectiveMappings.map((mapping) => {
          const question = fixture.questions.find((item) => item.id === mapping.questionId)!;
          const evidence = fixture.evidence.find((item) => mapping.evidenceIds.includes(item.id));
          return (
            <article key={mapping.questionId}>
              <span className="large-number">{question.number}</span>
              <div className="summary-copy">
                <h2>{question.shortTitle}</h2>
                <p>{mapping.explanation}</p>
                <span className="field-label">Related RTI registration number</span>
                <code>{mapping.branchId}</code>
                {mapping.review
                  ? <small>Checked in this browser · Suggested result: {COVERAGE_COPY[mapping.proposedLabel]}</small>
                  : <small>Suggested from the fictional sample reply</small>}
                {mapping.review?.note ? <p className="reviewer-note"><strong>Your note:</strong> {mapping.review.note}</p> : null}
              </div>
              <StatusBadge code={mapping.effectiveLabel} />
              {evidence ? <button type="button" className="text-button" onClick={() => onOpenEvidence(question.id)}>Check evidence</button> : null}
            </article>
          );
        })}
      </div>
      <div className="nothing-filed"><span aria-hidden="true">i</span><div><strong>Nothing was filed or submitted</strong><p>This summary uses fictional sample records only. It does not recommend whether to file an appeal.</p></div></div>
      <div className="summary-actions">
        <button className="primary-button" type="button" onClick={onDownload}>Download reviewed summary <span aria-hidden="true">↓</span></button>
        <a className="secondary-button" href="https://rtionline.gov.in/faq.php" target="_blank" rel="noreferrer">Official RTI guidance <span className="new-tab-note">(opens in a new tab)</span></a>
        <button className="quiet-button" type="button" onClick={onReset}>Reset sample case</button>
      </div>
      <details className="working-details">
        <summary>What works here, and what is simulated?</summary>
        <div className="working-grid">
          <section><h2>Works in this prototype</h2><p>Navigation, evidence mapping, source viewing, your corrections, browser-only saving, and summary download.</p></section>
          <section><h2>Simulated for safety</h2><p>Maya, the request, offices, registration numbers, and reply documents. There is no government connection, upload, live filing, or legal decision.</p></section>
        </div>
      </details>
      <div className="screen-actions"><button className="secondary-button" type="button" onClick={() => onNavigate(6)}><span aria-hidden="true">←</span> Back to your check</button><span /></div>
    </section>
  );
}
