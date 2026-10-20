import fs from 'node:fs';

const filePath = 'public/assets/index-BwPwHqBe.js';
const distPath = 'dist/assets/index-BwPwHqBe.js';

if (!fs.existsSync(filePath)) {
    console.error("Bundle file not found!");
    process.exit(1);
}

let code = fs.readFileSync(filePath, 'utf8');
console.log("Initial code length:", code.length);

// 1. All 40 questions for Lesson 10
const rawPrompt = `សំណួរទី ១ ៖ តើអាហារជាអ្វីសម្រាប់ជីវិតមនុស្ស?
 ក. ជាតម្រូវការបន្ទាប់បន្សំមិនសូវសំខាន់
 ខ. ជាតម្រូវការចាំបាច់បំផុតក្រៅពីខ្យល់និងទឹក  ចម្លើយត្រឹមត្រូវ
 គ. ជាអ្វីដែលមនុស្សមិនចាំបាច់បរិភោគក៏បាន
 ឃ. ជាតម្រូវការសម្រាប់តែពេលមានជំងឺប៉ុណ្ណោះ
សំណួរទី ២ ៖ តើលំនាំនៃការបំបែកអាហារឱ្យទៅជាសារធាតុងាយហៅថាអ្វី?
 ក. ការរំលាយអាហារ  ចម្លើយត្រឹមត្រូវ
 ខ. ការដកដង្ហើមចេញចូល
 គ. ការបញ្ចេញកាកសំណល់
 ឃ. ការដុះលូតលាស់នៃឆ្អឹង
សំណួរទី ៣ ៖ តើការរំលាយអាហារប្រព្រឹត្តទៅក្នុងសរីរាង្គណា?
 ក. ប្រដាប់ដកដង្ហើម
 ខ. ប្រដាប់របត់ឈាម
 គ. ប្រដាប់រំលាយអាហារ  ចម្លើយត្រឹមត្រូវ
 ឃ. ប្រព័ន្ធសរសៃប្រសាទ
សំណួរទី ៤ ៖ តើសរីរាង្គណាមិនមែនជាផ្នែកនៃប្រដាប់រំលាយអាហារ?
 ក. មាត់ និងក្រពះ
 ខ. សួត និងបេះដូង  ចម្លើយត្រឹមត្រូវ
 គ. ពោះវៀនតូច និងពោះវៀនធំ
 ឃ. បំពង់អាហារ និងដើមក
សំណួរទី ៥ ៖ តើមាត់ផ្គុំឡើងពីអ្វីខ្លះ?
 ក. បបូរមាត់ ធ្មេញ និងអណ្តាត  ចម្លើយត្រឹមត្រូវ
 ខ. ភ្នែក ច្រមុះ និងត្រចៀក
 គ. ដៃ ជើង និងស្មា
 ឃ. ក្បាល ទ្រូង និងពោះ
សំណួរទី ៦ ៖ តើផ្នែកណាខ្លះជាក្រពេញរំលាយអាហារ?
 ក. បេះដូង និងសួត
 ខ. ក្រពេញទឹកមាត់ ថ្លើម ប្រមាត់ លំពែង  ចម្លើយត្រឹមត្រូវ
 គ. ក្រពេញញើស និងក្រពេញទឹកភ្នែក
 ឃ. ខួរក្បាល និងឆ្អឹងខ្នង
សំណួរទី ៧ ៖ តើពោះវៀនតូចមានប្រវែងប្រហែលប៉ុន្មានម៉ែត្រ?
 ក. ១ ទៅ ២ ម៉ែត្រ
 ខ. ៣ ទៅ ៤ ម៉ែត្រ
 គ. ៥ ទៅ ៦ ម៉ែត្រ
 ឃ. ៧ ទៅ ៨ ម៉ែត្រ  ចម្លើយត្រឹមត្រូវ
សំណួរទី ៨ ៖ តើពោះវៀនធំមានប្រវែងប្រហែលប៉ុន្មានម៉ែត្រ?
 ក. ១.២ ទៅ ១.៥ ម៉ែត្រ  ចម្លើយត្រឹមត្រូវ
 ខ. ៣.៥ ទៅ ៤.៥ ម៉ែត្រ
 គ. ៥.០ ទៅ ៧.០ ម៉ែត្រ
 ឃ. ០.៥ ទៅ ០.៨ ម៉ែត្រ
សំណួរទី ៩ ៖ តើបបូរមាត់មានតួនាទីអ្វី?
 ក. ទំពាសង្កត់អាហារឱ្យល្អិត
 ខ. ទទួលអាហារចូលក្នុងមាត់  ចម្លើយត្រឹមត្រូវ
 គ. ត្រឡប់សរសៀរអាហារឱ្យធ្មេញ
 ឃ. បញ្ចេញទឹកមាត់បំបែកអាហារ
សំណួរទី ១០ ៖ តើអណ្តាតមានតួនាទីអ្វីក្នុងមាត់?
 ក. ត្រឡប់សរសៀរអាហារទៅឱ្យធ្មេញទំពា  ចម្លើយត្រឹមត្រូវ
 ខ. កាត់អាហារឱ្យដាច់ជាកង់ៗ
 គ. បញ្ចេញរសក្រពះរំលាយអាហារ
 ឃ. ស្រូបយកសារធាតុចិញ្ចឹមចូលឈាម
សំណួរទី ១១ ៖ តើធ្មេញមានតួនាទីអ្វី?
 ក. ទទួលអាហារពីដើមក
 ខ. ទំពាសង្កត់អាហារឱ្យស្អិតដោយទឹកមាត់  ចម្លើយត្រឹមត្រូវ
 គ. បញ្ចេញទឹកប្រមាត់រំលាយអាហារ
 ឃ. រុញកាកសំណល់ទៅទ្វារធំ
សំណួរទី ១២ ៖ តើការបំប្លែងអាហារលើកទី ១ កើតឡើងនៅឯណា?
 ក. នៅក្នុងក្រពះ
 ខ. នៅក្នុងមាត់  ចម្លើយត្រឹមត្រូវ
 គ. នៅក្នុងពោះវៀនតូច
 ឃ. នៅក្នុងបំពង់អាហារ
សំណួរទី ១៣ ៖ តើទឹកមាត់មានតួនាទីអ្វី?
 ក. ធ្វើឱ្យអាហាររឹងជាងមុន
 ខ. បំប្លែងអាហារលើកទី ១ ក្នុងមាត់  ចម្លើយត្រឹមត្រូវ
 គ. បញ្ចេញកាកសំណល់មកក្រៅ
 ឃ. ស្រូបយកទឹកចូលក្នុងរាងកាយ
សំណួរទី ១៤ ៖ តើស្ថានភាពអាហារនៅក្នុងមាត់មានលក្ខណៈដូចម្តេច?
 ក. អាហាររាវលាយដូចទឹក
 ខ. អាហារល្អិតៗហើយសើម  ចម្លើយត្រឹមត្រូវ
 គ. អាហាររឹងដូចដើមមិនទាន់បំបែក
 ឃ. អាហារក្លាយជាកាកសំណល់ស្ងួត
សំណួរទី ១៥ ៖ តើដើមក និងបំពង់អាហារមានរសរំលាយអាហារដែរឬទេ?
 ក. មានរសទឹកមាត់ច្រើន
 ខ. គ្មានរសរំលាយអាហារទេ  ចម្លើយត្រឹមត្រូវ
 គ. មានរសក្រពះតិចតួច
 ឃ. មានទឹកប្រមាត់ហូរតាម
សំណួរទី ១៦ ៖ តើក្រពះបញ្ចេញរសអ្វីដើម្បីរំលាយអាហារ?
 ក. ទឹកមាត់
 ខ. រសក្រពះ  ចម្លើយត្រឹមត្រូវ
 គ. ទឹកប្រមាត់
 ឃ. រសលំពែង
សំណួរទី ១៧ ៖ តើក្រពះបំប្លែងអាហារឱ្យទៅជាស្ថានភាពអ្វី?
 ក. អាហាររឹងជាដុំៗ
 ខ. អាហាររាវលាយ  ចម្លើយត្រឹមត្រូវ
 គ. សារធាតុចិញ្ចឹមរលាយអស់
 ឃ. កាកសំណល់រឹង
សំណួរទី ១៨ ៖ តើពោះវៀនតូចប្រើរសអ្វីខ្លះដើម្បីរំលាយអាហារ?
 ក. ទឹកមាត់ និងរសក្រពះ
 ខ. ទឹកប្រមាត់ រសលំពែង និងរសពោះវៀនតូច  ចម្លើយត្រឹមត្រូវ
 គ. ទឹកនោម និងឈាម
 ឃ. រសអាស៊ីតខ្លាំងពីថ្លើម
សំណួរទី ១៩ ៖ តើការបំប្លែងអាហារដែលនៅសល់ឱ្យទៅជាអាហាររលាយកើតឡើងនៅឯណា?
 ក. ក្នុងបំពង់អាហារ
 ខ. ក្នុងពោះវៀនតូច  ចម្លើយត្រឹមត្រូវ
 គ. ក្នុងពោះវៀនធំ
 ឃ. ក្នុងមាត់
សំណួរទី ២០ ៖ តើសារធាតុចិញ្ចឹមក្នុងអាហាររលាយឆ្លងកាត់ភ្នាសអ្វីដើម្បីចូលទៅក្នុងឈាម?
 ក. ភ្នាសក្រពះ
 ខ. ភ្នាសពោះវៀនតូច  ចម្លើយត្រឹមត្រូវ
 គ. ភ្នាសបំពង់ក
 ឃ. ភ្នាសពោះវៀនធំ
សំណួរទី ២១ ៖ តើឈាមយកសារធាតុចិញ្ចឹមទៅធ្វើអ្វី?
 ក. យកទៅបញ្ចេញចោលតាមទ្វារធំ
 ខ. យកទៅចិញ្ចឹមសរីរាង្គផ្សេងៗក្នុងសារពាង្គកាយ  ចម្លើយត្រឹមត្រូវ
 គ. យកទៅផ្ទុកក្នុងបំពង់អាហារ
 ឃ. យកទៅបំប្លែងជាទឹកមាត់វិញ
សំណួរទី ២២ ៖ តើអាហារដែលមិនរលាយ (កាកសំណល់) ធ្វើដំណើរទៅណា?
 ក. ចូលទៅក្នុងក្រពះវិញ
 ខ. ចូលទៅក្នុងពោះវៀនធំ  ចម្លើយត្រឹមត្រូវ
 គ. ចូលទៅក្នុងសួត
 ឃ. ចូលទៅក្នុងខួរក្បាល
សំណួរទី ២៣ ៖ តើដំណើរផ្លូវអាហារត្រូវតាមលំដាប់លំដោយដូចម្តេច?
 ក. មាត់ -> ក្រពះ -> ដើមក -> ពោះវៀនធំ
 ខ. មាត់ -> ដើមក -> បំពង់អាហារ -> ក្រពះ -> ពោះវៀនតូច -> ពោះវៀនធំ  ចម្លើយត្រឹមត្រូវ
 គ. ក្រពះ -> មាត់ -> ពោះវៀនធំ -> ពោះវៀនតូច
 ឃ. បំពង់អាហារ -> ក្រពះ -> មាត់ -> ពោះវៀនធំ
សំណួរទី ២៤ ៖ តើបំពង់អាហារស្ថិតនៅចន្លោះសរីរាង្គណាខ្លះ?
 ក. មាត់ និងបំពង់ក
 ខ. បំពង់ក និងក្រពះ  ចម្លើយត្រឹមត្រូវ
 គ. ក្រពះ និងពោះវៀនតូច
 ឃ. ពោះវៀនតូច និងពោះវៀនធំ
សំណួរទី ២៥ ៖ តើជំងឺណាខ្លះដែលច្រើនកើតលើប្រដាប់រំលាយអាហារ?
 ក. ពុកធ្មេញ ចុកពោះ ដំបៅក្រពះ គ្រួសក្នុងប្រមាត់ រាគ  ចម្លើយត្រឹមត្រូវ
 ខ. ភ្នែកក្រហម ហៀរសំបោរ ក្អក
 គ. បាក់ឆ្អឹងដៃ ឈឺសន្លាក់ជើង
 ឃ. ថ្លង់ត្រចៀក ងងឹតភ្នែក
សំណួរទី ២៦ ៖ តើការបរិភោគអាហារច្រើនពេកអាចបណ្តាលឱ្យកើតអ្វី?
 ក. ពុកធ្មេញ
 ខ. បាក់ប្រាស ឬហល់  ចម្លើយត្រឹមត្រូវ
 គ. គ្រួសក្នុងប្រមាត់
 ឃ. រលាកខ្នែងពោះវៀន
សំណួរទី ២៧ ៖ តើអាហារក្តៅពេក ឬត្រជាក់ពេកអាចបង្កផលវិបាកអ្វី?
 ក. ខូចធ្មេញ  ចម្លើយត្រឹមត្រូវ
 ខ. រលាកខ្នែងពោះវៀន
 គ. រាគរូសខ្លាំង
 ឃ. ទល់លាមក
សំណួរទី ២៨ ៖ តើការបរិភោគអាហាររឹងពេកអាចបណ្តាលឱ្យមានបញ្ហាអ្វី?
 ក. ពុកធ្មេញ
 ខ. ទល់លាមក  ចម្លើយត្រឹមត្រូវ
 គ. ហល់ ឬបាក់ប្រាស
 ឃ. ដំបៅក្រពះ
សំណួរទី ២៩ ៖ តើការបរិភោគអាហារហឹរពេកអាចបណ្តាលឱ្យមានបញ្ហាអ្វី?
 ក. ពុកធ្មេញ
 ខ. ដំបៅក្រពះ  ចម្លើយត្រឹមត្រូវ
 គ. គ្រួសក្នុងប្រមាត់
 ឃ. ហើមពោះ
សំណួរទី ៣០ ៖ តើអាហារមិនស្អាតអាចបណ្តាលឱ្យកើតជំងឺអ្វីខ្លះ?
 ក. រលាកពោះវៀន គ្រួសក្នុងប្រមាត់ ឬរាគ  ចម្លើយត្រឹមត្រូវ
 ខ. ភ្នែកម្ញូប និងថ្លង់
 គ. បាក់ឆ្អឹង និងគ្រេច
 ឃ. ជ្រុះសក់ និងទំពែក
សំណួរទី ៣១ ៖ ដើម្បីចៀសវាងជំងឺប្រដាប់រំលាយអាហារ តើត្រូវធ្វើដូចម្តេចខ្លះ?
 ក. បរិភោគឱ្យបានច្រើនបំផុតតាមដែលអាចធ្វើបាន
 ខ. ធ្វើអនាម័យមាត់ធ្មេញ ទំពាឱ្យម៉ដ្ឋ ញ៉ាំឱ្យទៀងពេល  ចម្លើយត្រឹមត្រូវ
 គ. បរិភោគតែអាហារហឹរ និងរឹងខ្លាំង
 ឃ. មិនបាច់ញ៉ាំអាហារដែលមានជីវជាតិទេ
សំណួរទី ៣២ ៖ តើអាហារណាខ្លះដែលសម្រួលដល់ការបន្ទោបង់?
 ក. ម្ទេស និងម្រេច
 ខ. ល្ហុង ចេក  ចម្លើយត្រឹមត្រូវ
 គ. សាច់គោរឹងៗ
 ឃ. ទឹកកកត្រជាក់ខ្លាំង
សំណួរទី ៣៣ ៖ តើបំពង់រំលាយអាហាររួមមានអ្វីខ្លះ?
 ក. ត្រចៀក និងភ្នែក
 ខ. មាត់ បំពង់ក បំពង់អាហារ ក្រពះ ពោះវៀន និងទ្វារធំ  ចម្លើយត្រឹមត្រូវ
 គ. សួត និងបេះដូង
 ឃ. ឆ្អឹងខ្នង និងខួរក្បាល
សំណួរទី ៣៤ ៖ តើការទំពាអាហារឱ្យបានម៉ដ្ឋល្អផ្តល់ប្រយោជន៍អ្វី?
 ក. ធ្វើឱ្យធ្មេញឆាប់បាក់
 ខ. ជួយសម្រួលដល់ការរំលាយអាហារឱ្យកាន់តែងាយស្រួល  ចម្លើយត្រឹមត្រូវ
 គ. ធ្វើឱ្យក្រពះឈប់ធ្វើការ
 ឃ. ធ្វើឱ្យអាហាររឹងជាងមុន
សំណួរទី ៣៥ ៖ តើរសក្រពះបំប្លែងអាហារឱ្យទៅជាអ្វី?
 ក. អាហាររាវលាយ  ចម្លើយត្រឹមត្រូវ
 ខ. អាហាររឹងដូចដុំថ្ម
 គ. អាហារស្ងួតដូចម្សៅ
 ឃ. កាកសំណល់ភ្លាមៗ
សំណួរទី ៣៦ ៖ តើផ្នែកណាដែលស្រូបយកសារធាតុចិញ្ចឹមចូលក្នុងឈាម?
 ក. ភ្នាសមាត់
 ខ. ភ្នាសពោះវៀនតូច  ចម្លើយត្រឹមត្រូវ
 គ. ភ្នាសពោះវៀនធំ
 ឃ. ភ្នាសបំពង់អាហារ
សំណួរទី ៣៧ ៖ តើអាហារដែលមិនរលាយត្រូវបានបញ្ចេញមកក្រៅតាមណា?
 ក. តាមមាត់ (ក្អួត)
 ខ. តាមទ្វារលាមក (ទ្វារធំ)  ចម្លើយត្រឹមត្រូវ
 គ. តាមច្រមុះ
 ឃ. តាមស្បែក (ញើស)
សំណួរទី ៣៨ ៖ តើបំពង់កមានរសរំលាយអាហារដែរឬទេ?
 ក. មានរសក្រពះច្រើន
 ខ. គ្មានរសរំលាយអាហារទេ  ចម្លើយត្រឹមត្រូវ
 គ. មានទឹកប្រមាត់ហូរតាម
 ឃ. មានរសលំពែង
សំណួរទី ៣៩ ៖ តើអ្វីជាតួនាទីរបស់ពោះវៀនធំ?
 ក. រំលាយអាហារឱ្យរលាយអស់
 ខ. បញ្ចេញកាកសំណល់មកក្រៅ  ចម្លើយត្រឹមត្រូវ
 គ. ស្រូបយកវីតាមីនចូលឈាម
 ឃ. ទំពាសង្កត់អាហារ
សំណួរទី ៤០ ៖ តើអាហារល្អិតៗហើយសើមជាស្ថានភាពអាហារនៅត្រង់ណា?
 ក. នៅក្បាលជង្គង់
 ខ. នៅក្នុងមាត់ បំពង់ក និងបំពង់អាហារ  ចម្លើយត្រឹមត្រូវ
 គ. នៅក្នុងពោះវៀនធំ
 ឃ. នៅខាងក្រៅរាងកាយ`;

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
      e: isCorrect ? `ចម្លើយត្រឹមត្រូវ ផ្អែកលើខ្លឹមសារមេរៀនទី ១០ ៖ ប្រដាប់រំលាយអាហារ។` : `មិនត្រឹមត្រូវតាមខ្លឹមសារសៀវភៅពុម្ពវិទ្យាសាស្ត្រថ្នាក់ទី ៦ ឡើយ។`
    });
  });
  questions.push({
    q: qText,
    opts: opts
  });
});

