/* eslint-disable @next/next/no-img-element -- source screenshots must stay host-agnostic in the static build */

const WORKFLOW_EVIDENCE = [
  {
    index: '01',
    label: 'Current Central RTI FAQ',
    title: 'One request can create many registration numbers.',
    caption: 'The official FAQ says one application may be sent to multiple Central Public Information Officers (CPIOs), creating several registration numbers.',
    caveat: 'This describes the rule—not how often it happens or how citizens experience it.',
    image: '/proofs/rti-online-faq-multiple-registrations.jpg',
    width: 1265,
    height: 712,
    alt: 'Central RTI Online FAQ explaining that one application forwarded to multiple CPIOs can create multiple registration numbers.',
    source: 'https://rtionline.gov.in/faq.php',
    sourceLabel: 'Open the official FAQ',
  },
  {
    index: '02',
    label: 'Citizen manual · page 24',
    title: 'The branches sit behind another status view.',
    caption: 'The citizen manual shows a status page, then a separate table listing the registration and status of each CPIO branch.',
    caveat: 'This is an official instructional example—not a usability study.',
    image: '/proofs/rti-online-manual-branch-status-page-24.png',
    width: 1530,
    height: 1980,
    alt: 'Page 24 of the RTI Online citizen manual showing one application expanded into separate CPIO status entries.',
    source: 'https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf#page=24',
    sourceLabel: 'Open the citizen manual · page 24',
  },
  {
    index: '03',
    label: 'Citizen manual · page 25',
    title: 'Each branch can have its own reply and appeal.',
    caption: 'The next page shows four related registrations, says four replies are expected, and ties an appeal to the relevant branch number.',
    caveat: 'This illustrates the workflow; it does not measure how common the pattern is.',
    image: '/proofs/rti-online-manual-four-replies-page-25.png',
    width: 1530,
    height: 1980,
    alt: 'Page 25 of the RTI Online citizen manual showing four related registrations, four replies and branch-specific appeal guidance.',
    source: 'https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf#page=25',
    sourceLabel: 'Open the citizen manual · page 25',
  },
  {
    index: '04',
    label: 'Published TRAI record · 2025',
    title: 'A transferred branch gets another registration.',
    caption: 'This public record carries a TRAI registration while also pointing back to the earlier numbered DoT branch that created it.',
    caveat: 'One redacted record proves the link exists—not that every transfer follows this shape.',
    image: '/proofs/trai-numbered-branch-transfer-2025.png',
    width: 1275,
    height: 1650,
    alt: 'Redacted RTI request details showing a transfer between public authorities with separate parent and branch references.',
    source: 'https://www.trai.gov.in/sites/default/files/rti/RTI_July_18092025.pdf#page=258',
    sourceLabel: 'Open the TRAI public RTI bundle · page 258',
  },
  {
    index: '05',
    label: 'Published AAI record · 2024',
    title: 'The case becomes a chain of transfers.',
    caption: 'Receipt, forwarding, two later CPIO transfers and disposal appear as separate dated rows. The path has to be reconstructed in order.',
    caveat: 'This is one published case; it does not establish widespread difficulty.',
    image: '/proofs/aai-action-history-transfer-chain-2024.png',
    width: 1491,
    height: 2115,
    alt: 'RTI action history showing receipt, forwarding, successive CPIO transfers and disposal across dated rows.',
    source: 'https://www.aai.aero/sites/default/files/rtidir/RTI%20Reply%20-%20Registration%20No.00518%20-%20Srikanth%20Mamindla.pdf#page=2',
    sourceLabel: 'Open the AAI public reply bundle · page 2',
  },
  {
    index: '06',
    label: 'Published TRAI reply · 2025',
    title: 'Even the final reply can merge branches.',
    caption: 'One redacted TRAI reply cites two transferred registrations in the same response, so the ending is not always one branch to one file.',
    caveat: 'This is one consolidated reply—not two replies—and does not establish prevalence.',
    image: '/proofs/trai-consolidated-reply-2025.png',
    width: 1240,
    height: 1755,
    alt: 'Redacted 2025 TRAI reply consolidating two transferred RTI registrations into one response.',
    source: 'https://www.trai.gov.in/sites/default/files/rti/RTI_July_18092025.pdf#page=260',
    sourceLabel: 'Open the TRAI public RTI bundle · page 260',
  },
];

export function WhyThisExists() {
  return (
    <section className="why-section" id="why-this-exists" aria-labelledby="why-title">
      <div className="why-intro">
        <div>
          <p className="eyebrow">Why this exists</p>
          <h2 id="why-title">One RTI can become many numbers, screens and replies.</h2>
        </div>
        <p>A citizen may start with one application. When different officers hold different parts of the answer, the record can split into registrations, transfers and replies. The links exist—but the citizen must rebuild the whole case.</p>
      </div>

      <div className="why-flow" aria-label="How one RTI application can become harder to follow">
        <span>One application</span><b aria-hidden="true">→</b>
        <span>Many registrations</span><b aria-hidden="true">→</b>
        <span>Separate replies</span><b aria-hidden="true">→</b>
        <span>Branch-specific action</span>
      </div>

      <div className="why-question">
        <span>The missing view</span>
        <strong>Which branch answers which original question?</strong>
      </div>

      <ol className="workflow-evidence" aria-label="Published workflow evidence">
        {WORKFLOW_EVIDENCE.map((item) => (
          <li className="evidence-card" key={item.index}>
            <figure className="evidence-figure">
              <a href={item.image} target="_blank" rel="noreferrer" aria-label={`Open full image for source ${item.index} (new tab)`}>
                <img src={item.image} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" />
                <span>Open full image</span>
              </a>
              <figcaption>{item.label}</figcaption>
            </figure>
            <div className="evidence-copy">
              <span className="evidence-index">Source {item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
              <p className="evidence-caveat"><strong>Read carefully:</strong> {item.caveat}</p>
              <a href={item.source} target="_blank" rel="noreferrer">{item.sourceLabel} <span>(new tab)</span></a>
            </div>
          </li>
        ))}
      </ol>

      <div className="why-disclaimer">
        <strong>What these records establish</strong>
        <span>Branching, transfers, multiple registrations and branch-specific replies can occur. They do not measure prevalence, prove legal non-compliance, or imply government endorsement of this prototype.</span>
      </div>

      <div className="why-bridge">
        <div>
          <p className="eyebrow">What Reply Map adds</p>
          <h3>One connected case—and one visible result for every question.</h3>
          <p>It turns registrations and actions into a dependency tree, then links each original question to an exact reply passage or a clearly stated gap.</p>
        </div>
        <div className="before-after" aria-label="Before and after RTI Reply Map">
          <p><span>Before</span><strong>Numbers, transfers and replies across separate records</strong></p>
          <b aria-hidden="true">→</b>
          <p><span>After</span><strong>One case tree and one evidence result per question</strong></p>
        </div>
        <a className="primary-button" href="#examples">See five fictional cases</a>
      </div>
    </section>
  );
}
