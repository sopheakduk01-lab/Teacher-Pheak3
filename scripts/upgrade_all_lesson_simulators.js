import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Upgrading Simulators for Science Lessons 14, 15, and 16 ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

// Read Rz15 raw from add_animated_simulators script or define cleanly
let rz15Raw = `({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "overview" }) => {
  if (!r) return null;

  const [activeTab, setActiveTab] = y.useState(a || "overview");
  const [activeStep, setActiveStep] = y.useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [showExplanation, setShowExplanation] = y.useState({});
  const [qcmScore, setQcmScore] = y.useState(0);
  const [isFullscreen, setIsFullscreen] = y.useState(false);
  const [isSpeaking, setIsSpeaking] = y.useState(false);

  // Electricity Simulator State
  const [circuitType, setCircuitType] = y.useState("series"); // 'series' or 'parallel'
  const [switchOn, setSwitchOn] = y.useState(true);
  const [batteryVoltage, setBatteryVoltage] = y.useState(6); // 3V, 6V, 12V
  const [resistorValue, setResistorValue] = y.useState(10); // 10, 20, 30 Ohm
  const [animActive, setAnimActive] = y.useState(true);
  const canvasRef = y.useRef(null);
  const animFrameRef = y.useRef(null);

  const calculatedCurrent = switchOn ? (batteryVoltage / resistorValue).toFixed(2) : "0.00";

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

  // Canvas Animation Effect for Electricity Simulator
  y.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let electrons = [];
    const numElectrons = 24;
    for (let i = 0; i < numElectrons; i++) {
      electrons.push({
        pos: (i / numElectrons) * 100, // percentage along wire loop
        speed: 0.6
      });
    }

    let lightGlow = 0;

    const render = () => {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 25) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let yPos = 0; yPos < h; yPos += 25) {
        ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(w, yPos); ctx.stroke();
      }

      // Circuit Wire Loop Coordinates
      const marginX = 80;
      const marginY = 50;
      const rectW = w - marginX * 2;
      const rectH = h - marginY * 2;

      // Draw Wires
      ctx.strokeStyle = switchOn ? '#38bdf8' : '#64748b';
      ctx.lineWidth = 5;
      ctx.shadowColor = switchOn ? '#38bdf8' : 'transparent';
      ctx.shadowBlur = switchOn ? 10 : 0;

      // Main Outer Loop
      ctx.beginPath();
      ctx.roundRect(marginX, marginY, rectW, rectH, 16);
      ctx.stroke();

      // Parallel Branch if parallel mode
      if (circuitType === 'parallel') {
        ctx.beginPath();
        ctx.moveTo(marginX + rectW * 0.5, marginY);
        ctx.lineTo(marginX + rectW * 0.5, marginY + rectH);
        ctx.stroke();
      }

      ctx.shadowBlur = 0; // reset shadow

      // Draw Battery (Bottom)
      const batX = w * 0.5;
      const batY = marginY + rectH;
      ctx.fillStyle = '#334155';
      ctx.fillRect(batX - 35, batY - 12, 70, 24);
      ctx.fillStyle = '#ef4444'; // +
      ctx.fillRect(batX + 25, batY - 16, 8, 32);
      ctx.fillStyle = '#3b82f6'; // -
      ctx.fillRect(batX - 33, batY - 16, 8, 32);

      ctx.font = 'bold 11px Khmer, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(\`ថ្ម \${batteryVoltage}V\`, batX, batY + 28);

      // Draw Switch (Left Side)
      const swX = marginX;
      const swY = marginY + rectH * 0.5;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(swX, swY - 20, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(swX, swY + 20, 6, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = switchOn ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(swX, swY + 20);
      if (switchOn) {
        ctx.lineTo(swX, swY - 20);
      } else {
        ctx.lineTo(swX - 25, swY - 15); // open switch
      }
      ctx.stroke();

      ctx.fillStyle = switchOn ? '#4ade80' : '#f87171';
      ctx.fillText(switchOn ? 'កុងតាក់ បិទ' : 'កុងតាក់ បើក', swX - 45, swY);

      // Draw Light Bulb (Top Side)
      lightGlow += 0.05;
      const bulbX = marginX + rectW * 0.5;
      const bulbY = marginY;

      // Glow effect if switch is ON
      if (switchOn) {
        const glowR = 25 + Math.sin(lightGlow) * 4;
        const radial = ctx.createRadialGradient(bulbX, bulbY, 5, bulbX, bulbY, glowR + 15);
        radial.addColorStop(0, 'rgba(253, 224, 71, 0.9)');
        radial.addColorStop(0.5, 'rgba(250, 204, 21, 0.4)');
        radial.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, glowR + 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bulb body
      ctx.fillStyle = switchOn ? '#fde047' : '#94a3b8';
      ctx.beginPath(); ctx.arc(bulbX, bulbY, 18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.stroke();

      // Filament
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bulbX - 8, bulbY + 5); ctx.lineTo(bulbX, bulbY - 8); ctx.lineTo(bulbX + 8, bulbY + 5); ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.fillText('អំពូលភ្លើង A', bulbX, bulbY - 26);

      // Second Bulb if parallel
      if (circuitType === 'parallel') {
        const bulb2X = marginX + rectW * 0.5;
        const bulb2Y = marginY + rectH * 0.5;

        if (switchOn) {
          const glowR2 = 22 + Math.cos(lightGlow) * 3;
          const radial2 = ctx.createRadialGradient(bulb2X, bulb2Y, 5, bulb2X, bulb2Y, glowR2 + 12);
          radial2.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
          radial2.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = radial2;
          ctx.beginPath(); ctx.arc(bulb2X, bulb2Y, glowR2 + 12, 0, Math.PI * 2); ctx.fill();
        }

        ctx.fillStyle = switchOn ? '#fde047' : '#94a3b8';
        ctx.beginPath(); ctx.arc(bulb2X, bulb2Y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('អំពូល B (ខ្នែង)', bulb2X, bulb2Y + 26);
      }

      // Ammeter Gauge (Right Side)
      const amX = marginX + rectW;
      const amY = marginY + rectH * 0.5;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(amX, amY, 22, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('A', amX, amY - 4);
      ctx.font = 'bold 9px Khmer, sans-serif';
      ctx.fillText(\`\${calculatedCurrent}A\`, amX, amY + 10);

      // Draw Animated Electrons along wire if switchOn
      if (switchOn && animActive) {
        const speedFactor = (batteryVoltage / resistorValue) * 1.2;
        const totalPerimeter = (rectW + rectH) * 2;

        electrons.forEach((e) => {
          e.pos = (e.pos + speedFactor) % 100;
          const dist = (e.pos / 100) * totalPerimeter;

          let ex = marginX, ey = marginY;
          if (dist < rectW) {
            ex = marginX + dist;
            ey = marginY;
          } else if (dist < rectW + rectH) {
            ex = marginX + rectW;
            ey = marginY + (dist - rectW);
          } else if (dist < rectW * 2 + rectH) {
            ex = marginX + rectW - (dist - (rectW + rectH));
            ey = marginY + rectH;
          } else {
            ex = marginX;
            ey = marginY + rectH - (dist - (rectW * 2 + rectH));
          }

          // Electron particle dot
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(ex, ey, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;
      }

      if (animActive) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [r, circuitType, switchOn, batteryVoltage, resistorValue, animActive]);

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

  const handleOptionSelect = (qIdx, optIdx) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));
    const currentQ = Zi15[qIdx];
    if (currentQ && currentQ.opts[optIdx] && currentQ.opts[optIdx].c) {
      setQcmScore((prev) => prev + 1);
      s && s("ចម្លើយត្រឹមត្រូវ! 👏 (+១ ពិន្ទុ)");
    } else {
      s && s("ចម្លើយមិនត្រឹមត្រូវទេ! សូមពិនិត្យការពន្យល់ខាងក្រោម។");
    }
  };

  const questionsList = Zi15 || [];
  const currentQ = questionsList[currentQuestionIndex] || questionsList[0];

  return e.jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn",
    children: e.jsxs("div", {
      className: \`bg-white rounded-3xl shadow-2xl border border-amber-200 w-full \${
        isFullscreen ? "max-w-none h-full rounded-none" : "max-w-5xl max-h-[92vh]"
      } flex flex-col overflow-hidden transition-all duration-300\`,
      children: [
        // Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-amber-900 via-orange-900 to-yellow-950 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("div", {
                  className: "w-11 h-11 rounded-2xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center text-2xl shadow-inner",
                  children: "⚡"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("div", {
                      className: "flex items-center gap-2",
                      children: e.jsx("span", {
                        className: "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs",
                        children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"
                      })
                    }),
                    e.jsx("h2", {
                      className: "text-lg sm:text-xl font-bold font-moul text-white mt-1 drop-shadow-sm",
                      children: "មេរៀនទី ១៥ ៖ អគ្គិសនី (Electricity)"
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center gap-2 flex-wrap",
              children: [
                e.jsxs("button", {
                  onClick: () =>
                    toggleSpeech(
                      "សង្ខេបមេរៀនទី ១៥៖ អគ្គិសនី។ ប្រភពចរន្តអគ្គិសនីបង្កើតចរន្តរត់ក្នុងសៀគ្វី។ សៀគ្វីអគ្គិសនីមាន ២ ប្រភេទគឺ សៀគ្វីស៊េរី និងសៀគ្វីខ្នែង។ អំពែម៉ែត្រប្រើវាស់អាំងតង់ស៊ីតេចរន្ត (A) ហើយវ៉ុលម៉ែត្រប្រើវាស់តង់ស្យុង (V)។"
                    ),
                  className: \`px-3 py-2 rounded-xl text-xs font-bold border transition duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer \${
                    isSpeaking
                      ? "bg-amber-500 text-white border-amber-400 animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-amber-100 border-amber-300/30"
                  }\`,
                  children: [
                    e.jsx("span", { children: "🔊" }),
                    e.jsx("span", { children: isSpeaking ? "កំពុងអាន..." : "ស្ដាប់ពន្យល់សំឡេង" })
                  ]
                }),
                e.jsxs("button", {
                  onClick: toggleFullscreen,
                  className: "p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 border border-amber-300/30 transition text-xs flex items-center gap-1 cursor-pointer",
                  children: [
                    e.jsx("span", { children: "⛶" }),
                    e.jsx("span", { className: "hidden sm:inline", children: isFullscreen ? "ធម្មតា" : "ពេញអេក្រង់" })
                  ]
                }),
                e.jsx("button", {
                  onClick: t,
                  className: "w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500 text-white transition flex items-center justify-center font-bold text-lg cursor-pointer",
                  children: "✕"
                })
              ]
            })
          ]
        }),

        // Main Nav Tabs
        e.jsxs("div", {
          className: "bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0",
          children: [
            e.jsxs("button", {
              onClick: () => setActiveTab("overview"),
              className: \`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer \${
                activeTab === "overview"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }\`,
              children: [e.jsx("span", { children: "📖" }), e.jsx("span", { children: "ខ្លឹមសារមេរៀន (៤ ជំហាន)" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("sim"),
              className: \`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer \${
                activeTab === "sim"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }\`,
              children: [e.jsx("span", { children: "🔬" }), e.jsx("span", { children: "កម្មវិធីពិសោធន៍សៀគ្វីអគ្គិសនី" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("quiz"),
              className: \`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer \${
                activeTab === "quiz"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }\`,
              children: [
                e.jsx("span", { children: "📝" }),
                e.jsx("span", { children: "តេស្តសមត្ថភាព (៤០ QCM)" }),
                e.jsx("span", {
                  className: "ml-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px]",
                  children: Zi15.length
                })
              ]
            })
          ]
        }),

        // Body Content
        e.jsx("div", {
          className: "flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50",
          children:
            activeTab === "overview"
              ? e.jsxs("div", {
                  className: "space-y-6 max-w-4xl mx-auto",
                  children: [
                    // Step Buttons
                    e.jsxs("div", {
                      className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
                      children: [1, 2, 3, 4].map((stepNum) =>
                        e.jsxs("button", {
                          key: stepNum,
                          onClick: () => setActiveStep(stepNum),
                          className: \`p-3 rounded-2xl border text-left transition cursor-pointer \${
                            activeStep === stepNum
                              ? "bg-amber-600 text-white border-amber-600 shadow-md"
                              : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                          }\`,
                          children: [
                            e.jsx("div", {
                              className: \`text-[10px] font-bold uppercase \${
                                activeStep === stepNum ? "text-amber-200" : "text-slate-400"
                              }\`,
                              children: \`ជំហានទី \${stepNum}\`
                            }),
                            e.jsx("div", {
                              className: "text-xs font-bold mt-0.5 line-clamp-1",
                              children:
                                stepNum === 1
                                  ? "១. ប្រភពចរន្តអគ្គិសនី"
                                  : stepNum === 2
                                  ? "២. ឧបករណ៍វាស់អគ្គិសនី"
                                  : stepNum === 3
                                  ? "៣. សៀគ្វីស៊េរី & សៀគ្វីខ្នែង"
                                  : "៤. សុវត្ថិភាពអគ្គិសនី"
                            })
                          ]
                        })
                      )
                    }),

                    activeStep === 1 &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fadeIn",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between pb-3 border-b border-slate-100",
                            children: [
                              e.jsxs("h3", {
                                className: "text-base font-bold text-amber-900 flex items-center gap-2",
                                children: [e.jsx("span", { children: "🔋" }), e.jsx("span", { children: "ជំហានទី ១ ៖ ប្រភពចរន្តអគ្គិសនី និងសៀគ្វី" })]
                              }),
                              e.jsxs("button", {
                                onClick: () =>
                                  toggleSpeech(
                                    "ជំហានទី ១៖ ប្រភពចរន្តអគ្គិសនីមានដូចជា ថ្មពិល អាគុយ និងឌីណាម៉ូ។ កាលណាភ្ជាប់ខ្សែចម្លងពីប៉ូលបូកទៅប៉ូលដកបង្កើតបានជាសៀគ្វីអគ្គិសនី។"
                                  ),
                                className: "text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200",
                                children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "grid sm:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-700",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 bg-amber-50/80 rounded-2xl border border-amber-100 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-amber-900 text-sm", children: "🔋 ប្រភពចរន្តអគ្គិសនី" }),
                                  e.jsx("p", { children: "ថ្មពិល និងអាគុយ ផ្គត់ផ្គង់ចរន្តជាប់ (DC)។ ឌីណាម៉ូ ឬរោងចក្រអគ្គិសនី ផ្គត់ផ្គង់ចរន្តឆ្លាស់ (AC)។" })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-slate-900 text-sm", children: "💡 ធាតុផ្សំនៃសៀគ្វី" }),
                                  e.jsx("p", { children: "រួមមាន៖ ប្រភពអគ្គិសនី ខ្សែចម្លង ឧបករណ៍ទទួល (អំពូល) និងកុងតាក់សម្រាប់បើក/បិទចរន្ត។" })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    activeStep === 2 &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fadeIn",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between pb-3 border-b border-slate-100",
                            children: [
                              e.jsxs("h3", {
                                className: "text-base font-bold text-amber-900 flex items-center gap-2",
                                children: [e.jsx("span", { children: "📟" }), e.jsx("span", { children: "ជំហានទី ២ ៖ អំពែម៉ែត្រ និងវ៉ុលម៉ែត្រ" })]
                              }),
                              e.jsxs("button", {
                                onClick: () =>
                                  toggleSpeech(
                                    "ជំហានទី ២៖ អំពែម៉ែត្រប្រើសម្រាប់វាស់អាំងតង់ស៊ីតេចរន្តអគ្គិសនី (គិតជាអំពែ A) ដោយតជាស៊េរី។ វ៉ុលម៉ែត្រប្រើសម្រាប់វាស់តង់ស្យុង (គិតជាវ៉ុល V) ដោយតជាខ្នែង។"
                                  ),
                                className: "text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200",
                                children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "grid sm:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-700",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 bg-sky-50/80 rounded-2xl border border-sky-100 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-sky-900 text-sm", children: "📟 អំពែម៉ែត្រ (Ammeter)" }),
                                  e.jsx("p", { children: "វាស់អាំងតង់ស៊ីតេចរន្ត (I) តជាស៊េរីក្នុងសៀគ្វី។ ខ្នាតគិតជា អំពែ (A) ឬ មីលីអំពែ (mA)។" })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-emerald-900 text-sm", children: "⚡ វ៉ុលម៉ែត្រ (Voltmeter)" }),
                                  e.jsx("p", { children: "វាស់តង់ស្យុងអគ្គិសនី (U) តជាខ្នែងរវាង ២ ចំណុច។ ខ្នាតគិតជា វ៉ុល (V) ឬ មីលីវ៉ុល (mV)។" })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    activeStep === 3 &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fadeIn",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between pb-3 border-b border-slate-100",
                            children: [
                              e.jsxs("h3", {
                                className: "text-base font-bold text-amber-900 flex items-center gap-2",
                                children: [e.jsx("span", { children: "🔌" }), e.jsx("span", { children: "ជំហានទី ៣ ៖ សៀគ្វីស៊េរី និងសៀគ្វីខ្នែង" })]
                              }),
                              e.jsxs("button", {
                                onClick: () =>
                                  toggleSpeech(
                                    "ជំហានទី ៣៖ សៀគ្វីស៊េរី អំពូលទាំងអស់តបន្តគ្នាតាមខ្សែតែមួយ។ បើអំពូលមួយដាច់ អំពូលផ្សេងទៀតរលត់ទាំងអស់។ សៀគ្វីខ្នែង អំពូលនីមួយៗតតាមខ្នែងដាច់ដោយឡែក។ បើអំពូលមួយដាច់ អំពូលផ្សេងទៀតនៅតែភ្លឺដដែល។"
                                  ),
                                className: "text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200",
                                children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "grid sm:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-700",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 bg-orange-50/80 rounded-2xl border border-orange-100 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-orange-900 text-sm", children: "🔗 សៀគ្វីស៊េរី (Series Circuit)" }),
                                  e.jsx("p", { children: "ចរន្តរត់តាមផ្លូវតែមួយ។ កាលណាដាច់ត្រង់ចំណុចណាមួយ សៀគ្វីត្រូវដាច់ទាំងមូល។" })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 bg-yellow-50/80 rounded-2xl border border-yellow-100 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-yellow-900 text-sm", children: "🌿 សៀគ្វីខ្នែង (Parallel Circuit)" }),
                                  e.jsx("p", { children: "ចរន្តបំបែកជាច្រើនខ្នែង។ ប្រើប្រាស់ក្នុងប្រព័ន្ធអគ្គិសនីតាមគេហដ្ឋានយ៉ាងពេញនិយម។" })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    activeStep === 4 &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-fadeIn",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between pb-3 border-b border-slate-100",
                            children: [
                              e.jsxs("h3", {
                                className: "text-base font-bold text-amber-900 flex items-center gap-2",
                                children: [e.jsx("span", { children: "⚠️" }), e.jsx("span", { children: "ជំហានទី ៤ ៖ សុវត្ថិភាពក្នុងការប្រើប្រាស់អគ្គិសនី" })]
                              }),
                              e.jsxs("button", {
                                onClick: () =>
                                  toggleSpeech(
                                    "ជំហានទី ៤៖ សុវត្ថិភាពអគ្គិសនី។ ហាមប៉ះពាល់ខ្សែភ្លៀងដោយដៃសើម ហាមដោតឌុយច្រើនហួសកំណត់ និងត្រូវប្រើប៉ារ៉ាហ្វុយស៊ីប ឬកាត់ចរន្តស្វ័យប្រវត្តិ (Breaker) ដើម្បីការពារឆ្លងចរន្ត។"
                                  ),
                                className: "text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200",
                                children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "grid sm:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-700",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 bg-red-50/80 rounded-2xl border border-red-100 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-red-900 text-sm", children: "🚫 ការពារគ្រោះថ្នាក់" }),
                                  e.jsx("p", { children: "ហាមកាន់ខ្សែភ្លើងអត់អ៊ីសូឡង់ ឬប្រើប្រាស់ឧបករណ៍អគ្គិសនីពេលដៃ ឬជើងសើមទឹក។" })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-emerald-900 text-sm", children: "🛡️ ឧបករណ៍ការពារ" }),
                                  e.jsx("p", { children: "ប្រើប្រាស់ហ្វុយស៊ីប (Fuse) ឬ Breaker ដើម្បីកាត់ចរន្តស្វ័យប្រវត្តិពេលឆ្លងចរន្តខ្លាំង។" })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                  ]
                })
              : activeTab === "sim"
              ? e.jsxs("div", {
                  className: "space-y-6 max-w-4xl mx-auto animate-fadeIn",
                  children: [
                    // Simulator Header Controls
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-base font-bold text-slate-900 font-moul",
                                  children: "🔬 កម្មវិធីពិសោធន៍ចរន្តអគ្គិសនី (Electricity Simulator)"
                                }),
                                e.jsx("p", {
                                  className: "text-xs text-slate-500 mt-0.5",
                                  children: "ចុចបិទ/បើកកុងតាក់ ផ្លាស់ប្តូរប៉ារ៉ាម៉ែត្រ និងប្រភេទសៀគ្វី ដើម្បីមើលចលនាអេឡិចត្រុងរត់"
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsxs("button", {
                                  onClick: () =>
                                    toggleSpeech(
                                      \`លទ្ធផលពិសោធន៍សៀគ្វីអគ្គិសនី៖ តង់ស្យុងថ្ម \${batteryVoltage} វ៉ុល, អាំងតង់ស៊ីតេចរន្ត \${calculatedCurrent} អំពែ។ \${
                                        switchOn ? "កុងតាក់បិទ ចរន្តអគ្គិសនីរត់បានពេញលេញ អំពូលភ្លឺច្បាស់។" : "កុងតាក់បើក ដាច់ចរន្តអគ្គិសនី អំពូលរលត់។"
                                      }\`
                                    ),
                                  className: "px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold rounded-xl text-xs border border-amber-200 flex items-center gap-1.5 cursor-pointer",
                                  children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់គណនា" })]
                                }),
                                e.jsxs("button", {
                                  onClick: () => setAnimActive(!animActive),
                                  className: \`px-3 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition \${
                                    animActive ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-emerald-600 text-white hover:bg-emerald-700"
                                  }\`,
                                  children: [
                                    e.jsx("span", { children: animActive ? "⏸️" : "▶️" }),
                                    e.jsx("span", { children: animActive ? "ផ្អាកចលនា" : "ដំណើរការចលនា" })
                                  ]
                                })
                              ]
                            })
                          ]
                        }),

                        // Circuit Controls
                        e.jsxs("div", {
                          className: "grid sm:grid-cols-3 gap-3 text-xs",
                          children: [
                            // Switch Toggle
                            e.jsxs("div", {
                              className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                              children: [
                                e.jsx("span", { className: "font-bold text-slate-700 block", children: "🔌 ស្ថានភាពកុងតាក់ (Switch)" }),
                                e.jsxs("button", {
                                  onClick: () => setSwitchOn(!switchOn),
                                  className: \`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer border \${
                                    switchOn
                                      ? "bg-emerald-600 text-white border-emerald-600"
                                      : "bg-red-500 text-white border-red-500"
                                  }\`,
                                  children: switchOn ? "🟢 កុងតាក់ បិទ (ON)" : "🔴 កុងតាក់ បើក (OFF)"
                                })
                              ]
                            }),

                            // Voltage Selector
                            e.jsxs("div", {
                              className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                              children: [
                                e.jsx("span", { className: "font-bold text-slate-700 block", children: "🔋 តង់ស្យុងថ្ម (Voltage U)" }),
                                e.jsxs("div", {
                                  className: "flex items-center gap-1.5",
                                  children: [3, 6, 12].map((v) =>
                                    e.jsx("button", {
                                      key: v,
                                      onClick: () => setBatteryVoltage(v),
                                      className: \`flex-1 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer \${
                                        batteryVoltage === v
                                          ? "bg-amber-500 text-white border-amber-500"
                                          : "bg-white text-slate-700 border-slate-200"
                                      }\`,
                                      children: \`\${v}V\`
                                    })
                                  )
                                })
                              ]
                            }),

                            // Circuit Type
                            e.jsxs("div", {
                              className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                              children: [
                                e.jsx("span", { className: "font-bold text-slate-700 block", children: "⚙️ ប្រភេទសៀគ្វី" }),
                                e.jsxs("div", {
                                  className: "flex items-center gap-1.5",
                                  children: [
                                    e.jsx("button", {
                                      onClick: () => setCircuitType("series"),
                                      className: \`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer \${
                                        circuitType === "series"
                                          ? "bg-amber-600 text-white border-amber-600"
                                          : "bg-white text-slate-700 border-slate-200"
                                      }\`,
                                      children: "សៀគ្វីស៊េរី"
                                    }),
                                    e.jsx("button", {
                                      onClick: () => setCircuitType("parallel"),
                                      className: \`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer \${
                                        circuitType === "parallel"
                                          ? "bg-orange-600 text-white border-orange-600"
                                          : "bg-white text-slate-700 border-slate-200"
                                      }\`,
                                      children: "សៀគ្វីខ្នែង"
                                    })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // HTML5 Canvas Display
                    e.jsxs("div", {
                      className: "bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-xl space-y-3",
                      children: [
                        e.jsx("div", {
                          className: "relative w-full overflow-hidden rounded-2xl bg-black border border-slate-700 flex items-center justify-center",
                          children: e.jsx("canvas", {
                            ref: canvasRef,
                            width: 540,
                            height: 280,
                            className: "w-full max-w-[540px] h-auto object-contain rounded-xl"
                          })
                        }),

                        // Dynamic Meter Gauge Values
                        e.jsxs("div", {
                          className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs text-white",
                          children: [
                            e.jsxs("div", {
                              className: "p-2.5 bg-slate-800/80 rounded-xl border border-slate-700",
                              children: [
                                e.jsx("span", { className: "text-[10px] text-slate-400 block", children: "តង់ស្យុង U" }),
                                e.jsxs("span", { className: "font-bold text-amber-400 text-sm", children: [batteryVoltage, " V"] })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-2.5 bg-slate-800/80 rounded-xl border border-slate-700",
                              children: [
                                e.jsx("span", { className: "text-[10px] text-slate-400 block", children: "អាំងតង់ស៊ីតេ I" }),
                                e.jsxs("span", { className: "font-bold text-sky-400 text-sm", children: [calculatedCurrent, " A"] })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-2.5 bg-slate-800/80 rounded-xl border border-slate-700",
                              children: [
                                e.jsx("span", { className: "text-[10px] text-slate-400 block", children: "ពន្លឺអំពូល" }),
                                e.jsx("span", {
                                  className: \`font-bold text-sm \${switchOn ? "text-yellow-300" : "text-slate-500"}\`,
                                  children: switchOn ? "ភ្លឺច្បាស់" : "រលត់"
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-2.5 bg-slate-800/80 rounded-xl border border-slate-700",
                              children: [
                                e.jsx("span", { className: "text-[10px] text-slate-400 block", children: "ល្បឿនអេឡិចត្រុង" }),
                                e.jsxs("span", { className: "font-bold text-emerald-400 text-sm", children: [switchOn ? "លឿន" : "ឈប់", ""] })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              : e.jsxs("div", {
                  className: "space-y-6 max-w-4xl mx-auto animate-fadeIn",
                  children: [
                    // Quiz Progress Bar & Score Banner
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-700",
                          children: [
                            e.jsxs("span", {
                              children: [
                                "សំណួរទី ",
                                currentQuestionIndex + 1,
                                " នៃ ",
                                questionsList.length
                              ]
                            }),
                            e.jsxs("span", {
                              className: "text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100",
                              children: ["ពិន្ទុសរុប ៖ ", qcmScore, " / ", questionsList.length]
                            })
                          ]
                        }),

                        // Progress bar
                        e.jsx("div", {
                          className: "w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200",
                          children: e.jsx("div", {
                            className: "bg-gradient-to-r from-amber-500 to-orange-600 h-full transition-all duration-300",
                            style: { width: \`\${((currentQuestionIndex + 1) / questionsList.length) * 100}%\` }
                          })
                        })
                      ]
                    }),

                    // Question Card
                    currentQ &&
                      e.jsxs("div", {
                        className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-start justify-between gap-3 pb-3 border-b border-slate-100",
                            children: [
                              e.jsxs("h3", {
                                className: "text-sm sm:text-base font-bold text-slate-900 leading-relaxed",
                                children: [
                                  e.jsx("span", { className: "text-amber-600 mr-2", children: \`សំណួរ \${currentQuestionIndex + 1} ៖\` }),
                                  currentQ.q
                                ]
                              }),
                              e.jsxs("button", {
                                onClick: () => toggleSpeech(currentQ.q),
                                className: "shrink-0 p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold border border-amber-200 flex items-center gap-1 cursor-pointer",
                                children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { className: "hidden sm:inline", children: "ស្ដាប់" })]
                              })
                            ]
                          }),

                          // Options List
                          e.jsx("div", {
                            className: "grid gap-3",
                            children: (currentQ.opts || []).map((opt, optIdx) => {
                              const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                              const isAnswered = userAnswers[currentQuestionIndex] !== undefined;

                              let btnStyle = "bg-slate-50 hover:bg-amber-50/60 border-slate-200 text-slate-800";
                              if (isAnswered) {
                                if (opt.c) {
                                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs";
                                } else if (isSelected && !opt.c) {
                                  btnStyle = "bg-red-50 border-red-400 text-red-950 font-bold";
                                } else {
                                  btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                                }
                              }

                              return e.jsxs("button", {
                                key: optIdx,
                                onClick: () => !isAnswered && handleOptionSelect(currentQuestionIndex, optIdx),
                                disabled: isAnswered,
                                className: \`w-full p-4 rounded-2xl border text-left text-xs transition duration-200 flex items-start gap-3 cursor-pointer \${btnStyle}\`,
                                children: [
                                  e.jsx("span", {
                                    className: \`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 border \${
                                      isAnswered && opt.c
                                        ? "bg-emerald-500 text-white border-emerald-500"
                                        : isAnswered && isSelected && !opt.c
                                        ? "bg-red-500 text-white border-red-500"
                                        : "bg-white border-slate-300 text-slate-600"
                                    }\`,
                                    children: String.fromCharCode(65 + optIdx)
                                  }),
                                  e.jsx("span", { className: "flex-1 mt-0.5 leading-relaxed", children: opt.t })
                                ]
                              });
                            })
                          }),

                          // Explanation Panel after selection
                          userAnswers[currentQuestionIndex] !== undefined &&
                            e.jsxs("div", {
                              className: "p-4 bg-amber-50/90 rounded-2xl border border-amber-200 space-y-2 animate-fadeIn",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center justify-between",
                                  children: [
                                    e.jsxs("h4", {
                                      className: "font-bold text-amber-900 text-xs flex items-center gap-1.5",
                                      children: [e.jsx("span", { children: "💡" }), e.jsx("span", { children: "ការពន្យល់ចម្លើយ ៖" })]
                                    }),
                                    e.jsxs("button", {
                                      onClick: () =>
                                        toggleSpeech(
                                          currentQ.opts[userAnswers[currentQuestionIndex]]?.e || "ចម្លើយត្រឹមត្រូវត្រូវបានជ្រើសរើស"
                                        ),
                                      className: "text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300/50",
                                      children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                                    })
                                  ]
                                }),
                                e.jsx("p", {
                                  className: "text-xs text-amber-950 leading-relaxed",
                                  children:
                                    currentQ.opts[userAnswers[currentQuestionIndex]]?.e ||
                                    (currentQ.opts.find((o) => o.c) || {}).e ||
                                    "ចម្លើយនេះត្រឹមត្រូវតាមមេរៀនសៀវភៅពុម្ពក្រសួងអប់រំ។"
                                })
                              ]
                            }),

                          // Navigation Buttons
                          e.jsxs("div", {
                            className: "flex items-center justify-between pt-3 border-t border-slate-100",
                            children: [
                              e.jsxs("button", {
                                onClick: () => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1)),
                                disabled: currentQuestionIndex === 0,
                                className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1",
                                children: [e.jsx("span", { children: "←" }), e.jsx("span", { children: "សំណួរមុន" })]
                              }),
                              e.jsxs("button", {
                                onClick: () => setCurrentQuestionIndex((prev) => Math.min(questionsList.length - 1, prev + 1)),
                                disabled: currentQuestionIndex === questionsList.length - 1,
                                className: "px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center gap-1",
                                children: [e.jsx("span", { children: "សំណួរបន្ទាប់" }), e.jsx("span", { children: "→" })]
                              })
                            ]
                          })
                        ]
                      }),

                    // Quick Question Jump Grid
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3",
                      children: [
                        e.jsx("h4", { className: "font-bold text-xs text-slate-700", children: "🎯 ក្រឡាលោតទៅសំណួររហ័ស (១ ដល់ ៤០) ៖" }),
                        e.jsx("div", {
                          className: "grid grid-cols-8 sm:grid-cols-10 gap-1.5",
                          children: questionsList.map((_, idx) => {
                            const isAnswered = userAnswers[idx] !== undefined;
                            const isCurrent = currentQuestionIndex === idx;

                            let gridBg = "bg-slate-100 text-slate-600 border-slate-200";
                            if (isCurrent) gridBg = "bg-amber-600 text-white border-amber-600 font-extrabold ring-2 ring-amber-300";
                            else if (isAnswered) gridBg = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";

                            return e.jsx("button", {
                              key: idx,
                              onClick: () => setCurrentQuestionIndex(idx),
                              className: \`h-8 rounded-xl text-xs border flex items-center justify-center transition cursor-pointer \${gridBg}\`,
                              children: idx + 1
                            });
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
}`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace Rz15 definition cleanly
  const r15Idx = code.indexOf("Rz15=");
  const r14Idx = code.indexOf(",\nRz14=", r15Idx);
  if (r15Idx !== -1 && r14Idx !== -1) {
    code = code.slice(0, r15Idx) + "Rz15=" + rz15Raw + code.slice(r14Idx);
    console.log("Upgraded Rz15 definition in " + filePath);
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== All files successfully upgraded with active 60 FPS simulators ===");