console.log("Successfully parsed " + questions.length + " questions!");

// 2. Build Zi10 and Iz10 code string
const zi10JSON = JSON.stringify(questions);
const zi10Code = `Zi10=${zi10JSON},Iz10={id:"science-lesson-10-quiz",title:"តេស្តសមត្ថភាព ៖ មេរៀនទី ១០ - ប្រដាប់រំលាយអាហារ",subject:"វិទ្យាសាស្ត្រ",grade:"ថ្នាក់ទី ៦",questionsCount:40,durationMinutes:30,passingScore:70,description:"សំណួរពហុជ្រើសរើស ៤០ សំណួរ ដើម្បីវាស់ស្ទង់ចំណេះដឹងលើមេរៀនទី ១០ ៖ ប្រដាប់រំលាយអាហារ (ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ)",questions:Zi10},`;

// Inject Zi10, Iz10 right after Iz9={...},
const iz9Target = `questions:Zi9},`;
if (code.includes(iz9Target)) {
    code = code.replace(iz9Target, `questions:Zi9},` + zi10Code);
    console.log("Injected Zi10 and Iz10 successfully!");
}

// 3. Build Rz10 Component code
const rz10ComponentCode = `Rz10=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>{
  if(!r)return null;
  const[n,i]=y.useState(a);
  const[currentQIndex,setCurrentQIndex]=y.useState(0);
  const[userAnswers,setUserAnswers]=y.useState({});
  const[isFinished,setIsFinished]=y.useState(!1);
  const[activeTheoryPart,setActiveTheoryPart]=y.useState(1);
  const[activeLabTool,setActiveLabTool]=y.useState("anatomy");
  const[selectedOrgan,setSelectedOrgan]=y.useState("stomach");

  const q=Zi10[currentQIndex];
  const userChoice=userAnswers[currentQIndex];
  const score=Object.keys(userAnswers).filter(idx=>{
    const ans=userAnswers[idx];
    return Zi10[idx].opts[ans]&&Zi10[idx].opts[ans].c;
  }).length;

  const organsData={
    mouth:{
      title:"១. មាត់ (Mouth)",
      parts:"បបូរមាត់, ធ្មេញ, អណ្តាត, ក្រពេញទឹកមាត់",
      role:"ទំពាសង្កត់អាហារឱ្យស្អិតដោយទឹកមាត់ និងបំប្លែងអាហារលើកទី ១។",
      state:"អាហារល្អិតៗហើយសើម",
      icon:"👄"
    },
    esophagus:{
      title:"២. បំពង់អាហារ (Esophagus)",
      parts:"ស្ថិតនៅចន្លោះបំពង់ក និងក្រពះ",
      role:"ដឹកជញ្ជូនអាហារពីមាត់ទៅកាន់ក្រពះ។ គ្មានរសរំលាយអាហារទេ។",
      state:"អាហារល្អិតៗហើយសើម",
      icon:"🦒"
    },
    stomach:{
      title:"៣. ក្រពះ (Stomach)",
      parts:"សាច់ដុំរឹងមាំ និងរសក្រពះ",
      role:"បំប្លែងអាហារឱ្យទៅជាអាហាររាវលាយ ដោយប្រើរសក្រពះ។",
      state:"អាហាររាវលាយ",
      icon:"🥣"
    },
    small_intestine:{
      title:"៤. ពោះវៀនតូច (Small Intestine)",
      parts:"ប្រវែង ៧-៨ ម៉ែត្រ",
      role:"បំប្លែងអាហារឱ្យរលាយអស់ និងស្រូបយកសារធាតុចិញ្ចឹមចូលក្នុងឈាម។",
      state:"សារធាតុចិញ្ចឹមរលាយ",
      icon:"➰"
    },
    large_intestine:{
      title:"៥. ពោះវៀនធំ (Large Intestine)",
      parts:"ប្រវែង ១.២-១.៥ ម៉ែត្រ",
      role:"ផ្ទុក និងបញ្ជូនអាហារដែលមិនរលាយ (កាកសំណល់) ទៅកាន់ទ្វារធំ។",
      state:"កាកសំណល់",
      icon:"🚽"
    }
  };

  return e.jsx("div",{className:"fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4",children:
    e.jsxs("div",{className:"bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200",children:[
      e.jsxs("div",{className:"relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-4 sm:p-6 text-white shrink-0",children:[
        e.jsx("button",{type:"button",onClick:t,className:"absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center font-black transition cursor-pointer text-sm",children:"✕"}),
        e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[
          e.jsx("span",{className:"px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"}),
          e.jsx("span",{className:"text-xs text-emerald-100 font-bold",children:"ជំពូកទី ៣ ៖ មនុស្ស ភាពពេញវ័យ និងជំងឺ (មេរៀនទី ១០)"})
        ]}),
        e.jsx("h2",{className:"text-lg sm:text-2xl font-bold font-moul tracking-wide drop-shadow-sm",children:"មេរៀនទី ១០ ៖ ប្រដាប់រំលាយអាហារ"}),
        e.jsx("p",{className:"text-xs text-emerald-100 mt-1 max-w-2xl line-clamp-1",children:"រូបផ្គុំនៃប្រដាប់រំលាយអាហារ • តួនាទីបំប្លែងអាហារ • ជំងឺ និងការថែទាំអនាម័យ"}),
        e.jsxs("div",{className:"flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar",children:[
          {id:"tab-hero",label:"🌟 ទិដ្ឋភាពទូទៅ"},
          {id:"tab-theory",label:"📖 ខ្លឹមសារមេរៀន"},
          {id:"tab-lab",label:"🔬 ដំណើរផ្លូវអាហារ"},
          {id:"tab-quiz",label:"📝 តេស្ត ៤០ QCM"}
        ].map(tb=>e.jsx("button",{type:"button",onClick:()=>i(tb.id),className:\`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer \${n===tb.id?"bg-white text-emerald-700 shadow-md":"bg-white/20 text-white hover:bg-white/30"}\`,children:tb.label},tb.id))})
      ]}),

      e.jsx("div",{className:"p-4 sm:p-6 overflow-y-auto flex-1 space-y-5",children:[
        n==="tab-hero"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:[
            e.jsxs("div",{className:"bg-emerald-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-emerald-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"🍎"}),
              e.jsx("div",{className:"text-lg font-black text-emerald-700 dark:text-emerald-400",children:"១០ ផ្នែក"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"រូបផ្គុំសំខាន់ៗ"})
            ]}),
            e.jsxs("div",{className:"bg-blue-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-blue-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"📏"}),
              e.jsx("div",{className:"text-lg font-black text-blue-700 dark:text-blue-400",children:"៧-៨ ម"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"ប្រវែងពោះវៀនតូច"})
            ]}),
            e.jsxs("div",{className:"bg-amber-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-amber-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"⚠️"}),
              e.jsx("div",{className:"text-lg font-black text-amber-700 dark:text-amber-400",children:"៨ ជំងឺ"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"ដែលឧស្សាហ៍កើត"})
            ]}),
            e.jsxs("div",{className:"bg-purple-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-purple-200 dark:border-slate-700 text-center",children:[
              e.jsx("div",{className:"text-2xl mb-1",children:"📝"}),
              e.jsx("div",{className:"text-lg font-black text-purple-700 dark:text-purple-400",children:"៤០ QCM"}),
              e.jsx("div",{className:"text-[10px] text-slate-500",children:"សំណួរវាស់ចំណេះ"})
            ]})
          ]}),

          e.jsxs("div",{className:"bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/60 p-4 sm:p-5 rounded-3xl border border-emerald-200/80 dark:border-slate-700 space-y-3",children:[
            e.jsx("h3",{className:"font-bold text-sm sm:text-base text-slate-900 dark:text-white font-moul",children:"សេចក្តីសង្ខេបខ្លឹមសារមេរៀនទី ១០"}),
            e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:"អាហារជាតម្រូវការចាំបាច់បំផុតរបស់មនុស្ស។ ការរំលាយអាហារគឺជាលំនាំនៃការបំបែកអាហារឱ្យទៅជាសារធាតុងាយ ដើម្បីបញ្ជូនទៅចិញ្ចឹមរាងកាយ។ ប្រដាប់រំលាយអាហាររួមមាន មាត់ បំពង់ក បំពង់អាហារ ក្រពះ ពោះវៀន និងក្រពេញផ្សេងៗ។ មេរៀននេះក៏បង្រៀនពីការថែទាំអនាម័យដើម្បីជៀសវាងជំងឺដូចជា ពុកធ្មេញ ដំបៅក្រពះ និងរាគរូស។"}),
            e.jsxs("div",{className:"flex items-center gap-3 pt-2",children:[
              e.jsxs("button",{type:"button",onClick:()=>i("tab-theory"),className:"px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📖"})," អានខ្លឹមសារលម្អិត"]}),
              e.jsxs("button",{type:"button",onClick:()=>i("tab-quiz"),className:"px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer",children:[e.jsx("span",{children:"📝"})," ចាប់ផ្តើមធ្វើតេស្ត ៤០ QCM"]})
            ]})
          ]})
        ]}),

        n==="tab-theory"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2",children:[
            [
              {id:1,label:"ផ្នែកទី ១ ៖ រូបផ្គុំ"},
              {id:2,label:"ផ្នែកទី ២ ៖ តួនាទី"},
              {id:3,label:"ផ្នែកទី ៣ ៖ ជំងឺ & អនាម័យ"}
            ].map(part=>e.jsx("button",{type:"button",onClick:()=>setActiveTheoryPart(part.id),className:\`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer \${activeTheoryPart===part.id?"bg-emerald-600 text-white shadow-xs":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"}\`,children:part.label},part.id))
          ]}),

          activeTheoryPart===1&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-emerald-700 dark:text-emerald-400 font-moul",children:"ផ្នែកទី ១ ៖ រូបផ្គុំនៃប្រដាប់រំលាយអាហារ"}),
            e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3",children:[
              e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300",children:"ប្រដាប់រំលាយអាហារផ្គុំឡើងពីសរីរាង្គបន្តបន្ទាប់គ្នា ៖"}),
              e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[
                ["👄 មាត់ (ធ្មេញ, អណ្តាត)", "🦒 ដើមក & បំពង់អាហារ", "🥣 ក្រពះ", "➰ ពោះវៀនតូច (7-8m)", "🚽 ពោះវៀនធំ (1.2-1.5m)", "🕳️ ទ្វារធំ (លាមក)"].map((it,idx)=>e.jsx("div",{className:"p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-300",children:it},idx))
              ]}),
              e.jsxs("div",{className:"mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200",children:[
                e.jsx("h4",{className:"text-[11px] font-black text-amber-800 dark:text-amber-400 mb-1",children:"✨ ក្រពេញរំលាយអាហាររួមមាន ៖"}),
                e.jsx("p",{className:"text-[10px] text-slate-600 dark:text-slate-300",children:"ក្រពេញទឹកមាត់, ថ្លើម, ប្រមាត់, និងលំពែង។"})
              ]})
            ]})
          ]}),

          activeTheoryPart===2&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-emerald-700 dark:text-emerald-400 font-moul",children:"ផ្នែកទី ២ ៖ តួនាទីនៃប្រដាប់រំលាយអាហារ"}),
            e.jsxs("div",{className:"space-y-3",children:[
              [
                {t:"មាត់", d:"បបូរមាត់ទទួលអាហារ, អណ្តាតត្រឡប់សរសៀរ, ធ្មេញទំពាសង្កត់, ទឹកមាត់បំប្លែងលើកទី ១។", s:"អាហារល្អិតៗហើយសើម"},
                {t:"ក្រពះ", d:"បញ្ចេញរសក្រពះដើម្បីបំប្លែងអាហារមួយចំនួនឱ្យទៅជាអាហាររាវលាយ។", s:"អាហាររាវលាយ"},
                {t:"ពោះវៀនតូច", d:"បំប្លែងអាហារដែលនៅសល់ឱ្យរលាយអស់ និងស្រូបចូលឈាមទៅចិញ្ចឹមរាងកាយ។", s:"សារធាតុចិញ្ចឹម"},
                {t:"ពោះវៀនធំ", d:"អាហារដែលមិនរលាយ (កាកសំណល់) ត្រូវបញ្ជូនមកកាន់ទ្វារលាមក។", s:"កាកសំណល់"}
              ].map((role,idx)=>e.jsxs("div",{className:"p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5",children:[
                e.jsxs("div",{className:"flex items-center justify-between",children:[
                  e.jsx("span",{className:"font-bold text-xs text-emerald-700 dark:text-emerald-400",children:role.t}),
                  e.jsx("span",{className:"text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500",children:role.s})
                ]}),
                e.jsx("p",{className:"text-[11px] text-slate-600 dark:text-slate-300",children:role.d})
              ]},idx))
            ]}),
            e.jsxs("div",{className:"p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed",children:[
              e.jsx("strong",{children:"💡 ដំណើរផ្លូវអាហារ ៖ "}),
              "អាហារ -> មាត់ -> បំពង់ក -> បំពង់អាហារ -> ក្រពះ -> ពោះវៀនតូច -> ពោះវៀនធំ"
            ]})
          ]}),

          activeTheoryPart===3&&e.jsxs("div",{className:"space-y-4",children:[
            e.jsx("h3",{className:"text-sm font-bold text-emerald-700 dark:text-emerald-400 font-moul",children:"ផ្នែកទី ៣ ៖ ជំងឺ និងអនាម័យ"}),
            e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[
              e.jsxs("div",{className:"p-4 bg-rose-50 dark:bg-slate-800 rounded-2xl border border-rose-200 space-y-2",children:[
                e.jsx("h4",{className:"text-xs font-bold text-rose-700",children:"🔴 មូលហេតុបង្កជំងឺ ៖"}),
                e.jsxs("ul",{className:"text-[10px] text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-3",children:[
                  e.jsx("li",{children:"បរិភោគច្រើនពេក (បាក់ប្រាស/ហល់)"}),
                  e.jsx("li",{children:"ក្ដៅពេក ឬត្រជាក់ពេក (ខូចធ្មេញ)"}),
                  e.jsx("li",{children:"រឹងពេក (ទល់លាមក)"}),
                  e.jsx("li",{children:"ហឹរពេក (ដំបៅក្រពះ)"}),
                  e.jsx("li",{children:"មិនស្អាត (រាគ, គ្រួសក្នុងប្រមាត់)"})
                ]})
              ]}),
              e.jsxs("div",{className:"p-4 bg-emerald-50 dark:bg-slate-800 rounded-2xl border border-emerald-200 space-y-2",children:[
                e.jsx("h4",{className:"text-xs font-bold text-emerald-700",children:"🟢 ការអនុវត្តអនាម័យ ៖"}),
                e.jsxs("ul",{className:"text-[10px] text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-3",children:[
                  e.jsx("li",{children:"ធ្វើអនាម័យមាត់ធ្មេញឱ្យបានល្អ"}),
                  e.jsx("li",{children:"ទំពាអាហារឱ្យបានម៉ដ្ឋល្អ"}),
                  e.jsx("li",{children:"បរិភោគឱ្យទៀងពេលវេលា"}),
                  e.jsx("li",{children:"បរិភោគល្ហុង ចេក ដើម្បីងាយបន្ទោបង់"})
                ]})
              ]})
            ]})
          ]})
        ]}),

        n==="tab-lab"&&e.jsxs("div",{className:"space-y-5 animate-in fade-in duration-200",children:[
          e.jsx("p",{className:"text-xs text-slate-500",children:"ចុចលើសរីរាង្គនីមួយៗ ដើម្បីមើលតួនាទី និងស្ថានភាពអាហារ ៖"}),
          e.jsx("div",{className:"flex items-center gap-2 overflow-x-auto no-scrollbar py-1",children:
            Object.keys(organsData).map(k=>e.jsxs("button",{type:"button",onClick:()=>setSelectedOrgan(k),className:\`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer \${selectedOrgan===k?"bg-emerald-600 text-white shadow-md":"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"}\`,children:[
              e.jsx("span",{children:organsData[k].icon}),
              organsData[k].title.split(".")[1]
            ]},k))
          }),
          (()=>{
            const cur=organsData[selectedOrgan];
            return e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-emerald-200 dark:border-slate-700 shadow-sm space-y-4",children:[
              e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3",children:[
                e.jsxs("h4",{className:"font-bold text-base text-slate-900 dark:text-white font-moul flex items-center gap-2",children:[e.jsx("span",{className:"text-2xl",children:cur.icon}),cur.title]}),
                e.jsxs("span",{className:"text-[10px] px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold",children:["ស្ថានភាព ៖ ",cur.state]})
              ]}),
              e.jsxs("div",{className:"space-y-3",children:[
                e.jsxs("div",{className:"space-y-1",children:[
                  e.jsx("div",{className:"text-[10px] font-bold text-slate-400 uppercase",children:"រូបផ្គុំ / ទីតាំង"}),
                  e.jsx("div",{className:"text-xs text-slate-700 dark:text-slate-200 font-bold",children:cur.parts})
                ]}),
                e.jsxs("div",{className:"space-y-1",children:[
                  e.jsx("div",{className:"text-[10px] font-bold text-slate-400 uppercase",children:"តួនាទីចម្បង"}),
                  e.jsx("div",{className:"text-xs text-slate-600 dark:text-slate-300 leading-relaxed",children:cur.role})
                ]})
              ]})
            ]});
          })(),
          e.jsxs("div",{className:"p-4 bg-slate-900 rounded-3xl relative h-32 flex items-center justify-center overflow-hidden border border-slate-700",children:[
             e.jsx("div",{className:"absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"}),
             e.jsxs("div",{className:"flex items-center gap-2 sm:gap-4 z-10",children:[
               ["🍎","👄","🦒","🥣","➰","🚽"].map((icon,idx)=>e.jsxs(y.Fragment,{children:[
                 e.jsx("div",{className:"w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg shadow-inner",children:icon}),
                 idx<5&&e.jsx("div",{className:"w-4 sm:w-8 h-0.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full animate-pulse"})
               ]},idx))
             ]}),
             e.jsx("div",{className:"absolute bottom-2 text-[9px] text-slate-500 font-bold",children:"គំនូសបំព្រួញនៃដំណើរផ្លូវអាហារក្នុងសារពាង្គកាយ"})
          ]})
        ]}),

        n==="tab-quiz"&&e.jsxs("div",{className:"space-y-4 animate-in fade-in duration-200",children:[
          e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3",children:[
            e.jsxs("div",{children:[
              e.jsxs("span",{className:"text-xs font-bold text-emerald-700 dark:text-emerald-400 font-moul",children:["សំណួរទី ",(currentQIndex+1)," / ៤០"]}),
              e.jsx("p",{className:"text-[11px] text-slate-500",children:"ជ្រើសរើសចម្លើយដែលត្រឹមត្រូវបំផុត"})
            ]}),
            e.jsxs("div",{className:"flex items-center gap-2",children:[
              e.jsxs("span",{className:"px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold",children:["ពិន្ទុ ៖ ",score," / ",Object.keys(userAnswers).length]}),
              e.jsx("button",{type:"button",onClick:()=>{setUserAnswers({});setIsFinished(!1);setCurrentQIndex(0);s&&s("បានចាប់ផ្តើមតេស្តឡើងវិញ");},className:"text-xs px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer",children:"🔄 ធ្វើឡើងវិញ"})
            ]})
          ]}),

          e.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1",children:
            Zi10.map((_,idx)=>{
              const ans=userAnswers[idx];
              const isCurr=currentQIndex===idx;
              const isAns=ans!==undefined;
              const isCor=isAns&&Zi10[idx].opts[ans]&&Zi10[idx].opts[ans].c;
              return e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(idx),className:\`shrink-0 w-7 h-7 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center justify-center \${isCurr?"ring-2 ring-emerald-500 ring-offset-1 font-black":""} \${isAns?(isCor?"bg-emerald-500 text-white":"bg-rose-500 text-white"):"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}\`,children:(idx+1)},idx);
            })
          }),

          e.jsxs("div",{className:"bg-white dark:bg-slate-800 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-4",children:[
            e.jsxs("h4",{className:"text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug",children:[
              e.jsxs("span",{className:"text-emerald-600 font-moul mr-2",children:[\`សំណួរទី \${currentQIndex+1} ៖\`]}),
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
              e.jsx("p",{className:"leading-relaxed text-[11px]",children:(q.opts.find(o=>o.c)||{}).e})
            ]}),

            e.jsxs("div",{className:"flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60",children:[
              e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(prev=>Math.max(0,prev-1)),disabled:currentQIndex===0,className:"px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition cursor-pointer",children:"← សំណួរមុន"}),
              currentQIndex<39?
                e.jsx("button",{type:"button",onClick:()=>setCurrentQIndex(prev=>Math.min(39,prev+1)),className:"px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer",children:"សំណួរបន្ទាប់ →"}):
                e.jsxs("button",{type:"button",onClick:()=>{setIsFinished(!0);s&&s(\`បញ្ចប់តេស្ត! អ្នកឆ្លើយត្រូវ \${score} / ៤០ សំណួរ\`);},className:"px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer",children:["🏆 បញ្ចប់ការប្រឡង (",score,"/៤០)"]})
            ]})
          ]}),

          isFinished&&e.jsxs("div",{className:"bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-xl space-y-3 animate-in zoom-in-95 duration-200",children:[
            e.jsx("h3",{className:"text-base font-bold font-moul",children:"🎉 លទ្ធផលការប្រឡងតេស្តមេរៀនទី ១០"}),
            e.jsxs("div",{className:"flex items-center gap-4 text-xs font-bold",children:[
              e.jsxs("span",{children:["ពិន្ទុសរុប ៖ ",score," / ៤០ (",Math.round((score/40)*100),"%)"]}),
              e.jsxs("span",{children:["រង្វាន់ XP ៖ +",score*50," XP ⭐"]})
            ]}),
            e.jsx("p",{className:"text-xs text-emerald-100",children:score>=28?"អបអរសាទរ! អ្នកបានឆ្លងកាត់ការវាស់ស្ទង់សមត្ថភាពមេរៀនទី ១០ យ៉ាងជោគជ័យ។":"សូមព្យាយាមអានមេរៀនឡើងវិញ និងធ្វើតេស្តម្តងទៀតដើម្បីពង្រឹងចំណេះដឹងបន្ថែម។"}),
            e.jsx("button",{type:"button",onClick:()=>{setIsFinished(!1);setUserAnswers({});setCurrentQIndex(0);},className:"px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition cursor-pointer",children:"🔄 ធ្វើតេស្តឡើងវិញ"})
          ]})
        ]})
      ]})
    ]})
  })
}`;

