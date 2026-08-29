import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../app/components/workspace/ReplyMapPanel.tsx', import.meta.url), 'utf8');

test('the current-pattern comparison explains the registration lookup loop without impersonating the portal', () => {
  assert.match(source, /View Status/);
  assert.match(source, /Click here to view details/);
  assert.match(source, /Open branch status/);
  assert.match(source, /Go back and check next ID/);
  assert.match(source, /Illustration only · no RTI Online connection/);
  assert.match(source, /official manual screenshots and sources below/);
});
