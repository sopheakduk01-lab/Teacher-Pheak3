var RzKhmer1 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "overview" }) => {
  if (!r) return null;

  const normalizedInit = a === "tab-quiz" || a === "quiz" ? "quiz" : a === "tab-sim" || a === "sim" ? "sim" : a === "textbook" ? "textbook" : "overview";
  const [activeTab, setActiveTab] = y.useState(normalizedInit);
  const [selectedSection, setSelectedSection] = y.useState("all");
  const [fontScale, setFontScale] = y.useState(1);
  const [isFullscreen, setIsFullscreen] = y.useState(false);
  const [isSpeaking, setIsSpeaking] = y.useState(false);

  // Textbook Page Viewer State (Pages 1 to 16)
  const [currentPageIdx, setCurrentPageIdx] = y.useState(0);
  const [pageZoom, setPageZoom] = y.useState(1);

  // Interactive Lab State
  const [labMode, setLabMode] = y.useState("dict"); // 'dict' | 'poem' | 'grammar' | 'synonym'
  const [dictSearch, setDictSearch] = y.useState("");
  const [selectedWordIdx, setSelectedWordIdx] = y.useState(0);
  const [alphaUserOrder, setAlphaUserOrder] = y.useState([]);
  const [grammarAnswers, setGrammarAnswers] = y.useState({});
  const [synonymSelectedLeft, setSynonymSelectedLeft] = y.useState(null);
  const [synonymMatched, setSynonymMatched] = y.useState({});
  const [poemSelectedStanza, setPoemSelectedStanza] = y.useState(0);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [qcmScore, setQcmScore] = y.useState(0);

  y.useEffect(() => {
    setActiveTab(a === "tab-quiz" || a === "quiz" ? "quiz" : a === "tab-sim" || a === "sim" ? "sim" : a === "textbook" ? "textbook" : "overview");
  }, [a]);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
        if (window.stopKhmerAudio) window.stopKhmerAudio();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      };
    }
  }, [r]);

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
        utter.rate = 0.9;
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

  const TEXTBOOK_PAGES = [
    { page: 1, img: "/assets/aistudio/IMG_4661_271a6dbe.png", title: "ទំព័រទី ១ ៖ មេរៀនទី១ អ្នកមានគុណ (សេចក្ដីផ្ដើម)", audio: "មេរៀនទី១ អ្នកមានគុណ។ អ្នកមានគុណ គឺអ្នកដែលបានធ្វើអំពើល្អគ្រប់បែបយ៉ាងដូចជា ចិញ្ចឹមបីបាច់ ថែទាំ ទូន្មានប្រៀនប្រដៅ បង្ហាត់បង្រៀន និងឧបត្ថម្ភគាំទ្រដល់យើង។ អ្នកមានគុណមាន មាតាបិតា ជីដូនជីតា បងប្អូន គ្រូបាអាចារ្យ និងឧបការី ឧបការិនីដទៃទៀតដែលបានជួយទំនុកបម្រុងយើង។ យើងត្រូវតបស្នងគុណអ្នកទាំងនោះឱ្យបានសមរម្យ។" },
    { page: 2, img: "/assets/aistudio/IMG_4662_02de80dd.png", title: "ទំព័រទី ២ ៖ ការប្រើវចនានុក្រម និងអក្សរសង្ខេប", audio: "ការប្រើវចនានុក្រម។ ពេលអ្នកអានអត្ថបទអ្វីមួយហើយជួបប្រទះពាក្យដែលអ្នកមិនចេះអាន ឬមិនយល់ន័យ អ្នកអាចបើកមើលក្នុងវចនានុក្រម។ វចនានុក្រមនឹងបង្ហាញអ្នកអំពីសូរអាន ថ្នាក់ពាក្យ ប្រភព និងសេចក្ដីពន្យល់ន័យរបស់ពាក្យនោះ។" },
    { page: 3, img: "/assets/aistudio/IMG_4663_f916c592.png", title: "ទំព័រទី ៣ ៖ មេពាក្យ គំរូវចនានុក្រមខ្មែរ និងបញ្ញត្តិ", audio: "ពាក្យនៅខាងដើមជួរនីមួយៗ ជាពាក្យដែលត្រូវពន្យល់ ហៅថា មេពាក្យ។ វចនានុក្រម គឺជាបញ្ជីពាក្យដែលត្រូវបានរៀបតាមអក្ខរក្រម ដោយមានសូរអាន ថ្នាក់ពាក្យ ប្រភពពាក្យ និងសេចក្ដីពន្យល់ន័យមេពាក្យ។" },
    { page: 4, img: "/assets/aistudio/IMG_4664_77cce8f8.png", title: "ទំព័រទី ៤ ៖ លំហាត់ការប្រើវចនានុក្រម", audio: "លំហាត់ការប្រើវចនានុក្រម៖ សិក្សាពាក្យ បរិបូរ បរិភោគ បរិយាយ បរិសុទ្ធ បវរ បដិវត្ត បដិសេធ បឋម និងបណ្ណាគារ ព្រមទាំងការរៀបពាក្យតាមលំដាប់អក្សរ។" },
    { page: 5, img: "/assets/aistudio/IMG_4665_0e81f9cc.png", title: "ទំព័រទី ៥ ៖ អំណាន កតញ្ញូប្រាំប្រការ (បទពាក្យប្រាំពីរ)", audio: "កតញ្ញូប្រាំប្រការ បទពាក្យប្រាំពីរ។ កូនត្រូវតបគុណម្ដាយឪពុក ផ្គត់ផ្គង់ហូបចុកគ្រឿងធានា សម្លៀកបំពាក់ថ្នាំការពារ ឈឺគ្រុនរងាញ័រញាក់ក្ដៅ។ ត្រូវជួយធុរៈអ្នកមានគុណ កាប់គាស់រែកពុនកុំហ្មងសៅ ទោះបីនឿយហត់ត្រជាក់ក្ដៅ មើលថែម៉ែឪឱ្យលោកស្រាន្ត។ ត្រូវចេះរក្សាពូជពង្សញាតិ មិត្តភក្ដិផងទៀតផៅសន្តាន កេរ្តិ៍ឈ្មោះត្រកូលឱ្យថ្កើងថ្កាន ជៀសវាងឱ្យបានកុំទាស់គ្នា។ កូនត្រូវបម្រើអ្នកមានគុណ វាចាទន់ភ្លន់គ្រប់វេលា ព្រោះជាព្រះរស់នៃបុត្រភ្ងា កូនត្រូវវន្ទាដោយភក្ដី។ នៅពេលមាតាឬបិតា រលត់សង្ខារលាលោកិយ កូនធ្វើបុណ្យតាមប្រពៃណី បុត្រាបុត្រីត្រូវចងចាំ។" },
    { page: 6, img: "/assets/aistudio/IMG_4666_c8f9c969.png", title: "ទំព័រទី ៦ ៖ សំណួរ និងលំហាត់ នៃអំណានកតញ្ញូប្រាំប្រការ", audio: "សំណួរ និងលំហាត់នៃអំណានកតញ្ញូប្រាំប្រការ៖ ពន្យល់ពាក្យ និងគូសភ្ជាប់ពាក្យន័យដូច វាចា សម្ដី, សព ខ្មោច, បុត្រ កូន, វន្ទា សំពះ, មាតា ម្ដាយ, បិតា ឪពុក។" },
    { page: 7, img: "/assets/aistudio/IMG_4667_07bd0980.png", title: "ទំព័រទី ៧ ៖ សំណេរ តែងល្បះ និងតែងសេចក្ដីពណ៌នាអំពីម្ដាយ", audio: "សំណេរ៖ ការតែងល្បះ និងគម្រោងតែងសេចក្ដីពណ៌នាអំពីម្ដាយ រួមមាន សេចក្ដីផ្ដើម តួសេចក្ដី (រូបសម្បត្តិ ចរិយាសម្បត្តិ សកម្មភាព) និងសេចក្ដីបញ្ចប់។" },
    { page: 8, img: "/assets/aistudio/IMG_4668_763c6e55.png", title: "ទំព័រទី ៨ ៖ ការកត់ត្រាគំនិតសំខាន់ៗនៅក្នុងកំណាព្យ (ច្បាប់គោរពមាតាបិតា)", audio: "ការកត់ត្រាគំនិតសំខាន់ៗនៅក្នុងកំណាព្យ បទកាកគតិ ដកស្រង់ចេញពីច្បាប់គោរពមាតាបិតា របស់លោក អ៊ូ ចុង។ ត្រូវធ្វើបុណ្យខ្នើត ម៉ែឪស៊ីកើត កំពុងស្រេកឃ្លាន ម៉ែឪរស់នៅ កូនត្រូវធ្វើទាន បំបាត់ក្ដីឃ្លាន ហៅធ្វើបុណ្យខ្នើត។" },
    { page: 9, img: "/assets/aistudio/IMG_4669_2888363d.png", title: "ទំព័រទី ៩ ៖ លំហាត់ សន្តានចិត្តរបស់អ្នកម្ដាយ (បទព្រហ្មគីតិ)", audio: "លំហាត់កំណាព្យ សន្តានចិត្តរបស់អ្នកម្ដាយ បទព្រហ្មគីតិ។ ពេលកូនមកចាប់ផ្ទៃ ក្នុងហឫទ័យម្ដាយសប្បាយ ម៉ែតែងតែខ្វល់ខ្វាយ រកឧបាយថែរក្សា។ ធ្វើអ្វីតែងប្រយ័ត្ន មិនឱ្យភ្លាត់ខ្លាចប៉ះពារ ឱ្យកូនបានសុខជា ម្ដាយធានាគាំពារស្ងួន។ ស៊ូនឿយព្រោះថ្លើមថ្លៃ រង់ចាំថ្ងៃប្រសូតនួន បានឃើញមុខកូនស្ងួន ថ្នមថែថួនព្រោះស្រឡាញ់។" },
    { page: 10, img: "/assets/aistudio/IMG_4670_8b144f05.png", title: "ទំព័រទី ១០ ៖ ការស្ដាប់ ការគោរពលោកគ្រូ អ្នកគ្រូ", audio: "ការស្ដាប់៖ ការគោរពលោកគ្រូ អ្នកគ្រូ។ សិស្សត្រូវក្រោកឈរនិងប្រកាន់ការស្ងៀមស្ងាត់ពេលគ្រូមកដល់ ធ្វើកិច្ចការដែលគ្រូដាក់ឱ្យដោយផ្ចិតផ្ចង់ យកចិត្តទុកដាក់ស្ដាប់គ្រូពន្យល់ និងចូលរួមរំលែកទុក្ខរបស់គ្រូពេលគាត់មានធុរៈ។" },
    { page: 11, img: "/assets/aistudio/IMG_4671_37891342.png", title: "ទំព័រទី ១១ ៖ វេយ្យាករណ៍ គុណនាមចំនួន (ក. គុណនាមចំនួនរាប់)", audio: "វេយ្យាករណ៍៖ គុណនាមចំនួន។ គុណនាម គឺជាប្រភេទពាក្យម្យ៉ាងដែលប្រាប់លក្ខណៈរបស់នាម។ គុណនាមចំនួនរាប់ គឺជាគុណនាមប្រាប់ចំនួនមនុស្ស សត្វ វត្ថុ ដែលគេរាប់។" },
    { page: 12, img: "/assets/aistudio/IMG_4672_7357067b.png", title: "ទំព័រទី ១២ ៖ វេយ្យាករណ៍ គុណនាមចំនួនរៀប និងលំហាត់", audio: "គុណនាមចំនួនរៀប គឺជាគុណនាមប្រាប់ទី លំដាប់ ជាន់ ឬថ្នាក់ ដែលគេរៀប ដូចជា ទីមួយ ទីប្រាំបី ថ្នាក់ទីប្រាំមួយ លេខពីរ ម៉ោងដប់មួយ។" },
    { page: 13, img: "/assets/aistudio/IMG_4673_4bef315f.png", title: "ទំព័រទី ១៣ ៖ អំណាន រឿង បងប្រុស (ទំព័រទី ១)", audio: "អំណាន រឿង បងប្រុស។ និតនិងនួនជាបងប្អូនបង្កើតនឹងគ្នា។ តាំងពីអ្នកមានគុណបានចែកឋានទៅ ជីវភាពគ្រួសារពួកគេជួបការលំបាកយ៉ាងខ្លាំង។ និតជាបងបានសម្រេចចិត្តផ្អាកការរៀនសូត្រមួយរយៈ ដោយទុកឱ្យប្អូនបានសិក្សាបន្តទៀត។" },
    { page: 14, img: "/assets/aistudio/IMG_4674_397acbbb.png", title: "ទំព័រទី ១៤ ៖ អំណាន រឿង បងប្រុស (ទំព័រទី ២ សំណួរ លំហាត់ និងតែងរឿងខ្លី)", audio: "ក្រោយពីបញ្ចប់ការសិក្សា នួនបានចូលបម្រើការងារក្នុងក្រុមហ៊ុនមួយនៅរាជធានីភ្នំពេញ។ នួនសន្សំប្រាក់ខែបានមួយចំនួន ហើយយកទៅប្រគល់ជូនបងទាំងអស់ ដើម្បីឱ្យបងបានរៀបអាពាហ៍ពិពាហ៍។" },
    { page: 15, img: "/assets/aistudio/IMG_4675_f35f2b5a.png", title: "ទំព័រទី ១៥ ៖ ការនិយាយ ការពណ៌នាអំពីអ្នកមានគុណ (លោកយាយសួន)", audio: "ការនិយាយ៖ ការពណ៌នាអំពីអ្នកមានគុណ។ ស្រីណែតសន្ទនាជាមួយឪពុកអំពីលោកយាយសួន ដែលជាម្ដាយមីងរបស់ប៉ា និងបានចិញ្ចឹមបីបាច់ឧបត្ថម្ភប៉ាឱ្យរៀនសូត្ររហូតមានការងារធ្វើ។" },
    { page: 16, img: "/assets/aistudio/IMG_4676_4ce3b19e.png", title: "ទំព័រទី ១៦ ៖ ការតែងកំណាព្យ (បទពាក្យប្រាំពីរ)", audio: "ការតែងកំណាព្យបទពាក្យប្រាំពីរ។ ក្នុងមួយវគ្គមាន ៤ ឃ្លា ក្នុងមួយឃ្លាមាន ៧ ព្យាង្គ។ ខ្ញុំសូមវន្ទាចំពោះគុណ ធំហើយសែនធ្ងន់មកលើខ្ញុំ មានឪពុកម្ដាយជីដូនឧត្តម មីងពូបងអ៊ំក្រុមគ្រួសារ។ លោកគ្រូអ្នកគ្រូផ្ដល់ចំណេះ ឱ្យខ្ញុំបានចេះមានប្រាជ្ញា បួងសួងឱ្យលោកជួបសុខា កើតជាតិណាៗសូមជួបទៀត។" }
  ];

  const DICTIONARY_ENTRIES = [
    { headword: "កតញ្ញូ", pron: "កៈ-តាញ់-ញូ", pos: "ន. ឬ គុ.", origin: "បា.", meaning: "អ្នកដឹងគុណ គឺអ្នកដែលចងចាំនូវឧបការគុណដែលអ្នកដទៃបានធ្វើមកលើខ្លួន ហើយតបស្នងសងគុណវិញ : កូនកតញ្ញូ។" },
    { headword: "កវី", pron: "កៈ វី", pos: "ន.", origin: "សំ. បា. កវី", meaning: "អ្នកប្រាជ្ញដែលចេះតែងកាព្យឃ្លោង (អ្នកប្រាជ្ញខាងសម្ដី)។" },
    { headword: "កវីនិពន្ធ", pron: "-និពន់", pos: "ន.", origin: "បា. កវី + និពន្ធ", meaning: "កវីជាអ្នកនិពន្ធ អ្នកនិពន្ធខាងកាព្យឃ្លោង។" },
    { headword: "កសិកម្ម", pron: "កៈ សិ កាំ", pos: "ន.", origin: "បា.", meaning: "ការភ្ជួររាស់ ការងារដែលគេប្រកបក្នុងការភ្ជួររាស់ គឺការធ្វើស្រែចម្ការ។" },
    { headword: "កសិករ", pron: "-ក", pos: "ន. ឬ គុ.", origin: "បា.", meaning: "។ ម. ព. កសិការ។ (អ្នកធ្វើកសិកម្ម)" },
    { headword: "កសិការ", pron: "-កា", pos: "ន. ឬ គុ.", origin: "បា.", meaning: "អ្នកធ្វើកសិកម្ម។" },
    { headword: "កសិណ", pron: "កៈ-សិន", pos: "គុ. / ន.", origin: "បា.", meaning: "“ទាំងអស់” ។ ន. រូបតាងជាសម្អាង : កសិណសាក្សី យើងនឹងយកពាក្យនេះជាកសិណ មិនបានទេ។" },
    { headword: "កា១", pron: "កា", pos: "ន.", origin: "ខ្មែរ", meaning: "បំពង់សម្រាប់ដាក់ទឹក ធ្វើដោយលោហធាតុផ្សេងៗ ឬដោយដីលាយពណ៌ : កាទឹក។" },
    { headword: "កា២", pron: "កា", pos: "កិ.", origin: "ខ្មែរ", meaning: "សរសេរអាសយដ្ឋាន គឺសរសេរចុះឈ្មោះលំនៅអ្នកដែលនឹងទទួលសំបុត្រ នៅស្រោមសំបុត្រដែលនឹងផ្ញើទៅ : កាស្រោមសំបុត្រ, កាខ្នងសំបុត្រ។" },
    { headword: "កាកគតិ", pron: "កាក-គៈ តិ", pos: "ន.", origin: "បា.", meaning: "ឈ្មោះបទកាព្យពាក្យ ៤ (បទដំណើរក្អែកលោត) : នេះគឺច្បាប់ក្រម ប្រសើរឧត្តម ទូន្មានអ្នកផង..." },
    { headword: "បរិបូរ", pron: "ប-រ៉ិបូ ឬ ប-បូ", pos: "គុ.", origin: "បា. សំ.", meaning: "ដែលគ្រប់គ្រាន់ ដែលពេញគ្រប់គ្រាន់ ពេញលេញ សម្បូរ ដែលឆ្អែតហើយ : ម្ហូបចំណីបរិបូរ។" },
    { headword: "បរិភោគ", pron: "បរ៉ិភោគ", pos: "ន.", origin: "បា. សំ.", meaning: "ការចម្អែតអាត្មា (ស៊ី)។" },
    { headword: "បរិយាយ", pron: "បរ៉ិយ៉ាយ ឬ ប៉-", pos: "ន.", origin: "បា. សំ. បរិយាយ", meaning: "សេចក្ដីអធិប្បាយដោយផ្សែផ្សំ ការអធិប្បាយសម្រួលសេចក្ដី : ពោលដោយបរិយាយ។" },
    { headword: "បរិសុទ្ធ", pron: "បរ៉ិសុត", pos: "គុ.", origin: "បា.", meaning: "ដែលស្អាត ឥតសៅហ្មង : ចិត្តបរិសុទ្ធ។" },
    { headword: "បវរ", pron: "បវ៉រ", pos: "គុ.", origin: "បា. សំ. ប្រវរ", meaning: "ប្រសើរលើសលែង ថ្លៃថ្លា : ទ្រព្យដ៏បវរ។" },
    { headword: "បដិវត្ត", pron: "ប៉ៈដិវាត់", pos: "កិ.", origin: "បា.", meaning: "ប្រព្រឹត្តប្រឆាំង ប្រែប្រួល កែប្រែ ផ្លាស់ប្ដូរ (របបគ្រប់គ្រងដើម្បីឱ្យបានចម្រើន)។" },
    { headword: "បដិសេធ", pron: "ប៉ៈដិសែត", pos: "កិ.", origin: "បា. សំ.", meaning: "ឃាត់ហាម លើកចោល ឬទាត់ចោលលែងយកជាការ លែងរាប់អាន : បដិសេធពាក្យ។" },
    { headword: "បឋម", pron: "ប៉ៈ ឋៈ ម៉ៈ ឬ ប៉ៈ ឋំ", pos: "បូ. សំ. ឬ គុ.", origin: "បា. សំ. ប្រថម", meaning: "ដំបូង មុន មុនគេ ទី១ : គ្រាជាបឋម។" },
    { headword: "បណ្ណាគារ", pron: "ប៉ុន-ណា-គារ", pos: "ន.", origin: "បា. សំ. បណិគារ", meaning: "ផ្ទះជាវសៀវភៅ, សាស្ត្រា, ក្បួន, ច្បាប់។" },
    { headword: "គង្គា", pron: "គង់-គា", pos: "ន.", origin: "សំ. បា.", meaning: "ទឹក ទន្លេ ស្ទឹង (ឈ្មោះទន្លេធំមួយក្នុងប្រទេសឥណ្ឌា)។" },
    { headword: "មាតា", pron: "មា-តា", pos: "ន.", origin: "បា. សំ.", meaning: "ម្ដាយ (អ្នកបង្កើតកូន)។" },
    { headword: "មេត្តា", pron: "មេត-តា", pos: "ន.", origin: "បា.", meaning: "សេចក្ដីរាប់អាន សេចក្ដីអាណិតអាសូរ ចង់ឱ្យអ្នកដទៃបានសុខ។" },
    { headword: "សោមនស្ស", pron: "សោ-មៈ-នាស់", pos: "ន.", origin: "បា.", meaning: "សេចក្ដីសប្បាយចិត្ត ភាពរីករាយក្នុងចិត្ត។" },
    { headword: "ឧបការី", pron: "អ៊ុ-ប៉ៈ-កា-រី", pos: "ន.", origin: "បា. សំ.", meaning: "អ្នកជួយទំនុកបម្រុង អ្នកធ្វើឧបការៈ (បើស្ត្រីហៅថា ឧបការិនី)។" },
    { headword: "ឧបត្ថម្ភ", pron: "អ៊ុ-ប៉ាត់-ថាំ", pos: "ន. ឬ កិ.", origin: "បា.", meaning: "ការជួយទំនុកបម្រុង ការទ្រទ្រង់ គាំទ្រឱ្យរឹងប៉ឹង។" }
  ];

  const ABBREVIATIONS = [
    { abbr: "កិ.", full: "កិរិយា (កិរិយាស័ព្ទ)" },
    { abbr: "កិ. នុ.", full: "កិរិយានុគ្រោះ" },
    { abbr: "កិ. វិ.", full: "កិរិយាវិសេស (កិរិយាវិសេសន៍)" },
    { abbr: "ក្ល. ម.", full: "ក្លាយមកជា" },
    { abbr: "គុ.", full: "គុណនាម" },
    { abbr: "ច្រ. ន.", full: "ច្រើននិយាយថា" },
    { abbr: "ច្រ. ប្រ.", full: "ច្រើនប្រើជា" },
    { abbr: "ន.", full: "នាមស័ព្ទ" },
    { abbr: "និ.", full: "និបាតស័ព្ទ" },
    { abbr: "ប.", full: "បរិវារស័ព្ទ" },
    { abbr: "បា.", full: "បាលី (ភាសាបាលី)" },
    { abbr: "បា. ក្ល.", full: "បាលីក្លាយ" },
    { abbr: "បា. ស.", full: "បាលីនិងសំស្ក្រឹត" },
    { abbr: "បារ.", full: "បារាំង (ភាសាបារាំង)" },
    { abbr: "ម. ព.", full: "មើលពាក្យ" },
    { abbr: "យ.", full: "យួន (ភាសាយួន)" },
    { abbr: "រ. ស.", full: "រាជស័ព្ទ" },
    { abbr: "ល.", full: "លាវ (ភាសាលាវ)" },
    { abbr: "ស.", full: "សៀម (ភាសាសៀម)" }
  ];

  const GRAMMAR_ITEMS = [
    { word: "ដប់ពីរ", type: "cardinal" },
    { word: "ទីប្រាំ", type: "ordinal" },
    { word: "ថ្នាក់ទី៣", type: "ordinal" },
    { word: "មួយឡូ", type: "cardinal" },
    { word: "បួនរយ", type: "cardinal" },
    { word: "ជាន់ទីពីរ", type: "ordinal" },
    { word: "បីពាន់", type: "cardinal" },
    { word: "ទីហាសិប", type: "ordinal" },
    { word: "ប្រាំមួយ", type: "cardinal" },
    { word: "ម៉ោងប្រាំមួយ", type: "ordinal" },
    { word: "សាមសិប", type: "cardinal" },
    { word: "ពីរម៉ឺន", type: "cardinal" },
    { word: "យប់ទីបី", type: "ordinal" }
  ];

  const SYNONYM_PAIRS = [
    { id: "w1", left: "១. វាចា", right: "សម្ដី", page: "ទំព័រ ៦" },
    { id: "w2", left: "២. សព", right: "ខ្មោច", page: "ទំព័រ ៦" },
    { id: "w3", left: "៣. បុត្រ", right: "កូន", page: "ទំព័រ ៦" },
    { id: "w4", left: "៤. វន្ទា", right: "សំពះ", page: "ទំព័រ ៦" },
    { id: "w5", left: "៥. មាតា", right: "ម្ដាយ", page: "ទំព័រ ៦" },
    { id: "w6", left: "៦. បិតា", right: "ឪពុក", page: "ទំព័រ ៦" },
    { id: "w7", left: "៧. សិក្សា", right: "រៀនសូត្រ", page: "ទំព័រ ១៤" },
    { id: "w8", left: "៨. និទ្រា", right: "សម្រាន្ត / ដេក", page: "ទំព័រ ១៤" },
    { id: "w9", left: "៩. ឧបត្ថម្ភ", right: "ជួយទំនុកបម្រុង", page: "ទំព័រ ១៤" },
    { id: "w10", left: "១០. អាពាហ៍ពិពាហ៍", right: "រៀបការ / មង្គលការ", page: "ទំព័រ ១៤" }
  ];

  const ALPHA_WORDS = ["សោមនស្ស", "មាតា", "ឧបត្ថម្ភ", "គង្គា", "ឧបការី", "មេត្តា"];
  const ALPHA_CORRECT = ["គង្គា", "មាតា", "មេត្តា", "សោមនស្ស", "ឧបការី", "ឧបត្ថម្ភ"];

  const filteredDict = DICTIONARY_ENTRIES.filter(
    (d) => !dictSearch.trim() || d.headword.includes(dictSearch.trim()) || d.meaning.includes(dictSearch.trim())
  );

  const openTextbookPage = (pageNum) => {
    setCurrentPageIdx(Math.max(0, Math.min(15, pageNum - 1)));
    setActiveTab("textbook");
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    if (userAnswers[qIdx] !== undefined) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    const currentQ = (ZiKhmer1 || [])[qIdx];
    if (currentQ && currentQ.opts[optIdx] && currentQ.opts[optIdx].c) {
      setQcmScore((prev) => prev + 1);
      s && s("ចម្លើយត្រឹមត្រូវ! 👏 (+១ ពិន្ទុ)");
    } else {
      s && s("ចម្លើយមិនត្រឹមត្រូវទេ! សូមអានការពន្យល់ខាងក្រោម។");
    }
  };

  const questionsList = ZiKhmer1 || [];
  const currentQ = questionsList[currentQuestionIndex] || questionsList[0];

  const showSec = (secId) => selectedSection === "all" || selectedSection === secId;

  return e.jsx("div", {
    "data-modal-open": "true",
    className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-1.5 sm:p-4 overflow-y-auto animate-fadeIn",
    children: e.jsxs("div", {
      style: { fontSize: `${Math.round(fontScale * 100)}%` },
      className: `bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 w-full ${
        isFullscreen ? "max-w-none h-full rounded-none" : "max-w-6xl max-h-[94vh]"
      } flex flex-col overflow-hidden transition-all duration-300`,
      children: [
        // HEADER
        e.jsxs("div", {
          className: "bg-gradient-to-r from-[#162347] via-indigo-950 to-purple-950 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg border-b border-amber-400/30",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("div", {
                  className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center text-2xl shadow-md font-black border border-white/40",
                  children: "🇰🇭"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2 flex-wrap",
                      children: [
                        e.jsx("span", {
                          className: "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs",
                          children: "ភាសាខ្មែរ ថ្នាក់ទី ៥ • មេរៀនទី ១"
                        }),
                        e.jsx("span", {
                          className: "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40",
                          children: "សៀវភៅពុម្ពក្រសួងអប់រំ ទំព័រ ១ ដល់ ១៦"
                        })
                      ]
                    }),
                    e.jsx("h2", {
                      className: "text-base sm:text-xl font-bold font-moul text-white mt-1 drop-shadow-sm",
                      children: "មេរៀនទី ១ ៖ អ្នកមានគុណ (ពេញលេញទាំង ៨ ផ្នែក និង ១៦ ទំព័រ)"
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center gap-1.5 sm:gap-2 flex-wrap",
              children: [
                e.jsxs("button", {
                  onClick: () =>
                    toggleSpeech(
                      "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! សូមស្វាគមន៍មកកាន់មេរៀនភាសាខ្មែរ ថ្នាក់ទី៥ មេរៀនទី១ ៖ អ្នកមានគុណ ចាប់ពីទំព័រទី១ ដល់ទំព័រទី១៦។ អ្នកមានគុណ គឺអ្នកដែលបានធ្វើអំពើល្អគ្រប់បែបយ៉ាងដូចជា ចិញ្ចឹមបីបាច់ ថែទាំ ទូន្មានប្រៀនប្រដៅ បង្ហាត់បង្រៀន និងឧបត្ថម្ភគាំទ្រដល់យើង។ អ្នកមានគុណមាន មាតាបិតា ជីដូនជីតា បងប្អូន គ្រូបាអាចារ្យ និងឧបការី ឧបការិនីដទៃទៀត។ នៅក្នុងមេរៀននេះ ប្អូនៗនឹងសិក្សាពេញលេញអំពី ការប្រើវចនានុក្រម, កំណាព្យកតញ្ញូប្រាំប្រការ, សំណេរពណ៌នាអំពីម្ដាយ, ការកត់ត្រាគំនិតសំខាន់ៗក្នុងកំណាព្យច្បាប់គោរពមាតាបិតា និងសន្តានចិត្តរបស់អ្នកម្ដាយ, ការស្ដាប់ការគោរពលោកគ្រូអ្នកគ្រូ, វេយ្យាករណ៍គុណនាមចំនួនរាប់និងគុណនាមចំនួនរៀប, អំណានរឿងបងប្រុស, ការនិយាយពណ៌នាអំពីអ្នកមានគុណ, និងការតែងកំណាព្យបទពាក្យប្រាំពីរ។"
                    ),
                  className: `px-3 py-2 rounded-xl text-xs font-bold border transition duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                    isSpeaking
                      ? "bg-amber-500 text-slate-950 border-amber-300 animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-amber-200 border-white/20"
                  }`,
                  children: [
                    e.jsx("span", { children: "🔊" }),
                    e.jsx("span", { children: isSpeaking ? "កំពុងអាន..." : "ស្ដាប់សង្ខេបមេរៀន" })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex items-center bg-white/10 rounded-xl border border-white/20 p-0.5",
                  children: [
                    e.jsx("button", {
                      onClick: () => setFontScale((f) => Math.max(0.85, +(f - 0.1).toFixed(2))),
                      className: "px-2 py-1 text-xs font-black text-white hover:bg-white/15 rounded-lg cursor-pointer",
                      title: "បង្រួមអក្សរ",
                      children: "A-"
                    }),
                    e.jsx("button", {
                      onClick: () => setFontScale((f) => Math.min(1.35, +(f + 0.1).toFixed(2))),
                      className: "px-2 py-1 text-xs font-black text-amber-300 hover:bg-white/15 rounded-lg cursor-pointer",
                      title: "ពង្រីកអក្សរ",
                      children: "A+"
                    })
                  ]
                }),
                e.jsxs("button", {
                  onClick: () => setIsFullscreen(!isFullscreen),
                  className: "p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition text-xs flex items-center gap-1 cursor-pointer",
                  children: [
                    e.jsx("span", { children: "⛶" }),
                    e.jsx("span", { className: "hidden sm:inline", children: isFullscreen ? "បង្រួម" : "ពេញអេក្រង់" })
                  ]
                }),
                e.jsx("button", {
                  onClick: t,
                  className: "w-9 h-9 rounded-xl bg-red-500/80 hover:bg-red-600 text-white transition flex items-center justify-center font-bold text-lg cursor-pointer shadow-sm",
                  children: "✕"
                })
              ]
            })
          ]
        }),

        // MAIN TABS BAR
        e.jsxs("div", {
          className: "bg-slate-100 border-b border-slate-200 px-3 sm:px-5 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0",
          children: [
            e.jsxs("button", {
              onClick: () => setActiveTab("overview"),
              className: `px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-sm ring-2 ring-indigo-300"
                  : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200"
              }`,
              children: [e.jsx("span", { children: "📖" }), e.jsx("span", { children: "១. ខ្លឹមសារមេរៀនទាំង ៨ ផ្នែក (ទំព័រ ១–១៦)" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("textbook"),
              className: `px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "textbook"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm ring-2 ring-amber-300"
                  : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200"
              }`,
              children: [
                e.jsx("span", { children: "🖼️" }),
                e.jsx("span", { children: "២. សៀវភៅពុម្ពដើម (១៦ ទំព័រ)" }),
                e.jsx("span", { className: "px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black", children: "16" })
              ]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("sim"),
              className: `px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "sim"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm ring-2 ring-emerald-300"
                  : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200"
              }`,
              children: [e.jsx("span", { children: "🔬" }), e.jsx("span", { children: "៣. លំហាត់អន្តរកម្ម & វចនានុក្រម" })]
            }),
            e.jsxs("button", {
              onClick: () => setActiveTab("quiz"),
              className: `px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-gradient-to-r from-purple-700 to-pink-700 text-white shadow-sm ring-2 ring-purple-300"
                  : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200"
              }`,
              children: [
                e.jsx("span", { children: "📝" }),
                e.jsx("span", { children: "៤. ប្រឡងតេស្ត ៤០ QCM" }),
                e.jsx("span", { className: "px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black", children: questionsList.length })
              ]
            })
          ]
        }),

        // BODY CONTENT
        e.jsx("div", {
          className: "flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-50",
          children:
            activeTab === "overview"
              ? e.jsxs("div", {
                  className: "space-y-6 max-w-5xl mx-auto animate-fadeIn",
                  children: [
                    // SUB-NAVIGATION PILLS FOR THE 8 LESSON SECTIONS
                    e.jsxs("div", {
                      className: "bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-xs space-y-2",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between flex-wrap gap-2",
                          children: [
                            e.jsx("span", {
                              className: "text-xs font-black text-indigo-950 flex items-center gap-1.5",
                              children: "📌 ជ្រើសរើសផ្នែកនៃមេរៀនទី ១ (ទំព័រ ១ ដល់ ១៦) ៖"
                            }),
                            e.jsxs("button", {
                              onClick: () => setActiveTab("textbook"),
                              className: "text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-xl cursor-pointer flex items-center gap-1",
                              children: [e.jsx("span", { children: "🖼️" }), e.jsx("span", { children: "បើកមើលទំព័រសៀវភៅពុម្ពដើមទាំង ១៦ ទំព័រ" })]
                            })
                          ]
                        }),
                        e.jsx("div", {
                          className: "flex items-center gap-1.5 overflow-x-auto pb-1",
                          children: [
                            { id: "all", label: "✨ បង្ហាញទាំង ៨ ផ្នែក" },
                            { id: "sec1", label: "១. អ្នកមានគុណ (ទំ.១)" },
                            { id: "sec2", label: "២. ការប្រើវចនានុក្រម (ទំ.២-៤)" },
                            { id: "sec3", label: "៣. កតញ្ញូប្រាំប្រការ (ទំ.៥-៦)" },
                            { id: "sec4", label: "៤. សំណេរពណ៌នាម្ដាយ (ទំ.៧)" },
                            { id: "sec5", label: "៥. គំនិតសំខាន់ៗ & ការស្ដាប់ (ទំ.៨-១០)" },
                            { id: "sec6", label: "៦. វេយ្យាករណ៍ គុណនាមចំនួន (ទំ.១១-១២)" },
                            { id: "sec7", label: "៧. រឿង បងប្រុស (ទំ.១៣-១៤)" },
                            { id: "sec8", label: "៨. ការនិយាយ & តែងកំណាព្យ (ទំ.១៥-១៦)" }
                          ].map((tab) =>
                            e.jsx(
                              "button",
                              {
                                key: tab.id,
                                onClick: () => setSelectedSection(tab.id),
                                className: `px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                                  selectedSection === tab.id
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-800"
                                }`,
                                children: tab.label
                              },
                              tab.id
                            )
                          )
                        })
                      ]
                    }),

                    // ===================================================================
                    // SECTION 1: ទំព័រទី ១ — មេរៀនទី១ ៖ អ្នកមានគុណ (សេចក្ដីផ្ដើម)
                    // ===================================================================
                    showSec("sec1") &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden",
                        children: [
                          e.jsxs("div", {
                            className: "bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 border-b border-indigo-100 px-5 py-4 flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", {
                                    className: "w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-sm",
                                    children: "១"
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", { className: "text-[11px] font-extrabold text-indigo-700 uppercase", children: "ផ្នែកទី ១ • សៀវភៅពុម្ពទំព័រទី ១" }),
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg font-moul", children: "មេរៀនទី ១ ៖ អ្នកមានគុណ (សេចក្ដីផ្ដើម)" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsxs("button", {
                                    onClick: () => openTextbookPage(1),
                                    className: "text-xs font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 cursor-pointer flex items-center gap-1",
                                    children: [e.jsx("span", { children: "🖼️" }), e.jsx("span", { children: "មើលទំព័រទី ១" })]
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => toggleSpeech(TEXTBOOK_PAGES[0].audio),
                                    className: "text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1.5 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់អំណាន" })]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-5 sm:p-6 space-y-4 text-sm text-slate-800 leading-relaxed",
                            children: [
                              e.jsx("div", {
                                className: "p-5 bg-gradient-to-br from-amber-50/90 via-white to-indigo-50/60 border-2 border-amber-300/80 rounded-2xl shadow-xs",
                                children: e.jsx("p", {
                                  className: "text-base sm:text-lg font-semibold text-slate-900 leading-loose",
                                  children:
                                    "«អ្នកមានគុណ គឺអ្នកដែលបានធ្វើអំពើល្អគ្រប់បែបយ៉ាងដូចជា ចិញ្ចឹមបីបាច់ ថែទាំ ទូន្មានប្រៀនប្រដៅ បង្ហាត់បង្រៀន និងឧបត្ថម្ភគាំទ្រដល់យើង។ អ្នកមានគុណមាន មាតាបិតា ជីដូនជីតា បងប្អូន គ្រូបាអាចារ្យ និងឧបការី ឧបការិនីដទៃទៀតដែលបានជួយទំនុកបម្រុងយើង។ យើងត្រូវតបស្នងគុណអ្នកទាំងនោះឱ្យបានសមរម្យ។»"
                                })
                              }),
                              e.jsxs("div", {
                                className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs",
                                children: [
                                  e.jsxs("div", {
                                    className: "p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1",
                                    children: [
                                      e.jsx("div", { className: "font-black text-indigo-900 text-sm", children: "👨‍👩‍👧‍👦 ១. អ្នកមានគុណមាននរណាខ្លះ?" }),
                                      e.jsx("p", { className: "text-slate-700 leading-relaxed", children: "មាតាបិតា, ជីដូនជីតា, បងប្អូន, គ្រូបាអាចារ្យ និងឧបការី ឧបការិនីដទៃទៀត។" })
                                    ]
                                  }),
                                  e.jsxs("div", {
                                    className: "p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1",
                                    children: [
                                      e.jsx("div", { className: "font-black text-emerald-900 text-sm", children: "💝 ២. អំពើល្អរបស់អ្នកមានគុណ" }),
                                      e.jsx("p", { className: "text-slate-700 leading-relaxed", children: "ចិញ្ចឹមបីបាច់, ថែទាំ, ទូន្មានប្រៀនប្រដៅ, បង្ហាត់បង្រៀន និងឧបត្ថម្ភគាំទ្រដល់យើង។" })
                                    ]
                                  }),
                                  e.jsxs("div", {
                                    className: "p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1",
                                    children: [
                                      e.jsx("div", { className: "font-black text-amber-900 text-sm", children: "🙏 ៣. ករណីយកិច្ចរបស់យើង" }),
                                      e.jsx("p", { className: "text-slate-700 leading-relaxed", children: "យើងត្រូវគោរព ស្រឡាញ់ ដឹងគុណ និងតបស្នងសងគុណអ្នកទាំងនោះឱ្យបានសមរម្យ។" })
                                    ]
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    // ===================================================================
                    // SECTION 2: ទំព័រទី ២–៤ — ការប្រើវចនានុក្រម
                    // ===================================================================
                    showSec("sec2") &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden",
                        children: [
                          e.jsxs("div", {
                            className: "bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border-b border-indigo-100 px-5 py-4 flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", {
                                    className: "w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-sm",
                                    children: "២"
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", { className: "text-[11px] font-extrabold text-blue-700 uppercase", children: "ផ្នែកទី ២ • សៀវភៅពុម្ពទំព័រទី ២ ដល់ ៤" }),
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg font-moul", children: "ការប្រើវចនានុក្រម (អក្សរសង្ខេប មេពាក្យ និងលំហាត់)" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsxs("button", {
                                    onClick: () => openTextbookPage(2),
                                    className: "text-xs font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 cursor-pointer",
                                    children: ["🖼️ ទំព័រ ២–៤"]
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => toggleSpeech(TEXTBOOK_PAGES[1].audio + " " + TEXTBOOK_PAGES[2].audio),
                                    className: "text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-5 sm:p-6 space-y-5 text-sm text-slate-800 leading-relaxed",
                            children: [
                              // Parrot dialogue & intro (Page 2)
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-bold text-sky-950 text-xs uppercase tracking-wider", children: "💬 សន្ទនាទំព័រទី ២ (កុមារី និងសត្វសេកបណ្ឌិត) ៖" }),
                                  e.jsx("p", { className: "text-xs sm:text-sm text-slate-800", children: "👧 កុមារី (កាន់សៀវភៅមានពាក្យ «កតញ្ញូ») ៖ «អ្នកអាចប្រាប់ខ្ញុំបានទេ ថាតើពាក្យនេះអានដូចម្ដេច?»" }),
                                  e.jsx("p", { className: "text-xs sm:text-sm text-emerald-900 font-bold", children: "🦜 សត្វសេក ៖ «ទេ! ខ្ញុំមិនចេះទេ ប៉ុន្តែ វចនានុក្រមអាចប្រាប់អ្នកបាន។»" }),
                                  e.jsx("p", {
                                    className: "text-xs sm:text-sm text-slate-700 pt-1 border-t border-sky-200/70",
                                    children: "ពេលអ្នកអានអត្ថបទអ្វីមួយហើយជួបប្រទះពាក្យដែលអ្នកមិនចេះអាន ឬមិនយល់ន័យ អ្នកអាចបើកមើលក្នុងវចនានុក្រម។ វចនានុក្រមនឹងបង្ហាញអ្នកអំពីសូរអាន ថ្នាក់ពាក្យ ប្រភព និងសេចក្ដីពន្យល់ន័យរបស់ពាក្យនោះ។"
                                  })
                                ]
                              }),

                              // Abbreviations Table (Page 2)
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-slate-900 text-sm", children: "📋 តារាងអក្សរសង្ខេបក្នុងវចនានុក្រមខ្មែរ (ទំព័រ ២) ៖" }),
                                  e.jsx("div", {
                                    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs",
                                    children: ABBREVIATIONS.map((item, i) =>
                                      e.jsxs(
                                        "div",
                                        {
                                          key: i,
                                          className: "p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2",
                                          children: [
                                            e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-black shrink-0", children: item.abbr }),
                                            e.jsx("span", { className: "text-slate-800 font-semibold", children: item.full })
                                          ]
                                        },
                                        i
                                      )
                                    )
                                  })
                                ]
                              }),

                              // Structure of Dictionary Entry & Rule Box (Page 3)
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-black text-amber-950 text-sm", children: "📌 រចនាសម្ព័ន្ធមេពាក្យ និងបញ្ញត្តិវចនានុក្រម (ទំព័រ ៣) ៖" }),
                                  e.jsx("p", {
                                    className: "text-xs sm:text-sm text-slate-800 leading-relaxed",
                                    children:
                                      "ពាក្យនៅខាងដើមជួរនីមួយៗ ជាពាក្យដែលត្រូវពន្យល់ ហៅថា “មេពាក្យ” (សរសេរអក្សរធំ ដិត រៀបតាមលំដាប់ព្យញ្ជនៈនិងស្រៈ)។ អក្សរក្នុងវង់ក្រចកជា សូរអានមេពាក្យ។ អក្សរកាត់បន្ទាប់ពីសូរអានគឺជា ថ្នាក់ពាក្យ រីឯអក្សរកាត់ក្នុងវង់ក្រចកបន្ទាប់ពីថ្នាក់ពាក្យប្រាប់ ប្រភពពាក្យ។ បន្ទាប់មកគឺជា សេចក្ដីពន្យល់ន័យរបស់មេពាក្យ។"
                                  }),
                                  e.jsx("div", {
                                    className: "p-3 bg-white rounded-xl border border-amber-400 font-bold text-indigo-950 text-xs sm:text-sm",
                                    children: "📖 បញ្ញត្តិ ៖ «វចនានុក្រម គឺជាបញ្ជីពាក្យដែលត្រូវបានរៀបតាមអក្ខរក្រម (លំដាប់អក្សរ) ដោយមានសូរអាន ថ្នាក់ពាក្យ ប្រភពពាក្យ និងសេចក្ដីពន្យល់ន័យមេពាក្យ។»"
                                  })
                                ]
                              }),

                              // Exercises on Page 4 with complete solutions
                              e.jsxs("div", {
                                className: "space-y-3 pt-2",
                                children: [
                                  e.jsx("h4", { className: "font-bold text-slate-900 text-sm", children: "✅ កំណែលំហាត់ការប្រើវចនានុក្រម (ទំព័រ ៤) ៖" }),
                                  e.jsxs("div", {
                                    className: "p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs sm:text-sm",
                                    children: [
                                      e.jsx("div", { className: "font-black text-emerald-950", children: "ខ. រៀបពាក្យតាមលំដាប់អក្សរ (សោមនស្ស, មាតា, ឧបត្ថម្ភ, គង្គា, ឧបការី, មេត្តា) ៖" }),
                                      e.jsx("p", {
                                        className: "font-bold text-indigo-900 bg-white p-3 rounded-xl border border-emerald-300",
                                        children: "លំដាប់ត្រឹមត្រូវ ៖ ១. គង្គា ➔ ២. មាតា ➔ ៣. មេត្តា ➔ ៤. សោមនស្ស ➔ ៥. ឧបការី ➔ ៦. ឧបត្ថម្ភ"
                                      }),
                                      e.jsx("div", { className: "font-black text-emerald-950 pt-2", children: "គ. គំរូល្បះដោយប្រើពាក្យនីមួយៗ ៖" }),
                                      e.jsxs("ul", {
                                        className: "list-disc pl-5 space-y-1 text-slate-800",
                                        children: [
                                          e.jsx("li", { children: "គង្គា ៖ ទឹកទន្លេមេគង្គហូរលាតសន្ធឹងដូចផ្ទៃគង្គាដ៏ធំល្វឹងល្វើយ។" }),
                                          e.jsx("li", { children: "មាតា ៖ មាតាបិតាជាព្រះរស់ដែលកូនគ្រប់រូបត្រូវគោរពដឹងគុណ។" }),
                                          e.jsx("li", { children: "មេត្តា ៖ អ្នកម្ដាយតែងមានទឹកចិត្តមេត្តាករុណាចំពោះកូនគ្រប់ៗគ្នា។" }),
                                          e.jsx("li", { children: "សោមនស្ស ៖ សុខាមានក្ដីសោមនស្សយ៉ាងខ្លាំងព្រោះប្រឡងជាប់លេខ១។" }),
                                          e.jsx("li", { children: "ឧបការី ៖ លោកពូជាឧបការីដ៏មានគុណដែលបានជួយផ្គត់ផ្គង់ការសិក្សារបស់ខ្ញុំ។" }),
                                          e.jsx("li", { children: "ឧបត្ថម្ភ ៖ បងប្រុសខិតខំធ្វើការដើម្បីរកប្រាក់ឧបត្ថម្ភប្អូនឱ្យបានរៀនសូត្រ។" })
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

                    // ===================================================================
                    // SECTION 3: ទំព័រទី ៥–៦ — អំណាន ៖ កតញ្ញូប្រាំប្រការ (បទពាក្យប្រាំពីរ)
                    // ===================================================================
                    showSec("sec3") &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden",
                        children: [
                          e.jsxs("div", {
                            className: "bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-200 px-5 py-4 flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", {
                                    className: "w-10 h-10 rounded-2xl bg-amber-600 text-white font-black text-base flex items-center justify-center shadow-sm",
                                    children: "៣"
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", { className: "text-[11px] font-extrabold text-amber-800 uppercase", children: "ផ្នែកទី ៣ • សៀវភៅពុម្ពទំព័រទី ៥ ដល់ ៦" }),
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg font-moul", children: "អំណាន ៖ កតញ្ញូប្រាំប្រការ (បទពាក្យប្រាំពីរ)" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsxs("button", {
                                    onClick: () => openTextbookPage(5),
                                    className: "text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 cursor-pointer",
                                    children: ["🖼️ ទំព័រ ៥–៦"]
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => toggleSpeech(TEXTBOOK_PAGES[4].audio),
                                    className: "text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-xl border border-amber-400 flex items-center gap-1.5 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់កំណាព្យទាំង ៥ វគ្គ" })]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-5 sm:p-6 space-y-5 text-sm text-slate-800 leading-relaxed",
                            children: [
                              // Full 5 stanzas of កតញ្ញូប្រាំប្រការ
                              e.jsx("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                                children: [
                                  {
                                    stanza: "វគ្គទី ១ (ប្រការទី ១ ៖ ការផ្គត់ផ្គង់ចំណីអាហារ សម្លៀកបំពាក់ និងថ្នាំសង្កូវ)",
                                    lines: ["កូនត្រូវតបគុណម្ដាយឪពុក", "ផ្គត់ផ្គង់ហូបចុកគ្រឿងធានា", "សម្លៀកបំពាក់ថ្នាំការពារ", "ឈឺគ្រុនរងាញ័រញាក់ក្ដៅ។"]
                                  },
                                  {
                                    stanza: "វគ្គទី ២ (ប្រការទី ២ ៖ ការជួយធុរៈការងារ និងមើលថែឱ្យលោកស្រាន្ត)",
                                    lines: ["ត្រូវជួយធុរៈអ្នកមានគុណ", "កាប់គាស់រែកពុនកុំហ្មងសៅ", "ទោះបីនឿយហត់ត្រជាក់ក្ដៅ", "មើលថែម៉ែឪឱ្យលោកស្រាន្ត។"]
                                  },
                                  {
                                    stanza: "វគ្គទី ៣ (ប្រការទី ៣ ៖ ការរក្សាពូជពង្សញាតិ និងកេរ្តិ៍ឈ្មោះត្រកូល)",
                                    lines: ["ត្រូវចេះរក្សាពូជពង្សញាតិ", "មិត្តភក្ដិផងទៀតផៅសន្តាន", "កេរ្តិ៍ឈ្មោះត្រកូលឱ្យថ្កើងថ្កាន", "ជៀសវាងឱ្យបានកុំទាស់គ្នា។"]
                                  },
                                  {
                                    stanza: "វគ្គទី ៤ (ប្រការទី ៤ ៖ ការបម្រើដោយវាចាទន់ភ្លន់ និងវន្ទាដោយភក្ដី)",
                                    lines: ["កូនត្រូវបម្រើអ្នកមានគុណ", "វាចាទន់ភ្លន់គ្រប់វេលា", "ព្រោះជាព្រះរស់នៃបុត្រភ្ងា", "កូនត្រូវវន្ទាដោយភក្ដី។"]
                                  },
                                  {
                                    stanza: "វគ្គទី ៥ (ប្រការទី ៥ ៖ ការធ្វើបុណ្យឧទ្ទិសកុសលតាមប្រពៃណីពេលលោកចែកឋាន)",
                                    lines: ["នៅពេលមាតាឬបិតា", "រលត់សង្ខារលាលោកិយ", "កូនធ្វើបុណ្យតាមប្រពៃណី", "បុត្រាបុត្រីត្រូវចងចាំ។"]
                                  }
                                ].map((v, idx) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      key: idx,
                                      className: "p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2",
                                      children: [
                                        e.jsx("div", { className: "text-xs font-black text-amber-900 border-b border-amber-200 pb-1", children: v.stanza }),
                                        e.jsx("div", {
                                          className: "grid grid-cols-2 gap-x-4 gap-y-1.5 font-semibold text-slate-900 text-xs sm:text-sm pt-1",
                                          children: v.lines.map((ln, li) => e.jsx("div", { key: li, children: ln }))
                                        })
                                      ]
                                    },
                                    idx
                                  )
                                )
                              }),

                              // Answers to the 8 Questions & Exercises on Page 6
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs sm:text-sm",
                                children: [
                                  e.jsx("h4", { className: "font-black text-indigo-950 text-sm", children: "📝 ចម្លើយសំណួរ និងលំហាត់ទំព័រទី ៦ ៖" }),
                                  e.jsx("p", { children: "១. ពាក្យ “កតញ្ញូ” មានន័យថា អ្នកដឹងគុណ គឺការដឹងនូវឧបការគុណដែលអ្នកដទៃបានធ្វើមកលើខ្លួន។ ឧទាហរណ៍៖ កូនកតញ្ញូខិតខំរៀនសូត្រ និងជួយការងារផ្ទះដើម្បីសងគុណមាតាបិតា។" }),
                                  e.jsx("p", { children: "២. កូនត្រូវមានកតញ្ញូ ៥ ប្រការ ចំពោះម្ដាយឪពុក (ផ្គត់ផ្គង់ចំណីអាហារសម្លៀកបំពាក់ថ្នាំសង្កូវ, ជួយធុរៈការងារមើលថែឱ្យលោកស្រាន្ត, រក្សាពូជពង្សញាតិនិងកេរ្តិ៍ឈ្មោះត្រកូល, បម្រើដោយវាចាទន់ភ្លន់និងវន្ទាដោយភក្ដី, ធ្វើបុណ្យតាមប្រពៃណីពេលលោករលត់សង្ខារ)។" }),
                                  e.jsx("p", { children: "៧. កំណាព្យនេះមាន ៥ វគ្គ ហើយក្នុងមួយវគ្គមាន ៤ ឃ្លា (ក្នុងមួយឃ្លាមាន ៧ ព្យាង្គ)។" }),
                                  e.jsx("p", {
                                    className: "font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200",
                                    children: "លំហាត់ ខ (ផ្គូផ្គងពាក្យន័យដូច) ៖ ១. វាចា = ខ. សម្ដី | ២. សព = ង. ខ្មោច | ៣. បុត្រ = ឃ. កូន | ៤. វន្ទា = ច. សំពះ | ៥. មាតា = ក. ម្ដាយ | ៦. បិតា = គ. ឪពុក"
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    // ===================================================================
                    // SECTION 4: ទំព័រទី ៧ — សំណេរ ៖ តែងល្បះ និងតែងសេចក្ដីពណ៌នាអំពីម្ដាយ
                    // ===================================================================
                    showSec("sec4") &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden",
                        children: [
                          e.jsxs("div", {
                            className: "bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border-b border-rose-100 px-5 py-4 flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", {
                                    className: "w-10 h-10 rounded-2xl bg-rose-600 text-white font-black text-base flex items-center justify-center shadow-sm",
                                    children: "៤"
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", { className: "text-[11px] font-extrabold text-rose-700 uppercase", children: "ផ្នែកទី ៤ • សៀវភៅពុម្ពទំព័រទី ៧" }),
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg font-moul", children: "សំណេរ ៖ ការតែងល្បះ និងតែងសេចក្ដីពណ៌នាអំពីម្ដាយ" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsxs("button", {
                                    onClick: () => openTextbookPage(7),
                                    className: "text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-xl border border-rose-300 cursor-pointer",
                                    children: ["🖼️ ទំព័រទី ៧"]
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => toggleSpeech(TEXTBOOK_PAGES[6].audio),
                                    className: "text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed",
                            children: [
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-black text-rose-950", children: "ក. គំរូតែងល្បះដោយប្រើពាក្យ «គុណ, ចិញ្ចឹម, សងគុណ, ស្រឡាញ់» ៖" }),
                                  e.jsxs("ul", {
                                    className: "list-disc pl-5 space-y-1",
                                    children: [
                                      e.jsx("li", { children: "គុណ ៖ មាតាបិតាមានគុណដ៏ធំធេងមិនអាចកាត់ថ្លៃបានមកលើកូនប្រុសស្រី។" }),
                                      e.jsx("li", { children: "ចិញ្ចឹម ៖ អ្នកម្ដាយខិតខំធ្វើការងារទាំងយប់ទាំងថ្ងៃដើម្បីចិញ្ចឹមកូនឱ្យបានរៀនសូត្រ។" }),
                                      e.jsx("li", { children: "សងគុណ ៖ យើងត្រូវខិតខំរៀនសូត្រនិងធ្វើជាកូនល្អដើម្បីសងគុណមាតាបិតា។" }),
                                      e.jsx("li", { children: "ស្រឡាញ់ ៖ ខ្ញុំស្រឡាញ់និងគោរពអ្នកម្ដាយរបស់ខ្ញុំអស់ពីដួងចិត្ត។" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-black text-amber-950", children: "ខ. ល្បះទាក់ទងគ្នា ៥ ល្បះតាមរូបភាព (កូនៗមើលថែម្ដាយពេលគាត់ឈឺ) ៖" }),
                                  e.jsx("p", {
                                    className: "leading-loose",
                                    children:
                                      "១. ថ្ងៃនេះអ្នកម្ដាយរបស់សុខាមានជំងឺគ្រុនក្ដៅ ហើយសម្រាន្តនៅលើគ្រែ។ ២. សុខាបានយកកន្សែងชุបទឹកស្អាតមកជូតខ្លួននិងដាក់លើថ្ងាសជូនម្ដាយ។ ៣. ចំណែកប្អូនប្រុសបានយកទឹកក្ដៅឧណ្ហៗនិងថ្នាំពេទ្យមកជូនអ្នកម្ដាយពិសា។ ៤. កូនទាំងពីរនាក់អង្គុយមើលថែទាំម្ដាយដោយក្ដីព្រួយបារម្ភនិងយកចិត្តទុកដាក់បំផុត។ ៥. មិនយូរប៉ុន្មាន អ្នកម្ដាយក៏បានធូរស្រាលពីជំងឺ ហើយញញឹមពេញចិត្តនឹងកូនកតញ្ញូទាំងពីរ។"
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-black text-indigo-950", children: "គ. គម្រោង និងគំរូតែងសេចក្ដីពណ៌នាអំពីម្ដាយ (ទំព័រ ៧) ៖" }),
                                  e.jsx("p", { children: "១. សេចក្ដីផ្ដើម (ឈ្មោះ អាយុ មុខរបរ ទីកន្លែងរស់នៅ) ៖ អ្នកម្ដាយរបស់ខ្ញុំឈ្មោះ សំ សុផា គាត់មានអាយុ ៤២ ឆ្នាំ។ សព្វថ្ងៃគាត់ជាកសិករ និងជាស្ត្រីមេផ្ទះ រស់នៅក្នុងភូមិសុខសាន្ត។" }),
                                  e.jsx("p", { children: "២. តួសេចក្ដី (រូបសម្បត្តិ ចរិយាសម្បត្តិ សកម្មភាព) ៖ អ្នកម្ដាយខ្ញុំមានរូបរាងសមសួន សម្បុរស្រអែម ទម្រង់មុខពងក្រពើ សក់ខ្មៅរលោង និងមានទឹកមុខញញឹមស្រស់ស្រាយជានិច្ច។ គាត់មានចរិយាសម្បត្តិស្លូតបូត សុភាពរាបសា ឧស្សាហ៍ព្យាយាម និងចេះយោគយល់អធ្យាស្រ័យដល់អ្នកជិតខាង។ រាល់ថ្ងៃគាត់ក្រោកតាំងពីព្រលឹមដើម្បីដាំបាយធ្វើម្ហូប ចិញ្ចឹមបីបាច់ថែរក្សាកូនៗ និងអប់រំទូន្មានកូនឱ្យខិតខំរៀនសូត្រ។" }),
                                  e.jsx("p", { children: "៣. សេចក្ដីបញ្ចប់ (ចំណាប់អារម្មណ៍ចំពោះម្ដាយ) ៖ ខ្ញុំស្រឡាញ់និងគោរពអ្នកម្ដាយរបស់ខ្ញុំខ្លាំងណាស់ ហើយខ្ញុំប្ដេជ្ញាខិតខំរៀនសូត្រដើម្បីតបស្នងសងគុណដ៏ធំធេងរបស់គាត់។" })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    // ===================================================================
                    // SECTION 5: ទំព័រទី ៨–១០ — ការកត់ត្រាគំនិតសំខាន់ៗក្នុងកំណាព្យ & ការស្ដាប់
                    // ===================================================================
                    showSec("sec5") &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden",
                        children: [
                          e.jsxs("div", {
                            className: "bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 border-b border-purple-100 px-5 py-4 flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", {
                                    className: "w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shadow-sm",
                                    children: "៥"
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", { className: "text-[11px] font-extrabold text-purple-700 uppercase", children: "ផ្នែកទី ៥ • សៀវភៅពុម្ពទំព័រទី ៨ ដល់ ១០" }),
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg font-moul", children: "ការកត់ត្រាគំនិតសំខាន់ៗក្នុងកំណាព្យ និងការស្ដាប់ (ការគោរពគ្រូ)" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsxs("button", {
                                    onClick: () => openTextbookPage(8),
                                    className: "text-xs font-bold text-purple-800 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-xl border border-purple-300 cursor-pointer",
                                    children: ["🖼️ ទំព័រ ៨–១០"]
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => toggleSpeech(TEXTBOOK_PAGES[7].audio + " " + TEXTBOOK_PAGES[8].audio + " " + TEXTBOOK_PAGES[9].audio),
                                    className: "text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់អំណាន" })]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-slate-800 leading-relaxed",
                            children: [
                              // Page 8: ច្បាប់គោរពមាតាបិតា (បទកាកគតិ) របស់លោក អ៊ូ ចុង
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3",
                                children: [
                                  e.jsx("div", { className: "font-black text-purple-950 text-sm", children: "📜 ១. កំណាព្យបទកាកគតិ ដកស្រង់ពី «ច្បាប់គោរពមាតាបិតា» របស់លោក អ៊ូ ចុង (ទំព័រ ៨) ៖" }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-purple-200 font-semibold text-slate-900",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("div", { className: "text-xs text-purple-700 font-bold mb-1", children: "វគ្គទី ១ ៖" }),
                                          e.jsx("p", { children: "ត្រូវធ្វើបុណ្យខ្នើត / ម៉ែឪស៊ីកើត / កំពុងស្រេកឃ្លាន / ម៉ែឪរស់នៅ / កូនត្រូវធ្វើទាន / បំបាត់ក្ដីឃ្លាន / ហៅធ្វើបុណ្យខ្នើត។" })
                                        ]
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("div", { className: "text-xs text-purple-700 font-bold mb-1", children: "វគ្គទី ២ ៖" }),
                                          e.jsx("p", { children: "ហៅបុណ្យខែភ្លឺ / កុំចាំគាត់ឈឺ / ពិសាលែងកើត / ជូនគាត់ពេលជា / ហៅថាបុណ្យខ្នើត / គាត់ពិសាកើត / បានជាងរនោច។" })
                                        ]
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("div", { className: "text-xs text-purple-700 font-bold mb-1", children: "វគ្គទី ៣ ៖" }),
                                          e.jsx("p", { children: "លុះបាត់ជីវិត / បុណ្យខែងងឹត / ដូចថ្ងៃដប់រោច / កូនចៅទាំងឡាយ / យកបាយឱ្យខ្មោច / ម៉ែឥតប្រយោជន៍ / ខ្មោចណាចេះស៊ី។" })
                                        ]
                                      })
                                    ]
                                  }),
                                  e.jsxs("div", {
                                    className: "p-3 bg-amber-50 rounded-xl border border-amber-300 space-y-1",
                                    children: [
                                      e.jsx("div", { className: "font-bold text-amber-950", children: "💡 គំនិតសំខាន់ៗ និងបញ្ញត្តិ (ទំព័រ ៨) ៖" }),
                                      e.jsx("p", { children: "• ធ្វើបុណ្យទាន់ខែភ្លឺ ឬខ្នើត ៖ ម៉ែឪនៅរស់ ម៉ែឪពិសាកើត កំពុងស្រេកឃ្លាន កូនត្រូវជូនចំណីអាហារ កុំចាំគាត់ឈឺពិសាលែងកើត។" }),
                                      e.jsx("p", { children: "• ធ្វើបុណ្យខែងងឹត ៖ ម៉ែឪបាត់ជីវិត យកបាយឱ្យខ្មោចស៊ី ម៉ែឪឥតបានប្រយោជន៍។" }),
                                      e.jsx("p", { className: "font-bold text-indigo-950 pt-1", children: "📖 បញ្ញត្តិ ៖ «ការកត់ត្រាគំនិតសំខាន់ៗ គឺការកត់ពាក្យ កន្សោមពាក្យ ឃ្លាដែលប្រាប់គំនិតសំខាន់ៗក្នុងអត្ថបទ។»" })
                                    ]
                                  })
                                ]
                              }),

                              // Page 9: សន្តានចិត្តរបស់អ្នកម្ដាយ (បទព្រហ្មគីតិ)
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-black text-pink-950 text-sm", children: "🌸 ២. លំហាត់កំណាព្យ «សន្តានចិត្តរបស់អ្នកម្ដាយ» បទព្រហ្មគីតិ (ទំព័រ ៩) ៖" }),
                                  e.jsx("p", { className: "font-semibold text-slate-900", children: "• វគ្គទី១ ៖ ពេលកូនមកចាប់ផ្ទៃ / ក្នុងហឫទ័យម្ដាយសប្បាយ / ម៉ែតែងតែខ្វល់ខ្វាយ / រកឧបាយថែរក្សា។" }),
                                  e.jsx("p", { className: "font-semibold text-slate-900", children: "• វគ្គទី២ ៖ ធ្វើអ្វីតែងប្រយ័ត្ន / មិនឱ្យភ្លាត់ខ្លាចប៉ះពារ / ឱ្យកូនបានសុខជា / ម្ដាយធានាគាំពារស្ងួន។" }),
                                  e.jsx("p", { className: "font-semibold text-slate-900", children: "• វគ្គទី៣ ៖ ស៊ូនឿយព្រោះថ្លើមថ្លៃ / រង់ចាំថ្ងៃប្រសូតនួន / បានឃើញមុខកូនស្ងួន / ថ្នមថែថួនព្រោះស្រឡាញ់។" }),
                                  e.jsx("p", { className: "text-xs text-pink-900 font-bold pt-1", children: "➔ គំនិតសំខាន់ៗ ៖ ទឹកចិត្តម្ដាយសប្បាយនិងខ្វល់ខ្វាយថែរក្សាតាំងពីកូនចាប់ផ្ទៃ ប្រុងប្រយ័ត្នការពារកូនឱ្យសុខជា និងស៊ូនឿយហត់ថ្នមថែថួនកូនដោយក្ដីស្រឡាញ់។" })
                                ]
                              }),

                              // Page 10: ការស្ដាប់ ៖ ការគោរពលោកគ្រូ អ្នកគ្រូ
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-black text-emerald-950 text-sm", children: "🎧 ៣. ការស្ដាប់ ៖ ការគោរពលោកគ្រូ អ្នកគ្រូ (ទំព័រ ១០) ៖" }),
                                  e.jsx("p", { children: "ចម្លើយលំហាត់គូសសញ្ញា ✓ នៅមុខល្បះដែលជាគំនិតសំខាន់ៗក្នុងអត្ថបទកំណាព្យ ៖" }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold",
                                    children: [
                                      e.jsx("div", { className: "p-2.5 rounded-xl bg-white border border-emerald-400 text-emerald-900", children: "[ ✓ ] ១. សិស្សក្រោកឈរនិងប្រកាន់ការស្ងៀមស្ងាត់ពេលគ្រូមកដល់។" }),
                                      e.jsx("div", { className: "p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400", children: "[ ✗ ] ២. សិស្សត្រូវធ្វើត្រាប់តាមពុតគ្រូ។" }),
                                      e.jsx("div", { className: "p-2.5 rounded-xl bg-white border border-emerald-400 text-emerald-900", children: "[ ✓ ] ៣. សិស្សធ្វើកិច្ចការដែលគ្រូដាក់ឱ្យដោយផ្ចិតផ្ចង់។" }),
                                      e.jsx("div", { className: "p-2.5 rounded-xl bg-white border border-emerald-400 text-emerald-900", children: "[ ✓ ] ៤. សិស្សយកចិត្តទុកដាក់ស្ដាប់គ្រូពន្យល់។" }),
                                      e.jsx("div", { className: "p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400", children: "[ ✗ ] ៥. សិស្សត្រូវមានស្មារតីសាមគ្គីភាព។" }),
                                      e.jsx("div", { className: "p-2.5 rounded-xl bg-white border border-emerald-400 text-emerald-900", children: "[ ✓ ] ៦. សិស្សត្រូវចូលរួមរំលែកទុក្ខរបស់គ្រូ ពេលគាត់មានធុរៈ។" })
                                    ]
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    // ===================================================================
                    // SECTION 6: ទំព័រទី ១១–១២ — វេយ្យាករណ៍ ៖ គុណនាមចំនួន
                    // ===================================================================
                    showSec("sec6") &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden",
                        children: [
                          e.jsxs("div", {
                            className: "bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100 px-5 py-4 flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", {
                                    className: "w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-sm",
                                    children: "៦"
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", { className: "text-[11px] font-extrabold text-emerald-700 uppercase", children: "ផ្នែកទី ៦ • សៀវភៅពុម្ពទំព័រទី ១១ ដល់ ១២" }),
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg font-moul", children: "វេយ្យាករណ៍ ៖ គុណនាមចំនួន (គុណនាមចំនួនរាប់ និងគុណនាមចំនួនរៀប)" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsxs("button", {
                                    onClick: () => openTextbookPage(11),
                                    className: "text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-300 cursor-pointer",
                                    children: ["🖼️ ទំព័រ ១១–១២"]
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => toggleSpeech(TEXTBOOK_PAGES[10].audio + " " + TEXTBOOK_PAGES[11].audio),
                                    className: "text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ពន្យល់" })]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed",
                            children: [
                              e.jsxs("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                  e.jsxs("div", {
                                    className: "p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-2",
                                    children: [
                                      e.jsx("div", { className: "font-black text-emerald-950 text-sm", children: "🔢 ក. គុណនាមចំនួនរាប់ (ទំព័រ ១១)" }),
                                      e.jsx("p", { className: "font-bold text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-200", children: "បញ្ញត្តិ ៖ «គុណនាមចំនួនរាប់ គឺជាគុណនាមប្រាប់ចំនួនមនុស្ស សត្វ វត្ថុ ដែលគេរាប់។»" }),
                                      e.jsx("p", { children: "ឧទាហរណ៍ ៖ ប្រាំមួយនាក់, បួននាក់, បីមុខ, មួយមុខ, ប្រាំបួន, ឆ្មាមួយ។" }),
                                      e.jsx("p", { className: "font-bold text-slate-900", children: "✅ លំហាត់ ក (ទំព័រ ១២) — គុណនាមចំនួនរាប់ ៖ ដប់ពីរ, មួយឡូ, បួនរយ, បីពាន់, ប្រាំមួយ, សាមសិប, ពីរម៉ឺន។" })
                                    ]
                                  }),
                                  e.jsxs("div", {
                                    className: "p-4 rounded-2xl bg-sky-50/70 border-2 border-sky-300 space-y-2",
                                    children: [
                                      e.jsx("div", { className: "font-black text-sky-950 text-sm", children: "🏅 ខ. គុណនាមចំនួនរៀប (ទំព័រ ១២)" }),
                                      e.jsx("p", { className: "font-bold text-sky-900 bg-white p-2.5 rounded-xl border border-sky-200", children: "បញ្ញត្តិ ៖ «គុណនាមចំនួនរៀប គឺជាគុណនាមប្រាប់ទី លំដាប់ ជាន់ ឬថ្នាក់ ដែលគេរៀប។»" }),
                                      e.jsx("p", { children: "ឧទាហរណ៍ ៖ កូនទីមួយ, ថ្នាក់ទីប្រាំបី, កូនទីបី, ថ្នាក់ទីប្រាំមួយ, កូនទីបួន, លេខ២, ម៉ោងដប់មួយ។" }),
                                      e.jsx("p", { className: "font-bold text-slate-900", children: "✅ លំហាត់ ក (ទំព័រ ១២) — គុណនាមចំនួនរៀប ៖ ទីប្រាំ, ថ្នាក់ទី៣, ជាន់ទីពីរ, ទីហាសិប, ម៉ោងប្រាំមួយ, យប់ទីបី។" })
                                    ]
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    // ===================================================================
                    // SECTION 7: ទំព័រទី ១៣–១៤ — អំណាន ៖ រឿង បងប្រុស
                    // ===================================================================
                    showSec("sec7") &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden",
                        children: [
                          e.jsxs("div", {
                            className: "bg-gradient-to-r from-amber-50 via-yellow-50 to-emerald-50 border-b border-amber-200 px-5 py-4 flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", {
                                    className: "w-10 h-10 rounded-2xl bg-amber-600 text-white font-black text-base flex items-center justify-center shadow-sm",
                                    children: "៧"
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", { className: "text-[11px] font-extrabold text-amber-800 uppercase", children: "ផ្នែកទី ៧ • សៀវភៅពុម្ពទំព័រទី ១៣ ដល់ ១៤" }),
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg font-moul", children: "អំណាន ៖ រឿង បងប្រុស (និត និង នួន) និងការតែងរឿងខ្លី" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsxs("button", {
                                    onClick: () => openTextbookPage(13),
                                    className: "text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 cursor-pointer",
                                    children: ["🖼️ ទំព័រ ១៣–១៤"]
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => toggleSpeech(TEXTBOOK_PAGES[12].audio + " " + TEXTBOOK_PAGES[13].audio),
                                    className: "text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់រឿង បងប្រុស" })]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed",
                            children: [
                              e.jsxs("div", {
                                className: "p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3 leading-loose",
                                children: [
                                  e.jsx("p", {
                                    children:
                                      "និតនិងនួនជាបងប្អូនបង្កើតនឹងគ្នា។ តាំងពីអ្នកមានគុណបានចែកឋានទៅ ជីវភាពគ្រួសារពួកគេជួបការលំបាកយ៉ាងខ្លាំង។ និតជាបងបានសម្រេចចិត្តផ្អាកការរៀនសូត្រមួយរយៈ ដោយទុកឱ្យប្អូនបានសិក្សាបន្តទៀត។ នួនខំរៀនណាស់មិនឱ្យបងខកចិត្តឡើយ។ ឯនិតវិញ ពេលទំនេរពីការងារស្រែចម្ការ គេបានចូលសិក្សានៅក្នុងមជ្ឈមណ្ឌលសិក្សាសហគមន៍។"
                                  }),
                                  e.jsx("p", {
                                    children:
                                      "ឆ្នាំនេះ នួនរៀននៅថ្នាក់ទី១២ ហើយបានប្រឡងជាប់ដូចប្រាថ្នា។ ថ្ងៃមួយ នួនចង់ទៅរកការងារធ្វើ ដើម្បីជួយសម្រាលបន្ទុកបង តែនិតមិនយល់ព្រម។ នួនសួរបង ៖ “តើយើងបានប្រាក់ពីណា?” ។ និតឆ្លើយ ៖ “ឯងកុំបារម្ភ! ទុកឱ្យបងជាអ្នកដោះស្រាយ” ។"
                                  }),
                                  e.jsx("p", {
                                    children:
                                      "ថ្ងៃមួយ និតនិងអ្នកភូមិខ្លះបាននាំគ្នាទៅខ្ចីប្រាក់ឥណទានពីធនាគារភូមិ យកមកធ្វើជាដើមទុនក្នុងការចិញ្ចឹមជ្រូកនិងត្រី។ ជាលើកដំបូង និតបានត្រឹមតែរួចដើមប៉ុណ្ណោះ។ ក្រោយមក និតបានរៀនបច្ចេកទេសចិញ្ចឹមសត្វពីមជ្ឈមណ្ឌលសិក្សាសហគមន៍។ ចាប់ពីពេលនោះមក និតចេះជំនាញចិញ្ចឹមសត្វច្បាស់លាស់។ និតអាចរកប្រាក់ឧបត្ថម្ភការសិក្សារបស់នួនដោយមិនជួបការលំបាកដូចមុនទៀតឡើយ។"
                                  }),
                                  e.jsx("p", {
                                    children:
                                      "ក្រោយពីបញ្ចប់ការសិក្សា នួនបានចូលបម្រើការងារក្នុងក្រុមហ៊ុនមួយ នៅរាជធានីភ្នំពេញ។ នួនសន្សំប្រាក់ខែបានមួយចំនួន។ គេបានយកប្រាក់ទាំងនោះទៅប្រគល់ជូនបងទាំងអស់ ដើម្បីឱ្យបងបានរៀបអាពាហ៍ពិពាហ៍។ ចាប់ពីពេលនោះមក គ្រួសារនេះរស់នៅជាមួយគ្នាប្រកបដោយសុភមង្គល។"
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5",
                                children: [
                                  e.jsx("div", { className: "font-black text-indigo-950", children: "✅ កំណែលំហាត់ ខ ទំព័រ ១៤ (ពាក្យន័យដូចនឹងពាក្យគូសបន្ទាត់ពីក្រោម) ៖" }),
                                  e.jsx("p", { children: "១. សិក្សា = រៀន / រៀនសូត្រ | ២. និទ្រា = ដេក / សម្រាន្ត | ៣. ឧបត្ថម្ភ = ជួយទំនុកបម្រុង / ផ្គត់ផ្គង់ | ៤. អាពាហ៍ពិពាហ៍ = រៀបការ / មង្គលការ" })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    // ===================================================================
                    // SECTION 8: ទំព័រទី ១៥–១៦ — ការនិយាយ និង ការតែងកំណាព្យបទពាក្យប្រាំពីរ
                    // ===================================================================
                    showSec("sec8") &&
                      e.jsxs("div", {
                        className: "bg-white rounded-3xl border border-indigo-200/80 shadow-sm overflow-hidden",
                        children: [
                          e.jsxs("div", {
                            className: "bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-b border-indigo-100 px-5 py-4 flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  e.jsx("span", {
                                    className: "w-10 h-10 rounded-2xl bg-indigo-700 text-white font-black text-base flex items-center justify-center shadow-sm",
                                    children: "៨"
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("div", { className: "text-[11px] font-extrabold text-indigo-700 uppercase", children: "ផ្នែកទី ៨ • សៀវភៅពុម្ពទំព័រទី ១៥ ដល់ ១៦" }),
                                      e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg font-moul", children: "ការនិយាយ (ពណ៌នាអំពីអ្នកមានគុណ) និង ការតែងកំណាព្យ (បទពាក្យប្រាំពីរ)" })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsxs("button", {
                                    onClick: () => openTextbookPage(15),
                                    className: "text-xs font-bold text-indigo-800 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-xl border border-indigo-300 cursor-pointer",
                                    children: ["🖼️ ទំព័រ ១៥–១៦"]
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => toggleSpeech(TEXTBOOK_PAGES[14].audio + " " + TEXTBOOK_PAGES[15].audio),
                                    className: "text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1.5 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់អំណាន" })]
                                  })
                                ]
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-slate-800 leading-relaxed",
                            children: [
                              // Page 15: ការនិយាយ (សន្ទនាស្រីណែត និងឪពុក)
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2",
                                children: [
                                  e.jsx("div", { className: "font-black text-sky-950 text-sm", children: "🗣️ ១. ការពណ៌នាអំពីអ្នកមានគុណ — សន្ទនារវាងស្រីណែត និងឪពុក (ទំព័រ ១៥) ៖" }),
                                  e.jsx("p", { children: "• ស្រីណែត ៖ លោកប៉ា! ព្រឹកនេះកូនឃើញប៉ារៀបចំកន្ត្រកដាក់ផ្លែឈើ នំចំណី និងទឹកដោះគោ តាំងពីព្រលឹម។ តើប៉ាបម្រុងអញ្ជើញទៅណា?" }),
                                  e.jsx("p", { children: "• ឪពុក ៖ អូ! កូនស្រី ប៉ាទៅសួរសុខទុក្ខលោកយាយសួននៅឯស្រុក។ ប៉ានឹកគាត់ណាស់។" }),
                                  e.jsx("p", { children: "• ស្រីណែត ៖ តើលោកយាយសួនជាអ្នកណា? កូនឃើញប៉ាយកចិត្តទុកដាក់នឹងគាត់ណាស់។" }),
                                  e.jsx("p", { children: "• ឪពុក ៖ គាត់ជាម្ដាយមីងរបស់ប៉ា ហើយមានគុណលើប៉ាខ្លាំងណាស់។ កាលប៉ានៅរៀន គ្រួសារប៉ាក្រីក្រ។ លោកយាយបានយកប៉ាទៅនៅជាមួយ ចិញ្ចឹមបាយទឹក ហើយឧបត្ថម្ភប្រាក់កាសឱ្យប៉ារៀនសូត្រ រហូតប៉ាបានការងារធ្វើសព្វថ្ងៃនេះ។ ហេតុនេះហើយទើបប៉ាមិនភ្លេចគុណគាត់។" }),
                                  e.jsx("p", { children: "• ស្រីណែត ៖ កូនរំភើបចិត្តណាស់។ ក្រៅពីលោកយាយបង្កើត កូននៅមានលោកយាយសួនម្នាក់ទៀត។ លោកប៉ា! កូនសូមបួងសួងឱ្យពួកគាត់មានអាយុវែង។" })
                                ]
                              }),

                              // Page 16: ការតែងកំណាព្យ (បទពាក្យប្រាំពីរ)
                              e.jsxs("div", {
                                className: "p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-3",
                                children: [
                                  e.jsx("div", { className: "font-black text-indigo-950 text-sm", children: "✍️ ២. ការតែងកំណាព្យបទពាក្យប្រាំពីរ (ទំព័រ ១៦) ៖" }),
                                  e.jsxs("div", {
                                    className: "p-3.5 bg-white rounded-xl border border-indigo-200 space-y-2 font-semibold text-slate-900",
                                    children: [
                                      e.jsx("p", { children: "វគ្គទី១ ៖ ខ្ញុំសូមវន្ទាចំពោះគុណ (៧) — ធំហើយសែនធ្ងន់មកលើខ្ញុំ (៧) / មានឪពុកម្ដាយជីដូនឧត្តម (៧) — មីងពូបងអ៊ំក្រុមគ្រួសារ (៧)។" }),
                                      e.jsx("p", { children: "វគ្គទី២ ៖ លោកគ្រូអ្នកគ្រូផ្ដល់ចំណេះ (៧) — ឱ្យខ្ញុំបានចេះមានប្រាជ្ញា (៧) / បួងសួងឱ្យលោកជួបសុខា (៧) — កើតជាតិណាៗសូមជួបទៀត (៧)។" })
                                    ]
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-1 text-slate-800",
                                    children: [
                                      e.jsx("p", { children: "• ចម្លើយសំណួរទំព័រ ១៦ ៖ កំណាព្យខាងលើមាន ២ វគ្គ។ ក្នុងមួយវគ្គមាន ៤ ឃ្លា ហើយក្នុងមួយឃ្លាមាន ៧ ព្យាង្គ។" }),
                                      e.jsx("p", { children: "• ពាក្យចួនក្នុងវគ្គទី១ ៖ «គុណ» (ព្យាង្គ៧ ឃ្លា១) ចួននឹង «ធ្ងន់» (ព្យាង្គ៤ ឃ្លា២) ហើយ «ខ្ញុំ» (ព្យាង្គ៧ ឃ្លា២) ចួននឹង «ឧត្តម» (ព្យាង្គ៧ ឃ្លា៣) និង «អ៊ំ» (ព្យាង្គ៤ ឃ្លា៤)។" }),
                                      e.jsx("p", { children: "• ពាក្យចួនឆ្លងវគ្គ (ពីវគ្គទី១ មកវគ្គទី២) ៖ «សារ» (ព្យាង្គ៧ ឃ្លា៤ វគ្គ១) ចួនឆ្លងមក «ប្រាជ្ញា» (ព្យាង្គ៧ ឃ្លា២ វគ្គ២) ហើយចួនបន្តទៅ «សុខា» (ព្យាង្គ៧ ឃ្លា៣) និង «ណា» (ព្យាង្គ៣ ឃ្លា៤)។" })
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
              : activeTab === "textbook"
              ? // ===================================================================
                // TAB 2: ORIGINAL 16 TEXTBOOK PAGES VIEWER
                // ===================================================================
                e.jsxs("div", {
                  className: "space-y-4 max-w-5xl mx-auto animate-fadeIn",
                  children: [
                    e.jsxs("div", {
                      className: "bg-white p-4 rounded-3xl border border-amber-200 shadow-sm space-y-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between flex-wrap gap-2",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("span", { className: "text-[11px] font-black text-amber-700 uppercase", children: "សៀវភៅសិក្សាគោល ភាសាខ្មែរ ថ្នាក់ទី ៥ • មេរៀនទី ១" }),
                                e.jsx("h3", { className: "text-sm sm:text-base font-bold text-slate-900 font-moul", children: TEXTBOOK_PAGES[currentPageIdx].title })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2 flex-wrap",
                              children: [
                                e.jsxs("button", {
                                  onClick: () => toggleSpeech(TEXTBOOK_PAGES[currentPageIdx].audio),
                                  className: "px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer flex items-center gap-1.5 shadow-xs",
                                  children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ខ្លឹមសារទំព័រនេះ" })]
                                }),
                                e.jsx("button", {
                                  onClick: () => setPageZoom((z) => (z >= 1.5 ? 1 : +(z + 0.25).toFixed(2))),
                                  className: "px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer border border-slate-300",
                                  children: `🔍 ពង្រីក (${Math.round(pageZoom * 100)}%)`
                                })
                              ]
                            })
                          ]
                        }),
                        // Page 1..16 Numbered Selector Strip
                        e.jsx("div", {
                          className: "flex items-center gap-1.5 overflow-x-auto py-1",
                          children: TEXTBOOK_PAGES.map((p, idx) =>
                            e.jsx(
                              "button",
                              {
                                key: p.page,
                                onClick: () => setCurrentPageIdx(idx),
                                className: `px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition cursor-pointer border ${
                                  currentPageIdx === idx
                                    ? "bg-amber-500 text-slate-950 border-amber-600 shadow-xs ring-2 ring-amber-300"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50"
                                }`,
                                children: `ទំព័រ ${p.page}`
                              },
                              p.page
                            )
                          )
                        })
                      ]
                    }),

                    // Textbook Page Image Container
                    e.jsxs("div", {
                      className: "bg-slate-900 rounded-3xl p-3 sm:p-6 border-2 border-slate-800 shadow-xl flex flex-col items-center space-y-4 overflow-x-auto",
                      children: [
                        e.jsx("img", {
                          src: TEXTBOOK_PAGES[currentPageIdx].img,
                          alt: TEXTBOOK_PAGES[currentPageIdx].title,
                          style: { transform: `scale(${pageZoom})`, transformOrigin: "top center" },
                          className: "max-w-full md:max-w-3xl rounded-2xl shadow-2xl border border-white/20 transition-transform duration-200 bg-white"
                        }),
                        e.jsxs("div", {
                          className: "flex items-center justify-between w-full max-w-3xl pt-2",
                          children: [
                            e.jsx("button", {
                              onClick: () => setCurrentPageIdx((i) => Math.max(0, i - 1)),
                              disabled: currentPageIdx === 0,
                              className: "px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-40 text-white font-bold text-xs cursor-pointer",
                              children: "← ទំព័រមុន"
                            }),
                            e.jsx("span", {
                              className: "text-xs font-black text-amber-300",
                              children: `ទំព័រទី ${currentPageIdx + 1} នៃ ១៦`
                            }),
                            e.jsx("button", {
                              onClick: () => setCurrentPageIdx((i) => Math.min(TEXTBOOK_PAGES.length - 1, i + 1)),
                              disabled: currentPageIdx === TEXTBOOK_PAGES.length - 1,
                              className: "px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs cursor-pointer",
                              children: "ទំព័របន្ទាប់ →"
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              : activeTab === "sim"
              ? // ===================================================================
                // TAB 3: INTERACTIVE KHMER LANGUAGE LAB (4 MINI-SIMULATORS)
                // ===================================================================
                e.jsxs("div", {
                  className: "space-y-5 max-w-5xl mx-auto animate-fadeIn",
                  children: [
                    // Lab Switcher
                    e.jsx("div", {
                      className: "bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-2 overflow-x-auto",
                      children: [
                        { id: "dict", icon: "📚", label: "១. វចនានុក្រមជួនណាត & រៀបលំដាប់អក្សរ" },
                        { id: "grammar", icon: "🔢", label: "២. ល្បែងបែងចែកគុណនាមចំនួនរាប់ & ចំនួនរៀប" },
                        { id: "synonym", icon: "🔗", label: "៣. ល្បែងផ្គូផ្គងពាក្យន័យដូច" },
                        { id: "poem", icon: "🎵", label: "៤. ឧបករណ៍ពិនិត្យចួនកំណាព្យបទពាក្យប្រាំពីរ" }
                      ].map((m) =>
                        e.jsxs(
                          "button",
                          {
                            key: m.id,
                            onClick: () => setLabMode(m.id),
                            className: `px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                              labMode === m.id
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-700 hover:bg-emerald-50"
                            }`,
                            children: [e.jsx("span", { children: m.icon }), e.jsx("span", { children: m.label })]
                          },
                          m.id
                        )
                      )
                    }),

                    labMode === "dict" &&
                      e.jsxs("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
                        children: [
                          // Interactive Dictionary Search & Anatomy Inspector
                          e.jsxs("div", {
                            className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4",
                            children: [
                              e.jsx("h4", { className: "font-black text-indigo-950 text-sm font-moul", children: "📚 កម្មវិធីស្វែងរកវចនានុក្រមខ្មែរ (មេរៀនទី១)" }),
                              e.jsx("input", {
                                type: "text",
                                value: dictSearch,
                                onChange: (ev) => setDictSearch(ev.target.value),
                                placeholder: "វាយពាក្យស្វែងរក (ឧ. កតញ្ញូ, កវី, បរិបូរ, បវរ, បណ្ណាគារ...)",
                                className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-indigo-500"
                              }),
                              e.jsx("div", {
                                className: "flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1",
                                children: filteredDict.map((entry, idx) =>
                                  e.jsx(
                                    "button",
                                    {
                                      key: entry.headword,
                                      onClick: () => setSelectedWordIdx(DICTIONARY_ENTRIES.indexOf(entry)),
                                      className: `px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border transition ${
                                        DICTIONARY_ENTRIES[selectedWordIdx]?.headword === entry.headword
                                          ? "bg-indigo-600 text-white border-indigo-600"
                                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50"
                                      }`,
                                      children: entry.headword
                                    },
                                    idx
                                  )
                                )
                              }),
                              DICTIONARY_ENTRIES[selectedWordIdx] &&
                                e.jsxs("div", {
                                  className: "p-4 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white space-y-3 border border-indigo-400/40",
                                  children: [
                                    e.jsxs("div", {
                                      className: "flex items-center justify-between",
                                      children: [
                                        e.jsx("span", { className: "text-[10px] font-bold text-amber-300 uppercase", children: "ការវិភាគធាតុនៃមេពាក្យក្នុងវចនានុក្រម" }),
                                        e.jsx("button", {
                                          onClick: () =>
                                            toggleSpeech(
                                              `${DICTIONARY_ENTRIES[selectedWordIdx].headword}។ សូរអាន ${DICTIONARY_ENTRIES[selectedWordIdx].pron}។ ថ្នាក់ពាក្យ ${DICTIONARY_ENTRIES[selectedWordIdx].pos}។ មានន័យថា ${DICTIONARY_ENTRIES[selectedWordIdx].meaning}`
                                            ),
                                          className: "px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer",
                                          children: "🔊 ស្ដាប់ពាក្យនេះ"
                                        })
                                      ]
                                    }),
                                    e.jsxs("div", {
                                      className: "flex flex-wrap items-baseline gap-2 text-sm",
                                      children: [
                                        e.jsx("span", { className: "px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-base", children: DICTIONARY_ENTRIES[selectedWordIdx].headword }),
                                        e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-sky-500/30 border border-sky-400 text-sky-200 font-bold text-xs", children: `(${DICTIONARY_ENTRIES[selectedWordIdx].pron})` }),
                                        e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-bold text-xs", children: DICTIONARY_ENTRIES[selectedWordIdx].pos }),
                                        e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-purple-500/30 border border-purple-400 text-purple-200 font-bold text-xs", children: `(${DICTIONARY_ENTRIES[selectedWordIdx].origin})` })
                                      ]
                                    }),
                                    e.jsx("p", { className: "text-xs sm:text-sm text-slate-100 leading-relaxed bg-white/10 p-3 rounded-xl", children: DICTIONARY_ENTRIES[selectedWordIdx].meaning }),
                                    e.jsxs("div", {
                                      className: "grid grid-cols-4 gap-1.5 text-[10px] text-center font-bold",
                                      children: [
                                        e.jsx("div", { className: "p-1.5 rounded-lg bg-amber-400/20 text-amber-300", children: "១. មេពាក្យ" }),
                                        e.jsx("div", { className: "p-1.5 rounded-lg bg-sky-400/20 text-sky-300", children: "២. សូរអាន" }),
                                        e.jsx("div", { className: "p-1.5 rounded-lg bg-emerald-400/20 text-emerald-300", children: "៣. ថ្នាក់ពាក្យ" }),
                                        e.jsx("div", { className: "p-1.5 rounded-lg bg-purple-400/20 text-purple-300", children: "៤. ប្រភពពាក្យ" })
                                      ]
                                    })
                                  ]
                                })
                            ]
                          }),

                          // Alphabetical Sorting Interactive Exercise (Page 4 Exercise B)
                          e.jsxs("div", {
                            className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4",
                            children: [
                              e.jsx("h4", { className: "font-black text-emerald-950 text-sm font-moul", children: "🔤 ល្បែងរៀបពាក្យតាមលំដាប់អក្ខរក្រម (លំហាត់ ខ ទំព័រ ៤)" }),
                              e.jsx("p", { className: "text-xs text-slate-600", children: "ចូរចុចជ្រើសរើសពាក្យខាងក្រោមតាមលំដាប់អក្សរពីទី១ ដល់ទី៦ ៖" }),
                              e.jsx("div", {
                                className: "flex flex-wrap gap-2",
                                children: ALPHA_WORDS.map((w) => {
                                  const picked = alphaUserOrder.includes(w);
                                  return e.jsx(
                                    "button",
                                    {
                                      key: w,
                                      disabled: picked,
                                      onClick: () => setAlphaUserOrder((prev) => [...prev, w]),
                                      className: `px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                        picked
                                          ? "bg-slate-100 text-slate-400 border-slate-200 opacity-50"
                                          : "bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300 shadow-2xs"
                                      }`,
                                      children: w
                                    },
                                    w
                                  );
                                })
                              }),
                              e.jsxs("div", {
                                className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[90px] space-y-2",
                                children: [
                                  e.jsx("div", { className: "text-xs font-bold text-slate-700", children: "លំដាប់ដែលប្អូនបានរៀប ៖" }),
                                  e.jsx("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: alphaUserOrder.map((w, idx) => {
                                      const isRight = ALPHA_CORRECT[idx] === w;
                                      return e.jsx(
                                        "span",
                                        {
                                          key: w,
                                          className: `px-3 py-1 rounded-xl text-xs font-bold border ${
                                            isRight ? "bg-emerald-100 text-emerald-900 border-emerald-400" : "bg-rose-100 text-rose-900 border-rose-400"
                                          }`,
                                          children: `${idx + 1}. ${w} ${isRight ? "✓" : "✗"}`
                                        },
                                        w
                                      );
                                    })
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx("button", {
                                    onClick: () => setAlphaUserOrder([]),
                                    className: "px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer",
                                    children: "🔄 រៀបម្ដងទៀត"
                                  }),
                                  e.jsx("button", {
                                    onClick: () => setAlphaUserOrder([...ALPHA_CORRECT]),
                                    className: "px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer",
                                    children: "✨ បង្ហាញចម្លើយត្រឹមត្រូវ"
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }),

                    labMode === "grammar" &&
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsx("h4", { className: "font-black text-emerald-950 text-sm font-moul", children: "🔢 ល្បែងបែងចែកគុណនាមចំនួនរាប់ និងគុណនាមចំនួនរៀប (ទំព័រ ១២)" }),
                              e.jsx("button", {
                                onClick: () => setGrammarAnswers({}),
                                className: "px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer",
                                children: "🔄 ធ្វើម្ដងទៀត"
                              })
                            ]
                          }),
                          e.jsx("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5",
                            children: GRAMMAR_ITEMS.map((item, idx) => {
                              const picked = grammarAnswers[item.word];
                              const isCorrect = picked && picked === item.type;
                              return e.jsxs(
                                "div",
                                {
                                  key: item.word,
                                  className: `p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                                    !picked
                                      ? "bg-slate-50 border-slate-200"
                                      : isCorrect
                                      ? "bg-emerald-50 border-emerald-400"
                                      : "bg-rose-50 border-rose-400"
                                  }`,
                                  children: [
                                    e.jsx("span", { className: "font-bold text-slate-900 text-xs sm:text-sm", children: `${idx + 1}. ${item.word}` }),
                                    e.jsxs("div", {
                                      className: "flex items-center gap-1",
                                      children: [
                                        e.jsx("button", {
                                          onClick: () => setGrammarAnswers((p) => ({ ...p, [item.word]: "cardinal" })),
                                          className: `px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                                            picked === "cardinal" ? "bg-emerald-600 text-white" : "bg-white border border-slate-300 text-slate-700"
                                          }`,
                                          children: "ចំនួនរាប់"
                                        }),
                                        e.jsx("button", {
                                          onClick: () => setGrammarAnswers((p) => ({ ...p, [item.word]: "ordinal" })),
                                          className: `px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                                            picked === "ordinal" ? "bg-sky-600 text-white" : "bg-white border border-slate-300 text-slate-700"
                                          }`,
                                          children: "ចំនួនរៀប"
                                        })
                                      ]
                                    })
                                  ]
                                },
                                item.word
                              );
                            })
                          })
                        ]
                      }),

                    labMode === "synonym" &&
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between flex-wrap gap-2",
                            children: [
                              e.jsx("h4", { className: "font-black text-indigo-950 text-sm font-moul", children: "🔗 ល្បែងផ្គូផ្គងពាក្យន័យដូច (ទំព័រ ៦ និង ទំព័រ ១៤)" }),
                              e.jsx("button", {
                                onClick: () => {
                                  const all = {};
                                  SYNONYM_PAIRS.forEach((p) => (all[p.id] = true));
                                  setSynonymMatched(all);
                                },
                                className: "px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer",
                                children: "✨ បង្ហាញចម្លើយផ្គូផ្គងទាំងអស់"
                              })
                            ]
                          }),
                          e.jsx("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
                            children: SYNONYM_PAIRS.map((pair) => {
                              const revealed = synonymMatched[pair.id];
                              return e.jsxs(
                                "div",
                                {
                                  key: pair.id,
                                  onClick: () => setSynonymMatched((p) => ({ ...p, [pair.id]: !p[pair.id] })),
                                  className: "p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 flex items-center justify-between cursor-pointer transition",
                                  children: [
                                    e.jsxs("div", {
                                      className: "flex items-center gap-2",
                                      children: [
                                        e.jsx("span", { className: "font-black text-indigo-950 text-xs sm:text-sm", children: pair.left }),
                                        e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold", children: pair.page })
                                      ]
                                    }),
                                    e.jsx("span", {
                                      className: `px-3 py-1 rounded-xl text-xs font-bold ${
                                        revealed ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-900 border border-amber-300"
                                      }`,
                                      children: revealed ? `= ${pair.right} ✓` : "ចុចមើលន័យដូច"
                                    })
                                  ]
                                },
                                pair.id
                              );
                            })
                          })
                        ]
                      }),

                    labMode === "poem" &&
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4",
                        children: [
                          e.jsx("h4", { className: "font-black text-purple-950 text-sm font-moul", children: "🎵 ក្បួនចួនកំណាព្យបទពាក្យប្រាំពីរ (ទំព័រ ១៦)" }),
                          e.jsx("p", {
                            className: "text-xs text-slate-600",
                            children: "កំណាព្យបទពាក្យប្រាំពីរ ៖ ក្នុង ១ វគ្គមាន ៤ ឃ្លា ហើយក្នុង ១ ឃ្លាមាន ៧ ព្យាង្គ។ ពណ៌ដូចគ្នាបង្ហាញពីព្យាង្គដែលចួនគ្នា ៖"
                          }),
                          e.jsxs("div", {
                            className: "p-4 rounded-2xl bg-slate-900 text-white space-y-4",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("div", { className: "text-xs font-black text-amber-300", children: "វគ្គទី ១ ៖" }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-bold",
                                    children: [
                                      e.jsxs("div", { className: "p-2.5 rounded-xl bg-white/10", children: ["១. ខ្ញុំ សូម វន្ទា ចំ ពោះ ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950", children: "គុណ (៧)" })] }),
                                      e.jsxs("div", { className: "p-2.5 rounded-xl bg-white/10", children: ["២. ធំ ហើយ សែន ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950", children: "ធ្ងន់ (៤)" }), " មក លើ ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-emerald-400 text-slate-950", children: "ខ្ញុំ (៧)" })] }),
                                      e.jsxs("div", { className: "p-2.5 rounded-xl bg-white/10", children: ["៣. មាន ឪ ពុក ម្ដាយ ជី ដូន ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-emerald-400 text-slate-950", children: "ឧត្តម (៧)" })] }),
                                      e.jsxs("div", { className: "p-2.5 rounded-xl bg-white/10", children: ["៤. មីង ពូ បង ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-emerald-400 text-slate-950", children: "អ៊ំ (៤)" }), " ក្រុម គ្រួ ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-sky-400 text-slate-950", children: "សារ (៧ - ចួនឆ្លងវគ្គ)" })] })
                                    ]
                                  })
                                ]
                              }),
                              e.jsxs("div", {
                                className: "space-y-2 pt-2 border-t border-white/15",
                                children: [
                                  e.jsx("div", { className: "text-xs font-black text-sky-300", children: "វគ្គទី ២ ៖" }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-bold",
                                    children: [
                                      e.jsxs("div", { className: "p-2.5 rounded-xl bg-white/10", children: ["១. លោក គ្រូ អ្នក គ្រូ ផ្ដល់ ចំ ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-pink-400 text-slate-950", children: "ណេះ (៧)" })] }),
                                      e.jsxs("div", { className: "p-2.5 rounded-xl bg-white/10", children: ["២. ឱ្យ ខ្ញុំ បាន ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-pink-400 text-slate-950", children: "ចេះ (៤)" }), " មាន ប្រា ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-sky-400 text-slate-950", children: "ជ្ញា (៧ - ទទួលចួនឆ្លងវគ្គ)" })] }),
                                      e.jsxs("div", { className: "p-2.5 rounded-xl bg-white/10", children: ["៣. បួង សួង ឱ្យ លោក ជួប សុ ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-sky-400 text-slate-950", children: "ខា (៧)" })] }),
                                      e.jsxs("div", { className: "p-2.5 rounded-xl bg-white/10", children: ["៤. កើត ជាតិ ", e.jsx("span", { className: "px-2 py-0.5 rounded-lg bg-sky-400 text-slate-950", children: "ណាៗ (៣-៤)" }), " សូម ជួប ទៀត។"] })
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
              : // ===================================================================
                // TAB 4: 40 QCM QUIZ
                // ===================================================================
                e.jsxs("div", {
                  className: "space-y-5 max-w-4xl mx-auto animate-fadeIn",
                  children: [
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-700",
                          children: [
                            e.jsxs("span", { children: ["សំណួរទី ", currentQuestionIndex + 1, " នៃ ", questionsList.length] }),
                            e.jsxs("span", {
                              className: "text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 font-black",
                              children: ["ពិន្ទុសរុប ៖ ", qcmScore, " / ", questionsList.length]
                            })
                          ]
                        }),
                        e.jsx("div", {
                          className: "w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200",
                          children: e.jsx("div", {
                            className: "bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 h-full transition-all duration-300",
                            style: { width: `${((currentQuestionIndex + 1) / Math.max(1, questionsList.length)) * 100}%` }
                          })
                        })
                      ]
                    }),

                    currentQ &&
                      e.jsxs("div", {
                        className: "bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-5",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-start justify-between gap-3 pb-3 border-b border-slate-100",
                            children: [
                              e.jsxs("h3", {
                                className: "text-sm sm:text-base font-bold text-slate-900 leading-relaxed",
                                children: [
                                  e.jsx("span", { className: "text-indigo-600 mr-2 font-black", children: `សំណួរទី ${currentQuestionIndex + 1} ៖` }),
                                  currentQ.q
                                ]
                              }),
                              e.jsxs("button", {
                                onClick: () => toggleSpeech(currentQ.q),
                                className: "shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 flex items-center gap-1 cursor-pointer",
                                children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់សំណួរ" })]
                              })
                            ]
                          }),

                          e.jsx("div", {
                            className: "grid gap-3",
                            children: (currentQ.opts || []).map((opt, optIdx) => {
                              const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                              const isAnswered = userAnswers[currentQuestionIndex] !== undefined;

                              let btnStyle = "bg-slate-50 hover:bg-indigo-50/60 border-slate-200 text-slate-800";
                              if (isAnswered) {
                                if (opt.c) {
                                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs";
                                } else if (isSelected && !opt.c) {
                                  btnStyle = "bg-red-50 border-red-400 text-red-950 font-bold";
                                } else {
                                  btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                                }
                              }

                              return e.jsxs(
                                "button",
                                {
                                  key: optIdx,
                                  onClick: () => !isAnswered && handleOptionSelect(currentQuestionIndex, optIdx),
                                  disabled: isAnswered,
                                  className: `w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition duration-200 flex items-start gap-3 cursor-pointer ${btnStyle}`,
                                  children: [
                                    e.jsx("span", {
                                      className: `w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                                        isAnswered && opt.c
                                          ? "bg-emerald-500 text-white border-emerald-500"
                                          : isAnswered && isSelected && !opt.c
                                          ? "bg-red-500 text-white border-red-500"
                                          : "bg-white border-slate-300 text-slate-600"
                                      }`,
                                      children: ["ក", "ខ", "គ", "ឃ"][optIdx] || String.fromCharCode(65 + optIdx)
                                    }),
                                    e.jsx("span", { className: "flex-1 mt-0.5 leading-relaxed", children: opt.t })
                                  ]
                                },
                                optIdx
                              );
                            })
                          }),

                          userAnswers[currentQuestionIndex] !== undefined &&
                            e.jsxs("div", {
                              className: "p-4 bg-amber-50/95 rounded-2xl border border-amber-300 space-y-2 animate-fadeIn",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center justify-between",
                                  children: [
                                    e.jsxs("h4", {
                                      className: "font-bold text-amber-950 text-xs flex items-center gap-1.5",
                                      children: [e.jsx("span", { children: "💡" }), e.jsx("span", { children: "ការពន្យល់ចម្លើយ ៖" })]
                                    }),
                                    e.jsxs("button", {
                                      onClick: () =>
                                        toggleSpeech(
                                          (currentQ.opts.find((o) => o.c) || {}).e ||
                                            currentQ.opts[userAnswers[currentQuestionIndex]]?.e ||
                                            "ចម្លើយត្រឹមត្រូវ"
                                        ),
                                      className: "text-[11px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-lg border border-amber-400 cursor-pointer flex items-center gap-1",
                                      children: [e.jsx("span", { children: "🔊" }), e.jsx("span", { children: "ស្ដាប់ការពន្យល់" })]
                                    })
                                  ]
                                }),
                                e.jsx("p", {
                                  className: "text-xs sm:text-sm text-amber-950 leading-relaxed",
                                  children:
                                    (currentQ.opts.find((o) => o.c) || {}).e ||
                                    currentQ.opts[userAnswers[currentQuestionIndex]]?.e ||
                                    "ចម្លើយនេះត្រឹមត្រូវតាមមេរៀនសៀវភៅពុម្ពក្រសួងអប់រំ។"
                                })
                              ]
                            }),

                          e.jsxs("div", {
                            className: "flex items-center justify-between pt-3 border-t border-slate-100",
                            children: [
                              e.jsx("button", {
                                onClick: () => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1)),
                                disabled: currentQuestionIndex === 0,
                                className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer",
                                children: "← សំណួរមុន"
                              }),
                              e.jsx("button", {
                                onClick: () => setCurrentQuestionIndex((prev) => Math.min(questionsList.length - 1, prev + 1)),
                                disabled: currentQuestionIndex === questionsList.length - 1,
                                className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer",
                                children: "សំណួរបន្ទាប់ →"
                              })
                            ]
                          })
                        ]
                      }),

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
                            if (isCurrent) gridBg = "bg-indigo-600 text-white border-indigo-600 font-extrabold ring-2 ring-indigo-300";
                            else if (isAnswered) gridBg = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
                            return e.jsx(
                              "button",
                              {
                                key: idx,
                                onClick: () => setCurrentQuestionIndex(idx),
                                className: `h-8 rounded-xl text-xs border flex items-center justify-center transition cursor-pointer ${gridBg}`,
                                children: idx + 1
                              },
                              idx
                            );
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
