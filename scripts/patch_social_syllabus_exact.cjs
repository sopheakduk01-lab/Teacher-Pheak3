const fs = require("fs");

const filePath = "public/assets/index-BwPwHqBe.js";
let code = fs.readFileSync(filePath, "utf8");

function row(month, weekNo, hours, title, objective, sPage, tPage, extra = {}) {
  return {
    chapterNo: extra.chapterNo || "",
    month,
    weekNo,
    title,
    hours,
    objective,
    topics: [],
    studentBookPages: sPage,
    teacherBookPages: tPage,
    ...(extra.isSectionHeader ? { isSectionHeader: true } : {}),
    ...(extra.isExamRow ? { isExamRow: true } : {}),
  };
}

const socialSubject = {
  id: "social",
  name: "សិក្សាសង្គម (ថ្នាក់ទី៦)",
  englishName: "Social Studies (Grade 6 MoEYS)",
  icon: "🏛️",
  weeklyHours: "៥ ម៉ោង/សប្តាហ៍",
  yearlyHours: "សរុប ១៧៦ ម៉ោង (១៩០ ម៉ោង/ឆ្នាំសិក្សា)",
  gradeLevel: "ថ្នាក់ទី ៦ (កម្មវិធីសិក្សាសិក្សាសង្គម ថ្នាក់ទី៦)",
  officeInfo: "មន្ទីរអប់រំ យុវជន និងកីឡា / ការិយាល័យអប់រំ យុវជន និងកីឡា",
  authorInfo: "សរុបចំនួនម៉ោង ១៧៦ | ចំនួនម៉ោងត្រូវរៀនក្នុង១ឆ្នាំសិក្សា ១៩០",
  colorTheme: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-200",
    badge: "bg-amber-100 text-amber-950 dark:bg-amber-900 dark:text-amber-100",
    gradient: "from-amber-600 to-orange-700",
  },
  description:
    "កម្មវិធីសិក្សាសិក្សាសង្គម ថ្នាក់ទី៦ រួមមាន ៤ ជំពូក (ឥរិយាបថល្អ, ឥរិយាបថប្រកបដោយសុវត្ថិភាព, ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន, សង្គមអតីតកាល) រួមទាំងការរំឭកមេរៀនថ្នាក់ទី៥ ប្រឡងប្រចាំឆមាសទី១-ទី២ សរុបចំនួនម៉ោង ១៧៦ ម៉ោង និងចំនួនម៉ោងត្រូវរៀនក្នុង១ឆ្នាំសិក្សា ១៩០ ម៉ោង។",
  coreCompetencies: [
    "ជំពូកទី ១ ឥរិយាបថល្អ៖ ការកំណត់គោលដៅ ឥរិយាបថ និងតម្លៃ សិទ្ធិនិងការទទួលខុសត្រូវ សិល្បៈ និងការច្នៃប្រឌិត",
    "ជំពូកទី ២ ឥរិយាបថប្រកបដោយសុវត្ថិភាព៖ ការចៀសវាងទង្វើដែលនាំឱ្យគ្រោះថ្នាក់ និងផលអាក្រក់នៃគ្រោះថ្នាក់ចរាចរណ៍",
    "ជំពូកទី ៣ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន៖ ចម្រៀង និងរបាំខ្មែរ ពិធីបុណ្យប្រពៃណីជាតិ ការងារនៅក្នុងសហគមន៍ តុលាការ និងទីតាំងរាជធានី និងប្រទេស",
    "ជំពូក ៤ សង្គមអតីតកាល៖ ឧបករណ៍ភ្លេងប្រពៃណី សម័យចតុមុខ សម័យលង្វែក និងការតាំងនៅឧដុង្គ និងទំនាស់ផ្ទៃក្នុង",
  ],
  summaryFooter: {
    totalHoursLabel: "សរុបចំនួនម៉ោង ១៧៦",
    annualTargetLabel: "ចំនួនម៉ោងត្រូវរៀនក្នុង១ឆ្នាំសិក្សា ១៩០",
  },
  trimesters: [
    {
      title: "ត្រីមាសទី ១",
      period: "ខែវិច្ឆិកា - ធ្នូ - មករា (៥៧ ម៉ោង + រំឭកថ្នាក់ទី៥ ១២ ម៉ោង)",
      chapters: [
        // Page 1
        row("វិច្ឆិកា", "២", "12", "រំឭកមេរៀនឡើងវិញមេរៀនសិក្សាសង្គម ថ្នាក់ទី៥", "", "", ""),
        row("វិច្ឆិកា", "៣", "", "ជំពូកទី ១ ឥរិយាបថល្អ", "", "1", "1", { isSectionHeader: true }),
        row("វិច្ឆិកា", "៣", "", "មេរៀនទី ១ ការកំណត់គោលដៅ", "", "2", "2", { isSectionHeader: true }),
        row("វិច្ឆិកា", "៣", "4", "ការកំណត់គោលដៅសិក្សា", "ជ្រើសរើសគោលដៅសិក្សាបានត្រឹមត្រូវ", "3", "3"),
        row("វិច្ឆិកា", "៤", "2", "ការកសាងផែនការអភិវឌ្ឍខ្លួន", "រៀបចំផែនការអភិវឌ្ឍខ្លួនបានច្បាស់លាស់", "5", "7"),
        row("វិច្ឆិកា", "៤", "2", "ការអភិវឌ្ឍសាលារៀន", "រៀបចំផែនការដោយកំណត់ពេលវេលាច្បាស់លាស់", "6", "7"),
        row("ធ្នូ", "១", "2", "បទបញ្ជាផ្ទៃក្នុងសាលារៀន", "បង្កើត និងបង្ហាញពីផលប្រយោជន៍នៃបទបញ្ជាផ្ទៃក្នុង", "7", "9"),
        row("ធ្នូ", "១", "2", "មុខរបរទៅអនាគត", "ប្រាប់ កំណត់ និងចូលរួមអនុវត្តសកម្មភាពនិងជំនាញ", "8", "10"),
        row("ធ្នូ", "១", "2", "សំណួរ", "", "9", "11"),
        row("ធ្នូ", "២", "", "មេរៀនទី ២ ឥរិយាបថ និងតម្លៃ", "", "10", "13", { isSectionHeader: true }),
        row("ធ្នូ", "២", "2", "ការរៀបចំឥរិយាបថដែលគួរឱ្យគោរព", "ត្រូវមានអាកប្បកិរិយាសុភាពរាបសារសមរម្យ", "10", "13"),
        row("ធ្នូ", "២", "1", "ទំនាក់ទំនងល្អក្នុងគ្រួសារ", "មានការប្រាស្រ័យទាក់ទងគ្នាល្អ នៅក្នុងគ្រួសារ", "11", "14"),
        // Page 2
        row("ធ្នូ", "២", "1", "ទំនាក់ទំនងល្អជាមួយមនុស្សនៅជុំវិញខ្លួន", "មានការប្រាស្រ័យទាក់ទងគ្នាល្អ យោគយល់ ចំពោះមនុស្សនៅជុំវិញខ្លួន", "12", "15"),
        row("ធ្នូ", "២", "2", "ទំនាក់ទំនងល្អជាមួយអ្នកជិតខាង", "មានការប្រាស្រ័យទាក់ទងគ្នាល្អ ចេះជួយយកអាសារគ្នា យោគយល់គ្នាទៅវិញទៅមក", "13", "17"),
        row("ធ្នូ", "៣", "1", "ទំនាក់ទំនងល្អជាមួយមិត្តភក្តិ", "ចេះជួយគ្នាក្នុងគ្រាមានអាសន្ន ណែនាំគ្នានៅពេលមាននរណាម្នាក់ប្រព្រឹត្តខុស", "14", "18"),
        row("ធ្នូ", "៣", "1", "ឥរិយាបថក្នុងការខាកស្ដោះ កណ្ដាស់", "ប្រាប់ពីឥរិយាបថក្នុងការខាកស្ដោះ កណ្ដាស់ឱ្យបានត្រឹមត្រូវ", "15", "19"),
        row("ធ្នូ", "៣", "1", "គ្រោះថ្នាក់និងទុក្ខអ្នកដទៃ", "ប្រាប់ពីឥរិយាបថនៅពេលដែលឃើញនរណាម្នាក់មានគ្រោះថ្នាក់និងមានទុក្ខ", "15", "20"),
        row("ធ្នូ", "៣", "2", "ការធ្វើអារម្មណ៍ប្រសើរឡើង", "រៀបរាប់ពីវិធីដែលធ្វើឱ្យអារម្មណ៍ប្រសើរឡើងនៅពេលយើងមានមួម៉ៅឬខឹងសម្បារ", "16", "22"),
        row("ធ្នូ", "៤", "2", "សំណួរ", "", "17", "23"),
        row("ធ្នូ", "៤", "", "មេរៀនទី ៣ សិទ្ធិនិងការទទួលខុសត្រូវ", "", "18", "25", { isSectionHeader: true }),
        row("ធ្នូ", "៤", "1", "សិទ្ធិកុមារ", "រៀបរាប់ពីសិទ្ធិរបស់កុមារបានត្រឹមត្រូវ", "18", "25"),
        row("ធ្នូ", "៤", "3", "ការរំលោភបំពានលើសិទ្ធិកុមារ", "រៀបរាប់ពីអំពើដែលគេចាត់ថាជាការរំលោភបំពានលើសិទ្ធិកុមារ", "18", "26"),
        row("មករា", "១", "1", "ការការពារសិទ្ធិកុមារ", "ប្រាប់ពីបញ្ហាដែលកុមារទទួលបានសិទ្ធិការពារ", "18", "32"),
        row("មករា", "១", "2", "ល្បិចកលជនខិលខូច", "ប្រាប់ពីល្បិចបោកប្រាស់របស់ជនខិលខូច", "21", "33"),
        row("មករា", "១", "1", "វិធីការពារខ្លួនឬការពារមិត្តភក្តិពីការរំលោភផ្លូវភេទ", "ប្រាប់ពីវិធីការពារខ្លួនឬការពារមិត្តភក្តិពីការរំលោភផ្លូវភេទ", "22", "34"),
        row("មករា", "១", "1", "ការការពារកុមារពីការគម្រាមកំហែង", "រៀបរាប់ពីសកម្មភាពដែលជាការការពារកុមារពីការគម្រាមកំហែង", "23", "35"),
        row("មករា", "១", "1", "ការផ្តន្ទាទោសចំពោះជនដែលរំលោភសិទ្ធិកុមារ", "រៀបរាប់ពីសកម្មភាពដែលជាការផ្តន្ទាទោសចំពោះជនដែលរំលោភសិទ្ធិកុមារ", "24", "36"),
        row("មករា", "២", "2", "សំណួរ", "", "", ""),
        row("មករា", "២", "", "មេរៀនទី ៤ សិល្បៈ និងការច្នៃប្រឌិត", "", "26", "40", { isSectionHeader: true }),
        row("មករា", "២", "5", "ការសូនរូប", "ប្រាប់និយមន័យនិងរបៀបសូនរូបផ្សេងៗបានត្រឹមត្រូវ", "26", "40"),
        // Page 3 (top part up to end of មករា)
        row("មករា", "៣", "2", "គូររូបតាមរូបគំរូ រួចផាត់ពណ៌ឱ្យពន្លឺនិងស្រមោល", "ប្រាប់ពីសម្ភារៈ របៀបគូរផាត់ពណ៌ឱ្យមានពន្លឺនិងស្រមោលបានត្រឹមត្រូវ", "29", "41"),
        row("មករា", "៣", "3", "ការបត់ក្រដាសធ្វើវត្ថុឬសត្វ", "ប្រាប់ពីរបៀបបត់ក្រដាសធ្វើវត្ថុឬសត្វផ្សេងៗបានត្រឹមត្រូវ", "30", "41"),
        row("មករា", "៤", "", "ជំពូកទី ២ ឥរិយាបថប្រកបដោយសុវត្ថិភាព", "", "33", "42", { isSectionHeader: true }),
        row("មករា", "៤", "", "មេរៀនទី ១ ការចៀសវាងទង្វើដែលនាំឱ្យគ្រោះថ្នាក់", "", "34", "43", { isSectionHeader: true }),
        row("មករា", "៤", "4", "ភាពងាយរងគ្រោះថ្នាក់ចរាចរណ៍", "រៀបរាប់ពីបញ្ហាផ្សេងៗដែលងាយរងគ្រោះថ្នាក់", "34", "43"),
        row("មករា", "៤", "2", "ការបញ្ចៀសគ្រោះថ្នាក់ចរាចរណ៍", "រៀបរាប់ពីវិធីក្នុងការបញ្ចៀសគ្រោះថ្នាក់ចរាចរណ៍", "38", "47"),
        row("មករា", "៤", "2", "ការបដិសេធនឹងទង្វើដែលនាំឱ្យមានគ្រោះថ្នាក់ចរាចរណ៍", "ប្រាប់ពីពាក្យឆ្លើយតបមានន័យបដិសេធនឹងទង្វើដែលនាំឱ្យមានគ្រោះថ្នាក់ចរាចរណ៍", "40", "49"),
      ],
    },
    {
      title: "ត្រីមាសទី ២",
      period: "ខែកុម្ភៈ - មីនា - មេសា (៤៥ ម៉ោង + ប្រឡងឆមាសទី១)",
      chapters: [
        // Page 3 (កុម្ភៈ - មីនា)
        row("កុម្ភៈ", "១", "2", "សំណួរ", "", "41", "50"),
        row("កុម្ភៈ", "១", "", "មេរៀនទី ២ ផលអាក្រក់នៃគ្រោះថ្នាក់ចរាចរណ៍", "", "42", "51", { isSectionHeader: true }),
        row("កុម្ភៈ", "១", "4", "ភាពប្រថុយប្រថាននឹងគ្រោះថ្នាក់ចរាចរណ៍", "ប្រាប់ពីបញ្ហាដែលមានភាពប្រថុយប្រថាននឹងគ្រោះថ្នាក់ចរាចរណ៍", "42", "51"),
        row("កុម្ភៈ", "២", "3", "ការខាតបង់ដោយសារគ្រោះថ្នាក់ចរាចរណ៍", "ប្រាប់ពីការខាតបង់ដោយសារគ្រោះថ្នាក់ចរាចរណ៍", "46", "52"),
        row("កុម្ភៈ", "២", "3", "សំណួរ", "", "49", "52"),
        row("កុម្ភៈ", "៣", "", "ជំពូកទី ៣ ជីវភាពសង្គមនាពេលបច្ចុប្បន្ន", "", "51", "53", { isSectionHeader: true }),
        row("កុម្ភៈ", "៣", "", "មេរៀនទី ១ ចម្រៀង និងរបាំខ្មែរ", "", "51", "54", { isSectionHeader: true }),
        row("កុម្ភៈ", "៣", "2", "របាំយីកេ", "ប្រាប់ពីទំនុកច្រៀងនិងក្បាច់រាំរបាំយីកេ", "52", "54"),
        row("កុម្ភៈ", "៣", "3", "របាំយីកេ", "ប្រាប់ពីទំនុកច្រៀងនិងក្បាច់រាំរបាំយីកេ", "55", "56"),
        row("កុម្ភៈ", "៤", "4", "ល្ខោនបាសាក់", "ប្រាប់ពីដើមកំណើតនៃល្ខោនបាសាក់", "56", "57"),
        row("មីនា", "១", "2", "របាំ", "ប្រាប់ពីចង្វាក់រាំវង់", "57", "57"),
        row("មីនា", "១", "3", "របាំ", "ប្រាប់ពីចង្វាក់ឡាំលាវ", "58", "57"),
        row("មីនា", "២", "2", "សំណួរ", "", "59", "58"),
        row("មីនា", "២", "", "មេរៀនទី ២ ពិធីបុណ្យប្រពៃណីជាតិ", "", "60", "59", { isSectionHeader: true }),
        // Page 4 (មីនា - មេសា)
        row("មីនា", "២", "2", "ការប្រារព្ធពិធីបុណ្យតាមលំនាំចន្ទគតិនិងសុរិយគតិ", "រៀបរាប់ពីការប្រារព្ធពិធីបុណ្យតាមលំនាំចន្ទគតិនិងសុរិយគតិបានត្រឹមត្រូវ", "60", "59"),
        row("មីនា", "៣", "2", "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល", "ប្រាប់ពីអត្ថន័យនិងការរៀបចំព្រះរាជពិធីច្រត់ព្រះនង្គ័លនិង", "61", "60"),
        row("មីនា", "៣", "2", "បុណ្យចូលឆ្នាំខ្មែរ", "ប្រាប់ពីអត្ថន័យនិងការរៀបចំបុណ្យចូលឆ្នាំខ្មែរនិងជំនឿ", "63", "62"),
        row("មីនា", "៤", "2", "ចម្រៀងទាក់ទងបុណ្យចូលឆ្នាំ", "ច្រៀង រាំ កម្សាន្តបទកឺសវង់", "66", "63"),
        row("មីនា", "៤", "1", "សំណួរ", "", "67", "63"),
        row("មីនា", "៤", "", "ប្រឡងប្រចាំឆមាសលើកទី១", "", "", "", { isExamRow: true }),
        row("មេសា", "១", "", "មេរៀនទី ៣ ការងារនៅក្នុងសហគមន៍", "", "68", "64", { isSectionHeader: true }),
        row("មេសា", "១", "1", "ការកំណត់ជ្រើសរើសមុខរបរ", "ប្រាប់ពីមុខរបរផ្សេងៗនិងប្រាប់ពីការកំណត់ជ្រើសរើសមុខរបរឱ្យបានត្រឹមត្រូវ", "68", "64"),
        row("មេសា", "១", "1", "ការចិញ្ចឹមជីវិត", "រៀបរាប់ពីការរស់នៅតាមតំបន់នីមួយៗ", "69", "65"),
        row("មេសា", "១", "2", "មុខរបរសិប្បកម្មនៅកម្ពុជា", "រៀបរាប់ពីមុខរបរសិប្បកម្មដែលមាននៅកម្ពុជា", "70", "66"),
        row("មេសា", "៤", "2", "មុខរបរនេសាទត្រីនៅបឹងទន្លេសាប", "ប្រាប់ពីរបៀបនៃនេសាទត្រីនៅបឹងទន្លេសាប", "71", "67"),
        row("មេសា", "៤", "2", "ករណីកិច្ចពលរដ្ឋចំពោះសហគមន៍", "រៀបរាប់ពីករណីកិច្ចពលរដ្ឋចំពោះសហគមន៍", "72", "68"),
      ],
    },
    {
      title: "ត្រីមាសទី ៣",
      period: "ខែឧសភា - មិថុនា - កក្កដា - សីហា (៧៤ ម៉ោង + ប្រឡងឆមាសទី២)",
      chapters: [
        // Page 4 (ឧសភា)
        row("ឧសភា", "១", "2", "ការបណ្តុះផ្សិតចម្បើង", "ប្រាប់ពីរបៀបនៃការបណ្តុះផ្សិតចម្បើង", "73", "69"),
        row("ឧសភា", "១", "2", "ផលប្រយោជន៍នៃការងារចំពោះសហគមន៍", "និយាយរៀបរាប់ពីផលប្រយោជន៍នៃការងារចំពោះសហគមន៍", "74", "70"),
        row("ឧសភា", "២", "2", "សំណួរ", "", "72", "70"),
        row("ឧសភា", "២", "", "មេរៀនទី ៤ តុលាការ", "", "76", "71", { isSectionHeader: true }),
        row("ឧសភា", "២", "1", "ប្រព័ន្ធតុលាការនៅកម្ពុជា", "ប្រាប់ពីប្រព័ន្ធតុលាការនៅកម្ពុជា", "76", "71"),
        row("ឧសភា", "២", "1", "សាលាដំបូង", "ប្រាប់ពីតួនាទីនិងទំនួលខុសត្រូវរបស់សាលាដំបូង", "77", "72"),
        row("ឧសភា", "៣", "1", "សាលាឧទ្ធរណ៍", "ប្រាប់ពីតួនាទីនិងទំនួលខុសត្រូវរបស់សាលាឧទ្ធរណ៍", "78", "73"),
        row("ឧសភា", "៣", "2", "តុលាការកំពូល", "ប្រាប់ពីតួនាទីនិងទំនួលខុសត្រូវរបស់តុលាការកំពូល", "79", "74"),
        row("ឧសភា", "៤", "4", "អំណាចតុលាការ", "រៀបរាប់ពីអំណាចរបស់តុលាការ", "80", "75"),
        // Page 5 (មិថុនា - កក្កដា)
        row("មិថុនា", "១", "1", "មេធាវី", "រៀបរាប់ពីសិទ្ធិនិងករណីយកិច្ចរបស់មេធាវី", "82", "77"),
        row("មិថុនា", "១", "1", "សំណួរ", "", "83", "78"),
        row("មិថុនា", "១", "", "មេរៀនទី ៥ ទីតាំងរាជធានី និងប្រទេស", "", "84", "79", { isSectionHeader: true }),
        row("មិថុនា", "១", "1", "ផែនទី", "ប្រាប់ពីរូបតាងផែនទីប្រទេសបានត្រឹមត្រូវ", "84", "79"),
        row("មិថុនា", "២", "2", "ភូគោល", "ពន្យល់បញ្ញត្តិរយៈទទឹង រយៈបណ្តោយ អឌ្ឍគោលខាងជើង អឌ្ឍគោលខាងត្បូង", "85", "80"),
        row("មិថុនា", "២", "3", "ប្រទេសនៅតំបន់អាស៊ីអាគ្នេយ៍(កម្ពុជា ព្រុយណេ វៀតណាម)", "រៀបរាប់ពីប្រទេសនៅតំបន់អាស៊ីអាគ្នេយ៍បានត្រឹមត្រូវ", "87", "82"),
        row("មិថុនា", "៣", "3", "ប្រទេសនៅតំបន់អាស៊ីអាគ្នេយ៍(ថៃ ហ្វីលីពីន ម៉ាឡេស៊ី សិង្ហបុរី)", "រៀបរាប់ពីប្រទេសនៅតំបន់អាស៊ីអាគ្នេយ៍បានត្រឹមត្រូវ", "87", "82"),
        row("មិថុនា", "៤", "3", "ប្រទេសនៅតំបន់អាស៊ីអាគ្នេយ៍(ឡាវ មីយ៉ាន់ម៉ា ឥណ្ឌូណេស៊ី ទីម័រខាងកើត)", "រៀបរាប់ពីប្រទេសនៅតំបន់អាស៊ីអាគ្នេយ៍បានត្រឹមត្រូវ", "87", "82"),
        row("មិថុនា", "៤", "2", "សំណួរ", "", "88", "83"),
        row("កក្កដា", "១", "", "ជំពូក ៤ សង្គមអតីតកាល", "", "93", "86", { isSectionHeader: true }),
        row("កក្កដា", "១", "", "មេរៀនទី ៦ ឧបករណ៍ភ្លេងប្រពៃណី", "", "94", "87", { isSectionHeader: true }),
        row("កក្កដា", "១", "3", "វង់ភ្លេងយីកេ", "ប្រាប់ពីឧបករណ៍នៅក្នុងវង់ភ្លេងយីកេ", "94", "87"),
        row("កក្កដា", "១", "3", "វង់ភ្លេងបាសាក់", "ប្រាប់ពីឧបករណ៍នៅក្នុងវង់ភ្លេងបាសាក់", "96", "90"),
        row("កក្កដា", "២", "2", "ការសម្តែងល្ខោនបាសាក់", "រៀបរាប់ពីការសម្តែងល្ខោនបាសាក់", "99", "92"),
        row("កក្កដា", "២", "", "មេរៀនទី ២ សម័យចតុមុខ", "", "102", "93", { isSectionHeader: true }),
        row("កក្កដា", "២", "3", "ព្រះរាជានិងព្រឹត្តិការណ៍សំខាន់ៗ", "រៀបរាប់ពីព្រះរាជានិងព្រឹត្តិការណ៍សំខាន់ៗ", "102", "93"),
        row("កក្កដា", "៣", "2", "ការពឹងពាក់បរទេស", "រៀបរាប់ពីលទ្ធផលនៃការពឹងពាក់បរទេស", "102", "94"),
        row("កក្កដា", "៣", "1", "ចម្បាំងរវាងព្រះបាទសុគន្ធបទ និងនាយកន", "និយាយពីបញ្ហានៃការចម្បាំងរវាងព្រះបាទសុគន្ធបទ និងនាយកន", "106", "96"),
        row("កក្កដា", "៣", "2", "ចម្បាំងរវាងស្តេចកន និងព្រះបាទចន្ទរាជា", "និយាយពីបញ្ហានៃចម្បាំងរវាងស្តេចកន និងព្រះបាទចន្ទរាជា", "107", "96"),
        row("កក្កដា", "៣", "2", "សំណួរ", "", "108", "97"),
        // Page 6 (កក្កដា - សីហា)
        row("កក្កដា", "៤", "", "មេរៀនទី ៣ សម័យលង្វែក", "", "110", "97", { isSectionHeader: true }),
        row("កក្កដា", "៤", "1", "ក្រុងលង្វែក", "ប្រាប់ពីឆ្នាំដែលកសាងក្រុងលង្វែក", "110", "97"),
        row("កក្កដា", "៤", "2", "ព្រះរាជានិងព្រឹត្តិការណ៍សំខាន់ៗ", "រៀបរាប់ពីព្រះរាជានិងព្រឹត្តិការណ៍សំខាន់ៗ", "111", "98"),
        row("កក្កដា", "៤", "2", "ការបែកបាក់បន្ទាយលង្វែក", "និយាយពីមូលហេតុដែលនាំឱ្យមានការបែកបាក់បន្ទាយលង្វែក", "113", "99"),
        row("សីហា", "១", "2", "នយោបាយសម័យលង្វែក", "និយាយពីនយោបាយសម័យលង្វែក", "114", "100"),
        row("សីហា", "១", "2", "សេដ្ឋកិច្ចសម័យលង្វែក", "រៀបរាប់ពីសេដ្ឋកិច្ចសម័យលង្វែក", "115", "100"),
        row("សីហា", "១", "2", "សំណួរ", "", "116", "101"),
        row("សីហា", "២", "", "មេរៀនទី ៤ ការតាំងនៅឧដុង្គ និងទំនាស់ផ្ទៃក្នុង", "", "118", "102", { isSectionHeader: true }),
        row("សីហា", "២", "2", "ការកសាងក្រុងឧដុង្គ", "រៀបរាប់ពីការកសាងក្រុងឧដុង្គ", "118", "102"),
        row("សីហា", "២", "2", "សេដ្ឋកិច្ចសម័យលង្វែក", "រៀបរាប់ពីសេដ្ឋកិច្ចសម័យលង្វែក", "115", "100"),
        row("សីហា", "២", "", "ប្រឡងប្រចាំឆមាសលើកទី២", "", "", "", { isExamRow: true }),
        row("សីហា", "៣", "2", "ទំនាស់នៃរាជវង្សឧដុង្គ", "និយាយពីបញ្ហានៃទំនាស់នៃរាជវង្សឧដុង្គ", "119", "103"),
        row("សីហា", "៣", "2", "ជម្លោះនៃព្រះរាជវង្សនិងអន្តរាគមន៍នៃទ័ពយួន", "រៀបរាប់ពីព្រឹត្តិការណ៍នៃជម្លោះនៃព្រះរាជវង្សនិងអន្តរាគមន៍នៃទ័ពយួន", "120", "104"),
        row("សីហា", "៣", "2", "ជម្លោះនៃព្រះរាជាវង្សនិងអន្តរាគមន៍នៃកងទ័ពយួន សៀម", "រៀបរាប់ពីព្រឹត្តិការណ៍នៃ ជម្លោះនៃព្រះរាជាវង្សនិងអន្តរាគមន៍នៃកងទ័ពយួន សៀម", "121", "105"),
        row("សីហា", "៤", "4", "រំឭកសារឡើងវិញ", "", "", ""),
      ],
    },
  ],
  teachingStrategies: [
    "ការសួរដេញដោល និងការពិភាក្សាជាក្រុមតូច ដោយភ្ជាប់ជាមួយបទពិសោធន៍ជីវិតប្រចាំថ្ងៃ",
    "ការប្រើប្រាស់រូបភាព ផែនទី ភូគោល និងសម្ភារៈឧបទេសជាក់ស្តែង (Visuals, Maps & Globes)",
    "ការដើរតួសម្តែង ការសូនរូប គំនូរ ការបត់ក្រដាស និងឧទាហរណ៍សិល្បៈប្រពៃណីខ្មែរ",
    "ការអនុវត្តផ្ទាល់លើសុវត្ថិភាពចរាចរណ៍ សិទ្ធិកុមារ និងកិច្ចការសហគមន៍",
  ],
  assessmentTools: [
    "សំណួរប្រចាំមេរៀន និងលំហាត់វាយតម្លៃតាមជំពូកនីមួយៗ",
    "ការសង្កេតឥរិយាបថ សកម្មភាពក្រុម និងការធ្វើបទបង្ហាញក្នុងថ្នាក់",
    "កិច្ចការប្រតិបត្តិសិល្បៈ (សូនរូប គំនូរផាត់ពណ៌ បត់ក្រដាស) និងផែនទីភូមិសាស្ត្រ",
    "ប្រឡងប្រចាំឆមាសលើកទី១ និងប្រឡងប្រចាំឆមាសលើកទី២",
  ],
};

