'use client';

import { useId, useMemo, useState } from 'react';
import type { ReplyMapping, RTICaseData } from '@/src/case-model';
import {
  buildActionDraft,
  getQuestionAction,
  type SatisfactionChoice,
} from '@/src/question-actions';

function safeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'rti-next-step';
}

export function QuestionActionPanel({
  data,
  mapping,
  choice,
  onChoice,
  onLiveMessage,
}: {
  data: RTICaseData;
  mapping: ReplyMapping;
  choice?: SatisfactionChoice;
  onChoice: (choice: SatisfactionChoice) => void;
  onLiveMessage: (message: string) => void;
}) {
  const fieldId = useId();
  const guidance = useMemo(() => getQuestionAction(data, mapping), [data, mapping]);
  const [missingNote, setMissingNote] = useState(guidance.defaultMissingNote);
  const draft = buildActionDraft(data, mapping, guidance, missingNote);
  const question = data.questions.find((item) => item.id === mapping.questionId);

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      onLiveMessage(`Question ${question?.number ?? ''} next-step note copied.`);
    } catch {
      onLiveMessage('Copy is unavailable. Select the draft and copy it manually.');
    }
  }

  function downloadDraft() {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFileName(data.caseId)}-q${question?.number ?? 'x'}-next-step.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    onLiveMessage(`Question ${question?.number ?? ''} next-step note downloaded.`);
  }

  return (
    <section className="question-action" aria-labelledby={`${fieldId}-title`}>
      <fieldset className="satisfaction-check">
        <legend id={`${fieldId}-title`}>Did this give you the information you needed?</legend>
        <p>Your answer, not a status chosen by the website.</p>
        <div className="satisfaction-options">
          <label className={choice === 'satisfied' ? 'selected' : ''}>
            <input
              type="radio"
              name={`${fieldId}-satisfaction`}
              value="satisfied"
              checked={choice === 'satisfied'}
              onChange={() => onChoice('satisfied')}
            />
            <span><strong>Yes</strong><small>This answers my question</small></span>
          </label>
          <label className={choice === 'needs_action' ? 'selected needs-action' : ''}>
            <input
              type="radio"
              name={`${fieldId}-satisfaction`}
              value="needs_action"
              checked={choice === 'needs_action'}
              onChange={() => onChoice('needs_action')}
            />
            <span><strong>No</strong><small>I still need information</small></span>
          </label>
        </div>
      </fieldset>

      {choice === 'satisfied' ? (
        <p className="satisfaction-confirmation" role="status"><span aria-hidden="true">✓</span> Marked answered in this tab.</p>
      ) : null}

      {choice === 'needs_action' ? (
        <section className={`next-action-card action-${guidance.kind}`} aria-labelledby={`${fieldId}-action-title`}>
          <header>
            <p>Next step for this branch</p>
            <h4 id={`${fieldId}-action-title`}>{guidance.title}</h4>
            <span>{guidance.summary}</span>
          </header>

          <dl className="action-facts">
            <div><dt>Registration</dt><dd><code>{guidance.registrationNumber}</code></dd></div>
            {guidance.appealNumber ? <div><dt>First appeal</dt><dd><code>{guidance.appealNumber}</code></dd></div> : null}
            <div><dt>Record checked</dt><dd>{guidance.documentLabel}</dd></div>
          </dl>

          <p className="action-timing"><strong>Timing:</strong> {guidance.timing}</p>
          <ol className="action-steps">
            {guidance.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>

          <label className="missing-note-field">
            <span>What information is still missing?</span>
            <textarea value={missingNote} onChange={(event) => setMissingNote(event.target.value)} rows={3} />
          </label>

          <label className="draft-preview">
            <span>{guidance.routeLabel}</span>
            <textarea value={draft} readOnly rows={10} />
          </label>

          <div className="action-buttons">
            <button type="button" className="primary-button compact-button" onClick={copyDraft}>Copy note</button>
            <button type="button" className="secondary-button compact-button" onClick={downloadDraft}>Download .txt</button>
            {guidance.links.map((link) => (
              <a key={link.href} className="official-action-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label} <span>(official · new tab)</span>
              </a>
            ))}
          </div>

          <p className="action-boundary"><strong>Prepared only.</strong> This site does not calculate a legal deadline, choose a remedy, file an appeal or send anything. Central and State routes differ.</p>
        </section>
      ) : null}
    </section>
  );
}
