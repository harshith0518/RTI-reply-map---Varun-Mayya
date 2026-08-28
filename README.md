# RTI Reply Map

RTI Reply Map is a mobile-first, no-login prototype that helps a citizen read several related RTI replies as one question-by-question map. Each result stays tied to an exact passage, sample reply file, page location, and related RTI registration number. The citizen can then confirm or change the suggested result.

- **Live demo:** https://rti-reply-map.harshith794.chatgpt.site
- **GitHub:** https://github.com/harshith0518/RTI-reply-map---Varun-Mayya

Maya, every registration number, office, reply, and PDF are fictional. The prototype is independent, connects to no government system, submits nothing, and does not provide legal advice.

## Citizen journey

1. Read Maya's three original questions.
2. See the three related RTI registration branches.
3. Compare every question with its proposed reply result.
4. Inspect the exact passage, page, reply file, and registration number.
5. Confirm or override the result and optionally add a private note.
6. Download a clearly marked reviewed HTML summary.

## Architecture at a glance

```text
Synthetic fixture -> deterministic mapping -> componentized seven-step UI
                                                |
                                     browser-only human review
                                                |
                                     reviewed HTML summary
```

There is no backend, database, authentication, paid API, or runtime AI dependency. `app/page.tsx` owns browser state and orchestration; screen components live under `app/components/screens/`; reusable progress, status, disclosure, and navigation controls live in `app/components/shared.tsx`. Pure domain rules and synthetic fixtures remain separate under `src/` so they can be checked without rendering the UI.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data flow, review lifecycle, trust boundaries, and extension points.

## Fixture and PDF scope

Maya is the public demonstration and has three watermarked PDFs in `public/replies/`:

- `maya-results-reply.pdf`
- `maya-cutoff-reply.pdf`
- `maya-vacancy-reply.pdf`

Nisha and Asha are domain/test fixtures in `src/fixtures.ts`. Their filenames—`nisha-evaluation-reply.pdf`, `nisha-finance-reply.pdf`, `asha-contracts-reply.pdf`, and `asha-quality-supplemental-reply.pdf`—describe expected document records but are not public files in this repository.

## Run locally

Prerequisites:

- Node.js 22.13 or later
- npm
- Python 3 and ReportLab only if regenerating the sample PDFs

```bash
git clone https://github.com/harshith0518/RTI-reply-map---Varun-Mayya.git
cd RTI-reply-map---Varun-Mayya
npm install
npm run dev
```

Open `http://localhost:3000`.

To regenerate Maya's PDFs:

```bash
python -m pip install reportlab
python scripts/create_sample_replies.py
```

## Check a change

```bash
npm run check
```

The check command runs TypeScript checks, domain tests, ESLint, and a production build. The individual commands remain available as `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`.

Contribution and review expectations are in [CONTRIBUTING.md](CONTRIBUTING.md).