// Verify exact hour sums before modifying anything
const sumTrim = (tIdx, skipReview = false) =>
  socialSubject.trimesters[tIdx].chapters.reduce((acc, ch, i) => {
    if (skipReview && i === 0) return acc;
    const n = parseInt(ch.hours, 10);
    return acc + (Number.isFinite(n) ? n : 0);
  }, 0);

const t1G6 = sumTrim(0, true);
const t2G6 = sumTrim(1, false);
const t3G6 = sumTrim(2, false);
const totalG6 = t1G6 + t2G6 + t3G6;
const totalAllRows = socialSubject.trimesters.reduce((a, _, i) => a + _.chapters.length, 0);

if (t1G6 !== 57 || t2G6 !== 45 || t3G6 !== 74 || totalG6 !== 176) {
  throw new Error(`Hour mismatch: T1=${t1G6}, T2=${t2G6}, T3=${t3G6}, Total=${totalG6}`);
}
console.log(`Verified hours: T1=${t1G6}h (+12h G5 review), T2=${t2G6}h, T3=${t3G6}h => Total=${totalG6}h across ${totalAllRows} rows.`);

function replaceExactOnce(src, target, replacement, label) {
  const idx = src.indexOf(target);
  if (idx === -1) throw new Error(`Anchor not found for: ${label}`);
  if (src.indexOf(target, idx + target.length) !== -1) {
    throw new Error(`Multiple occurrences found for: ${label}`);
  }
  console.log(`Replaced [${label}] at offset ${idx}`);
  return src.slice(0, idx) + replacement + src.slice(idx + target.length);
}

