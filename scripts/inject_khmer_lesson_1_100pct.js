import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';

console.log("=== Building 100% Complete Khmer Grade 6 Lesson 1 Interactive Module ===");

// 1. Read the user's exact pasted HTML file
const pastedPath = 'public/assets/aistudio/Paste_October_29__2026_-_9_40PM_cfbfd3ee';
let rawHtml = fs.readFileSync(pastedPath, 'utf8');

// 2. Add Khmer Speech Synthesis polyfill (/api/tts + fallback) so toggleSpeechCurrentSection() works on all devices without window.alert
const khmerSpeechPolyfill = `
  <script>
    (function() {
      var currentAudio = null;
      var cancelPlayback = false;

      var splitKhmerChunks = function(text, maxLen) {
        if (!text) return [];
        maxLen = maxLen || 140;
        text = text.replace(/[\\u200B-\\u200D\\uFEFF]/g, '').replace(/\\s+/g, ' ').trim();
        var segments = text.split(/([។\\n!?]+)/);
        var sentences = [];
        for (var i = 0; i < segments.length; i += 2) {
          var s = (segments[i] || '') + (segments[i + 1] || '');
          s = s.trim();
          if (s) sentences.push(s);
        }
        if (sentences.length === 0 && text.trim()) {
          sentences = [text.trim()];
        }
        var chunks = [];
        for (var j = 0; j < sentences.length; j++) {
          var sent = sentences[j];
          if (sent.length <= maxLen) {
            chunks.push(sent);
          } else {
            var words = sent.split(/\\s+/);
            var cur = "";
            for (var k = 0; k < words.length; k++) {
              var w = words[k];
              if ((cur + " " + w).length <= maxLen) {
                cur = cur ? (cur + " " + w) : w;
              } else {
                if (cur) chunks.push(cur);
                if (w.length > maxLen) {
                  for (var m = 0; m < w.length; m += maxLen) {
                    chunks.push(w.slice(m, m + maxLen));
                  }
                  cur = "";
                } else {
                  cur = w;
                }
              }
            }
            if (cur) chunks.push(cur);
          }
        }
        return chunks;
      };

      window.stopKhmerLessonAudio = function() {
        cancelPlayback = true;
        if (currentAudio) {
          try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
          } catch (e) {}
          currentAudio = null;
        }
      };

      window.playKhmerLessonSpeech = function(text, onStart, onEnd, onError) {
        window.stopKhmerLessonAudio();
        cancelPlayback = false;
        if (!text || !text.trim()) {
          if (onEnd) onEnd();
          return;
        }
        var chunks = splitKhmerChunks(text, 140);
        if (!chunks.length) {
          if (onEnd) onEnd();
          return;
        }
        if (onStart) onStart();
        var index = 0;
        function playNext() {
          if (cancelPlayback || index >= chunks.length) {
            currentAudio = null;
            if (onEnd) onEnd();
            return;
          }
          var chunk = chunks[index++];
          var primaryUrl = "/api/tts?text=" + encodeURIComponent(chunk);
          var fallbackUrl = "https://translate.google.com/translate_tts?ie=UTF-8&tl=km&client=tw-ob&q=" + encodeURIComponent(chunk);
          var audio = new Audio();
          currentAudio = audio;
          var handled = false;
          var nextStep = function() {
            if (handled) return;
            handled = true;
            if (currentAudio === audio) currentAudio = null;
            playNext();
          };
          audio.onended = nextStep;
          audio.onerror = function() {
            if (cancelPlayback) { nextStep(); return; }
            var fbAudio = new Audio(fallbackUrl);
            currentAudio = fbAudio;
            fbAudio.onended = nextStep;
            fbAudio.onerror = nextStep;
            fbAudio.play().catch(nextStep);
          };
          audio.src = primaryUrl;
          audio.play().catch(function() {
            if (cancelPlayback) { nextStep(); return; }
            var fbAudio = new Audio(fallbackUrl);
            currentAudio = fbAudio;
            fbAudio.onended = nextStep;
            fbAudio.onerror = function(err) {
              if (onError) onError(err);
              nextStep();
            };
            fbAudio.play().catch(nextStep);
          });
        }
        playNext();
      };
    })();
  </script>
`;

rawHtml = rawHtml.replace('</head>', khmerSpeechPolyfill + '\n</head>');

// 3. Add Close button right next to Dark Mode toggle in the header so user can close modal directly
const darkModeBtnBlock = `        <!-- Dark Mode Toggle -->
        <button onclick="toggleDarkMode()" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 flex items-center justify-center transition" title="ផ្លាស់ប្តូរពន្លឺ">
          <i class="fa-solid fa-moon dark:hidden text-sm"></i>
          <i class="fa-solid fa-sun hidden dark:inline text-sm"></i>
        </button>`;

const closeBtnAddition = darkModeBtnBlock + `

        <!-- Close Lesson Modal Button -->
        <button id="closeModalBtn" onclick="closeKhmerLessonModal()" class="w-9 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-sm cursor-pointer" title="បិទមេរៀន">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>`;

if (rawHtml.includes(darkModeBtnBlock)) {
  rawHtml = rawHtml.replace(darkModeBtnBlock, closeBtnAddition);
  console.log("Added Close Modal button to header.");
}

// 4. Upgrade toggleSpeechCurrentSection to use window.playKhmerLessonSpeech without alert()
const oldTtsBlock = `    let isSpeaking = false;
    function toggleSpeechCurrentSection() {
      if (!('speechSynthesis' in window)) {
        alert('ឧបករណ៍នេះមិនគាំទ្រការអានជាសំឡេង (Speech Synthesis) ទេ។');
        return;
      }
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
        return;
      }

      const activePanel = document.getElementById(activeSectionId);
      if (!activePanel) return;
      const textToRead = activePanel.innerText;

      const utterance = new SpeechSynthesisUtterance(textToRead.slice(0, 500));
      utterance.lang = 'km-KH';
      utterance.rate = 0.9;
      utterance.onend = () => {
        isSpeaking = false;
        document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
      };
      utterance.onerror = () => {
        isSpeaking = false;
        document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
      };

      window.speechSynthesis.speak(utterance);
      isSpeaking = true;
      document.getElementById('ttsBtnText').innerText = "បញ្ឈប់សំឡេង";
    }`;

