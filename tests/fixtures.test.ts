import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import type { CaseFixture } from '../src/domain.ts';
import { ashaFixture, mayaFixture, nishaFixture } from '../src/fixtures.ts';

const fixtures = [mayaFixture, nishaFixture, ashaFixture];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function assertUnique<T>(values: readonly T[], message: string) {
  assert.equal(new Set(values).size, values.length, message);
}

function assertFixtureIntegrity(fixture: CaseFixture) {
  const questionIds = new Set(fixture.questions.map((question) => question.id));
  const branchIds = new Set(fixture.branches.map((branch) => branch.id));
  const documentIds = new Set(fixture.documents.map((document) => document.id));

  assert.equal(fixture.fictional, true, `${fixture.id} must stay explicitly fictional`);
  assert.match(fixture.filedOn, ISO_DATE, `${fixture.id} filedOn must use YYYY-MM-DD`);
  assertUnique(fixture.questions.map((question) => question.id), `${fixture.id} question IDs must be unique`);
  assertUnique(fixture.questions.map((question) => question.number), `${fixture.id} question numbers must be unique`);
  assertUnique(fixture.branches.map((branch) => branch.id), `${fixture.id} branch IDs must be unique`);
  assertUnique(fixture.documents.map((document) => document.id), `${fixture.id} document IDs must be unique`);
  assertUnique(fixture.evidence.map((passage) => passage.id), `${fixture.id} evidence IDs must be unique`);
  assertUnique(fixture.events.map((event) => event.id), `${fixture.id} event IDs must be unique`);
  assertUnique(fixture.events.map((event) => event.sequence), `${fixture.id} event sequences must be unique`);

  const orderedSequences = fixture.events.map((event) => event.sequence);
  assert.deepEqual(
    orderedSequences,
    [...orderedSequences].sort((left, right) => left - right),
    `${fixture.id} events must be stored in sequence order`,
  );

  for (const question of fixture.questions) {
    assert(branchIds.has(question.responsibleBranchId), `${question.id} must reference an existing branch`);
    const branch = fixture.branches.find((item) => item.id === question.responsibleBranchId);
    assert(branch?.questionIds.includes(question.id), `${question.id} must be owned by its responsible branch`);
  }

  for (const branch of fixture.branches) {
    for (const questionId of branch.questionIds) {
      assert(questionIds.has(questionId), `${branch.id} references unknown question ${questionId}`);
      const question = fixture.questions.find((item) => item.id === questionId);
      assert.equal(question?.responsibleBranchId, branch.id, `${questionId} must point back to ${branch.id}`);
    }
  }

  for (const document of fixture.documents) {
    assert(branchIds.has(document.branchId), `${document.id} must reference an existing branch`);
    assert.match(document.availableOn, ISO_DATE, `${document.id} availableOn must use YYYY-MM-DD`);
  }

  for (const passage of fixture.evidence) {
    assert(questionIds.has(passage.questionId), `${passage.id} must reference an existing question`);
    assert(documentIds.has(passage.documentId), `${passage.id} must reference an existing document`);
    const document = fixture.documents.find((item) => item.id === passage.documentId);
    const question = fixture.questions.find((item) => item.id === passage.questionId);
    assert.equal(document?.coverageRole, 'substantive', `${passage.id} cannot treat a procedural document as answer evidence`);
    assert.equal(passage.branchId, document?.branchId, `${passage.id} branch must match its document`);
    assert.equal(passage.branchId, question?.responsibleBranchId, `${passage.id} branch must match its question`);
    assert(passage.quote.trim().length > 0, `${passage.id} needs an exact passage`);
    assert(passage.location.label.trim().length > 0, `${passage.id} needs a location label`);
    assert(passage.location.pages.length > 0, `${passage.id} needs at least one page`);
    assert(passage.location.pages.every((page) => Number.isInteger(page) && page > 0), `${passage.id} pages must be positive integers`);
    if (passage.temporalQualifier) {
      assert.match(passage.temporalQualifier.asOf, ISO_DATE, `${passage.id} temporal qualifier must use YYYY-MM-DD`);
    }
  }

  for (const event of fixture.events) {
    if (event.occurredOn) assert.match(event.occurredOn, ISO_DATE, `${event.id} date must use YYYY-MM-DD`);
    if (event.branchId) assert(branchIds.has(event.branchId), `${event.id} references unknown branch ${event.branchId}`);
    if (event.documentId) assert(documentIds.has(event.documentId), `${event.id} references unknown document ${event.documentId}`);
    if (event.fromRegistrationId) assert(branchIds.has(event.fromRegistrationId), `${event.id} has an unknown source registration`);
    if (event.toRegistrationId) assert(branchIds.has(event.toRegistrationId), `${event.id} has an unknown destination registration`);
  }
}

for (const fixture of fixtures) {
  test(`${fixture.citizenName} fixture keeps all references internally consistent`, () => {
    assertFixtureIntegrity(fixture);
  });
}

test('every Maya reply linked by the live demo is a non-empty public asset', () => {
  const replyDocuments = mayaFixture.documents.filter(
    (document) => document.coverageRole === 'substantive',
  );
  assert.equal(replyDocuments.length, 3);

  for (const document of replyDocuments) {
    assert(document.fileName, `${document.id} needs a public reply filename`);
    const asset = new URL(`../public/replies/${document.fileName}`, import.meta.url);
    assert(existsSync(asset), `${document.fileName} must exist under public/replies`);
    assert(statSync(asset).size > 0, `${document.fileName} must not be empty`);
  }
});
