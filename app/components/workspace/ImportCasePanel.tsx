'use client';

import { useId, useState, type ChangeEvent } from 'react';
import { CASE_JSON_TEMPLATE, CUSTOM_CASE_PROMPT } from '@/src/case-prompt';
import {
  MAX_CASE_JSON_BYTES,
  parseCaseJson,
  type CaseValidationResult,
  type RTICaseData,
} from '@/src/case-model';

function downloadText(fileName: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

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
    setCandidate(result.ok && result.data ? { ...result.data, source: 'custom' } : undefined);
    setMessage(result.ok ? `JSON checked. ${result.data?.questions.length ?? 0} questions and ${result.data?.nodes.length ?? 0} case events are ready to load.` : 'JSON needs correction before it can be loaded.');
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
      setMessage('ChatGPT prompt copied. Redact personal details before sharing any record.');
    } catch {
      setMessage('Copy is unavailable. Select the prompt below and copy it manually.');
    }
  }

  function loadCandidate() {
    if (!candidate) return;
    onLoadCase(candidate);
    setMessage(`${candidate.title} is loaded locally. Nothing was uploaded.`);
  }

  return (
    <section className="import-section" id="use-your-case" aria-labelledby="import-title">
      <div className="section-heading import-heading">
        <div>
          <p className="eyebrow">Use your own redacted case</p>
          <h2 id="import-title">Turn records into the same tree and Reply Map.</h2>
        </div>
        <p>No account, server, or paid API. The JSON stays in this browser tab and is cleared when the tab is refreshed.</p>
      </div>

      <div className="import-grid">
        <article className="prompt-card">
          <span className="card-step">A · Prepare the JSON</span>
          <h3>Copy a guarded prompt for ChatGPT</h3>
          <div className="privacy-warning">
            <strong>Redact before sharing</strong>
            <p>Remove names, addresses, phone numbers, emails, Aadhaar or identity numbers, signatures, bank details, and any other personal information.</p>
          </div>
          <ol className="import-steps">
            <li>Copy the prompt.</li>
            <li>Give ChatGPT only redacted RTI records.</li>
            <li>Ask it to return JSON only.</li>
            <li>Paste that JSON into the checker.</li>
          </ol>
          <div className="button-row">
            <button className="primary-button compact-button" type="button" onClick={copyPrompt}>Copy ChatGPT prompt</button>
            <button className="secondary-button compact-button" type="button" onClick={() => downloadText('rti-reply-map-template.json', JSON.stringify(CASE_JSON_TEMPLATE, null, 2))}>Download JSON template</button>
          </div>
          <details className="prompt-preview">
            <summary>Read the full prompt</summary>
            <textarea aria-label="Full ChatGPT prompt" readOnly value={CUSTOM_CASE_PROMPT} rows={12} />
          </details>
        </article>

        <article className="json-card">
          <span className="card-step">B · Check and load</span>
          <h3>Paste JSON or choose a file</h3>
          <label className="file-control" htmlFor={inputId}>
            <span>Choose a JSON file</span>
            <small>Stays on this device · maximum 512 KB</small>
          </label>
          <input id={inputId} className="visually-hidden-file" type="file" accept="application/json,.json" onChange={chooseFile} />
          <label className="json-editor">
            <span>Case JSON</span>
            <textarea
              value={jsonText}
              onChange={(event) => updateJson(event.target.value)}
              placeholder={'Paste the JSON object from ChatGPT here…'}
              spellCheck={false}
              rows={13}
            />
          </label>
          <div className="button-row">
            <button className="secondary-button compact-button" type="button" onClick={() => updateJson(JSON.stringify(CASE_JSON_TEMPLATE, null, 2))}>Try the template</button>
            <button className="secondary-button compact-button" type="button" onClick={checkJson}>Check JSON</button>
            <button className="primary-button compact-button" type="button" onClick={loadCandidate} disabled={!candidate}>Load case</button>
          </div>
          {validation ? (
            <div className={validation.ok ? 'validation-box valid' : 'validation-box invalid'} role={validation.ok ? 'status' : 'alert'}>
              <strong>{validation.ok ? 'Valid case JSON' : `${validation.errors.length} issue${validation.errors.length === 1 ? '' : 's'} found`}</strong>
              {validation.ok ? <p>The dependency tree is connected and every question has one Reply Map result.</p> : (
                <ul>{validation.errors.slice(0, 8).map((error) => <li key={error}>{error}</li>)}</ul>
              )}
            </div>
          ) : null}
          {importedCase ? (
            <div className="loaded-case">
              <div><small>Loaded locally</small><strong>{importedCase.title}</strong></div>
              <button type="button" onClick={onClearCase}>Clear imported case</button>
            </div>
          ) : null}
        </article>
      </div>
      <div className="live-region" aria-live="polite" aria-atomic="true">{message}</div>
    </section>
  );
}