// Inject Rz10 right after Rz9 or Rz
const rzTarget = `Rz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>{`;
if (code.includes(rzTarget)) {
    code = code.replace(rzTarget, rz10ComponentCode + `,\nRz=({isOpen:r,onClose:t,onShowToast:s,initialTab:a="tab-hero"})=>{`);
    console.log("Injected Rz10 component successfully!");
} else {
    console.error("rzTarget not found!");
    process.exit(1);
}

// 4. Update InteractiveSharedSection:
const statesTarget = `[Xe9,Oe9]=y.useState(!1),[ze9,qe9]=y.useState("tab-hero")`;
if (code.includes(statesTarget)) {
    code = code.replace(statesTarget, statesTarget + `,[Xe10,Oe10]=y.useState(!1),[ze10,qe10]=y.useState("tab-hero")`);
    console.log("Added Xe10, Oe10 states successfully!");
}

const lesson9CardStart = `(H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-rose-400/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-rose-300/40",children:[`;
const lesson10CardJSX = `(activeSubject==="all"||activeSubject==="science"||H==="all"||H==="វិទ្យាសាស្ត្រ")&&e.jsxs("div",{className:"min-w-[285px] sm:min-w-[325px] max-w-[325px] bg-white rounded-3xl border border-emerald-400/90 overflow-hidden shadow-sm hover:-translate-y-1 transition duration-200 group shrink-0 flex flex-col justify-between ring-1 ring-emerald-300/40",children:[
  e.jsxs("div",{children:[
    e.jsxs("div",{className:"relative h-40 overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900",children:[
      e.jsx("img",{src:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",alt:"ប្រដាប់រំលាយអាហារ",className:"w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"}),
      e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-900/40 to-transparent"}),
      e.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-2",children:[
        e.jsx("span",{className:"w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg",children:"🍎"}),
        e.jsx("span",{className:"text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider",children:"វិទ្យាសាស្ត្រ ថ្នាក់ទី ៦"})
      ]}),
      e.jsxs("div",{className:"absolute bottom-3 left-3 right-3",children:[
        e.jsx("h3",{className:"font-bold text-white text-sm leading-tight font-moul drop-shadow-md line-clamp-1",children:"មេរៀនទី ១០ ៖ ប្រដាប់រំលាយអាហារ"}),
        e.jsx("p",{className:"text-[10px] text-emerald-200 mt-0.5 font-bold drop-shadow-sm",children:"ជំពូកទី ៣ • ទំព័រ ៦០-៦៣ • ៤០ សំណួរ QCM"})
      ]})
    ]}),
    e.jsxs("div",{className:"p-4 space-y-3",children:[
      e.jsx("p",{className:"text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]",children:"រូបផ្គុំ និងតួនាទីសរីរាង្គរំលាយអាហារ ដំណើរផ្លូវអាហារ ការបំប្លែងអាហារ ជំងឺ និងការថែទាំអនាម័យប្រដាប់រំលាយអាហារ។"}),
      e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-emerald-900 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100",children:[
        e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Jr,{className:"w-2.5 h-2.5 text-amber-500"})," ១០ ផ្នែកសំខាន់ៗ"]}),
        e.jsx("span",{className:"text-slate-300",children:"•"}),
        e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Za,{className:"w-2.5 h-2.5 text-emerald-600"})," ៨ ជំងឺឧស្សាហ៍កើត"]}),
        e.jsx("span",{className:"text-slate-300",children:"•"}),
        e.jsxs("span",{className:"flex items-center gap-1 text-emerald-800",children:[e.jsx(Ns,{className:"w-2.5 h-2.5 text-emerald-600"})," ៤០ QCM ពេញលេញ"]})
      ]})
    ]})
  ]}),
  e.jsxs("div",{className:"p-4 pt-0 grid grid-cols-2 gap-2",children:[
    e.jsxs("button",{onClick:()=>{Ut||(qe10("tab-hero"),Oe10(!0));},className:"w-full py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-cyan-800 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
      e.jsx("span",{children:"🔬"}),
      e.jsx("span",{children:"រៀន & ស្វែងយល់"})
    ]}),
    e.jsxs("button",{onClick:()=>{Ut||(qe10("tab-quiz"),Oe10(!0));},className:"w-full py-2.5 bg-gradient-to-r from-cyan-700 via-teal-700 to-emerald-600 hover:from-cyan-800 hover:to-emerald-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",children:[
      e.jsx("span",{children:"📝"}),
      e.jsx("span",{children:"ប្រឡង ៤០ QCM"})
    ]})
  ]})
]}),`;

