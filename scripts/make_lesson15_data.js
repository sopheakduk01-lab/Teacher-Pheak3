import fs from 'node:fs';

console.log("=== Generating Lesson 15 Questions and Rz15 React Component Code ===");

const attachmentPath = 'public/assets/aistudio/Paste_October_25__2026_-_8_47PM_f8058b8c';
const htmlContent = fs.readFileSync(attachmentPath, 'utf8');

// Extract QCM Database
const qcmMatch = htmlContent.match(/const qcmDatabase = (\[[\s\S]*?\]);/);
if (!qcmMatch) {
  console.error("Could not find qcmDatabase in attachment!");
  process.exit(1);
}

const qcmDatabaseRaw = qcmMatch[1];
// Use Function constructor to safely parse JS object literal array
const qcmDatabase = new Function(`return ${qcmDatabaseRaw}`)();

console.log(`Extracted ${qcmDatabase.length} questions for Lesson 15.`);

// Save questions JSON
const questionsJson = qcmDatabase.map(q => ({
  cat: q.cat,
  q: q.q,
  opts: q.options.map((optText, idx) => ({
    t: optText,
    c: idx === q.correct,
    e: q.exp
  }))
}));

fs.writeFileSync('scripts/lesson15_questions.json', JSON.stringify(questionsJson, null, 2), 'utf8');
console.log("Saved scripts/lesson15_questions.json successfully!");

