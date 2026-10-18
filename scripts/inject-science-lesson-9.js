import fs from 'node:fs';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

let code = fs.readFileSync(filePath, 'utf8');
console.log("Initial code length:", code.length);

// 1. All 40 questions from the user prompt
const rawPrompt = `សំណួរទី ១ ៖ តើសុខភាពល្អមានន័យត្រឹមត្រូវពេញលេញដូចម្តេច?
 ក. ផ្លូវកាយនិងផ្លូវចិត្តគ្មានរោគាឬបញ្ហាបៀតបៀន  ចម្លើយត្រឹមត្រូវ
 ខ. ការមានកាយសម្បទារឹងមាំអាចរត់ប្រណាំងឈ្នះ
 គ. ការមានទ្រព្យសម្បត្តិច្រើនលើសលប់ចាយមិនអស់
 ឃ. ការមិនដែលធ្លាប់កើតជំងឺផ្តាសាយតាំងពីក្មេងមក
សំណួរទី ២ ៖ តើសុខភាពផ្លូវភេទមានអត្ថន័យសំខាន់ដូចម្តេចខ្លះ?
 ក. ការចូលចិត្តដើរលេងកម្សាន្តនៅពេលរាត្រីស្ងាត់
 ខ. គ្មានជំងឺឆ្លងលើប្រដាប់ភេទនិងមានចិត្តល្អ  ចម្លើយត្រឹមត្រូវ
 គ. ការចេះលេងកីឡាទទួលបានមេដាយមាសជូនជាតិ
 ឃ. ការស្លៀកពាក់ស្អាតបាតទៅសាលារៀនរាល់ថ្ងៃ
សំណួរទី ៣ ៖ តើសុខភាពបន្តពូជមានអត្ថន័យពេញលេញដូចម្តេចខ្លះ?
 ក. ការមានកូនចៅច្រើនលើសលប់ពេញផ្ទះសម្បែង
 ខ. ការគ្មានពិការភាពតាំងពីពេលចាប់កំណើតមក
 គ. សុខុមាលភាពពេញលេញទាក់ទងនឹងប្រព័ន្ធបន្តពូជ  ចម្លើយត្រឹមត្រូវ
 ឃ. ការចេះធ្វើម្ហូបអាហារមានជីវជាតិឆ្ងាញ់ពិសា
សំណួរទី ៤ ៖ តើសេរីភាពក្នុងការសម្រេចចិត្តរៀបចំគ្រួសាររួមមានអ្វី?
 ក. សម្រេចចិត្តទិញផ្ទះសម្បែងធំៗតាមការពេញចិត្ត
 ខ. សម្រេចចិត្តឈប់រៀនសូត្រទៅប្រកបមុខរបររកស៊ី
 គ. សម្រេចចិត្តដើរលេងកម្សាន្តជាមួយមិត្តភក្តិជិត
 ឃ. សម្រេចចិត្តថាយកកូនឬអត់និងពេលណាយកកូន  ចម្លើយត្រឹមត្រូវ
សំណួរទី ៥ ៖ តើការមានផ្ទៃពោះក្នុងវ័យណាដែលប្រឈមគ្រោះថ្នាក់?
 ក. អាយុតិចជាងដប់ប្រាំបីនិងលើសពីសាមសិបប្រាំ  ចម្លើយត្រឹមត្រូវ
 ខ. អាយុចន្លោះពីម្ភៃឆ្នាំរហូតដល់សាមសិបឆ្នាំគត់
 គ. អាយុម្ភៃពីរឆ្នាំនិងអាយុម្ភៃប្រាំពីរឆ្នាំពេញ
 ឃ. អាយុម្ភៃប្រាំឆ្នាំនិងអាយុម្ភៃប្រាំបីឆ្នាំគត់
សំណួរទី ៦ ៖ តើមូលហេតុចម្បងដែលនាំឱ្យកើតជំងឺកាមរោគគឺអ្វី?
 ក. ការបរិភោគចំណីអាហារមានរសជាតិប្រៃខ្លាំងពេក
 ខ. មានគូស្នេហ៍ច្រើននិងមិនបានប្រើស្រោមការពារ  ចម្លើយត្រឹមត្រូវ
 គ. ការមិនបានហាត់ប្រាណជារៀងរាល់ព្រឹកព្រលឹម
 ឃ. ការគេងមិនបានគ្រប់ប្រាំបីម៉ោងក្នុងមួយយប់
សំណួរទី ៧ ៖ តើជំងឺកាមរោគដែលមិនបានព្យាបាលបង្កផលវិបាកអ្វី?
 ក. ធ្វើឱ្យសក់ក្បាលប្រែពណ៌ទៅជាសភ្លាមមួយរំពេច
 ខ. ធ្វើឱ្យឡើងទម្ងន់ធាត់ខុសប្លែកពីធម្មតាខ្លាំង
 គ. រលាករាលដាលធ្ងន់ធ្ងររហូតគ្មានលទ្ធភាពមានកូន  ចម្លើយត្រឹមត្រូវ
 ឃ. ធ្វើឱ្យស្បែកមុខឡើងមុនខុសពីមនុស្សទូទៅឆ្ងាយ
សំណួរទី ៨ ៖ តើមេរោគប្រមេះទឹកបាយឆ្លងចូលប៉ុន្មានថ្ងៃទើបចេញរោគសញ្ញា?
 ក. ឆ្លងចូលរយៈពេលប្រាំមួយខែទើបបង្ហាញរោគសញ្ញា
 ខ. ឆ្លងចូលរយៈពេលពេញមួយឆ្នាំទើបដឹងខ្លួនច្បាស់
 គ. ឆ្លងចូលភ្លាមបង្ហាញរោគសញ្ញាឈឺចាប់ភ្លាមមួយរំពេច
 ឃ. ឆ្លងចូលរយៈពេលពីពីរទៅបីថ្ងៃទើបចេញរោគសញ្ញា  ចម្លើយត្រឹមត្រូវ
សំណួរទី ៩ ៖ តើរោគសញ្ញាជំងឺប្រមេះទឹកបាយលើបុរសស្តែងឡើងដូចម្តេច?
 ក. នោមឈឺនិងមានខ្ទុះពណ៌លឿងឬបៃតងតាមបង្ហួរនោម  ចម្លើយត្រឹមត្រូវ
 ខ. ឈឺក្បាលវិលមុខខ្លាំងនៅពេលថ្ងៃត្រង់ក្តៅខ្លាំង
 គ. ក្អកធ្លាក់ឈាមស្រស់ចេញមកក្រៅតាមផ្លូវដង្ហើម
 ឃ. ឡើងកន្ទួលរមាស់ពេញខ្នងខ្លួនមិនដឹងមូលហេតុ
សំណួរទី ១០ ៖ តើរោគសញ្ញាជំងឺប្រមេះទឹកបាយលើស្ត្រីមានអ្វីខ្លះ?
 ក. ឡើងទម្ងន់ធាត់ខ្លាំងខុសប្លែកពីធម្មតាឆ្ងាយ
 ខ. ពិបាកនោម នោមឈឺ និងឈឺនៅមាត់ស្បូនទ្វារមាស  ចម្លើយត្រឹមត្រូវ
 គ. ជ្រុះសក់ក្បាលអស់គ្មានសល់មួយសរសៃឡើយ
 ឃ. ស្រវាំងភ្នែកមើលអ្វីមិនសូវច្បាស់នៅពេលថ្ងៃ
សំណួរទី ១១ ៖ តើសាច់ពកនៃជំងឺសិរមាន់មានទំហំប៉ុនណាខ្លះ?
 ក. ប៉ុនផ្លែក្រូចថ្លុងរហូតដល់ធំប៉ុនផ្លែឪឡឹក
 ខ. ប៉ុនផ្លែដូងទុំរហូតដល់ធំប៉ុនក្បាលមនុស្សធំ
 គ. ប៉ុនជើងធូបរហូតដល់ធំប៉ុនចុងម្រាមដៃមនុស្ស  ចម្លើយត្រឹមត្រូវ
 ឃ. ប៉ុនគ្រាប់ខ្សាច់តូចៗមើលមិនឃើញនឹងភ្នែកទេ
សំណួរទី ១២ ៖ តើសាច់ពកជំងឺសិរមាន់មានរូបរាងដូចអ្វីខ្លះ?
 ក. រាងសំប៉ែតស្មើដូចស្លឹកឈើជ្រុះលើដីធ្លី
 ខ. រាងមូលដូចផ្កាខាត់ណានិងក្រិនដូចសិរមាន់  ចម្លើយត្រឹមត្រូវ
 គ. រាងដូចផ្លែត្រសក់ទ្រវែងមានពណ៌ខ្មៅរលោង
 ឃ. រាងដូចគ្រាប់បាល់ទាត់មានផ្ទៃរលោងស្អាត
សំណួរទី ១៣ ៖ តើដំបៅនៃជំងឺស្វាយមានលក្ខណៈពិសេសដូចម្តេច?
 ក. ឈឺចាប់ផ្សាក្តៅខ្លាំងមិនអាចទ្រាំទ្របានឡើយ
 ខ. ហូរឈាមស្រស់រាល់ថ្ងៃនិងមិនងាយជាសះស្បើយ
 គ. មិនឈឺចាប់ទេហើយជាសះស្បើយទៅវិញដោយឯកឯង  ចម្លើយត្រឹមត្រូវ
 ឃ. មានខ្ទុះធុំក្លិនស្អុយរលួយខ្លាំងពេញបន្ទប់
សំណួរទី ១៤ ៖ តើកូនកណ្តុរនៅក្រលៀននៃជំងឺស្វាយមានសភាពបែបណា?
 ក. ឡើងពណ៌ក្រហមឆ្អៅនិងឈឺចាប់ខ្លាំងបំផុត
 ខ. រលួយធ្លាយខ្ទុះចេញមកក្រៅប្រឡាក់សម្លៀកបំពាក់
 គ. ហើមធំរឹងដូចថ្មនិងមិនអាចរលាយបាត់ទៅវិញទេ
 ឃ. មិនឈឺមិនរលួយហើយរលាយទៅវិញដោយឯកឯង  ចម្លើយត្រឹមត្រូវ
សំណួរទី ១៥ ៖ តើរោគសញ្ញាជំងឺប្រមេះទឹកថ្លាចំពោះបុរសគឺអ្វី?
 ក. ក្រហាយពេលនោម នោមញឹក មានទឹកថ្លាហូរចេញ  ចម្លើយត្រឹមត្រូវ
 ខ. នោមស្រួលធម្មតាគ្មានការឈឺចាប់អ្វីទាល់តែសោះ
 គ. ទឹកនោមប្រែពណ៌ទៅជាក្រហមដូចទឹកឈាមស្រស់
 ឃ. មិនអាចបត់ជើងតូចបានទាល់តែសោះច្រើនថ្ងៃ
សំណួរទី ១៦ ៖ តើជំងឺប្រមេះទឹកថ្លាលើស្ត្រីបង្កគ្រោះថ្នាក់អ្វីបើទុកយូរ?
 ក. ធ្វើឱ្យសក់ក្បាលប្រែពណ៌ទៅជាសដូចមនុស្សចាស់
 ខ. ធ្វើឱ្យឡើងទម្ងន់ធាត់ខ្លាំងមិនអាចដើររួចឡើយ
 គ. ធ្វើឱ្យបាត់បង់ការចងចាំមេរៀនចាស់ៗទាំងអស់
 ឃ. រលាកតួស្បូនដៃស្បូននិងអាចធ្វើឱ្យលែងមានកូន  ចម្លើយត្រឹមត្រូវ
សំណួរទី ១៧ ៖ តើជំងឺសង់មូមានរោគសញ្ញាដំបូងស្តែងឡើងដូចម្តេច?
 ក. ក្អកធ្លាក់ឈាមខ្លាំងតាមផ្លូវដង្ហើមជារៀងរាល់ថ្ងៃ
 ខ. កន្ទួលពីពីរទៅបីទន់ក្រហមរួចក្លាយជាដំបៅ  ចម្លើយត្រឹមត្រូវ
 គ. ឡើងដុំពកធំៗរឹងដូចថ្មលើស្បែកប្រដាប់បន្តពូជ
 ឃ. ស្បែកប្រែពណ៌ទៅជាលឿងដូចផ្លែចេកទុំជោរ
សំណួរទី ១៨ ៖ តើដំបៅជំងឺសង់មូមានលក្ខណៈខុសគ្នាយ៉ាងណារវាងប្រុសស្រី?
 ក. បុរសមិនឈឺចាប់អ្វីទេតែស្ត្រីឈឺចាប់ខ្លាំងណាស់
 ខ. បុរសដំបៅឈឺចាប់ខ្លាំងតែស្ត្រីគ្មានការឈឺចាប់  ចម្លើយត្រឹមត្រូវ
 គ. ទាំងបុរសទាំងស្ត្រីមិនមានការឈឺចាប់ដូចគ្នាឡើយ
 ឃ. ទាំងបុរសទាំងស្ត្រីសុទ្ធតែឈឺចាប់ខ្លាំងដូចគ្នា
សំណួរទី ១៩ ៖ តើដំបៅនៃជំងឺសង់មូមានលក្ខណៈទូទៅបែបណា?
 ក. ដំបៅរឹងស្មើគ្មានខ្ទុះនិងគ្មានឈាមចេញឡើយ
 ខ. មានដំបៅរាប់រយគ្រាប់ដុះពេញលើស្បែកខ្លួនប្រាណ
 គ. ដំបៅមានតែមួយទន់បាតមានខ្ទុះនិងចេញឈាមពេលប៉ះ  ចម្លើយត្រឹមត្រូវ
 ឃ. ដំបៅស្ងួតរលោងស្អាតគ្មានមេរោគនៅខាងក្នុងទេ
សំណួរទី ២០ ៖ តើកូនកណ្តុរនៃជំងឺសង់មូស្តែងចេញលក្ខណៈដូចម្តេច?
 ក. មិនឈឺ មិនរលួយ និងបាត់ទៅវិញដោយឯកឯង
 ខ. ដុះនៅក្លៀកទាំងសងខាងគ្មានការឈឺចាប់អ្វីឡើយ
 គ. កើតមានលើក្បាលជង្គង់ទាំងសងខាងមនុស្សប្រុស
 ឃ. នៅក្រលៀនម្ខាង ពណ៌ក្រហម ឈឺខ្លាំង មានខ្ទុះធ្លាយ  ចម្លើយត្រឹមត្រូវ
សំណួរទី ២១ ៖ តើរោគសញ្ញាគ្រុនក្តៅរបស់អ្នកជំងឺអេដស៍មានសភាពបែបណា?
 ក. គ្រុនក្តៅបែកញើសពេលយប់ញឹកញាប់លើសពីមួយខែ  ចម្លើយត្រឹមត្រូវ
 ខ. គ្រុនក្តៅតែពេលព្រឹកព្រលឹមត្រឹមតែមួយម៉ោងគត់
 គ. គ្រុនក្តៅម្តងម្កាលតែក្នុងរដូវរងាធ្លាក់ខ្យល់
 ឃ. គ្រុនក្តៅខ្លាំងតែនៅពេលដើរហាលថ្ងៃក្តៅខ្លាំង
សំណួរទី ២២ ៖ តើអ្នកជំងឺអេដស៍ស្រកទម្ងន់កម្រិតណាទើបកត់សម្គាល់?
 ក. ស្រកទម្ងន់ត្រឹមតែមួយភាគរយនៃទម្ងន់ខ្លួនសរុប
 ខ. ស្រកទម្ងន់ដប់ភាគរយឬច្រើនជាងនេះធៀបនឹងខ្លួន  ចម្លើយត្រឹមត្រូវ
 គ. មិនមានការស្រកទម្ងន់ទេបែរជាឡើងទម្ងន់ធាត់
 ឃ. ស្រកទម្ងន់តែពេលធ្វើការងារធ្ងន់ធ្ងរហត់នឿយ
សំណួរទី ២៣ ៖ តើរោគសញ្ញារាករូសរបស់អ្នកជំងឺអេដស៍មានរយៈពេលប៉ុណ្ណា?
 ក. រាករូសត្រឹមតែមួយព្រឹកក្រោយហូបចំណីអាហារ
 ខ. រាករូសតែនៅពេលយប់ត្រឹមតែមួយថ្ងៃគត់ជាសះ
 គ. រាករូសអូសបន្លាយពេលយូរលើសពីមួយខែឡើងទៅ  ចម្លើយត្រឹមត្រូវ
 ឃ. មិនដែលមានអាការរាករូសកើតឡើងក្នុងខ្លួនឡើយ
សំណួរទី ២៤ ៖ តើជំងឺឱកាសនិយមណាខ្លះដែលតែងយាយីអ្នកជំងឺអេដស៍?
 ក. ជំងឺទឹកនោមផ្អែមនិងជំងឺលើសសម្ពាធឈាមក្នុងខ្លួន
 ខ. ជំងឺឈឺធ្មេញនិងជំងឺរលាកក្រពះពោះវៀនធម្មតា
 គ. ជំងឺស្ទះសរសៃឈាមបេះដូងនិងជំងឺឈឺសន្លាក់ដៃ
 ឃ. ជំងឺរបេង ឡើងកូនកណ្តុរ ផ្សិតក្នុងមាត់ និងរាក  ចម្លើយត្រឹមត្រូវ
សំណួរទី ២៥ ៖ តើដំណាក់ចំហនៃការឆ្លងមេរោគអេដស៍មានរយៈពេលប៉ុន្មាន?
 ក. មានរយៈពេលពីពីរសប្តាហ៍ដល់ដប់ពីរសប្តាហ៍ពេញ  ចម្លើយត្រឹមត្រូវ
 ខ. មានរយៈពេលពីពីរឆ្នាំរហូតដល់ដប់ឆ្នាំជាប់គ្នា
 គ. មានរយៈពេលតែមួយថ្ងៃគត់ក្រោយពេលមេរោគចូល
 ឃ. មានរយៈពេលរហូតដល់ម្ភៃឆ្នាំទើបចប់ដំណាក់នេះ
សំណួរទី ២៦ ៖ តើលទ្ធផលពិនិត្យឈាមក្នុងដំណាក់ចំហបង្ហាញដូចម្តេច?
 ក. បង្ហាញលទ្ធផលវិជ្ជមានរកឃើញមេរោគច្បាស់លាស់
 ខ. បង្ហាញលទ្ធផលអវិជ្ជមានមិនទាន់ឃើញមេរោគឡើយ  ចម្លើយត្រឹមត្រូវ
 គ. បង្ហាញថាអ្នកជំងឺបានជាសះស្បើយមួយរយភាគរយ
 ឃ. មិនអាចធ្វើការពិនិត្យឈាមបានឡើយក្នុងដំណាក់នេះ
សំណួរទី ២៧ ៖ តើកម្រិតនៃការចម្លងមេរោគក្នុងដំណាក់ចំហមានកម្រិតណា?
 ក. មិនអាចចម្លងមេរោគទៅកាន់អ្នកដទៃបានសោះឡើយ
 ខ. មានកម្រិតទាបបំផុតមិនបាច់មានការប្រុងប្រយ័ត្ន
 គ. ផ្តល់ការចម្លងខ្ពស់បំផុតទៅកាន់មនុស្សដទៃ  ចម្លើយត្រឹមត្រូវ
 ឃ. ចម្លងបានតែចំពោះមនុស្សចាស់ជរាតែប៉ុណ្ណោះ
សំណួរទី ២៨ ៖ តើដំណាក់តេស្តឈាមវិជ្ជមានមានរយៈពេលប្រហែលប៉ុន្មាន?
 ក. មានរយៈពេលត្រឹមតែពីរទៅដប់ថ្ងៃតែប៉ុណ្ណោះ
 ខ. មានរយៈពេលត្រឹមតែពីរទៅដប់សប្តាហ៍គត់
 គ. មានរយៈពេលតែពីរទៅដប់ខែពេញមួយរដូវកាល
 ឃ. មានរយៈពេលពីពីរឆ្នាំរហូតដល់ដប់ឆ្នាំជាប់គ្នា  ចម្លើយត្រឹមត្រូវ
សំណួរទី ២៩ ៖ តើអ្នកផ្ទុកមេរោគក្នុងដំណាក់តេស្តឈាមវិជ្ជមានមានសភាពដូចម្តេច?
 ក. មានសុខភាពធម្មតានិងគ្មានរោគសញ្ញាច្បាស់លាស់  ចម្លើយត្រឹមត្រូវ
 ខ. ដេកដួលលើកន្ទេលអស់កម្លាំងល្ហិតល្ហៃដើរមិនរួច
 គ. ស្បែកឡើងកន្ទួលរមាស់និងជ្រុះសក់ក្បាលអស់ភ្លាម
 ឃ. បាត់បង់ស្មារតីចងចាំមិនដឹងអ្វីទាំងអស់ក្នុងខ្លួន
សំណួរទី ៣០ ៖ តើការចម្លងរោគក្នុងដំណាក់តេស្តឈាមវិជ្ជមានប្រៀបធៀបនឹងដំណាក់ចំហដូចម្តេច?
 ក. ផ្តល់ការចម្លងខ្ពស់ជាងដំណាក់ចំហរាប់រយដង
 ខ. មិនអាចចម្លងទៅអ្នកដទៃបានទៀតឡើយក្នុងដំណាក់នេះ
 គ. ផ្ដល់ការចម្លងទៅអ្នកដទៃទាបជាងដំណាក់ចំហ  ចម្លើយត្រឹមត្រូវ
 ឃ. កម្រិតនៃការចម្លងស្មើគ្នានឹងមនុស្សធម្មតាទូទៅ
សំណួរទី ៣១ ៖ តើជំងឺអេដស៍ដំណាក់ដំបូងមានលក្ខណៈសម្គាល់អ្វីខ្លះ?
 ក. តេស្តឈាមវិជ្ជមាននិងចាប់ផ្តើមមានជំងឺផ្សេងៗ  ចម្លើយត្រឹមត្រូវ
 ខ. តេស្តឈាមអវិជ្ជមាននិងគ្មានជំងឺអ្វីទាំងអស់
 គ. រាងកាយធាត់មាំមួនជាងពេលមុនឆ្លងមេរោគឆ្ងាយ
 ឃ. ឈប់ចម្លងមេរោគអេដស៍ទៅកាន់អ្នកដទៃទៀតហើយ
សំណួរទី ៣២ ៖ តើជំងឺអេដស៍ដំណាក់ចុងក្រោយស្តែងចេញស្ថានភាពបែបណា?
 ក. រាងកាយរឹងមាំអាចលើកទម្ងន់ធ្ងន់ៗបានធម្មតា
 ខ. ខ្លួនប្រាណទ្រុឌទ្រោម កម្លាំងចុះខ្សោយខ្លាំង  ចម្លើយត្រឹមត្រូវ
 គ. ស្បែកមុខឡើងសស្អាតរលោងគ្មានស្នាមជ្រួញសោះ
 ឃ. សតិបញ្ញាឈ្លាសវៃចងចាំមេរៀនបានល្អប្រសើរ
សំណួរទី ៣៣ ៖ តើរយៈពេលពីឆ្លងមេរោគដល់ចេញជំងឺអេដស៍មានប៉ុន្មានឆ្នាំ?
 ក. ត្រឹមតែរយៈពេលពីរទៅបីថ្ងៃតែប៉ុណ្ណោះ
 ខ. ត្រឹមតែរយៈពេលពីរបីសប្តាហ៍ក្រោយឆ្លងភ្លាម
 គ. ចន្លោះពីដប់ឆ្នាំរហូតដល់ដប់ពីរឆ្នាំកន្លងផុត  ចម្លើយត្រឹមត្រូវ
 ឃ. ត្រូវចំណាយពេលលើសពីហាសិបឆ្នាំឡើងទៅ
សំណួរទី ៣៤ ៖ ហេតុអ្វីមនុស្សរូបរាងស្រស់សង្ហាមិនប្រាកដថាគ្មានមេរោគអេដស៍?
 ក. ព្រោះមេរោគអេដស៍មិនធ្វើឱ្យមនុស្សស្លាប់ឡើយ
 ខ. ព្រោះដំណាក់ដំបូងៗអ្នកផ្ទុកមានសុខភាពធម្មតា  ចម្លើយត្រឹមត្រូវ
 គ. ព្រោះអ្នកជំងឺអេដស៍សុទ្ធតែមានសម្រស់ស្រស់ស្អាត
 ឃ. ព្រោះការពិនិត្យឈាមមិនអាចរកឃើញមេរោគអេដស៍
សំណួរទី ៣៥ ៖ តើជំងឺស្វាយនិងជំងឺសង់មូខុសគ្នាយ៉ាងដូចម្តេចត្រង់ដំបៅ?
 ក. ស្វាយដំបៅមិនឈឺ ឯសង់មូដំបៅឈឺលើបុរសមានខ្ទុះ  ចម្លើយត្រឹមត្រូវ
 ខ. ស្វាយដំបៅឈឺខ្លាំង ឯសង់មូដំបៅមិនឈឺទាល់តែសោះ
 គ. ទាំងពីរមុខនេះសុទ្ធតែជាដំបៅរឹងគ្មានឈាមដូចគ្នា
 ឃ. ទាំងពីរមុខនេះសុទ្ធតែជាដំបៅមិនឈឺចាប់ដូចគ្នា
សំណួរទី ៣៦ ៖ តើមេរោគអេដស៍ចូលទៅបំផ្លាញផ្នែកណាខ្លះនៃរាងកាយមនុស្ស?
 ក. បំផ្លាញតែឆ្អឹងដៃនិងឆ្អឹងជើងឱ្យបាក់បែកអស់
 ខ. បំផ្លាញតែសរសៃសក់ក្បាលឱ្យជ្រុះទំពែកទាំងអស់
 គ. កម្ទេចប្រព័ន្ធការពាររាងកាយមនុស្សបន្តិចម្តងៗ  ចម្លើយត្រឹមត្រូវ
 ឃ. បំផ្លាញតែធ្មេញក្នុងមាត់ឱ្យពុកជ្រុះអស់គ្មានសល់
សំណួរទី ៣៧ ៖ តើជំងឺប្រមេះទឹកបាយនិងប្រមេះទឹកថ្លាខុសគ្នាត្រង់ណាខ្លះ?
 ក. ទឹកបាយទឹកនោមមានពណ៌ស ឯទឹកថ្លាមានខ្ទុះខាប់
 ខ. ទឹកបាយទឹកនោមមានខ្ទុះ ឯទឹកថ្លាមានទឹកថ្លាហូរ  ចម្លើយត្រឹមត្រូវ
 គ. ជំងឺទាំងពីរនេះមានរោគសញ្ញាដូចគ្នាទាំងស្រុង
 ឃ. ទឹកបាយកើតតែលើកុមារ ឯទឹកថ្លាកើតតែលើមនុស្សចាស់
សំណួរទី ៣៨ ៖ តើមធ្យោបាយណាដែលអាចការពារការឆ្លងជំងឺកាមរោគបាន?
 ក. ការប្រើប្រាស់ស្រោមអនាម័យពេលរួមភេទជាប់លាប់  ចម្លើយត្រឹមត្រូវ
 ខ. ការបរិភោគថ្នាំវីតាមីនបំប៉នកម្លាំងឱ្យបានច្រើន
 គ. ការងូតទឹកសម្អាតខ្លួនជាមួយទឹកក្តៅពុះរាល់ថ្ងៃ
 ឃ. ការលាងសម្អាតដៃជាមួយសាប៊ូមុនពេលញ៉ាំអាហារ
សំណួរទី ៣៩ ៖ តើការស្វែងយល់ពីសុខភាពបន្តពូជផ្តល់ប្រយោជន៍អ្វីខ្លះ?
 ក. ធ្វើឱ្យសិស្សមានការភ័យខ្លាចរហូតបោះបង់ការរៀន
 ខ. ដឹងពីបញ្ហាប្រឈម ចេះការពារខ្លួន និងសុវត្ថិភាព  ចម្លើយត្រឹមត្រូវ
 គ. ជំរុញឱ្យយុវវ័យមានការរួមភេទតាំងពីអាយុតិច
 ឃ. មិនផ្តល់ផលប្រយោជន៍អ្វីទាំងអស់ដល់ការរស់នៅ
សំណួរទី ៤០ ៖ តើគោលបំណងចម្បងនៃការរៀនមេរៀនទី ៩ នេះគឺអ្វី?
 ក. យល់ដឹងពីសុខភាពបន្តពូជ ជំងឺកាមរោគ និងអេដស៍  ចម្លើយត្រឹមត្រូវ
 ខ. ដើម្បីឱ្យសិស្សចេះផ្សំថ្នាំពេទ្យព្យាបាលជំងឺ
 គ. ដើម្បីប្រកួតប្រជែងចំណេះដឹងយកប្រាក់រង្វាន់
 ឃ. ដើម្បីលុបបំបាត់ការបង្កើតកូនក្នុងសង្គមជាតិ`;

