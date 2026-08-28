# Architecture

RTI Reply Map is intentionally a small, deterministic client application. Its job is to demonstrate one auditable citizen journey reliably, not to imitate an RTI portal or make legal decisions.

## System shape

```text
src/fixtures.ts
  fictional cases, questions, branches, events, documents, passages
        |
        v
src/domain.ts ------------------------------ tests/domain.test.ts
  pure mapping and review-overlay rules       topology, evidence, time, labels
        |
        v
src/demo.ts
  demo constants, review drafts, totals, safe summary HTML
        |
        v
app/page.tsx
  hash navigation, selected question, localStorage, download orchestration
        |
        +--> app/components/shared.tsx
        |      progress, status, disclosure, navigation controls
        |
        +--> app/components/screens/
               overview and mapping/review screens
        |
        +--> public/replies/*.pdf
               Maya's watermarked public sample evidence
```

The deployed build has no server-side application state, backend, database, authentication, live government integration, or runtime model call.

## Responsibilities

| Area | Responsibility |
| --- | --- |
| `src/domain.ts` | Typed case model, deterministic evidence mapping, approved public labels, and human-review overlay. It has no browser or UI dependency. |
| `src/fixtures.ts` | Fictional Maya, Nisha, and Asha cases. Events, documents, and evidence passages remain explicit and inspectable. |
| `src/demo.ts` | Browser-demo helpers, summary counts, storage constants, and escaped reviewed-summary HTML. |
| `app/page.tsx` | Client controller: seven-step hash navigation, selected question, review state, persistence, focus movement, reset, copy, and download actions. |
| `app/components/shared.tsx` | Reusable progress, status, safety-disclosure, and previous/next controls. |
| `app/components/screens/` | Citizen-facing screens grouped by journey responsibility rather than one monolithic page. |
| `tests/domain.test.ts` | Checks topology, chronology, substantive-vs-procedural evidence, approved labels, and review precedence. |
| `public/replies/` | Only the PDFs actually exposed by the Maya demo. |

## Mapping lifecycle

1. `mapCase` evaluates each question against substantive documents available by the requested date.
2. Exact evidence signals produce one of four cautious labels: answer located, partially addressed, no matching passage located, or needs human review.
3. Procedural notices and appeal orders never count as substantive answer evidence.
4. The UI shows the proposal, reason, confidence, branch, and source passage without declaring statutory compliance.
5. A citizen's confirmation or override produces an `EffectiveMapping`; the original proposal is retained for auditability.

The mapping layer is deterministic. A future model could suggest candidate passages, but the public labels should still be grounded in stored evidence and remain reviewable.

## Browser review lifecycle

Reviews are saved under `rti-reply-map-reviews-v1` in `localStorage`.

1. On load, stored JSON is parsed and validated against known Maya question IDs and approved coverage labels.
2. Selecting a question creates a draft from an existing review or the deterministic proposal.
3. Saving records the chosen label, optional note, and review timestamp.
4. The effective summary uses the human choice while preserving the system proposal.
5. Reset removes the storage key and restores the fictional case.
6. If browser storage is blocked, the flow continues in memory and explains that persistence is unavailable.

Nothing is uploaded or synchronized. Clearing site data removes saved reviews.

## Summary export

`createReviewedSummaryHtml` escapes fixture and review text, includes suggested and reviewed labels, evidence location, file, and registration number, and adds a synthetic-demo disclaimer. The browser creates a `Blob` and downloads the HTML locally; no server receives the summary.

## Fixture assets

Maya drives the public UI and these files exist in `public/replies/`:

- `maya-results-reply.pdf`
- `maya-cutoff-reply.pdf`
- `maya-vacancy-reply.pdf`

Nisha and Asha exercise serial transfer, parallel split, explicit no-record, no-reply, appeal-order, supplemental-reply, and no-match states in domain tests. Their document filenames are fixture metadata only; matching PDFs are deliberately not published.

## Safe extension rules

- Keep mapping rules pure and independent of React.
- Add domain scenarios as typed fixtures and tests before exposing them in the UI.
- Count only substantive reply documents as answer evidence.
- Preserve exact passage, page, document, branch, and time qualifiers.
- Put a file under `public/` only when the public UI intentionally links to it.
- Never introduce real citizen data, credentials, uploads, or unapproved government connections.
- Treat legal next steps as official-link handoffs, not product verdicts.