const newTtsBlock = `    let isSpeaking = false;
    function closeKhmerLessonModal() {
      if (window.stopKhmerLessonAudio) window.stopKhmerLessonAudio();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'CLOSE_KHMER_LESSON_1' }, '*');
      }
    }

    function toggleSpeechCurrentSection() {
      if (isSpeaking) {
        if (window.stopKhmerLessonAudio) window.stopKhmerLessonAudio();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        isSpeaking = false;
        document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
        return;
      }

      const activePanel = document.getElementById(activeSectionId);
      if (!activePanel) return;
      const textToRead = activePanel.innerText.slice(0, 900);

      if (window.playKhmerLessonSpeech) {
        isSpeaking = true;
        document.getElementById('ttsBtnText').innerText = "បញ្ឈប់សំឡេង";
        window.playKhmerLessonSpeech(
          textToRead,
          () => {
            isSpeaking = true;
            document.getElementById('ttsBtnText').innerText = "បញ្ឈប់សំឡេង";
          },
          () => {
            isSpeaking = false;
            document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
          },
          () => {
            isSpeaking = false;
            document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
          }
        );
        return;
      }

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToRead.slice(0, 500));
        utterance.lang = 'km-KH';
        utterance.rate = 0.9;
        utterance.onend = () => {
          isSpeaking = false;
          document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
        };
        utterance.onerror = () => {
          isSpeaking = false;
          document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
        };
        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
        document.getElementById('ttsBtnText').innerText = "បញ្ឈប់សំឡេង";
      }
    }`;

if (rawHtml.includes(oldTtsBlock)) {
  rawHtml = rawHtml.replace(oldTtsBlock, newTtsBlock);
  console.log("Upgraded toggleSpeechCurrentSection with real Khmer TTS audio.");
}

// 5. Support ?tab=tab-qcm on DOMContentLoaded
const oldDomLoaded = `    window.addEventListener('DOMContentLoaded', () => {
      renderAbbreviations();
      renderPage3Words();
      renderPage4Vocab();
      renderAlphabetSorter();
      renderSynonymGame();
      renderTeacherChecklist();
      renderNumberSorter();
      initQcmSystem();
    });`;

const newDomLoaded = `    window.addEventListener('DOMContentLoaded', () => {
      renderAbbreviations();
      renderPage3Words();
      renderPage4Vocab();
      renderAlphabetSorter();
      renderSynonymGame();
      renderTeacherChecklist();
      renderNumberSorter();
      initQcmSystem();
      try {
        const params = new URLSearchParams(window.location.search);
        const initTab = params.get('tab');
        if (initTab && document.getElementById(initTab)) {
          switchTab(initTab);
        }
        const stuName = params.get('student');
        if (stuName && document.getElementById('studentNameInput')) {
          document.getElementById('studentNameInput').value = stuName;
        }
      } catch (e) {}
    });`;

if (rawHtml.includes(oldDomLoaded)) {
  rawHtml = rawHtml.replace(oldDomLoaded, newDomLoaded);
  console.log("Added URL parameter ?tab= support on DOMContentLoaded.");
}

// Write public/khmer-lesson-1.html and dist/khmer-lesson-1.html
fs.writeFileSync('public/khmer-lesson-1.html', rawHtml, 'utf8');
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/khmer-lesson-1.html', rawHtml, 'utf8');
}
console.log("Saved public/khmer-lesson-1.html (" + rawHtml.length + " bytes).");

