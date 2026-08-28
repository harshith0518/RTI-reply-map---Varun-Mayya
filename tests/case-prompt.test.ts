import test from 'node:test';
import assert from 'node:assert/strict';
import { CUSTOM_CASE_PROMPT } from '../src/case-prompt.ts';
import { CASE_SCHEMA_VERSION } from '../src/case-model.ts';

test('the custom-case prompt carries the schema and safety contract', () => {
  const requiredPhrases = [
    CASE_SCHEMA_VERSION,
    'output exactly one JSON object',
    'Do not use Markdown fences',
    'Never invent',
    'exact short passage',
    'no_matching_passage',
    'needs_human_review',
    'procedural',
    'legal-compliance verdict',
    'Aadhaar',
    'Do not include assetPath',
  ];
  for (const phrase of requiredPhrases) assert.ok(CUSTOM_CASE_PROMPT.includes(phrase), `missing prompt rule: ${phrase}`);
});
