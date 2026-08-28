# Submission QA checklist

## Product truthfulness

- [x] The site identifies itself as an independent prototype using fictional sample cases.
- [x] No government connection, submission, or legal-compliance decision is implied.
- [x] Maya's three public PDFs are synthetic, watermarked, and contain no real personal information.
- [x] Non-Maya filenames are fixture metadata rather than downloadable source files.
- [x] Results remain cautious and distinguish positive evidence, partial evidence, no matching passage, and no substantive reply.
- [x] Human checks do not erase the original proposed result and remain in the current tab only.

## Five-case workspace

- [x] The workspace opens without authentication.
- [x] Maya, Nisha, Asha, Imran, and Meera exercise five materially different case structures.
- [x] Selecting a tree node shows its lifecycle type, date, office, registration, questions, and document metadata.
- [x] Every original question has exactly one Reply Map result.
- [x] Positive results show a passage, location, document, registration, confidence, and explanation.
- [x] No-reply and no-match results explain why no supporting passage can be shown.
- [x] Procedural transfer, fee, and appeal-order documents are not presented as substantive answer evidence.
- [x] A user can change a proposed label and reset the in-tab checks.

## Custom redacted-case boundary

- [x] The full copyable prompt tells users to redact records and avoid legal conclusions.
- [x] JSON can be pasted or chosen locally and is limited to 512 KB.
- [x] Imported JSON remains in tab memory, cannot add public asset links, and disappears on refresh.
- [x] Validation checks schema, allowed values, IDs, references, dates, tree connectivity, cycles, and mapping relationships.
- [x] Submission copy states that structural validation cannot verify source passages, pages, or facts.
- [ ] Manually compare every imported passage and location with the redacted source before relying on the map.

## Quality and deployment gates

- [x] Run `npm run check` on the final commit: typecheck, tests, lint, and production build.
- [x] Test the current five-case workspace and JSON importer at 360 px and desktop width with no horizontal overflow.
- [ ] Verify keyboard access, visible focus, case selection, tree nodes, Reply Map details, review controls, prompt copy, file choice, validation, load, and clear.
- [x] Maya's three source PDFs render cleanly on all six pages.
- [ ] Deploy the final commit to the free static public host.
- [ ] Confirm the deployed build has no authentication, database, paid runtime dependency, analytics, or government integration.

## Before submitting

- [ ] Open the final public URL in a private browser window.
- [ ] Confirm the public URL requires no account or access request.
- [ ] Play the full 60-second demo once against the deployed build.
- [ ] Confirm every demoed control works and all five sample cases remain visibly fictional.
- [ ] Paste the public URL and the summary from `project-summary.md` into the submission form.
- [ ] Record the video at 1080p with browser zoom at 100% and notifications disabled.