// 1. Replace {id:"social", ...} in uCe
const uCeIdx = code.indexOf("uCe=[");
if (uCeIdx === -1) throw new Error("uCe not found");
const socialStart = code.indexOf('{id:"social",', uCeIdx);
const healthStart = code.indexOf(',{id:"health",', socialStart);
if (socialStart === -1 || healthStart === -1) throw new Error("social/health boundary not found");
code = code.slice(0, socialStart) + JSON.stringify(socialSubject) + code.slice(healthStart);
console.log(`Replaced uCe social entry (${socialStart}..${healthStart})`);

// 2. Migrate existing cached localStorage entry for id === "social" in ECe initializer
const oldInit =
  'const[s,a]=y.useState(()=>{const ge=localStorage.getItem(Yz);if(ge)try{return JSON.parse(ge)}catch(Xe){console.error("Failed to parse saved syllabuses:",Xe)}return uCe})';
const newInit =
  'const[s,a]=y.useState(()=>{const ge=localStorage.getItem(Yz);if(ge)try{const Xe=JSON.parse(ge);if(Array.isArray(Xe)&&!localStorage.getItem("migrated_social_syllabus_exact_pdf_v103")){const Oe=uCe.find(qe=>qe.id==="social");if(Oe){const ze=Xe.some(qe=>qe.id==="social")?Xe.map(qe=>qe.id==="social"?Oe:qe):[...Xe,Oe];localStorage.setItem("migrated_social_syllabus_exact_pdf_v103","1");return ze}}return Xe}catch(Xe){console.error("Failed to parse saved syllabuses:",Xe)}return uCe})';
