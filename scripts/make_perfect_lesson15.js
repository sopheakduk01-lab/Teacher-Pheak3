import fs from 'node:fs';

console.log("=== Building Perfect Rz15 React Component Code for Lesson 15 ===");

const rz15Code = `var Rz15 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "overview" }) => {
  if (!r) return null;

  const [activeTab, setActiveTab] = y.useState(a === "tab-hero" ? "overview" : (a || "overview"));
  const [qcmList] = y.useState(Zi15);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  
  // Audio Speech & Fullscreen States
  const [isFullscreen, setIsFullscreen] = y.useState(false);
  const [isSpeaking, setIsSpeaking] = y.useState(false);

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
      s && s("បានបិទសំឡេងអាន");
      return;
    }
    if (!textToRead) return;
    setIsSpeaking(true);
    s && s("កំពុងអានជាសំឡេងភាសាខ្មែរ...");

    if (window.playKhmerSpeech) {
      window.playKhmerSpeech(
        textToRead,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    } else if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToRead);
        utter.lang = "km-KH";
        utter.rate = 0.88;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
      } catch (err) {
        setIsSpeaking(false);
      }
    } else {
      setIsSpeaking(false);
    }
  };

  const toggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    if (s) s(nextState ? "បានបើករបៀបបង្ហាញពេញអេក្រង់ (Full Screen)" : "បានចាកចេញពីរបៀបពេញអេក្រង់");
  };

  const copyFullLesson = () => {
    const text = \`មេរៀនទី ១៥៖ អគ្គិសនី (សៀវភៅពុម្ពទំព័រ ១۰۰ ដល់ ១០៧)

ចរន្តអគ្គិសនីដែលយើងកំពុងប្រើប្រាស់សព្វថ្ងៃ បានមកពីប្រភពអគ្គិសនីពីរគឺ ប្រភពចរន្តជាប់ និងប្រភពចរន្តឆ្លាស់។ ប្រភពផ្តល់ចរន្តអគ្គិសនីទាំងពីរនេះហៅថា ជនិតាអគ្គិសនី។
១. ចរន្តអគ្គិសនី៖ គឺជាបម្លាស់បន្ទុកអគ្គិសនីឬអេឡិចត្រុង។
២. ទិសដៅចរន្តអគ្គិសនី៖ ចរន្តអគ្គិសនីផ្លាស់ទីពី (+) ទៅ (-) រីឯអេឡិចត្រុងផ្លាស់ទីពី (-) ទៅ (+)\`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      s && s("បានចម្លងមេរៀនទី ១៥ ទាំងមូលដោយជោគជ័យ!");
    }
  };

  const copySection = (secName, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
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

  const catMap = {
    'current': e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200", children: "១. ចរន្ត និងទិសដៅ (ទំព័រ ១០០-១០១)" }),
    'meters': e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200", children: "២. ឧបករណ៍វាស់ (ទំព័រ ១០១)" }),
    'conductors': e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200", children: "៣. អង្គធាតុចម្លង & អ៊ីសូឡង់ (ទំព័រ ១០២-១០៣)" }),
    'circuits': e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200", children: "៤. សៀគ្វីស៊េរី & ខ្នែង (ទំព័រ ១០៤-១០៥)" }),
    'home': e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200", children: "៥. បណ្តាញគេហដ្ឋាន (ទំព័រ ១០៦-១០៧)" })
  };

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
                  className: "w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl shadow-inner border border-white/30",
                  children: e.jsx("i", { className: "fa-solid fa-bolt-lightning" })
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        e.jsx("span", { className: "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200", children: "រូបវិទ្យាថ្នាក់ទី ៦" }),
                        e.jsxs("span", { className: "text-[10px] text-amber-100 hidden sm:inline", children: [e.jsx("i", { className: "fa-solid fa-book-bookmark mr-1" }), "សៀវភៅពុម្ព MoEYS (ទំព័រ ១០០-១០៧)"] })
                      ]
                    }),
                    e.jsx("h2", { className: "text-base sm:text-lg font-bold font-khmer leading-tight", children: "មេរៀនទី ១៥៖ អគ្គិសនី (Electricity)" })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center space-x-2",
              children: [
                e.jsxs("button", {
                  onClick: () => toggleSpeech("មេរៀនទី ១៥៖ អគ្គិសនី។ ចរន្តអគ្គិសនីទទួលបានមកពីប្រភពពីរគឺ ចរន្តជាប់ និងចរន្តឆ្លាស់។ ចរន្តអគ្គិសនីជាបម្លាស់បន្ទុកអេឡិចត្រុង។ ឧបករណ៍វាស់ចរន្តគឺអំពែម៉ែត្រ និងឧបករណ៍វាស់តង់ស្យុងគឺវ៉ុលម៉ែត្រ។"),
                  className: "px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md border border-white/20 shadow-xs cursor-pointer",
                  children: [
                    e.jsx("i", { className: isSpeaking ? "fa-solid fa-volume-xmark text-amber-200 animate-pulse" : "fa-solid fa-volume-high" }),
                    e.jsx("span", { children: isSpeaking ? "បិទសំឡេង" : "🔊 ស្ដាប់ពន្យល់សំឡេង" })
                  ]
                }),
                e.jsxs("button", {
                  onClick: toggleFullscreen,
                  className: "px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md border border-white/20 shadow-xs cursor-pointer",
                  children: [
                    e.jsx("i", { className: "fa-solid " + (isFullscreen ? "fa-compress" : "fa-expand") }),
                    e.jsx("span", { children: isFullscreen ? "⛶ ចាកចេញ" : "⛶ ពេញអេក្រង់" })
                  ]
                }),
                e.jsx("button", {
                  onClick: t,
                  className: "w-9 h-9 rounded-xl bg-white/20 hover:bg-rose-600 text-white flex items-center justify-center transition backdrop-blur-md border border-white/20 cursor-pointer",
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
              className: "py-2 px-3.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer " + (activeTab === "overview" ? "text-amber-800 bg-amber-50 border border-amber-300 shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent"),
              children: [e.jsx("i", { className: "fa-solid fa-layer-group text-amber-600" }), e.jsx("span", { children: "១. ខ្លឹមសារ ៥ ផ្នែក (Step-by-Step)" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("simulation"),
              className: "py-2 px-3.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer " + (activeTab === "simulation" ? "text-amber-800 bg-amber-50 border border-amber-300 shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent"),
              children: [e.jsx("i", { className: "fa-solid fa-flask-vial text-slate-500" }), e.jsx("span", { children: "២. បន្ទប់ពិសោធន៍សៀគ្វី (Circuit Lab)" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("quiz"),
              className: "py-2 px-3.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer " + (activeTab === "quiz" ? "text-amber-800 bg-amber-50 border border-amber-300 shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent"),
              children: [e.jsx("i", { className: "fa-solid fa-list-check text-slate-500" }), e.jsx("span", { children: "៣. សំណួរ QCM (៤០ សំណួរ)" })]
            })
          ]
        }),

        // Modal Body
        e.jsx("div", {
          className: "p-4 sm:p-6 overflow-y-auto flex-grow space-y-6 text-slate-800 font-khmer selection:bg-amber-500 selection:text-white",
          children: activeTab === "overview" ? e.jsxs("div", {
            className: "space-y-6",
            children: [
              // Top Banner
              e.jsx("div", {
                className: "bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden",
                children: e.jsxs("div", {
                  className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsxs("div", {
                          className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold",
                          children: [e.jsx("i", { className: "fa-solid fa-book-open text-amber-600" }), "ខ្លឹមសារសៀវភៅពុម្ពក្រសួងអប់រំ (ទំព័រ ១០០ ដល់ ១០៧)"]
                        }),
                        e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900", children: "ជំពូកទី ៥ • មេរៀនទី ១៥៖ អគ្គិសនី" }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-600", children: "ខ្លឹមសារលម្អិតបែងចែកជា ៥ ជំហានច្បាស់លាស់ ងាយស្រួលយល់ និងកត់ត្រា" })
                      ]
                    }),
                    e.jsx("div", {
                      className: "flex items-center gap-2",
                      children: e.jsxs("button", {
                        onClick: copyFullLesson,
                        className: "bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer",
                        children: [e.jsx("i", { className: "fa-solid fa-copy" }), "ចម្លងអត្ថបទទាំងអស់"]
                      })
                    })
                  ]
                })
              }),

              // STEP 1
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                children: [
                  e.jsxs("div", {
                    className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-10 h-10 rounded-2xl bg-amber-500 text-white font-bold text-base flex items-center justify-center shadow-sm", children: "១" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[11px] font-bold text-amber-700 tracking-wider uppercase", children: "ជំហានទី ១ (Step 1)" }),
                              e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "ចរន្តអគ្គិសនី និងទិសដៅចរន្ត (ទំព័រ ១០០-១០១)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => toggleSpeech("ជំហានទី ១៖ ចរន្តអគ្គិសនី និងទិសដៅចរន្ត។ ប្រភពអគ្គិសនីមានពីរគឺ ចរន្តជាប់ និងចរន្តឆ្លាស់។ ចរន្តអគ្គិសនីគឺជាបម្លាស់បន្ទុកអគ្គិសនីឬអេឡិចត្រុង។ ចរន្តអគ្គិសនីផ្លាស់ទីពីប៉ូលវិជ្ជមានទៅប៉ូលអវិជ្ជមាន រីឯអេឡិចត្រុងផ្លាស់ទីពីប៉ូលអវិជ្ជមានទៅប៉ូលវិជ្ជមាន។"),
                            className: "text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-solid fa-volume-high text-amber-600" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySection("១", "១. ចរន្តអគ្គិសនី និងទិសដៅចរន្ត (ទំព័រ ១០០-១០១)\\n- ប្រភពអគ្គិសនី៖ ជនិតាចរន្តឆ្លាស់ (ឌីណាម៉ូ អាល់ទែណាទ័រ...) និងជនិតាចរន្តជាប់ (ថ្មពិល អាគុយ...)\\n- និយមន័យ៖ ចរន្តអគ្គិសនី គឺជាបម្លាស់បន្ទុកអគ្គិសនីឬអេឡិចត្រុង។\\n- ទិសដៅ៖ ចរន្តអគ្គិសនីផ្លាស់ទីពី (+) ទៅ (-)។ រីឯអេឡិចត្រុងផ្លាស់ទីក្នុងខ្សែចម្លងពី (-) ទៅ (+)។"),
                            className: "text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-regular fa-copy text-slate-500" }), e.jsx("span", { children: "ចម្លងផ្នែកនេះ" })]
                          })
                        ]
                      })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                    children: [
                      // Section A
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsxs("h4", {
                            className: "font-bold text-slate-900 flex items-center gap-2",
                            children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }), "ក. ប្រភពអគ្គិសនី (ទំព័រ ១០០)"]
                          }),
                          e.jsxs("div", {
                            className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 space-y-2",
                            children: [
                              e.jsxs("p", { children: ["ចរន្តអគ្គិសនីដែលយើងកំពុងប្រើប្រាស់សព្វថ្ងៃ បានមកពីប្រភពអគ្គិសនីពីរគឺ ", e.jsx("strong", { children: "ប្រភពចរន្តជាប់" }), " និង ", e.jsx("strong", { children: "ប្រភពចរន្តឆ្លាស់" }), "។ ប្រភពផ្តល់ចរន្តអគ្គិសនីទាំងពីរនេះហៅថា ", e.jsx("strong", { children: "ដីណាម៉ូ ឬជនិតាអគ្គិសនី" }), "។"] }),
                              e.jsxs("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",
                                children: [
                                  e.jsxs("div", { className: "p-3 bg-white rounded-xl border border-slate-200", children: [e.jsx("div", { className: "text-xs font-bold text-amber-700", children: "១. ជនិតាចរន្តឆ្លាស់" }), e.jsx("div", { className: "text-xs text-slate-600 mt-1", children: "ឌីណាម៉ូ, អាល់ទែណាទ័រ..." })] }),
                                  e.jsxs("div", { className: "p-3 bg-white rounded-xl border border-slate-200", children: [e.jsx("div", { className: "text-xs font-bold text-amber-700", children: "២. ជនិតាចរន្តជាប់" }), e.jsx("div", { className: "text-xs text-slate-600 mt-1", children: "ថ្មពិល, អាគុយ..." })] })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                      // Section B
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsxs("h4", {
                            className: "font-bold text-slate-900 flex items-center gap-2",
                            children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }), "ខ. និយមន័យចរន្តអគ្គិសនី"]
                          }),
                          e.jsx("p", { className: "text-slate-700", children: "នៅក្នុងខ្សែចម្លងមានបន្ទុកអគ្គិសនីឬអេឡិចត្រុងសេរីយ៉ាងច្រើន ធ្វើចលនាឥតឈប់ឈរនិងគ្មានសណ្តាប់ធ្នាប់។ នៅពេលយើងភ្ជាប់ខ្សែចម្លងទៅនឹងប្រភព (ជនិតា) កម្លាំងចលករអគ្គិសនីបានរុញបន្ទុកអគ្គិសនីឬអេឡិចត្រុងសេរីទាំងនោះឱ្យផ្លាស់ទីតាមទិសដៅតែមួយ។" }),
                          e.jsxs("div", {
                            className: "p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5",
                            children: [e.jsx("i", { className: "fa-solid fa-quote-left text-amber-600 mr-1.5" }), e.jsxs("span", { children: [e.jsx("strong", { children: "ដូចនេះ៖" }), " ចរន្តអគ្គិសនី គឺជាបម្លាស់បន្ទុកអគ្គិសនីឬអេឡិចត្រុង។"] })]
                          })
                        ]
                      }),

                      // Section C
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsxs("h4", {
                            className: "font-bold text-slate-900 flex items-center gap-2",
                            children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }), "គ. ទិសដៅចរន្តអគ្គិសនី និងអេឡិចត្រុង (ទំព័រ ១០១)"]
                          }),
                          e.jsxs("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                                children: [
                                  e.jsxs("div", {
                                    className: "font-bold text-rose-700 text-sm flex items-center justify-between",
                                    children: [e.jsx("span", { children: "ទិសដៅចរន្តអគ្គិសនី (តាមទម្លាប់)" }), e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-bold", children: "(+) ទៅ (-)" })]
                                  }),
                                  e.jsxs("p", { className: "text-slate-600", children: ["ចរន្តអគ្គិសនីផ្លាស់ទីពី ", e.jsx("strong", { children: "ប៉ូលវិជ្ជមាន (+)" }), " ឆ្លងកាត់អំពូល រួចទៅ ", e.jsx("strong", { children: "ប៉ូលអវិជ្ជមាន (-)" }), "។"] })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                                children: [
                                  e.jsxs("div", {
                                    className: "font-bold text-blue-700 text-sm flex items-center justify-between",
                                    children: [e.jsx("span", { children: "ទិសដៅបម្លាស់ទីអេឡិចត្រុង" }), e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-bold", children: "(-) ទៅ (+)" })]
                                  }),
                                  e.jsxs("p", { className: "text-slate-600", children: ["រីឯអេឡិចត្រុង ផ្លាស់ទីក្នុងខ្សែចម្លងពី ", e.jsx("strong", { children: "ប៉ូលអវិជ្ជមាន (-)" }), " ទៅ ", e.jsx("strong", { children: "ប៉ូលវិជ្ជមាន (+)" }), " (ទិសដៅផ្ទុយពីចរន្ត)។"] })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // STEP 2
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                children: [
                  e.jsxs("div", {
                    className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-10 h-10 rounded-2xl bg-cyan-600 text-white font-bold text-base flex items-center justify-center shadow-sm", children: "២" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[11px] font-bold text-cyan-700 tracking-wider uppercase", children: "ជំហានទី ២ (Step 2)" }),
                              e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "ឧបករណ៍វាស់អគ្គិសនី (ទំព័រ ១០១)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => toggleSpeech("ជំហានទី ២៖ ឧបករណ៍វាស់អគ្គិសនី។ អំពែម៉ែត្រប្រើវាស់អាំងតង់ស៊ីតេចរន្តអគ្គិសនី គិតជាអំពែ ឬមីលីអំពែ។ មួយអំពែស្មើមួយពាន់មីលីអំពែ។ វ៉ុលម៉ែត្រប្រើវាស់កម្លាំងអគ្គិសនីចលករ ឬតង់ស្យុង គិតជាវ៉ុល ឬមីលីវ៉ុល។ មួយវ៉ុលស្មើមួយពាន់មីលីវ៉ុល។"),
                            className: "text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-800 px-3 py-1.5 rounded-xl border border-cyan-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-solid fa-volume-high text-cyan-600" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySection("២", "២. ឧបករណ៍វាស់អគ្គិសនី (ទំព័រ ១០១)\\n- អំពែម៉ែត្រ៖ វាស់អាំងតង់ស៊ីតេចរន្តអគ្គិសនី (A, mA)។ 1A = 1000 mA\\n- វ៉ុលម៉ែត្រ៖ វាស់កម្លាំងអគ្គិសនីចលករ ឬតង់ស្យុង (V, mV)។ 1V = 1000 mV\\n- កម្លាំងអគ្គិសនីចលករជាកម្លាំងដែលធ្វើឱ្យចរន្តផ្លាស់ទីក្នុងសៀគ្វី។"),
                            className: "text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-regular fa-copy text-slate-500" }), e.jsx("span", { children: "ចម្លងផ្នែកនេះ" })]
                          })
                        ]
                      })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                    children: [
                      e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                          e.jsxs("div", {
                            className: "bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  e.jsxs("h4", { className: "font-bold text-slate-900 text-sm flex items-center gap-2", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-cyan-600" }), "អំពែម៉ែត្រ (Ammeter)"] }),
                                  e.jsx("span", { className: "text-xs font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold", children: "A" })
                                ]
                              }),
                              e.jsxs("p", { className: "text-xs text-slate-600", children: ["ឧបករណ៍វាស់អាំងតង់ស៊ីតេចរន្តអគ្គិសនី ហៅថា ", e.jsx("strong", { children: "អំពែម៉ែត្រ" }), "។"] }),
                              e.jsxs("ul", {
                                className: "text-xs space-y-1 text-slate-700 list-disc list-inside",
                                children: [
                                  e.jsxs("li", { children: ["ខ្នាតចរន្តអគ្គិសនីគឺ៖ ", e.jsx("strong", { children: "អំពែ (A)" })] }),
                                  e.jsxs("li", { children: ["ខ្នាតដែលតូចជាងគឺ៖ ", e.jsx("strong", { children: "មីលីអំពែ (mA)" })] })
                                ]
                              }),
                              e.jsx("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-xs font-bold text-cyan-800", children: "1A = 1000 mA" })
                            ]
                          }),

                          e.jsxs("div", {
                            className: "bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  e.jsxs("h4", { className: "font-bold text-slate-900 text-sm flex items-center gap-2", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-indigo-600" }), "វ៉ុលម៉ែត្រ (Voltmeter)"] }),
                                  e.jsx("span", { className: "text-xs font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold", children: "V" })
                                ]
                              }),
                              e.jsxs("p", { className: "text-xs text-slate-600", children: ["ឧបករណ៍វាស់កម្លាំងអគ្គិសនីចលករ ឬតង់ស្យុង ហៅថា ", e.jsx("strong", { children: "វ៉ុលម៉ែត្រ" }), "។"] }),
                              e.jsxs("ul", {
                                className: "text-xs space-y-1 text-slate-700 list-disc list-inside",
                                children: [
                                  e.jsxs("li", { children: ["ខ្នាតកម្លាំងអគ្គិសនីចលករគឺ៖ ", e.jsx("strong", { children: "វ៉ុល (V)" })] }),
                                  e.jsxs("li", { children: ["ខ្នាតដែលតូចជាងគឺ៖ ", e.jsx("strong", { children: "មីលីវ៉ុល (mV)" })] })
                                ]
                              }),
                              e.jsx("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-xs font-bold text-indigo-800", children: "1V = 1000 mV" })
                            ]
                          })
                        ]
                      }),

                      e.jsxs("div", {
                        className: "p-3.5 bg-cyan-50 border border-cyan-200 rounded-2xl text-cyan-950 text-xs flex items-center gap-1.5",
                        children: [e.jsx("i", { className: "fa-solid fa-circle-info text-cyan-600 mr-1.5" }), e.jsxs("span", { children: [e.jsx("strong", { children: "សម្គាល់៖" }), " បើថ្មពិលមួយមានកំណត់ចង្អុល 1.5V មានន័យថា ថ្មពិលនោះមានកម្លាំងអគ្គិសនីចលករស្មើនឹង 1.5V (ជាកម្លាំងដែលធ្វើឱ្យចរន្តផ្លាស់ទីក្នុងសៀគ្វី)។"] })]
                      })
                    ]
                  })
                ]
              }),

              // STEP 3
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                children: [
                  e.jsxs("div", {
                    className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-10 h-10 rounded-2xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center shadow-sm", children: "៣" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[11px] font-bold text-emerald-700 tracking-wider uppercase", children: "ជំហានទី ៣ (Step 3)" }),
                              e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "អង្គធាតុចម្លង និងអ៊ីសូឡង់អគ្គិសនី (ទំព័រ ១០២-១០៣)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => toggleSpeech("ជំហានទី ៣៖ អង្គធាតុចម្លង និងអ៊ីសូឡង់អគ្គិសនី។ អង្គធាតុចម្លងអនុញ្ញាតឱ្យចរន្តឆ្លងកាត់បាន ដូចជា ដែកគោល ស្នៀតក្រដាស បណ្តូលខ្មៅដៃ និងទឹកអំបិល ធ្វើឱ្យអំពូលភ្លឺ។ អ៊ីសូឡង់មិនឱ្យចរន្តឆ្លងកាត់ទេ ដូចជា ឈើ និងក្រដាស ធ្វើឱ្យអំពូលមិនភ្លឺ។"),
                            className: "text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-solid fa-volume-high text-emerald-600" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySection("៣", "៣. អង្គធាតុចម្លង និងអ៊ីសូឡង់អគ្គិសនី (ទំព័រ ១០២-១០៣)\\n- អង្គធាតុចម្លង៖ អនុញ្ញាតឱ្យចរន្តឆ្លងកាត់ (ដែកគោល, ស្នៀតក្រដាស, ទឹកអំបិល, បណ្តូលខ្មៅដៃ, ទង់ដែង) -> អំពូលភ្លឺ\\n- អ៊ីសូឡង់៖ មិនឱ្យចរន្តឆ្លងកាត់ (ឈើ, ក្រដាសសៀវភៅ, ផ្លាស្ទិក, កៅស៊ូ) -> អំពូលមិនភ្លឺ\\n- ការប្រើប្រាស់៖ យកទង់ដែងធ្វើខ្សែចម្លង យកផ្លាស្ទិកស្រោបខាងក្រៅដើម្បីការពារគ្រោះថ្នាក់។"),
                            className: "text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-regular fa-copy text-slate-500" }), e.jsx("span", { children: "ចម្លងផ្នែកនេះ" })]
                          })
                        ]
                      })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                    children: [
                      e.jsx("p", { children: "ចរន្តអគ្គិសនីមិនអាចឆ្លងកាត់គ្រប់អង្គធាតុទាំងអស់បានទេ។ ដើម្បីដឹងការពិត គេយកអង្គធាតុធ្វើជាកុងតាក់ក្នុងសៀគ្វី៖" }),

                      // Grid 6 test cards
                      e.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs",
                        children: [
                          e.jsxs("div", { className: "p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200", children: [e.jsxs("div", { className: "font-bold text-emerald-800 flex items-center justify-between mb-1", children: [e.jsx("span", { children: "១. ដែកគោល" }), e.jsx("span", { className: "text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold", children: "អំពូលភ្លឺ" })] }), e.jsx("p", { className: "text-slate-600", children: "ជាអង្គធាតុចម្លងអគ្គិសនី" })] }),
                          e.jsxs("div", { className: "p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200", children: [e.jsxs("div", { className: "font-bold text-emerald-800 flex items-center justify-between mb-1", children: [e.jsx("span", { children: "២. ស្នៀតក្រដាស" }), e.jsx("span", { className: "text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold", children: "អំពូលភ្លឺ" })] }), e.jsx("p", { className: "text-slate-600", children: "ជាអង្គធាតុចម្លងអគ្គិសនី" })] }),
                          e.jsxs("div", { className: "p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200", children: [e.jsxs("div", { className: "font-bold text-emerald-800 flex items-center justify-between mb-1", children: [e.jsx("span", { children: "៣. ទឹកអំបិល" }), e.jsx("span", { className: "text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold", children: "អំពូលភ្លឺ" })] }), e.jsx("p", { className: "text-slate-600", children: "ជាអង្គធាតុចម្លងអគ្គិសនី" })] }),
                          e.jsxs("div", { className: "p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200", children: [e.jsxs("div", { className: "font-bold text-emerald-800 flex items-center justify-between mb-1", children: [e.jsx("span", { children: "៤. បណ្តូលខ្មៅដៃ (ក្រាហ្វិត)" }), e.jsx("span", { className: "text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold", children: "អំពូលភ្លឺ" })] }), e.jsx("p", { className: "text-slate-600", children: "ជាអង្គធាតុចម្លងអគ្គិសនី" })] }),
                          e.jsxs("div", { className: "p-3.5 bg-rose-50 rounded-2xl border border-rose-200", children: [e.jsxs("div", { className: "font-bold text-rose-800 flex items-center justify-between mb-1", children: [e.jsx("span", { children: "៥. ឈើ" }), e.jsx("span", { className: "text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold", children: "អំពូលមិនភ្លឺ" })] }), e.jsx("p", { className: "text-slate-600", children: "ជាអង្គធាតុអ៊ីសូឡង់អគ្គិសនី" })] }),
                          e.jsxs("div", { className: "p-3.5 bg-rose-50 rounded-2xl border border-rose-200", children: [e.jsxs("div", { className: "font-bold text-rose-800 flex items-center justify-between mb-1", children: [e.jsx("span", { children: "៦. ក្រដាសសៀវភៅ" }), e.jsx("span", { className: "text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold", children: "អំពូលមិនភ្លឺ" })] }), e.jsx("p", { className: "text-slate-600", children: "ជាអង្គធាតុអ៊ីសូឡង់អគ្គិសនី" })] })
                        ]
                      }),

                      e.jsxs("div", {
                        className: "p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs sm:text-sm",
                        children: [
                          e.jsxs("div", { children: ["• ", e.jsx("strong", { children: "អង្គធាតុចម្លងអគ្គិសនី៖" }), " អង្គធាតុទាំងឡាយណាដែលឱ្យចរន្តអគ្គិសនីឆ្លងកាត់បាន (ឧ. ទង់ដែង អាលុយមីញ៉ូម ដែក...) គេយកវាទៅធ្វើជាខ្សែចម្លងចរន្ត។"] }),
                          e.jsxs("div", { children: ["• ", e.jsx("strong", { children: "អង្គធាតុអ៊ីសូឡង់អគ្គិសនី (អង្គធាតុមិនចម្លង)៖" }), " អង្គធាតុទាំងឡាយណាដែលមិនឱ្យចរន្តអគ្គិសនីឆ្លងកាត់បាន (ឧ. ជ័រ ផ្លាស្ទិក កៅស៊ូ កែវ...) គេយកទៅស្រោបលើខ្សែចម្លង និងឌុយ ដើម្បីការពារកុំឱ្យឆ្លងចរន្តអគ្គិសនីមកប៉ះមនុស្ស។"] })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // STEP 4
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                children: [
                  e.jsxs("div", {
                    className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-10 h-10 rounded-2xl bg-purple-600 text-white font-bold text-base flex items-center justify-center shadow-sm", children: "៤" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[11px] font-bold text-purple-700 tracking-wider uppercase", children: "ជំហានទី ៤ (Step 4)" }),
                              e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "សៀគ្វីជាស៊េរី និងសៀគ្វីជាខ្នែង (ទំព័រ ១០៤-១០៥)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => toggleSpeech("ជំហានទី ៤៖ សៀគ្វីជាស៊េរី និងជាខ្នែង។ ក្នុងសៀគ្វីស៊េរី ចរន្តមានផ្លូវតែមួយ បើអំពូលមួយដាច់ អំពូលទាំងអស់រលត់។ ក្នុងសៀគ្វីខ្នែង ចរន្តមានផ្លូវច្រើន បើអំពូលមួយដាច់ អំពូលផ្សេងទៀតនៅតែភ្លឺធម្មតា។"),
                            className: "text-xs bg-purple-50 hover:bg-purple-100 text-purple-800 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-solid fa-volume-high text-purple-600" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySection("៤", "៤. សៀគ្វីជាស៊េរី និងជាខ្នែង (ទំព័រ ១០៤-១០៥)\\n- ថ្មពិលជាស៊េរី៖ កម្លាំងសរុប = ផលបូកកម្លាំងនីមួយៗ (1.5V + 1.5V + 1.5V = 4.5V ធ្វើឱ្យអំពូល 4.5V ភ្លឺធម្មតា)\\n- ថ្មពិលជាខ្នែង៖ កម្លាំងសរុបស្មើកម្លាំងថ្មមួយ (1.5V)\\n- គ្រឿងទទួលជាស៊េរី៖ មានផ្លូវតែមួយ បើដាច់មួយរលត់ទាំងអស់\\n- គ្រឿងទទួលជាខ្នែង៖ មានផ្លូវច្រើន បើដាច់មួយ គ្រឿងផ្សេងទៀតនៅតែភ្លឺធម្មតា។"),
                            className: "text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-regular fa-copy text-slate-500" }), e.jsx("span", { children: "ចម្លងផ្នែកនេះ" })]
                          })
                        ]
                      })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                    children: [
                      // Section A
                      e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsxs("h4", { className: "font-bold text-slate-900 flex items-center gap-2", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-purple-600" }), "ក. បង្គុំជនិតាអគ្គិសនី (ថ្មពិល 1.5V បីដុំ ផ្គត់ផ្គង់អំពូល 4.5V)"] }),
                          e.jsxs("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-bold text-purple-700 text-sm", children: "បង្គុំជនិតាជាស៊េរី (Series Batteries)" }),
                                  e.jsx("p", { className: "text-slate-600", children: "ដើម្បីឱ្យអំពូល 4.5V ភ្លឺធម្មតា គេត្រូវផ្គុំថ្មពិល 1.5V ចំនួន ៣ ដុំជាស៊េរី।" }),
                                  e.jsx("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-purple-900", children: "កម្លាំងអគ្គិសនីចលករនៃបង្គុំ = ផលបូកនៃកម្លាំងនីមួយៗ (1.5V + 1.5V + 1.5V = 4.5V)" })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-bold text-teal-700 text-sm", children: "បង្គុំជនិតាជាខ្នែង (Parallel Batteries)" }),
                                  e.jsx("p", { className: "text-slate-600", children: "បើចង់បានតង់ស្យុងត្រឹម 1.5V ដដែល ប៉ុន្តែប្រើប្រាស់បានយូរ គេផ្គុំថ្មពិលទាំង ៣ ជាខ្នែង।" }),
                                  e.jsx("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-teal-900", children: "កម្លាំងអគ្គិសនីចលករនៃបង្គុំ = កម្លាំងអគ្គិសនីចលករនៃថ្មពិលនីមួយៗ (1.5V)" })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                      // Section B
                      e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsxs("h4", { className: "font-bold text-slate-900 flex items-center gap-2", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-purple-600" }), "ខ. សៀគ្វីគ្រឿងទទួលជាស៊េរី និងជាខ្នែង (ទំព័រ ១០៥)"] }),
                          e.jsxs("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-bold text-slate-900 text-sm", children: "១. សៀគ្វីគ្រឿងទទួលជាស៊េរី" }),
                                  e.jsxs("p", { className: "text-slate-600", children: ["ចរន្តអគ្គិសនីមាន ", e.jsx("strong", { children: "ផ្លូវតែមួយគត់" }), " សម្រាប់ឆ្លងកាត់।"] }),
                                  e.jsxs("div", { className: "p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 font-medium", children: [e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-rose-600 mr-1" }), " ប្រសិនបើផ្នែកណាមួយត្រូវបានកាត់ផ្តាច់ (កុងតាក់ចំហ) ឬគ្រឿងទទួលណាមួយខូច (អំពូលមួយដាច់) គ្រឿងទទួលដទៃទៀតគ្មានចរន្តឆ្លងកាត់ទេ (អំពូលទាំងអស់រលត់)।"] })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-bold text-slate-900 text-sm", children: "២. សៀគ្វីគ្រឿងទទួលជាខ្នែង" }),
                                  e.jsxs("p", { className: "text-slate-600", children: ["ចរន្តអគ្គិសនីមាន ", e.jsx("strong", { children: "ផ្លូវច្រើន" }), " សម្រាប់ឆ្លងកាត់।"] }),
                                  e.jsxs("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-medium", children: [e.jsx("i", { className: "fa-solid fa-circle-check text-emerald-600 mr-1" }), " ប្រសិនបើផ្នែកណាមួយត្រូវបានកាត់ផ្តាច់ ឬគ្រឿងទទួលណាមួយខូច គ្រឿងទទួលដទៃទៀតនៅតែមានចរន្តឆ្លងកាត់ដដែល (អំពូលផ្សេងទៀតនៅតែភ្លឺជាធម្មតា)।"] })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // STEP 5
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                children: [
                  e.jsxs("div", {
                    className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-10 h-10 rounded-2xl bg-rose-600 text-white font-bold text-base flex items-center justify-center shadow-sm", children: "៥" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[11px] font-bold text-rose-700 tracking-wider uppercase", children: "ជំហានទី ៥ (Step 5)" }),
                              e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "បណ្តាញអគ្គិសនីក្នុងគេហដ្ឋាន (ទំព័រ ១០៦-១០៧)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => toggleSpeech("ជំហានទី ៥៖ បណ្តាញអគ្គិសនីក្នុងគេហដ្ឋាន។ នៅតាមផ្ទះគេតជាខ្នែង។ គ្រឿងបរិក្ខាររួមមាន កុងទ័រអគ្គិសនីវាស់ថាមពលជាគីឡូវ៉ាត់ម៉ោង, ភុយស៊ីបការពារការឆ្លងសៀគ្វី, ឌីសុងទ័រជាកុងតាក់ស្វ័យប្រវត្តិ, កុងតាក់ និងព្រីឌុយ។"),
                            className: "text-xs bg-rose-50 hover:bg-rose-100 text-rose-800 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-solid fa-volume-high text-rose-600" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySection("៥", "៥. បណ្តាញអគ្គិសនីក្នុងគេហដ្ឋាន (ទំព័រ ១០៦-១០៧)\\n- តជាខ្នែង៖ បើខូចមួយ គ្រឿងទទួលដទៃទៀតនៅតែដំណើរការធម្មតា\\n- ភុយស៊ីប៖ ជាខ្សែស្តើងងាយរលាយដាច់ពេលឆ្លងកាត់កម្ដៅខ្លាំង\\n- ឌីសុងទ័រ៖ ជាកុងតាក់ស្វ័យប្រវត្តិកាត់ផ្តាច់ពេលលើសបន្ទុក\\n- កុងទ័រអគ្គិសនី៖ វាស់ថាមពលអគ្គិសនីគិតជា គីឡូវ៉ាត់ម៉ោង (kW/h)\\n- កុងតាក់៖ ភ្ជាប់ឬផ្តាច់ចរន្ត\\n- ព្រី និងឌុយ៖ សម្រាប់ដោតភ្ជាប់ចរន្ត។"),
                            className: "text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs font-semibold cursor-pointer",
                            children: [e.jsx("i", { className: "fa-regular fa-copy text-slate-500" }), e.jsx("span", { children: "ចម្លងផ្នែកនេះ" })]
                          })
                        ]
                      })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                    children: [
                      e.jsxs("div", {
                        className: "p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-xs sm:text-sm",
                        children: [e.jsx("strong", { children: "គោលការណ៍សំខាន់៖" }), " នៅតាមគេហដ្ឋានភាគច្រើន គេតភ្ជាប់គ្រឿងទទួលអគ្គិសនីជា ", e.jsx("strong", { children: "ខ្នែង" }), " ពីព្រោះការតជាខ្នែង បើអំពូល ឬគ្រឿងទទួលណាមួយដាច់ ឬខូច អំពូលដទៃទៀតនៅតែភ្លឺ ឬគ្រឿងទទួលដទៃទៀតនៅតែមានដំណើរការជាធម្មតា។"]
                      }),

                      e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsx("h4", { className: "font-bold text-slate-900", children: "គ្រឿងបរិក្ខារសំខាន់ៗក្នុងបណ្តាញគេហដ្ឋាន (ទំព័រ ១០៦-១០៧)៖" }),
                          e.jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs",
                            children: [
                              e.jsxs("div", { className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [e.jsx("i", { className: "fa-solid fa-gauge text-rose-600" }), "កុងទ័រអគ្គិសនី"] }), e.jsxs("p", { className: "text-slate-600", children: ["ជាឧបករណ៍វាស់ថាមពលអគ្គិសនីដែលប្រើប្រាស់ដោយគ្រឿងទទួល គិតជា ", e.jsx("strong", { children: "គីឡូវ៉ាត់ម៉ោង (kW/h)" }), "។"] })] }),
                              e.jsxs("div", { className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [e.jsx("i", { className: "fa-solid fa-shield-halved text-rose-600" }), "ភុយស៊ីប (Fuse)"] }), e.jsx("p", { className: "text-slate-600", children: "ជាខ្សែស្តើងធ្វើពីលោហៈងាយរលាយដាច់នៅពេលត្រូវកម្ដៅដោយចរន្តអគ្គិសនីឆ្លងកាត់ខ្លាំង (ការពារការឆ្លងសៀគ្វី)។" })] }),
                              e.jsxs("div", { className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [e.jsx("i", { className: "fa-solid fa-toggle-on text-rose-600" }), "ឌីសុងទ័រ (Circuit Breaker)"] }), e.jsxs("p", { className: "text-slate-600", children: ["ជា ", e.jsx("strong", { children: "កុងតាក់ស្វ័យប្រវត្តិ" }), " សម្រាប់កាត់ផ្តាច់ចរន្តដោយស្វ័យប្រវត្តិកាលណាមានការលើសចំណុះ ឬឆ្លងចរន្ត។"] })] }),
                              e.jsxs("div", { className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [e.jsx("i", { className: "fa-solid fa-sliders text-rose-600" }), "កុងតាក់ (Switch)"] }), e.jsx("p", { className: "text-slate-600", children: "ជាឧបករណ៍ភ្ជាប់ឬផ្តាច់ចរន្តអគ្គិសនីពីគ្រឿងទទួលអគ្គិសនី។" })] }),
                              e.jsxs("div", { className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [e.jsx("i", { className: "fa-solid fa-plug text-rose-600" }), "ភ្ជាប់ចរន្ត (ព្រី និងឌុយ)"] }), e.jsxs("p", { className: "text-slate-600", children: ["ឧបករណ៍សម្រាប់ភ្ជាប់គ្រឿងទទួលអគ្គិសនី។ មាន ២ គឺ ", e.jsx("strong", { children: "ព្រីញី" }), " (រន្ធពីរឬបី) និង ", e.jsx("strong", { children: "ឌុយឈ្មោល" }), " (ជើងពីរឬបី)។"] })] }),
                              e.jsxs("div", { className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [e.jsx("i", { className: "fa-solid fa-tower-broadcast text-rose-600" }), "ខ្សែបណ្តាញបញ្ចូល"] }), e.jsx("p", { className: "text-slate-600", children: "ជាខ្សែនាំចរន្តចូលខ្សែមេ ពីខ្សែផ្តល់ចរន្តអគ្គិសនីដែលបានមកពីរោងចក្រអគ្គិសនី។" })] })
                            ]
                          })
                        ]
                      })
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
                className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" }),
                          e.jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-amber-600", children: "Dynamic Physics & Electronics Simulator" })
                        ]
                      }),
                      e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-1", children: "បន្ទប់ពិសោធន៍ចរន្តអគ្គិសនីជាក់ស្តែង" }),
                      e.jsx("p", { className: "text-xs sm:text-sm text-slate-500", children: "តេស្តអង្គធាតុចម្លង អង្គធាតុអ៊ីសូឡង់ សៀគ្វីស៊េរី និងខ្នែង ជាមួយចលនាអេឡិចត្រុងរត់តាមខ្សែ" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-md w-full md:w-auto",
                    children: [
                      e.jsxs("button", {
                        onClick: () => setSimMode("conductor_test"),
                        className: "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer " + (simMode === "conductor_test" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"),
                        children: [e.jsx("i", { className: "fa-solid fa-plug-circle-bolt" }), e.jsx("span", { children: "១. តេស្តអង្គធាតុ" })]
                      }),
                      e.jsxs("button", {
                        onClick: () => setSimMode("series_parallel"),
                        className: "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer " + (simMode === "series_parallel" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"),
                        children: [e.jsx("i", { className: "fa-solid fa-network-wired" }), e.jsx("span", { children: "២. ស៊េរី / ខ្នែង" })]
                      })
                    ]
                  })
                ]
              }),

              // Canvas Host
              e.jsxs("div", {
                className: "relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden canvas-container",
                children: [
                  e.jsx("canvas", { ref: canvasRef, className: "w-full block" }),
                  e.jsxs("div", {
                    className: "absolute top-3 left-3 flex flex-wrap gap-2",
                    children: [
                      e.jsxs("div", { className: "bg-white/95 border border-slate-200 px-3 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 text-amber-700 font-semibold shadow-xs", children: [e.jsx("i", { className: "fa-solid fa-bolt text-amber-500" }), e.jsx("span", { children: switchClosed ? "កុងតាក់៖ បិទ (សៀគ្វីបិទ)" : "កុងតាក់៖ ចំហ (គ្មានចរន្ត)" })] }),
                      e.jsx("div", { className: "bg-white/95 border border-slate-200 px-3 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 text-slate-700 font-semibold shadow-xs", children: "តង់ស្យុង៖ " + voltage.toFixed(1) + "V" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "absolute bottom-3 right-3 flex items-center gap-2",
                    children: [
                      e.jsxs("button", {
                        onClick: () => setSwitchClosed(!switchClosed),
                        className: "px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer " + (switchClosed ? "bg-amber-600 hover:bg-amber-700" : "bg-rose-600 hover:bg-rose-700"),
                        children: [e.jsx("i", { className: "fa-solid fa-power-off" }), e.jsx("span", { children: switchClosed ? "ចុចកាត់ផ្តាច់កុងតាក់" : "ចុចភ្ជាប់កុងតាក់" })]
                      }),
                      e.jsxs("button", {
                        onClick: () => setAnimActive(!animActive),
                        className: "bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-300 flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer",
                        children: [e.jsx("i", { className: "fa-solid " + (animActive ? "fa-pause" : "fa-play") }), e.jsx("span", { children: animActive ? "ផ្អាក" : "បន្ត" })]
                      })
                    ]
                  })
                ]
              }),

              // Controls & Physics Gauge
              e.jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
                children: [
                  e.jsxs("div", {
                    className: "lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between border-b border-slate-200 pb-2",
                        children: [
                          e.jsxs("h4", { className: "font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2", children: [e.jsx("i", { className: "fa-solid fa-sliders text-amber-600" }), "បន្ទះបញ្ជាការពិសោធន៍"] }),
                          e.jsx("span", { className: "text-[11px] text-slate-500", children: "ទំព័រ ១០២ - ១០៥" })
                        ]
                      }),
                      simMode === "conductor_test" ? e.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx("label", { className: "block text-xs font-medium text-slate-700", children: "ជ្រើសរើសអង្គធាតុតេស្ត (ទំព័រ ១០២)៖" }),
                              e.jsxs("select", {
                                value: selectedMaterial,
                                onChange: (e) => setSelectedMaterial(e.target.value),
                                className: "w-full bg-white border border-slate-300 text-slate-800 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer",
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
                            className: "space-y-2 pt-2 border-t border-slate-200",
                            children: [
                              e.jsxs("div", { className: "flex justify-between text-xs font-medium text-slate-700", children: [e.jsx("span", { children: "ចំនួនថ្មពិល (1.5V ក្នុងមួយដុំ)៖" }), e.jsx("span", { className: "font-mono font-bold text-amber-700", children: batteryCount + " គ្រាប់ (" + (batteryCount * 1.5).toFixed(1) + "V)" })] }),
                              e.jsx("input", { type: "range", min: "1", max: "3", step: "1", value: batteryCount, onChange: (e) => setBatteryCount(parseInt(e.target.value)), className: "w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer" }),
                              e.jsxs("div", { className: "flex justify-between text-[10px] text-slate-500 font-mono", children: [e.jsx("span", { children: "1 ដុំ (1.5V)" }), e.jsx("span", { children: "2 ដុំ (3.0V)" }), e.jsx("span", { children: "3 ដុំ (4.5V)" })] })
                            ]
                          })
                        ]
                      }) : e.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx("label", { className: "block text-xs font-medium text-slate-700", children: "ប្រភេទសៀគ្វីគ្រឿងទទួល (ទំព័រ ១០៥)៖" }),
                              e.jsxs("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                  e.jsx("button", { onClick: () => setCircuitType("parallel"), className: "py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer " + (circuitType === "parallel" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-300"), children: "សៀគ្វីជាខ្នែង (ផ្ទះ)" }),
                                  e.jsx("button", { onClick: () => setCircuitType("series"), className: "py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer " + (circuitType === "series" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-700 border-slate-300"), children: "សៀគ្វីជាស៊េរី" })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "space-y-2 pt-3 border-t border-slate-200",
                            children: [
                              e.jsx("label", { className: "block text-xs font-medium text-slate-700", children: "ពិសោធន៍ដោះអំពូលចេញ (Bulb Disconnect)៖" }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsxs("button", { onClick: () => setBulb1Broken(!bulb1Broken), className: "w-full text-left p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer " + (bulb1Broken ? "bg-rose-50 text-rose-700 border-rose-300" : "bg-white text-slate-700 border-slate-300"), children: [e.jsxs("span", { children: [e.jsx("i", { className: "fa-regular fa-lightbulb mr-2" }), " អំពូលទី ១"] }), e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded " + (bulb1Broken ? "bg-rose-200 text-rose-900" : "bg-emerald-100 text-emerald-800"), children: bulb1Broken ? "ដោះចេញ / ខូច" : "កំពុងតភ្ជាប់" })] }),
                                  e.jsxs("button", { onClick: () => setBulb2Broken(!bulb2Broken), className: "w-full text-left p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer " + (bulb2Broken ? "bg-rose-50 text-rose-700 border-rose-300" : "bg-white text-slate-700 border-slate-300"), children: [e.jsxs("span", { children: [e.jsx("i", { className: "fa-regular fa-lightbulb mr-2" }), " អំពូលទី ២"] }), e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded " + (bulb2Broken ? "bg-rose-200 text-rose-900" : "bg-emerald-100 text-emerald-800"), children: bulb2Broken ? "ដោះចេញ / ខូច" : "កំពុងតភ្ជាប់" })] })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "lg:col-span-7 bg-amber-50/40 p-5 rounded-2xl border border-amber-200 flex flex-col justify-between shadow-xs space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsxs("span", { className: "text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-1.5", children: [e.jsx("i", { className: "fa-solid fa-microchip" }), "ការវាស់វែង និងរូបវិទ្យាជាក់ស្តែង"] }),
                              e.jsxs("button", { onClick: () => toggleSpeech(simSpeechText), className: "px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs", children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់គណនា" })] })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                              e.jsxs("div", { className: "bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs", children: [e.jsx("div", { className: "text-[11px] text-slate-500 mb-0.5", children: "អាំងតង់ស៊ីតេចរន្ត (I)" }), e.jsxs("div", { className: "text-2xl sm:text-3xl font-extrabold font-mono text-cyan-600", children: [current.toFixed(2), " A"] }), e.jsxs("div", { className: "text-[10px] text-slate-400 font-mono mt-0.5", children: ["= ", (current * 1000).toFixed(0), " mA"] })] }),
                              e.jsxs("div", { className: "bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs", children: [e.jsx("div", { className: "text-[11px] text-slate-500 mb-0.5", children: "កម្លាំងចលករ / តង់ស្យុង (V)" }), e.jsxs("div", { className: "text-2xl sm:text-3xl font-extrabold font-mono text-amber-600", children: [voltage.toFixed(1), " V"] }), e.jsxs("div", { className: "text-[10px] text-slate-400 font-mono mt-0.5", children: ["= ", (voltage * 1000).toFixed(0), " mV"] })] })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "bg-white p-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1.5 shadow-xs",
                            children: [
                              e.jsx("div", { className: "text-slate-500 text-[11px]", children: "ស្ថានភាពអំពូល និងសៀគ្វី៖" }),
                              e.jsx("div", { className: "text-amber-800 font-semibold text-sm", children: statusText }),
                              e.jsx("div", { className: "text-slate-600 text-[11px]", children: stepValues })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "mt-4 pt-3 border-t border-amber-200/60 flex items-start gap-2.5 text-xs text-slate-700",
                        children: [
                          e.jsx("i", { className: "fa-solid fa-circle-check text-amber-600 mt-0.5" }),
                          e.jsx("div", { children: explanation })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }) : e.jsxs("div", {
            className: "space-y-6",
            children: [
              // QCM Header Bar
              e.jsxs("div", {
                className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" }),
                          e.jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-amber-700", children: "Step-by-Step QCM (៤០ សំណួរពេញ)" })
                        ]
                      }),
                      e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-1", children: "កម្រងសំណួរពហុជ្រើសរើស មេរៀនទី ១៥" }),
                      e.jsx("p", { className: "text-xs sm:text-sm text-slate-500", children: "ចម្លើយនីមួយៗវែងៗ មានហេតុផលគួបផ្សំ និងជម្រើសបោកបញ្ឆោតស៊ីជម្រៅ" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 shrink-0",
                    children: [
                      e.jsx("i", { className: "fa-solid fa-graduation-cap text-amber-600 text-2xl" }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("div", { className: "text-[10px] text-slate-500 font-medium", children: "សំណួរទី / ពិន្ទុបច្ចុប្បន្ន" }),
                          e.jsxs("div", {
                            className: "text-base font-bold font-mono text-slate-900",
                            children: [
                              e.jsx("span", { className: "text-amber-600", children: currentQIndex + 1 }),
                              " / ៤០",
                              e.jsx("span", { className: "text-slate-300 mx-1", children: "|" }),
                              e.jsx("span", { className: "text-xs font-normal text-slate-500", children: "ត្រូវ: " }),
                              e.jsx("span", { className: "text-emerald-700 font-bold", children: Object.keys(userAnswers).filter(idx => userAnswers[idx] === qcmList[idx]?.opts.findIndex(o => o.c)).length })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // Progress Bar
              e.jsx("div", {
                className: "w-full bg-slate-100 rounded-full h-2.5 overflow-hidden",
                children: e.jsx("div", { className: "bg-amber-500 h-2.5 rounded-full transition-all duration-300", style: { width: ((currentQIndex + 1) / qcmList.length * 100) + "%" } })
              }),

              // QCM Card
              e.jsxs("div", {
                className: "p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs transition-all",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between gap-2 border-b border-slate-100 pb-3",
                    children: [
                      e.jsx("div", { className: "flex items-center gap-2", children: catMap[qItem.cat] || catMap['current'] }),
                      e.jsxs("span", { className: "text-xs font-mono font-semibold text-slate-500", children: ["សំណួរ ", currentQIndex + 1, " នៃ ៤០"] })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "flex justify-between items-start gap-2",
                    children: [
                      e.jsx("div", { className: "text-slate-900 font-semibold text-sm sm:text-base leading-relaxed flex-grow", children: qItem.q }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech(speechQText),
                        className: "px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់សំណួរ" })]
                      })
                    ]
                  }),

                  // Options List
                  e.jsx("div", {
                    className: "space-y-2.5 pt-2",
                    children: qItem.opts.map((opt, optIdx) => {
                      let btnStyle = "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700";
                      let iconState = null;

                      if (hasAnswered) {
                        if (opt.c) {
                          btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-400";
                          iconState = e.jsx("i", { className: "fa-solid fa-circle-check text-emerald-600 ml-auto shrink-0 text-base" });
                        } else if (selectedOpt === optIdx) {
                          btnStyle = "border-rose-400 bg-rose-50 text-rose-950 font-semibold shadow-xs ring-1 ring-rose-300";
                          iconState = e.jsx("i", { className: "fa-solid fa-circle-xmark text-rose-600 ml-auto shrink-0 text-base" });
                        } else {
                          btnStyle = "border-slate-200 bg-white text-slate-400 opacity-60";
                        }
                      }

                      return e.jsxs("button", {
                        onClick: () => {
                          const newAns = { ...userAnswers, [currentQIndex]: optIdx };
                          setUserAnswers(newAns);
                        },
                        className: "w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition duration-150 active:scale-[0.99] flex items-start gap-3 cursor-pointer " + btnStyle,
                        children: [
                          e.jsx("span", { className: "font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 shrink-0 text-slate-800", children: ['ក.', 'ខ.', 'គ.', 'ឃ.'][optIdx] }),
                          e.jsx("span", { className: "flex-grow pt-0.5", children: opt.t }),
                          iconState
                        ]
                      }, optIdx);
                    })
                  }),

                  // Result & Explanation Box
                  hasAnswered && e.jsxs("div", {
                    className: "text-xs sm:text-sm p-4 rounded-xl border flex flex-col sm:flex-row items-start justify-between gap-3 " + (qItem.opts[selectedOpt]?.c ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-rose-50 border-rose-200 text-rose-950"),
                    children: [
                      e.jsxs("div", {
                        className: "flex items-start gap-2.5",
                        children: [
                          e.jsx("i", { className: "fa-solid " + (qItem.opts[selectedOpt]?.c ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-rose-600") + " mt-0.5 text-base" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("strong", { children: qItem.opts[selectedOpt]?.c ? "ចម្លើយត្រឹមត្រូវ!" : "ចម្លើយមិនទាន់ត្រឹមត្រូវទេ!" }),
                              e.jsx("div", { className: "mt-0.5", children: qItem.exp })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("button", {
                        onClick: () => toggleSpeech("ពន្យល់ចម្លើយ៖ " + qItem.exp),
                        className: "px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer",
                        children: [e.jsx("i", { className: "fa-solid fa-volume-high" }), e.jsx("span", { children: "🔊 ស្ដាប់ពន្យល់" })]
                      })
                    ]
                  })
                ]
              }),

              // Step Navigation Controls
              e.jsxs("div", {
                className: "pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      e.jsxs("button", {
                        disabled: currentQIndex === 0,
                        onClick: () => setCurrentQIndex(prev => Math.max(0, prev - 1)),
                        className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
                        children: [e.jsx("i", { className: "fa-solid fa-chevron-left" }), e.jsx("span", { children: "សំណួរមុន" })]
                      }),
                      e.jsxs("button", {
                        disabled: currentQIndex === qcmList.length - 1,
                        onClick: () => setCurrentQIndex(prev => Math.min(qcmList.length - 1, prev + 1)),
                        className: "px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
                        children: [e.jsx("span", { children: "សំណួរបន្ទាប់" }), e.jsx("i", { className: "fa-solid fa-chevron-right" })]
                      })
                    ]
                  }),
                  e.jsx("div", {
                    className: "flex items-center gap-2",
                    children: e.jsxs("button", {
                      onClick: () => setUserAnswers({}),
                      className: "px-3.5 py-2 bg-white hover:bg-slate-50 active:scale-95 text-rose-600 text-xs font-semibold rounded-xl transition border border-rose-200 flex items-center gap-1.5 shadow-xs cursor-pointer",
                      children: [e.jsx("i", { className: "fa-solid fa-rotate-left" }), e.jsx("span", { children: "ចាប់ផ្តើមឡើងវិញ" })]
                    })
                  })
                ]
              }),

              // Quick Navigator Grid
              e.jsxs("div", {
                className: "pt-5 border-t border-slate-100 space-y-2",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [
                      e.jsx("span", { className: "text-xs font-semibold text-slate-600", children: "រំលងទៅកាន់សំណួរជាក់លាក់៖" }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 text-[11px] text-slate-500",
                        children: [
                          e.jsxs("span", { className: "flex items-center gap-1", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" }), " ត្រូវ"] }),
                          e.jsxs("span", { className: "flex items-center gap-1", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" }), " ខុស"] }),
                          e.jsxs("span", { className: "flex items-center gap-1", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" }), " មិនទាន់ឆ្លើយ"] })
                        ]
                      })
                    ]
                  }),
                  e.jsx("div", {
                    className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5",
                    children: qcmList.map((item, idx) => {
                      const isAns = userAnswers[idx] !== undefined;
                      const isRight = isAns && item.opts[userAnswers[idx]]?.c;
                      let bg = "bg-slate-100 text-slate-700 hover:bg-slate-200";
                      if (isAns) bg = isRight ? "bg-emerald-600 text-white font-semibold" : "bg-rose-500 text-white font-semibold";
                      const ring = idx === currentQIndex ? "ring-2 ring-amber-500 font-bold" : "";

                      return e.jsx("button", {
                        onClick: () => setCurrentQIndex(idx),
                        className: "w-full py-1.5 rounded-lg text-xs font-mono transition text-center cursor-pointer " + bg + " " + ring,
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

fs.writeFileSync('scripts/rz15_component_code.js', rz15Code, 'utf8');
console.log("Saved scripts/rz15_component_code.js successfully!");
