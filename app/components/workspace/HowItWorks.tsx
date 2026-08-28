const STEPS = [
  {
    number: '01',
    title: 'Choose a complete case',
    text: 'Start with one of five fictional citizen journeys—from a simple reply to transfers, fee notices, silence, and an appeal.',
  },
  {
    number: '02',
    title: 'Follow the dependency tree',
    text: 'See which registration, office, document, and later event belongs to each branch without treating procedure as answer evidence.',
  },
  {
    number: '03',
    title: 'Check every original question',
    text: 'The Reply Map shows the exact passage and location when available, or explains why evidence cannot safely be shown.',
  },
];

export function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works" aria-labelledby="how-title">
      <div className="section-heading how-heading">
        <div>
          <p className="eyebrow">The complete citizen journey</p>
          <h2 id="how-title">From scattered files to one reviewable answer trail.</h2>
        </div>
        <p>Built for a quick first-time review: choose a case, understand its branches, inspect the evidence, and make a human check.</p>
      </div>

      <ol className="how-steps">
        {STEPS.map((step) => (
          <li key={step.number}>
            <span>{step.number}</span>
            <div><strong>{step.title}</strong><p>{step.text}</p></div>
          </li>
        ))}
      </ol>

      <div className="build-boundary">
        <div>
          <p className="boundary-label">Working in this website</p>
          <p>Five case fixtures, tree interaction, question-to-evidence mapping, cautious labels, human corrections, and local JSON validation.</p>
        </div>
        <div>
          <p className="boundary-label">Fictional or mocked</p>
          <p>People, offices, registrations, replies, filing, payments, transfers, appeals, and any model-assisted document extraction.</p>
        </div>
        <aside>
          <strong>No hidden AI call</strong>
          <p>The deployed website is static. Typed examples and imported JSON are converted into the tree and Reply Map by deterministic browser code—without calling ChatGPT, OpenAI, or a government API.</p>
        </aside>
      </div>
      <p className="scale-note"><strong>Safe scale-up path:</strong> a real service would require consent, automatic redaction, encryption, deletion controls, short retention, document-security testing, and legal review.</p>
    </section>
  );
}