code = replaceExactOnce(code, oldInit, newInit, "ECe localStorage migration");

// 3. Render isExamRow, isSectionHeader cleanly in ECe UI table tbody
const oldTbody =
  'children:Xe.chapters.map((ze,qe)=>e.jsxs("tr",{className:"hover:bg-slate-50 dark:hover:bg-slate-800/50 transition",children:[e.jsxs("td",{className:"p-3 font-extrabold text-teal-900 dark:text-teal-300 bg-slate-50/50 dark:bg-slate-800/30",children:[e.jsx("div",{children:ze.month||"-"}),e.jsx("div",{className:"text-[10px] text-slate-500 font-normal mt-0.5",children:ze.chapterNo})]}),e.jsx("td",{className:"p-3 font-extrabold text-purple-900 dark:text-purple-300",children:ze.weekNo?e.jsx("span",{className:"inline-block bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded text-[11px]",children:ze.weekNo}):e.jsx("span",{className:"text-slate-400",children:"-"})}),e.jsxs("td",{className:"p-3 font-bold text-slate-900 dark:text-slate-100",children:[e.jsx("div",{children:ze.title}),ze.topics&&ze.topics.length>0&&e.jsx("ul",{className:"mt-1.5 space-y-0.5 list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 font-normal",children:ze.topics.map((Ie,De)=>e.jsx("li",{children:Ie},De))})]}),e.jsx("td",{className:"p-3 text-center text-slate-600 dark:text-slate-400 font-mono font-bold",children:ze.hours}),e.jsx("td",{className:"p-3 text-slate-700 dark:text-slate-300 leading-relaxed",children:ze.objective}),e.jsx("td",{className:"p-3 text-center text-[11px]",children:ze.studentBookPages||ze.teacherBookPages?e.jsxs("div",{className:"space-y-1",children:[ze.studentBookPages&&e.jsxs("span",{className:"inline-block bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 text-[10px]",children:["ស.ស: ",ze.studentBookPages]}),ze.teacherBookPages&&e.jsxs("span",{className:"inline-block bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-[10px]",children:["ស.គ: ",ze.teacherBookPages]})]}):e.jsx("span",{className:"text-slate-400",children:"-"})})';
