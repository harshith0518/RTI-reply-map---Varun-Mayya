import test from 'node:test';
import assert from 'node:assert/strict';
import { EXAMPLE_CASES } from '../src/case-examples.ts';
import { CASE_JSON_TEMPLATE } from '../src/case-prompt.ts';
import {
  MAX_CASE_JSON_BYTES,
  buildCaseTree,
  parseCaseJson,
  summarizeCase,
  validateCaseData,
  type CaseTreeItem,
  type RTICaseData,
} from '../src/case-model.ts';

function countTree(item: CaseTreeItem): number {
  return 1 + item.children.reduce((total, child) => total + countTree(child), 0);
}

function depth(item: CaseTreeItem): number {
  return 1 + Math.max(0, ...item.children.map(depth));
}

function cloneCase(data: RTICaseData): RTICaseData {
  return structuredClone(data);
}

test('all five public examples pass the same runtime validator used for imports', () => {
  assert.equal(EXAMPLE_CASES.length, 5);
  for (const example of EXAMPLE_CASES) {
    const result = validateCaseData(example);
    assert.equal(result.ok, true, `${example.caseId}: ${result.errors.join(' | ')}`);
    assert.equal(countTree(buildCaseTree(example)), example.nodes.length);
    assert.equal(example.mappings.length, example.questions.length);
  }
});

test('the examples exercise five materially different case structures', () => {
  const [maya, nisha, asha, imran, meera] = EXAMPLE_CASES;
  assert.equal(buildCaseTree(maya).children.length, 3, 'Maya is a three-way parallel split');
  assert.ok(nisha.nodes.some((node) => node.kind === 'transfer'), 'Nisha includes an authority transfer');
  assert.ok(depth(buildCaseTree(nisha)) >= 5, 'Nisha transfers before the later split/replies');
  assert.ok(asha.nodes.some((node) => node.kind === 'appeal_order'));
  assert.ok(asha.nodes.some((node) => node.kind === 'supplemental_reply'));
  assert.ok(imran.nodes.some((node) => node.kind === 'fee_notice'));
  assert.ok(imran.nodes.some((node) => node.kind === 'no_reply'));
  assert.equal(meera.nodes.length, 3, 'Meera stays a simple single-registration chain');
  assert.equal(meera.documents.length, 3, 'Meera maps one consolidated package with annexures');
});

test('summary counts unique registrations instead of repeated registration nodes', () => {
  const maya = summarizeCase(EXAMPLE_CASES[0]);
  assert.equal(maya.registrations, 3);
  assert.equal(maya.replies, 3);
  assert.equal(maya.questions, 3);
});

test('the JSON template is a complete valid local case', () => {
  const parsed = parseCaseJson(JSON.stringify(CASE_JSON_TEMPLATE));
  assert.equal(parsed.ok, true, parsed.errors.join(' | '));
  assert.equal(parsed.data?.source, 'custom');
});

test('import validation rejects duplicate IDs and missing references', () => {
  const duplicate = cloneCase(CASE_JSON_TEMPLATE);
  duplicate.nodes[1].id = duplicate.nodes[0].id;
  const result = validateCaseData(duplicate);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('node IDs must be unique')));
});

test('import validation rejects dependency cycles', () => {
  const cyclic = cloneCase(CASE_JSON_TEMPLATE);
  cyclic.edges.push({ id: 'edge-cycle', from: 'reply-1', to: 'application-1', kind: 'supplemented_by', label: 'Invalid cycle' });
  const result = validateCaseData(cyclic);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('cycle')));
});

test('procedural documents cannot support a positive Reply Map result', () => {
  const procedural = cloneCase(CASE_JSON_TEMPLATE);
  procedural.documents[0].kind = 'appeal_order';
  const result = validateCaseData(procedural);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('procedural document')));
});

test('custom cases cannot inject public links through assetPath', () => {
  const linked = cloneCase(CASE_JSON_TEMPLATE);
  linked.documents[0].assetPath = '/replies/pretend.pdf';
  const result = validateCaseData(linked);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('not allowed in custom cases')));
});

