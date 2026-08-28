'use client';

import { COVERAGE_COPY, type CoverageCode } from '@/src/domain';

export const STEPS = ['Welcome', 'Questions', 'Related replies', 'Reply Map', 'Evidence', 'Your check', 'Summary'];

export const STATUS_ICON: Record<CoverageCode, string> = {
  answer_located: '✓',
  partially_addressed: '◐',
  no_matching_passage: '○',
  needs_human_review: '?',
};

export function StatusBadge({ code, prefix }: { code: CoverageCode; prefix?: string }) {
  return (
    <span className={`status-badge status-${code}`}>
      <span className="status-icon" aria-hidden="true">{STATUS_ICON[code]}</span>
      {prefix ? `${prefix}: ` : ''}{COVERAGE_COPY[code]}
    </span>
  );
}

export function PrototypeDisclosure() {
  return (
    <div className="disclosure">
      <strong>Independent hackathon prototype</strong>
      <span>Uses fictional sample records</span>
      <span>Not connected to a government website</span>
      <span>Nothing is submitted</span>
      <span>Not legal advice</span>
    </div>
  );
}

export function StepProgress({ step, onNavigate }: { step: number; onNavigate: (step: number) => void }) {
  const stepButtons = STEPS.map((label, index) => {
    const number = index + 1;
    return (
      <button
        type="button"
        className={number === step ? 'active' : number < step ? 'complete' : ''}
        aria-current={number === step ? 'step' : undefined}
        aria-label={`Go to step ${number}: ${label}`}
        onClick={() => onNavigate(number)}
        key={label}
      >
        <span aria-hidden="true">{number < step ? '✓' : number}</span>
        <span className="step-label">{label}</span>
      </button>
    );
  });

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
        {stepButtons.map((button, index) => <li key={STEPS[index]}>{button}</li>)}
      </ol>
      <details className="step-menu" key={step}>
        <summary>All steps</summary>
        <div>{stepButtons}</div>
      </details>
    </nav>
  );
}

export function NavButtons({
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
