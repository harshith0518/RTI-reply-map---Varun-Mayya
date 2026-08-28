import type { CaseFixture } from './domain';

export const mayaFixture: CaseFixture = {
  id: 'maya',
  citizenName: 'Maya',
  fictional: true,
  title: 'Fellowship selection records',
  filedOn: '2026-06-02',
  authorityName: 'Central Fellowship Selection Board (fictional)',
  questions: [
    {
      id: 'maya-q1',
      number: 1,
      shortTitle: 'Marks record',
      text: 'Provide the record showing the written-test marks, interview marks, and total marks awarded to application DEMO-024.',
      responsibleBranchId: 'DEMO/CFSB/R/E/26/00421',
    },
    {
      id: 'maya-q2',
      number: 2,
      shortTitle: 'Approved cut-off',
      text: 'Provide a copy of the approved category-wise cut-off document used for the 2026 fellowship selection.',
      responsibleBranchId: 'DEMO/CFSB/R/E/26/00421/1',
    },
    {
      id: 'maya-q3',
      number: 3,
      shortTitle: 'Seat calculation record',
      text: 'Provide the calculation sheet or approval record showing how the total number of 2026 fellowship seats was determined.',
      responsibleBranchId: 'DEMO/CFSB/R/E/26/00421/2',
    },
  ],
  branches: [
    {
      id: 'DEMO/CFSB/R/E/26/00421',
      authorityId: 'cfsb',
      office: 'Results section',
      role: 'request_branch',
      questionIds: ['maya-q1'],
      status: 'Reply received · 18 Jun 2026',
    },
    {
      id: 'DEMO/CFSB/R/E/26/00421/1',
      authorityId: 'cfsb',
      office: 'Selection Policy section',
      role: 'request_branch',
      questionIds: ['maya-q2'],
      status: 'Reply received · 21 Jun 2026',
    },
    {
      id: 'DEMO/CFSB/R/E/26/00421/2',
      authorityId: 'cfsb',
      office: 'Planning and Finance section',
      role: 'request_branch',
      questionIds: ['maya-q3'],
      status: 'Reply received · 26 Jun 2026',
    },
  ],
  events: [
    { id: 'maya-filed', sequence: 1, occurredOn: '2026-06-02', kind: 'application_filed' },
    {
      id: 'maya-split',
      sequence: 2,
      occurredOn: '2026-06-04',
      kind: 'parallel_split',
      topology: 'parallel',
    },
    { id: 'maya-reply-1', sequence: 3, occurredOn: '2026-06-18', kind: 'reply_received', branchId: 'DEMO/CFSB/R/E/26/00421', documentId: 'maya-results' },
    { id: 'maya-reply-2', sequence: 4, occurredOn: '2026-06-21', kind: 'reply_received', branchId: 'DEMO/CFSB/R/E/26/00421/1', documentId: 'maya-cutoff' },
    { id: 'maya-reply-3', sequence: 5, occurredOn: '2026-06-26', kind: 'reply_received', branchId: 'DEMO/CFSB/R/E/26/00421/2', documentId: 'maya-vacancy' },
  ],
  documents: [
    { id: 'maya-results', kind: 'substantive_reply', coverageRole: 'substantive', branchId: 'DEMO/CFSB/R/E/26/00421', availableOn: '2026-06-18', title: 'Results branch reply', fileName: 'maya-results-reply.pdf' },
    { id: 'maya-cutoff', kind: 'substantive_reply', coverageRole: 'substantive', branchId: 'DEMO/CFSB/R/E/26/00421/1', availableOn: '2026-06-21', title: 'Selection Policy reply', fileName: 'maya-cutoff-reply.pdf' },
    { id: 'maya-vacancy', kind: 'substantive_reply', coverageRole: 'substantive', branchId: 'DEMO/CFSB/R/E/26/00421/2', availableOn: '2026-06-26', title: 'Planning and Finance reply', fileName: 'maya-vacancy-reply.pdf' },
  ],
  evidence: [
    {
      id: 'maya-q1-marks', questionId: 'maya-q1', documentId: 'maya-results', branchId: 'DEMO/CFSB/R/E/26/00421', signal: 'direct_record',
      quote: 'Application DEMO-024 — Written test: 62/80; Interview: 16/20; Total recorded score: 78/100.',
      location: { label: 'Page 2 · Candidate marks table', pages: [2] },
      explanation: 'The requested written-test, interview, and total marks appear in the table.',
    },
    {
      id: 'maya-q2-cutoff', questionId: 'maya-q2', documentId: 'maya-cutoff', branchId: 'DEMO/CFSB/R/E/26/00421/1', signal: 'direct_record',
      quote: 'Approved 2026 selection cut-off — Demonstration Category B: 74 marks. Approved by the Fellowship Selection Committee on 14 May 2026.',
      location: { label: 'Attachment 1 · Page 1', pages: [1], attachment: 'Attachment 1' },
      explanation: 'The approved category cut-off and approval date appear in the attachment.',
    },
    {
      id: 'maya-q3-total', questionId: 'maya-q3', documentId: 'maya-vacancy', branchId: 'DEMO/CFSB/R/E/26/00421/2', signal: 'partial_record',
      quote: 'The final fellowship notification records a total of 120 seats. The notification is enclosed as Annexure A.',
      location: { label: 'Page 1 and Annexure A', pages: [1] },
      explanation: 'The reply states the final total, but it does not provide the requested calculation sheet or approval record.',
      missingDetail: 'No calculation sheet, formula, note, or approval record explaining how 120 seats was determined was located.',
    },
  ],
};

