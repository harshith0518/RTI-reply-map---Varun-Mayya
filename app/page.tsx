'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  applyHumanReview,
  COVERAGE_COPY,
  COVERAGE_HELP,
  isCoverageCode,
  mapCase,
  type CoverageCode,
  type HumanReview,
} from '@/src/domain';
import { mayaFixture } from '@/src/fixtures';

const STORAGE_KEY = 'rti-reply-map-reviews-v1';
const FINAL_CASE_DATE = '2026-06-26';
const STEPS = ['Welcome', 'Questions', 'Branches', 'Reply Map', 'Evidence', 'Review', 'Summary'];

const statusIcon: Record<CoverageCode, string> = {
  answer_located: '✓',
  partially_addressed: '◐',
  no_matching_passage: '○',
  needs_human_review: '?',
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function StatusBadge({ code, prefix }: { code: CoverageCode; prefix?: string }) {
  return (
    <span className={`status-badge status-${code}`}>
      <span className="status-icon" aria-hidden="true">{statusIcon[code]}</span>
      {prefix ? `${prefix}: ` : ''}{COVERAGE_COPY[code]}
    </span>
  );
}

function PrototypeDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'disclosure disclosure-compact' : 'disclosure'}>
      <strong>Independent hackathon demo</strong>
      <span>Sample data only</span>
      <span>Not connected to a government website</span>
      <span>Nothing is submitted</span>
      <span>Not legal advice</span>
    </div>
  );
}

