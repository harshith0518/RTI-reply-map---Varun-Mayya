import {
  CASE_EDGE_KINDS,
  CASE_NODE_KINDS,
  CASE_SCHEMA_VERSION,
  type RTICaseData,
} from './case-model.ts';

export const CASE_JSON_TEMPLATE: RTICaseData = {
  schemaVersion: CASE_SCHEMA_VERSION,
  caseId: 'redacted-example-case',
  source: 'custom',
  fictional: true,
  title: 'Redacted RTI case title',
  citizenName: 'Citizen',
  citizenGoal: 'Understand which supplied record answers the original question.',
  scenario: 'One application, one registration, and one reply.',
  painPoint: 'The requested record is difficult to locate inside the reply package.',
  filedOn: '2026-01-10',
  authority: 'Redacted public authority',
  rootNodeId: 'application-1',
  structureLabel: 'Single registration and reply',
  tags: ['single reply', 'redacted'],
  questions: [
    {
      id: 'q1',
      number: 1,
      title: 'Requested record',
      text: 'Provide a copy of the requested record.',
    },
  ],
  nodes: [
    {
      id: 'application-1',
      kind: 'application',
      title: 'Original RTI application',
      summary: 'The redacted request as filed.',
      date: '2026-01-10',
      status: 'Filed',
      questionIds: ['q1'],
    },
    {
      id: 'registration-1',
      kind: 'registration',
      title: 'CPIO registration',
      summary: 'The application was registered by the responsible office.',
      date: '2026-01-12',
      status: 'Registered',
      office: 'Redacted office',
      registrationNumber: 'REDACTED/RTI/001',
      questionIds: ['q1'],
    },
    {
      id: 'reply-1',
      kind: 'reply',
      title: 'Substantive reply',
      summary: 'A reply document was received.',
      date: '2026-02-05',
      status: 'Reply received',
      registrationNumber: 'REDACTED/RTI/001',
      questionIds: ['q1'],
      documentIds: ['document-1'],
    },
  ],
  edges: [
    {
      id: 'edge-1',
      from: 'application-1',
      to: 'registration-1',
      kind: 'registered_as',
      label: 'Registered as',
    },
    {
      id: 'edge-2',
      from: 'registration-1',
      to: 'reply-1',
      kind: 'replied_with',
      label: 'Reply received',
    },
  ],
  documents: [
    {
      id: 'document-1',
      title: 'Redacted reply',
      kind: 'substantive_reply',
      fileName: 'redacted-reply.pdf',
      registrationNumber: 'REDACTED/RTI/001',
      issuedOn: '2026-02-05',
    },
  ],
  mappings: [
    {
      id: 'mapping-q1',
      questionId: 'q1',
      nodeId: 'reply-1',
      documentId: 'document-1',
      registrationNumber: 'REDACTED/RTI/001',
      coverage: 'answer_located',
      passage: 'Insert an exact short passage from the redacted reply here.',
      location: 'Page 1, paragraph 2',
      confidence: 'high',
      explanation: 'Explain factually how this passage addresses the question.',
    },
  ],
};

const schemaGuide = {
  schemaVersion: CASE_SCHEMA_VERSION,
  source: 'custom',
  nodeKinds: CASE_NODE_KINDS,
  edgeKinds: CASE_EDGE_KINDS,
  documentKinds: [
    'substantive_reply',
    'supplemental_reply',
    'transfer_notice',
    'appeal_order',
    'fee_notice',
    'attachment',
  ],
  coverage: [
    'answer_located',
    'partially_addressed',
    'no_matching_passage',
    'needs_human_review',
  ],
  confidence: ['high', 'medium', 'low'],
};

export const CUSTOM_CASE_PROMPT = `You are preparing one redacted RTI case for a local visualisation called RTI Reply Navigator.

PRIVACY FIRST
- Before doing anything, tell me if the supplied material still contains names, addresses, phone numbers, email addresses, Aadhaar or other identity numbers, signatures, bank details, or any personal identifier. Ask me to redact it. Do not repeat those details.
- Use "Citizen" and neutral labels when an identity is not needed.

OUTPUT RULES
- After the records are safely redacted, output exactly one JSON object and nothing else. Do not use Markdown fences.
- Use schemaVersion "${CASE_SCHEMA_VERSION}" and source "custom".
- Set fictional to false for a real redacted case. Use true only when every record and person is synthetic.
- Never invent a date, registration number, office, relationship, passage, page, or missing fact. Use a cautious neutral label when a display field is unknown.
- Keep the structure a dependency tree: one root application; every other node has exactly one parent; no cycles; every ID is unique; every reference points to an existing item.
- Model each registration, transfer, reply, no-reply observation, fee notice, payment, appeal, appeal order, and supplemental reply as its own dated node when the record supports it.
- A transfer notice, fee notice, or appeal order is procedural. Never treat it as evidence that an original information request was answered.
- Create exactly one mapping per original question.
- For answer_located or partially_addressed, include documentId, an exact short passage, and a precise page or attachment location. Do not paraphrase inside passage.
- Use no_matching_passage only when a substantive reply was actually inspected and contains no relevant passage.
- Use needs_human_review when no substantive reply is available or the evidence is insufficient.
- An explicit dated statement that no record exists may be answer_located; preserve the date/time qualifier and explain that this is an answer passage, not proof of legal compliance.
- Do not make a legal-compliance verdict and do not advise whether an appeal must be filed.
- Do not include assetPath or embed files/base64 data.
- Before returning JSON, check every exact passage, page, date, registration number, and relationship against the supplied redacted records. The RTI Reply Navigator website validates structure and references; it cannot inspect the source PDFs or verify factual accuracy.

ALLOWED VALUES
${JSON.stringify(schemaGuide, null, 2)}

SHAPE EXAMPLE
Replace every example value using only the redacted records. Keep the same field names and omit optional fields only when they do not apply:
${JSON.stringify(CASE_JSON_TEMPLATE, null, 2)}

Now wait for the redacted RTI application, registration/transfer notices, replies, fee notices, appeals, appeal orders, and attachments. Then return the single JSON object.`;
