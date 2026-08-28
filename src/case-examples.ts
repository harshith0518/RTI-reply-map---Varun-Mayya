import type { RTICaseData } from './case-model.ts';
import { ashaAppealCase } from './case-examples/asha.ts';
import { imranMixedPendingCase } from './case-examples/imran.ts';
import { meeraConsolidatedCase } from './case-examples/meera.ts';
import { nishaTransferCase } from './case-examples/nisha.ts';

export const mayaParallelCase: RTICaseData = {
  schemaVersion: '1.0',
  caseId: 'maya-parallel-split',
  source: 'synthetic',
  fictional: true,
  title: 'Fellowship selection records',
  citizenName: 'Maya',
  citizenGoal: 'Find the records behind her fellowship result.',
  scenario: 'One application was forwarded to three CPIO sections, producing three registrations and three separate replies.',
  painPoint: 'Maya must open every registration and manually remember which reply addresses marks, the approved cut-off, and the seat calculation.',
  filedOn: '2026-06-02',
  authority: 'Central Fellowship Selection Board (fictional)',
  rootNodeId: 'maya-application',
  structureLabel: 'Three-way parallel split',
  tags: ['parallel split', 'three replies', 'partial answer'],
  questions: [
    { id: 'maya-q1', number: 1, title: 'Marks record', text: 'Provide the written-test marks, interview marks, and total marks recorded for application DEMO-024.' },
    { id: 'maya-q2', number: 2, title: 'Approved cut-off', text: 'Provide the approved category-wise cut-off document used for the 2026 selection.' },
    { id: 'maya-q3', number: 3, title: 'Seat calculation', text: 'Provide the calculation sheet or approval record showing how the total number of seats was determined.' },
  ],
  nodes: [
    { id: 'maya-application', kind: 'application', title: 'Original RTI application', summary: 'Maya asks for three groups of fellowship-selection records.', date: '2026-06-02', status: 'Filed', questionIds: ['maya-q1', 'maya-q2', 'maya-q3'] },
    { id: 'maya-results-branch', kind: 'registration', title: 'Results section', summary: 'Owns the marks-record question.', date: '2026-06-04', status: 'Reply received', office: 'Results section', registrationNumber: 'DEMO/CFSB/R/E/26/00421', questionIds: ['maya-q1'] },
    { id: 'maya-results-reply', kind: 'reply', title: 'Marks-table reply', summary: 'Provides the candidate marks table.', date: '2026-06-18', status: 'Substantive reply', registrationNumber: 'DEMO/CFSB/R/E/26/00421', questionIds: ['maya-q1'], documentIds: ['maya-results-doc'] },
    { id: 'maya-policy-branch', kind: 'registration', title: 'Selection Policy section', summary: 'Owns the approved cut-off question.', date: '2026-06-04', status: 'Reply received', office: 'Selection Policy section', registrationNumber: 'DEMO/CFSB/R/E/26/00421/1', questionIds: ['maya-q2'] },
    { id: 'maya-policy-reply', kind: 'reply', title: 'Cut-off attachment reply', summary: 'Encloses the approved cut-off attachment.', date: '2026-06-21', status: 'Substantive reply', registrationNumber: 'DEMO/CFSB/R/E/26/00421/1', questionIds: ['maya-q2'], documentIds: ['maya-cutoff-doc'] },
    { id: 'maya-planning-branch', kind: 'registration', title: 'Planning and Finance section', summary: 'Owns the seat-calculation question.', date: '2026-06-04', status: 'Reply received', office: 'Planning and Finance section', registrationNumber: 'DEMO/CFSB/R/E/26/00421/2', questionIds: ['maya-q3'] },
    { id: 'maya-planning-reply', kind: 'reply', title: 'Seat-total reply', summary: 'States the final seat total but does not include the requested calculation record.', date: '2026-06-26', status: 'Substantive reply', registrationNumber: 'DEMO/CFSB/R/E/26/00421/2', questionIds: ['maya-q3'], documentIds: ['maya-vacancy-doc'] },
  ],
  edges: [
    { id: 'maya-edge-results', from: 'maya-application', to: 'maya-results-branch', kind: 'split_to', label: 'Forwarded in parallel' },
    { id: 'maya-edge-results-reply', from: 'maya-results-branch', to: 'maya-results-reply', kind: 'replied_with', label: 'Reply received' },
    { id: 'maya-edge-policy', from: 'maya-application', to: 'maya-policy-branch', kind: 'split_to', label: 'Forwarded in parallel' },
    { id: 'maya-edge-policy-reply', from: 'maya-policy-branch', to: 'maya-policy-reply', kind: 'replied_with', label: 'Reply received' },
    { id: 'maya-edge-planning', from: 'maya-application', to: 'maya-planning-branch', kind: 'split_to', label: 'Forwarded in parallel' },
    { id: 'maya-edge-planning-reply', from: 'maya-planning-branch', to: 'maya-planning-reply', kind: 'replied_with', label: 'Reply received' },
  ],
  documents: [
    { id: 'maya-results-doc', title: 'Results section reply', kind: 'substantive_reply', fileName: 'maya-results-reply.pdf', registrationNumber: 'DEMO/CFSB/R/E/26/00421', issuedOn: '2026-06-18', assetPath: '/replies/maya-results-reply.pdf' },
    { id: 'maya-cutoff-doc', title: 'Selection Policy reply', kind: 'substantive_reply', fileName: 'maya-cutoff-reply.pdf', registrationNumber: 'DEMO/CFSB/R/E/26/00421/1', issuedOn: '2026-06-21', assetPath: '/replies/maya-cutoff-reply.pdf' },
    { id: 'maya-vacancy-doc', title: 'Planning and Finance reply', kind: 'substantive_reply', fileName: 'maya-vacancy-reply.pdf', registrationNumber: 'DEMO/CFSB/R/E/26/00421/2', issuedOn: '2026-06-26', assetPath: '/replies/maya-vacancy-reply.pdf' },
  ],
  mappings: [
    { id: 'maya-map-q1', questionId: 'maya-q1', nodeId: 'maya-results-reply', documentId: 'maya-results-doc', registrationNumber: 'DEMO/CFSB/R/E/26/00421', coverage: 'answer_located', passage: 'Application DEMO-024 — Written test: 62/80; Interview: 16/20; Total recorded score: 78/100.', location: 'Page 2 · Candidate marks table', confidence: 'high', explanation: 'The requested written-test, interview, and total marks appear in the table.' },
    { id: 'maya-map-q2', questionId: 'maya-q2', nodeId: 'maya-policy-reply', documentId: 'maya-cutoff-doc', registrationNumber: 'DEMO/CFSB/R/E/26/00421/1', coverage: 'answer_located', passage: 'Approved 2026 selection cut-off — Demonstration Category B: 74 marks. Approved by the Fellowship Selection Committee on 14 May 2026.', location: 'Attachment 1 · Page 1', confidence: 'high', explanation: 'The approved category cut-off and approval date appear in the attachment.' },
    { id: 'maya-map-q3', questionId: 'maya-q3', nodeId: 'maya-planning-reply', documentId: 'maya-vacancy-doc', registrationNumber: 'DEMO/CFSB/R/E/26/00421/2', coverage: 'partially_addressed', passage: 'The final fellowship notification records a total of 120 seats. The notification is enclosed as Annexure A.', location: 'Page 1 and Annexure A', confidence: 'medium', explanation: 'The reply states the final total, but it does not provide the requested calculation sheet or approval record.', missingDetail: 'No calculation sheet, formula, file noting, or approval record explaining the total was located.' },
  ],
};

export const EXAMPLE_CASES: RTICaseData[] = [
  mayaParallelCase,
  nishaTransferCase,
  ashaAppealCase,
  imranMixedPendingCase,
  meeraConsolidatedCase,
];