const newTbody =
  'children:Xe.chapters.map((ze,qe)=>e.jsxs("tr",{className:ze.isExamRow?"bg-rose-50/80 dark:bg-rose-950/35 hover:bg-rose-50 transition":ze.isSectionHeader?"bg-amber-50/60 dark:bg-amber-950/25 hover:bg-amber-50/80 transition":"hover:bg-slate-50 dark:hover:bg-slate-800/50 transition",children:[e.jsxs("td",{className:"p-3 font-extrabold text-teal-900 dark:text-teal-300 bg-slate-50/50 dark:bg-slate-800/30",children:[e.jsx("div",{children:ze.month||"-"}),ze.chapterNo&&e.jsx("div",{className:"text-[10px] text-slate-500 font-normal mt-0.5",children:ze.chapterNo})]}),e.jsx("td",{className:"p-3 font-extrabold text-purple-900 dark:text-purple-300",children:ze.weekNo?e.jsx("span",{className:"inline-block bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded text-[11px]",children:ze.weekNo}):e.jsx("span",{className:"text-slate-400",children:"-"})}),e.jsxs("td",{className:ze.isExamRow?"p-3 text-center font-extrabold text-red-600 dark:text-red-400 text-[13px]":ze.isSectionHeader?"p-3 font-extrabold text-amber-950 dark:text-amber-200":"p-3 font-bold text-slate-900 dark:text-slate-100",children:[e.jsx("div",{children:ze.title}),ze.topics&&ze.topics.length>0&&e.jsx("ul",{className:"mt-1.5 space-y-0.5 list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 font-normal",children:ze.topics.map((Ie,De)=>e.jsx("li",{children:Ie},De))})]}),e.jsx("td",{className:"p-3 text-center text-slate-600 dark:text-slate-400 font-mono font-bold",children:ze.hours}),e.jsx("td",{className:"p-3 text-slate-700 dark:text-slate-300 leading-relaxed",children:ze.objective}),e.jsx("td",{className:"p-3 text-center text-[11px]",children:ze.studentBookPages||ze.teacherBookPages?e.jsxs("div",{className:"space-y-1",children:[ze.studentBookPages&&e.jsxs("span",{className:"inline-block bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 text-[10px]",children:["ស.ស: ",ze.studentBookPages]}),ze.teacherBookPages&&e.jsxs("span",{className:"inline-block bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-[10px]",children:["ស.គ: ",ze.teacherBookPages]})]}):ze.isExamRow?"":e.jsx("span",{className:"text-slate-400",children:"-"})})';
