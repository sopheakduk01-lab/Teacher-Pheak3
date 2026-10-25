import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

console.log("=== Checking speech/audio occurrences in index-BwPwHqBe.js ===");

const matches = code.match(/speakText|speechSynthesis|ស្ដាប់ពន្យល់|ស្ដាប់សំណួរ/g);
console.log("Speech matches count:", matches ? matches.length : 0);

// Check if explanation box in main QCM or lesson modals has speech button
const mainQcmSpeechMatches = code.match(/ស្ដាប់ពន្យល់/g);
console.log("'ស្ដាប់ពន្យល់' button matches:", mainQcmSpeechMatches ? mainQcmSpeechMatches.length : 0);

const qcmAudioMatches = code.match(/🔊/g);
console.log("'🔊' speaker icon matches:", qcmAudioMatches ? qcmAudioMatches.length : 0);
