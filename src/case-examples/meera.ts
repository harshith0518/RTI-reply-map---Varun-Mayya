import type { RTICaseData } from '../case-model.ts';

export const meeraConsolidatedCase: RTICaseData = {
  schemaVersion: '1.0',
  caseId: 'meera-consolidated-package',
  source: 'synthetic',
  fictional: true,
  title: 'Pension revision and arrears records',
  citizenName: 'Meera',
  citizenGoal: 'Understand how a fictional pension revision and arrears amount were calculated.',
  scenario: 'One registration produced one consolidated reply package with a cover letter and two annexures—no transfer and no split.',
  painPoint: 'Even a simple case can hide one incomplete answer across several attachments. The product must work without inventing branches just to make the tree look impressive.',
  filedOn: '2026-05-12',
  authority: 'Central Pension Records Office (fictional)',
  rootNodeId: 'meera-application',
  structureLabel: 'Single chain, many attachments',
  tags: ['single registration', 'consolidated reply', 'attachment synthesis'],
  questions: [
    { id: 'meera-q1', number: 1, title: 'Revision calculation', text: 'Provide the calculation sheet used to revise the basic pension.' },
    { id: 'meera-q2', number: 2, title: 'Effective date', text: 'Provide the order or record showing the effective date of the revision.' },
    { id: 'meera-q3', number: 3, title: 'Monthly arrears breakup', text: 'Provide a month-wise breakup of arrears credited after revision.' },
  ],
  nodes: [
    { id: 'meera-application', kind: 'application', title: 'Original RTI application', summary: 'Meera asks three questions about one pension revision.', date: '2026-05-12', status: 'Filed', questionIds: ['meera-q1', 'meera-q2', 'meera-q3'] },
    { id: 'meera-registration', kind: 'registration', title: 'Pension Records registration', summary: 'One CPIO retains all three questions under a single registration.', date: '2026-05-12', status: 'Reply received', office: 'Pension Revision section', registrationNumber: 'DEMO/CPRO/R/E/26/00309', questionIds: ['meera-q1', 'meera-q2', 'meera-q3'] },
    { id: 'meera-reply', kind: 'reply', title: 'Consolidated reply package', summary: 'The cover letter and two annexures are delivered together under one registration.', date: '2026-06-03', status: 'Substantive reply', registrationNumber: 'DEMO/CPRO/R/E/26/00309', questionIds: ['meera-q1', 'meera-q2', 'meera-q3'], documentIds: ['meera-cover-doc', 'meera-calculation-doc', 'meera-arrears-doc'] },
  ],
  edges: [
    { id: 'meera-e1', from: 'meera-application', to: 'meera-registration', kind: 'registered_as', label: 'Single registration' },
    { id: 'meera-e2', from: 'meera-registration', to: 'meera-reply', kind: 'replied_with', label: 'One reply package' },
  ],
  documents: [
    { id: 'meera-cover-doc', title: 'Pension revision cover reply', kind: 'substantive_reply', fileName: 'meera-pension-reply.pdf', registrationNumber: 'DEMO/CPRO/R/E/26/00309', issuedOn: '2026-06-03' },
    { id: 'meera-calculation-doc', title: 'Revision calculation sheet', kind: 'attachment', fileName: 'meera-annexure-a-calculation.pdf', registrationNumber: 'DEMO/CPRO/R/E/26/00309', issuedOn: '2026-06-03' },
    { id: 'meera-arrears-doc', title: 'Arrears summary', kind: 'attachment', fileName: 'meera-annexure-b-arrears.pdf', registrationNumber: 'DEMO/CPRO/R/E/26/00309', issuedOn: '2026-06-03' },
  ],
  mappings: [
    { id: 'meera-map-q1', questionId: 'meera-q1', nodeId: 'meera-reply', documentId: 'meera-calculation-doc', registrationNumber: 'DEMO/CPRO/R/E/26/00309', coverage: 'answer_located', passage: 'Revised basic pension: Rs. 24,600, calculated from notional pay of Rs. 49,200 at the recorded pension factor of 50 per cent.', location: 'Annexure A · Page 1', confidence: 'high', explanation: 'The annexure provides the calculation inputs and result.' },
    { id: 'meera-map-q2', questionId: 'meera-q2', nodeId: 'meera-reply', documentId: 'meera-cover-doc', registrationNumber: 'DEMO/CPRO/R/E/26/00309', coverage: 'answer_located', passage: 'The revised pension is effective from 1 January 2026 under Demo Revision Order 14/2026.', location: 'Cover reply · Page 1', confidence: 'high', explanation: 'The cover reply identifies both the effective date and order.' },
    { id: 'meera-map-q3', questionId: 'meera-q3', nodeId: 'meera-reply', documentId: 'meera-arrears-doc', registrationNumber: 'DEMO/CPRO/R/E/26/00309', coverage: 'partially_addressed', passage: 'Total arrears credited for the period January to May 2026: Rs. 18,450.', location: 'Annexure B · Page 1', confidence: 'medium', explanation: 'The annexure gives a lump-sum total but not the requested month-wise breakup.', missingDetail: 'No month-by-month table or calculation appears in the reply package.' },
  ],
};
