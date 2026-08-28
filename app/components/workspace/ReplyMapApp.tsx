'use client';

import { useState } from 'react';
import { EXAMPLE_CASES } from '@/src/case-examples';
import type { RTICaseData } from '@/src/case-model';
import { COVERAGE_COPY, COVERAGE_HELP, type CoverageCode } from '@/src/coverage';
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
          <a href="#how-it-works">How it works</a>
          <a href="#use-your-case">Custom JSON</a>
        </nav>
        <div className="topbar-actions">
          <span className="demo-pill"><strong>{activeCase.source === 'custom' ? 'Local case' : 'Sample prototype'}</strong><small>{activeCase.source === 'custom' ? 'Not uploaded by this site' : 'Not a government website'}</small></span>
        </div>
      </header>

      <main id="main-content" className="workspace-page" tabIndex={-1}>
        <section className="prototype-review-note" id="prototype-overview" aria-labelledby="review-note-title">
          <div className="review-note-heading">
            <div>
              <p className="review-note-kicker"><span aria-hidden="true">●</span> Start here</p>
              <h2 id="review-note-title">This page is the working proposal.</h2>
            </div>
            <p>Pick a fictional case, read its dependency tree and Reply Map, then check the public records behind the problem. A redacted JSON test is available at the end.</p>
          </div>

          <nav className="review-paths" aria-label="Review this solution in three steps">
            <a href="#examples">
              <span>01</span>
              <div><strong>Choose a case</strong><small>Five fictional examples cover different splits, transfers, fees, replies, silence and appeal paths.</small></div>
            </a>
            <a href="#workspace">
              <span>02</span>
              <div><strong>Read the two views</strong><small>The tree explains where each record came from. Reply Map checks every original question.</small></div>
            </a>
            <a href="#why-this-exists">
              <span>03</span>
              <div><strong>Check the public record</strong><small>Official guidance and published RTI files show the real branching workflow behind the proposal.</small></div>
            </a>
          </nav>

          <section className="status-intro" aria-labelledby="status-intro-title">
            <div className="status-intro-copy">
              <p>Four Reply Map labels</p>
              <h3 id="status-intro-title">These labels describe evidence—not an official RTI status.</h3>
              <span>They come from the case JSON, not from an officer or the RTI portal. If you disagree, change a label under “Your evidence check”; the change stays in this tab.</span>
              <strong>A reply may exist without answering every question. The labels make that gap visible.</strong>
            </div>
            <ul aria-label="Meaning of the four Reply Map evidence labels">
              {(Object.entries(COVERAGE_COPY) as [CoverageCode, string][]).map(([code, label]) => (
                <li className={`status-intro-item status-${code}`} key={code}><strong>{label}</strong><small>{COVERAGE_HELP[code]}</small></li>
              ))}
            </ul>
          </section>

          <aside className="review-scope" aria-label="Scope of this prototype phase">
            <strong>Current phase</strong>
            <span>Reply tracing, missing evidence, fee notices, silence and first appeal are covered. Formal denial grounds, complaints and second appeals are outside this prototype.</span>
          </aside>
        </section>

        <section className="product-intro" aria-labelledby="product-title">
          <div>
            <p className="eyebrow">One application. Every related record.</p>
            <h1 id="product-title">See one RTI case, from application to every reply.</h1>
            <p>The tree shows how the case branched. Reply Map shows what each reply says about every original question—and what still needs checking.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#examples">Explore five fictional cases</a>
              <a className="secondary-button" href="#use-your-case">Test custom JSON</a>
            </div>
          </div>
        </section>

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
        <aside className="trust-note" aria-label="Prototype boundaries">
          <strong>What this demo does not do</strong>
          <p>No account is needed. This site does not upload your JSON or call AI or government APIs. It does not decide whether a reply is lawful.</p>
        </aside>
        <WhyThisExists />
        <HowItWorks />
        <ImportCasePanel importedCase={importedCase} onLoadCase={loadCase} onClearCase={clearImportedCase} />
        <div className="live-region" aria-live="polite" aria-atomic="true">{liveMessage}</div>
      </main>

      <footer className="site-footer workspace-footer" id="prototype-footer">
        <section className="footer-handoff" aria-labelledby="footer-handoff-title">
          <div className="footer-handoff-copy">
            <div>
              <p className="footer-kicker">Independent hackathon prototype</p>
              <p className="footer-flow" aria-label="Explore, then verify, then test">
                <span>Explore</span><b aria-hidden="true">→</b><span>Verify</span><b aria-hidden="true">→</b><span>Test</span>
              </p>
            </div>
            <div>
              <h2 id="footer-handoff-title">Try a case. Check the evidence. Test your own.</h2>
              <p>This prototype reconnects scattered RTI registrations, transfers and replies into one reviewable case. It does not file an RTI or replace the official portal.</p>
            </div>
          </div>

          <nav className="footer-paths" aria-label="Explore and test this prototype">
            <a href="#examples">
              <span>01 · Explore</span>
              <strong>Try five fictional cases</strong>
              <small>Compare different dependency trees and question-to-evidence maps.</small>
              <b aria-hidden="true">Open the cases →</b>
            </a>
            <a href="#why-this-exists">
              <span>02 · Verify</span>
              <strong>Read the public record</strong>
              <small>See the official guidance and published files that show how related RTI records can branch.</small>
              <b aria-hidden="true">Check the evidence →</b>
            </a>
            <a href="#use-your-case">
              <span>03 · Test</span>
              <strong>Use custom redacted JSON</strong>
              <small>Paste JSON or choose a file. Validation and mapping run only in this browser.</small>
              <b aria-hidden="true">Test your case →</b>
            </a>
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
