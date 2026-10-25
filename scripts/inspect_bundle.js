import fs from 'node:fs';

const code = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

console.log("Bundle total length:", code.length);

const rzMatches = [...code.matchAll(/\b(Rz\d+)\s*=/g)].map(m => m[1]);
console.log("Rz components found in bundle:", Array.from(new Set(rzMatches)));

const speechMatches = [...code.matchAll(/toggleSpeech/g)];
console.log("toggleSpeech count in bundle:", speechMatches.length);

const kmSpeechMatches = [...code.matchAll(/playKhmerSpeech/g)];
console.log("playKhmerSpeech count in bundle:", kmSpeechMatches.length);
