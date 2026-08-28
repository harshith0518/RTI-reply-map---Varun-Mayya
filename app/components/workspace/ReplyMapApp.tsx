'use client';

import { useState } from 'react';
import { EXAMPLE_CASES } from '@/src/case-examples';
import type { RTICaseData } from '@/src/case-model';
import type { CoverageCode } from '@/src/coverage';
import { CaseWorkspace } from './CaseWorkspace';
import { ExamplePicker, LOCAL_CASE_OPTION } from './ExamplePicker';
import { HowItWorks } from './HowItWorks';
import { ImportCasePanel } from './ImportCasePanel';
import { ProofSection } from './ProofSection';

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
          <a href="#examples">Five cases</a>
          <a href="#how-it-works">How it works</a>
          <a href="#proof">Official sources</a>
          <a href="#use-your-case">Custom JSON</a>
        </nav>
        <div className="topbar-actions">
          <span className="demo-pill"><strong>{activeCase.source === 'custom' ? 'Local case' : 'Sample prototype'}</strong><small>{activeCase.source === 'custom' ? 'Not uploaded by this site' : 'Not a government website'}</small></span>
        </div>
      </header>

      <main id="main-content" className="workspace-page" tabIndex={-1}>
        <section className="product-intro" aria-labelledby="product-title">
          <div>
            <p className="eyebrow">One RTI application. Many files. One connected case.</p>
            <h1 id="product-title">Every reply has a place. Every question has a trail.</h1>
            <p>RTI Reply Map turns prepared case data into one dependency tree. Each question links to exact evidence—or a clear reason none can be shown.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#examples">Explore five fictional cases</a>
              <a className="secondary-button" href="#use-your-case">Test custom JSON</a>
            </div>
          </div>
          <aside aria-label="How RTI Reply Map transforms a case">
            <strong>The transformation</strong>
            <span>Scattered records</span><b>→</b>
            <span>Dependency tree</span><b>→</b>
            <span>Evidence-linked Reply Map</span><b>✓</b>
          </aside>
        </section>

        <div className="trust-row" aria-label="Prototype boundaries">
          <span>No login</span><span>No server upload by this site</span><span>No runtime AI/API</span><span>No legal verdict</span>
        </div>

        <ExamplePicker examples={EXAMPLE_CASES} activeCase={activeCase} importedCase={importedCase} onSelect={selectCase} />

        <section className="active-case-strip" aria-label="Selected case">
          <div><span>{activeCase.source === 'custom' ? 'Your local case' : 'Selected demonstration'}</span><strong>{activeCase.citizenName} · {activeCase.structureLabel}</strong></div>
          <p>{activeCase.source === 'custom' ? 'Loaded in memory only. Refreshing clears it.' : 'Fictional data · Select a node to trace its Reply Map evidence.'}</p>
        </section>

        <CaseWorkspace
          data={activeCase}
          reviews={activeReviews}
          onReview={reviewMapping}
          onResetReviews={resetReviews}
          key={`${activeCase.source}:${activeCase.caseId}:${activeCase.source === 'custom' ? importRevision : 0}`}
        />
        <HowItWorks />
        <ProofSection />
        <ImportCasePanel importedCase={importedCase} onLoadCase={loadCase} onClearCase={clearImportedCase} />
        <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
      </main>

      <footer className="site-footer workspace-footer">
        <div className="disclosure">
          <strong>Independent hackathon prototype</strong>
          <span>{activeCase.source === 'custom' ? 'Local imported case — this site does not upload it' : 'Uses fictional sample records'}</span>
          <span>Not connected to a government website</span>
          <span>Nothing is submitted</span>
          <span>Not legal advice</span>
          <span>Built with Codex · no runtime AI/API</span>
        </div>
        <p>The map locates evidence and case links. It does not judge compliance or file an RTI or appeal.</p>
        <nav className="footer-links" aria-label="Official RTI resources">
          <a href="https://rtionline.gov.in/" target="_blank" rel="noreferrer">Official RTI Online portal (new tab)</a>
          <a href="https://rtionline.gov.in/faq.php" target="_blank" rel="noreferrer">Official RTI Online FAQ (new tab)</a>
        </nav>
      </footer>
    </div>
  );
}
