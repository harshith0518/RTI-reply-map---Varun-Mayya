# Architecture

RTI Reply Map is a static, local-first client application. Its job is to make an RTI case auditable: lifecycle relationships remain visible in a dependency tree, while every original question stays linked to evidence in the Reply Map.

## System shape

```text
src/case-examples.ts + src/case-examples/*.ts
  five fictional, structurally different demonstration cases
                         |
                         v
src/case-model.ts <── src/case-prompt.ts
  versioned types       privacy-aware ChatGPT prompt + valid template
  runtime validation              |
  tree construction               v
                         pasted or chosen local JSON
                         |
                         v
app/components/workspace/ReplyMapApp.tsx
  active example/custom case, per-case in-tab reviews, disclosure
        |
        +── ExamplePicker.tsx
        +── CaseWorkspace.tsx
        |     +── DependencyTree.tsx
        |     +── ReplyMapPanel.tsx + browser-only human checks
        |     └── reviewed outcome + official handoff
        +── WhyThisExists.tsx + sourced workflow evidence
        +── HowItWorks.tsx
        └── ImportCasePanel.tsx
```

The production build has no server application state, backend, database, authentication, live government integration, analytics, or model call.

## Case model

`RTICaseData` is the single render and import contract. It contains:

- Case metadata and an explicit root node.
- Original questions.
- Lifecycle nodes such as application, registration, transfer, reply, no reply, fee notice, payment, appeal, appeal order, and supplemental reply.
- Directed, labelled dependency edges.
- Document metadata.
- Exactly one cautious Reply Map result per original question.

The current graph deliberately requires a rooted tree: the root has no parent; every other node has exactly one parent; every node is connected; and cycles are rejected. This matches the citizen-facing dependency view and permits a small semantic nested-list renderer without a graph library. A lifecycle event involving an office already seen earlier should be represented as a new dated event node rather than a cross-link.

## Validation boundary

All five built-in fixtures and every pasted/chosen custom case use `validateCaseData`. The validator rejects:

- Unsupported schema versions and malformed required fields.
- Unknown fields, invalid optional-field types, and impossible calendar dates.
- Inputs above 512 KB and excessive collection sizes.
- Duplicate IDs or missing question, node, document, or edge references.
- Multiple parents, disconnected nodes, root parents, and cycles.
- Missing Reply Map results or more than one result for a question.
- Evidence references that do not belong to the mapped question and lifecycle node.
- Positive results without an exact passage, location, and document.
- `no_matching_passage` results without an inspected substantive document.
- Procedural transfer, fee, or appeal-order documents used as answer evidence.
- Custom `assetPath` links.

Strings are rendered through React. The app does not use `dangerouslySetInnerHTML`. Custom documents are metadata only and cannot inject a link.

This is structural validation, not source authentication. The browser cannot inspect an unprovided PDF, detect a fabricated quotation, or prove that a date, page, registration number, or office name matches an original record. That boundary is stated beside the importer, and users are told to compare the loaded map with their redacted records.

## Evidence semantics

The public labels remain intentionally narrow. They are evidence-coverage values supplied by `RTICaseData`, not government workflow statuses: fixture authors assign them for built-in examples, while custom cases supply them through validated JSON. No officer input or official-portal lookup exists in the prototype.

- `answer_located`
- `partially_addressed`
- `no_matching_passage`
- `needs_human_review`

A transfer notice, additional-fee notice, or appeal order records procedure but cannot prove that requested information was supplied. An exact dated “no such record exists” statement can be an answer passage; it is not a legal-compliance verdict. A reply that exists but contains no relevant passage is distinct from a branch with no substantive reply.

The human check overlays the proposed label in React state. The original proposal remains visible. Reviews are retained per case while the tab stays open so a citizen can compare examples without losing work; they are not written to storage or uploaded.

## Deferred next-phase validation

If the project advances, the next validation area is formal denial or rejection grounds, complaints, second appeals, and other legally complex edge cases. These are deliberately not presented as current prototype capabilities. Any extension should first define narrow citizen-facing semantics with an RTI-domain reviewer, then add schema types, runtime validation, fictional fixtures, and structural tests before changing the interface.

## Custom-case lifecycle

1. The user downloads and edits the JSON template manually, or copies the optional prompt from `src/case-prompt.ts` for use in a separate ChatGPT session.
2. Personal details are redacted before records are shared with any external service.
3. The user prepares one JSON object using schema version `1.0`.
4. The user pastes JSON or chooses a local `.json` file.
5. The same runtime validator used for the fixtures checks structure and cross-references.
6. A valid case replaces the selected example in memory and renders through the same components.
7. Refresh or “Clear imported case” removes it.

## Free deployment

The app is deliberately static and dependency-light. It can be served from OpenAI Sites for the current public deployment or another free static host. No paid service is required at runtime.

## Safe extension rules

- Keep the schema, validator, tree builder, and examples independent of React.
- Add a fixture and structural test before introducing a new lifecycle rule.
- Preserve exact passage, page/location, document, registration, and time qualifiers.
- Keep procedural and substantive documents distinct.
- Put a file under `public/` only when a built-in demonstration intentionally links to it.
- Keep public-source screenshots in `public/proofs/`, with visible provenance, alt text, source links, and caveats that avoid endorsement or prevalence claims.
- Never commit real unredacted citizen data, credentials, or private documents.
- Treat next steps as official-link handoffs, not product verdicts.