code = replaceExactOnce(code, oldTbody, newTbody, "ECe UI table tbody");

// 4. Add summaryFooter below ge.trimesters.map in ECe UI
const oldTrimestersEnd =
  'e.jsx("span",{children:"+ បន្ថែមជួរមេរៀនថ្មីក្នុងតារាងត្រីមាសនេះ"})]})})})})]})})]},Oe))})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs"';
const newTrimestersEnd =
  'e.jsx("span",{children:"+ បន្ថែមជួរមេរៀនថ្មីក្នុងតារាងត្រីមាសនេះ"})]})})})})]})})]},Oe))}),ge.summaryFooter&&e.jsxs("div",{className:"bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 rounded-2xl p-4 text-xs sm:text-sm font-extrabold italic text-slate-900 dark:text-slate-100 space-y-1",children:[e.jsx("div",{children:ge.summaryFooter.totalHoursLabel}),e.jsx("div",{children:ge.summaryFooter.annualTargetLabel})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs"';
code = replaceExactOnce(code, oldTrimestersEnd, newTrimestersEnd, "ECe summaryFooter");

// 5. Update ee Word export rows & summaryFooter
const eeMapStart = code.indexOf("${be.chapters.map(Qe=>`");
const eeMapEnd = code.indexOf('Oe+="</body></html>";', eeMapStart);
if (eeMapStart === -1 || eeMapEnd === -1) throw new Error("ee Word export block not found");