// Component Code for Rz15
const rz15ComponentCode = `var Rz15 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "overview" }) => {
  if (!r) return null;

  const [activeTab, setActiveTab] = y.useState(a === "tab-hero" ? "overview" : (a || "overview"));
  const [qcmList] = y.useState(Zi15);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  
  // Audio Speech & Fullscreen States
  const [isFullscreen, setIsFullscreen] = y.useState(false);
  const [isSpeaking, setIsSpeaking] = y.useState(false);
  const [speakingText, setSpeakingText] = y.useState("");

  // Circuit Simulator State
  const [simMode, setSimMode] = y.useState("conductor_test"); // 'conductor_test' or 'series_parallel'
  const [switchClosed, setSwitchClosed] = y.useState(true);
  const [selectedMaterial, setSelectedMaterial] = y.useState("iron_nail");
  const [batteryCount, setBatteryCount] = y.useState(1);
  const [circuitType, setCircuitType] = y.useState("parallel");
  const [bulb1Broken, setBulb1Broken] = y.useState(false);
  const [bulb2Broken, setBulb2Broken] = y.useState(false);
  const [animActive, setAnimActive] = y.useState(true);

  const canvasRef = y.useRef(null);
  const animFrameRef = y.useRef(null);
  const electronOffsetRef = y.useRef(0);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }
  }, [r]);

  // Speech Handler
  const toggleSpeech = (textToRead) => {
    if (isSpeaking) {
      if (window.stopKhmerAudio) window.stopKhmerAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingText("");
      s && s("បានបិទសំឡេងអាន");
      return;
    }
    if (!textToRead) return;
    setIsSpeaking(true);
    setSpeakingText(textToRead);
    s && s("កំពុងអានជាសំឡេងភាសាខ្មែរ...");

    if (window.playKhmerSpeech) {
      window.playKhmerSpeech(
        textToRead,
        () => setIsSpeaking(true),
        () => { setIsSpeaking(false); setSpeakingText(""); },
        () => { setIsSpeaking(false); setSpeakingText(""); }
      );
    } else if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToRead);
        utter.lang = "km-KH";
        utter.rate = 0.88;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => { setIsSpeaking(false); setSpeakingText(""); };
        utter.onerror = () => { setIsSpeaking(false); setSpeakingText(""); };
        window.speechSynthesis.speak(utter);
      } catch (err) {
        setIsSpeaking(false);
        setSpeakingText("");
      }
    } else {
      setIsSpeaking(false);
      setSpeakingText("");
    }
  };

  const toggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    if (s) s(nextState ? "បានបើករបៀបបង្ហាញពេញអេក្រង់ (Full Screen)" : "បានចាកចេញពីរបៀបពេញអេក្រង់");
  };

  const copyFullLesson = () => {
    const text = \`មេរៀនទី ១៥៖ អគ្គិសនី (សៀវភៅពុម្ពទំព័រ ១០០ ដល់ ១០៧)

ចរន្តអគ្គិសនីដែលយើងកំពុងប្រើប្រាស់សព្វថ្ងៃ បានមកពីប្រភពអគ្គិសនីពីរគឺ ប្រភពចរន្តជាប់ និងប្រភពចរន្តឆ្លាស់។ ប្រភពផ្តល់ចរន្តអគ្គិសនីទាំងពីរនេះហៅថា ជនិតាអគ្គិសនី។
១. ចរន្តអគ្គិសនី៖ គឺជាបម្លាស់បន្ទុកអគ្គិសនីឬអេឡិចត្រុង។
២. ទិសដៅចរន្តអគ្គិសនី៖ ចរន្តអគ្គិសនីផ្លាស់ទីពី (+) ទៅ (-) រីឯអេឡិចត្រុងផ្លាស់ទីពី (-) ទៅ (+)\`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      s && s("បានចម្លងមេរៀនទី ១៥ ទាំងមូលដោយជោគជ័យ!");
    }
  };

  const copySection = (secName, content) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      s && s("បានចម្លងផ្នែក " + secName + " ដោយជោគជ័យ!");
    }
  };

  // Material Metadata
  const materialData = {
    'iron_nail': { name: 'ដែកគោល', isConductor: true, color: '#64748b' },
    'paperclip': { name: 'ស្នៀតក្រដាស', isConductor: true, color: '#94a3b8' },
    'pencil_lead': { name: 'បណ្តូលខ្មៅដៃ (ក្រាហ្វិត)', isConductor: true, color: '#334155' },
    'salt_water': { name: 'ទឹកអំបិល', isConductor: true, color: '#38bdf8' },
    'wood': { name: 'ឈើ', isConductor: false, color: '#b45309' },
    'paper': { name: 'ក្រដាសសៀវភៅ', isConductor: false, color: '#cbd5e1' }
  };

  // Compute Current Physics Values
  let voltage = 1.5;
  let current = 0;
  let statusText = "";
  let stepValues = "";
  let explanation = "";

  if (!switchClosed) {
    voltage = (simMode === 'conductor_test') ? (batteryCount * 1.5) : 3.0;
    current = 0;
    statusText = "សៀគ្វីចំហ (កុងតាក់ចំហ) - គ្មានចរន្តអគ្គិសនី";
    stepValues = "កុងតាក់មិនទាន់ភ្ជាប់ -> ចរន្ត I = 0 A, អំពូលរលត់";
    explanation = "នៅពេលកុងតាក់ចំហ សៀគ្វីដាច់ មិនអាចឱ្យបន្ទុកអេឡិចត្រុងផ្លាស់ទីបានឡើយ។";
  } else {
    if (simMode === 'conductor_test') {
      voltage = batteryCount * 1.5;
      const mat = materialData[selectedMaterial] || materialData['iron_nail'];
      if (mat.isConductor) {
        current = 0.3 * batteryCount;
        statusText = "អំពូលភ្លឺ" + (batteryCount === 3 ? "ខ្លាំង" : (batteryCount === 2 ? "មធ្យម" : "ធម្មតា"));
        stepValues = "V = " + voltage.toFixed(1) + "V -> I = " + current.toFixed(2) + "A (" + (current * 1000).toFixed(0) + " mA)";
        explanation = mat.name + " ជាអង្គធាតុចម្លងអគ្គិសនី ពីព្រោះវាមានអេឡិចត្រុងសេរីច្រើន ដែលអាចរុញច្រានដោយកម្លាំងអគ្គិសនីចលករ។";
      } else {
        current = 0;
        statusText = "អំពូលមិនភ្លឺ (គ្មានចរន្ត)";
        stepValues = mat.name + " មិនអនុញ្ញាតឱ្យចរន្តឆ្លងកាត់ -> I = 0 A";
        explanation = mat.name + " ជាអង្គធាតុអ៊ីសូឡង់ (មិនចម្លងអគ្គិសនី) ពីព្រោះគ្មានអេឡិចត្រុងសេរីសម្រាប់ចល័ត។";
      }
    } else {
      voltage = 3.0;
      if (circuitType === 'series') {
        if (bulb1Broken || bulb2Broken) {
          current = 0;
          statusText = "អំពូលទាំងអស់រលត់ (សៀគ្វីដាច់)";
          stepValues = "ស៊េរីមានផ្លូវតែមួយ -> បើដាច់អំពូលមួយ សៀគ្វីដាច់ទាំងស្រុង I = 0 A";
          explanation = "ក្នុងសៀគ្វីជាស៊េរី ចរន្តអគ្គិសនីមានផ្លូវតែមួយគត់។ បើគ្រឿងទទួលមួយខូច គ្រឿងទទួលដទៃគ្មានចរន្តឆ្លងកាត់ទេ។";
        } else {
          current = 0.25;
          statusText = "អំពូលទាំង ២ ភ្លឺស្មើគ្នា";
          stepValues = "ស៊េរី៖ ចរន្ត I រត់កាត់អំពូលទាំងពីរស្មើគ្នា (I = 0.25A)";
          explanation = "ក្នុងសៀគ្វីជាស៊េរី ចរន្តអគ្គិសនីមានផ្លូវតែមួយគត់សម្រាប់ឆ្លងកាត់។";
        }
      } else {
        if (bulb1Broken && bulb2Broken) {
          current = 0;
          statusText = "អំពូលទាំង ២ ត្រូវបានដោះចេញ";
          stepValues = "គ្មានគ្រឿងទទួលកំពុងដំណើរការ -> I = 0 A";
          explanation = "អំពូលទាំងពីរត្រូវបានដោះចេញពីខ្នែង។";
        } else if (bulb1Broken || bulb2Broken) {
          current = 0.35;
          statusText = "អំពូលដែលនៅសល់នៅតែភ្លឺធម្មតា!";
          stepValues = "ខ្នែង៖ ដាច់ខ្នែងមួយ ខ្នែងមួយទៀតនៅតែមានចរន្តឆ្លងកាត់";
          explanation = "ក្នុងសៀគ្វីជាខ្នែង ចរន្តអគ្គិសនីមានផ្លូវច្រើន។ បើអំពូលមួយដាច់ អំពូលផ្សេងទៀតនៅតែភ្លឺជាធម្មតា (ដូចភ្លើងក្នុងផ្ទះ)។";
        } else {
          current = 0.70;
          statusText = "អំពូលទាំង ២ ភ្លឺពេញកម្លាំង";
          stepValues = "ខ្នែង៖ តង់ស្យុងស្មើគ្នា V1 = V2 = 3V (I_សរុប = 0.70A)";
          explanation = "ការតជាខ្នែងផ្តល់តង់ស្យុងពេញដល់គ្រឿងទទួលនីមួយៗ ដូចបណ្តាញអគ្គិសនីក្នុងគេហដ្ឋាន។";
        }
      }
    }
  }

  // Canvas Drawing Loop
  y.useEffect(() => {
    if (activeTab !== "simulation" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed || !canvas) return;
      const w = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
      canvas.width = w;
      canvas.height = 320;
      const h = 320;

      if (animActive && current > 0) {
        electronOffsetRef.current += 1.2 * (current + 0.3);
      }

      ctx.clearRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      const isFlowing = current > 0;

      if (simMode === 'conductor_test') {
        const padX = 60, topY = 60, botY = 250, rightX = w - padX, leftX = padX;
        // Wires
        ctx.strokeStyle = isFlowing ? '#0284c7' : '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(leftX + 130, topY); ctx.lineTo(rightX, topY); ctx.lineTo(rightX, botY);
        ctx.lineTo(w / 2 + 70, botY); ctx.moveTo(w / 2 - 70, botY); ctx.lineTo(leftX, botY); ctx.lineTo(leftX, topY);
        ctx.stroke();

        // Battery
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(leftX - 5, topY - 22, 36 * batteryCount, 22);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(leftX - 5 + 36 * batteryCount, topY - 17, 4, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(voltage.toFixed(1) + "V", leftX + 10, topY - 7);

        // Bulb
        ctx.fillStyle = isFlowing ? '#fef08a' : '#f1f5f9';
        ctx.strokeStyle = isFlowing ? '#d97706' : '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(rightX, topY + 45, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Switch
        ctx.fillStyle = '#334155';
        ctx.beginPath(); ctx.arc(rightX - 100, botY, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(rightX - 60, botY, 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(rightX - 100, botY);
        ctx.lineTo(switchClosed ? rightX - 60 : rightX - 70, switchClosed ? botY : botY - 18);
        ctx.stroke();

        // Test Material
        const mat = materialData[selectedMaterial] || materialData['iron_nail'];
        ctx.fillStyle = mat.color;
        ctx.fillRect(w / 2 - 45, botY - 8, 90, 16);
        ctx.fillStyle = mat.isConductor ? '#059669' : '#dc2626';
        ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(mat.name + " (" + (mat.isConductor ? "ចម្លង" : "អ៊ីសូឡង់") + ")", w / 2, botY - 18);
      } else {
        // Series / Parallel
        const leftX = 70, rightX = w - 70, midX = w / 2, topY = 60, botY = 250;
        ctx.strokeStyle = isFlowing ? '#0284c7' : '#94a3b8'; ctx.lineWidth = 4;
        if (circuitType === 'series') {
          ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(rightX, topY); ctx.lineTo(rightX, botY); ctx.lineTo(leftX, botY); ctx.lineTo(leftX, topY); ctx.stroke();
          // Bulbs
          ctx.fillStyle = (isFlowing && !bulb1Broken) ? '#fef08a' : '#f1f5f9';
          ctx.beginPath(); ctx.arc(midX - 70, topY, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = (isFlowing && !bulb2Broken) ? '#fef08a' : '#f1f5f9';
          ctx.beginPath(); ctx.arc(midX + 70, topY, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        } else {
          const b1Y = 70, b2Y = 160;
          ctx.beginPath();
          ctx.moveTo(leftX, b1Y); ctx.lineTo(rightX, b1Y); ctx.lineTo(rightX, botY); ctx.lineTo(leftX, botY); ctx.lineTo(leftX, b1Y);
          ctx.moveTo(leftX + 80, b2Y); ctx.lineTo(rightX - 80, b2Y); ctx.stroke();
          ctx.fillStyle = (isFlowing && !bulb1Broken) ? '#fef08a' : '#f1f5f9';
          ctx.beginPath(); ctx.arc(midX, b1Y, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = (isFlowing && !bulb2Broken) ? '#fef08a' : '#f1f5f9';
          ctx.beginPath(); ctx.arc(midX, b2Y, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
      }

      if (isSubscribed) animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeTab, simMode, switchClosed, selectedMaterial, batteryCount, circuitType, bulb1Broken, bulb2Broken, animActive, current]);

  // Current QCM item
  const qItem = qcmList[currentQIndex] || qcmList[0];
  const hasAnswered = userAnswers[currentQIndex] !== undefined;
  const selectedOpt = userAnswers[currentQIndex];

  const speechQText = qItem ? ("សំណួរទី " + (currentQIndex + 1) + "៖ " + qItem.q + "។ " + (hasAnswered ? ("ចម្លើយ៖ " + qItem.exp) : "")) : "";
  const simSpeechText = "បន្ទប់ពិសោធន៍អគ្គិសនី៖ " + statusText + "។ តង់ស្យុង " + voltage.toFixed(1) + " វ៉ុល។ អាំងតង់ស៊ីតេចរន្ត " + current.toFixed(2) + " អំពែ។ " + explanation;

  return e.jsx("div", {
    className: isFullscreen ? "fixed inset-0 z-[100] bg-white overflow-y-auto" : "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto",
    children: e.jsxs("div", {
      className: "bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]",
      children: [
        // Modal Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-md",
          children: [
            e.jsxs("div", {
              className: "flex items-center space-x-3",
              children: [
                e.jsx("div", {
                  className: "w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl shadow-inner",
                  children: e.jsx("i", { className: "fa-solid fa-bolt-lightning" })
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("div", { className: "text-[11px] font-bold uppercase tracking-wider text-amber-100", children: "រូបវិទ្យាថ្នាក់ទី ៧-៨ • ទំព័រ ១០០-១០៧" }),
                    e.jsx("h2", { className: "text-lg sm:text-xl font-bold font-khmer", children: "មេរៀនទី ១៥៖ អគ្គិសនី (Electricity)" })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center space-x-2",
              children: [
                e.jsxs("button", {
                  onClick: () => toggleSpeech("មេរៀនទី ១៥៖ អគ្គិសនី។ ចរន្តអគ្គិសនីទទួលបានមកពីប្រភពពីរគឺ ចរន្តជាប់ និងចរន្តឆ្លាស់។ ចរន្តអគ្គិសនីជាបម្លាស់បន្ទុកអេឡិចត្រុង។ ឧបករណ៍វាស់ចរន្តគឺអំពែម៉ែត្រ និងឧបករណ៍វាស់តង់ស្យុងគឺវ៉ុលម៉ែត្រ។"),
                  className: "px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md",
                  children: [
                    e.jsx("i", { className: isSpeaking ? "fa-solid fa-volume-xmark text-amber-200 animate-pulse" : "fa-solid fa-volume-high" }),
                    e.jsx("span", { children: isSpeaking ? "បិទសំឡេង" : "🔊 ស្ដាប់ពន្យល់សំឡេង" })
                  ]
                }),
                e.jsxs("button", {
                  onClick: toggleFullscreen,
                  className: "px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md",
                  children: [
                    e.jsx("i", { className: "fa-solid " + (isFullscreen ? "fa-compress" : "fa-expand") }),
                    e.jsx("span", { children: isFullscreen ? "⛶ ចាកចេញ" : "⛶ ពេញអេក្រង់" })
                  ]
                }),
                e.jsx("button", {
                  onClick: t,
                  className: "w-9 h-9 rounded-xl bg-white/20 hover:bg-rose-600 text-white flex items-center justify-center transition backdrop-blur-md",
                  children: e.jsx("i", { className: "fa-solid fa-xmark text-base" })
                })
              ]
            })
          ]
        }),

        // Tabs Bar
        e.jsxs("div", {
          className: "bg-slate-100 border-b border-slate-200 px-4 py-2 flex space-x-2 overflow-x-auto text-xs sm:text-sm shrink-0",
          children: [
            e.jsxs("button", {
              onClick: () => setActiveTab("overview"),
              className: "py-2 px-4 rounded-xl font-bold transition flex items-center space-x-2 " + (activeTab === "overview" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"),
              children: [e.jsx("i", { className: "fa-solid fa-layer-group" }), e.jsx("span", { children: "១. ខ្លឹមសារ ៥ ផ្នែក" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("simulation"),
              className: "py-2 px-4 rounded-xl font-bold transition flex items-center space-x-2 " + (activeTab === "simulation" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"),
              children: [e.jsx("i", { className: "fa-solid fa-flask-vial" }), e.jsx("span", { children: "២. បន្ទប់ពិសោធន៍សៀគ្វី (Circuit Lab)" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("quiz"),
              className: "py-2 px-4 rounded-xl font-bold transition flex items-center space-x-2 " + (activeTab === "quiz" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"),
              children: [e.jsx("i", { className: "fa-solid fa-list-check" }), e.jsx("span", { children: "៣. សំណួរ QCM (៤០ សំណួរ)" })]
            })
          ]
        }),

        // Modal Body
        e.jsx("div", {
          className: "p-4 sm:p-6 overflow-y-auto flex-grow space-y-6 text-slate-800 font-khmer",
          children: activeTab === "overview" ? e.jsxs("div", {
            className: "space-y-6",
            children: [
              // Top Banner
              e.jsxs("div", {
                className: "bg-amber-50/80 p-5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
                children: [
                  e.jsxs("div", {
                    className: "space-y-1",
                    children: [
                      e.jsx("h3", { className: "text-lg font-bold text-amber-950", children: "ជំពូកទី ៥ • មេរៀនទី ១៥៖ អគ្គិសនី" }),
                      e.jsx("p", { className: "text-xs text-amber-800", children: "ខ្លឹមសារសៀវភៅពុម្ពក្រសួងអប់រំ (ទំព័រ ១۰۰ ដល់ ១០៧) បែងចែកជា ៥ ជំហាន" })
                    ]
                  }),
                  e.jsxs("button", {
                    onClick: copyFullLesson,
                    className: "px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2",
                    children: [e.jsx("i", { className: "fa-solid fa-copy" }), e.jsx("span", { children: "ចម្លងមេរៀនទាំងមូល" })]
                  })
                ]
              }),

              // Step 1
              e.jsxs("div", {
                className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-8 h-8 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-sm", children: "១" }),
                          e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "ចរន្តអគ្គិសនី និងទិសដៅចរន្ត (ទំព័រ ១០០-១០១)" })
                        ]
                      }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech("ជំហានទី ១៖ ចរន្តអគ្គិសនី និងទិសដៅចរន្ត។ ប្រភពអគ្គិសនីមានពីរគឺ ចរន្តជាប់ និងចរន្តឆ្លាស់។ ចរន្តអគ្គិសនីគឺជាបម្លាស់បន្ទុកអគ្គិសនីឬអេឡិចត្រុង។ ចរន្តអគ្គិសនីផ្លាស់ទីពីប៉ូលវិជ្ជមានទៅប៉ូលអវិជ្ជមាន រីឯអេឡិចត្រុងផ្លាស់ទីពីប៉ូលអវិជ្ជមានទៅប៉ូលវិជ្ជមាន។"),
                        className: "px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold border border-amber-200 transition flex items-center gap-1.5",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "text-xs sm:text-sm space-y-2 text-slate-700 leading-relaxed",
                    children: [
                      e.jsx("p", { children: "• <strong>ប្រភពអគ្គិសនី៖</strong> ជនិតាចរន្តឆ្លាស់ (ឌីណាម៉ូ អាល់ទែណាទ័រ...) និងជនិតាចរន្តជាប់ (ថ្មពិល អាគុយ...)" }),
                      e.jsx("p", { children: "• <strong>និយមន័យ៖</strong> ចរន្តអគ្គិសនី គឺជាបម្លាស់បន្ទុកអគ្គិសនីឬអេឡិចត្រុង។" }),
                      e.jsx("p", { children: "• <strong>ទិសដៅចរន្ត៖</strong> ចរន្តអគ្គិសនីផ្លាស់ទីពីប៉ូល (+) ទៅ (-)។ រីឯអេឡិចត្រុងផ្លាស់ទីក្នុងខ្សែចម្លងពី (-) ទៅ (+)។" })
                    ]
                  })
                ]
              }),

              // Step 2
              e.jsxs("div", {
                className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-8 h-8 rounded-xl bg-cyan-600 text-white font-bold flex items-center justify-center text-sm", children: "២" }),
                          e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "ឧបករណ៍វាស់អគ្គិសនី (ទំព័រ ១០១)" })
                        ]
                      }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech("ជំហានទី ២៖ ឧបករណ៍វាស់អគ្គិសនី។ អំពែម៉ែត្រប្រើវាស់អាំងតង់ស៊ីតេចរន្តអគ្គិសនី គិតជាអំពែ ឬមីលីអំពែ។ មួយអំពែស្មើមួយពាន់មីលីអំពែ។ វ៉ុលម៉ែត្រប្រើវាស់កម្លាំងអគ្គិសនីចលករ ឬតង់ស្យុង គិតជាវ៉ុល ឬមីលីវ៉ុល។ មួយវ៉ុលស្មើមួយពាន់មីលីវ៉ុល។"),
                        className: "px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-bold border border-cyan-200 transition flex items-center gap-1.5",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "text-xs sm:text-sm space-y-2 text-slate-700 leading-relaxed",
                    children: [
                      e.jsx("p", { children: "• <strong>អំពែម៉ែត្រ (Ammeter)៖</strong> វាស់អាំងតង់ស៊ីតេចរន្តអគ្គិសនី (A, mA)។ 1A = 1000 mA" }),
                      e.jsx("p", { children: "• <strong>វ៉ុលម៉ែត្រ (Voltmeter)៖</strong> វាស់កម្លាំងអគ្គិសនីចលករ ឬតង់ស្យុង (V, mV)។ 1V = 1000 mV" }),
                      e.jsx("p", { children: "• <strong>កម្លាំងអគ្គិសនីចលករ៖</strong> ជាកម្លាំងដែលធ្វើឱ្យចរន្តផ្លាស់ទីក្នុងសៀគ្វី (ឧ. ថ្មពិល 1.5V)។" })
                    ]
                  })
                ]
              }),

              // Step 3
              e.jsxs("div", {
                className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm", children: "៣" }),
                          e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "អង្គធាតុចម្លង និងអ៊ីសូឡង់អគ្គិសនី (ទំព័រ ១០២-១០៣)" })
                        ]
                      }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech("ជំហានទី ៣៖ អង្គធាតុចម្លង និងអ៊ីសូឡង់អគ្គិសនី។ អង្គធាតុចម្លងអនុញ្ញាតឱ្យចរន្តឆ្លងកាត់បាន ដូចជា ដែកគោល ស្នៀតក្រដាស បណ្តូលខ្មៅដៃ និងទឹកអំបិល ធ្វើឱ្យអំពូលភ្លឺ។ អ៊ីសូឡង់មិនឱ្យចរន្តឆ្លងកាត់ទេ ដូចជា ឈើ និងក្រដាស ធ្វើឱ្យអំពូលមិនភ្លឺ។"),
                        className: "px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition flex items-center gap-1.5",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "text-xs sm:text-sm space-y-2 text-slate-700 leading-relaxed",
                    children: [
                      e.jsx("p", { children: "• <strong>អង្គធាតុចម្លង៖</strong> អនុញ្ញាតឱ្យចរន្តឆ្លងកាត់ (ដែកគោល, ស្នៀតក្រដាស, ទឹកអំបិល, បណ្តូលខ្មៅដៃ) -> អំពូលភ្លឺ" }),
                      e.jsx("p", { children: "• <strong>អ៊ីសូឡង់៖</strong> មិនឱ្យចរន្តឆ្លងកាត់ (ឈើ, ក្រដាសសៀវភៅ, ផ្លាស្ទិក, កៅស៊ូ) -> អំពូលមិនភ្លឺ" }),
                      e.jsx("p", { children: "• <strong>ការអនុវត្ត៖</strong> យកទង់ដែងធ្វើខ្សែចម្លង និងយកផ្លាស្ទិកស្រោបខាងក្រៅដើម្បីការពារការឆក់។" })
                    ]
                  })
                ]
              }),

              // Step 4
              e.jsxs("div", {
                className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-8 h-8 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm", children: "៤" }),
                          e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "សៀគ្វីជាស៊េរី និងសៀគ្វីជាខ្នែង (ទំព័រ ១០៤-១០៥)" })
                        ]
                      }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech("ជំហានទី ៤៖ សៀគ្វីជាស៊េរី និងជាខ្នែង។ ក្នុងសៀគ្វីស៊េរី ចរន្តមានផ្លូវតែមួយ បើអំពូលមួយដាច់ អំពូលទាំងអស់រលត់។ ក្នុងសៀគ្វីខ្នែង ចរន្តមានផ្លូវច្រើន បើអំពូលមួយដាច់ អំពូលផ្សេងទៀតនៅតែភ្លឺធម្មតា។"),
                        className: "px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold border border-purple-200 transition flex items-center gap-1.5",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "text-xs sm:text-sm space-y-2 text-slate-700 leading-relaxed",
                    children: [
                      e.jsx("p", { children: "• <strong>ថ្មពិលជាស៊េរី៖</strong> កម្លាំងសរុប = ផលបូកកម្លាំងនីមួយៗ (1.5V + 1.5V + 1.5V = 4.5V)" }),
                      e.jsx("p", { children: "• <strong>គ្រឿងទទួលជាស៊េរី៖</strong> មានផ្លូវតែមួយ បើដាច់មួយរលត់ទាំងអស់" }),
                      e.jsx("p", { children: "• <strong>គ្រឿងទទួលជាខ្នែង៖</strong> មានផ្លូវច្រើន បើដាច់មួយ គ្រឿងផ្សេងទៀតនៅតែភ្លឺធម្មតា" })
                    ]
                  })
                ]
              }),

              // Step 5
              e.jsxs("div", {
                className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-8 h-8 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-sm", children: "៥" }),
                          e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "បណ្តាញអគ្គិសនីក្នុងគេហដ្ឋាន (ទំព័រ ១០៦-១០៧)" })
                        ]
                      }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech("ជំហានទី ៥៖ បណ្តាញអគ្គិសនីក្នុងគេហដ្ឋាន។ នៅតាមផ្ទះគេតជាខ្នែង។ គ្រឿងបរិក្ខាររួមមាន កុងទ័រអគ្គិសនីវាស់ថាមពលជាគីឡូវ៉ាត់ម៉ោង, ភុយស៊ីបការពារការឆ្លងសៀគ្វី, ឌីសុងទ័រជាកុងតាក់ស្វ័យប្រវត្តិ, កុងតាក់ និងព្រីឌុយ។"),
                        className: "px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold border border-rose-200 transition flex items-center gap-1.5",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "text-xs sm:text-sm space-y-2 text-slate-700 leading-relaxed",
                    children: [
                      e.jsx("p", { children: "• <strong>កុងទ័រអគ្គិសនី៖</strong> វាស់ថាមពលអគ្គិសនីប្រើប្រាស់ គិតជា គីឡូវ៉ាត់ម៉ោង (kW/h)" }),
                      e.jsx("p", { children: "• <strong>ភុយស៊ីប (Fuse)៖</strong> ខ្សែលោហៈងាយរលាយដាច់ពេលត្រូវកម្ដៅខ្លាំង" }),
                      e.jsx("p", { children: "• <strong>ឌីសុងទ័រ (Circuit Breaker)៖</strong> កុងតាក់ស្វ័យប្រវត្តិកាត់ផ្តាច់ចរន្តពេលលើសចំណុះ" })
                    ]
                  })
                ]
              })
            ]
          }) : activeTab === "simulation" ? e.jsxs("div", {
            className: "space-y-6",
            children: [
              // Simulator Header & Mode selector
              e.jsxs("div", {
                className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsx("h3", { className: "text-base font-bold text-slate-900", children: "បន្ទប់ពិសោធន៍ចរន្តអគ្គិសនី (Circuit Lab)" }),
                      e.jsx("p", { className: "text-xs text-slate-500", children: "តេស្តអង្គធាតុចម្លង អ៊ីសូឡង់ និងសៀគ្វីស៊េរី/ខ្នែង ជាមួយចលនាអេឡិចត្រុង" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      e.jsx("button", {
                        onClick: () => setSimMode("conductor_test"),
                        className: "px-3 py-1.5 rounded-xl text-xs font-bold transition " + (simMode === "conductor_test" ? "bg-amber-600 text-white" : "bg-white text-slate-700 border border-slate-300"),
                        children: "១. តេស្តអង្គធាតុ"
                      }),
                      e.jsx("button", {
                        onClick: () => setSimMode("series_parallel"),
                        className: "px-3 py-1.5 rounded-xl text-xs font-bold transition " + (simMode === "series_parallel" ? "bg-amber-600 text-white" : "bg-white text-slate-700 border border-slate-300"),
                        children: "២. ស៊េរី / ខ្នែង"
                      })
                    ]
                  })
                ]
              }),

              // Canvas Host
              e.jsxs("div", {
                className: "relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden",
                children: [
                  e.jsx("canvas", { ref: canvasRef, className: "w-full block" }),
                  e.jsxs("div", {
                    className: "absolute top-3 left-3 flex gap-2",
                    children: [
                      e.jsx("span", { className: "bg-white/95 border border-slate-200 px-3 py-1 rounded-xl text-[11px] font-mono font-bold text-amber-700 shadow-xs", children: switchClosed ? "កុងតាក់៖ បិទ (សៀគ្វីបិទ)" : "កុងតាក់៖ ចំហ (គ្មានចរន្ត)" }),
                      e.jsx("span", { className: "bg-white/95 border border-slate-200 px-3 py-1 rounded-xl text-[11px] font-mono font-bold text-slate-700 shadow-xs", children: "តង់ស្យុង៖ " + voltage.toFixed(1) + "V" })
                    ]
                  }),
                  e.jsx("button", {
                    onClick: () => setSwitchClosed(!switchClosed),
                    className: "absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition " + (switchClosed ? "bg-amber-600 hover:bg-amber-700" : "bg-rose-600 hover:bg-rose-700"),
                    children: switchClosed ? "ចុចកាត់ផ្តាច់កុងតាក់" : "ចុចភ្ជាប់កុងតាក់"
                  })
                ]
              }),

              // Controls & Physics Gauge
              e.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-12 gap-4",
                children: [
                  e.jsxs("div", {
                    className: "md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs",
                    children: [
                      e.jsx("h4", { className: "font-bold text-slate-800 border-b border-slate-200 pb-2", children: "បន្ទះបញ្ជាការពិសោធន៍" }),
                      simMode === "conductor_test" ? e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-1",
                            children: [
                              e.jsx("label", { className: "font-semibold text-slate-700", children: "ជ្រើសរើសអង្គធាតុតេស្ត (ទំព័រ ១០២)៖" }),
                              e.jsxs("select", {
                                value: selectedMaterial,
                                onChange: (e) => setSelectedMaterial(e.target.value),
                                className: "w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800",
                                children: [
                                  e.jsx("option", { value: "iron_nail", children: "ដែកគោល (ចម្លងអគ្គិសនី)" }),
                                  e.jsx("option", { value: "paperclip", children: "ស្នៀតក្រដាស (ចម្លងអគ្គិសនី)" }),
                                  e.jsx("option", { value: "pencil_lead", children: "បណ្តូលខ្មៅដៃ (ចម្លងអគ្គិសនី)" }),
                                  e.jsx("option", { value: "salt_water", children: "ទឹកអំបិល (ចម្លងអគ្គិសនី)" }),
                                  e.jsx("option", { value: "wood", children: "ឈើ (អ៊ីសូឡង់)" }),
                                  e.jsx("option", { value: "paper", children: "ក្រដាសសៀវភៅ (អ៊ីសូឡង់)" })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "space-y-1",
                            children: [
                              e.jsxs("div", { className: "flex justify-between font-semibold text-slate-700", children: [e.jsx("span", { children: "ចំនួនថ្មពិល (1.5V)៖" }), e.jsx("span", { className: "text-amber-700 font-mono", children: batteryCount + " គ្រាប់ (" + (batteryCount * 1.5).toFixed(1) + "V)" })] }),
                              e.jsx("input", { type: "range", min: "1", max: "3", step: "1", value: batteryCount, onChange: (e) => setBatteryCount(parseInt(e.target.value)), className: "w-full accent-amber-600" })
                            ]
                          })
                        ]
                      }) : e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsxs("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                              e.jsx("button", { onClick: () => setCircuitType("parallel"), className: "py-2 rounded-xl font-bold border transition " + (circuitType === "parallel" ? "bg-amber-600 text-white" : "bg-white text-slate-700"), children: "សៀគ្វីជាខ្នែង (ផ្ទះ)" }),
                              e.jsx("button", { onClick: () => setCircuitType("series"), className: "py-2 rounded-xl font-bold border transition " + (circuitType === "series" ? "bg-amber-600 text-white" : "bg-white text-slate-700"), children: "សៀគ្វីជាស៊េរី" })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "space-y-1 pt-2 border-t border-slate-200",
                            children: [
                              e.jsx("label", { className: "font-semibold text-slate-700", children: "ពិសោធន៍ដោះអំពូល៖" }),
                              e.jsx("button", { onClick: () => setBulb1Broken(!bulb1Broken), className: "w-full p-2 rounded-xl border text-left font-semibold flex justify-between " + (bulb1Broken ? "bg-rose-50 text-rose-700" : "bg-white text-slate-700"), children: e.jsxs("span", { children: ["អំពូលទី ១: ", bulb1Broken ? "ដោះចេញ/ខូច" : "កំពុងតភ្ជាប់"] }) }),
                              e.jsx("button", { onClick: () => setBulb2Broken(!bulb2Broken), className: "w-full p-2 rounded-xl border text-left font-semibold flex justify-between " + (bulb2Broken ? "bg-rose-50 text-rose-700" : "bg-white text-slate-700"), children: e.jsxs("span", { children: ["អំពូលទី ២: ", bulb2Broken ? "ដោះចេញ/ខូច" : "កំពុងតភ្ជាប់"] }) })
                            ]
                          })
                        ]
                      })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "md:col-span-7 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 flex flex-col justify-between space-y-3 text-xs",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsxs("div", { className: "flex justify-between items-center font-bold text-amber-900", children: [e.jsx("span", { children: "ការវាស់វែងចរន្តអគ្គិសនី" }), e.jsxs("button", { onClick: () => toggleSpeech(simSpeechText), className: "px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1", children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់គណនា" })] })] }),
                          e.jsxs("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                              e.jsxs("div", { className: "bg-white p-3 rounded-xl border border-slate-200 shadow-xs", children: [e.jsx("div", { className: "text-slate-500 text-[10px]", children: "អាំងតង់ស៊ីតេចរន្ត (I)" }), e.jsxs("div", { className: "text-xl font-extrabold text-cyan-600 font-mono", children: [current.toFixed(2), " A"] }), e.jsxs("div", { className: "text-[10px] text-slate-400 font-mono", children: ["= ", (current * 1000).toFixed(0), " mA"] })] }),
                              e.jsxs("div", { className: "bg-white p-3 rounded-xl border border-slate-200 shadow-xs", children: [e.jsx("div", { className: "text-slate-500 text-[10px]", children: "តង់ស្យុង/កម្លាំងចលករ (V)" }), e.jsxs("div", { className: "text-xl font-extrabold text-amber-600 font-mono", children: [voltage.toFixed(1), " V"] }), e.jsxs("div", { className: "text-[10px] text-slate-400 font-mono", children: ["= ", (voltage * 1000).toFixed(0), " mV"] })] })
                            ]
                          }),
                          e.jsxs("div", { className: "bg-white p-3 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]", children: [e.jsx("div", { className: "text-amber-800 font-bold", children: statusText }), e.jsx("div", { className: "text-slate-600", children: stepValues })] })
                        ]
                      }),
                      e.jsx("div", { className: "p-2.5 bg-white/80 rounded-xl border border-amber-200 text-slate-700 text-[11px]", children: explanation })
                    ]
                  })
                ]
              })
            ]
          }) : e.jsxs("div", {
            className: "space-y-5",
            children: [
              // QCM Header Bar
              e.jsxs("div", {
                className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsx("h3", { className: "text-base font-bold text-slate-900", children: "កម្រងសំណួរពហុជ្រើសរើស មេរៀនទី ១៥ (៤០ សំណួរ)" }),
                      e.jsx("p", { className: "text-xs text-slate-500", children: "សំណួរ និងចម្លើយពន្យល់លម្អិតតាមសៀវភៅពុម្ពទំព័រ ១۰۰ ដល់ ១០៧" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono",
                    children: [
                      e.jsxs("span", { children: ["សំណួរទី៖ ", e.jsx("strong", { className: "text-amber-600", children: currentQIndex + 1 }), " / 40"] }),
                      e.jsx("span", { className: "text-slate-300", children: "|" }),
                      e.jsxs("span", { children: ["ត្រូវ៖ ", e.jsx("strong", { className: "text-emerald-600", children: Object.keys(userAnswers).filter(idx => userAnswers[idx] === qcmList[idx]?.opts.findIndex(o => o.c)).length })] })
                    ]
                  })
                ]
              }),

              // Progress Bar
              e.jsx("div", {
                className: "w-full bg-slate-100 h-2 rounded-full overflow-hidden",
                children: e.jsx("div", { className: "bg-amber-500 h-2 transition-all duration-300", style: { width: ((currentQIndex + 1) / qcmList.length * 100) + "%" } })
              }),

              // QCM Question Card
              e.jsxs("div", {
                className: "bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4",
                children: [
                  e.jsxs("div", {
                    className: "flex justify-between items-start gap-2 border-b border-slate-200 pb-3",
                    children: [
                      e.jsx("div", { className: "text-slate-900 font-bold text-sm sm:text-base leading-relaxed flex-grow", children: qItem.q }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech(speechQText),
                        className: "px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 shadow-xs",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់សំណួរ" })]
                      })
                    ]
                  }),

                  // Options List
                  e.jsx("div", {
                    className: "space-y-2.5",
                    children: qItem.opts.map((opt, optIdx) => {
                      let btnStyle = "border-slate-200 bg-white hover:bg-slate-100 text-slate-700";
                      let iconState = null;

                      if (hasAnswered) {
                        if (opt.c) {
                          btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-400";
                          iconState = e.jsx("i", { className: "fa-solid fa-circle-check text-emerald-600 ml-auto text-base" });
                        } else if (selectedOpt === optIdx) {
                          btnStyle = "border-rose-400 bg-rose-50 text-rose-950 font-semibold shadow-xs ring-1 ring-rose-300";
                          iconState = e.jsx("i", { className: "fa-solid fa-circle-xmark text-rose-600 ml-auto text-base" });
                        } else {
                          btnStyle = "border-slate-200 bg-white text-slate-400 opacity-60";
                        }
                      }

                      return e.jsxs("button", {
                        onClick: () => {
                          const newAns = { ...userAnswers, [currentQIndex]: optIdx };
                          setUserAnswers(newAns);
                        },
                        className: "w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition duration-150 flex items-start gap-3 " + btnStyle,
                        children: [
                          e.jsx("span", { className: "font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 shrink-0 text-slate-800", children: ['ក.', 'ខ.', 'គ.', 'ឃ.'][optIdx] }),
                          e.jsx("span", { className: "flex-grow pt-0.5", children: opt.t }),
                          iconState
                        ]
                      }, optIdx);
                    })
                  }),

                  // Explanation Box
                  hasAnswered && e.jsxs("div", {
                    className: "p-4 rounded-xl border text-xs sm:text-sm flex flex-col sm:flex-row items-start justify-between gap-3 " + (qItem.opts[selectedOpt]?.c ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-rose-50 border-rose-200 text-rose-950"),
                    children: [
                      e.jsxs("div", {
                        className: "space-y-1",
                        children: [
                          e.jsx("strong", { children: qItem.opts[selectedOpt]?.c ? "ចម្លើយត្រឹមត្រូវ!" : "ចម្លើយមិនទាន់ត្រឹមត្រូវទេ!" }),
                          e.jsx("p", { children: qItem.exp })
                        ]
                      }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech("ពន្យល់ចម្លើយ៖ " + qItem.exp),
                        className: "px-3 py-1.5 bg-white/80 hover:bg-white text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition shrink-0 flex items-center gap-1.5 shadow-xs",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                      })
                    ]
                  })
                ]
              }),

              // Question Step Navigation
              e.jsxs("div", {
                className: "flex justify-between items-center gap-2 pt-2",
                children: [
                  e.jsxs("button", {
                    disabled: currentQIndex === 0,
                    onClick: () => setCurrentQIndex(prev => Math.max(0, prev - 1)),
                    className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-xl transition border border-slate-300 flex items-center gap-2",
                    children: [e.jsx("i", { className: "fa-solid fa-chevron-left" }), e.jsx("span", { children: "សំណួរមុន" })]
                  }),
                  e.jsxs("button", {
                    onClick: () => setUserAnswers({}),
                    className: "px-3.5 py-2 bg-white hover:bg-slate-50 text-rose-600 text-xs font-semibold rounded-xl transition border border-rose-200 flex items-center gap-1.5 shadow-xs",
                    children: [e.jsx("i", { className: "fa-solid fa-rotate-left" }), e.jsx("span", { children: "ចាប់ផ្តើមឡើងវិញ" })]
                  }),
                  e.jsxs("button", {
                    disabled: currentQIndex === qcmList.length - 1,
                    onClick: () => setCurrentQIndex(prev => Math.min(qcmList.length - 1, prev + 1)),
                    className: "px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-xs",
                    children: [e.jsx("span", { children: "សំណួរបន្ទាប់" }), e.jsx("i", { className: "fa-solid fa-chevron-right" })]
                  })
                ]
              }),

              // Quick Navigator Grid
              e.jsxs("div", {
                className: "pt-4 border-t border-slate-100 space-y-2",
                children: [
                  e.jsx("div", { className: "text-xs font-semibold text-slate-600", children: "រំលងទៅកាន់សំណួរជាក់លាក់៖" }),
                  e.jsx("div", {
                    className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5",
                    children: qcmList.map((item, idx) => {
                      const isAns = userAnswers[idx] !== undefined;
                      const isRight = isAns && item.opts[userAnswers[idx]]?.c;
                      let bg = "bg-slate-100 text-slate-700 hover:bg-slate-200";
                      if (isAns) bg = isRight ? "bg-emerald-600 text-white font-bold" : "bg-rose-500 text-white font-bold";
                      const ring = idx === currentQIndex ? "ring-2 ring-amber-500 font-bold" : "";

                      return e.jsx("button", {
                        onClick: () => setCurrentQIndex(idx),
                        className: "w-full py-1.5 rounded-lg text-xs font-mono transition text-center " + bg + " " + ring,
                        children: idx + 1
                      }, idx);
                    })
                  })
                ]
              })
            ]
          })
        })
      ]
    })
  });
};
`;

fs.writeFileSync('scripts/rz15_component_code.js', rz15ComponentCode, 'utf8');
console.log("Saved scripts/rz15_component_code.js successfully!");
