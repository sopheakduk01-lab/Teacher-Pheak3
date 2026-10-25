var Rz14 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [isSpeaking, setIsSpeaking] = y.useState(!1);
  const [soundEnabled, setSoundEnabled] = y.useState(!0);

  // Lab 1: Lever Simulator State
  const [leverType, setLeverType] = y.useState("type1");
  const [leverLoad, setLeverLoad] = y.useState(60);
  const [leverEffortArm, setLeverEffortArm] = y.useState(3);
  const [leverLoadArm, setLeverLoadArm] = y.useState(1);

  // Lab 2: Inclined Plane State
  const [rampLength, setRampLength] = y.useState(4);
  const [rampHeight, setRampHeight] = y.useState(2);
  const [planeLoad, setPlaneLoad] = y.useState(100);
  const [isPushing, setIsPushing] = y.useState(!1);
  const [pushProgress, setPushProgress] = y.useState(0);

  // Lab 3: Pulley System State
  const [pulleyType, setPulleyType] = y.useState("fixed");
  const [pulleyLoad, setPulleyLoad] = y.useState(120);
  const [isPulling, setIsPulling] = y.useState(!1);
  const [pullProgress, setPullProgress] = y.useState(0);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
      };
    }
  }, [r, n]);

  const rawQuestions = [{"q":"តើអ្វីទៅជា 'ម៉ាស៊ីនងាយ'?","opts":[{"t":"ឧបករណ៍ជួយសម្រួលការងារ និងកាត់បន្ថយកម្លាំងចលករដែលត្រូវប្រើក្នុងការលើក ឬផ្លាស់ទីបន្ទុក","c":true,"e":"ម៉ាស៊ីនងាយជួយសម្រួលការងារ និងកាត់បន្ថយកម្លាំងចលករដែលមនុស្សត្រូវបញ្ចេញ។"},{"t":"ម៉ាស៊ីនប្រើប្រេងឥន្ធនៈដើម្បីដំណើរការ និងបង្កើតចលនាដោយស្វ័យប្រវត្តិក្នងរោងចក្រឧស្សាហកម្ម","c":false,"e":"ម៉ាស៊ីនងាយមិនប្រើប្រេងឥន្ធនៈ ឬអគ្គិសនីដើម្បីដំណើរការឡើយ។"},{"t":"ឧបករណ៍បង្កើតឡើងសម្រាប់បង្កើនទម្ងន់បន្ទុកឱ្យធ្ងន់ជាងមុនដើម្បីងាយស្រួលក្នុងការថ្លឹង","c":false,"e":"ម៉ាស៊ីនងាយមិនបង្កើនទម្ងន់បន្ទុកឡើយ។"},{"t":"ឧបករណ៍វាស់វែងប្រវែង និងមាឌវត្ថុដែលមានរាងជធរណីមាត្រជាក់លាក់ក្នុងបន្ទប់ពិសោធន៍","c":false,"e":"ម៉ាស៊ីនងាយមិនមែនជាឧបករណ៍វាស់វែងឡើយ។"}]},{"q":"តើ 'ឃ្នាស់' មាននិយមន័យដូចម្តេច?","opts":[{"t":"ជាម៉ាស៊ីនងាយធ្វើពីរុក្ខជាតិរឹងមាំ ឬលោហៈ ដែលមានចលនាចល័តជុំវិញចំណុចនឹងមួយ","c":true,"e":"ឃ្នាស់ជាដងឈើ ឬលោហៈចល័តជុំវិញចំណុចទ្រ។"},{"t":"ជាខ្សែពួរដែលគេប្រើសម្រាប់ទាញ និងយោងបន្ទុកធ្ងន់ៗឡើងលើត្រង់តាមជញ្ជាំងអគារ","c":false,"e":"នោះជាខ្សែយោង មិនមែនជាឃ្នាស់ឡើយ។"},{"t":"ជាផ្ទៃរាបតម្រៀបជាទម្រសម្រាប់រុញវត្ថុពីទីទាបទៅទីខ្ពស់ ឬពីទីខ្ពស់ចុះមកទីទាប","c":false,"e":"នោះជាប្លង់ទេរ។"},{"t":"ជាកង់ឈើ ឬលោហៈដែលមានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែ និងមានអ័ក្សកាត់តាមផ្ចិត","c":false,"e":"នោះជារ៉ក។"}]},{"q":"តើចំណុចនឹង ឬអ័ក្សដែលឃ្នាស់ចល័តជុំវិញហៅថាអ្វី?","opts":[{"t":"ចំណុចទ្រ ឬអ័ក្សទ្រង់ (Fulcrum) នៃឃ្នាស់","c":true,"e":"ចំណុចដែលឃ្នាស់ផ្អែក និងចល័តជុំវិញហៅថា ចំណុចទ្រ។"},{"t":"កម្លាំងចលករ (Effort) ដែលត្រូវបញ្ចេញ","c":false,"e":"កម្លាំងចលករជាកម្លាំងដែលមនុស្ស ឬម៉ាស៊ីនបញ្ចេញ។"},{"t":"កម្លាំងទប់ ឬបន្ទុក (Load) នៃវត្ថុលើក","c":false,"e":"បន្ទុកជាទម្ងន់វត្ថុដែលត្រូវលើក។"},{"t":"ប្រវែងដៃឃ្នាស់សរុបពីចុងម្ខាងទៅម្ខាង","c":false,"e":"មិនមែនជាឈ្មោះអ័ក្សទ្រឡើយ។"}]},{"q":"តើផ្នែកសំខាន់ៗទាំង ៣ នៃឃ្នាស់រួមមានអ្វីខ្លះ?","opts":[{"t":"កម្លាំងទប់ឬបន្ទុក, កម្លាំងចលករ, និងចំណុចទ្រ","c":true,"e":"ផ្នែកទាំង ៣ នៃឃ្នាស់ គឺ បន្ទុក (Load), កម្លាំងចលករ (Effort) និងចំណុចទ្រ (Fulcrum)។"},{"t":"កង់កាត់តាមអ័ក្ស, ខ្សែពួរទាញ, និងចង្អូរជុំវិញ","c":false,"e":"ទាំងនេះជាផ្នែកសំខាន់ៗរបស់រ៉ក។"},{"t":"បន្ទះឈើទម្រ, កម្ពស់ប្លង់ទេរ, និងប្រវែងផ្ទៃរាប","c":false,"e":"ទាំងនេះជាផ្នែករបស់ប្លង់ទេរ។"},{"t":"ប្រវែងដៃឃ្នាស់, ផ្ទៃក្រឡាវត្ថុ, និងមាឌរូបធាតុ","c":false,"e":"មិនមែនជាផ្នែកទាំង ៣ នៃឃ្នាស់ឡើយ។"}]},{"q":"តើ 'កម្លាំងទប់ ឬបន្ទុក' ក្នុងឃ្នាស់សំដៅលើអ្វី?","opts":[{"t":"ទម្ងន់ ឬកម្លាំងទប់ទល់នៃវត្ថុដែលយើងចង់រំកិល ឬលើក","c":true,"e":"បន្ទុក គឺជាទម្ងន់វត្ថុដែលត្រូវលើក ឬគាស់។"},{"t":"កម្លាំងដែលមនុស្ស ឬសត្វបញ្ចេញទៅលើឃ្នាស់","c":false,"e":"នោះជាកម្លាំងចលករ។"},{"t":"ទីតាំងអ័ក្សទ្រង់ដែលដងឃ្នាស់ផ្អែក និងវិលជុំវិញ","c":false,"e":"នោះជាចំណុចទ្រ។"},{"t":"ប្រវែងរង្វាស់សរុបនៃដងឈើ ឬដងលោហៈនៃឃ្នាស់","c":false,"e":"នោះជាប្រវែងដងឃ្នាស់។"}]},{"q":"តើ 'កម្លាំងចលករ' ក្នុងឃ្នាស់សំដៅលើអ្វី?","opts":[{"t":"កម្លាំងដែលយើង ឬប្រភពថាមពលបញ្ចេញទៅលើឃ្នាស់","c":true,"e":"កម្លាំងចលករ គឺជាកម្លាំងដែលយើងបញ្ចេញលើឃ្នាស់។"},{"t":"ទម្ងន់សរុបរបស់ដងឈើ ឬដងលោហៈនៃឃ្នាស់ផ្ទាល់","c":false,"e":"មិនមែនជាទម្ងន់ដងឃ្នាស់ឡើយ។"},{"t":"កម្លាំងកកិតដែលកើតឡើងរវាងដងឃ្នាស់និងផ្ទៃដី","c":false,"e":"មិនមែនជាកម្លាំងកកិតឡើយ។"},{"t":"កម្លាំងទំនាញផែនដីដែលមានអំពើលើចំណុចទ្រង់","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"ក្នុងការប្រើឃ្នាស់ បើប្រវែង 'ដៃឃ្នាស់ចលករ' កាន់តែវែង តើកម្លាំងចលករដែលត្រូវប្រើប្រែប្រួលដូចម្តេច?","opts":[{"t":"កាន់តែតូច (ចំណេញកម្លាំងចលករកាន់តែខ្លាំង)","c":true,"e":"ដៃឃ្នាស់ចលករកាន់តែវែង កម្លាំងចលករកាន់តែតូច។"},{"t":"កាន់តែធំ (ខាតបង់កម្លាំងចលករកាន់តែខ្លាំង)","c":false,"e":"មិនមែនកាន់តែធំឡើយ។"},{"t":"មិនមានការប្រែប្រួលទំហំសោះឡើយក្នុងគ្រប់ករណី","c":false,"e":"កម្លាំងចលករប្រែប្រួលតាមប្រវែងដៃឃ្នាស់។"},{"t":"ស្មើនឹងសូន្យជានិច្ចដោយមិនបាច់ប្រើកម្លាំងសោះ","c":false,"e":"នៅតែត្រូវប្រើកម្លាំងខ្លះ។"}]},{"q":"តើការប្រើឃ្នាស់ផ្តល់សារប្រយោជន៍ចម្បងអ្វីខ្លះក្នុងការងារ?","opts":[{"t":"អនុញ្ញាតឱ្យយើងប្រើកម្លាំងចលករតូចជាងកម្លាំងទប់ឬបន្ទុក","c":true,"e":"សារប្រយោជន៍ចម្បងនៃឃ្នាស់គឺជួយឱ្យយើងប្រើកម្លាំងតូចជាងទម្ងន់បន្ទុក។"},{"t":"ធ្វើឱ្យវត្ថុមានទម្ងន់ស្រាលជាងមុននៅលើជញ្ជីងថ្លឹង","c":false,"e":"ឃ្នាស់មិនបាត់បង់ទម្ងន់ពិតរបស់វត្ថុទេ។"},{"t":"កាត់បន្ថយពេលវេលាធ្វើការងារដោយមិនប្រើកម្លាំង","c":false,"e":"នៅតែត្រូវប្រើកម្លាំងចលករ។"},{"t":"បាត់បង់ថាមពលទាំងស្រុងក្នុងពេលធ្វើចលនារំកិល","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើគេចែកឃ្នាស់ជាប៉ុន្មានប្រភេទសំខាន់ៗ?","opts":[{"t":"៣ ប្រភេទ (ប្រភេទទី ១, ប្រភេទទី ២, និងប្រភេទទី ៣)","c":true,"e":"ឃ្នាស់ចែកជា ៣ ប្រភេទផ្អែកលើទីតាំងចំណុចទ្រ បន្ទុក និងកម្លាំងចលករ។"},{"t":"២ ប្រភេទ (ឃ្នាស់នឹង និងឃ្នាស់ចល័តតាមបន្ទុក)","c":false,"e":"ឃ្នាស់មាន ៣ ប្រភេទ។"},{"t":"៤ ប្រភេទ (ប្រភេទទី ១, ទី ២, ទី ៣, និងប្រព័ន្ធឃ្នាស់)","c":false,"e":"មិនមែន ៤ ប្រភេទឡើយ។"},{"t":"៥ ប្រភេទ (តាមទម្រង់រូបរាងខាងក្រៅនៃដងឃ្នាស់)","c":false,"e":"មិនមែន ៥ ប្រភេទឡើយ។"}]},{"q":"តើ 'ឃ្នាស់ប្រភេទទី ១' មានលក្ខណៈសម្គាល់ដូចម្តេច?","opts":[{"t":"ចំណុចទ្រ ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងកម្លាំងទប់","c":true,"e":"ឃ្នាស់ប្រភេទទី ១ មានចំណុចទ្រ (Fulcrum) នៅកណ្តាលចន្លោះចលករនិងបន្ទុក។"},{"t":"កម្លាំងទប់ ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងចំណុចទ្រ","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"កម្លាំងចលករ ស្ថិតនៅចន្លោះ កម្លាំងទប់ និងចំណុចទ្រ","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ៣។"},{"t":"គ្មានចំណុចទ្រសម្រាប់ផ្អែក និងចល័តជុំវិញឡើយ","c":false,"e":"ឃ្នាស់ទាំងអស់សុទ្ធតែមានចំណុចទ្រ។"}]},{"q":"តើឧបករណ៍ណាខ្លះជាឧទាហរណ៍នៃ 'ឃ្នាស់ប្រភេទទី ១'?","opts":[{"t":"កន្ត្រៃ, ជញ្ជីងថ្លឹង, និងរ៉ាស់តង់ (Seesaw)","c":true,"e":"កន្ត្រៃ ជញ្ជីងថ្លឹង និងរ៉ាស់តង់ មានចំណុចទ្រនៅកណ្តាល ដូច្នេះជាឃ្នាស់ប្រភេទទី ១។"},{"t":"រទេះរុញដៃមួយ, ប្រដាប់គាស់ដប, និងប្រដាប់កាត់ក្រដាស","c":false,"e":"ទាំងនេះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"ចង្កឹះ, ប្រដាប់ចាប់ទឹកកក, និងដងសន្ទូចត្រី","c":false,"e":"ទាំងនេះជាឃ្នាស់ប្រភេទទី ៣។"},{"t":"កាំបិត, ពូថៅ, ជណ្តើរ, និងផ្លែស្វានឈើ","c":false,"e":"ទាំងនេះជាប្លង់ទេរ។"}]},{"q":"តើ 'ឃ្នាស់ប្រភេទទី ២' មានលក្ខណៈសម្គាល់ដូចម្តេច?","opts":[{"t":"កម្លាំងទប់ឬបន្ទុក ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងចំណុចទ្រ","c":true,"e":"ឃ្នាស់ប្រភេទទី ២ មានបន្ទុក (Load) នៅកណ្តាលចន្លោះចលករនិងចំណុចទ្រ។"},{"t":"ចំណុចទ្រ ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងកម្លាំងទប់","c":false,"e":"នោះជាប្រភេទទី ១។"},{"t":"កម្លាំងចលករ ស្ថិតនៅចន្លោះ កម្លាំងទប់ និងចំណុចទ្រ","c":false,"e":"នោះជាប្រភេទទី ៣។"},{"t":"កម្លាំងចលករមានទំហំស្មើនឹងសូន្យជានិច្ចក្នុងការប្រើ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើឧបករណ៍ណាខ្លះជាឧទាហរណ៍នៃ 'ឃ្នាស់ប្រភេទទី ២'?","opts":[{"t":"រទេះរុញដៃមួយ, ប្រដាប់គាស់គម្របដប, និងប្រដាប់កាត់ក្រដាស","c":true,"e":"រទេះរុញដៃមួយនិងប្រដាប់គាស់គម្របដបមានបន្ទុកនៅកណ្តាល ដូច្នេះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"កន្ត្រៃ, ជញ្ជីងថ្លឹង, និងរ៉ាស់តង់លេងកម្សាន្ត","c":false,"e":"ទាំងនេះជាប្រភេទទី ១។"},{"t":"ចង្កឹះចាប់ម្ហូប, ប្រដាប់ចាប់ទឹកកក, និងដងសន្ទូច","c":false,"e":"ទាំងនេះជាប្រភេទទី ៣។"},{"t":"រ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉កស្ទូចយន្ត","c":false,"e":"ទាំងនេះជារ៉ក។"}]},{"q":"តើ 'ឃ្នាស់ប្រភេទទី ៣' មានលក្ខណៈសម្គាល់ដូចម្តេច?","opts":[{"t":"កម្លាំងចលករ ស្ថិតនៅចន្លោះ កម្លាំងទប់ឬបន្ទុក និងចំណុចទ្រ","c":true,"e":"ឃ្នាស់ប្រភេទទី ៣ មានកម្លាំងចលករ (Effort) នៅកណ្តាលចន្លោះបន្ទុកនិងចំណុចទ្រ។"},{"t":"ចំណុចទ្រ ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងកម្លាំងទប់","c":false,"e":"នោះជាប្រភេទទី ១។"},{"t":"កម្លាំងទប់ឬបន្ទុក ស្ថិតនៅចន្លោះ ចលករ និងចំណុចទ្រ","c":false,"e":"នោះជាប្រភេទទី ២។"},{"t":"គ្មានកម្លាំងចលករចូលរួមក្នុងការធ្វើចលនាឡើយ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើឧបករណ៍ណាខ្លះជាឧទាហរណ៍នៃ 'ឃ្នាស់ប្រភេទទី ៣'?","opts":[{"t":"ចង្កឹះចាប់ម្ហូប, ប្រដាប់ចាប់ទឹកកក, និងដងសន្ទូចត្រី","c":true,"e":"ចង្កឹះ ប្រដាប់ចាប់ទឹកកក និងដងសន្ទូច មានកម្លាំងចលករនៅកណ្តាល ដូច្នេះជាឃ្នាស់ប្រភេទទី ៣។"},{"t":"កន្ត្រៃ, ជញ្ជីងថ្លឹង, និងរ៉ាស់តង់លេងកម្សាន្ត","c":false,"e":"ទាំងនេះជាប្រភេទទី ១។"},{"t":"រទេះរុញដៃមួយ, ប្រដាប់គាស់គម្របដប, និងកាត់ក្រដាស","c":false,"e":"ទាំងនេះជាប្រភេទទី ២។"},{"t":"ជណ្តើរ, រណារ, ពូថៅ, និងផ្លែស្វានឈើ","c":false,"e":"ទាំងនេះជាប្លង់ទេរ។"}]},{"q":"តើប្រដាប់កាត់ក្រចក (Nail Clipper) ជាប្រភេទឧបករណ៍អ្វី?","opts":[{"t":"ជាឧបករណ៍រួមផ្សំរវាងឃ្នាស់ប្រភេទទី ១ និងប្រភេទទី ៣","c":true,"e":"ប្រដាប់កាត់ក្រចកជាឧបករណ៍រួមផ្សំរវាងឃ្នាស់ប្រភេទទី ១ (ដងកៀប) និងប្រភេទទី ៣ (មុខកាត់)។"},{"t":"ជាឃ្នាស់ប្រភេទទី ២ សុទ្ធសាធដោយគ្មានការរួមផ្សំ","c":false,"e":"មិនមែនប្រភេទទី ២ ឡើយ។"},{"t":"ជាប្លង់ទេររួមផ្សំជាមួយរ៉កចល័តទាញខ្សែ","c":false,"e":"មិនមែនឡើយ។"},{"t":"ជាម៉ាស៊ីនស្វ័យប្រវត្តិនឹងកន្លែងដោយគ្មានឃ្នាស់","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'ប្លង់ទេរ' (Inclined Plane) មាននិយមន័យដូចម្តេច?","opts":[{"t":"ជាផ្ទៃរាបមួយសម្រាប់ប្រើប្រាស់ជាទម្រក្នុងការលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់","c":true,"e":"ប្លង់ទេរជាផ្ទៃរាបទេរសម្រាប់ជួយសម្រួលការលើកដាក់វត្ថុឡើងចុះ។"},{"t":"ជាដងឈើចល័តជុំវិញអ័ក្សទ្រង់ដើម្បីគាស់បន្ទុក","c":false,"e":"នោះជាឃ្នាស់។"},{"t":"ជាកង់មានចង្អូរ និងខ្សែទាញសម្រាប់យោងបន្ទុក","c":false,"e":"នោះជារ៉ក។"},{"t":"ជាដងកៀបលោហៈសម្រាប់ចាប់ទឹកកក ឬចាប់ម្ហូប","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ៣។"}]},{"q":"តើគេត្រូវបញ្ចេញកម្លាំងចលករដូចម្តេច នៅពេលលើកបន្ទុកឡើងលើត្រង់ ដោយមិនប្រើប្លង់ទេរ?","opts":[{"t":"ត្រូវបញ្ចេញកម្លាំងចលករស្មើ ឬធំជាងទម្ងន់បន្ទុក","c":true,"e":"ការលើកត្រង់ឡើងលើតម្រូវឱ្យប្រើកម្លាំងស្មើ ឬធំជាងទម្ងន់បន្ទុក។"},{"t":"បញ្ចេញកម្លាំងចលករតូចជាងទម្ងន់បន្ទុកពាក់កណ្តាល","c":false,"e":"លើកត្រង់មិនចំណេញកម្លាំងទេ។"},{"t":"មិនបាច់បញ្ចេញកម្លាំងចលករសោះក្នុងការលើក","c":false,"e":"មិនអាចទៅរួចឡើយ។"},{"t":"ប្រើកម្លាំងចលករតែ ១/៤ នៃទម្ងន់បន្ទុកប៉ុណ្ណោះ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើមានអ្វីកើតឡើងចំពោះកម្លាំងចលករ នៅពេលគេរុញបន្ទុកឡើងលើតាម 'ប្លង់ទេរ'?","opts":[{"t":"កម្លាំងចលករដែលត្រូវប្រើមានទំហំតូចជាងទម្ងន់បន្ទុក","c":true,"e":"ប្លង់ទេរជួយកាត់បន្ថយកម្លាំងចលករឱ្យតូចជាងទម្ងន់បន្ទុក។"},{"t":"កម្លាំងចលករត្រូវប្រើមានទំហំធំជាងមុន ២ ដង","c":false,"e":"ប្លង់ទេរមិនបង្កើនកម្លាំងចលករឡើយ។"},{"t":"ទម្ងន់បន្ទុកកើនឡើងទ្វេដងលើផ្ទៃប្លង់ទេរ","c":false,"e":"ទម្ងន់បន្ទុកនៅដដែល។"},{"t":"មិនអាចផ្លាស់ទីបន្ទុកឡើងលើបានឡើយក្នុងគ្រប់ករណី","c":false,"e":"អាចផ្លាស់ទីបានងាយស្រួលជាង។"}]},{"q":"បើយើងរុញបន្ទុកដដែលឡើងលើតាមប្លង់ទេរដែលមាន 'ប្រវែងវែងជាងមុន' តើកម្លាំងចលករប្រែប្រួលដូចម្តេច?","opts":[{"t":"កម្លាំងចលករកាន់តែតូចជាងមុន (ចំណេញកម្លាំងកាន់តែខ្លាំង)","c":true,"e":"ប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។"},{"t":"កម្លាំងចលករកាន់តែធំជាងមុន (ខាតបង់កម្លាំងកាន់តែខ្លាំង)","c":false,"e":"មិនមែនឡើយ។"},{"t":"កម្លាំងចលករនៅដដែលដោយមិនប្រែប្រួលទំហំឡើយ","c":false,"e":"ប្រវែងវែងជួយកាត់បន្ថយកម្លាំង។"},{"t":"មិនបាច់ប្រើកម្លាំងចលករសោះក្នុងការរុញឡើង","c":false,"e":"នៅតែប្រើកម្លាំងខ្លះ។"}]},{"q":"តើឧបករណ៍ណាខ្លះដែលច្នៃចេញពីគោលការណ៍ 'ប្លង់ទេរ'?","opts":[{"t":"ពូថៅ, រណារ, ពន្លាក, ផ្លែស្វាន, កាំបិត, និងជណ្តើរ","c":true,"e":"ពូថៅ កាំបិត ជណ្តើរ និងផ្លែស្វាន សុទ្ធសឹងជាឧបករណ៍ច្នៃចេញពីប្លង់ទេរ។"},{"t":"កន្ត្រៃ, ជញ្ជីងថ្លឹង, និងរ៉ាស់តង់លេងកម្សាន្ត","c":false,"e":"ទាំងនេះជាឃ្នាស់ប្រភេទទី ១។"},{"t":"រទេះរុញដៃមួយ, ប្រដាប់គាស់គម្របដប, និងកាត់ក្រដាស","c":false,"e":"ទាំងនេះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"ដងទង់ជាតិ, អណ្ដូងទឹក, និងស្ទូចយន្តលើកទំនិញ","c":false,"e":"ទាំងនេះប្រើរ៉ក។"}]},{"q":"ហេតុអ្វីបានជាផ្លូវឡើងភ្នំភាគច្រើនគេធ្វើជា 'ផ្លូវវង់កោងជុំវិញភ្នំ'?","opts":[{"t":"ព្រោះផ្លូវវង់បង្កើនប្រវែងប្លង់ទេរ ធ្វើឱ្យយានយន្តប្រើកម្លាំងតូចជាងមុនដើម្បីឡើង","c":true,"e":"ផ្លូវវង់កោងជាប្លង់ទេរវែង ជួយឱ្យរថយន្តឡើងភ្នំដោយប្រើកម្លាំងម៉ាស៊ីនតូចជាង។"},{"t":"ព្រោះចង់ឱ្យយានយន្តចំណាយពេលបើកបរយូរជាងមុនលើផ្លូវ","c":false,"e":"មិនមែនជាមូលហេតុបច្ចេកទេសឡើយ។"},{"t":"ព្រោះធ្វើឱ្យយានយន្តមានទម្ងន់ធ្ងន់ជាងមុនពេលបើកបរ","c":false,"e":"មិនមែនឡើយ។"},{"t":"ព្រោះផ្លូវឡើងត្រង់គ្មានខ្យល់អាកាសបរិសុទ្ធសម្រាប់បើកបរ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'អាប ឬខ្ចៅ' (Screw) មានទម្រង់រូបវិទ្យាជាអ្វី?","opts":[{"t":"ជាប្លង់ទេរដែលរុំព័ទ្ធជុំវិញស៊ីឡាំង ឬស្នូលកណ្តាល","c":true,"e":"ធ្មេញអាប ឬខ្ចៅ គឺជាប្លង់ទេរដែលរុំជុំវិញអ័ក្សស៊ីឡាំង។"},{"t":"ជាឃ្នាស់ប្រភេទទី ២ សម្រាប់គាស់បន្ទុកធ្ងន់ៗ","c":false,"e":"មិនមែនឡើយ។"},{"t":"ជារ៉កចល័តសម្រាប់ទាញយោងបន្ទុកឡើងលើ","c":false,"e":"មិនមែនឡើយ។"},{"t":"ជាដងសន្ទូចសម្រាប់ចាប់ទាញបន្ទុកពីចម្ងាយ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើកាំបិត និងពូថៅ ប្រើប្រាស់ប្លង់ទេររបៀបណាដើម្បីមុត ឬពុះឈើ?","opts":[{"t":"មុខកាំបិត ឬពូថៅមានរាងជាប្លង់ទេរពីរទល់ខ្នងគ្នា (Wedge)","c":true,"e":"មុខពូថៅមានរាងជាប្លង់ទេរទល់ខ្នងគ្នា (ត្រសាំង/Wedge) ជួយបំបែកឈើដោយប្រើកម្លាំងតូច។"},{"t":"វាប្រើប្រព័ន្ធរ៉កទាញបំបែកសរសៃឈើចេញពីគ្នា","c":false,"e":"មិនមែនឡើយ។"},{"t":"វាបង្កើនទម្ងន់ពូថៅឱ្យធ្ងន់ជាងមុន ១០ ដងពេលវាយ","c":false,"e":"មិនមែនឡើយ។"},{"t":"វាជាឃ្នាស់ប្រភេទទី ៣ ដែលមានកម្លាំងចលករនៅកណ្តាល","c":false,"e":"មុខពូថៅជាប្លង់ទេរ។"}]},{"q":"តើ 'រ៉ក' (Pulley) មាននិយមន័យដូចម្តេច?","opts":[{"t":"ជាកង់ធ្វើពីឈើឬលោហៈដែលមានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែ និងមានអ័ក្សកាត់តាមផ្ចិត","c":true,"e":"រ៉កជាកង់មានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែពួរ និងមានអ័ក្សកណ្តាល។"},{"t":"ជាបន្ទះឈើទេរសម្រាប់រុញទំនិញពីទីទាបទៅទីខ្ពស់","c":false,"e":"នោះជាប្លង់ទេរ។"},{"t":"ជាដងឈើចល័តជុំវិញចំណុចទ្រដើម្បីគាស់បន្ទុក","c":false,"e":"នោះជាឃ្នាស់។"},{"t":"ជាប្រដាប់កាត់ក្រដាសនៅក្នុងការិយាល័យ","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ២។"}]},{"q":"តើផ្នែកសំខាន់ៗនៃរ៉កមានអ្វីខ្លះ?","opts":[{"t":"សម្ពាយ, កង់, អ័ក្ស, ខ្សែ, និងចង្អូរ","c":true,"e":"ផ្នែកសំខាន់ៗនៃរ៉កមាន សម្ពាយ កង់ អ័ក្ស ខ្សែ និងចង្អូរ។"},{"t":"កម្លាំងចលករ, កម្លាំងទប់, និងចំណុចទ្រ","c":false,"e":"នោះជាផ្នែកនៃឃ្នាស់។"},{"t":"ផ្លែស្វាន, ពន្លាក, និងជណ្តើរឡើង","c":false,"e":"នោះជាឧបករណ៍ប្លង់ទេរ។"},{"t":"ក្បាល, ដង, និងកន្ទុយលោហៈ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើគេចែករ៉កជាប៉ុន្មានប្រភេទសំខាន់ៗ?","opts":[{"t":"៣ ប្រភេទ (រ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉ក)","c":true,"e":"រ៉កមាន ៣ ប្រភេទគឺ រ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉ក។"},{"t":"២ ប្រភេទ (រ៉កឈើ និងរ៉កលោហៈធាតុ)","c":false,"e":"រ៉កមាន ៣ ប្រភេទ។"},{"t":"៤ ប្រភេទ (រ៉កតូច, រ៉កធំ, រ៉ករ៉ក, និងរ៉កអគ្គិសនី)","c":false,"e":"មិនមែនឡើយ។"},{"t":"៥ ប្រភេទ (តាមទំហំផ្លូវចង្អូរ និងប្រវែងខ្សែ)","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'រ៉កនឹង' (Fixed Pulley) មានលក្ខណៈសម្គាល់ដូចម្តេច?","opts":[{"t":"មានរ៉កតែមួយដែលនៅនឹងមួយកន្លែងមិនចល័តតាមបន្ទុកឡើយ","c":true,"e":"រ៉កនឹង ជាំរ៉កតែមួយដែលភ្ជាប់នឹងកន្លែង (ដូចជាកំពូលដងទង់ជាតិ)។"},{"t":"រ៉កផ្លាស់ទីឡើងលើចុះក្រោមតាមបន្ទុកដែលត្រូវលើក","c":false,"e":"នោះជារ៉កចល័ត។"},{"t":"មានរ៉កចាប់ពី ៤ ឡើងទៅរួមបញ្ចូលគ្នាក្នុងប្រព័ន្ធ","c":false,"e":"នោះជាប្រព័ន្ធរ៉ក។"},{"t":"គ្មានខ្សែពួរសម្រាប់ទាញ និងយោងបន្ទុកឡើយ","c":false,"e":"រ៉កទាំងអស់ត្រូវមានខ្សែ។"}]},{"q":"តើ 'រ៉កចល័ត' (Movable Pulley) ផ្តុំឡើងពីរ៉កចំនួនប៉ុន្មាន?","opts":[{"t":"ផ្តុំឡើងពីរ៉កចំនួន ២ (រ៉កនឹងមួយ និងរ៉កចល័តមួយ)","c":true,"e":"រ៉កចល័តមានរ៉ក ២ គឺរ៉កនឹងមួយនិងរ៉កចល័តមួយដែលផ្លាស់ទីជាមួយបន្ទុក។"},{"t":"មានរ៉កនឹងតែ ១ ប៉ុណ្ណោះដែលនៅនឹងកន្លែង","c":false,"e":"នោះជារ៉កនឹង។"},{"t":"មានរ៉កចំនួន ៤ ឡើងទៅរួមបញ្ចូលគ្នាក្នុងប្រព័ន្ធ","c":false,"e":"នោះជាប្រព័ន្ធរ៉ក។"},{"t":"គ្មានរ៉កសោះក្នុងរចនាសម្ព័ន្ធទាញខ្សែ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'ប្រព័ន្ធរ៉ក' (Pulley System) ផ្តុំឡើងពីរ៉កចំនួនប៉ុន្មាន?","opts":[{"t":"ផ្តុំឡើងពីរ៉កចំនួន ៤ ឡើងទៅ (រ៉កនឹង និងរ៉កចល័តច្រើនបញ្ចូលគ្នា)","c":true,"e":"ប្រព័ន្ធរ៉កមានរ៉កចាប់ពី ៤ ឡើងទៅ ដើម្បីបង្កើនលទ្ធភាពលើកបន្ទុកធ្ងន់ៗ។"},{"t":"មានរ៉កតែ ១ ប៉ុណ្ណោះដែលនៅនឹងកន្លែង","c":false,"e":"នោះជារ៉កនឹង។"},{"t":"មានរ៉កចំនួន ២ (រ៉កនឹងមួយ និងរ៉កចល័តមួយ)","c":false,"e":"នោះជារ៉កចល័ត។"},{"t":"មានរ៉កតែ ៣ ប៉ុណ្ណោះក្នុងគ្រប់ករណីប្រើប្រាស់","c":false,"e":"ប្រព័ន្ធរ៉កជាទូទៅមាន ៤ ឡើងទៅ។"}]},{"q":"តើឧបករណ៍ណាក្នុងជីវភាពរស់នៅដែលប្រើប្រាស់ 'រ៉កនឹង'?","opts":[{"t":"ដងទង់ជាតិ និងរ៉ករែកទឹកអណ្ដូង","c":true,"e":"ដងទង់ជាតិ និងរ៉កអណ្ដូងទឹក ប្រើរ៉កនឹងដើម្បីប្តូរទិសដៅកម្លាំងទាញ។"},{"t":"រទេះរុញដៃមួយសម្រាប់ដឹកដី ឬខ្សាច់","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"កន្ត្រៃកាត់សក់ និងកន្ត្រៃកាត់ក្រដាស","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ១។"},{"t":"ផ្លែស្វានឈើ និងពូថៅពុះអុស","c":false,"e":"នោះជាប្លង់ទេរ។"}]},{"q":"តើស្ទូចយន្ត ឬក្រេនលើកទំនិញធ្ងន់ៗនៅកំពង់ផែ ប្រើប្រាស់រ៉កប្រភេទអ្វី?","opts":[{"t":"ប្រព័ន្ធរ៉ក (Pulley System) ដែលមានរ៉កច្រើនបញ្ចូលគ្នា","c":true,"e":"ស្ទូចយន្តប្រើប្រព័ន្ធរ៉កដើម្បីលើកកុងតឺន័រ ឬទំនិញរាប់តោនដោយប្រើកម្លាំងម៉ាស៊ីនតូច។"},{"t":"រ៉កនឹងតែមួយប៉ុណ្ណោះដែលនៅនឹងកន្លែង","c":false,"e":"រ៉កនឹងមិនចំណេញកម្លាំងសម្រាប់លើកទំនិញរាប់តោនទេ។"},{"t":"ឃ្នាស់ប្រភេទទី ៣ មានកម្លាំងចលករនៅកណ្តាល","c":false,"e":"មិនមែនឡើយ។"},{"t":"ប្លង់ទេរដែលមានមុំទេរធំបំផុត","c":false,"e":"ស្ទូចយន្តប្រើប្រព័ន្ធរ៉ក។"}]},{"q":"នៅពេលប្រើ 'រ៉កនឹង' តើកម្លាំងចលករដែលត្រូវទាញខ្សែចុះមានទំហំស្មើនឹងអ្វី?","opts":[{"t":"ស្មើនឹងទម្ងន់បន្ទុកដែលត្រូវយោងឡើងទៅលើ (កម្លាំងចលករ = ទម្ងន់បន្ទុក)","c":true,"e":"រ៉កនឹងមិនចំណេញកម្លាំងទេ គឺកម្លាំងចលករស្មើទម្ងន់បន្ទុក (N=1)។"},{"t":"ស្មើនឹងពាក់កណ្តាលនៃទម្ងន់បន្ទុកដែលត្រូវយោងឡើង","c":false,"e":"នោះជារ៉កចល័ត។"},{"t":"ស្មើនឹង ១/៤ នៃទម្ងន់បន្ទុកដែលត្រូវយោងឡើង","c":false,"e":"នោះជាប្រព័ន្ធរ៉ក N=4។"},{"t":"ស្មើនឹងសូន្យដោយមិនបាច់ប្រើកម្លាំងចលករសោះ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'រ៉កនឹង' មានសារប្រយោជន៍ចម្បងអ្វី បើវាមិនចំណេញកម្លាំងចលករ?","opts":[{"t":"ជួយប្តូរទិសដៅនៃកម្លាំង (ទាញខ្សែចុះក្រោម ដើម្បីឱ្យបន្ទុកឡើងទៅលើ)","c":true,"e":"រ៉កនឹងជួយសម្រួលទិសដៅកម្លាំងទាញ ធ្វើឱ្យងាយស្រួលទាញចុះក្រោមតាមទំនាញផែនដី។"},{"t":"កាត់បន្ថយទម្ងន់បន្ទុកឱ្យស្រាលជាងមុន ៥០% ភ្លាមៗ","c":false,"e":"រ៉កនឹងមិនកាត់បន្ថយកម្លាំងទេ។"},{"t":"ធ្វើឱ្យបន្ទុកបាត់បង់ម៉ាសពិតប្រាកដក្នុងពេលយោងឡើង","c":false,"e":"ម៉ាសនៅដដែល។"},{"t":"បង្កើនល្បឿនផ្លាស់ទី ១០ ដងដោយមិនប្រើថាមពល","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"នៅពេលប្រើ 'រ៉កចល័ត' (មានរ៉ក ២) តើកម្លាំងចលករដែលត្រូវទាញខ្សែចុះមានទំហំស្មើនឹងអ្វី?","opts":[{"t":"ស្មើនឹងពាក់កណ្តាលនៃទម្ងន់បន្ទុក (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ២)","c":true,"e":"រ៉កចល័ត (N=2) ជួយកាត់បន្ថយកម្លាំងចលករមកត្រឹមពាក់កណ្តាល (ចំណេញកម្លាំង ២ ដង)។"},{"t":"ស្មើនឹងទម្ងន់បន្ទុកទាំងស្រុងដោយមិនចំណេញកម្លាំង","c":false,"e":"នោះជារ៉កនឹង។"},{"t":"ស្មើនឹង ១/៤ នៃទម្ងន់បន្ទុកដែលត្រូវយោងឡើង","c":false,"e":"នោះជាប្រព័ន្ធរ៉ក N=4។"},{"t":"ស្មើនឹង ២ ដងនៃទម្ងន់បន្ទុកដែលត្រូវយោងឡើង","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"បើគេចង់លើកបន្ទុកទម្ងន់ 100 ញូតុន (N) ដោយប្រើ 'រ៉កចល័ត' (N=2) តើគេត្រូវប្រើកម្លាំងចលករប្រមាណប៉ុន្មាន?","opts":[{"t":"50 ញូតុន (N) ដោយចំណេញកម្លាំងពាក់កណ្តាល","c":true,"e":"កម្លាំងចលករ = 100 / 2 = 50 ញូតុន។"},{"t":"100 ញូតុន (N) ដោយមិនចំណេញកម្លាំងចលករ","c":false,"e":"100 N ជាកម្លាំងសម្រាប់រ៉កនឹង។"},{"t":"25 ញូតុន (N) ដោយចំណេញកម្លាំង ៤ ដង","c":false,"e":"25 N ជាកម្លាំងសម្រាប់ប្រព័ន្ធរ៉ក N=4។"},{"t":"200 ញូតុន (N) ដោយត្រូវខាតកម្លាំង ២ ដង","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"នៅពេលប្រើ 'ប្រព័ន្ធរ៉ក' (ដែលមានរ៉កចំនួន ៤) តើកម្លាំងចលករស្មើនឹងប៉ុន្មាននៃទម្ងន់បន្ទុក?","opts":[{"t":"ស្មើនឹងមួយភាគបួននៃទម្ងន់បន្ទុក (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ៤)","c":true,"e":"ប្រព័ន្ធរ៉ក N=4 ជួយចំណេញកម្លាំងចលករ ៤ ដង (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ៤)។"},{"t":"ស្មើនឹងពាក់កណ្តាលនៃទម្ងន់បន្ទុកដែលត្រូវយោង","c":false,"e":"នោះជារ៉កចល័ត N=2។"},{"t":"ស្មើនឹងទម្ងន់បន្ទុកទាំងស្រុងដោយមិនចំណេញកម្លាំង","c":false,"e":"នោះជារ៉កនឹង N=1។"},{"t":"ស្មើនឹង ៤ ដងនៃទម្ងន់បន្ទុកដែលត្រូវយោងឡើង","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"បើគេចង់លើកបន្ទុកធ្ងន់ទម្ងន់ 400 គីឡូក្រាម ដោយប្រើ 'ប្រព័ន្ធរ៉ក' (N=4) តើគេត្រូវប្រើកម្លាំងចលករធៀបនឹងទម្ងន់ប៉ុន្មាន?","opts":[{"t":"ស្មើនឹងទម្ងន់ 100 គីឡូក្រាម (ចំណេញកម្លាំង ៤ ដង)","c":true,"e":"កម្លាំងចលករ = 400 / 4 = 100 គីឡូក្រាម។"},{"t":"ស្មើនឹងទម្ងន់ 200 គីឡូក្រាម (ចំណេញកម្លាំង ២ ដង)","c":false,"e":"200kg សម្រាប់រ៉ក ២។"},{"t":"ស្មើនឹងទម្ងន់ 400 គីឡូក្រាម (មិនចំណេញកម្លាំងសោះ)","c":false,"e":"400kg សម្រាប់រ៉ក ១។"},{"t":"ស្មើនឹងទម្ងន់ 50 គីឡូក្រាម (ចំណេញកម្លាំង ៨ ដង)","c":false,"e":"50kg សម្រាប់រ៉ក ៨។"}]},{"q":"តើការប្រើរ៉កចល័ត និងប្រព័ន្ធរ៉ក ផ្តល់ចំណេញ និងប្រែប្រួលអ្វីខ្លះដល់អ្នកប្រើប្រាស់?","opts":[{"t":"ចំណេញកម្លាំងចលករ, ប្រែប្រួលទិសដៅនៃកម្លាំង, និងសម្រួលល្បឿន","c":true,"e":"រ៉កចល័តនិងប្រព័ន្ធរ៉កជួយចំណេញកម្លាំង ប្តូរទិស និងសម្រួលល្បឿនលើកបន្ទុក។"},{"t":"ខាតបង់កម្លាំងចលករ ២ ដងក្នុងការយោងបន្ទុកឡើង","c":false,"e":"មិនមែនឡើយ។"},{"t":"ធ្វើឱ្យបន្ទុកកើនទម្ងន់ធ្ងន់ជាងមុននៅលើអាកាស","c":false,"e":"មិនមែនឡើយ។"},{"t":"គ្មានសារប្រយោជន៍ ឬផលចំណេញអ្វីទាល់តែសោះ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើគោលការណ៍រួមនៃម៉ាស៊ីនងាយទាំងអស់ (ឃ្នាស់, ប្លង់ទេរ, និងរ៉ក) គឺបង្កើតឡើងដើម្បីអ្វី?","opts":[{"t":"សម្រួលការងារ និងកាត់បន្ថយកម្លាំងចលករដែលមនុស្សត្រូវបញ្ចេញក្នុងការលើក ឬផ្លាស់ទីបន្ទុក","c":true,"e":"គោលបំណងចម្បងនៃម៉ាស៊ីនងាយទាំងអស់គឺកាត់បន្ថយកម្លាំងចលករ និងសម្រួលការងារមនុស្ស។"},{"t":"បង្កើតថាមពលអគ្គិសនីស្វ័យប្រវត្តិចេញពីចលនាខ្យល់","c":false,"e":"នោះជាត័រប៊ីនខ្យល់។"},{"t":"វាស់សីតុណ្ហភាពអាកាសធាតុនៅក្នុងបន្ទប់ពិសោធន៍","c":false,"e":"នោះជាទែម៉ូម៉ែត្រ។"},{"t":"បំបែកបរមាណូគីមីឱ្យទៅជាភាគល្អិតតូចៗជាងមុន","c":false,"e":"មិនមែនឡើយ។"}]}];

  const shuffleArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffleQuiz = (list) => {
    if (!list || !Array.isArray(list)) return [];
    return list.map(q => {
      const rawOpts = q.opts || q.options || [];
      return {
        question: q.q || q.question || "",
        options: shuffleArray(rawOpts).map(o => ({
          text: o.t || o.text || "",
          isCorrect: o.c !== undefined ? Boolean(o.c) : Boolean(o.isCorrect),
          explanation: o.e || o.explanation || "ចម្លើយត្រឹមត្រូវត្រូវបានកំណត់ផ្អែកលើខ្លឹមសារពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦។"
        }))
      };
    });
  };

  const [shuffledQuestions, setShuffledQuestions] = y.useState(() => shuffleQuiz(rawQuestions));

  const activeQuestions = shuffledQuestions && shuffledQuestions.length > 0 ? shuffledQuestions : shuffleQuiz(rawQuestions);

  const score = Object.keys(userAnswers).reduce((acc, qIdx) => {
    const q = activeQuestions[qIdx];
    if (q && q.options && q.options[userAnswers[qIdx]] && q.options[userAnswers[qIdx]].isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const playTone = (freq, type = "sine", duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const toggleSpeech = (textToRead) => {
    if (isSpeaking) {
      if (window.stopKhmerAudio) window.stopKhmerAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(!1);
      return;
    }
    if (!textToRead) return;
    setIsSpeaking(!0);
    s && s("កំពុងអានជាសំឡេងភាសាខ្មែរ...");
    if (window.playKhmerSpeech) {
      window.playKhmerSpeech(
        textToRead,
        () => setIsSpeaking(!0),
        () => setIsSpeaking(!1),
        () => setIsSpeaking(!1)
      );
    } else if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToRead);
        utter.lang = "km-KH";
        utter.rate = 0.9;
        utter.onstart = () => setIsSpeaking(!0);
        utter.onend = () => setIsSpeaking(!1);
        utter.onerror = () => setIsSpeaking(!1);
        window.speechSynthesis.speak(utter);
      } catch (err) {
        setIsSpeaking(!1);
      }
    } else {
      setIsSpeaking(!1);
    }
  };

  const lesson14KeyTakeaways = "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១៤ ៖ ម៉ាស៊ីនងាយ ដែលប្អូនៗត្រូវចងចាំ ៖ " +
  "ទី ១. ឃ្នាស់ ៖ ជាម៉ាស៊ីនងាយចល័តជុំវិញចំណុចទ្រ។ មាន ៣ ផ្នែកគឺ បន្ទុក (Load), កម្លាំងចលករ (Effort), និងចំណុចទ្រ (Fulcrum)។ ឃ្នាស់ចែកជា ៣ ប្រភេទគឺ ៖ " +
  "ឃ្នាស់ប្រភេទទី ១ ៖ ចំណុចទ្រនៅកណ្តាល ដូចជា កន្ត្រៃ, ជញ្ជីង, និងរ៉ាស់តង់។ " +
  "ឃ្នាស់ប្រភេទទី ២ ៖ បន្ទុកនៅកណ្តាល ដូចជា រទេះរុញដៃមួយ, និងប្រដាប់គាស់ដប។ " +
  "ឃ្នាស់ប្រភេទទី ៣ ៖ កម្លាំងចលករនៅកណ្តាល ដូចជា ចង្កឹះ, និងប្រដាប់ចាប់ទឹកកក។ ដៃឃ្នាស់កាន់តែវែង កម្លាំងចលករកាន់តែតូច! " +
  "ទី ២. ប្លង់ទេរ ៖ ជាផ្ទៃរាបទេរសម្រាប់លើកដាក់វត្ថុ។ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។ ឧបករណ៍ច្នៃចេញពីប្លង់ទេរមាន ៖ ពូថៅ, កាំបិត, ជណ្តើរ, និងផ្លែស្វាន។ " +
  "ទី ៣. រ៉ក ៖ ជាកង់មានចង្អូរ និងខ្សែ។ រ៉កមាន ៣ ប្រភេទគឺ ៖ " +
  "រ៉កនឹង (N=1) ៖ ប្តូរទិសដៅកម្លាំង ប៉ុន្តែមិនចំណេញកម្លាំងទេ។ (កម្លាំងចលករ = ទម្ងន់បន្ទុក)។ " +
  "រ៉កចល័ត (N=2) ៖ កាត់បន្ថយកម្លាំងពាក់កណ្តាល! (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ២)។ " +
  "ប្រព័ន្ធរ៉ក (N=4) ៖ កាត់បន្ថយកម្លាំង ៤ ដង! (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ៤)។ " +
  "សូមចងចាំចំណុចសំខាន់ៗទាំងនេះដើម្បីទទួលបានពិន្ទុល្អ!";

  // Calculations for Lab 1 (Lever)
  const calcLeverEffort = Math.round((leverLoad * leverLoadArm) / Math.max(0.5, leverEffortArm));
  const leverSavings = Math.max(0, Math.round(((leverLoad - calcLeverEffort) / leverLoad) * 100));

  // Calculations for Lab 2 (Inclined Plane)
  const calcPlaneEffort = Math.round((planeLoad * rampHeight) / Math.max(0.1, rampLength));
  const planeSavings = Math.max(0, Math.round(((planeLoad - calcPlaneEffort) / planeLoad) * 100));

  // Calculations for Lab 3 (Pulley)
  const pulleyN = pulleyType === "fixed" ? 1 : pulleyType === "movable" ? 2 : 4;
  const calcPulleyEffort = Math.round(pulleyLoad / pulleyN);
  const pulleySavings = Math.round(((pulleyLoad - calcPulleyEffort) / pulleyLoad) * 100);

  return e.jsx("div", {
    className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn",
    children: e.jsxs("div", {
      className: "bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh] text-slate-800",
      children: [
        // Modern Premium Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-lg relative overflow-hidden shrink-0 border-b border-white/10",
          children: [
            // Glowing background blur effects
            e.jsx("div", { className: "absolute -top-12 -left-12 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" }),
            e.jsx("div", { className: "absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" }),

            e.jsxs("div", {
              className: "flex items-center gap-3.5 z-10",
              children: [
                e.jsx("div", {
                  className: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-lg ring-1 ring-white/20 shrink-0",
                  children: "⚙️"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2 mb-1",
                      children: [
                        e.jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xs", children: "មេរៀនទី ១៤" }),
                        e.jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-sky-100 font-bold text-[10px] border border-white/20", children: "ជំពូកទី ៤ • ថ្នាក់ទី ៦" })
                      ]
                    }),
                    e.jsx("h2", {
                      className: "text-base sm:text-xl font-bold font-moul text-white drop-shadow-md line-clamp-1",
                      children: "ម៉ាស៊ីនងាយ (Simple Machines)"
                    })
                  ]
                })
              ]
            }),

            e.jsxs("div", {
              className: "flex items-center gap-2 z-10",
              children: [
                e.jsx("button", {
                  type: "button",
                  onClick: () => toggleSpeech(lesson14KeyTakeaways),
                  className: "px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-sm " + (isSpeaking ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse ring-2 ring-amber-300/50" : "bg-white/15 text-white border-white/25 hover:bg-white/25"),
                  title: "ស្ដាប់ការពន្យល់ចំណុចគន្លឹះមេរៀន",
                  children: isSpeaking ? "⏹️ បញ្ឈប់ការស្ដាប់ពន្យល់" : "🎧 ស្តាប់ពន្យល់ចំណុចសំខាន់ៗ"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: () => {
                    setSoundEnabled(!soundEnabled);
                    playTone(600, "sine", 0.1);
                  },
                  className: "w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition border border-white/25 cursor-pointer shadow-sm",
                  title: soundEnabled ? "បិទសំឡេង" : "បើកសំឡេង",
                  children: soundEnabled ? "🔔" : "🔕"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: t,
                  className: "w-10 h-10 rounded-2xl bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center transition border border-rose-400/40 cursor-pointer font-bold shadow-sm",
                  children: "✕"
                })
              ]
            })
          ]
        }),

        // Tab Navigation Bar
        e.jsx("div", {
          className: "bg-slate-100/90 border-b border-slate-200/80 p-2 overflow-x-auto no-scrollbar shrink-0 shadow-inner",
          children: e.jsxs("div", {
            className: "flex items-center gap-2 min-w-max",
            children: [
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-hero"); playTone(500); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-hero" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "📖 ១. មេរៀនសង្ខេប"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-lever"); playTone(520); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-lever" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md ring-2 ring-amber-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "⚖️ ២. ក្លែងធ្វើឃ្នាស់"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-ramp"); playTone(540); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-ramp" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "📐 ៣. ក្លែងធ្វើប្លង់ទេរ"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-pulley"); playTone(560); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-pulley" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "🏗️ ៤. ក្លែងធ្វើរ៉ក"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-quiz"); playTone(600); },
                className: "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs " + (n === "tab-quiz" ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md ring-2 ring-rose-400/40" : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"),
                children: "🎯 ៥. តេស្ត QCM (៤០)"
              })
            ]
          })
        }),

        // Tab Content Body
        e.jsx("div", {
          className: "p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/70 space-y-6",
          children: [
            // TAB 1: HERO LESSON SUMMARY
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Top Hero Banner
                e.jsxs("div", {
                  className: "bg-gradient-to-br from-blue-900 via-indigo-900 to-sky-900 rounded-3xl p-6 text-white shadow-md border border-indigo-800/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-3 max-w-xl z-10",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("span", { className: "px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-md", children: "មេរៀនទី ១៤ • វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦" }),
                            e.jsx("span", { className: "px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xs", children: "ជំពូកទី ៤" })
                          ]
                        }),
                        e.jsx("h1", {
                          className: "text-xl sm:text-3xl font-bold font-moul text-white drop-shadow-md",
                          children: "ម៉ាស៊ីនងាយ (Simple Machines)"
                        }),
                        e.jsx("p", {
                          className: "text-xs sm:text-sm text-sky-100/90 leading-relaxed font-normal",
                          children: "ម៉ាស៊ីនងាយ គឺជាឧបករណ៍ដែលជួយសម្រួលដល់ការលើក គាស់ ឬរំកិលវត្ថុធ្ងន់ៗដោយប្រើប្រាស់កម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។ ម៉ាស៊ីនងាយចម្បងក្នុងមេរៀននេះរួមមាន ឃ្នាស់, ប្លង់ទេរ, និងរ៉ក។"
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full md:w-auto",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-lever"); playTone(500); },
                          className: "w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2",
                          children: "⚙️ ពិសោធន៍ម៉ាស៊ីនងាយ"
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-quiz"); playTone(600); },
                          className: "w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2",
                          children: "📝 ប្រឡង QCM ៤០ សំណួរ"
                        })
                      ]
                    })
                  ]
                }),

                // 3 Main Simple Machines Cards Grid
                e.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-3 gap-5",
                  children: [
                    // Card 1: ឃ្នាស់ (Levers)
                    e.jsxs("div", {
                      className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition duration-300 space-y-4 flex flex-col justify-between group",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3.5",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-inner", children: "⚖️" }),
                                e.jsx("span", { className: "px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-extrabold text-xs border border-amber-200", children: "១. ឃ្នាស់ (Lever)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "១. ឃ្នាស់" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: "ជាឧបករណ៍ធ្វើពីរុក្ខជាតិរឹងមាំ ឬលោហៈចល័តជុំវិញចំណុចទ្រ។ មាន ៣ ផ្នែកសំខាន់ ៖ កម្លាំងចលករ (Effort), កម្លាំងទប់ (Load), និងចំណុចទ្រ (Fulcrum)។" }),
                            e.jsxs("div", {
                              className: "bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-2 text-xs text-amber-950 font-medium",
                              children: [
                                e.jsx("p", { className: "font-bold text-amber-900 border-b border-amber-200/60 pb-1", children: "📌 ប្រភេទឃ្នាស់ ៣ យ៉ាង ៖" }),
                                e.jsx("p", { children: "• ប្រភេទទី ១ ៖ ចំណុចទ្រនៅកណ្តាល (កន្ត្រៃ, ជញ្ជីង)" }),
                                e.jsx("p", { children: "• ប្រភេទទី ២ ៖ បន្ទុកនៅកណ្តាល (រទេះរុញដៃមួយ)" }),
                                e.jsx("p", { children: "• ប្រភេទទី ៣ ៖ កម្លាំងចលករនៅកណ្តាល (ចង្កឹះ)" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-lever"); playTone(500); },
                          className: "w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition cursor-pointer text-center",
                          children: "ពិសោធន៍ឃ្នាស់ ៣ ប្រភេទ →"
                        })
                      ]
                    }),

                    // Card 2: ប្លង់ទេរ (Inclined Plane)
                    e.jsxs("div", {
                      className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400/80 transition duration-300 space-y-4 flex flex-col justify-between group",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3.5",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-inner", children: "📐" }),
                                e.jsx("span", { className: "px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200", children: "២. ប្លង់ទេរ (Ramp)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "២. ប្លង់ទេរ" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: "ជាផ្ទៃរាបទេរសម្រាប់ជួយលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់។ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករដែលត្រូវប្រើកាន់តែតូច។" }),
                            e.jsxs("div", {
                              className: "bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2 text-xs text-emerald-950 font-medium",
                              children: [
                                e.jsx("p", { className: "font-bold text-emerald-900 border-b border-emerald-200/60 pb-1", children: "📌 គោលការណ៍កម្លាំង ៖" }),
                                e.jsx("p", { children: "• លើកត្រង់ ៖ កម្លាំងចលករ = ទម្ងន់បន្ទុក" }),
                                e.jsx("p", { children: "• រុញតាមប្លង់ទេរ ៖ កម្លាំងចលករ < ទម្ងន់បន្ទុក" }),
                                e.jsx("p", { children: "• ឧបករណ៍ច្នៃ ៖ ពូថៅ, កាំបិត, ជណ្តើរ, ផ្លែស្វាន" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-ramp"); playTone(540); },
                          className: "w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer text-center",
                          children: "ពិសោធន៍ប្លង់ទេរ និងមុំទេរ →"
                        })
                      ]
                    }),

                    // Card 3: រ៉ក (Pulleys)
                    e.jsxs("div", {
                      className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-400/80 transition duration-300 space-y-4 flex flex-col justify-between group",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3.5",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-inner", children: "🏗️" }),
                                e.jsx("span", { className: "px-3 py-1 rounded-xl bg-purple-50 text-purple-800 font-extrabold text-xs border border-purple-200", children: "៣. រ៉ក (Pulley)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "៣. រ៉ក" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: "ជាកង់មានចង្អូរ និងខ្សែសម្រាប់លើកបន្ទុក។ ចែកជា ៣ ប្រភេទ ៖ រ៉កនឹង (N=1), រ៉កចល័ត (N=2), និងប្រព័ន្ធរ៉ក (N=4)។" }),
                            e.jsxs("div", {
                              className: "bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200/80 space-y-2 text-xs text-purple-950 font-medium",
                              children: [
                                e.jsx("p", { className: "font-bold text-purple-900 border-b border-purple-200/60 pb-1", children: "📌 រូបមន្តចំណេញកម្លាំង ៖" }),
                                e.jsx("p", { children: "• រ៉កនឹង (N=1) ៖ កម្លាំង = បន្ទុក (ប្តូរទិសដៅ)" }),
                                e.jsx("p", { children: "• រ៉កចល័ត (N=2) ៖ កម្លាំង = បន្ទុក / ២ (ចំណេញ ៥០%)" }),
                                e.jsx("p", { children: "• ប្រព័ន្ធរ៉ក (N=4) ៖ កម្លាំង = បន្ទុក / ៤ (ចំណេញ ៧៥%)" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-pulley"); playTone(560); },
                          className: "w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition cursor-pointer text-center",
                          children: "ពិសោធន៍ប្រព័ន្ធរ៉ក និងគណនា →"
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 2: LEVER SIMULATOR
            n === "tab-lever" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-lg font-moul", children: "⚖️ បន្ទប់ពិសោធន៍ក្លែងធ្វើឃ្នាស់ (Lever Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "ជ្រើសរើសប្រភេទឃ្នាស់ កំណត់ទម្ងន់បន្ទុក និងប្រវែងដៃឃ្នាស់ដើម្បីសង្កេតកម្លាំងចលករ" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type1"),
                              className: "px-3.5 py-2 rounded-2xl text-xs font-bold cursor-pointer transition border " + (leverType === "type1" ? "bg-amber-600 text-white border-amber-600 shadow-xs" : "bg-slate-100 text-slate-700 border-slate-200/80"),
                              children: "ប្រភេទទី ១ (កន្ត្រៃ)"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type2"),
                              className: "px-3.5 py-2 rounded-2xl text-xs font-bold cursor-pointer transition border " + (leverType === "type2" ? "bg-amber-600 text-white border-amber-600 shadow-xs" : "bg-slate-100 text-slate-700 border-slate-200/80"),
                              children: "ប្រភេទទី ២ (រទេះរុញ)"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type3"),
                              className: "px-3.5 py-2 rounded-2xl text-xs font-bold cursor-pointer transition border " + (leverType === "type3" ? "bg-amber-600 text-white border-amber-600 shadow-xs" : "bg-slate-100 text-slate-700 border-slate-200/80"),
                              children: "ប្រភេទទី ៣ (ចង្កឹះ)"
                            })
                          ]
                        })
                      ]
                    }),

                    // Interactive Sliders Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-5 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/70",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📦 ទម្ងន់បន្ទុក (Load):" }),
                                e.jsxs("span", { className: "text-amber-800 font-extrabold text-sm", children: [leverLoad, " kg"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 10,
                              max: 150,
                              step: 10,
                              value: leverLoad,
                              onChange: (e) => setLeverLoad(Number(e.target.value)),
                              className: "w-full accent-amber-600 cursor-pointer"
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📏 ប្រវែងដៃចលករ (Effort Arm):" }),
                                e.jsxs("span", { className: "text-amber-800 font-extrabold text-sm", children: [leverEffortArm, " m"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 1,
                              max: 5,
                              step: 0.5,
                              value: leverEffortArm,
                              onChange: (e) => setLeverEffortArm(Number(e.target.value)),
                              className: "w-full accent-amber-600 cursor-pointer"
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📐 ប្រវែងដៃបន្ទុក (Load Arm):" }),
                                e.jsxs("span", { className: "text-amber-800 font-extrabold text-sm", children: [leverLoadArm, " m"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 0.5,
                              max: 3,
                              step: 0.5,
                              value: leverLoadArm,
                              onChange: (e) => setLeverLoadArm(Number(e.target.value)),
                              className: "w-full accent-amber-600 cursor-pointer"
                            })
                          ]
                        })
                      ]
                    }),

                    // Canvas Visual
                    e.jsxs("div", {
                      className: "bg-slate-950 rounded-3xl p-6 text-white flex flex-col items-center justify-center relative min-h-[240px] overflow-hidden border border-slate-800 shadow-inner",
                      children: [
                        e.jsx("div", {
                          className: "w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[45px] border-b-amber-500 absolute bottom-6 z-10 drop-shadow-md",
                          style: { left: "50%", transform: "translateX(-50%)" }
                        }),
                        e.jsxs("div", {
                          className: "w-[82%] h-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-full absolute bottom-[70px] z-20 shadow-xl flex items-center justify-between px-5 transition-transform duration-500",
                          style: { transform: "rotate(-2deg)" },
                          children: [
                            e.jsxs("div", {
                              className: "bg-rose-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg -translate-y-9 flex items-center gap-1.5 border border-rose-400 animate-bounce",
                              children: [
                                e.jsx("span", { children: "📦 បន្ទុក" }),
                                e.jsxs("span", { className: "text-yellow-300 font-extrabold", children: [leverLoad, "kg"] })
                              ]
                            }),
                            e.jsx("div", {
                              className: "bg-slate-950/90 text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-400/40 shadow-xs",
                              children: leverType === "type1" ? "ចំណុចទ្រកណ្តាល" : leverType === "type2" ? "បន្ទុកកណ្តាល" : "ចលករកណ្តាល"
                            }),
                            e.jsxs("div", {
                              className: "bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg -translate-y-9 flex items-center gap-1.5 border border-emerald-400",
                              children: [
                                e.jsx("span", { children: "💪 កម្លាំងចលករ" }),
                                e.jsxs("span", { className: "text-emerald-200 font-extrabold", children: [calcLeverEffort, "kg"] })
                              ]
                            })
                          ]
                        }),
                        e.jsx("div", { className: "w-full h-2 bg-slate-800 absolute bottom-4 rounded-full" })
                      ]
                    }),

                    // Stats Output Grid
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-slate-500", children: "ទម្ងន់បន្ទុកដើម" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-slate-800", children: [leverLoad, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-amber-50 p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-amber-800", children: "កម្លាំងចលករត្រូវប្រើ" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-amber-900", children: [calcLeverEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-emerald-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-emerald-900", children: ["ចំណេញ ", leverSavings, "%"] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 3: INCLINED PLANE SIMULATOR
            n === "tab-ramp" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-lg font-moul", children: "📐 បន្ទប់ពិសោធន៍ក្លែងធ្វើប្លង់ទេរ (Inclined Plane Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "ប្រៀបធៀបកម្លាំងលើកត្រង់ធៀបនឹងកម្លាំងរុញតាមប្លង់ទេរ" })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setIsPushing(!0);
                            setPushProgress(0);
                            playTone(700, "sine", 0.3);
                            let p = 0;
                            const inv = setInterval(() => {
                              p += 10;
                              setPushProgress(p);
                              if (p >= 100) {
                                clearInterval(inv);
                                setIsPushing(!1);
                                s && s("បានរុញបន្ទុកឡើងដល់កំពូលប្លង់ទេររចនារួចរាល់!");
                              }
                            }, 120);
                          },
                          className: "px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 self-start sm:self-auto",
                          children: isPushing ? "🚀 កំពុងរុញឡើង..." : "▶️ ចាប់ផ្តើមរុញបន្ទុក"
                        })
                      ]
                    }),

                    // Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-5 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/70",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📦 ទម្ងន់បន្ទុក (Load):" }),
                                e.jsxs("span", { className: "text-emerald-800 font-extrabold text-sm", children: [planeLoad, " kg"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 20,
                              max: 200,
                              step: 20,
                              value: planeLoad,
                              onChange: (e) => setPlaneLoad(Number(e.target.value)),
                              className: "w-full accent-emerald-600 cursor-pointer"
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📏 ប្រវែងប្លង់ទេរ (Ramp Length):" }),
                                e.jsxs("span", { className: "text-emerald-800 font-extrabold text-sm", children: [rampLength, " m"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 2,
                              max: 10,
                              step: 1,
                              value: rampLength,
                              onChange: (e) => setRampLength(Number(e.target.value)),
                              className: "w-full accent-emerald-600 cursor-pointer"
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "🏔️ កម្ពស់ប្លង់ទេរ (Height):" }),
                                e.jsxs("span", { className: "text-emerald-800 font-extrabold text-sm", children: [rampHeight, " m"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 1,
                              max: 4,
                              step: 1,
                              value: rampHeight,
                              onChange: (e) => setRampHeight(Number(e.target.value)),
                              className: "w-full accent-emerald-600 cursor-pointer"
                            })
                          ]
                        })
                      ]
                    }),

                    // Canvas Visual
                    e.jsxs("div", {
                      className: "bg-slate-950 rounded-3xl p-6 text-white relative min-h-[240px] flex items-end justify-start border border-slate-800 shadow-inner overflow-hidden",
                      children: [
                        e.jsx("div", {
                          className: "w-0 h-0 border-b-[150px] border-b-emerald-800/80 border-l-[340px] border-l-transparent absolute bottom-6 right-10 shadow-xl"
                        }),
                        e.jsxs("div", {
                          className: "bg-amber-500 text-slate-950 font-extrabold text-xs px-3.5 py-2.5 rounded-2xl shadow-2xl z-20 absolute transition-all duration-300 flex items-center gap-1.5 border border-amber-300",
                          style: {
                            right: `${10 + (pushProgress * 2.8)}px`,
                            bottom: `${24 + (pushProgress * 1.2)}px`
                          },
                          children: [
                            e.jsx("span", { className: "text-lg", children: "📦" }),
                            e.jsxs("span", { children: [planeLoad, "kg"] })
                          ]
                        }),
                        e.jsx("div", { className: "w-full h-2 bg-slate-800 absolute bottom-4 rounded-full" })
                      ]
                    }),

                    // Output Stats Grid
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-rose-50 p-4 rounded-2xl border border-rose-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-rose-800", children: "លើកឡើងត្រង់" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-rose-900", children: [planeLoad, " kg (១០០%)"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-emerald-800", children: "រុញតាមប្លង់ទេរ" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-emerald-900", children: [calcPlaneEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-sky-50 p-4 rounded-2xl border border-sky-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-sky-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-sky-900", children: ["ចំណេញ ", planeSavings, "%"] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 4: PULLEY SYSTEM SIMULATOR
            n === "tab-pulley" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-lg font-moul", children: "🏗️ បន្ទប់ពិសោធន៍ក្លែងធ្វើរ៉ក (Pulley Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "ប្រៀបធៀបរ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉កលើការចំណេញកម្លាំង" })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setIsPulling(!0);
                            setPullProgress(0);
                            playTone(800, "sine", 0.3);
                            let p = 0;
                            const inv = setInterval(() => {
                              p += 10;
                              setPullProgress(p);
                              if (p >= 100) {
                                clearInterval(inv);
                                setIsPulling(!1);
                                s && s("បានទាញបន្ទុកឡើងដល់កំពូលដោយជោគជ័យ!");
                              }
                            }, 100);
                          },
                          className: "px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 self-start sm:self-auto",
                          children: isPulling ? "🪢 កំពុងទាញ..." : "▶️ ទាញខ្សែរ៉ក"
                        })
                      ]
                    }),

                    // Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-5 bg-purple-50/50 p-5 rounded-2xl border border-purple-200/70",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx("label", { className: "text-xs font-bold text-slate-800", children: "⚙️ ជ្រើសរើសប្រភេទរ៉ក ៖" }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("fixed"),
                                  className: "flex-1 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "fixed" ? "bg-purple-600 text-white border-purple-600 shadow-xs" : "bg-white text-slate-700 border-slate-200/80"),
                                  children: "រ៉កនឹង (N=1)"
                                }),
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("movable"),
                                  className: "flex-1 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "movable" ? "bg-purple-600 text-white border-purple-600 shadow-xs" : "bg-white text-slate-700 border-slate-200/80"),
                                  children: "រ៉កចល័ត (N=2)"
                                }),
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("system"),
                                  className: "flex-1 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "system" ? "bg-purple-600 text-white border-purple-600 shadow-xs" : "bg-white text-slate-700 border-slate-200/80"),
                                  children: "ប្រព័ន្ធរ៉ក (N=4)"
                                })
                              ]
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-800 flex justify-between",
                              children: [
                                e.jsx("span", { children: "🏋️ ទម្ងន់បន្ទុក (Load Weight):" }),
                                e.jsxs("span", { className: "text-purple-800 font-extrabold text-sm", children: [pulleyLoad, " kg"] })
                              ]
                            }),
                            e.jsx("input", {
                              type: "range",
                              min: 40,
                              max: 400,
                              step: 40,
                              value: pulleyLoad,
                              onChange: (e) => setPulleyLoad(Number(e.target.value)),
                              className: "w-full accent-purple-600 cursor-pointer"
                            })
                          ]
                        })
                      ]
                    }),

                    // Canvas Visual
                    e.jsxs("div", {
                      className: "bg-slate-950 rounded-3xl p-6 text-white flex items-center justify-around relative min-h-[240px] border border-slate-800 shadow-inner overflow-hidden",
                      children: [
                        e.jsxs("div", {
                          className: "flex flex-col items-center gap-2",
                          children: [
                            e.jsx("div", { className: "w-18 h-18 rounded-full border-4 border-amber-400 bg-slate-800 flex items-center justify-center text-2xl font-bold animate-spin-slow shadow-xl", children: "⚙️" }),
                            e.jsx("span", { className: "text-xs font-bold text-amber-300", children: pulleyType === "fixed" ? "រ៉កនឹង ១" : pulleyType === "movable" ? "រ៉ក ២ (ចល័ត)" : "ប្រព័ន្ធរ៉ក ៤" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-rose-600 text-white font-extrabold text-sm px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 flex items-center gap-3 border border-rose-400",
                          style: { transform: `translateY(-${pullProgress * 0.8}px)` },
                          children: [
                            e.jsx("span", { className: "text-3xl", children: "🧱" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("p", { className: "text-[10px] text-rose-200 uppercase font-bold tracking-wider", children: "បន្ទុកលើក" }),
                                e.jsxs("p", { className: "text-lg", children: [pulleyLoad, " kg"] })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // Output Stats Grid
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-slate-500", children: "ចំនួនរ៉ក (N)" }),
                            e.jsxs("p", { className: "text-base font-extrabold text-slate-800", children: [pulleyN, " រ៉ក"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-purple-50 p-4 rounded-2xl border border-purple-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-purple-800", children: "កម្លាំងចលករត្រូវទាញ" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-purple-900", children: [calcPulleyEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-xs font-bold text-emerald-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-xl font-extrabold text-emerald-900", children: ["ចំណេញ ", pulleySavings, "%"] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 5: 40 QCM QUIZ ENGINE
            n === "tab-quiz" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                !isFinished ? e.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    // Quiz Header Controls
                    e.jsxs("div", {
                      className: "bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2.5",
                          children: [
                            e.jsxs("span", {
                              className: "px-3.5 py-1.5 rounded-2xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200/80 shadow-2xs",
                              children: ["សំណួរទី ", currentQIndex + 1, " / ", activeQuestions.length]
                            }),
                            e.jsxs("span", {
                              className: "px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 shadow-2xs",
                              children: ["ពិន្ទុ ៖ ", score, " / ", activeQuestions.length]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("button", {
                              type: "button",
                              onClick: () => {
                                setShuffledQuestions(shuffleQuiz(rawQuestions));
                                setUserAnswers({});
                                setCurrentQIndex(0);
                                setIsFinished(!1);
                                playTone(440, "sine", 0.1);
                                s && s("បានច្របល់សំណួរ និងជម្រើសចម្លើយឡើងវិញ!");
                              },
                              className: "px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200/80 shadow-2xs",
                              children: "🔀 ច្របល់ចម្លើយ"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => {
                                const q = activeQuestions[currentQIndex];
                                if (!q) return;
                                const fullQuestionText = "សំណួរទី " + (currentQIndex + 1) + " ៖ " + q.question + "។ " + (q.options || []).map((opt, i) => "ជម្រើស " + String.fromCharCode(65 + i) + " ៖ " + opt.text).join("។ ");
                                toggleSpeech(fullQuestionText);
                              },
                              className: "px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-2xs " + (isSpeaking ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200/80"),
                              children: isSpeaking ? "⏹️ បញ្ឈប់ការអាន" : "🔊 អានសំណួរ & ជម្រើស"
                            })
                          ]
                        })
                      ]
                    }),

                    // Question Palette (1 to 40)
                    e.jsx("div", {
                      className: "flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1.5 no-scrollbar bg-white p-3.5 rounded-3xl border border-slate-200/90 shadow-sm",
                      children: activeQuestions.map((q, idx) => {
                        const isAnswered = userAnswers[idx] !== undefined;
                        const isCorrect = isAnswered && q.options && q.options[userAnswers[idx]] && q.options[userAnswers[idx]].isCorrect;
                        const isCurrent = idx === currentQIndex;
                        let btnStyle = "bg-slate-100 text-slate-600 border-slate-200/80";
                        if (isCurrent) {
                          btnStyle = "bg-blue-600 text-white font-extrabold ring-2 ring-blue-400 border-blue-600 shadow-xs scale-105";
                        } else if (isAnswered) {
                          btnStyle = isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600";
                        }
                        return e.jsx("button", {
                          key: idx,
                          type: "button",
                          onClick: () => { setCurrentQIndex(idx); playTone(500, "sine", 0.05); },
                          className: "w-8.5 h-8.5 rounded-xl text-xs font-bold shrink-0 transition border flex items-center justify-center cursor-pointer " + btnStyle,
                          children: idx + 1
                        }, idx);
                      })
                    }),

                    // Current Question Card
                    (() => {
                      const q = activeQuestions[currentQIndex];
                      if (!q) return null;
                      const selectedOptIdx = userAnswers[currentQIndex];
                      const isAnswered = selectedOptIdx !== undefined;

                      return e.jsxs("div", {
                        className: "bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-6",
                        children: [
                          e.jsx("h3", {
                            className: "text-sm sm:text-base font-bold text-slate-900 leading-relaxed",
                            children: q.question
                          }),

                          // Options Grid
                          e.jsx("div", {
                            className: "grid grid-cols-1 gap-3",
                            children: (q.options || []).map((opt, optIdx) => {
                              const isSelected = selectedOptIdx === optIdx;
                              let optStyle = "bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200/80";
                              if (isAnswered) {
                                if (opt.isCorrect) {
                                  optStyle = "bg-emerald-50 text-emerald-950 border-emerald-300 font-bold shadow-2xs";
                                } else if (isSelected) {
                                  optStyle = "bg-rose-50 text-rose-950 border-rose-300 font-bold shadow-2xs";
                                } else {
                                  optStyle = "bg-slate-50/50 opacity-60 text-slate-500 border-slate-200/60";
                                }
                              }

                              return e.jsxs("button", {
                                key: optIdx,
                                type: "button",
                                disabled: isAnswered,
                                onClick: () => {
                                  const newAns = { ...userAnswers, [currentQIndex]: optIdx };
                                  setUserAnswers(newAns);
                                  if (opt.isCorrect) {
                                    playTone(800, "sine", 0.2);
                                    s && s("ត្រឹមត្រូវ! 👏");
                                  } else {
                                    playTone(300, "sawtooth", 0.2);
                                    s && s("មិនទាន់ត្រឹមត្រូវទេ!");
                                  }
                                },
                                className: "p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer " + optStyle,
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3.5",
                                    children: [
                                      e.jsx("span", {
                                        className: "w-7 h-7 rounded-xl bg-slate-200/80 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs",
                                        children: String.fromCharCode(65 + optIdx)
                                      }),
                                      e.jsx("span", { className: "leading-relaxed", children: opt.text })
                                    ]
                                  }),
                                  isAnswered && opt.isCorrect && e.jsx("span", { className: "text-emerald-600 font-bold text-lg", children: "✓" }),
                                  isAnswered && isSelected && !opt.isCorrect && e.jsx("span", { className: "text-rose-600 font-bold text-lg", children: "✕" })
                                ]
                              }, optIdx);
                            })
                          }),

                          // Explanation Box
                          isAnswered && q.options[selectedOptIdx] && e.jsxs("div", {
                            className: "p-4.5 rounded-2xl text-xs space-y-1.5 bg-blue-50/90 border border-blue-200/80 text-blue-950 animate-fadeIn shadow-2xs",
                            children: [
                              e.jsx("p", { className: "font-bold text-blue-950 flex items-center gap-1.5", children: "💡 ការពន្យល់ ៖" }),
                              e.jsx("p", { className: "leading-relaxed text-blue-900/90", children: q.options[selectedOptIdx].explanation || "ចម្លើយត្រឹមត្រូវត្រូវបានកំណត់ផ្អែកលើខ្លឹមសារពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦។" })
                            ]
                          }),

                          // Prev / Next Navigation
                          e.jsxs("div", {
                            className: "flex items-center justify-between pt-3 border-t border-slate-100",
                            children: [
                              e.jsx("button", {
                                type: "button",
                                disabled: currentQIndex === 0,
                                onClick: () => { setCurrentQIndex(prev => prev - 1); playTone(500, "sine", 0.05); },
                                className: "px-4.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs disabled:opacity-40 cursor-pointer border border-slate-200/80 shadow-2xs",
                                children: "← សំណួរមុន"
                              }),
                              currentQIndex < activeQuestions.length - 1 ? e.jsx("button", {
                                type: "button",
                                onClick: () => { setCurrentQIndex(prev => prev + 1); playTone(600, "sine", 0.05); },
                                className: "px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer",
                                children: "សំណួរបន្ទាប់ →"
                              }) : e.jsx("button", {
                                type: "button",
                                onClick: () => {
                                  setIsFinished(!0);
                                  playTone(900, "sine", 0.4);
                                },
                                className: "px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer",
                                children: "🏁 បញ្ចប់ការប្រឡង"
                              })
                            ]
                          })
                        ]
                      });
                    })()
                  ]
                }) : e.jsxs("div", {
                  className: "bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-md text-center space-y-6 max-w-lg mx-auto animate-scaleUp",
                  children: [
                    e.jsx("div", { className: "w-22 h-22 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-5xl mx-auto shadow-inner ring-4 ring-emerald-50", children: "🏆" }),
                    e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsx("h3", { className: "text-xl font-bold font-moul text-slate-900", children: "លទ្ធផលការប្រឡង QCM មេរៀនទី ១៤" }),
                        e.jsx("p", { className: "text-xs text-slate-500", children: "អ្នកបានឆ្លើយសំណួរទាំង ៤០ រួចរាល់ហើយ!" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 shadow-inner",
                      children: [
                        e.jsxs("p", { className: "text-3xl font-extrabold text-emerald-600", children: [score, " / ", activeQuestions.length] }),
                        e.jsx("p", { className: "text-xs font-bold text-slate-700", children: score >= 28 ? "🎉 ឆ្នើមណាស់! អ្នកយល់ដឹងច្បាស់លើមេរៀនម៉ាស៊ីនងាយ!" : "អស្ចារ្យ! ព្យាយាមរំលឹកឡើងវិញដើម្បីទទួលបានពិន្ទុពេញ!" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex items-center justify-center gap-3 pt-2",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setUserAnswers({});
                            setCurrentQIndex(0);
                            setIsFinished(!1);
                            setShuffledQuestions(shuffleQuiz(rawQuestions));
                            playTone(500, "sine", 0.1);
                          },
                          className: "px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer",
                          children: "🔄 ប្រឡងឡើងវិញ"
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setIsFinished(!1);
                            setCurrentQIndex(0);
                          },
                          className: "px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer border border-slate-200/80",
                          children: "🔍 ពិនិត្យចម្លើយឡើងវិញ"
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
  });
};