var Rz13 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "tab-hero" }) => {
  if (!r) return null;
  const [n, i] = y.useState(a);
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  const [isFinished, setIsFinished] = y.useState(!1);
  const [isSpeaking, setIsSpeaking] = y.useState(!1);
  const [soundEnabled, setSoundEnabled] = y.useState(!0);
  const [isFullScreen, setIsFullScreen] = y.useState(!0);

  // Lab 1: Elements state
  const [selectedElement, setSelectedElement] = y.useState("oxygen");

  // Lab 2: Compound Synthesis state
  const [selectedCompound, setSelectedCompound] = y.useState("co2");
  const [isReacting, setIsReacting] = y.useState(!1);
  const [reactionDone, setReactionDone] = y.useState(!1);

  // Lab 3: Mixture Separation state
  const [selectedMixtureMethod, setSelectedMixtureMethod] = y.useState("magnet");
  const [separationStep, setSeparationStep] = y.useState(0);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
      };
    }
  }, [r, n]);

  const quizQuestions = [{"id":1,"question":"សំណួរទី ១ ៖ តើអ្វីទៅដែលហៅថា «ធាតុគីមី»?","options":[{"text":"ផងតូចៗបំផុតរបស់ភាគល្អិតនៃរូបធាតុដែលមិនអាចបំបែកបាន","isCorrect":true},{"text":"រូបធាតុទាំងឡាយដែលកើតឡើងដោយសារតែកម្ដៅភ្លើងឆេះ","isCorrect":false},{"text":"អង្គធាតុរាវដែលមនុស្សផលិតឡើងសម្រាប់ប្រើប្រាស់ប្រចាំថ្ងៃ","isCorrect":false},{"text":"ល្បាយនៃសារធាតុជាច្រើនដែលច្របល់ចូលគ្នាក្នុងដីធម្មជាតិ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ផងតូចៗបំផុតរបស់ភាគល្អិតនៃរូបធាតុដែលមិនអាចបំបែកទៅទៀត ហៅថា «ធាតុគីមី» (ទំព័រ ៨៦)"},{"id":2,"question":"សំណួរទី ២ ៖ បច្ចុប្បន្ននេះ តើអ្នកវិទ្យាសាស្ត្របានរកឃើញធាតុគីមីសរុបចំនួនប៉ុន្មានធាតុ?","options":[{"text":"បានរកឃើញធាតុគីមីសរុបចំនួន ១០៦ ធាតុ","isCorrect":true},{"text":"បានរកឃើញធាតុគីមីសរុបចំនួន ៩០ ធាតុ","isCorrect":false},{"text":"បានរកឃើញធាតុគីមីសរុបចំនួន ១១៨ ធាតុ","isCorrect":false},{"text":"បានរកឃើញធាតុគីមីសរុបចំនួន ៧៥ ធាតុ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ បច្ចុប្បន្ន អ្នកវិទ្យាសាស្ត្របានរកឃើញធាតុគីមីចំនួន ១០៦ ធាតុ (ទំព័រ ៨៦)"},{"id":3,"question":"សំណួរទី ៣ ៖ ក្នុងចំណោមធាតុគីមីទាំង ១០៦ ធាតុ តើមានប៉ុន្មានធាតុដែលរកឃើញក្នុងធម្មជាតិ?","options":[{"text":"មាន ៩០ ធាតុដែលគេរកឃើញនៅក្នុងធម្មជាតិ","isCorrect":true},{"text":"មាន ១៦ ធាតុដែលគេរកឃើញនៅក្នុងធម្មជាតិ","isCorrect":false},{"text":"មាន ៥០ ធាតុដែលគេរកឃើញនៅក្នុងធម្មជាតិ","isCorrect":false},{"text":"មាន ១០៦ ធាតុដែលគេរកឃើញនៅក្នុងធម្មជាតិ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ក្នុងចំណោមធាតុគីមីទាំង ១០៦ ធាតុ មាន ៩០ ធាតុដែលគេរកឃើញនៅក្នុងធម្មជាតិ (ទំព័រ ៨៦)"},{"id":4,"question":"សំណួរទី ៤ ៖ តើធាតុគីមីដែលនៅសល់ក្រៅពី ៩០ ធាតុក្នុងធម្មជាតិ ជាធាតុប្រភេទណា?","options":[{"text":"ជាធាតុគីមីដែលបានមកពីវិធីនិម្មិតក្នុងមន្ទីរពិសោធន៍","isCorrect":true},{"text":"ជាធាតុគីមីដែលធ្លាក់ចុះមកពីលើលំហអាកាសខាងក្រៅ","isCorrect":false},{"text":"ជាធាតុគីមីដែលរលាយបាត់អស់កាលពីរាប់ពាន់ឆ្នាំមុន","isCorrect":false},{"text":"ជាធាតុគីមីដែលរកឃើញតែនៅក្នុងបាតសមុទ្រជ្រៅប៉ុណ្ណោះ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ចំណែកធាតុគីមីដែលនៅសល់ (១៦ ធាតុ) គឺជាធាតុគីមីដែលបានមកពីវិធីនិម្មិត (ទំព័រ ៨៦)"},{"id":5,"question":"សំណួរទី ៥ ៖ តើធាតុគីមីធម្មជាតិទាំង ៩០ ធាតុ គេរកឃើញនៅកន្លែងណាខ្លះ?","options":[{"text":"នៅក្នុងដី ថ្ម ទឹក រុក្ខជាតិ និងក្នុងខ្លួនសត្វ","isCorrect":true},{"text":"នៅក្នុងតែអណ្ដូងរ៉ែមាសជ្រៅក្រោមដីតែមួយគត់","isCorrect":false},{"text":"នៅក្នុងតែផ្សែងរោងចក្រឧស្សាហកម្មធំៗប៉ុណ្ណោះ","isCorrect":false},{"text":"នៅក្នុងតែទឹកសមុទ្រនិងទឹកទន្លេធំៗតែប៉ុណ្ណោះ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ គេរកឃើញនៅក្នុងដី ថ្ម ទឹក រុក្ខជាតិ និងសត្វ (ទំព័រ ៨៦)"},{"id":6,"question":"សំណួរទី ៦ ៖ តើធាតុគីមីអាចធ្វើការបំបែកទៅជាភាគល្អិតតូចជាងនេះទៀតបានដែរឬទេ?","options":[{"text":"គេមិនអាចបំបែកធាតុគីមីឱ្យតូចជាងនេះបានទៀតឡើយ","isCorrect":true},{"text":"គេអាចបំបែកបានយ៉ាងងាយស្រួលដោយការកាត់ជាកង់ៗ","isCorrect":false},{"text":"គេអាចបំបែកបានដោយគ្រាន់តែដាក់ហាលថ្ងៃឱ្យស្ងួត","isCorrect":false},{"text":"គេអាចបំបែកបានដោយការត្រាំទឹកនិងលាយជាមួយខ្សាច់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ គេមិនអាចបំបែកធាតុគីមីបានទៅទៀតទេ។ ផងតូចៗបំផុតរបស់ភាគល្អិតរូបធាតុដែលមិនអាចបំបែកបានហៅថាធាតុគីមី (ទំព័រ ៨៦)"},{"id":7,"question":"សំណួរទី ៧ ៖ តើធាតុគីមី «អុកស៊ីសែន» មានលក្ខណៈសំគាល់យ៉ាងដូចម្ដេច?","options":[{"text":"ជាឧស្ម័នគ្មានក្លិនគ្មានពណ៌ដែលមនុស្សសត្វត្រូវការដកដង្ហើម","isCorrect":true},{"text":"ជារូបធាតុរឹងពណ៌លឿងភ្លឺផ្លេកសម្រាប់ធ្វើជាគ្រឿងអលង្ការ","isCorrect":false},{"text":"ជារូបធាតុរាវពណ៌សថ្លាដែលមនុស្សគ្រប់គ្នាប្រើសម្រាប់ផឹក","isCorrect":false},{"text":"ជាឧស្ម័នពណ៌ខ្មៅមានក្លិនឈួលខ្លាំងដែលភាយចេញពីផ្សែង","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ អុកស៊ីសែន ជាធាតុគីមីបង្កើតបានជារូបធាតុឧស្ម័ន គ្មានក្លិន គ្មានពណ៌ ដែលមនុស្សនិងសត្វត្រូវការដកដង្ហើម (ទំព័រ ៨៦)"},{"id":8,"question":"សំណួរទី ៨ ៖ តើធាតុគីមី «មាស» មានលក្ខណៈរូប និងការប្រើប្រាស់ដូចម្ដេច?","options":[{"text":"ជារូបធាតុរឹងពណ៌លឿងភ្លឺរលោងប្រើធ្វើជាគ្រឿងអលង្ការ","isCorrect":true},{"text":"ជារូបធាតុរឹងពណ៌ក្រហមត្នោតប្រើធ្វើខ្សែចម្លងអគ្គិសនី","isCorrect":false},{"text":"ជារូបធាតុរឹងពណ៌ប្រផេះប្រើសម្រាប់ធ្វើជាគ្រឿងប្រក់ផ្ទះ","isCorrect":false},{"text":"ជារូបធាតុរឹងពណ៌សភ្លឺប្រើសម្រាប់ធ្វើចាននិងស្លាបព្រា","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ មាស ជារូបធាតុរឹង ពណ៌លឿង ភ្លឺរលោង ដែលគេច្រើនយកមកធ្វើជាគ្រឿងអលង្ការ ខ្សែ ក ខ្សែដៃ (ទំព័រ ៨៦)"},{"id":9,"question":"សំណួរទី ៩ ៖ តើធាតុគីមី «ប្រាក់» មានលក្ខណៈរូប និងការប្រើប្រាស់ដូចម្ដេច?","options":[{"text":"ជារូបធាតុរឹងពណ៌ប្រាក់ប្រើធ្វើប្រដាប់ស្ពាផ្តិលនិងគ្រឿងអលង្ការ","isCorrect":true},{"text":"ជារូបធាតុរឹងពណ៌ខ្មៅប្រើសម្រាប់ធ្វើបណ្តូលខ្មៅដៃថ្មពិល","isCorrect":false},{"text":"ជារូបធាតុរាវគ្មានពណ៌ដែលគេយកទៅប្រើធ្វើជាប្រេងឥន្ធនៈ","isCorrect":false},{"text":"ជារូបធាតុរឹងពណ៌លឿងទន់ដែលងាយនឹងរលាយក្នុងទឹកត្រជាក់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ប្រាក់ ជារូបធាតុរឹងពណ៌ប្រាក់ ដែលគេច្រើនយកមកធ្វើជាប្រដាប់ស្ពា ផ្តិលប្រាក់ ខ្សែ ក ខ្សែដៃ (ទំព័រ ៨៦)"},{"id":10,"question":"សំណួរទី ១០ ៖ តើធាតុគីមី «ទង់ដែង» មានលក្ខណៈរូប និងការប្រើប្រាស់ដូចម្ដេច?","options":[{"text":"ជារូបធាតុរឹងពណ៌ក្រហមត្នោតប្រើធ្វើជាខ្សែចម្លងអគ្គិសនី","isCorrect":true},{"text":"ជារូបធាតុរឹងពណ៌ប្រផេះប្រើសម្រាប់ធ្វើជាគ្រឿងប្រក់ដំបូល","isCorrect":false},{"text":"ជារូបធាតុឧស្ម័នគ្មានក្លិនប្រើសម្រាប់មនុស្សដកដង្ហើមរាល់ថ្ងៃ","isCorrect":false},{"text":"ជារូបធាតុរឹងពណ៌ខ្មៅប្រើសម្រាប់ធ្វើបណ្តូលថ្មពិលពិលហោប៉ៅ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ទង់ដែង ជារូបធាតុរឹង ពណ៌ក្រហមត្នោត ដែលគេច្រើនយកមកធ្វើជាខ្សែចម្លងចរន្តអគ្គិសនី (ទំព័រ ៨៦)"},{"id":11,"question":"សំណួរទី ១១ ៖ តើធាតុគីមី «ស័ង្កសី» គេនិយមយកទៅប្រើប្រាស់ធ្វើជាអ្វី?","options":[{"text":"ជារូបធាតុរឹងពណ៌ប្រផេះគេច្រើនយកទៅធ្វើជាគ្រឿងប្រក់ផ្ទះ","isCorrect":true},{"text":"ជារូបធាតុរឹងពណ៌លឿងភ្លឺគេច្រើនយកទៅធ្វើជាគ្រឿងអលង្ការ","isCorrect":false},{"text":"ជារូបធាតុរឹងពណ៌សថ្លាគេច្រើនយកទៅធ្វើជាកែវឆ្លុះមើល","isCorrect":false},{"text":"ជារូបធាតុឧស្ម័នស្រាលគេច្រើនយកទៅបង្ហោះប៉េងប៉ោងលេង","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ស័ង្កសី ជារូបធាតុរឹងពណ៌ប្រផេះ ដែលគេច្រើនយកវាទៅធ្វើជាគ្រឿងប្រក់ផ្ទះ (ទំព័រ ៨៦)"},{"id":12,"question":"សំណួរទី ១២ ៖ តើធាតុគីមី «អាលុយមីញ៉ូម» គេនិយមយកទៅកែច្នៃធ្វើជាសម្ភារៈអ្វីខ្លះ?","options":[{"text":"ជារូបធាតុរឹងពណ៌សភ្លឺគេច្រើនយកមកធ្វើជាចានស្លាបព្រានិងឆ្នាំង","isCorrect":true},{"text":"ជារូបធាតុរឹងពណ៌ខ្មៅគេច្រើនយកមកធ្វើជាខ្សែចម្លងអគ្គិសនីធំៗ","isCorrect":false},{"text":"ជារូបធាតុរឹងពណ៌លឿងគេច្រើនយកមកធ្វើជាកាក់ប្រាក់បុរាណ","isCorrect":false},{"text":"ជារូបធាតុរាវពណ៌សគេច្រើនយកមកលាយធ្វើជាទឹកថ្នាំលាបជញ្ជាំង","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ អាលុយមីញ៉ូម ជារូបធាតុរឹងពណ៌សភ្លឺ ដែលគេច្រើនយកមកធ្វើជាចាន ស្លាបព្រា ឆ្នាំង (ទំព័រ ៨៦)"},{"id":13,"question":"សំណួរទី ១៣ ៖ តើធាតុគីមី «កាបូន» គេយកទៅប្រើប្រាស់ធ្វើជាអ្វីក្នុងជីវភាព?","options":[{"text":"ជារូបធាតុរឹងពណ៌ខ្មៅគេយកទៅធ្វើជាបណ្តូលខ្មៅដៃនិងថ្មពិល","isCorrect":true},{"text":"ជារូបធាតុរឹងពណ៌ក្រហមគេយកទៅធ្វើជាខ្សែភ្លើងតាមផ្ទះ","isCorrect":false},{"text":"ជារូបធាតុរឹងពណ៌លឿងគេយកទៅច្នៃជាគ្រឿងអលង្ការពាក់ក","isCorrect":false},{"text":"ជារូបធាតុឧស្ម័នគ្មានក្លិនសម្រាប់ជួយក្នុងការដកដង្ហើម","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ កាបូន ជារូបធាតុរឹងពណ៌ខ្មៅ ដែលគេយកទៅធ្វើជាបណ្តូលខ្មៅដៃ បណ្តូលថ្មពិល (ទំព័រ ៨៦)"},{"id":14,"question":"សំណួរទី ១៤ ៖ ក្រៅពីធ្វើបណ្តូលខ្មៅដៃ តើកាបូនមានសារៈសំខាន់យ៉ាងដូចម្ដេចចំពោះភាវៈរស់?","options":[{"text":"ជាធាតុបង្កយ៉ាងសំខាន់បំផុតរបស់មនុស្សសត្វនិងរុក្ខជាតិ","isCorrect":true},{"text":"ជាឧស្ម័នដែលរុក្ខជាតិស្រូបយកសម្រាប់ដកដង្ហើមនៅពេលយប់","isCorrect":false},{"text":"ជាសារធាតុដែលជួយឱ្យទឹកកករលាយលឿនក្នុងពេលមានថ្ងៃក្តៅ","isCorrect":false},{"text":"ជាសារធាតុរាវដែលជួយឱ្យរុក្ខជាតិអាចបញ្ចេញផ្កាផ្លែបានល្អ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ កាបូនជាធាតុបង្កយ៉ាងសំខាន់របស់មនុស្ស សត្វ និងរុក្ខជាតិ (ទំព័រ ៨៦)"},{"id":15,"question":"សំណួរទី ១៥ ៖ យោងតាមសៀវភៅពុម្ព តើរូបធាតុទាំងអស់សុទ្ធតែផ្សំឡើងពីអ្វី?","options":[{"text":"សុទ្ធតែផ្សំឡើងពីធាតុគីមីជាច្រើនផ្តុំចូលគ្នា","isCorrect":true},{"text":"សុទ្ធតែផ្សំឡើងពីកម្ដៅថ្ងៃនិងទឹកភ្លៀងផ្គុំគ្នា","isCorrect":false},{"text":"សុទ្ធតែផ្សំឡើងពីខ្យល់អាកាសបរិសុទ្ធតែមួយគត់","isCorrect":false},{"text":"សុទ្ធតែផ្សំឡើងពីធូលីដីនិងកម្ទេចថ្មល្អិតៗ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ រូបធាតុទាំងអស់សុទ្ធតែផ្សំឡើងពីធាតុគីមីជាច្រើន (ទំព័រ ៨៦)"},{"id":16,"question":"សំណួរទី ១៦ ៖ តើអ្វីទៅដែលហៅថា «អង្គធាតុសុទ្ធ»?","options":[{"text":"ជារូបធាតុដែលផ្សំឡើងដោយធាតុគីមីតែមួយប្រភេទគត់","isCorrect":true},{"text":"ជារូបធាតុដែលផ្សំឡើងដោយធាតុគីមីរាប់សិបមុខច្របល់គ្នា","isCorrect":false},{"text":"ជារូបធាតុដែលមិនមានម៉ាសនិងគ្មានមាឌកំណត់ច្បាស់លាស់","isCorrect":false},{"text":"ជារូបធាតុដែលកើតចេញពីការលាយទឹកនិងដីខ្សាច់ចូលគ្នា","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ អង្គធាតុសុទ្ធ ជារូបធាតុដែលផ្សំឡើងដោយធាតុគីមីតែមួយប្រភេទ (ទំព័រ ៨៦)"},{"id":17,"question":"សំណួរទី ១៧ ៖ តើគេបែងចែក «អង្គធាតុសុទ្ធ» ជាប៉ុន្មានប្រភេទ?","options":[{"text":"ចែកជា ២ គឺ អង្គធាតុទោល និង អង្គធាតុសមាស","isCorrect":true},{"text":"ចែកជា ២ គឺ អង្គធាតុរឹង និង អង្គធាតុរាវ","isCorrect":false},{"text":"ចែកជា ២ គឺ អង្គធាតុធម្មជាតិ និង អង្គធាតុនិម្មិត","isCorrect":false},{"text":"ចែកជា ៣ គឺ អង្គធាតុរឹង អង្គធាតុរាវ និង ឧស្ម័ន","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ គេចែកអង្គធាតុសុទ្ធជាពីរគឺ អង្គធាតុទោល និងអង្គធាតុសមាសឬសមាសធាតុ (ទំព័រ ៨៦)"},{"id":18,"question":"សំណួរទី ១៨ ៖ តើអ្វីទៅដែលហៅថា «អង្គធាតុទោល»?","options":[{"text":"ជាអង្គធាតុទាំងឡាយណាដែលបង្កឡើងពីធាតុគីមីតែមួយប្រភេទ","isCorrect":true},{"text":"ជាអង្គធាតុទាំងឡាយណាដែលបង្កឡើងពីធាតុគីមីច្រើនប្រភេទ","isCorrect":false},{"text":"ជាអង្គធាតុទាំងឡាយណាដែលមិនមានរូបរាងនិងគ្មានមាឌឡើយ","isCorrect":false},{"text":"ជាអង្គធាតុទាំងឡាយណាដែលរលាយចូលគ្នាក្នុងទឹកបានល្អ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ អង្គធាតុទោល ជាអង្គធាតុទាំងឡាយណាដែលបង្កឡើងពីធាតុគីមីតែមួយប្រភេទ (ទំព័រ ៨៦)"},{"id":19,"question":"សំណួរទី ១៩ ៖ តើមួយណាជាឧទាហរណ៍នៃ «អង្គធាតុទោល» យោងតាមសៀវភៅពុម្ព?","options":[{"text":"ដុំមាសសុទ្ធ ដុំប្រាក់សុទ្ធ និង ដុំទង់ដែងសុទ្ធ","isCorrect":true},{"text":"ទឹកបរិសុទ្ធ ឧស្ម័នកាបូនិច និង ស្ករសរលាយ","isCorrect":false},{"text":"ទឹកអំបិល ទឹកស្ករ និង ទឹកសម្លដែលទើបតែដាំពុះ","isCorrect":false},{"text":"ដីខ្សាច់លាយទឹក អង្ករលាយគ្រាប់សណ្តែក និង ប្រេង","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ដុំមាស ដុំប្រាក់ ដុំទង់ដែង សុទ្ធតែជាអង្គធាតុទោលព្រោះបង្កឡើងពីធាតុគីមីតែមួយប្រភេទ (ទំព័រ ៨៦)"},{"id":20,"question":"សំណួរទី ២០ ៖ ភាគល្អិតតូចៗនៃមាសតែមួយប្រភេទជាច្រើនផ្តុំគ្នា បង្កើតបានជាអ្វី?","options":[{"text":"បង្កើតបានជាអង្គធាតុទោលនៃធាតុតែមួយប្រភេទគឺដុំមាស","isCorrect":true},{"text":"បង្កើតបានជាសមាសធាតុគីមីថ្មីមួយដែលមានឈ្មោះថាទឹក","isCorrect":false},{"text":"បង្កើតបានជាល្បាយមិនស្មើរសាច់រវាងមាសនិងដីខ្សាច់","isCorrect":false},{"text":"បង្កើតបានជាឧស្ម័នគ្មានពណ៌សម្រាប់ដកដង្ហើមរាល់ថ្ងៃ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ធាតុគីមីរបស់មាសច្រើនផ្តុំគ្នា បង្កើតបានជាភាគល្អិតនៃមាស ហើយផ្តុំគ្នាបានជាដុំមាស (ទំព័រ ៨៦)"},{"id":21,"question":"សំណួរទី ២១ ៖ តើអ្វីទៅដែលហៅថា «អង្គធាតុសមាស ឬ សមាសធាតុ»?","options":[{"text":"ជាអង្គធាតុទាំងឡាយណាដែលផ្សំឡើងពីធាតុគីមីជាច្រើនប្រភេទ","isCorrect":true},{"text":"ជាអង្គធាតុទាំងឡាយណាដែលបង្កឡើងពីធាតុគីមីតែមួយប្រភេទ","isCorrect":false},{"text":"ជារូបធាតុរឹងទាំងឡាយណាដែលមិនអាចរលាយក្នុងទឹកបានឡើយ","isCorrect":false},{"text":"ជារូបធាតុទាំងឡាយណាដែលមានតែក្នុងរុក្ខជាតិតែមួយគត់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ អង្គធាតុសមាសឬសមាសធាតុ គឺជាអង្គធាតុទាំងឡាយណាដែលផ្សំឡើងពីធាតុគីមីជាច្រើនប្រភេទ (ទំព័រ ៨៦)"},{"id":22,"question":"សំណួរទី ២២ ៖ តើ «ឧស្ម័នកាបូនិច» ផ្សំឡើងពីធាតុគីមីអ្វីខ្លះ?","options":[{"text":"ផ្សំឡើងពីធាតុគីមីកាបូន ផ្គុំជាមួយធាតុគីមីអុកស៊ីសែន","isCorrect":true},{"text":"ផ្សំឡើងពីធាតុគីមីមាស ផ្គុំជាមួយធាតុគីមីទង់ដែង","isCorrect":false},{"text":"ផ្សំឡើងពីធាតុគីមីអ៊ីដ្រូសែន ផ្គុំជាមួយធាតុគីមីស័ង្កសី","isCorrect":false},{"text":"ផ្សំឡើងពីធាតុគីមីប្រាក់ ផ្គុំជាមួយធាតុគីមីអាលុយមីញ៉ូម","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ភាគល្អិតនៃអុកស៊ីសែនច្រើនផ្តុំគ្នាជាមួយធាតុគីមីនៃកាបូនច្រើន បង្កើតបានជាឧស្ម័នកាបូនិច (ទំព័រ ៨៦)"},{"id":23,"question":"សំណួរទី ២៣ ៖ តើ «ទឹក» ផ្សំឡើងពីធាតុគីមីអ្វីខ្លះផ្គុំចូលគ្នា?","options":[{"text":"ផ្សំឡើងពីធាតុគីមីអ៊ីដ្រូសែន ផ្គុំជាមួយធាតុគីមីអុកស៊ីសែន","isCorrect":true},{"text":"ផ្សំឡើងពីធាតុគីមីកាបូន ផ្គុំជាមួយធាតុគីមីទង់ដែង","isCorrect":false},{"text":"ផ្សំឡើងពីធាតុគីមីស័ង្កសី ផ្គុំជាមួយធាតុគីមីអាលុយមីញ៉ូម","isCorrect":false},{"text":"ផ្សំឡើងពីធាតុគីមីមាស ផ្គុំជាមួយធាតុគីមីប្រាក់សុទ្ធ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ធាតុគីមីអ៊ីដ្រូសែនច្រើនផ្តុំគ្នាជាមួយធាតុគីមីអុកស៊ីសែនច្រើន បង្កើតបានជាទឹក (ទំព័រ ៨៧)"},{"id":24,"question":"សំណួរទី ២៤ ៖ តើ «ស្ករ» ផ្សំឡើងពីធាតុគីមីសំខាន់ៗចំនួនប៉ុន្មានប្រភេទ?","options":[{"text":"ផ្សំឡើងពី ៣ ប្រភេទ គឺ កាបូន អ៊ីដ្រូសែន និង អុកស៊ីសែន","isCorrect":true},{"text":"ផ្សំឡើងពី ២ ប្រភេទ គឺ ទង់ដែង និង អាលុយមីញ៉ូម","isCorrect":false},{"text":"ផ្សំឡើងពី ១ ប្រភេទ គឺ ធាតុគីមីស្ករតែមួយមុខគត់","isCorrect":false},{"text":"ផ្សំឡើងពី ៤ ប្រភេទ គឺ មាស ប្រាក់ ស័ង្កសី និង ដែក","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ធាតុគីមីកាបូនច្រើនផ្តុំគ្នាជាមួយធាតុគីមីអ៊ីដ្រូសែនច្រើន និងធាតុគីមីអុកស៊ីសែនច្រើន បង្កើតបានជាស្ករ (ទំព័រ ៨៧)"},{"id":25,"question":"សំណួរទី ២៥ ៖ តើអ្វីទៅដែលហៅថា «ល្បាយ» យោងតាមសៀវភៅពុម្ពវិទ្យាសាស្ត្រ?","options":[{"text":"ការច្របល់ចូលគ្នានៃអង្គធាតុពីរឬច្រើនដែលគ្មានប្រតិកម្មគីមី","isCorrect":true},{"text":"ការផ្សំធាតុគីមីពីរឬច្រើនបង្កើតបានជាសារធាតុថ្មីស្រឡាង","isCorrect":false},{"text":"អង្គធាតុសុទ្ធដែលកកើតឡើងពីធាតុគីមីតែមួយមុខគត់","isCorrect":false},{"text":"ការដុតកម្ដៅអង្គធាតុរឹងមួយឱ្យក្លាយជាឧស្ម័នហួតអស់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ល្បាយកើតពីការច្របល់ចូលគ្នារវាងអង្គធាតុពីរ ឬច្រើនដែលមិនមានប្រតិកម្មគីមីរវាងគ្នានិងគ្នា (ទំព័រ ៨៧)"},{"id":26,"question":"សំណួរទី ២៦ ៖ នៅក្នុងល្បាយ តើអង្គធាតុនីមួយៗដែលផ្សំវាមានលក្ខណៈដូចម្ដេច?","options":[{"text":"អង្គធាតុនីមួយៗនៅតែរក្សាលក្ខណៈដើមរបស់វាដដែល","isCorrect":true},{"text":"អង្គធាតុនីមួយៗត្រូវផ្លាស់ប្តូរលក្ខណៈដើមបាត់ទាំងស្រុង","isCorrect":false},{"text":"អង្គធាតុនីមួយៗនឹងត្រូវរលាយក្លាយជាឧស្ម័នគ្មានពណ៌","isCorrect":false},{"text":"អង្គធាតុនីមួយៗនឹងបង្កើតជាធាតុគីមីថ្មីដែលបំបែកលែងបាន","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ក្នុងល្បាយ អង្គធាតុនីមួយៗនៅតែរក្សាលក្ខណៈដើមរបស់វាដដែល ព្រោះគ្មានប្រតិកម្មគីមីឡើយ (ទំព័រ ៨៧)"},{"id":27,"question":"សំណួរទី ២៧ ៖ តើគេបែងចែក «ល្បាយ» ជាប៉ុន្មានប្រភេទធំៗ?","options":[{"text":"ចែកជា ២ គឺ ល្បាយស្មើរសាច់ និង ល្បាយមិនស្មើរសាច់","isCorrect":true},{"text":"ចែកជា ២ គឺ ល្បាយរឹង និង ល្បាយឧស្ម័នហួត","isCorrect":false},{"text":"ចែកជា ៣ គឺ ល្បាយផ្អែម ល្បាយប្រៃ និង ល្បាយជូរ","isCorrect":false},{"text":"ចែកជា ២ គឺ ល្បាយធម្មជាតិ និង ល្បាយបច្ចេកវិទ្យា","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ គេចែកល្បាយជាពីរ គឺ ល្បាយស្មើរសាច់ និង ល្បាយមិនស្មើរសាច់ (ទំព័រ ៨៧)"},{"id":28,"question":"សំណួរទី ២៨ ៖ តើអ្វីទៅដែលហៅថា «ល្បាយស្មើរសាច់»?","options":[{"text":"ជាល្បាយដែលយើងមិនអាចមើលឃើញភាពខុសគ្នានៃភាគល្អិតផ្សំ","isCorrect":true},{"text":"ជាល្បាយដែលយើងអាចមើលឃើញភាគល្អិតនីមួយៗដោយភ្នែកទទេ","isCorrect":false},{"text":"ជាល្បាយដែលមិនអាចរលាយចូលគ្នាក្នុងមជ្ឈដ្ឋានណាមួយបាន","isCorrect":false},{"text":"ជាល្បាយដែលកកើតឡើងពីលោហធាតុរឹងពីរប្រភេទច្របល់គ្នា","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ល្បាយស្មើរសាច់ ជាល្បាយដែលយើងមិនអាចមើលឃើញភាពខុសគ្នារវាងភាគល្អិតដែលផ្សំវាឡើយ (ទំព័រ ៨៧)"},{"id":29,"question":"សំណួរទី ២៩ ៖ តើមួយណាជាឧទាហរណ៍នៃ «ល្បាយស្មើរសាច់»?","options":[{"text":"ទឹកលាយស្ករ ឬ ទឹកលាយអំបិលរលាយសព្វ","isCorrect":true},{"text":"ទឹកលាយប្រេងឆា ឬ ទឹកលាយដីខ្សាច់ម៉ដ្ឋ","isCorrect":false},{"text":"អង្ករលាយគ្រាប់សណ្តែក ឬ ក្រួសលាយដី","isCorrect":false},{"text":"ស្លឹកឈើលាយទឹក ឬ ម្សៅដែកលាយខ្សាច់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ទឹកស្ករ ឬ ទឹកអំបិល ជាល្បាយស្មើរសាច់ ព្រោះមើលមិនឃើញភាពខុសគ្នារវាងភាគល្អិតទឹកនិងស្ករ/អំបិលឡើយ (ទំព័រ ៨៧)"},{"id":30,"question":"សំណួរទី ៣០ ៖ តើអ្វីទៅដែលហៅថា «ល្បាយមិនស្មើរសាច់»?","options":[{"text":"ជាល្បាយដែលអាចមើលឃើញភាពខុសគ្នានៃភាគល្អិតដោយភ្នែកទទេ","isCorrect":true},{"text":"ជាល្បាយដែលភាគល្អិតទាំងអស់រលាយសព្វមើលមិនដាច់ពីគ្នា","isCorrect":false},{"text":"ជាអង្គធាតុសុទ្ធដែលផ្សំឡើងពីធាតុគីមីតែមួយមុខគត់","isCorrect":false},{"text":"ជាសមាសធាតុគីមីដែលបង្កើតឡើងដោយសារប្រតិកម្មកម្ដៅ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ល្បាយមិនស្មើរសាច់ ជាល្បាយដែលយើងអាចមើលឃើញភាពខុសគ្នានៃភាគល្អិតដែលផ្សំវាដោយភ្នែកទទេ ឬកែវពង្រីក (ទំព័រ ៨៧)"},{"id":31,"question":"សំណួរទី ៣១ ៖ តើមួយណាជាឧទាហរណ៍ជាក់ស្ដែងនៃ «ល្បាយមិនស្មើរសាច់»?","options":[{"text":"អង្ករលាយខ្សាច់ ទឹកលាយខ្សាច់ និង ទឹកលាយប្រេង","isCorrect":true},{"text":"ទឹកស្កររលាយសព្វ ទឹកអំបិលថ្លា និង ខ្យល់បរិសុទ្ធ","isCorrect":false},{"text":"ដុំមាសសុទ្ធ ដុំប្រាក់សុទ្ធ និង ដុំទង់ដែងសុទ្ធ","isCorrect":false},{"text":"ឧស្ម័នកាបូនិចបរិសុទ្ធ និង ទឹកសុទ្ធគ្មានមេរោគ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ អង្ករលាយខ្សាច់ ទឹកលាយខ្សាច់ ទឹកលាយប្រេង សុទ្ធតែជាល្បាយមិនស្មើរសាច់ (ទំព័រ ៨៧)"},{"id":32,"question":"សំណួរទី ៣២ ៖ តើការជ្រើសរើសវិធីញែកល្បាយត្រូវពឹងផ្អែកលើកត្តាអ្វីជាចម្បង?","options":[{"text":"អាស្រ័យលើលក្ខណៈរូបនៃអង្គធាតុនីមួយៗក្នុងល្បាយ","isCorrect":true},{"text":"អាស្រ័យលើតម្លៃនៅលើទីផ្សារនៃអង្គធាតុនីមួយៗ","isCorrect":false},{"text":"អាស្រ័យលើទំហំនៃភាជន៍ដែលយកមកផ្ទុកល្បាយនោះ","isCorrect":false},{"text":"អាស្រ័យលើពេលវេលានិងរដូវកាលនៃឆ្នាំនីមួយៗ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ដើម្បីញែកអង្គធាតុដែលផ្សំល្បាយចេញពីគ្នា គេអាចប្រើវិធីសាស្ត្រផ្សេងៗអាស្រ័យលើលក្ខណៈរូបនៃអង្គធាតុនីមួយៗ (ទំព័រ ៨៨)"},{"id":33,"question":"សំណួរទី ៣៣ ៖ តើវិធីណាដែលល្អបំផុតសម្រាប់ញែក «ម្សៅដែក» ចេញពីល្បាយម្សៅដែកនិងខ្សាច់?","options":[{"text":"វិធីប្រើមេដែកដើម្បីឆក់ទាញយកម្សៅដែកចេញ","isCorrect":true},{"text":"វិធីចម្រុះដោយប្រើក្រដាសច្រោះទឹកធម្មតា","isCorrect":false},{"text":"វិធីរំហួតដោយដុតកម្ដៅភ្លើងឱ្យខ្សាច់ហួត","isCorrect":false},{"text":"វិធីចាក់ទឹកលាងឱ្យម្សៅដែករលាយបាត់អស់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ វិធីប្រើមេដែក សម្រាប់ញែកអង្គធាតុដែលមានជាតិដែកចេញពីអង្គធាតុផ្សេង (ទំព័រ ៨៨)"},{"id":34,"question":"សំណួរទី ៣៤ ៖ តើ «វិធីចម្រុះ» ត្រូវបានគេប្រើប្រាស់ដើម្បីញែកអ្វីចេញពីអ្វី?","options":[{"text":"ញែកអង្គធាតុរឹងមិនរលាយចេញពីរាវដោយប្រើក្រដាសចម្រុះ","isCorrect":true},{"text":"ញែកអង្គធាតុរឹងដែលរលាយសព្វចេញពីរាវដោយដុតកម្ដៅ","isCorrect":false},{"text":"ញែកអង្គធាតុដែលមានជាតិដែកដោយប្រើកម្លាំងស្រូប","isCorrect":false},{"text":"ញែកឧស្ម័នពីរប្រភេទដែលមានក្លិនដូចគ្នាចេញពីគ្នា","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ វិធីចម្រុះ សម្រាប់ញែកអង្គធាតុរឹងដែលមិនរលាយចេញពីរាវ ដោយប្រើក្រដាសចម្រុះ ដូចជាទឹកលាយខ្សាច់ (ទំព័រ ៨៨)"},{"id":35,"question":"សំណួរទី ៣៥ ៖ នៅពេលទឹកល្អក់ត្រូវទុកឱ្យនៅស្ងៀមមួយកន្លែង តើគេប្រើវិធីណាដើម្បីញែកយកទឹកថ្លា?","options":[{"text":"វិធីកំណកកុាមឬរងថ្លា រួចចាក់ទឹកថ្លាខាងលើចេញ","isCorrect":true},{"text":"វិធីប្រើមេដែកដើម្បីស្រូបយកដីល្អក់ចេញពីទឹក","isCorrect":false},{"text":"វិធីដុតរម្ងាស់ឱ្យទឹកហួតអស់សល់តែកករដីកខ្វក់","isCorrect":false},{"text":"វិធីកូរឱ្យខ្លាំងដើម្បីឱ្យដីរលាយចូលក្នុងទឹកសព្វ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ វិធីកំណកកុាម ឬរងថ្លា គឺទុកឱ្យអង្គធាតុរឹងធ្លាក់ចុះបាត រួចចាក់ទឹកថ្លាខាងលើចេញ (ទំព័រ ៨៨)"},{"id":36,"question":"សំណួរទី ៣៦ ៖ តើវិធីណាដែលគេប្រើដើម្បីប្រមូលយក «អំបិល» ចេញពីទឹកសមុទ្រ ឬទឹកអំបិល?","options":[{"text":"វិធីរំហួត ដោយដុតកម្ដៅឬហាលថ្ងៃរហូតទាល់តែទឹកហួតអស់","isCorrect":true},{"text":"វិធីចម្រុះ ដោយយកក្រដាសច្រោះមកច្រោះយកអំបិលចេញ","isCorrect":false},{"text":"វិធីប្រើមេដែក ដើម្បីស្រូបទាញយកគ្រាប់អំបិលចេញ","isCorrect":false},{"text":"វិធីរងថ្លា ដោយទុកទឹកអំបិលឱ្យនៅស្ងៀមឱ្យអំបិលធ្លាក់","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ វិធីរំហួត សម្រាប់ញែកអង្គធាតុរឹងដែលរលាយក្នុងអង្គធាតុរាវ ដោយកម្ដៅរហូតទាល់តែរាវហួតអស់ (ទំព័រ ៨៨)"},{"id":37,"question":"សំណួរទី ៣៧ ៖ តើ «វិធីបំណិត» ត្រូវបានគេប្រើប្រាស់ក្នុងគោលបំណងអ្វី?","options":[{"text":"ញែកអង្គធាតុរាវមានចំណុចរំពុះខុសគ្នាឬយកទឹកសុទ្ធ","isCorrect":true},{"text":"ញែកកម្ទេចដែកចេញពីដីខ្សាច់ដោយប្រើកម្លាំងស្រូប","isCorrect":false},{"text":"ញែកដីខ្សាច់ធំៗចេញពីទឹកល្អក់ដោយទុកឱ្យនៅស្ងៀម","isCorrect":false},{"text":"ញែកគ្រាប់អង្ករចេញពីគ្រាប់សណ្តែកដោយប្រើតម្រង","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ វិធីបំណិត សម្រាប់ញែកអង្គធាតុរាវដែលមានចំណុចរំពុះខុសគ្នា ឬប្រមូលយកទឹកសុទ្ធពីទឹកអំបិល (ទំព័រ ៨៨)"},{"id":38,"question":"សំណួរទី ៣៨ ៖ តើចំណុចខុសគ្នាសំខាន់បំផុតរវាង «សមាសធាតុ» និង «ល្បាយ» គឺជាអ្វី?","options":[{"text":"សមាសធាតុកើតពីប្រតិកម្មគីមី រីឯល្បាយគ្មានប្រតិកម្មគីមី","isCorrect":true},{"text":"សមាសធាតុមានតែភាពរឹង រីឯល្បាយមានតែភាពរាវតែមួយគត់","isCorrect":false},{"text":"សមាសធាតុងាយញែកជាងល្បាយដោយប្រើក្រដាសច្រោះទឹក","isCorrect":false},{"text":"សមាសធាតុរក្សាលក្ខណៈដើម រីឯល្បាយបាត់បង់លក្ខណៈដើម","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ សមាសធាតុកើតពីធាតុគីមីផ្សំគ្នាដោយប្រតិកម្មគីមី (កើតសារធាតុថ្មី) រីឯល្បាយគ្រាន់តែច្របល់ចូលគ្នាដោយរក្សាលក្ខណៈដើម (ទំព័រ ៨៦-៨៧)"},{"id":39,"question":"សំណួរទី ៣៩ ៖ ប្រសិនបើយើងមានល្បាយទឹក ខ្សាច់ និងអំបិល តើយើងគួរញែកតាមលំដាប់ណា?","options":[{"text":"ច្រោះយកខ្សាច់ចេញសិន រួចយករាវទៅរំហួតយកអំបិល","isCorrect":true},{"text":"យករំហួតយកអំបិលចេញមុន រួចទើបយកទៅច្រោះខ្សាច់","isCorrect":false},{"text":"ប្រើមេដែកស្រូបយកខ្សាច់ចេញ រួចទុកឱ្យអំបិលរងថ្លា","isCorrect":false},{"text":"មិនអាចញែកចេញពីគ្នាបានឡើយព្រោះលាយចូលគ្នាសព្វ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ត្រូវប្រើវិធីចម្រុះច្រោះយកខ្សាច់ចេញមុន រួចទើបយកទឹកអំបិលដែលច្រោះបានទៅដុតរំហួតដើម្បីបានអំបិល (ទំព័រ ៨៨)"},{"id":40,"question":"សំណួរទី ៤០ ៖ តើការយល់ដឹងពីវិធីញែកល្បាយ ផ្តល់សារៈប្រយោជន៍អ្វីខ្លះក្នុងជីវភាពរស់នៅ?","options":[{"text":"ជួយក្នុងការផលិតអំបិល បន្សុទ្ធទឹកស្អាត និងកែច្នៃលោហៈ","isCorrect":true},{"text":"ជួយតែក្នុងការដុតបណ្តូលខ្មៅដៃឱ្យឆេះលឿនជាងមុនប៉ុណ្ណោះ","isCorrect":false},{"text":"ជួយតែក្នុងការធ្វើឱ្យដុំមាសរលាយបាត់បង់ទម្ងន់តែប៉ុណ្ណោះ","isCorrect":false},{"text":"គ្មានអត្ថប្រយោជន៍អ្វីទាំងអស់ក្នុងជីវភាពរស់នៅប្រចាំថ្ងៃ","isCorrect":false}],"explanation":"ចម្លើយត្រឹមត្រូវ ៖ ជួយក្នុងការផលិតអំបិលហូបពីទឹកសមុទ្រ ការចម្រោះទឹកស្អាតសម្រាប់ប្រើប្រាស់ និងការបន្សុទ្ធរ៉ែលោហធាតុផ្សេងៗ (ទំព័រ ៨៨)"}];

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

  // Elements data from Textbook Page 86
  const elementsData = {
    oxygen: {
      name: "អុកស៊ីសែន (Oxygen)",
      symbol: "O",
      atomicNum: 8,
      state: "ឧស្ម័ន (Gas)",
      color: "គ្មានពណ៌ គ្មានក្លិន",
      appearance: "bg-sky-500",
      icon: "💨",
      description: "ធាតុគីមីម្យ៉ាងផ្តុំគ្នាបង្កើតបានជារូបធាតុឧស្ម័ន គ្មានក្លិន គ្មានពណ៌ ដែលមនុស្សនិងសត្វត្រូវការជាចាំបាច់សម្រាប់ដកដង្ហើមរស់រានមានជីវិត។",
      uses: "ដកដង្ហើមរបស់ភាវៈរស់, ជួយក្នុងការឆេះនៃភ្លើង, ប្រើក្នុងវិស័យវេជ្ជសាស្ត្រ និងការហោះហើរក្នុងលំហ។"
    },
    gold: {
      name: "មាស (Gold)",
      symbol: "Au",
      atomicNum: 79,
      state: "រឹង (Solid)",
      color: "ពណ៌លឿង ភ្លឺរលោង",
      appearance: "bg-amber-400",
      icon: "👑",
      description: "ធាតុគីមីម្យ៉ាងផ្តុំគ្នាបង្កើតបានជារូបធាតុរឹងពណ៌លឿង ភ្លឺរលោង មានតម្លៃខ្ពស់ មិនងាយច្រែះ ឬខូចគុណភាពឡើយ។",
      uses: "យកមកកែច្នៃធ្វើជាគ្រឿងអលង្ការដ៏ប្រណីត (ខ្សែ ក, ខ្សែដៃ, ចិញ្ចៀន) និងបម្រុងទុកជាទ្រព្យសម្បត្តិ។"
    },
    silver: {
      name: "ប្រាក់ (Silver)",
      symbol: "Ag",
      atomicNum: 47,
      state: "រឹង (Solid)",
      color: "ពណ៌ប្រាក់ ភ្លឺផ្លេក",
      appearance: "bg-slate-300",
      icon: "🥈",
      description: "ធាតុគីមីម្យ៉ាងផ្តុំគ្នាបង្កើតបានជារូបធាតុរឹងពណ៌ប្រាក់ភ្លឺរលោង មានសមត្ថភាពចម្លងកម្ដៅ និងអគ្គិសនីបានយ៉ាងល្អឥតខ្ចោះ។",
      uses: "យកមកធ្វើជាប្រដាប់ស្ពា, ផ្តិលប្រាក់បុរាណ, ខ្សែ ក, ខ្សែដៃ និងគ្រឿងអលង្ការប្រពៃណីខ្មែរ។"
    },
    copper: {
      name: "ទង់ដែង (Copper)",
      symbol: "Cu",
      atomicNum: 29,
      state: "រឹង (Solid)",
      color: "ពណ៌ក្រហមត្នោត",
      appearance: "bg-orange-600",
      icon: "🔌",
      description: "ធាតុគីមីម្យ៉ាងផ្តុំគ្នាបង្កើតបានជារូបធាតុរឹងពណ៌ក្រហមត្នោត ងាយបត់បែន និងជាអ្នកចម្លងចរន្តអគ្គិសនីដ៏ពូកែ។",
      uses: "យកមកធ្វើជាស្នូលខ្សែចម្លងចរន្តអគ្គិសនី, បំពង់ទឹក និងគ្រឿងបង្គុំអេឡិចត្រូនិក។"
    },
    zinc: {
      name: "ស័ង្កសី (Zinc)",
      symbol: "Zn",
      atomicNum: 30,
      state: "រឹង (Solid)",
      color: "ពណ៌ប្រផេះ",
      appearance: "bg-zinc-500",
      icon: "🏠",
      description: "ធាតុគីមីម្យ៉ាងផ្តុំគ្នាបង្កើតបានជារូបធាតុរឹងពណ៌ប្រផេះ ធន់នឹងការច្រែះក្រោមអាកាសធាតុធម្មជាតិ។",
      uses: "យកទៅធ្វើជាគ្រឿងប្រក់ផ្ទះ (ស័ង្កសីប្រក់ដំបូល), ស្រោបដែកការពារច្រែះ និងធ្វើជាសម្បកថ្មពិល។"
    },
    aluminum: {
      name: "អាលុយមីញ៉ូម (Aluminum)",
      symbol: "Al",
      atomicNum: 13,
      state: "រឹង (Solid)",
      color: "ពណ៌សភ្លឺ ស្រាល",
      appearance: "bg-slate-200",
      icon: "🍳",
      description: "ធាតុគីមីម្យ៉ាងផ្តុំគ្នាបង្កើតបានជារូបធាតុរឹងពណ៌សភ្លឺ មានទម្ងន់ស្រាល ចម្លងកម្ដៅបានលឿន និងមិនងាយច្រែះ។",
      uses: "យកមកធ្វើជាចាន, ស្លាបព្រា, ឆ្នាំង, ខ្ទះ, ស៊ុមកញ្ចក់ទ្វារបង្អួច និងគ្រឿងបង្គុំយន្តហោះ។"
    },
    carbon: {
      name: "កាបូន (Carbon)",
      symbol: "C",
      atomicNum: 6,
      state: "រឹង (Solid)",
      color: "ពណ៌ខ្មៅ",
      appearance: "bg-stone-900",
      icon: "✏️",
      description: "ធាតុគីមីម្យ៉ាងផ្តុំគ្នាបង្កើតបានជារូបធាតុរឹងពណ៌ខ្មៅ។ កាបូនជាធាតុបង្កដ៏សំខាន់បំផុតរបស់មនុស្ស សត្វ និងរុក្ខជាតិ។",
      uses: "យកទៅធ្វើជាបណ្តូលខ្មៅដៃ, បណ្តូលថ្មពិល, ធ្យូង និងជាគ្រឹះនៃម៉ូលេគុលជីវិតទាំងអស់នៅលើផែនដី។"
    }
  };

  // Compounds data
  const compoundsData = {
    co2: {
      name: "ឧស្ម័នកាបូនិច (Carbon Dioxide)",
      formula: "CO₂",
      elements: ["កាបូន (C)", "អុកស៊ីសែន (O)"],
      equation: "C + O₂ → CO₂",
      desc: "កើតពីភាគល្អិតនៃអុកស៊ីសែនច្រើនផ្តុំគ្នាជាមួយធាតុគីមីនៃកាបូនច្រើន។ ជាឧស្ម័នគ្មានពណ៌ដែលភាវៈរស់បញ្ចេញពេលដកដង្ហើមចេញ។",
      icon: "🌫️"
    },
    water: {
      name: "ទឹក (Water)",
      formula: "H₂O",
      elements: ["អ៊ីដ្រូសែន (H)", "អុកស៊ីសែន (O)"],
      equation: "2H₂ + O₂ → 2H₂O",
      desc: "កើតពីធាតុគីមីអ៊ីដ្រូសែនច្រើនផ្តុំគ្នាជាមួយធាតុគីមីអុកស៊ីសែនច្រើន។ ជាសារធាតុរាវដ៏សំខាន់បំផុតសម្រាប់ទ្រទ្រង់ជីវិត។",
      icon: "💧"
    },
    sugar: {
      name: "ស្ករ (Glucose / Sugar)",
      formula: "C₆H₁₂O₆",
      elements: ["កាបូន (C)", "អ៊ីដ្រូសែន (H)", "អុកស៊ីសែន (O)"],
      equation: "6C + 6H₂ + 3O₂ → C₆H₁₂O₆",
      desc: "កើតពីធាតុគីមីកាបូនច្រើនផ្តុំគ្នាជាមួយធាតុគីមីអ៊ីដ្រូសែនច្រើន និងធាតុគីមីអុកស៊ីសែនច្រើន។ ផ្តល់ថាមពលផ្អែមដល់រាងកាយ។",
      icon: "🍬"
    }
  };

  const handleTriggerReaction = () => {
    setIsReacting(!0);
    setReactionDone(!1);
    playTone(440, "sine", 0.4);
    setTimeout(() => {
      setIsReacting(!1);
      setReactionDone(!0);
      playTone(880, "triangle", 0.3);
      s && s("ប្រតិកម្មផ្សំធាតុគីមីបានជោគជ័យ! បង្កើតបានជាអង្គធាតុសមាសថ្មី។");
    }, 1200);
  };

  // Separation Lab data
  const separationMethods = {
    magnet: {
      name: "វិធីប្រើមេដែក (Magnetic Separation)",
      mixture: "ម្សៅដែក លាយ ដីខ្សាច់",
      type: "ល្បាយមិនស្មើរសាច់",
      icon: "🧲",
      principle: "សម្រាប់ញែកអង្គធាតុដែលមានជាតិដែកចេញពីអង្គធាតុផ្សេង ដោយសារមេដែកមានកម្លាំងដែនម៉ាញេទិកស្រូបដែក។",
      steps: [
        "ល្បាយម្សៅដែក និងដីខ្សាច់ច្របល់ចូលគ្នា",
        "យកមេដែកមកជិតល្បាយ នោះម្សៅដែកត្រូវមេដែកស្រូបទាញជាប់ភ្លាម",
        "ដីខ្សាច់នៅសល់ក្នុងចាន ចំណែកម្សៅដែកជាប់នៅចុងមេដែក"
      ]
    },
    filtration: {
      name: "វិធីចម្រុះ (Filtration)",
      mixture: "ដីខ្សាច់ លាយ ទឹក",
      type: "ល្បាយមិនស្មើរសាច់",
      icon: "☕",
      principle: "សម្រាប់ញែកអង្គធាតុរឹងដែលមិនរលាយចេញពីរាវ ដោយប្រើក្រដាសចម្រុះដែលមានរន្ធញើសតូចៗ។",
      steps: [
        "បត់ក្រដាសចម្រុះដាក់ក្នុងកែវចីវលោ (Funnel)",
        "ចាក់ល្បាយទឹកលាយខ្សាច់ចូលក្នុងកែវចីវលោ",
        "ទឹកថ្លាហូរកាត់ក្រដាសចម្រុះធ្លាក់ចុះក្រោម រីឯកម្ទេចខ្សាច់ជាប់នៅខាងលើក្រដាស"
      ]
    },
    decantation: {
      name: "វិធីកំណកកុាម ឬរងថ្លា (Decantation)",
      mixture: "ទឹកល្អក់ (ទឹកលាយកករដី)",
      type: "ល្បាយមិនស្មើរសាច់",
      icon: "⏳",
      principle: "ទុកឱ្យអង្គធាតុរឹងធ្លាក់ចុះបាតភាជន៍ដោយសារទំនាញផែនដី រួចចាក់យកទឹកថ្លាខាងលើចេញ។",
      steps: [
        "ទឹកល្អក់ដែលមានដីហុយរសាត់ក្នុងទឹក",
        "ទុកទឹកនោះឱ្យនៅស្ងៀមមួយកន្លែង កករដីធ្ងន់នឹងធ្លាក់ចុះបាតកែវបន្តិចម្តងៗ",
        "ផ្អៀងកែវចាក់ទឹកថ្លាផ្នែកខាងលើទៅក្នុងកែវមួយទៀត"
      ]
    },
    evaporation: {
      name: "វិធីរំហួត (Evaporation)",
      mixture: "ទឹកលាយអំបិល (ទឹកអំបិល)",
      type: "ល្បាយស្មើរសាច់",
      icon: "🔥",
      principle: "សម្រាប់ញែកអង្គធាតុរឹងដែលរលាយក្នុងអង្គធាតុរាវ ដោយកម្ដៅរហូតទាល់តែរាវហួតអស់ សល់ក្រាមអំបិល។",
      steps: [
        "ចាក់ទឹកអំបិលថ្លាចូលក្នុងចានរំហួត",
        "អុជចង្កៀងអាល់កុលកម្ដៅទឹកអំបិលឱ្យពុះ រហូតដល់ទឹកហួតអស់ជាចំហាយ",
        "ក្រាមអំបិលពណ៌សសុទ្ធនឹងកកសល់នៅបាតចានរំហួត"
      ]
    },
    distillation: {
      name: "វិធីបំណិត (Distillation)",
      mixture: "ទឹកសមុទ្រ ឬទឹកអំបិល",
      type: "ល្បាយស្មើរសាច់",
      icon: "⚗️",
      principle: "សម្រាប់ញែកអង្គធាតុរាវដែលមានចំណុចរំពុះខុសគ្នា ឬប្រមូលយកទឹកសុទ្ធពីទឹកអំបិលតាមរយៈការរំហួត និងការកកើតជាតំណក់ទឹកត្រជាក់។",
      steps: [
        "ដាំទឹកអំបិលក្នុងកែវបំណិតឱ្យពុះហួតជាចំហាយ",
        "ចំហាយទឹកក្តៅឆ្លងកាត់បំពង់ត្រជាក់ ក្លាយជាតំណក់ទឹករាវវិញ",
        "ប្រមូលបានទឹកសុទ្ធ ១០០% ក្នុងកែវទទួល ចំណែកអំបិលសល់ក្នុងកែវដើម"
      ]
    }
  };

  const currentMethodObj = separationMethods[selectedMixtureMethod];

  return e.jsx("div", {
    "data-modal-open": "true",
    onClick: (ev) => { if (ev.target === ev.currentTarget) t(); },
    className: isFullScreen 
      ? "fixed inset-0 z-[100] w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-['Battambang'] p-0"
      : "fixed inset-0 z-[100] overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300 font-['Battambang']",
    children: e.jsxs("div", {
      onClick: (ev) => ev.stopPropagation(),
      className: isFullScreen 
        ? "relative w-full h-full min-h-screen flex flex-col overflow-hidden rounded-none border-0 bg-white text-slate-800"
        : "relative w-full max-w-5xl h-full sm:h-[92vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300 text-slate-800",
      children: [
        // Header
        e.jsxs("div", {
          className: "px-4 sm:px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shrink-0 relative overflow-hidden shadow-md flex items-center justify-between",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("span", {
                  className: "w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl shadow-inner",
                  children: "⚛️"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", {
                      className: "text-sm sm:text-lg font-bold font-moul text-white drop-shadow-xs line-clamp-1",
                      children: "មេរៀនទី ១៣ ៖ ធាតុគីមី អង្គធាតុសុទ្ធ និងល្បាយ"
                    }),
                    e.jsx("p", {
                      className: "text-[10px] sm:text-xs text-emerald-100 font-bold opacity-95",
                      children: "ជំពូកទី ៤ • វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦ • ៤០ សំណួរ QCM • បន្ទប់ពិសោធន៍ទំនើប"
                    })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                e.jsx("button", {
                  type: "button",
                  onClick: () => toggleSpeech("មេរៀនទី ១៣ ៖ ធាតុគីមី អង្គធាតុសុទ្ធ និងល្បាយ។ ផងតូចៗបំផុតរបស់ភាគល្អិតនៃរូបធាតុដែលមិនអាចបំបែកទៅទៀត ហៅថា ធាតុគីមី។ បច្ចុប្បន្ន អ្នកវិទ្យាសាស្ត្របានរកឃើញធាតុគីមីចំនួន ១០៦ ធាតុ ដែលមាន ៩០ ធាតុនៅក្នុងធម្មជាតិ។ អង្គធាតុសុទ្ធ ចែកជា អង្គធាតុទោល និងអង្គធាតុសមាស។ ល្បាយ ចែកជា ល្បាយស្មើរសាច់ និងល្បាយមិនស្មើរសាច់។"),
                  className: "px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border " + (isSpeaking ? "bg-amber-400 text-slate-900 border-amber-500 animate-pulse" : "bg-white/20 text-white border-white/30 hover:bg-white/30"),
                  title: "អានមេរៀនជាសំឡេង",
                  children: isSpeaking ? "🔊 កំពុងអាន..." : "🔈 អានជាសំឡេង"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: () => {
                    setSoundEnabled(!soundEnabled);
                    playTone(600, "sine", 0.1);
                  },
                  className: "w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white transition flex items-center justify-center text-sm cursor-pointer border border-white/30",
                  title: soundEnabled ? "បិទសំឡេងប៉ះ" : "បើកសំឡេងប៉ះ",
                  children: soundEnabled ? "🔔" : "🔕"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: () => setIsFullScreen(!isFullScreen),
                  className: "w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white transition flex items-center justify-center text-sm cursor-pointer border border-white/30",
                  title: isFullScreen ? "បង្រួមអេក្រង់" : "ពង្រីកពេញអេក្រង់",
                  children: isFullScreen ? "🗗" : "⛶"
                }),
                e.jsx("button", {
                  type: "button",
                  onClick: t,
                  className: "w-9 h-9 rounded-xl bg-white/20 hover:bg-rose-600 text-white border border-white/30 flex items-center justify-center transition cursor-pointer text-base font-bold",
                  children: "✕"
                })
              ]
            })
          ]
        }),

        // Tab Navigation
        e.jsx("div", {
          className: "bg-slate-100 border-b border-slate-200 px-3 sm:px-5 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-thin",
          children: [
            { id: "tab-hero", label: "📖 ខ្លឹមសារមេរៀន" },
            { id: "tab-elements", label: "⚛️ ធាតុគីមីទាំង ៧" },
            { id: "tab-compounds", label: "🧪 ផ្សំសមាសធាតុ" },
            { id: "tab-mixtures", label: "🧲 ពិសោធន៍ញែកល្បាយ" },
            { id: "tab-quiz", label: "📝 ប្រឡង ៤០ QCM" }
          ].map(tab => e.jsx("button", {
            key: tab.id,
            type: "button",
            onClick: () => {
              i(tab.id);
              playTone(480, "sine", 0.08);
            },
            className: n === tab.id
              ? "px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 text-white shadow-md border border-emerald-700 shrink-0 cursor-pointer"
              : "px-4 py-2 rounded-xl font-bold text-xs bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 transition shrink-0 cursor-pointer",
            children: tab.label
          }))
        }),

        // Tab Content Area (White & Slate-50)
        e.jsx("div", {
          className: "flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 space-y-5 text-slate-800 scrollbar-thin",
          children: [
            // TAB 1: Core Theory & Summary
            n === "tab-hero" && e.jsxs("div", {
              className: "space-y-4 max-w-4xl mx-auto",
              children: [
                // Highlight Stats Banner
                e.jsxs("div", {
                  className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
                  children: [
                    e.jsxs("div", {
                      className: "p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center",
                      children: [
                        e.jsx("div", { className: "text-2xl font-black text-emerald-600 font-moul", children: "១០៦" }),
                        e.jsx("div", { className: "text-xs font-bold text-slate-600 mt-1", children: "ធាតុគីមីរកឃើញសរុប" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center",
                      children: [
                        e.jsx("div", { className: "text-2xl font-black text-teal-600 font-moul", children: "៩០" }),
                        e.jsx("div", { className: "text-xs font-bold text-slate-600 mt-1", children: "ធាតុគីមីក្នុងធម្មជាតិ" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center",
                      children: [
                        e.jsx("div", { className: "text-2xl font-black text-cyan-600 font-moul", children: "១៦" }),
                        e.jsx("div", { className: "text-xs font-bold text-slate-600 mt-1", children: "ធាតុគីមីតាមវិធីនិម្មិត" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center",
                      children: [
                        e.jsx("div", { className: "text-2xl font-black text-indigo-600 font-moul", children: "៤០" }),
                        e.jsx("div", { className: "text-xs font-bold text-slate-600 mt-1", children: "សំណួរ QCM ស្ដង់ដារ" })
                      ]
                    })
                  ]
                }),

                // Section 1: Chemical Elements Definition
                e.jsxs("div", {
                  className: "p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2.5",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2.5",
                      children: [
                        e.jsx("span", { className: "text-2xl", children: "⚛️" }),
                        e.jsx("h3", { className: "font-bold text-base sm:text-lg text-emerald-800 font-moul", children: "១. អត្ថន័យធាតុគីមី (Chemical Elements)" })
                      ]
                    }),
                    e.jsx("p", {
                      className: "text-xs sm:text-sm text-slate-700 leading-relaxed",
                      children: "ផងតូចៗបំផុតរបស់ភាគល្អិតនៃរូបធាតុដែលមិនអាចបំបែកទៅទៀត ហៅថា «ធាតុគីមី»។ គេមិនអាចបំបែកធាតុគីមីបានទៅទៀតឡើយ។ រូបធាតុទាំងអស់សុទ្ធតែផ្សំឡើងពីធាតុគីមីជាច្រើន។ ធាតុគីមីធម្មជាតិទាំង ៩០ ធាតុ គេរកឃើញនៅក្នុង ដី ថ្ម ទឹក រុក្ខជាតិ និងសត្វ។"
                    })
                  ]
                }),

                // Section 2: Pure Substances Hierarchy
                e.jsxs("div", {
                  className: "p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3.5",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2.5",
                      children: [
                        e.jsx("span", { className: "text-2xl", children: "💎" }),
                        e.jsx("h3", { className: "font-bold text-base sm:text-lg text-teal-800 font-moul", children: "២. អង្គធាតុសុទ្ធ (Pure Substances)" })
                      ]
                    }),
                    e.jsx("p", {
                      className: "text-xs sm:text-sm text-slate-700 leading-relaxed",
                      children: "អង្គធាតុសុទ្ធ ជារូបធាតុដែលផ្សំឡើងដោយធាតុគីមីតែមួយប្រភេទ។ គេចែកអង្គធាតុសុទ្ធជាពីរ គឺ ៖"
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
                      children: [
                        e.jsxs("div", {
                          className: "p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs sm:text-sm text-emerald-800", children: "ក. អង្គធាតុទោល (Simple Substance)" }),
                            e.jsx("p", { className: "text-xs text-slate-700", children: "បង្កឡើងពីធាតុគីមីតែមួយប្រភេទគត់។" }),
                            e.jsx("div", { className: "text-[11px] text-emerald-900 bg-white p-2.5 rounded-lg border border-emerald-200 font-medium", children: "ឧទាហរណ៍ ៖ ដុំមាសសុទ្ធ, ដុំប្រាក់សុទ្ធ, ដុំទង់ដែងសុទ្ធ (ភាគល្អិតតែមួយប្រភេទ)" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "p-4 bg-cyan-50/70 border border-cyan-200 rounded-xl space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-xs sm:text-sm text-cyan-800", children: "ខ. អង្គធាតុសមាស ឬ សមាសធាតុ (Compound)" }),
                            e.jsx("p", { className: "text-xs text-slate-700", children: "ផ្សំឡើងពីធាតុគីមីជាច្រើនប្រភេទផ្គុំចូលគ្នា។" }),
                            e.jsx("div", { className: "text-[11px] text-cyan-900 bg-white p-2.5 rounded-lg border border-cyan-200 font-medium", children: "ឧទាហរណ៍ ៖ ឧស្ម័នកាបូនិច (កាបូន + អុកស៊ីសែន), ទឹក (អ៊ីដ្រូសែន + អុកស៊ីសែន), ស្ករ (កាបូន + អ៊ីដ្រូសែន + អុកស៊ីសែន)" })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Section 3: Mixtures & Separation Methods
                e.jsxs("div", {
                  className: "p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3.5",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2.5",
                      children: [
                        e.jsx("span", { className: "text-2xl", children: "🧪" }),
                        e.jsx("h3", { className: "font-bold text-base sm:text-lg text-indigo-800 font-moul", children: "៣. ល្បាយ និងវិធីញែកល្បាយ (Mixtures & Separation)" })
                      ]
                    }),
                    e.jsx("p", {
                      className: "text-xs sm:text-sm text-slate-700 leading-relaxed",
                      children: "ល្បាយកើតពីការច្របល់ចូលគ្នារវាងអង្គធាតុពីរ ឬច្រើនដែលមិនមានប្រតិកម្មគីមីរវាងគ្នានិងគ្នា ហើយអង្គធាតុនីមួយៗនៅតែរក្សាលក្ខណៈដើមរបស់វាដដែល។"
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
                      children: [
                        e.jsxs("div", {
                          className: "p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5",
                          children: [
                            e.jsx("div", { className: "font-bold text-xs sm:text-sm text-indigo-900", children: "✨ ល្បាយស្មើរសាច់" }),
                            e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "មិនអាចមើលឃើញភាពខុសគ្នានៃភាគល្អិតផ្សំឡើយ (ឧ. ទឹកស្ករ, ទឹកអំបិល)" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1.5",
                          children: [
                            e.jsx("div", { className: "font-bold text-xs sm:text-sm text-purple-900", children: "🔍 ល្បាយមិនស្មើរសាច់" }),
                            e.jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: "អាចមើលឃើញភាគល្អិតផ្សំដាច់ៗពីគ្នាដោយភ្នែកទទេ (ឧ. អង្ករលាយខ្សាច់, ទឹកលាយប្រេង)" })
                          ]
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5",
                      children: [
                        e.jsx("div", { className: "text-xs sm:text-sm font-bold text-amber-700", children: "⚗️ វិធីញែកល្បាយទាំង ៥ វិធី ៖" }),
                        e.jsxs("div", {
                          className: "grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-bold",
                          children: [
                            e.jsxs("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-800", children: [e.jsx("div", { className: "text-xl", children: "🧲" }), "ប្រើមេដែក"] }),
                            e.jsxs("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-800", children: [e.jsx("div", { className: "text-xl", children: "☕" }), "វិធីចម្រុះ"] }),
                            e.jsxs("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-800", children: [e.jsx("div", { className: "text-xl", children: "⏳" }), "កំណកកុាម/រងថ្លា"] }),
                            e.jsxs("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-800", children: [e.jsx("div", { className: "text-xl", children: "🔥" }), "វិធីរំហួត"] }),
                            e.jsxs("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-800 col-span-2 sm:col-span-1", children: [e.jsx("div", { className: "text-xl", children: "⚗️" }), "វិធីបំណិត"] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 2: Elements Visualizer
            n === "tab-elements" && e.jsxs("div", {
              className: "space-y-5 max-w-4xl mx-auto",
              children: [
                e.jsxs("div", {
                  className: "text-center space-y-1",
                  children: [
                    e.jsx("h3", { className: "font-bold text-base sm:text-xl text-emerald-800 font-moul", children: "បន្ទប់រុករកធាតុគីមីទាំង ៧ ក្នុងសៀវភៅពុម្ព (ទំព័រ ៨៦)" }),
                    e.jsx("p", { className: "text-xs sm:text-sm text-slate-600", children: "ចុចលើធាតុគីមីនីមួយៗដើម្បីស្វែងយល់ពីរូបរាង លក្ខណៈរូប ភាពរូប និងការប្រើប្រាស់ជាក់ស្តែង" })
                  ]
                }),

                // Element Select Buttons
                e.jsx("div", {
                  className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5",
                  children: Object.keys(elementsData).map(key => {
                    const el = elementsData[key];
                    const isSelected = selectedElement === key;
                    return e.jsxs("button", {
                      key: key,
                      type: "button",
                      onClick: () => {
                        setSelectedElement(key);
                        playTone(520, "sine", 0.08);
                      },
                      className: isSelected
                        ? "p-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50 text-emerald-950 font-bold flex flex-col items-center gap-1 shadow-md cursor-pointer transform scale-102"
                        : "p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex flex-col items-center gap-1 transition cursor-pointer shadow-xs",
                      children: [
                        e.jsx("span", { className: "text-2xl", children: el.icon }),
                        e.jsx("span", { className: "text-xs font-bold line-clamp-1", children: el.name.split(" ")[0] }),
                        e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-emerald-700 font-mono font-bold border border-slate-200", children: el.symbol })
                      ]
                    });
                  })
                }),

                // Selected Element Detailed View
                (() => {
                  const el = elementsData[selectedElement];
                  return e.jsxs("div", {
                    className: "p-6 bg-white border border-slate-200 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center",
                    children: [
                      // Atomic Model Visualizer
                      e.jsxs("div", {
                        className: "flex flex-col items-center justify-center p-5 bg-slate-900 rounded-2xl border border-slate-800 relative min-h-[220px]",
                        children: [
                          e.jsxs("div", {
                            className: "relative w-36 h-36 flex items-center justify-center",
                            children: [
                              // Outer shell ring
                              e.jsx("div", { className: "absolute inset-0 rounded-full border border-dashed border-emerald-400/40 animate-spin" }),
                              // Middle shell ring
                              e.jsx("div", { className: "absolute inset-4 rounded-full border border-teal-400/30 animate-pulse" }),
                              // Nucleus
                              e.jsxs("div", {
                                className: "w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/30 text-white z-10",
                                children: [
                                  e.jsx("span", { className: "font-mono font-black text-xl", children: el.symbol }),
                                  e.jsx("span", { className: "text-[9px] font-bold opacity-80", children: "Z = " + el.atomicNum })
                                ]
                              }),
                              // Orbiting electrons
                              e.jsx("div", { className: "absolute top-1 left-6 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-xs shadow-cyan-400" }),
                              e.jsx("div", { className: "absolute bottom-1 right-6 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-xs shadow-cyan-400" }),
                              e.jsx("div", { className: "absolute top-10 right-0 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-xs shadow-cyan-400" })
                            ]
                          }),
                          e.jsx("span", { className: "text-xs text-slate-300 mt-2 font-mono", children: "គំរូភាគល្អិតអាតូមនៃធាតុ" })
                        ]
                      }),

                      // Element Details & Text
                      e.jsxs("div", {
                        className: "md:col-span-2 space-y-3.5",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3",
                            children: [
                              e.jsxs("div", {
                                children: [
                                  e.jsx("h4", { className: "text-lg sm:text-xl font-bold font-moul text-slate-900", children: el.name }),
                                  e.jsxs("div", {
                                    className: "flex items-center gap-2 mt-1",
                                    children: [
                                      e.jsx("span", { className: "px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold", children: "សភាព ៖ " + el.state }),
                                      e.jsx("span", { className: "px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold", children: "ពណ៌ ៖ " + el.color })
                                    ]
                                  })
                                ]
                              }),
                              e.jsx("button", {
                                type: "button",
                                onClick: () => toggleSpeech(el.name + "។ " + el.description + " ការប្រើប្រាស់ ៖ " + el.uses),
                                className: "px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs",
                                children: "🔊 ស្តាប់ការពណ៌នា"
                              })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              e.jsx("span", { className: "text-xs font-bold text-slate-800", children: "📝 លក្ខណៈសំគាល់ក្នុងសៀវភៅពុម្ព ៖" }),
                              e.jsx("p", { className: "text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200", children: el.description })
                            ]
                          }),
                          e.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              e.jsx("span", { className: "text-xs font-bold text-amber-800", children: "💡 ការប្រើប្រាស់ក្នុងជីវភាពជាក់ស្តែង ៖" }),
                              e.jsx("p", { className: "text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200", children: el.uses })
                            ]
                          })
                        ]
                      })
                    ]
                  });
                })()
              ]
            }),

            // TAB 3: Compound Synthesis Lab
            n === "tab-compounds" && e.jsxs("div", {
              className: "space-y-5 max-w-4xl mx-auto",
              children: [
                e.jsxs("div", {
                  className: "text-center space-y-1",
                  children: [
                    e.jsx("h3", { className: "font-bold text-base sm:text-xl text-teal-800 font-moul", children: "បន្ទប់ពិសោធន៍ផ្សំធាតុគីមីជាអង្គធាតុសមាស (ទំព័រ ៨៦-៨៧)" }),
                    e.jsx("p", { className: "text-xs sm:text-sm text-slate-600", children: "ផ្សំធាតុគីមីផ្សេងៗគ្នាដើម្បីបង្កើតជាម៉ូលេគុលអង្គធាតុសមាសថ្មីៗ" })
                  ]
                }),

                // Compound selection
                e.jsx("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-3.5",
                  children: Object.keys(compoundsData).map(k => {
                    const comp = compoundsData[k];
                    const isSel = selectedCompound === k;
                    return e.jsxs("button", {
                      key: k,
                      type: "button",
                      onClick: () => {
                        setSelectedCompound(k);
                        setReactionDone(!1);
                        playTone(490, "sine", 0.08);
                      },
                      className: isSel
                        ? "p-4 rounded-2xl border-2 border-teal-600 bg-teal-50 text-teal-950 font-bold flex items-center gap-3.5 shadow-md cursor-pointer"
                        : "p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-3.5 transition cursor-pointer shadow-xs",
                      children: [
                        e.jsx("span", { className: "text-3xl", children: comp.icon }),
                        e.jsxs("div", {
                          className: "text-left",
                          children: [
                            e.jsx("div", { className: "text-xs sm:text-sm font-bold font-moul text-slate-900", children: comp.name.split(" ")[0] }),
                            e.jsx("div", { className: "text-xs text-teal-700 font-mono font-bold", children: comp.formula })
                          ]
                        })
                      ]
                    });
                  })
                }),

                // Interactive Reactor Container
                (() => {
                  const comp = compoundsData[selectedCompound];
                  return e.jsxs("div", {
                    className: "p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3",
                        children: [
                          e.jsxs("div", {
                            children: [
                              e.jsx("h4", { className: "font-bold text-sm sm:text-base text-teal-900 font-moul", children: comp.name }),
                              e.jsx("span", { className: "text-xs font-mono text-emerald-700 font-bold", children: "រូបមន្តគីមី ៖ " + comp.formula })
                            ]
                          }),
                          e.jsx("button", {
                            type: "button",
                            onClick: handleTriggerReaction,
                            disabled: isReacting,
                            className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50",
                            children: isReacting ? "⚡ កំពុងផ្សំប្រតិកម្ម..." : "⚗️ ចុចដើម្បីផ្សំធាតុគីមី"
                          })
                        ]
                      }),

                      // Reaction Visual
                      e.jsxs("div", {
                        className: "p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-4 relative overflow-hidden",
                        children: [
                          isReacting && e.jsx("div", { className: "absolute inset-0 bg-teal-500/10 animate-pulse pointer-events-none" }),
                          
                          e.jsxs("div", {
                            className: "flex items-center gap-3 sm:gap-6 flex-wrap justify-center",
                            children: [
                              // Reactants
                              e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: comp.elements.map((elName, idx) => e.jsxs("div", {
                                  key: idx,
                                  className: "px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-center shadow-xs",
                                  children: [
                                    e.jsx("div", { className: "text-xs font-bold text-slate-800", children: elName }),
                                    e.jsx("div", { className: "text-[10px] text-teal-700 font-mono mt-0.5 font-bold", children: "ធាតុគីមី" })
                                  ]
                                }))
                              }),

                              // Arrow
                              e.jsx("span", { className: "text-2xl font-bold text-amber-600", children: isReacting ? "⚡" : "→" }),

                              // Product
                              e.jsxs("div", {
                                className: reactionDone
                                  ? "px-6 py-3.5 bg-teal-50 border-2 border-teal-500 rounded-2xl text-center shadow-md animate-bounce"
                                  : "px-6 py-3.5 bg-white border border-dashed border-slate-300 rounded-2xl text-center shadow-xs",
                                children: [
                                  e.jsx("div", { className: "text-3xl", children: comp.icon }),
                                  e.jsx("div", { className: "text-xs font-bold text-teal-900 font-moul mt-1", children: reactionDone ? comp.name.split(" ")[0] : "សមាសធាតុ" }),
                                  e.jsx("div", { className: "text-xs text-teal-700 font-mono font-bold", children: comp.formula })
                                ]
                              })
                            ]
                          }),

                          e.jsx("div", {
                            className: "text-xs font-mono px-4 py-1.5 rounded-full bg-white border border-slate-200 text-teal-800 font-bold shadow-xs",
                            children: "សមីការតំណាង ៖ " + comp.equation
                          })
                        ]
                      }),

                      // Explanation note
                      e.jsxs("div", {
                        className: "p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1.5",
                        children: [
                          e.jsx("div", { className: "font-bold text-emerald-800", children: "💡 យោងតាមសៀវភៅពុម្ពទំព័រ ៨៦-៨៧ ៖" }),
                          e.jsx("p", { className: "leading-relaxed", children: comp.desc })
                        ]
                      })
                    ]
                  });
                })()
              ]
            }),

            // TAB 4: Mixture Separation Simulator
            n === "tab-mixtures" && e.jsxs("div", {
              className: "space-y-5 max-w-4xl mx-auto",
              children: [
                e.jsxs("div", {
                  className: "text-center space-y-1",
                  children: [
                    e.jsx("h3", { className: "font-bold text-base sm:text-xl text-indigo-800 font-moul", children: "បន្ទប់ពិសោធន៍ញែកល្បាយទាំង ៥ វិធី (ទំព័រ ៨៨)" }),
                    e.jsx("p", { className: "text-xs sm:text-sm text-slate-600", children: "ជ្រើសរើសវិធីសាស្ត្រញែកល្បាយ និងធ្វើការពិសោធន៍ជាក់ស្តែងតាមជំហាននីមួយៗ" })
                  ]
                }),

                // Method Tabs
                e.jsx("div", {
                  className: "grid grid-cols-2 sm:grid-cols-5 gap-2.5",
                  children: Object.keys(separationMethods).map(k => {
                    const m = separationMethods[k];
                    const isSel = selectedMixtureMethod === k;
                    return e.jsxs("button", {
                      key: k,
                      type: "button",
                      onClick: () => {
                        setSelectedMixtureMethod(k);
                        setSeparationStep(0);
                        playTone(540, "sine", 0.08);
                      },
                      className: isSel
                        ? "p-3 rounded-xl border-2 border-indigo-600 bg-indigo-50 text-indigo-950 font-bold flex flex-col items-center gap-1 shadow-md cursor-pointer"
                        : "p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex flex-col items-center gap-1 transition cursor-pointer shadow-xs",
                      children: [
                        e.jsx("span", { className: "text-2xl", children: m.icon }),
                        e.jsx("span", { className: "text-xs font-bold line-clamp-1", children: m.name.split(" ")[0] })
                      ]
                    });
                  })
                }),

                // Interactive Simulator Box
                e.jsxs("div", {
                  className: "p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("h4", { className: "font-bold text-sm sm:text-base text-indigo-900 font-moul", children: currentMethodObj.name }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2 mt-1",
                              children: [
                                e.jsx("span", { className: "text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 font-bold", children: "ល្បាយ ៖ " + currentMethodObj.mixture }),
                                e.jsx("span", { className: "text-xs text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 font-medium", children: currentMethodObj.type })
                              ]
                            })
                          ]
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            if (separationStep < currentMethodObj.steps.length - 1) {
                              setSeparationStep(separationStep + 1);
                              playTone(620, "triangle", 0.2);
                              s && s("បានបន្តទៅជំហានបន្ទាប់!");
                            } else {
                              setSeparationStep(0);
                              playTone(440, "sine", 0.15);
                              s && s("បានកំណត់ការពិសោធន៍ឡើងវិញ!");
                            }
                          },
                          className: "px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center gap-1.5 cursor-pointer",
                          children: separationStep < currentMethodObj.steps.length - 1 ? "▶️ ដំណើរការជំហានបន្ទាប់" : "🔄 ពិសោធន៍ឡើងវិញ"
                        })
                      ]
                    }),

                    // Step visualization
                    e.jsxs("div", {
                      className: "p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between",
                          children: [
                            e.jsxs("span", { className: "text-xs sm:text-sm font-bold text-indigo-900", children: ["ជំហានទី ", separationStep + 1, " នៃ ", currentMethodObj.steps.length] }),
                            e.jsx("span", { className: "text-2xl", children: currentMethodObj.icon })
                          ]
                        }),
                        e.jsx("div", {
                          className: "p-4 bg-white border border-indigo-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold leading-relaxed shadow-xs",
                          children: currentMethodObj.steps[separationStep]
                        }),
                        // Progress bar for steps
                        e.jsx("div", {
                          className: "w-full bg-slate-200 h-2.5 rounded-full overflow-hidden",
                          children: e.jsx("div", {
                            className: "bg-indigo-600 h-full transition-all duration-300",
                            style: { width: ((separationStep + 1) / currentMethodObj.steps.length * 100) + "%" }
                          })
                        })
                      ]
                    }),

                    // Scientific Principle
                    e.jsxs("div", {
                      className: "p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs sm:text-sm text-slate-800 space-y-1.5",
                      children: [
                        e.jsx("div", { className: "font-bold text-indigo-900", children: "🔍 គោលការណ៍វិទ្យាសាស្ត្រ (ទំព័រ ៨៨) ៖" }),
                        e.jsx("p", { className: "leading-relaxed text-slate-700", children: currentMethodObj.principle })
                      ]
                    })
                  ]
                })
              ]
            }),

            // TAB 5: 40 QCM Examination (White Theme)
            n === "tab-quiz" && e.jsxs("div", {
              className: "space-y-4 max-w-3xl mx-auto",
              children: [
                !isFinished ? e.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    // Exam Header & Tools
                    e.jsxs("div", {
                      className: "flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-wrap gap-2",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("span", { className: "px-3 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs", children: "សំណួរ " + (currentQIndex + 1) + " / " + shuffledQuestions.length }),
                            e.jsx("span", { className: "px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs", children: "ពិន្ទុបច្ចុប្បន្ន ៖ " + score + " / " + Object.keys(userAnswers).length })
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
                        let btnStyle = "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200";
                        if (currentQIndex === idx) btnStyle = "bg-emerald-600 text-white font-extrabold ring-2 ring-emerald-400";
                        else if (isAnswered) {
                          btnStyle = isCorrect ? "bg-emerald-500 text-white border-emerald-600" : "bg-rose-500 text-white border-rose-600";
                        }
                        return e.jsx("button", {
                          key: idx,
                          type: "button",
                          onClick: () => setCurrentQIndex(idx),
                          className: "w-8 h-8 shrink-0 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center " + btnStyle,
                          children: idx + 1
                        });
                      })
                    }),

                    // Question Card (Pure White)
                    (() => {
                      const q = shuffledQuestions[currentQIndex];
                      const answered = userAnswers[currentQIndex] !== undefined;
                      const selectedOptIdx = userAnswers[currentQIndex];

                      return e.jsxs("div", {
                        className: "p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl space-y-5 shadow-sm",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              e.jsxs("span", { className: "text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 inline-block", children: ["សំណួរទី ", currentQIndex + 1, " នៃ ៤០"] }),
                              e.jsx("h3", {
                                className: "text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-moul pt-1",
                                children: q.question
                              })
                            ]
                          }),

                          // Options
                          e.jsx("div", {
                            className: "space-y-3 pt-1",
                            children: q.options.map((opt, oIdx) => {
                              const isSelected = selectedOptIdx === oIdx;
                              let btnClass = "w-full p-4 rounded-xl border-2 text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between cursor-pointer ";
                              
                              if (answered) {
                                if (opt.isCorrect) {
                                  btnClass += "bg-emerald-500 text-white border-emerald-600 shadow-md font-bold";
                                } else if (isSelected) {
                                  btnClass += "bg-rose-500 text-white border-rose-600 shadow-md font-bold";
                                } else {
                                  btnClass += "bg-slate-50 text-slate-400 border-slate-200 opacity-60";
                                }
                              } else {
                                btnClass += "bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border-slate-200 text-slate-800";
                              }

                              const prefix = ["ក. ", "ខ. ", "គ. ", "ឃ. "][oIdx] || "";

                              return e.jsxs("button", {
                                key: oIdx,
                                type: "button",
                                disabled: answered,
                                onClick: () => {
                                  setUserAnswers({ ...userAnswers, [currentQIndex]: oIdx });
                                  if (opt.isCorrect) {
                                    playTone(880, "triangle", 0.25);
                                    s && s("ចម្លើយត្រឹមត្រូវ! +50 XP ⭐");
                                  } else {
                                    playTone(220, "sawtooth", 0.3);
                                  }
                                },
                                className: btnClass,
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      e.jsx("span", {
                                        className: "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 " + (answered && (opt.isCorrect || isSelected) ? "bg-white/20 text-white" : "bg-white border border-slate-300 text-slate-700"),
                                        children: prefix.trim()
                                      }),
                                      e.jsx("span", { className: "leading-relaxed", children: opt.text })
                                    ]
                                  }),
                                  answered && (opt.isCorrect ? e.jsx("span", { className: "text-white text-base font-bold", children: "✓" }) : isSelected ? e.jsx("span", { className: "text-white text-base font-bold", children: "✕" }) : null)
                                ]
                              });
                            })
                          }),

                          // Explanation after answer
                          answered && e.jsxs("div", {
                            className: "p-4 rounded-xl text-xs sm:text-sm space-y-1.5 leading-relaxed " + (q.options[selectedOptIdx] && q.options[selectedOptIdx].isCorrect ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-rose-50 border border-rose-200 text-rose-900"),
                            children: [
                              e.jsx("div", { className: "font-bold text-sm", children: q.options[selectedOptIdx] && q.options[selectedOptIdx].isCorrect ? "🎉 ពូកែណាស់! ចម្លើយត្រឹមត្រូវ" : "💡 ការពន្យល់ ៖" }),
                              e.jsx("p", { children: q.explanation })
                            ]
                          }),

                          // Prev / Next Navigation
                          e.jsxs("div", {
                            className: "flex items-center justify-between pt-3 border-t border-slate-200",
                            children: [
                              e.jsx("button", {
                                type: "button",
                                disabled: currentQIndex === 0,
                                onClick: () => {
                                  setCurrentQIndex(currentQIndex - 1);
                                  playTone(400, "sine", 0.08);
                                },
                                className: "px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30 cursor-pointer border border-slate-200",
                                children: "◀ ត្រឡប់ក្រោយ"
                              }),
                              currentQIndex < shuffledQuestions.length - 1 ? e.jsx("button", {
                                type: "button",
                                onClick: () => {
                                  setCurrentQIndex(currentQIndex + 1);
                                  playTone(500, "sine", 0.08);
                                },
                                className: "px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md",
                                children: "សំណួរបន្ទាប់ ▶"
                              }) : e.jsx("button", {
                                type: "button",
                                onClick: () => {
                                  setIsFinished(!0);
                                  playTone(700, "triangle", 0.4);
                                },
                                className: "px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md",
                                children: "បញ្ចប់ការប្រឡង 🏁"
                              })
                            ]
                          })
                        ]
                      });
                    })()
                  ]
                }) : // Result Screen (Pure White)
                e.jsxs("div", {
                  className: "p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-6 shadow-xl max-w-xl mx-auto",
                  children: [
                    e.jsx("span", { className: "text-6xl inline-block", children: score >= 28 ? "🏆" : "🎖️" }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("h3", { className: "text-xl sm:text-2xl font-bold font-moul text-slate-900", children: "លទ្ធផលនៃការប្រឡងវាស់ស្ទង់សមត្ថភាព" }),
                        e.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "មេរៀនទី ១៣ ៖ ធាតុគីមី អង្គធាតុសុទ្ធ និងល្បាយ (៤០ សំណួរ QCM)" })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-5 bg-slate-50 rounded-2xl border border-slate-200 max-w-xs mx-auto space-y-2.5",
                      children: [
                        e.jsxs("div", {
                          className: "text-4xl font-black font-moul text-emerald-600",
                          children: [score, " / ៤០"]
                        }),
                        e.jsxs("div", {
                          className: "text-xs sm:text-sm font-bold text-slate-700",
                          children: ["ភាគរយជោគជ័យ ៖ ", ((score / 40) * 100).toFixed(1), "%"]
                        }),
                        e.jsx("div", {
                          className: "text-xs font-bold py-1.5 px-3.5 rounded-full inline-block " + (score >= 28 ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"),
                          children: score >= 36 ? "និទ្ទេស A (ល្អប្រសើរ)" : score >= 30 ? "និទ្ទេស B (ល្អណាស់)" : score >= 25 ? "និទ្ទេស C (ល្អបង្គួរ)" : "ត្រូវខិតខំរៀនបន្ថែម"
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "flex items-center justify-center gap-3 pt-2",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            setShuffledQuestions(shuffleQuiz(quizQuestions));
                            setUserAnswers({});
                            setCurrentQIndex(0);
                            setIsFinished(!1);
                            playTone(520, "sine", 0.1);
                          },
                          className: "px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md",
                          children: "🔄 ធ្វើតេស្តម្តងទៀត"
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