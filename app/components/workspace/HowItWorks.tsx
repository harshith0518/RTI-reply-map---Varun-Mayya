const STEPS = [
  {
    number: '01',
    title: 'Choose a complete case',
    text: 'Explore five fictional journeys: reply, transfer, fee notice, silence, and appeal.',
  },
  {
    number: '02',
    title: 'Follow the dependency tree',
    text: 'Trace every branch without mistaking procedure for answer evidence.',
  },
  {
    number: '03',
    title: 'Check every original question',
    text: 'See the exact passage and location—or why no evidence can safely be shown.',
  },
];

export function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works" aria-labelledby="how-title">
      <div className="section-heading how-heading">
        <div>
          <p className="eyebrow">What the prototype is doing</p>
          <h2 id="how-title">From case records to a question-by-question view.</h2>
        </div>
        <p>Pick a case. Open a branch. Then check the passage linked to each question.</p>
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
          <p>This static site uses deterministic browser code to turn fixtures or imported JSON into a tree and Reply Map. It calls no ChatGPT, OpenAI, or government API.</p>
        </aside>
      </div>
      <p className="scale-note"><strong>Safe scale-up path:</strong> a real service would need consent, automated redaction, encryption, deletion controls, short retention, security testing, and legal review.</p>
    </section>
  );
}
