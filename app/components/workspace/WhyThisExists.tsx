'use client';

/* eslint-disable @next/next/no-img-element -- source screenshots must stay host-agnostic in the static build */

import { useEffect, useRef, useState } from 'react';

const WORKFLOW_EVIDENCE = [
  {
    index: '01', label: 'Current Central RTI FAQ', title: 'One request can create several registration numbers.',
    caption: 'The official FAQ says one application may be sent to several CPIOs, creating several registrations.',
    caveat: 'States the rule; it does not measure frequency.', image: '/proofs/rti-online-faq-multiple-registrations.jpg',
    width: 1265, height: 712, alt: 'Central RTI Online FAQ explaining that one application forwarded to multiple CPIOs can create multiple registration numbers.',
    source: 'https://rtionline.gov.in/faq.php', sourceLabel: 'Official RTI FAQ',
  },
  {
    index: '02', label: 'Citizen manual · page 24', title: 'Branches sit behind another status view.',
    caption: 'The citizen manual puts branch registrations and statuses in a separate table.',
    caveat: 'An instructional example, not a usability study.', image: '/proofs/rti-online-manual-branch-status-page-24.png',
    width: 1530, height: 1980, alt: 'Page 24 of the RTI Online citizen manual showing one application expanded into separate CPIO status entries.',
    source: 'https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf#page=24', sourceLabel: 'Citizen manual · page 24',
  },
  {
    index: '03', label: 'Citizen manual · page 25', title: 'Each branch can have its own reply and appeal.',
    caption: 'The manual expects four replies and ties an appeal to the relevant branch number.',
    caveat: 'Shows the workflow, not how often it occurs.', image: '/proofs/rti-online-manual-four-replies-page-25.png',
    width: 1530, height: 1980, alt: 'Page 25 of the RTI Online citizen manual showing four related registrations, four replies and branch-specific appeal guidance.',
    source: 'https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf#page=25', sourceLabel: 'Citizen manual · page 25',
  },
  {
    index: '04', label: 'Published TRAI record · 2025', title: 'A transferred branch gets another registration.',
    caption: 'The TRAI record points back to the numbered DoT branch from which it was transferred.',
    caveat: 'One redacted example; transfer patterns can differ.', image: '/proofs/trai-numbered-branch-transfer-2025.png',
    width: 1275, height: 1650, alt: 'Redacted RTI request details showing a transfer between public authorities with separate parent and branch references.',
    source: 'https://www.trai.gov.in/sites/default/files/rti/RTI_July_18092025.pdf#page=258', sourceLabel: 'TRAI public RTI bundle · page 258',
  },
  {
    index: '05', label: 'Published AAI record · 2024', title: 'The case becomes a chain of transfers.',
    caption: 'AAI logs receipt, forwarding, two CPIO transfers and disposal as separate dated rows.',
    caveat: 'One published case, not a frequency measure.', image: '/proofs/aai-action-history-transfer-chain-2024.png',
    width: 1491, height: 2115, alt: 'RTI action history showing receipt, forwarding, successive CPIO transfers and disposal across dated rows.',
    source: 'https://www.aai.aero/sites/default/files/rtidir/RTI%20Reply%20-%20Registration%20No.00518%20-%20Srikanth%20Mamindla.pdf#page=2', sourceLabel: 'AAI public reply · page 2',
  },
  {
    index: '06', label: 'Published TRAI reply · 2025', title: 'One reply can cite two registrations.',
    caption: 'A redacted TRAI reply cites two transferred registrations in one response.',
    caveat: 'One consolidated reply, not two replies.', image: '/proofs/trai-consolidated-reply-2025.png',
    width: 1240, height: 1755, alt: 'Redacted 2025 TRAI reply consolidating two transferred RTI registrations into one response.',
    source: 'https://www.trai.gov.in/sites/default/files/rti/RTI_July_18092025.pdf#page=260', sourceLabel: 'TRAI public RTI bundle · page 260',
  },
] as const;

