# RTI Reply Map

RTI Reply Map is a mobile-first, no-login prototype that turns a scattered RTI case into two connected views:

1. A dependency tree showing how the application became registrations, transfers, replies, fee notices, no-reply states, appeals, orders, and supplemental replies.
2. A Reply Map connecting every original question to an exact passage, page, document, registration number, and cautious coverage result.

- **Live demo:** https://rti-reply-map.harshith794.chatgpt.site
- **GitHub:** https://github.com/harshith0518/RTI-reply-map---Varun-Mayya

The built-in people, offices, registrations, dates, records, and PDFs are fictional. The prototype is independent, connects to no government system, submits nothing, and does not provide legal advice.

## What reviewers can try

The public workspace contains five deliberately different cases:

| Case | Structure | Product rule demonstrated |
| --- | --- | --- |
| Maya | Three parallel CPIO registrations and replies | A stated total is not the same as the requested calculation record. |
| Nisha | Authority transfer, then a later split | A transfer notice is procedural; a dated no-record passage can still be answer evidence. |
| Asha | No reply, first appeal, FAA order, supplemental reply | Chronology is preserved and an appeal order is not mistaken for a substantive answer. |
| Imran | Reply, additional-fee notice, and no-reply branches | “Procedure pending” and “nothing received” remain distinct. |
| Meera | One registration and one consolidated package | The product does not invent branches when the case is simple. |

Select any tree node to inspect its office, registration, questions, and documents. Open a Reply Map item to see the exact passage and change the proposed label using the browser-only human check.

## Use a custom redacted case

The “Use your own redacted case” section provides:

- A copyable, privacy-guarded ChatGPT prompt.
- A downloadable valid JSON template.
- Paste and local `.json` file input.
- Runtime validation for schema, IDs, references, tree connectivity, cycles, evidence, and procedural-document misuse.
- The same dependency-tree and Reply Map renderer used by all five examples.

There is no ChatGPT API call in the site. A user prepares JSON in their own ChatGPT session, then loads it into this browser tab. Imported data is kept in memory, is never uploaded by the app, and disappears on refresh. See [docs/CASE-JSON.md](docs/CASE-JSON.md) for the contract.

## Architecture

```text
Five typed fixtures ───────────────┐
                                  ├─> runtime validator ─> dependency tree + Reply Map
Pasted/chosen custom JSON ─────────┘                              |
                                                          browser-only review
```

The deploy is a static client application with no backend, database, authentication, paid API, analytics, or runtime AI dependency. The central schema and validator live in `src/case-model.ts`; examples live in `src/case-examples/`; the prompt and template live in `src/case-prompt.ts`; and the workspace UI lives in `app/components/workspace/`.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data flow, trust boundaries, validation rules, and extension points.

## Run locally

Prerequisites: Node.js 22.13 or later and npm.

```bash
git clone https://github.com/harshith0518/RTI-reply-map---Varun-Mayya.git
cd RTI-reply-map---Varun-Mayya
npm install
npm run dev
```

Open `http://localhost:3000`.

To regenerate Maya's watermarked PDFs, install ReportLab and run `python scripts/create_sample_replies.py`.

## Check a change

```bash
npm run check
```

This runs TypeScript checks, domain/import/prompt tests, ESLint, and a production build. Contribution and manual-review expectations are in [CONTRIBUTING.md](CONTRIBUTING.md).
