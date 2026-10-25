import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Enhancing Explanation Audio / Voice Speech across Lessons 14, 15, 16, 17 ===");

const files = ['public/assets/index-BwPwHqBe.js', 'dist/assets/index-BwPwHqBe.js'];

const indexCode = fs.readFileSync('public/assets/index-BwPwHqBe.js', 'utf8');

// Extract Zi17 from bundle
const zi17Match = indexCode.match(/Zi17=(\[[\s\S]*?\]),Iz17=/);
if (!zi17Match) {
  console.error("Could not find Zi17 in index-BwPwHqBe.js");
  process.exit(1);
}

const l17Questions = JSON.parse(zi17Match[1]);
console.log(`Found ${l17Questions.length} questions for Lesson 17 in bundle.`);

// Build updated Rz17 with active voice explanation buttons in every section and QCM feedback box
const updatedRz17Code = `Rz17 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "overview" }) => {
  if (!r) return null;

  const [activeTab, setActiveTab] = y.useState(a || "overview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [showExplanation, setShowExplanation] = y.useState({});
  const [qcmScore, setQcmScore] = y.useState(0);
  const [isFullscreen, setIsFullscreen] = y.useState(false);
  const [isSpeaking, setIsSpeaking] = y.useState(false);

  // Star Lab Simulator State
  const [simMode, setSimMode] = y.useState("stars_thermal");
  const [selectedStarType, setSelectedStarType] = y.useState("yellow");
  const [selectedConstellation, setSelectedConstellation] = y.useState("ursa_minor");
  const [starTwinkle, setStarTwinkle] = y.useState(true);
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

  // Star Lab Canvas Animation Effect
  y.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let bgStars = [];
    for (let i = 0; i < 75; i++) {
      bgStars.push({
        x: Math.random() * 600,
        y: Math.random() * 350,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.05 + 0.01
      });
    }

    const starInfo = {
      'red': { 
        name: 'ផ្កាយពណ៌ក្រហម (Betelgeuse / Antares)', 
        tempText: '៣,០០០ °C (ត្រជាក់ជាងគេ)', 
        tempVal: '3,000 °C',
        sizeText: 'ធំជាងគេបំផុត (យក្សក្រហម)', 
        sizeVal: 'យក្សក្រហម',
        colorCode: '#ef4444', 
        glowColor: 'rgba(239, 68, 68, 0.4)',
        radius: 56,
        lumText: 'បញ្ចេញពន្លឺរាប់ពាន់ដង',
        desc: 'ផ្កាយពណ៌ក្រហមមានសីតុណ្ហភាពត្រជាក់ជាងគេ តែមានទំហំធំជាងគេបង្អស់ (ទំព័រ ១១៩-១២០)។' 
      },
      'orange': { 
        name: 'ផ្កាយពណ៌លឿងទុំ (Aldebaran)', 
        tempText: '៤,២០០ °C (ក្តៅមធ្យម)', 
        tempVal: '4,200 °C',
        sizeText: 'ធំបន្ទាប់ពីផ្កាយក្រហម', 
        sizeVal: 'ធំបន្ទាប់',
        colorCode: '#f97316', 
        glowColor: 'rgba(249, 115, 22, 0.45)',
        radius: 44,
        lumText: 'ស្មើ ១០០ ដង នៃព្រះអាទិត្យ',
        desc: 'ផ្កាយពណ៌លឿងទុំ បញ្ចេញពន្លឺស្មើ ១០០ ដងនៃពន្លឺរបស់ព្រះអាទិត្យ និងមានទំហំបន្ទាប់ពីផ្កាយក្រហម (ទំព័រ ១១៩-១២០)។' 
      },
      'yellow': { 
        name: 'ផ្កាយពណ៌លឿង (ព្រះអាទិត្យ Sun)', 
        tempText: '៥,៥០០ °C (ក្តៅជាងផ្កាយក្រហម)', 
        tempVal: '5,500 °C',
        sizeText: 'ទំហំមធ្យម', 
        sizeVal: 'មធ្យម',
        colorCode: '#eab308', 
        glowColor: 'rgba(234, 179, 8, 0.5)',
        radius: 32,
        lumText: '១ ដង (ខ្នាតប្រៀបធៀប)',
        desc: 'ព្រះអាទិត្យជាផ្កាយដែលមានពន្លឺពណ៌លឿង មានសីតុណ្ហភាពក្តៅជាងផ្កាយក្រហម និងមានទំហំមធ្យម (ទំព័រ ១១៩)។' 
      },
      'white_blue': { 
        name: 'ផ្កាយពណ៌ស និងពណ៌ខៀវ (Sirius / Rigel)', 
        tempText: '១០,០០០ - ២៥,០០០ °C (ក្តៅខ្លាំងបំផុត)', 
        tempVal: '15,000 °C',
        sizeText: 'តូចជាងគេបង្អស់', 
        sizeVal: 'តូចបំផុត',
        colorCode: '#38bdf8', 
        glowColor: 'rgba(56, 189, 248, 0.6)',
        radius: 20,
        lumText: 'ពន្លឺចាំងចែងខ្លាំង',
        desc: 'ផ្កាយពណ៌ស និងពណ៌ខៀវ មានទំហំតូចជាងគេបង្អស់ តែមានសីតុណ្ហភាពក្តៅខ្លាំងជាងគេបំផុត (ទំព័រ ១២០)។' 
      }
    };

    const constellationList = {
      'ursa_minor': {
        name: '១. ក្រុមផ្កាយខ្លាឃ្មុំតូច (Ursa Minor)',
        latin: 'Ursa Minor (Little Bear)',
        pts: [
          {x: 0.28, y: 0.35}, {x: 0.38, y: 0.30}, {x: 0.48, y: 0.38},
          {x: 0.58, y: 0.45}, {x: 0.68, y: 0.42}, {x: 0.72, y: 0.60}, {x: 0.60, y: 0.65}
        ],
        lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,3]],
        desc: 'មានផ្កាយប៉ូល (Polaris) នៅចុងកន្ទុយ ចង្អុលទិសខាងជើងជានិច្ច'
      },
      'cancer': {
        name: '២. ក្រុមផ្កាយក្តាម (Cancer)',
        latin: 'Cancer (The Crab)',
        pts: [
          {x: 0.50, y: 0.48}, {x: 0.42, y: 0.32}, {x: 0.58, y: 0.32},
          {x: 0.52, y: 0.68}, {x: 0.34, y: 0.55}, {x: 0.66, y: 0.55}
        ],
        lines: [[0,1], [0,2], [0,3], [1,4], [2,5]],
        desc: 'មានទម្រង់ដូចសត្វក្តាម មានជើង និងដង្កៀបរាយចេញសងខាង'
      },
      'scorpius': {
        name: '៣. ក្រុមផ្កាយខ្ទួយ (Scorpius)',
        latin: 'Scorpius (The Scorpion)',
        pts: [
          {x: 0.25, y: 0.42}, {x: 0.30, y: 0.32}, {x: 0.32, y: 0.48},
          {x: 0.38, y: 0.40}, {x: 0.48, y: 0.44}, {x: 0.58, y: 0.55},
          {x: 0.66, y: 0.68}, {x: 0.74, y: 0.64}, {x: 0.78, y: 0.50}
        ],
        lines: [[0,1], [0,2], [0,3], [3,4], [4,5], [5,6], [6,7], [7,8]],
        desc: 'រាងដូចកន្ទុយសត្វខ្ទួយ ឬខ្យាដំរីកោងទំពក់ឡើងលើ មានផ្កាយ Antares'
      },
      'capricornus': {
        name: '៤. ក្រុមផ្កាយពពែ (Capricornus)',
        latin: 'Capricornus (Sea Goat)',
        pts: [
          {x: 0.30, y: 0.32}, {x: 0.42, y: 0.36}, {x: 0.62, y: 0.34},
          {x: 0.72, y: 0.46}, {x: 0.58, y: 0.65}, {x: 0.40, y: 0.60}
        ],
        lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]],
        desc: 'មានទម្រង់រាងត្រីកោណកោងដូចក្បាលពពែ និងកន្ទុយត្រី'
      },
      'canis_major': {
        name: '៥. ក្រុមផ្កាយឆ្កែ (Canis Major)',
        latin: 'Canis Major (The Great Dog)',
        pts: [
          {x: 0.38, y: 0.28}, {x: 0.48, y: 0.38}, {x: 0.60, y: 0.46},
          {x: 0.68, y: 0.65}, {x: 0.42, y: 0.62}, {x: 0.32, y: 0.48}, {x: 0.72, y: 0.42}
        ],
        lines: [[0,1], [1,2], [2,3], [1,4], [4,5], [2,6]],
        desc: 'មានផ្កាយ Sirius ដែលជាផ្កាយភ្លឺជាងគេបង្អស់លើផ្ទៃមេឃរាត្រី'
      },
      'ursa_major': {
        name: '៦. ក្រុមផ្កាយខ្លាឃ្មុំធំ (Ursa Major)',
        latin: 'Ursa Major (The Great Bear)',
        pts: [
          {x: 0.22, y: 0.36}, {x: 0.32, y: 0.38}, {x: 0.40, y: 0.48},
          {x: 0.50, y: 0.50}, {x: 0.64, y: 0.52}, {x: 0.72, y: 0.68},
          {x: 0.58, y: 0.70}, {x: 0.48, y: 0.66}, {x: 0.32, y: 0.62}
        ],
        lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,3], [7,8]],
        desc: 'មានទម្រង់ដូចដងវែកធំ ឬរទេះគោ ងាយចំណាំជាងគេនៅអឌ្ឍគោលខាងជើង'
      }
    };

    const render = () => {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep Space Background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h));
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw Background Twinkling Stars
      const time = Date.now() * 0.002;
      ctx.fillStyle = '#ffffff';
      bgStars.forEach((star, idx) => {
        let a = star.alpha;
        if (starTwinkle) {
          a = 0.3 + 0.7 * Math.abs(Math.sin(time + idx));
        }
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc((star.x / 600) * w, (star.y / 350) * h, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      if (simMode === 'stars_thermal') {
        const s = starInfo[selectedStarType] || starInfo['yellow'];
        const centerX = w * 0.45;
        const centerY = h * 0.52;
        const animTime = Date.now() * 0.003;

        const glowR = s.radius * (1.8 + 0.2 * Math.sin(animTime * 2));
        const grad = ctx.createRadialGradient(centerX, centerY, s.radius * 0.4, centerX, centerY, glowR);
        grad.addColorStop(0, s.glowColor);
        grad.addColorStop(0.7, s.glowColor.replace('0.4', '0.1').replace('0.5', '0.1').replace('0.6', '0.1'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = s.colorCode;
        ctx.shadowColor = s.colorCode;
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(centerX, centerY, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const flareCount = 12;
        ctx.strokeStyle = s.colorCode;
        ctx.lineWidth = 2;
        for (let i = 0; i < flareCount; i++) {
          const angle = (i * Math.PI * 2) / flareCount + animTime * 0.5;
          const r1 = s.radius + 2;
          const r2 = s.radius + 8 + 6 * Math.sin(animTime * 3 + i);
          ctx.beginPath();
          ctx.moveTo(centerX + Math.cos(angle) * r1, centerY + Math.sin(angle) * r1);
          ctx.lineTo(centerX + Math.cos(angle) * r2, centerY + Math.sin(angle) * r2);
          ctx.stroke();
        }

        const legendX = w - 160;
        const legendY = 25;
        if (legendX > 100) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(legendX - 10, legendY - 15, 155, 135, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 11px Kantumruy Pro';
          ctx.fillText("មាត្រដ្ឋានទំហំផ្កាយ៖", legendX, legendY);

          const items = [
            { name: 'ក្រហម (ធំជាងគេ)', color: '#ef4444', r: 8 },
            { name: 'លឿងទុំ (ធំបន្ទាប់)', color: '#f97316', r: 6 },
            { name: 'លឿង (ព្រះអាទិត្យ)', color: '#eab308', r: 4.5 },
            { name: 'ស/ខៀវ (តូចបង្អស់)', color: '#38bdf8', r: 3 }
          ];

          items.forEach((it, idx) => {
            const itemY = legendY + 20 + idx * 22;
            ctx.fillStyle = it.color;
            ctx.beginPath();
            ctx.arc(legendX + 12, itemY, it.r, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#cbd5e1';
            ctx.font = '10px Kantumruy Pro';
            ctx.fillText(it.name, legendX + 28, itemY + 3.5);
          });
        }
      } else {
        const c = constellationList[selectedConstellation] || constellationList['ursa_minor'];
        const animTime = Date.now() * 0.001;

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        c.lines.forEach(([i1, i2]) => {
          const p1 = c.pts[i1];
          const p2 = c.pts[i2];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x * w, p1.y * h);
            ctx.lineTo(p2.x * w, p2.y * h);
            ctx.stroke();
          }
        });
        ctx.setLineDash([]);

        c.pts.forEach((pt, idx) => {
          const sx = pt.x * w;
          const sy = pt.y * h;
          const twinkleScale = starTwinkle ? (1 + 0.25 * Math.sin(animTime * 3 + idx)) : 1;

          const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, 14 * twinkleScale);
          grad.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(sx, sy, 14 * twinkleScale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5 * twinkleScale, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx - 7, sy); ctx.lineTo(sx + 7, sy);
          ctx.moveTo(sx, sy - 7); ctx.lineTo(sx, sy + 7);
          ctx.stroke();
        });

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px Kantumruy Pro';
        ctx.textAlign = 'left';
        ctx.fillText(c.name, 18, h - 22);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Kantumruy Pro';
        ctx.fillText(c.latin, 18, h - 8);
      }

      if (animActive) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [simMode, selectedStarType, selectedConstellation, starTwinkle, animActive]);

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      if (s) s("កម្មវិធីប្រុវស័រមិនគាំទ្រ Voice Audio ទេ");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "km-KH";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const currentQ = ${JSON.stringify(l17Questions)}[currentQuestionIndex] || ${JSON.stringify(l17Questions)}[0];

  const handleAnswer = (optionIndex) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    setShowExplanation(prev => ({ ...prev, [currentQuestionIndex]: true }));
    if (optionIndex === (currentQ.opts || currentQ.options).findIndex(o => o.c || o.isCorrect)) {
      setQcmScore(prev => prev + 1);
    }
  };

  const copyFullText = () => {
    const text = \`ជំពូកទី ៦ មេរៀនទី ១៧៖ ក្រុមផ្កាយ (Stars & Constellations) - សៀវភៅពុម្ពទំព័រ ១១៩ ដល់ ១២១\\n\\n១. ពណ៌នៃផ្កាយ និងសីតុណ្ហភាព\\n- ផ្កាយជាតារាដែលអាចបញ្ចេញពន្លឺដោយខ្លួនឯង គ្រប់ផ្កាយទាំងអស់សុទ្ធតែជាដុំបាល់នៃឧស្ម័នដែលកំពុងឆេះ។\\n- ផ្កាយពណ៌ក្រហម៖ ត្រជាក់ជាងគេ\\n- ផ្កាយពណ៌លឿង៖ ក្តៅជាងផ្កាយក្រហម (ព្រះអាទិត្យពណ៌លឿង)\\n- ផ្កាយពណ៌លឿងទុំ៖ បញ្ចេញពន្លឺស្មើ ១០០ ដងនៃព្រះអាទិត្យ\\n- ពន្លឺរបស់ផ្កាយទាក់ទងទៅនឹងចម្ងាយពីផែនដីទៅនឹងផ្កាយទាំងនោះ។\\n\\n២. ទំហំនៃផ្កាយធៀបនឹងពណ៌ពន្លឺ\\n- ផ្កាយពណ៌ក្រហម៖ មានទំហំធំជាងគេ (Supergiant)\\n- ផ្កាយពណ៌លឿងទុំ៖ មានទំហំបន្ទាប់ពីផ្កាយពណ៌ក្រហម (Giant)\\n- ផ្កាយពណ៌លឿង៖ មានទំហំមធ្យម (ដូចជាព្រះអាទិត្យ)\\n- ផ្កាយពណ៌ស និងពណ៌ខៀវ៖ មានទំហំតូចជាងគេបង្អស់ (Dwarf)។\\n\\n៣. និយមន័យក្រុមផ្កាយ និងក្រុមផ្កាយទាំង ៦\\n- ផ្កាយដែលនៅផ្តុំគ្នានោះ គេហៅថា ក្រុមផ្កាយ (Constellation)។\\n- ក្រុមផ្កាយទាំង ៦ ក្នុងសៀវភៅពុម្ព៖ ខ្លាឃ្មុំតូច, ក្តាម, ខ្ទួយ, ពពែ, ឆ្កែ, ខ្លាឃ្មុំធំ។\\n\\n៤. សកលលោក (Universe)\\n- លំហដ៏ល្វឹងល្វើយដែលផ្ទុកព្រះអាទិត្យ ព្រះចន្ទ ផ្កាយ និងភពរាប់រយពាន់លាន គេហៅថា «សកល»។\\n- សកលមានទំហំធំធេងណាស់ យើងមិនអាចប៉ាន់ស្មាន ឬកំណត់ព្រំដែនបានទេ (មិនដឹងចាប់ផ្តើមពីណា ហើយចប់នៅទីណាឡើយ)។\`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (s) s("បានចម្លងមេរៀនទី ១៧ ទាំងមូលដោយជោគជ័យ!");
    }
  };

  const copySectionText = (sec) => {
    let text = "";
    if (sec === 'star_definition') {
      text = "១. និយមន័យផ្កាយ ពណ៌ និងសីតុណ្ហភាព (ទំព័រ ១១៩)\\n- ផ្កាយជាតារាដែលអាចបញ្ចេញពន្លឺដោយខ្លួនឯង គ្រប់ផ្កាយទាំងអស់សុទ្ធតែជាដុំបាល់នៃឧស្ម័នដែលកំពុងឆេះ។\\n- ផ្កាយពណ៌ក្រហម៖ ត្រជាក់ជាងគេ\\n- ផ្កាយពណ៌លឿង៖ ក្តៅជាងផ្កាយក្រហម (ព្រះអាទិត្យពណ៌លឿង)\\n- ផ្កាយពណ៌លឿងទុំ៖ បញ្ចេញពន្លឺស្មើ ១០០ ដងនៃព្រះអាទិត្យ\\n- ពន្លឺរបស់ផ្កាយទាក់ទងទៅនឹងចម្ងាយពីផែនដីទៅនឹងផ្កាយទាំងនោះ។";
    } else if (sec === 'star_sizes') {
      text = "២. ទំហំនៃផ្កាយធៀបនឹងពណ៌ពន្លឺ (ទំព័រ ១២០)\\n- ផ្កាយពណ៌ក្រហម៖ មានទំហំធំជាងគេ (Supergiant)\\n- ផ្កាយពណ៌លឿងទុំ៖ មានទំហំបន្ទាប់ពីផ្កាយពណ៌ក្រហម (Giant)\\n- ផ្កាយពណ៌លឿង៖ មានទំហំមធ្យម (ដូចជាព្រះអាទិត្យ)\\n- ផ្កាយពណ៌ស និងពណ៌ខៀវ៖ មានទំហំតូចជាងគេបង្អស់ (Dwarf)។";
    } else if (sec === 'constellations') {
      text = "៣. ក្រុមផ្កាយទាំង ៦ ក្នុងសៀវភៅពុម្ព (ទំព័រ ១២០-១២១)\\n- និយមន័យ៖ ផ្កាយដែលនៅផ្តុំគ្នានោះគេហៅថា «ក្រុមផ្កាយ (Constellation)»។ ផ្កាយនៅផ្តុំគ្នាមានទ្រង់ទ្រាយមិនដូចគ្នាទេ។\\n- ក្រុមផ្កាយសំខាន់ៗទាំង ៦៖\\n  ១. ក្រុមផ្កាយខ្លាឃ្មុំតូច (Ursa Minor)\\n  ២. ក្រុមផ្កាយក្តាម (Cancer)\\n  ៣. ក្រុមផ្កាយខ្ទួយ (Scorpius)\\n  ៤. ក្រុមផ្កាយពពែ (Capricornus)\\n  ៥. ក្រុមផ្កាយឆ្កែ (Canis Major)\\n  ៦. ក្រុមផ្កាយខ្លាឃ្មុំធំ (Ursa Major)។";
    } else if (sec === 'universe') {
      text = "៤. សកល (Universe) និងភាពធំធេងនៃលំហ (ទំព័រ ១២១)\\n- និយមន័យ៖ លំហដ៏ល្វឹងល្វើយនោះគេហៅថា «សកល (Universe)»។\\n- ព្រះអាទិត្យមានទំហំធំជាងផែនដីរាប់លានដង ហើយផ្កាយជាច្រើនទៀតធំជាងព្រះអាទិត្យទៅទៀត។\\n- សកលមានទំហំធំធេងណាស់ យើងមិនអាចប៉ាន់ស្មាន ឬកំណត់ព្រំដែនបានទេ (មិនដឹងចាប់ផ្តើមពីណា ហើយចប់នៅទីណាឡើយ)។";
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (s) s("បានចម្លងផ្នែកនេះដោយជោគជ័យ!");
    }
  };

  const starDetails = {
    'red': { temp: '3,000 °C', size: 'យក្សក្រហម (ធំជាងគេ)', formula: 'ទំហំធំជាងគេបង្អស់ | សីតុណ្ហភាពត្រជាក់ជាងគេ', exp: 'ផ្កាយពណ៌ក្រហមមានសីតុណ្ហភាពត្រជាក់ជាងគេ តែមានទំហំធំជាងគេបង្អស់ (ទំព័រ ១១៩-១២០)។' },
    'orange': { temp: '4,200 °C', size: 'ធំបន្ទាប់', formula: 'បញ្ចេញពន្លឺស្មើ ១០០ ដង នៃព្រះអាទិត្យ', exp: 'ផ្កាយពណ៌លឿងទុំ បញ្ចេញពន្លឺស្មើ ១០០ ដងនៃពន្លឺរបស់ព្រះអាទិត្យ និងមានទំហំបន្ទាប់ពីផ្កាយក្រហម (ទំព័រ ១១៩-១២០)។' },
    'yellow': { temp: '5,500 °C', size: 'មធ្យម', formula: 'ព្រះអាទិត្យជាផ្កាយពណ៌លឿង | ក្តៅជាងផ្កាយក្រហម', exp: 'ព្រះអាទិត្យជាផ្កាយដែលមានពន្លឺពណ៌លឿង មានសីតុណ្ហភាពក្តៅជាងផ្កាយក្រហម និងមានទំហំមធ្យម (ទំព័រ ១១៩)។' },
    'white_blue': { temp: '15,000 °C', size: 'តូចបំផុត', formula: 'សីតុណ្ហភាពក្តៅខ្លាំងបំផុត | ទំហំតូចជាងគេបង្អស់', exp: 'ផ្កាយពណ៌ស និងពណ៌ខៀវ មានទំហំតូចជាងគេបង្អស់ តែមានសីតុណ្ហភាពក្តៅខ្លាំងជាងគេបំផុត (ទំព័រ ១២០)។' }
  };

  const constDetails = {
    'ursa_minor': { name: '១. ក្រុមផ្កាយខ្លាឃ្មុំតូច', desc: 'មានផ្កាយប៉ូល (Polaris) នៅចុងកន្ទុយ ចង្អុលទិសខាងជើងជានិច្ច' },
    'cancer': { name: '២. ក្រុមផ្កាយក្តាម', desc: 'មានទម្រង់ដូចសត្វក្តាម មានជើង និងដង្កៀបរាយចេញសងខាង' },
    'scorpius': { name: '៣. ក្រុមផ្កាយខ្ទួយ', desc: 'រាងដូចកន្ទុយសត្វខ្ទួយ ឬខ្យាដំរីកោងទំពក់ឡើងលើ មានផ្កាយ Antares' },
    'capricornus': { name: '៤. ក្រុមផ្កាយពពែ', desc: 'មានទម្រង់រាងត្រីកោណកោងដូចក្បាលពពែ និងកន្ទុយត្រី' },
    'canis_major': { name: '៥. ក្រុមផ្កាយឆ្កែ', desc: 'មានផ្កាយ Sirius ដែលជាផ្កាយភ្លឺជាងគេបង្អស់លើផ្ទៃមេឃរាត្រី' },
    'ursa_major': { name: '៦. ក្រុមផ្កាយខ្លាឃ្មុំធំ', desc: 'មានទម្រង់ដូចដងវែកធំ ឬរទេះគោ ងាយចំណាំជាងគេនៅអឌ្ឍគោលខាងជើង' }
  };

  return e.jsx("div", {
    className: "fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4",
    children: e.jsxs("div", {
      className: "bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]",
      children: [
        // Modal Header
        e.jsxs("div", {
          className: "sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0",
          children: [
            e.jsxs("div", {
              className: "flex items-center space-x-3",
              children: [
                e.jsx("div", {
                  className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md ring-2 ring-amber-100",
                  children: e.jsx("span", { className: "text-lg", children: "⭐" })
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        e.jsx("span", { className: "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                        e.jsx("span", { className: "text-[10px] text-slate-500 hidden sm:inline", children: "• សៀវភៅពុម្ព MoEYS (ទំព័រ ១១៩-១២១)" })
                      ]
                    }),
                    e.jsx("h2", { className: "text-sm sm:text-base font-bold text-slate-900 leading-tight", children: "ជំពូកទី ៦ • មេរៀនទី ១៧ ៖ ក្រុមផ្កាយ (Stars & Constellations)" })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center space-x-2",
              children: [
                e.jsxs("button", {
                  onClick: () => speakText("សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាការសង្ខេបខ្លឹមសារមេរៀនទី ១៧ ៖ ក្រុមផ្កាយ និងសកលលោក ៖ ទី ១. ផ្កាយជាដុំបាល់ឧស្ម័នឆេះបញ្ចេញពន្លឺដោយខ្លួនឯង។ ផ្កាយពណ៌ក្រហមមានសីតុណ្ហភាពត្រជាក់ជាងគេ តែធំជាងគេ។ ផ្កាយពណ៌លឿងដូចព្រះអាទិត្យមានសីតុណ្ហភាពក្តៅជាងផ្កាយក្រហម និងមានទំហំមធ្យម។ ផ្កាយពណ៌ស និងខៀវតូចជាងគេ តែសីតុណ្ហភាពក្តៅខ្លាំងបំផុត។ ទី ២. ក្រុមផ្កាយ គឺជាផ្កាយដែលនៅផ្តុំគ្នាក្នុងលំហ រួមមាន ក្រុមផ្កាយខ្លាឃ្មុំតូច ក្តាម ខ្ទួយ ពពែ ឆ្កែ និងខ្លាឃ្មុំធំ។ ទី ៣. សកលលោក គឺជាលំហដ៏ល្វឹងល្វើយដែលផ្ទុកភព និងផ្កាយរាប់រយពាន់លាន ហើយសកលមានទំហំធំធេងគ្មានដែនកំណត់ឡើយ។"),
                  className: \`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs \${isSpeaking ? 'bg-amber-600 text-white animate-pulse' : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'}\`,
                  children: [
                    e.jsx("span", { children: "🔊" }),
                    e.jsx("span", { className: "hidden sm:inline", children: isSpeaking ? "កំពុងអានពន្យល់..." : "ស្ដាប់ពន្យល់មេរៀន" })
                  ]
                }),
                e.jsxs("button", {
                  onClick: copyFullText,
                  className: "flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 transition cursor-pointer",
                  children: [
                    e.jsx("span", { children: "📋" }),
                    e.jsx("span", { className: "hidden sm:inline", children: "ចម្លងមេរៀន" })
                  ]
                }),
                e.jsx("button", {
                  onClick: t,
                  className: "w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center font-bold transition cursor-pointer text-base",
                  children: "✕"
                })
              ]
            })
          ]
        }),

        // Tabs Bar
        e.jsxs("div", {
          className: "bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center space-x-2 overflow-x-auto shrink-0 text-xs sm:text-sm",
          children: [
            e.jsxs("button", {
              onClick: () => setActiveTab("overview"),
              className: \`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 cursor-pointer \${activeTab === 'overview' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}\`,
              children: [
                e.jsx("span", { children: "📚" }),
                e.jsx("span", { children: "១. ខ្លឹមសារ ៤ ផ្នែក (Step-by-Step)" })
              ]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("simulation"),
              className: \`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 cursor-pointer \${activeTab === 'simulation' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}\`,
              children: [
                e.jsx("span", { children: "🔭" }),
                e.jsx("span", { children: "២. បន្ទប់ពិសោធន៍តារាសាស្ត្រ (Star Lab)" })
              ]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("quiz"),
              className: \`py-2 px-3.5 rounded-xl font-bold transition flex items-center space-x-2 cursor-pointer \${activeTab === 'quiz' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}\`,
              children: [
                e.jsx("span", { children: "📝" }),
                e.jsx("span", { children: "៣. សំណួរ QCM (៤០ សំណួរ)" })
              ]
            })
          ]
        }),

        // Scrollable Body
        e.jsx("div", {
          className: "p-4 sm:p-6 overflow-y-auto space-y-6 flex-grow",
          children: activeTab === "overview" ? e.jsxs("div", {
            className: "space-y-6",
            children: [
              // Banner
              e.jsx("div", {
                className: "bg-amber-50/80 border border-amber-200 p-5 rounded-3xl space-y-2",
                children: e.jsxs("div", {
                  className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsx("div", { className: "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold", children: "📖 ខ្លឹមសារសៀវភៅពុម្ពក្រសួងអប់រំ (ទំព័រ ១១៩ ដល់ ១២១)" }),
                        e.jsx("h3", { className: "text-lg font-bold text-slate-900", children: "ជំពូកទី ៦ • មេរៀនទី ១៧ ៖ ក្រុមផ្កាយ និងសកល" }),
                        e.jsx("p", { className: "text-xs text-slate-600", children: "ស្វែងយល់អំពីលក្ខណៈផ្កាយ ពណ៌ សីតុណ្ហភាព ទំហំ ក្រុមផ្កាយទាំង ៦ និងភាពធំធេងនៃសកល" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex items-center gap-2 shrink-0",
                      children: [
                        e.jsxs("button", {
                          onClick: () => speakText("ជំពូកទី ៦ មេរៀនទី ១៧៖ ក្រុមផ្កាយ និងសកលលោក។ ស្វែងយល់អំពីលក្ខណៈផ្កាយ ពណ៌ សីតុណ្ហភាព ទំហំ ក្រុមផ្កាយទាំង ៦ និងភាពធំធេងនៃសកលលោកគ្មានដែនកំណត់។"),
                          className: "bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs",
                          children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                        }),
                        e.jsxs("button", {
                          onClick: copyFullText,
                          className: "bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs",
                          children: [e.jsx("span", { children: "📋" }), " ចម្លង"]
                        })
                      ]
                    })
                  ]
                })
              }),

              // STEP 1
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-9 h-9 rounded-2xl bg-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-xs", children: "១" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[10px] font-bold text-amber-700 uppercase tracking-wider", children: "ជំហានទី ១ (Step 1)" }),
                              e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "ពណ៌នៃផ្កាយ និងសីតុណ្ហភាព (ទំព័រ ១១៩)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => speakText("ជំហានទី ១៖ ពណ៌នៃផ្កាយ និងសីតុណ្ហភាព (ទំព័រ ១១៩)។ ផ្កាយជាតារាដែលអាចបញ្ចេញពន្លឺដោយខ្លួនឯង គ្រប់ផ្កាយទាំងអស់សុទ្ធតែជាដុំបាល់នៃឧស្ម័នដែលកំពុងឆេះ។ ផ្កាយពណ៌ក្រហមមានសីតុណ្ហភាពត្រជាក់ជាងគេ។ ផ្កាយពណ៌លឿងដូចជាព្រះអាទិត្យមានសីតុណ្ហភាពក្តៅជាងផ្កាយក្រហម។ ផ្កាយពណ៌លឿងទុំបញ្ចេញពន្លឺស្មើ ១០០ ដងនៃពន្លឺព្រះអាទិត្យ។ ពន្លឺផ្កាយដែលយើងមើលឃើញទាក់ទងទៅនឹងចម្ងាយពីផែនដី។"),
                            className: "text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 font-bold flex items-center gap-1 cursor-pointer",
                            children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySectionText('star_definition'),
                            className: "text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer",
                            children: [e.jsx("span", { children: "📋" }), " ចម្លង"]
                          })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("p", { className: "text-sm text-slate-700 leading-relaxed", children: ["បើយើងក្រឡេកមើលទៅលើមេឃស្រឡះ នាលាត្រីដែលគ្មានព្រះចន្ទនោះយើងនឹងឃើញមានពន្លឺព្រិចៗជាច្រើនឥតគណនា។ ", e.jsx("strong", { children: "ពន្លឺព្រិចៗទាំងនោះសុទ្ធតែជាផ្កាយ។" })] }),
                  e.jsxs("div", {
                    className: "p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 font-semibold text-sm",
                    children: [
                      "💬 ", e.jsx("strong", { children: "និយមន័យផ្កាយ៖" }), " ផ្កាយជាតារាដែលអាចបញ្ចេញពន្លឺដោយខ្លួនឯង។ គ្រប់ផ្កាយទាំងអស់សុទ្ធតែជាដុំបាល់នៃឧស្ម័នដែលកំពុងឆេះ។"
                    ]
                  }),
                  e.jsx("p", { className: "text-sm text-slate-700", children: "ផ្កាយទាំងអស់មានពន្លឺពណ៌ផ្សេងៗគ្នា ដោយសារវាមានសីតុណ្ហភាពខុសៗគ្នា៖" }),
                  e.jsxs("div", {
                    className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs",
                    children: [
                      e.jsxs("div", {
                        className: "p-4 bg-red-50 rounded-2xl border border-red-200 space-y-1",
                        children: [
                          e.jsxs("div", { className: "font-bold text-red-700 text-sm flex items-center gap-1", children: [e.jsx("span", { children: "🔴" }), " ផ្កាយពន្លឺពណ៌ក្រហម"] }),
                          e.jsxs("p", { className: "text-slate-600", children: ["ជាផ្កាយដែលមាន ", e.jsx("strong", { children: "សីតុណ្ហភាពត្រជាក់ជាងគេ" }), "។"] })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1",
                        children: [
                          e.jsxs("div", { className: "font-bold text-amber-700 text-sm flex items-center gap-1", children: [e.jsx("span", { children: "🟡" }), " ផ្កាយពន្លឺពណ៌លឿង"] }),
                          e.jsxs("p", { className: "text-slate-600", children: ["មានសីតុណ្ហភាពក្តៅជាងផ្កាយពណ៌ក្រហម។ ", e.jsx("strong", { children: "ព្រះអាទិត្យជាផ្កាយដែលមានពន្លឺពណ៌លឿង" }), "។"] })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-1",
                        children: [
                          e.jsxs("div", { className: "font-bold text-orange-700 text-sm flex items-center gap-1", children: [e.jsx("span", { children: "🟠" }), " ផ្កាយពន្លឺពណ៌លឿងទុំ"] }),
                          e.jsxs("p", { className: "text-slate-600", children: ["ជាផ្កាយដែលបញ្ចេញពន្លឺ ", e.jsx("strong", { children: "ស្មើនឹង ១០០ ដង នៃពន្លឺរបស់ព្រះអាទិត្យ" }), "។"] })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1",
                    children: [
                      e.jsx("strong", { children: "ឥទ្ធិពលចម្ងាយមកលើពន្លឺ៖" }), " ចំពោះយើង ព្រះអាទិត្យហាក់បីដូចជាមានពន្លឺខ្លាំងជាងគេ ពីព្រោះព្រះអាទិត្យស្ថិតនៅជិតភពផែនដីជាងគេ។ តាមជាក់ស្តែង ផ្កាយច្រើនណាស់ដែលអាចមានពន្លឺរាប់ពាន់រាប់ម៉ឺនដងលើសព្រះអាទិត្យទៅទៀត។",
                      e.jsx("div", { className: "text-amber-800 font-bold mt-1", children: "ដូចនេះ៖ ពន្លឺរបស់ផ្កាយទាក់ទងទៅនឹងចម្ងាយពីផែនដីទៅនឹងផ្កាយទាំងនោះ (ទំព័រ ១១៩)។" })
                    ]
                  })
                ]
              }),

              // STEP 2
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-9 h-9 rounded-2xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs", children: "២" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[10px] font-bold text-indigo-700 uppercase tracking-wider", children: "ជំហានទី ២ (Step 2)" }),
                              e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "ទំហំនៃផ្កាយធៀបនឹងពណ៌ពន្លឺ (ទំព័រ ១២០)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => speakText("ជំហានទី ២៖ ទំហំនៃផ្កាយធៀបនឹងពណ៌ពន្លឺ (ទំព័រ ១២០)។ ពន្លឺពណ៌នៃផ្កាយទាំងអស់ទាក់ទងទៅនឹងទំហំរបស់វា។ ផ្កាយពណ៌ក្រហមមានទំហំធំជាងគេ (យក្សក្រហម)។ ផ្កាយពណ៌លឿងទុំមានទំហំបន្ទាប់ពីផ្កាយក្រហម។ ផ្កាយពណ៌លឿងមានទំហំមធ្យមដូចព្រះអាទិត្យ។ ផ្កាយពណ៌ស និងពណ៌ខៀវមានទំហំតូចជាងគេបង្អស់។ លំដាប់ទំហំពីធំទៅតូចគឺ ៖ ក្រហម > លឿងទុំ > លឿង > ស និងខៀវ។"),
                            className: "text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-300 font-bold flex items-center gap-1 cursor-pointer",
                            children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySectionText('star_sizes'),
                            className: "text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer",
                            children: [e.jsx("span", { children: "📋" }), " ចម្លង"]
                          })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("p", { className: "text-sm text-slate-700 leading-relaxed", children: ["នៅពេលយប់មេឃស្រឡះល្អ យើងសង្កេតឃើញផ្កាយខ្លះធំ ខ្លះទៀតតូចៗ។ បណ្តាផ្កាយទាំងអស់មានទំហំធំខ្លាំងណាស់ ប៉ុន្តែយើងមើលមិនឃើញដោយភ្នែកទទេបានទេព្រោះវាមានពន្លឺព្រាលៗពេក។ ", e.jsx("strong", { children: "ពន្លឺពណ៌នៃផ្កាយទាំងអស់ទាក់ទងទៅនឹងទំហំរបស់វា" }), "៖"] }),
                  e.jsxs("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs",
                    children: [
                      e.jsxs("div", {
                        className: "p-4 bg-red-50 rounded-2xl border border-red-200 text-center space-y-1.5",
                        children: [
                          e.jsx("div", { className: "w-10 h-10 mx-auto rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm shadow-xs", children: "១" }),
                          e.jsx("div", { className: "font-bold text-red-700 text-sm", children: "ផ្កាយពណ៌ក្រហម" }),
                          e.jsx("div", { className: "text-xs font-semibold text-red-950", children: "មានទំហំធំជាងគេ" }),
                          e.jsx("div", { className: "text-[10px] text-slate-500", children: "(ទំហំយក្ស Supergiant)" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "p-4 bg-orange-50 rounded-2xl border border-orange-200 text-center space-y-1.5",
                        children: [
                          e.jsx("div", { className: "w-9 h-9 mx-auto rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-xs", children: "២" }),
                          e.jsx("div", { className: "font-bold text-orange-700 text-sm", children: "ផ្កាយពណ៌លឿងទុំ" }),
                          e.jsx("div", { className: "text-xs font-semibold text-orange-950", children: "ទំហំបន្ទាប់ពីផ្កាយក្រហម" }),
                          e.jsx("div", { className: "text-[10px] text-slate-500", children: "(ទំហំធំ Giant)" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-1.5",
                        children: [
                          e.jsx("div", { className: "w-8 h-8 mx-auto rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-xs shadow-xs", children: "៣" }),
                          e.jsx("div", { className: "font-bold text-amber-700 text-sm", children: "ផ្កាយពណ៌លឿង" }),
                          e.jsx("div", { className: "text-xs font-semibold text-amber-950", children: "មានទំហំមធ្យម" }),
                          e.jsx("div", { className: "text-[10px] text-slate-500", children: "(ដូចជាព្រះអាទិត្យ)" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "p-4 bg-sky-50 rounded-2xl border border-sky-200 text-center space-y-1.5",
                        children: [
                          e.jsx("div", { className: "w-7 h-7 mx-auto rounded-full bg-sky-400 flex items-center justify-center text-white font-bold text-xs shadow-xs", children: "៤" }),
                          e.jsx("div", { className: "font-bold text-sky-700 text-sm", children: "ផ្កាយពណ៌ស និងពណ៌ខៀវ" }),
                          e.jsx("div", { className: "text-xs font-semibold text-sky-950", children: "មានទំហំតូចជាងគេបង្អស់" }),
                          e.jsx("div", { className: "text-[10px] text-slate-500", children: "(ទំហំតូច Dwarf)" })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs font-semibold",
                    children: [
                      "🔻 ", e.jsx("strong", { children: "លំដាប់ទំហំពីធំទៅតូច៖" }), " ផ្កាយពណ៌ក្រហម (ធំជាងគេ) > ផ្កាយពណ៌លឿងទុំ > ផ្កាយពណ៌លឿង (មធ្យម) > ផ្កាយពណ៌ស និងពណ៌ខៀវ (តូចជាងគេបង្អស់)។"
                    ]
                  })
                ]
              }),

              // STEP 3
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-9 h-9 rounded-2xl bg-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-xs", children: "៣" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[10px] font-bold text-teal-700 uppercase tracking-wider", children: "ជំហានទី ៣ (Step 3)" }),
                              e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "និយមន័យក្រុមផ្កាយ និងក្រុមផ្កាយទាំង ៦ (ទំព័រ ១២០-១២១)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => speakText("ជំហានទី ៣៖ និយមន័យក្រុមផ្កាយ និងក្រុមផ្កាយទាំង ៦ ក្នុងសៀវភៅពុម្ពទំព័រ ១២០ ដល់ ១២១។ ផ្កាយដែលនៅផ្តុំគ្នាក្នុងលំហ គេហៅថា ក្រុមផ្កាយ ឬ Constellation។ ក្រុមផ្កាយទាំង ៦ ក្នុងសៀវភៅពុម្ពរួមមាន ៖ ទី ១. ក្រុមផ្កាយខ្លាឃ្មុំតូច, ទី ២. ក្រុមផ្កាយក្តាម, ទី ៣. ក្រុមផ្កាយខ្ទួយ, ទី ៤. ក្រុមផ្កាយពពែ, ទី ៥. ក្រុមផ្កាយឆ្កែ, និងទី ៦. ក្រុមផ្កាយខ្លាឃ្មុំធំ។"),
                            className: "text-xs bg-teal-100 hover:bg-teal-200 text-teal-900 px-3 py-1.5 rounded-xl border border-teal-300 font-bold flex items-center gap-1 cursor-pointer",
                            children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySectionText('constellations'),
                            className: "text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer",
                            children: [e.jsx("span", { children: "📋" }), " ចម្លង"]
                          })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("p", { className: "text-sm text-slate-700 leading-relaxed", children: ["នៅពេលយប់មេឃស្រឡះល្អ យើងអាចសង្កេតឃើញផ្កាយរាប់លានខ្លះភ្លឺខ្លាំង ខ្លះភ្លឺព្រាលៗ។ បណ្តាផ្កាយទាំងនោះខ្លះនៅដាច់ៗពីគ្នា ", e.jsx("strong", { children: "ខ្លះនៅផ្តុំគ្នា" }), "។"] }),
                  e.jsxs("div", {
                    className: "p-4 bg-teal-50 border border-teal-200 rounded-2xl text-teal-950 font-semibold text-sm space-y-1",
                    children: [
                      e.jsxs("div", { children: ["💬 ", e.jsx("strong", { children: "និយមន័យក្រុមផ្កាយ៖" }), " ផ្កាយដែលនៅផ្តុំគ្នានោះ គេហៅថា ", e.jsx("strong", { children: "«ក្រុមផ្កាយ (Constellation)»" }), "។"] }),
                      e.jsx("div", { className: "text-xs text-teal-800 font-normal", children: "ផ្កាយនៅផ្តុំគ្នាជាក្រុមៗមានទ្រង់ទ្រាយមិនដូចគ្នាទេ (ទំព័រ ១២១)។" })
                    ]
                  }),
                  e.jsx("p", { className: "text-xs text-slate-700 font-semibold", children: "ក្នុងចំណោមក្រុមផ្កាយទាំងអស់ យើងអាចកត់សម្គាល់ឃើញមានក្រុមផ្កាយសំខាន់ៗចំនួន ៦ ដូចមានក្នុងសៀវភៅពុម្ពទំព័រ ១២១៖" }),
                  e.jsxs("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs",
                    children: [
                      e.jsxs("div", { className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🐻" }), " ១. ក្រុមផ្កាយខ្លាឃ្មុំតូច"] }), e.jsx("div", { className: "text-[11px] text-slate-500", children: "Ursa Minor (រាងខ្លាឃ្មុំតូច)" })] }),
                      e.jsxs("div", { className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🦀" }), " ២. ក្រុមផ្កាយក្តាម"] }), e.jsx("div", { className: "text-[11px] text-slate-500", children: "Cancer (រាងសត្វក្តាម)" })] }),
                      e.jsxs("div", { className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🦂" }), " ៣. ក្រុមផ្កាយខ្ទួយ"] }), e.jsx("div", { className: "text-[11px] text-slate-500", children: "Scorpius (រាងសត្វខ្ទួយ/ខ្យាដំរី)" })] }),
                      e.jsxs("div", { className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🐐" }), " ៤. ក្រុមផ្កាយពពែ"] }), e.jsx("div", { className: "text-[11px] text-slate-500", children: "Capricornus (រាងពពែសមុទ្រ)" })] }),
                      e.jsxs("div", { className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🐕" }), " ៥. ក្រុមផ្កាយឆ្កែ"] }), e.jsx("div", { className: "text-[11px] text-slate-500", children: "Canis Major (រាងសត្វឆ្កែធំ)" })] }),
                      e.jsxs("div", { className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1", children: [e.jsxs("div", { className: "font-bold text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🐻‍❄️" }), " ៦. ក្រុមផ្កាយខ្លាឃ្មុំធំ"] }), e.jsx("div", { className: "text-[11px] text-slate-500", children: "Ursa Major (រាងខ្លាឃ្មុំធំ)" })] })
                    ]
                  }),
                  e.jsxs("p", { className: "text-xs text-slate-500", children: [e.jsx("strong", { children: "សម្គាល់៖" }), " ក្រុមផ្កាយទាំង ៦ នេះគ្រាន់តែជាក្រុមផ្កាយមួយចំនួនតូចប៉ុណ្ណោះ។ តាមការជាក់ស្តែង នៅមានក្រុមផ្កាយប្លែកៗជាច្រើនទៀតរាប់សិបក្នុងលំហអាកាស។"] })
                ]
              }),

              // STEP 4
              e.jsxs("div", {
                className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center space-x-3",
                        children: [
                          e.jsx("span", { className: "w-9 h-9 rounded-2xl bg-slate-800 text-white font-bold text-sm flex items-center justify-center shadow-xs", children: "៤" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", { className: "text-[10px] font-bold text-slate-600 uppercase tracking-wider", children: "ជំហានទី ៤ (Step 4)" }),
                              e.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "សកល (Universe) និងទំហំគ្មានដែនកំណត់ (ទំព័រ ១២១)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            onClick: () => speakText("ជំហានទី ៤៖ សកល (Universe) និងទំហំគ្មានដែនកំណត់ (ទំព័រ ១២១)។ លំហដ៏ល្វឹងល្វើយដែលផ្ទុកព្រះអាទិត្យ ព្រះចន្ទ ផ្កាយ និងភពរាប់រយពាន់លាន គេហៅថា សកល ឬ Universe។ ផ្កាយនីមួយៗស្ថិតនៅឃ្លាតឆ្ងាយពីគ្នារាប់ពាន់លានគីឡូម៉ែត្រ។ សកលមានទំហំធំធេងណាស់ យើងមិនអាចប៉ាន់ស្មាន ឬកំណត់ព្រំដែនបានទេ មានន័យថាសកលមិនដឹងចាប់ផ្តើមពីត្រឹមណា ហើយបញ្ចប់នៅទីណាឡើយ។"),
                            className: "text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 font-bold flex items-center gap-1 cursor-pointer",
                            children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                          }),
                          e.jsxs("button", {
                            onClick: () => copySectionText('universe'),
                            className: "text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer",
                            children: [e.jsx("span", { children: "📋" }), " ចម្លង"]
                          })
                        ]
                      })
                    ]
                  }),
                  e.jsx("p", { className: "text-sm text-slate-700 leading-relaxed", children: "យើងឃើញថា ព្រះអាទិត្យ ព្រះចន្ទ ផ្កាយ និងភពរាប់រយពាន់លាន សុទ្ធតែស្ថិតនៅក្នុងលំហដ៏ល្វឹងល្វើយ។" }),
                  e.jsxs("div", {
                    className: "p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-900 font-semibold text-sm",
                    children: [
                      "💬 ", e.jsx("strong", { children: "និយមន័យសកល៖" }), " លំហដ៏ល្វឹងល្វើយនោះ គេហៅថា ", e.jsx("strong", { children: "«សកល (Universe)»" }), " Athletic."
                    ]
                  }),
                  e.jsxs("div", {
                    className: "space-y-2 text-xs",
                    children: [
                      e.jsx("div", { className: "font-bold text-slate-900 text-sm", children: "លក្ខណៈពិសេសនៃសកលលោក៖" }),
                      e.jsxs("ul", {
                        className: "list-disc list-inside space-y-1.5 text-slate-600",
                        children: [
                          e.jsx("li", { children: "ផ្កាយមានចំនួនច្រើនណាស់ ហើយស្ថិតនៅឃ្លាតឆ្ងាយពីគ្នារាប់ពាន់លានគីឡូម៉ែត្រ។" }),
                          e.jsxs("li", { children: ["ផ្កាយនីមួយៗមានទំហំធំសម្បើមណាស់ ដូចជាព្រះអាទិត្យមានទំហំធំជាងផែនដី ", e.jsx("strong", { children: "រាប់លានដង" }), "។"] }),
                          e.jsx("li", { children: "លើសពីនេះទៅទៀត នៅមានផ្កាយជាច្រើនទៀតដែលមានទំហំធំជាងព្រះអាទិត្យទៅទៀត។" })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-amber-950 font-semibold text-xs leading-relaxed",
                    children: [
                      "♾️ ", e.jsx("strong", { children: "សេចក្តីសន្និដ្ឋានទំព័រ ១២១៖" }), " «សកលមានទំហំធំធេងណាស់ យើងមិនអាចប៉ាន់ស្មាន ឬកំណត់ព្រំដែនបានទេ មានន័យថាសកលមិនដឹងចាប់ផ្តើមពីត្រឹមណា ហើយបញ្ចប់នៅទីណាឡើយ។»"
                    ]
                  })
                ]
              })
            ]
          }) : activeTab === "simulation" ? e.jsxs("div", {
            className: "space-y-6 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs",
            children: [
              // Header
              e.jsxs("div", {
                className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" }), e.jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-amber-700", children: "Interactive Star Lab Simulator" })] }),
                      e.jsx("h3", { className: "text-lg sm:text-xl font-bold text-slate-900 mt-1", children: "បន្ទប់ពិសោធន៍តារាសាស្ត្រ និងក្រុមផ្កាយ" }),
                      e.jsx("p", { className: "text-xs text-slate-500", children: "ពិសោធន៍ពណ៌ សីតុណ្ហភាព ទំហំផ្កាយ និងទម្រង់ក្រុមផ្កាយទាំង ៦ ក្នុងសៀវភៅពុម្ព" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex bg-slate-100 p-1 rounded-2xl border border-slate-200 max-w-md w-full md:w-auto",
                    children: [
                      e.jsxs("button", {
                        onClick: () => setSimMode("stars_thermal"),
                        className: \`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer \${simMode === 'stars_thermal' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}\`,
                        children: [e.jsx("span", { children: "🌡️" }), e.jsx("span", { children: "១. ពណ៌ និងទំហំ (ទំព័រ ១១៩-១២០)" })]
                      }),
                      e.jsxs("button", {
                        onClick: () => setSimMode("constellations_view"),
                        className: \`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer \${simMode === 'constellations_view' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}\`,
                        children: [e.jsx("span", { children: "🌌" }), e.jsx("span", { children: "២. ក្រុមផ្កាយទាំង ៦ (ទំព័រ ១២១)" })]
                      })
                    ]
                  })
                ]
              }),

              // Canvas Display
              e.jsxs("div", {
                className: "relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden min-h-[350px]",
                children: [
                  e.jsx("canvas", { ref: canvasRef, className: "w-full h-[350px] block" }),
                  e.jsxs("div", {
                    className: "absolute top-3 left-3 flex flex-wrap gap-2",
                    children: [
                      e.jsxs("div", {
                        className: "bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 text-amber-400 font-semibold shadow-xs",
                        children: [e.jsx("span", { children: "⭐" }), e.jsx("span", { children: simMode === 'stars_thermal' ? (starDetails[selectedStarType]?.size || 'ផ្កាយពណ៌លឿង') : (constDetails[selectedConstellation]?.name || 'ក្រុមផ្កាយ') })]
                      }),
                      e.jsx("div", {
                        className: "bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 text-slate-300 font-semibold shadow-xs",
                        children: e.jsx("span", { children: simMode === 'stars_thermal' ? \`សីតុណ្ហភាព \${starDetails[selectedStarType]?.temp}\` : "ក្រុមផ្កាយនៅផ្តុំគ្នាជាក្រុម (ទំព័រ ១២១)" })
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "absolute bottom-3 right-3 flex items-center gap-2",
                    children: [
                      e.jsxs("button", {
                        onClick: () => setStarTwinkle(!starTwinkle),
                        className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs \${starTwinkle ? 'bg-amber-600 text-white' : 'bg-slate-700 text-white'}\`,
                        children: [e.jsx("span", { children: "✨" }), e.jsx("span", { children: starTwinkle ? 'ពន្លឺព្រិចៗ (Twinkle)' : 'ពន្លឺថេរ (Static Light)' })]
                      }),
                      e.jsxs("button", {
                        onClick: () => setAnimActive(!animActive),
                        className: "bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-600 flex items-center gap-1 transition cursor-pointer shadow-xs",
                        children: [e.jsx("span", { children: animActive ? "⏸️" : "▶️" }), e.jsx("span", { children: animActive ? "ផ្អាក" : "បន្ត" })]
                      })
                    ]
                  })
                ]
              }),

              // Controls Grid
              e.jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
                children: [
                  e.jsxs("div", {
                    className: "lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between border-b border-slate-200 pb-2",
                        children: [
                          e.jsxs("h4", { className: "font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5", children: [e.jsx("span", { children: "🎛️" }), " បន្ទះបញ្ជាការពិសោធន៍"] }),
                          e.jsx("span", { className: "text-[11px] text-slate-500", children: "ទំព័រ ១១៩ - ១២១" })
                        ]
                      }),
                      simMode === 'stars_thermal' ? e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsx("label", { className: "block text-xs font-medium text-slate-700", children: "ជ្រើសរើសពណ៌ផ្កាយ និងទំហំ (ទំព័រ ១១៩-១២០)៖" }),
                          e.jsxs("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                              e.jsxs("button", {
                                onClick: () => setSelectedStarType('red'),
                                className: \`p-2.5 rounded-xl text-xs font-bold border transition text-left flex items-center gap-2 cursor-pointer \${selectedStarType === 'red' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-700 border-slate-300'}\`,
                                children: [e.jsx("span", { className: "w-3 h-3 rounded-full bg-red-600 border border-white shrink-0" }), e.jsx("span", { children: "១. ក្រហម (ធំជាងគេ)" })]
                              }),
                              e.jsxs("button", {
                                onClick: () => setSelectedStarType('orange'),
                                className: \`p-2.5 rounded-xl text-xs font-bold border transition text-left flex items-center gap-2 cursor-pointer \${selectedStarType === 'orange' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-700 border-slate-300'}\`,
                                children: [e.jsx("span", { className: "w-3 h-3 rounded-full bg-orange-600 border border-white shrink-0" }), e.jsx("span", { children: "២. លឿងទុំ (ធំបន្ទាប់)" })]
                              }),
                              e.jsxs("button", {
                                onClick: () => setSelectedStarType('yellow'),
                                className: \`p-2.5 rounded-xl text-xs font-bold border transition text-left flex items-center gap-2 cursor-pointer \${selectedStarType === 'yellow' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-700 border-slate-300'}\`,
                                children: [e.jsx("span", { className: "w-3 h-3 rounded-full bg-amber-400 border border-white shrink-0" }), e.jsx("span", { children: "៣. លឿង (ព្រះអាទិត្យ)" })]
                              }),
                              e.jsxs("button", {
                                onClick: () => setSelectedStarType('white_blue'),
                                className: \`p-2.5 rounded-xl text-xs font-bold border transition text-left flex items-center gap-2 cursor-pointer \${selectedStarType === 'white_blue' ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-700 border-slate-300'}\`,
                                children: [e.jsx("span", { className: "w-3 h-3 rounded-full bg-sky-300 border border-white shrink-0" }), e.jsx("span", { children: "៤. ស & ខៀវ (តូចបង្អស់)" })]
                              })
                            ]
                          })
                        ]
                      }) : e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsx("label", { className: "block text-xs font-medium text-slate-700", children: "ជ្រើសរើសក្រុមផ្កាយក្នុងសៀវភៅពុម្ព (ទំព័រ ១២១)៖" }),
                          e.jsxs("select", {
                            value: selectedConstellation,
                            onChange: (e) => setSelectedConstellation(e.target.value),
                            className: "w-full bg-white border border-slate-300 text-slate-800 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer",
                            children: [
                              e.jsx("option", { value: "ursa_minor", children: "១. ក្រុមផ្កាយខ្លាឃ្មុំតូច (Ursa Minor)" }),
                              e.jsx("option", { value: "cancer", children: "២. ក្រុមផ្កាយក្តាម (Cancer)" }),
                              e.jsx("option", { value: "scorpius", children: "៣. ក្រុមផ្កាយខ្ទួយ (Scorpius)" }),
                              e.jsx("option", { value: "capricornus", children: "៤. ក្រុមផ្កាយពពែ (Capricornus)" }),
                              e.jsx("option", { value: "canis_major", children: "៥. ក្រុមផ្កាយឆ្កែ (Canis Major)" }),
                              e.jsx("option", { value: "ursa_major", children: "៦. ក្រុមផ្កាយខ្លាឃ្មុំធំ (Ursa Major)" })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 mt-2",
                            children: [
                              e.jsx("div", { className: "font-bold text-amber-800", children: constDetails[selectedConstellation]?.name }),
                              e.jsx("p", { className: "text-slate-600", children: constDetails[selectedConstellation]?.desc })
                            ]
                          })
                        ]
                      })
                    ]
                  }),

                  e.jsxs("div", {
                    className: "lg:col-span-7 bg-amber-50/50 p-5 rounded-2xl border border-amber-200 flex flex-col justify-between shadow-xs",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsxs("span", { className: "text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5", children: [e.jsx("span", { children: "📊" }), " ការវិភាគវិទ្យាសាស្ត្រតារា"] }),
                              e.jsx("span", { className: "text-[11px] font-mono bg-white text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md shadow-xs", children: "រូបវិទ្យាផ្កាយ" })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [
                              e.jsxs("div", {
                                className: "bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs",
                                children: [
                                  e.jsx("div", { className: "text-[11px] text-slate-500 mb-0.5", children: simMode === 'stars_thermal' ? "សីតុណ្ហភាពផ្កាយ" : "ចំនួនផ្កាយចម្បង" }),
                                  e.jsx("div", { className: "text-xl sm:text-2xl font-extrabold font-mono text-amber-600", children: simMode === 'stars_thermal' ? starDetails[selectedStarType]?.temp : "៧ - ៩ ផ្កាយ" }),
                                  e.jsx("div", { className: "text-[10px] text-slate-400 font-mono mt-0.5", children: simMode === 'stars_thermal' ? starDetails[selectedStarType]?.size : "ផ្តុំគ្នាក្នុងលំហ" })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs",
                                children: [
                                  e.jsx("div", { className: "text-[11px] text-slate-500 mb-0.5", children: "ចំណាត់ថ្នាក់" }),
                                  e.jsx("div", { className: "text-xl sm:text-2xl font-extrabold font-mono text-indigo-600", children: simMode === 'stars_thermal' ? starDetails[selectedStarType]?.size : "ក្រុមផ្កាយ" }),
                                  e.jsx("div", { className: "text-[10px] text-slate-400 font-mono mt-0.5", children: "សៀវភៅពុម្ពទំព័រ ១១៩-១២១" })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 shadow-xs",
                            children: [
                              e.jsx("div", { className: "text-slate-500 text-[11px]", children: "ទ្រឹស្តីវិទ្យាសាស្ត្រ (ទំព័រ ១១៩-១២០)៖" }),
                              e.jsx("div", { className: "text-amber-900 font-semibold text-xs sm:text-sm", children: simMode === 'stars_thermal' ? starDetails[selectedStarType]?.formula : "ក្រុមផ្កាយ = ផ្កាយដែលនៅផ្តុំគ្នាក្នុងលំហដ៏ល្វឹងល្វើយ" }),
                              e.jsx("div", { className: "text-slate-600 text-[11px]", children: "ពន្លឺដែលភ្នែកមើលឃើញអាស្រ័យលើចម្ងាយពីផែនដីទៅកាន់ផ្កាយ" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between gap-2 text-xs text-slate-700",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-start gap-2",
                            children: [
                              e.jsx("span", { className: "text-amber-600 mt-0.5", children: "💡" }),
                              e.jsx("div", { children: simMode === 'stars_thermal' ? starDetails[selectedStarType]?.exp : \`ក្រុមផ្កាយ \${constDetails[selectedConstellation]?.name} គឺជាទម្រង់ក្រុមផ្កាយមួយក្នុងចំណោមក្រុមផ្កាយទាំង ៦ ដែលមាននៅក្នុងសៀវភៅពុម្ពទំព័រ ១២១។\` })
                            ]
                          }),
                          e.jsxs("button", {
                            onClick: () => speakText(simMode === 'stars_thermal' ? starDetails[selectedStarType]?.exp : \`ក្រុមផ្កាយ \${constDetails[selectedConstellation]?.name} គឺជាទម្រង់ក្រុមផ្កាយមួយក្នុងចំណោមក្រុមផ្កាយទាំង ៦ ដែលមាននៅក្នុងសៀវភៅពុម្ពទំព័រ ១២១។\`),
                            className: "bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition",
                            children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }) : e.jsxs("div", {
            className: "space-y-6 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs",
            children: [
              // QCM Header
              e.jsxs("div", {
                className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("div", { className: "flex items-center gap-2", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" }), e.jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-amber-700", children: "Step-by-Step QCM (៤០ សំណួរពេញ)" })] }),
                      e.jsx("h3", { className: "text-lg sm:text-xl font-bold text-slate-900 mt-1", children: "កម្រងសំណួរពហុជ្រើសរើស មេរៀនទី ១៧" }),
                      e.jsx("p", { className: "text-xs text-slate-500", children: "ចម្លើយនីមួយៗវែងៗ មានហេតុផលគួបផ្សំ និងជម្រើសបោកបញ្ឆោតស៊ីជម្រៅ (ទំព័រ ១១៩-១២១)" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 shrink-0",
                    children: [
                      e.jsx("span", { className: "text-2xl", children: "🎓" }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("div", { className: "text-[10px] text-slate-500 font-medium", children: "សំណួរទី / ពិន្ទុបច្ចុប្បន្ន" }),
                          e.jsxs("div", {
                            className: "text-sm sm:text-base font-bold font-mono text-slate-900",
                            children: [
                              e.jsx("span", { className: "text-amber-600", children: currentQuestionIndex + 1 }), " / 40",
                              e.jsx("span", { className: "text-slate-300 mx-1", children: "|" }),
                              e.jsx("span", { className: "text-xs font-normal text-slate-500", children: "ត្រូវ: " }),
                              e.jsx("span", { className: "text-emerald-700 font-bold", children: qcmScore })
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
                children: e.jsx("div", {
                  className: "bg-amber-500 h-2.5 rounded-full transition-all duration-300",
                  style: { width: \`\${((currentQuestionIndex + 1) / 40) * 100}%\` }
                })
              }),

              // Question Card
              e.jsxs("div", {
                className: "p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2 flex-wrap",
                        children: [
                          e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200", children: "មេរៀនទី ១៧ - ក្រុមផ្កាយ និងសកល" }),
                          e.jsxs("button", {
                            onClick: () => speakText(currentQ.q),
                            className: "text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold transition cursor-pointer flex items-center gap-1 shadow-xs",
                            children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: isSpeaking ? "កំពុងអាន..." : "ស្ដាប់សំណួរ" })]
                          })
                        ]
                      }),
                      e.jsxs("span", { className: "text-xs font-mono font-semibold text-slate-500", children: ["សំណួរ ", currentQuestionIndex + 1, " នៃ ៤០"] })
                    ]
                  }),

                  e.jsx("div", { className: "text-slate-900 font-semibold text-sm sm:text-base leading-relaxed", children: currentQ.q }),

                  e.jsx("div", {
                    className: "space-y-2.5 pt-2",
                    children: (currentQ.opts || currentQ.options || []).map((opt, optIdx) => {
                      const isCorrectOpt = opt.c || opt.isCorrect;
                      const userChoice = userAnswers[currentQuestionIndex];
                      const hasAns = userChoice !== undefined;

                      let btnStyle = "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700";
                      if (hasAns) {
                        if (isCorrectOpt) {
                          btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-400";
                        } else if (userChoice === optIdx) {
                          btnStyle = "border-rose-400 bg-rose-50 text-rose-950 font-semibold shadow-xs ring-1 ring-rose-300";
                        } else {
                          btnStyle = "border-slate-200 bg-white text-slate-400 opacity-60";
                        }
                      }

                      return e.jsxs("button", {
                        onClick: () => handleAnswer(optIdx),
                        className: \`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition duration-150 active:scale-[0.99] flex items-start gap-3 cursor-pointer \${btnStyle}\`,
                        children: [
                          e.jsx("span", { className: "font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 shrink-0 text-slate-800", children: ['ក.', 'ខ.', 'គ.', 'ឃ.'][optIdx] }),
                          e.jsx("span", { className: "flex-grow pt-0.5", children: opt.t || opt.text }),
                          hasAns && isCorrectOpt && e.jsx("span", { className: "text-emerald-600 font-bold ml-auto shrink-0", children: "✓" }),
                          hasAns && userChoice === optIdx && !isCorrectOpt && e.jsx("span", { className: "text-rose-600 font-bold ml-auto shrink-0", children: "✕" })
                        ]
                      }, optIdx);
                    })
                  }),

                  userAnswers[currentQuestionIndex] !== undefined && e.jsxs("div", {
                    className: \`text-xs sm:text-sm p-4 rounded-2xl border space-y-2.5 shadow-xs \${userAnswers[currentQuestionIndex] === (currentQ.opts || currentQ.options).findIndex(o => o.c || o.isCorrect) ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}\`,
                    children: [
                      e.jsxs("div", {
                        className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-black/10 pb-2.5",
                        children: [
                          e.jsxs("div", {
                            className: "font-bold text-sm flex items-center gap-2",
                            children: [
                              e.jsx("span", { className: "text-base", children: userAnswers[currentQuestionIndex] === (currentQ.opts || currentQ.options).findIndex(o => o.c || o.isCorrect) ? "✅" : "❌" }),
                              e.jsx("span", { children: userAnswers[currentQuestionIndex] === (currentQ.opts || currentQ.options).findIndex(o => o.c || o.isCorrect) ? "ចម្លើយត្រឹមត្រូវ!" : "ចម្លើយមិនទាន់ត្រឹមត្រូវទេ!" })
                            ]
                          }),
                          e.jsxs("button", {
                            onClick: () => speakText((currentQ.opts || currentQ.options)[(currentQ.opts || currentQ.options).findIndex(o => o.c || o.isCorrect)]?.e || currentQ.exp || currentQ.explanation),
                            className: "text-xs bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl font-extrabold cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs transition active:scale-95",
                            children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់ចម្លើយ" })]
                          })
                        ]
                      }),
                      e.jsx("div", { className: "text-xs sm:text-sm leading-relaxed", children: (currentQ.opts || currentQ.options)[(currentQ.opts || currentQ.options).findIndex(o => o.c || o.isCorrect)]?.e || currentQ.exp || currentQ.explanation })
                    ]
                  })
                ]
              }),

              // Step Navigation Controls
              e.jsxs("div", {
                className: "pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      e.jsxs("button", {
                        onClick: () => setCurrentQuestionIndex(prev => Math.max(0, prev - 1)),
                        disabled: currentQuestionIndex === 0,
                        className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
                        children: [e.jsx("span", { children: "◄" }), e.jsx("span", { children: "សំណួរមុន" })]
                      }),
                      e.jsxs("button", {
                        onClick: () => setCurrentQuestionIndex(prev => Math.min(39, prev + 1)),
                        disabled: currentQuestionIndex === 39,
                        className: "px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
                        children: [e.jsx("span", { children: "សំណួរបន្ទាប់" }), e.jsx("span", { children: "►" })]
                      })
                    ]
                  }),
                  e.jsxs("button", {
                    onClick: () => { setUserAnswers({}); setCurrentQuestionIndex(0); setQcmScore(0); },
                    className: "px-3.5 py-2 bg-white hover:bg-slate-50 text-rose-600 text-xs font-semibold rounded-xl transition border border-rose-200 flex items-center gap-1 shadow-xs cursor-pointer",
                    children: [e.jsx("span", { children: "🔄" }), e.jsx("span", { children: "ចាប់ផ្តើមឡើងវិញ" })]
                  })
                ]
              }),

              // Quick Grid Navigator
              e.jsxs("div", {
                className: "pt-4 border-t border-slate-100 space-y-2",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between text-xs text-slate-600",
                    children: [
                      e.jsx("span", { className: "font-semibold", children: "រំលងទៅកាន់សំណួរជាក់លាក់៖" }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 text-[11px]",
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
                    children: Array.from({ length: 40 }).map((_, idx) => {
                      const ans = userAnswers[idx];
                      const qItem = ${JSON.stringify(l17Questions)}[idx];
                      let bg = "bg-slate-100 text-slate-700 hover:bg-slate-200";
                      let ring = idx === currentQuestionIndex ? "ring-2 ring-amber-500 font-bold" : "";

                      if (ans !== undefined && qItem) {
                        const correctIdx = (qItem.opts || qItem.options || []).findIndex(o => o.c || o.isCorrect);
                        if (ans === correctIdx) {
                          bg = "bg-emerald-600 text-white font-semibold";
                        } else {
                          bg = "bg-rose-500 text-white font-semibold";
                        }
                      }

                      return e.jsx("button", {
                        onClick: () => setCurrentQuestionIndex(idx),
                        className: \`w-full py-1.5 rounded-lg text-xs font-mono transition text-center cursor-pointer \${bg} \${ring}\`,
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
  })
}`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace Rz17 definition with the updated voice explanation code
  const rz17Start = code.indexOf('Rz17=({');
  const rz16Start = code.indexOf('Rz16=({', rz17Start !== -1 ? rz17Start : 0);
  if (rz17Start !== -1 && rz16Start !== -1) {
    code = code.slice(0, rz17Start) + updatedRz17Code + ",\n" + code.slice(rz16Start);
    console.log("Replaced Rz17 with active voice explanation buttons in " + filePath);
  }

  try {
    esbuild.transformSync(code, { loader: 'js' });
    console.log("Validation SUCCESS for " + filePath);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log("Saved updated " + filePath + " successfully!");
  } catch (err) {
    console.error("Validation error in " + filePath + ":", err.message);
    process.exit(1);
  }
}

console.log("=== All files successfully updated with Active Explanation Audio Speech ===");
