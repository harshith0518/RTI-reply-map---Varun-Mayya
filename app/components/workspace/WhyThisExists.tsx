/* eslint-disable @next/next/no-img-element -- source screenshots must stay host-agnostic in the static build */

const WORKFLOW_EVIDENCE = [
  {
    index: '01',
    label: 'Current Central RTI FAQ',
    title: 'One request can create many registration numbers.',
    caption: 'The official FAQ says one application may be sent to several CPIOs, creating several registration numbers.',
    caveat: 'This states the rule; it does not measure frequency.',
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
    caption: 'The citizen manual puts branch registrations and statuses in a separate table.',
    caveat: 'An instructional example, not a usability study.',
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
    caption: 'The manual expects four replies and ties an appeal to the relevant branch number.',
    caveat: 'Shows the workflow, not how often it occurs.',
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
    caption: 'This public record carries a TRAI registration and points back to the numbered DoT branch from which it was transferred.',
    caveat: 'One redacted example; transfer patterns can differ.',
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
    caption: 'AAI logs receipt, forwarding, two CPIO transfers and disposal as separate dated rows.',
    caveat: 'One published case, not evidence of widespread difficulty.',
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
    title: 'One reply can cite two registrations.',
    caption: 'One redacted TRAI reply cites two transferred registrations in the same response.',
    caveat: 'One consolidated reply, not two replies or a frequency measure.',
    image: '/proofs/trai-consolidated-reply-2025.png',
    width: 1240,
    height: 1755,
    alt: 'Redacted 2025 TRAI reply consolidating two transferred RTI registrations into one response.',
    source: 'https://www.trai.gov.in/sites/default/files/rti/RTI_July_18092025.pdf#page=260',
    sourceLabel: 'Open the TRAI public RTI bundle · page 260',
  },
];

const EVIDENCE_GROUPS = [
  {
    id: 'official-guidance',
    number: '01',
    label: 'Official guidance',
    title: 'FAQ and citizen manual',
    summary: 'Multiple registrations, separate status views, replies and branch-specific appeals.',
    items: WORKFLOW_EVIDENCE.slice(0, 3),
  },
  {
    id: 'published-records',
    number: '02',
    label: 'Published case records',
    title: 'AAI and TRAI examples',
    summary: 'One published AAI record and two redacted TRAI records show transfers, a chain and one reply citing two registrations.',
    items: WORKFLOW_EVIDENCE.slice(3),
  },
];

export function WhyThisExists() {
  return (
    <section className="why-section" id="why-this-exists" aria-labelledby="why-title">
      <div className="why-intro">
        <div>
          <p className="eyebrow">Why this exists</p>
          <h2 id="why-title">Public records show why branches matter.</h2>
        </div>
        <p>Official guidance and published RTI files document multiple registrations, transfers, separate replies and branch-specific appeals.</p>
      </div>

      <div className="why-question">
        <span>The gap</span>
        <strong>The portal links branches by number; citizens may still have to match replies to their original questions.</strong>
      </div>

      <div className="evidence-ledger">
        {EVIDENCE_GROUPS.map((group) => (
          <details className="evidence-group" open={group.id === 'official-guidance'} key={group.id}>
            <summary className="evidence-group-heading">
              <span className="evidence-group-number" aria-hidden="true">{group.number}</span>
              <div>
                <p>{group.label}</p>
                <h3 id={`${group.id}-title`}>{group.title}</h3>
                <small>{group.summary}</small>
              </div>
              <span className="evidence-disclosure">{group.items.length} sources <b aria-hidden="true">+</b></span>
            </summary>
            <ol className="workflow-evidence">
              {group.items.map((item) => (
                <li className="evidence-card" key={item.index}>
                  <figure className="evidence-figure">
                    <a href={item.image} target="_blank" rel="noreferrer" aria-label={`Open full image for source ${item.index} (new tab)`}>
                      <img src={item.image} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" />
                      <span>View record</span>
                    </a>
                  </figure>
                  <div className="evidence-copy">
                    <p className="evidence-source-line"><span className="evidence-index">Source {item.index}</span><small>{item.label}</small></p>
                    <h4>{item.title}</h4>
                    <p>{item.caption}</p>
                    <p className="evidence-caveat">{item.caveat}</p>
                    <a href={item.source} target="_blank" rel="noreferrer">{item.sourceLabel} <span>(new tab)</span></a>
                  </div>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>

      <div className="why-disclaimer">
        <strong>What these sources show</strong>
        <span>Branching can occur. They do not measure prevalence, prove unlawful action or endorse this prototype.</span>
      </div>
    </section>
  );
}
