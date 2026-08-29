'use client';

import { useId, useState, type ChangeEvent } from 'react';
import { CASE_JSON_TEMPLATE, CUSTOM_CASE_PROMPT } from '@/src/case-prompt';
import { MAX_CASE_JSON_BYTES, parseCaseJson, type CaseValidationResult, type RTICaseData } from '@/src/case-model';

export function ImportCasePanel({
  importedCase,
  onLoadCase,
  onClearCase,
}: {
  importedCase?: RTICaseData;
  onLoadCase: (data: RTICaseData) => void;
  onClearCase: () => void;
}) {
  const inputId = useId();
  const [jsonText, setJsonText] = useState('');
  const [validation, setValidation] = useState<CaseValidationResult>();
  const [candidate, setCandidate] = useState<RTICaseData>();
  const [message, setMessage] = useState('');

  function updateJson(value: string) {
    setJsonText(value);
    setValidation(undefined);
    setCandidate(undefined);
    setMessage('');
  }

  function checkJson() {
    const result = parseCaseJson(jsonText);
    setValidation(result);
    setCandidate(result.ok ? result.data : undefined);
    setMessage(result.ok ? `JSON checked. ${result.data?.questions.length ?? 0} questions and ${result.data?.nodes.length ?? 0} case events are ready.` : 'Correct the JSON before loading it.');
  }

  async function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_CASE_JSON_BYTES) {
      setValidation({ ok: false, errors: ['This file is larger than 512 KB. Remove embedded content or split the case.'] });
      setCandidate(undefined);
      setMessage('The selected file is too large.');
      return;
    }
    try {
      updateJson(await file.text());
      setMessage(`${file.name} is ready to check. It has not left this browser.`);
    } catch {
      setValidation({ ok: false, errors: ['The selected file could not be read.'] });
      setMessage('The selected file could not be read.');
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(CUSTOM_CASE_PROMPT);
      setMessage('Prompt copied. Add only redacted RTI questions and records in ChatGPT.');
    } catch {
      setMessage('Copy is unavailable. Select the prompt and copy it manually.');
    }
  }

  function loadCandidate() {
    if (!candidate) return;
    onLoadCase(candidate);
    setMessage(`${candidate.title} is loaded locally. This site did not upload it.`);
  }

  return (
    <section className="import-section" id="use-your-case" aria-labelledby="import-title">
      <div className="section-heading import-heading">
        <div><p className="eyebrow">Bring your own plot twist</p><h2 id="import-title">Your RTI chaos, now with a map.</h2></div>
        <p>ChatGPT prepares the JSON separately. This static site only checks and renders it in your tab.</p>
      </div>

      <ol className="custom-flow" aria-label="Custom case steps">
        <li><span>1</span><div><strong>Copy prompt</strong><small>Add redacted questions and records in ChatGPT.</small></div></li>
        <li><span>2</span><div><strong>Copy the JSON</strong><small>ChatGPT returns one JSON object.</small></div></li>
        <li><span>3</span><div><strong>Paste or upload</strong><small>Check it, then load the tree and Reply Map.</small></div></li>
      </ol>

      <div className="import-grid">
        <article className="prompt-card">
          <span className="card-step">Step 1 · Prepare JSON</span>
          <h3>Give ChatGPT the boring formatting job.</h3>
          <div className="privacy-warning"><strong>Redact first</strong><p>Remove names, contact details, identity numbers, signatures, bank details and other personal information.</p></div>
          <p className="external-ai-note"><strong>Separate service:</strong> ChatGPT is not called by this website. Review its privacy terms before sharing anything.</p>
          <button className="primary-button compact-button prompt-copy-button" type="button" onClick={copyPrompt}>Copy ChatGPT prompt</button>
          <details className="prompt-preview">
            <summary>View the full prompt · optional</summary>
            <textarea aria-label="Full ChatGPT prompt" readOnly value={CUSTOM_CASE_PROMPT} rows={11} />
          </details>
        </article>

        <article className="json-card">
          <span className="card-step">Step 2</span>
          <h3>Drop the JSON. Watch the case organise itself.</h3>
          <p className="verification-note"><strong>Checks structure and links, not source documents.</strong> Verify every passage, page, date and registration yourself.</p>
          <label className="file-control" htmlFor={inputId}><span>Choose a JSON file</span><small>Stays in this tab · maximum 512 KB</small></label>
          <input id={inputId} className="visually-hidden-file" type="file" accept="application/json,.json" onChange={chooseFile} />
          <label className="json-editor">
            <span>Case JSON</span>
            <textarea value={jsonText} onChange={(event) => updateJson(event.target.value)} placeholder="Paste one JSON object here…" spellCheck={false} rows={13} />
          </label>
          <div className="button-row">
            <button className="secondary-button compact-button" type="button" onClick={() => updateJson(JSON.stringify(CASE_JSON_TEMPLATE, null, 2))}>Use sample JSON</button>
            <button className="secondary-button compact-button" type="button" onClick={checkJson}>Check JSON</button>
            <button className="primary-button compact-button" type="button" onClick={loadCandidate} disabled={!candidate}>Load case</button>
          </div>
          {validation ? (
            <div className={validation.ok ? 'validation-box valid' : 'validation-box invalid'} role={validation.ok ? 'status' : 'alert'}>
              <strong>{validation.ok ? 'JSON is ready' : `${validation.errors.length} issue${validation.errors.length === 1 ? '' : 's'} found`}</strong>
              {validation.ok ? <p>Structure is valid. Source facts still need human verification.</p> : <>
                {validation.errors.length > 8 ? <p>Showing the first 8 of {validation.errors.length} issues.</p> : null}
                <ul>{validation.errors.slice(0, 8).map((error) => <li key={error}>{error}</li>)}</ul>
              </>}
            </div>
          ) : null}
          {importedCase ? (
            <div className="loaded-case"><div><small>Loaded locally</small><strong>{importedCase.title}</strong></div><button type="button" onClick={onClearCase}>Clear imported case</button></div>
          ) : null}
        </article>
      </div>
      <div className="live-region" aria-live="polite" aria-atomic="true">{message}</div>
    </section>
  );
}
