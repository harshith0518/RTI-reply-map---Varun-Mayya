'use client';

import type { RTICaseData } from '@/src/case-model';

export const LOCAL_CASE_OPTION = '__local_case__';

export function ExamplePicker({
  examples,
  activeCase,
  importedCase,
  onSelect,
}: {
  examples: RTICaseData[];
  activeCase: RTICaseData;
  importedCase?: RTICaseData;
  onSelect: (caseId: string) => void;
}) {
  return (
    <section className="example-picker" id="examples" aria-labelledby="examples-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Five different case paths</p>
          <h2 id="examples-title">Choose a case. The map updates below.</h2>
        </div>
        <label className="example-select">
          <span>Choose a case</span>
          <select aria-controls="workspace" value={activeCase.source === 'custom' ? LOCAL_CASE_OPTION : activeCase.caseId} onChange={(event) => onSelect(event.target.value)}>
            {examples.map((example) => (
              <option value={example.caseId} key={example.caseId}>{example.citizenName} — {example.structureLabel}</option>
            ))}
            {importedCase ? <option value={LOCAL_CASE_OPTION}>My local case — {importedCase.title}</option> : null}
          </select>
        </label>
        <a className="mobile-import-link" href="#use-your-case">Use a redacted case · Import JSON</a>
      </div>
      <div className="example-cards" aria-label="Demonstration cases">
        {examples.map((example, index) => (
          <button
            type="button"
            className={activeCase.source === 'synthetic' && activeCase.caseId === example.caseId ? 'active' : ''}
            aria-pressed={activeCase.source === 'synthetic' && activeCase.caseId === example.caseId}
            aria-controls="workspace"
            onClick={() => onSelect(example.caseId)}
            key={example.caseId}
          >
            <span className="example-number">0{index + 1}</span>
            <span className="example-card-copy">
              <strong>{example.citizenName}</strong>
              <small>{example.structureLabel}</small>
              <em>{example.tags.slice(0, 2).join(' · ')}</em>
            </span>
          </button>
        ))}
      </div>
      <p className="example-caption">The names and records are fictional. Each case uses a different routing and reply pattern.</p>
    </section>
  );
}
