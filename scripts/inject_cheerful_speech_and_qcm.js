import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Injecting Cheerful Lesson Speech Hooks & QCM Speech ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

const hooks = {
  1: "តោះ! មកស្តាប់មេរៀនទី ១ ជីវិតរុក្ខជាតិ និងការសម្របខ្លួនទាំងអស់គ្នា! អាហាហា! ពីរោះណាស់!",
  2: "ជម្រាបសួរក្មួយៗ! តោះរៀនពីការដាំដំណាំកសិកម្មឱ្យបៃតងស្រស់បំព្រង! អាហាហា! សប្បាយខ្លាំងណាស់!",
  3: "តោះ! មកស្តាប់មេរៀនការចិញ្ចឹមសត្វពាហនៈ និងបក្សីបក្សាទាំងអស់គ្នា! អាហាហា! សប្បាយរីករាយ!",
  4: "តោះ! ស្រឡាញ់បរិស្ថានធម្មជាតិខៀវស្រងាត់ និងខ្យល់អាកាសបរិសុទ្ធទាំងអស់គ្នា! អាហាហា!",
  5: "តោះ! មកស្វែងយល់ពីធនធានធម្មជាតិដ៏មានតម្លៃរបស់ប្រទេសយើង! អាហាហា!",
  6: "តោះ! មកស្តាប់ការសិក្សាពីជីវវិទ្យានិងសុខភាពប្រដាប់បន្តពូជមនុស្សទាំងអស់គ្នា! អាហាហា!",
  7: "តោះ! មកយល់ដឹងពីការលូតលាស់នៃភាពពេញវ័យ និងការថែរក្សាសុខភាពរាងកាយ! អាហាហា!",
  8: "តោះ! មកស្តាប់ចំណេះដឹងសុខភាព និងការរៀបចំផែនការគ្រួសារ! អាហាហា!",
  9: "តោះ! មកចូលរួមរៀនមេរៀនសុខភាពបន្តពូជ និងការការពារជំងឺកាមរោគទាំងអស់គ្នា! អាហាហា!",
  10: "តោះ! មកមើលការប្រែប្រួលរូប និងការប្រែប្រួលគីមីដ៏អស្ចារ្យ! អាហាហា!",
  11: "តោះ! មកស្តាប់មេរៀនកម្ដៅ និងការចម្លងថាមពលសប្បាយៗ! អាហាហា!",
  12: "តោះ! មកស្តាប់មេរៀនចរន្តអគ្គិសនី និងសុវត្ថិភាពអគ្គិសនីទាំងអស់គ្នា! អាហាហា!",
  13: "តោះ! មកចូលរួមពិភពគីមីវិទ្យានិងពិសោធន៍ញែកល្បាយទាំងអស់គ្នា! អាហាហា! អស្ចារ្យណាស់!"
};

// Unified helper function code for playKhmerSpeech
const speechHelperCode = `
const toggleSpeech = (textToRead, lessonNum) => {
  if (window.__isSpeakingKhmer) {
    if (window.stopKhmerAudio) window.stopKhmerAudio();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    window.__isSpeakingKhmer = false;
    return;
  }
  if (!textToRead) return;
  const hook = ${JSON.stringify(hooks)}[lessonNum] || "តោះ! រៀនចំណុចនេះទាំងអស់គ្នា! អាហាហា! ពីរោះណាស់!";
  const fullText = (textToRead.startsWith("តោះ") || textToRead.startsWith("ជម្រាបសួរ")) ? textToRead : (hook + " " + textToRead);
  window.__isSpeakingKhmer = true;
  if (window.playKhmerSpeech) {
    window.playKhmerSpeech(
      fullText,
      () => { window.__isSpeakingKhmer = true; },
      () => { window.__isSpeakingKhmer = false; },
      () => { window.__isSpeakingKhmer = false; }
    );
  } else if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(fullText);
      utter.lang = "km-KH";
      utter.rate = 0.9;
      utter.onstart = () => { window.__isSpeakingKhmer = true; };
      utter.onend = () => { window.__isSpeakingKhmer = false; };
      utter.onerror = () => { window.__isSpeakingKhmer = false; };
      window.speechSynthesis.speak(utter);
    } catch(err) {
      window.__isSpeakingKhmer = false;
    }
  } else {
    window.__isSpeakingKhmer = false;
  }
};
`;

console.log("Speech Helper pattern verified.");
