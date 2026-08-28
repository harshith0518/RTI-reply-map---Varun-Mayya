export type CoverageCode =
  | 'answer_located'
  | 'partially_addressed'
  | 'no_matching_passage'
  | 'needs_human_review';

export type MappingReason =
  | 'direct_evidence'
  | 'partial_evidence'
  | 'explicit_no_record'
  | 'no_reply_document'
  | 'no_matching_passage';

export type EvidenceSignal = 'direct_record' | 'partial_record' | 'explicit_no_record';
export type Confidence = 'high' | 'medium' | 'low';

export const COVERAGE_COPY: Record<CoverageCode, string> = {
  answer_located: 'Answer located',
  partially_addressed: 'Partially addressed',
  no_matching_passage: 'No matching passage located',
  needs_human_review: 'Needs human review',
};

export const COVERAGE_HELP: Record<CoverageCode, string> = {
  answer_located: 'The reply contains the requested record or a clear statement about it.',
  partially_addressed: 'The reply answers only part of the original question.',
  no_matching_passage: 'A reply exists, but no relevant passage was located.',
  needs_human_review: 'There is not enough evidence to choose safely.',
};

export interface Question {
  id: string;
  number: number;
  shortTitle: string;
  text: string;
  responsibleBranchId: string;
}

export interface Branch {
  id: string;
  authorityId: string;
  office: string;
  role: 'request_branch' | 'transfer_source';
  questionIds: string[];
  status: string;
}

export interface DocumentRecord {
  id: string;
  kind: 'substantive_reply' | 'supplemental_reply' | 'transfer_notice' | 'appeal_order';
  coverageRole: 'substantive' | 'procedural';
  branchId: string;
  availableOn: string;
  title: string;
  fileName?: string;
  relatedAppealNumber?: string;
}

export interface EvidencePassage {
  id: string;
  questionId: string;
  documentId: string;
  branchId: string;
  signal: EvidenceSignal;
  quote: string;
  location: { label: string; pages: number[]; attachment?: string };
  explanation: string;
  missingDetail?: string;
  temporalQualifier?: { text: string; asOf: string };
}

export interface CaseEvent {
  id: string;
  sequence: number;
  occurredOn: string | null;
  kind:
    | 'application_filed'
    | 'authority_transfer'
    | 'parallel_split'
    | 'reply_received'
    | 'no_reply_observed'
    | 'appeal_filed'
    | 'appeal_order_received';
  topology?: 'serial' | 'parallel';
  branchId?: string;
  documentId?: string;
  fromRegistrationId?: string;
  toRegistrationId?: string;
  appealNumber?: string;
}

export interface CaseFixture {
  id: 'maya' | 'nisha' | 'asha';
  citizenName: string;
  fictional: true;
  title: string;
  filedOn: string;
  authorityName: string;
  questions: Question[];
  branches: Branch[];
  events: CaseEvent[];
  documents: DocumentRecord[];
  evidence: EvidencePassage[];
}

export interface MappingProposal {
  id: string;
  questionId: string;
  branchId: string;
  proposedLabel: CoverageCode;
  reason: MappingReason;
  confidence: Confidence;
  requiresHumanReview: boolean;
  evidenceIds: string[];
  inspectedDocumentIds: string[];
  explanation: string;
  temporalQualifier?: EvidencePassage['temporalQualifier'];
}

export interface HumanReview {
  questionId: string;
  selectedLabel: CoverageCode;
  note: string;
  reviewedAt: string;
}

export interface EffectiveMapping extends MappingProposal {
  effectiveLabel: CoverageCode;
  decisionSource: 'system_proposal' | 'human_confirmation' | 'human_override';
  review?: HumanReview;
}

const DEFAULT_EXPLANATIONS: Record<MappingReason, string> = {
  direct_evidence: 'The requested record or a clear statement about it appears in the reply.',
  partial_evidence: 'The reply contains part of what was requested, but not the complete record.',
  explicit_no_record: 'The reply directly addresses the question by stating that the record did not exist as of a stated date.',
  no_reply_document: 'The responsible branch has no reply document available to examine.',
  no_matching_passage: 'A reply document was examined, but no matching passage was located.',
};

