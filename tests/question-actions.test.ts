import assert from 'node:assert/strict';
import test from 'node:test';
import { EXAMPLE_CASES } from '../src/case-examples.ts';
import { buildActionDraft, getQuestionAction } from '../src/question-actions.ts';

function example(caseId: string) {
  const data = EXAMPLE_CASES.find((item) => item.caseId === caseId);
  assert.ok(data, `Missing example ${caseId}`);
  return data;
}

function mapping(caseId: string, mappingId: string) {
  const data = example(caseId);
  const result = data.mappings.find((item) => item.id === mappingId);
  assert.ok(result, `Missing mapping ${mappingId}`);
  return { data, mapping: result };
}

test('reply, fee, silence and post-appeal paths are derived from the case tree', () => {
  const cases = [
    ['maya-parallel-split', 'maya-map-q3', 'first_appeal_reply'],
    ['imran-fee-and-no-reply', 'imran-map-q2', 'fee_notice'],
    ['imran-fee-and-no-reply', 'imran-map-q3', 'first_appeal_no_reply'],
    ['asha-appeal-supplement', 'asha-map-q3', 'second_appeal'],
  ] as const;

  for (const [caseId, mappingId, expected] of cases) {
    const item = mapping(caseId, mappingId);
    assert.equal(getQuestionAction(item.data, item.mapping).kind, expected);
  }
});

test('preparation notes carry only visible case facts and an explicit boundary', () => {
  const item = mapping('maya-parallel-split', 'maya-map-q3');
  const guidance = getQuestionAction(item.data, item.mapping);
  const draft = buildActionDraft(item.data, item.mapping, guidance, 'The calculation sheet and approval note are still missing.');

  assert.match(draft, /DEMO\/CFSB\/R\/E\/26\/00421\/2/);
  assert.match(draft, /Question 3/);
  assert.match(draft, /calculation sheet and approval note/);
  assert.match(draft, /does not submit anything or provide legal advice/);
  assert.doesNotMatch(draft, /will succeed|violation|illegal|overdue/iu);
});

test('a post-first-appeal note keeps the existing appeal number', () => {
  const item = mapping('asha-appeal-supplement', 'asha-map-q3');
  const guidance = getQuestionAction(item.data, item.mapping);
  const draft = buildActionDraft(item.data, item.mapping, guidance, 'The measurement-book extract is still missing.');

  assert.equal(guidance.kind, 'second_appeal');
  assert.equal(guidance.appealNumber, 'DEMO/CHWD/A/E/26/00077');
  assert.match(draft, /First-appeal number: DEMO\/CHWD\/A\/E\/26\/00077/);
  assert.match(draft, /Verify every fact, date, registration, authority, filing route/);
});

test('every built-in mapping produces complete action guidance', () => {
  for (const data of EXAMPLE_CASES) {
    for (const item of data.mappings) {
      const guidance = getQuestionAction(data, item);
      assert.ok(guidance.title);
      assert.ok(guidance.summary);
      assert.ok(guidance.registrationNumber);
      assert.ok(guidance.links.length > 0);
      assert.doesNotMatch(JSON.stringify(guidance), /undefined/);
    }
  }
});
