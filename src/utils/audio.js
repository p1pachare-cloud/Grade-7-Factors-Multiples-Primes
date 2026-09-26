import { audioMap } from './audioMap';

const STYLE_SETTINGS = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

let currentAudio = null;
let activeQueueSymbol = null;
const elevenLabsCache = new Map();

// Web Audio API context for instant micro-feedback
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'correct') {
      // Pleasant bright major third chord
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } else if (type === 'incorrect') {
      // Soft gentle bonk
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'fanfare') {
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.5);
      });
    }
  } catch (e) {
    // Ignore audio context autoplay restrictions
  }
}

export function say(text) { return { text, style: 'statement' }; }
export function ask(text) { return { text, style: 'question' }; }
export function cheer(text) { return { text, style: 'encouragement' }; }
export function emphasize(text) { return { text, style: 'emphasis' }; }
export function think(text) { return { text, style: 'thinking' }; }
export function celebrate(text) { return { text, style: 'celebration' }; }
export function instruct(text) { return { text, style: 'instruction' }; }

export function stopNarration() {
  activeQueueSymbol = Symbol();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export async function getAudioUrl(text, style = 'statement') {
  if (audioMap[text]) {
    return audioMap[text];
  }

  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) {
    return elevenLabsCache.get(cacheKey);
  }

  const apiKey = import.meta.env?.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const styleSettings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: styleSettings,
        }),
      }
    );

    if (!response.ok) return null;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    elevenLabsCache.set(cacheKey, url);
    return url;
  } catch (err) {
    console.warn('ElevenLabs dynamic narration skipped:', err);
    return null;
  }
}

function playAudioFile(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      currentAudio = null;
      resolve();
    };
    audio.play().catch(() => {
      currentAudio = null;
      resolve();
    });
  });
}

export async function narrate(segments, enabled = true, onSegmentStart = null) {
  if (!enabled || !segments || segments.length === 0) return;
  stopNarration();
  const queueSymbol = Symbol();
  activeQueueSymbol = queueSymbol;

  for (let i = 0; i < segments.length; i++) {
    if (activeQueueSymbol !== queueSymbol) break;
    const seg = typeof segments[i] === 'string' ? { text: segments[i], style: 'statement' } : segments[i];
    if (!seg.text) continue;

    const url = await getAudioUrl(seg.text, seg.style);
    if (activeQueueSymbol !== queueSymbol) break;

    if (url) {
      if (onSegmentStart) onSegmentStart(i);
      // Preload next segment
      if (i + 1 < segments.length) {
        const nextSeg = typeof segments[i + 1] === 'string' ? { text: segments[i + 1] } : segments[i + 1];
        getAudioUrl(nextSeg.text, nextSeg.style);
      }
      await playAudioFile(url);
    }
  }
}