// 6. Extract the 40 QCM questions from the user's code for ZiKhmer1 & IzKhmer1
const qcmQuestions = [
  { q: "១. ក្នុងវចនានុក្រម អក្សរកាត់ «កិ. វិ.» តំណាងឱ្យអ្វី?", options: ["កិរិយាវិសេស", "កិរិយាឧបគ្រោះ", "ក្លាយមកជាពាក្យ", "កាលវិភាគការងារ"], ans: 0, exp: "«កិ. វិ.» គឺជាអក្សរសង្ខេបសម្គាល់ «កិរិយាវិសេស» នៅក្នុងវចនានុក្រម (ទំព័រ ២)។" },
  { q: "២. កតញ្ញូធម៌ចំពោះឪពុកម្ដាយដែលកូនត្រូវបំពេញមានចំនួនប៉ុន្មានប្រការ?", options: ["មានបីប្រការ", "មានបួនប្រការ", "មានប្រាំប្រការ", "មានប្រាំពីរប្រការ"], ans: 2, exp: "នៅក្នុងមេរៀនទី១ កំណាព្យចែងអំពី «កតញ្ញូប្រាំប្រការ» ចំពោះឪពុកម្ដាយ (ទំព័រ ៥)។" },
  { q: "៣. តាមវចនានុក្រម ពាក្យថា «សោមនស្ស» មានន័យដូចម្ដេច?", options: ["សេចក្ដីព្រួយបារម្ភ", "សេចក្ដីរីករាយត្រេកអរ", "សេចក្ដីខឹងក្រេវក្រោធ", "សេចក្ដីសោកស្ដាយក្រៃលែង"], ans: 1, exp: "«សោមនស្ស» (បាលី) សំដៅលើសេចក្ដីរីករាយ ត្រេកអរ ចិត្តស្រស់ស្រាយ (ទំព័រ ៤)។" },
  { q: "៤. តើឃ្លាមួយណាមានប្រើប្រាស់ «គុណនាមចំនួនរៀប»?", options: ["សៀវភៅចំនួនប្រាំក្បាល", "ប្អូនរៀននៅថ្នាក់ទីប្រាំមួយ", "អ្នកភូមិប្រាំមួយនាក់", "ចានបាយសរុបប្រាំបួន"], ans: 1, exp: "«ថ្នាក់ទីប្រាំមួយ» ប្រាប់ពីលំដាប់ ជាន់ ឬថ្នាក់ ទើបជាគុណនាមចំនួនរៀប (ទំព័រ ១២)។" },
  { q: "៥. នៅក្នុងកំណាព្យ «បទពាក្យប្រាំពីរ» តើមួយវគ្គមានប៉ុន្មានឃ្លា?", options: ["មានចំនួនពីរឃ្លា", "មានចំនួនបីឃ្លា", "មានចំនួនបួនឃ្លា", "មានចំនួនប្រាំពីរឃ្លា"], ans: 2, exp: "បទពាក្យប្រាំពីរ ក្នុងមួយវគ្គមាន ៤ ឃ្លា ហើយក្នុងមួយឃ្លាមាន ៧ ព្យាង្គ (ទំព័រ ១៦)។" },
  { q: "៦. ក្នុងវចនានុក្រមខ្មែរ អក្សរកាត់ «កិ. ឧប.» តំណាងឱ្យពាក្យពេញមួយណា?", options: ["កិរិយាឧបគ្រោះ", "កិរិយាឧបសគ្គ", "កិរិយាពិសេស", "កិរិយាឧបសម្ព័ន្ធ"], ans: 0, exp: "«កិ. ឧប.» តំណាងឱ្យ «កិរិយាឧបគ្រោះ» (ទំព័រ ២)។" },
  { q: "៧. អក្សរសង្ខេប «កួ. ម.» នៅក្នុងវចនានុក្រមមានន័យពេញដូចម្តេច?", options: ["កាលពីជំនាន់មុន", "ក្លាយមកជា", "កើតមកជាមនុស្ស", "ក្បួនខ្នាតមេលេខ"], ans: 1, exp: "«កួ. ម.» មានន័យពេញថា «ក្លាយមកជា» (ទំព័រ ២)។" },
  { q: "៨. អក្សរកាត់ «ច្រ. ន.» នៅក្នុងវចនានុក្រមមានន័យដូចម្ដេច?", options: ["ច្រើននិយមហៅ", "ច្រៀងរៀបរាប់ន័យ", "ច្រើននិយាយថា", "ច្រើនប្រើជាទូទៅ"], ans: 2, exp: "«ច្រ. ន.» តំណាងឱ្យ «ច្រើននិយាយថា» (ទំព័រ ២)។" },
  { q: "៩. អក្សរសង្ខេប «បា. សំ.» បញ្ជាក់ពីប្រភពភាសាដើមមួយណា?", options: ["បារាំងនិងសំស្ក្រឹត", "បាលីនិងសៀម", "បារាំងនិងសៀម", "បាលីនិងសំស្ក្រឹត"], ans: 3, exp: "«បា. សំ.» សំដៅលើពាក្យដែលមានប្រភពមកពី «បាលីនិងសំស្ក្រឹត» (ទំព័រ ២)។" },
  { q: "១០. តើអក្សរកាត់ «រ. ស.» សម្គាល់ប្រភេទពាក្យមួយណា?", options: ["រឿងនិទានសង្ខេប", "រាជស័ព្ទ", "រៀបរាប់សេចក្តី", "រង្វាស់សម័យបុរាណ"], ans: 1, exp: "«រ. ស.» តំណាងឱ្យ «រាជស័ព្ទ» សម្រាប់ព្រះមហាក្សត្រ និងព្រះសង្ឃ (ទំព័រ ២)។" },
  { q: "១១. ពាក្យដែលសរសេរនៅខាងដើមជួរនីមួយៗក្នុងវចនានុក្រមដោយប្រើអក្សរធំ ដិត គេហៅថាអ្វី?", options: ["ពាក្យគន្លឹះ", "មេពាក្យ", "កន្សោមពាក្យ", "ប្រធានពាក្យ"], ans: 1, exp: "ពាក្យដែលគេត្រូវពន្យល់នៅដើមជួរ គេសរសេរអក្សរធំ ដិត ហៅថា «មេពាក្យ» (ទំព័រ ៣)។" },
  { q: "១២. អក្សរនៅក្នុងវង់ក្រចកបន្ទាប់ពីមេពាក្យ ដូចជា កវី (កៈ-វ៉ី) បង្ហាញអំពីអ្វី?", options: ["បញ្ជាក់ប្រភពពាក្យ", "បញ្ជាក់សូរអាន", "បញ្ជាក់ថ្នាក់ពាក្យ", "បញ្ជាក់ន័យផ្ទុយ"], ans: 1, exp: "អក្សរនៅក្នុងវង់ក្រចកនៅបន្ទាប់ពីមេពាក្យ គឺជា «សូរអាន» (ទំព័រ ៣)។" },
  { q: "១៣. តាមវចនានុក្រម តើពាក្យ «កវី» មានថ្នាក់ពាក្យជាអ្វី និងមានន័យដូចម្ដេច?", options: ["ជាគុណនាម ៖ អ្នកចេះដឹងច្រើន", "ជាកិរិយា ៖ ការតែងនិពន្ធសៀវភៅ", "ជានាម ៖ អ្នកប្រាជ្ញតែងកាព្យឃ្លោង", "ជានិបាត ៖ ពាក្យពោលសរសើរគ្នា"], ans: 2, exp: "កវី ជា នាម (ន.) សំដៅលើអ្នកប្រាជ្ញដែលចេះតែងកាព្យឃ្លោង (ទំព័រ ៣)។" },
  { q: "១៤. ពាក្យ «កសិកម្ម» ក្នុងវចនានុក្រមសម្គាល់ថាមានប្រភពមកពីភាសាអ្វី?", options: ["ភាសាសំស្ក្រឹត", "ភាសាបាលី", "ភាសាបារាំង", "ភាសាសៀម"], ans: 1, exp: "កសិកម្ម មានអក្សរកាត់ (បា.) បញ្ជាក់ថាមានប្រភពពីបាលី (ទំព័រ ៣)។" },
  { q: "១៥. បើតាមវចនានុក្រម ពាក្យ «បរិបូណ៌» មានន័យត្រឹមត្រូវដូចម្ដេច?", options: ["ដែលនៅខ្វះខាតច្រើន", "ដែលស្អាតបរិសុទ្ធក្រៃលែង", "ដែលថ្លៃថ្លាលើសលែងគេ", "ដែលពេញគ្រប់គ្រាន់សម្បូរ"], ans: 3, exp: "«បរិបូណ៌» គុ. មានន័យថា ដែលគ្រប់គ្រាន់ ពេញលេញ សម្បូរ (ទំព័រ ៤)។" },
  { q: "១៦. ពាក្យ «បដិសេធ» មានថ្នាក់ពាក្យជាអ្វីក្នុងវចនានុក្រម?", options: ["ថ្នាក់ពាក្យនាម", "ថ្នាក់ពាក្យកិរិយា", "ថ្នាក់ពាក្យគុណនាម", "ថ្នាក់ពាក្យនិបាត"], ans: 1, exp: "«បដិសេធ» ជា «កិរិយា» (កិ.) មានន័យថា ឃាត់ ហាម លើកចោល (ទំព័រ ៤)។" },
  { q: "១៧. ក្នុងចំណោមពាក្យទាំងបួននេះ តាមលំដាប់អក្ខរក្រម តើពាក្យណាត្រូវនៅមុនគេ?", options: ["ពាក្យឧបត្ថម្ភ", "ពាក្យមាតា", "ពាក្យគង្គា", "ពាក្យសោមនស្ស"], ans: 2, exp: "តាមលំដាប់ព្យញ្ជនៈខ្មែរ ព្យញ្ជនៈ «គ» (គង្គា) ស្ថិតនៅមុនគេ (ទំព័រ ៤)។" },
  { q: "១៨. តាមលំដាប់អក្ខរក្រម ហេតុអ្វីបានជាពាក្យ «មាតា» នៅពីមុខពាក្យ «មេត្តា»?", options: ["ព្រោះស្រៈ ា ស្ថិតនៅមុនស្រៈ េ", "ព្រោះពាក្យ មាតា ជានាមស័ព្ទ", "ព្រោះពាក្យ មេត្តា មានជើងអក្សរ", "ព្រោះពាក្យ មាតា មានប្រភពបាលី"], ans: 0, exp: "តាមលំដាប់ស្រៈខ្មែរ ស្រៈ « ា » ស្ថិតនៅមុនស្រៈ « េ » (ទំព័រ ៤)។" },
  { q: "១៩. តើពាក្យ «កតញ្ញូ» បង្ហាញពីអត្ថន័យអប់រំដូចម្ដេច?", options: ["ការសន្សំប្រាក់សម្រាប់ខ្លួនឯង", "ការដឹងគុណនិងតបស្នងសងគុណ", "ការស្ដាប់បង្គាប់ដោយមិនពិចារណា", "ការខិតខំរៀនសូត្រឱ្យពូកែតែម្នាក់ឯង"], ans: 1, exp: "«កតញ្ញូ» គឺការដឹងគុណូបការៈ និងការតបស្នងសងគុណវិញ (ទំព័រ ៥-៦)។" },
  { q: "២០. ក្នុងកំណាព្យ «កតញ្ញូប្រាំប្រការ» តើកូនត្រូវជួយអ្នកមានគុណក្នុងរឿងអ្វីខ្លះ?", options: ["ជួយផ្ដល់តែប្រាក់កាសប្រចាំខែ", "ជួយធ្វើការងារផ្ទះពេលទំនេរពីដើរលេង", "ផ្គត់ផ្គង់អាហារសម្លៀកបំពាក់និងជួយធុរៈ", "រៀបចំពិធីជប់លៀងជូនញាតិមិត្ត"], ans: 2, exp: "កំណាព្យចែងពីការផ្គត់ផ្គង់អាហារ សម្លៀកបំពាក់ និងជួយធុរៈការងារ (ទំព័រ ៥)។" },
  { q: "២១. តើពាក្យ «វន្ទា» មានន័យដូចគ្នានឹងពាក្យមួយណា?", options: ["ពាក្យពោលសរសើរ", "ពាក្យសំពះគោរព", "ពាក្យជូនដំណឹង", "ពាក្យទទួលទាន"], ans: 1, exp: "«វន្ទា» មានន័យដូចគ្នានឹង «សំពះ» ឬគោរព (ទំព័រ ៦)។" },
  { q: "២២. ពាក្យ «សព» មានសទិសន័យ (ន័យដូច) នឹងពាក្យមួយណា?", options: ["ខ្មោចរលត់សង្ខារ", "មាតាបង្កើត", "បុត្រភ្ងា", "បិតាជាទីស្រឡាញ់"], ans: 0, exp: "«សព» មានន័យដូចនឹង «ខ្មោច» (ទំព័រ ៦)។" },
  { q: "២៣. ក្នុងកំណាព្យ «ច្បាប់គោរពមាតាបិតា» តើពាក្យ «បុណ្យផ្កើល» មានន័យដូចម្ដេច?", options: ["ការធ្វើបុណ្យភ្ជុំបិណ្ឌតាមវត្ត", "ការសាងសង់ចេតិយឧទ្ទិសកុសល", "ការធ្វើបុណ្យទាន់ឪពុកម្ដាយនៅរស់", "ការរៀបចំពិធីបុណ្យខួបកំណើត"], ans: 2, exp: "បុណ្យផ្កើល គឺការធ្វើទាន ផ្គត់ផ្គង់ទាន់ឪពុកម្ដាយនៅរស់ និងពិសាកើត (ទំព័រ ៨)។" },
  { q: "២៤. ហេតុអ្វីបានជាលោក អ៊ូ ចុង ចែងថាការធ្វើបុណ្យខែទឹកពេលម៉ែឪចែកឋាន ម៉ែឥតប្រយោជន៍?", options: ["ព្រោះត្រូវចំណាយប្រាក់ច្រើន", "ព្រោះខ្មោចមិនអាចពិសាបាយបាន", "ព្រោះគ្មានបងប្អូនមកជួយចាត់ចែង", "ព្រោះខុសទំនៀមទម្លាប់បុរាណ"], ans: 1, exp: "«យកបាយឱ្យខ្មោច ម៉ែឥតប្រយោជន៍ ខ្មោចណាចេះស៊ី» (ទំព័រ ៨)។" },
  { q: "២៥. គោលបំណងចម្បងនៃការកត់ត្រាគំនិតសំខាន់ៗពេលអាន ឬស្ដាប់ គឺដើម្បីអ្វី?", options: ["ដើម្បីទន្ទេញឱ្យចាំគ្រប់តួអក្សរ", "ដើម្បីសរសេរតែងសេចក្តីឱ្យបានវែង", "ដើម្បីអួតបង្ហាញពីចំណេះដឹង", "ដើម្បីងាយយល់និងងាយចងចាំខ្លឹមសារ"], ans: 3, exp: "ការកត់ត្រាជួយឱ្យងាយចងចាំ និងយល់ខ្លឹមសារអត្ថបទ (ទំព័រ ៨)។" },
  { q: "២៦. កំណាព្យ «សន្ដានចិត្តរបស់អ្នកម្ដាយ» (ទំព័រ ៩) ត្រូវបានតែងឡើងតាមបទពាក្យអ្វី?", options: ["បទពាក្យប្រាំពីរ", "បទព្រហ្មគីតិ", "បទកាកគតិ", "បទពាក្យប្រាំបួន"], ans: 1, exp: "កំណាព្យ «សន្ដានចិត្តរបស់អ្នកម្ដាយ» តែងជា «បទព្រហ្មគីតិ» (ទំព័រ ៩)។" },
  { q: "២៧. តើសកម្មភាពមួយណាដែលមិនមែនជាការគោរពដ៏ត្រឹមត្រូវចំពោះលោកគ្រូ អ្នកគ្រូ?", options: ["សិស្សធ្វើត្រាប់តាមគ្រូដោយមិនគិត", "សិស្សស្ងៀមស្ងាត់ពេលលោកគ្រូមកដល់", "សិស្សយកចិត្តទុកដាក់ស្ដាប់ការពន្យល់", "សិស្សផ្ចិតផ្ចង់បំពេញកិច្ចការផ្ទះ"], ans: 0, exp: "ការធ្វើត្រាប់តាមដោយមិនគិតពិចារណា មិនមែនជាការគោរពត្រឹមត្រូវទេ (ទំព័រ ១០)។" },
  { q: "២៨. តើនិយមន័យត្រឹមត្រូវនៃ «គុណនាមចំនួនរាប់» គឺជាអ្វី?", options: ["គុណនាមប្រាប់លំដាប់ជួរឬថ្នាក់", "គុណនាមប្រាប់ចំនួនមនុស្សសត្វវត្ថុ", "គុណនាមបញ្ជាក់ពីពណ៌សម្បុរនាម", "គុណនាមប្រាប់ពីទំហំនិងទម្ងន់"], ans: 1, exp: "គុណនាមចំនួនរាប់ ប្រាប់ពីចំនួនមនុស្ស សត្វ វត្ថុ ដែលគេរាប់ (ទំព័រ ១១)។" },
  { q: "២៩. ក្នុងល្បះ «សុខាមានបងប្អូនបង្កើតចំនួនបួននាក់» តើពាក្យណាជាគុណនាមចំនួនរាប់?", options: ["ពាក្យសុខា", "ពាក្យបងប្អូន", "ពាក្យបួន", "ពាក្យនាក់"], ans: 2, exp: "ពាក្យ «បួន» ប្រាប់ចំនួនរាប់ (ទំព័រ ១១)។" },
  { q: "៣០. តើនិយមន័យត្រឹមត្រូវនៃ «គុណនាមចំនួនរៀប» គឺជាអ្វី?", options: ["គុណនាមប្រាប់ទីលំដាប់ជាន់ឬថ្នាក់", "គុណនាមប្រាប់ចំនួនសរុបនៃវត្ថុ", "គុណនាមប្រាប់រូបរាងទ្រង់ទ្រាយនាម", "គុណនាមប្រាប់ពីតម្លៃប្រាក់កាស"], ans: 0, exp: "គុណនាមចំនួនរៀប ប្រាប់ពីទី លំដាប់ ជាន់ ឬថ្នាក់ (ទំព័រ ១២)។" },
  { q: "៣១. ក្នុងល្បះ «សុខារៀននៅថ្នាក់ទីប្រាំមួយ» តើពាក្យណាជាគុណនាមចំនួនរៀប?", options: ["ពាក្យសុខា", "ពាក្យរៀន", "ពាក្យថ្នាក់", "ពាក្យទីប្រាំមួយ"], ans: 3, exp: "«ទីប្រាំមួយ» ប្រាប់ពីកម្រិតថ្នាក់/លំដាប់ (ទំព័រ ១២)។" },
  { q: "៣២. ក្នុងចំណោមពាក្យខាងក្រោម តើពាក្យមួយណាជា «គុណនាមចំនួនរៀប»?", options: ["ចំនួនដប់ពីរ", "ចំនួនមួយឡូ", "អគារជាន់ទីពីរ", "ប្រាក់បីពាន់"], ans: 2, exp: "«ជាន់ទីពីរ» បញ្ជាក់ពីជាន់នៃអគារ ជាចំនួនរៀប (ទំព័រ ១២)។" },
  { q: "៣៣. ក្នុងរឿង «បងប្រុស» ហេតុអ្វីបានជាជិតសម្រេចចិត្តផ្អាកការរៀនសូត្រ?", options: ["ដើម្បីទុកឱ្យប្អូនបានបន្តការសិក្សា", "ដើម្បីដើរលេងកម្សាន្តនៅទីក្រុង", "ដើម្បីរៀបការកសាងគ្រួសារផ្ទាល់ខ្លួន", "ដើម្បីគេចវេះពីការងារស្រែចម្ការ"], ans: 0, exp: "ជិតបានលះបង់ផ្អាករៀន ដើម្បីរកប្រាក់ឱ្យធួនបានរៀនបន្ត (ទំព័រ ១៣)។" },
  { q: "៣៤. ក្រោយមក តើជិតបានទទួលការបណ្ដុះបណ្ដាលបច្ចេកទេសចិញ្ចឹមសត្វពីទីកន្លែងណា?", options: ["មជ្ឈមណ្ឌលសិក្សាសហគមន៍", "ក្រុមហ៊ុនផ្គត់ផ្គង់ចំណីសត្វ", "សកលវិទ្យាល័យកសិកម្មជាតិ", "មន្ទីរពេទ្យព្យាបាលសត្វស្រុក"], ans: 0, exp: "ជិតបានរៀនពី «មជ្ឈមណ្ឌលសិក្សាសហគមន៍» (ទំព័រ ១៣)។" },
  { q: "៣៥. ពេលរៀនចប់ទទួលបានការងារ តើធួនបានតបគុណបងប្រុសដោយរបៀបណា?", options: ["ទិញរថយន្តទំនើបជិះម្នាក់ឯង", "សន្សំប្រាក់ជូនបងរៀបអាពាហ៍ពិពាហ៍", "សុំបងចែកដីស្រែចម្ការស្មើគ្នា", "ផ្លាស់ទីលំនៅទៅរស់នៅបរទេស"], ans: 1, exp: "ធួនបានសន្សំប្រាក់ខែជូនបងដើម្បីរៀបអាពាហ៍ពិពាហ៍ (ទំព័រ ១៤)។" },
  { q: "៣៦. ក្នុងរឿង «បងប្រុស» តើពាក្យ «ឧបត្ថម្ភ» មានន័យត្រឹមត្រូវដូចម្តេច?", options: ["ការជួយទំនុកបម្រុងផ្គត់ផ្គង់", "ការខ្ចីប្រាក់យកការប្រាក់ខ្ពស់", "ការទាមទារសំណងការខូចខាត", "ការផ្អាកការងារជាបណ្ដោះអាសន្ន"], ans: 0, exp: "«ឧបត្ថម្ភ» មានន័យថា ការជួយទំនុកបម្រុង ផ្គត់ផ្គង់ (ទំព័រ ១៤)។" },
  { q: "៣៧. ក្នុងអត្ថបទ «ការពណ៌នាអំពីអ្នកមានគុណ» តើលោកយាយសួនត្រូវជាអ្វីនឹងឪពុកស្រីណែត?", options: ["ជាអ្នកជិតខាងរាប់អានគ្នា", "ជាម្ដាយមីងបង្កើតរបស់ឪពុក", "ជាបងស្រីបង្កើតរបស់ឪពុក", "ជាលោកយាយបង្កើតខាងម្ដាយ"], ans: 1, exp: "លោកយាយសួនជាម្ដាយមីងរបស់ឪពុកស្រីណែត (ទំព័រ ១៥)។" },
  { q: "៣៨. គម្រោងតែងសេចក្ដីពណ៌នាអំពីមនុស្ស មានរចនាសម្ព័ន្ធធំៗចំនួនប៉ុន្មានផ្នែក?", options: ["មានពីរផ្នែកធំៗ", "មានបួនផ្នែកលម្អិត", "មានប្រាំផ្នែកសង្ខេប", "មានបីផ្នែកសំខាន់ៗ"], ans: 3, exp: "គម្រោងតែងសេចក្ដីមាន ៣ ផ្នែក ៖ សេចក្ដីផ្ដើម, តួសេចក្ដី និងសេចក្ដីបញ្ចប់ (ទំព័រ ៧)។" },
  { q: "៣៩. ក្នុងបទពាក្យប្រាំពីរ រវាងឃ្លាទី១ និងឃ្លាទី២ តើព្យាង្គណាត្រូវជួននឹងព្យាង្គណា?", options: ["ពាក្យទី៧ ឃ្លា១ ជួននឹងពាក្យទី៤ ឃ្លា២", "ពាក្យទី៤ ឃ្លា១ ជួននឹងពាក្យទី៧ ឃ្លា២", "ពាក្យទី៧ ឃ្លា១ ជួននឹងពាក្យទី៧ ឃ្លា២", "ពាក្យទី២ ឃ្លា១ ជួននឹងពាក្យទី២ ឃ្លា២"], ans: 0, exp: "បទពាក្យប្រាំពីរ ពាក្យទី ៧ ឃ្លាទី១ ជួននឹងពាក្យទី ៤ ឃ្លាទី២ (ទំព័រ ១៦)។" },
  { q: "៤០. ចំពោះពាក្យជួនឆ្លងវគ្គក្នុងបទពាក្យប្រាំពីរ តើពាក្យចុងវគ្គទី១ ត្រូវជួននឹងពាក្យណាខ្លះក្នុងវគ្គទី២?", options: ["ជួននឹងពាក្យដើមឃ្លាទីមួយ", "ជួននឹងពាក្យកណ្ដាលឃ្លាទីបួន", "ជួននឹងពាក្យចុងឃ្លាទីពីរនិងទីបី", "មិនបាច់មានពាក្យជួនឆ្លងវគ្គទេ"], ans: 2, exp: "ពាក្យទី ៧ ឃ្លាទី៤ (ចុងវគ្គ) ត្រូវជួននឹងពាក្យទី ៧ ឃ្លាទី២ និងឃ្លាទី៣ ក្នុងវគ្គបន្ទាប់ (ទំព័រ ១៦)។" }
].map(item => ({
  q: item.q,
  opts: item.options.map((opt, idx) => ({
    t: opt,
    c: idx === item.ans,
    e: item.exp
  }))
}));

