export type CoverageCode =
  | 'answer_located'
  | 'partially_addressed'
  | 'no_matching_passage'
  | 'needs_human_review';

export const COVERAGE_COPY: Record<CoverageCode, string> = {
  answer_located: 'Answer located',
  partially_addressed: 'Partially addressed',
  no_matching_passage: 'No matching passage located',
  needs_human_review: 'Evidence needs review',
};

export const COVERAGE_HELP: Record<CoverageCode, string> = {
  answer_located: 'The reply contains the requested record or a clear statement about it.',
  partially_addressed: 'The reply answers only part of the original question.',
  no_matching_passage: 'A substantive reply exists, but no relevant passage was located.',
  needs_human_review: 'The supplied records do not contain enough substantive evidence to classify this question safely.',
};
