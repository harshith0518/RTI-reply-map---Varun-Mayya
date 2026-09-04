# Copy this into the new chat

Build a **completely separate ChatGPT Site** for an end-to-end, citizen-first Central RTI experience. Do not modify, replace or redeploy the existing `rti-reply-map` project.

Create the new project in a sibling directory named `rti-saathi-complete`, with its own Git repository, its own `.openai/hosting.json` and its own Sites project. Do not reuse the current GitHub remote or Sites project ID. Keep the existing RTI Reply Navigator available as the validated Reply Map reference.

Before acting, read these files completely:

1. `rti-reply-map/docs/COMPLETE-SITE-HANDOFF.md`
2. `STATEMENT.md`
3. `research/fragments/10-rti-online.json`
4. `research/rti-screenshot-evidence/judge-ready/README.md`
5. `rti-reply-map/src/case-model.ts`
6. `rti-reply-map/src/case-examples.ts` and every file in `rti-reply-map/src/case-examples/`
7. `rti-reply-map/src/question-actions.ts`
8. `rti-reply-map/docs/ARCHITECTURE.md`
9. `rti-reply-map/submission/project-summary.md`
10. `rti-reply-map/submission/demo-script.md`
11. `hackathon-materials/official-challenge-brief.txt`, but verify the live brief because the stored initial-submission timing is older.

Use `rti-reply-map/docs/COMPLETE-SITE-HANDOFF.md` as the current product contract when older notes conflict with it.

## Product to build

Working name: **RTI Saathi**

Core feature: **Reply Map**

Headline: **Your question. The right record. One complete case.**

Build this complete working citizen journey:

```text
RTI fit check
→ Central/State route
→ source-linked authority helper
→ Goal-to-Record Builder
→ privacy/BPL/file review
→ simulated ₹10 payment and receipt
→ one citizen case dashboard
→ simulated transfer/split and related registrations
→ timeline, tree, documents and notifications
→ question-to-passage Reply Map
→ citizen satisfaction choice
→ branch-specific first appeal
→ FAA outcome/supplemental reply
→ second-appeal evidence pack and official CIC handoff
```

Default to Maya's fictional fellowship case. Her goal is converted into three record requests: marks, approved cut-off and seat-calculation approval. The seeded process splits them across three CPIO branches. Two questions are clearly answered; the third receives only a total, not the requested calculation record. Maya selects “Some information is missing,” and the site carries that question, evidence and exact branch into a mock first appeal. A later FAA event and supplemental reply close the loop.

## Non-negotiable requirements

- No login for judges.
- Mobile-first and excellent on laptop.
- Indian public-service aesthetic inspired by GIGW 3.0, without the State Emblem, official seals, fake `.gov.in` styling or any suggestion of endorsement.
- Persistent banner: **Independent hackathon prototype · No official filing · Synthetic demo data**.
- No real identity, Aadhaar, PAN, OTP, payment or citizen documents.
- No live government system, scraping, private API or real submission.
- Every government-like dependency is clearly simulated.
- No paid runtime dependency and no runtime AI requirement.
- Every shown feature must work.
- Use short, human, specific copy; no generic AI marketing language.
- Use respectful plain language. Catchy headings are fine, but do not joke in payment, privacy, rejection or appeal screens.
- Preserve the Reply Map as the product's strongest feature.
- Keep official workflow status, evidence mapping and citizen assessment as separate concepts.
- Put the relevant next action directly below the affected question.
- Show exact document, page/location, passage and registration for every evidence mapping.
- Never decide that a reply is legally adequate or that an appeal will succeed.
- Give every tree an accessible list alternative.
- Work at 360px without horizontal page scrolling; use 16px body text and 44px touch targets.
- Support keyboard navigation, visible focus, skip link, semantic headings, error summaries, reduced motion and 200% zoom.
- Use local demo persistence and a Reset demo control.
- Reuse the five existing synthetic case structures and validation rules, but create a new interface and end-to-end shell.

## Scope discipline

“Complete” means the complete citizen journey, not an entire government back office. Reviewers test the citizen flow. Use a small Process Lab or “Advance demo case” control to simulate nodal assignment, transfer, split, replies and FAA events; do not make an admin dashboard the main experience.

Finish the judge-ready MVP before considering stretch features. Do not spend the remaining round on real auth, real payment, real SMS/email, complete State coverage, nationwide AI authority prediction, admin analytics or a CIC clone.

## Technical direction

- Use the Sites/Vinext React and TypeScript path.
- Use a typed domain reducer/state machine.
- Bundle synthetic fixtures.
- Persist demo state in browser storage only.
- Put case storage, government events, payment and notifications behind adapters so future real implementations do not require rewriting the UI.
- Validate the case graph, dates, IDs, documents, mappings and appeal branches at runtime.
- Generate fictional receipts and appeal packs in the browser.
- Use URL-addressable routes and make refresh/direct links work.
- Keep an append-only case event history.
- Create meaningful outcome-based Git commits.
- Do not connect a GitHub remote until a new remote is provided; never push the new site into the current repository by mistake.

## Delivery order

1. Set up the separate project and choose the civic visual system.
2. Build the smallest meaningful slice: RTI fit check → authority → record builder.
3. Show the first working local preview.
4. Complete the whole Maya journey through first appeal.
5. Integrate the other four case structures.
6. Add evidence, help, privacy, accessibility and credits.
7. Run domain tests, production build and mobile/keyboard/browser checks.
8. Deploy the **separate** public Site for free.
9. Prepare an updated under-250-word summary and two-minute script only after the product works.

Do not stop at a plan. Implement, validate and deploy the complete separate website. Make reasonable decisions without repeatedly asking me questions. Ask only if a missing choice would materially change the product or risk overwriting the existing project.