const ziKhmer1Code = `ZiKhmer1=${JSON.stringify(qcmQuestions)},IzKhmer1={id:"khmer-lesson-1-quiz",title:"ភាសាខ្មែរ ថ្នាក់ទី៦ | មេរៀនទី ១ ៖ ការប្រើវចនានុក្រម & កតញ្ញូប្រាំប្រការ (៤០ សំណួរ QCM)",subject:"ភាសាខ្មែរ",grade:"ថ្នាក់ទី ៦",questionCount:40,questionsCount:40,durationMinutes:25,passingScore:70,isPublic:!0,imageUrl:"/assets/aistudio/IMG_4661_271a6dbe.png",description:"តេស្តពហុជ្រើសរើស QCM ៤០ សំណួរ (Step-by-Step) វាស់ស្ទង់សមត្ថភាពមេរៀនទី១ ទាំង ៨ ផ្នែក ព្រមទាំងមានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សា",questions:ZiKhmer1},`;

// 7. Build RzKhmer1 modal component that renders 100% of /khmer-lesson-1.html
const rzKhmer1Def = `RzKhmer1=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-dict"})=>{
  if(!r)return null;
  y.useEffect(()=>{
    document.body.classList.add("qcm-open","answering-exam");
    const onMsg = (ev) => {
      if (ev && ev.data && ev.data.type === "CLOSE_KHMER_LESSON_1") {
        t && t();
      }
    };
    window.addEventListener("message", onMsg);
    return () => {
      document.body.classList.remove("qcm-open","answering-exam");
      window.removeEventListener("message", onMsg);
      if (window.stopKhmerAudio) window.stopKhmerAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  },[t]);
  const targetTab = (a==="tab-quiz"||a==="quiz"||a==="tab-qcm") ? "tab-qcm" : "tab-dict";
  const iframeSrc = "/khmer-lesson-1.html?v=20261029_100pct&tab=" + encodeURIComponent(targetTab);
  return e.jsx("div",{
    "data-modal-open":"true",
    className:"fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col overflow-hidden animate-fadeIn",
    children:e.jsx("iframe",{
      src:iframeSrc,
      title:"ភាសាខ្មែរ ថ្នាក់ទី៦ មេរៀនទី១ | កម្មវិធីសិក្សាអន្តរកម្មពេញលេញ",
      className:"w-full h-full border-0 flex-1 bg-slate-50 dark:bg-slate-950",
      allow:"autoplay"
    })
  });
}`;

