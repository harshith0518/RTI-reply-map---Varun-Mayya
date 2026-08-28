# Contributing

Keep changes small, testable, and easy for a manual reviewer to trace from fixture to rule to screen.

## Setup

Use Node.js 22.13 or later.

```bash
git clone https://github.com/harshith0518/RTI-reply-map---Varun-Mayya.git
cd RTI-reply-map---Varun-Mayya
npm install
npm run dev
```

Python is not needed for the website. To regenerate Maya's synthetic PDFs, install ReportLab and run the generator:

```bash
python -m pip install reportlab
python scripts/create_sample_replies.py
```

## Before opening a pull request

```bash
npm run check
```

This runs TypeScript checks, tests, lint, and the production build. Also walk through the public journey at a narrow mobile width and a desktop width when changing interaction or layout.

## Where changes belong

- Put case types and deterministic mapping behavior in `src/domain.ts`.
- Put only fictional, explicit case data in `src/fixtures.ts`.
- Put review/export helpers that do not render React in `src/demo.ts`.
- Keep browser orchestration in `app/page.tsx`.
- Reuse controls from `app/components/shared.tsx`.
- Keep journey screens in `app/components/screens/`.
- Add or update domain tests for every rule change.
- Publish evidence under `public/replies/` only when a screen intentionally links to it.

Nisha and Asha are test fixtures, not public demos. Their PDF-like filenames are metadata and must not be documented as downloadable files unless those files are intentionally created, reviewed, and added to `public/replies/`.

## Product and safety rules

- Use synthetic data only; never commit real RTI records, identifiers, credentials, or personal information.
- Do not connect to, test, scrape, or imitate a live government system.
- Keep “independent prototype,” “sample data,” “nothing is submitted,” and “not legal advice” disclosures clear.
- Describe evidence coverage, not legal compliance.
- Preserve keyboard access, visible focus, semantic headings, browser Back/Forward behavior, and text explanations that do not rely on color alone.
- Avoid adding authentication, a backend, analytics, uploads, or runtime AI unless the architecture and privacy model are deliberately reviewed first.

## Git history

Use a focused branch and commits that explain intent, for example:

```text
feat: add evidence state for supplemental replies
fix: preserve reviewed label in summary export
docs: clarify fixture-only document names
```

Do not commit `node_modules`, build output, secrets, editor state, or unrelated formatting. A pull request should state the citizen-visible change, files affected, checks run, and any mocked or incomplete behavior.
