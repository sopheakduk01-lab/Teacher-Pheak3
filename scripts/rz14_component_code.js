var Rz14 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [isSpeaking, setIsSpeaking] = y.useState(!1);
  const [soundEnabled, setSoundEnabled] = y.useState(!0);

  // Lab 1: Lever Simulator State
  const [leverType, setLeverType] = y.useState("type1"); // type1, type2, type3
  const [leverLoad, setLeverLoad] = y.useState(60); // kg
  const [leverEffortArm, setLeverEffortArm] = y.useState(3); // meters
  const [leverLoadArm, setLeverLoadArm] = y.useState(1); // meters

  // Lab 2: Inclined Plane State
  const [rampLength, setRampLength] = y.useState(4); // meters
  const [rampHeight, setRampHeight] = y.useState(2); // meters
  const [planeLoad, setPlaneLoad] = y.useState(100); // kg
  const [isPushing, setIsPushing] = y.useState(!1);
  const [pushProgress, setPushProgress] = y.useState(0);

  // Lab 3: Pulley System State
  const [pulleyType, setPulleyType] = y.useState("fixed"); // fixed (N=1), movable (N=2), system (N=4)
  const [pulleyLoad, setPulleyLoad] = y.useState(120); // kg
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

  const quizQuestions = [{"q":"តើអ្វីទៅជា 'ម៉ាស៊ីនងាយ'?","opts":[{"t":"ឧបករណ៍ដែលជួយសម្រួលដល់ការបម្លាស់ទី ឬលើកដាក់វត្ថុដោយប្រើកម្លាំងចលករតូចជាង","c":true,"e":"ម៉ាស៊ីនងាយជាឧបករណ៍ដែលជួយសម្រួលការងារ និងកាត់បន្ថយកម្លាំងចលករដែលត្រូវប្រើ។"},{"t":"ម៉ាស៊ីនដែលប្រើប្រេងឥន្ធនៈដើម្បីរត់ស្វ័យប្រវត្តិ","c":false,"e":"ម៉ាស៊ីនងាយមិនប្រើប្រេងឥន្ធនៈទេ។"},{"t":"ឧបករណ៍ដែលបង្កើនទម្ងន់វត្ថុឱ្យធ្ងន់ជាងមុន","c":false,"e":"ម៉ាស៊ីនងាយមិនបង្កើនទម្ងន់វត្ថុទេ។"},{"t":"ឧបករណ៍សម្រាប់តែការវាស់វែងប្រវែងប៉ុណ្ណោះ","c":false,"e":"មិនមែនជាឧបករណ៍វាស់វែងប្រវែងឡើយ។"}]},{"q":"តើ 'ឃ្នាស់' ជាអ្វី?","opts":[{"t":"ជាប្រភេទម៉ាស៊ីនងាយដែលធ្វើពីរុក្ខជាតិរឹងមាំ ឬលោហៈដែលចល័តជុំវិញចំណុចនឹងមួយ","c":true,"e":"ឃ្នាស់ជាម៉ាស៊ីនងាយធ្វើអំពីឈើ ឬលោហៈចល័តជុំវិញចំណុចទ្រ។"},{"t":"ជាខ្សែពួរសម្រាប់ទាញវត្ថុឡើងលើត្រង់","c":false,"e":"ខ្សែពួរមិនមែនជាឃ្នាស់ទេ។"},{"t":"ជាផ្ទៃរាបសម្រាប់រុញវត្ថុពីទីទាបទៅទីខ្ពស់","c":false,"e":"នោះជាប្លង់ទេរ។"},{"t":"ជាកង់ដែលមានចង្អូរជុំវិញ","c":false,"e":"នោះជារ៉ក។"}]},{"q":"តើចំណុចនឹង ឬអ័ក្សដែលឃ្នាស់ចល័តជុំវិញហៅថាអ្វី?","opts":[{"t":"ចំណុចទ្រ ឬអ័ក្សទ្រង់ (Fulcrum)","c":true,"e":"ចំណុចដែលឃ្នាស់វិល ឬចល័តជុំវិញហៅថា ចំណុចទ្រ។"},{"t":"កម្លាំងចលករ (Effort)","c":false,"e":"កម្លាំងចលករជាកម្លាំងដែលយើងបញ្ចេញ។"},{"t":"កម្លាំងទប់ ឬបន្ទុក (Load)","c":false,"e":"បន្ទុកជាទម្ងន់វត្ថុដែលត្រូវលើក។"},{"t":"ដៃឃ្នាស់ទប់","c":false,"e":"មិនមែនជាឈ្មោះអ័ក្សចល័តឡើយ។"}]},{"q":"តើផ្នែកសំខាន់ៗទាំង ៣ នៃឃ្នាស់មានអ្វីខ្លះ?","opts":[{"t":"កម្លាំងទប់ឬបន្ទុក, កម្លាំងចលករ, និងចំណុចទ្រ","c":true,"e":"ឃ្នាស់មានផ្នែកសំខាន់ ៣ គឺ បន្ទុក (Load), កម្លាំងចលករ (Effort) និងចំណុចទ្រ (Fulcrum)។"},{"t":"កង់, ខ្សែ, និងចង្អូរ","c":false,"e":"នោះជាផ្នែករបស់រ៉ក។"},{"t":"បន្ទះឈើ, ជើងទម្រ, និងស្វាន","c":false,"e":"មិនមែនជាផ្នែកទាំង ៣ នៃឃ្នាស់ឡើយ។"},{"t":"ប្រវែង, ផ្ទៃក្រឡា, និងមាឌ","c":false,"e":"នោះជារង្វាស់រូបវិទ្យា។"}]},{"q":"តើ 'កម្លាំងទប់ ឬបន្ទុក' ក្នុងឃ្នាស់សំដៅលើអ្វី?","opts":[{"t":"ទម្ងន់ ឬកម្លាំងទប់ទល់នៃវត្ថុដែលយើងចង់រំកិល ឬលើក","c":true,"e":"បន្ទុក ឬកម្លាំងទប់ គឺជាទម្ងន់វត្ថុដែលត្រូវលើក ឬគាស់។"},{"t":"កម្លាំងដែលមនុស្ស ឬសត្វបញ្ចេញទៅលើឃ្នាស់","c":false,"e":"នោះជាកម្លាំងចលករ។"},{"t":"ទីតាំងដែលឃ្នាស់ផ្អែកលើ","c":false,"e":"នោះជាចំណុចទ្រ។"},{"t":"ប្រវែងសរុបនៃដងឃ្នាស់","c":false,"e":"នោះជាប្រវែងដងឃ្នាស់។"}]},{"q":"តើ 'កម្លាំងចលករ' ក្នុងឃ្នាស់សំដៅលើអ្វី?","opts":[{"t":"កម្លាំងដែលយើង ឬប្រភពថាមពលបញ្ចេញទៅលើឃ្នាស់ដើម្បីធ្វើឱ្យបន្ទុកផ្លាស់ទី","c":true,"e":"កម្លាំងចលករ គឺជាកម្លាំងដែលយើងបញ្ចេញលើឃ្នាស់។"},{"t":"ទម្ងន់របស់ដងឃ្នាស់ផ្ទាល់","c":false,"e":"មិនមែនជាទម្ងន់ដងឃ្នាស់ឡើយ។"},{"t":"កម្លាំងកកិតរវាងឃ្នាស់និងដី","c":false,"e":"មិនមែនជាកម្លាំងកកិតឡើយ។"},{"t":"កម្លាំងទំនាញផែនដីលើចំណុចទ្រ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"ក្នុងការប្រើឃ្នាស់ បើប្រវែង 'ដៃឃ្នាស់ចលករ' កាន់តែវែង តើកម្លាំងចលករដែលត្រូវប្រើប្រែប្រួលដូចម្តេច?","opts":[{"t":"កាន់តែតូច (ចំណេញកម្លាំងកាន់តែច្រើន)","c":true,"e":"តាមគោលការណ៍ឃ្នាស់ បើដៃឃ្នាស់កាន់តែវែង កម្លាំងចលករកាន់តែតូច។"},{"t":"កាន់តែធំ","c":false,"e":"មិនមែនកាន់តែធំឡើយ។"},{"t":"មិនប្រែប្រួលឡើយ","c":false,"e":"កម្លាំងចលករប្រែប្រួលតាមប្រវែងដៃឃ្នាស់។"},{"t":"ស្មើនឹងសូន្យជានិច្ច","c":false,"e":"នៅតែត្រូវប្រើកម្លាំងខ្លះ។"}]},{"q":"តើការប្រើឃ្នាស់ផ្តល់សារប្រយោជន៍ចម្បងអ្វីខ្លះ?","opts":[{"t":"អនុញ្ញាតឱ្យយើងប្រើកម្លាំងចលករតូចជាងកម្លាំងទប់ឬបន្ទុក","c":true,"e":"សារប្រយោជន៍ចម្បងនៃឃ្នាស់គឺជួយឱ្យយើងប្រើកម្លាំងតូចជាងទម្ងន់បន្ទុក។"},{"t":"ធ្វើឱ្យវត្ថុមានទម្ងន់ស្រាលជាងមុនក្នុងជញ្ជីង","c":false,"e":"ឃ្នាស់មិនបាត់បង់ទម្ងន់ពិតរបស់វត្ថុទេ។"},{"t":"បាត់បង់ថាមពលទាំងស្រុង","c":false,"e":"មិនមែនឡើយ។"},{"t":"ធ្វើឱ្យវត្ថុផ្លាស់ទីដោយមិនបាច់ប្រើកម្លាំងសោះ","c":false,"e":"នៅតែត្រូវប្រើកម្លាំងចលករ។"}]},{"q":"តើគេចែកឃ្នាស់ជាប៉ុន្មានប្រភេទ?","opts":[{"t":"៣ ប្រភេទ (ប្រភេទទី ១, ប្រភេទទី ២, និងប្រភេទទី ៣)","c":true,"e":"ឃ្នាស់ចែកជា ៣ ប្រភេទផ្អែកលើទីតាំងចំណុចទ្រ បន្ទុក និងកម្លាំងចលករ។"},{"t":"២ ប្រភេទ","c":false,"e":"ឃ្នាស់មាន ៣ ប្រភេទ។"},{"t":"៤ ប្រភេទ","c":false,"e":"មិនមែន ៤ ប្រភេទឡើយ។"},{"t":"៥ ប្រភេទ","c":false,"e":"មិនមែន ៥ ប្រភេទឡើយ។"}]},{"q":"តើ 'ឃ្នាស់ប្រភេទទី ១' មានលក្ខណៈសម្គាល់ដូចម្តេច?","opts":[{"t":"ចំណុចទ្រ ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងកម្លាំងទប់ (បន្ទុក)","c":true,"e":"ឃ្នាស់ប្រភេទទី ១ មានចំណុចទ្រ (Fulcrum) នៅកណ្តាលចន្លោះចលករនិងបន្ទុក។"},{"t":"កម្លាំងទប់ ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងចំណុចទ្រ","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"កម្លាំងចលករ ស្ថិតនៅចន្លោះ កម្លាំងទប់ និងចំណុចទ្រ","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ៣។"},{"t":"គ្មានចំណុចទ្រឡើយ","c":false,"e":"ឃ្នាស់ទាំងអស់សុទ្ធតែមានចំណុចទ្រ។"}]},{"q":"តើឧបករណ៍ណាខ្លះជាឧទាហរណ៍នៃ 'ឃ្នាស់ប្រភេទទី ១'?","opts":[{"t":"កន្ត្រៃ, ថ្លឹង, និងរ៉ាស់តង់ (Seesaw)","c":true,"e":"កន្ត្រៃ ជញ្ជីងថ្លឹង និងរ៉ាស់តង់ មានចំណុចទ្រនៅកណ្តាល ដូច្នេះជាឃ្នាស់ប្រភេទទី ១។"},{"t":"រទេះរុញដៃមួយ និងប្រដាប់គាស់បុតបៀរ","c":false,"e":"ទាំងនេះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"ចង្កឹះ និងដងសន្ទូច","c":false,"e":"ទាំងនេះជាឃ្នាស់ប្រភេទទី ៣។"},{"t":"កាំបិត និងពូថៅ","c":false,"e":"ទាំងនេះជាប្លង់ទេរ។"}]},{"q":"តើ 'ឃ្នាស់ប្រភេទទី ២' មានលក្ខណៈសម្គាល់ដូចម្តេច?","opts":[{"t":"កម្លាំងទប់ឬបន្ទុក ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងចំណុចទ្រ","c":true,"e":"ឃ្នាស់ប្រភេទទី ២ មានបន្ទុក (Load) នៅកណ្តាលចន្លោះចលករនិងចំណុចទ្រ។"},{"t":"ចំណុចទ្រ ស្ថិតនៅចន្លោះ កម្លាំងចលករ និងកម្លាំងទប់","c":false,"e":"នោះជាប្រភេទទី ១។"},{"t":"កម្លាំងចលករ ស្ថិតនៅចន្លោះ កម្លាំងទប់ និងចំណុចទ្រ","c":false,"e":"នោះជាប្រភេទទី ៣។"},{"t":"កម្លាំងចលករស្មើនឹងសូន្យ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើឧបករណ៍ណាខ្លះជាឧទាហរណ៍នៃ 'ឃ្នាស់ប្រភេទទី ២'?","opts":[{"t":"រទេះរុញដៃមួយ, ប្រដាប់គាស់គម្របដប (បុតបៀរ), និងប្រដាប់កាត់ក្រដាស","c":true,"e":"រទេះរុញដៃមួយនិងប្រដាប់គាស់គម្របដបមានបន្ទុកនៅកណ្តាល ដូច្នេះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"កន្ត្រៃ និងថ្លឹង","c":false,"e":"ទាំងនេះជាប្រភេទទី ១។"},{"t":"ចង្កឹះ និងប្រដាប់ចាប់ទឹកកក","c":false,"e":"ទាំងនេះជាប្រភេទទី ៣។"},{"t":"រ៉ក និងប្លង់ទេរ","c":false,"e":"ទាំងនេះជាម៉ាស៊ីនងាយផ្សេងទៀត។"}]},{"q":"តើ 'ឃ្នាស់ប្រភេទទី ៣' មានលក្ខណៈសម្គាល់ដូចម្តេច?","opts":[{"t":"កម្លាំងចលករ ស្ថិតនៅចន្លោះ កម្លាំងទប់ឬបន្ទុក និងចំណុចទ្រ","c":true,"e":"ឃ្នាស់ប្រភេទទី ៣ មានកម្លាំងចលករ (Effort) នៅកណ្តាលចន្លោះបន្ទុកនិងចំណុចទ្រ។"},{"t":"ចំណុចទ្រ ស្ថិតនៅកណ្តាល","c":false,"e":"នោះជាប្រភេទទី ១។"},{"t":"កម្លាំងទប់ ស្ថិតនៅកណ្តាល","c":false,"e":"នោះជាប្រភេទទី ២។"},{"t":"គ្មានកម្លាំងចលករឡើយ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើឧបករណ៍ណាខ្លះជាឧទាហរណ៍នៃ 'ឃ្នាស់ប្រភេទទី ៣'?","opts":[{"t":"ចង្កឹះ, ប្រដាប់ចាប់ទឹកកក/ម្ហូប, និងដងសន្ទូច","c":true,"e":"ចង្កឹះ ប្រដាប់ចាប់ទឹកកក និងដងសន្ទូច មានកម្លាំងចលករនៅកណ្តាល ដូច្នេះជាឃ្នាស់ប្រភេទទី ៣។"},{"t":"កន្ត្រៃ និងជញ្ជីង","c":false,"e":"ទាំងនេះជាប្រភេទទី ១។"},{"t":"រទេះរុញដៃមួយ","c":false,"e":"នោះជាប្រភេទទី ២។"},{"t":"ជណ្តើរ និងរណារ","c":false,"e":"ទាំងនេះជាប្លង់ទេរ។"}]},{"q":"តើប្រដាប់កាត់ក្រចក (Nail Clipper) ប្រើប្រាស់ឃ្នាស់ប្រភេទអ្វីខ្លះរួមបញ្ចូលគ្នា?","opts":[{"t":"ឃ្នាស់ប្រភេទទី ១ និងប្រភេទទី ៣ បញ្ចូលគ្នា","c":true,"e":"ប្រដាប់កាត់ក្រចកជាឧបករណ៍រួមផ្សំរវាងឃ្នាស់ប្រភេទទី ១ (ដងកៀប) និងប្រភេទទី ៣ (មុខកាត់)។"},{"t":"ឃ្នាស់ប្រភេទទី ២ សុទ្ធសាធ","c":false,"e":"មិនមែនប្រភេទទី ២ ឡើយ។"},{"t":"ប្លង់ទេរ និងរ៉ក","c":false,"e":"មិនមែនឡើយ។"},{"t":"គ្មានឃ្នាស់ឡើយ","c":false,"e":"វាជាឃ្នាស់រួមផ្សំ។"}]},{"q":"តើ 'ប្លង់ទេរ' (Inclined Plane) ជាអ្វី?","opts":[{"t":"ជាផ្ទៃរាបមួយសម្រាប់ប្រើប្រាស់ជាទម្រក្នុងការលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់ ឬទីខ្ពស់មកទីទាប","c":true,"e":"ប្លង់ទេរជាផ្ទៃរាបទេរសម្រាប់ជួយសម្រួលការលើកដាក់វត្ថុឡើងចុះ។"},{"t":"ជាដងឈើចល័តជុំវិញអ័ក្សទ្រង់","c":false,"e":"នោះជាឃ្នាស់។"},{"t":"ជាកង់មានចង្អូរ និងខ្សែទាញ","c":false,"e":"នោះជារ៉ក។"},{"t":"ជាដងកៀបសម្រាប់ចាប់ម្ហូប","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ៣។"}]},{"q":"តើគេបញ្ចេញកម្លាំងចលករដូចម្តេច នៅពេលលើកបន្ទុកឡើងលើត្រង់ ដោយមិនប្រើប្លង់ទេរ?","opts":[{"t":"ត្រូវបញ្ចេញកម្លាំងចលករស្មើ ឬធំជាងទម្ងន់បន្ទុក","c":true,"e":"ការលើកត្រង់ឡើងលើតម្រូវឱ្យប្រើកម្លាំងស្មើ ឬធំជាងទម្ងន់បន្ទុក។"},{"t":"បញ្ចេញកម្លាំងតូចជាងទម្ងន់បន្ទុកពាក់កណ្តាល","c":false,"e":"លើកត្រង់មិនចំណេញកម្លាំងទេ។"},{"t":"មិនបាច់ប្រើកម្លាំងសោះ","c":false,"e":"មិនអាចទៅរួចឡើយ។"},{"t":"ប្រើកម្លាំងតែ ១/៤ ប៉ុណ្ណោះ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើមានអ្វីកើតឡើងចំពោះកម្លាំងចលករ នៅពេលគេរុញបន្ទុកឡើងលើតាម 'ប្លង់ទេរ'?","opts":[{"t":"កម្លាំងចលករដែលត្រូវប្រើមានទំហំតូចជាងទម្ងន់បន្ទុក","c":true,"e":"ប្លង់ទេរជួយកាត់បន្ថយកម្លាំងចលករឱ្យតូចជាងទម្ងន់បន្ទុក។"},{"t":"កម្លាំងចលករត្រូវប្រើធំជាងមុន ២ ដង","c":false,"e":"ប្លង់ទេរមិនបង្កើនកម្លាំងចលករឡើយ។"},{"t":"ទម្ងន់បន្ទុកកើនឡើង","c":false,"e":"ទម្ងន់បន្ទុកនៅដដែល។"},{"t":"មិនអាចផ្លាស់ទីបន្ទុកបានឡើយ","c":false,"e":"អាចផ្លាស់ទីបានងាយស្រួលជាង។"}]},{"q":"បើយើងរុញបន្ទុកដដែលឡើងលើតាមប្លង់ទេរដែលមាន 'ប្រវែងវែងជាងមុន' តើកម្លាំងចលករប្រែប្រួលដូចម្តេច?","opts":[{"t":"កម្លាំងចលករកាន់តែតូចជាងមុន (ចំណេញកម្លាំងកាន់តែខ្លាំង)","c":true,"e":"ប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។"},{"t":"កម្លាំងចលករកាន់តែធំ","c":false,"e":"មិនមែនឡើយ។"},{"t":"កម្លាំងចលករនៅដដែល","c":false,"e":"ប្រវែងវែងជួយកាត់បន្ថយកម្លាំង។"},{"t":"មិនបាច់ប្រើកម្លាំងសោះ","c":false,"e":"នៅតែប្រើកម្លាំងខ្លះ។"}]},{"q":"តើឧបករណ៍ណាខ្លះដែលច្នៃចេញពីគោលការណ៍ 'ប្លង់ទេរ'?","opts":[{"t":"ពូថៅ, រណារ, ពន្លាក, ផ្លែស្វាន, កាំបិត, និងជណ្តើរ","c":true,"e":"ពូថៅ កាំបិត ជណ្តើរ និងផ្លែស្វាន សុទ្ធសឹងជាឧបករណ៍ច្នៃចេញពីប្លង់ទេរ។"},{"t":"កន្ត្រៃ និងជញ្ជីងថ្លឹង","c":false,"e":"ទាំងនេះជាឃ្នាស់ប្រភេទទី ១។"},{"t":"រទេះរុញដៃមួយ","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"ទង់ជាតិ និងជណ្តើរយន្ត","c":false,"e":"ទាំងនោះប្រើរ៉ក។"}]},{"q":"ហេតុអ្វីបានជាផ្លូវឡើងភ្នំភាគច្រើនគេធ្វើជា 'ផ្លូវវង់កោងជុំវិញភ្នំ' ចជំនួសឱ្យផ្លូវឡើងត្រង់?","opts":[{"t":"ព្រោះផ្លូវវង់បង្កើនប្រវែងប្លង់ទេរ ធ្វើឱ្យរថយន្តប្រើកម្លាំងចលករតូចជាងមុនដើម្បីឡើងភ្នំ","c":true,"e":"ផ្លូវវង់កោងជាប្លង់ទេរវែង ជួយឱ្យរថយន្តឡើងភ្នំដោយប្រើកម្លាំងម៉ាស៊ីនតូចជាង។"},{"t":"ព្រោះចង់ឱ្យចំណាយពេលបើកបរយូរជាងមុន","c":false,"e":"មិនមែនជាមូលហេតុបច្ចេកទេសឡើយ។"},{"t":"ព្រោះធ្វើឱ្យរថយន្តធ្ងន់ជាងមុន","c":false,"e":"មិនមែនឡើយ។"},{"t":"ព្រោះផ្លូវត្រង់គ្មានខ្យល់អាកាសបរិសុទ្ធ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'អាប ឬកូនសោស្វាន' (Screw) មានទម្រង់ជាអ្វី?","opts":[{"t":"ជាប្លង់ទេរដែលរុំព័ទ្ធជុំវិញស៊ីឡាំង ឬស្នូលកណ្តាល","c":true,"e":"ធ្មេញអាប ឬខ្ចៅ គឺជាប្លង់ទេរដែលរុំជុំវិញអ័ក្សស៊ីឡាំង។"},{"t":"ជាឃ្នាស់ប្រភេទទី ២","c":false,"e":"មិនមែនឡើយ។"},{"t":"ជារ៉កចល័ត","c":false,"e":"មិនមែនឡើយ។"},{"t":"ជាដងសន្ទូច","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើកាំបិត និងពូថៅ ប្រើប្រាស់ប្លង់ទេររបៀបណាដើម្បីមុត ឬពុះឈើ?","opts":[{"t":"មុខកាំបិត ឬពូថៅមានរាងជាប្លង់ទេរពីរទល់ខ្នងគ្នា (Wedge) ជួយបំបែកឈើចេញពីគ្នា","c":true,"e":"មុខពូថៅមានរាងជាប្លង់ទេរទល់ខ្នងគ្នា (ត្រសាំង/Wedge) ជួយបំបែកឈើដោយប្រើកម្លាំងតូច។"},{"t":"វាប្រើរ៉កដើម្បីទាញឈើ","c":false,"e":"មិនមែនឡើយ។"},{"t":"វាបង្កើនទម្ងន់ពូថៅឱ្យធ្ងន់ជាងមុន ១០ ដង","c":false,"e":"មិនមែនឡើយ។"},{"t":"វាជាឃ្នាស់ប្រភេទទី ៣","c":false,"e":"មុខពូថៅជាប្លង់ទេរ។"}]},{"q":"តើ 'រ៉ក' (Pulley) ជាអ្វី?","opts":[{"t":"ជាកង់ធ្វើពីឈើឬលោហៈដែលមានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែ និងមានអ័ក្សកាត់តាមផ្ចិត","c":true,"e":"រ៉កជាកង់មានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែពួរ និងមានអ័ក្សកណ្តាល។"},{"t":"ជាបន្ទះឈើទេរសម្រាប់រុញទំនិញ","c":false,"e":"នោះជាប្លង់ទេរ។"},{"t":"ជាដងឈើចល័តជុំវិញចំណុចទ្រ","c":false,"e":"នោះជាឃ្នាស់។"},{"t":"ជាប្រដាប់កាត់ក្រដាស","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ២។"}]},{"q":"តើផ្នែកសំខាន់ៗនៃរ៉កមានអ្វីខ្លះ?","opts":[{"t":"សម្ពាយ, កង់, អ័ក្ស, ខ្សែ, និងចង្អូរ","c":true,"e":"ផ្នែកសំខាន់ៗនៃរ៉កមាន សម្ពាយ កង់ អ័ក្ស ខ្សែ និងចង្អូរ។"},{"t":"កម្លាំងចលករ, កម្លាំងទប់, និងចំណុចទ្រ","c":false,"e":"នោះជាផ្នែកនៃឃ្នាស់។"},{"t":"ផ្លែស្វាន, ពន្លាក, និងជណ្តើរ","c":false,"e":"នោះជាឧបករណ៍ប្លង់ទេរ។"},{"t":"ក្បាល, ដង, និងកន្ទុយ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើគេចែករ៉កជាប៉ុន្មានប្រភេទសំខាន់ៗ?","opts":[{"t":"៣ ប្រភេទ (រ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉ក)","c":true,"e":"រ៉កមាន ៣ ប្រភេទគឺ រ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉ក។"},{"t":"២ ប្រភេទ","c":false,"e":"រ៉កមាន ៣ ប្រភេទ។"},{"t":"៤ ប្រភេទ","c":false,"e":"មិនមែនឡើយ។"},{"t":"៥ ប្រភេទ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'រ៉កនឹង' (Fixed Pulley) មានលក្ខណៈសម្គាល់ដូចម្តេច?","opts":[{"t":"មានរ៉កតែមួយដែលនៅនឹងមួយកន្លែងមិនចល័តតាមបន្ទុកឡើយ","c":true,"e":"រ៉កនឹង ជាំរ៉កតែមួយដែលភ្ជាប់នឹងកន្លែង (ដូចជាកំពូលដងទង់ជាតិ)។"},{"t":"រ៉កផ្លាស់ទីឡើងលើចុះក្រោមតាមបន្ទុក","c":false,"e":"នោះជារ៉កចល័ត។"},{"t":"មានរ៉កចាប់ពី ៤ ឡើងទៅ","c":false,"e":"នោះជាប្រព័ន្ធរ៉ក។"},{"t":"គ្មានខ្សែពួរឡើយ","c":false,"e":"រ៉កទាំងអស់ត្រូវមានខ្សែ។"}]},{"q":"តើ 'រ៉កចល័ត' (Movable Pulley) ផ្តុំឡើងពីរ៉កចំនួនប៉ុន្មាន?","opts":[{"t":"ផ្តុំឡើងពីរ៉កចំនួន ២ (រ៉កនឹងមួយ និងរ៉កចល័តមួយ)","c":true,"e":"រ៉កចល័តមានរ៉ក ២ គឺរ៉កនឹងមួយនិងរ៉កចល័តមួយដែលផ្លាស់ទីជាមួយបន្ទុក។"},{"t":"មានរ៉កនឹងតែ ១ ប៉ុណ្ណោះ","c":false,"e":"នោះជារ៉កនឹង។"},{"t":"មានរ៉កចំនួន ៤ ឡើងទៅ","c":false,"e":"នោះជាប្រព័ន្ធរ៉ក។"},{"t":"គ្មានរ៉កសោះ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'ប្រព័ន្ធរ៉ក' (Pulley System) ផ្តុំឡើងពីរ៉កចំនួនប៉ុន្មាន?","opts":[{"t":"ផ្តុំឡើងពីរ៉កចំនួន ៤ ឡើងទៅ (រ៉កនឹង និងរ៉កចល័តច្រើនបញ្ចូលគ្នា)","c":true,"e":"ប្រព័ន្ធរ៉កមានរ៉កចាប់ពី ៤ ឡើងទៅ ដើម្បីបង្កើនលទ្ធភាពលើកបន្ទុកធ្ងន់ៗ។"},{"t":"មានរ៉កតែ ១ ប៉ុណ្ណោះ","c":false,"e":"នោះជារ៉កនឹង។"},{"t":"មានរ៉កចំនួន ២","c":false,"e":"នោះជារ៉កចល័ត។"},{"t":"មានរ៉កតែ ៣ ប៉ុណ្ណោះ","c":false,"e":"ប្រព័ន្ធរ៉កជាទូទៅមាន ៤ ឡើងទៅ។"}]},{"q":"តើឧបករណ៍ណាក្នុងជីវភាពរស់នៅដែលប្រើប្រាស់ 'រ៉កនឹង'?","opts":[{"t":"ដងទង់ជាតិ និងរ៉ករែកទឹកអណ្ដូង","c":true,"e":"ដងទង់ជាតិ និងរ៉កអណ្ដូងទឹក ប្រើរ៉កនឹងដើម្បីប្តូរទិសដៅកម្លាំងទាញ។"},{"t":"រទេះរុញដៃមួយ","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ២។"},{"t":"កន្ត្រៃកាត់សក់","c":false,"e":"នោះជាឃ្នាស់ប្រភេទទី ១។"},{"t":"ផ្លែស្វាន","c":false,"e":"នោះជាប្លង់ទេរ។"}]},{"q":"តើស្ទូចយន្ត ឬក្រេនលើកទំនិញធ្ងន់ៗនៅកំពង់ផែ ប្រើប្រាស់រ៉កប្រភេទអ្វី?","opts":[{"t":"ប្រព័ន្ធរ៉ក (Pulley System) ដែលមានរ៉កច្រើនបញ្ចូលគ្នា","c":true,"e":"ស្ទូចយន្តប្រើប្រព័ន្ធរ៉កដើម្បីលើកកុងតឺន័រ ឬទំនិញរាប់តោនដោយប្រើកម្លាំងម៉ាស៊ីនតូច។"},{"t":"រ៉កនឹងតែមួយប៉ុណ្ណោះ","c":false,"e":"រ៉កនឹងមិនចំណេញកម្លាំងសម្រាប់លើកទំនិញរាប់តោនទេ។"},{"t":"ឃ្នាស់ប្រភេទទី ៣","c":false,"e":"មិនមែនឡើយ។"},{"t":"ប្លង់ទេរ","c":false,"e":"ស្ទូចយន្តប្រើប្រព័ន្ធរ៉ក។"}]},{"q":"នៅពេលប្រើ 'រ៉កនឹង' តើកម្លាំងចលករដែលត្រូវទាញខ្សែចុះមានទំហំស្មើនឹងអ្វី?","opts":[{"t":"ស្មើនឹងទម្ងន់បន្ទុកដែលត្រូវយោងឡើងទៅលើ (កម្លាំងចលករ = ទម្ងន់បន្ទុក)","c":true,"e":"រ៉កនឹងមិនចំណេញកម្លាំងទេ គឺកម្លាំងចលករស្មើទម្ងន់បន្ទុក (N=1)។"},{"t":"ស្មើនឹងពាក់កណ្តាលនៃទម្ងន់បន្ទុក","c":false,"e":"នោះជារ៉កចល័ត។"},{"t":"ស្មើនឹង ១/៤ នៃទម្ងន់បន្ទុក","c":false,"e":"នោះជាប្រព័ន្ធរ៉ក N=4។"},{"t":"ស្មើនឹងសូន្យ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើ 'រ៉កនឹង' មានសារប្រយោជន៍ចម្បងអ្វី បើវាមិនចំណេញកម្លាំងចលករ?","opts":[{"t":"ជួយប្តូរទិសដៅនៃកម្លាំង (ទាញខ្សែចុះក្រោម ដើម្បីឱ្យបន្ទុកឡើងទៅលើ)","c":true,"e":"រ៉កនឹងជួយសម្រួលទិសដៅកម្លាំងទាញ ធ្វើឱ្យងាយស្រួលទាញចុះក្រោមតាមទំនាញផែនដី។"},{"t":"កាត់បន្ថយទម្ងន់បន្ទុកឱ្យស្រាលជាងមុន ៥០%","c":false,"e":"រ៉កនឹងមិនកាត់បន្ថយកម្លាំងទេ។"},{"t":"ធ្វើឱ្យបន្ទុកបាត់បង់ម៉ាស","c":false,"e":"ម៉ាសនៅដដែល។"},{"t":"បង្កើនល្បឿនផ្លាស់ទី ១០ ដង","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"នៅពេលប្រើ 'រ៉កចល័ត' (មានរ៉ក ២) តើកម្លាំងចលករដែលត្រូវទាញខ្សែចុះមានទំហំស្មើនឹងអ្វី?","opts":[{"t":"ស្មើនឹងពាក់កណ្តាលនៃទម្ងន់បន្ទុក (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ២)","c":true,"e":"រ៉កចល័ត (N=2) ជួយកាត់បន្ថយកម្លាំងចលករមកត្រឹមពាក់កណ្តាល (ចំណេញកម្លាំង ២ ដង)។"},{"t":"ស្មើនឹងទម្ងន់បន្ទុកទាំងស្រុង","c":false,"e":"នោះជារ៉កនឹង។"},{"t":"ស្មើនឹង ១/៤ នៃទម្ងន់បន្ទុក","c":false,"e":"នោះជាប្រព័ន្ធរ៉ក N=4។"},{"t":"ស្មើនឹង ២ ដងនៃទម្ងន់បន្ទុក","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"បើគេចង់លើកបន្ទុកទម្ងន់ 100 ញូតុន (N) ដោយប្រើ 'រ៉កចល័ត' (N=2) តើគេត្រូវប្រើកម្លាំងចលករប្រមាណប៉ុន្មាន?","opts":[{"t":"50 ញូតុន (N)","c":true,"e":"កម្លាំងចលករ = 100 / 2 = 50 ញូតុន។"},{"t":"100 ញូតុន (N)","c":false,"e":"100 N ជាកម្លាំងសម្រាប់រ៉កនឹង។"},{"t":"25 ញូតុន (N)","c":false,"e":"25 N ជាកម្លាំងសម្រាប់ប្រព័ន្ធរ៉ក N=4។"},{"t":"200 ញូតុន (N)","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"នៅពេលប្រើ 'ប្រព័ន្ធរ៉ក' (ដែលមានរ៉កចំនួន ៤) តើកម្លាំងចលករស្មើនឹងប៉ុន្មាននៃទម្ងន់បន្ទុក?","opts":[{"t":"ស្មើនឹងមួយភាគបួននៃទម្ងន់បន្ទុក (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ៤)","c":true,"e":"ប្រព័ន្ធរ៉ក N=4 ជួយចំណេញកម្លាំងចលករ ៤ ដង (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ៤)។"},{"t":"ស្មើនឹងពាក់កណ្តាលនៃទម្ងន់បន្ទុក","c":false,"e":"នោះជារ៉កចល័ត N=2។"},{"t":"ស្មើនឹងទម្ងន់បន្ទុកទាំងស្រុង","c":false,"e":"នោះជារ៉កនឹង N=1។"},{"t":"ស្មើនឹង ៤ ដងនៃទម្ងន់បន្ទុក","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"បើគេចង់លើកបន្ទុកធ្ងន់ទម្ងន់ 400 គីឡូក្រាម ដោយប្រើ 'ប្រព័ន្ធរ៉ក' (N=4) តើគេត្រូវប្រើកម្លាំងចលករធៀបនឹងទម្ងន់ប៉ុន្មាន?","opts":[{"t":"ស្មើនឹងទម្ងន់ 100 គីឡូក្រាម (ចំណេញកម្លាំង ៤ ដង)","c":true,"e":"កម្លាំងចលករ = 400 / 4 = 100 គីឡូក្រាម។"},{"t":"ស្មើនឹងទម្ងន់ 200 គីឡូក្រាម","c":false,"e":"200kg សម្រាប់រ៉ក ២។"},{"t":"ស្មើនឹងទម្ងន់ 400 គីឡូក្រាម","c":false,"e":"400kg សម្រាប់រ៉ក ១។"},{"t":"ស្មើនឹងទម្ងន់ 50 គីឡូក្រាម","c":false,"e":"50kg សម្រាប់រ៉ក ៨។"}]},{"q":"តើការប្រើរ៉កចល័ត និងប្រព័ន្ធរ៉ក ផ្តល់ចំណេញ និងប្រែប្រួលអ្វីខ្លះដល់អ្នកប្រើប្រាស់?","opts":[{"t":"ចំណេញកម្លាំងចលករ, ប្រែប្រួលទិសដៅនៃកម្លាំង, និងសម្រួលល្បឿនការងារ","c":true,"e":"រ៉កចល័តនិងប្រព័ន្ធរ៉កជួយចំណេញកម្លាំង ប្តូរទិស និងសម្រួលល្បឿនលើកបន្ទុក។"},{"t":"ខាតបង់កម្លាំងចលករ ២ ដង","c":false,"e":"មិនមែនឡើយ។"},{"t":"ធ្វើឱ្យបន្ទុកកើនទម្ងន់","c":false,"e":"មិនមែនឡើយ។"},{"t":"គ្មានសារប្រយោជន៍អ្វីឡើយ","c":false,"e":"មិនមែនឡើយ។"}]},{"q":"តើគោលការណ៍រួមនៃម៉ាស៊ីនងាយទាំងអស់ (ឃ្នាស់, ប្លង់ទេរ, និងរ៉ក) គឺបង្កើតឡើងដើម្បីអ្វី?","opts":[{"t":"សម្រួលការងារ និងកាត់បន្ថយកម្លាំងចលករដែលមនុស្សត្រូវបញ្ចេញក្នុងការលើក ឬផ្លាស់ទីបន្ទុក","c":true,"e":"គោលបំណងចម្បងនៃម៉ាស៊ីនងាយទាំងអស់គឺកាត់បន្ថយកម្លាំងចលករ និងសម្រួលការងារមនុស្ស។"},{"t":"បង្កើតថាមពលអគ្គិសនីពីខ្យល់","c":false,"e":"នោះជាត័រប៊ីនខ្យល់។"},{"t":"វាស់សីតុណ្ហភាពអាកាសធាតុ","c":false,"e":"នោះជាទែម៉ូម៉ែត្រ។"},{"t":"បំបែកបរមាណូគីមី","c":false,"e":"មិនមែនឡើយ។"}]}];

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffleQuiz = (list) => list.map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }));

  const [shuffledQuestions, setShuffledQuestions] = y.useState(() => shuffleQuiz(quizQuestions));

  const score = Object.keys(userAnswers).reduce((acc, qIdx) => {
    const q = (shuffledQuestions || quizQuestions)[qIdx];
    if (q && q.options[userAnswers[qIdx]] && q.options[userAnswers[qIdx]].isCorrect) {
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
    className: "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn",
    children: e.jsxs("div", {
      className: "bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-800",
      children: [
        // Header
        e.jsxs("div", {
          className: "bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-4 sm:p-5 text-white flex items-center justify-between shadow-md relative overflow-hidden shrink-0",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3 z-10",
              children: [
                e.jsx("div", {
                  className: "w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-inner",
                  children: "⚙️"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", {
                      className: "text-base sm:text-xl font-bold font-moul text-white drop-shadow-xs line-clamp-1",
                      children: "មេរៀនទី ១៤ ៖ ម៉ាស៊ីនងាយ (Simple Machines)"
                    }),
                    e.jsx("p", {
                      className: "text-[10px] sm:text-xs text-sky-100 font-bold opacity-95",
                      children: "ជំពូកទី ៤ • វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ឃ្នាស់ ប្លង់ទេរ និងរ៉ក • ៤០ សំណួរ QCM"
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
                  className: "px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border " + (isSpeaking ? "bg-amber-400 text-slate-900 border-amber-500 animate-pulse shadow-md" : "bg-white/20 text-white border-white/30 hover:bg-white/30"),
                  title: "ស្ដាប់ការពន្យល់ចំណុចគន្លឹះមេរៀន",
                  children: isSpeaking ? "⏹️ បញ្ឈប់ការស្ដាប់ពន្យល់" : "🎧 ស្តាប់ពន្យល់ចំណុចសំខាន់ៗ"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: () => {
                    setSoundEnabled(!soundEnabled);
                    playTone(600, "sine", 0.1);
                  },
                  className: "w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition border border-white/30 cursor-pointer",
                  title: soundEnabled ? "បិទសំឡេង" : "បើកសំឡេង",
                  children: soundEnabled ? "🔔" : "🔕"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: t,
                  className: "w-9 h-9 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center transition border border-rose-400/40 cursor-pointer font-bold",
                  children: "✕"
                })
              ]
            })
          ]
        }),

        // Tab Navigation Bar
        e.jsx("div", {
          className: "bg-slate-100 border-b border-slate-200 p-2 overflow-x-auto no-scrollbar shrink-0",
          children: e.jsxs("div", {
            className: "flex items-center gap-1.5 min-w-max",
            children: [
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-hero"); playTone(500); },
                className: "px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer " + (n === "tab-hero" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"),
                children: "📖 ១. មេរៀនសង្ខេប"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-lever"); playTone(520); },
                className: "px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer " + (n === "tab-lever" ? "bg-amber-600 text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"),
                children: "⚖️ ២. ក្លែងធ្វើឃ្នាស់"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-ramp"); playTone(540); },
                className: "px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer " + (n === "tab-ramp" ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"),
                children: "📐 ៣. ក្លែងធ្វើប្លង់ទេរ"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-pulley"); playTone(560); },
                className: "px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer " + (n === "tab-pulley" ? "bg-purple-600 text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"),
                children: "🏗️ ៤. ក្លែងធ្វើរ៉ក"
              }),
              e.jsx("button", {
                type: "button",
                onClick: () => { i("tab-quiz"); playTone(600); },
                className: "px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer " + (n === "tab-quiz" ? "bg-rose-600 text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"),
                children: "🎯 ៥. តេស្ត QCM (៤០)"
              })
            ]
          })
        }),

        // Tab Content Body
        e.jsx("div", {
          className: "p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-6",
          children: [
            // TAB 1: HERO LESSON SUMMARY
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Banner
                e.jsxs("div", {
                  className: "bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-2 max-w-xl",
                      children: [
                        e.jsx("span", {
                          className: "px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold inline-block",
                          children: "មេរៀនទី ១៤ • វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"
                        }),
                        e.jsx("h1", {
                          className: "text-lg sm:text-2xl font-bold text-slate-900 font-moul",
                          children: "ម៉ាស៊ីនងាយ (Simple Machines)"
                        }),
                        e.jsx("p", {
                          className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
                          children: "ម៉ាស៊ីនងាយ គឺជាឧបករណ៍ដែលជួយសម្រួលដល់ការលើក គាស់ ឬរំកិលវត្ថុធ្ងន់ៗដោយប្រើប្រាស់កម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។ ម៉ាស៊ីនងាយចម្បងរួមមាន ឃ្នាស់, ប្លង់ទេរ, និងរ៉ក។"
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex items-center gap-3 shrink-0",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-lever"); playTone(500); },
                          className: "px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5",
                          children: "⚙️ ពិសោធន៍ម៉ាស៊ីនងាយ"
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-quiz"); playTone(600); },
                          className: "px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5",
                          children: "📝 ប្រឡង QCM ៤០ សំណួរ"
                        })
                      ]
                    })
                  ]
                }),

                // 3 Simple Machines Grid
                e.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                  children: [
                    // Card 1: ឃ្នាស់ (Levers)
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition space-y-3 flex flex-col justify-between",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("span", { className: "text-3xl", children: "⚖️" }),
                                e.jsx("span", { className: "px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200", children: "១. ឃ្នាស់ (Lever)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-800 text-base font-moul", children: "១. ឃ្នាស់" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ជាឧបករណ៍ធ្វើពីរុក្ខជាតិរឹងមាំ ឬលោហៈចល័តជុំវិញចំណុចទ្រ។ មាន ៣ ផ្នែកសំខាន់ ៖ កម្លាំងចលករ, កម្លាំងទប់ (បន្ទុក), និងចំណុចទ្រ។" }),
                            e.jsxs("div", {
                              className: "bg-amber-50/60 p-3 rounded-xl border border-amber-100 space-y-1.5 text-xs text-amber-900 font-medium",
                              children: [
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
                          className: "w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition cursor-pointer text-center",
                          children: "ពិសោធន៍ឃ្នាស់ ៣ ប្រភេទ →"
                        })
                      ]
                    }),

                    // Card 2: ប្លង់ទេរ (Inclined Plane)
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-3 flex flex-col justify-between",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("span", { className: "text-3xl", children: "📐" }),
                                e.jsx("span", { className: "px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200", children: "២. ប្លង់ទេរ (Ramp)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-800 text-base font-moul", children: "២. ប្លង់ទេរ" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ជាផ្ទៃរាបទេរសម្រាប់ជួយលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់។ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករដែលត្រូវប្រើកាន់តែតូច។" }),
                            e.jsxs("div", {
                              className: "bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-1.5 text-xs text-emerald-900 font-medium",
                              children: [
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
                          className: "w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition cursor-pointer text-center",
                          children: "ពិសោធន៍ប្លង់ទេរ និងមុំទេរ →"
                        })
                      ]
                    }),

                    // Card 3: រ៉ក (Pulleys)
                    e.jsxs("div", {
                      className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition space-y-3 flex flex-col justify-between",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between",
                              children: [
                                e.jsx("span", { className: "text-3xl", children: "🏗️" }),
                                e.jsx("span", { className: "px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-[11px] border border-purple-200", children: "៣. រ៉ក (Pulley)" })
                              ]
                            }),
                            e.jsx("h3", { className: "font-bold text-slate-800 text-base font-moul", children: "៣. រ៉ក" }),
                            e.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "ជាកង់មានចង្អូរ និងខ្សែសម្រាប់លើកបន្ទុក។ ចែកជា ៣ ប្រភេទ ៖ រ៉កនឹង (N=1), រ៉កចល័ត (N=2), និងប្រព័ន្ធរ៉ក (N=4)។" }),
                            e.jsxs("div", {
                              className: "bg-purple-50/60 p-3 rounded-xl border border-purple-100 space-y-1.5 text-xs text-purple-900 font-medium",
                              children: [
                                e.jsx("p", { children: "• រ៉កនឹង (N=1) ៖ កម្លាំង = បន្ទុក (ប្តូរទិសកម្លាំង)" }),
                                e.jsx("p", { children: "• រ៉កចល័ត (N=2) ៖ កម្លាំង = បន្ទុក / ២ (ចំណេញ ៥០%)" }),
                                e.jsx("p", { children: "• ប្រព័ន្ធរ៉ក (N=4) ៖ កម្លាំង = បន្ទុក / ៤ (ចំណេញ ៧៥%)" })
                              ]
                            })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => { i("tab-pulley"); playTone(560); },
                          className: "w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition cursor-pointer text-center",
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
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "⚖️ បន្ទប់ពិសោធន៍ក្លែងធ្វើឃ្នាស់ (Lever Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500", children: "ជ្រើសរើសប្រភេទឃ្នាស់ កំណត់ទម្ងន់បន្ទុក និងប្រវែងដៃឃ្នាស់ដើម្បីសង្កេតកម្លាំងចលករ" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type1"),
                              className: "px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition border " + (leverType === "type1" ? "bg-amber-600 text-white border-amber-600" : "bg-slate-100 text-slate-700 border-slate-200"),
                              children: "ប្រភេទទី ១ (កន្ត្រៃ)"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type2"),
                              className: "px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition border " + (leverType === "type2" ? "bg-amber-600 text-white border-amber-600" : "bg-slate-100 text-slate-700 border-slate-200"),
                              children: "ប្រភេទទី ២ (រទេះរុញ)"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => setLeverType("type3"),
                              className: "px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition border " + (leverType === "type3" ? "bg-amber-600 text-white border-amber-600" : "bg-slate-100 text-slate-700 border-slate-200"),
                              children: "ប្រភេទទី ៣ (ចង្កឹះ)"
                            })
                          ]
                        })
                      ]
                    }),

                    // Interactive Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-4 bg-amber-50/40 p-4 rounded-xl border border-amber-200/60",
                      children: [
                        // Control 1: Load Weight
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-700 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📦 ទម្ងន់បន្ទុក (Load):" }),
                                e.jsxs("span", { className: "text-amber-700 font-extrabold", children: [leverLoad, " kg"] })
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

                        // Control 2: Effort Arm Length
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-700 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📏 ប្រវែងដៃចលករ (Effort Arm):" }),
                                e.jsxs("span", { className: "text-amber-700 font-extrabold", children: [leverEffortArm, " m"] })
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

                        // Control 3: Load Arm Length
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-700 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📐 ប្រវែងដៃបន្ទុក (Load Arm):" }),
                                e.jsxs("span", { className: "text-amber-700 font-extrabold", children: [leverLoadArm, " m"] })
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

                    // Live Animation Beam Canvas
                    e.jsxs("div", {
                      className: "bg-slate-900 rounded-2xl p-6 text-white flex flex-col items-center justify-center relative min-h-[220px] overflow-hidden border border-slate-800",
                      children: [
                        // Fulcrum Tri
                        e.jsx("div", {
                          className: "w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-b-amber-500 absolute bottom-6 z-10 drop-shadow-md",
                          style: { left: "50%", transform: "translateX(-50%)" }
                        }),
                        // Beam Bar
                        e.jsxs("div", {
                          className: "w-[80%] h-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-full absolute bottom-[65px] z-20 shadow-lg flex items-center justify-between px-4 transition-transform duration-500",
                          style: { transform: "rotate(-2deg)" },
                          children: [
                            // Left Weight (Load)
                            e.jsxs("div", {
                              className: "bg-rose-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md -translate-y-8 flex items-center gap-1 animate-bounce",
                              children: [
                                e.jsx("span", { children: "📦 បន្ទុក" }),
                                e.jsxs("span", { className: "text-yellow-300 font-extrabold", children: [leverLoad, "kg"] })
                              ]
                            }),
                            // Center Label
                            e.jsx("div", {
                              className: "bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/40",
                              children: leverType === "type1" ? "ចំណុចទ្រកណ្តាល" : leverType === "type2" ? "បន្ទុកកណ្តាល" : "ចលករកណ្តាល"
                            }),
                            // Right Push (Effort)
                            e.jsxs("div", {
                              className: "bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md -translate-y-8 flex items-center gap-1",
                              children: [
                                e.jsx("span", { children: "💪 កម្លាំងចលករ" }),
                                e.jsxs("span", { className: "text-emerald-200 font-extrabold", children: [calcLeverEffort, "kg"] })
                              ]
                            })
                          ]
                        }),
                        // Base Floor
                        e.jsx("div", { className: "w-full h-2 bg-slate-800 absolute bottom-4 rounded-full" })
                      ]
                    }),

                    // Results Gauge Box
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-slate-500", children: "ទម្ងន់បន្ទុកដើម" }),
                            e.jsxs("p", { className: "text-base font-extrabold text-slate-800", children: [leverLoad, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-amber-800", children: "កម្លាំងចលករត្រូវប្រើ" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-amber-900", children: [calcLeverEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-emerald-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-emerald-900", children: ["ចំណេញ ", leverSavings, "%"] })
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
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "📐 បន្ទប់ពិសោធន៍ក្លែងធ្វើប្លង់ទេរ (Inclined Plane Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500", children: "ប្រៀបធៀបកម្លាំងលើកត្រង់ធៀបនឹងកម្លាំងរុញតាមប្លង់ទេរ" })
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
                          className: "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-2 self-start sm:self-auto",
                          children: isPushing ? "🚀 កំពុងរុញឡើង..." : "▶️ ចាប់ផ្តើមរុញបន្ទុក"
                        })
                      ]
                    }),

                    // Controls
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/60",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-700 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📦 ទម្ងន់បន្ទុក (Load):" }),
                                e.jsxs("span", { className: "text-emerald-700 font-extrabold", children: [planeLoad, " kg"] })
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
                          className: "space-y-1.5",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-700 flex justify-between",
                              children: [
                                e.jsx("span", { children: "📏 ប្រវែងប្លង់ទេរ (Ramp Length):" }),
                                e.jsxs("span", { className: "text-emerald-700 font-extrabold", children: [rampLength, " m"] })
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
                          className: "space-y-1.5",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-700 flex justify-between",
                              children: [
                                e.jsx("span", { children: "🏔️ កម្ពស់ប្លង់ទេរ (Height):" }),
                                e.jsxs("span", { className: "text-emerald-700 font-extrabold", children: [rampHeight, " m"] })
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

                    // Ramp Visual Canvas
                    e.jsxs("div", {
                      className: "bg-slate-900 rounded-2xl p-6 text-white relative min-h-[220px] flex items-end justify-start border border-slate-800 overflow-hidden",
                      children: [
                        // Triangular Ramp
                        e.jsx("div", {
                          className: "w-0 h-0 border-b-[140px] border-b-emerald-800/80 border-l-[320px] border-l-transparent absolute bottom-6 right-10 shadow-lg"
                        }),
                        // Moving Box
                        e.jsxs("div", {
                          className: "bg-amber-500 text-slate-900 font-extrabold text-xs px-3 py-2 rounded-xl shadow-xl z-20 absolute transition-all duration-300 flex items-center gap-1 border border-amber-300",
                          style: {
                            right: `${10 + (pushProgress * 2.8)}px`,
                            bottom: `${24 + (pushProgress * 1.2)}px`
                          },
                          children: [
                            e.jsx("span", { children: "📦" }),
                            e.jsxs("span", { children: [planeLoad, "kg"] })
                          ]
                        }),
                        // Ground
                        e.jsx("div", { className: "w-full h-2 bg-slate-800 absolute bottom-4 rounded-full" })
                      ]
                    }),

                    // Stats Breakdown
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-rose-50 p-3 rounded-xl border border-rose-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-rose-800", children: "លើកឡើងត្រង់" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-rose-900", children: [planeLoad, " kg (១០០%)"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-emerald-800", children: "រុញតាមប្លង់ទេរ" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-emerald-900", children: [calcPlaneEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-sky-50 p-3 rounded-xl border border-sky-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-sky-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-sky-900", children: ["ចំណេញ ", planeSavings, "%"] })
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
                  className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h3", { className: "font-bold text-slate-900 text-base font-moul", children: "🏗️ បន្ទប់ពិសោធន៍ក្លែងធ្វើរ៉ក (Pulley Simulator)" }),
                            e.jsx("p", { className: "text-xs text-slate-500", children: "ប្រៀបធៀបរ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉កលើការចំណេញកម្លាំង" })
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
                          className: "px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-2 self-start sm:self-auto",
                          children: isPulling ? "🪢 កំពុងទាញ..." : "▶️ ទាញខ្សែរ៉ក"
                        })
                      ]
                    }),

                    // Selection & Weight Slider
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50/40 p-4 rounded-xl border border-purple-200/60",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsx("label", { className: "text-xs font-bold text-slate-700", children: "⚙️ ជ្រើសរើសប្រភេទរ៉ក ៖" }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("fixed"),
                                  className: "flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "fixed" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-slate-700 border-slate-200"),
                                  children: "រ៉កនឹង (N=1)"
                                }),
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("movable"),
                                  className: "flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "movable" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-slate-700 border-slate-200"),
                                  children: "រ៉កចល័ត (N=2)"
                                }),
                                e.jsx("button", {
                                  type: "button",
                                  onClick: () => setPulleyType("system"),
                                  className: "flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition border " + (pulleyType === "system" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-slate-700 border-slate-200"),
                                  children: "ប្រព័ន្ធរ៉ក (N=4)"
                                })
                              ]
                            })
                          ]
                        }),

                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsxs("label", {
                              className: "text-xs font-bold text-slate-700 flex justify-between",
                              children: [
                                e.jsx("span", { children: "🏋️ ទម្ងន់បន្ទុក (Load Weight):" }),
                                e.jsxs("span", { className: "text-purple-700 font-extrabold", children: [pulleyLoad, " kg"] })
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
                      className: "bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-around relative min-h-[220px] border border-slate-800 overflow-hidden",
                      children: [
                        // Pulley Wheel Visual
                        e.jsxs("div", {
                          className: "flex flex-col items-center gap-2",
                          children: [
                            e.jsx("div", { className: "w-16 h-16 rounded-full border-4 border-amber-400 bg-slate-800 flex items-center justify-center text-xl font-bold animate-spin-slow shadow-lg", children: "⚙️" }),
                            e.jsx("span", { className: "text-[11px] font-bold text-amber-300", children: pulleyType === "fixed" ? "រ៉កនឹង ១" : pulleyType === "movable" ? "រ៉ក ២ (ចល័ត)" : "ប្រព័ន្ធរ៉ក ៤" })
                          ]
                        }),
                        // Hanging Weight Box
                        e.jsxs("div", {
                          className: "bg-rose-600 text-white font-extrabold text-sm px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-2 border border-rose-400",
                          style: { transform: `translateY(-${pullProgress * 0.8}px)` },
                          children: [
                            e.jsx("span", { className: "text-2xl", children: "🧱" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("p", { className: "text-[10px] text-rose-200", children: "បន្ទុកលើក" }),
                                e.jsxs("p", { children: [pulleyLoad, " kg"] })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // Calculations Output
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-center",
                      children: [
                        e.jsxs("div", {
                          className: "bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-slate-500", children: "ចំនួនរ៉ក (N)" }),
                            e.jsxs("p", { className: "text-base font-extrabold text-slate-800", children: [pulleyN, " រ៉ក"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-purple-50 p-3 rounded-xl border border-purple-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-purple-800", children: "កម្លាំងចលករត្រូវទាញ" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-purple-900", children: [calcPulleyEffort, " kg"] })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-2xs space-y-1",
                          children: [
                            e.jsx("p", { className: "text-[11px] font-bold text-emerald-800", children: "កម្រិតចំណេញកម្លាំង" }),
                            e.jsxs("p", { className: "text-lg font-extrabold text-emerald-900", children: ["ចំណេញ ", pulleySavings, "%"] })
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
                      className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsxs("span", {
                              className: "px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200",
                              children: ["សំណួរទី ", currentQIndex + 1, " / ", (shuffledQuestions || quizQuestions).length]
                            }),
                            e.jsxs("span", {
                              className: "px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200",
                              children: ["ពិន្ទុ ៖ ", score, " / ", (shuffledQuestions || quizQuestions).length]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("button", {
                              type: "button",
                              onClick: () => {
                                setShuffledQuestions(shuffleQuiz(quizQuestions));
                                setUserAnswers({});
                                setCurrentQIndex(0);
                                setIsFinished(!1);
                                playTone(440, "sine", 0.1);
                                s && s("បានច្របល់សំណួរ និងជម្រើសចម្លើយឡើងវិញ!");
                              },
                              className: "px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200",
                              children: "🔀 ច្របល់ចម្លើយ"
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => {
                                const q = (shuffledQuestions || quizQuestions)[currentQIndex];
                                const fullQuestionText = "សំណួរទី " + (currentQIndex + 1) + " ៖ " + q.question + "។ " + (q.options || []).map((opt, i) => "ជម្រើស " + String.fromCharCode(65 + i) + " ៖ " + opt.text).join("។ ");
                                toggleSpeech(fullQuestionText);
                              },
                              className: "px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border " + (isSpeaking ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"),
                              children: isSpeaking ? "⏹️ បញ្ឈប់ការអាន" : "🔊 អានសំណួរ & ជម្រើស"
                            })
                          ]
                        })
                      ]
                    }),

                    // Question Palette (1 to 40)
                    e.jsx("div", {
                      className: "flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar bg-white p-3 rounded-2xl border border-slate-200 shadow-xs",
                      children: (shuffledQuestions || quizQuestions).map((q, idx) => {
                        const isAnswered = userAnswers[idx] !== undefined;
                        const isCorrect = isAnswered && q.options[userAnswers[idx]] && q.options[userAnswers[idx]].isCorrect;
                        const isCurrent = idx === currentQIndex;
                        let btnStyle = "bg-slate-100 text-slate-600 border-slate-200";
                        if (isCurrent) {
                          btnStyle = "bg-blue-600 text-white font-extrabold ring-2 ring-blue-400 border-blue-600";
                        } else if (isAnswered) {
                          btnStyle = isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600";
                        }
                        return e.jsx("button", {
                          key: idx,
                          type: "button",
                          onClick: () => { setCurrentQIndex(idx); playTone(500, "sine", 0.05); },
                          className: "w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition border flex items-center justify-center cursor-pointer " + btnStyle,
                          children: idx + 1
                        }, idx);
                      })
                    }),

                    // Current Question Card
                    (() => {
                      const q = (shuffledQuestions || quizQuestions)[currentQIndex];
                      const selectedOptIdx = userAnswers[currentQIndex];
                      const isAnswered = selectedOptIdx !== undefined;

                      return e.jsxs("div", {
                        className: "bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5",
                        children: [
                          e.jsx("h3", {
                            className: "text-sm sm:text-base font-bold text-slate-900 leading-relaxed",
                            children: q.question
                          }),

                          // Options Grid
                          e.jsx("div", {
                            className: "grid grid-cols-1 gap-2.5",
                            children: q.options.map((opt, optIdx) => {
                              const isSelected = selectedOptIdx === optIdx;
                              let optStyle = "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200";
                              if (isAnswered) {
                                if (opt.isCorrect) {
                                  optStyle = "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold";
                                } else if (isSelected) {
                                  optStyle = "bg-rose-50 text-rose-900 border-rose-300 font-bold";
                                } else {
                                  optStyle = "bg-slate-50 opacity-60 text-slate-500 border-slate-200";
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
                                className: "p-3.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer " + optStyle,
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      e.jsx("span", {
                                        className: "w-6 h-6 rounded-lg bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0",
                                        children: String.fromCharCode(65 + optIdx)
                                      }),
                                      e.jsx("span", { children: opt.text })
                                    ]
                                  }),
                                  isAnswered && opt.isCorrect && e.jsx("span", { className: "text-emerald-600 font-bold text-base", children: "✓" }),
                                  isAnswered && isSelected && !opt.isCorrect && e.jsx("span", { className: "text-rose-600 font-bold text-base", children: "✕" })
                                ]
                              }, optIdx);
                            })
                          }),

                          // Explanation Box
                          isAnswered && e.jsxs("div", {
                            className: "p-4 rounded-xl text-xs space-y-1 bg-blue-50/80 border border-blue-200 text-blue-900 animate-fadeIn",
                            children: [
                              e.jsx("p", { className: "font-bold text-blue-950", children: "💡 ការពន្យល់ ៖" }),
                              e.jsx("p", { className: "leading-relaxed", children: q.options[selectedOptIdx].explanation || "ចម្លើយត្រឹមត្រូវត្រូវបានកំណត់ផ្អែកលើខ្លឹមសារពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦។" })
                            ]
                          }),

                          // Prev / Next Navigation
                          e.jsxs("div", {
                            className: "flex items-center justify-between pt-2 border-t border-slate-100",
                            children: [
                              e.jsx("button", {
                                type: "button",
                                disabled: currentQIndex === 0,
                                onClick: () => { setCurrentQIndex(prev => prev - 1); playTone(500, "sine", 0.05); },
                                className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40 cursor-pointer border border-slate-200",
                                children: "← សំណួរមុន"
                              }),
                              currentQIndex < (shuffledQuestions || quizQuestions).length - 1 ? e.jsx("button", {
                                type: "button",
                                onClick: () => { setCurrentQIndex(prev => prev + 1); playTone(600, "sine", 0.05); },
                                className: "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer",
                                children: "សំណួរបន្ទាប់ →"
                              }) : e.jsx("button", {
                                type: "button",
                                onClick: () => {
                                  setIsFinished(!0);
                                  playTone(900, "sine", 0.4);
                                },
                                className: "px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer",
                                children: "🏁 បញ្ចប់ការប្រឡង"
                              })
                            ]
                          })
                        ]
                      });
                    })()
                  ]
                }) : e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-5 max-w-lg mx-auto animate-scaleUp",
                  children: [
                    e.jsx("div", { className: "w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-inner", children: "🏆" }),
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsx("h3", { className: "text-xl font-bold font-moul text-slate-900", children: "លទ្ធផលការប្រឡង QCM មេរៀនទី ១៤" }),
                        e.jsx("p", { className: "text-xs text-slate-500", children: "អ្នកបានឆ្លើយសំណួរទាំង ៤០ រួចរាល់ហើយ!" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2",
                      children: [
                        e.jsxs("p", { className: "text-2xl font-extrabold text-emerald-600", children: [score, " / ", (shuffledQuestions || quizQuestions).length] }),
                        e.jsx("p", { className: "text-xs font-bold text-slate-600", children: score >= 28 ? "🎉 ឆ្នើមណាស់! អ្នកយល់ដឹងច្បាស់លើមេរៀនម៉ាស៊ីនងាយ!" : "អស្ចារ្យ! ព្យាយាមរំលឹកឡើងវិញដើម្បីទទួលបានពិន្ទុពេញ!" })
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
                            setShuffledQuestions(shuffleQuiz(quizQuestions));
                            playTone(500, "sine", 0.1);
                          },
                          className: "px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer",
                          children: "🔄 ប្រឡងឡើងវិញ"
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setIsFinished(!1);
                            setCurrentQIndex(0);
                          },
                          className: "px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer border border-slate-200",
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