const blocks = rawPrompt.split(/សំណួរទី\s*[០-៩0-9]+\s*៖/g).filter(Boolean);
const questions = [];
blocks.forEach((block, idx) => {
  const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
  const qText = lines[0];
  const optLines = lines.slice(1);
  const opts = [];
  optLines.forEach(ol => {
    const isCorrect = ol.includes("ចម្លើយត្រឹមត្រូវ");
    const cleanText = ol.replace(/^[កខគឃ]\.\s*/, "").replace(/ចម្លើយត្រឹមត្រូវ/g, "").trim();
    opts.push({
      t: cleanText,
      c: isCorrect,
      e: isCorrect ? `ចម្លើយត្រឹមត្រូវ ផ្អែកលើខ្លឹមសារមេរៀនទី ៩ ៖ សុខភាពបន្តពូជ។` : `មិនត្រឹមត្រូវតាមខ្លឹមសារសៀវភៅពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦ ឡើយ។`
    });
  });
  questions.push({
    q: qText,
    opts: opts
  });
});

console.log("Successfully parsed " + questions.length + " questions!");

// 2. Build Zi9 and Iz9 code string
const zi9JSON = JSON.stringify(questions);
const zi9Code = `Zi9=${zi9JSON},Iz9={id:"science-lesson-9-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ៩ - សុខភាពបន្តពូជ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ៩ ៖ សុខភាពបន្តពូជ (ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ)",questions:Zi9},`;

