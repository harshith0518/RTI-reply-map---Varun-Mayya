# RTI Reply Map

RTI Reply Map is a mobile-first, no-login hackathon prototype that helps a citizen understand several related RTI replies as one question-by-question map. It keeps each result tied to an exact passage, reply file, page location, and registration branch, then lets the citizen confirm or change the suggested label.

The demonstration is deliberately safe: Maya, every registration number, office, reply, and PDF are synthetic. The site is not connected to a government system, files nothing, and does not provide legal advice.

## Demo flow

1. Read Maya's three original questions.
2. See the parallel registration branches.
3. Review the proposed coverage for each question.
4. Inspect the exact supporting passage and watermarked PDF.
5. Confirm or override any label and optionally add a note.
6. Download a reviewed, clearly marked demonstration summary.

## Architecture

```text
Synthetic case fixtures
        |
        v
Deterministic mapping rules ---> Domain tests (Maya, Nisha, Asha)
        |
        v
React client experience ---> Local browser storage for human reviews
        |                         (no account, server, or submission)
        v
Evidence view + downloadable reviewed summary
```

- `src/domain.ts`: typed mapping rules and human-review overlay.
- `src/fixtures.ts`: synthetic Maya, Nisha, and Asha test cases.
- `app/page.tsx`: the accessible seven-step interface.
- `public/replies/`: watermarked synthetic source PDFs.
- `tests/domain.test.ts`: deterministic topology, chronology, evidence, and override tests.
- `submission/`: ready-to-use submission copy, demo script, and QA checklist.

## Run locally

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verify

```bash
npm test
npm run lint
npm run build
```

The production build is designed for free OpenAI Sites hosting. It has no database, authentication, paid API, or runtime AI dependency.
