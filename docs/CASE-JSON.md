# Custom case JSON

The website accepts one JSON object with `schemaVersion: "1.0"`. The easiest starting point is the “Download JSON template” button in the live app. That template is generated from `CASE_JSON_TEMPLATE` in `src/case-prompt.ts` and is checked by the test suite.

## Privacy workflow

1. Remove names, addresses, phone numbers, emails, identity numbers, signatures, account details, and other personal information.
2. Use the copyable prompt with only redacted application/reply material in your own ChatGPT session.
3. Keep exact short evidence passages and page or attachment locations.
4. Paste the returned JSON into the local checker.

The website itself does not send the chosen file or pasted JSON anywhere. Imported cases stay in the current tab's memory and disappear on refresh.

## Top-level fields

| Field | Purpose |
| --- | --- |
| `schemaVersion` | Must be `"1.0"`. |
| `caseId` | Unique, stable identifier for the case. |
| `source` | Must be `"custom"` for an imported case. |
| `fictional` | Whether the content is synthetic. |
| `title`, `citizenName`, `citizenGoal`, `scenario`, `painPoint` | Citizen-facing context. Use redacted labels. |
| `filedOn` | `YYYY-MM-DD`. |
| `authority` | Redacted public-authority name or neutral label. |
| `rootNodeId` | ID of the original-application node. |
| `structureLabel`, `tags` | Short descriptive labels. |
| `questions` | Original questions, each with ID, number, title, and full text. |
| `nodes` | Dated lifecycle events and their question/document scope. |
| `edges` | Directed dependencies from an earlier event to a later event. |
| `documents` | Document metadata only; custom links are not allowed. |
| `mappings` | Exactly one evidence result for every question. |

## Allowed lifecycle values

Nodes: `application`, `registration`, `transfer`, `reply`, `no_reply`, `fee_notice`, `payment`, `appeal`, `appeal_order`, `supplemental_reply`.

Edges: `registered_as`, `transferred_to`, `split_to`, `replied_with`, `no_reply_observed`, `fee_requested`, `fee_paid`, `appealed_as`, `ordered`, `supplemented_by`.

Documents: `substantive_reply`, `supplemental_reply`, `transfer_notice`, `appeal_order`, `fee_notice`, `attachment`.

Results: `answer_located`, `partially_addressed`, `no_matching_passage`, `needs_human_review`.

## Tree and evidence invariants

- One root application; every other node has exactly one parent.
- Every node is connected to the root and the graph has no cycles.
- Every ID is unique and every reference exists.
- Every question has exactly one mapping.
- `answer_located` and `partially_addressed` require a substantive/attachment document, exact passage, and location.
- Transfer notices, fee notices, and appeal orders cannot be answer evidence.
- `no_matching_passage` means a substantive reply was inspected but no relevant passage was found.
- `needs_human_review` means no substantive reply is available or the evidence is insufficient.
- Do not include `assetPath` for a custom case.

Run `npm test` to check the template, fixtures, graph invariants, and the prompt contract.
