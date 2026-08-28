# Submission summary

## RTI Reply Map

When one Central RTI application produces related registrations and replies, a citizen may still need to compare every document with the original questions. RTI Reply Map is a mobile-first, no-login workspace that keeps case structure and evidence together.

Its dependency tree shows registrations, transfers, replies, fee notices, silence, appeals, orders, and supplemental replies. Beside it, the Reply Map gives one cautious result per question. When evidence exists, it includes the exact passage, location, document, and registration. When it does not, the interface explains why no supporting passage can safely be shown. A person can confirm or correct labels and see a reviewed outcome without receiving a legal verdict.

Five fictional cases demonstrate different structures. Reviewers can also paste or choose prepared, redacted JSON. A strict in-browser validator checks schema, IDs, references, tree connectivity, and mapping relationships before the same deterministic renderer builds the views. It cannot inspect PDFs or verify quotations; users must compare them with source records.

Official FAQ, citizen-manual, and redacted TRAI screenshots establish the workflow pattern with clear caveats; they do not imply endorsement or prevalence.

Codex helped research official sources, design the schema and fixtures, implement the interface, add accessibility and safety guardrails, and create automated tests and submission materials. There is no runtime model call. The free static build has no login, backend, database, analytics, paid API, or government integration. Imported JSON and checks stay in the browser tab; nothing is submitted.