// Inject Zi9, Iz9 right after Iz8={...},
const iz8Target = `questions:Zi8},`;
if (!code.includes(iz8Target)) {
  console.error("iz8Target not found!");
  process.exit(1);
}
code = code.replace(iz8Target, `questions:Zi8},` + zi9Code);
console.log("Injected Zi9 and Iz9 successfully!");

// 3. Build Rz9 Component code
const rz9ComponentCode = `Rz9=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>{
  if(!r)return null;
  const[n,i]=y.useState(a);
  const[currentQIndex,setCurrentQIndex]=y.useState(0);
  const[userAnswers,setUserAnswers]=y.useState({});
  const[isFinished,setIsFinished]=y.useState(!1);
  const[activeTheoryPart,setActiveTheoryPart]=y.useState(1);
  const[activeLabTool,setActiveLabTool]=y.useState("stis");
  const[selectedSti,setSelectedSti]=y.useState("gonorrhea");
  const[selectedHivStage,setSelectedHivStage]=y.useState(0);

  const q=Zi9[currentQIndex];
  const userChoice=userAnswers[currentQIndex];
  const score=Object.keys(userAnswers).filter(idx=>{
    const ans=userAnswers[idx];
    return Zi9[idx].opts[ans]&&Zi9[idx].opts[ans].c;
  }).length;

  const stisData={
    gonorrhea:{
      title:"១. ជំងឺប្រមេះទឹកបាយ",
      incubation:"២ ទៅ ៣ ថ្ងៃទើបចេញរោគសញ្ញា",
      men:"ពិបាកនោម នោមឈឺ ទឹកនោមមានខ្ទុះពណ៌លឿង ឬពណ៌បៃតងចេញពីបង្ហួរនោម។",
      women:"ពិបាកនោម នោមឈឺ ឈឺតាមបង្ហួរនោម ឈឺនៅមាត់ស្បូន និងតាមរន្ធទ្វារមាស។",
      danger:"អាចបង្កឱ្យរលាកធ្ងន់ធ្ងរ និងបាត់បង់លទ្ធភាពមានកូន (អារ)។",
      icon:"⚠️"
    },
    warts:{
      title:"២. ជំងឺសិរមាន់",
      incubation:"សាច់ពកដុះបន្តិចម្តងៗលើប្រដាប់បន្តពូជ",
      men:"មានសាច់ពកទំហំប៉ុនជើងធូប រហូតដល់ធំប៉ុនចុងម្រាមដៃ។",
      women:"សាច់ពកខ្លះមានរាងមូលដូចផ្កាខាត់ណា (ផ្នែកខាងលើមានសភាពក្រិនដូចសិររបស់សត្វមាន់)។",
      danger:"ឆ្លងរាលដាលលឿន និងបង្កឱ្យមានការពិបាកខ្លាំងពេលសម្រាលកូន។",
      icon:"🐓"
    },
    syphilis:{
      title:"៣. ជំងឺស្វាយ",
      incubation:"រោគសញ្ញាដំបូងមានដំបៅមិនឈឺចាប់",
      men:"មានដំបៅលើប្រដាប់បន្តពូជ និងកន្លែងដទៃ។ ដំបៅនេះមិនឈឺចាប់ទេ ហើយជាសះស្បើយទៅវិញដោយឯកឯង។",
      women:"មានកូនកណ្តុរនៅក្រលៀន មិនឈឺ មិនរលួយ ហើយរលាយទៅវិញដោយឯកឯង។",
      danger:"បើទុកយូរ មេរោគស៊ីដល់ឆ្អឹង បេះដូង និងប្រព័ន្ធប្រសាទខួរក្បាល។",
      icon:"🟣"
    },
    chlamydia:{
      title:"៤. ជំងឺប្រមេះទឹកថ្លា",
      incubation:"លេចឡើងបន្តិចម្តងៗ",
      men:"ឈឺចាប់ ក្រហាយពេលនោម នោមញឹកញាប់ មានទឹកថ្លាចេញពីបង្ហួរនោម និងជួនកាលមានហូរខ្ទុះ។",
      women:"ភាគច្រើនគ្មានរោគសញ្ញាអ្វីទាំងអស់នៅពេលដំបូង ប៉ុន្តែបើទុកយូរអាចបណ្តាលឱ្យរលាកតួស្បូន ដៃស្បូន និងលែងមានកូន។",
      danger:"ធ្វើឱ្យស្ត្រីលែងមានកូនដោយមិនដឹងខ្លួន។",
      icon:"💧"
    },
    chancroid:{
      title:"៥. ជំងឺសង់មូ (Chancroid)",
      incubation:"២ ទៅ ៣ ថ្ងៃដំបូង",
      men:"មានកន្ទួល ២ ទៅ ៣ ទន់ហើយក្រហម រួច ២-៣ ថ្ងៃក្រោយក្លាយជាដំបៅ។ ចំពោះបុរស ដំបៅនេះឈឺចាប់ខ្លាំង។",
      women:"ចំពោះស្ត្រីមិនឈឺចាប់ទេ។ ដំបៅមានតែមួយទន់ បាតមានខ្ទុះ និងចេញឈាមពេលប៉ះពាល់។",
      danger:"កូនកណ្តុរនៅក្រលៀនម្ខាង ពណ៌ក្រហម ឈឺខ្លាំង មានខ្ទុះ និងធ្លាយ។",
      icon:"🔴"
    }
  };

  const hivStagesData=[
    {
      stage:"ដំណាក់កាលទី ១ ៖ ដំណាក់ចំហ (Window Period)",
      duration:"២ ដល់ ១២ សប្តាហ៍",
      symptom:"(-) គ្មានរោគសញ្ញាអ្វីឡើយ សុខភាពធម្មតា",
      blood:"(-) អវិជ្ជមាន (មិនទាន់ឃើញមេរោគក្នុងឈាម)",
      transmission:"(+++) ខ្ពស់បំផុត! ចម្លងទៅអ្នកដទៃយ៉ាងខ្លាំង",
      note:"មនុស្សមើលទៅស្រស់សង្ហា និងរឹងមាំ ប៉ុន្តែមេរោគចាប់ផ្តើមពង្រាយកម្លាំង។",
      badgeColor:"bg-amber-100 text-amber-900 border-amber-300"
    },
    {
      stage:"ដំណាក់កាលទី ២ ៖ ដំណាក់តេស្តឈាមវិជ្ជមាន (Asymptomatic HIV)",
      duration:"២ ដល់ ១០ ឆ្នាំ",
      symptom:"(-) គ្មានរោគសញ្ញាច្បាស់លាស់ សុខភាពនៅធម្មតា",
      blood:"(+) វិជ្ជមាន (រកឃើញមេរោគអេដស៍ក្នុងឈាម)",
      transmission:"(++) មធ្យម (ទាបជាងដំណាក់ចំហ)",
      note:"មេរោគចូលទៅកម្ទេចប្រព័ន្ធការពាររាងកាយ (កោសិកា CD4) បន្តិចម្តងៗ។",
      badgeColor:"bg-purple-100 text-purple-900 border-purple-300"
    },
    {
      stage:"ដំណាក់កាលទី ៣ ៖ ដំណាក់ជំងឺអេដស៍ពេញលេញ (Full-blown AIDS)",
      duration:"១០ ដល់ ១២ ឆ្នាំ",
      symptom:"(+) គ្រុនក្តៅបែកញើសពេលយប់ >១ខែ, ស្រកទម្ងន់ >១០%, រាករូស >១ខែ, ជំងឺឱកាសនិយម (របេង រលាកសួត ផ្សិត)",
      blood:"(+) វិជ្ជមាន ទាំងស្រុង",
      transmission:"(+) ចម្លងទៅអ្នកដទៃជាប្រចាំ",
      note:"ដំណាក់ចុងក្រោយ ខ្លួនប្រាណទ្រុឌទ្រោម កម្លាំងចុះខ្សោយខ្លាំង (ជិតស្លាប់)។",
      badgeColor:"bg-rose-100 text-rose-900 border-rose-300"
    }
  ];

  return e.jsx("div",{className:"fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4",children:
    e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200",children:[
      e.jsxs("div",{className:"relative bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 p-4 sm:p-6 text-white shrink-0",children:[
        e.jsx("button",{type:"button",onClick:t,className:"absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center font-black transition cursor-pointer text-sm",children:"✕"}),
        e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[
          e.jsx("span",{className:"px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
          e.jsx("span",{className:"text-xs text-rose-100 font-bold",children:"ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ (ទំព័រ ៥២-៥៩)"})
        ]}),
        e.jsx("h2",{className:"text-lg sm:text-2xl font-bold font-moul tracking-wide drop-shadow-sm",children:"មេរៀនទី ៩ ៖ សុខភាពបន្តពូជ"}),
        e.jsx("p",{className:"text-xs text-rose-100 mt-1 max-w-2xl line-clamp-1",children:"សុខភាពផ្លូវភេទ និងបន្តពូជ • បញ្ហាប្រឈមគ្រោះថ្នាក់ • ៥ ជំងឺកាមរោគ • ដំណាក់កាលវិវត្តមេរោគអេដស៍"}),
        e.jsxs("div",{className:"flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar",children:[
          {id:"tab-hero",label:"🌟 ទិដ្ឋភាពទូទៅ"},
          {id:"tab-theory",label:"📖 ខ្លឹមសារមេរៀន"},
          {id:"tab-lab",label:"🧪 ពិសោធន៍ & ស្វែងយល់"},
          {id:"tab-quiz",label:"📝 តេស្ត ៤០ QCM"}
        ].map(tb=>e.jsx("button",{type:"button",onClick:()=>i(tb.id),className:\`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer \${n===tb.id?"bg-white text-rose-700 shadow-md":"bg-white/20 text-white hover:bg-white/30"}\`,children:tb.label},tb.id))})
      ]}),

      e.jsx("div",{className:"p-4 sm:p-6 overflow-y-auto flex-1 space-y-5",children:[
        n==="tab-hero"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:[
            e.jsxs("div",{className:"bg-rose-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-rose-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"❤️"}),
              e.jsx("div",{className:"text-lg font-black text-rose-700 dark:text-rose-400",children:"៣ ផ្នែក"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"ខ្លឹមសារពេញលេញ"})
            ]}),
            e.jsxs("div",{className:"bg-amber-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-amber-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"⚠️"}),
              e.jsx("div",{className:"text-lg font-black text-amber-700 dark:text-amber-400",children:"៥ ជំងឺ"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"កាមរោគចម្បង"})
            ]}),
            e.jsxs("div",{className:"bg-purple-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-purple-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"🔬"}),
              e.jsx("div",{className:"text-lg font-black text-purple-700 dark:text-purple-400",children:"៣ ដំណាក់"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"វិវត្តមេរោគអេដស៍"})
            ]}),
            e.jsxs("div",{className:"bg-emerald-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-emerald-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"📝"}),
              e.jsx("div",{className:"text-lg font-black text-emerald-700 dark:text-emerald-400",children:"៤០ QCM"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"សំណួរវាស់ចំណេះ"})
            ]})
          ]}),

          e.jsxs("div",{className:"bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/60 p-4 sm:p-5 rounded-3xl border border-rose-200/80 dark:border-slate-700 space-y-3",children:[
            e.jsx("h3",{className:"font-bold text-sm sm:text-base text-slate-900 dark:text-white font-moul",children:"សេចក្តីសង្ខេបខ្លឹមសារមេរៀនទី ៩"}),
            e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"មេរៀននេះបង្រៀនសិស្សានុសិស្សឱ្យយល់ដឹងពីសុខភាពផ្លូវភេទ និងសុខភាពបន្តពូជ បញ្ហាប្រឈមគ្រោះថ្នាក់នៃការមានកូនក្នុងវ័យក្មេងពេក (<១៨ ឆ្នាំ) ឬវ័យចំណាស់ពេក (>៣៥ ឆ្នាំ) រោគសញ្ញានៃជំងឺកាមរោគទាំង ៥ (ប្រមេះទឹកបាយ សិរមាន់ ស្វាយ ប្រមេះទឹកថ្លា សង់មូ) និងដំណាក់កាលវិវត្តនៃមេរោគអេដស៍ក្នុងរាងកាយ ព្រមទាំងការការពារខ្លួនដោយប្រើស្រោមអនាម័យ។"}),
            e.jsxs("div",{className:"flex items-center gap-3 pt-2",children:[
              e.jsxs("button",{type:"button",onClick:()=>i("tab-theory"),className:"px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📖"})," អានខ្លឹមសារលម្អិត"]}),
              e.jsxs("button",{type:"button",onClick:()=>i("tab-quiz"),className:"px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ចាប់ផ្តើមធ្វើតេស្ត ៤០ QCM"]})
            ]})
          ]})
        ]}),

        n==="tab-theory"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2",children:[
            [
              {id:1,label:"ផ្នែកទី ១ ៖ សុខភាពផ្លូវភេទ & បន្តពូជ"},
              {id:2,label:"ផ្នែកទី ២ ៖ បញ្ហាប្រឈម & ជំងឺកាមរោគ"},
              {id:3,label:"ផ្នែកទី ៣ ៖ មេរោគអេដស៍ & ជំងឺអេដស៍"}
            ].map(part=>e.jsx("button",{type:"button",onClick:()=>setActiveTheoryPart(part.id),className:\`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${activeTheoryPart===part.id?"bg-rose-600 text-white shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"}\`,children:part.label},part.id))
          ]}),

          activeTheoryPart===1&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-rose-700 dark:text-rose-400 font-moul",children:"ផ្នែកទី ១ ៖ សុខភាពផ្លូវភេទ និងសុខភាពបន្តពូជ"}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2",children:"✨ ១. សុខភាពល្អ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"មានន័យថាទាំងផ្លូវកាយទាំងផ្លូវចិត្តពុំមានរោគា ឬបញ្ហាអ្វីមកបៀតបៀនឡើយ។ មនុស្សគ្រប់រូបតែងមានបំណងប្រាថ្នាចម្បងគឺការមានសុខភាពល្អ។"})
            ]}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2",children:"🌸 ២. សុខភាពផ្លូវភេទ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"គឺជាភាពគ្មានជំងឺឆ្លងនៅលើប្រដាប់ភេទ និងការសម្តែងឱ្យឃើញផ្នែកខាងផ្លូវចិត្ត អារម្មណ៍ និងរូបរាងកាយតាមរយៈផ្លូវភេទ។ វាមិនផ្តោតតែទៅលើជំងឺឆ្លងតាមការរួមភេទប៉ុណ្ណោះទេ គឺត្រូវគិតទាំងតម្រូវការនៃការរួមភេទ និងភាពស្អាតនៃរាងកាយថែមទៀត។"})
            ]}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2",children:"🌿 ៣. សុខភាពបន្តពូជ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"គឺជាភាពពេញលេញនៃសុខុមាលភាពខាងរូបរាងកាយ សេចក្តីសុខសាន្តក្នុងសង្គម ទាំងផ្លូវកាយ និងផ្លូវចិត្ត នៅគ្រប់ករណីទាំងអស់ដែលទាក់ទងទៅនឹងប្រដាប់បន្តពូជ មុខងារ និងដំណើរការរបស់វា។ វាមិនមែនសំដៅតែលើភាពគ្មានជំងឺនៃសរីរាង្គបន្តពូជប៉ុណ្ណោះទេ គឺរួមបញ្ចូលទាំងការរួមភេទដោយសុវត្ថិភាពនិងដោយពេញចិត្ត មានសមត្ថភាពបង្កើតកូន និងមានសេរីភាពក្នុងការសម្រេចចិត្ត (ឧទាហរណ៍៖ តើចង់បានកូនឬទេ? តើចង់បានកូននៅពេលណា? តើត្រូវយកកូនចំនួនប៉ុន្មាននាក់?)។"})
            ]})
          ]}),

          activeTheoryPart===2&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-rose-700 dark:text-rose-400 font-moul",children:"ផ្នែកទី ២ ៖ បញ្ហាប្រឈមនឹងគ្រោះថ្នាក់នៃសុខភាពបន្តពូជ"}),
            e.jsxs("div",{className:"bg-amber-50 dark:bg-slate-800 p-4 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-amber-900 dark:text-amber-400",children:"ក. ការប្រឈមនឹងការមានកូន ៖"}),
              e.jsx("p",{className:"text-xs text-slate-700 dark:text-slate-300",children:"• ការមានផ្ទៃពោះនៅពេលមានអាយុតិចជាង ១៨ ឆ្នាំ (វ័យក្មេងពេក)។"}),
              e.jsx("p",{className:"text-xs text-slate-700 dark:text-slate-300",children:"• ការមានផ្ទៃពោះនៅពេលមានអាយុលើសពី ៣៥ ឆ្នាំ (វ័យចំណាស់ពេក)។"})
            ]}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3",children:[
              e.jsx("h4",{className:"font-bold text-xs text-rose-700 dark:text-rose-400",children:"ខ. ការប្រឈមនឹងជំងឺកាមរោគទាំង ៥ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-500",children:"ជំងឺកាមរោគជាជំងឺរលាកប្រដាប់បន្តពូជធ្ងន់ធ្ងរ ដែលអាចបណ្តាលឱ្យគ្មានលទ្ធភាពមានកូន និងអាចជាជំងឺឆ្លងរាលដាល ប្រសិនបើពុំបានព្យាបាលឱ្យបានជាសះស្បើយ។ កើតឡើងដោយសារការមានគូស្នេហ៍ច្រើន និងមិនបានប្រើប្រាស់ស្រោមអនាម័យ៖"}),
              e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",children:
                Object.keys(stisData).map(k=>{
                  const d=stisData[k];
                  return e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1.5",children:[
                    e.jsxs("div",{className:"flex items-center justify-between",children:[
                      e.jsxs("span",{className:"font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5",children:[e.jsx("span",{children:d.icon}),d.title]}),
                      e.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold",children:d.incubation})
                    ]}),
                    e.jsxs("p",{className:"text-[11px] text-slate-600 dark:text-slate-300",children:[e.jsx("strong",{className:"text-blue-600",children:"បុរស ៖ "}),d.men]}),
                    e.jsxs("p",{className:"text-[11px] text-slate-600 dark:text-slate-300",children:[e.jsx("strong",{className:"text-pink-600",children:"ស្ត្រី ៖ "}),d.women]}),
                    e.jsxs("p",{className:"text-[10px] text-rose-600 dark:text-rose-400 font-bold",children:[e.jsx("span",{children:"⚠️ ផលវិបាក ៖ "}),d.danger]})
                  ]},k)
                })
              )
            ]})
          ]}),

          activeTheoryPart===3&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-rose-700 dark:text-rose-400 font-moul",children:"ផ្នែកទី ៣ ៖ ការប្រឈមនឹងមេរោគអេដស៍ និងជំងឺអេដស៍ (HIV/AIDS)"}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white",children:"១. រោគសញ្ញាទូទៅរបស់អ្នកជំងឺអេដស៍ ៖"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• គ្រុនក្តៅ និងបែកញើសនៅពេលយប់ជាញឹកញាប់ដោយគ្មានមូលហេតុលើសពី ១ ខែ។"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• ស្រកទម្ងន់ ១០ ភាគរយ ឬច្រើនជាងនេះធៀបទៅនឹងទម្ងន់ខ្លួន។"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• រាករូសលើសពី ១ ខែ អស់កម្លាំងល្ហិតល្ហៃជាប្រចាំដោយគ្មានមូលហេតុ។"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• មានរមាស់លើស្បែក និងមានផ្សិតនៅបំពង់ក។"}),
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"• កើតជំងឺឱកាសនិយមផ្សេងៗ ដូចជា ជំងឺរបេង រលាកសួត ឡើងកូនកណ្តុរ ផ្សិតក្នុងមាត់ និងរាករូសធ្ងន់ធ្ងរ។"})
            ]}),

            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3",children:[
              e.jsx("h4",{className:"font-bold text-xs text-slate-900 dark:text-white",children:"២. តារាង ៣ ដំណាក់កាលវិវត្តនៃមេរោគអេដស៍ក្នុងរាងកាយ ៖"}),
              e.jsx("div",{className:"space-y-2.5",children:
                hivStagesData.map((st,idx)=>e.jsxs("div",{className:"p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-1.5",children:[
                  e.jsxs("div",{className:"flex items-center justify-between",children:[
                    e.jsx("span",{className:"font-bold text-xs text-slate-900 dark:text-white font-moul",children:st.stage}),
                    e.jsx("span",{className:\`text-[10px] px-2.5 py-0.5 rounded-full font-bold border \${st.badgeColor}\`,children:st.duration})
                  ]}),
                  e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]",children:[
                    e.jsxs("div",{children:[e.jsx("strong",{children:"រោគសញ្ញា ៖ "}),st.symptom]}),
                    e.jsxs("div",{children:[e.jsx("strong",{children:"ពិនិត្យឈាម ៖ "}),st.blood]}),
                    e.jsxs("div",{children:[e.jsx("strong",{children:"ការចម្លងរោគ ៖ "}),st.transmission]})
                  ]}),
                  e.jsxs("p",{className:"text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/60 dark:border-slate-800",children:["💡 ",st.note]})
                ]},idx))
              }),
              e.jsxs("div",{className:"p-3 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-300 font-bold flex items-center gap-2",children:[
                e.jsx("span",{className:"text-base",children:"⚠️"}),
                "ចំណាំសំខាន់ ៖ មនុស្សដែលមានរូបរាងស្អាត ស្រស់សង្ហា មិនប្រាកដថាគ្មានមេរោគអេដស៍ឡើយ។"
              ]})
            ]})
          ]})
        ]}),

        n==="tab-lab"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2",children:[
            e.jsx("button",{type:"button",onClick:()=>setActiveLabTool("stis"),className:\`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${activeLabTool==="stis"?"bg-rose-600 text-white shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}\`,children:"🔬 ស្វែងយល់ពី ៥ ជំងឺកាមរោគ"}),
            e.jsx("button",{type:"button",onClick:()=>setActiveLabTool("hiv_stages"),className:\`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${activeLabTool==="hiv_stages"?"bg-purple-700 text-white shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}\`,children:"⏱️ បន្ទាត់ពេលវេលា ៣ ដំណាក់កាលអេដស៍"})
          ]}),

          activeLabTool==="stis"&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("p",{className:"text-xs text-slate-500",children:"ចុចជ្រើសរើសជំងឺកាមរោគណាមួយ ដើម្បីស្វែងយល់ពីរោគសញ្ញាលើបុរស-ស្ត្រី និងផលវិបាក ៖"}),
            e.jsx("div",{className:"flex items-center gap-2 overflow-x-auto no-scrollbar py-1",children:
              Object.keys(stisData).map(k=>e.jsxs("button",{type:"button",onClick:()=>setSelectedSti(k),className:\`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${selectedSti===k?"bg-rose-600 text-white shadow-md":"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"}\`,children:[
                e.jsx("span",{children:stisData[k].icon}),
                stisData[k].title
              ]},k))
            }),
            (()=>{
              const cur=stisData[selectedSti];
              return e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-rose-200 dark:border-slate-700 shadow-sm space-y-4",children:[
                e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3",children:[
                  e.jsxs("h4",{className:"font-bold text-base text-slate-900 dark:text-white font-moul flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl",children:cur.icon}),cur.title]}),
                  e.jsxs("span",{className:"text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full",children:["រយៈពេលសម្ងំ ៖ ",cur.incubation]})
                ]}),
                e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[
                  e.jsxs("div",{className:"p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5",children:[
                    e.jsx("h5",{className:"font-bold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1",children:"👨 រោគសញ្ញាចំពោះបុរស"}),
                    e.jsx("p",{className:"text-xs text-slate-700 dark:text-slate-300 leading-relaxed",children:cur.men})
                  ]}),
                  e.jsxs("div",{className:"p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 space-y-1.5",children:[
                    e.jsx("h5",{className:"font-bold text-xs text-pink-900 dark:text-pink-300 flex items-center gap-1",children:"👩 រោគសញ្ញាចំពោះស្ត្រី"}),
                    e.jsx("p",{className:"text-xs text-slate-700 dark:text-slate-300 leading-relaxed",children:cur.women})
                  ]})
                ]}),
                e.jsxs("div",{className:"p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-300 font-bold flex items-center gap-2",children:[
                  e.jsx("span",{className:"text-xl",children:"⚠️"}),
                  e.jsxs("span",{children:[e.jsx("strong",{children:"ផលវិបាកធ្ងន់ធ្ងរ ៖ "}),cur.danger]})
                ]}),
                e.jsxs("div",{className:"p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-300 font-bold flex items-center gap-2",children:[
                  e.jsx("span",{children:"🛡️"}),
                  "វិធីការពារចម្បង ៖ ប្រើប្រាស់ស្រោមអនាម័យពេលរួមភេទជាប់លាប់ និងស្មោះត្រង់មួយនឹងមួយ។"
                ]})
              ]});
            })()
          ]}),

          activeLabTool==="hiv_stages"&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("p",{className:"text-xs text-slate-500",children:"ចុចជ្រើសរើសដំណាក់កាលណាមួយ ដើម្បីស្វែងយល់ពីលក្ខណៈវិវត្តរបស់មេរោគអេដស៍ ៖"}),
            e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2.5",children:
              hivStagesData.map((st,idx)=>e.jsxs("button",{type:"button",onClick:()=>setSelectedHivStage(idx),className:\`p-3.5 rounded-2xl text-left border-2 transition cursor-pointer \${selectedHivStage===idx?"border-purple-600 bg-purple-50 dark:bg-purple-950/50 shadow-md":"border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"}\`,children:[
                e.jsx("div",{className:"text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase",children:\`ដំណាក់កាលទី \${idx+1}\`}),
                e.jsx("div",{className:"font-bold text-xs text-slate-900 dark:text-white font-moul mt-0.5",children:st.stage.split("៖")[1]||st.stage}),
                e.jsx("div",{className:"text-[11px] text-slate-500 mt-1 font-semibold",children:\`⏱️ \${st.duration}\`})
              ]},idx))
            }),
            (()=>{
              const st=hivStagesData[selectedHivStage];
              return e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-purple-200 dark:border-slate-700 shadow-sm space-y-4",children:[
                e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3",children:[
                  e.jsx("h4",{className:"font-bold text-sm sm:text-base text-slate-900 dark:text-white font-moul",children:st.stage}),
                  e.jsx("span",{className:\`text-xs px-3 py-1 rounded-full font-bold border \${st.badgeColor}\`,children:st.duration})
                ]}),
                e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[
                  e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1",children:[
                    e.jsx("div",{className:"text-xs font-bold text-slate-500",children:"រោគសញ្ញាក្នុងខ្លួន"}),
                    e.jsx("div",{className:"text-xs font-bold text-slate-900 dark:text-white leading-snug",children:st.symptom})
                  ]}),
                  e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1",children:[
                    e.jsx("div",{className:"text-xs font-bold text-slate-500",children:"លទ្ធផលពិនិត្យឈាម"}),
                    e.jsx("div",{className:"text-xs font-bold text-slate-900 dark:text-white leading-snug",children:st.blood})
                  ]}),
                  e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1",children:[
                    e.jsx("div",{className:"text-xs font-bold text-slate-500",children:"កម្រិតចម្លងរោគទៅអ្នកដទៃ"}),
                    e.jsx("div",{className:"text-xs font-bold text-rose-600 dark:text-rose-400 leading-snug",children:st.transmission})
                  ]})
                ]}),
                e.jsxs("div",{className:"p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 text-xs text-purple-900 dark:text-purple-300 leading-relaxed font-semibold",children:[
                  e.jsx("strong",{children:"💡 ការពន្យល់ ៖ "}),
                  st.note
                ]})
              ]});
            })()
          ]})
        ]}),

        n==="tab-quiz"&&e.jsxs("div",{className:"space-y-4 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3",children:[
            e.jsxs("div",{children:[
              e.jsxs("span",{className:"text-xs font-bold text-rose-700 dark:text-rose-400 font-moul",children:["សំណួរទី ",(currentQIndex+1)," / ៤០"]}),
              e.jsx("p",{className:"text-[11px] text-slate-500",children:"ជ្រើសរើសចម្លើយដែលត្រឹមត្រូវបំផុត"})
            ]}),
            e.jsxs("div",{className:"flex items-center gap-2",children:[
              e.jsxs("span",{className:"px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold",children:["ពិន្ទុ ៖ ",score," / ",Object.keys(userAnswers).length]}),
              e.jsx("button",{type:"button",onClick:()=>{setUserAnswers({});setIsFinished(!1);setCurrentQIndex(0);s&&s("បានចាប់ផ្តើមតេស្តឡើងវិញ");},className:"text-xs px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer",children:"🔄 ធ្វើឡើងវិញ"})
            ]})
          ]}),

          e.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1",children:
            Zi9.map((_,idx)=>{
              const ans=userAnswers[idx];
              const isCurr=currentQIndex===idx;
              const isAns=ans!==undefined;
              const isCor=isAns&&Zi9[idx].opts[ans]&&Zi9[idx].opts[ans].c;
              return e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(idx),className:\`shrink-0 w-7 h-7 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center justify-center \${isCurr?"ring-2 ring-rose-500 ring-offset-1 font-black":""} \${isAns?(isCor?"bg-emerald-500 text-white":"bg-rose-500 text-white"):"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}\`,children:(idx+1)},idx);
            })
          }),

          e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-4",children:[
            e.jsxs("h4",{className:"text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug",children:[
              e.jsxs("span",{className:"text-rose-600 font-moul mr-2",children:[\`សំណួរទី \${currentQIndex+1} ៖\`]}),
              q.q
            ]}),

            e.jsx("div",{className:"grid grid-cols-1 gap-2.5",children:
              q.opts.map((opt,optIdx)=>{
                const isSelected=userChoice===optIdx;
                const isAnswered=userChoice!==undefined;
                let optStyle="bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700";
                if(isAnswered){
                  if(opt.c){
                    optStyle="bg-emerald-500 text-white border-emerald-600 shadow-md font-bold";
                  }else if(isSelected){
                    optStyle="bg-rose-500 text-white border-rose-600 shadow-md font-bold";
                  }else{
                    optStyle="bg-slate-50 dark:bg-slate-900/40 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60";
                  }
                }
                const prefix=["ក. ","ខ. ","គ. ","ឃ. "][optIdx]||"";
                return e.jsxs("button",{type:"button",onClick:()=>{
                  if(userChoice!==undefined)return;
                  setUserAnswers(prev=>({...prev,[currentQIndex]:optIdx}));
                  if(opt.c){
                    s&&s("ចម្លើយត្រឹមត្រូវ! +50 XP ⭐");
                  }
                },disabled:userChoice!==undefined,className:\`w-full text-left p-3.5 rounded-2xl border-2 text-xs transition-all flex items-center justify-between cursor-pointer \${optStyle}\`,children:[
                  e.jsxs("span",{className:"flex items-center gap-2",children:[
                    e.jsx("span",{className:"font-bold shrink-0",children:prefix}),
                    opt.t
                  ]}),
                  isAnswered&&(opt.c?e.jsx("span",{className:"text-sm",children:"✓"}):isSelected?e.jsx("span",{className:"text-sm",children:"✕"}):null)
                ]},optIdx);
              })
            }),

            userChoice!==undefined&&e.jsxs("div",{className:\`p-3.5 rounded-2xl text-xs space-y-1 animate-in fade-in duration-200 \${q.opts[userChoice]&&q.opts[userChoice].c?"bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-300":"bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-900 dark:text-rose-300"}\`,children:[
              e.jsx("div",{className:"font-bold flex items-center gap-1.5",children:q.opts[userChoice]&&q.opts[userChoice].c?"🎉 ពូកែណាស់! ចម្លើយត្រឹមត្រូវ":"⚠️ មិនទាន់ត្រឹមត្រូវទេ"}),
              e.jsx("p",{className:"leading-relaxed text-[11px]",children:(q.opts.find(o=>o.c)||{}).e||"ចម្លើយត្រឹមត្រូវតាមខ្លឹមសារសៀវភៅពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦។"})
            ]}),

            e.jsxs("div",{className:"flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60",children:[
              e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(prev=>Math.max(0,prev-1)),disabled:currentQIndex===0,className:"px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition cursor-pointer",children:"← សំណួរមុន"}),
              currentQIndex<39?
                e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(prev=>Math.min(39,prev+1)),className:"px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer",children:"សំណួរបន្ទាប់ →"}):
                e.jsxs("button",{type:"button",onClick:()=>{setIsFinished(!0);s&&s(\`បញ្ចប់តេស្ត! អ្នកឆ្លើយត្រូវ \${score} / ៤០ សំណួរ\`);},className:"px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer",children:["🏆 បញ្ចប់ការប្រឡង (",score,"/៤០)"]})
            ]})
          ]}),

          isFinished&&e.jsxs("div",{className:"bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-xl space-y-3 animate-in zoom-in-95 duration-200",children:[
            e.jsx("h3",{className:"text-base font-bold font-moul",children:"🎉 លទ្ធផលការប្រឡងតេស្តមេរៀនទី ៩"}),
            e.jsxs("div",{className:"flex items-center gap-4 text-xs font-bold",children:[
              e.jsxs("span",{children:["ពិន្ទុសរុប ៖ ",score," / ៤០ (",Math.round((score/40)*100),"%)"]}),
              e.jsxs("span",{children:["រង្វាន់ XP ៖ +",score*50," XP ⭐"]})
            ]}),
            e.jsx("p",{className:"text-xs text-emerald-100",children:score>=28?"អបអរសាទរ! អ្នកបានឆ្លងកាត់ការវាស់ស្ទង់សមត្ថភាពមេរៀនទី ៩ យ៉ាងជោគជ័យ។":"សូមព្យាយាមអានមេរៀនឡើងវិញ និងធ្វើតេស្តម្តងទៀតដើម្បីពង្រឹងចំណេះដឹងបន្ថែម។"}),
            e.jsx("button",{type:"button",onClick:()=>{setIsFinished(!1);setUserAnswers({});setCurrentQIndex(0);},className:"px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition cursor-pointer",children:"🔄 ធ្វើតេស្តឡើងវិញ"})
          ]})
        ]})
      ]})
    ]})
  );
};`;

