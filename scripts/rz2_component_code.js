
var Rz2 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a); const [currentQIndex, setCurrentQIndex] = y.useState(0); const [userAnswers, setUserAnswers] = y.useState({}); const [isFinished, setIsFinished] = y.useState(!1);
  const [l, o] = y.useState(!1);
  const [c, d] = y.useState(0);
  const [u, h] = y.useState(!1);

  // Soil prep step state
  const [soilStep, setSoilStep] = y.useState(1);
  const [soilType, setSoilType] = y.useState("loam");

  // Seed method state
  const [seedMethod, setSeedMethod] = y.useState("direct");

  // Care topic state
  const [careTopic, setCareTopic] = y.useState("water");
  const [mulchOn, setMulchOn] = y.useState(!0);

  // Harvest topic state
  const [harvestCrop, setHarvestCrop] = y.useState("veg");

  // Lab simulator states
  const [labCrop, setLabCrop] = y.useState("tomato");
  const [labWater, setLabWater] = y.useState(2);
  const [labSun, setLabSun] = y.useState(2);
  const [labFert, setLabFert] = y.useState("compost");
  const [labWeeds, setLabWeeds] = y.useState(!1);

  // Matching & Sequence games states
  const [seqSteps, setSeqSteps] = y.useState([2, 5, 1, 4, 3]);
  const [seqResult, setSeqResult] = y.useState(null);
  const [matchAns, setMatchAns] = y.useState({ 1: "", 2: "", 3: "", 4: "", 5: "" });
  const [matchResult, setMatchResult] = y.useState(null);

  // 40 QCM states
  const [Y, U] = y.useState(0);
  const [q, ae] = y.useState({});
  const [ie, re] = y.useState(!1);
  const [toastMsg, setToastMsg] = y.useState(null);

  y.useEffect(() => {
    a && i(a);
  }, [a, r]);

  const J = Ie => {
    try {
      const De = window.AudioContext || window.webkitAudioContext;
      if (!De) return;
      const Be = new De(), be = Be.createOscillator(), Qe = Be.createGain();
      be.connect(Qe), Qe.connect(Be.destination);
      const Et = Be.currentTime;
      Ie === "correct" ? (
        be.type = "triangle",
        be.frequency.setValueAtTime(523.25, Et),
        be.frequency.exponentialRampToValueAtTime(783.99, Et + .15),
        be.frequency.exponentialRampToValueAtTime(1046.5, Et + .3),
        Qe.gain.setValueAtTime(.2, Et),
        Qe.gain.exponentialRampToValueAtTime(.01, Et + .35),
        be.start(Et),
        be.stop(Et + .35)
      ) : Ie === "wrong" ? (
        be.type = "sawtooth",
        be.frequency.setValueAtTime(300, Et),
        be.frequency.linearRampToValueAtTime(180, Et + .25),
        Qe.gain.setValueAtTime(.18, Et),
        Qe.gain.exponentialRampToValueAtTime(.01, Et + .3),
        be.start(Et),
        be.stop(Et + .3)
      ) : Ie === "click" && (
        be.type = "sine",
        be.frequency.setValueAtTime(600, Et),
        Qe.gain.setValueAtTime(.04, Et),
        Qe.gain.exponentialRampToValueAtTime(.001, Et + .08),
        be.start(Et),
        be.stop(Et + .08)
      );
    } catch (e) {}
  };

  const se = () => {
    try {
      rd({ particleCount: 85, spread: 75, origin: { y: .6 } });
    } catch (e) {}
  };

  const showNotif = (title, message, isSuccess = !0) => {
    setToastMsg({ title, message, isSuccess });
    setTimeout(() => { setToastMsg(null); }, 3800);
  };

  const me = () => {
    if (!("speechSynthesis" in window)) {
      showNotif("មិនគាំទ្រ", "Browser របស់អ្នកមិនគាំទ្រមុខងារអានជាសំឡេងឡើយ។", !1);
      return;
    }
    if (u) {
      window.speechSynthesis.cancel();
      h(!1);
      return;
    }
    const Ie = n === "tab-hero"
      ? "មេរៀនទី ២ ៖ ការដាំដំណាំ ថ្នាក់ទី ៦។ កសិកម្មជាប្រភពស្បៀង និងសេដ្ឋកិច្ចដ៏សំខាន់។ ការដាំដំណាំតម្រូវឱ្យមានបច្ចេកទេសត្រឹមត្រូវចាប់ពីការរៀបចំដី ការជ្រើសរើសពូជ វិធីសាស្ត្រដាំដុះ ការថែទាំ ការប្រមូលផល និងការរក្សាទុក។"
      : n === "tab-soil"
      ? "ចំណុចទី ១ ការរៀបចំដី និងជ្រើសរើសទីតាំង។ ត្រូវជ្រើសរើសកន្លែងមានពន្លឺថ្ងៃ និងទឹកគ្រប់គ្រាន់។ ការកាប់គាស់ ភ្ជួររាស់ និងហាលដីជួយសម្លាប់មេរោគផ្សិត និងសត្វល្អិតចង្រៃ។ ការលើករងជួយកុំឱ្យជាំទឹក។"
      : n === "tab-seed"
      ? "ចំណុចទី ២ ការជ្រើសរើសពូជ និងវិធីដាំ។ ពូជល្អត្រូវមានគ្រាប់ថ្លោស គ្មានជំងឺ គ្មានសត្វល្អិតស៊ី និងដំណុះខ្ពស់។ វិធីដាំមាន ៣ គឺ ដាំដោយគ្រាប់ផ្ទាល់ ដាំដោយបណ្តុះកូន និងដាំដោយកាត់មែកឬមើមដោត។"
      : n === "tab-care"
      ? "ចំណុចទី ៣ ការថែទាំដំណាំ។ ការស្រោចទឹកពេលត្រជាក់ ការជ្រំដីឱ្យធូរ ការជម្រះស្មៅកុំឱ្យដណ្តើមជី ការដាក់ជីកំប៉ុស្ត និងការការពារសត្វល្អិតតាមបែបធម្មជាតិ។"
      : n === "tab-harvest"
      ? "ចំណុចទី ៤ ការប្រមូលផល និងការរក្សាទុក។ ត្រូវប្រមូលផលពេលព្រឹកត្រជាក់ដោយប្រើកន្ត្រៃមុត កុំឱ្យជាំ។ បន្លែស្រស់ទុកកន្លែងត្រជាក់ស្ងួត ឯគ្រាប់ធញ្ញជាតិត្រូវហាលឱ្យស្ងួតល្អមុនដាក់ជង្រុក។"
      : n === "tab-lab"
      ? "មន្ទីរពិសោធន៍ដាំដំណាំអន្តរកម្ម។ សាកល្បងកែប្រែកម្រិតទឹក ពន្លឺព្រះអាទិត្យ ជីជាតិ និងការជម្រះស្មៅ ដើម្បីតាមដានការលូតលាស់នៃដំណាំរបស់អ្នក។"
      : n === "tab-match"
      ? "ល្បែងផ្គូផ្គង និងរៀបលំដាប់លំដោយ ៥ ជំហាននៃការដាំដំណាំ និងការផ្គូផ្គងប្រភេទដំណាំទៅនឹងវិធីដាំដុះ។"
      : `កម្រង ៤០ សំណួរ QCM មេរៀនទី ២ ៖ ការដាំដំណាំ។ សំណួរទី ${Y + 1} ៖ ${Zi2[Y].question}`;

    const De = new SpeechSynthesisUtterance(Ie);
    De.lang = "km-KH";
    De.rate = .9;
    De.onstart = () => h(!0);
    De.onend = () => h(!1);
    De.onerror = () => h(!1);
    window.speechSynthesis.speak(De);
  };

  const addProgress = amt => {
    d(prev => Math.min(100, prev + amt));
  };

  // Lab calculations
  const calcLabStatus = () => {
    let score = 100;
    let issues = [];
    if (labWater === 1) { score -= 35; issues.push("ដំណាំខ្វះទឹក ធ្វើឱ្យស្លឹកស្រពោន និងក្រិន!"); }
    if (labWater === 3) { score -= 40; issues.push("ដីជាំទឹកខ្លាំង ឫសខ្វះអុកស៊ីសែន និងចាប់ផ្តើមរលួយឫស!"); }
    if (labSun === 1) { score -= 30; issues.push("ខ្វះពន្លឺថ្ងៃ ដំណាំមិនអាចធ្វើរស្មីសំយោគ ដើមស្គមលឿង!"); }
    if (labSun === 3) { score -= 25; issues.push("កម្ដៅថ្ងៃក្តៅហួតហែងខ្លាំង ធ្វើឱ្យស្លឹកឆេះរលាក!"); }
    if (labFert === "none") { score -= 20; issues.push("ខ្វះជីជាតិបំប៉ន ដំណាំលូតលាស់យឺត!"); }
    if (labFert === "excess_chemical") { score -= 30; issues.push("ជីគីមីលើសកម្រិត ធ្វើឱ្យប្រៃដី និងឆេះរលាកឫស!"); }
    if (labWeeds) { score -= 25; issues.push("ស្មៅចង្រៃដុះជោកជាំដណ្តើមពន្លឺ ទឹក និងជីវជាតិពីដំណាំ!"); }

    score = Math.max(10, score);
    const health = score >= 80 ? "ផ្លែផ្កាលូតលាស់ល្អបរិបូរណ៍ (Healthy & High Yield)"
      : score >= 50 ? "លូតលាស់មធ្យម ត្រូវការការថែទាំបន្ថែម (Fair Growth)"
      : "ដំណាំមានសភាពធ្ងន់ធ្ងរ ជិតងាប់ (Critical / Severe Stress)";
    const color = score >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-300"
      : score >= 50 ? "text-amber-700 bg-amber-50 border-amber-300"
      : "text-rose-700 bg-rose-50 border-rose-300";

    const cropNames = { tomato: "ប៉េងប៉ោះ 🍅", corn: "ពោត 🌽", bean: "សណ្តែក 🫘", chili: "ម្ទេស 🌶️", cabbage: "ស្ពៃ 🥬" };
    return { score, issues, health, color, cropName: cropNames[labCrop] };
  };

  const labStatus = calcLabStatus();

  // Sequence game checker
  const checkSequence = () => {
    const isCorrect = seqSteps.join(",") === "1,2,3,4,5";
    if (isCorrect) {
      J("correct");
      se();
      setSeqResult({ ok: !0, msg: "ត្រឹមត្រូវឥតខ្ចោះ! ៥ ជំហាននៃការដាំដំណាំគឺ ៖ ១. រៀបចំដី -> ២. ជ្រើសរើសពូជ -> ៣. ដាំដុះ -> ៤. ថែទាំ -> ៥. ប្រមូលផល" });
      addProgress(20);
    } else {
      J("wrong");
      setSeqResult({ ok: !1, msg: "មិនទាន់ត្រឹមត្រូវទេ! សូមពិនិត្យមើលលំដាប់លំដោយឡើងវិញ ចាប់ពីការរៀបចំដីរហូតដល់ប្រមូលផល។" });
    }
  };

  const resetSequence = () => {
    setSeqSteps([2, 5, 1, 4, 3]);
    setSeqResult(null);
    J("click");
  };

  const moveSeq = (from, to) => {
    if (to < 0 || to >= seqSteps.length) return;
    const next = [...seqSteps];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSeqSteps(next);
    J("click");
  };

  // Crop matching checker
  const checkMatches = () => {
    // 1: ពោត -> direct, 2: ប៉េងប៉ោះ -> transplant, 3: ដំឡូងមី -> cutting, 4: ស្ពៃ -> transplant, 5: អំពៅ -> cutting
    const correctMap = { 1: "direct", 2: "transplant", 3: "cutting", 4: "transplant", 5: "cutting" };
    let correctCount = 0;
    for (let k = 1; k <= 5; k++) {
      if (matchAns[k] === correctMap[k]) correctCount++;
    }
    if (correctCount === 5) {
      J("correct");
      se();
      setMatchResult({ ok: !0, msg: "អស្ចារ្យណាស់! អ្នកបានផ្គូផ្គងដំណាំទាំង ៥ មុខទៅនឹងវិធីដាំដុះបានត្រឹមត្រូវ ១០០%!" });
      addProgress(20);
    } else {
      J("wrong");
      setMatchResult({ ok: !1, msg: `អ្នកឆ្លើយត្រូវបាន ${correctCount} លើ ៥។ សូមពិនិត្យមើលប្រភេទដំណាំនីមួយៗឡើងវិញ!` });
    }
  };

  const resetMatches = () => {
    setMatchAns({ 1: "", 2: "", 3: "", 4: "", 5: "" });
    setMatchResult(null);
    J("click");
  };

  // 40 QCM answer handler
  const handleAnswer = (qIdx, optIdx) => {
    if (q[qIdx] !== undefined) return;
    const isCorr = Zi2[qIdx].options[optIdx].isCorrect;
    ae(prev => ({ ...prev, [qIdx]: optIdx }));
    re(!0);
    if (isCorr) {
      J("correct");
      addProgress(2.5);
    } else {
      J("wrong");
    }
  };

  const nextQuestion = () => {
    if (Y < Zi2.length - 1) {
      Y === Zi2.length - 2 && se();
      U(prev => prev + 1);
      re(q[Y + 1] !== undefined);
      J("click");
    }
  };

  const prevQuestion = () => {
    if (Y > 0) {
      U(prev => prev - 1);
      re(q[Y - 1] !== undefined);
      J("click");
    }
  };

  const calcQuizStats = () => {
    let corr = 0;
    Object.keys(q).forEach(k => {
      const idx = parseInt(k);
      const chosen = q[idx];
      if (Zi2[idx].options[chosen] && Zi2[idx].options[chosen].isCorrect) corr++;
    });
    return { answered: Object.keys(q).length, correct: corr };
  };

  const quizStats = calcQuizStats();

  const navTabs = [
    { id: "tab-hero", label: "១. ទិដ្ឋភាពទូទៅ", icon: "🌱" },
    { id: "tab-soil", label: "២. ការរៀបចំដី", icon: "🚜" },
    { id: "tab-seed", label: "៣. ពូជ & វិធីដាំ", icon: "🌾" },
    { id: "tab-care", label: "៤. ការថែទាំដំណាំ", icon: "💧" },
    { id: "tab-harvest", label: "៥. ប្រមូលផល & រក្សាទុក", icon: "🧺" },
    { id: "tab-lab", label: "៦. មន្ទីរពិសោធន៍ដាំដុះ", icon: "🔬" },
    { id: "tab-match", label: "៧. ល្បែងផ្គូផ្គង & រៀបលំដាប់", icon: "🧩" },
    { id: "tab-quiz", label: "៨. កម្រង ៤០ សំណួរ QCM", icon: "❓", special: !0 }
  ];

  const soilStepsInfo = {
    1: {
      title: "១. ការជ្រើសរើសទីតាំង (Site Selection)",
      tag: "ជំហានគ្រឹះ",
      desc: "ត្រូវជ្រើសរើសទីតាំងដែលមានពន្លឺព្រះអាទិត្យគ្រប់គ្រាន់យ៉ាងតិច ៦ ម៉ោងក្នុងមួយថ្ងៃ នៅក្បែរប្រភពទឹកស្អាតសម្រាប់ស្រោចស្រព និងជាទីទួលខ្ពស់ល្មមមិនលិចទឹកនៅរដូវវស្សា។ ជៀសវាងទីតាំងក្រោមម្លប់ឈើធំៗ ឬកន្លែងដែលមានខ្យល់ព្យុះបោកបក់ខ្លាំង។",
      tip: "គន្លឹះគ្រូ ៖ «ទីតាំងល្អ គឺមានពន្លឺថ្ងៃពេញលេញ ជិតប្រភពទឹក និងបង្ហូរទឹកបានលឿនកុំឱ្យជាំទឹក»។",
      icon: "☀️"
    },
    2: {
      title: "២. ការកាប់គាស់ និងភ្ជួររាស់ (Plowing & Tilling)",
      tag: "ធ្វើឱ្យដីធូរ",
      desc: "កាប់គាស់ ឬភ្ជួរដីឱ្យបានជម្រៅពី ២០ ទៅ ៣០ សង់ទីម៉ែត្រ។ ការភ្ជួររាស់ជួយបំបែកដីដុំធំៗឱ្យម៉ដ្ឋធូរ ជួយឱ្យខ្យល់អុកស៊ីសែននិងទឹកជ្រាបចូលស្រួល និងជួយឱ្យឫសដំណាំដុះចាក់ជ្រៅស្វែងរកជីវជាតិបានងាយស្រួល។",
      tip: "គន្លឹះគ្រូ ៖ ត្រូវរាស់ពង្រាបដី និងបំបែកដីដុំឱ្យម៉ដ្ឋ ដើម្បីកូនដំណាំងាយដុះឫស។",
      icon: "⛏️"
    },
    3: {
      title: "៣. ការហាលដីសម្លាប់មេរោគ (Solarization)",
      tag: "កម្ចាត់ជំងឺ & សត្វល្អិត",
      desc: "ក្រោយពេលភ្ជួររាស់រួច ត្រូវហាលដីឱ្យត្រូវកម្ដៅថ្ងៃស្ងួតរយៈពេលពី ៧ ទៅ ១០ ថ្ងៃ។ កម្ដៅថ្ងៃក្តៅជួយសម្លាប់ពងដង្កូវ សត្វល្អិតចង្រៃ មេរោគផ្សិតដែលបង្កជំងឺរលួយឫស និងគ្រាប់ស្មៅចង្រៃដែលមាននៅក្នុងដី។",
      tip: "គន្លឹះគ្រូ ៖ ការហាលដីជាវិធីសម្លាប់មេរោគតាមបែបធម្មជាតិដ៏មានប្រសិទ្ធភាពបំផុត ដោយមិនបាច់ប្រើសារធាតុគីមីឡើយ។",
      icon: "🔥"
    },
    4: {
      title: "៤. ការលើករងដំណាំ (Raised Bed Preparation)",
      tag: "ការពារការជាំទឹក",
      desc: "លើករងដំណាំឱ្យមានកម្ពស់ពី ២០ ទៅ ៣០ សង់ទីម៉ែត្រ ទទឹងពី ១ ម៉ែត្រ ទៅ ១.២ ម៉ែត្រ និងបណ្តោយតាមទំហំដី (គួរតម្រង់តាមទិសថ្ងៃរះ-លិច)។ ចន្លោះរងត្រូវទុកពី ៤០ ទៅ ៥០ សង់ទីម៉ែត្រជាផ្លូវដើរ និងជាប្រឡាយបង្ហូរទឹកភ្លៀងកុំឱ្យជាំលើរង។",
      tip: "គន្លឹះគ្រូ ៖ ទទឹង ១ ទៅ ១.២ ម៉ែត្រ ជួយឱ្យកសិករឈោងដៃថែទាំពីសងខាងដោយមិនបាច់ជាន់លើរងឡើយ។",
      icon: "📐"
    },
    5: {
      title: "៥. ការដាក់ជីទ្រាប់បាត (Basal Fertilization)",
      tag: "ផ្តល់ជីវជាតិគ្រឹះ",
      desc: "មុនដាំដុះ ត្រូវដាក់ជីកំប៉ុស្ត ឬជីលាមកសត្វពុកផុយស្ងួតលាយជាមួយផេះអង្កាម និងដីលើរងឱ្យសព្វ។ ជីទ្រាប់បាតជួយបង្កើនជីវជាតិដីយូរអង្វែង ជួយរក្សាសំណើម និងជួយឱ្យឫសកូនដំណាំស្រូបយកអាហារបានភ្លាមៗក្រោយពេលដាំ។",
      tip: "គន្លឹះគ្រូ ៖ កុំប្រើលាមកសត្វស្រស់ ព្រោះវាបង្កកម្ដៅក្តៅឆេះឫស និងផ្ទុកមេរោគផ្សិត។ ត្រូវប្រើតែជីដែលពុកផុយល្អប៉ុណ្ណោះ។",
      icon: "🌱"
    }
  };

  const seedMethodsInfo = {
    direct: {
      title: "១. វិធីដាំដោយគ្រាប់ផ្ទាល់ (Direct Seeding)",
      badge: "គ្រាប់ធំ & ឫសកែវវែង",
      crops: "ពោត, សណ្តែកបាយ, សណ្តែកដី, ត្រសក់, ឪឡឹក, ល្ពៅ",
      steps: "ជីករណ្តៅតូចៗចន្លោះ ២០-៣០cm ដាក់គ្រាប់ ២-៣ គ្រាប់ក្នុងមួយរណ្តៅ ជម្រៅ ២-៣cm រួចលប់ដីស្តើងៗ និងស្រោចទឹក។ នៅពេលដុះពន្លក ត្រូវដកជម្រុះទុកតែកូនដែលថ្លោសរឹងមាំ ១-២ ដើមក្នុងមួយគុម្ព។",
      pros: "មិនបាច់ចំណាយពេលបណ្តុះកូន ឫសកែវដុះចាក់ជ្រៅរឹងមាំ មិនរំខានឬដាច់ឫស។",
      icon: "🌽"
    },
    transplant: {
      title: "២. វិធីដាំដោយបណ្តុះកូនរួចស្ទូង (Transplanting)",
      badge: "គ្រាប់តូច & ត្រូវការការថែទាំ",
      crops: "ប៉េងប៉ោះ, ម្ទេស, ស្ពៃចង្កឹះ, ស្ពៃក្តោប, សាឡាត់, ត្រប់",
      steps: "ព្រោះគ្រាប់ក្នុងកញ្ច្រែង ឬថ្នាលបណ្តុះដែលមានដីម៉ដ្ឋលាយជីកំប៉ុស្ត។ ស្រោចទឹកថ្នមៗ និងដាក់ក្រោមម្លប់ស្រាល។ នៅពេលកូនដំណាំមានអាយុ ២០-២៥ ថ្ងៃ (មានស្លឹកពិត ៣-៤ សន្លឹក) ត្រូវដកយកទៅស្ទូងលើរងនៅពេលរសៀលត្រជាក់។",
      pros: "ការពារគ្រាប់កុំឱ្យទឹកភ្លៀងហូរនាំយក សន្សំគ្រាប់ពូជ និងជ្រើសរើសបានតែកូនដែលថ្លោសយកទៅដាំ។",
      icon: "🍅"
    },
    cutting: {
      title: "៣. វិធីដាំដោយផ្នែករុក្ខជាតិ / ដោតមែក (Vegetative Propagation)",
      badge: "បន្តពូជអសេក្ខ / កាត់កង់ដើម",
      crops: "ដំឡូងមី, អំពៅ, ត្រកួន, ស្លឹកគ្រៃ, ខ្ញី, រមៀត",
      steps: "កាត់កំណាត់ដើម ឬមែកដែលចាស់ល្មម ប្រវែងប្រហែល ២០-២៥cm (មានភ្នែក ២-៣) រួចដោតទ្រេតក្នុងដីជម្រៅប្រហែលកន្លះកំណាត់។ ចំពោះស្លឹកគ្រៃត្រូវបំបែកគុម្ព ឯខ្ញីត្រូវកាត់កង់មើមដែលមានពន្លកយកទៅដាំ។",
      pros: "ដុះលឿន ទទួលបានលក្ខណៈសម្បត្តិដូចដើមមេ ១០០% និងមិនបាច់រង់ចាំគ្រាប់។",
      icon: "🌿"
    }
  };

  return e.jsx("div", {
    className: `fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex flex-col ${l ? "p-0" : "p-2 sm:p-4 md:p-6"}`,
    children: e.jsxs("div", {
      className: `bg-slate-50 text-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-500/30 w-full ${l ? "h-screen rounded-none" : "w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto min-h-[90vh]"}`,
      children: [
        // Top bar
        e.jsx("header", {
          className: "bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs",
          children: e.jsxs("div", {
            className: "flex items-center justify-between w-full gap-4",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  e.jsx("div", {
                    className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xl shadow-md",
                    children: "🌱"
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsx("span", { className: "text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                          e.jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "ជំពូកទី ១ • មេរៀនទី ២" })
                        ]
                      }),
                      e.jsx("h1", {
                        className: "text-sm sm:text-base font-bold text-slate-900 leading-tight font-moul",
                        children: "មេរៀនទី ២ ៖ ការដាំដំណាំ (Crop Cultivation)"
                      })
                    ]
                  })
                ]
              }),
              e.jsxs("div", {
                className: "flex items-center gap-2 sm:gap-3",
                children: [
                  e.jsxs("button", {
                    onClick: me,
                    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${u ? "bg-rose-50 text-rose-700 border border-rose-300 animate-pulse" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"}`,
                    title: "អានមេរៀនជាសំឡេងខ្មែរ",
                    children: [
                      e.jsx("span", { children: u ? "🔊" : "🔈" }),
                      e.jsx("span", { className: "hidden sm:inline", children: u ? "កំពុងអាន..." : "អានជាសំឡេង" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "hidden md:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200",
                    children: [
                      e.jsx("span", { className: "text-[11px] font-bold text-amber-800", children: "វឌ្ឍនភាព ៖" }),
                      e.jsxs("span", { className: "text-xs font-bold text-amber-900", children: [c, " %"] })
                    ]
                  }),
                  e.jsx("button", {
                    onClick: () => o(!l),
                    className: "p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer",
                    title: l ? "ចាកចេញពីពេញអេក្រង់" : "ពេញអេក្រង់",
                    children: l ? "⤓" : "⤢"
                  }),
                  e.jsx("button", {
                    onClick: t,
                    className: "p-2 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-xl transition cursor-pointer font-bold",
                    title: "បិទផ្ទាំង",
                    children: "✕"
                  })
                ]
              })
            ]
          })
        }),

        // Navigation tab bar
        e.jsx("nav", {
          className: "bg-emerald-950 text-white shadow-inner border-t border-emerald-900",
          children: e.jsx("div", {
            className: "w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto px-2 sm:px-6 lg:px-8",
            children: e.jsx("div", {
              className: "flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar text-xs sm:text-sm font-medium",
              children: navTabs.map(item => {
                const isActive = n === item.id;
                return e.jsxs("button", {
                  onClick: () => { J("click"); i(item.id); },
                  className: `px-3.5 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${isActive ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md font-bold" : item.special ? "bg-amber-600/30 text-amber-200 hover:bg-amber-600 hover:text-white" : "bg-transparent text-emerald-100 hover:bg-emerald-800/40"}`,
                  children: [
                    e.jsx("span", { children: item.icon }),
                    e.jsx("span", { children: item.label })
                  ]
                }, item.id);
              })
            })
          })
        }),

        // Main body container
        e.jsxs("main", {
          className: "flex-1 w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full overflow-y-auto",
          children: [
            // Toast notification
            toastMsg && e.jsxs("div", {
              className: `mb-4 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-in fade-in ${toastMsg.isSuccess ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-rose-50 border-rose-300 text-rose-800"}`,
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    e.jsx("span", { children: toastMsg.isSuccess ? "✅" : "⚠️" }),
                    e.jsxs("span", { children: [toastMsg.title, " ៖ ", toastMsg.message] })
                  ]
                }),
                e.jsx("button", { onClick: () => setToastMsg(null), className: "text-slate-400 hover:text-slate-700", children: "✕" })
              ]
            }),

            // Tab 1: Hero Overview
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsx("div", {
                  className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white p-6 sm:p-10 shadow-2xl border border-emerald-700/40",
                  children: e.jsxs("div", {
                    className: "relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center",
                    children: [
                      e.jsxs("div", {
                        className: "lg:col-span-7 space-y-4",
                        children: [
                          e.jsx("div", {
                            className: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm",
                            children: e.jsx("span", { children: "🌾 ជំពូកទី ១ • រុក្ខជាតិ និងសត្វ • ទំព័រ ៨-១៤" })
                          }),
                          e.jsx("h2", {
                            className: "text-2xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-teal-100 to-amber-200 font-moul leading-tight",
                            children: "ការដាំដំណាំ"
                          }),
                          e.jsx("p", {
                            className: "text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light",
                            children: "ដំណាំកសិកម្មផ្តល់នូវស្បៀងអាហារ វីតាមីន និងប្រាក់ចំណូលដ៏សំខាន់សម្រាប់គ្រួសារ និងសង្គមជាតិ។ ការដាំដំណាំឱ្យទទួលបានទិន្នផលខ្ពស់ទាមទារការយល់ដឹងពីបច្ចេកទេស ៤ ដំណាក់កាល ៖ ការរៀបចំដី ការជ្រើសរើសពូជ ការថែទាំ និងការប្រមូលផល!"
                          }),
                          e.jsxs("div", {
                            className: "flex flex-wrap items-center gap-3 pt-2",
                            children: [
                              e.jsxs("button", {
                                onClick: () => { J("click"); i("tab-soil"); addProgress(10); },
                                className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2",
                                children: [e.jsx("span", { children: "🚜" }), e.jsx("span", { children: "ចាប់ផ្តើមរៀនពីការរៀបចំដី" })]
                              }),
                              e.jsxs("button", {
                                onClick: () => { J("click"); i("tab-quiz"); },
                                className: "px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 text-xs sm:text-sm font-bold backdrop-blur-sm transition cursor-pointer flex items-center gap-2",
                                children: [e.jsx("span", { children: "❓" }), e.jsx("span", { children: "ប្រឡង ៤០ សំណួរ QCM" })]
                              })
                            ]
                          })
                        ]
                      }),
                      e.jsx("div", {
                        className: "lg:col-span-5 relative",
                        children: e.jsxs("div", {
                          className: "rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl relative bg-slate-900 group",
                          children: [
                            e.jsx("img", {
                              src: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800",
                              alt: "កសិកម្មដាំដំណាំ",
                              className: "w-full h-56 sm:h-64 object-cover opacity-90 group-hover:scale-105 transition duration-500"
                            }),
                            e.jsxs("div", {
                              className: "absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs text-emerald-100",
                              children: [
                                e.jsx("p", { className: "font-bold text-white text-sm mb-0.5", children: "បន្លែសុវត្ថិភាពពីធម្មជាតិ 🌱" }),
                                e.jsx("p", { className: "text-[11px] opacity-90", children: "ដាំដោយប្រើជីកំប៉ុស្តសរីរាង្គ គ្មានជាតិគីមីពុល ផ្តល់សុខភាពល្អ!" })
                              ]
                            })
                          ]
                        })
                      })
                    ]
                  })
                }),

                // 4 essential factors of plant growth
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between border-b border-slate-100 pb-4",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "text-xs font-bold text-emerald-600 uppercase tracking-wider", children: "ទ្រឹស្តីវិទ្យាសាស្ត្រគ្រឹះ" }),
                            e.jsx("h3", { className: "text-lg sm:text-xl font-bold text-slate-900", children: "កត្តាចាំបាច់ទាំង ៤ សម្រាប់ដំណាំលូតលាស់" })
                          ]
                        }),
                        e.jsx("span", { className: "text-2xl", children: "☀️💧🌱💨" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                      children: [
                        { icon: "☀️", title: "១. ពន្លឺព្រះអាទិត្យ", desc: "ផ្តល់ថាមពលសម្រាប់ស្លឹកធ្វើរស្មីសំយោគ ផលិតជាតិស្ករនិងអាហារចិញ្ចឹមរុក្ខជាតិ។", color: "amber" },
                        { icon: "💧", title: "២. ទឹក និងសំណើម", desc: "រំលាយសារធាតុរ៉ែក្នុងដី និងដឹកនាំជីវជាតិពីឫសទៅកាន់គ្រប់ផ្នែកនៃរុក្ខជាតិ។", color: "sky" },
                        { icon: "🌱", title: "៣. ដី និងជីជាតិ", desc: "ជាជម្រកទប់លំនឹងឫស និងផ្ទុកជីវជាតិសំខាន់ៗ NPK សម្រាប់បង្កើតកោសិកា។", color: "emerald" },
                        { icon: "💨", title: "៤. ខ្យល់អាកាស", desc: "ផ្តល់ឧស្ម័នកាបូនិច (CO2) សម្រាប់ស្លឹក និងអុកស៊ីសែន (O2) សម្រាប់ឫសដកដង្ហើម។", color: "indigo" }
                      ].map((item, idx) => e.jsxs("div", {
                        className: `p-4 rounded-2xl border bg-${item.color}-50/40 border-${item.color}-200 space-y-2`,
                        children: [
                          e.jsx("div", { className: "text-3xl", children: item.icon }),
                          e.jsx("h4", { className: "font-bold text-slate-900 text-sm", children: item.title }),
                          e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: item.desc })
                        ]
                      }, idx))
                    })
                  ]
                }),

                // 4 stages cards
                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                  children: [
                    { step: "១", title: "ការរៀបចំដី & លើករង", desc: "កាប់គាស់ ភ្ជួររាស់ ហាលដីសម្លាប់មេរោគ លើករង និងដាក់ជីទ្រាប់បាត។", tab: "tab-soil", icon: "🚜", bg: "from-amber-600 to-orange-700" },
                    { step: "២", title: "ជ្រើសរើសពូជ & វិធីដាំ", desc: "ពូជសុទ្ធថ្លោស ដំណុះ > ៨៥% និង ៣ វិធីសាស្ត្រ (គ្រាប់ បណ្តុះកូន ដោតមែក)។", tab: "tab-seed", icon: "🌾", bg: "from-emerald-600 to-teal-700" },
                    { step: "៣", title: "ការថែទាំដំណាំ", desc: "ស្រោចទឹកពេលត្រជាក់ ជ្រំដី ជម្រះស្មៅ ជីកំប៉ុស្ត និងការពារសត្វល្អិតធម្មជាតិ។", tab: "tab-care", icon: "💧", bg: "from-blue-600 to-cyan-700" },
                    { step: "៤", title: "ប្រមូលផល & រក្សាទុក", desc: "ប្រមូលផលទាន់ពេលដោយប្រុងប្រយ័ត្ន និងរក្សាទុកក្នុងឃ្លាំងត្រជាក់ស្ងួត។", tab: "tab-harvest", icon: "🧺", bg: "from-purple-600 to-indigo-700" }
                  ].map(card => e.jsxs("div", {
                    onClick: () => { J("click"); i(card.tab); addProgress(10); },
                    className: "bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1 group flex flex-col justify-between",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsx("span", { className: `w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.bg} text-white flex items-center justify-center text-xl shadow-md`, children: card.icon }),
                              e.jsxs("span", { className: "text-xs font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl", children: ["ផ្នែកទី ", card.step] })
                            ]
                          }),
                          e.jsx("h4", { className: "font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition font-moul", children: card.title }),
                          e.jsx("p", { className: "text-xs text-slate-500 leading-relaxed", children: card.desc })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition",
                        children: [
                          e.jsx("span", { children: "ចូលរៀនផ្នែកនេះ" }),
                          e.jsx("span", { children: "→" })
                        ]
                      })
                    ]
                  }, card.step))
                })
              ]
            }),

            // Tab 2: Soil Prep
            n === "tab-soil" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ចំណុចទី ១ នៃសៀវភៅពុម្ព (ទំព័រ ៨-៩)" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ការរៀបចំដី និងការលើករងដំណាំ" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "ចុចលើជំហាននីមួយៗទាំង ៥ ដើម្បីស្វែងយល់ពីបច្ចេកទេសរៀបចំដីឱ្យបានត្រឹមត្រូវ ៖" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2",
                          children: [
                            e.jsx("span", { children: "🚜" }),
                            e.jsx("span", { children: "ដីធូរ ដំណាំលូតលាស់ល្អ" })
                          ]
                        })
                      ]
                    }),

                    // Stepper buttons
                    e.jsx("div", {
                      className: "grid grid-cols-2 sm:grid-cols-5 gap-2.5",
                      children: [1, 2, 3, 4, 5].map(stepNum => {
                        const isCur = soilStep === stepNum;
                        return e.jsxs("button", {
                          onClick: () => { J("click"); setSoilStep(stepNum); addProgress(5); },
                          className: `p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${isCur ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md font-bold" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"}`,
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsxs("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-lg ${isCur ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`, children: ["ជំហាន ", stepNum] }),
                                e.jsx("span", { className: "text-base", children: soilStepsInfo[stepNum].icon })
                              ]
                            }),
                            e.jsx("span", { className: "text-xs font-bold leading-tight", children: soilStepsInfo[stepNum].tag })
                          ]
                        }, stepNum);
                      })
                    }),

                    // Detail view of active step
                    e.jsxs("div", {
                      className: "bg-gradient-to-br from-slate-50 to-emerald-50/30 p-6 rounded-3xl border border-emerald-200/80 space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            e.jsx("span", { className: "w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md", children: soilStepsInfo[soilStep].icon }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900 font-moul", children: soilStepsInfo[soilStep].title }),
                                e.jsx("span", { className: "text-xs font-bold text-emerald-700", children: soilStepsInfo[soilStep].tag })
                              ]
                            })
                          ]
                        }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-700 leading-relaxed font-normal", children: soilStepsInfo[soilStep].desc }),
                        e.jsx("div", {
                          className: "bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2.5",
                          children: e.jsxs("div", { children: [soilStepsInfo[soilStep].tip] })
                        })
                      ]
                    }),

                    // Soil Type Comparison
                    e.jsxs("div", {
                      className: "space-y-3 pt-4 border-t border-slate-100",
                      children: [
                        e.jsx("h4", { className: "text-sm font-bold text-slate-800", children: "ការប្រៀបធៀបប្រភេទដីសម្រាប់ដាំដំណាំ ៖" }),
                        e.jsxs("div", {
                          className: "grid grid-cols-1 md:grid-cols-3 gap-3",
                          children: [
                            { id: "loam", title: "១. ដីល្បាយខ្សាច់ (Loam Soil) ⭐", desc: "ល្អបំផុតសម្រាប់បន្លែភាគច្រើន! ធូរល្មម រក្សាសំណើមបានល្អ បង្ហូរទឹកបានលឿន និងងាយស្រួលឱ្យឫសដុះចាក់ជ្រៅ។", border: "border-emerald-400 bg-emerald-50/50" },
                            { id: "clay", title: "២. ដីឥដ្ឋស្អិត (Clay Soil)", desc: "ហាប់ណែនខ្លាំង ស្អិតពេលសើម និងរឹងដូចថ្មពេលស្ងួត ពិបាកបង្ហូរទឹក និងងាយធ្វើឱ្យរលួយឫសបើជាំទឹក។", border: "border-amber-300 bg-amber-50/30" },
                            { id: "sand", title: "៣. ដីខ្សាច់សុទ្ធ (Sandy Soil)", desc: "បង្ហូរទឹកលឿនពេក មិនអាចរក្សាសំណើម និងគ្មានជីវជាតិគ្រប់គ្រាន់។ ដំណាំឆាប់ស្រពោនខ្វះទឹក។", border: "border-rose-300 bg-rose-50/30" }
                          ].map(st => e.jsxs("div", {
                            className: `p-4 rounded-2xl border ${st.border} space-y-1.5`,
                            children: [
                              e.jsx("h5", { className: "font-bold text-xs sm:text-sm text-slate-900", children: st.title }),
                              e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: st.desc })
                            ]
                          }, st.id))
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 3: Seed Selection & 3 Methods
            n === "tab-seed" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ចំណុចទី ២ នៃសៀវភៅពុម្ព (ទំព័រ ១០-១១)" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ការជ្រើសរើសពូជ និងវិធីដាំដុះទាំង ៣" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "ស្វែងយល់ពីលក្ខណៈសម្បត្តិពូជល្អ និងការជ្រើសរើសវិធីដាំដុះដែលស័ក្តិសមសម្រាប់ដំណាំនីមួយៗ ៖" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2",
                          children: [
                            e.jsx("span", { children: "🌾" }),
                            e.jsx("span", { children: "ពូជល្អ ដំណុះខ្ពស់ > ៨៥%" })
                          ]
                        })
                      ]
                    }),

                    // 4 criteria of good seeds
                    e.jsxs("div", {
                      className: "p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2",
                      children: [
                        e.jsx("h4", { className: "text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-2", children: [e.jsx("span", { children: "✨" }), e.jsx("span", { children: "៤ លក្ខណៈសម្បត្តិគ្រឹះនៃគ្រាប់ពូជដំណាំល្អ ៖" })] }),
                        e.jsxs("div", {
                          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-emerald-900 font-medium",
                          children: [
                            e.jsx("div", { className: "bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs", children: "១. គ្រាប់ពេញថ្លោស មិនស្វិតស្កក" }, 1),
                            e.jsx("div", { className: "bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs", children: "២. គ្មានស្នាមចោះ និងសត្វល្អិតស៊ី" }, 2),
                            e.jsx("div", { className: "bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs", children: "៣. គ្មានជំងឺ និងគ្មានដុះផ្សិត" }, 3),
                            e.jsx("div", { className: "bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs", children: "៤. អត្រាដំណុះខ្ពស់លើសពី ៨០-៨៥%" }, 4)
                          ]
                        })
                      ]
                    }),

                    // 3 Methods tab buttons
                    e.jsx("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                      children: [
                        { id: "direct", title: "វិធី ១ ៖ ដាំដោយគ្រាប់ផ្ទាល់", icon: "🌽", tag: "ពោត, សណ្តែក, ត្រសក់" },
                        { id: "transplant", title: "វិធី ២ ៖ បណ្តុះកូនរួចស្ទូង", icon: "🍅", tag: "ប៉េងប៉ោះ, ម្ទេស, ស្ពៃ" },
                        { id: "cutting", title: "វិធី ៣ ៖ កាត់មែក/មើមដោត", icon: "🌿", tag: "ដំឡូងមី, អំពៅ, ត្រកួន" }
                      ].map(method => {
                        const isCur = seedMethod === method.id;
                        return e.jsxs("button", {
                          onClick: () => { J("click"); setSeedMethod(method.id); addProgress(5); },
                          className: `p-4 rounded-2xl border text-left transition cursor-pointer space-y-2 ${isCur ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md font-bold" : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"}`,
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("span", { className: "text-2xl", children: method.icon }),
                                e.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-lg ${isCur ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`, children: method.tag })
                              ]
                            }),
                            e.jsx("div", { className: "text-xs sm:text-sm font-bold", children: method.title })
                          ]
                        }, method.id);
                      })
                    }),

                    // Detail view of active method
                    e.jsxs("div", {
                      className: "bg-gradient-to-br from-slate-50 to-teal-50/30 p-6 rounded-3xl border border-teal-200 space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            e.jsx("span", { className: "w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl shadow-md", children: seedMethodsInfo[seedMethod].icon }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900 font-moul", children: seedMethodsInfo[seedMethod].title }),
                                e.jsx("span", { className: "text-xs font-bold text-teal-700", children: seedMethodsInfo[seedMethod].badge })
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm",
                          children: [
                            e.jsxs("p", { className: "text-slate-800", children: [e.jsx("strong", { children: "ដំណាំស័ក្តិសម ៖ " }), seedMethodsInfo[seedMethod].crops] }),
                            e.jsxs("p", { className: "text-slate-600 leading-relaxed", children: [e.jsx("strong", { children: "របៀបដាំ ៖ " }), seedMethodsInfo[seedMethod].steps] }),
                            e.jsxs("p", { className: "text-emerald-700 font-semibold pt-1", children: [e.jsx("strong", { children: "គុណសម្បត្តិ ៖ " }), seedMethodsInfo[seedMethod].pros] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 4: Care & Maintenance
            n === "tab-care" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ចំណុចទី ៣ នៃសៀវភៅពុម្ព (ទំព័រ ១២)" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ការថែទាំដំណាំ និងការគ្រប់គ្រង" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "បច្ចេកទេសថែទាំដើម្បីធានាការលូតលាស់រឹងមាំ និងទទួលបានទិន្នផលខ្ពស់ ៖" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200 text-sky-800 text-xs font-bold flex items-center gap-2",
                          children: [
                            e.jsx("span", { children: "💧" }),
                            e.jsx("span", { children: "ថែទាំល្អ ផលច្រើន" })
                          ]
                        })
                      ]
                    }),

                    // 4 Care practices cards
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: [
                        {
                          icon: "🚿",
                          title: "១. ការស្រោចទឹក (Watering)",
                          desc: "ស្រោចទឹកនៅពេលព្រឹកព្រលឹម ឬពេលល្ងាចត្រជាក់។ ជៀសវាងការស្រោចពេលថ្ងៃត្រង់ក្តៅខ្លាំង ព្រោះតំណក់ទឹកធ្វើឱ្យឆេះស្លឹក និងធ្វើឱ្យទឹកឆាប់ហួតអស់។ ស្រោចក្នុងបរិមាណល្មម កុំឱ្យជាំទឹកខ្លាំង។",
                          highlight: "កុំស្រោចពេលថ្ងៃត្រង់ក្តៅខ្លាំង!",
                          color: "sky"
                        },
                        {
                          icon: "⛏️",
                          title: "២. ការជ្រំដី & ជម្រះស្មៅ (Weeding & Hoeing)",
                          desc: "ជ្រំដីជុំវិញគល់ឱ្យធូរដើម្បីឱ្យខ្យល់ និងទឹកជ្រាបចូលដល់ឫសជ្រៅ។ ជម្រះស្មៅចង្រៃឱ្យបានទៀងទាត់ ដើម្បីកុំឱ្យស្មៅដណ្តើមពន្លឺថ្ងៃ ទឹក និងជីជាតិពីដំណាំ។",
                          highlight: "ស្មៅជាគូប្រជែងដណ្តើមជីជាតិ!",
                          color: "amber"
                        },
                        {
                          icon: "🌱",
                          title: "៣. ការដាក់ជីបំប៉ន (Top-dressing)",
                          desc: "ប្រើជីកំប៉ុស្ត ឬជីលាមកសត្វពុកផុយដាក់បំប៉នជុំវិញគល់ដំណាំ។ ជីជាតិ NPK ផ្តល់ ៖ N (អាសូត-លូតលាស់ស្លឹកដើម), P (ផូស្វ័រ-ពង្រឹងឫសនិងផ្កា), K (ប៉ូតាស្យូម-ផ្លែនិងគ្រាប់ថ្លោស)។",
                          highlight: "ជីកំប៉ុស្តធម្មជាតិជួយដីឱ្យធូរ!",
                          color: "emerald"
                        },
                        {
                          icon: "🛡️",
                          title: "៤. ការពារសត្វល្អិតបែបធម្មជាតិ (Organic Pest Control)",
                          desc: "ប្រើទឹកផ្សំពីស្លឹកស្តៅ ម្ទេស និងខ្ទឹមស បាញ់បណ្តេញសត្វល្អិត និងចាប់ដង្កូវដោយដៃ។ ជៀសវាងការប្រើប្រាស់ថ្នាំគីមីពុលច្រើនហួសហេតុ ដែលប៉ះពាល់ដល់សុខភាពអ្នកបរិភោគ និងបរិស្ថាន។",
                          highlight: "ប្រើទឹកស្លឹកស្តៅ & ម្ទេសបណ្តេញសត្វល្អិត!",
                          color: "purple"
                        }
                      ].map((cp, idx) => e.jsxs("div", {
                        className: `bg-${cp.color}-50/40 p-5 rounded-3xl border border-${cp.color}-200 space-y-3`,
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              e.jsx("span", { className: "text-3xl", children: cp.icon }),
                              e.jsx("h4", { className: "text-sm sm:text-base font-bold text-slate-900 font-moul", children: cp.title })
                            ]
                          }),
                          e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: cp.desc }),
                          e.jsx("span", { className: `inline-block text-[11px] font-bold px-3 py-1 rounded-xl bg-white border border-${cp.color}-300 text-${cp.color}-800 shadow-2xs`, children: cp.highlight })
                        ]
                      }, idx))
                    }),

                    // Interactive Mulching box
                    e.jsxs("div", {
                      className: "p-5 bg-gradient-to-r from-amber-50 via-white to-emerald-50 rounded-3xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-1",
                          children: [
                            e.jsxs("h4", { className: "text-sm font-bold text-slate-900 flex items-center gap-2", children: [e.jsx("span", { children: "🌾" }), e.jsx("span", { children: "បច្ចេកទេសគ្របរងដោយកម្ទេចចំបើង (Mulching)" })] }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ការគ្របចំបើងស្ងួតជួយទប់រំហួតទឹក រក្សាសំណើមដីឱ្យត្រជាក់ និងការពារមិនឱ្យស្មៅដុះលើរង។" })
                          ]
                        }),
                        e.jsxs("button", {
                          onClick: () => { J("click"); setMulchOn(!mulchOn); addProgress(5); },
                          className: `px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2 shrink-0 ${mulchOn ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`,
                          children: [
                            e.jsx("span", { children: mulchOn ? "✓ បានគ្របចំបើង" : "✕ មិនទាន់គ្របចំបើង" })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 5: Harvesting & Storage
            n === "tab-harvest" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ចំណុចទី ៤ នៃសៀវភៅពុម្ព (ទំព័រ ១៣-១៤)" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ការប្រមូលផល និងការរក្សាទុក" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "បច្ចេកទេសកាត់បេះ ជម្រុះ និងឃ្លាំងស្តុកទុកដើម្បីកុំឱ្យខូចខាត ៖" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200 text-purple-800 text-xs font-bold flex items-center gap-2",
                          children: [
                            e.jsx("span", { children: "🧺" }),
                            e.jsx("span", { children: "ប្រមូលផលទាន់ពេល" })
                          ]
                        })
                      ]
                    }),

                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: [
                        {
                          icon: "🥬",
                          title: "១. ការប្រមូលផលបន្លែស្រស់",
                          points: [
                            "ប្រមូលផលនៅពេលព្រឹកព្រលឹម ឬពេលរសៀលត្រជាក់ កុំប្រមូលពេលថ្ងៃក្តៅ។",
                            "ប្រើកន្ត្រៃកាត់ ឬកាំបិតមុតស្អាត កុំឱ្យជាំផ្លែ ឬបាក់ដើមមេ។",
                            "បន្លែស្លឹកត្រូវបេះពេលនៅខ្ចីស្រស់ កុំទុកដល់ចេញផ្កាព្រោះនឹងរឹងនិងល្វីង។",
                            "ជម្រុះស្លឹកលឿងឬរលួយចេញ និងលាងទឹកស្អាតមុនវេចខ្ចប់។"
                          ],
                          bg: "emerald"
                        },
                        {
                          icon: "🌽",
                          title: "២. ការរក្សាទុកគ្រាប់ធញ្ញជាតិ",
                          points: [
                            "គ្រាប់ពោត សណ្តែក ស្រូវ ត្រូវហាលថ្ងៃឱ្យស្ងួតល្អ (សំណើម < ១៤%)។",
                            "រែងសម្អាតកម្ទេចកំទី និងគ្រាប់ស្កកចេញឱ្យស្អាត។",
                            "ច្រកក្នុងបាវស្អាត និងរក្សាទុកក្នុងជង្រុក ឬឃ្លាំងត្រជាក់ ស្ងួត មានខ្យល់ចេញចូល។",
                            "កុំទុកទាំងសើម ព្រោះនឹងដុះផ្សិតពុល (Aflatoxin) និងដង្កូវស៊ីខូចគុណភាព។"
                          ],
                          bg: "amber"
                        }
                      ].map((box, idx) => e.jsxs("div", {
                        className: `p-5 rounded-3xl border bg-${box.bg}-50/40 border-${box.bg}-200 space-y-3`,
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              e.jsx("span", { className: "text-3xl", children: box.icon }),
                              e.jsx("h4", { className: "text-sm sm:text-base font-bold text-slate-900 font-moul", children: box.title })
                            ]
                          }),
                          e.jsx("ul", {
                            className: "space-y-2 text-xs text-slate-700 leading-relaxed",
                            children: box.points.map((pt, pIdx) => e.jsxs("li", {
                              className: "flex items-start gap-2",
                              children: [
                                e.jsx("span", { className: `text-${box.bg}-600 font-bold`, children: "•" }),
                                e.jsx("span", { children: pt })
                              ]
                            }, pIdx))
                          })
                        ]
                      }, idx))
                    }),

                    // Crop rotation highlight
                    e.jsxs("div", {
                      className: "p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl text-white space-y-2 shadow-lg",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("span", { className: "text-xl", children: "🔄" }),
                            e.jsx("h4", { className: "font-bold text-sm sm:text-base text-amber-300 font-moul", children: "ការដាំដំណាំឆ្លាស់មុខ (Crop Rotation)" })
                          ]
                        }),
                        e.jsx("p", {
                          className: "text-xs text-emerald-100/90 leading-relaxed font-light",
                          children: "ការដាំដំណាំបង្វិលឆ្លាស់មុខគ្នា (ឧទាហរណ៍ ៖ ដាំស្ពៃ រួចដាំសណ្តែក) ជួយកាត់ផ្តាច់វដ្តជីវិតសត្វល្អិតចង្រៃ និងស្តារជីជាតិដីឡើងវិញ។ ដំណាំអំបូរសណ្តែកមានដុំពកឫសដែលជួយស្រូបយកជាតិអាសូតពីខ្យល់មកបំពេញដីឱ្យកាន់តែមានជីជាតិ!"
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 6: Interactive Farming Lab Simulator
            n === "tab-lab" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "មន្ទីរពិសោធន៍និម្មិតអន្តរកម្ម" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ការពិសោធន៍ ៖ បរិស្ថាន និងការលូតលាស់នៃដំណាំ" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "ជ្រើសរើសប្រភេទដំណាំ និងកែសម្រួលកម្រិតទឹក ពន្លឺ ជី និងស្មៅ ដើម្បីមើលឃើញការលូតលាស់ជាក់ស្តែង ៖" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-teal-50 px-4 py-2 rounded-2xl border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-2",
                          children: [
                            e.jsx("span", { children: "🔬" }),
                            e.jsx("span", { children: "ការរៀនតាមរយៈការអនុវត្ត" })
                          ]
                        })
                      ]
                    }),

                    // Crop Selection Buttons
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx("label", { className: "text-xs font-bold text-slate-700", children: "ជ្រើសរើសប្រភេទដំណាំពិសោធន៍ ៖" }),
                        e.jsx("div", {
                          className: "grid grid-cols-2 sm:grid-cols-5 gap-2",
                          children: [
                            { id: "tomato", name: "ប៉េងប៉ោះ 🍅" },
                            { id: "corn", name: "ពោត 🌽" },
                            { id: "bean", name: "សណ្តែក 🫘" },
                            { id: "chili", name: "ម្ទេស 🌶️" },
                            { id: "cabbage", name: "ស្ពៃ 🥬" }
                          ].map(cItem => e.jsx("button", {
                            onClick: () => { J("click"); setLabCrop(cItem.id); },
                            className: `py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${labCrop === cItem.id ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"}`,
                            children: cItem.name
                          }, cItem.id))
                        })
                      ]
                    }),

                    // Simulator Controls Grid
                    e.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
                      children: [
                        // Left: Sliders & options
                        e.jsxs("div", {
                          className: "lg:col-span-6 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4",
                          children: [
                            // Water Slider
                            e.jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                e.jsxs("div", {
                                  className: "flex justify-between items-center text-xs font-bold text-slate-800",
                                  children: [
                                    e.jsxs("span", { className: "flex items-center gap-1.5", children: [e.jsx("span", { children: "💧" }), " កម្រិតស្រោចទឹក ៖"] }),
                                    e.jsx("span", { className: "text-emerald-700 font-extrabold", children: labWater === 1 ? "ខ្វះទឹក / ស្ងួតក្រៀម" : labWater === 2 ? "សមស្រប (ល្អបំផុត)" : "ជាំទឹកខ្លាំង / ស្អុយឫស" })
                                  ]
                                }),
                                e.jsx("input", {
                                  type: "range",
                                  min: "1",
                                  max: "3",
                                  value: labWater,
                                  onChange: eInput => { setLabWater(parseInt(eInput.target.value)); J("click"); },
                                  className: "w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                                }),
                                e.jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 font-semibold px-0.5", children: [e.jsx("span", { children: "ស្ងួត" }), e.jsx("span", { children: "សមស្រប" }), e.jsx("span", { children: "ជាំទឹក" })] })
                              ]
                            }),

                            // Sunlight Slider
                            e.jsxs("div", {
                              className: "space-y-1.5 pt-2 border-t border-slate-200",
                              children: [
                                e.jsxs("div", {
                                  className: "flex justify-between items-center text-xs font-bold text-slate-800",
                                  children: [
                                    e.jsxs("span", { className: "flex items-center gap-1.5", children: [e.jsx("span", { children: "☀️" }), " កម្រិតពន្លឺព្រះអាទិត្យ ៖"] }),
                                    e.jsx("span", { className: "text-amber-700 font-extrabold", children: labSun === 1 ? "ម្លប់ពេក / ខ្វះពន្លឺ" : labSun === 2 ? "ពេញលេញ (ល្អបំផុត)" : "ក្តៅហួតហែងខ្លាំង" })
                                  ]
                                }),
                                e.jsx("input", {
                                  type: "range",
                                  min: "1",
                                  max: "3",
                                  value: labSun,
                                  onChange: eInput => { setLabSun(parseInt(eInput.target.value)); J("click"); },
                                  className: "w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                                }),
                                e.jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 font-semibold px-0.5", children: [e.jsx("span", { children: "ម្លប់" }), e.jsx("span", { children: "ពេញលេញ" }), e.jsx("span", { children: "ក្តៅខ្លាំង" })] })
                              ]
                            }),

                            // Fertilizer Select
                            e.jsxs("div", {
                              className: "space-y-1.5 pt-2 border-t border-slate-200",
                              children: [
                                e.jsxs("label", { className: "text-xs font-bold text-slate-800 flex items-center gap-1.5", children: [e.jsx("span", { children: "🌱" }), " ប្រភេទជីជាតិ ៖"] }),
                                e.jsx("div", {
                                  className: "grid grid-cols-3 gap-2",
                                  children: [
                                    { id: "compost", label: "ជីកំប៉ុស្តសរីរាង្គ" },
                                    { id: "none", label: "គ្មានជី" },
                                    { id: "excess_chemical", label: "គីមីលើសកម្រិត" }
                                  ].map(f => e.jsx("button", {
                                    onClick: () => { setLabFert(f.id); J("click"); },
                                    className: `py-1.5 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${labFert === f.id ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-300"}`,
                                    children: f.label
                                  }, f.id))
                                })
                              ]
                            }),

                            // Weeds Toggle
                            e.jsxs("div", {
                              className: "pt-2 border-t border-slate-200 flex items-center justify-between",
                              children: [
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h5", { className: "text-xs font-bold text-slate-800", children: "ការគ្រប់គ្រងស្មៅចង្រៃ ៖" }),
                                    e.jsx("p", { className: "text-[10px] text-slate-500", children: labWeeds ? "ស្មៅដុះជោកជាំដណ្តើមជី" : "បានជម្រះស្មៅស្អាតល្អ" })
                                  ]
                                }),
                                e.jsx("button", {
                                  onClick: () => { setLabWeeds(!labWeeds); J("click"); },
                                  className: `px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${labWeeds ? "bg-rose-100 text-rose-800 border border-rose-300" : "bg-emerald-100 text-emerald-800 border border-emerald-300"}`,
                                  children: labWeeds ? "ស្មៅដុះជោកជាំ" : "ជម្រះស្អាត ✓"
                                })
                              ]
                            })
                          ]
                        }),

                        // Right: Visual Result & Plant Diagnosis
                        e.jsxs("div", {
                          className: "lg:col-span-6 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-6 rounded-3xl shadow-xl space-y-5 border border-emerald-800/40",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between border-b border-emerald-800/50 pb-3",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    e.jsx("span", { className: "text-2xl", children: "🪴" }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx("h4", { className: "text-sm font-bold text-emerald-200 font-moul", children: labStatus.cropName }),
                                        e.jsx("span", { className: "text-[10px] text-slate-300", children: "ស្ថានភាពការលូតលាស់ជាក់ស្តែង" })
                                      ]
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "text-right",
                                  children: [
                                    e.jsxs("span", { className: "text-2xl font-black text-amber-400", children: [labStatus.score, "%"] }),
                                    e.jsx("span", { className: "block text-[9px] uppercase tracking-wider text-slate-400", children: "សុខភាពដំណាំ" })
                                  ]
                                })
                              ]
                            }),

                            // Visual plant animation simulation
                            e.jsxs("div", {
                              className: "relative h-44 bg-slate-800/80 rounded-2xl flex flex-col items-center justify-end p-4 overflow-hidden border border-emerald-500/30",
                              children: [
                                // Sky effects
                                e.jsx("div", {
                                  className: "absolute top-3 right-3 text-3xl animate-bounce",
                                  children: labSun === 1 ? "☁️" : labSun === 2 ? "☀️" : "🔥"
                                }),
                                labWater === 3 && e.jsx("div", { className: "absolute top-2 left-3 text-xl text-sky-400 animate-pulse", children: "💧💧💧" }),

                                // Plant visual icon based on health score
                                e.jsx("div", {
                                  className: "text-6xl sm:text-7xl transition-transform duration-500 transform hover:scale-110",
                                  children: labStatus.score >= 80 ? "🌳" : labStatus.score >= 50 ? "🌿" : "🥀"
                                }),

                                // Soil bed
                                e.jsxs("div", {
                                  className: `w-full h-8 rounded-xl flex items-center justify-center text-[10px] font-bold border ${labWater === 3 ? "bg-sky-950 border-sky-600 text-sky-200" : labWater === 1 ? "bg-amber-950 border-amber-800 text-amber-200" : "bg-emerald-950 border-emerald-600 text-emerald-200"}`,
                                  children: [
                                    e.jsx("span", { children: labWater === 3 ? "ដីជាំទឹកខ្លាំង (Waterlogged)" : labWater === 1 ? "ដីស្ងួតក្រៀម (Dry Soil)" : "ដីល្បាយសំណើមល្អ (Ideal Soil)" }),
                                    labWeeds && e.jsx("span", { className: "ml-2 text-rose-400 font-extrabold", children: "• មានស្មៅចង្រៃ!" })
                                  ]
                                })
                              ]
                            }),

                            // Diagnosis & issues
                            e.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                e.jsx("span", { className: `block p-2.5 rounded-xl text-xs font-bold border ${labStatus.color}`, children: labStatus.health }),
                                labStatus.issues.length > 0 && e.jsx("ul", {
                                  className: "space-y-1 text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-800/40",
                                  children: labStatus.issues.map((iss, idx) => e.jsxs("li", {
                                    className: "flex items-start gap-1.5",
                                    children: [e.jsx("span", { children: "⚠️" }), e.jsx("span", { children: iss })]
                                  }, idx))
                                }),
                                labStatus.score >= 80 && e.jsx("div", {
                                  className: "text-xs text-emerald-300 bg-emerald-950/60 p-3 rounded-xl border border-emerald-700/50 flex items-center gap-2",
                                  children: [e.jsx("span", { children: "🎉" }), e.jsx("span", { children: "លក្ខខណ្ឌដាំដុះល្អឥតខ្ចោះ! ដំណាំនឹងផ្តល់ទិន្នផលខ្ពស់ និងផ្លែផ្កាស្រស់បំព្រង!" })]
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
            }),

            // Tab 7: Matching & Sequencing Games
            n === "tab-match" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                // Game 1: 5 Stages of Farming
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ល្បែងសិក្សាទី ១" }),
                            e.jsx("h2", { className: "text-lg sm:text-xl font-bold text-slate-900 mt-1 font-moul", children: "រៀបលំដាប់លំដោយ ៥ ជំហាននៃការដាំដំណាំ" }),
                            e.jsx("p", { className: "text-xs text-slate-600", children: "ប្រើប៊ូតុង ⬆️ ឬ ⬇️ ដើម្បីរៀបចំ ៥ ជំហានឱ្យបានត្រឹមត្រូវតាមលំដាប់ ៖" })
                          ]
                        }),
                        e.jsx("button", {
                          onClick: resetSequence,
                          className: "px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto",
                          children: "កំណត់ឡើងវិញ 🔄"
                        })
                      ]
                    }),

                    // Reorderable list
                    e.jsx("div", {
                      className: "space-y-2",
                      children: seqSteps.map((sNum, idx) => {
                        const stepLabels = {
                          1: "១. ការរៀបចំដី (កាប់គាស់ ភ្ជួររាស់ ហាលដី និងលើករង)",
                          2: "២. ការជ្រើសរើសពូជ (គ្រាប់ពេញថ្លោស ដំណុះ > ៨៥%)",
                          3: "៣. ការដាំដុះ (ដាំដោយគ្រាប់ផ្ទាល់ បណ្តុះកូន ឬដោតមែក)",
                          4: "៤. ការថែទាំ (ស្រោចទឹក ជ្រំដី ជម្រះស្មៅ ដាក់ជី និងការពារសត្វល្អិត)",
                          5: "៥. ការប្រមូលផល និងការរក្សាទុក (កាត់បេះ និងទុកក្នុងឃ្លាំងត្រជាក់)"
                        };
                        return e.jsxs("div", {
                          className: "flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/40 rounded-2xl border border-slate-200 transition text-xs sm:text-sm font-semibold",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2.5",
                              children: [
                                e.jsx("span", { className: "w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs", children: idx + 1 }),
                                e.jsx("span", { className: "text-slate-800", children: stepLabels[sNum] })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "flex items-center gap-1",
                              children: [
                                e.jsx("button", {
                                  onClick: () => moveSeq(idx, idx - 1),
                                  disabled: idx === 0,
                                  className: "p-1.5 bg-white hover:bg-slate-200 disabled:opacity-30 rounded-lg border text-xs cursor-pointer",
                                  children: "⬆️"
                                }),
                                e.jsx("button", {
                                  onClick: () => moveSeq(idx, idx + 1),
                                  disabled: idx === seqSteps.length - 1,
                                  className: "p-1.5 bg-white hover:bg-slate-200 disabled:opacity-30 rounded-lg border text-xs cursor-pointer",
                                  children: "⬇️"
                                })
                              ]
                            })
                          ]
                        }, sNum);
                      })
                    }),

                    e.jsxs("div", {
                      className: "pt-2 flex items-center gap-3",
                      children: [
                        e.jsx("button", {
                          onClick: checkSequence,
                          className: "px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer",
                          children: "ផ្ទៀងផ្ទាត់ចម្លើយ ✓"
                        }),
                        seqResult && e.jsxs("span", {
                          className: `text-xs font-bold ${seqResult.ok ? "text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-300" : "text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-300"}`,
                          children: [seqResult.ok ? "✅ " : "❌ ", seqResult.msg]
                        })
                      ]
                    })
                  ]
                }),

                // Game 2: Match Crops to 3 Planting Methods
                e.jsxs("div", {
                  className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "ល្បែងសិក្សាទី ២" }),
                            e.jsx("h2", { className: "text-lg sm:text-xl font-bold text-slate-900 mt-1 font-moul", children: "ផ្គូផ្គងប្រភេទដំណាំ ទៅនឹងវិធីដាំដុះត្រឹមត្រូវ" }),
                            e.jsx("p", { className: "text-xs text-slate-600", children: "ជ្រើសរើសវិធីដាំដុះដែលស័ក្តិសមបំផុតសម្រាប់ដំណាំនីមួយៗ ៖" })
                          ]
                        }),
                        e.jsx("button", {
                          onClick: resetMatches,
                          className: "px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto",
                          children: "កំណត់ឡើងវិញ 🔄"
                        })
                      ]
                    }),

                    e.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-5 gap-3",
                      children: [
                        { id: 1, name: "ពោត 🌽", hint: "គ្រាប់ធំ ឫសកែវវែង", corr: "direct" },
                        { id: 2, name: "ប៉េងប៉ោះ 🍅", hint: "គ្រាប់តូច ត្រូវការថែទាំ", corr: "transplant" },
                        { id: 3, name: "ដំឡូងមី 🥔", hint: "កាត់កង់ដើមដោត", corr: "cutting" },
                        { id: 4, name: "ស្ពៃ 🥬", hint: "បណ្តុះកូនរួចស្ទូង", corr: "transplant" },
                        { id: 5, name: "អំពៅ 🎋", hint: "កាត់កង់ដើមដោត", corr: "cutting" }
                      ].map(crop => e.jsxs("div", {
                        className: `p-4 rounded-2xl border text-center space-y-2.5 ${matchResult && matchAns[crop.id] === crop.corr ? "bg-emerald-50 border-emerald-400" : "bg-slate-50 border-slate-200"}`,
                        children: [
                          e.jsx("h4", { className: "font-bold text-slate-900 text-sm font-moul", children: crop.name }),
                          e.jsx("span", { className: "text-[10px] text-slate-500 block", children: crop.hint }),
                          e.jsxs("select", {
                            value: matchAns[crop.id],
                            onChange: ev => {
                              setMatchAns({ ...matchAns, [crop.id]: ev.target.value });
                              J("click");
                            },
                            className: "w-full text-xs font-semibold p-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 cursor-pointer",
                            children: [
                              e.jsx("option", { value: "", children: "-- ជ្រើសរើសវិធីដាំ --" }),
                              e.jsx("option", { value: "direct", children: "១. ដាំដោយគ្រាប់ផ្ទាល់" }),
                              e.jsx("option", { value: "transplant", children: "២. បណ្តុះកូនរួចស្ទូង" }),
                              e.jsx("option", { value: "cutting", children: "៣. កាត់មែក/មើមដោត" })
                            ]
                          })
                        ]
                      }, crop.id))
                    }),

                    e.jsxs("div", {
                      className: "pt-2 flex items-center gap-3",
                      children: [
                        e.jsx("button", {
                          onClick: checkMatches,
                          className: "px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer",
                          children: "ផ្ទៀងផ្ទាត់ចម្លើយ ✓"
                        }),
                        matchResult && e.jsxs("span", {
                          className: `text-xs font-bold ${matchResult.ok ? "text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-300" : "text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-300"}`,
                          children: [matchResult.ok ? "✅ " : "❌ ", matchResult.msg]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 8: 40 QCM Quiz
            n === "tab-quiz" && e.jsx("div", {
              className: "space-y-6 animate-fadeIn font-['Battambang'] w-full",
              children: e.jsxs("div", {
                className: "bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm w-full",
                children: [
                  e.jsxs("div", {
                    className: "border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx("span", { className: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "តេស្តវាស់ស្ទង់សមត្ថភាពពេញលេញ" }),
                              e.jsx("span", { className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full", children: "៤០ សំណួរ QCM" })
                            ]
                          }),
                          e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2", children: "មេរៀនទី ២ ៖ ការដាំដំណាំ" }),
                          e.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: "ចម្លើយត្រូវបានរៀបចំឆ្លាស់គ្នាស្មើៗគ្នា (ក, ខ, គ, ឃ) និងមានប្រវែងស្មើគ្នាដើម្បីវាស់ស្ទង់ការយល់ដឹងពិតប្រាកដ shadow-xs" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl shrink-0",
                        children: [
                          e.jsx("span", { className: "text-xs text-emerald-800 dark:text-emerald-300 font-bold", children: "ឆ្លើយត្រូវ៖" }),
                          e.jsxs("span", { className: "text-xl font-bold text-emerald-700 dark:text-emerald-400", children: [Object.keys(userAnswers).filter(idx => {
                            const item = Zi2[idx];
                            if (!item) return false;
                            const opts = item.options || item.opts;
                            const sel = opts[userAnswers[idx]];
                            return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                          }).length, " / ", Zi2.length] })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "mb-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 w-full",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                          e.jsx("span", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "តារាងលេខសំណួរ (ចុចលើលេខដើម្បីផ្លាស់ប្តូរ)៖" }),
                          e.jsxs("span", { className: "text-xs text-emerald-700 dark:text-emerald-400 font-semibold", children: ["បានឆ្លើយ៖ ", Object.keys(userAnswers).length, " / ", Zi2.length] })
                        ]
                      }),
                      e.jsx("div", {
                        className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5 max-h-32 overflow-y-auto p-1",
                        children: Zi2.map((qItem, qIdx) => {
                          const isCurrent = qIdx === currentQIndex;
                          const isAnswered = userAnswers[qIdx] !== undefined;
                          const opts = qItem.options || qItem.opts;
                          const sel = isAnswered ? opts[userAnswers[qIdx]] : null;
                          const isCorrect = isAnswered && sel && (sel.isCorrect !== undefined ? sel.isCorrect : sel.c);
                          return e.jsx("button", {
                            onClick: () => { playTone(600, 0.08); setCurrentQIndex(qIdx); },
                            className: "w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold border transition flex items-center justify-center cursor-pointer " + (isCurrent ? "border-2 border-emerald-700 bg-emerald-600 text-white shadow-md" : isAnswered ? (isCorrect ? "bg-emerald-100 dark:bg-emerald-900/60 border-emerald-400 text-emerald-800 dark:text-emerald-200" : "bg-rose-100 dark:bg-rose-900/60 border-rose-400 text-rose-800 dark:text-rose-200") : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"),
                            children: qIdx + 1
                          }, qIdx);
                        })
                      })
                    ]
                  }),
                  isFinished ? e.jsxs("div", {
                    className: "mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white text-center space-y-4 shadow-xl border border-emerald-600 w-full",
                    children: [
                      e.jsx("div", { className: "w-20 h-20 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-4xl shadow-lg animate-bounce", children: "🏆" }),
                      e.jsx("h3", { className: "text-2xl sm:text-3xl font-bold", children: "អបអរសាទរ! អ្នកបានបញ្ចប់តេស្តទាំង ៤០ សំណួរ!" }),
                      e.jsxs("p", { className: "text-sm text-emerald-100 max-w-lg mx-auto", children: ["អ្នកឆ្លើយត្រូវ ", Object.keys(userAnswers).filter(idx => {
                        const item = Zi2[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length, " លើ ", Zi2.length, " សំណួរ (", Math.round((Object.keys(userAnswers).filter(idx => {
                        const item = Zi2[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length / Zi2.length) * 100), "%)!"] }),
                      e.jsx("div", {
                        className: "pt-2 flex justify-center gap-3",
                        children: e.jsxs("button", {
                          onClick: () => { setUserAnswers({}); setCurrentQIndex(0); setIsFinished(!1); },
                          className: "px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg flex items-center gap-2 cursor-pointer",
                          children: [e.jsx("span", { children: "🔄" }), e.jsx("span", { children: "ធ្វើតេស្តឡើងវិញ" })]
                        })
                      })
                    ]
                  }) : e.jsxs("div", {
                    className: "space-y-6 w-full",
                    children: [
                      e.jsxs("div", {
                        className: "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 min-h-[300px] space-y-4 w-full",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("span", { className: "px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                                  e.jsx("span", { className: "text-xs text-slate-400", children: "មេរៀនទី ២" })
                                ]
                              }),
                              e.jsxs("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: ["សំណួរ ", currentQIndex + 1, " / ", Zi2.length] })
                            ]
                          }),
                          e.jsxs("h3", { className: "text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug", children: [currentQIndex + 1, ". ", Zi2[currentQIndex] ? (Zi2[currentQIndex].question || Zi2[currentQIndex].q) : ""] }),
                          e.jsx("div", {
                            className: "space-y-2.5 pt-1 w-full",
                            children: (Zi2[currentQIndex] ? (Zi2[currentQIndex].options || Zi2[currentQIndex].opts) : []).map((opt, optIdx) => {
                              const isAnswered = userAnswers[currentQIndex] !== undefined;
                              const selectedOptIdx = userAnswers[currentQIndex];
                              const khLabels = ["ក", "ខ", "គ", "ឃ"];
                              const isOptCorrect = opt.isCorrect !== undefined ? opt.isCorrect : opt.c;
                              let optClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800 dark:text-slate-200";
                              let badgeIcon = e.jsx("span", { className: "w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0", children: khLabels[optIdx] });
                              if (isAnswered) {
                                if (isOptCorrect) {
                                  optClass = "bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs";
                                  badgeIcon = e.jsx("span", { className: "w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0", children: "✓" });
                                } else if (selectedOptIdx === optIdx) {
                                  optClass = "bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-950 dark:text-rose-100";
                                  badgeIcon = e.jsx("span", { className: "w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0", children: "✗" });
                                } else {
                                  optClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60";
                                }
                              }
                              return e.jsxs("button", {
                                onClick: () => {
                                  if (userAnswers[currentQIndex] !== undefined) return;
                                  setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
                                  if (isOptCorrect) playSuccessSound(); else playErrorSound();
                                },
                                className: "w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-center gap-3 cursor-pointer " + optClass,
                                children: [
                                  badgeIcon,
                                  e.jsx("span", { className: "text-xs sm:text-sm font-medium flex-1 leading-relaxed", children: opt.text || opt.t })
                                ]
                              }, optIdx);
                            })
                          }),
                          userAnswers[currentQIndex] !== undefined ? e.jsxs("div", {
                            className: (() => {
                              const curItem = Zi2[currentQIndex];
                              const opts = curItem ? (curItem.options || curItem.opts) : [];
                              const selOpt = opts[userAnswers[currentQIndex]];
                              const isCorr = selOpt ? (selOpt.isCorrect !== undefined ? selOpt.isCorrect : selOpt.c) : false;
                              return isCorr ? "mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200" : "mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200";
                            })(),
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2 font-bold text-xs sm:text-sm mb-1",
                                children: (() => {
                                  const curItem = Zi2[currentQIndex];
                                  const opts = curItem ? (curItem.options || curItem.opts) : [];
                                  const selOpt = opts[userAnswers[currentQIndex]];
                                  const isCorr = selOpt ? (selOpt.isCorrect !== undefined ? selOpt.isCorrect : selOpt.c) : false;
                                  return isCorr ? [
                                    e.jsx("span", { className: "text-emerald-600 font-bold", children: "✓" }),
                                    e.jsx("span", { children: "ត្រឹមត្រូវណាស់!" })
                                  ] : [
                                    e.jsx("span", { className: "text-rose-600 font-bold", children: "✗" }),
                                    e.jsx("span", { children: "មិនទាន់ត្រឹមត្រូវទេ!" })
                                  ];
                                })()
                              }),
                              e.jsx("p", { className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed", children: (() => {
                                const curItem = Zi2[currentQIndex];
                                return curItem ? (curItem.exp || curItem.e || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.exp || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.e || "") : "";
                              })() })
                            ]
                          }) : e.jsxs("div", {
                            className: "mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs italic",
                            children: [
                              e.jsx("span", { children: "💡" }),
                              e.jsxs("span", { children: ["ជំនួយស្មារតី៖ ", Zi2[currentQIndex] ? (Zi2[currentQIndex].hint || Zi2[currentQIndex].h) : ""] })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center justify-between pt-2 w-full",
                        children: [
                          e.jsxs("button", {
                            disabled: currentQIndex === 0,
                            onClick: () => { playTone(600, 0.08); setCurrentQIndex(prev => Math.max(0, prev - 1)); },
                            className: "px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5",
                            children: [e.jsx("span", { children: "◄" }), e.jsx("span", { children: "សំណួរមុន" })]
                          }),
                          e.jsxs("span", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ", Zi2.length] }),
                          e.jsxs("button", {
                            onClick: () => {
                              playTone(600, 0.08);
                              if (currentQIndex < Zi2.length - 1) {
                                setCurrentQIndex(prev => prev + 1);
                              } else {
                                setIsFinished(!1);
                                setIsFinished(!0);
                                try { playTone(783.99, 0.3); } catch(e){}
                              }
                            },
                            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md cursor-pointer flex items-center gap-1.5",
                            children: [
                              e.jsx("span", { children: currentQIndex === Zi2.length - 1 ? "បញ្ចប់តេស្ត" : "សំណួរបន្ទាប់" }),
                              e.jsx("span", { children: "►" })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            })

          ]
        })
      ]
    })
  });
};
