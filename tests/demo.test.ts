import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createReviewedSummaryHtml,
  DEMO_CASE_DATE,
  getReviewDraft,
  summarizeEffectiveMappings,
} from '../src/demo.ts';
import {
  applyHumanReview,
  mapCase,
  type HumanReview,
  type MappingProposal,
} from '../src/domain.ts';
import { mayaFixture } from '../src/fixtures.ts';

function mayaProposals() {
  return mapCase(mayaFixture, DEMO_CASE_DATE);
}

function proposalsByQuestion(proposals: MappingProposal[]) {
  return Object.fromEntries(
    proposals.map((proposal) => [proposal.questionId, proposal]),
  ) as Record<string, MappingProposal>;
}

test('review drafts always follow the newly selected question', () => {
  const proposals = mayaProposals();
  const byQuestion = proposalsByQuestion(proposals);
  const q1Review: HumanReview = {
    questionId: 'maya-q1',
    selectedLabel: 'needs_human_review',
    note: 'Check the marks table once more.',
    reviewedAt: '2026-06-27T10:00:00+05:30',
  };

  assert.deepEqual(getReviewDraft('maya-q3', {}, byQuestion), {
    label: 'partially_addressed',
    note: '',
  });
  assert.deepEqual(getReviewDraft('maya-q1', { 'maya-q1': q1Review }, byQuestion), {
    label: 'needs_human_review',
    note: 'Check the marks table once more.',
  });
  assert.throws(
    () => getReviewDraft('missing-question', {}, byQuestion),
    /Missing mapping proposal/,
  );
});

test('reply-map totals are derived from effective labels, including overrides', () => {
  const proposals = mayaProposals();
  const original = proposals.map((proposal) => applyHumanReview(proposal));
  assert.deepEqual(summarizeEffectiveMappings(original), {
    answersLocated: 2,
    needsChecking: 1,
  });

  const reviewed = proposals.map((proposal) =>
    proposal.questionId === 'maya-q3'
      ? applyHumanReview(proposal, {
          questionId: proposal.questionId,
          selectedLabel: 'answer_located',
          note: 'Confirmed after checking the annexure.',
          reviewedAt: '2026-06-27T10:30:00+05:30',
        })
      : applyHumanReview(proposal),
  );

  assert.deepEqual(summarizeEffectiveMappings(reviewed), {
    answersLocated: 3,
    needsChecking: 0,
  });
});

test('downloaded summary keeps evidence context and escapes reviewer text', () => {
  const mappings = mayaProposals().map((proposal) =>
    proposal.questionId === 'maya-q3'
      ? applyHumanReview(proposal, {
          questionId: proposal.questionId,
          selectedLabel: 'partially_addressed',
          note: '<script>alert("unsafe")</script> & verify manually',
          reviewedAt: '2026-06-27T11:00:00+05:30',
        })
      : applyHumanReview(proposal),
  );

  const html = createReviewedSummaryHtml(mayaFixture, mappings);

  assert.match(html, /^<!doctype html>/);
  assert.match(html, /SYNTHETIC DEMONSTRATION — NOT AN OFFICIAL RECORD/);
  assert.match(html, /Related RTI registration number/);
  assert.match(html, /maya-vacancy-reply\.pdf/);
  assert.match(html, /Page 1 and Annexure A/);
  assert.match(html, /The final fellowship notification records a total of 120 seats/);
  assert.match(html, /&lt;script&gt;alert\(&quot;unsafe&quot;\)&lt;\/script&gt; &amp; verify manually/);
  assert.doesNotMatch(html, /<script>alert/);
});
