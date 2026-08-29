import type { ReplyMapping, RTICaseData } from './case-model.ts';

export type SatisfactionChoice = 'satisfied' | 'needs_action';

export type QuestionActionKind =
  | 'first_appeal_reply'
  | 'first_appeal_no_reply'
  | 'fee_notice'
  | 'fee_paid_wait'
  | 'track_transfer'
  | 'second_appeal'
  | 'verify_route';

export interface OfficialActionLink {
  label: string;
  href: string;
}

export interface QuestionActionGuidance {
  kind: QuestionActionKind;
  title: string;
  summary: string;
  timing: string;
  steps: string[];
  links: OfficialActionLink[];
  routeLabel: string;
  registrationNumber: string;
  appealNumber?: string;
  documentLabel: string;
  documentDate?: string;
  defaultMissingNote: string;
}

const FIRST_APPEAL_GUIDANCE = 'https://rtionline.gov.in/guidelines.php?appeal=';
const OFFICIAL_STATUS = 'https://rtionline.gov.in/request/status.php';
const SECOND_APPEAL_GUIDANCE = 'https://cic.gov.in/second-appeal-guidelines';
const CIC_FILING_PORTAL = 'https://dss.cic.gov.in';

function relevantNodes(data: RTICaseData, mapping: ReplyMapping) {
  return data.nodes.filter((node) => node.questionIds?.includes(mapping.questionId));
}

function resolveRegistration(data: RTICaseData, mapping: ReplyMapping) {
  const node = data.nodes.find((item) => item.id === mapping.nodeId);
  const document = data.documents.find((item) => item.id === mapping.documentId);
  return mapping.registrationNumber
    ?? node?.registrationNumber
    ?? document?.registrationNumber
    ?? 'Verify the relevant branch registration';
}

export function getQuestionAction(data: RTICaseData, mapping: ReplyMapping): QuestionActionGuidance {
  const nodes = relevantNodes(data, mapping);
  const mappedNode = data.nodes.find((item) => item.id === mapping.nodeId);
  const document = data.documents.find((item) => item.id === mapping.documentId);
  const registrationNumber = resolveRegistration(data, mapping);
  const appealNode = nodes.find((node) => node.kind === 'appeal');
  const appealOrder = nodes.find((node) => node.kind === 'appeal_order');
  const supplementalReply = nodes.find((node) => node.kind === 'supplemental_reply');
  const payment = nodes.find((node) => node.kind === 'payment');
  const feeNotice = nodes.find((node) => node.kind === 'fee_notice');
  const transfer = nodes.find((node) => node.kind === 'transfer');
  const noReply = nodes.find((node) => node.kind === 'no_reply');
  const documentLabel = document?.title ?? mappedNode?.title ?? 'No reply document supplied';
  const documentDate = document?.issuedOn ?? mappedNode?.date;
  const defaultMissingNote = mapping.missingDetail
    ?? `Explain briefly what Question ${data.questions.find((question) => question.id === mapping.questionId)?.number ?? ''} still needs.`;

  if (appealNode || appealOrder || supplementalReply) {
    return {
      kind: 'second_appeal',
      title: supplementalReply ? 'Still dissatisfied after the first-appeal path?' : 'A first appeal is already in this branch',
      summary: supplementalReply
        ? 'This branch already includes a first appeal and a later reply. Review the First Appellate Authority record before considering a second appeal.'
        : 'Do not create another first appeal for the same branch. Track the existing appeal or review the second-appeal option when applicable.',
      timing: 'For Central authorities, CIC guidance says a second appeal normally follows the FAA decision, or 45 days without one. Verify the 90-day filing window yourself.',
      steps: [
        'Check the first appeal, FAA order and any later reply together.',
        'List only the information that remains missing or disputed.',
        'Verify the correct Information Commission and current document requirements.',
      ],
      links: [
        { label: 'Read CIC requirements', href: SECOND_APPEAL_GUIDANCE },
        { label: 'Open CIC filing portal', href: CIC_FILING_PORTAL },
      ],
      routeLabel: 'Possible second-appeal preparation',
      registrationNumber,
      appealNumber: appealNode?.appealNumber ?? appealOrder?.appealNumber,
      documentLabel,
      documentDate,
      defaultMissingNote,
    };
  }

  if (feeNotice || mappedNode?.kind === 'fee_notice' || document?.kind === 'fee_notice') {
    if (payment && !nodes.some((node) => node.kind === 'reply' || node.kind === 'supplemental_reply')) {
      return {
        kind: 'fee_paid_wait',
        title: 'Fee payment is shown; check for the later reply',
        summary: 'The next step is to track this registration and keep the payment record. This site cannot confirm whether the authority received it.',
        timing: 'Check the official status and dates. This prototype does not calculate a response deadline.',
        steps: ['Keep the payment receipt.', 'Check status using this branch registration.', 'Record any later reply before choosing an appeal route.'],
        links: [{ label: 'Check official status', href: OFFICIAL_STATUS }],
        routeLabel: 'Status follow-up note',
        registrationNumber,
        documentLabel,
        documentDate,
        defaultMissingNote,
      };
    }

    return {
      kind: 'fee_notice',
      title: 'Additional fee requested',
      summary: 'Review the CPIO’s calculation in official status. If you accept it, use the official “Make Payment” option. This prototype never collects payment.',
      timing: 'The fee-notice period affects the ordinary response calculation. Do not treat this branch as simple silence or let this site calculate a deadline.',
      steps: ['Open official status.', 'Check the amount, calculation and form of access.', 'Pay there if accepted, or read the review route shown in the notice.'],
      links: [{ label: 'Open official status and payment', href: OFFICIAL_STATUS }],
      routeLabel: 'Fee-review note',
      registrationNumber,
      documentLabel,
      documentDate,
      defaultMissingNote,
    };
  }

  if (noReply || mappedNode?.kind === 'no_reply' || !mapping.documentId) {
    return {
      kind: 'first_appeal_no_reply',
      title: 'No reply document is shown for this branch',
      summary: 'Check the official receipt date and status first. For an ordinary Central RTI request, the official first-appeal route may be available after the response period.',
      timing: 'Do not rely on an automatic deadline here; life-or-liberty requests, transfers, fee notices and other facts can change the calculation.',
      steps: ['Check official status and the branch receipt date.', 'Confirm that no reply or procedural notice was received.', 'Review the First Appellate Authority route for this registration.'],
      links: [
        { label: 'Check official status', href: OFFICIAL_STATUS },
        { label: 'Open first-appeal guidance', href: FIRST_APPEAL_GUIDANCE },
      ],
      routeLabel: 'Possible first-appeal draft for no reply',
      registrationNumber,
      documentLabel,
      documentDate,
      defaultMissingNote,
    };
  }

  if (transfer && mappedNode?.kind === 'transfer') {
    return {
      kind: 'track_transfer',
      title: 'Track the receiving registration first',
      summary: 'A transfer notice moves the request; it does not answer the question. Find the receiving registration and any later reply before choosing an appeal route.',
      timing: 'Transfer dates can affect the case history. Verify the official trail instead of using a deadline calculated by this site.',
      steps: ['Open official status.', 'Record the receiving authority and registration.', 'Add any later reply to the case before deciding what remains missing.'],
      links: [{ label: 'Check official status', href: OFFICIAL_STATUS }],
      routeLabel: 'Transfer follow-up note',
      registrationNumber,
      documentLabel,
      documentDate,
      defaultMissingNote,
    };
  }

  if (mapping.coverage === 'needs_human_review') {
    return {
      kind: 'verify_route',
      title: 'Verify the branch record before choosing a route',
      summary: 'The supplied case data is not enough to safely suggest a filing route. Check the official record and add the missing document or event.',
      timing: 'This prototype will not infer a legal deadline or remedy from incomplete data.',
      steps: ['Check the official status.', 'Confirm the latest document and registration.', 'Update the case, then review the question again.'],
      links: [{ label: 'Check official status', href: OFFICIAL_STATUS }],
      routeLabel: 'Verification note',
      registrationNumber,
      documentLabel,
      documentDate,
      defaultMissingNote,
    };
  }

  return {
    kind: 'first_appeal_reply',
    title: 'Reply received — review the first-appeal option',
    summary: 'If this reply did not give you the requested information, record exactly what is missing and review the public authority’s First Appellate Authority route.',
    timing: 'For Central RTI matters, a first appeal can normally be filed within 30 days of receiving the decision. Verify the dates and route yourself.',
    steps: ['Describe what the reply supplied.', 'State what the original question still needs.', 'Verify the branch registration and official filing route.'],
    links: [{ label: 'Open official first-appeal guidance', href: FIRST_APPEAL_GUIDANCE }],
    routeLabel: 'Possible first-appeal draft',
    registrationNumber,
    documentLabel,
    documentDate,
    defaultMissingNote,
  };
}

