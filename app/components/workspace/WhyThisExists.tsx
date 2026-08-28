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
    caveat: 'This redacted record shows the link—not that every transfer follows this shape.',
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

const EVIDENCE_GROUPS = [
  {
    id: 'official-guidance',
    number: '01',
    label: 'Official guidance',
    title: 'How RTI Online explains split cases',
    summary: 'The FAQ and citizen manual document multiple registrations, separate status views, replies and branch-specific appeals.',
    items: WORKFLOW_EVIDENCE.slice(0, 3),
  },
  {
    id: 'published-records',
    number: '02',
    label: 'Published case records',
    title: 'How those links appear in public files',
    summary: 'These redacted AAI and TRAI records show numbered transfers, a transfer chain and one reply linked to two registrations.',
    items: WORKFLOW_EVIDENCE.slice(3),
  },
];

export function WhyThisExists() {
  return (
    <section className="why-section" id="why-this-exists" aria-labelledby="why-title">
      <div className="why-intro">
        <div>
          <p className="eyebrow">Why this exists</p>
          <h2 id="why-title">One application can turn into several records.</h2>
        </div>
        <p>You have just seen the proposed view. These official guides and published files show the workflow underneath it: related registrations, transfers, separate replies and branch-specific action.</p>
      </div>

      <div className="why-question">
        <span>The gap</span>
        <strong>The numbers stay linked; a citizen may still have to compare the contents question by question.</strong>
      </div>

      <div className="evidence-ledger">
        {EVIDENCE_GROUPS.map((group) => (
          <section className="evidence-group" aria-labelledby={`${group.id}-title`} key={group.id}>
            <header className="evidence-group-heading">
              <span aria-hidden="true">{group.number}</span>
              <div>
                <p>{group.label}</p>
                <h3 id={`${group.id}-title`}>{group.title}</h3>
                <small>{group.summary}</small>
              </div>
            </header>
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
          </section>
        ))}
      </div>

      <div className="why-disclaimer">
        <strong>What these sources show</strong>
        <span>Multiple registrations, transfers and branch-specific replies are part of the documented workflow. These examples do not show how often citizens encounter it, prove that an authority acted unlawfully, or endorse this prototype.</span>
      </div>

      <div className="why-bridge">
        <div>
          <p className="eyebrow">Our design response</p>
          <h3>Keep the official trail. Add a question-by-question reading layer.</h3>
          <p>Reply Map does not replace RTI Online or the reply files. It helps a citizen read related records together and see where evidence is still missing.</p>
        </div>
        <a className="secondary-button" href="#workspace">Return to the selected case ↑</a>
      </div>
    </section>
  );
}
