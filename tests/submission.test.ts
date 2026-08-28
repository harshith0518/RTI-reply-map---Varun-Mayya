import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const script = readFileSync(new URL('../submission/demo-script.md', import.meta.url), 'utf8');

test('the spoken submission script is exactly 250 words and states key boundaries', () => {
  const match = script.match(/<!-- SPOKEN_SCRIPT_START -->\s*([\s\S]*?)\s*<!-- SPOKEN_SCRIPT_END -->/);
  assert.ok(match, 'spoken-script markers are required');

  const spoken = match[1].trim();
  assert.equal(spoken.split(/\s+/).length, 250);
  assert.match(spoken, /fictional applicant/);
  assert.match(spoken, /not official RTI statuses or legal verdicts/);
  assert.match(spoken, /No login, server upload, government integration, runtime AI, or API/);
  assert.match(spoken, /I used Codex/);
});
