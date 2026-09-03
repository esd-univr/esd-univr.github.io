/**
 * The "Flash out!" bang. Two things can rot here without anything else noticing.
 *
 * The path is hard-coded in an inline script, so `npm run verify` — which resolves the
 * references it finds in built HTML — never sees it: a rename or a move would 404 in silence
 * on a feature nobody tests by hand.
 *
 * And the length is an accessibility constraint, not a taste one. WCAG 1.4.2 requires a stop
 * control for audio that starts without being asked and runs for more than three seconds.
 * This one starts on a theme switch, so it has to stay short. Duration is computed from the
 * MPEG frame header rather than shelled out to ffprobe, which CI does not have.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const script = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const referenced = /new Audio\('([^']+)'\)/.exec(script)?.[1];

const BITRATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
const RATES = [44100, 48000, 32000, 0];

/** Bitrate and sample rate from the first MPEG-1 Layer III frame header. */
function frameHeader(buffer) {
  for (let i = 0; i < buffer.length - 4; i++) {
    if (buffer[i] !== 0xff || (buffer[i + 1] & 0xe0) !== 0xe0) continue;
    const version = (buffer[i + 1] >> 3) & 0x03; // 3 = MPEG-1
    const layer = (buffer[i + 1] >> 1) & 0x03; // 1 = Layer III
    const bitrate = BITRATES[(buffer[i + 2] >> 4) & 0x0f];
    const rate = RATES[(buffer[i + 2] >> 2) & 0x03];
    if (version === 3 && layer === 1 && bitrate && rate) {
      return { offset: i, bitrate, rate, mono: ((buffer[i + 3] >> 6) & 0x03) === 3 };
    }
  }
  return null;
}

test('the script points at a file that is actually shipped', () => {
  assert.ok(referenced, "no new Audio('…') found in BaseLayout.astro");
  assert.match(referenced, /^\/audio\//, 'audio is served from public/audio/');
  const onDisk = `public${referenced}`;
  assert.doesNotThrow(() => readFileSync(onDisk), `${referenced} is referenced but ${onDisk} is missing`);
});

test('it is short enough not to need a stop control, and small enough to be free', () => {
  const audio = readFileSync(`public${referenced}`);
  const header = frameHeader(audio);
  assert.ok(header, 'no MPEG-1 Layer III frame header found');
  const seconds = ((audio.length - header.offset) * 8) / (header.bitrate * 1000);
  assert.ok(seconds < 3, `${seconds.toFixed(2)}s — WCAG 1.4.2 wants a stop control past 3s`);
  assert.ok(audio.length < 64 * 1024, `${audio.length} bytes is too much for an easter egg`);
  assert.ok(header.mono, 'mono: it is a bang at 8% volume, not music');
});

test('it carries no metadata — no tags, no cover art, no channel name', () => {
  const audio = readFileSync(`public${referenced}`);
  assert.notEqual(audio.subarray(0, 3).toString('latin1'), 'ID3', 'an ID3 tag is back');
  const text = audio.toString('latin1');
  for (const marker of ['ID3', 'xpacket', 'xmpmeta', 'APIC', 'TPE1', 'PNG', 'Lavf']) {
    assert.ok(!text.includes(marker), `${marker} found in the audio payload`);
  }
});

test('the volume is kept barely there', () => {
  const volume = Number(/const BANG_VOLUME = ([\d.]+);/.exec(script)?.[1]);
  assert.ok(volume > 0, 'BANG_VOLUME is missing or zero');
  assert.ok(volume <= 0.05, `BANG_VOLUME is ${volume} — this is meant to be barely there`);
});

test('the bang fires on the frame leaving, not on the frame arriving', () => {
  // One timer owns both, so they cannot drift apart. If this is ever split into two
  // timers, the two halves of the joke will separate on a slow machine.
  const hide = /flashing = setTimeout\(\(\) => \{([\s\S]*?)\}, ms\('--duration-flash'/.exec(script)?.[1];
  assert.ok(hide, 'the frame is no longer hidden on a --duration-flash timer');
  assert.match(hide, /frame\.hidden = true;/, 'the timer should hide the frame');
  assert.match(hide, /playBang\(\);/, 'the timer should sound the bang as it hides the frame');
  assert.doesNotMatch(script, /setTimeout\(playBang/, 'the bang should not be on a timer of its own');
});
