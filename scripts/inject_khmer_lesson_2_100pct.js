import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Building 100% Complete Khmer Grade 6 Lesson 2 Interactive Module ===");

// 1. Read the user's exact pasted HTML file for Lesson 2
const pastedPath = 'public/assets/aistudio/Paste_October_31__2026_-_1_23PM_084be672';
let rawHtml = fs.readFileSync(pastedPath, 'utf8');

// 2. Add Khmer Speech Synthesis polyfill (/api/tts + fallback) so toggleSpeech() works on all devices
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

// 3. Add Close button right next to Theme Toggle in the header so user can close modal directly
const darkModeBtnBlock = `        <!-- Theme Toggle -->
        <button onclick="toggleDarkMode()" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-400 flex items-center justify-center transition">
          <i class="fa-solid fa-moon dark:hidden text-sm"></i>
          <i class="fa-solid fa-sun hidden dark:inline text-sm"></i>
        </button>`;

const closeBtnAddition = darkModeBtnBlock + `

        <!-- Close Lesson Modal Button -->
        <button id="closeModalBtn" onclick="closeKhmerLesson2Modal()" class="w-9 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-sm cursor-pointer" title="បិទមេរៀន">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>`;

if (rawHtml.includes(darkModeBtnBlock)) {
  rawHtml = rawHtml.replace(darkModeBtnBlock, closeBtnAddition);
  console.log("Added Close Modal button to Lesson 2 header.");
}

// 4. Upgrade toggleSpeech() to use window.playKhmerLessonSpeech
const oldTtsBlock = `    let isSpeaking = false;
    function toggleSpeech() {
      if (!('speechSynthesis' in window)) return;
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
        return;
      }
      const panel = document.getElementById(currentTab);
      if (!panel) return;
      const text = panel.innerText.slice(0, 500);

      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'km-KH';
      u.rate = 0.9;
      u.onend = () => { isSpeaking = false; document.getElementById('ttsBtnText').innerText = "អានសំឡេង"; };
      u.onerror = () => { isSpeaking = false; document.getElementById('ttsBtnText').innerText = "អានសំឡេង"; };

      window.speechSynthesis.speak(u);
      isSpeaking = true;
      document.getElementById('ttsBtnText').innerText = "បញ្ឈប់";
    }`;

const newTtsBlock = `    let isSpeaking = false;
    function closeKhmerLesson2Modal() {
      if (window.stopKhmerLessonAudio) window.stopKhmerLessonAudio();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'CLOSE_KHMER_LESSON_2' }, '*');
      }
    }

    function toggleSpeech() {
      if (isSpeaking) {
        if (window.stopKhmerLessonAudio) window.stopKhmerLessonAudio();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        isSpeaking = false;
        document.getElementById('ttsBtnText').innerText = "អានសំឡេង";
        return;
      }
      const panel = document.getElementById(currentTab);
      if (!panel) return;
      const text = panel.innerText.slice(0, 900);

      if (window.playKhmerLessonSpeech) {
        isSpeaking = true;
        document.getElementById('ttsBtnText').innerText = "បញ្ឈប់";
        window.playKhmerLessonSpeech(
          text,
          () => {
            isSpeaking = true;
            document.getElementById('ttsBtnText').innerText = "បញ្ឈប់";
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

      if (!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(text.slice(0, 500));
      u.lang = 'km-KH';
      u.rate = 0.9;
      u.onend = () => { isSpeaking = false; document.getElementById('ttsBtnText').innerText = "អានសំឡេង"; };
      u.onerror = () => { isSpeaking = false; document.getElementById('ttsBtnText').innerText = "អានសំឡេង"; };

      window.speechSynthesis.speak(u);
      isSpeaking = true;
      document.getElementById('ttsBtnText').innerText = "បញ្ឈប់";
    }`;

if (rawHtml.includes(oldTtsBlock)) {
  rawHtml = rawHtml.replace(oldTtsBlock, newTtsBlock);
  console.log("Upgraded Lesson 2 toggleSpeech with real Khmer TTS audio.");
}

// 5. Support ?tab=tab-qcm on DOMContentLoaded
const oldDomLoaded = `    window.addEventListener('DOMContentLoaded', () => {
      renderEventsOrder();
      initQuiz();
    });`;