// Inject Rz9 right after Rz8
const rz8Target = `});\n},Rz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"`;
if (!code.includes(rz8Target)) {
  console.error("rz8Target not found!");
  process.exit(1);
}
code = code.replace(rz8Target, `});\n},` + rz9ComponentCode + `,\nRz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"`);
console.log("Injected Rz9 component successfully!");

// 4. Update InteractiveSharedSection:
// Add [Xe9, Oe9] = y.useState(!1), [ze9, qe9] = y.useState("tab-hero");
const statesTarget = `const[Xe8,Oe8]=y.useState(!1),[ze8,qe8]=y.useState("tab-hero");`;
if (!code.includes(statesTarget)) {
  console.error("statesTarget not found in InteractiveSharedSection!");
  process.exit(1);
}
code = code.replace(statesTarget, `const[Xe8,Oe8]=y.useState(!1),[ze8,qe8]=y.useState("tab-hero"),[Xe9,Oe9]=y.useState(!1),[ze9,qe9]=y.useState("tab-hero");`);
console.log("Added Xe9, Oe9, ze9, qe9 states to InteractiveSharedSection!");

// Add Lesson 9 card in the Science carousel of InteractiveSharedSection
const startComp = code.indexOf("const InteractiveSharedSection=");
const pTranslate = code.indexOf("group-hover/btn:translate-x-1", startComp);
if (pTranslate === -1) {
  console.error("pTranslate not found!");
  process.exit(1);
}