export function mapQuestion(fixture: CaseFixture, asOf: string, questionId: string): MappingProposal {
  const question = fixture.questions.find((item) => item.id === questionId);
  if (!question) throw new Error(`Unknown question: ${questionId}`);

  const branch = fixture.branches.find((item) => item.id === question.responsibleBranchId);
  if (!branch) throw new Error(`Missing branch for ${questionId}`);

  const eligibleDocuments = fixture.documents.filter(
    (document) =>
      document.branchId === branch.id &&
      document.availableOn <= asOf &&
      document.coverageRole === 'substantive',
  );
  const eligibleDocumentIds = new Set(eligibleDocuments.map((document) => document.id));
  const eligibleEvidence = fixture.evidence.filter(
    (passage) => passage.questionId === question.id && eligibleDocumentIds.has(passage.documentId),
  );

  let proposedLabel: CoverageCode;
  let reason: MappingReason;
  let confidence: Confidence;
  let requiresHumanReview: boolean;

  const direct = eligibleEvidence.find(
    (passage) => passage.signal === 'direct_record' || passage.signal === 'explicit_no_record',
  );
  const partial = eligibleEvidence.find((passage) => passage.signal === 'partial_record');

  if (direct) {
    proposedLabel = 'answer_located';
    reason = direct.signal === 'explicit_no_record' ? 'explicit_no_record' : 'direct_evidence';
    confidence = 'high';
    requiresHumanReview = false;
  } else if (partial) {
    proposedLabel = 'partially_addressed';
    reason = 'partial_evidence';
    confidence = 'medium';
    requiresHumanReview = true;
  } else if (eligibleDocuments.length === 0) {
    proposedLabel = 'needs_human_review';
    reason = 'no_reply_document';
    confidence = 'low';
    requiresHumanReview = true;
  } else {
    proposedLabel = 'no_matching_passage';
    reason = 'no_matching_passage';
    confidence = 'low';
    requiresHumanReview = true;
  }

  const primaryEvidence = direct ?? partial;
  return {
    id: `${fixture.id}-${questionId}-${asOf}`,
    questionId,
    branchId: branch.id,
    proposedLabel,
    reason,
    confidence,
    requiresHumanReview,
    evidenceIds: eligibleEvidence.map((passage) => passage.id),
    inspectedDocumentIds: eligibleDocuments.map((document) => document.id),
    explanation: primaryEvidence?.explanation ?? DEFAULT_EXPLANATIONS[reason],
    temporalQualifier: primaryEvidence?.temporalQualifier,
  };
}

export function mapCase(fixture: CaseFixture, asOf: string): MappingProposal[] {
  return fixture.questions.map((question) => mapQuestion(fixture, asOf, question.id));
}

export function applyHumanReview(
  proposal: MappingProposal,
  review?: HumanReview,
): EffectiveMapping {
  if (!review) {
    return { ...proposal, effectiveLabel: proposal.proposedLabel, decisionSource: 'system_proposal' };
  }
  return {
    ...proposal,
    effectiveLabel: review.selectedLabel,
    decisionSource:
      review.selectedLabel === proposal.proposedLabel ? 'human_confirmation' : 'human_override',
    review,
  };
}

export function isCoverageCode(value: unknown): value is CoverageCode {
  return typeof value === 'string' && Object.hasOwn(COVERAGE_COPY, value);
}

export function parseStoredReview(value: string | null, questionId: string): HumanReview | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value) as Partial<HumanReview>;
    if (
      parsed.questionId !== questionId ||
      !isCoverageCode(parsed.selectedLabel) ||
      typeof parsed.note !== 'string' ||
      typeof parsed.reviewedAt !== 'string'
    ) {
      return undefined;
    }
    return parsed as HumanReview;
  } catch {
    return undefined;
  }
}