function StepProgress({ step, onNavigate }: { step: number; onNavigate: (step: number) => void }) {
  return (
    <nav className="step-progress" aria-label="Demo progress">
      <div className="step-progress-copy">
        <span>Step {step} of {STEPS.length}</span>
        <strong>{STEPS[step - 1]}</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={step}
        aria-label={`Step ${step} of ${STEPS.length}: ${STEPS[step - 1]}`}
      >
        <span style={{ width: `${(step / STEPS.length) * 100}%` }} />
      </div>
      <ol className="step-dots">
        {STEPS.map((label, index) => {
          const number = index + 1;
          return (
            <li key={label}>
              <button
                type="button"
                className={number === step ? 'active' : number < step ? 'complete' : ''}
                aria-current={number === step ? 'step' : undefined}
                aria-label={`Go to step ${number}: ${label}`}
                onClick={() => onNavigate(number)}
              >
                {number < step ? '✓' : number}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function NavButtons({
  back,
  next,
  nextLabel,
  onNavigate,
}: {
  back?: number;
  next?: number;
  nextLabel?: string;
  onNavigate: (step: number) => void;
}) {
  return (
    <div className="screen-actions">
      {back ? (
        <button className="secondary-button" type="button" onClick={() => onNavigate(back)}>
          <span aria-hidden="true">←</span> Back
        </button>
      ) : <span />}
      {next ? (
        <button className="primary-button" type="button" onClick={() => onNavigate(next)}>
          {nextLabel ?? 'Continue'} <span aria-hidden="true">→</span>
        </button>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedQuestionId, setSelectedQuestionId] = useState('maya-q3');
  const [reviews, setReviews] = useState<Record<string, HumanReview>>({});
  const [draftLabel, setDraftLabel] = useState<CoverageCode>('partially_addressed');
  const [draftNote, setDraftNote] = useState('');
  const [storageNotice, setStorageNotice] = useState('Saved only in this browser. Nothing is sent anywhere.');
  const [liveMessage, setLiveMessage] = useState('');

  const proposals = useMemo(() => mapCase(mayaFixture, FINAL_CASE_DATE), []);
  const proposalByQuestion = useMemo(
    () => Object.fromEntries(proposals.map((proposal) => [proposal.questionId, proposal])),
    [proposals],
  );
  const effectiveMappings = useMemo(
    () => proposals.map((proposal) => applyHumanReview(proposal, reviews[proposal.questionId])),
    [proposals, reviews],
  );
  const selectedQuestion = mayaFixture.questions.find((question) => question.id === selectedQuestionId)!;
  const selectedProposal = proposalByQuestion[selectedQuestionId];
  const selectedEvidence = mayaFixture.evidence.find((passage) =>
    selectedProposal.evidenceIds.includes(passage.id),
  );
  const selectedDocument = mayaFixture.documents.find(
    (document) => document.id === selectedEvidence?.documentId,
  );

  useEffect(() => {
    const readStepFromHash = () => {
      const match = window.location.hash.match(/^#step-(\d)$/);
      const next = Number(match?.[1] ?? 1);
      setStep(next >= 1 && next <= 7 ? next : 1);
    };
    readStepFromHash();
    window.addEventListener('hashchange', readStepFromHash);
    return () => window.removeEventListener('hashchange', readStepFromHash);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Record<string, Partial<HumanReview>>;
        const safe: Record<string, HumanReview> = {};
        for (const question of mayaFixture.questions) {
          const review = parsed[question.id];
          if (
            review?.questionId === question.id &&
            isCoverageCode(review.selectedLabel) &&
            typeof review.note === 'string' &&
            typeof review.reviewedAt === 'string'
          ) {
            safe[question.id] = review as HumanReview;
          }
        }
        setReviews(safe);
        setDraftLabel(safe['maya-q3']?.selectedLabel ?? proposalByQuestion['maya-q3'].proposedLabel);
        setDraftNote(safe['maya-q3']?.note ?? '');
      } catch {
        setStorageNotice('Browser saving is unavailable. You can still complete this demo.');
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [proposalByQuestion]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = window.setTimeout(() => {
      document.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [step]);

  function navigate(next: number) {
    window.location.assign(`#step-${next}`);
    setStep(next);
  }

  function selectQuestion(questionId: string) {
    const existing = reviews[questionId];
    setSelectedQuestionId(questionId);
    setDraftLabel(existing?.selectedLabel ?? proposalByQuestion[questionId].proposedLabel);
    setDraftNote(existing?.note ?? '');
  }

  function openEvidence(questionId: string) {
    selectQuestion(questionId);
    navigate(5);
  }

  function saveReview() {
    const review: HumanReview = {
      questionId: selectedQuestionId,
      selectedLabel: draftLabel,
      note: draftNote.trim(),
      reviewedAt: new Date().toISOString(),
    };
    const nextReviews = { ...reviews, [selectedQuestionId]: review };
    setReviews(nextReviews);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReviews));
      setStorageNotice('Review saved in this browser. Nothing was sent anywhere.');
    } catch {
      setStorageNotice('Review kept for this session. Browser saving is unavailable.');
    }
    setLiveMessage(`Review saved. ${COVERAGE_COPY[draftLabel]} is now used in the summary.`);
    navigate(7);
  }

  function resetDemo() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // The in-memory reset still works when browser storage is unavailable.
    }
    setReviews({});
    selectQuestion('maya-q3');
    setDraftLabel(proposalByQuestion['maya-q3'].proposedLabel);
    setDraftNote('');
    setLiveMessage('Sample case reset to its original suggested labels.');
    navigate(1);
  }

  function downloadSummary() {
    const rows = effectiveMappings.map((mapping) => {
      const question = mayaFixture.questions.find((item) => item.id === mapping.questionId)!;
      const evidence = mayaFixture.evidence.find((item) => mapping.evidenceIds.includes(item.id));
      const document = mayaFixture.documents.find((item) => item.id === evidence?.documentId);
      return `
        <section>
          <p class="kicker">Question ${question.number}</p>
          <h2>${escapeHtml(question.shortTitle)} — ${escapeHtml(COVERAGE_COPY[mapping.effectiveLabel])}</h2>
          <p>${escapeHtml(question.text)}</p>
          <dl>
            <dt>Suggested label</dt><dd>${escapeHtml(COVERAGE_COPY[mapping.proposedLabel])}</dd>
            <dt>Reviewed label</dt><dd>${escapeHtml(COVERAGE_COPY[mapping.effectiveLabel])}</dd>
            <dt>Registration branch</dt><dd>${escapeHtml(mapping.branchId)}</dd>
            <dt>Reply file</dt><dd>${escapeHtml(document?.fileName ?? 'No reply document')}</dd>
            <dt>Location</dt><dd>${escapeHtml(evidence?.location.label ?? 'No matching passage')}</dd>
          </dl>
          ${evidence ? `<blockquote>${escapeHtml(evidence.quote)}</blockquote>` : ''}
          ${mapping.review?.note ? `<p><strong>Reviewer note:</strong> ${escapeHtml(mapping.review.note)}</p>` : ''}
        </section>`;
    }).join('');

    const html = `<!doctype html><html lang="en-IN"><meta charset="utf-8"><title>DEMO — Maya's RTI Reply Map</title><style>body{font-family:Arial,sans-serif;max-width:860px;margin:40px auto;padding:0 22px;color:#17352f;line-height:1.55}header{border:3px solid #17352f;padding:22px;margin-bottom:28px}header strong{display:block;color:#a14e00;font-size:14px;letter-spacing:.08em}section{border-top:1px solid #ccd9d2;padding:24px 0}h1{margin:.2rem 0}.kicker,dt{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#61736e}dl{display:grid;grid-template-columns:180px 1fr;gap:8px}dd{margin:0;font-weight:bold}blockquote{margin:18px 0;padding:16px;border-left:4px solid #1d7355;background:#eef7f1}@media(max-width:600px){dl{grid-template-columns:1fr;gap:2px}dd{margin-bottom:10px}}</style><body><header><strong>SYNTHETIC DEMONSTRATION — NOT AN OFFICIAL RECORD</strong><h1>RTI Reply Map</h1><p>Maya's fictional fellowship selection case. Nothing was filed or sent to a government office. This is not legal advice.</p></header>${rows}<footer><p>Generated by an independent hackathon prototype using sample data only.</p></footer></body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DEMO-maya-reviewed-reply-map.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setLiveMessage('Reviewed sample summary downloaded.');
  }

  function renderWelcome() {
    return (
      <section className="welcome-grid" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <p className="eyebrow">A clearer way to read related RTI replies</p>
          <h1 id="welcome-title" tabIndex={-1} data-step-heading>One RTI request. Three replies. One clear map.</h1>
          <p className="hero-text">
            See which reply passage answers each original question, which registration branch it belongs to,
            and what still needs your review.
          </p>
          <div className="hero-actions">
            <button className="primary-button large-button" type="button" onClick={() => navigate(2)}>
              View Maya&apos;s sample case <span aria-hidden="true">→</span>
            </button>
            <span className="time-note">No login · About 2 minutes</span>
          </div>
          <ul className="trust-list" aria-label="Prototype safeguards">
            <li><span aria-hidden="true">✓</span> No personal information</li>
            <li><span aria-hidden="true">✓</span> No government connection</li>
            <li><span aria-hidden="true">✓</span> Nothing is filed</li>
          </ul>
        </div>

        <aside className="map-preview" aria-label="Example reply map preview">
          <div className="preview-head">
            <div><p>Sample case</p><strong>Maya&apos;s fellowship records</strong></div>
            <span>3 questions</span>
          </div>
          {effectiveMappings.map((mapping) => {
            const question = mayaFixture.questions.find((item) => item.id === mapping.questionId)!;
            return (
              <div className={`question-preview status-card-${mapping.effectiveLabel}`} key={mapping.questionId}>
                <span className="question-number">{question.number}</span>
                <div><strong>{question.shortTitle}</strong><small>{mapping.branchId.split('/').slice(-1)[0] === '00421' ? 'Root reply' : `Related branch /${mapping.branchId.split('/').at(-1)}`}</small></div>
                <StatusBadge code={mapping.effectiveLabel} />
              </div>
            );
          })}
          <p className="preview-foot">Every result stays connected to its source passage.</p>
        </aside>
      </section>
    );
  }

  function renderQuestions() {
    return (
      <section className="content-screen" aria-labelledby="questions-title">
        <div className="screen-heading">
          <p className="eyebrow">Maya&apos;s fictional request</p>
          <h1 id="questions-title" tabIndex={-1} data-step-heading>What did Maya ask for?</h1>
          <p>Maya requested three existing records about a fictional fellowship selection. The question numbers stay the same throughout the map.</p>
        </div>
        <div className="questions-layout">
          <ol className="question-list">
            {mayaFixture.questions.map((question) => (
              <li key={question.id}>
                <span className="large-number">{question.number}</span>
                <div><strong>{question.shortTitle}</strong><p>{question.text}</p></div>
              </li>
            ))}
          </ol>
          <aside className="plain-note">
            <span className="note-symbol" aria-hidden="true">i</span>
            <div>
              <strong>RTI asks for existing information</strong>
              <p>Maya is asking for records used in the selection—not asking the RTI office to change her result.</p>
            </div>
          </aside>
        </div>
        <NavButtons back={1} next={3} nextLabel="See where the questions went" onNavigate={navigate} />
      </section>
    );
  }

  function renderBranches() {
    return (
      <section className="content-screen" aria-labelledby="branches-title">
        <div className="screen-heading">
          <p className="eyebrow">Related registration numbers</p>
          <h1 id="branches-title" tabIndex={-1} data-step-heading>One request, three parallel branches</h1>
          <p>Different sections held different records, so Maya&apos;s application received three related fictional registration numbers.</p>
        </div>
        <div className="branch-map">
          <div className="application-node">
            <span>Original application</span>
            <strong>3 questions · Filed 2 Jun 2026</strong>
          </div>
          <div className="parallel-connector" aria-label="Forwarded in parallel on 4 June 2026">
            <span>Forwarded in parallel · 4 Jun</span>
          </div>
          <div className="branch-grid">
            {mayaFixture.branches.map((branch, index) => (
              <article className="branch-card" key={branch.id}>
                <div className="branch-top"><span>Question {index + 1}</span><b>Reply received</b></div>
                <h2>{branch.office}</h2>
                <code>{branch.id}</code>
                <p>{branch.status}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="caution-note"><strong>Important</strong><span>A branch or transfer notice shows where a question went. It is not the substantive answer.</span></aside>
        <NavButtons back={2} next={4} nextLabel="View Maya's Reply Map" onNavigate={navigate} />
      </section>
    );
  }

  function renderReplyMap() {
    return (
      <section className="content-screen" aria-labelledby="map-title">
        <div className="screen-heading map-heading">
          <div>
            <p className="eyebrow">Question-by-question coverage</p>
            <h1 id="map-title" tabIndex={-1} data-step-heading>Maya&apos;s Reply Map</h1>
            <p>Open any result to inspect the exact sample passage, reply file, page and registration branch.</p>
          </div>
          <div className="map-total"><strong>2</strong><span>answers located</span><b>1 needs review</b></div>
        </div>
        <div className="mapping-list">
          {effectiveMappings.map((mapping) => {
            const question = mayaFixture.questions.find((item) => item.id === mapping.questionId)!;
            const evidence = mayaFixture.evidence.find((item) => mapping.evidenceIds.includes(item.id));
            const document = mayaFixture.documents.find((item) => item.id === evidence?.documentId);
            return (
              <article className={`mapping-card mapping-${mapping.effectiveLabel}`} key={mapping.questionId}>
                <div className="mapping-question"><span>Q{question.number}</span><div><h2>{question.shortTitle}</h2><p>{question.text}</p></div></div>
                <div className="mapping-result">
                  <StatusBadge code={mapping.effectiveLabel} />
                  <p>{mapping.explanation}</p>
                  <dl><div><dt>Reply</dt><dd>{document?.fileName}</dd></div><div><dt>Branch</dt><dd>{mapping.branchId}</dd></div></dl>
                  <button className="text-button" type="button" onClick={() => openEvidence(question.id)}>
                    View exact evidence <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <details className="status-help">
          <summary>What do these labels mean?</summary>
          <div>{Object.entries(COVERAGE_COPY).map(([code, label]) => <p key={code}><strong>{label}</strong><span>{COVERAGE_HELP[code as CoverageCode]}</span></p>)}</div>
        </details>
        <NavButtons back={3} next={5} nextLabel="Review Question 3 evidence" onNavigate={(next) => { if (next === 5) selectQuestion('maya-q3'); navigate(next); }} />
      </section>
    );
  }

  function renderEvidence() {
    return (
      <section className="content-screen" aria-labelledby="evidence-title">
        <div className="screen-heading evidence-heading">
          <div><p className="eyebrow">Evidence comparison</p><h1 id="evidence-title" tabIndex={-1} data-step-heading>Why this label?</h1></div>
          <div className="question-switcher" aria-label="Choose a question">
            {mayaFixture.questions.map((question) => <button key={question.id} type="button" className={selectedQuestionId === question.id ? 'active' : ''} aria-pressed={selectedQuestionId === question.id} onClick={() => setSelectedQuestionId(question.id)}>Q{question.number}</button>)}
          </div>
        </div>
        <div className="evidence-grid">
          <article className="asked-card">
            <span className="card-label">Maya asked for</span>
            <h2>{selectedQuestion.shortTitle}</h2>
            <p>{selectedQuestion.text}</p>
          </article>
          <article className="passage-card">
            <div className="passage-head"><span className="card-label">Passage located</span><StatusBadge code={selectedProposal.proposedLabel} /></div>
            {selectedEvidence ? <blockquote>“{selectedEvidence.quote}”</blockquote> : <p>No matching passage was located.</p>}
            <dl className="evidence-meta">
              <div><dt>Sample reply</dt><dd>{selectedDocument?.fileName ?? 'No reply document'}</dd></div>
              <div><dt>Location</dt><dd>{selectedEvidence?.location.label ?? 'Not available'}</dd></div>
              <div><dt>Registration branch</dt><dd>{selectedProposal.branchId}</dd></div>
              <div><dt>Confidence</dt><dd className="capitalize">{selectedProposal.confidence}</dd></div>
            </dl>
            {selectedDocument?.fileName ? <a className="document-link" href={`/replies/${selectedDocument.fileName}`} target="_blank" rel="noreferrer">Open watermarked sample reply <span aria-hidden="true">↗</span></a> : null}
          </article>
        </div>
        <article className="explanation-card">
          <span className="explanation-symbol" aria-hidden="true">{statusIcon[selectedProposal.proposedLabel]}</span>
          <div><strong>Why “{COVERAGE_COPY[selectedProposal.proposedLabel]}” was suggested</strong><p>{selectedProposal.explanation}</p>{selectedEvidence?.missingDetail ? <div className="missing-detail"><b>Not located</b><span>{selectedEvidence.missingDetail}</span></div> : null}</div>
        </article>
        <p className="legal-line">This compares a question with sample documents. It does not decide whether an office followed the RTI Act.</p>
        <NavButtons back={4} next={6} nextLabel="Check this result" onNavigate={navigate} />
      </section>
    );
  }

  function renderReview() {
    return (
      <section className="content-screen narrow-screen" aria-labelledby="review-title">
        <div className="screen-heading">
          <p className="eyebrow">Human review</p>
          <h1 id="review-title" tabIndex={-1} data-step-heading>Please check Question {selectedQuestion.number}</h1>
          <p>You are in control. Your choice replaces the suggested label in this sample summary without changing the underlying source passage.</p>
        </div>
        <div className="suggestion-line"><span>Suggested result</span><StatusBadge code={selectedProposal.proposedLabel} /></div>
        <fieldset className="review-options">
          <legend>Which label best matches the sample reply?</legend>
          {(Object.keys(COVERAGE_COPY) as CoverageCode[]).map((code) => (
            <label className={draftLabel === code ? 'selected' : ''} key={code}>
              <input type="radio" name="review-label" value={code} checked={draftLabel === code} onChange={() => setDraftLabel(code)} />
              <span className={`review-radio status-${code}`} aria-hidden="true">{statusIcon[code]}</span>
              <span><strong>{COVERAGE_COPY[code]}</strong><small>{COVERAGE_HELP[code]}</small></span>
            </label>
          ))}
        </fieldset>
        <label className="note-field" htmlFor="review-note"><span>Add a note <small>Optional</small></span><textarea id="review-note" value={draftNote} maxLength={300} onChange={(event) => setDraftNote(event.target.value)} placeholder="Write why you chose this label." /><small>{draftNote.length}/300 characters</small></label>
        <div className="privacy-note"><strong>Private on this device</strong><span>{storageNotice}</span></div>
        <div className="screen-actions"><button className="secondary-button" type="button" onClick={() => navigate(5)}><span aria-hidden="true">←</span> Back</button><button className="primary-button" type="button" onClick={saveReview}>Save and view summary <span aria-hidden="true">→</span></button></div>
      </section>
    );
  }

  function renderSummary() {
    return (
      <section className="content-screen" aria-labelledby="summary-title">
        <div className="summary-hero">
          <span className="summary-check" aria-hidden="true">✓</span>
          <div><p className="eyebrow">Review complete</p><h1 id="summary-title" tabIndex={-1} data-step-heading>Maya&apos;s reviewed summary</h1><p>Here is what the three fictional reply documents show, question by question.</p></div>
        </div>
        <div className="summary-list">
          {effectiveMappings.map((mapping) => {
            const question = mayaFixture.questions.find((item) => item.id === mapping.questionId)!;
            const evidence = mayaFixture.evidence.find((item) => mapping.evidenceIds.includes(item.id));
            return <article key={mapping.questionId}><span className="large-number">{question.number}</span><div className="summary-copy"><h2>{question.shortTitle}</h2><p>{mapping.explanation}</p><code>{mapping.branchId}</code>{mapping.review ? <small>Reviewed in this browser · Suggested: {COVERAGE_COPY[mapping.proposedLabel]}</small> : <small>Precomputed suggestion for this synthetic demo</small>}{mapping.review?.note ? <p className="reviewer-note"><strong>Your note:</strong> {mapping.review.note}</p> : null}</div><StatusBadge code={mapping.effectiveLabel} />{evidence ? <button type="button" className="text-button" onClick={() => openEvidence(question.id)}>Evidence</button> : null}</article>;
          })}
        </div>
        <div className="nothing-filed"><span aria-hidden="true">i</span><div><strong>Nothing was filed or submitted</strong><p>This summary is based only on fictional sample records. It does not recommend whether to file an appeal.</p></div></div>
        <div className="summary-actions">
          <button className="primary-button" type="button" onClick={downloadSummary}>Download reviewed summary <span aria-hidden="true">↓</span></button>
          <a className="secondary-button" href="https://rtionline.gov.in/faq.php" target="_blank" rel="noreferrer">Read official RTI guidance <span aria-hidden="true">↗</span></a>
          <button className="quiet-button" type="button" onClick={resetDemo}>Reset sample case</button>
        </div>
        <details className="working-details">
          <summary>What works and what is simulated?</summary>
          <div className="working-grid"><section><h2>Working here</h2><p>Navigation, question-to-reply evidence mapping, exact source viewing, human corrections, browser-only saving and summary download.</p></section><section><h2>Simulated for safety</h2><p>Maya, her application, offices, registration numbers and reply documents. There is no government connection, live filing, upload or legal decision.</p></section></div>
        </details>
        <div className="screen-actions"><button className="secondary-button" type="button" onClick={() => navigate(6)}><span aria-hidden="true">←</span> Back to review</button><span /></div>
      </section>
    );
  }

  return (
    <main id="main-content" className={`site-shell ${step === 1 ? 'welcome-shell' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="topbar">
        <button className="brand" type="button" onClick={() => navigate(1)} aria-label="RTI Reply Map home">
          <span className="brand-mark" aria-hidden="true">RM</span>
          <span><strong>RTI Reply Map</strong><small>Independent hackathon prototype</small></span>
        </button>
        <span className="demo-pill">Sample data only</span>
      </header>
      <PrototypeDisclosure compact />
      {step > 1 ? <StepProgress step={step} onNavigate={navigate} /> : null}
      <div className="page-area">
        {step === 1 && renderWelcome()}
        {step === 2 && renderQuestions()}
        {step === 3 && renderBranches()}
        {step === 4 && renderReplyMap()}
        {step === 5 && renderEvidence()}
        {step === 6 && renderReview()}
        {step === 7 && renderSummary()}
      </div>
      <footer className="site-footer"><PrototypeDisclosure /><p>Built as an independent prototype for safer, clearer RTI reply understanding.</p></footer>
      <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </main>
  );
}
