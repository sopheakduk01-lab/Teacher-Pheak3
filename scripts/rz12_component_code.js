var Rz12 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [activeMatterState, setActiveMatterState] = y.useState("solid");
  const [isSpeaking, setIsSpeaking] = y.useState(!1);
  const [soundEnabled, setSoundEnabled] = y.useState(!0);
  const [isFullScreen, setIsFullScreen] = y.useState(!0);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
      };
    }
  }, [r, n]);

  const quizQuestions = [{"id":1,"question":"សំណួរទី ១ ៖ តើអ្វីទៅដែលហៅថា «រូបធាតុ»?","options":[{"text":"អ្វីៗទាំងអស់ដែលមានមាឌ និងមានម៉ាស","isCorrect":true},{"text":"អ្វីៗទាំងអស់ដែលមានតែជីវិតនិងចលនា","isCorrect":false},{"text":"អ្វីៗទាំងអស់ដែលអាចបញ្ចេញពន្លឺភ្លឺ","isCorrect":false},{"text":"អ្វីៗទាំងអស់ដែលមានពណ៌ស្រស់ស្អាត","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ រូបធាតុ គឺជាអ្វីៗទាំងអស់ដែលមានមាឌ និងមានម៉ាស (យោងតាមខ្លឹមសារសៀវភៅពុម្ពវិទ្យាសាស្ត្រ ថ្នាក់ទី៦ មេរៀនទី១២)"},{"id":2,"question":"សំណួរទី ២ ៖ តើវត្ថុទាំងឡាយទោះជាភវៈមានជីវិត ឬគ្មានជីវិត មើលឃើញឬមិនឃើញ សុទ្ធតែផ្សំឡើងពីអ្វី?","options":[{"text":"សុទ្ធតែផ្សំឡើងពីរូបធាតុ","isCorrect":true},{"text":"សុទ្ធតែផ្សំឡើងពីខ្យល់ដង្ហើម","isCorrect":false},{"text":"សុទ្ធតែផ្សំឡើងពីពន្លឺព្រះអាទិត្យ","isCorrect":false},{"text":"សុទ្ធតែផ្សំឡើងពីកម្ដៅភ្លើង","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ វត្ថុទាំងឡាយមិនថាមានជីវិត ឬគ្មានជីវិត មើលឃើញឬមិនឃើញ សុទ្ធតែផ្សំឡើងពីរូបធាតុទាំងអស់"},{"id":3,"question":"សំណួរទី ៣ ៖ យោងតាមមេរៀន តើរូបធាតុទាំងអស់ផ្សំឡើងពីភាគល្អិតតូចៗហៅថាអ្វី?","options":[{"text":"ម៉ូលេគុល ឬ អាតូម","isCorrect":true},{"text":"កោសិកា ឬ ជាលិកា","isCorrect":false},{"text":"សរសៃ ឬ ឆ្អឹងខ្ចី","isCorrect":false},{"text":"គ្រាប់ឈាម ឬ អ័រម៉ូន","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ រូបធាតុទាំងឡាយផ្សំឡើងពីភាគល្អិតតូចៗបំផុតហៅថា ម៉ូលេគុល ឬ អាតូម"},{"id":4,"question":"សំណួរទី ៤ ៖ តើគេអាចសម្គាល់លក្ខណៈរូបនៃរូបធាតុដោយសារអ្វីខ្លះ?","options":[{"text":"ភាពរូប ពណ៌ រាង ក្លិន រសជាតិ និងមាឌ","isCorrect":true},{"text":"តែអាយុកាល និងតម្លៃនៅលើទីផ្សារប៉ុណ្ណោះ","isCorrect":false},{"text":"តែចំនួននិងឈ្មោះរបស់អ្នកផលិតប៉ុណ្ណោះ","isCorrect":false},{"text":"តែប្រភពដើមនិងទីតាំងភូមិសាស្ត្រប៉ុណ្ណោះ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ លក្ខណៈរូបនៃរូបធាតុអាចសម្គាល់បានតាមរយៈ ភាពរូប ពណ៌ រាង ក្លិន រសជាតិ និងមាឌ"},{"id":5,"question":"សំណួរទី ៥ ៖ តើភាពរូបនៃរូបធាតុចែកចេញជាប៉ុន្មានសភាពធំៗ?","options":[{"text":"៣ សភាពធំៗ","isCorrect":true},{"text":"២ សភាពធំៗ","isCorrect":false},{"text":"៤ សភាពធំៗ","isCorrect":false},{"text":"៥ សភាពធំៗ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ភាពរូបនៃរូបធាតុចែកចេញជា ៣ សភាពធំៗគឺ ភាពរឹង ភាពរាវ និង ឧស្ម័ន"},{"id":6,"question":"សំណួរទី ៦ ៖ តើរូបធាតុដែលមានរូបរាងច្បាស់លាស់ និងមាឌច្បាស់លាស់ ស្ថិតក្នុងភាពរូបអ្វី?","options":[{"text":"ភាពរឹង","isCorrect":true},{"text":"ភាពរាវ","isCorrect":false},{"text":"ភាពឧស្ម័ន","isCorrect":false},{"text":"ប្លាស្មា","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ភាពរឹង មានរូបរាងច្បាស់លាស់ និងមាឌច្បាស់លាស់ (ដូចជា ថ្ម ឈើ ដែក...)"},{"id":7,"question":"សំណួរទី ៧ ៖ តើរូបធាតុដែលមានមាឌច្បាស់លាស់ ប៉ុន្តែរូបរាងប្រែប្រួលតាមភាជន៍ដាក់ ស្ថិតក្នុងភាពរូបអ្វី?","options":[{"text":"ភាពរាវ","isCorrect":true},{"text":"ភាពរឹង","isCorrect":false},{"text":"ភាពឧស្ម័ន","isCorrect":false},{"text":"ប្លាស្មា","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ភាពរាវ មានមាឌច្បាស់លាស់ តែរូបរាងប្រែប្រួលទៅតាមភាជន៍ដែលផ្ទុកវា (ដូចជា ទឹក ប្រេង ទឹកដោះគោ...)"},{"id":8,"question":"សំណួរទី ៨ ៖ តើរូបធាតុដែលមិនមានរូបរាង និងមិនមានមាឌច្បាស់លាស់ឡើយ ស្ថិតក្នុងភាពរូបអ្វី?","options":[{"text":"ភាពឧស្ម័ន","isCorrect":true},{"text":"ភាពរឹង","isCorrect":false},{"text":"ភាពរាវ","isCorrect":false},{"text":"ប្លាស្មា","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ឧស្ម័ន គ្មានរូបរាងច្បាស់លាស់ និងគ្មានមាឌច្បាស់លាស់ឡើយ គឺរីកសាយពេញទីកន្លែងដែលវាស្ថិតនៅ"},{"id":9,"question":"សំណួរទី ៩ ៖ តើការប្រែប្រួលនៃរូបធាតុចែកចេញជាប៉ុន្មានប្រភេទធំៗ?","options":[{"text":"២ ប្រភេទ គឺ ការប្រែប្រួលរូប និង ការប្រែប្រួលគីមី","isCorrect":true},{"text":"២ ប្រភេទ គឺ ការប្រែប្រួលរឹង និង ការប្រែប្រួលរាវ","isCorrect":false},{"text":"២ ប្រភេទ គឺ ការប្រែប្រួលក្តៅ និង ការប្រែប្រួលត្រជាក់","isCorrect":false},{"text":"២ ប្រភេទ គឺ ការប្រែប្រួលពណ៌ និង ការប្រែប្រួលទំហំ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ការប្រែប្រួលនៃរូបធាតុចែកជា ២ ប្រភេទ គឺ ការប្រែប្រួលលក្ខណៈរូប និង ការប្រែប្រួលលក្ខណៈគីមី"},{"id":10,"question":"សំណួរទី ១០ ៖ តើការប្រែប្រួលលក្ខណៈរូបនៃរូបធាតុគឺជាអ្វី?","options":[{"text":"ការប្រែប្រួលភាពរូបតែរក្សាធាតុផ្សំដើមដដែល","isCorrect":true},{"text":"ការប្រែប្រួលធាតុផ្សំដើមទាំងស្រុងបង្កើតសារធាតុថ្មី","isCorrect":false},{"text":"ការប្រែប្រួលទម្ងន់និងម៉ាសបាត់បង់អស់គ្មានសល់","isCorrect":false},{"text":"ការប្រែប្រួលដោយសារតែអំពើនៃបាក់តេរីតែមួយគត់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ការប្រែប្រួលលក្ខណៈរូប គឺជាការប្រែប្រួលភាពរូប (រឹង រាវ ឧស្ម័ន) ឬរូបរាង តែនៅរក្សាធាតុដើមដដែល មិនកើតសារធាតុថ្មីឡើយ"},{"id":11,"question":"សំណួរទី ១១ ៖ តើមួយណាជាឧទាហរណ៍ជាក់ស្តែងនៃការប្រែប្រួលលក្ខណៈរូប?","options":[{"text":"ទឹកកករលាយជាទឹក និងទឹកពុះជាចំហាយ","isCorrect":true},{"text":"ក្រដាសត្រូវភ្លើងឆេះក្លាយទៅជាផេះខ្មៅ","isCorrect":false},{"text":"ដែកគោលត្រូវខ្យល់សើមក្លាយជាច្រែះ","isCorrect":false},{"text":"ផ្លែចេកទុំមានក្លិនក្រអូបនិងផ្អែម","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ដុំទឹកកករលាយជាទឹក ឬទឹកពុះហួតជាចំហាយ ជាការប្រែប្រួលលក្ខណៈរូបព្រោះវានៅតែជាទឹកដដែល"},{"id":12,"question":"សំណួរទី ១២ ៖ តើអ្វីទៅដែលហៅថា «ល្បាយ»?","options":[{"text":"ការច្របល់ចូលគ្នានៃរូបធាតុពីរឬច្រើន","isCorrect":true},{"text":"ការបំបែករូបធាតុមួយឱ្យទៅជាធាតុទទេ","isCorrect":false},{"text":"ការឆេះនៃរូបធាតុមួយក្រោមអំពើកម្ដៅ","isCorrect":false},{"text":"ការកកនៃរូបធាតុរាវឱ្យទៅជារូបធាតុរឹង","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ល្បាយ កើតឡើងពីការច្របល់ចូលគ្នានៃរូបធាតុពីរ ឬច្រើនប្រភេទ"},{"id":13,"question":"សំណួរទី ១៣ ៖ តើល្បាយចែកចេញជាប៉ុន្មានប្រភេទ?","options":[{"text":"២ ប្រភេទ គឺ ល្បាយស្មើសាច់ និង ល្បាយមិនស្មើសាច់","isCorrect":true},{"text":"២ ប្រភេទ គឺ ល្បាយរឹង និង ល្បាយរាវ","isCorrect":false},{"text":"២ ប្រភេទ គឺ ល្បាយក្តៅ និង ល្បាយត្រជាក់","isCorrect":false},{"text":"២ ប្រភេទ គឺ ល្បាយផ្អែម និង ល្បាយប្រៃ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ល្បាយចែកចេញជា ២ ប្រភេទ គឺ ល្បាយស្មើសាច់ និង ល្បាយមិនស្មើសាច់"},{"id":14,"question":"សំណួរទី ១៤ ៖ តើល្បាយស្មើសាច់គឺជាអ្វី?","options":[{"text":"ជាល្បាយដែលធាតុបង្កទាំងអស់រលាយចូលគ្នាមើលមិនដាច់","isCorrect":true},{"text":"ជាល្បាយដែលអាចមើលឃើញធាតុបង្កនីមួយៗបានយ៉ាងច្បាស់","isCorrect":false},{"text":"ជាល្បាយដែលមានពណ៌ខុសៗគ្នាមិនអាចរលាយចូលគ្នាបាន","isCorrect":false},{"text":"ជាល្បាយដែលកកើតឡើងដោយសារតែប្រតិកម្មគីមីប៉ុណ្ណោះ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ល្បាយស្មើសាច់ ជាល្បាយដែលធាតុផ្សំរលាយសព្វចូលគ្នា មិនអាចមើលដឹងពីធាតុបង្កនីមួយៗដោយភ្នែកទទេបានទេ"},{"id":15,"question":"សំណួរទី ១៥ ៖ តើមួយណាជាឧទាហរណ៍នៃ «ល្បាយស្មើសាច់»?","options":[{"text":"ល្បាយទឹកនិងស្ករ ឬ ល្បាយទឹកនិងអំបិល","isCorrect":true},{"text":"ល្បាយទឹកនិងប្រេងឆា ឬ ល្បាយទឹកនិងខ្សាច់","isCorrect":false},{"text":"ល្បាយអង្ករនិងគ្រាប់សណ្ដែក ឬ ល្បាយដីនិងក្រួស","isCorrect":false},{"text":"ល្បាយស្លឹកឈើនិងទឹក ឬ ល្បាយដែកនិងឈើ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ទឹកលាយស្ករ ឬ ទឹកលាយអំបិល ជាល្បាយស្មើសាច់ ព្រោះស្ករនិងអំបិលរលាយសព្វក្នុងទឹកទាំងស្រុង"},{"id":16,"question":"សំណួរទី ១៦ ៖ តើល្បាយមិនស្មើសាច់គឺជាអ្វី?","options":[{"text":"ជាល្បាយដែលអាចមើលឃើញធាតុបង្ករបស់វាបានច្បាស់","isCorrect":true},{"text":"ជាល្បាយដែលរលាយចូលគ្នាមើលមិនស្គាល់ធាតុបង្កឡើយ","isCorrect":false},{"text":"ជាល្បាយដែលផ្សំឡើងពីឧស្ម័នសុទ្ធគ្មានជាតិរាវសោះ","isCorrect":false},{"text":"ជាល្បាយដែលបង្កើតជាសារធាតុថ្មីខុសស្រឡះពីធាតុដើម","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ល្បាយមិនស្មើសាច់ ជាល្បាយដែលអាចមើលឃើញធាតុផ្សំ ឬធាតុបង្ករបស់វាដាច់ៗពីគ្នាបានច្បាស់"},{"id":17,"question":"សំណួរទី ១៧ ៖ តើមួយណាជាឧទាហរណ៍ជាក់ស្ដែងនៃ «ល្បាយមិនស្មើសាច់»?","options":[{"text":"ល្បាយទឹកនិងដីខ្សាច់ ឬ ល្បាយទឹកនិងប្រេងឆា","isCorrect":true},{"text":"ល្បាយទឹកនិងស្ករស ឬ ល្បាយទឹកនិងអំបិលម៉ដ្ឋ","isCorrect":false},{"text":"ល្បាយទឹកនិងទឹកខ្មេះ ឬ ល្បាយទឹកនិងជាតិអាល់កុល","isCorrect":false},{"text":"ល្បាយខ្យល់បរិសុទ្ធ ឬ ល្បាយទឹកសន្សើមពេលព្រឹក","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ទឹកលាយដីខ្សាច់ ឬ ទឹកលាយប្រេង ជាល្បាយមិនស្មើសាច់ ព្រោះយើងអាចមើលឃើញខ្សាច់ ឬប្រេងដាច់ដោយឡែកពីទឹក"},{"id":18,"question":"សំណួរទី ១៨ ៖ តើការប្រែប្រួលលក្ខណៈរូបនៃរូបធាតុក្នុងល្បាយជាអ្វី?","options":[{"text":"ការលាយបញ្ចូលគ្នាតែធាតុនីមួយៗរក្សាលក្ខណៈដើម","isCorrect":true},{"text":"ការលាយបញ្ចូលគ្នាហើយកើតចេញជាសារធាតុថ្មី","isCorrect":false},{"text":"ការបំផ្លាញចោលនូវរូបធាតុដើមទាំងស្រុងដោយកម្ដៅ","isCorrect":false},{"text":"ការធ្វើឱ្យបាត់បង់ទម្ងន់និងមាឌនៃរូបធាតុដើម","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ក្នុងល្បាយ រូបធាតុគ្រាន់តែប្រែប្រួលលក្ខណៈរូប (ច្របល់ចូលគ្នា) ប៉ុន្តែធាតុនីមួយៗនៅតែរក្សាលក្ខណៈដើមរបស់វាដដែល"},{"id":19,"question":"សំណួរទី ១៩ ៖ តើការប្រែប្រួលលក្ខណៈគីមីនៃរូបធាតុគឺជាអ្វី?","options":[{"text":"ការប្រែប្រួលបង្កើតជាសារធាតុថ្មីខុសពីធាតុដើម","isCorrect":true},{"text":"ការប្រែប្រួលរូបរាងខាងក្រៅតែរក្សាធាតុដើមដដែល","isCorrect":false},{"text":"ការផ្លាស់ប្តូរទីកន្លែងពីរដូវមួយទៅរដូវមួយទៀត","isCorrect":false},{"text":"ការបំបែកជាបំណែកតូចៗដោយគ្មានការកកើតសារធាតុថ្មី","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ការប្រែប្រួលលក្ខណៈគីមី គឺជាការប្រែប្រួលដែលធ្វើឱ្យកកើតសារធាតុថ្មី ដែលមានលក្ខណៈខុសស្រឡះពីធាតុដើម"},{"id":20,"question":"សំណួរទី ២០ ៖ តើមួយណាជាឧទាហរណ៍ច្បាស់លាស់នៃការប្រែប្រួលលក្ខណៈគីមី?","options":[{"text":"ការឆេះក្រដាសជាផេះ និងការរំលាយម្សៅជាស្ករ","isCorrect":true},{"text":"ការរលាយទឹកកកជាទឹក និងការកកទឹកជាដុំទឹកកក","isCorrect":false},{"text":"ការកាត់ក្រដាសជាកង់ៗ និងការបំបែកកែវជាបំណែក","isCorrect":false},{"text":"ការលាយអង្ករជាមួយសណ្តែក និងការលាយទឹកជាមួយខ្សាច់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ការដុតក្រដាសក្លាយជាផេះ និងសាច់នំប៉័ងត្រូវទឹកមាត់ក្លាយជាស្ករ សុទ្ធតែជាការប្រែប្រួលលក្ខណៈគីមី"},{"id":21,"question":"សំណួរទី ២១ ៖ ហេតុអ្វីបានជាសាច់នំប៉័ងត្រូវទឹកមាត់រលាយក្លាយជាជាតិស្ករ (គ្លុយកូស) ចាត់ជាការប្រែប្រួលគីមី?","options":[{"text":"ពីព្រោះមានការកកើតសារធាតុថ្មីខុសពីម្សៅដើម","isCorrect":true},{"text":"ពីព្រោះនំប៉័ងគ្រាន់តែបែកជាបំណែកតូចៗក្នុងមាត់","isCorrect":false},{"text":"ពីព្រោះនំប៉័ងគ្រាន់តែស្រូបយកទឹកមាត់ឱ្យទន់ប៉ុណ្ណោះ","isCorrect":false},{"text":"ពីព្រោះនំប៉័ងគ្រាន់តែផ្លាស់ប្តូរទីតាំងចូលទៅក្នុងក្រពះ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ព្រោះមានការកកើតសារធាតុថ្មីគឺ ជាតិស្ករ (គ្លុយកូស) ដែលមានរសជាតិផ្អែម ខុសពីម្សៅនំប៉័ងដើម"},{"id":22,"question":"សំណួរទី ២២ ៖ តើកត្តាសំខាន់ៗអ្វីខ្លះដែលធ្វើឱ្យមានការប្រែប្រួលលក្ខណៈរូប និងលក្ខណៈគីមីនៃរូបធាតុ?","options":[{"text":"កម្ដៅ បាក់តេរី និងសារធាតុផ្សេងៗជុំវិញ","isCorrect":true},{"text":"ទំនាញផែនដី និងពន្លឺព្រះច័ន្ទនៅពេលរាត្រី","isCorrect":false},{"text":"រលកសំឡេង និងល្បឿននៃការបក់បោករបស់ខ្យល់","isCorrect":false},{"text":"កម្ពស់ទឹកសមុទ្រ និងកម្លាំងម៉ាញេទិកនៃដី","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ កត្តាធ្វើឱ្យរូបធាតុប្រែប្រួលរួមមាន កម្ដៅ បាក់តេរី និងសារធាតុផ្សេងៗ (ខ្យល់ ទឹកមាត់ ទឹកភ្លៀង...)"},{"id":23,"question":"សំណួរទី ២៣ ៖ តើកម្ដៅធ្វើឱ្យអង្ករប្រែប្រួលទៅជាអ្វី?","options":[{"text":"ប្រែប្រួលទៅជាបាយ ឬ បបរ","isCorrect":true},{"text":"ប្រែប្រួលទៅជាដុំទឹកកករឹង","isCorrect":false},{"text":"ប្រែប្រួលទៅជាម្សៅច្រែះក្រហម","isCorrect":false},{"text":"ប្រែប្រួលទៅជាទឹកខ្មេះជូរចត់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ កម្ដៅធ្វើឱ្យអង្ករដាំទៅជាបាយ ឬបបរ ដែលទន់និងងាយស្រួលរំលាយ"},{"id":24,"question":"សំណួរទី ២៤ ៖ តើកម្ដៅធ្វើឱ្យស្ករប្រែប្រួលដូចម្ដេចនៅពេលរម្ងាស់យូរ?","options":[{"text":"ស្កររលាយប្រែពណ៌ត្នោតក្រម៉ៅក្លាយជាទឹកចត់","isCorrect":true},{"text":"ស្ករកកក្លាយជាដុំថ្មពណ៌សរឹងដូចពេជ្រ","isCorrect":false},{"text":"ស្កររលាយបាត់ទាំងស្រុងក្លាយជាទឹកបរិសុទ្ធ","isCorrect":false},{"text":"ស្ករផ្ទុះឆេះក្លាយជាឧស្ម័នពុលគ្មានពណ៌","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ស្ករកម្ដៅរលាយក្លាយជាចត់ ឬច្នាង ដោយប្រែពណ៌ត្នោតក្រម៉ៅ និងមានរសជាតិល្វីងចត់បន្តិច"},{"id":25,"question":"សំណួរទី ២៥ ៖ តើកម្ដៅធ្វើឱ្យសាច់ត្រីយកទៅស្ងោរប្រែប្រួលអ្វីខ្លះ?","options":[{"text":"ប្រែប្រួលពណ៌ សាច់ឆ្អិនទន់ និងក្លិនរសជាតិ","isCorrect":true},{"text":"ប្រែប្រួលទៅជាដែកថែបរឹងមាំនិងធន់នឹងកម្ដៅ","isCorrect":false},{"text":"ប្រែប្រួលទៅជាទឹកកកត្រជាក់គ្មានរសជាតិ","isCorrect":false},{"text":"គ្មានការប្រែប្រួលអ្វីទាំងអស់ទាំងសាច់និងក្លិន","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ កម្ដៅធ្វើឱ្យសាច់ត្រីឆ្អិន ប្រែពណ៌ សាច់ទន់ និងមានក្លិនរសជាតិឈ្ងុយឆ្ងាញ់"},{"id":26,"question":"សំណួរទី ២៦ ៖ តើបាក់តេរីធ្វើឱ្យបាយដំណើបលាយមេ ហើយគ្របទុក ២ ទៅ ៣ ថ្ងៃ ក្លាយទៅជាអ្វី?","options":[{"text":"ក្លាយជាត្រប៉ែមានរសជាតិផ្អែមនិងក្លិនឈ្ងុយ","isCorrect":true},{"text":"ក្លាយជាទឹកដោះគោជូរសម្រាប់ទទួលទាន","isCorrect":false},{"text":"ក្លាយជាដុំថ្មកំបោរពណ៌សមិនអាចហូបបាន","isCorrect":false},{"text":"ក្លាយជាទឹកខ្មេះជូរចត់គ្មានក្លិនឈ្ងុយឡើយ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ មេដំបែ ឬបាក់តេរី ធ្វើឱ្យបាយដំណើបប្រែក្លាយជា «ត្រប៉ែ» មានជាតិផ្អែម និងក្លិនឈ្ងុយ"},{"id":27,"question":"សំណួរទី ២៧ ៖ តើបាក់តេរីធ្វើឱ្យទឹកដោះគោស្រស់ទុកចោល ២ ទៅ ៣ ថ្ងៃ ប្រែប្រួលដូចម្ដេច?","options":[{"text":"ផ្អូមខូច មានរសជាតិជូរ និងឡើងកករ","isCorrect":true},{"text":"ក្លាយជាទឹកបរិសុទ្ធថ្លាគ្មានក្លិន","isCorrect":false},{"text":"ក្លាយជាប្រេងឆាពណ៌លឿងស្រស់","isCorrect":false},{"text":"ក្លាយជាទឹកកករឹងគ្មានជាតិជូរ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ បាក់តេរីធ្វើឱ្យទឹកដោះគោផ្អូម មានរសជាតិជូរ និងឡើងកករខុសពីសភាពដើម"},{"id":28,"question":"សំណួរទី ២៨ ៖ តើខ្យល់អាកាស (អុកស៊ីសែន) ធ្វើឱ្យដែកគោលទុកចោលហាលខ្យល់ប្រែប្រួលទៅជាអ្វី?","options":[{"text":"ក្លាយជាដែកគោលច្រែះពណ៌ក្រហមត្នោតនិងពុក","isCorrect":true},{"text":"ក្លាយជាដុំមាសភ្លឺរលោងមិនចេះច្រែះ","isCorrect":false},{"text":"ក្លាយជាដែកមុតស្រួចនិងរឹងមាំជាងមុន","isCorrect":false},{"text":"ក្លាយជាដុំកញ្ចក់ថ្លាមើលធ្លុះបាន","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ អុកស៊ីសែនក្នុងខ្យល់មានប្រតិកម្មជាមួយដែក និងសំណើម បង្កើតជាដែកច្រែះពណ៌ក្រហមត្នោត និងពុកផុយ"},{"id":29,"question":"សំណួរទី ២៩ ៖ តើទឹកធ្វើឱ្យឈើ ឬខោអាវដែលសើមយូរប្រែប្រួលដូចម្ដេច?","options":[{"text":"ធ្វើឱ្យឈើពុកផុយ និងខោអាវដុះផ្សិតធុំក្លិន","isCorrect":true},{"text":"ធ្វើឱ្យឈើរឹងដូចថ្ម និងខោអាវប្រែជាថ្មី","isCorrect":false},{"text":"ធ្វើឱ្យឈើនិងខោអាវប្រែពណ៌ជាមាសភ្លឺ","isCorrect":false},{"text":"គ្មានការប្រែប្រួលអ្វីកើតឡើងទាល់តែសោះ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ទឹកនិងសំណើមធ្វើឱ្យឈើពុកផុយ ហើយខោអាវសើមយូរឡើងផ្អួរ ដុះផ្សិត និងធុំក្លិនមិនល្អ"},{"id":30,"question":"សំណួរទី ៣០ ៖ តើទឹកភ្លៀងប៉ះពាល់យ៉ាងដូចម្ដេចចំពោះប្រាសាទបុរាណ និងផ្ទាំងថ្ម?","options":[{"text":"ធ្វើឱ្យថ្មសឹកសេចរិល និងពុកផុយតាមពេល","isCorrect":true},{"text":"ធ្វើឱ្យថ្មរីកមាឌធំជាងមុនទ្វេដងជានិច្ច","isCorrect":false},{"text":"ធ្វើឱ្យថ្មប្រែទៅជាដុំពេជ្រភ្លឺរលោង","isCorrect":false},{"text":"គ្មានការប៉ះពាល់អ្វីដល់ប្រាសាទថ្មឡើយ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ទឹកភ្លៀង ជាពិសេសទឹកភ្លៀងអាស៊ីត ធ្វើឱ្យថ្មប្រាសាទសឹកសេចរិល និងពុកផុយតាមពេលវេលា"},{"id":31,"question":"សំណួរទី ៣១ ៖ ហេតុអ្វីបានជាដើមឈើធំធាត់ ស្លឹកឈើប្រែពណ៌លឿង និងផ្លែឈើទុំ ចាត់ជាការប្រែប្រួលនៃរូបធាតុ?","options":[{"text":"ពីព្រោះមានការប្រែប្រួលខាងរូបធាតុនិងគីមី","isCorrect":true},{"text":"ពីព្រោះដើមឈើមិនមែនជារូបធាតុពិតប្រាកដ","isCorrect":false},{"text":"ពីព្រោះវាគ្រាន់តែជាការបំភាន់ភ្នែកប៉ុណ្ណោះ","isCorrect":false},{"text":"ពីព្រោះដើមឈើគ្មានម៉ាសនិងគ្មានមាឌឡើយ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ព្រោះវាមានការប្រែប្រួលសារធាតុខាងក្នុង ទ្រង់ទ្រាយ ពណ៌ និងក្លិនរសជាតិ ដែលជាការប្រែប្រួលរូបធាតុនិងគីមី"},{"id":32,"question":"សំណួរទី ៣២ ៖ តើការកាត់ក្រដាសមួយសន្លឹកជាបំណែកតូចៗជាច្រើន ជាការប្រែប្រួលប្រភេទណា?","options":[{"text":"ការប្រែប្រួលរូប ព្រោះបំណែកតូចៗនៅតែជាក្រដាស","isCorrect":true},{"text":"ការប្រែប្រួលគីមី ព្រោះក្រដាសបានប្រែប្រួលទំហំ","isCorrect":false},{"text":"ការប្រែប្រួលគីមី ព្រោះកើតមានសារធាតុថ្មីខុសពីដើម","isCorrect":false},{"text":"មិនមែនជាការប្រែប្រួលទេ ព្រោះក្រដាសមិនបាត់បង់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ជាការប្រែប្រួលលក្ខណៈរូប ព្រោះបំណែកតូចៗនៅតែជាក្រដាសដដែល មិនកើតសារធាតុថ្មីឡើយ"},{"id":33,"question":"សំណួរទី ៣៣ ៖ តើកែវមួយធ្លាក់បែកជាបំណែកតូចៗជាការប្រែប្រួលអ្វី?","options":[{"text":"ការប្រែប្រួលលក្ខណៈរូប","isCorrect":true},{"text":"ការប្រែប្រួលលក្ខណៈគីមី","isCorrect":false},{"text":"ការប្រែប្រួលដោយសារបាក់តេរី","isCorrect":false},{"text":"ការប្រែប្រួលដោយសារច្រែះ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ កែវបែកជាបំណែកតូចៗ ជាការប្រែប្រួលលក្ខណៈរូប ព្រោះបំណែកនីមួយៗនៅតែជាកែវដដែល"},{"id":34,"question":"សំណួរទី ៣៤ ៖ ដើម្បីការពារដែកគោល និងឧបករណ៍ដែកកុំឱ្យកើតច្រែះ តើយើងត្រូវធ្វើដូចម្ដេច?","options":[{"text":"លាបថ្នាំការពារច្រែះ និងទុកដាក់កន្លែងស្ងួត","isCorrect":true},{"text":"យកដែកទៅត្រាំក្នុងទឹកនិងហាលភ្លៀងជានិច្ច","isCorrect":false},{"text":"យកដែកទៅលាយជាមួយទឹកខ្មេះនិងទឹកអំបិល","isCorrect":false},{"text":"យកដែកទៅកប់ទុកក្នុងដីសើមឱ្យបានយូរ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ត្រូវលាបថ្នាំការពារច្រែះ លាបខ្លាញ់ ឬទុកដាក់កន្លែងស្ងួតគ្មានសំណើម"},{"id":35,"question":"សំណួរទី ៣៥ ៖ តើវិធីណាអាចញែកអំបិលចេញពីល្បាយស្មើសាច់ទឹកនិងអំបិលបាន?","options":[{"text":"ដាំទឹកឱ្យពុះហួតអស់សល់ក្រាមអំបិល","isCorrect":true},{"text":"ប្រើក្រដាសច្រោះធម្មតាដើម្បីច្រោះអំបិល","isCorrect":false},{"text":"ប្រើមេដែកដើម្បីឆក់ទាញយកអំបិលចេញ","isCorrect":false},{"text":"រង់ចាំឱ្យអំបិលរងថ្លាធ្លាក់ចុះដល់បាត","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ដាំទឹកឱ្យពុះហួតអស់ នោះនឹងសល់ក្រាមអំបិលនៅបាតភាជន៍"},{"id":36,"question":"សំណួរទី ៣៦ ៖ តើវិធីណាអាចញែកដីខ្សាច់ចេញពីល្បាយមិនស្មើសាច់ទឹកនិងដីខ្សាច់បានងាយស្រួលបំផុត?","options":[{"text":"ប្រើក្រដាសច្រោះ ឬរង់ចាំឱ្យខ្សាច់រងថ្លា","isCorrect":true},{"text":"យកទៅដុតដោយកម្ដៅភ្លើងខ្លាំងឱ្យរលាយ","isCorrect":false},{"text":"ប្រើមេដំបែដើម្បីរំលាយគ្រាប់ខ្សាច់ចោល","isCorrect":false},{"text":"មិនអាចញែកចេញពីគ្នាបានទាល់តែសោះឡើយ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ប្រើក្រដាសច្រោះ ឬរង់ចាំឱ្យដីខ្សាច់រងថ្លាធ្លាក់ចុះបាត រួចចាក់ទឹកចេញ"},{"id":37,"question":"សំណួរទី ៣៧ ៖ នៅពេលទឹកកករលាយក្លាយជាទឹក តើសីតុណ្ហភាពទឹកកកប្រែប្រួលយ៉ាងដូចម្ដេច?","options":[{"text":"វាស្រូបយកកម្ដៅពីមជ្ឈដ្ឋានជុំវិញខ្លួន","isCorrect":true},{"text":"វាបញ្ចេញកម្ដៅយ៉ាងខ្លាំងក្លាយជាភ្លើង","isCorrect":false},{"text":"វាមិនមានការស្រូបឬបញ្ចេញកម្ដៅអ្វីឡើយ","isCorrect":false},{"text":"វាធ្វើឱ្យសីតុណ្ហភាពធ្លាក់ចុះត្រជាក់ជាងមុន","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ទឹកកកស្រូបយកកម្ដៅពីមជ្ឈដ្ឋានជុំវិញដើម្បីរលាយពីភាពរឹងទៅជារាវ"},{"id":38,"question":"សំណួរទី ៣៨ ៖ ការធ្វើផ្អក ប្រហុក ឬម៉ាំ ពីសាច់ត្រីនៅប្រទេសកម្ពុជា ពឹងផ្អែកលើកត្តាអ្វីខ្លះ?","options":[{"text":"អំពើនៃបាក់តេរី និងការប្រើប្រាស់អំបិល","isCorrect":true},{"text":"កម្ដៅភ្លើងខ្លាំង និងការដុតរម្ងាស់ឱ្យរីង","isCorrect":false},{"text":"ការបង្កកក្នុងទឹកកកសុទ្ធសាធគ្មានអំបិល","isCorrect":false},{"text":"ការហាលខ្យល់ឱ្យកើតច្រែះដូចដែកគោល","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ពឹងផ្អែកលើអំពើនៃបាក់តេរី និងការប្រើប្រាស់អំបិលដើម្បីរក្សាទុកសាច់ត្រីបានយូរ"},{"id":39,"question":"សំណួរទី ៣៩ ៖ តើការដុតទៀន ឬដុតអុសជាការប្រែប្រួលប្រភេទណា?","options":[{"text":"ការប្រែប្រួលគីមី ព្រោះបង្កើតផ្សែងនិងផេះ","isCorrect":true},{"text":"ការប្រែប្រួលរូប ព្រោះរក្សារូបរាងដើមដដែល","isCorrect":false},{"text":"ការប្រែប្រួលដោយសារតែអំពើនៃទឹកភ្លៀង","isCorrect":false},{"text":"មិនមែនជាការប្រែប្រួលនៃរូបធាតុណាមួយឡើយ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ការឆេះឈើ ឬទៀន ជាការប្រែប្រួលលក្ខណៈគីមី ព្រោះវាបង្កើតជាកម្ដៅ ពន្លឺ ផ្សែង និងផេះ"},{"id":40,"question":"សំណួរទី ៤០ ៖ តើសារៈសំខាន់នៃការយល់ដឹងពីមេរៀន «ការប្រែប្រួលរូបធាតុ» ផ្តល់អត្ថប្រយោជន៍អ្វីខ្លះដល់ជីវភាពរស់នៅ?","options":[{"text":"ជួយក្នុងការចម្អិនអាហារ និងការថែទាំឧបករណ៍","isCorrect":true},{"text":"ជួយតែក្នុងការដុតក្រដាសឱ្យឆេះលឿនប៉ុណ្ណោះ","isCorrect":false},{"text":"គ្មានអត្ថប្រយោជន៍អ្វីដល់ជីវិតប្រចាំថ្ងៃឡើយ","isCorrect":false},{"text":"សម្រាប់តែការប្រឡងយកពិន្ទុតែមួយមុខគត់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ជួយក្នុងការចម្អិនម្ហូបអាហារ ការថែរក្សាឧបករណ៍មិនឱ្យច្រែះ និងការការពារបរិស្ថាន"}];

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

  const playTone = (freq = 523.25, type = "sine", duration = 0.2) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
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

  const matterStates = {
    solid: {
      name: "ភាពរឹង (Solid)",
      icon: "🧊",
      desc: "មានរូបរាងច្បាស់លាស់ និងមាឌច្បាស់លាស់។ ភាគល្អិតតូចៗផ្ដុំគ្នាជិតស្និទ្ធបំផុត។",
      examples: "ទឹកកក, ថ្ម, ដែក, សៀវភៅ...",
      color: "from-blue-600 to-cyan-500"
    },
    liquid: {
      name: "ភាពរាវ (Liquid)",
      icon: "💧",
      desc: "មានមាឌច្បាស់លាស់ ប៉ុន្តែរូបរាងប្រែប្រួលតាមភាជន៍ដាក់។ ភាគល្អិតអាចរំកិលចុះឡើងបាន។",
      examples: "ទឹក, ប្រេង, ទឹកដោះគោ, ទឹកអាស៊ីត...",
      color: "from-blue-400 to-indigo-500"
    },
    gas: {
      name: "ឧស្ម័ន (Gas)",
      icon: "☁️",
      desc: "មិនមានរូបរាង និងមាឌច្បាស់លាស់ឡើយ។ ភាគល្អិតនៅដាច់ពីគ្នាឆ្ងាយ និងធ្វើចលនាលឿន។",
      examples: "ខ្យល់, ចំហាយទឹក, អុកស៊ីសែន...",
      color: "from-slate-400 to-slate-200"
    }
  };

  return e.jsx("div", {
    "data-modal-open": "true",
    onClick: (ev) => { if (ev.target === ev.currentTarget) t(); },
    className: isFullScreen ?
      "fixed inset-0 z-[100] w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-['Battambang'] p-0" :
      "fixed inset-0 z-[100] overflow-y-auto bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300 font-['Battambang']",
    children: e.jsxs("div", {
      onClick: (ev) => ev.stopPropagation(),
      className: isFullScreen ?
        "relative w-full h-full min-h-screen sm:min-h-screen flex flex-col overflow-hidden rounded-none border-0 bg-white" :
        "relative w-full max-w-5xl h-full sm:h-[92vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300",
      children: [
        e.jsxs("div", {
          className: "bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-4 sm:p-5 text-white shrink-0 relative overflow-hidden shadow-md",
          children: [
            e.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" }),
            e.jsxs("div", {
              className: "relative flex items-center justify-between",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-3 sm:gap-4",
                  children: [
                    e.jsx("div", { className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-lg border border-white/30", children: "🔬" }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("h2", { className: "text-lg sm:text-2xl font-bold font-moul leading-tight", children: "មេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ" }),
                        e.jsx("p", { className: "text-blue-100 text-[10px] sm:text-xs font-bold opacity-90", children: "ជំពូកទី ៤ • វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ៤០ សំណួរ QCM" })
                      ]
                    })
                  ]
                }),
                e.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => {
                        const lesson12KeyTakeaways = "សួស្តីសិស្សានុសិស្សទាំងអស់គ្នា! នេះជាចំណុចគន្លឹះសំខាន់ៗនៃមេរៀនទី ១២ ៖ ការប្រែប្រួលរូបធាតុ ៖ " +
                        "ទី ១. រូបធាតុ ៖ ជារបស់ទាំងឡាយណាដែលមានម៉ាស មានមាឌ និងមានទម្ងន់តាំងនៅក្នុងលំហ។ " +
                        "ទី ២. ភាពរូបនៃរូបធាតុ ៖ រូបធាតុមាន ៣ ភាពរូបសំខាន់ៗគឺ ៖ រឹង រាវ និងឧស្ម័ន។ " +
                        "ទី ៣. ការប្រែប្រួលរូប ៖ ជាការប្រែប្រួលភាពរូបខាងក្រៅដោយមិនបង្កើតអង្គធាតុថ្មីឡើយ ដូចជាការរលាយទឹកកក ឬការកកទឹក។ " +
                        "ទី ៤. ការប្រែប្រួលគីមី ៖ ជាការប្រែប្រួលដែលបង្កើតបានជាអង្គធាតុថ្មីដែលមានលក្ខណៈខុសពីអង្គធាតុដើម ដូចជាដែកគោលច្រែះ ឬអុសឆេះជាធ្យូងនិងភេះ។ " +
                        "សូមចងចាំចំណុចសំខាន់ៗទាំងនេះ!";
                        toggleSpeech(lesson12KeyTakeaways);
                      },
                      className: `px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${isSpeaking ? "bg-amber-400 text-slate-900 border-amber-500 animate-pulse" : "bg-white/20 text-white border-white/30 hover:bg-white/30"}`,
                      children: [
                        e.jsx("span", { children: isSpeaking ? "⏹️" : "🎧" }),
                        e.jsx("span", { className: "hidden md:inline", children: isSpeaking ? "បញ្ឈប់ការស្ដាប់ពន្យល់" : "ស្តាប់ពន្យល់ចំណុចសំខាន់ៗ" })
                      ]
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: () => setSoundEnabled(!soundEnabled),
                      className: `w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${soundEnabled ? "bg-white/20 text-white" : "bg-slate-800/40 text-slate-300"}`,
                      title: soundEnabled ? "បិទសំឡេង" : "បើកសំឡេង",
                      children: e.jsx("i", { className: `fa-solid ${soundEnabled ? "fa-volume-high" : "fa-volume-xmark"}` })
                    }),
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => setIsFullScreen(!isFullScreen),
                      title: isFullScreen ? "បង្រួមបង្អួច" : "ពង្រីកពេញអេក្រង់",
                      className: "px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 flex items-center gap-1.5 text-white text-xs font-bold transition cursor-pointer border border-white/30",
                      children: [
                        e.jsx("span", { children: isFullScreen ? "⛶" : "🗖" }),
                        e.jsx("span", { className: "hidden sm:inline", children: isFullScreen ? "បង្រួម" : "ពេញអេក្រង់" })
                      ]
                    }),
                    e.jsx("button", {
                      type: "button",
                      onClick: t,
                      className: "w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer",
                      title: "បិទផ្ទាំង",
                      children: e.jsx("i", { className: "fa-solid fa-xmark" })
                    })
                  ]
                })
              ]
            }),
            e.jsx("div", {
              className: "flex items-center gap-1 mt-5 overflow-x-auto no-scrollbar pb-1",
              children: [
                { id: "tab-hero", icon: "🏠", label: "ទិដ្ឋភាពទូទៅ" },
                { id: "tab-lesson", icon: "📖", label: "ខ្លឹមសារមេរៀន" },
                { id: "tab-states", icon: "🧊", label: "ភាពរូបធាតុ" },
                { id: "tab-changes", icon: "🔄", label: "ការប្រែប្រួល" },
                { id: "tab-quiz", icon: "📝", label: "៤០ សំណួរ QCM" }
              ].map(tab => e.jsxs("button", {
                type: "button",
                key: tab.id,
                onClick: () => {
                  i(tab.id);
                  playTone(440, "sine", 0.08);
                },
                className: `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${n === tab.id ? "bg-white text-blue-800 shadow-md" : "text-white hover:bg-white/10"}`,
                children: [e.jsx("span", { children: tab.icon }), e.jsx("span", { children: tab.label })]
              }, tab.id))
            })
          ]
        }),

        e.jsx("div", {
          className: "flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8 no-scrollbar",
          children: n === "tab-hero" ? e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
            children: [
              e.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
                children: [
                  e.jsxs("div", {
                    className: "space-y-6",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider", children: "សេចក្តីផ្ដើម" }),
                          e.jsx("h1", { className: "text-3xl sm:text-4xl font-bold text-slate-900 leading-tight font-moul", children: "តើអ្វីទៅជារូបធាតុ?" }),
                          e.jsx("p", { className: "text-slate-600 leading-relaxed text-sm sm:text-base", children: "គ្រប់វត្ថុទាំងអស់ដែលនៅជុំវិញខ្លួនយើង មិនថាមានជីវិត ឬគ្មានជីវិត មើលឃើញ ឬមើលមិនឃើញ សុទ្ធតែផ្សំឡើងពីរូបធាតុទាំងអស់។ រូបធាតុជារបស់ដែលមានម៉ាស មាឌ និងទម្ងន់។" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                          e.jsxs("button", { type: "button", onClick: () => i("tab-lesson"), className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer", children: [e.jsx("i", { className: "fa-solid fa-book-open" }), " ចាប់ផ្ដើមរៀន"] }),
                          e.jsxs("button", { type: "button", onClick: () => i("tab-quiz"), className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer", children: [e.jsx("i", { className: "fa-solid fa-clipboard-question" }), " ធ្វើតេស្ត ៤០ QCM"] })
                        ]
                      })
                    ]
                  }),
                  e.jsx("div", {
                    className: "relative",
                    children: e.jsx("img", { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800", alt: "Science", className: "w-full h-auto rounded-3xl shadow-2xl border-4 border-white" })
                  })
                ]
              }),
              e.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                children: [{ icon: "🧊", title: "រឹង (Solid)", desc: "ដូចជា ទឹកកក ថ្ម ដែក សៀវភៅ" }, { icon: "💧", title: "រាវ (Liquid)", desc: "ដូចជា ទឹក ប្រេង ទឹកដោះគោ" }, { icon: "☁️", title: "ឧស្ម័ន (Gas)", desc: "ដូចជា ខ្យល់ ចំហាយទឹក" }].map((item, idx) => e.jsxs("div", {
                  key: idx,
                  className: "p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center space-y-2 hover:shadow-md transition-all",
                  children: [
                    e.jsx("div", { className: "text-4xl mb-2", children: item.icon }),
                    e.jsx("h4", { className: "font-bold text-slate-900 font-moul text-sm", children: item.title }),
                    e.jsx("p", { className: "text-xs text-slate-500", children: item.desc })
                  ]
                }))
              })
            ]
          }) : n === "tab-lesson" ? e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-8",
            children: [
              e.jsxs("section", {
                className: "space-y-4",
                children: [
                  e.jsxs("div", { className: "flex items-center gap-3 border-b-2 border-blue-500 pb-2", children: [e.jsx("span", { className: "text-2xl", children: "១." }), e.jsx("h3", { className: "text-xl font-bold text-slate-900 font-moul", children: "រូបធាតុ (Matter)" })] }),
                  e.jsxs("div", {
                    className: "bg-blue-50 p-6 rounded-3xl border border-blue-100 leading-loose text-slate-800 space-y-3",
                    children: [
                      e.jsx("p", { children: "វត្ថុទាំងឡាយទោះជាភវៈមានជីវិត ឬគ្មានជីវិតក្តី មើលឃើញឬមិនអាចមើលឃើញក្តី ស្ទាបកាន់បាន ឬមិនអាចស្ទាបឬកាន់បានក្តី សុទ្ធតែផ្សំឡើងពីរូបធាតុទាំងអស់។" }),
                      e.jsxs("p", { className: "font-bold text-blue-900 bg-white/70 p-3 rounded-2xl border border-blue-200", children: [e.jsx("span", { className: "bg-blue-200 px-2 py-1 rounded-lg mr-2", children: "💡" }), "រូបធាតុទាំងអស់ផ្សំឡើងពីភាគល្អិតតូចៗ ហៅថា «ធូលី»។"] }),
                      e.jsx("p", { children: "រូបធាតុ គឺជារបស់ទាំងឡាយដែលមានម៉ាស មានមាឌ និងទម្ងន់តាំងក្នុងលំហ។" })
                    ]
                  })
                ]
              }),
              e.jsxs("section", {
                className: "space-y-4",
                children: [
                  e.jsxs("div", { className: "flex items-center gap-3 border-b-2 border-indigo-500 pb-2", children: [e.jsx("span", { className: "text-2xl", children: "២." }), e.jsx("h3", { className: "text-xl font-bold text-slate-900 font-moul", children: "លក្ខណៈរូបនៃរូបធាតុ" })] }),
                  e.jsx("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
                    children: ["ភាពរូប (រឹង រាវ ឧស្ម័ន)", "ពណ៌ (Color)", "រាង (Shape)", "ទំហំ (Size)", "រសជាតិ (Taste)", "ក្លិន (Odor)"].map((l, idx) => e.jsx("div", { key: idx, className: "p-4 bg-white rounded-2xl border border-slate-200 text-center font-bold text-slate-700 text-sm shadow-xs", children: l }))
                  })
                ]
              }),
              e.jsxs("section", {
                className: "space-y-4",
                children: [
                  e.jsxs("div", { className: "flex items-center gap-3 border-b-2 border-emerald-500 pb-2", children: [e.jsx("span", { className: "text-2xl", children: "៣." }), e.jsx("h3", { className: "text-xl font-bold text-slate-900 font-moul", children: "ការប្រែប្រួលនៃរូបធាតុ" })] }),
                  e.jsxs("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                      e.jsxs("div", {
                        className: "p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-2",
                        children: [
                          e.jsx("h4", { className: "font-bold text-emerald-800 font-moul", children: "ក. ការប្រែប្រួលលក្ខណៈរូប" }),
                          e.jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: "នៅពេលរូបធាតុមួយមានការប្រែប្រួលភាពរូប (រឹង រាវ ឧស្ម័ន) ហើយនៅតែរក្សាធាតុផ្សំ ឬធាតុដើមរបស់វាដដែល។" }),
                          e.jsx("div", { className: "text-xs font-bold text-emerald-800 bg-emerald-100 p-2.5 rounded-xl", children: "ឧទាហរណ៍៖ ដុំទឹកកករលាយជាទឹក, ទឹកពុះក្លាយជាចំហាយទឹក" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-2",
                        children: [
                          e.jsx("h4", { className: "font-bold text-rose-800 font-moul", children: "ខ. ការប្រែប្រួលលក្ខណៈគីមី" }),
                          e.jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: "នៅពេលរូបធាតុទាំងឡាយប្រែប្រួលលក្ខណៈដើមរបស់វាទាំងស្រុង ដូចជា ទ្រង់ទ្រាយ ពណ៌ ក្លិន រសជាតិ...។" }),
                          e.jsx("div", { className: "text-xs font-bold text-rose-800 bg-rose-100 p-2.5 rounded-xl", children: "ឧទាហរណ៍៖ ការដុតក្រដាសក្លាយជាផេះ, ដែកគោលច្រែះ" })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }) : n === "tab-states" ? e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-8",
            children: [
              e.jsx("div", {
                className: "flex justify-center gap-3",
                children: Object.keys(matterStates).map(key => e.jsxs("button", {
                  key,
                  type: "button",
                  onClick: () => setActiveMatterState(key),
                  className: `px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${activeMatterState === key ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"}`,
                  children: [e.jsx("span", { children: matterStates[key].icon }), e.jsx("span", { children: matterStates[key].name })]
                }))
              }),
              e.jsxs("div", {
                className: "bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-4",
                    children: [
                      e.jsx("div", { className: "text-5xl", children: matterStates[activeMatterState].icon }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("h3", { className: "text-2xl font-bold font-moul text-slate-900", children: matterStates[activeMatterState].name }),
                          e.jsx("p", { className: "text-sm text-slate-500", children: matterStates[activeMatterState].desc })
                        ]
                      })
                    ]
                  }),
                  e.jsxs("div", {
                    className: "p-4 bg-slate-50 rounded-2xl border border-slate-100",
                    children: [
                      e.jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1", children: "ឧទាហរណ៍ជាក់ស្ដែង" }),
                      e.jsx("p", { className: "text-base font-bold text-slate-700", children: matterStates[activeMatterState].examples })
                    ]
                  })
                ]
              })
            ]
          }) : n === "tab-changes" ? e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-8",
            children: [
              e.jsxs("div", {
                className: "bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200 space-y-4",
                children: [
                  e.jsx("h3", { className: "text-xl font-bold text-amber-900 font-moul", children: "កត្តាដែលធ្វើឱ្យប្រែប្រួលរូបធាតុ" }),
                  e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: [
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-2xl border border-amber-100 space-y-2 shadow-xs",
                        children: [
                          e.jsx("div", { className: "text-3xl", children: "🔥" }),
                          e.jsx("h4", { className: "font-bold text-slate-800 font-moul text-sm", children: "១. កម្ដៅ" }),
                          e.jsx("p", { className: "text-xs text-slate-600", children: "អង្ករដាំក្លាយជាបាយ, ស្ករកម្ដៅក្លាយជាចត់/ច្នាង, សាច់ត្រីយកទៅស្ងោរប្រែពណ៌ក្លិនរសជាតិ" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-2xl border border-amber-100 space-y-2 shadow-xs",
                        children: [
                          e.jsx("div", { className: "text-3xl", children: "🦠" }),
                          e.jsx("h4", { className: "font-bold text-slate-800 font-moul text-sm", children: "២. បាក់តេរី" }),
                          e.jsx("p", { className: "text-xs text-slate-600", children: "បាយដំណើបលាយមេក្លាយជាត្រប៉ែ, ទឹកដោះគោទុកចោលក្លាយជាជូរផ្អូម, ផ្អក ប្រហុក" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "bg-white p-5 rounded-2xl border border-amber-100 space-y-2 shadow-xs",
                        children: [
                          e.jsx("div", { className: "text-3xl", children: "🌧️" }),
                          e.jsx("h4", { className: "font-bold text-slate-800 font-moul text-sm", children: "៣. សារធាតុផ្សេងៗ" }),
                          e.jsx("p", { className: "text-xs text-slate-600", children: "ខ្យល់ធ្វើឱ្យដែកច្រែះ, ទឹកធ្វើឱ្យឈើពុកផុយ, ទឹកភ្លៀងធ្វើឱ្យថ្មសឹកសេចរិល" })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }) : n === "tab-quiz" ? isFinished ? e.jsxs("div", {
            className: "max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-500",
            children: [
              e.jsxs("div", {
                className: "relative inline-block",
                children: [
                  e.jsx("div", { className: "absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-70" }),
                  e.jsx("div", { className: "relative text-8xl mb-4", children: score >= 35 ? "🏆" : score >= 28 ? "🥇" : score >= 20 ? "🥈" : "🥉" })
                ]
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx("h2", { className: "text-3xl font-bold font-moul text-slate-900", children: "អបអរសាទរ!" }),
                  e.jsxs("p", { className: "text-slate-600 text-base", children: ["អ្នកបានបញ្ចប់ការធ្វើតេស្តមេរៀនទី ១២ ដោយទទួលបានពិន្ទុ ", e.jsx("span", { className: "font-bold text-blue-600 text-3xl", children: score }), " ក្នុងចំណោម ", e.jsx("span", { className: "font-bold text-2xl", children: (shuffledQuestions || quizQuestions).length }), " សំណួរ"] }),
                  e.jsx("div", {
                    className: "w-full max-w-sm mx-auto h-3.5 bg-slate-100 rounded-full mt-4 overflow-hidden border border-slate-200",
                    children: e.jsx("div", { className: "h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700", style: { width: `${(score / (shuffledQuestions || quizQuestions).length) * 100}%` } })
                  }),
                  e.jsx("p", { className: "text-xs font-bold text-slate-400 mt-1", children: `អត្រាជោគជ័យ ៖ ${Math.round((score / (shuffledQuestions || quizQuestions).length) * 100)}%` })
                ]
              }),
              e.jsxs("div", {
                className: "flex flex-wrap justify-center gap-4 pt-4",
                children: [
                  e.jsxs("button", {
                    type: "button",
                    onClick: () => {
                      setIsFinished(!1);
                      setUserAnswers({});
                      setCurrentQIndex(0);
                      setShuffledQuestions(shuffleQuiz(quizQuestions));
                      s && s("បានកំណត់តេស្តឡើងវិញ និងឆ្លាស់លំដាប់ចម្លើយ! 🔀");
                    },
                    className: "px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer",
                    children: [e.jsx("i", { className: "fa-solid fa-rotate-right" }), " ធ្វើតេស្តម្ដងទៀត (ឆ្លាស់ចម្លើយ)"]
                  }),
                  e.jsxs("button", {
                    type: "button",
                    onClick: t,
                    className: "px-8 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer",
                    children: [e.jsx("i", { className: "fa-solid fa-xmark" }), " ចាកចេញ"]
                  })
                ]
              })
            ]
          }) : e.jsxs("div", {
            className: "max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500",
            children: [
              // Exam Header & Question Palette
              e.jsxs("div", {
                className: "bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between flex-wrap gap-2",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("h3", { className: "text-base font-bold text-slate-900 font-moul", children: "📝 តេស្តវាស់ស្ទង់សមត្ថភាព ៖ ៤០ សំណួរ QCM" }),
                          e.jsx("p", { className: "text-xs text-slate-500", children: "សំណួរពហុជ្រើសរើស ជំពូកទី ៤ • ការប្រែប្រួលរូបធាតុ" }),
                          e.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              setShuffledQuestions(shuffleQuiz(quizQuestions));
                              setUserAnswers({});
                              setCurrentQIndex(0);
                              s && s("បានឆ្លាស់លំដាប់ចម្លើយដោយជោគជ័យ! 🔀");
                            },
                            className: "mt-2 px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs",
                            title: "ចុចដើម្បីឆ្លាស់ជម្រើសចម្លើយដោយចៃដន្យ",
                            children: [
                              e.jsx("span", { children: "🔀" }),
                              e.jsx("span", { children: "ឆ្លាស់ចម្លើយ (Shuffle Options)" })
                            ]
                          })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2 font-bold text-xs",
                        children: [
                          e.jsxs("span", { className: "px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200", children: ["សំណួរទី ", currentQIndex + 1, " / ៤០"] }),
                          e.jsxs("span", { className: "px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200", children: ["ពិន្ទុ ៖ ", score, " / ៤០"] })
                        ]
                      })
                    ]
                  }),

                  // Question Palette 1-40
                  e.jsx("div", {
                    className: "flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar",
                    children: (shuffledQuestions || quizQuestions).map((q, idx) => {
                      const isAnswered = userAnswers[idx] !== undefined;
                      const isCorrect = isAnswered && q.options[userAnswers[idx]]?.isCorrect;
                      let btnStyle = "bg-slate-100 text-slate-600 border-slate-200";
                      if (currentQIndex === idx) btnStyle = "bg-blue-600 text-white font-extrabold ring-2 ring-blue-400";
                      else if (isAnswered) {
                        btnStyle = isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600";
                      }
                      return e.jsx("button", {
                        key: idx,
                        type: "button",
                        onClick: () => setCurrentQIndex(idx),
                        className: `w-7 h-7 shrink-0 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center justify-center ${btnStyle}`,
                        children: idx + 1
                      });
                    })
                  })
                ]
              }),

              // Question Box
              (() => {
                const curQ = (shuffledQuestions || quizQuestions)[currentQIndex];
                const userChoice = userAnswers[currentQIndex];
                const isAnswered = userChoice !== undefined;
                return e.jsxs("div", {
                  className: "bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsxs("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ៤០"] }),
                        e.jsx("h3", { className: "text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-moul pt-1", children: curQ.question })
                      ]
                    }),

                    // Shuffled Options List
                    e.jsx("div", {
                      className: "space-y-3 pt-1",
                      children: curQ.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        let optStyle = "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200";
                        if (isAnswered) {
                          if (opt.isCorrect) {
                            optStyle = "bg-emerald-500 text-white border-emerald-600 shadow-md font-bold";
                          } else if (isSelected) {
                            optStyle = "bg-rose-500 text-white border-rose-600 shadow-md font-bold";
                          } else {
                            optStyle = "bg-slate-50 text-slate-400 border-slate-200 opacity-60";
                          }
                        }
                        const prefix = ["ក. ", "ខ. ", "គ. ", "ឃ. "][optIdx] || "";
                        return e.jsxs("button", {
                          key: optIdx,
                          type: "button",
                          onClick: () => {
                            if (isAnswered) return;
                            setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
                            if (opt.isCorrect) {
                              playTone(659.25, "sine", 0.25);
                              s && s("ចម្លើយត្រឹមត្រូវ! +50 XP ⭐");
                            } else {
                              playTone(220, "sawtooth", 0.3);
                            }
                          },
                          disabled: isAnswered,
                          className: `w-full text-left p-4 rounded-2xl border-2 text-sm transition-all flex items-center justify-between cursor-pointer ${optStyle}`,
                          children: [
                            e.jsxs("span", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "font-bold shrink-0", children: prefix }),
                                opt.text
                              ]
                            }),
                            isAnswered && (opt.isCorrect ? e.jsx("span", { className: "text-base font-bold", children: "✓" }) : isSelected ? e.jsx("span", { className: "text-base font-bold", children: "✕" }) : null)
                          ]
                        });
                      })
                    }),

                    // Explanation Box
                    isAnswered && e.jsxs("div", {
                      className: `p-4 rounded-2xl text-xs space-y-1.5 animate-in fade-in duration-200 ${curQ.options[userChoice]?.isCorrect ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-rose-50 border border-rose-200 text-rose-900"}`,
                      children: [
                        e.jsx("div", { className: "font-bold flex items-center gap-1.5 text-sm", children: curQ.options[userChoice]?.isCorrect ? "🎉 ពូកែណាស់! ចម្លើយត្រឹមត្រូវ" : "⚠️ មិនទាន់ត្រឹមត្រូវទេ" }),
                        e.jsx("p", { className: "leading-relaxed", children: curQ.explanation })
                      ]
                    }),

                    // Navigation Controls
                    e.jsxs("div", {
                      className: "flex items-center justify-between pt-3 border-t border-slate-100",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => setCurrentQIndex(prev => Math.max(0, prev - 1)),
                          disabled: currentQIndex === 0,
                          className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition cursor-pointer",
                          children: "← សំណួរមុន"
                        }),
                        currentQIndex < (shuffledQuestions || quizQuestions).length - 1 ?
                          e.jsx("button", {
                            type: "button",
                            onClick: () => setCurrentQIndex(prev => Math.min((shuffledQuestions || quizQuestions).length - 1, prev + 1)),
                            className: "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer",
                            children: "សំណួរបន្ទាប់ →"
                          }) :
                          e.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              setIsFinished(!0);
                              playTone(880, "triangle", 0.5);
                              s && s(`បញ្ចប់តេស្ត! អ្នកឆ្លើយត្រូវ ${score} / ៤០ សំណួរ`);
                            },
                            className: "px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5",
                            children: [
                              e.jsx("span", { children: "🏁" }),
                              e.jsx("span", { children: "មើលលទ្ធផលពិន្ទុ" })
                            ]
                          })
                      ]
                    })
                  ]
                });
              })()
            ]
          }) : null
        })
      ]
    })
  });
};