export const nishaFixture: CaseFixture = {
  id: 'nisha', citizenName: 'Nisha', fictional: true, title: 'Scholarship records', filedOn: '2026-07-07', authorityName: 'Ministry of Education then Central Skills University (fictional)',
  questions: [
    { id: 'nisha-q1', number: 1, shortTitle: 'Evaluation sheet', text: 'Provide the evaluation score sheet for DEMO-SCH-117.', responsibleBranchId: 'DEMO/CSU/R/E/26/00208' },
    { id: 'nisha-q2', number: 2, shortTitle: 'Sanction-list entry', text: 'Provide the approved scholarship sanction-list entry for DEMO-SCH-117.', responsibleBranchId: 'DEMO/CSU/R/E/26/00208/1' },
    { id: 'nisha-q3', number: 3, shortTitle: 'Release records', text: 'Provide the fund-release order and transaction reference, if such records exist.', responsibleBranchId: 'DEMO/CSU/R/E/26/00208/1' },
  ],
  branches: [
    { id: 'DEMO/MOE/R/E/26/01017', authorityId: 'moe', office: 'Ministry transfer source', role: 'transfer_source', questionIds: [], status: 'Transferred · 9 Jul 2026' },
    { id: 'DEMO/CSU/R/E/26/00208', authorityId: 'csu', office: 'Scholarship Evaluation section', role: 'request_branch', questionIds: ['nisha-q1'], status: 'Reply received · 25 Jul 2026' },
    { id: 'DEMO/CSU/R/E/26/00208/1', authorityId: 'csu', office: 'Scholarship Finance section', role: 'request_branch', questionIds: ['nisha-q2', 'nisha-q3'], status: 'Reply received · 29 Jul 2026' },
  ],
  events: [
    { id: 'nisha-transfer', sequence: 1, occurredOn: '2026-07-09', kind: 'authority_transfer', topology: 'serial', fromRegistrationId: 'DEMO/MOE/R/E/26/01017', toRegistrationId: 'DEMO/CSU/R/E/26/00208', documentId: 'nisha-transfer-notice' },
    { id: 'nisha-split', sequence: 2, occurredOn: '2026-07-11', kind: 'parallel_split', topology: 'parallel' },
  ],
  documents: [
    { id: 'nisha-transfer-notice', kind: 'transfer_notice', coverageRole: 'procedural', branchId: 'DEMO/MOE/R/E/26/01017', availableOn: '2026-07-09', title: 'Authority transfer notice' },
    { id: 'nisha-evaluation', kind: 'substantive_reply', coverageRole: 'substantive', branchId: 'DEMO/CSU/R/E/26/00208', availableOn: '2026-07-25', title: 'Evaluation reply', fileName: 'nisha-evaluation-reply.pdf' },
    { id: 'nisha-finance', kind: 'substantive_reply', coverageRole: 'substantive', branchId: 'DEMO/CSU/R/E/26/00208/1', availableOn: '2026-07-29', title: 'Finance reply', fileName: 'nisha-finance-reply.pdf' },
  ],
  evidence: [
    { id: 'nisha-q1-score', questionId: 'nisha-q1', documentId: 'nisha-evaluation', branchId: 'DEMO/CSU/R/E/26/00208', signal: 'direct_record', quote: 'Application DEMO-SCH-117 — Academic score: 47/50; Need score: 35/40; Verification score: 8/10; Total evaluation score: 90/100.', location: { label: 'Page 3', pages: [3] }, explanation: 'The score components and total are present.' },
    { id: 'nisha-q2-sanction', questionId: 'nisha-q2', documentId: 'nisha-finance', branchId: 'DEMO/CSU/R/E/26/00208/1', signal: 'direct_record', quote: 'Sanction List 2026-B, Entry 44: Application DEMO-SCH-117 — Approved amount: Rs. 36,000.', location: { label: 'Annexure B · Page 2', pages: [2], attachment: 'Annexure B' }, explanation: 'The applicant entry and approved amount are present.' },
    { id: 'nisha-q3-no-release', questionId: 'nisha-q3', documentId: 'nisha-finance', branchId: 'DEMO/CSU/R/E/26/00208/1', signal: 'explicit_no_record', quote: 'As of 28 July 2026, no fund-release order or bank transaction reference has been generated for Entry 44.', location: { label: 'Page 1', pages: [1] }, explanation: 'The passage addresses the question by explicitly stating that neither requested record had been generated as of the stated date.', temporalQualifier: { text: 'As of 28 July 2026', asOf: '2026-07-28' } },
  ],
};