type EvidenceItem = (typeof WORKFLOW_EVIDENCE)[number];

const EVIDENCE_GROUPS = [
  { id: 'official-guidance', number: '01', label: 'Official guidance', title: 'FAQ and citizen manual', summary: 'Multiple registrations, separate status views, replies and branch-specific appeals.', items: WORKFLOW_EVIDENCE.slice(0, 3) },
  { id: 'published-records', number: '02', label: 'Published case records', title: 'AAI and TRAI examples', summary: 'Real records show transfers, a chain and one reply citing two registrations.', items: WORKFLOW_EVIDENCE.slice(3) },
] as const;

export function WhyThisExists() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<EvidenceItem>();

  useEffect(() => {
    if (!selected || !dialogRef.current || dialogRef.current.open) return;
    dialogRef.current.showModal();
  }, [selected]);

  function closePreview() {
    dialogRef.current?.close();
  }

  function finishClose() {
    setSelected(undefined);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  return (
    <section className="why-section" id="why-this-exists" aria-labelledby="why-title">
      <div className="why-intro">
        <div><p className="eyebrow">Why this redesign matters</p><h2 id="why-title">The records are linked. The answer trail is not.</h2></div>
        <p>Official guidance and published files show several registrations, transfers, replies and branch-specific appeals.</p>
      </div>
      <div className="why-question"><span>The missing view</span><strong>Which branch answers each original question—and what can the citizen do next?</strong></div>

      <div className="evidence-ledger">
        {EVIDENCE_GROUPS.map((group) => (
          <section className="evidence-group" aria-labelledby={`${group.id}-title`} key={group.id}>
            <header className="evidence-group-heading">
              <span className="evidence-group-number" aria-hidden="true">{group.number}</span>
              <div><p>{group.label}</p><h3 id={`${group.id}-title`}>{group.title}</h3><small>{group.summary}</small></div>
            </header>
            <ol className="workflow-evidence">
              {group.items.map((item) => (
                <li className="evidence-card" key={item.index}>
                  <figure className="evidence-figure">
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`Preview source ${item.index}: ${item.title}`}
                      onClick={(event) => { lastTriggerRef.current = event.currentTarget; setSelected(item); }}
                    >
                      <img src={item.image} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" />
                      <span>Preview record</span>
                    </button>
                  </figure>
                  <div className="evidence-copy">
                    <p className="evidence-source-line"><span className="evidence-index">Source {item.index}</span><small>{item.label}</small></p>
                    <h4>{item.title}</h4><p>{item.caption}</p><p className="evidence-caveat">{item.caveat}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="why-disclaimer"><strong>What these records establish</strong><span>Branching can occur. They do not measure prevalence, prove unlawful action or endorse this prototype.</span></div>

      <dialog
        ref={dialogRef}
        className="record-preview-dialog"
        aria-labelledby={selected ? `record-preview-${selected.index}` : undefined}
        onClose={finishClose}
        onClick={(event) => { if (event.target === event.currentTarget) closePreview(); }}
      >
        {selected ? (
          <article>
            <header>
              <div><p>Public record · source {selected.index}</p><h3 id={`record-preview-${selected.index}`}>{selected.title}</h3></div>
              <button type="button" onClick={closePreview} aria-label="Close record preview">Close <span aria-hidden="true">×</span></button>
            </header>
            <div className="record-preview-image"><img src={selected.image} width={selected.width} height={selected.height} alt={selected.alt} /></div>
            <footer>
              <div><strong>{selected.label}</strong><span>{selected.caveat}</span></div>
              <nav aria-label="Record preview actions">
                <a href={selected.image} download>Download image</a>
                <a href={selected.source} target="_blank" rel="noreferrer">Open official source <span>(new tab)</span></a>
                <button type="button" onClick={closePreview}>Close</button>
              </nav>
            </footer>
          </article>
        ) : null}
      </dialog>
    </section>
  );
}