const newEeBlock =
  '${be.chapters.map(Qe=>`\n                  <tr style="${Qe.isExamRow?"background-color:#fff1f2;":Qe.isSectionHeader?"background-color:#fefce8;":""}">\n                    <td style="font-weight:bold; color:#005577;">\n                      ${Qe.month||"-"}\n                      ${Qe.chapterNo?`<div style="font-size:8pt; font-weight:normal; color:#666;">${Qe.chapterNo}</div>`:""}\n                    </td>\n                    <td style="font-weight:bold; color:#880055;">\n                      ${Qe.weekNo||"-"}\n                    </td>\n                    <td style="${Qe.isExamRow?"text-align:center; color:#dc2626; font-weight:bold; font-style:italic;":""}">\n                      <strong>${Qe.title}</strong>\n                      ${Qe.topics&&Qe.topics.length>0?`<ul style="margin:3px 0 0 12px; padding:0; font-size:8.5pt;">\n                              ${Qe.topics.map(Et=>`<li>${Et}</li>`).join("")}\n                            </ul>`:""}\n                    </td>\n                    <td style="text-align: center; font-weight:bold;">${Qe.hours||""}</td>\n                    <td>${Qe.objective||""}</td>\n                    <td style="text-align: center; font-size: 8.5pt;">\n                      ${Qe.studentBookPages?`ស.ស: ${Qe.studentBookPages}<br/>`:""}\n                      ${Qe.teacherBookPages?`ស.គ: ${Qe.teacherBookPages}`:""}\n                      ${!Qe.studentBookPages&&!Qe.teacherBookPages&&!Qe.isExamRow?"-":""}\n                    </td>\n                  </tr>`).join("")}\n              </tbody>\n            </table>\n          `).join("")}\n          ${Be.summaryFooter?`<div style="margin-top:8px; font-weight:bold; font-style:italic; font-size:10pt;"><div>${Be.summaryFooter.totalHoursLabel}</div><div>${Be.summaryFooter.annualTargetLabel}</div></div>`:""}\n        </div>\n      `}),';

