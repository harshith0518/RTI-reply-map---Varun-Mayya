import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../app/components/workspace/ReplyMapPanel.tsx', import.meta.url), 'utf8');

test('the current-pattern comparison explains the registration lookup loop without impersonating the portal', () => {
  assert.match(source, /Enter Registration Number/);
  assert.match(source, /Enter Email Id/);
  assert.match(source, /Enter Security code/);
  assert.match(source, /Submit OTP/);
  assert.match(source, /Print RTI Application/);
  assert.match(source, /Print Status/);
  assert.match(source, /Go Back/);
  assert.match(source, /Click here to view details/);
  assert.match(source, /Related registrations table/);
  assert.match(source, /Close details/);
  assert.match(source, /Submit next registration/);
  assert.match(source, /application text and reply or remarks/);
  assert.doesNotMatch(source, /Important correction/);
  assert.doesNotMatch(source, /Portal trail to inspect/);
  assert.doesNotMatch(source, /Case-wide question check/);
  assert.match(source, /Illustration only · no RTI Online connection/);
  assert.match(source, /Open current View Status/);
  assert.match(source, /official manual screenshots below/);
});