export const ashaFixture: CaseFixture = {
  id: 'asha', citizenName: 'Asha', fictional: true, title: 'Road-work records', filedOn: '2026-01-05', authorityName: 'Central Highway Works Directorate (fictional)',
  questions: [
    { id: 'asha-q1', number: 1, shortTitle: 'Work order', text: 'Provide the signed work order and approved contract value.', responsibleBranchId: 'DEMO/CHWD/R/E/26/00810' },
    { id: 'asha-q2', number: 2, shortTitle: 'Inspection records', text: 'Provide inspection reports and material-test results.', responsibleBranchId: 'DEMO/CHWD/R/E/26/00810/1' },
    { id: 'asha-q3', number: 3, shortTitle: 'Measurement book', text: 'Provide the relevant measurement-book extracts.', responsibleBranchId: 'DEMO/CHWD/R/E/26/00810/1' },
    { id: 'asha-q4', number: 4, shortTitle: 'Penalty records', text: 'Provide penalty or payment-deduction orders, or a record stating none was issued.', responsibleBranchId: 'DEMO/CHWD/R/E/26/00810/1' },
  ],
  branches: [
    { id: 'DEMO/CHWD/R/E/26/00810', authorityId: 'chwd', office: 'Contracts section', role: 'request_branch', questionIds: ['asha-q1'], status: 'Reply received · 26 Jan 2026' },
    { id: 'DEMO/CHWD/R/E/26/00810/1', authorityId: 'chwd', office: 'Quality and Finance section', role: 'request_branch', questionIds: ['asha-q2', 'asha-q3', 'asha-q4'], status: 'Supplemental reply · 15 Mar 2026' },
  ],
  events: [
    { id: 'asha-split', sequence: 1, occurredOn: null, kind: 'parallel_split', topology: 'parallel' },
    { id: 'asha-contracts-reply', sequence: 2, occurredOn: '2026-01-26', kind: 'reply_received', branchId: 'DEMO/CHWD/R/E/26/00810', documentId: 'asha-contracts' },
    { id: 'asha-no-reply', sequence: 3, occurredOn: '2026-02-05', kind: 'no_reply_observed', branchId: 'DEMO/CHWD/R/E/26/00810/1' },
    { id: 'asha-appeal', sequence: 4, occurredOn: '2026-02-10', kind: 'appeal_filed', branchId: 'DEMO/CHWD/R/E/26/00810/1', appealNumber: 'DEMO/CHWD/A/E/26/00077' },
    { id: 'asha-faa', sequence: 5, occurredOn: '2026-03-04', kind: 'appeal_order_received', branchId: 'DEMO/CHWD/R/E/26/00810/1', documentId: 'asha-faa-order', appealNumber: 'DEMO/CHWD/A/E/26/00077' },
    { id: 'asha-supplemental-reply', sequence: 6, occurredOn: '2026-03-15', kind: 'reply_received', branchId: 'DEMO/CHWD/R/E/26/00810/1', documentId: 'asha-supplemental' },
  ],
  documents: [
    { id: 'asha-contracts', kind: 'substantive_reply', coverageRole: 'substantive', branchId: 'DEMO/CHWD/R/E/26/00810', availableOn: '2026-01-26', title: 'Contracts reply', fileName: 'asha-contracts-reply.pdf' },
    { id: 'asha-faa-order', kind: 'appeal_order', coverageRole: 'procedural', branchId: 'DEMO/CHWD/R/E/26/00810/1', availableOn: '2026-03-04', title: 'First Appellate Authority order', relatedAppealNumber: 'DEMO/CHWD/A/E/26/00077' },
    { id: 'asha-supplemental', kind: 'supplemental_reply', coverageRole: 'substantive', branchId: 'DEMO/CHWD/R/E/26/00810/1', availableOn: '2026-03-15', title: 'Quality and Finance supplemental reply', fileName: 'asha-quality-supplemental-reply.pdf' },
  ],
  evidence: [
    { id: 'asha-q1-work-order', questionId: 'asha-q1', documentId: 'asha-contracts', branchId: 'DEMO/CHWD/R/E/26/00810', signal: 'direct_record', quote: 'Work Order DEMO-WO-77: Demo Flyover Repair Package 7. Approved contract value: Rs. 48,00,000.', location: { label: 'Pages 1 and 4', pages: [1, 4] }, explanation: 'Both the work order and approved value are present.' },
    { id: 'asha-q2-inspection', questionId: 'asha-q2', documentId: 'asha-supplemental', branchId: 'DEMO/CHWD/R/E/26/00810/1', signal: 'direct_record', quote: 'Inspection dated 18 December 2025 recorded surface cracking in Zones 2 and 3. Core Test DEMO-CT-19 recorded an average compressive-strength result of 31.4 MPa. The signed inspection report and laboratory sheet are enclosed.', location: { label: 'Pages 2–5', pages: [2, 3, 4, 5] }, explanation: 'The inspection report and laboratory sheet are enclosed.' },
    { id: 'asha-q4-no-order', questionId: 'asha-q4', documentId: 'asha-supplemental', branchId: 'DEMO/CHWD/R/E/26/00810/1', signal: 'explicit_no_record', quote: 'As of 28 February 2026, no penalty order or payment-deduction order had been issued for Demo Flyover Repair Package 7.', location: { label: 'Page 1', pages: [1] }, explanation: 'The reply explicitly states that no such order had been issued as of the stated date.', temporalQualifier: { text: 'As of 28 February 2026', asOf: '2026-02-28' } },
  ],
};
