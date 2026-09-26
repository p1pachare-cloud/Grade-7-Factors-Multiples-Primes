import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envLocalPath = path.resolve(__dirname, '../.env.local');
let envKey = '';
if (fs.existsSync(envLocalPath)) {
  const match = fs.readFileSync(envLocalPath, 'utf8').match(/VITE_ELEVENLABS_API_KEY=(.+)/);
  if (match) envKey = match[1].trim();
}

const API_KEY = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY || envKey;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';

const STYLE_SETTINGS = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

const phrases = [
  // Phase 1 — Wonder
  {
    text: "A baker in Cairo has eighty-four cookies.",
    style: "thinking",
    filename: "audio_wonder_hook_0.mp3"
  },
  {
    text: "She wants to pack them into equal boxes, with more than one cookie per box, and none left over. How many different box sizes could she use?",
    style: "question",
    filename: "audio_wonder_hook_1.mp3"
  },
  {
    text: "Let's discover how factors help us crack this case!",
    style: "encouragement",
    filename: "audio_wonder_hook_2.mp3"
  },

  // Phase 2 — Story
  {
    text: "John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki form the Global Prime Detective Agency.",
    style: "statement",
    filename: "audio_story_panel1.mp3"
  },
  {
    text: "Mike in Cairo finds a locker with a two-digit code. The clue reads: I am a factor of eighty-four, and also a factor of sixty.",
    style: "statement",
    filename: "audio_story_panel2.mp3"
  },
  {
    text: "Sarah in Rio needs to arrange sixty mangoes into equal rows for her market stall, with no mangoes left over.",
    style: "statement",
    filename: "audio_story_panel3.mp3"
  },
  {
    text: "Aisha in Nairobi finds a strange number: forty-seven. It has only two factors, one and itself.",
    style: "emphasis",
    filename: "audio_story_panel4.mp3"
  },
  {
    text: "Carlos in Mexico City builds a factor tree to crack a vault code, splitting seventy-two again and again until only primes remain.",
    style: "statement",
    filename: "audio_story_panel5.mp3"
  },
  {
    text: "Every number has a hidden fingerprint made of primes. The Global Prime Detective Agency never fails to crack the case!",
    style: "emphasis",
    filename: "audio_story_panel6.mp3"
  },

  // Phase 3 — Simulation
  {
    text: "Rearrange the rows and columns until every tile is used, with no gaps!",
    style: "instruction",
    filename: "audio_sim_station_a.mp3"
  },
  {
    text: "Each array you build reveals a real factor pair. How many can you find?",
    style: "question",
    filename: "audio_sim_station_a_question.mp3"
  },
  {
    text: "Tap a number to split it into two factors. Keep going until every branch ends in a prime!",
    style: "instruction",
    filename: "audio_sim_station_b.mp3"
  },
  {
    text: "Cross out the multiples on the grid, then sort the numbers that remain.",
    style: "instruction",
    filename: "audio_sim_station_c.mp3"
  },

  // Feedback & Completion
  {
    text: "Case cracked! Your factor detective work is perfect! You are a true Prime Detective!",
    style: "celebration",
    filename: "audio_celebrate.mp3"
  },
  {
    text: "Not quite the right clue! Let's check the number again.",
    style: "encouragement",
    filename: "audio_encouragement.mp3"
  },
  {
    text: "If a number were a suspect, what clues would you look for to prove it is prime? Tell Sift what you learned today!",
    style: "thinking",
    filename: "audio_reflect.mp3"
  },
  {
    text: "Lesson complete! You are a Global Prime Detective Champion!",
    style: "celebration",
    filename: "audio_complete.mp3"
  }
];

const outputDir = path.resolve(__dirname, '../public/assets/audio');
fs.mkdirSync(outputDir, { recursive: true });

async function generateAudioForPhrase(phrase, index) {
  const filePath = path.join(outputDir, phrase.filename);
  console.log(`[${index + 1}/${phrases.length}] Generating audio for: "${phrase.text.slice(0, 45)}..."`);

  const settings = STYLE_SETTINGS[phrase.style] || STYLE_SETTINGS.statement;

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: phrase.text,
      model_id: MODEL_ID,
      voice_settings: settings
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
  console.log(` Saved ${phrase.filename}`);
}

async function main() {
  if (!API_KEY) {
    console.error('ERROR: No ElevenLabs API key found.');
    process.exit(1);
  }

  for (let i = 0; i < phrases.length; i++) {
    try {
      await generateAudioForPhrase(phrases[i], i);
      await new Promise(r => setTimeout(r, 600)); // Rate limit 600ms
    } catch (err) {
      console.error(`Failed on phrase "${phrases[i].text.slice(0, 30)}...":`, err.message);
    }
  }

  // Update audioMap.js
  const mapPath = path.resolve(__dirname, '../src/utils/audioMap.js');
  const mapLines = phrases.map(p => `  ${JSON.stringify(p.text)}: "/assets/audio/${p.filename}",`);
  const mapContent = `// AUTO-GENERATED BY scripts/generate_audio.js\nexport const audioMap = {\n${mapLines.join('\n')}\n};\n`;
  fs.writeFileSync(mapPath, mapContent);
  console.log(`\nUpdated ${mapPath}`);
}

main();
