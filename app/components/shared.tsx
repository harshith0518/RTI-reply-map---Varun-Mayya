'use client';

import { COVERAGE_COPY, type CoverageCode } from '@/src/coverage';

const STATUS_ICON: Record<CoverageCode, string> = {
  answer_located: '✓',
  partially_addressed: '◐',
  no_matching_passage: '○',
  needs_human_review: '?',
};

export function StatusBadge({ code, prefix }: { code: CoverageCode; prefix?: string }) {
  return (
    <span className={`status-badge status-${code}`}>
      <span className="status-icon" aria-hidden="true">{STATUS_ICON[code]}</span>
      {prefix ? `${prefix}: ` : ''}{COVERAGE_COPY[code]}
    </span>
  );
}
