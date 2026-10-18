import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log("--- Generating Rz3 component code for Science Lesson 3 (Animal Care) ---");

// Read questions
const questions = JSON.parse(fs.readFileSync('scripts/lesson3_questions.json', 'utf8'));

// We construct the code string for Rz3
const code = `var Rz3 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a); const [currentQIndex, setCurrentQIndex] = y.useState(0); const [userAnswers, setUserAnswers] = y.useState({}); const [isFinished, setIsFinished] = y.useState(!1);
  const [l, o] = y.useState(!1);
  const [c, d] = y.useState(0);
  const [u, h] = y.useState(!1);

  // Shelter housing tab state
  const [shelterType, setShelterType] = y.useState("poultry");

  // Feed & water tab state
  const [feedType, setFeedType] = y.useState("forage");

  // Health tab state
  const [diseaseFilter, setDiseaseFilter] = y.useState("all");

  // Animal husbandry tab state
  const [animalGuide, setAnimalGuide] = y.useState("chicken");

  // Lab simulator states
  const [labAnimal, setLabAnimal] = y.useState("chicken");
  const [labFeed, setLabFeed] = y.useState("balanced");
  const [labWater, setLabWater] = y.useState("clean");
  const [labHygiene, setLabHygiene] = y.useState("clean");
  const [labVaccine, setLabVaccine] = y.useState(!0);
  const [labQuarantine, setLabQuarantine] = y.useState(!0);

  // Matching & Sequence games states
  const [seqSteps, setSeqSteps] = y.useState([3, 5, 1, 4, 2]);
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
      ? "មេរៀនទី ៣ ៖ ការថែរក្សាសត្វ ថ្នាក់ទី ៦។ សត្វចិញ្ចឹមផ្តល់អាហារូបត្ថម្ភ កម្លាំងអូសទាញ ជីធម្មជាតិ និងប្រាក់ចំណូល។ ដើម្បីឱ្យសត្វធំធាត់ល្អ ត្រូវមានជម្រកសមរម្យ ចំណីទឹកស្អាត អនាម័យ និងការចាក់វ៉ាក់សាំងការពារជំងឺ។"
      : n === "tab-shelter"
      ? "ចំណុចទី ១ ការសាងសង់ទ្រុងសត្វ។ ត្រូវជ្រើសរើសទីទួលខ្ពស់ មិនលិចទឹក មានខ្យល់ចេញចូលស្រឡះ ដំបូលការពារកម្តៅ និងមានជម្រាលងាយស្រួលសម្អាតលាមក។"
      : n === "tab-feed"
      ? "ចំណុចទី ២ របបចំណី និងទឹកស្អាត។ សត្វត្រូវការចំណីចម្រុះមុខ មានស្មៅស្រស់ កន្ទក់ ធញ្ញជាតិ និងអំបិលរ៉ែ។ ទឹកផឹកត្រូវតែស្អាត និងមានជានិច្ចក្នុងស្នូក។"
      : n === "tab-health"
      ? "ចំណុចទី ៣ អនាម័យ និងការបង្ការជំងឺ។ ត្រូវបោសសម្អាតទ្រុងរាល់ថ្ងៃ រោយកំបោរសម្លាប់មេរោគ ចាក់វ៉ាក់សាំងការពារជំងឺសារទឹក អុតក្តារ ប៉េស្តជ្រូក និងញូកាសល។"
      : n === "tab-husbandry"
      ? "ចំណុចទី ៤ បច្ចេកទេសចិញ្ចឹមតាមប្រភេទសត្វ។ ការណែនាំលម្អិតសម្រាប់ការចិញ្ចឹមមាន់ទា ជ្រូក គោក្របី និងត្រីទឹកសាប។"
      : n === "tab-lab"
      ? "មន្ទីរពិសោធន៍កសិដ្ឋាននិម្មិត។ សាកល្បងកែប្រែចំណី ទឹក អនាម័យ និងវ៉ាក់សាំង ដើម្បីតាមដានសុខភាព និងផលិតភាពរបស់សត្វ។"
      : n === "tab-match"
      ? "ល្បែងផ្គូផ្គង និងរៀបលំដាប់លំដោយ ៥ ជំហាននៃការថែទាំសត្វប្រចាំថ្ងៃ និងការផ្គូផ្គងជំងឺសត្វ។"
      : \`កម្រង ៤០ សំណួរ QCM មេរៀនទី ៣ ៖ ការថែរក្សាសត្វ។ សំណួរទី \${Y + 1} ៖ \${Zi3[Y].question}\`;
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

    // Feed evaluation
    if (labFeed === "poor") {
      score -= 30;
      issues.push("ចំណីខ្វះជីវជាតិ ធ្វើឱ្យសត្វស្គមរីងរៃ ក្រិន និងយឺតធំ!");
    } else if (labFeed === "moldy") {
      score -= 50;
      issues.push("ចំណីផ្អូមដុះផ្សិត បង្កជាតិពុល Mycotoxin គ្រោះថ្នាក់ដល់ជីវិតសត្វ!");
    }

    // Water evaluation
    if (labWater === "dirty") {
      score -= 40;
      issues.push("ទឹកកខ្វក់មានមេរោគ ធ្វើឱ្យសត្វកើតជំងឺរាករូស និងដង្កូវព្រូន!");
    } else if (labWater === "scarce") {
      score -= 35;
      issues.push("កង្វះទឹកផឹក ធ្វើឱ្យសត្វខ្សោះជាតិទឹក ថយចុះការស៊ីចំណី!");
    }

    // Hygiene evaluation
    if (labHygiene === "dirty") {
      score -= 35;
      issues.push("ទ្រុងសើមជាំ ដក់លាមក បង្កឱ្យសត្វរលាកជើង រលាកសួត និងទាក់ទាញរុយមូស!");
    } else if (labHygiene === "moderate") {
      score -= 10;
      issues.push("អនាម័យមធ្យម គួរបន្ថែមការរោយកំបោរសម្លាប់មេរោគ!");
    }

    // Vaccine
    if (!labVaccine) {
      score -= 30;
      issues.push("មិនបានចាក់វ៉ាក់សាំងការពារ ប្រឈមមុខនឹងជំងឺរាតត្បាតកាចសាហាវ!");
    }

    // Quarantine
    if (!labQuarantine) {
      score -= 15;
      issues.push("គ្មានទ្រុងចត្តាឡីស័ក ងាយឆ្លងជំងឺរាលដាលពាសពេញហ្វូងសត្វ!");
    }

    score = Math.max(10, Math.min(100, score));

    const health = score >= 85 ? "សុខភាពល្អបរិបូរណ៍ គ្មានជំងឺ សាច់ណែន ធំធាត់លឿន (Excellent Health)"
      : score >= 55 ? "សុខភាពមធ្យម ត្រូវការកែលម្អចំណី និងអនាម័យ (Fair Health)"
      : "សត្វឈឺធ្ងន់ ប្រឈមនឹងការងាប់ ត្រូវការពេទ្យសត្វជាបន្ទាន់! (Critical)";

    const color = score >= 85 ? "text-emerald-700 bg-emerald-50 border-emerald-300"
      : score >= 55 ? "text-amber-700 bg-amber-50 border-amber-300"
      : "text-rose-700 bg-rose-50 border-rose-300";

    const animalNames = {
      chicken: "មាន់ស្រែពង 🐔",
      pig: "កូនជ្រូកសាច់ 🐖",
      cow: "មេគោពូជ 🐄",
      fish: "ត្រីទឹកសាប 🐟"
    };

    let productivity = "";
    if (labAnimal === "chicken") {
      productivity = score >= 85 ? "ពង ៥-៦ គ្រាប់/សប្តាហ៍ 🥚" : score >= 55 ? "ពង ២-៣ គ្រាប់/សប្តាហ៍" : "មិនពងសោះ ស្គមស្គាំង";
    } else if (labAnimal === "pig") {
      productivity = score >= 85 ? "កើនទម្ងន់ ៧០០g/ថ្ងៃ 📈" : score >= 55 ? "កើនទម្ងន់ ៣០០g/ថ្ងៃ" : "ស្រកទម្ងន់ ឈឺធ្ងន់";
    } else if (labAnimal === "cow") {
      productivity = score >= 85 ? "ទឹកដោះ ១៥ លីត្រ/ថ្ងៃ 🥛 កម្លាំងមាំ" : score >= 55 ? "ទឹកដោះ ៥ លីត្រ/ថ្ងៃ" : "ស្គមរីងរៃ គ្មានកម្លាំង";
    } else {
      productivity = score >= 85 ? "ត្រីធំធាត់លឿន ទឹកថ្លាល្អ 🌊" : score >= 55 ? "លូតលាស់យឺត" : "ត្រីងាប់អណ្តែតទឹក";
    }

    return { score, issues, health, color, animalName: animalNames[labAnimal], productivity };
  };

  const labStatus = calcLabStatus();

  // Sequence game checker
  const checkSequence = () => {
    const isCorrect = seqSteps.join(",") === "1,2,3,4,5";
    if (isCorrect) {
      J("correct");
      se();
      setSeqResult({ success: !0, msg: "អបអរសាទរ! អ្នកបានរៀបលំដាប់កិច្ចការថែទាំសត្វប្រចាំថ្ងៃបានត្រឹមត្រូវ ១០០%!" });
      addProgress(15);
    } else {
      J("wrong");
      setSeqResult({ success: !1, msg: "លំដាប់មិនទាន់ត្រឹមត្រូវនៅឡើយទេ។ សូមពិនិត្យមើលលំដាប់ពីការពិនិត្យសុខភាព រហូតដល់ការផ្តល់ចំណី និងបិទទ្រុង!" });
    }
  };

  const moveSeq = (fromIdx, toIdx) => {
    const updated = [...seqSteps];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setSeqSteps(updated);
    setSeqResult(null);
    J("click");
  };

  // Match game checker
  const checkMatch = () => {
    const correctPairs = { 1: "c", 2: "e", 3: "a", 4: "b", 5: "d" };
    let correctCount = 0;
    Object.keys(correctPairs).forEach(k => {
      if (matchAns[k] === correctPairs[k]) correctCount++;
    });
    if (correctCount === 5) {
      J("correct");
      se();
      setMatchResult({ success: !0, msg: "អស្ចារ្យណាស់! អ្នកបានផ្គូផ្គងជំងឺ និងវិធានការថែទាំសត្វបានត្រឹមត្រូវទាំងអស់ (៥/៥)!" });
      addProgress(20);
    } else {
      J("wrong");
      setMatchResult({ success: !1, msg: \`អ្នកផ្គូផ្គងត្រូវបាន \${correctCount} / ៥។ សូមព្យាយាមផ្គូផ្គងឡើងវិញ!\` });
    }
  };

  // 40 QCM answer handler
  const handleAnswer = (qIdx, optIdx) => {
    if (q[qIdx] !== undefined) return;
    const isCorrect = Zi3[qIdx].options[optIdx].isCorrect;
    ae(prev => ({ ...prev, [qIdx]: optIdx }));
    re(!0);
    if (isCorrect) {
      J("correct");
      addProgress(2.5);
    } else {
      J("wrong");
    }
  };

  const nextQuestion = () => {
    if (Y < Zi3.length - 1) {
      Y === Zi3.length - 2 && se();
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
      if (Zi3[idx].options[chosen] && Zi3[idx].options[chosen].isCorrect) corr++;
    });
    return { answered: Object.keys(q).length, correct: corr };
  };

  const quizStats = calcQuizStats();

  const navTabs = [
    { id: "tab-hero", label: "១. ទិដ្ឋភាពទូទៅ", icon: "🐄" },
    { id: "tab-shelter", label: "២. ទ្រុង & ជម្រក", icon: "🏠" },
    { id: "tab-feed", label: "៣. ចំណី & ទឹកស្អាត", icon: "🌾" },
    { id: "tab-health", label: "៤. អនាម័យ & វ៉ាក់សាំង", icon: "💉" },
    { id: "tab-husbandry", label: "៥. វិធីចិញ្ចឹមតាមប្រភេទ", icon: "🐔" },
    { id: "tab-lab", label: "៦. កសិដ្ឋាននិម្មិត (ពិសោធន៍)", icon: "🔬" },
    { id: "tab-match", label: "៧. ល្បែងផ្គូផ្គង & រៀបលំដាប់", icon: "🧩" },
    { id: "tab-quiz", label: "៨. កម្រង ៤០ សំណួរ QCM", icon: "❓", special: !0 }
  ];

  const shelterInfo = {
    poultry: {
      title: "១. ទ្រុងមាន់ និងទា (Poultry Housing)",
      badge: "បសុបក្សី • លើកកម្រាលផុតពីដី",
      location: "ទីទួលខ្ពស់ ឆ្ងាយពីផ្ទះ ២០ ម៉ែត្រ មានដើមឈើជាម្លប់",
      floor: "កម្រាលលើកខ្ពស់ផុតពីដី ៥០-៨០cm ក្រាលរនាបឬស្សី ចន្លោះ ១.៥cm ឱ្យលាមកធ្លាក់ចុះក្រោម",
      roof: "ប្រក់ស្លឹក ក្បឿង ឬស័ង្កសីមានទ្រនាប់ការពារកម្តៅ ជម្រាល ៣៥-៤០ ដឺក្រេ ការពារភ្លៀងសាច",
      features: "មានរបងសំណាញ់ព័ទ្ធជុំវិញការពារពស់ កណ្តុរ សត្វព្រៃ និងមានសំបុកសម្រាប់មាន់ពង និងស្នូកចំណីទឹកព្យួរត្រឹមទ្រូងមាន់។",
      icon: "🐔"
    },
    pig: {
      title: "២. ទ្រុងជ្រូក (Swine Housing)",
      badge: "ជ្រូកសាច់ & មេពូជ • កម្រាលបេតុងមានជម្រាល",
      location: "ទីទួលខ្ពស់ មានខ្យល់បក់ល្អ មិនលិចទឹក និងឆ្ងាយពីប្រភពទឹកស្អាត",
      floor: "ចាក់បេតុងមិនរអិល មានជម្រាល ៣-៥% ឆ្ពោះទៅរករណ្តៅបង្ហូរទឹកកខ្វក់ និងអាងជីវឧស្ម័ន (Biogas)",
      roof: "ដំបូលខ្ពស់ស្រឡះ ២.៥-៣ ម៉ែត្រ ចំហៀងបើកចំហមានរនាំងឬសំណាញ់ឱ្យខ្យល់ចេញចូលត្រជាក់",
      features: "មានស្នូកចំណីបេតុងជាប់នឹងជញ្ជាំង ក្បាលរ៉ូប៊ីណេទឹកបៀមស្វ័យប្រវត្តិ និងអាងត្រាំទឹកពេលថ្ងៃក្តៅ។",
      icon: "🐖"
    },
    cattle: {
      title: "៣. ក្រោលគោ និងក្របី (Cattle & Buffalo Shed)",
      badge: "ពាហនៈកម្លាំង & សាច់ • ខ្ពស់ស្រឡះទូលាយ",
      location: "ទីទួលក្បែរវាលស្មៅ មានម្លប់ដើមឈើធំៗ និងមិនមានភក់ជាំ",
      floor: "លើកដីឱ្យខ្ពស់ ឬចាក់បេតុងក្រាលចំបើងស្ងួត មានរណ្តៅប្រមូលលាមកធ្វើជីកំប៉ុស្ត",
      roof: "ដំបូលរាងកន្ត្រៃ ឬជម្រាលពីរខ្ពស់ ៣-៤ ម៉ែត្រ ដើម្បីកាត់បន្ថយកម្តៅ និងមានខ្យល់បក់គ្រប់ទិស",
      features: "ស្នូកស្មៅវែងធ្វើពីឈើឬបេតុង ស្នូកទឹកស្អាត ដុំអំបិលរ៉ែព្យួរ និងកន្លែងចងមុងការពារមូសពេលយប់។",
      icon: "🐄"
    },
    fish: {
      title: "៤. ស្រះចិញ្ចឹមត្រី (Freshwater Fish Pond)",
      badge: "វារីវប្បកម្ម • ទឹកថ្លាមានជីវជាតិ",
      location: "ដីឥដ្ឋល្បាយខ្សាច់ដែលអាចរក្សាទឹកបានល្អ ជិតប្រភពទឹកស្អាតមិនកខ្វក់",
      floor: "បាតស្រះជីកជម្រៅ ១.៥-២ ម៉ែត្រ ហាលដីបាតស្រះ និងរោយកំបោរសម្លាប់មេរោគមុនបង្ហូរទឹកបញ្ចូល",
      roof: "គ្មានដំបូល ត្រូវការទទួលពន្លឺព្រះអាទិត្យពេញលេញដើម្បីឱ្យសារាយផ្លុចតុងលូតលាស់",
      features: "មានប្រឡាយបង្ហូរទឹកចូល និងទ្វារបង្ហូរទឹកចេញការពារជំនន់ទឹកភ្លៀង និងសំណាញ់ការពារសត្វសត្វស្លាបស៊ីកូនត្រី។",
      icon: "🐟"
    }
  };

  const feedCategories = {
    forage: {
      title: "ចំណីធម្មជាតិ (Roughage & Green Feed)",
      desc: "ស្មៅស្រស់ កំប្លោក ចក ដើមចេកហាន់ ត្រកួន ស្លឹកកន្ធំថេត",
      benefit: "ផ្តល់ជាតិកាកសរសៃ (Fiber) វីតាមីន និងជាតិទឹក ជួយដល់ការរំលាយអាហារ និងកាត់បន្ថយការទល់លាមក។",
      badge: "សន្សំសំចៃ & សម្បូរវីតាមីន",
      icon: "🌿"
    },
    concentrate: {
      title: "ចំណីបន្ថែម (Concentrate Feed)",
      desc: "កន្ទក់ម៉ដ្ឋ ពោតកិន ចុងអង្ករ សណ្តែកសៀង ម្សៅត្រី និងចំណីគ្រាប់កែច្នៃ",
      benefit: "ផ្តល់ថាមពលកាបូអ៊ីដ្រាត និងប្រូតេអ៊ីនខ្ពស់ ជួយឱ្យសត្វធំធាត់លឿន សាច់ណែន និងបង្កើនទម្ងន់។",
      badge: "ថាមពល & ប្រូតេអ៊ីនខ្ពស់",
      icon: "🌾"
    },
    minerals: {
      title: "សារធាតុរ៉ែ និងវីតាមីន (Minerals & Vitamins)",
      desc: "ដុំអំបិលរ៉ែ សំបកខ្យង/ខ្ចៅកិនម៉ដ្ឋ ម្សៅឆ្អឹង និងវីតាមីន Premix",
      benefit: "ផ្តល់កាល់ស្យូមជំនួយឆ្អឹង និងសំបកស៊ុតរឹងមាំ សូដ្យូមរក្សាតុល្យភាពជាតិទឹក និងបង្កើនចំណង់អាហារ។",
      badge: "ជំនួយឆ្អឹង & សំបកពង",
      icon: "🧂"
    },
    water: {
      title: "ទឹកស្អាត និងអនាម័យទឹក (Clean Water System)",
      desc: "ទឹកអណ្តូង ទឹកភ្លៀងស្អាត ឬទឹកម៉ាស៊ីន គ្មានសារធាតុគីមី ឬដង្កូវព្រូន",
      benefit: "ទឹកជាកត្តាសំខាន់បំផុតសម្រាប់ជីវិត។ សត្វត្រូវការទឹកស្អាតគ្រប់គ្រាន់គ្រប់ពេលវេលា និងប្តូរទឹកជាប្រចាំ។",
      badge: "កត្តាជីវិតសំខាន់បំផុត",
      icon: "💧"
    }
  };

  return e.jsx("div", {
    className: \`fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex flex-col \${l ? "p-0" : "p-2 sm:p-4 md:p-6"}\`,
    children: e.jsxs("div", {
      className: \`bg-slate-50 text-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-500/30 w-full \${l ? "h-screen rounded-none" : "w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto min-h-[90vh]"}\`,
      children: [
        // Top Header Bar
        e.jsx("header", {
          className: "bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs",
          children: e.jsxs("div", {
            className: "flex items-center justify-between w-full gap-4",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  e.jsx("div", {
                    className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-emerald-700 flex items-center justify-center text-white text-xl shadow-md",
                    children: "🐄"
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsx("span", { className: "text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 uppercase tracking-wider", children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                          e.jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "ជំពូកទី ១ • មេរៀនទី ៣" })
                        ]
                      }),
                      e.jsx("h1", {
                        className: "text-sm sm:text-base font-bold text-slate-900 leading-tight font-moul",
                        children: "មេរៀនទី ៣ ៖ ការថែរក្សាសត្វ (Animal Care)"
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
                    className: \`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer \${u ? "bg-rose-50 text-rose-700 border border-rose-300 animate-pulse" : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300"}\`,
                    title: "អានមេរៀនជាសំឡេងខ្មែរ",
                    children: [
                      e.jsx("span", { children: u ? "🔊" : "🔈" }),
                      e.jsx("span", { className: "hidden sm:inline", children: u ? "កំពុងអាន..." : "អានជាសំឡេង" })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200",
                    children: [
                      e.jsx("span", { className: "text-[11px] font-bold text-emerald-800", children: "វឌ្ឍនភាព ៖" }),
                      e.jsxs("span", { className: "text-xs font-bold text-emerald-900", children: [c, " %"] })
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

        // Navigation Tab Bar
        e.jsx("nav", {
          className: "bg-slate-900 text-white shadow-inner border-t border-slate-800",
          children: e.jsx("div", {
            className: "w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto px-2 sm:px-6 lg:px-8",
            children: e.jsx("div", {
              className: "flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar text-xs sm:text-sm font-medium",
              children: navTabs.map(item => {
                const isActive = n === item.id;
                return e.jsxs("button", {
                  onClick: () => { J("click"); i(item.id); },
                  className: \`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-2 cursor-pointer \${isActive ? "bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-md font-bold" : item.special ? "bg-amber-600/30 text-amber-200 hover:bg-amber-600 hover:text-white" : "bg-transparent text-slate-300 hover:bg-slate-800"}\`,
                  children: [
                    e.jsx("span", { children: item.icon }),
                    e.jsx("span", { children: item.label })
                  ]
                }, item.id);
              })
            })
          })
        }),

        // Main Body Container
        e.jsxs("main", {
          className: "flex-1 w-full max-w-full px-2 sm:px-6 lg:px-8 mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full overflow-y-auto",
          children: [
            // Toast Notification
            toastMsg && e.jsxs("div", {
              className: \`mb-4 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-in fade-in \${toastMsg.isSuccess ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-rose-50 border-rose-300 text-rose-800"}\`,
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
                // Hero Banner
                e.jsxs("div", {
                  className: "relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-amber-600/30",
                  children: [
                    e.jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" }),
                    e.jsxs("div", {
                      className: "relative z-10 max-w-3xl space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold",
                          children: [
                            e.jsx("span", { children: "🐄" }),
                            e.jsx("span", { children: "វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ជំពូកទី ១ (សត្វ និងរុក្ខជាតិ)" })
                          ]
                        }),
                        e.jsx("h2", {
                          className: "text-2xl sm:text-4xl font-extrabold font-moul leading-tight text-amber-100",
                          children: "មេរៀនទី ៣ ៖ ការថែរក្សាសត្វ"
                        }),
                        e.jsx("p", {
                          className: "text-xs sm:text-sm text-slate-300 leading-relaxed",
                          children: "សត្វចិញ្ចឹមមានគុណសម្បត្តិធំធេងសម្រាប់ជីវិតមនុស្ស។ ដើម្បីឱ្យសត្វមានសុខភាពល្អ ធំធាត់លឿន និងផ្តល់ផលិតផលខ្ពស់ អ្នកចិញ្ចឹមត្រូវយល់ដឹងច្បាស់ពីការសាងសង់ជម្រកសមរម្យ របបចំណីទឹក អនាម័យទ្រុង និងវិធានការបង្ការជំងឺឆ្លង។"
                        }),
                        e.jsxs("div", {
                          className: "flex flex-wrap gap-2.5 pt-2",
                          children: [
                            e.jsxs("button", {
                              onClick: () => { J("click"); i("tab-lab"); },
                              className: "px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer",
                              children: [e.jsx("span", { children: "🔬" }), e.jsx("span", { children: "ពិសោធន៍កសិដ្ឋាននិម្មិត" })]
                            }),
                            e.jsxs("button", {
                              onClick: () => { J("click"); i("tab-quiz"); },
                              className: "px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer",
                              children: [e.jsx("span", { children: "❓" }), e.jsx("span", { children: "ប្រឡង ៤០ QCM ពេញលេញ" })]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // 4 Core Care Pillars
                e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                  children: [
                    { title: "១. ទ្រុង & ជម្រក", icon: "🏠", desc: "ដីទួលខ្ពស់ មិនលិចទឹក មានខ្យល់ស្រឡះ និងដំបូលការពារកម្តៅភ្លៀង", tab: "tab-shelter", bg: "from-amber-500/10 to-orange-500/10 border-amber-300" },
                    { title: "២. ចំណី & ទឹកស្អាត", icon: "🌾", desc: "ចំណីចម្រុះមុខ ស្មៅស្រស់ កន្ទក់ ធញ្ញជាតិ និងទឹកស្អាតគ្រប់ពេលវេលា", tab: "tab-feed", bg: "from-emerald-500/10 to-teal-500/10 border-emerald-300" },
                    { title: "៣. អនាម័យ & វ៉ាក់សាំង", icon: "💉", desc: "បោសលាមកប្រចាំថ្ងៃ រោយកំបោរសម្លាប់មេរោគ និងចាក់វ៉ាក់សាំងទាន់ពេល", tab: "tab-health", bg: "from-blue-500/10 to-cyan-500/10 border-blue-300" },
                    { title: "៤. មេត្តាធម៌ & និរន្តរភាព", icon: "❤️", desc: "មិនធ្វើទារុណកម្ម ថែទាំពេលឈឺ និងកែច្នៃលាមកធ្វើជីកំប៉ុស្តនិងជីវហ្គាស", tab: "tab-husbandry", bg: "from-purple-500/10 to-pink-500/10 border-purple-300" }
                  ].map((col, idx) => e.jsxs("div", {
                    key: idx,
                    onClick: () => { J("click"); i(col.tab); },
                    className: \`p-5 rounded-2xl bg-gradient-to-br \${col.bg} border shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3\`,
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("span", { className: "text-2xl", children: col.icon }),
                          e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: col.title })
                        ]
                      }),
                      e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: col.desc }),
                      e.jsxs("span", { className: "text-[11px] font-bold text-amber-700 flex items-center gap-1", children: [e.jsx("span", { children: "ស្វែងយល់បន្ថែម" }), e.jsx("span", { children: "→" })] })
                    ]
                  }))
                }),

                // Daily Animal Care Checklist
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("span", { className: "text-xl", children: "📋" }),
                            e.jsx("h3", { className: "font-bold text-slate-900 text-sm sm:text-base font-moul", children: "តារាងកិច្ចការថែទាំសត្វប្រចាំថ្ងៃ (Daily Animal Care Checklist)" })
                          ]
                        }),
                        e.jsx("span", { className: "text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full", children: "៥ ជំហានជាប្រចាំ" })
                      ]
                    }),
                    e.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-5 gap-3",
                      children: [
                        { step: "១", title: "ពិនិត្យសុខភាព", desc: "ពិនិត្យសញ្ញាស្រពោន ភ្នែក ស្បែក និងចំណង់អាហារពេលព្រឹក", icon: "🔍" },
                        { step: "២", title: "បោសលាមក", desc: "ប្រមូលលាមកទុកដាក់ក្នុងរណ្តៅជីកំប៉ុស្ត ឬអាងជីវហ្គាស", icon: "🧹" },
                        { step: "៣", title: "ប្តូរទឹកស្អាត", desc: "លាងស្នូកទឹក និងចាក់ទឹកស្អាតថ្មីៗឱ្យបានគ្រប់គ្រាន់", icon: "💧" },
                        { step: "៤", title: "ផ្តល់ចំណី", desc: "ដាក់ចំណីសមស្របតាមប្រភេទសត្វ និងម៉ោងទៀងទាត់", icon: "🌾" },
                        { step: "៥", title: "សម្លាប់មេរោគ", desc: "រោយកំបោរជុំវិញទ្រុង និងចាក់សោរការពារសត្វសាហាវ", icon: "🛡️" }
                      ].map(item => e.jsxs("div", {
                        key: item.step,
                        className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsx("span", { className: "text-lg", children: item.icon }),
                              e.jsxs("span", { className: "text-[10px] font-black w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center", children: item.step })
                            ]
                          }),
                          e.jsx("h4", { className: "font-bold text-xs text-slate-900", children: item.title }),
                          e.jsx("p", { className: "text-[10px] text-slate-500 leading-relaxed", children: item.desc })
                        ]
                      }))
                    })
                  ]
                })
              ]
            }),

            // Tab 2: Shelter Housing
            n === "tab-shelter" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "បច្ចេកទេសសាងសង់ទ្រុងសត្វ" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "ការសាងសង់ទ្រុង និងការរៀបចំជម្រកសត្វ" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "ស្វែងយល់ពីរចនាសម្ព័ន្ធទ្រុងតាមប្រភេទសត្វនីមួយៗ ៖" })
                          ]
                        }),
                        e.jsx("div", {
                          className: "flex gap-2 flex-wrap",
                          children: Object.keys(shelterInfo).map(k => e.jsxs("button", {
                            key: k,
                            onClick: () => { J("click"); setShelterType(k); },
                            className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${shelterType === k ? "bg-amber-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}\`,
                            children: [
                              e.jsx("span", { children: shelterInfo[k].icon }),
                              e.jsx("span", { children: shelterInfo[k].title.split(" ")[1] })
                            ]
                          }))
                        })
                      ]
                    }),

                    // Active Shelter Detail
                    (() => {
                      const cur = shelterInfo[shelterType];
                      return e.jsxs("div", {
                        className: "p-6 rounded-3xl bg-amber-50/50 border border-amber-200 space-y-5",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", { className: "text-3xl", children: cur.icon }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: cur.title }),
                                      e.jsx("span", { className: "text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md", children: cur.badge })
                                    ]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-white border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1.5", children: [e.jsx("span", { children: "📍" }), "ទីតាំងសាងសង់"] }),
                                  e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: cur.location })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-white border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1.5", children: [e.jsx("span", { children: "🧱" }), "កម្រាល ឬបាត"] }),
                                  e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: cur.floor })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-white border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1.5", children: [e.jsx("span", { children: "☂️" }), "ដំបូល និងខ្យល់ចេញចូល"] }),
                                  e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: cur.roof })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-white border border-slate-200 space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1.5", children: [e.jsx("span", { children: "🛡️" }), "ប្រព័ន្ធសុវត្ថិភាព & គ្រឿងបរិក្ខារ"] }),
                                  e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: cur.features })
                                ]
                              })
                            ]
                          })
                        ]
                      });
                    })(),

                    // Golden Rules for animal housing
                    e.jsxs("div", {
                      className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3",
                      children: [
                        e.jsx("h4", { className: "font-bold text-xs text-slate-900 font-moul", children: "គោលការណ៍មាស ៤ យ៉ាងក្នុងការធ្វើទ្រុងសត្វ ៖" }),
                        e.jsx("ul", {
                          className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600",
                          children: [
                            "១. ត្រូវបែរមុខទៅរកទិសខាងកើត ដើម្បីទទួលពន្លឺថ្ងៃព្រឹក និងជៀសវាងកម្តៅថ្ងៃរសៀល។",
                            "២. នៅចម្ងាយយ៉ាងតិច ១៥-២០ ម៉ែត្រពីផ្ទះមនុស្ស ដើម្បីកុំឱ្យធុំក្លិន និងឆ្លងមេរោគ។",
                            "៣. ត្រូវមានជម្រាលបង្ហូរទឹក និងរណ្តៅប្រមូលលាមកកុំឱ្យដក់ជាំក្នុងទ្រុង។",
                            "៤. ត្រូវមានសំណាញ់ ឬរបងការពារសត្វសាហាវដូចជា ពស់ ឆ្កែព្រៃ និងកណ្តុរ។"
                          ].map((rule, idx) => e.jsxs("li", {
                            key: idx,
                            className: "flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100",
                            children: [
                              e.jsx("span", { className: "text-emerald-600 font-bold", children: "✓" }),
                              e.jsx("span", { children: rule })
                            ]
                          }))
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 3: Feed and Water
            n === "tab-feed" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4",
                      children: [
                        e.jsx("span", { className: "bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "អាហារូបត្ថម្ភសត្វ" }),
                        e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "របបចំណីអាហារ និងការផ្តល់ទឹកផឹក" }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "សត្វចិញ្ចឹមត្រូវការរបបអាហារមានតុល្យភាព ដើម្បីលូតលាស់រឹងមាំ និងមានភាពស៊ាំការពារជំងឺ ៖" })
                      ]
                    }),

                    // Feed Categories Grid
                    e.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: Object.keys(feedCategories).map(k => {
                        const item = feedCategories[k];
                        return e.jsxs("div", {
                          key: k,
                          className: "p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition space-y-3",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    e.jsx("span", { className: "text-2xl", children: item.icon }),
                                    e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: item.title })
                                  ]
                                }),
                                e.jsx("span", { className: "text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md", children: item.badge })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "text-xs text-slate-600 space-y-1.5",
                              children: [
                                e.jsxs("p", { children: [e.jsx("strong", { className: "text-slate-800", children: "មុខម្ហូប ៖ " }), item.desc] }),
                                e.jsxs("p", { children: [e.jsx("strong", { className: "text-slate-800", children: "អត្ថប្រយោជន៍ ៖ " }), item.benefit] })
                              ]
                            })
                          ]
                        });
                      })
                    }),

                    // Warning card: Danger of moldy food
                    e.jsxs("div", {
                      className: "p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2 font-bold text-sm",
                          children: [
                            e.jsx("span", { children: "⚠️" }),
                            e.jsx("span", { className: "font-moul", children: "ការប្រុងប្រយ័ត្នខ្ពស់ ៖ គ្រោះថ្នាក់នៃចំណីផ្អូម និងផ្សិតអាហ្វឡាតុកស៊ីន" })
                          ]
                        }),
                        e.jsx("p", {
                          className: "text-xs leading-relaxed text-rose-800",
                          children: "ហាមដាច់ខាតមិនត្រូវឱ្យសត្វស៊ីចំណីដែលផ្អូម ដុះផ្សិតខ្មៅឬបៃតងឡើយ។ ផ្សិតទាំងនោះផលិតជាតិពុល Mycotoxin/Aflatoxin ដែលបំផ្លាញថ្លើម តម្រងនោម ធ្វើឱ្យសត្វរាករូស ស្គមស្គាំង និងអាចងាប់ជាបន្តបន្ទាប់។"
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 4: Health and Sanitation
            n === "tab-health" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4",
                      children: [
                        e.jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "បសុព្យាបាល & ជីវសុវត្ថិភាព" }),
                        e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "អនាម័យ ការបង្ការជំងឺ និងការចាក់វ៉ាក់សាំង" }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "«ការពារប្រសើរជាងព្យាបាល» ស្វែងយល់ពីជំងឺឆ្លងកាចសាហាវ និងវិធានការទប់ស្កាត់ ៖" })
                      ]
                    }),

                    // Major Livestock Diseases Table
                    e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsx("h3", { className: "font-bold text-sm text-slate-900 font-moul", children: "ជំងឺឆ្លងទូទៅលើសត្វពាហនៈ និងបសុបក្សី ៖" }),
                        e.jsx("div", {
                          className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                          children: [
                            { name: "ជំងឺសារទឹក (Hemorrhagic Septicemia)", target: "គោ ក្របី", symptom: "ក្តៅខ្លួនខ្លាំង ហើមបំពង់ក ដកដង្ហើមញាប់ឮសូរខ្លាំង ហៀរសំបោរ", vaccine: "ចាក់វ៉ាក់សាំងសារទឹក ២ ដងក្នុងមួយឆ្នាំ (ដើមវស្សា និងចុងវស្សា)", icon: "🐄" },
                            { name: "ជំងឺអុតក្តារ (Foot-and-Mouth Disease)", target: "គោ ក្របី ជ្រូក", symptom: "ពងបែកលើអណ្តាត មាត់ អញ្ចាញ និងប្រឡោះក្រចកជើង ធ្វើឱ្យសត្វដើរខ្វិន", vaccine: "ចាក់វ៉ាក់សាំងអុតក្តាររៀងរាល់ ៦ ខែម្តង និងរោយកំបោរសម្លាប់មេរោគ", icon: "🦶" },
                            { name: "ជំងឺប៉េស្តជ្រូក (Swine Fever)", target: "ជ្រូក", symptom: "ក្តៅខ្លួនខ្លាំង រាក ស្នាមជាំស្វាយលើស្បែកត្រចៀកនិងពោះ ងាប់លឿន", vaccine: "ចាក់វ៉ាក់សាំងការពារជំងឺប៉េស្តជ្រូក និងអនុវត្តជីវសុវត្ថិភាពបិទជិត", icon: "🐖" },
                            { name: "ជំងឺញូកាសល (Newcastle Disease)", target: "មាន់ ទា", symptom: "ស្រពោន រមួលក រាកអាចម៍បៃតងស ហៀរសំបោរ ងាប់ស្ទើរទាំងហ្វូង", vaccine: "ចាក់វ៉ាក់សាំងការពារជំងឺញូកាសល (បន្តក់ភ្នែកពេលកូន និងចាក់ពេលធំ)", icon: "🐔" }
                          ].map((dis, idx) => e.jsxs("div", {
                            key: idx,
                            className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  e.jsxs("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1.5", children: [e.jsx("span", { children: dis.icon }), dis.name] }),
                                  e.jsx("span", { className: "text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md", children: dis.target })
                                ]
                              }),
                              e.jsxs("p", { className: "text-xs text-slate-600", children: [e.jsx("strong", { children: "រោគសញ្ញា ៖ " }), dis.symptom] }),
                              e.jsxs("p", { className: "text-xs text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-100", children: [e.jsx("strong", { children: "វិធានការការពារ ៖ " }), dis.vaccine] })
                            ]
                          }))
                        })
                      ]
                    }),

                    // Biosecurity & Zoonoses Alert
                    e.jsxs("div", {
                      className: "p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2 font-bold text-sm",
                          children: [
                            e.jsx("span", { children: "🛡️" }),
                            e.jsx("span", { className: "font-moul", children: "វិធានការជីវសុវត្ថិភាព និងការការពារជំងឺឆ្លងមកមនុស្ស (Zoonoses)" })
                          ]
                        }),
                        e.jsx("p", {
                          className: "text-xs leading-relaxed text-slate-700",
                          children: "ជំងឺដូចជា ផ្តាសាយបក្សី (Bird Flu / H5N1) និងជំងឺឆ្កែឆ្កួត (Rabies) អាចឆ្លងពីសត្វមកមនុស្សបង្កគ្រោះថ្នាក់ដល់ជីវិត។ នៅពេលសត្វងាប់ដោយសារជំងឺ ត្រូវកប់ឱ្យបានជ្រៅ (១.៥ ម៉ែត្រ) រោយកំបោរពីលើ ឬដុតកម្ទេចចោល។ ហាមដាច់ខាតមិនត្រូវបរិភោគ ឬលក់សាច់សត្វងាប់ដោយសារជំងឺឡើយ!"
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 5: Species Husbandry Guide
            n === "tab-husbandry" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "បច្ចេកទេសជាក់ស្តែង" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "វិធីចិញ្ចឹមតាមប្រភេទសត្វនីមួយៗ" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "ជ្រើសរើសប្រភេទសត្វដើម្បីមើលការណែនាំលម្អិត ៖" })
                          ]
                        }),
                        e.jsx("div", {
                          className: "flex gap-2 flex-wrap",
                          children: [
                            { id: "chicken", label: "មាន់ស្រែ", icon: "🐔" },
                            { id: "pig", label: "ជ្រូក", icon: "🐖" },
                            { id: "cow", label: "គោក្របី", icon: "🐄" },
                            { id: "fish", label: "ត្រីទឹកសាប", icon: "🐟" }
                          ].map(btn => e.jsxs("button", {
                            key: btn.id,
                            onClick: () => { J("click"); setAnimalGuide(btn.id); },
                            className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${animalGuide === btn.id ? "bg-purple-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}\`,
                            children: [e.jsx("span", { children: btn.icon }), e.jsx("span", { children: btn.label })]
                          }))
                        })
                      ]
                    }),

                    // Detail Guide based on state
                    animalGuide === "chicken" && e.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3",
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: "🐔 បច្ចេកទេសចិញ្ចឹមមាន់ស្រែឱ្យឆាប់ធំ និងមិនសូវងាប់" }),
                            e.jsx("ul", {
                              className: "space-y-2 text-xs text-slate-700",
                              children: [
                                "• ថែទាំកូនមាន់ទើបញាស់ ៖ ត្រូវអប់កម្តៅដោយប្រើអំពូលភ្លើង ឬចង្កៀងប្រេងកាតរយៈពេល ២ សប្តាហ៍ដំបូង និងផ្តល់ទឹកលាយស្ករគ្លុយកូស។",
                                "• ចំណី ៖ ឱ្យចំណីកូនមាន់ ចុងអង្ករ ពោតម៉ដ្ឋ និងបន្លែហាន់ល្អិតៗដូចជា ត្រកួន ឬកំប្លោក។",
                                "• វ៉ាក់សាំង ៖ បន្តក់វ៉ាក់សាំងញូកាសល និងកំរោលនៅអាយុ ៧ ថ្ងៃ និង ២១ ថ្ងៃ។",
                                "• ទ្រុង ៖ លើកផុតពីដី ៥០cm ការពារសត្វលូនវារ និងមានទីធ្លាដីឱ្យមាន់កកាយចំណីពេលថ្ងៃ។"
                              ].map((item, idx) => e.jsx("li", { key: idx }, item))
                            })
                          ]
                        })
                      ]
                    }),

                    animalGuide === "pig" && e.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3",
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: "🐖 បច្ចេកទេសចិញ្ចឹមជ្រូកសាច់ និងជ្រូកពូជ" }),
                            e.jsx("ul", {
                              className: "space-y-2 text-xs text-slate-700",
                              children: [
                                "• ជ្រើសរើសពូជ ៖ រើសកូនជ្រូកថ្លោស ខ្នងត្រង់ ជើងមាំ គ្មានជំងឺ និងទម្ងន់ចាប់ពី ១០-១៥ គីឡូក្រាម។",
                                "• របបចំណី ៖ លាយកន្ទក់ម៉ដ្ឋ ពោតកិន ចុងអង្ករ សណ្តែកសៀង និងម្សៅត្រី ឱ្យស៊ី ២-៣ ដងក្នុងមួយថ្ងៃ។",
                                "• អនាម័យ ៖ លាងទ្រុងនិងងូតទឹកឱ្យជ្រូក ១-២ ដងក្នុងមួយថ្ងៃនៅពេលក្តៅ និងរោយកំបោរសម្លាប់មេរោគ។",
                                "• វ៉ាក់សាំង ៖ ចាក់វ៉ាក់សាំងការពារជំងឺប៉េស្តជ្រូក និងសារទឹកតាមកាលកំណត់របស់ពេទ្យសត្វ។"
                              ].map((item, idx) => e.jsx("li", { key: idx }, item))
                            })
                          ]
                        })
                      ]
                    }),

                    animalGuide === "cow" && e.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3",
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: "🐄 បច្ចេកទេសចិញ្ចឹមគោក្របីជាលក្ខណៈគ្រួសារ និងកសិដ្ឋាន" }),
                            e.jsx("ul", {
                              className: "space-y-2 text-xs text-slate-700",
                              children: [
                                "• របបស្មៅ ៖ គោពេញវ័យត្រូវការស្មៅស្រស់ ២៥-៣០ គីឡូក្រាមក្នុងមួយថ្ងៃ រួមជាមួយចំបើងស្ងួត។",
                                "• សារធាតុរ៉ែ ៖ ព្យួរដុំអំបិលរ៉ែក្នុងក្រោលឱ្យគោលិទ្ធរាល់ថ្ងៃ ដើម្បីបំពេញជាតិសូដ្យូម និងកាល់ស្យូម។",
                                "• ទឹកស្អាត ៖ គោត្រូវការទឹកផឹកស្អាត ៤០-៦០ លីត្រក្នុងមួយថ្ងៃ មិនត្រូវឱ្យផឹកទឹកល្អក់ដក់ក្នុងភក់ទេ។",
                                "• ការពារមូស ៖ ចងមុង ឬដុតកម្ទេចស្លឹកឈើស្ងួតបង្កើតផ្សែងដេញមូស និងរបោមនៅពេលយប់។"
                              ].map((item, idx) => e.jsx("li", { key: idx }, item))
                            })
                          ]
                        })
                      ]
                    }),

                    animalGuide === "fish" && e.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "p-5 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-3",
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: "🐟 បច្ចេកទេសចិញ្ចឹមត្រីអណ្តែង ឬត្រីប្រាក្នុងស្រះគ្រួសារ" }),
                            e.jsx("ul", {
                              className: "space-y-2 text-xs text-slate-700",
                              children: [
                                "• ការរៀបចំស្រះ ៖ បូមទឹកឱ្យរីង ហាលដីបាតស្រះ ៧ ថ្ងៃ រោយកំបោរ ៥-១០kg/១០០m² រួចទើបបង្ហូរទឹកបញ្ចូល។",
                                "• គុណភាពទឹក ៖ រក្សាទឹកពណ៌បៃតងខ្ចី (ពណ៌ផ្លុចតុង) ជម្រៅទឹក ១.២-១.៥ ម៉ែត្រ។",
                                "• ចំណី ៖ ផ្តល់ចំណីគ្រាប់ កន្ទក់លាយចុងអង្ករ និងត្រកួនហាន់ ឱ្យស៊ី ២ ដងក្នុងមួយថ្ងៃទៀងម៉ោង។",
                                "• ការការពារ ៖ ធ្វើសំណាញ់ព័ទ្ធជុំវិញស្រះ ការពារកង្កែប ពស់ និងសត្វស្លាបស៊ីកូនត្រី។"
                              ].map((item, idx) => e.jsx("li", { key: idx }, item))
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 6: Virtual Farm Simulator
            n === "tab-lab" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase", children: "មន្ទីរពិសោធន៍និម្មិត" }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-moul", children: "បន្ទប់ពិសោធន៍ចិញ្ចឹមសត្វនិម្មិត (Virtual Farm Simulator)" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "កែប្រែកត្តាថែទាំ ៤ យ៉ាង និងសង្កេតមើលផលប៉ះពាល់លើសុខភាពសត្វក្នុងពេលជាក់ស្តែង ៖" })
                          ]
                        }),
                        e.jsx("div", {
                          className: "flex gap-2 flex-wrap",
                          children: [
                            { id: "chicken", label: "មាន់ពង", icon: "🐔" },
                            { id: "pig", label: "កូនជ្រូក", icon: "🐖" },
                            { id: "cow", label: "មេគោ", icon: "🐄" },
                            { id: "fish", label: "ត្រីទឹកសាប", icon: "🐟" }
                          ].map(item => e.jsxs("button", {
                            key: item.id,
                            onClick: () => { J("click"); setLabAnimal(item.id); },
                            className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${labAnimal === item.id ? "bg-teal-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}\`,
                            children: [e.jsx("span", { children: item.icon }), e.jsx("span", { children: item.label })]
                          }))
                        })
                      ]
                    }),

                    // Simulator Controls Grid
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
                      children: [
                        // Feed Control
                        e.jsxs("div", {
                          className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🌾" }), "របបចំណីអាហារ"] }),
                            e.jsxs("select", {
                              value: labFeed,
                              onChange: e => { J("click"); setLabFeed(e.target.value); },
                              className: "w-full p-2 text-xs bg-white rounded-xl border border-slate-200 cursor-pointer font-bold",
                              children: [
                                e.jsx("option", { value: "balanced", children: "ចំណីចម្រុះតុល្យភាពល្អ (ល្អបំផុត) ✓" }),
                                e.jsx("option", { value: "poor", children: "ចំណីខ្វះជីវជាតិ (ស្មៅស្ងួតចាស់ៗ)" }),
                                e.jsx("option", { value: "moldy", children: "ចំណីផ្អូមដុះផ្សិត (គ្រោះថ្នាក់ខ្លាំង!)" })
                              ]
                            })
                          ]
                        }),

                        // Water Control
                        e.jsxs("div", {
                          className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "💧" }), "ប្រភពទឹកផឹក"] }),
                            e.jsxs("select", {
                              value: labWater,
                              onChange: e => { J("click"); setLabWater(e.target.value); },
                              className: "w-full p-2 text-xs bg-white rounded-xl border border-slate-200 cursor-pointer font-bold",
                              children: [
                                e.jsx("option", { value: "clean", children: "ទឹកស្អាតគ្រប់គ្រាន់រាល់ថ្ងៃ ✓" }),
                                e.jsx("option", { value: "dirty", children: "ទឹកកខ្វក់ល្អក់ដក់លាមក" }),
                                e.jsx("option", { value: "scarce", children: "ខ្វះទឹកផឹក (ស្រេកទឹក)" })
                              ]
                            })
                          ]
                        }),

                        // Hygiene Control
                        e.jsxs("div", {
                          className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "🧹" }), "អនាម័យទ្រុង"] }),
                            e.jsxs("select", {
                              value: labHygiene,
                              onChange: e => { J("click"); setLabHygiene(e.target.value); },
                              className: "w-full p-2 text-xs bg-white rounded-xl border border-slate-200 cursor-pointer font-bold",
                              children: [
                                e.jsx("option", { value: "clean", children: "លាងស្អាត រោយកំបោរស ✓" }),
                                e.jsx("option", { value: "moderate", children: "បោសលាមកធម្មតា" }),
                                e.jsx("option", { value: "dirty", children: "ទ្រុងសើមជាំ ដក់ទឹកស្អុយ" })
                              ]
                            })
                          ]
                        }),

                        // Vaccine & Quarantine
                        e.jsxs("div", {
                          className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: [e.jsx("span", { children: "💉" }), "វ៉ាក់សាំង & ជីវសុវត្ថិភាព"] }),
                            e.jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                e.jsxs("label", {
                                  className: "flex items-center gap-2 text-xs text-slate-700 cursor-pointer",
                                  children: [
                                    e.jsx("input", { type: "checkbox", checked: labVaccine, onChange: () => { J("click"); setLabVaccine(!labVaccine); } }),
                                    e.jsx("span", { children: "ចាក់វ៉ាក់សាំងការពារគ្រប់មុខ" })
                                  ]
                                }),
                                e.jsxs("label", {
                                  className: "flex items-center gap-2 text-xs text-slate-700 cursor-pointer",
                                  children: [
                                    e.jsx("input", { type: "checkbox", checked: labQuarantine, onChange: () => { J("click"); setLabQuarantine(!labQuarantine); } }),
                                    e.jsx("span", { children: "មានទ្រុងចត្តាឡីស័កសត្វឈឺ" })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // Live Animal Status Output
                    e.jsxs("div", {
                      className: \`p-6 rounded-3xl border \${labStatus.color} space-y-4\`,
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between flex-wrap gap-3",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-3",
                              children: [
                                e.jsx("span", { className: "text-3xl", children: labAnimal === "chicken" ? "🐔" : labAnimal === "pig" ? "🐖" : labAnimal === "cow" ? "🐄" : "🐟" }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h3", { className: "font-bold text-slate-900 text-sm font-moul", children: labStatus.animalName }),
                                    e.jsx("p", { className: "text-xs font-bold", children: labStatus.health })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "text-right",
                              children: [
                                e.jsxs("div", { className: "text-2xl font-black font-moul", children: [labStatus.score, " %"] }),
                                e.jsx("span", { className: "text-[10px] font-bold text-slate-500", children: "សន្ទស្សន៍សុខភាពសរុប" })
                              ]
                            })
                          ]
                        }),

                        // Health Progress Bar
                        e.jsx("div", {
                          className: "w-full bg-slate-200 h-3 rounded-full overflow-hidden",
                          children: e.jsx("div", {
                            className: \`h-full transition-all duration-500 \${labStatus.score >= 80 ? "bg-emerald-500" : labStatus.score >= 50 ? "bg-amber-500" : "bg-rose-500"}\`,
                            style: { width: \`\${labStatus.score}%\` }
                          })
                        }),

                        // Productivity Badge
                        e.jsxs("div", {
                          className: "flex items-center justify-between bg-white/70 p-3 rounded-2xl border border-slate-200/60 text-xs font-bold",
                          children: [
                            e.jsx("span", { className: "text-slate-700", children: "ផលិតផល ឬការកើនទម្ងន់ប៉ាន់ស្មាន ៖" }),
                            e.jsx("span", { className: "text-amber-800 font-black", children: labStatus.productivity })
                          ]
                        }),

                        // Issue Alerts if any
                        labStatus.issues.length > 0 && e.jsxs("div", {
                          className: "space-y-1.5 pt-2",
                          children: [
                            e.jsx("h4", { className: "text-xs font-bold text-rose-800", children: "បញ្ហាប្រឈមដែលបានរកឃើញ ៖" }),
                            e.jsx("ul", {
                              className: "space-y-1 text-xs text-rose-700",
                              children: labStatus.issues.map((iss, idx) => e.jsxs("li", {
                                key: idx,
                                className: "flex items-start gap-1.5",
                                children: [e.jsx("span", { children: "•" }), e.jsx("span", { children: iss })]
                              }))
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // Tab 7: Matching and Sequence Games
            n === "tab-match" && e.jsxs("div", {
              className: "space-y-6 animate-in fade-in duration-200",
              children: [
                // Game 1: Daily Routine Sequencer
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-3 flex items-center justify-between",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase", children: "ល្បែងទី ១" }),
                            e.jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900 mt-1 font-moul", children: "រៀបលំដាប់ ៥ ជំហាននៃការថែទាំសត្វប្រចាំថ្ងៃ" })
                          ]
                        }),
                        e.jsx("span", { className: "text-xl", children: "🔄" })
                      ]
                    }),
                    e.jsx("p", { className: "text-xs text-slate-600", children: "ចុចប៊ូតុង ↑ ឬ ↓ ដើម្បីផ្លាស់ប្តូរទីតាំងជំហានឱ្យបានត្រឹមត្រូវតាមលំដាប់លំដោយ ៖" }),

                    // Steps List
                    e.jsx("div", {
                      className: "space-y-2",
                      children: seqSteps.map((stepNum, idx) => {
                        const stepLabels = {
                          1: "១. ពិនិត្យសុខភាពសត្វពេលព្រឹក (ស្វែងរកសញ្ញាឈឺ) 🔍",
                          2: "២. បោសសម្អាតទ្រុង ប្រមូលលាមក និងជូតកម្រាល 🧹",
                          3: "៣. លាងស្នូកទឹក និងប្តូរទឹកស្អាតថ្មី 💧",
                          4: "៤. ដាក់ចំណីសមស្របតាមម៉ោងកំណត់ 🌾",
                          5: "៥. បាញ់ថ្នាំសម្លាប់មេរោគ/រោយកំបោរ និងចាក់សោរបិទទ្រុង 🛡️"
                        };
                        return e.jsxs("div", {
                          key: stepNum,
                          className: "flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black", children: idx + 1 }),
                                e.jsx("span", { children: stepLabels[stepNum] })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "flex gap-1",
                              children: [
                                e.jsx("button", {
                                  onClick: () => idx > 0 && moveSeq(idx, idx - 1),
                                  disabled: idx === 0,
                                  className: "px-2 py-1 bg-white hover:bg-slate-200 disabled:opacity-30 rounded-lg border border-slate-200 cursor-pointer",
                                  children: "↑"
                                }),
                                e.jsx("button", {
                                  onClick: () => idx < seqSteps.length - 1 && moveSeq(idx, idx + 1),
                                  disabled: idx === seqSteps.length - 1,
                                  className: "px-2 py-1 bg-white hover:bg-slate-200 disabled:opacity-30 rounded-lg border border-slate-200 cursor-pointer",
                                  children: "↓"
                                })
                              ]
                            })
                          ]
                        });
                      })
                    }),

                    // Check result button
                    e.jsxs("div", {
                      className: "flex items-center gap-3 pt-2",
                      children: [
                        e.jsx("button", {
                          onClick: checkSequence,
                          className: "px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer",
                          children: "ផ្ទៀងផ្ទាត់ចម្លើយ ✓"
                        }),
                        seqResult && e.jsx("span", {
                          className: \`text-xs font-bold \${seqResult.success ? "text-emerald-700" : "text-rose-700"}\`,
                          children: seqResult.msg
                        })
                      ]
                    })
                  ]
                }),

                // Game 2: Matching Game
                e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "border-b border-slate-100 pb-3 flex items-center justify-between",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", { className: "text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase", children: "ល្បែងទី ២" }),
                            e.jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900 mt-1 font-moul", children: "ផ្គូផ្គងជំងឺ និងវិធានការការពារ / រោគសញ្ញា" })
                          ]
                        }),
                        e.jsx("span", { className: "text-xl", children: "🧩" })
                      ]
                    }),

                    e.jsx("div", {
                      className: "space-y-3",
                      children: [
                        { id: 1, term: "១. ជំងឺសារទឹក (គោក្របី)" },
                        { id: 2, term: "២. ជំងឺអុតក្តារ" },
                        { id: 3, term: "៣. ជំងឺប៉េស្តជ្រូក" },
                        { id: 4, term: "៤. ជំងឺញូកាសល (មាន់)" },
                        { id: 5, term: "៥. វ៉ាក់សាំងបង្ការ" }
                      ].map(item => e.jsxs("div", {
                        key: item.id,
                        className: "p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs",
                        children: [
                          e.jsx("span", { className: "font-bold text-slate-800", children: item.term }),
                          e.jsxs("select", {
                            value: matchAns[item.id],
                            onChange: e => {
                              J("click");
                              const val = e.target.value;
                              setMatchAns(prev => ({ ...prev, [item.id]: val }));
                              setMatchResult(null);
                            },
                            className: "p-2 bg-white rounded-xl border border-slate-200 text-xs font-bold cursor-pointer max-w-sm",
                            children: [
                              e.jsx("option", { value: "", children: "-- ជ្រើសរើសចម្លើយផ្គូផ្គង --" }),
                              e.jsx("option", { value: "a", children: "ស្នាមជាំស្វាយលើស្បែក ក្តៅខ្លួន រាក និងងាប់លឿន" }),
                              e.jsx("option", { value: "b", children: "រមួលក រាកអាចម៍បៃតងស ស្រពោន ងាប់ទាំងហ្វូង" }),
                              e.jsx("option", { value: "c", children: "ក្តៅខ្លួនខ្លាំង ហើមបំពង់ក ដកដង្ហើមញាប់ឮសូរខ្លាំង" }),
                              e.jsx("option", { value: "d", children: "ចាក់ការពារទុកជាមុនដើម្បីបង្កើតប្រព័ន្ធភាពស៊ាំ" }),
                              e.jsx("option", { value: "e", children: "ពងបែកលើអណ្តាត មាត់ និងប្រឡោះក្រចកជើង" })
                            ]
                          })
                        ]
                      }))
                    }),

                    e.jsxs("div", {
                      className: "flex items-center gap-3 pt-2",
                      children: [
                        e.jsx("button", {
                          onClick: checkMatch,
                          className: "px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer",
                          children: "ផ្ទៀងផ្ទាត់ការផ្គូផ្គង ✓"
                        }),
                        matchResult && e.jsx("span", {
                          className: \`text-xs font-bold \${matchResult.success ? "text-emerald-700" : "text-rose-700"}\`,
                          children: matchResult.msg
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
                          e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2", children: "មេរៀនទី ៣ ៖ ការចិញ្ចឹមសត្វ" }),
                          e.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: "ចម្លើយត្រូវបានរៀបចំឆ្លាស់គ្នាស្មើៗគ្នា (ក, ខ, គ, ឃ) និងមានប្រវែងស្មើគ្នាដើម្បីវាស់ស្ទង់ការយល់ដឹងពិតប្រាកដ shadow-xs" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-2xl shrink-0",
                        children: [
                          e.jsx("span", { className: "text-xs text-emerald-800 dark:text-emerald-300 font-bold", children: "ឆ្លើយត្រូវ៖" }),
                          e.jsxs("span", { className: "text-xl font-bold text-emerald-700 dark:text-emerald-400", children: [Object.keys(userAnswers).filter(idx => {
                            const item = Zi3[idx];
                            if (!item) return false;
                            const opts = item.options || item.opts;
                            const sel = opts[userAnswers[idx]];
                            return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                          }).length, " / ", Zi3.length] })
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
                          e.jsxs("span", { className: "text-xs text-emerald-700 dark:text-emerald-400 font-semibold", children: ["បានឆ្លើយ៖ ", Object.keys(userAnswers).length, " / ", Zi3.length] })
                        ]
                      }),
                      e.jsx("div", {
                        className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5 max-h-32 overflow-y-auto p-1",
                        children: Zi3.map((qItem, qIdx) => {
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
                        const item = Zi3[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length, " លើ ", Zi3.length, " សំណួរ (", Math.round((Object.keys(userAnswers).filter(idx => {
                        const item = Zi3[idx];
                        if (!item) return false;
                        const opts = item.options || item.opts;
                        const sel = opts[userAnswers[idx]];
                        return sel ? (sel.isCorrect !== undefined ? sel.isCorrect : sel.c) : false;
                      }).length / Zi3.length) * 100), "%)!"] }),
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
                                  e.jsx("span", { className: "text-xs text-slate-400", children: "មេរៀនទី ៣" })
                                ]
                              }),
                              e.jsxs("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: ["សំណួរ ", currentQIndex + 1, " / ", Zi3.length] })
                            ]
                          }),
                          e.jsxs("h3", { className: "text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug", children: [currentQIndex + 1, ". ", Zi3[currentQIndex] ? (Zi3[currentQIndex].question || Zi3[currentQIndex].q) : ""] }),
                          e.jsx("div", {
                            className: "space-y-2.5 pt-1 w-full",
                            children: (Zi3[currentQIndex] ? (Zi3[currentQIndex].options || Zi3[currentQIndex].opts) : []).map((opt, optIdx) => {
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
                              const curItem = Zi3[currentQIndex];
                              const opts = curItem ? (curItem.options || curItem.opts) : [];
                              const selOpt = opts[userAnswers[currentQIndex]];
                              const isCorr = selOpt ? (selOpt.isCorrect !== undefined ? selOpt.isCorrect : selOpt.c) : false;
                              return isCorr ? "mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200" : "mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200";
                            })(),
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-2 font-bold text-xs sm:text-sm mb-1",
                                children: (() => {
                                  const curItem = Zi3[currentQIndex];
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
                                const curItem = Zi3[currentQIndex];
                                return curItem ? (curItem.exp || curItem.e || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.exp || (curItem.options || curItem.opts)[userAnswers[currentQIndex]]?.e || "") : "";
                              })() })
                            ]
                          }) : e.jsxs("div", {
                            className: "mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs italic",
                            children: [
                              e.jsx("span", { children: "💡" }),
                              e.jsxs("span", { children: ["ជំនួយស្មារតី៖ ", Zi3[currentQIndex] ? (Zi3[currentQIndex].hint || Zi3[currentQIndex].h) : ""] })
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
                          e.jsxs("span", { className: "text-xs font-bold text-slate-500 dark:text-slate-400", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ", Zi3.length] }),
                          e.jsxs("button", {
                            onClick: () => {
                              playTone(600, 0.08);
                              if (currentQIndex < Zi3.length - 1) {
                                setCurrentQIndex(prev => prev + 1);
                              } else {
                                setIsFinished(!1);
                                setIsFinished(!0);
                                try { playTone(783.99, 0.3); } catch(e){}
                              }
                            },
                            className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md cursor-pointer flex items-center gap-1.5",
                            children: [
                              e.jsx("span", { children: currentQIndex === Zi3.length - 1 ? "បញ្ចប់តេស្ត" : "សំណួរបន្ទាប់" }),
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
`;

try {
  new vm.Script(code);
  console.log("Rz3 code parses cleanly with ZERO syntax errors!");
  fs.writeFileSync("scripts/rz3_component_code.js", code);
  console.log("Written scripts/rz3_component_code.js successfully!");
} catch (err) {
  console.error("Syntax error generating Rz3:", err);
  process.exit(1);
}
