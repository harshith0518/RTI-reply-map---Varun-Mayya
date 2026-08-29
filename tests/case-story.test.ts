import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { EXAMPLE_CASES } from '../src/case-examples.ts';

const workspaceSource = readFileSync(new URL('../app/components/workspace/CaseWorkspace.tsx', import.meta.url), 'utf8');

test('every example carries enough context to tell its story', () => {
  assert.equal(EXAMPLE_CASES.length, 5);

  for (const example of EXAMPLE_CASES) {
    assert.ok(example.citizenGoal.trim().length > 20, `${example.citizenName} needs a clear filing goal`);
    assert.ok(example.scenario.trim().length > 40, `${example.citizenName} needs a case history`);
    assert.ok(example.painPoint.trim().length > 40, `${example.citizenName} needs a stated citizen pain point`);
    assert.ok(example.authority.trim(), `${example.citizenName} needs a filing authority`);
    assert.ok(example.questions.length >= 3, `${example.citizenName} needs the original RTI questions`);
    assert.ok(example.questions.every((question) => question.title.trim() && question.text.trim().length > 25));
  }
});

test('the selected case brief renders context and original questions from case data', () => {
  assert.match(workspaceSource, /data\.citizenGoal/);
  assert.match(workspaceSource, /data\.scenario/);
  assert.match(workspaceSource, /data\.painPoint/);
  assert.match(workspaceSource, /data\.filedOn/);
  assert.match(workspaceSource, /data\.authority/);
  assert.match(workspaceSource, /data\.questions\.map/);
  assert.match(workspaceSource, /What .* asked in the RTI application/);
});