const endCardPos = code.indexOf("]}),", pTranslate) + "]}),".length;

const lesson9CardJSX = `(activeSubject==="all"||activeSubject==="science"||H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-rose-400/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-rose-300/40",children:[
  e.jsxs("div",{children:[
    e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-rose-950 via-pink-900 to-slate-900",children:[
      e.jsx("img",{src:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",alt:"សុខភាពបន្តពូជ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
      e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-rose-950/95 via-rose-900/40 to-transparent"}),
      e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[
        e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"❤️"}),
        e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})
      ]}),
      e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[
        e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ៩ ៖ សុខភាពបន្តពូជ"}),
        e.jsx("p",{className:"text-[10px] text-rose-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៣ • ទំព័រ ៥២-៥៩ • ៤០ សំណួរ QCM"})
      ]})
    ]}),
    e.jsxs("div",{className:"p-4 space-y-3",children:[
      e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"សុខភាពផ្លូវភេទ និងបន្តពូជ ការប្រឈមនៃការមានកូន ជំងឺកាមរោគទាំង ៥ (ប្រមេះទឹកបាយ សិរមាន់ ស្វាយ...) និង ៣ ដំណាក់កាលអេដស៍។"}),
      e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-rose-900 bg-rose-50/80 p-2 rounded-xl border border-rose-100",children:[
        e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Jr,{className:"w-2.5 h-2.5 text-amber-500"})," ៣ ផ្នែកធំៗ"]}),
        e.jsx("span",{className:"text-slate-300",children:"•"}),
        e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Za,{className:"w-2.5 h-2.5 text-rose-600"})," ៥ ជំងឺកាមរោគ"]}),
        e.jsx("span",{className:"text-slate-300",children:"•"}),
        e.jsxs("span",{className:"flex items-center gap-1 text-rose-800",children:[e.jsx(Ns,{className:"w-2.5 h-2.5 text-rose-600"})," ៤០ QCM ពេញលេញ"]})
      ]})
    ]})
  ]}),
  e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[
    e.jsxs("button",{onClick:()=>{Ut||(qe9("tab-hero"),Oe9(!0));},className:"w-full py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 hover:from-rose-700 hover:to-indigo-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
      e.jsx("span",{children:"🧪"}),
      e.jsx("span",{children:"រៀន & ស្វែងយល់"})
    ]}),
    e.jsxs("button",{onClick:()=>{Ut||(qe9("tab-quiz"),Oe9(!0));},className:"w-full py-2.5 bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-700 hover:from-indigo-800 hover:to-rose-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
      e.jsx("span",{children:"📝"}),
      e.jsx("span",{children:"ប្រឡង ៤០ QCM"})
    ]})
  ]})
]}),`;

