import type { RTICaseData } from '../case-model.ts';

export const imranMixedPendingCase: RTICaseData = {
  schemaVersion: '1.0',
  caseId: 'imran-fee-and-no-reply',
  source: 'synthetic',
  fictional: true,
  title: 'Station accessibility-lift records',
  citizenName: 'Imran',
  citizenGoal: 'Understand repeated accessibility-lift outages at a fictional Central railway station.',
  scenario: 'Engineering sent records, Operations sent only an additional-fee notice, and Finance had no reply document.',
  painPoint: 'Two questions can look equally unanswered even though one has an active procedural fee step and the other has no reply at all. Those states lead to different evidence gaps.',
  filedOn: '2026-04-03',
  authority: 'Central Rail Passenger Facilities Directorate (fictional)',
  rootNodeId: 'imran-application',
  structureLabel: 'Mixed reply, fee, and silence',
  tags: ['additional fee', 'no reply', 'procedural vs substantive'],
  questions: [
    { id: 'imran-q1', number: 1, title: 'Maintenance contract', text: 'Provide the lift-maintenance contract and recorded monthly uptime obligation.' },
    { id: 'imran-q2', number: 2, title: 'Inspection logs', text: 'Provide the monthly lift-inspection logs from January to March 2026.' },
    { id: 'imran-q3', number: 3, title: 'Penalty deductions', text: 'Provide records of penalties or payment deductions for lift downtime.' },
  ],
  nodes: [
    { id: 'imran-application', kind: 'application', title: 'Original RTI application', summary: 'Imran asks for maintenance, inspection, and penalty records.', date: '2026-04-03', status: 'Filed', questionIds: ['imran-q1', 'imran-q2', 'imran-q3'] },
    { id: 'imran-engineering-registration', kind: 'registration', title: 'Engineering branch', summary: 'Receives the maintenance-contract question.', date: '2026-04-05', status: 'Reply received', office: 'Station Engineering section', registrationNumber: 'DEMO/CRPFD/R/E/26/00642', questionIds: ['imran-q1'] },
    { id: 'imran-engineering-reply', kind: 'reply', title: 'Engineering reply', summary: 'Supplies the contract and uptime obligation.', date: '2026-04-20', status: 'Substantive reply', registrationNumber: 'DEMO/CRPFD/R/E/26/00642', questionIds: ['imran-q1'], documentIds: ['imran-engineering-doc'] },
    { id: 'imran-operations-registration', kind: 'registration', title: 'Operations branch', summary: 'Receives the inspection-log question.', date: '2026-04-05', status: 'Additional fee requested', office: 'Station Operations section', registrationNumber: 'DEMO/CRPFD/R/E/26/00642/1', questionIds: ['imran-q2'] },
    { id: 'imran-fee-notice', kind: 'fee_notice', title: 'Additional-fee notice', summary: 'A procedural notice estimates copying charges. The inspection logs themselves are not yet available in this case.', date: '2026-04-18', status: 'Procedure pending', registrationNumber: 'DEMO/CRPFD/R/E/26/00642/1', questionIds: ['imran-q2'], documentIds: ['imran-fee-doc'] },
    { id: 'imran-finance-registration', kind: 'registration', title: 'Finance branch', summary: 'Receives the penalty-deduction question.', date: '2026-04-05', status: 'No reply available', office: 'Contract Finance section', registrationNumber: 'DEMO/CRPFD/R/E/26/00642/2', questionIds: ['imran-q3'] },
    { id: 'imran-no-reply', kind: 'no_reply', title: 'No Finance reply', summary: 'No reply document was available for the Finance registration as of the case date.', date: '2026-05-05', status: 'No reply observed', registrationNumber: 'DEMO/CRPFD/R/E/26/00642/2', questionIds: ['imran-q3'] },
  ],
  edges: [
    { id: 'imran-e1', from: 'imran-application', to: 'imran-engineering-registration', kind: 'split_to', label: 'Question 1 forwarded' },
    { id: 'imran-e2', from: 'imran-engineering-registration', to: 'imran-engineering-reply', kind: 'replied_with', label: 'Substantive reply' },
    { id: 'imran-e3', from: 'imran-application', to: 'imran-operations-registration', kind: 'split_to', label: 'Question 2 forwarded' },
    { id: 'imran-e4', from: 'imran-operations-registration', to: 'imran-fee-notice', kind: 'fee_requested', label: 'Fee notice only' },
    { id: 'imran-e5', from: 'imran-application', to: 'imran-finance-registration', kind: 'split_to', label: 'Question 3 forwarded' },
    { id: 'imran-e6', from: 'imran-finance-registration', to: 'imran-no-reply', kind: 'no_reply_observed', label: 'No reply document' },
  ],
  documents: [
    { id: 'imran-engineering-doc', title: 'Engineering maintenance reply', kind: 'substantive_reply', fileName: 'imran-engineering-reply.pdf', registrationNumber: 'DEMO/CRPFD/R/E/26/00642', issuedOn: '2026-04-20' },
    { id: 'imran-fee-doc', title: 'Operations additional-fee intimation', kind: 'fee_notice', fileName: 'imran-additional-fee-notice.pdf', registrationNumber: 'DEMO/CRPFD/R/E/26/00642/1', issuedOn: '2026-04-18' },
  ],
  mappings: [
    { id: 'imran-map-q1', questionId: 'imran-q1', nodeId: 'imran-engineering-reply', documentId: 'imran-engineering-doc', registrationNumber: 'DEMO/CRPFD/R/E/26/00642', coverage: 'answer_located', passage: 'Contract DEMO-LIFT-AMC-12 requires preventive maintenance twice each month and records a minimum monthly service-availability target of 98 per cent.', location: 'Page 2 · Contract schedule', confidence: 'high', explanation: 'The substantive reply contains both the contract reference and recorded uptime obligation.' },
    { id: 'imran-map-q2', questionId: 'imran-q2', nodeId: 'imran-fee-notice', documentId: 'imran-fee-doc', registrationNumber: 'DEMO/CRPFD/R/E/26/00642/1', coverage: 'needs_human_review', confidence: 'low', explanation: 'Only a procedural additional-fee notice is present; the requested inspection logs are not available to examine.', missingDetail: 'No substantive reply or inspection-log pages are present in the case package.' },
    { id: 'imran-map-q3', questionId: 'imran-q3', nodeId: 'imran-no-reply', registrationNumber: 'DEMO/CRPFD/R/E/26/00642/2', coverage: 'needs_human_review', confidence: 'low', explanation: 'The responsible Finance branch has no reply document available to assess.', missingDetail: 'No reply document, penalty record, or explicit no-record statement is available.' },
  ],
};