// 8. Build the Khmer Lesson 1 card for InteractiveSharedSection
const khmerLesson1CardJSX = `(H==="all"||H==="ភាសាខ្មែរ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border-2 border-indigo-500/90 overflow-hidden shadow-md hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-2 ring-indigo-400/40",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-indigo-950 via-indigo-800 to-purple-900",children:[e.jsx("img",{src:"/assets/aistudio/IMG_4661_271a6dbe.png",alt:"ភាសាខ្មែរ ថ្នាក់ទី៦ មេរៀនទី១",className:"absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition duration-500 opacity-80"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-slate-950/95 via-indigo-950/50 to-transparent"}),e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"🇰🇭"}),e.jsx("span",{className:"text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"ភាសាខ្មែរ ថ្នាក់ទី ៦"})]}),e.jsx("span",{className:"absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs",children:"មេរៀនទី ១ • 100%"}),e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១ ៖ ការប្រើវចនានុក្រម & កតញ្ញូប្រាំប្រការ"}),e.jsx("p",{className:"text-[10px] text-indigo-200 mt-0.5 font-medium drop-shadow-sm",children:"ទំព័រ ២ ដល់ ១៦ • កម្មវិធីសិក្សាអន្តរកម្មពេញលេញ ៨ ផ្នែក"})]})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"១.ការប្រើវចនានុក្រម • ២.កតញ្ញូប្រាំប្រការ • ៣.ការកត់ត្រាគំនិត • ៤.គុណនាមចំនួន • ៥.រឿងបងប្រុស • ៦.ការពណ៌នា & សំណេរ • ៧.ក្បួនកាព្យ • ៨.QCM ៤០ សំណួរ"}),e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-indigo-900 bg-indigo-50/80 p-2 rounded-xl border border-indigo-100",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Jr,{className:"w-2.5 h-2.5 text-amber-500"})," ៨ ផ្នែកពេញលេញ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Za,{className:"w-2.5 h-2.5 text-indigo-600"})," ល្បែងអន្តរកម្ម"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx(Ns,{className:"w-2.5 h-2.5 text-emerald-600"})," ៤០ QCM & វិញ្ញាបនបត្រ"]})]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qeKhmer1("tab-dict"),OeKhmer1(!0));},className:"w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-[11px] transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📚"}),e.jsx("span",{children:"រៀនអន្តរកម្ម"})]}),e.jsxs("button",{onClick:()=>{Ut||(qeKhmer1("tab-qcm"),OeKhmer1(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-[11px] transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🏆"}),e.jsx("span",{children:"តេស្ត QCM ៤០"})]})]})]}),`;

