import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROTOTYPE_TOUR_STEPS } from '../src/tour.ts';

test('the prototype tour is short, ordered, and points to real sections', () => {
  assert.equal(PROTOTYPE_TOUR_STEPS.length, 5);
  assert.equal(new Set(PROTOTYPE_TOUR_STEPS.map((step) => step.targetId)).size, PROTOTYPE_TOUR_STEPS.length);
  assert.deepEqual(PROTOTYPE_TOUR_STEPS.map((step) => step.targetId), [
    'examples',
    'dependency-tree-panel',
    'reply-map-panel',
    'why-this-exists',
    'use-your-case',
  ]);

  const source = [
    '../app/components/workspace/ReplyMapApp.tsx',
    '../app/components/workspace/WhyThisExists.tsx',
    '../app/components/workspace/ExamplePicker.tsx',
    '../app/components/workspace/DependencyTree.tsx',
    '../app/components/workspace/ReplyMapPanel.tsx',
    '../app/components/workspace/ImportCasePanel.tsx',
  ].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n');

  for (const step of PROTOTYPE_TOUR_STEPS) {
    assert.ok(source.includes(`id="${step.targetId}"`), `missing tour target: ${step.targetId}`);
    assert.ok(step.title.length > 8, `tour title is too vague: ${step.targetId}`);
    assert.ok(step.body.length > 40, `tour explanation is too short: ${step.targetId}`);
  }
});
