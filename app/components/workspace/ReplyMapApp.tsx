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
        <a className="brand" href="#main-content" aria-label="RTI Reply Navigator home">
          <span className="brand-mark" aria-hidden="true">▤</span>
          <span><strong>RTI Reply Navigator</strong><small>Your case, minus the detective work</small></span>
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
            <h1 id="product-title">Making RTI smooth as butter</h1>
            <p><strong>One request. Every branch. Every reply.</strong> A citizen-first view that turns registrations, transfers and replies into one path you can actually follow.</p>
            <p className="prototype-line"><strong>Not a “coming soon” slide deck.</strong> Pick a case, click through the mess or bring redacted JSON. You decide whether the answer worked; the site does not decide for you.</p>
          </div>

          <nav className="review-paths" aria-label="Review this solution in three steps">
            <a href="#examples">
              <span>01</span>
              <div><strong>Pick a plot twist</strong><small>Choose one of five fictional RTI paths.</small></div>
            </a>
            <a href="#workspace">
              <span>02</span>
              <div><strong>Follow the rabbit hole</strong><small>Tree the case, then check every question.</small></div>
            </a>
            <a href="#use-your-case">
              <span>03</span>
              <div><strong>Fix the loose end</strong><small>If information is missing, prepare the next step in place.</small></div>
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
            <h2 id="footer-handoff-title">One request. Zero tab-hopping.</h2>
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

          <section className="creator-credit" aria-labelledby="creator-credit-title">
            <div className="creator-identity">
              <p>Created by</p>
              <h3 id="creator-credit-title">Surya Harshith</h3>
              <a href="mailto:bsharshith1808@gmail.com">Mail me for any queries: bsharshith1808@gmail.com</a>
            </div>
            <div className="creator-notes">
              <p><strong>Made with:</strong> Codex, React 19, TypeScript, Vinext/Vite and OpenAI Sites.</p>
              <p><strong>How Codex was used:</strong> Codex helped refine the idea, sent web-research agents to surface citizen pain points, and coded the entire website. The feedback, product structure and final direction are Surya Harshith&apos;s.</p>
            </div>
          </section>
        </div>
      </footer>
      <PrototypeTour />
    </div>
  );
}
