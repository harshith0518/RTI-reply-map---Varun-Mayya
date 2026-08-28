import test from 'node:test';
import assert from 'node:assert/strict';
import { applyHumanReview, COVERAGE_COPY, mapCase, mapQuestion, parseStoredReview } from '../src/domain.ts';
import { ashaFixture, mayaFixture, nishaFixture } from '../src/fixtures.ts';

test('Maya uses one parallel split and keeps Q3 cautiously partial', () => {
  assert.equal(mayaFixture.events.filter((event) => event.kind === 'authority_transfer').length, 0);
  assert.equal(mayaFixture.events.filter((event) => event.kind === 'parallel_split').length, 1);
  const q3 = mapQuestion(mayaFixture, '2026-06-26', 'maya-q3');
  assert.equal(q3.proposedLabel, 'partially_addressed');
  assert.notEqual(q3.proposedLabel, 'answer_located');
  assert.equal(q3.branchId, 'DEMO/CFSB/R/E/26/00421/2');
  assert.deepEqual(q3.evidenceIds, ['maya-q3-total']);
});

test('Nisha keeps the serial authority transfer separate from the parallel split', () => {
  const transfer = nishaFixture.events.find((event) => event.kind === 'authority_transfer');
  const split = nishaFixture.events.find((event) => event.kind === 'parallel_split');
  assert.equal(transfer?.topology, 'serial');
  assert.equal(transfer?.fromRegistrationId, 'DEMO/MOE/R/E/26/01017');
  assert.equal(transfer?.toRegistrationId, 'DEMO/CSU/R/E/26/00208');
  assert.equal(split?.topology, 'parallel');
});

test('Nisha explicit no-record statement is answer evidence, never the transfer notice', () => {
  const q3 = mapQuestion(nishaFixture, '2026-07-29', 'nisha-q3');
  assert.equal(q3.proposedLabel, 'answer_located');
  assert.equal(q3.reason, 'explicit_no_record');
  assert.equal(q3.temporalQualifier?.asOf, '2026-07-28');
  assert(!q3.inspectedDocumentIds.includes('nisha-transfer-notice'));
});

test('Asha distinguishes no reply, an appeal order, and a later no-match result', () => {
  for (const id of ['asha-q2', 'asha-q3', 'asha-q4']) {
    const initial = mapQuestion(ashaFixture, '2026-02-05', id);
    assert.equal(initial.proposedLabel, 'needs_human_review');
    assert.equal(initial.reason, 'no_reply_document');
    assert.deepEqual(initial.inspectedDocumentIds, []);

    const afterOrder = mapQuestion(ashaFixture, '2026-03-04', id);
    assert.equal(afterOrder.proposedLabel, 'needs_human_review');
    assert(!afterOrder.inspectedDocumentIds.includes('asha-faa-order'));
  }

  assert.equal(mapQuestion(ashaFixture, '2026-03-15', 'asha-q2').proposedLabel, 'answer_located');
  const q3 = mapQuestion(ashaFixture, '2026-03-15', 'asha-q3');
  assert.equal(q3.proposedLabel, 'no_matching_passage');
  assert.deepEqual(q3.inspectedDocumentIds, ['asha-supplemental']);
  assert.equal(mapQuestion(ashaFixture, '2026-03-15', 'asha-q4').reason, 'explicit_no_record');
  assert(ashaFixture.events.some((event) => event.kind === 'no_reply_observed'));
});

test('Every positive mapping has an exact passage, page, file, and branch', () => {
  for (const fixture of [mayaFixture, nishaFixture, ashaFixture]) {
    for (const passage of fixture.evidence) {
      const document = fixture.documents.find((item) => item.id === passage.documentId);
      assert(document);
      assert.equal(document.coverageRole, 'substantive');
      assert.equal(document.branchId, passage.branchId);
      assert(document.fileName);
      assert(passage.quote.trim().length > 0);
      assert(passage.location.pages.length > 0);
    }
  }
});

test('Human review becomes authoritative without erasing the proposal', () => {
  const proposal = mapQuestion(mayaFixture, '2026-06-26', 'maya-q3');
  const review = {
    questionId: 'maya-q3',
    selectedLabel: 'no_matching_passage' as const,
    note: 'I want to check the calculation record again.',
    reviewedAt: '2026-06-27T10:00:00+05:30',
  };
  const effective = applyHumanReview(proposal, review);
  assert.equal(effective.proposedLabel, 'partially_addressed');
  assert.equal(effective.effectiveLabel, 'no_matching_passage');
  assert.equal(effective.decisionSource, 'human_override');
  assert.deepEqual(parseStoredReview(JSON.stringify(review), 'maya-q3'), review);
  assert.equal(parseStoredReview('{bad json', 'maya-q3'), undefined);
});

test('Only the four approved public labels exist', () => {
  assert.deepEqual(Object.values(COVERAGE_COPY), [
    'Answer located',
    'Partially addressed',
    'No matching passage located',
    'Needs human review',
  ]);
  assert.equal(mapCase(mayaFixture, '2026-06-26').length, 3);
});