code = code.substring(0, endCardPos) + lesson9CardJSX + code.substring(endCardPos);
console.log("Injected Lesson 9 card into Science carousel!");

// Add Rz9 modal opener inside InteractiveSharedSection
const modalRz8Target = `e.jsx(Rz8,{isOpen:Xe8,onClose:()=>Oe8(!1),onShowToast:u,initialTab:ze8}),`;
if (!code.includes(modalRz8Target)) {
  console.error("modalRz8Target not found in InteractiveSharedSection!");
  process.exit(1);
}
code = code.replace(modalRz8Target, modalRz8Target + `e.jsx(Rz9,{isOpen:Xe9,onClose:()=>Oe9(!1),onShowToast:u,initialTab:ze9}),`);
console.log("Injected Rz9 modal opener into InteractiveSharedSection!");

// Add exam click handler for Lesson 9 quiz
const examClickTarget = `if(Pt.id.includes("lesson-8")||Pt.id.includes("lesson8")||Pt.title.includes("មេរៀនទី ៨")||Pt.title.includes("ការការពារកុំឱ្យមានគភ៌"))qe8("tab-quiz"),Oe8(!0);else `;
if (code.includes(examClickTarget)) {
  const examClickReplacement = `if(Pt.id.includes("lesson-9")||Pt.id.includes("lesson9")||Pt.title.includes("មេរៀនទី ៩")||Pt.title.includes("សុខភាពបន្តពូជ"))qe9("tab-quiz"),Oe9(!0);else ` + examClickTarget;
  code = code.replace(examClickTarget, examClickReplacement);
  console.log("Injected exam click handler for Lesson 9!");
}

// 5. In U_ (Student Portal): Add activeLessonModal === 9
const studentRz8Target = `activeLessonModal===8&&e.jsx(Rz8,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})`;
if (code.includes(studentRz8Target)) {
  code = code.replace(studentRz8Target, studentRz8Target + `,activeLessonModal===9&&e.jsx(Rz9,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})`);
  console.log("Injected Rz9 modal into Student Portal (U_)!");
}

// 6. In he memo (quizzes memo), add Iz9
const heMemoTarget = `at.some(ys=>ys.id===Iz8.id||ys.title.includes("មេរៀនទី ៨"))||at.unshift(Iz8),`;
if (code.includes(heMemoTarget)) {
  code = code.replace(heMemoTarget, heMemoTarget + `at.some(ys=>ys.id===Iz9.id||ys.title.includes("មេរៀនទី ៩"))||at.unshift(Iz9),`);
  console.log("Added Iz9 to quizzes memo (he)!");
}

// Save files
fs.writeFileSync(filePath, code);
fs.writeFileSync(distPath, code);
console.log("All changes written successfully! Final file length:", code.length);