const lesson9Pos = code.indexOf(lesson9CardStart);
if (lesson9Pos !== -1) {
    code = code.substring(0, lesson9Pos) + lesson10CardJSX + code.substring(lesson9Pos);
    console.log("Injected Lesson 10 card successfully!");
}

// Modal Opener
const modalRz9Target = `e.jsx(Rz9,{isOpen:Xe9,onClose:()=>Oe9(!1),onShowToast:u,initialTab:ze9}),`;
if (code.includes(modalRz9Target)) {
    code = code.replace(modalRz9Target, modalRz9Target + `e.jsx(Rz10,{isOpen:Xe10,onClose:()=>Oe10(!1),onShowToast:u,initialTab:ze10}),`);
    console.log("Injected Rz10 modal opener successfully!");
}

// Exam click handler
const examClickTarget = `if(Pt.id.includes("lesson-9")||Pt.id.includes("lesson9")||Pt.title.includes("មេរៀនទី ៩")||Pt.title.includes("សុខភាពបន្តពូជ"))qe9("tab-quiz"),Oe9(!0);else `;
if (code.includes(examClickTarget)) {
    code = code.replace(examClickTarget, `if(Pt.id.includes("lesson-10")||Pt.id.includes("lesson10")||Pt.title.includes("មេរៀនទី ១០")||Pt.title.includes("ប្រដាប់រំលាយអាហារ"))qe10("tab-quiz"),Oe10(!0);else ` + examClickTarget);
    console.log("Injected exam click handler successfully!");
}

// Student Portal Modal
const studentRz9Target = `activeLessonModal===9&&e.jsx(Rz9,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})`;
if (code.includes(studentRz9Target)) {
    code = code.replace(studentRz9Target, studentRz9Target + `,activeLessonModal===10&&e.jsx(Rz10,{isOpen:!0,onClose:()=>setActiveLessonModal(null),onShowToast:c,initialTab:activeLessonSubTab})`);
    console.log("Injected Rz10 student modal successfully!");
}

// Quizzes Memo
const heMemoTarget = `at.some(ys=>ys.id===Iz9.id||ys.title.includes("មេរៀនទី ៩"))||at.unshift(Iz9),`;
if (code.includes(heMemoTarget)) {
    code = code.replace(heMemoTarget, heMemoTarget + `at.some(ys=>ys.id===Iz10.id||ys.title.includes("មេរៀនទី ១០"))||at.unshift(Iz10),`);
    console.log("Added Iz10 to quizzes memo successfully!");
}

fs.writeFileSync(filePath, code);
fs.writeFileSync(distPath, code);
console.log("All changes for Lesson 10 written successfully!");
