import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { audioMap } from '../src/utils/audioMap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.resolve(__dirname, '../public/assets/audio');

if (fs.existsSync(audioDir)) {
  const referencedFiles = new Set(
    Object.values(audioMap).map((filePath) => path.basename(filePath))
  );

  const existingFiles = fs.readdirSync(audioDir);
  let removedCount = 0;

  for (const file of existingFiles) {
    if (file.endsWith('.mp3') && !referencedFiles.has(file)) {
      fs.unlinkSync(path.join(audioDir, file));
      console.log(`Removed orphaned audio file: ${file}`);
      removedCount++;
    }
  }

  console.log(`Clean complete. ${removedCount} orphaned file(s) removed.`);
} else {
  console.log('Audio directory does not exist yet.');
}