// 9. Patch bundle files
const bundleFiles = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

for (const filePath of bundleFiles) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // A. Inject ZiKhmer1 & IzKhmer1
  if (!code.includes('IzKhmer1=')) {
    const anchor = 'questions:Zi16},';
    const pos = code.indexOf(anchor);
    if (pos !== -1) {
      code = code.slice(0, pos + anchor.length) + ziKhmer1Code + code.slice(pos + anchor.length);
      console.log("Injected ZiKhmer1 & IzKhmer1 in " + filePath);
    } else {
      console.error("Could not find Zi16 anchor in " + filePath);
    }
  }

  // B. Unshift IzKhmer1 into quiz list in lCe
  if (!code.includes('IzKhmer1.id')) {
    const unshiftAnchor = 'at.unshift(Iz17),';
    const pos = code.indexOf(unshiftAnchor);
    if (pos !== -1) {
      const unshiftCode = `at.some(ys=>ys.id===IzKhmer1.id)||at.unshift(IzKhmer1),`;
      code = code.slice(0, pos) + unshiftCode + code.slice(pos);
      console.log("Unshifted IzKhmer1 into quiz list in " + filePath);
    }
  }

  // C. Inject RzKhmer1 component definition right before Rz15=({
  if (!code.includes('RzKhmer1=({')) {
    const rzAnchor = 'Rz15=({';
    const pos = code.indexOf(rzAnchor);
    if (pos !== -1) {
      code = code.slice(0, pos) + rzKhmer1Def + ",\n" + code.slice(pos);
      console.log("Injected RzKhmer1 definition in " + filePath);
    }
  } else {
    const startIdx = code.indexOf('RzKhmer1=({');
    const endIdx = code.indexOf(',\nRz15=({', startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
      code = code.slice(0, startIdx) + rzKhmer1Def + code.slice(endIdx);
      console.log("Updated RzKhmer1 definition in " + filePath);
    }
  }

  // D. Inject [XeKhmer1,OeKhmer1] state hooks in InteractiveSharedSection
  if (!code.includes('[XeKhmer1,OeKhmer1]')) {
    const stateAnchor = '[Xe17,Oe17]=y.useState(!1),[ze17,qe17]=y.useState("tab-hero"),';
    if (code.includes(stateAnchor)) {
      code = code.replace(
        stateAnchor,
        '[XeKhmer1,OeKhmer1]=y.useState(!1),[zeKhmer1,qeKhmer1]=y.useState("tab-dict"),' + stateAnchor
      );
      console.log("Injected XeKhmer1 state hooks in InteractiveSharedSection for " + filePath);
    }
  }

  // E. Inject Khmer Lesson 1 card into E==="interactive_lessons" in InteractiveSharedSection
  if (!code.includes('qeKhmer1("tab-dict")')) {
    const interactiveAnchor = 'E==="interactive_lessons"?e.jsxs("div",{ref:m,onMouseDown:ot,onMouseMove:ce,onMouseUp:we,onMouseLeave:we,className:"flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 select-none cursor-grab active:cursor-grabbing touch-pan-x",children:[';
    const pos = code.indexOf(interactiveAnchor);
    if (pos !== -1) {
      code = code.slice(0, pos + interactiveAnchor.length) + khmerLesson1CardJSX + code.slice(pos + interactiveAnchor.length);
      console.log("Injected Khmer Lesson 1 card into interactive_lessons for " + filePath);
    } else {
      console.error("Could not find interactive_lessons anchor in " + filePath);
    }
  }

  // F. Mount RzKhmer1 in InteractiveSharedSection modal list
  if (!code.includes('e.jsx(RzKhmer1,{isOpen:XeKhmer1')) {
    const mountAnchor = 'e.jsx(Rz17,{isOpen:Xe17,onClose:()=>Oe17(!1),onShowToast:u,initialTab:ze17}),';
    if (code.includes(mountAnchor)) {
      code = code.replace(
        mountAnchor,
        'e.jsx(RzKhmer1,{isOpen:XeKhmer1,onClose:()=>OeKhmer1(!1),onShowToast:u,initialTab:zeKhmer1}),' + mountAnchor
      );
      console.log("Mounted RzKhmer1 in InteractiveSharedSection for " + filePath);
    }
  }

  // G. Handle IzKhmer1 exam click in E==="exams" inside InteractiveSharedSection
  if (!code.includes('Pt.id==="khmer-lesson-1-quiz"')) {
    const examClickAnchor = 'if(!Ut)if(Sr)Me(!0);';
    if (code.includes(examClickAnchor)) {
      code = code.replace(
        examClickAnchor,
        'if(!Ut)if(Pt.id==="khmer-lesson-1-quiz"){qeKhmer1("tab-qcm");OeKhmer1(!0);}else if(Sr)Me(!0);'
      );
      console.log("Added IzKhmer1 exam click handler in " + filePath);
    }
  }

  // H. Also mount RzKhmer1 in Student Portal activeLessonModal
  if (!code.includes('activeLessonModal==="khmer1"')) {
    const portalMountAnchor = 'activeLessonModal===17&&e.jsx(Rz17,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),';
    if (code.includes(portalMountAnchor)) {
      code = code.replace(
        portalMountAnchor,
        'activeLessonModal==="khmer1"&&e.jsx(RzKhmer1,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),' + portalMountAnchor
      );
      console.log("Mounted RzKhmer1 in Student Portal for " + filePath);
    }
  }

  // I. Validate with esbuild
  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Validation & Save SUCCESS for " + filePath);
  } catch (err) {
    console.error("Syntax validation failed for " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== Completed 100% Khmer Grade 6 Lesson 1 Injection! ===");
