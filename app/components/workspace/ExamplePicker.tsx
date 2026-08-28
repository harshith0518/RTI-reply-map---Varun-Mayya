'use client';

import type { RTICaseData } from '@/src/case-model';

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
    <section className="example-picker" aria-labelledby="examples-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Five cases · five different failure patterns</p>
          <h2 id="examples-title">Change the case. The same map still works.</h2>
        </div>
        <label className="example-select">
          <span>Choose a case</span>
          <select value={activeCase.caseId} onChange={(event) => onSelect(event.target.value)}>
            {examples.map((example) => (
              <option value={example.caseId} key={example.caseId}>{example.citizenName} — {example.structureLabel}</option>
            ))}
            {importedCase ? <option value={importedCase.caseId}>My local case — {importedCase.title}</option> : null}
          </select>
        </label>
      </div>
      <div className="example-cards" aria-label="Demonstration cases">
        {examples.map((example, index) => (
          <button
            type="button"
            className={activeCase.caseId === example.caseId ? 'active' : ''}
            aria-pressed={activeCase.caseId === example.caseId}
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
      <p className="example-caption">All five demonstrations are fictional and deliberately different: parallel split, transfer then split, appeal chain, fee/no-reply branches, and a simple consolidated reply.</p>
    </section>
  );
}
