import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const script = readFileSync(new URL('../submission/demo-script.md', import.meta.url), 'utf8');
const summary = readFileSync(new URL('../submission/project-summary.md', import.meta.url), 'utf8');

function markedText(source: string, start: string, end: string) {
  const match = source.match(new RegExp(`<!-- ${start} -->\\s*([\\s\\S]*?)\\s*<!-- ${end} -->`));
  assert.ok(match, `${start} and ${end} markers are required`);
  return match[1].trim();
}

test('the project summary stays below 250 words and explains the improvement', () => {
  const text = markedText(summary, 'PROJECT_SUMMARY_START', 'PROJECT_SUMMARY_END');
  const wordCount = text.split(/\s+/).length;

  assert.ok(wordCount >= 180 && wordCount < 250, `summary must be 180–249 words; received ${wordCount}`);
  assert.match(text, /current RTI Online pattern/);
  assert.match(text, /Reply Navigator is better because/);
  assert.match(text, /no login, server upload, backend, runtime AI, government integration, filing, or legal verdict/);
});

test('the spoken submission script fits two minutes and follows the requested split', () => {
  const minuteOne = markedText(script, 'MINUTE_ONE_START', 'MINUTE_ONE_END');
  const minuteTwo = markedText(script, 'MINUTE_TWO_START', 'MINUTE_TWO_END');
  const totalWords = `${minuteOne} ${minuteTwo}`.split(/\s+/).length;

  assert.ok(totalWords >= 220 && totalWords <= 242, `spoken script must be 220–242 words; received ${totalWords}`);
  assert.match(minuteOne, /fictional applicant/);
  assert.match(minuteOne, /dependency tree/);
  assert.match(minuteOne, /I choose “No.”/);
  assert.match(minuteOne, /neither recommends nor files an appeal/);
  assert.match(minuteTwo, /Codex helped/);
  assert.match(minuteTwo, /Deterministic rendering/);
  assert.match(minuteTwo, /no login, server upload, runtime AI, or government integration/);
  assert.match(minuteTwo, /These choices keep citizens in control/);
});
