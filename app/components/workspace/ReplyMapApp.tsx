'use client';

import { useState } from 'react';
import { EXAMPLE_CASES } from '@/src/case-examples';
import type { RTICaseData } from '@/src/case-model';
import type { SatisfactionChoice } from '@/src/question-actions';
import { CaseWorkspace } from './CaseWorkspace';
import { ExamplePicker, LOCAL_CASE_OPTION } from './ExamplePicker';
import { HowItWorks } from './HowItWorks';
import { ImportCasePanel } from './ImportCasePanel';
import { PrototypeTour } from './PrototypeTour';
import { WhyThisExists } from './WhyThisExists';

export function ReplyMapApp() {
  const [activeCase, setActiveCase] = useState<RTICaseData>(EXAMPLE_CASES[0]);
  const [importedCase, setImportedCase] = useState<RTICaseData>();
  const [importRevision, setImportRevision] = useState(0);
  const [decisionsByCase, setDecisionsByCase] = useState<Record<string, Record<string, SatisfactionChoice>>>({});
  const [liveMessage, setLiveMessage] = useState('');
  const decisionKey = activeCase.source === 'custom' ? `${activeCase.caseId}:${importRevision}` : activeCase.caseId;
  const activeDecisions = decisionsByCase[decisionKey] ?? {};

  function selectCase(caseId: string) {
    const next = caseId === LOCAL_CASE_OPTION
      ? importedCase
      : EXAMPLE_CASES.find((item) => item.caseId === caseId);
    if (!next) return;
    setActiveCase(next);
    setLiveMessage(`${next.citizenName}'s ${next.structureLabel.toLowerCase()} case is now shown.`);
  }

  function loadCase(data: RTICaseData) {
    setImportedCase(data);
    setActiveCase(data);
    setImportRevision((current) => current + 1);
    setLiveMessage(`${data.title} is loaded from local JSON.`);
    window.setTimeout(() => {
      const heading = document.getElementById('case-title');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      heading?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      heading?.focus({ preventScroll: true });
    }, 50);
  }

  function clearImportedCase() {
    setImportedCase(undefined);
    setActiveCase(EXAMPLE_CASES[0]);
    setLiveMessage('The imported case was cleared from this tab. Maya’s sample is shown again.');
  }

  function decideQuestion(mappingId: string, choice: SatisfactionChoice) {
    setDecisionsByCase((current) => ({
      ...current,
      [decisionKey]: { ...(current[decisionKey] ?? {}), [mappingId]: choice },
    }));
  }

  function resetDecisions() {
    setDecisionsByCase((current) => ({ ...current, [decisionKey]: {} }));
  }

  return (
    <div className="site-shell workspace-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="topbar workspace-topbar">
        <a className="brand" href="#main-content" aria-label="RTI Reply Map home">
          <span className="brand-mark" aria-hidden="true">▤</span>
          <span><strong>RTI Reply Map</strong><small>Connected case + next step</small></span>
        </a>
        <nav className="topbar-nav" aria-label="Explore the prototype">
          <a href="#examples">Cases</a>
          <a href="#why-this-exists">Public records</a>
          <a href="#how-it-works">Scope</a>
          <a href="#use-your-case">Custom JSON</a>
        </nav>
        <div className="topbar-actions">
          <span className="demo-pill"><strong>{activeCase.source === 'custom' ? 'Local case' : 'Sample prototype'}</strong><small>{activeCase.source === 'custom' ? 'Not uploaded by this site' : 'Not a government website'}</small></span>
        </div>
      </header>

      <main id="main-content" className="workspace-page" tabIndex={-1}>
        <section className="product-intro" id="prototype-overview" aria-labelledby="product-title">
          <div>
            <p className="review-note-kicker"><span aria-hidden="true">●</span> Independent redesign of the RTI Online citizen journey</p>
            <h1 id="product-title">One RTI case. Every branch, answer and next step.</h1>
            <p>Official registrations and files stay intact. This proposed citizen view connects them, matches every original question and puts the next action beside anything still missing.</p>
            <p className="prototype-line"><strong>This is the working solution—not a feature slideshow.</strong> Try five cases, inspect the public records and load custom JSON. You decide whether an answer satisfies you; the site never decides that for you.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#examples">Start with Maya&apos;s case</a>
              <a className="secondary-button" href="#why-this-exists">See the public records</a>
            </div>
          </div>

          <nav className="review-paths" aria-label="Review this solution in three steps">
            <a href="#examples">
              <span>01</span>
              <div><strong>See today&apos;s pattern</strong><small>Pick one of five fictional RTI paths.</small></div>
            </a>
            <a href="#workspace">
              <span>02</span>
              <div><strong>See the proposed view</strong><small>Tree the case, then check every question.</small></div>
            </a>
            <a href="#use-your-case">
              <span>03</span>
              <div><strong>Choose the next step</strong><small>If information is missing, prepare the right follow-up in place.</small></div>
            </a>
          </nav>
        </section>

        <ExamplePicker examples={EXAMPLE_CASES} activeCase={activeCase} importedCase={importedCase} onSelect={selectCase} />

        <CaseWorkspace
          data={activeCase}
          decisions={activeDecisions}
          onDecision={decideQuestion}
          onResetDecisions={resetDecisions}
          key={`${activeCase.source}:${activeCase.caseId}:${activeCase.source === 'custom' ? importRevision : 0}`}
        />
        <aside className="trust-note" aria-label="Prototype boundaries">
          <strong>Prototype boundary</strong>
          <p>No account, server upload, runtime AI or government API. Satisfaction is your choice; draft notes stay in this tab. Nothing is filed and no legal result is predicted.</p>
        </aside>
        <WhyThisExists />
        <HowItWorks />
        <ImportCasePanel importedCase={importedCase} onLoadCase={loadCase} onClearCase={clearImportedCase} />
        <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
      </main>

      <footer className="site-footer workspace-footer" id="prototype-footer">
        <section className="footer-handoff footer-compact" aria-labelledby="footer-handoff-title">
          <div>
            <p className="footer-kicker">Independent hackathon prototype</p>
            <h2 id="footer-handoff-title">Explore a case or test redacted JSON.</h2>
            <p>Five fictional cases, six public records and browser-only testing. Try a question, its next step or your own redacted JSON.</p>
          </div>
          <nav className="footer-quick-links" aria-label="Review the prototype">
            <a href="#examples">Cases</a>
            <a href="#why-this-exists">Public records</a>
            <a href="#use-your-case">Custom JSON</a>
          </nav>
        </section>

        <div className="footer-boundaries">
          <div className="disclosure">
            <strong>Prototype boundaries</strong>
            <span>{activeCase.source === 'custom' ? 'Local imported case — this site does not upload it' : 'Uses fictional sample records'}</span>
            <span>Independent of government</span>
            <span>Nothing is submitted</span>
            <span>Not legal advice</span>
            <span>No runtime AI or API</span>
          </div>
          <p>This is a prototype of the proposed citizen experience. It does not calculate legal deadlines, choose a remedy or file an RTI or appeal.</p>
          <nav className="footer-links" aria-label="Official RTI resources">
            <a href="https://rtionline.gov.in/" target="_blank" rel="noreferrer">Official RTI Online portal (new tab)</a>
            <a href="https://rtionline.gov.in/faq.php" target="_blank" rel="noreferrer">Official RTI Online FAQ (new tab)</a>
          </nav>
        </div>
      </footer>
      <PrototypeTour />
    </div>
  );
}
