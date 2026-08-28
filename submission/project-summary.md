# Submission summary

## RTI Reply Map

When one Central RTI application produces related registrations and separate replies, a citizen may still need to compare every document with the original questions. RTI Reply Map is a no-login workspace that keeps the case structure and evidence together.

Its dependency tree shows registrations, transfers, replies, fee notices, no-reply observations, appeals, orders, and supplemental replies. Beside it, the Reply Map gives one cautious result per original question. When evidence exists, the result includes the exact passage, page or attachment, document, and registration number. When it does not, the interface explains whether no substantive reply is available or no matching passage was located.

Five fictional cases demonstrate materially different structures: Maya's parallel CPIO split, Nisha's authority transfer then split, Asha's appeal and later reply, Imran's fee-notice and no-reply branches, and Meera's single consolidated reply.

A user can also prepare a redacted case in their own ChatGPT session with the copyable prompt, then paste or choose the returned JSON locally. The app validates schema, allowed values, IDs, references, tree connectivity, and mapping relationships. It cannot verify whether passages, pages, or facts match the source records; the user must check those manually against the redacted originals.

The free-deployable static React build uses no login, backend, database, paid API, analytics, live government connection, or runtime AI call. Imported JSON and human checks remain in the current browser tab. The prototype submits nothing and makes no legal-compliance decision.
