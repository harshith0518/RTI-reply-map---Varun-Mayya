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
  assert.match(spoken, /neither recommends nor files an appeal/);
  assert.match(spoken, /no login, server upload, live AI, government integration, filing, or legal verdict/);
  assert.match(spoken, /in-page preview/);
  assert.match(spoken, /Codex helped/);
});