export function buildActionDraft(data: RTICaseData, mapping: ReplyMapping, guidance: QuestionActionGuidance, missingNote: string) {
  const question = data.questions.find((item) => item.id === mapping.questionId);
  let routeRequest = 'I request review of the response to this question and access to the requested information, where applicable.';
  if (guidance.kind === 'second_appeal') routeRequest = 'I request review of the first-appeal outcome and the information that remains unavailable.';
  if (guidance.kind === 'fee_notice') routeRequest = 'I am reviewing the additional-fee calculation and the stated form of access before taking action on the official portal.';
  if (guidance.kind === 'fee_paid_wait') routeRequest = 'I am tracking the substantive reply after the recorded fee payment.';
  if (guidance.kind === 'track_transfer') routeRequest = 'I am tracking the receiving registration and any substantive reply.';
  if (guidance.kind === 'verify_route') routeRequest = 'I will verify the latest official record before choosing a filing route.';
  if (guidance.kind === 'first_appeal_no_reply') routeRequest = 'I request review of the absence of a decision on this question and access to the requested information, where applicable.';

  return `${guidance.routeLabel} — review before use

Case: ${data.title}
Public authority: ${data.authority}
Original application date: ${data.filedOn}
Branch registration: ${guidance.registrationNumber}
${guidance.appealNumber ? `First-appeal number: ${guidance.appealNumber}\n` : ''}Question ${question?.number ?? '?'}: ${question?.text ?? 'Question text unavailable'}
Record reviewed: ${guidance.documentLabel}${guidance.documentDate ? ` (${guidance.documentDate})` : ''}
${mapping.location ? `Location reviewed: ${mapping.location}\n` : ''}
What is still needed:
${missingNote.trim() || guidance.defaultMissingNote}

Requested next step:
${routeRequest}

This note was assembled from the case shown above. Verify every fact, date, registration, authority, filing route and current requirement. This site does not submit anything or provide legal advice.`;
}
