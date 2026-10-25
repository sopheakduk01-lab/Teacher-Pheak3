var Rz16 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "overview" }) => {
  if (!r) return null;

  const [activeTab, setActiveTab] = y.useState(a || "overview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [showExplanation, setShowExplanation] = y.useState({});
  const [qcmScore, setQcmScore] = y.useState(0);
  const [isFullscreen, setIsFullscreen] = y.useState(false);
  const [isSpeaking, setIsSpeaking] = y.useState(false);

  // Weather & Climate Simulator State
  const [simMode, setSimMode] = y.useState("wind_thermal"); // 'wind_thermal' or 'clouds_rain'
  const [sunHot, setSunHot] = y.useState(true);
  const [selectedCloud, setSelectedCloud] = y.useState("cumulus"); // 'cirrus', 'wind_cloud', 'wave_cloud', 'cumulus'
  const [selectedSeason, setSelectedSeason] = y.useState("rainy"); // 'rainy' or 'dry'
  const [animActive, setAnimActive] = y.useState(true);
  const canvasRef = y.useRef(null);
  const animFrameRef = y.useRef(null);

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

  // Canvas Animation Effect for Weather Simulator
  y.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles = [];
    let rainDrops = [];
    const numParticles = 35;
    const numRain = 60;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * 200 + 40,
        y: Math.random() * 180 + 40,
        speed: Math.random() * 1.5 + 1,
        radius: Math.random() * 3 + 2,
        type: Math.random() > 0.5 ? 'warm' : 'cold',
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    for (let i = 0; i < numRain; i++) {
      rainDrops.push({
        x: Math.random() * 500 + 10,
        y: Math.random() * 220,
        speed: Math.random() * 4 + 3,
        len: Math.random() * 10 + 8
      });
    }

    let cloudX = 100;
    let sunPulse = 0;

    const render = () => {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      const isRainy = selectedSeason === 'rainy' || selectedCloud === 'cumulus';
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.75);
      if (isRainy) {
        skyGrad.addColorStop(0, '#1e293b');
        skyGrad.addColorStop(0.6, '#334155');
        skyGrad.addColorStop(1, '#475569');
      } else {
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.6, '#38bdf8');
        skyGrad.addColorStop(1, '#7dd3fc');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.75);

      // Land & Water
      const landGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
      landGrad.addColorStop(0, '#16a34a');
      landGrad.addColorStop(1, '#14532d');
      ctx.fillStyle = landGrad;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.7);
      ctx.quadraticCurveTo(w * 0.25, h * 0.65, w * 0.5, h * 0.72);
      ctx.lineTo(w * 0.5, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Mountains
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(10, h * 0.7);
      ctx.lineTo(60, h * 0.45);
      ctx.lineTo(110, h * 0.7);
      ctx.fill();

      // Ocean
      const seaGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
      seaGrad.addColorStop(0, '#0284c7');
      seaGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = seaGrad;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.72);
      ctx.lineTo(w, h * 0.72);
      ctx.lineTo(w, h);
      ctx.lineTo(w * 0.5, h);
      ctx.closePath();
      ctx.fill();

      // Waves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      const waveOffset = (Date.now() / 200) % 20;
      for (let x = w * 0.55; x < w; x += 35) {
        ctx.beginPath();
        ctx.arc(x + Math.sin(waveOffset) * 4, h * 0.78, 8, 0, Math.PI);
        ctx.stroke();
      }

      // Sun
      sunPulse += 0.03;
      const sunR = 24 + Math.sin(sunPulse) * 3;
      ctx.save();
      ctx.beginPath();
      ctx.arc(60, 45, sunR, 0, Math.PI * 2);
      ctx.fillStyle = isRainy ? '#fcd34d' : '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = isRainy ? 8 : 22;
      ctx.fill();
      ctx.restore();

      if (!isRainy && sunHot) {
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.5)';
        ctx.lineWidth = 2;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          ctx.beginPath();
          ctx.moveTo(60 + Math.cos(a + sunPulse) * (sunR + 2), 45 + Math.sin(a + sunPulse) * (sunR + 2));
          ctx.lineTo(60 + Math.cos(a + sunPulse) * (sunR + 16), 45 + Math.sin(a + sunPulse) * (sunR + 16));
          ctx.stroke();
        }
      }

      // Convection Loop
      if (simMode === 'wind_thermal') {
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.beginPath();
        ctx.moveTo(110, h * 0.68);
        ctx.quadraticCurveTo(100, h * 0.35, 170, h * 0.2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(249, 115, 22, 0.85)';
        ctx.beginPath();
        ctx.moveTo(170, h * 0.2);
        ctx.lineTo(340, h * 0.2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(59, 130, 246, 0.85)';
        ctx.beginPath();
        ctx.moveTo(340, h * 0.2);
        ctx.quadraticCurveTo(390, h * 0.45, 360, h * 0.68);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(14, 165, 233, 0.85)';
        ctx.beginPath();
        ctx.moveTo(360, h * 0.68);
        ctx.lineTo(110, h * 0.68);
        ctx.stroke();

        ctx.setLineDash([]);

        ctx.font = 'bold 10px Khmer, sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('🔥 ខ្យល់ក្តៅស្ទុះឡើង (L-សម្ពាធទាប)', 25, h * 0.38);

        ctx.fillStyle = '#0284c7';
        ctx.fillText('❄️ ខ្យល់ត្រជាក់ធ្លាក់ចុះ (H-សម្ពាធខ្ពស់)', 260, h * 0.38);

        ctx.fillStyle = '#ffffff';
        ctx.fillText('➡️ ខ្យល់បក់រលកសមុទ្រ (Sea Breeze)', 180, h * 0.71);

        if (animActive) {
          particles.forEach((p) => {
            if (p.type === 'warm') {
              p.y -= p.speed * (sunHot ? 1.4 : 0.8);
              if (p.y < h * 0.18) {
                p.x += p.speed * 1.2;
                if (p.x > 340) p.type = 'cold';
              }
            } else {
              p.y += p.speed * 1.2;
              if (p.y > h * 0.68) {
                p.x -= p.speed * 1.4;
                if (p.x < 110) p.type = 'warm';
              }
            }

            ctx.fillStyle = p.type === 'warm' ? `rgba(239, 68, 68, ${p.alpha})` : `rgba(59, 130, 246, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }

      // Cloud Rendering
      cloudX = (cloudX + (animActive ? 0.4 : 0)) % (w + 120);
      const drawCloud = (cx, cy, scale, type) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        ctx.fillStyle = type === 'cumulus' && selectedSeason === 'rainy' ? '#475569' : '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 8;

        if (type === 'cirrus') {
          ctx.strokeStyle = 'rgba(255,255,255,0.85)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-40, 0);
          ctx.quadraticCurveTo(0, -12, 40, -5);
          ctx.stroke();
        } else if (type === 'wave_cloud') {
          ctx.beginPath();
          ctx.roundRect(-60, -10, 120, 22, 10);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, 25, Math.PI * 0.5, Math.PI * 1.5);
          ctx.arc(20, -20, 28, Math.PI * 1, Math.PI * 1.85);
          ctx.arc(50, -15, 25, Math.PI * 1.3, Math.PI * 1.91);
          ctx.arc(70, 0, 22, Math.PI * 1.5, Math.PI * 0.5);
          ctx.moveTo(70, 25);
          ctx.lineTo(-25, 25);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      };

      drawCloud(cloudX - 60, 55, 1, selectedCloud);
      if (selectedCloud === 'cumulus' || isRainy) {
        drawCloud(cloudX + 110, 70, 0.85, 'cumulus');
        drawCloud(210, 48, 1.1, 'cumulus');
      }

      // Rain
      if (isRainy && animActive) {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)';
        ctx.lineWidth = 1.8;
        rainDrops.forEach((rd) => {
          rd.y += rd.speed;
          rd.x -= 0.8;
          if (rd.y > h * 0.72) {
            rd.y = Math.random() * 40 + 50;
            rd.x = Math.random() * w;
          }
          ctx.beginPath();
          ctx.moveTo(rd.x, rd.y);
          ctx.lineTo(rd.x - 2, rd.y + rd.len);
          ctx.stroke();
        });
      }

      if (animActive) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [r, simMode, sunHot, selectedCloud, selectedSeason, animActive]);

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

  const copyFullLessonText = () => {
    const text = `ជំពូកទី ៦ មេរៀនទី ១៦៖ ធាតុអាកាស (Weather) - សៀវភៅពុម្ពទំព័រ ១១២ ដល់ ១១៥

មនុស្ស សត្វ រុក្ខជាតិជាច្រើនរស់នៅលើភពផែនដី ពីព្រោះភពផែនដីមានកត្តាជាច្រើនដែលអាចបង្កឱ្យការរស់នៅទាំងនោះងាយស្រួលរស់នៅដូចជា ធាតុអាកាស អាកាសធាតុ... ។

១. ធាតុអាកាស
និយមន័យធាតុអាកាស៖ ធាតុអាកាសជាបម្រែបម្រួលសភាពបរិយាកាសរយៈពេលខ្លី ។

២. កត្តាដែលធ្វើឱ្យធាតុអាកាសមានការប្រែប្រួល
ក. ឥទ្ធិពលនៃព្រះអាទិត្យ៖ ពន្លឺព្រះអាទិត្យកម្តៅផែនដី ទឹក ខ្យល់។ ដូចនេះ ធាតុអាកាសអាចប្រែប្រួលដោយសារពន្លឺព្រះអាទិត្យ ។
ខ. ឥទ្ធិពលខ្យល់៖ ខ្យល់ក្តៅហោះឡើងលើ ខ្យល់ត្រជាក់ធ្លាក់ចុះមកក្រោម បង្កើតបានជាចលនាវិលវល់បង្កើតជាខ្យល់បក់ ។
គ. ឥទ្ធិពលពពក៖ ពពកសរសៃ ពពកខ្យល់ ពពករលក ពពកផ្តុំផ្កា ។ ពពកបាំងពន្លឺព្រះអាទិត្យ បង្កើតជាម្លប់ និងបង្កឱ្យមានភ្លៀង ។

៣. អាកាសធាតុ
និយមន័យអាកាសធាតុ៖ អាកាសធាតុជាបម្រែបម្រួលសភាពបរិយាកាសរយៈពេលយូរ ។ ប្រទេសកម្ពុជាមាន ២ រដូវគឺ រដូវប្រាំង (វិច្ឆិកា-មេសា) និងរដូវវស្សា (ឧសភា-តុលា) ។

៤. បាតុភូតធម្មជាតិ
ភ្នំសំពៅ និងភ្នំកំពង់ត្រាច រងកំណឹកដោយសារទឹកភ្លៀង បង្កើតបានជាល្អាងភ្នំដែលមាន ស្តាឡាក់ទីត (Stalactite - ដុះស្រក់ពីពិដានចុះមកក្រោម) និង ស្តាឡាក់មីត (Stalagmite - ដុះច្រូងច្រាងពីបាតឡើងលើ) ។`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      s && s("បានចម្លងមេរៀនទី ១៦ ទាំងមូលដោយជោគជ័យ!");
    }
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));
    const currentQ = Zi16[qIdx];
    if (currentQ && currentQ.opts[optIdx] && currentQ.opts[optIdx].c) {
      setQcmScore((prev) => prev + 1);
      s && s("ចម្លើយត្រឹមត្រូវ! 👏 (+១ ពិន្ទុ)");
    } else {
      s && s("ចម្លើយមិនត្រឹមត្រូវទេ! សូមពិនិត្យការពន្យល់ខាងក្រោម។");
    }
  };

  const questionsList = Zi16 || [];
  const currentQ = questionsList[currentQuestionIndex] || questionsList[0];

  return e.jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn",
    children: e.jsxs("div", {
      className: `bg-white rounded-3xl shadow-2xl border border-sky-200 w-full ${
        isFullscreen ? "max-w-none h-full rounded-none" : "max-w-5xl max-h-[92vh]"
      } flex flex-col overflow-hidden transition-all duration-300`,
      children: [
        // Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-sky-900 via-blue-900 to-cyan-950 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("div", {
                  className: "w-11 h-11 rounded-2xl bg-sky-500/30 border border-sky-300/40 flex items-center justify-center text-2xl shadow-inner",
                  children: "⛅"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("div", {
                      className: "flex items-center gap-2",
                      children: e.jsx("span", {
                        className: "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 uppercase tracking-wider shadow-xs",
                        children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"
                      })
                    }),
                    e.jsx("h2", {
                      className: "text-lg sm:text-xl font-bold font-moul text-white mt-1 drop-shadow-sm",
                      children: "មេរៀនទី ១៦ ៖ ធាតុអាកាស (Weather & Climate)"
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
                      "សង្ខេបមេរៀនទី ១៦៖ ធាតុអាកាស និងអាកាសធាតុ។ ធាតុអាកាសជាបម្រែបម្រួលសភាពបរិយាកាសរយៈពេលខ្លី (គិតជាម៉ោង ឬថ្ងៃ)។ កត្តាប្រែប្រួលមាន៖ ពន្លឺព្រះអាទិត្យ ខ្យល់ និងពពក។ អាកាសធាតុជាបម្រែបម្រួលសភាពបរិយាកាសរយៈពេលយូរ។ ប្រទេសកម្ពុជាមាន ២ រដូវគឺ រដូវប្រាំង និងរដូវវស្សា។"
                    ),
                  className: `px-3 py-2 rounded-xl text-xs font-bold border transition duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                    isSpeaking
                      ? "bg-amber-500 text-white border-amber-400 animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-sky-100 border-sky-300/30"
                  }`,
                  children: [
                    e.jsx("span", { children: "🔊" }),
                    e.jsx("span", { children: isSpeaking ? "កំពុងអាន..." : "ស្ដាប់ពន្យល់សំឡេង" })
                  ]
                }),
                e.jsxs("button", {
                  onClick: toggleFullscreen,
                  className: "p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-100 border border-sky-300/30 transition text-xs flex items-center gap-1 cursor-pointer",
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
              className: `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`,
              children: [e.jsx("span", { children: "📖" }), e.jsx("span", { children: "១. ខ្លឹមសារ ៤ ផ្នែក (Step-by-Step)" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("sim"),
              className: `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "sim"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`,
              children: [e.jsx("span", { children: "🔬" }), e.jsx("span", { children: "២. បន្ទប់ពិសោធន៍បរិយាកាស (Weather Lab)" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("quiz"),
              className: `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`,
              children: [
                e.jsx("span", { children: "📝" }),
                e.jsx("span", { children: "៣. សំណួរ QCM (៤០ សំណួរ)" }),
                e.jsx("span", {
                  className: "ml-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px]",
                  children: questionsList.length
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
                  className: "space-y-6 max-w-4xl mx-auto animate-fadeIn",
                  children: [
                    // Overview Banner Box
                    e.jsx("div", {
                      className: "bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden",
                      children: e.jsxs("div", {
                        className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              e.jsxs("div", {
                                className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold",
                                children: [
                                  e.jsx("span", { children: "📖" }),
                                  e.jsx("span", { children: "ខ្លឹមសារសៀវភៅពុម្ពក្រសួងអប់រំ (ទំព័រ ១១២ ដល់ ១១៥)" })
                                ]
                              }),
                              e.jsx("h2", {
                                className: "text-xl sm:text-2xl font-bold text-slate-900 font-moul",
                                children: "ជំពូកទី ៦ • មេរៀនទី ១៦៖ ធាតុអាកាស និងអាកាសធាតុ"
                              }),
                              e.jsx("p", {
                                className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
                                children: "ស្វែងយល់អំពីកត្តាព្រះអាទិត្យ ខ្យល់ ពពក រដូវកាលនៅកម្ពុជា និងបាតុភូតស្តាឡាក់ទីត/ស្តាឡាក់មីត"
                              })
                            ]
                          }),
                          e.jsx("div", {
                            className: "flex items-center gap-2",
                            children: e.jsxs("button", {
                              onClick: copyFullLessonText,
                              className: "bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer",
                              children: [e.jsx("span", { children: "📋" }), e.jsx("span", { children: "ចម្លងអត្ថបទទាំងអស់" })]
                            })
                          })
                        ]
                      })
                    }),

                    // STEP 1 Card
                    e.jsxs("div", {
                      className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                      children: [
                        e.jsxs("div", {
                          className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center space-x-3",
                              children: [
                                e.jsx("span", {
                                  className: "w-10 h-10 rounded-2xl bg-sky-500 text-white font-bold text-base flex items-center justify-center shadow-sm",
                                  children: "១"
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("div", { className: "text-[11px] font-bold text-sky-700 tracking-wider uppercase", children: "ជំហានទី ១ (Step 1)" }),
                                    e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "ធាតុអាកាស (Weather) - ទំព័រ ១១២" })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("button", {
                              onClick: () =>
                                toggleSpeech(
                                  "ជំហានទី ១៖ ធាតុអាកាស (Weather) ទំព័រ ១១២។ មនុស្ស សត្វ រុក្ខជាតិជាច្រើនរស់នៅលើភពផែនដី ពីព្រោះភពផែនដីមានកត្តាជាច្រើនដែលអាចបង្កឱ្យការរស់នៅទាំងនោះងាយស្រួលរស់នៅដូចជា ធាតុអាកាស និងអាកាសធាតុ។ និយមន័យធាតុអាកាស៖ ធាតុអាកាសជាបម្រែបម្រួលសភាពបរិយាកាសរយៈពេលខ្លី។"
                                ),
                              className: "text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-200 flex items-center gap-1.5 cursor-pointer",
                              children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "p-6 space-y-4 text-sm text-slate-700 leading-relaxed",
                          children: [
                            e.jsxs("p", {
                              children: [
                                "មនុស្ស សត្វ រុក្ខជាតិជាច្រើនរស់នៅលើភពផែនដី ពីព្រោះភពផែនដីមានកត្តាជាច្រើនដែលអាចបង្កឱ្យការរស់នៅទាំងនោះងាយស្រួលរស់នៅដូចជា ",
                                e.jsx("strong", { children: "ធាតុអាកាស អាកាសធាតុ..." }),
                                "។"
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-4 bg-sky-50 border border-sky-200 rounded-2xl text-sky-950 font-semibold text-xs leading-relaxed",
                              children: [
                                e.jsx("span", { className: "text-sky-600 mr-2 text-base", children: "💬" }),
                                e.jsx("strong", { children: "និយមន័យធាតុអាកាស ៖ " }),
                                "ធាតុអាកាសជាបម្រែបម្រួលសភាពបរិយាកាស",
                                e.jsx("strong", { children: "រយៈពេលខ្លី" }),
                                " (គិតជាម៉ោង ឬជាថ្ងៃ)។"
                              ]
                            }),
                            e.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                e.jsx("h4", { className: "font-bold text-slate-900 text-xs", children: "ឧទាហរណ៍ជាក់ស្តែងដែលយើងតែងនិយាយ ៖" }),
                                e.jsxs("div", {
                                  className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs",
                                  children: [
                                    e.jsxs("div", {
                                      className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5",
                                      children: [e.jsx("span", { className: "text-amber-500 text-base", children: "🌡️" }), e.jsx("span", { children: "«ធាតុអាកាសពេលនេះម្តេចក៏ក្តៅម៉្លេះ!»" })]
                                    }),
                                    e.jsxs("div", {
                                      className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5",
                                      children: [e.jsx("span", { className: "text-sky-500 text-base", children: "💨" }), e.jsx("span", { children: "«ធាតុអាកាសពេលនេះមានខ្យល់បក់រំភើយៗ!»" })]
                                    }),
                                    e.jsxs("div", {
                                      className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5",
                                      children: [e.jsx("span", { className: "text-blue-400 text-base", children: "❄️" }), e.jsx("span", { children: "«ធាតុអាកាសពេលនេះ ត្រជាក់ស្រួលណាស់...!»" })]
                                    })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // STEP 2 Card
                    e.jsxs("div", {
                      className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                      children: [
                        e.jsxs("div", {
                          className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center space-x-3",
                              children: [
                                e.jsx("span", {
                                  className: "w-10 h-10 rounded-2xl bg-amber-500 text-white font-bold text-base flex items-center justify-center shadow-sm",
                                  children: "២"
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("div", { className: "text-[11px] font-bold text-amber-700 tracking-wider uppercase", children: "ជំហានទី ២ (Step 2)" }),
                                    e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "កត្តាដែលធ្វើឱ្យធាតុអាកាសមានការប្រែប្រួល (ទំព័រ ១១២-១១៤)" })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("button", {
                              onClick: () =>
                                toggleSpeech(
                                  "ជំហានទី ២៖ កត្តាដែលធ្វើឱ្យធាតុអាកាសមានការប្រែប្រួល។ ក. ឥទ្ធិពលនៃព្រះអាទិត្យ៖ ព្រះអាទិត្យកម្តៅផែនដី ទឹក ខ្យល់។ ពេលពន្លឺថ្ងៃក្តៅធ្វើឱ្យធាតុអាកាសក្តៅ ពេលពន្លឺថយចុះធាតុអាកាសត្រជាក់។ ខ. ឥទ្ធិពលខ្យល់៖ ខ្យល់ក្តៅហោះឡើងលើ ខ្យល់ត្រជាក់ធ្លាក់ចុះក្រោមបង្កើតជាចលនាវិលវល់បង្កើតជាខ្យល់បក់។ គ. ឥទ្ធិពលពពក៖ ពពកសរសៃ ពពកខ្យល់ ពពករលក ពពកផ្តុំផ្កា។"
                                ),
                              className: "text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 cursor-pointer",
                              children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                          children: [
                            // ក. ឥទ្ធិពលនៃព្រះអាទិត្យ
                            e.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                e.jsxs("h4", {
                                  className: "font-bold text-slate-900 flex items-center gap-2 text-sm",
                                  children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" }), "ក. ឥទ្ធិពលនៃព្រះអាទិត្យ (ទំព័រ ១១២-១១៣)"]
                                }),
                                e.jsx("p", { children: "ព្រះអាទិត្យកម្តៅផែនដី ទឹក ខ្យល់ និងវត្ថុផ្សេងៗ។ ពេលពន្លឺព្រះអាទិត្យកាន់តែក្តៅធ្វើឱ្យពិភពលោកមានធាតុអាកាសក្តៅ។ ពេលពន្លឺព្រះអាទិត្យថយចុះ ធាតុអាកាសក៏ត្រជាក់ដែរ។" }),
                                e.jsxs("div", {
                                  className: "p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs font-semibold flex items-center gap-2",
                                  children: [e.jsx("span", { children: "☀️" }), e.jsxs("span", { children: [e.jsx("strong", { children: "ដូចនេះ ៖ " }), "ធាតុអាកាសអាចប្រែប្រួលដោយសារពន្លឺព្រះអាទិត្យ។"] })]
                                })
                              ]
                            }),

                            // ខ. ឥទ្ធិពលខ្យល់
                            e.jsxs("div", {
                              className: "space-y-3 pt-2 border-t border-slate-100",
                              children: [
                                e.jsxs("h4", {
                                  className: "font-bold text-slate-900 flex items-center gap-2 text-sm",
                                  children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" }), "ខ. ឥទ្ធិពលខ្យល់ (ទំព័រ ១១៣)"]
                                }),
                                e.jsx("p", { children: "ជាទូទៅ យើងអាចដឹងពីល្បឿននិងទិសដៅខ្យល់ដោយពិនិត្យចលនាស្លឹករុក្ខជាតិ ឬទង់ជាតិ។ ប្រសិនបើខ្យល់នៅជុំវិញយើងស្ងប់ នោះស្លឹកឈើ ឬទង់ជាតិគ្មានចលនាដែរ។" }),
                                e.jsxs("div", {
                                  className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs",
                                  children: [
                                    e.jsx("div", { className: "font-bold text-slate-900 text-sm", children: "យន្តការបង្កើតខ្យល់បក់ (Thermal Convection) ៖" }),
                                    e.jsxs("p", {
                                      children: [
                                        "នៅពេលខ្យល់ត្រូវកម្តៅព្រះអាទិត្យ ",
                                        e.jsx("strong", { children: "វាកើនឡើងក្តៅហើយស្រាល រួចហោះឡើងលើ" }),
                                        "។ ចំណែកឯ ",
                                        e.jsx("strong", { children: "ខ្យល់ត្រជាក់ធ្លាក់ចុះមកក្រោម" }),
                                        " បង្កើតជាចលនាវិលវល់ ដែលបង្កើតបានជាខ្យល់បក់។"
                                      ]
                                    }),
                                    e.jsxs("div", {
                                      className: "p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-sky-800",
                                      children: [e.jsx("strong", { children: "ដូចនេះ ៖ " }), "ធាតុអាកាសអាចប្រែប្រួលដោយសារតែបម្រែបម្រួលចលនានិងល្បឿននៃខ្យល់។"]
                                    })
                                  ]
                                })
                              ]
                            }),

                            // គ. ឥទ្ធិពលពពក
                            e.jsxs("div", {
                              className: "space-y-3 pt-2 border-t border-slate-100",
                              children: [
                                e.jsxs("h4", {
                                  className: "font-bold text-slate-900 flex items-center gap-2 text-sm",
                                  children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" }), "គ. ឥទ្ធិពលពពក (ទំព័រ ១១៤)"]
                                }),
                                e.jsxs("p", {
                                  children: [
                                    "ពពកមានច្រើនប្រភេទ។ ពពកអាចបាំងពន្លឺព្រះអាទិត្យ បង្កើតជាម្លប់ត្រជាក់។ ពេលខ្លះ ពពកអាចបង្កឱ្យមានភ្លៀង។ ពពកធ្វើឱ្យធាតុអាកាសមានការប្រែប្រួល។ ",
                                    e.jsx("strong", { children: "ដូចនេះ ធាតុអាកាសអាចប្រែប្រួលដោយសារពពក។" })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1",
                                  children: [
                                    e.jsxs("div", {
                                      className: "p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1",
                                      children: [
                                        e.jsx("div", { className: "text-lg", children: "🪶" }),
                                        e.jsx("div", { className: "font-bold text-slate-900", children: "១. ពពកសរសៃ" }),
                                        e.jsx("div", { className: "text-[10px] text-slate-500", children: "ស្តើង ស្រាលដូចសរសៃសូត្រ" })
                                      ]
                                    }),
                                    e.jsxs("div", {
                                      className: "p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1",
                                      children: [
                                        e.jsx("div", { className: "text-lg", children: "💨" }),
                                        e.jsx("div", { className: "font-bold text-slate-900", children: "២. ពពកខ្យល់" }),
                                        e.jsx("div", { className: "text-[10px] text-slate-500", children: "មានរាងរាយប៉ាយតាមកម្លាំងខ្យល់" })
                                      ]
                                    }),
                                    e.jsxs("div", {
                                      className: "p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1",
                                      children: [
                                        e.jsx("div", { className: "text-lg", children: "🌊" }),
                                        e.jsx("div", { className: "font-bold text-slate-900", children: "៣. ពពករលក" }),
                                        e.jsx("div", { className: "text-[10px] text-slate-500", children: "រៀបជាជួរៗដូចរលកទឹក" })
                                      ]
                                    }),
                                    e.jsxs("div", {
                                      className: "p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1",
                                      children: [
                                        e.jsx("div", { className: "text-lg", children: "🌧️" }),
                                        e.jsx("div", { className: "font-bold text-slate-900", children: "៤. ពពកផ្តុំផ្កា" }),
                                        e.jsx("div", { className: "text-[10px] text-slate-500", children: "ក្រាស់ ផ្ដុំដុំៗ ងាយបង្កជាភ្លៀង" })
                                      ]
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs",
                                  children: [
                                    e.jsx("strong", { children: "សរុបមក ៖ " }),
                                    "ជាទូទៅ ធាតុអាកាសមានច្រើនប្រភេទ ហើយប្រែប្រួលទៅតាមពេល ដូចជាពេលភ្លៀង ពេលក្តៅ ពេលត្រជាក់ ពេលមានខ្យល់ ពេលមានព្យុះ ឬពេលហួតហែង។"
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // STEP 3 Card
                    e.jsxs("div", {
                      className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                      children: [
                        e.jsxs("div", {
                          className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center space-x-3",
                              children: [
                                e.jsx("span", {
                                  className: "w-10 h-10 rounded-2xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center shadow-sm",
                                  children: "៣"
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("div", { className: "text-[11px] font-bold text-emerald-700 tracking-wider uppercase", children: "ជំហានទី ៣ (Step 3)" }),
                                    e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "អាកាសធាតុ (Climate) & រដូវកាលនៅកម្ពុជា (ទំព័រ ១១៤-១១៥)" })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("button", {
                              onClick: () =>
                                toggleSpeech(
                                  "ជំហានទី ៣៖ អាកាសធាតុ (Climate) និយមន័យអាកាសធាតុ៖ អាកាសធាតុជាបម្រែបម្រួលសភាពបរិយាកាសរយៈពេលយូរ។ ប្រទេសកម្ពុជាទទួលឥទ្ធិពលអាកាសធាតុត្រូពិកមូសុង ដែលក្តៅ ហើយសើម មាន ២ រដូវគឺ រដូវប្រាំង (ខែវិច្ឆិកា ដល់ខែមេសា) និងរដូវវស្សា (ខែឧសភា ដល់ខែតុលា)។"
                                ),
                              className: "text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 cursor-pointer",
                              children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "p-6 space-y-4 text-sm text-slate-700 leading-relaxed",
                          children: [
                            e.jsxs("div", {
                              className: "p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-semibold text-xs leading-relaxed",
                              children: [
                                e.jsx("span", { className: "text-emerald-600 mr-2 text-base", children: "💬" }),
                                e.jsx("strong", { children: "និយមន័យអាកាសធាតុ ៖ " }),
                                "អាកាសធាតុជាបម្រែបម្រួលសភាពបរិយាកាស",
                                e.jsx("strong", { children: "រយៈពេលយូរ" }),
                                " (គិតជាខែ ឬជាឆ្នាំ)។"
                              ]
                            }),
                            e.jsxs("p", {
                              children: [
                                "ប្រទេសកម្ពុជាទទួលឥទ្ធិពល ",
                                e.jsx("strong", { children: "អាកាសធាតុត្រូពិកមូសុង ដែលក្តៅ ហើយសើម" }),
                                "។ អាកាសធាតុនេះបង្កឱ្យប្រទេសកម្ពុជាមានរដូវពីរគឺ ៖"
                              ]
                            }),
                            e.jsxs("div", {
                              className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs",
                              children: [
                                e.jsxs("div", {
                                  className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2",
                                  children: [
                                    e.jsxs("div", {
                                      className: "font-bold text-amber-700 text-sm flex items-center justify-between",
                                      children: [
                                        e.jsx("span", { children: "១. រដូវប្រាំង (Dry Season)" }),
                                        e.jsx("span", { className: "text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold", children: "ក្តៅ ស្ងួត" })
                                      ]
                                    }),
                                    e.jsxs("p", {
                                      className: "text-slate-600 leading-relaxed",
                                      children: [
                                        "ចាប់ពី ",
                                        e.jsx("strong", { children: "ខែវិច្ឆិកា រហូតដល់ ខែមេសា" }),
                                        "។ ជាពេលវេលាដែលកម្រមានភ្លៀងធ្លាក់ និងមានសីតុណ្ហភាពក្តៅ។"
                                      ]
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2",
                                  children: [
                                    e.jsxs("div", {
                                      className: "font-bold text-blue-700 text-sm flex items-center justify-between",
                                      children: [
                                        e.jsx("span", { children: "២. រដូវវស្សា (Rainy Season)" }),
                                        e.jsx("span", { className: "text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold", children: "សើម ភ្លៀងជោគជាំ" })
                                      ]
                                    }),
                                    e.jsxs("p", {
                                      className: "text-slate-600 leading-relaxed",
                                      children: [
                                        "ចាប់ពី ",
                                        e.jsx("strong", { children: "ខែឧសភា រហូតដល់ ខែតុលា" }),
                                        "។ អាកាសធាតុនេះអនុគ្រោះដល់ការអភិវឌ្ឍវិស័យកសិកម្មយ៉ាងប្រសើរ។"
                                      ]
                                    })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-4 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs space-y-1.5",
                              children: [
                                e.jsx("div", { className: "font-bold text-slate-900 text-sm", children: "ចំណាំភាពខុសគ្នាសំខាន់បំផុត (ទំព័រ ១១៥) ៖" }),
                                e.jsxs("div", {
                                  children: [
                                    "• ",
                                    e.jsx("strong", { children: "ធាតុអាកាស (Weather) ៖ " }),
                                    "ជាបម្រែបម្រួលសភាពបរិយាកាស ",
                                    e.jsx("strong", { children: "រយៈពេលខ្លី" }),
                                    " (គិតជាម៉ោង ឬជាថ្ងៃ)"
                                  ]
                                }),
                                e.jsxs("div", {
                                  children: [
                                    "• ",
                                    e.jsx("strong", { children: "អាកាសធាតុ (Climate) ៖ " }),
                                    "ជាបម្រែបម្រួលសភាពបរិយាកាស ",
                                    e.jsx("strong", { children: "រយៈពេលយូរ" }),
                                    " (គិតជាខែ ឬជាឆ្នាំ)"
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // STEP 4 Card
                    e.jsxs("div", {
                      className: "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
                      children: [
                        e.jsxs("div", {
                          className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center space-x-3",
                              children: [
                                e.jsx("span", {
                                  className: "w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-sm",
                                  children: "៤"
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("div", { className: "text-[11px] font-bold text-indigo-700 tracking-wider uppercase", children: "ជំហានទី ៤ (Step 4)" }),
                                    e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "បាតុភូតធម្មជាតិ និងផលប៉ះពាល់ (ទំព័រ ១១៥)" })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("button", {
                              onClick: () =>
                                toggleSpeech(
                                  "ជំហានទី ៤៖ បាតុភូតធម្មជាតិ និងផលប៉ះពាល់ ទំព័រ ១១៥។ ភ្នំសំពៅ ខេត្តបាត់ដំបង និងភ្នំកំពង់ត្រាច ខេត្តកំពត ដែលកើតឡើងពីថ្មកំបោរ រងនូវកំណឹកដោយសារទឹកភ្លៀង បង្កើតបានជាល្អាងភ្នំដែលមាន ស្តាឡាក់ទីត (Stalactite) ដុះស្រក់ពីពិដានចុះមកក្រោម និង ស្តាឡាក់មីត (Stalagmite) ដុះច្រូងច្រាងពីបាតក្រោមឡើងលើ។"
                                ),
                              className: "text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1.5 cursor-pointer",
                              children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "p-6 space-y-4 text-sm text-slate-700 leading-relaxed",
                          children: [
                            e.jsxs("p", {
                              children: [
                                "ក្រៅពីផ្ដល់អំណោយផលដល់កសិកម្ម អាកាសធាតុក៏ធ្វើឱ្យតំបន់ទេសភាពមួយចំនួន ",
                                e.jsx("strong", { children: "ទទួលរងនូវកំណឹកដោយសារទឹកភ្លៀង" }),
                                " ផងដែរ។"
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs",
                              children: [
                                e.jsx("div", { className: "font-bold text-slate-900 text-sm", children: "ឧទាហរណ៍ជាក់ស្តែងក្នុងប្រទេសកម្ពុជា ៖" }),
                                e.jsxs("p", {
                                  className: "text-slate-600 leading-relaxed",
                                  children: [
                                    e.jsx("strong", { children: "ភ្នំសំពៅ (ខេត្តបាត់ដំបង)" }),
                                    " និង ",
                                    e.jsx("strong", { children: "ភ្នំកំពង់ត្រាច (ខេត្តកំពត)" }),
                                    " ដែលកើតឡើងពីថ្មកំបោរ រងនូវកំណឹកដោយសារទឹកភ្លៀង បង្កើតបានជាល្អាងភ្នំ និងទ្រង់ទ្រាយថ្មធម្មជាតិដ៏អស្ចារ្យពីរគឺ ៖"
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1",
                                  children: [
                                    e.jsxs("div", {
                                      className: "p-3.5 bg-white rounded-xl border border-slate-200 space-y-1",
                                      children: [
                                        e.jsxs("div", {
                                          className: "font-bold text-indigo-700 text-sm flex items-center gap-1.5",
                                          children: [e.jsx("span", { children: "⬇️" }), "ស្តាឡាក់ទីត (Stalactite)"]
                                        }),
                                        e.jsxs("p", {
                                          className: "text-slate-600 leading-relaxed",
                                          children: [
                                            "ជាទម្រង់ថ្មកំបោរ ឬទឹកកកថ្មរាងដូចចង្កោមម្ជុលដែល ",
                                            e.jsx("strong", { children: "ដុះស្រក់ចុះពីលើពិដានល្អាងចុះមកក្រោម" }),
                                            "។"
                                          ]
                                        })
                                      ]
                                    }),
                                    e.jsxs("div", {
                                      className: "p-3.5 bg-white rounded-xl border border-slate-200 space-y-1",
                                      children: [
                                        e.jsxs("div", {
                                          className: "font-bold text-emerald-700 text-sm flex items-center gap-1.5",
                                          children: [e.jsx("span", { children: "⬆️" }), "ស្តាឡាក់មីត (Stalagmite)"]
                                        }),
                                        e.jsxs("p", {
                                          className: "text-slate-600 leading-relaxed",
                                          children: [
                                            "ជាទម្រង់ថ្មកំបោរដែលកើតពីដំណក់ទឹកស្រក់មកលើបាតល្អាង ហើយ ",
                                            e.jsx("strong", { children: "ដុះច្រូងច្រាងពីបាតក្រោមឡើងលើ" }),
                                            "។"
                                          ]
                                        })
                                      ]
                                    })
                                  ]
                                })
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
                                  children: "🔬 បន្ទប់ពិសោធន៍ចរន្តខ្យល់ និងពពក (Weather Lab)"
                                }),
                                e.jsx("p", {
                                  className: "text-xs text-slate-500 mt-0.5",
                                  children: "ពិសោធន៍កម្ដៅព្រះអាទិត្យ ចរន្តខ្យល់ក្ដៅ/ត្រជាក់ ពពក ៤ ប្រភេទ និងរដូវកាលនៅកម្ពុជា"
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsxs("button", {
                                  onClick: () =>
                                    toggleSpeech(
                                      `លទ្ធផលពិសោធន៍ធាតុអាកាស៖ សីតុណ្ហភាព ${sunHot ? "ខ្ពស់ (៣៤°C) ក្តៅខ្លាំង" : "ត្រជាក់ស្រួល (២៤°C)"}។ រដូវកាល៖ ${selectedSeason === "rainy" ? "រដូវវស្សា មានភ្លៀងធ្លាក់" : "រដូវប្រាំង មេឃស្រឡះ"}។ ចរន្តខ្យល់ក្តៅស្ទុះឡើងលើ បង្កើតជាតំបន់សម្ពាធទាប L ហើយខ្យល់ត្រជាក់បក់ចូលជំនួសបង្កើតជាចរន្តខ្យល់។`
                                    ),
                                  className: "px-3 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold rounded-xl text-xs border border-sky-200 flex items-center gap-1.5 cursor-pointer",
                                  children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់គណនា" })]
                                }),
                                e.jsxs("button", {
                                  onClick: () => setAnimActive(!animActive),
                                  className: `px-3 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition ${
                                    animActive ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-emerald-600 text-white hover:bg-emerald-700"
                                  }`,
                                  children: [
                                    e.jsx("span", { children: animActive ? "⏸️" : "▶️" }),
                                    e.jsx("span", { children: animActive ? "ផ្អាកចលនា" : "ដំណើរការចលនា" })
                                  ]
                                })
                              ]
                            })
                          ]
                        }),

                        // Control Mode Toggles
                        e.jsxs("div", {
                          className: "flex items-center gap-2 flex-wrap text-xs font-bold",
                          children: [
                            e.jsx("span", { className: "text-slate-500", children: "របៀបពិសោធន៍ ៖" }),
                            e.jsxs("button", {
                              onClick: () => setSimMode("wind_thermal"),
                              className: `px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                                simMode === "wind_thermal"
                                  ? "bg-sky-600 text-white border-sky-600"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`,
                              children: [e.jsx("span", { children: "🌪️" }), e.jsx("span", { children: "១. ចរន្តខ្យល់ (ទំព័រ ១១៣)" })]
                            }),
                            e.jsxs("button", {
                              onClick: () => setSimMode("clouds_rain"),
                              className: `px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                                simMode === "clouds_rain"
                                  ? "bg-sky-600 text-white border-sky-600"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`,
                              children: [e.jsx("span", { children: "🌧️" }), e.jsx("span", { children: "២. ប្រភេទពពក (ទំព័រ ១១៤)" })]
                            })
                          ]
                        }),

                        // Sub controls
                        e.jsxs("div", {
                          className: "grid sm:grid-cols-3 gap-3 text-xs",
                          children: [
                            e.jsxs("div", {
                              className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                              children: [
                                e.jsx("span", { className: "font-bold text-slate-700 block", children: "☀️ ពន្លឺព្រះអាទិត្យ (ទំព័រ ១១២)" }),
                                e.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    e.jsx("button", {
                                      onClick: () => setSunHot(true),
                                      className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                                        sunHot ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-600"
                                      }`,
                                      children: "ក្តៅខ្លាំង (៣៤°C)"
                                    }),
                                    e.jsx("button", {
                                      onClick: () => setSunHot(false),
                                      className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                                        !sunHot ? "bg-sky-500 text-white border-sky-500" : "bg-white text-slate-600"
                                      }`,
                                      children: "ត្រជាក់ (២៤°C)"
                                    })
                                  ]
                                })
                              ]
                            }),

                            e.jsxs("div", {
                              className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                              children: [
                                e.jsx("span", { className: "font-bold text-slate-700 block", children: "🇰🇭 រដូវកាលនៅកម្ពុជា" }),
                                e.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    e.jsx("button", {
                                      onClick: () => setSelectedSeason("rainy"),
                                      className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                                        selectedSeason === "rainy"
                                          ? "bg-cyan-600 text-white border-cyan-600"
                                          : "bg-white text-slate-600"
                                      }`,
                                      children: "🌧️ រដូវវស្សា"
                                    }),
                                    e.jsx("button", {
                                      onClick: () => setSelectedSeason("dry"),
                                      className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                                        selectedSeason === "dry"
                                          ? "bg-amber-600 text-white border-amber-600"
                                          : "bg-white text-slate-600"
                                      }`,
                                      children: "☀️ រដូវប្រាំង"
                                    })
                                  ]
                                })
                              ]
                            }),

                            e.jsxs("div", {
                              className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                              children: [
                                e.jsx("span", { className: "font-bold text-slate-700 block", children: "☁️ ប្រភេទពពក (ទំព័រ ១១៤)" }),
                                e.jsxs("select", {
                                  value: selectedCloud,
                                  onChange: (evt) => setSelectedCloud(evt.target.value),
                                  className: "w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 cursor-pointer",
                                  children: [
                                    e.jsx("option", { value: "cumulus", children: "១. ពពកផ្តុំផ្កា (បង្កជាភ្លៀង)" }),
                                    e.jsx("option", { value: "cirrus", children: "២. ពពកសរសៃ (គ្មានភ្លៀង)" }),
                                    e.jsx("option", { value: "wind_cloud", children: "៣. ពពកខ្យល់ (ខ្យល់បក់)" }),
                                    e.jsx("option", { value: "wave_cloud", children: "៤. ពពករលក (រលកទឹក)" })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // HTML5 Canvas Display Component
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

                        // Dynamic Readings Panel
                        e.jsxs("div", {
                          className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs text-white",
                          children: [
                            e.jsxs("div", {
                              className: "p-2.5 bg-slate-800/80 rounded-xl border border-slate-700",
                              children: [
                                e.jsx("span", { className: "text-[10px] text-slate-400 block", children: "សីតុណ្ហភាពដី" }),
                                e.jsxs("span", { className: "font-bold text-amber-400 text-sm", children: [sunHot ? "៣៤" : "២៤", "°C"] })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-2.5 bg-slate-800/80 rounded-xl border border-slate-700",
                              children: [
                                e.jsx("span", { className: "text-[10px] text-slate-400 block", children: "សម្ពាធបរិយាកាស" }),
                                e.jsxs("span", { className: "font-bold text-sky-400 text-sm", children: [sunHot ? "១០០២ (L)" : "១០១៦ (H)", " hPa"] })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-2.5 bg-slate-800/80 rounded-xl border border-slate-700",
                              children: [
                                e.jsx("span", { className: "text-[10px] text-slate-400 block", children: "សំណើមបរិយាកាស" }),
                                e.jsxs("span", { className: "font-bold text-cyan-400 text-sm", children: [selectedSeason === "rainy" ? "៨៨" : "៤២", "%"] })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-2.5 bg-slate-800/80 rounded-xl border border-slate-700",
                              children: [
                                e.jsx("span", { className: "text-[10px] text-slate-400 block", children: "ល្បឿនខ្យល់បក់" }),
                                e.jsxs("span", { className: "font-bold text-emerald-400 text-sm", children: [sunHot ? "២២" : "៨", " km/h"] })
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
                              className: "text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100",
                              children: ["ពិន្ទុសរុប ៖ ", qcmScore, " / ", questionsList.length]
                            })
                          ]
                        }),

                        // Progress bar
                        e.jsx("div", {
                          className: "w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200",
                          children: e.jsx("div", {
                            className: "bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all duration-300",
                            style: { width: `${((currentQuestionIndex + 1) / questionsList.length) * 100}%` }
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
                                  e.jsx("span", { className: "text-sky-600 mr-2", children: `សំណួរ ${currentQuestionIndex + 1} ៖` }),
                                  currentQ.q
                                ]
                              }),
                              e.jsxs("button", {
                                onClick: () => toggleSpeech(currentQ.q),
                                className: "shrink-0 p-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold border border-sky-200 flex items-center gap-1 cursor-pointer",
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

                              let btnStyle = "bg-slate-50 hover:bg-sky-50/60 border-slate-200 text-slate-800";
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
                                className: `w-full p-4 rounded-2xl border text-left text-xs transition duration-200 flex items-start gap-3 cursor-pointer ${btnStyle}`,
                                children: [
                                  e.jsx("span", {
                                    className: `w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 border ${
                                      isAnswered && opt.c
                                        ? "bg-emerald-500 text-white border-emerald-500"
                                        : isAnswered && isSelected && !opt.c
                                        ? "bg-red-500 text-white border-red-500"
                                        : "bg-white border-slate-300 text-slate-600"
                                    }`,
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
                                className: "px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center gap-1",
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
                            if (isCurrent) gridBg = "bg-sky-600 text-white border-sky-600 font-extrabold ring-2 ring-sky-300";
                            else if (isAnswered) gridBg = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";

                            return e.jsx("button", {
                              key: idx,
                              onClick: () => setCurrentQuestionIndex(idx),
                              className: `h-8 rounded-xl text-xs border flex items-center justify-center transition cursor-pointer ${gridBg}`,
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
};