test('the root must be an application and question numbers must be unique', () => {
  const wrongRoot = cloneCase(CASE_JSON_TEMPLATE);
  wrongRoot.nodes[0].kind = 'registration';
  const rootResult = validateCaseData(wrongRoot);
  assert.equal(rootResult.ok, false);
  assert.ok(rootResult.errors.some((error) => error.includes('root node must be an application')));

  const duplicateNumber = cloneCase(CASE_JSON_TEMPLATE);
  duplicateNumber.questions.push({ ...duplicateNumber.questions[0], id: 'q2' });
  duplicateNumber.nodes[0].questionIds?.push('q2');
  duplicateNumber.mappings.push({ ...duplicateNumber.mappings[0], id: 'mapping-q2', questionId: 'q2' });
  const numberResult = validateCaseData(duplicateNumber);
  assert.equal(numberResult.ok, false);
  assert.ok(numberResult.errors.some((error) => error.includes('Question numbers must be unique')));
});

test('malformed optional display fields are rejected before React can render them', () => {
  const malformed = cloneCase(CASE_JSON_TEMPLATE);
  (malformed.nodes[1] as unknown as { status: unknown }).status = { unsafe: true };
  (malformed.mappings[0] as unknown as { temporalQualifier: unknown }).temporalQualifier = ['not text'];
  assert.doesNotThrow(() => validateCaseData(malformed));
  const result = validateCaseData(malformed);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('nodes[1].status')));
  assert.ok(result.errors.some((error) => error.includes('mappings[0].temporalQualifier')));
});

test('local import requires custom provenance and rejects asset path tricks', () => {
  const disguised = cloneCase(CASE_JSON_TEMPLATE);
  disguised.source = 'synthetic';
  disguised.documents[0].assetPath = '/replies/maya-results-reply.pdf';
  const parsed = parseCaseJson(JSON.stringify(disguised));
  assert.equal(parsed.ok, false);
  assert.ok(parsed.errors.some((error) => error.includes('source "custom"')));

  const traversal = cloneCase(CASE_JSON_TEMPLATE);
  traversal.source = 'synthetic';
  traversal.documents[0].assetPath = '/replies/../og.png';
  const traversalResult = validateCaseData(traversal);
  assert.equal(traversalResult.ok, false);
  assert.ok(traversalResult.errors.some((error) => error.includes('allowlisted built-in asset')));
});

test('Reply Map evidence must belong to its question, node, and document', () => {
  const detached = cloneCase(CASE_JSON_TEMPLATE);
  detached.nodes[2].documentIds = [];
  const detachedResult = validateCaseData(detached);
  assert.equal(detachedResult.ok, false);
  assert.ok(detachedResult.errors.some((error) => error.includes('not attached to node')));

  const noMatchWithoutReply = cloneCase(CASE_JSON_TEMPLATE);
  noMatchWithoutReply.mappings[0].coverage = 'no_matching_passage';
  delete noMatchWithoutReply.mappings[0].documentId;
  delete noMatchWithoutReply.mappings[0].passage;
  delete noMatchWithoutReply.mappings[0].location;
  const noMatchResult = validateCaseData(noMatchWithoutReply);
  assert.equal(noMatchResult.ok, false);
  assert.ok(noMatchResult.errors.some((error) => error.includes('inspected substantive document')));
});

test('strict fields and real calendar dates are enforced', () => {
  const invalid = cloneCase(CASE_JSON_TEMPLATE) as RTICaseData & { surprise?: string };
  invalid.surprise = 'unknown';
  invalid.filedOn = '2026-02-31';
  const result = validateCaseData(invalid);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('not a supported field')));
  assert.ok(result.errors.some((error) => error.includes('filedOn')));
});

test('a case must contain at least one question and Reply Map result', () => {
  const empty = structuredClone(CASE_JSON_TEMPLATE) as unknown as Record<string, unknown>;
  empty.questions = [];
  empty.mappings = [];

  const result = validateCaseData(empty);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('questions must contain at least one item')));
  assert.ok(result.errors.some((error) => error.includes('mappings must contain at least one item')));
});

test('oversized input is rejected before parsing', () => {
  const input = `{"padding":"${'x'.repeat(MAX_CASE_JSON_BYTES)}"}`;
  const result = parseCaseJson(input);
  assert.equal(result.ok, false);
  assert.ok(result.errors[0].includes('larger than 512 KB'));
});
