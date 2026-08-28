'use client';

import type { CaseFixture, EffectiveMapping } from '@/src/domain';
import { NavButtons, StatusBadge } from '../shared';

function rootRegistrationId(fixture: CaseFixture) {
  return fixture.branches.reduce((root, branch) => (
    branch.id.split('/').length < root.split('/').length ? branch.id : root
  ), fixture.branches[0].id);
}

export function WelcomeScreen({
  fixture,
  effectiveMappings,
  onNavigate,
}: {
  fixture: CaseFixture;
  effectiveMappings: EffectiveMapping[];
  onNavigate: (step: number) => void;
}) {
  const rootId = rootRegistrationId(fixture);

  return (
    <section className="welcome-grid" aria-labelledby="welcome-title">
      <div className="welcome-copy">
        <p className="eyebrow">Understand several related RTI replies in one place</p>
        <h1 id="welcome-title" tabIndex={-1} data-step-heading>One request. Three replies. A clear answer for every question.</h1>
        <p className="hero-text">
          Match each original question to the reply passage that addresses it, keep the related RTI registration number,
          and check anything that may still be incomplete.
        </p>
        <div className="hero-actions">
          <button className="primary-button large-button" type="button" onClick={() => onNavigate(2)}>
            Open Maya&apos;s sample case <span aria-hidden="true">→</span>
          </button>
          <span className="time-note">No sign-in · About 2 minutes</span>
        </div>
        <ul className="trust-list" aria-label="Prototype safeguards">
          <li><span aria-hidden="true">✓</span> Fictional sample records</li>
          <li><span aria-hidden="true">✓</span> Nothing is sent or filed</li>
          <li><span aria-hidden="true">✓</span> Every result links to evidence</li>
        </ul>
      </div>

      <aside className="map-preview" aria-label="Example reply map preview">
        <div className="preview-head">
          <div><p>Sample case</p><strong>Maya&apos;s fellowship records</strong></div>
          <span>3 questions</span>
        </div>
        {effectiveMappings.map((mapping) => {
          const question = fixture.questions.find((item) => item.id === mapping.questionId)!;
          const registrationLabel = mapping.branchId === rootId
            ? 'Original registration'
            : `Related registration /${mapping.branchId.split('/').at(-1)}`;
          return (
            <div className={`question-preview status-card-${mapping.effectiveLabel}`} key={mapping.questionId}>
              <span className="question-number">{question.number}</span>
              <div><strong>{question.shortTitle}</strong><small>{registrationLabel}</small></div>
              <StatusBadge code={mapping.effectiveLabel} />
            </div>
          );
        })}
        <p className="preview-foot">Question → reply passage → RTI registration number</p>
      </aside>
    </section>
  );
}

export function QuestionsScreen({ fixture, onNavigate }: { fixture: CaseFixture; onNavigate: (step: number) => void }) {
  return (
    <section className="content-screen" aria-labelledby="questions-title">
      <div className="screen-heading">
        <p className="eyebrow">Maya&apos;s fictional request</p>
        <h1 id="questions-title" tabIndex={-1} data-step-heading>What information did Maya ask for?</h1>
        <p>Her three question numbers stay unchanged throughout the map, so it is easy to compare the request with each reply.</p>
      </div>
      <div className="questions-layout">
        <ol className="question-list">
          {fixture.questions.map((question) => (
            <li key={question.id}>
              <span className="large-number">{question.number}</span>
              <div><strong>{question.shortTitle}</strong><p>{question.text}</p></div>
            </li>
          ))}
        </ol>
        <aside className="plain-note">
          <span className="note-symbol" aria-hidden="true">i</span>
          <div>
            <strong>An RTI request asks for existing information</strong>
            <p>Maya is asking for records used in the selection. She is not asking this tool or the RTI office to change her result.</p>
          </div>
        </aside>
      </div>
      <NavButtons back={1} next={3} nextLabel="See the related replies" onNavigate={onNavigate} />
    </section>
  );
}

export function BranchesScreen({ fixture, onNavigate }: { fixture: CaseFixture; onNavigate: (step: number) => void }) {
  return (
    <section className="content-screen" aria-labelledby="branches-title">
      <div className="screen-heading">
        <p className="eyebrow">Related RTI registration numbers</p>
        <h1 id="branches-title" tabIndex={-1} data-step-heading>One request produced three related replies</h1>
        <p>Different sections held different records. Each section replied under a separate fictional RTI registration number.</p>
      </div>
      <div className="branch-map">
        <div className="application-node">
          <span>Original application</span>
          <strong>3 questions · Filed 2 Jun 2026</strong>
        </div>
        <div className="parallel-connector" aria-label="Forwarded in parallel on 4 June 2026">
          <span>Sent to three sections · 4 Jun</span>
        </div>
        <div className="branch-grid">
          {fixture.branches.map((branch) => {
            const numbers = branch.questionIds
              .map((questionId) => fixture.questions.find((question) => question.id === questionId)?.number)
              .filter((number): number is number => number !== undefined);
            return (
              <article className="branch-card" key={branch.id}>
                <div className="branch-top"><span>Question {numbers.join(', ')}</span><b>Reply available</b></div>
                <h2>{branch.office}</h2>
                <span className="field-label">RTI registration number</span>
                <code>{branch.id}</code>
                <p>{branch.status}</p>
              </article>
            );
          })}
        </div>
      </div>
      <aside className="caution-note"><strong>Keep the distinction clear</strong><span>A transfer or routing notice shows where a question went. The answer must come from the substantive reply.</span></aside>
      <NavButtons back={2} next={4} nextLabel="View the Reply Map" onNavigate={onNavigate} />
    </section>
  );
}
