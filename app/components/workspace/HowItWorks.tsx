export function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works" aria-labelledby="how-title">
      <div className="section-heading how-heading">
        <div>
          <p className="eyebrow">No hand-waving zone</p>
          <h2 id="how-title">What works. What&apos;s next. No magic dust.</h2>
        </div>
        <p>This redesign works with prepared case data. It does not replace or connect to an official portal.</p>
      </div>

      <div className="build-boundary">
        <div>
          <p className="boundary-label">Working now</p>
          <p>Five cases, dependency tree, question checks, inline next-step notes and local JSON.</p>
        </div>
        <div>
          <p className="boundary-label">Not connected</p>
          <p>Government filing, payment, live status, email, document extraction and legal decisions.</p>
        </div>
      </div>
      <div className="roadmap-block" aria-labelledby="roadmap-title">
        <header><p className="eyebrow">Next week, if shortlisted</p><h3 id="roadmap-title">Round two: finish the whole journey.</h3></header>
        <ol>
          <li><span>01</span><div><strong>First and second appeals</strong><p>Prepare complete files, preserve branch links and hand off to the correct official route.</p></div></li>
          <li><span>02</span><div><strong>Email alerts</strong><p>Remind citizens about replies, appeal actions and status changes after verified dates.</p></div></li>
          <li><span>03</span><div><strong>Officer/admin view · if time</strong><p>Explore an optional work queue only after the citizen flow is complete.</p></div></li>
        </ol>
      </div>
      <p className="scale-note"><strong>For real use:</strong> consent, redaction, encryption, deletion controls, security testing and legal review would be required.</p>
    </section>
  );
}
