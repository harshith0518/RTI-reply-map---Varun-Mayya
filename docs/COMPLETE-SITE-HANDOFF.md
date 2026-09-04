# RTI Saathi — complete-site handoff

> Last verified: 4 September 2026
>
> Purpose: product and engineering context for a **separate new ChatGPT Site**
>
> Current prototype: [RTI Reply Navigator](https://rti-reply-map.harshith794.chatgpt.site/)
>
> Safety boundary: independent hackathon prototype, synthetic data only, no government integration, no legal advice

## 1. The decision

Build a new product around the strongest idea already proven by RTI Reply Navigator.

The new website should demonstrate this complete citizen journey:

```text
Human problem
  → Is RTI the right tool?
  → Central or State route?
  → Which public authority may hold the record?
  → Turn the problem into precise record requests
  → Privacy, BPL, file and fee checks
  → Clearly simulated filing and payment
  → One citizen-facing case
  → Transfer or split into related registrations
  → Status, notices, replies and documents
  → Question-to-evidence Reply Map
  → Citizen says whether the information is satisfactory
  → Branch-specific first appeal
  → FAA outcome or supplemental reply
  → Second-appeal document pack and official CIC handoff
```

"Complete" does **not** mean rebuilding every RTI Online page, the full authority directory, every State portal or the complete government back office. It means one coherent citizen can start with a problem and reach an understandable outcome without a dead end.

The current Reply Map must remain the differentiator. The filing wizard, dashboard, alerts and appeal flow should lead into and out of it—not bury it.

## 2. Product position

Working product name: **RTI Saathi**

Core feature name: **Reply Map**

Suggested headline: **Your question. The right record. One complete case.**

Optional lighter line: **Making RTI smooth as butter.**

One-sentence pitch:

> RTI Saathi turns a citizen's problem into specific record requests, guides a safe mock filing, and keeps every registration, reply, question and appeal connected in one understandable case.

The defensible comparison:

> RTI Online already files requests and tracks registrations. RTI Saathi helps the citizen prepare the right request, understand the whole case after it branches, and carry exact reply gaps into the relevant next step.

Primary citizen:

- A first-time applicant using a phone.
- They have a Central Government service, education, recruitment, pension or records problem.
- They know what happened to them but do not know the record name, authority structure or appeal path.
- They need plain language, saved progress and one next action at a time.

## 3. Hackathon contract to preserve

The current official brief says judges assess:

- whether the problem is real and important;
- whether the complete citizen journey works;
- whether the redesign is simpler, clearer and more accessible;
- whether product choices are thoughtful;
- whether backend, infrastructure and process implications were considered;
- whether mocked data and limitations are honestly disclosed.

Reviewers test the citizen experience, not an admin panel. A working prototype is required; static screens are not enough. Personal data, real credentials, payments, OTPs and government systems must be mocked. The build must not look official or imply government endorsement.

Stage 2 resubmission is due **7 September 2026**. The public brief does not state a Stage 2 clock time, so follow the mentor or submission message for the exact cutoff.

Official source: [Build What Moves India brief](https://buildwhatmovesindia.com/brief)

## 4. Verified current RTI context

These facts were rechecked on 4 September 2026.

### What the existing Central portal already does

- RTI Online Version 2.0 files Central Government RTI requests and first appeals.
- It supports payment, Payment Reconciliation, View Status, View History and helpdesk routes.
- It is not the filing portal for State Government public authorities. A State RTI filed there may be returned without refund.
- Accounts are optional. A request filed directly without login does not later appear inside the account history; the registration number can still be used in View Status.
- A registration report can show application text and reply/status or remarks together. Do not claim that they are always on separate pages.
- View Status currently asks for registration number, email, CAPTCHA and then OTP. OTP may also go to the mobile number when one was supplied.
- The FAQ says cases remain available in View Status/View History for three years.
- The request text field is limited to 3,000 characters; longer material uses a PDF attachment.
- The application fee is ₹10 for non-BPL citizens. BPL citizens attach appropriate proof and pay no application fee.
- The selected ministry's nodal officer routes the request to the relevant CPIO.
- Additional-fee and replacement-document actions appear through the status flow.

Primary sources:

- [RTI Online](https://rtionline.gov.in/)
- [RTI Online FAQ](https://rtionline.gov.in/faq.php)
- [Portal guidelines](https://rtionline.gov.in/guidelines.php?request=)
- [Citizen manual](https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf)
- [Current View Status form](https://rtionline.gov.in/request/status.php)
- [Current View History form](https://rtionline.gov.in/request/status_history.php)

### The strongest verified gap

One application may be transferred to another authority or forwarded to multiple CPIOs. The official manual documents related registration numbers, separately checked branch statuses, multiple replies and a first appeal tied to the affected branch's registration number.

The narrow, defensible problem is:

> Official workflows preserve registration-level status and replies, but the published citizen journey does not show one case-wide question-to-reply evidence map across every related registration.

Do not claim:

- every RTI becomes a tree;
- the portal has no dashboard, View History or tracking;
- the application and reply can never appear together;
- official officers label questions “partially answered”;
- the prototype can decide legal adequacy.

### Current first- and second-appeal context

- First appeal has no fee.
- The official portal offers grounds such as no response, refusal, incomplete/misleading/false information, unreasonable fee and another ground.
- The affected branch and its registration must remain visible when an appeal is prepared.
- Second appeal and complaint are different remedies and must not be merged into one generic action.
- RTI Online already announces integration with the CIC second-appeal system: first-appeal details can retrieve connected request and appeal information.
- The CIC restored its upgraded AppCoMS 2.0 service on 17 August 2026. It supports online second appeals/complaints and case-document submission.
- Therefore, the new product should prepare an understandable, indexed evidence pack and hand off to CIC. It should not pretend to invent the existing retrieval integration.

Primary sources:

- [CIC home and AppCoMS 2.0 notice](https://cic.gov.in/)
- [CIC second-appeal guidelines](https://cic.gov.in/second-appeal-guidelines)
- [CIC filing service](https://dss.cic.gov.in/)

### Numbers that can be used carefully

- Government reporting lists **2,80,353 transferred Central RTI requests in 2024–25**.
- The same government answer says partially answered and unresolved-case data are not centrally collected or compiled.

This proves that transfers occur at scale. It does **not** prove that 2,80,353 citizens chose the wrong authority, received child registrations or were confused.

Source: [PIB parliamentary answer, 12 February 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2226915&lang=1&reg=3)

## 5. Pain-point map

| Stage | Documented mechanism | Citizen difficulty to test | Product response |
| --- | --- | --- | --- |
| Before filing | Central and State authorities use different routes | Citizen may start on the wrong portal | RTI-fit and Central/State gate before the form |
| Authority selection | The citizen must select the record-holding public authority | Life problems do not arrive with ministry names | Small, source-linked authority helper with uncertainty |
| Request writing | RTI provides existing information, not grievance resolution or new explanations | “Fix this” or “why?” must become specific records | Goal-to-Record Builder with editable numbered items |
| Form preparation | 3,000-character field, PDF rules, BPL path and privacy restrictions | Technical validation appears late and may expose personal data | Up-front character, file, privacy and BPL preflight |
| Payment | Payment may require reconciliation before a registration appears | Citizen may pay again or not know whether filing succeeded | Mock ambiguous-payment state, clear “do not pay again” recovery and receipt history |
| Retrieval | View Status uses registration, email, CAPTCHA and OTP | Each retrieval needs identifiers and verification | One demo case page preserving every official identifier |
| Transfer and split | One request can create another number or multiple CPIO branches | Parent and child records are easy to mentally separate | Dependency tree plus accessible chronological list |
| Status/history | Direct filing can sit outside account history; public visibility is time-limited | Citizen must build their own case memory | Local case timeline, document store and export |
| Replies | A reply document is not automatically the information requested | Citizen compares questions, files and passages manually | Evidence-linked Reply Map |
| Procedural notices | Transfer, fee and appeal-order documents can appear in the case | A notice may be mistaken for a substantive answer | Strong document types and plain-language meaning |
| First appeal | Appeal follows the affected registration | The original number may be used for the wrong branch | Question-aware, branch-specific appeal builder |
| Second appeal | CIC requires a connected document chain | Evidence and documents must stay coherent | Indexed pack, checklist and official handoff |

These are product hypotheses grounded in documented mechanics. Only user testing can establish how often citizens fail, abandon or misunderstand each step.

## 6. The one continuous demo story

Reuse Maya's fictional fellowship case because it explains the entire value quickly.

### Starting problem

Maya says:

> “My fellowship result does not make sense. I want to know why I was not selected.”

The product explains that RTI retrieves existing records; it does not itself correct the result. It converts the goal into three editable record requests:

1. Recorded written-test, interview and total marks.
2. Approved category-wise cut-off document.
3. Calculation sheet or approval record used to determine the total seats.

### Filing simulation

- Confirm Central route.
- Select the fictional Central Fellowship Selection Board.
- Review the three numbered questions.
- Show no Aadhaar/PAN upload and no real identity collection.
- Choose non-BPL and visibly simulate a ₹10 payment.
- Generate a `DEMO/` registration and downloadable fictional receipt.

### Case progression

- The seeded process simulator forwards the questions to three CPIO sections.
- The dashboard shows the root and `/1`, `/2` branches as one case.
- Notifications and timeline explain every event in plain language.
- Replies arrive for marks, cut-off and seat-total branches.

### Reply Map and next action

- Q1 links to the exact marks table and page.
- Q2 links to the exact approved cut-off passage.
- Q3 shows the seat total but not the requested calculation sheet.
- Maya chooses **“Some information is missing.”**
- The first-appeal flow carries only Q3, the `/2` registration, the requested record and the reply passage into an editable draft.
- Simulated submission creates an appeal node.
- An FAA order and later supplemental reply update the same case.

This one story demonstrates filing, backend process, transfer/split, replies, human judgment and appeal without asking a judge to explore every feature.

## 7. Judge-ready scope

### Must work

1. No-login “Continue with demo case” entry.
2. RTI-versus-grievance and Central-versus-State fit check.
3. Five-authority fictional/source-linked directory around Maya's scenario.
4. Goal-to-Record Builder with editable numbered questions.
5. Character, privacy, BPL and mock-document preflight.
6. Clearly simulated ₹10 payment, one failure/recovery branch and a fictional receipt.
7. Unified case dashboard with current next action, timeline, documents and notifications.
8. Dependency tree with a linear-list alternative.
9. Existing evidence-linked Reply Map.
10. Citizen choices: **Got what I needed**, **Some information is missing**, **No reply**, **Access refused**, **Fee disputed**, **Review later**.
11. Relevant next step directly below the affected question.
12. Branch-specific first-appeal builder, preview, mock submission and local download.
13. Simulated FAA outcome and supplemental reply.
14. Second-appeal evidence checklist/pack plus official CIC handoff.
15. Five structurally different synthetic examples.
16. Evidence, Help, Privacy, Accessibility and About/credits content.
17. Reset demo control and local progress persistence.

### Do not spend the remaining round on

- real authentication or OTP;
- a real payment gateway;
- real SMS or email;
- scraping or calling government systems;
- full nationwide authority prediction;
- complete State RTI coverage;
- live OCR or runtime AI unless the whole deterministic journey is already finished;
- admin analytics or workload dashboards;
- a fully interactive CIC clone;
- deadline promises or automated legal conclusions.

### Internal process simulation

Reviewers test the citizen flow, so do not make an officer dashboard the main product. Use a small **“Advance demo case”** control or a hidden **Process Lab** to simulate:

- nodal assignment;
- CPIO split/transfer;
- additional-fee notice;
- reply upload;
- FAA order;
- supplemental reply.

Every simulated event must write to the same append-only case timeline so the backend thinking is visible without forcing judges into an admin product.

## 8. Information architecture

Keep primary navigation small:

```text
File RTI · My Case · Track · Appeals · Help
```

Recommended routes:

| Route | Job |
| --- | --- |
| `/` | Product purpose, independent-prototype notice and immediate demo entry |
| `/start` | RTI fit, Central/State decision and authority helper |
| `/file` | Goal-to-Record Builder and request form |
| `/file/review` | Privacy, BPL, character, file and fee review |
| `/file/payment` | Clearly simulated payment and recovery state |
| `/file/receipt` | Fictional registration, receipt and next action |
| `/case/demo-maya` | Unified citizen dashboard |
| `/case/demo-maya/timeline` | Chronological official events plus plain-language explanations |
| `/case/demo-maya/tree` | Transfer/split relationships and accessible list |
| `/case/demo-maya/replies` | Reply Map and citizen assessment |
| `/case/demo-maya/documents` | Notices, replies, annexures and orders |
| `/case/demo-maya/appeal` | Branch-specific first appeal |
| `/case/demo-maya/second-appeal` | Document pack and official CIC handoff |
| `/examples` | Five synthetic structures |
| `/evidence` | Official mechanics, public records and research caveats |
| `/help` | RTI versus grievance, glossary and common recovery states |
| `/privacy` | Synthetic/local-data statement |
| `/accessibility` | Accessibility statement and controls |
| `/about` | Credits, Codex contribution and non-affiliation |

On mobile, the main flow should feel like a single guided journey. Routes may share a compact progress stepper and persistent case switcher.

## 9. Status architecture

Never mix these layers:

1. **Official workflow event**

   Example: Received, forwarded, transferred, additional fee requested, reply received, first appeal filed.

2. **Evidence mapping**

   Example: reply passage linked to Q2; no matching passage found in the inspected substantive record.

3. **Citizen assessment**

   Example: Got what I needed; some information is missing; no reply; access refused; fee disputed; review later.

4. **Guidance**

   An editable, source-linked next-step suggestion. It is never mandatory and never a legal verdict.

The citizen supplies layer 3. The code or fixture may provide layer 2 only when it shows the exact document, page/location and passage. Neither should be presented as an officer's status.

## 10. Core domain model

| Entity | Essential fields |
| --- | --- |
| `Case` | id, title, citizenGoal, demo flag, authority, createdAt, currentAction |
| `Application` | caseId, language, BPL state, exact request text, submittedAt |
| `Question` | id, caseId, number, title, exactText, recordType |
| `Registration` | number, authority, office, parentRegistration, workflowStatus |
| `Relationship` | fromNode, toNode, type, eventDate |
| `CaseEvent` | type, time, actor, source, officialText, plainSummary |
| `Document` | type, issuer, date, registration, asset, checksum |
| `EvidencePassage` | questionId, documentId, page/location, exact passage |
| `CitizenAssessment` | questionId, choice, note, updatedAt |
| `Appeal` | type, affectedRegistration, questionIds, grounds, status |
| `Payment` | amount, BPL exemption, state, fictional reference |
| `Notification` | channel, eventId, message, createdAt, read state |
| `AuditEvent` | actor, action, object, before/after, timestamp |

Mandatory invariants:

- The case graph is rooted, connected and acyclic.
- Every appeal points to one affected registration.
- Every evidence mapping cites the document and exact location.
- Transfer notices, fee notices and FAA directions are procedural unless they also contain substantive information.
- A dated statement that no record exists is evidence; it is not the same as silence.
- “No reply” and “reply has no matching passage” are different states.
- Citizen corrections do not rewrite original records.
- All fictional identifiers begin with `DEMO`.

## 11. Hackathon architecture

Create the new website in a **new sibling directory**, for example:

```text
Varun Mayya Hackathon/
  rti-reply-map/          # current prototype; do not modify
  rti-saathi-complete/    # new website and new Sites project
```

Recommended stack:

- Vinext/React and TypeScript for a separate ChatGPT Site.
- Static-first deployment with no paid runtime dependency.
- A domain reducer/state machine for the seeded journey.
- Synthetic fixtures bundled at build time.
- Browser storage only for demo progress and preferences.
- Strict runtime validation for all seeded and imported case data.
- Browser-generated receipts and mock appeal packs.
- URL-addressable screens so refresh and direct links work.
- Repository adapters so the UI does not know whether state is local or server-backed.

```text
UI routes and feature components
            ↓
CitizenJourney reducer / domain commands
            ↓
CaseRepository interface
      ├── LocalCaseRepository        (hackathon)
      └── ApiCaseRepository          (future)
            ↓
MockGovernmentGateway + MockPaymentGateway + MockNotificationGateway
```

Suggested structure:

```text
src/
  domain/
    models/
    workflow/
    validation/
  fixtures/
    authorities/
    cases/
  adapters/
    local/
    mock-government/
  features/
    start/
    filing/
    payment/
    cases/
    reply-map/
    appeals/
    process-lab/
  components/
    forms/
    case/
    documents/
    layout/
  content/
    en/
    hi/
```

No runtime AI is required. Codex is already a meaningful build tool. If a later version adds a model, place it behind a `SuggestionService` adapter and require exact evidence, uncertainty, abstention and human confirmation.

## 12. Production evolution

The design should show that the team understands the real implementation path:

- OpenAPI-based application service.
- PostgreSQL for cases, registrations, events, questions, mappings and appeals.
- Encrypted object storage for documents.
- Background queue for OCR, notifications and document processing.
- OTP authentication and role-based authorization.
- Append-only audit log.
- Payment, email/SMS and approved government-integration adapters.
- Consent, retention, deletion, breach response and redaction services.
- Maintained procedural guidance and authority-directory ownership.
- Prompt-injection and malware handling for uploaded documents.
- Human-reviewed language content.

No graph database is required initially. Normal relational tables for nodes and edges are enough.

## 13. Visual direction

Visual thesis:

> A trustworthy Indian civic service redesigned around the citizen's case, not around department structure.

Use:

- deep navy or indigo for structure;
- restrained saffron for attention, not decoration;
- green for completed actions;
- red only for genuine errors or risk;
- white and very light neutral surfaces;
- Noto Sans plus Noto Sans Devanagari;
- formal flat cards, clear borders, modest 6–10px radii;
- strong page titles, one main action and short helper text;
- a compact accessibility/language strip;
- ordinary Indian date, rupee and phone conventions;
- fixed, human-reviewed English/Hindi core copy if both languages are offered.

Do not use:

- the State Emblem, an imitation seal or official ministry logo;
- `.gov.in` styling or a fake government domain;
- fake signatures or stamps;
- excessive gradients, glassmorphism or generic AI-dashboard styling;
- joke copy in payment, privacy, rejection or appeal moments;
- tiny metadata text.

Persistent header statement:

> Independent hackathon prototype · No official filing · Synthetic demo data

The site may be inspired by Indian public-service conventions, but it must never look endorsed.

## 14. Mobile, low-bandwidth and accessibility bar

GIGW 3.0 now emphasizes citizen-centric information architecture, mobile users and WCAG 2.1 Level AA. Say **“designed toward GIGW 3.0 and WCAG 2.1 AA”**, not “certified compliant.”

Requirements:

- Work at 320–360px without page-level horizontal scrolling.
- Use 16px or larger body text and at least 44×44px touch targets.
- Put one decision on each small screen.
- Use real labels, instructions before the field and textual correction suggestions.
- Provide an error summary plus inline errors.
- Preserve draft progress locally after refresh or connection loss.
- Give every tree a chronological/nested-list alternative.
- Support keyboard-only use, visible focus and a skip link.
- Keep heading levels correct and landmarks semantic.
- Do not communicate status using colour alone.
- Announce simulated status updates to assistive technology.
- Respect reduced motion, high contrast and 200% zoom.
- Show file type, size and privacy warning before a mock upload.
- Avoid autoplay, heavy images and animation-dependent meaning.
- Use accessible PDFs or HTML previews for generated documents.

Primary source: [GIGW 3.0](https://guidelines.india.gov.in/)

## 15. Reusable work from RTI Reply Navigator

Reuse the domain knowledge and tested behavior; redesign the product shell.

- `src/case-model.ts` — typed case contract, strict validator and tree invariants.
- `src/case-examples.ts` and `src/case-examples/*.ts` — five structurally different fictional cases.
- `src/question-actions.ts` — fee, no-reply, first-appeal and post-appeal decision logic.
- `src/coverage.ts` — summary/coverage helpers.
- `app/components/workspace/DependencyTree.tsx` — compact semantic tree behavior.
- `app/components/workspace/ReplyMapPanel.tsx` — question-to-evidence and citizen-review interaction.
- `app/components/workspace/ImportCasePanel.tsx` — strict local JSON input.
- `app/components/workspace/WhyThisExists.tsx` — carefully caveated evidence presentation.
- `tests/*.test.ts` — validation, fixture, action, tour and submission expectations.
- `public/proofs/` — selected public evidence assets with online source links.
- `submission/` — existing summary, video script and QA checklist.

The submission files describe the current focused prototype. `submission/qa-checklist.md` and `docs/ARCHITECTURE.md` still contain a few references to the older reviewed-outcome summary that was removed from the interface. Treat them as historical implementation context, not the new product contract. Rewrite the summary, script and QA checklist after the separate complete journey works.

Five fixtures to preserve:

1. Maya — parallel three-CPIO split.
2. Nisha — authority transfer followed by a split.
3. Asha — silence, first appeal, FAA order and supplemental reply.
4. Imran — substantive reply, additional-fee notice and no-reply branches.
5. Meera — one registration with multiple attachments.

Do not copy the current page composition unchanged. The new site needs a guided end-to-end journey, a new visual system and a separate deployment.

## 16. Meaningful Git and deployment rules

- Create a separate Git repository in `rti-saathi-complete`.
- Create a separate `.openai/hosting.json` and separate Sites project.
- Never reuse or overwrite the current RTI Reply Map project ID or deployment.
- Do not point the new repository at the current GitHub remote.
- If a new GitHub remote has not been provided, commit locally and ask only when the remote is actually needed.
- Keep commits outcome-based, for example:
  - `docs: define complete citizen journey and safety boundary`
  - `feat: add RTI fit check and record builder`
  - `feat: simulate filing payment and receipt`
  - `feat: add unified case timeline and reply map`
  - `feat: add branch-aware appeal pack`
  - `test: harden five synthetic journeys`
  - `docs: prepare stage-two submission`
- Deploy through the free Sites path with no paid API, database or messaging dependency.

## 17. Three-day execution plan

### 4 September — foundation and first working slice

- Create the separate directory, repository and Sites project.
- Freeze the visual system, route shell, domain state machine and Maya fixture.
- Build the first viewport around the RTI fit check—not a marketing hero.
- Complete fit check → authority → Goal-to-Record Builder.
- Show the first meaningful local preview.
- Continue through request review and mock receipt.

### 5 September — full citizen loop

- Build the unified case page, timeline, documents and notifications.
- Integrate the tested dependency tree and Reply Map concepts.
- Add the seeded split/transfer process and local persistence.
- Build citizen assessment and branch-specific first appeal.
- Add FAA outcome and supplemental reply.

### 6 September — trust, examples and deployment

- Add second-appeal pack/handoff, payment recovery and the other four fixtures.
- Add Evidence, Help, Privacy, Accessibility and credits.
- Complete mobile, keyboard, 200% zoom and low-bandwidth checks.
- Test the journey with at least three people without explaining it.
- Deploy the separate public site and record a draft two-minute video.

### 7 September — freeze and submit

- Fix only critical confusion, broken actions and accessibility defects.
- Verify the public link in a fresh browser session.
- Record the final two-minute video.
- Update the under-250-word summary.
- Resubmit before the exact mentor-provided cutoff.

## 18. Acceptance criteria

The new build is ready only when:

- A judge can complete request → receipt → split case → Reply Map → first appeal in under five minutes.
- The unique value is understandable within 90 seconds.
- Every demo control works; nothing depends on verbal explanation.
- Every case event survives refresh through local demo persistence.
- Each question can reveal its branch, document and passage.
- Appeal preparation uses the exact affected registration.
- Payment, filing, OTP, notifications and officer actions are visibly simulated.
- No screen can be mistaken for a real government submission.
- All five fixtures pass the same domain validator.
- No procedural document is treated as a substantive reply.
- The core journey works at 360px and with keyboard-only navigation.
- The tree has a readable list alternative.
- There are no dead links, placeholders, fake counts or unexplained statuses.
- A novice tester can repeat this sentence:

> “The official portal tracks registrations. RTI Saathi keeps the citizen's whole case understandable.”

## 19. Claims and safety checklist

Always say:

- independent prototype;
- synthetic/demo data;
- no official filing or payment;
- no government affiliation;
- evidence mapping is not a legal verdict;
- citizen confirmation is required;
- official sources can change.

Never say:

- official, approved or government-secured;
- every RTI branches;
- every transfer indicates user error;
- the current portal has no tracking/history;
- the prototype knows that a reply violates the Act;
- an appeal is guaranteed to succeed;
- a universal deadline applies to every case;
- real credentials or documents are safe to enter.

## 20. Source pack for the new chat

Read these files before implementation:

1. `docs/COMPLETE-SITE-HANDOFF.md` — this product contract.
2. `docs/NEW-CHAT-PROMPT.md` — copy-paste starting instruction.
3. `../STATEMENT.md` — validated Reply Map problem and evidence boundaries.
4. `../research/fragments/10-rti-online.json` — six-pain-point research record and sources.
5. `../research/rti-screenshot-evidence/judge-ready/README.md` — proof sequence and claims to avoid.
6. `src/case-model.ts` — tested schema and validation rules.
7. `src/case-examples.ts` plus `src/case-examples/*.ts` — five cases.
8. `src/question-actions.ts` — current next-step logic.
9. `docs/ARCHITECTURE.md` — current trust boundary and extension rules.
10. `submission/project-summary.md`, `submission/demo-script.md` and `submission/qa-checklist.md` — current prototype assets; regenerate them for the new build and ignore stale reviewed-outcome references.

The new chat should treat this document as the current source of truth when an older planning file conflicts with it.