code = code.slice(0, eeMapStart) + newEeBlock + code.slice(eeMapEnd);
console.log(`Replaced Word export block (${eeMapStart}..${eeMapEnd})`);

// 6. Update Oi PDF export rows & summaryFooter
const oiAnchor = "${(At=Os.chapters)==null?void 0:At.map((Ue,Ir)=>`";
const oiStart = code.indexOf(oiAnchor);
const oiEndMarker = '        </div>\n      `}).join(""):d?Pt=d:Pt=`';
const oiEnd = code.indexOf(oiEndMarker, oiStart);
if (oiStart === -1 || oiEnd === -1) throw new Error("Oi PDF export block not found");

const newOiBlock =
  '${(At=Os.chapters)==null?void 0:At.map((Ue,Ir)=>`\n                        <tr style="background-color: ${Ue.isExamRow?"#fff1f2":Ue.isSectionHeader?"#fefce8":Ir%2===1?ne.altRowBg:"#ffffff"};">\n                          ${Ie.showMonthColumn?`<td style="${hr} ${at} font-weight: bold; color: ${_e};">\n                                  ${Ue.month||"-"}\n                                  ${Ue.chapterNo?`<div style="font-size: 0.8em; color: #64748b; font-weight: normal;">${Ue.chapterNo}</div>`:""}\n                                </td>`:""}\n                          ${Ie.showWeekColumn!==!1?`<td style="${hr} ${at} text-align: center; font-weight: bold; color: ${ut};">\n                                  ${Ue.weekNo||"-"}\n                                </td>`:""}\n                          ${!Ie.showMonthColumn&&Ie.showWeekColumn===!1?`<td style="${hr} ${at} font-weight: bold;">\n                                  ${Ue.chapterNo}\n                                </td>`:""}\n                          <td style="${hr} ${at} ${Ue.isExamRow?"text-align: center; color: #dc2626; font-style: italic;":""}">\n                            <strong>${Ue.title}</strong>\n                            ${Ie.showTopicsList&&Ue.topics&&Ue.topics.length>0?`<ul style="margin: 4px 0 0 14px; padding: 0; font-size: 0.85em; color: #444;">\n                                    ${Ue.topics.map(zs=>`<li>${zs}</li>`).join("")}\n                                  </ul>`:""}\n                          </td>\n                          ${Ie.showHoursColumn?`<td style="${hr} ${at} text-align: center; font-weight: bold;">${Ue.isExamRow||Ue.isSectionHeader?Ue.hours||"":Ue.hours||"-"}</td>`:""}\n                          ${Ie.showObjectiveColumn?`<td style="${hr} ${at} color: #222;">${Ue.isExamRow||Ue.isSectionHeader?Ue.objective||"":Ue.objective||"-"}</td>`:""}\n                          ${Ie.showBookPages?`<td style="${hr} ${at} text-align: center; font-size: 0.82em;">\n                                  ${Ue.studentBookPages?`ស.ស: ${Ue.studentBookPages}<br/>`:""}\n                                  ${Ue.teacherBookPages?`ស.គ: ${Ue.teacherBookPages}`:""}\n                                  ${!Ue.studentBookPages&&!Ue.teacherBookPages&&!Ue.isExamRow?"-":""}\n                                </td>`:""}\n                        </tr>\n                      `).join("")}\n                </tbody>\n              </table>\n            </div>\n          `}).join("")}\n          ${_r.summaryFooter?`<div style="margin-top: 8px; font-weight: bold; font-style: italic; font-size: 0.92em;"><div>${_r.summaryFooter.totalHoursLabel}</div><div>${_r.summaryFooter.annualTargetLabel}</div></div>`:""}\n        </div>\n      `}).join(""):d?Pt=d:Pt=`';

code = code.slice(0, oiStart) + newOiBlock + code.slice(oiEnd + oiEndMarker.length);
console.log(`Replaced Oi PDF export block (${oiStart}..${oiEnd + oiEndMarker.length})`);

fs.writeFileSync(filePath, code, "utf8");
console.log("Successfully wrote updated bundle:", filePath);
