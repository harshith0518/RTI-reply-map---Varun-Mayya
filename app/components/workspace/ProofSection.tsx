/* eslint-disable @next/next/no-img-element -- these small, lazy local records must stay host-agnostic in the static build */

const PROOFS = [
  {
    index: '01',
    label: 'Current official rule',
    title: 'One application can receive multiple registration numbers.',
    caption: 'The current Central RTI Online FAQ explains that this can happen when an application is forwarded to multiple CPIOs.',
    caveat: 'General portal guidance only; it does not measure frequency, show a particular case, or prove that citizens are confused.',
    image: '/proofs/current-central-faq.png',
    width: 1265,
    height: 712,
    alt: 'Central RTI Online FAQ with question 17 expanded, explaining that one application forwarded to multiple CPIOs can receive multiple registration numbers.',
    source: 'https://rtionline.gov.in/faq.php',
    sourceLabel: 'Open the Central RTI Online FAQ',
  },
  {
    index: '02',
    label: 'Documented citizen consequence',
    title: 'Related branches can mean separately checked statuses and replies.',
    caption: 'The official citizen manual illustrates four related registrations, four statuses, four replies, and an appeal against the relevant registration.',
    caveat: 'This is an official instructional example, not a measured usability study or a real citizen case.',
    image: '/proofs/citizen-manual-four-replies.png',
    width: 1530,
    height: 1980,
    alt: 'Page 25 of the RTI Online citizen manual showing four related registration numbers, four expected replies, and branch-specific appeal guidance.',
    source: 'https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf#page=25',
    sourceLabel: 'Open the citizen manual at page 25',
  },
  {
    index: '03',
    label: 'Redacted production record',
    title: 'A real reply can refer to more than one transferred registration.',
    caption: 'A public, source-redacted 2025 TRAI record shows one consolidated reply referring to two transferred RTI registrations.',
    caveat: 'This is one consolidated reply—not two replies—and one case does not establish how common this pattern is.',
    image: '/proofs/trai-consolidated-reply-2025.png',
    width: 1240,
    height: 1755,
    alt: 'Redacted 2025 TRAI reply referring to registrations TRAOI/R/T/25/00089 and TRAOI/R/T/25/00094 in one consolidated response.',
    source: 'https://www.trai.gov.in/sites/default/files/rti/RTI_July_18092025.pdf#page=260',
    sourceLabel: 'Open the TRAI public RTI bundle at page 260',
  },
];

export function ProofSection() {
  return (
    <section className="proof-section" id="proof" aria-labelledby="proof-title">
      <div className="section-heading proof-heading">
        <div>
          <p className="eyebrow">Official-source validation</p>
          <h2 id="proof-title">Why this problem is real.</h2>
        </div>
        <p>These sources motivate the prototype. They do not endorse it, prove widespread difficulty, or decide whether any reply is legally adequate.</p>
      </div>
      <div className="proof-disclaimer"><strong>Independent prototype</strong><span>Not affiliated with or endorsed by RTI Online, DoPT, NIC, TRAI, or any government authority.</span></div>
      <div className="proof-list">
        {PROOFS.map((proof) => (
          <article className="proof-card" key={proof.index}>
            <a className="proof-image-link" href={proof.source} target="_blank" rel="noreferrer" aria-label={`${proof.sourceLabel} (new tab)`}>
              <img src={proof.image} width={proof.width} height={proof.height} alt={proof.alt} loading="lazy" decoding="async" />
            </a>
            <div className="proof-copy">
              <span className="proof-index">Proof {proof.index} · {proof.label}</span>
              <h3>{proof.title}</h3>
              <p>{proof.caption}</p>
              <p className="proof-caveat"><strong>Read carefully:</strong> {proof.caveat}</p>
              <a href={proof.source} target="_blank" rel="noreferrer">{proof.sourceLabel} <span>(new tab)</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
