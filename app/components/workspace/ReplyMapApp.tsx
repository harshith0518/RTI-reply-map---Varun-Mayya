'use client';

import { useState } from 'react';
import { EXAMPLE_CASES } from '@/src/case-examples';
import type { RTICaseData } from '@/src/case-model';
import type { CoverageCode } from '@/src/coverage';
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
  const [reviewsByCase, setReviewsByCase] = useState<Record<string, Record<string, CoverageCode>>>({});
  const [liveMessage, setLiveMessage] = useState('');
  const reviewKey = activeCase.source === 'custom' ? `${activeCase.caseId}:${importRevision}` : activeCase.caseId;
  const activeReviews = reviewsByCase[reviewKey] ?? {};

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

  function reviewMapping(mappingId: string, coverage: CoverageCode) {
    setReviewsByCase((current) => ({
      ...current,
      [reviewKey]: { ...(current[reviewKey] ?? {}), [mappingId]: coverage },
    }));
  }

  function resetReviews() {
    setReviewsByCase((current) => ({ ...current, [reviewKey]: {} }));
  }

  return (
    <div className="site-shell workspace-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="topbar workspace-topbar">
        <a className="brand" href="#main-content" aria-label="RTI Reply Map home">
          <span className="brand-mark" aria-hidden="true">▤</span>
          <span><strong>RTI Reply Map</strong><small>Case tree + evidence map</small></span>
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
            <p className="review-note-kicker"><span aria-hidden="true">●</span> Working hackathon prototype</p>
            <h1 id="product-title">One RTI can split into many replies. Reply Map keeps the case together.</h1>
            <p>Trace every registration in a dependency tree. Then see which reply answers each original question—and what is still missing.</p>
            <p className="prototype-line"><strong>This is the proposed solution:</strong> five live examples, public records and a local JSON test. Its four Reply Map labels describe evidence coverage—not officer input or official status.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#examples">Start with Maya&apos;s case</a>
              <a className="secondary-button" href="#why-this-exists">See the public records</a>
            </div>
          </div>

          <nav className="review-paths" aria-label="Review this solution in three steps">
            <a href="#examples">
              <span>01</span>
              <div><strong>Pick a case</strong><small>Five fictional paths: splits, transfers, fees, silence and appeal.</small></div>
            </a>
            <a href="#workspace">
              <span>02</span>
              <div><strong>Read two views</strong><small>Tree = where records came from. Reply Map = what answered each question.</small></div>
            </a>
            <a href="#use-your-case">
              <span>03</span>
              <div><strong>Verify or test</strong><small>Check six public records, or load redacted JSON in this browser.</small></div>
            </a>
          </nav>
        </section>

        <ExamplePicker examples={EXAMPLE_CASES} activeCase={activeCase} importedCase={importedCase} onSelect={selectCase} />

        <CaseWorkspace
          data={activeCase}
          reviews={activeReviews}
          onReview={reviewMapping}
          onResetReviews={resetReviews}
          key={`${activeCase.source}:${activeCase.caseId}:${activeCase.source === 'custom' ? importRevision : 0}`}
        />
        <aside className="trust-note" aria-label="Prototype boundaries">
          <strong>Prototype boundary</strong>
          <p>No account, upload, runtime AI, government API or legal verdict. This phase traces replies, fees, silence and first appeals; formal denials and second appeals are not modelled.</p>
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
            <p>Five fictional cases, six public records and browser-only testing. Nothing is filed or uploaded.</p>
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
          <p>The map locates evidence and case links. It does not judge compliance or file an RTI or appeal.</p>
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