const newDomLoaded = `    window.addEventListener('DOMContentLoaded', () => {
      renderEventsOrder();
      initQuiz();
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
  console.log("Added URL parameter ?tab= support on Lesson 2 DOMContentLoaded.");
}

// Write public/khmer-lesson-2.html and dist/khmer-lesson-2.html
fs.writeFileSync('public/khmer-lesson-2.html', rawHtml, 'utf8');
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/khmer-lesson-2.html', rawHtml, 'utf8');
}
console.log("Saved public/khmer-lesson-2.html (" + rawHtml.length + " bytes).");

// 6. Extract the 40 QCM questions for ZiKhmer2 & IzKhmer2
const qcmQuestions2 = [
  { q: "១. តាមខ្លឹមសារទំព័រទី១៧ តើកុមារនិងយុវជនមានភារកិច្ចសំខាន់អ្វីចំពោះជាតិ?", options: ["ជួយទ្រទ្រង់ប្រទេសជាតិឱ្យមានការរីកចម្រើន", "ស្វែងរកប្រាក់ចំណូលផ្គត់ផ្គង់គ្រួសារជាចម្បង", "ការពារសន្តិសុខតាមព្រំដែនប្រទេសជាតិ", "ចូលរួមធ្វើពលកម្មធ្ងន់ធ្ងរក្នុងសង្គម"], ans: 0, exp: "កុមារនិងយុវជនមានភារកិច្ចសំខាន់ក្នុងការជួយទ្រទ្រង់ប្រទេសជាតិឱ្យមានការរីកចម្រើន (ទំព័រ ១៧)។" },
  { q: "២. ដើម្បីឱ្យកុមារសម្រេចភារកិច្ចបានល្អ តើសហគមន៍និងអាណាព្យាបាលត្រូវធ្វើដូចម្ដេច?", options: ["ផ្ដល់តែប្រាក់កាសសម្រាប់ចាយវាយប្រចាំថ្ងៃ", "ផ្ដល់សិទ្ធិពេញលេញការពារនិងមិនរំលោភសិទ្ធិ", "បណ្ដោយឱ្យកុមារធ្វើអ្វីៗតាមទំនើងចិត្ត", "តម្រូវឱ្យកុមារឈប់រៀនដើម្បីធ្វើការងារ"], ans: 1, exp: "ត្រូវផ្ដល់សិទ្ធិពេញលេញដល់កុមារ ការពារកុមារ និងមិនរំលោភបំពានលើសិទ្ធិរបស់ពួកគេ (ទំព័រ ១៧)។" },
  { q: "៣. តើសកម្មភាពមួយណាដែលចាត់ទុកជាការរំលោភបំពានលើសិទ្ធិកុមារ?", options: ["ការនាំកុមារទៅពិនិត្យសុខភាពពេលមានជំងឺ", "ការបញ្ជូនកុមារឱ្យចូលរៀនសូត្រតាមកាលកំណត់", "ការបង្ខំឱ្យកុមារធ្វើពលកម្មធ្ងន់ធ្ងរខុសច្បាប់", "ការលើកទឹកចិត្តឱ្យកុមារបញ្ចេញមតិយោបល់"], ans: 2, exp: "ការបង្ខំឱ្យធ្វើពលកម្មធ្ងន់ធ្ងរគឺជាការរំលោភសិទ្ធិកុមារយ៉ាងធ្ងន់ធ្ងរ (ទំព័រ ១៧)។" },
  { q: "៤. តើពាក្យថា «សង្ខេបរឿង» មានន័យត្រឹមត្រូវដូចម្ដេច (ទំព័រ ១៨)?", options: ["ការទន្ទេញរឿងឱ្យចាំគ្រប់តួអក្សរនៃសៀវភៅ", "ការសរសេរបន្ថែមតួអង្គឱ្យរឿងកាន់តែវែង", "ការនិយាយឬសរសេរបំព្រួញរឿងឱ្យខ្លីដោយពាក្យខ្លួន", "ការផ្លាស់ប្ដូរកាលអាកាសនៃដំណើររឿងទាំងស្រុង"], ans: 2, exp: "សង្ខេបរឿង គឺនិយាយ ឬសរសេរបំព្រួញរឿងឱ្យខ្លី ដោយប្រើប្រាស់ពាក្យពេចន៍របស់ខ្លួន (ទំព័រ ១៨)។" },
  { q: "៥. ក្នុងការសង្ខេបរឿង តើជំហានដំបូងបង្អស់ដែលត្រូវអនុវត្តគឺជាអ្វី?", options: ["អានរឿងទាំងមូលនិងស្វែងយល់ឱ្យច្បាស់លាស់", "ស្រង់ព្រឹត្តិការណ៍បន្ទាប់បន្សំជាមុនសិន", "សរសេរតាក់តែងរឿងឡើងវិញភ្លាមៗ", "រៀបចំតែងកាព្យអំពីតួអង្គក្នុងរឿងនោះ"], ans: 0, exp: "ជំហានទី ១ គឺអានរឿងទាំងមូល និងស្វែងយល់ខ្លឹមសារឱ្យបានច្បាស់លាស់ជាមុន (ទំព័រ ១៨)។" },
  { q: "៦. តើជំហានទី ៤ នៃការសង្ខេបរឿងតម្រូវឱ្យយើងធ្វើអ្វី?", options: ["ស្រង់តែឈ្មោះតួអង្គសំខាន់ៗប៉ុណ្ណោះ", "រៀបព្រឹត្តិការណ៍តាមលំដាប់មុននិងក្រោយ", "ប្ដូរទីកន្លែងកើតហេតុក្នុងរឿងឱ្យប្លែក", "លុបចោលខ្លឹមសារដើមនៃរឿងទាំងមូល"], ans: 1, exp: "ជំហានទី ៤ គឺរៀបព្រឹត្តិការណ៍តាមលំដាប់មុនក្រោយ (ទំព័រ ១៨)។" },
  { q: "៧. ក្នុងការសរសេរសង្ខេបរឿងឡើងវិញ តើគេត្រូវប្រើប្រាស់អ្វីដើម្បីភ្ជាប់ព្រឹត្តិការណ៍?", options: ["ប្រើប្រាស់កន្សោមពាក្យឬឈ្នាប់សេចក្ដី", "ប្រើតែសញ្ញាខណ្ឌដោយមិនប្រើពាក្យភ្ជាប់", "ប្រើប្រាស់ពាក្យកាព្យចួនគ្រប់ឃ្លាទាំងអស់", "ប្រើប្រាស់តែពាក្យបាលីសំស្ក្រឹតបុរាណ"], ans: 0, exp: "ត្រូវប្រើកន្សោមពាក្យ ឬឈ្នាប់សេចក្ដី ដើម្បីភ្ជាប់ព្រឹត្តិការណ៍មួយទៅព្រឹត្តិការណ៍មួយទៀត (ទំព័រ ១៨)។" },
  { q: "៨. ក្នុងរឿង «ព្រាហ្មណ៍និងស្វា» ហេតុអ្វីបានជាស្វាខាំពស់វែកដាច់ជាកំណាត់?", options: ["ដើម្បីការពារកូនតូចរបស់ព្រាហ្មណ៍ពីគ្រោះថ្នាក់", "ដើម្បីយកសាច់ពស់ធ្វើជាចំណីអាហារប្រចាំថ្ងៃ", "ដើម្បីបង្ហាញឫទ្ធិអំណាចប្រាប់ដល់ព្រាហ្មណ៍", "ដើម្បីលេងកម្សាន្តតាមទម្លាប់ធម្មជាតិរបស់សត្វ"], ans: 0, exp: "ស្វាឃើញពស់ជាសត្រូវលូនមកជិតកូនតូច ក៏ស្ទុះទៅខាំការពារកូនព្រាហ្មណ៍ (ទំព័រ ១៨)។" },
  { q: "៩. ពេលត្រឡប់មកវិញ ហេតុអ្វីបានជាព្រាហ្មណ៍វាយសម្លាប់ស្វាភ្លាម?", options: ["ព្រោះព្រាហ្មណ៍ខឹងស្វាដែលមិនព្រមនៅស្ងៀម", "ព្រោះឃើញឈាមស្មានថាស្វាស៊ីកូនរបស់ខ្លួន", "ព្រោះស្វាមិនព្រមរត់ទៅទទួលស្វាគមន៍ម្ចាស់", "ព្រោះព្រាហ្មណ៍ចង់សាកល្បងកម្លាំងដំបងថ្មី"], ans: 1, exp: "ព្រាហ្មណ៍ឃើញឈាមប្រឡាក់មាត់ស្វា ក៏គិតឥតពិចារណាថាស្វាស៊ីកូនខ្លួន (ទំព័រ ១៩)។" },
  { q: "១០. តើអ្វីជាមូលហេតុធ្វើឱ្យព្រាហ្មណ៍មានចិត្តសោកស្ដាយក្រៃលែងនៅចុងបញ្ចប់?", options: ["ព្រោះបាត់បង់ដំបងដែលជាកេរមរតកដូនតា", "ព្រោះដឹងថាស្វាបានជួយការពារជីវិតកូនខ្លួន", "ព្រោះត្រូវចំណាយប្រាក់ទិញសត្វស្វាថ្មីមួយទៀត", "ព្រោះត្រូវរងការស្ដីបន្ទោសពីភរិយារបស់ខ្លួន"], ans: 1, exp: "ពេលឃើញកូនសុខសប្បាយ និងឃើញពស់ស្លាប់ ទើបដឹងថាស្វាជួយជីវិតកូន (ទំព័រ ១៩)។" },
  { q: "១១. តើរឿង «ព្រាហ្មណ៍និងស្វា» ផ្ដល់នូវតម្លៃអប់រំដ៏សំខាន់ដូចម្ដេច?", options: ["កុំចិញ្ចឹមសត្វស្វានៅក្នុងផ្ទះឱ្យសោះ", "កុំធ្វើការវិនិច្ឆ័យដោយខ្វះការពិចារណា", "ត្រូវទុកកូនតូចឱ្យនៅម្នាក់ឯងជានិច្ច", "ត្រូវសម្លាប់ពស់ទាំងអស់ដែលបានឃើញ"], ans: 1, exp: "រឿងនេះអប់រំកុំឱ្យឆាប់ខឹង និងកុំសម្រេចចិត្តដោយខ្វះការពិចារណាវែងឆ្ងាយ។" },
  { q: "១២. ក្នុងរឿង «ក្មេងស្រីបីនាក់» (ទំព័រ ២០) តើកូនស្រីពៅមានចរិយាសម្បត្តិដូចម្ដេច?", options: ["ចូលចិត្តដើរលេងកម្សាន្តជាមួយមិត្តភក្តិ", "មិនសូវចូលចិត្តការរៀនសូត្រនៅសាលាឡើយ", "ស្លូតបូត ចេះគិតគូរដល់គ្រួសារ និងខំរៀន", "ចូលចិត្តឈ្លោះប្រកែកជាមួយបងប្អូនជានិច្ច"], ans: 2, exp: "កូនស្រីពៅ ជាក្មេងស្លូតបូត ចេះគិតគូរដល់គ្រួសារ និងខិតខំរៀនសូត្រ (ទំព័រ ២០)។" },
  { q: "១៣. ក្នុងរឿង «បងប្អូនពីរនាក់» (ទំព័រ ២១) តើកូនស្រីច្បង និងកូនប្រុសប្អូនមានឈ្មោះអ្វី?", options: ["កូនច្បងឈ្មោះធាត និងកូនប្អូនឈ្មោះណាត", "កូនច្បងឈ្មោះសុខា និងកូនប្អូនឈ្មោះគុណ", "កូនច្បងឈ្មោះស្រីណែត និងកូនប្អូនឈ្មោះជិត", "កូនច្បងឈ្មោះធួន និងកូនប្អូនឈ្មោះណាត"], ans: 0, exp: "កូនស្រីច្បងឈ្មោះ ធាត កូនប្រុសប្អូនឈ្មោះ ណាត (ទំព័រ ២១)។" },
  { q: "១៤. ហេតុអ្វីបានជាឪពុកម្ដាយតែងតែខ្វល់ខ្វាយអំពីណាត?", options: ["ព្រោះណាតមានជំងឺប្រចាំកាយមិនដែលជា", "ព្រោះណាតច្រើនតែមានចិត្តច្រណែននឹងបងស្រី", "ព្រោះណាតមិនព្រមទៅសាលារៀនដូចក្មេងដទៃ", "ព្រោះណាតមិនចេះលេងរបស់ក្មេងលេងជាមួយគេ"], ans: 1, exp: "ឪពុកម្ដាយខ្វល់ខ្វាយព្រោះណាតច្រើនតែច្រណែននឹងបងស្រីខ្លួន (ទំព័រ ២១)។" },
  { q: "១៥. ដើម្បីឱ្យណាតចេះស្រឡាញ់បងស្រី តើឪពុកម្ដាយបានទិញអ្វីពីផ្សារមក?", options: ["ទិញកង់ថ្មីមួយគ្រឿងសម្រាប់ជិះទៅសាលា", "ទិញសម្លៀកបំពាក់និងស្បែកជើងថ្មីៗជាច្រើន", "ទិញកូនឡានជ័រមួយនិងសៀវភៅរូបភាពឡាន", "ទិញនំចំណីឆ្ងាញ់ៗទុកចែកកូនទាំងពីរនាក់"], ans: 2, exp: "ទិញកូនឡានជ័រមួយ និងសៀវភៅរូបភាពអំពីឡានតូច ធំមួយសម្រាប់ (ទំព័រ ២១)។" },
  { q: "១៦. ពេលធាតឱ្យកូនឡានទៅណាត តើនាងបានប្រាប់ប្អូនដូចម្ដេច?", options: ["ប្រាប់ថាមិត្តភក្តិឱ្យមកតែនាងចង់ទុកលេងខ្លួនឯង", "ប្រាប់ថាមិត្តភក្តិឱ្យមកតែនាងឱ្យប្អូនព្រោះប្អូនចូលចិត្ត", "ប្រាប់ថាឪពុកម្ដាយទិញឱ្យនាងហើយនាងមិនចង់បាន", "ប្រាប់ថានាងរើសបាននៅតាមផ្លូវពេលដើរមកផ្ទះ"], ans: 1, exp: "ធាតប្រាប់ថា «មិត្តភក្តិបងឱ្យបង តែបងមិនលេងទេ បងឱ្យទៅអូនវិញ...» (ទំព័រ ២២)។" },
  { q: "១៧. មួយសប្ដាហ៍ក្រោយមក តើធាតបានធ្វើដូចម្ដេចដើម្បីទាក់ទាញចិត្តប្អូន?", options: ["នាងយកនំមកទទួលទាននៅចំពោះមុខប្អូន", "នាងយកសៀវភៅរូបភាពឡានមកបើកមើលជិតប្អូន", "នាងបបួលប្អូនទៅដើរលេងនៅមាត់បឹងជិតផ្ទះ", "នាងដណ្ដើមកូនឡានជ័រពីដៃប្អូនយកមកទុកវិញ"], ans: 1, exp: "ធាតធ្វើជាយកសៀវភៅរូបភាពឡានមកបើកមើលពេលឃើញប្អូននៅជិត (ទំព័រ ២២)។" },
  { q: "១៨. ពេលហុចសៀវភៅរូបភាពឱ្យប្អូន តើធាតបានផ្ដាំផ្ញើណាតដូចម្ដេច?", options: ["ផ្ដាំឱ្យយកទៅបង្ហាញមិត្តភក្តិនៅសាលារៀន", "ផ្ដាំឱ្យបើកថ្នមៗកុំឱ្យរហែកនិងខូចខាត", "ផ្ដាំឱ្យលាក់ទុកកុំឱ្យឪពុកម្ដាយបានដឹងឮ", "ផ្ដាំឱ្យយកទៅដូរយករបស់លេងផ្សេងទៀត"], ans: 1, exp: "ធាតណែនាំថា «បើកវាថ្នមៗណា៎ កុំឱ្យរហែករបែក...» (ទំព័រ ២២)។" },
  { q: "១៩. តើលទ្ធផលចុងក្រោយនៃរឿង «បងប្អូនពីរនាក់» ក្លាយទៅជាយ៉ាងណា?", options: ["ណាតនៅតែបន្តច្រណែននិងខឹងនឹងបងស្រីដដែល", "ណាតឈប់ច្រណែនហើយចេះស្រឡាញ់លេងជាមួយបង", "ឪពុកម្ដាយសម្រេចចិត្តបញ្ជូនណាតទៅនៅស្រុកផ្សេង", "ធាតសម្រេចចិត្តមិននិយាយរកប្អូនប្រុសទៀតឡើយ"], ans: 1, exp: "ណាតតែងតែទៅជិតធាត និយាយលេងជាមួយគ្នាយ៉ាងសប្បាយ (ទំព័រ ២៣)។" },
  { q: "២០. តើពាក្យ «កូនច្បង» មានន័យផ្ទុយគ្នានឹងពាក្យមួយណា (ទំព័រ ២៣)?", options: ["ពាក្យកូនប្រុស", "ពាក្យកូនពៅ", "ពាក្យកូនភ្លោះ", "ពាក្យកូនទោល"], ans: 1, exp: "កូនច្បង មានន័យផ្ទុយនឹង «កូនពៅ» (ទំព័រ ២៣)។" },
  { q: "២១. ពាក្យ «ខ្វល់ចិត្ត» មានន័យផ្ទុយគ្នានឹងពាក្យមួយណា?", options: ["ពាក្យស្ងប់ចិត្ត", "ពាក្យឈឺចិត្ត", "ពាក្យតូចចិត្ត", "ពាក្យក្ដៅចិត្ត"], ans: 0, exp: "ខ្វល់ចិត្ត មានន័យផ្ទុយនឹង «ស្ងប់ចិត្ត» ឬសប្បាយចិត្ត (ទំព័រ ២៣)។" },
  { q: "២២. ពាក្យ «ស្រឡាញ់» មានន័យផ្ទុយគ្នានឹងពាក្យមួយណា?", options: ["ពាក្យអាណិត", "ពាក្យស្អប់", "ពាក្យចូលចិត្ត", "ពាក្យរាប់អាន"], ans: 1, exp: "ស្រឡាញ់ មានន័យផ្ទុយនឹង «ស្អប់» (ទំព័រ ២៣)។" },
  { q: "២៣. ក្នុងល្បះ «ឪពុកនាងផ្គត់ផ្គង់ចំណីអាហារ» តើពាក្យណាអាចជំនួសពាក្យ «ផ្គត់ផ្គង់» បាន?", options: ["ពាក្យទំនុកបម្រុង", "ពាក្យប្រាកដប្រជា", "ពាក្យអាទិត្យ", "ពាក្យម្ដាយឪពុក"], ans: 0, exp: "«ផ្គត់ផ្គង់» អាចជំនួសដោយពាក្យ «ទំនុកបម្រុង» (ទំព័រ ២៣)។" },
  { q: "២៤. ក្នុងល្បះ «មួយសប្ដាហ៍ក្រោយមក» តើពាក្យណាមានន័យស្មើនឹងពាក្យ «សប្ដាហ៍»?", options: ["ពាក្យអាទិត្យ", "ពាក្យខែ", "ពាក្យរដូវ", "ពាក្យឆ្នាំ"], ans: 0, exp: "«សប្ដាហ៍» មានន័យស្មើនឹង «អាទិត្យ» (៧ថ្ងៃ) (ទំព័រ ២៣)។" },
  { q: "២៥. ក្នុងរឿង «ទឹកចិត្តមេមាន់» (ទំព័រ ២៤) ហេតុអ្វីបានជាមេមាន់ព្រមចិញ្ចឹមកូនទា?", options: ["ព្រោះចង់បានកូនទាធ្វើជាអ្នកបម្រើកូនរបស់ខ្លួន", "ព្រោះមេមាន់យល់ថាកូនទាក៏មានសិទ្ធិរស់មានជីវិត", "ព្រោះកសិករបានបង្ខំឱ្យមេមាន់ត្រូវតែចិញ្ចឹម", "ព្រោះកូនទាអាចជួយរកចំណីមកឱ្យមេមាន់បានច្រើន"], ans: 1, exp: "មេមាន់ចិញ្ចឹមកូនទាព្រោះកូនទាក៏មានសិទ្ធិរស់មានជីវិតដូចក្មេងទូទៅដែរ (ទំព័រ ២៤)។" },
  { q: "២៦. តាមការឆ្លើយរបស់មេមាន់ តើមេមាន់នឹងឈប់ជួយកូនទានៅពេលណា?", options: ["នៅពេលដែលកូនទាចេះហែលទឹកលេងក្នុងត្រពាំង", "នៅពេលដែលកូនទាអាចរកស៊ីចិញ្ចឹមខ្លួនឯងបាន", "នៅពេលដែលកសិករលក់កូនទានោះចេញពីទ្រុង", "នៅពេលដែលកូនមាន់បង្កើតរបស់វារៀនចប់សព្វគ្រប់"], ans: 1, exp: "ដល់ពេលកូនទាអាចចិញ្ចឹមខ្លួនឯងបាន ទើបមេមាន់ឈប់ជួយ (ទំព័រ ២៤)។" },
  { q: "២៧. តើរឿង «ទឹកចិត្តមេមាន់» ឆ្លុះបញ្ចាំងពីសិទ្ធិជាមូលដ្ឋានមួយណារបស់កុមារ?", options: ["សិទ្ធិក្នុងការធ្វើដំណើរកម្សាន្តទៅក្រៅប្រទេស", "សិទ្ធិរស់រានមានជីវិតនិងទទួលបានការថែទាំ", "សិទ្ធិក្នុងការកាន់កាប់ទ្រព្យសម្បត្តិផ្ទាល់ខ្លួន", "សិទ្ធិក្នុងការបង្កើតក្រុមហ៊ុនអាជីវកម្មផ្ទាល់ខ្លួន"], ans: 1, exp: "រឿងនេះឆ្លុះបញ្ចាំងពីសិទ្ធិរស់រានមានជីវិត និងការថែទាំកុមារកំព្រា (ទំព័រ ២៤)។" },
  { q: "២៨. ក្នុងរឿង «អ្នកគ្រូរបស់គុណ» (ទំព័រ ២៦) តើគុណជាកុមារដែលមានជីវភាពដូចម្ដេច?", options: ["ជាកូនអ្នកមានទ្រព្យសម្បត្តិស្ដុកស្ដម្ភក្នុងភូមិ", "ជាកូនកំព្រាឪពុកម្ដាយរស់នៅជាមួយម្ដាយមីងក្រីក្រ", "ជាកូនមន្ត្រីរាជការធំដែលរស់នៅក្នុងទីក្រុង", "ជាក្មេងទំនើងដែលមិនចូលចិត្តការរៀនសូត្រ"], ans: 1, exp: "គុណជាកូនកំព្រា រស់នៅជាមួយម្ដាយមីង និងមានជីវភាពក្រីក្រ (ទំព័រ ២៦)។" },
  { q: "២៩. តើគុណមានចំណូលចិត្តនិងទេពកោសល្យពិសេសខាងអ្វី?", options: ["ប៉ិនប្រសប់ខាងការច្រៀងនិងលេងភ្លេងបុរាណ", "ប៉ិនប្រសប់ខាងការគូរគំនូរយ៉ាងស្អាតចំណាន", "ប៉ិនប្រសប់ខាងកីឡារត់ប្រណាំងនិងបាល់ទាត់", "ប៉ិនប្រសប់ខាងការដាំដំណាំស្រែចម្ការក្នុងភូមិ"], ans: 1, exp: "គុណចូលចិត្ត និងប៉ិនប្រសប់ក្នុងការគូរគំនូរ (ទំព័រ ២៦)។" },
  { q: "៣០. ពេលអ្នកគ្រូសួរថាតើចង់ក្លាយជាជាងគំនូរទេ ហេតុអ្វីបានជាគុណឆ្លើយថាមិនអាចធ្វើបាន?", options: ["ព្រោះគុណមិនចូលចិត្តមុខរបរជាជាងគំនូរនោះឡើយ", "ព្រោះគុណដឹងថាគ្រួសារខ្លួនក្រីក្រគ្មានប្រាក់រៀន", "ព្រោះគុណចង់ធ្វើជាគ្រូបង្រៀនវិញនៅពេលអនាគត", "ព្រោះគុណមិនចង់រៀនជាមួយឪពុកក្មេករបស់អ្នកគ្រូ"], ans: 1, exp: "គុណឆ្លើយបែបនេះដោយសារជីវភាពខ្វះខាត និងគ្មានលទ្ធភាព (ទំព័រ ២៦)។" },
  { q: "៣១. តើឪពុកក្មេករបស់អ្នកគ្រូមានអាជីពជាអ្វី?", options: ["ជាជាងសំណង់ដ៏ចំណានប្រចាំស្រុក", "ជាជាងគំនូរដ៏ចំណាននិងមានចិត្តសប្បុរស", "ជាគ្រូបង្រៀនផ្នែកអក្សរសាស្ត្រខ្មែរ", "ជាកសិករគំរូខាងការចិញ្ចឹមសត្វនិងត្រី"], ans: 1, exp: "ឪពុកក្មេករបស់អ្នកគ្រូជាជាងគំនូរដ៏ចំណាន និងចិត្តល្អ (ទំព័រ ២៦)។" },
  { q: "៣២. តើអ្នកគ្រូបានសន្យាថានឹងជួយឧបត្ថម្ភគុណផ្នែកអ្វីខ្លះ?", options: ["ជួយផ្ដល់ទីកន្លែងស្នាក់នៅថ្មីក្នុងទីក្រុង", "ជួយផ្នែកសម្ភារនិងទាក់ទងគ្រូបង្រៀនគំនូរ", "ជួយផ្ដល់ប្រាក់បៀវត្សរ៍ប្រចាំខែដល់គុណ", "ជួយទិញម៉ូតូថ្មីមួយគ្រឿងសម្រាប់ជិះរៀន"], ans: 1, exp: "អ្នកគ្រូជួយផ្នែកសម្ភារ និងពឹងឪពុកក្មេកឱ្យបង្រៀនគំនូរ (ទំព័រ ២៦)។" },
  { q: "៣៣. តាមវចនានុក្រម តើពាក្យថា «ជីវភាព» មានន័យដូចម្ដេច (ទំព័រ ២៥)?", options: ["ភាពនៃការរស់នៅឬការចិញ្ចឹមជីវិត", "ការប្រឡងយកសញ្ញាបត្រកម្រិតខ្ពស់", "សេចក្ដីក្លាហានក្នុងការជួយសង្គ្រោះអ្នកដទៃ", "ទ្រព្យសម្បត្តិដែលសល់ពីដូនតាមក"], ans: 0, exp: "«ជីវភាព» សំដៅលើភាពនៃការរស់នៅ ឬការប្រកបរបរចិញ្ចឹមជីវិត (ទំព័រ ២៥)។" },
  { q: "៣៤. តើពាក្យ «ឯកោ» មានន័យដូចម្ដេចក្នុងវចនានុក្រម?", options: ["ដែលនៅជុំគ្នាយ៉ាងកុះករអ៊ូអរ", "ដែលនៅតែម្នាក់ឯងស្ងាត់ច្រៀបកណ្ដោចកណ្ដែង", "ដែលមានទ្រព្យសម្បត្តិច្រើនលើសគេ", "ដែលមានបងប្អូនកូនចៅច្រើនកុះករ"], ans: 1, exp: "«ឯកោ» មានន័យថា នៅតែម្នាក់ឯង កណ្ដោចកណ្ដែង ស្ងាត់ច្រៀប (ទំព័រ ២៥)។" },
  { q: "៣៥. តើពាក្យណាជាពាក្យសូរដូចនឹងពាក្យ «ទុក» ក្នុងពាក្យ «ទុកចិត្ត»?", options: ["ពាក្យទាក់", "ពាក្យទុក្ខ", "ពាក្យទូក", "ពាក្យទាក់ទង"], ans: 1, exp: "ពាក្យ «ទុក្ខ» (សេចក្ដីលំបាក) មានសូរដូចនឹងពាក្យ «ទុក» (ទំព័រ ២៥)។" },
  { q: "៣៦. ក្នុងរឿង «មេមាន់និងកូនទា» តើព្រឹត្តិការណ៍ណាដែលកើតឡើងបន្ទាប់ពីកូនញាស់?", options: ["មេមាន់ខឹងស្ទុះបន្ទោសកូនឱ្យចូលអង្រុក", "មេមាន់នាំកូនចុះមកដីដើររកចំណីក្នុងចំការ", "កូនទានាំគ្នាចុះហែលទឹកលេងក្នុងត្រពាំង", "មេមាន់ភ័យរត់ឆ្លេឆ្លាហៅកូននៅមាត់ទឹក"], ans: 1, exp: "ដល់ពេលកូនញាស់ មេមាន់នាំកូនចុះមកដី រកចំណីក្នុងចំការ (ទំព័រ ២៥)។" },
  { q: "៣៧. ហេតុអ្វីបានជាមេមាន់ភ័យខ្លាំងនៅពេលទៅដល់មាត់ត្រពាំងទឹក?", options: ["ព្រោះខ្លាចសត្វក្អែកឆាបយកកូនទៅបាត់", "ព្រោះឃើញកូនទាចុះហែលទឹកខ្លាចកូនលង់ទឹក", "ព្រោះមេមាន់មិនចេះហែលទឹកឆ្លងត្រពាំង", "ព្រោះគ្មានចំណីអាហារសម្រាប់កូនស៊ីនៅទីនោះ"], ans: 1, exp: "មេមាន់ភ័យព្រោះឃើញកូនទាចុះទឹក ដោយសារវាជាមាន់ខ្លាចកូនលង់ទឹក (ទំព័រ ២៥)។" },
  { q: "៣៨. តើកូនទាបានធ្វើអ្វីនៅពេលព្រលប់ធ្លាក់ចុះ?", options: ["នាំគ្នាហែលចេញទៅឆ្ងាយពីមាត់ត្រពាំង", "នាំគ្នាឡើងមកក្រាបស្រលក្រោមស្លាបមេមាន់", "នាំគ្នារត់ពួនក្នុងគុម្ពស្មៅក្បែរមាត់ទឹក", "នាំគ្នាដើររកចំណីបន្តទៀតរហូតដល់យប់"], ans: 1, exp: "ដល់ពេលព្រលប់នាំគ្នាឡើងមកក្រាបស្រលក្រោមស្លាបមេ (ទំព័រ ២៥)។" },
  { q: "៣៩. ក្នុងចំណោមសិទ្ធិកុមារ តើការទទួលបានការអប់រំរៀនសូត្រចាត់ចូលក្នុងសិទ្ធិអ្វី?", options: ["សិទ្ធិក្នុងការអភិវឌ្ឍខ្លួន", "សិទ្ធិក្នុងការធ្វើអាជីវកម្ម", "សិទ្ធិក្នុងការកាត់ទោសអ្នកដទៃ", "សិទ្ធិក្នុងការជ្រើសរើសមេដឹកនាំ"], ans: 0, exp: "ការអប់រំ ការសិក្សារៀនសូត្រ គឺជាសិទ្ធិក្នុងការអភិវឌ្ឍ (Development Rights)។" },
  { q: "៤០. តាមទស្សនៈអប់រំនៃមេរៀនទី២ ទាំងមូល តើអ្វីជាក្ដីសង្ឃឹមដ៏ពិតប្រាកដរបស់កុមារ?", options: ["ការទទួលបានទ្រព្យសម្បត្តិស្ដុកស្ដម្ភពីឪពុកម្ដាយ", "ការទទួលបានសិទ្ធិពេញលេញ ការការពារ និងការអប់រំ", "ការបានធ្វើការងាររកប្រាក់ចំណូលតាំងពីក្មេងវ័យ", "ការរួចផុតពីការទៅរៀនសូត្រនៅឯសាលារៀន"], ans: 1, exp: "ក្ដីសង្ឃឹមរបស់កុមារ គឺការទទួលបានសិទ្ធិពេញលេញ ការការពារ ការអប់រំ និងក្ដីមេត្តាធម៌ពីសង្គម។" }
].map(item => ({
  q: item.q,
  opts: item.options.map((opt, idx) => ({
    t: opt,
    c: idx === item.ans,
    e: item.exp
  }))
}));

const ziKhmer2Code = `ZiKhmer2=${JSON.stringify(qcmQuestions2)},IzKhmer2={id:"khmer-lesson-2-quiz",title:"ភាសាខ្មែរ ថ្នាក់ទី៦ | មេរៀនទី ២ ៖ ក្ដីសង្ឃឹមរបស់កុមារ (៤០ សំណួរ QCM)",subject:"ភាសាខ្មែរ",grade:"ថ្នាក់ទី ៦",questionCount:40,questionsCount:40,durationMinutes:25,passingScore:70,isPublic:!0,imageUrl:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",description:"តេស្តពហុជ្រើសរើស QCM ៤០ សំណួរ (Step-by-Step) វាស់ស្ទង់សមត្ថភាពមេរៀនទី២ ក្ដីសង្ឃឹមរបស់កុមារ (ទំព័រ ១៧-២៦) ព្រមទាំងមានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សា",questions:ZiKhmer2},`;

// 7. Build RzKhmer2 modal component that renders 100% of /khmer-lesson-2.html
const rzKhmer2Def = `RzKhmer2=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-rights"})=>{
  if(!r)return null;
  y.useEffect(()=>{
    document.body.classList.add("qcm-open","answering-exam");
    const onMsg = (ev) => {
      if (ev && ev.data && ev.data.type === "CLOSE_KHMER_LESSON_2") {
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
  const targetTab = (a==="tab-quiz"||a==="quiz"||a==="tab-qcm") ? "tab-qcm" : "tab-rights";
  const iframeSrc = "/khmer-lesson-2.html?v=20261031_100pct&tab=" + encodeURIComponent(targetTab);
  return e.jsx("div",{
    "data-modal-open":"true",
    className:"fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col overflow-hidden animate-fadeIn",
    children:e.jsx("iframe",{
      src:iframeSrc,
      title:"ភាសាខ្មែរ ថ្នាក់ទី៦ មេរៀនទី២ | ក្ដីសង្ឃឹមរបស់កុមារ (ទំព័រ ១៧-២៦)",
      className:"w-full h-full border-0 flex-1 bg-slate-50 dark:bg-slate-950",
      allow:"autoplay"
    })
  });
}`;

// 8. Build the Khmer Lesson 2 card for InteractiveSharedSection
const khmerLesson2CardJSX = `(H==="all"||H==="ភាសាខ្មែរ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border-2 border-teal-500/90 overflow-hidden shadow-md hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-2 ring-teal-400/40",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-teal-900 via-cyan-800 to-indigo-900",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",alt:"ភាសាខ្មែរ ថ្នាក់ទី៦ មេរៀនទី២",className:"absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 opacity-75"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-slate-950/95 via-teal-950/50 to-transparent"}),e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"🇰🇭"}),e.jsx("span",{className:"text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"ភាសាខ្មែរ ថ្នាក់ទី ៦"})]}),e.jsx("span",{className:"absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-teal-500 text-white shadow-xs",children:"មេរៀនទី ២ • 100%"}),e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ២ ៖ ក្ដីសង្ឃឹមរបស់កុមារ"}),e.jsx("p",{className:"text-[10px] text-teal-200 mt-0.5 font-medium drop-shadow-sm",children:"ទំព័រ ១៧ ដល់ ២៦ • កម្មវិធីសិក្សាអន្តរកម្មពេញលេញ ៦ ផ្នែក"})]})]}),e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"១.សិទ្ធិកុមារ (ទ.១៧) • ២.ការសង្ខេបរឿង & ព្រាហ្មណ៍និងស្វា • ៣.រឿងបងប្អូនពីរនាក់ • ៤.ទឹកចិត្តមេមាន់ • ៥.អ្នកគ្រូរបស់គុណ • ៦.តេស្ត QCM ៤០ សំណួរ"}),e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-teal-900 bg-teal-50/80 p-2 rounded-xl border border-teal-100",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Jr,{className:"w-2.5 h-2.5 text-amber-500"})," ៦ ផ្នែកពេញលេញ"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Za,{className:"w-2.5 h-2.5 text-teal-600"})," លំហាត់បំពេញចន្លោះ & តម្រៀប"]}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx(Ns,{className:"w-2.5 h-2.5 text-emerald-600"})," ៤០ QCM & វិញ្ញាបនបត្រ"]})]})]})]}),e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[e.jsxs("button",{onClick:()=>{Ut||(qeKhmer2("tab-rights"),OeKhmer2(!0));},className:"w-full py-2.5 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl text-[11px] transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📚"}),e.jsx("span",{children:"រៀនអន្តរកម្ម"})]}),e.jsxs("button",{onClick:()=>{Ut||(qeKhmer2("tab-qcm"),OeKhmer2(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-700 hover:to-indigo-800 text-white font-bold rounded-xl text-[11px] transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🏆"}),e.jsx("span",{children:"តេស្ត QCM ៤០"})]})]})]}),`;

// 9. Patch bundle files
const bundleFiles = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

for (const filePath of bundleFiles) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // A. Inject ZiKhmer2 & IzKhmer2 right after ZiKhmer1
  if (!code.includes('IzKhmer2=')) {
    const anchor = 'questions:ZiKhmer1},';
    const pos = code.indexOf(anchor);
    if (pos !== -1) {
      code = code.slice(0, pos + anchor.length) + ziKhmer2Code + code.slice(pos + anchor.length);
      console.log("Injected ZiKhmer2 & IzKhmer2 in " + filePath);
    } else {
      console.error("Could not find ZiKhmer1 anchor in " + filePath);
    }
  }

  // B. Unshift IzKhmer2 into quiz list in lCe
  if (!code.includes('IzKhmer2.id')) {
    const unshiftAnchor = 'at.some(ys=>ys.id===IzKhmer1.id)||at.unshift(IzKhmer1),';
    const pos = code.indexOf(unshiftAnchor);
    if (pos !== -1) {
      const unshiftCode = `at.some(ys=>ys.id===IzKhmer2.id)||at.unshift(IzKhmer2),`;
      code = code.slice(0, pos + unshiftAnchor.length) + unshiftCode + code.slice(pos + unshiftAnchor.length);
      console.log("Unshifted IzKhmer2 into quiz list in " + filePath);
    }
  }

  // C. Inject RzKhmer2 component definition right before RzKhmer1=({
  if (!code.includes('RzKhmer2=({')) {
    const rzAnchor = 'RzKhmer1=({';
    const pos = code.indexOf(rzAnchor);
    if (pos !== -1) {
      code = code.slice(0, pos) + rzKhmer2Def + ",\n" + code.slice(pos);
      console.log("Injected RzKhmer2 definition in " + filePath);
    }
  } else {
    const startIdx = code.indexOf('RzKhmer2=({');
    const endIdx = code.indexOf(',\nRzKhmer1=({', startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
      code = code.slice(0, startIdx) + rzKhmer2Def + code.slice(endIdx);
      console.log("Updated RzKhmer2 definition in " + filePath);
    }
  }

  // D. Inject [XeKhmer2,OeKhmer2] state hooks in InteractiveSharedSection
  if (!code.includes('[XeKhmer2,OeKhmer2]')) {
    const stateAnchor = '[XeKhmer1,OeKhmer1]=y.useState(!1),[zeKhmer1,qeKhmer1]=y.useState("tab-dict"),';
    if (code.includes(stateAnchor)) {
      code = code.replace(
        stateAnchor,
        stateAnchor + '[XeKhmer2,OeKhmer2]=y.useState(!1),[zeKhmer2,qeKhmer2]=y.useState("tab-rights"),'
      );
      console.log("Injected XeKhmer2 state hooks in InteractiveSharedSection for " + filePath);
    }
  }

  // E. Inject Khmer Lesson 2 card right after Khmer Lesson 1 card in InteractiveSharedSection
  if (!code.includes('qeKhmer2("tab-rights")')) {
    const card1EndAnchor = 'e.jsxs("button",{onClick:()=>{Ut||(qeKhmer1("tab-qcm"),OeKhmer1(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-[11px] transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"🏆"}),e.jsx("span",{children:"តេស្ត QCM ៤០"})]})]})]}),';
    const pos = code.indexOf(card1EndAnchor);
    if (pos !== -1) {
      code = code.slice(0, pos + card1EndAnchor.length) + khmerLesson2CardJSX + code.slice(pos + card1EndAnchor.length);
      console.log("Injected Khmer Lesson 2 card right after Khmer Lesson 1 card in " + filePath);
    } else {
      console.error("Could not find card1EndAnchor in " + filePath);
    }
  }

  // F. Mount RzKhmer2 in InteractiveSharedSection modal list
  if (!code.includes('e.jsx(RzKhmer2,{isOpen:XeKhmer2')) {
    const mountAnchor = 'e.jsx(RzKhmer1,{isOpen:XeKhmer1,onClose:()=>OeKhmer1(!1),onShowToast:u,initialTab:zeKhmer1}),';
    if (code.includes(mountAnchor)) {
      code = code.replace(
        mountAnchor,
        mountAnchor + 'e.jsx(RzKhmer2,{isOpen:XeKhmer2,onClose:()=>OeKhmer2(!1),onShowToast:u,initialTab:zeKhmer2}),'
      );
      console.log("Mounted RzKhmer2 in InteractiveSharedSection for " + filePath);
    }
  }

  // G. Handle IzKhmer2 exam click in E==="exams" inside InteractiveSharedSection
  if (!code.includes('Pt.id==="khmer-lesson-2-quiz"')) {
    const examClickAnchor = 'if(!Ut)if(Pt.id==="khmer-lesson-1-quiz"){qeKhmer1("tab-qcm");OeKhmer1(!0);}';
    if (code.includes(examClickAnchor)) {
      code = code.replace(
        examClickAnchor,
        examClickAnchor + 'else if(Pt.id==="khmer-lesson-2-quiz"){qeKhmer2("tab-qcm");OeKhmer2(!0);}'
      );
      console.log("Added IzKhmer2 exam click handler in " + filePath);
    }
  }

  // H. Also mount RzKhmer2 in Student Portal activeLessonModal
  if (!code.includes('activeLessonModal==="khmer2"')) {
    const portalMountAnchor = 'activeLessonModal==="khmer1"&&e.jsx(RzKhmer1,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),';
    if (code.includes(portalMountAnchor)) {
      code = code.replace(
        portalMountAnchor,
        portalMountAnchor + 'activeLessonModal==="khmer2"&&e.jsx(RzKhmer2,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab}),'
      );
      console.log("Mounted RzKhmer2 in Student Portal for " + filePath);
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

console.log("=== Completed 100% Khmer Grade 6 Lesson 2 Injection! ===");
