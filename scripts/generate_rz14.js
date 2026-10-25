import fs from 'node:fs';
import esbuild from 'esbuild';

console.log("=== Generating Rz14 component with Audio Speech & Fullscreen Mode ===");

const qcmDatabase = [
    // PART 1: ឃ្នាស់ (Questions 1 - 13)
    {
        cat: 'lever',
        q: "១. ផ្អែកលើខ្លឹមសារសៀវភៅពុម្ពទំព័រ ៩២ តើឃ្នាស់ត្រូវបានកំណត់និយមន័យត្រឹមត្រូវបំផុតយ៉ាងដូចម្តេច?",
        options: [
            "ជាឧបករណ៍ស្វ័យប្រវត្តដែលប្រើប្រាស់កម្លាំងម៉ាស៊ីនដើម្បីបំលែងទិសដៅ និងទំហំនៃចលនាដោយគ្មានចំណុចទប់ទល់",
            "ជាប្រភេទម៉ាស៊ីនងាយម្យ៉ាងដែលធ្វើពីរុក្ខជាតិរឹងមាំដូចជាឈើ ឬលោហៈដែលចល័តជុំវិញចំណុចនឹងមួយ ឬអ័ក្សមួយដែលគេហៅថា ចំណុចទ្រ ឬអ័ក្សទ្រ",
            "ជារបារដែករឹងដែលតម្រូវឱ្យកម្លាំងចលករមានទំហំធំជាងកម្លាំងទប់ជានិច្ច ទើបបង្កើតលំនឹងរវាងអង្គធាតុទាំងពីរបាន",
            "ជាផ្ទៃរាបស្មើវែងដែលចល័តជុំវិញបន្ទាត់កាត់ទទឹងមួយដើម្បីសម្រួលដល់ការរំកិលវត្ថុឡើងទៅលើកម្ពស់ខ្ពស់"
        ],
        correct: 1,
        exp: "ទំព័រ ៩២៖ ឃ្នាស់ ជាប្រភេទម៉ាស៊ីនងាយម្យ៉ាងដែលធ្វើពីរុក្ខជាតិរឹងមាំដូចជាឈើ ឬលោហៈដែលចល័តជុំវិញ ចំណុចនឹងមួយ ឬអ័ក្សមួយដែលគេហៅថា ចំណុចទ្រ ឬអ័ក្សទ្រង់។"
    },
    {
        cat: 'lever',
        q: "២. តើចំណុចនឹង ឬអ័ក្សដែលរបារឃ្នាស់ធ្វើចលនាវិលជុំវិញនោះ មានឈ្មោះហៅជាផ្លូវការថាយ៉ាងដូចម្តេច?",
        options: [
            "ចំណុចប្រសព្វនៃបន្ទុក ឬហៅថាកម្លាំងទប់",
            "ចំណុចកណ្តាលនៃថាមពលមេកានិច",
            "ចំណុចទ្រ ឬអ័ក្សទ្រ",
            "ដងកាមបញ្ជូនកម្លាំងចលករ"
        ],
        correct: 2,
        exp: "ទំព័រ ៩២៖ ចំណុចនឹងមួយ ឬអ័ក្សមួយដែលឃ្នាស់ចល័តជុំវិញ គេហៅថា «ចំណុចទ្រ ឬអ័ក្សទ្រង់»។"
    },
    {
        cat: 'lever',
        q: "៣. តើផ្នែកសំខាន់ៗដែលបង្កើតបានជាទម្រង់នៃឃ្នាស់មានចំនួនប៉ុន្មាន និងមានធាតុអ្វីខ្លះ?",
        options: [
            "មាន ២ ផ្នែកសំខាន់គឺ៖ កម្លាំងចលករ និងប្រវែងដៃឃ្នាស់សរុប",
            "មាន ៣ ផ្នែកសំខាន់គឺ៖ កម្លាំងទប់ឬបន្ទុក (ទម្ងន់វត្ថុ), កម្លាំងចលករ និងចំណុចទ្រ",
            "មាន ៤ ផ្នែកសំខាន់គឺ៖ ចំណុចទ្រ, អ័ក្សរង្វិល, កម្លាំងកកិត និងទម្ងន់បន្ទុក",
            "មាន ៥ ផ្នែកសំខាន់គឺ៖ សម្ពាយ, កង់, អ័ក្ស, ខ្សែ និងចង្អូររង្វិល"
        ],
        correct: 1,
        exp: "ទំព័រ ៩២ ចែងយ៉ាងច្បាស់ថាផ្នែកសំខាន់ៗនៃឃ្នាស់មាន ៣ គឺ កម្លាំងទប់ឬបន្ទុក(ទម្ងន់វត្ថុ), កម្លាំងចលករ និងចំណុចទ្រ។"
    },
    {
        cat: 'lever',
        q: "៤. នៅពេលយើងរំកិល ឬផ្លាស់ទីវត្ថុមួយដោយដៃផ្ទាល់ដោយមិនប្រើឃ្នាស់ តើកម្លាំងចលករដែលត្រូវបញ្ចេញមានទំហំប៉ុនណា?",
        options: [
            "យើងត្រូវបញ្ចេញកម្លាំងចលករតូចជាងទម្ងន់បន្ទុកជានិច្ចដោយសារទំនាញដីជួយរុញ",
            "យើងគ្រាន់តែបញ្ចេញកម្លាំងស្មើពាក់កណ្តាលនៃទម្ងន់បន្ទុកប៉ុណ្ណោះ",
            "យើងត្រូវប្រើកម្លាំងចលករស្មើឬធំជាងកម្លាំងទប់ ទើបវត្ថុនោះអាចផ្លាស់ទីបាន",
            "យើងមិនចាំបាច់បញ្ចេញកម្លាំងចលករទេ ព្រោះវត្ថុរំកិលតាមកម្លាំងនិចលភាព"
        ],
        correct: 2,
        exp: "ទំព័រ ៩២៖ បើយើងរំកិលឬផ្លាស់ទីវត្ថុមួយ យើងត្រូវប្រើកម្លាំងចលករស្មើឬធំជាងកម្លាំងទប់ ទើបវត្ថុនោះអាចផ្លាស់ទីបាន។"
    },
    {
        cat: 'lever',
        q: "៥. តើផលប្រយោជន៍ចម្បងនៃការប្រើប្រាស់ឃ្នាស់ក្នុងការបំពេញការងារជាក់ស្តែងគឺអ្វី?",
        options: [
            "ជួយបង្កើនទម្ងន់បន្ទុកឱ្យកាន់តែធ្ងន់ដើម្បីទប់លំនឹង",
            "ធ្វើឱ្យយើងអាចប្រើកម្លាំងចលករតូចជាងកម្លាំងទប់ ឬបន្ទុក",
            "កាត់បន្ថយចម្ងាយចលនារបស់កម្លាំងចលករឱ្យនៅត្រឹមកន្លះសង់ទីម៉ែត្រ",
            "លុបបំបាត់កម្លាំងកកិតទាំងស្រុងរវាងវត្ថុ និងដី"
        ],
        correct: 1,
        exp: "ទំព័រ ៩២៖ ប៉ុន្តែ បើយើងប្រើឃ្នាស់វិញ នោះយើងប្រើកម្លាំងចលករតូចជាងកម្លាំងទប់ឬបន្ទុក។"
    },
    {
        cat: 'lever',
        q: "៦. យោងតាមច្បាប់ទូទៅនៃឃ្នាស់ តើទំនាក់ទំនងរវាងប្រវែងដៃឃ្នាស់ និងកម្លាំងចលករប្រព្រឹត្តទៅដូចម្តេច?",
        options: [
            "បើប្រវែងដៃឃ្នាស់កាន់តែវែង កម្លាំងចលករកាន់តែធំទៅតាមនោះដែរ",
            "បើប្រវែងដៃឃ្នាស់កាន់តែខ្លី កម្លាំងចលកររឹតតែតូចងាយស្រួលលើក",
            "បើប្រវែងដៃឃ្នាស់កាន់តែវែង កម្លាំងចលករកាន់តែតូច",
            "ប្រវែងដៃឃ្នាស់មិនមានឥទ្ធិពលអ្វីទាល់តែសោះទៅលើទំហំនៃកម្លាំងចលករ"
        ],
        correct: 2,
        exp: "ទំព័រ ៩២៖ ជាទូទៅ ក្នុងការប្រើឃ្នាស់ បើប្រវែងដៃឃ្នាស់កាន់តែវែង កម្លាំងចលករកាន់តែតូច។"
    },
    {
        cat: 'lever',
        q: "៧. តើការបែងចែកប្រភេទនៃឃ្នាស់ជា ៣ ប្រភេទ គឺផ្អែកទៅលើកត្តាសំខាន់អ្វីមួយ?",
        options: [
            "ផ្អែកលើប្រភេទសម្ភារៈដែលយកមកធ្វើរបារ ដូចជាឈើ ឬដែកថែប",
            "ផ្អែកលើទីតាំងចំណុចទ្រ កម្លាំងទប់ និងកម្លាំងចលករ",
            "ផ្អែកលើទម្ងន់របស់វត្ថុដែលត្រូវលើកថាតូចជាង ឬធំជាង ១០០ គីឡូក្រាម",
            "ផ្អែកលើល្បឿននៃការបង្វិលជុំវិញអ័ក្សទ្រ"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៣៖ គេចែកឃ្នាស់ជាបីប្រភេទដោយផ្អែកលើទីតាំងចំណុចទ្រ កម្លាំងទប់ និងកម្លាំងចលករ។"
    },
    {
        cat: 'lever',
        q: "៨. តើឃ្នាស់ប្រភេទទី ១ មានលក្ខណៈសម្គាល់ទីតាំងនៃធាតុផ្សំយ៉ាងដូចម្តេច?",
        options: [
            "កម្លាំងទប់ឬបន្ទុក ស្ថិតនៅចន្លោះកម្លាំងចលករ និងចំណុចទ្រ",
            "កម្លាំងចលករ ស្ថិតនៅចន្លោះកម្លាំងទប់ឬបន្ទុក និងចំណុចទ្រ",
            "ចំណុចទ្រ ស្ថិតនៅចន្លោះកម្លាំងចលករ និងកម្លាំងទប់ឬបន្ទុក",
            "ចំណុចទ្រ និងកម្លាំងទប់ ត្រូវស្ថិតនៅត្រង់ចំណុចតែមួយជានិច្ច"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៣៖ ឃ្នាស់ប្រភេទទី ១ ជាឃ្នាស់ដែលមានចំណុចទ្រស្ថិតនៅចន្លោះកម្លាំងចលករនិងកម្លាំងទប់ឬបន្ទុក។"
    },
    {
        cat: 'lever',
        q: "៩. ក្នុងចំណោមឧបករណ៍ប្រើប្រាស់ប្រចាំថ្ងៃខាងក្រោម តើឧបករណ៍ណាខ្លះជាគំរូនៃឃ្នាស់ប្រភេទទី ១?",
        options: [
            "រទេះរុញដៃដី និងប្រដាប់គាស់គម្របដបទឹកក្រូច",
            "កន្ត្រៃកាត់ក្រដាស និងជើងក្អែកគាស់ដុំថ្ម",
            "អំបោសបោសផ្ទះ និងដង្កៀបចាប់នំ",
            "ដងសន្ទូច និងចង្កឹះចាប់ម្ហូប"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៣៖ កន្ត្រៃ និងជើងក្អែក ជាគំរូនៃឃ្នាស់ប្រភេទទី ១ ព្រោះចំណុចទ្រនៅចន្លោះកម្លាំងទាំងពីរ។"
    },
    {
        cat: 'lever',
        q: "១០. តើឃ្នាស់ប្រភេទទី ២ មានលក្ខណៈសម្គាល់ត្រង់ចំណុចណា?",
        options: [
            "កម្លាំងទប់ឬបន្ទុក ស្ថិតនៅចន្លោះកម្លាំងចលករ និងចំណុចទ្រ",
            "ចំណុចទ្រ ស្ថិតនៅចំកណ្តាលរវាងកម្លាំងចលករ និងបន្ទុក",
            "កម្លាំងចលករ ស្ថិតនៅចន្លោះចំណុចទ្រ និងកម្លាំងទប់",
            "កម្លាំងទប់ស្ថិតនៅខាងចុងគេបំផុតជាប់នឹងដៃអ្នកកាន់"
        ],
        correct: 0,
        exp: "ទំព័រ ៩៣៖ ឃ្នាស់ប្រភេទទី ២ ជាឃ្នាស់ដែលមានកម្លាំងទប់ឬបន្ទុកស្ថិតនៅចន្លោះកម្លាំងចលករនិងចំណុចទ្រ។"
    },
    {
        cat: 'lever',
        q: "១១. ហេតុអ្វីបានជារទេះរុញដៃ (Wheelbarrow) ត្រូវបានចាត់ថ្នាក់ជាឃ្នាស់ប្រភេទទី ២?",
        options: [
            "ពីព្រោះដៃកាន់របស់មនុស្សស្ថិតនៅចំកណ្តាលនៃរទេះ",
            "ពីព្រោះកង់រទេះ(ចំណុចទ្រ) នៅចន្លោះទ្រុងផ្ទុក និងដៃកាន់",
            "ពីព្រោះបន្ទុក(ដីឬខ្សាច់ក្នុងរទេះ) ស្ថិតនៅចន្លោះចំណុចទ្រ(កង់) និងកម្លាំងចលករ(ដៃលើក)",
            "ពីព្រោះវាប្រើប្រាស់កង់រអិលជំនួសឱ្យការបង្វិលអ័ក្ស"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៣៖ រទេះរុញដៃជាឃ្នាស់ប្រភេទទី ២ ព្រោះបន្ទុកស្ថិតនៅចន្លោះកម្លាំងចលករ(ដៃមនុស្ស) និងចំណុចទ្រ(កង់ខាងមុខ)។"
    },
    {
        cat: 'lever',
        q: "១២. តើឃ្នាស់ប្រភេទទី ៣ មានការរៀបចំទីតាំងធាតុផ្សំយ៉ាងដូចម្តេច?",
        options: [
            "ចំណុចទ្រ ស្ថិតនៅចន្លោះកម្លាំងចលករ និងកម្លាំងទប់",
            "កម្លាំងចលករ ស្ថិតនៅចន្លោះកម្លាំងទប់ឬបន្ទុក និងចំណុចទ្រ",
            "កម្លាំងទប់ ស្ថិតនៅចន្លោះកម្លាំងចលករ និងចំណុចទ្រ",
            "គ្មានវត្តមានចំណុចទ្រនោះទេសម្រាប់ឃ្នាស់ប្រភេទនេះ"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៣៖ ឃ្នាស់ប្រភេទទី ៣ ជាឃ្នាស់ដែលមានកម្លាំងចលករស្ថិតនៅចន្លោះកម្លាំងទប់ឬបន្ទុកនិងចំណុចទ្រ។"
    },
    {
        cat: 'lever',
        q: "១៣. តើឧបករណ៍ណាខ្លះជាតំណាងជាក់ស្តែងនៃឃ្នាស់ប្រភេទទី ៣ ក្នុងជីវភាពរស់នៅ?",
        options: [
            "អំបោសបោសដី និងដង្កៀប",
            "កន្ត្រៃកាត់ក្រណាត់ និងជើងក្អែក",
            "រទេះរុញដៃ និងប្រដាប់គាបក្រូចឆ្មារ",
            "ជញ្ជីងថ្លឹងទម្ងន់ និងក្តារយោលអុក"
        ],
        correct: 0,
        exp: "ទំព័រ ៩៣៖ អំបោសបោសដី និងដង្កៀប ជាឃ្នាស់ប្រភេទទី ៣ ព្រោះកម្លាំងចលករ(ដៃបញ្ជា) នៅចន្លោះចំណុចទ្រ និងបន្ទុក។"
    },

    // PART 2: ប្លង់ទេរ (Questions 14 - 25)
    {
        cat: 'plane',
        q: "១៤. តាមនិយមន័យក្នុងសៀវភៅពុម្ពទំព័រ ៩៣ តើប្លង់ទេរគឺជាអ្វី?",
        options: [
            "ជារបារដែកដែលភ្ជាប់នឹងអ័ក្សបង្វិលសម្រាប់បង្ហូតខ្សែទាញ",
            "ជាផ្ទៃរាបមួយ ដែលជាទូទៅធ្វើអំពីបន្ទះឈើឬបន្ទះលោហៈសម្រាប់ប្រើប្រាស់ជាទម្រក្នុងការលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់ឬទីខ្ពស់មកទីទាប",
            "ជាឧបករណ៍ដែលមានចង្អូរព័ទ្ធជុំវិញកង់សម្រាប់កាត់បន្ថយទម្ងន់វត្ថុ",
            "ជាផ្ទៃកោងសម្រាប់បង្កើនល្បឿននៃអង្គធាតុធ្លាក់សេរី"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៣៖ ប្លង់ទេរ ជាផ្ទៃរាបមួយ ដែលជាទូទៅ ធ្វើអំពីបន្ទះឈើឬបន្ទះលោហៈសម្រាប់ប្រើប្រាស់ជាទម្រក្នុងការលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់ឬទីខ្ពស់មកទីទាប។"
    },
    {
        cat: 'plane',
        q: "១៥. តើគោលបំណងចម្បងនៃការយកប្លង់ទេរមកប្រើប្រាស់ក្នុងការលើកដាក់ទំនិញគឺដើម្បីអ្វី?",
        options: [
            "ដើម្បីកាត់បន្ថយកម្លាំងចលករដែលត្រូវប្រើប្រាស់ធៀបនឹងការលើកត្រង់ទៅលើ",
            "ដើម្បីកាត់បន្ថយចម្ងាយផ្លាស់ទីរបស់វត្ថុឱ្យនៅខ្លីបំផុត",
            "ដើម្បីប្តូរម៉ាសរបស់វត្ថុឱ្យស្រាលជាងមុនពាក់កណ្តាល",
            "ដើម្បីកាត់បន្ថយរយៈពេលក្នុងការរៀបចំទំនិញ"
        ],
        correct: 0,
        exp: "ទំព័រ ៩៤៖ ការលើកតាមប្លង់ទេរជួយឱ្យយើងបញ្ចេញកម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។"
    },
    {
        cat: 'plane',
        q: "១៦. ប្រសិនបើគេលើកបន្ទុកមួយឡើងទៅលើត្រង់ (Vertical Lift) ដោយផ្ទាល់ តើគេត្រូវបញ្ចេញកម្លាំងចលករយ៉ាងណា?",
        options: [
            "ត្រូវបញ្ចេញកម្លាំងចលករស្មើពាក់កណ្តាលនៃទម្ងន់បន្ទុក",
            "ត្រូវបញ្ចេញកម្លាំងចលករស្មើឬធំជាងទម្ងន់បន្ទុក",
            "ត្រូវបញ្ចេញកម្លាំងចលករតូចជាងទម្ងន់បន្ទុក ៣ ដង",
            "មិនបាច់បញ្ចេញកម្លាំងទេព្រោះបន្ទុកអណ្តែតដោយខ្លួនឯង"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៤៖ បើគេលើកបន្ទុកមួយឡើងទៅលើត្រង់ គេត្រូវបញ្ចេញកម្លាំងចលករស្មើឬធំជាងទម្ងន់បន្ទុក។"
    },
    {
        cat: 'plane',
        q: "១៧. ប្រសិនបើគេលើកបន្ទុកដដែលឡើងទៅលើតាមប្លង់ទេរមួយវិញ តើកម្លាំងចលករនឹងមានការប្រែប្រួលដូចម្តេច?",
        options: [
            "កម្លាំងចលករកើនឡើងធំជាងទម្ងន់បន្ទុកទ្វេដង",
            "គេបញ្ចេញកម្លាំងចលករតូចជាងទម្ងន់បន្ទុក",
            "កម្លាំងចលករនៅតែស្មើនឹងទម្ងន់បន្ទុកដដែល មិនប្រែប្រួលទេ",
            "កម្លាំងចលករធ្លាក់ចុះដល់សូន្យញូតុន"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៤៖ បើគេលើកបន្ទុកដដែលនេះឡើងទៅលើតាមប្លង់ទេរ គេបញ្ចេញកម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។"
    },
    {
        cat: 'plane',
        q: "១៨. នៅពេលគេលើកបន្ទុកដដែលឡើងទៅលើតាមប្លង់ទេរដែលមានប្រវែងកាន់តែវែងជាងមុន តើកម្លាំងចលករនឹងទៅជាយ៉ាងណា?",
        options: [
            "ត្រូវបញ្ចេញកម្លាំងចលករកាន់តែធំឡើងៗ",
            "គេត្រូវបញ្ចេញកម្លាំងចលករកាន់តែតូចជាងទម្ងន់បន្ទុក",
            "កម្លាំងចលករកើនឡើងស្មើទម្ងន់បន្ទុកគុណនឹងពីរ",
            "កម្លាំងចលករនឹងប្រែប្រួលទិសដៅទៅបញ្ច្រាសវិញ"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៤៖ បើគេលើកបន្ទុកដដែលនេះឡើងលើតាមប្លង់ទេរដែលមានប្រវែងវែងជាងមុន គេត្រូវបញ្ចេញកម្លាំងចលករកាន់តែតូចជាងទម្ងន់បន្ទុក។"
    },
    {
        cat: 'plane',
        q: "១៩. តើសេចក្តីថ្លែងការណ៍ណាមួយជា «ច្បាប់ទូទៅនៃការលើកដាក់វត្ថុតាមប្លង់ទេរ»?",
        options: [
            "បើប្រវែងប្លង់ទេរកាន់តែខ្លី កម្លាំងចលករកាន់តែតូច",
            "បើកម្ពស់ប្លង់ទេរកាន់តែខ្ពស់ កម្លាំងចលករកាន់តែតូច",
            "បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច",
            "ប្រវែងប្លង់ទេរ និងកម្លាំងចលករមានសមាមាត្រផ្ទាល់នឹងគ្នាជានិច្ច"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៤៖ ជាទូទៅ ក្នុងការលើកដាក់វត្ថុតាមប្លង់ទេរ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។"
    },
    {
        cat: 'plane',
        q: "២០. តើក្រុមឧបករណ៍ណាខ្លះដែលត្រូវបានកែច្នៃចេញពីគោលការណ៍នៃប្លង់ទេរ?",
        options: [
            "ពូថៅ រណារ ពន្លាក ផ្លែស្វាន កាំបិត ជណ្តើរ",
            "កន្ត្រៃ ជើងក្អែក រទេះរុញដៃ ដង្កៀប",
            "រ៉កនឹង រ៉កចល័ត ប្រព័ន្ធរ៉ក សម្ពាយ",
            "កង់ឡាន ច្រវាក់កង់ ឈ្នាន់កង់ ដៃចង្កូត"
        ],
        correct: 0,
        exp: "ទំព័រ ៩៤៖ គេអាចច្នៃឧបករណ៍ប្រើប្រាស់ផ្សេងៗដែលមានលក្ខណៈជាប្លង់ទេរដូចជា ពូថៅ រណារ ពន្លាក ផ្លែស្វាន កាំបិត ជណ្តើរ...។"
    },
    {
        cat: 'plane',
        q: "២១. ហេតុអ្វីបានជាផ្លូវឡើងភ្នំ ឬជណ្តើរឡើងទីខ្ពស់ គេច្រើនធ្វើឱ្យមានរាងទេរវែង ឬបត់បែនច្រើនជុំ?",
        options: [
            "ដើម្បីកាត់បន្ថយចម្ងាយនៃការធ្វើដំណើរឱ្យកាន់តែជិត",
            "ដើម្បីកាត់បន្ថយកម្លាំងចលករក្នុងការឡើង ធ្វើឱ្យមិនសូវហត់ខ្លាំង",
            "ដើម្បីកាត់បន្ថយកម្លាំងកកិតរវាងកង់រថយន្ត និងផ្លូវ",
            "ដើម្បីឱ្យរថយន្តអាចបើកបរក្នុងល្បឿនលឿនបំផុតបាន"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៤៖ កាលណាប្រវែងប្លង់កាន់តែវែង កម្លាំងចលករដែលត្រូវការដើម្បីឡើងទៅទីខ្ពស់កាន់តែតូច សម្រាលការនឿយហត់។"
    },
    {
        cat: 'plane',
        q: "២២. តើផ្លែពូថៅ ឬមុខកាំបិត មានទម្រង់បច្ចេកទេសជាអ្វីក្នុងការអនុវត្តរូបវិទ្យា?",
        options: [
            "ជាប្រភេទឃ្នាស់ប្រភេទទី ២ ផ្គុំគ្នា",
            "ជាប្លង់ទេរពីរទល់ខ្នងគ្នា (ក្រូចឆ្មារ ឬ Wedge) សម្រាប់ពុះបំបែកវត្ថុ",
            "ជារ៉កចល័តខ្នាតតូចសម្រាប់ទាញសាច់ឈើ",
            "ជាចំណុចទ្រចល័តដែលគ្មានកម្លាំងទប់"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៤៖ មុខកាំបិត និងពូថៅជាការច្នៃចេញពីប្លង់ទេរ ដើម្បីបំបែកកម្លាំងសង្កត់ទៅជាកម្លាំងពុះវត្ថុជាពីរ។"
    },
    {
        cat: 'plane',
        q: "២៣. បើលើកធុងប្រេងទម្ងន់ 600 N ឡើងកម្ពស់ 1m តាមប្លង់ទេរប្រវែង 3m តើកម្លាំងចលករ F ស្មើនឹងប៉ុន្មាន?",
        options: [
            "600 N (ស្មើទម្ងន់បន្ទុក)",
            "300 N (ថយចុះពាក់កណ្តាល)",
            "200 N (ចំណេញកម្លាំង ៣ ដង)",
            "100 N (ចំណេញកម្លាំង ៦ ដង)"
        ],
        correct: 2,
        exp: "រូបមន្តប្លង់ទេរ F = (P × H) / L = (600 N × 1m) / 3m = 200 N (ចំណេញកម្លាំង ៣ ដង)។"
    },
    {
        cat: 'plane',
        q: "២៤. បើប្លង់ទេរមួយមានប្រវែង 4m និងកម្ពស់ 2m តើកម្លាំងចលករថយចុះមកសល់ប៉ុន្មានភាគរយនៃទម្ងន់បន្ទុក?",
        options: [
            "ថយចុះមកនៅសល់ត្រឹម ៥០% នៃទម្ងន់បន្ទុក",
            "ថយចុះមកនៅសល់ត្រឹម ២៥% នៃទម្ងន់បន្ទុក",
            "នៅដដែលគឺ ១០០% ព្រោះប្លង់ទេរមិនចំណេញកម្លាំង",
            "ថយចុះមកនៅសល់ត្រឹម ១០% នៃទម្ងន់បន្ទុក"
        ],
        correct: 0,
        exp: "សមាមាត្រ H / L = 2 / 4 = 1/2 ពោលគឺកម្លាំងចលករថយចុះមកសល់ ៥០% នៃទម្ងន់បន្ទុកដើម។"
    },
    {
        cat: 'plane',
        q: "២៥. ហេតុអ្វីបានជាកម្មករលើកដាក់ទំនិញតែងតែប្រើក្តារបន្ទះវែងដាក់ភ្ជាប់ពីដីទៅទ្រុងរថយន្ត?",
        options: [
            "ដើម្បីកុំឱ្យប្រឡាក់បាតទំនិញជាមួយដី",
            "ដើម្បីបង្កើនទម្ងន់បន្ទុកឱ្យឡានមានលំនឹងល្អ",
            "ដើម្បីបង្កើតជាប្លង់ទេរ ជួយឱ្យរុញទំនិញឡើងដោយប្រើកម្លាំងចលករតូចជាងការលើកត្រង់",
            "ដើម្បីកាត់បន្ថយចម្ងាយផ្លាស់ទីរបស់ទំនិញ"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៤៖ ប្រើជាប្លង់ទេរដើម្បីរំកិលទំនិញឡើងដោយប្រើកម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។"
    },

    // PART 3: រ៉ក (Questions 26 - 40)
    {
        cat: 'pulley',
        q: "២៦. យោងតាមនិយមន័យក្នុងសៀវភៅពុម្ពទំព័រ ៩៥ តើរ៉កគឺជាអ្វី?",
        options: [
            "ជារបារឈើវែងដែលបង្វិលជុំវិញចំណុចទ្រមួយសម្រាប់គាស់ដុំថ្ម",
            "ជាចង្អូរម៉្យាងធ្វើពីឈើ ឬលោហៈដែលមានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែពួរ ឬខ្សែលួសនិងមានប្រហោងមួយកាត់តាមផ្ចិតសម្រាប់ដាក់ស្នូលដែលគេហៅថា “អ័ក្ស”",
            "ជាផ្ទៃរាបស្មើវែងសម្រាប់រុញបន្ទុកធ្ងន់ៗពីទីទាបទៅទីខ្ពស់",
            "ជាដងកាមសម្រាប់ចាប់ភ្ជាប់ខ្សែពួរឱ្យនៅនឹងថ្កល់មួយកន្លែង"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៥៖ រ៉កគឺជាចង្អូរម៉្យាងធ្វើពីឈើ ឬលោហៈដែលមានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែពួរ ឬខ្សែលួសនិងមានប្រហោងមួយកាត់តាមផ្ចិតសម្រាប់ដាក់ស្នូលដែលគេហៅថា “អ័ក្ស”។"
    },
    {
        cat: 'pulley',
        q: "២៧. តើស្នូលដែលកាត់តាមផ្ចិតនៃកង់រ៉ក ហើយអនុញ្ញាតឱ្យរ៉កវិលបានដោយសេរីនោះ មានឈ្មោះហៅថាអ្វី?",
        options: [
            "សម្ពាយ",
            "ចង្អូរខ្សែ",
            "អ័ក្ស",
            "ដងកាម"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៥៖ ប្រហោងមួយកាត់តាមផ្ចិតសម្រាប់ដាក់ស្នូលដែលគេហៅថា “អ័ក្ស”។ អ័ក្សនេះអាចធ្វើឱ្យរ៉កចល័តជុំវិញដោយសេរីបាន។"
    },
    {
        cat: 'pulley',
        q: "២៨. តើផ្នែកសំខាន់ៗទាំង ៥ នៃរ៉ក (ដូចបង្ហាញក្នុងគំនូសបំព្រួញទំព័រ ៩៥) រួមមានអ្វីខ្លះ?",
        options: [
            "កម្លាំងទប់, កម្លាំងចលករ, ចំណុចទ្រ, ដៃឃ្នាស់, អ័ក្ស",
            "សម្ពាយ, កង់, អ័ក្ស, ខ្សែ, ចង្អូរ",
            "បន្ទះឈើ, កម្ពស់, បាត, ជម្រាល, ទម្រ",
            "ម៉ូទ័រ, ច្រវាក់, ធ្មេញកង់, ដងកាម, ហ្វ្រាំង"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៥ រូបភាពរ៉កបង្ហាញស្លាក ៥ យ៉ាងច្បាស់៖ សម្ពាយ, កង់, អ័ក្ស, ខ្សែ, ចង្អូរ។"
    },
    {
        cat: 'pulley',
        q: "២៩. យោងតាមសៀវភៅពុម្ពរូបវិទ្យា តើរ៉កត្រូវបានបែងចែកជាប៉ុន្មានប្រភេទធំៗ?",
        options: [
            "២ ប្រភេទគឺ៖ រ៉កធំ និងរ៉កតូច",
            "៣ ប្រភេទគឺ៖ រ៉កនឹង, រ៉កចល័ត, និងប្រព័ន្ធរ៉ក",
            "៤ ប្រភេទគឺ៖ រ៉កឈើ, រ៉កដែក, រ៉កខ្សែពួរ, និងរ៉កខ្សែលួស",
            "៥ ប្រភេទទៅតាមចំនួនកង់រ៉ក"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៥៖ រ៉កមានបីប្រភេទគឺ រ៉កនឹង, រ៉កចល័ត និងប្រព័ន្ធរ៉ក។"
    },
    {
        cat: 'pulley',
        q: "៣០. តើរ៉កនឹង មានការរៀបចំចំនួនរ៉កយ៉ាងដូចម្តេច?",
        options: [
            "មានរ៉កតែមួយ ដែលត្រូវបានភ្ជាប់នឹងកន្លែងមួយនឹងថ្កល់",
            "មានរ៉កពីរភ្ជាប់គ្នាជាខ្សែបណ្តោយ",
            "មានរ៉កចំនួន ៤ ឡើងទៅផ្គុំចូលគ្នា",
            "មានរ៉កចល័តមួយអមដោយរ៉កនឹងពីរ"
        ],
        correct: 0,
        exp: "ទំព័រ ៩៥៖ រ៉កនឹង គឺមានរ៉កតែមួយ។"
    },
    {
        cat: 'pulley',
        q: "៣១. តើរ៉កចល័ត ត្រូវបានផ្គុំឡើងពីរ៉កចំនួនប៉ុន្មាន និងមានទម្រង់បែបណា?",
        options: [
            "ផ្គុំពីរ៉កចំនួនមួយគត់ដែលចល័តឡើងចុះតាមបន្ទុក",
            "ផ្គុំឡើងពីរ៉កពីរ (រ៉កនឹងមួយ និងរ៉កមួយទៀតចល័ត)",
            "ផ្គុំពីរ៉កចំនួន ៤ ចល័តស្របគ្នា",
            "ផ្គុំពីរ៉កនឹងចំនួន ៣ គ្មានរ៉កចល័តទេ"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៥៖ រ៉កចល័ត ផ្តុំឡើងពីរ៉កពីរ (រ៉កនឹងមួយនិងរ៉កមួយទៀតចល័ត)។"
    },
    {
        cat: 'pulley',
        q: "៣២. តើប្រព័ន្ធរ៉ក ត្រូវបានបង្កើតឡើងពីការផ្គុំរ៉កចំនួនប៉ុន្មាន?",
        options: [
            "ផ្តុំពីរ៉កចំនួន ២ តែប៉ុណ្ណោះ",
            "ផ្តុំពីរ៉កចំនួន ៣ ក្នុងនោះមានរ៉កនឹង ២",
            "ផ្តុំឡើងពីរ៉កចំនួន ៤ ឡើងទៅ (រ៉កនឹងនិងរ៉កចល័តច្រើន)",
            "ផ្តុំពីរ៉កនឹងសុទ្ធសាធចំនួន ៦"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៥៖ ប្រព័ន្ធរ៉ក ផ្តុំឡើងពីរ៉កចំនួន ៤ ឡើងទៅ(រ៉កនឹងនិងរ៉កចល័តច្រើន)។"
    },
    {
        cat: 'pulley',
        q: "៣៣. ក្នុងការប្រើប្រាស់ «រ៉កនឹង» តើកម្លាំងចលករដែលទាញខ្សែចុះមានទំនាក់ទំនងដូចម្តេចនឹងទម្ងន់បន្ទុក?",
        options: [
            "កម្លាំងចលករស្មើនឹងពាក់កណ្តាលនៃទម្ងន់បន្ទុក",
            "កម្លាំងចលករស្មើនឹងទម្ងន់បន្ទុកដែលយោងឡើងទៅលើ (F = ទម្ងន់បន្ទុក ÷ ១)",
            "កម្លាំងចលករស្មើនឹងមួយភាគបួននៃទម្ងន់បន្ទុក",
            "កម្លាំងចលករតូចជាងទម្ងន់បន្ទុក ១០ ដង"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៦៖ ការប្រើរ៉កនឹងកម្លាំងចលករដែលទាញខ្សែចុះ ស្មើនឹងទម្ងន់បន្ទុកដែលយោងឡើងទៅលើ (កម្លាំងចលករ = ទម្ងន់បន្ទុក / ចំនួនរ៉ក)។"
    },
    {
        cat: 'pulley',
        q: "៣៤. តើការប្រើប្រាស់ «រ៉កនឹង» ផ្តល់ផលចំណេញកម្លាំងចលករដែរឬទេ?",
        options: [
            "ចំណេញកម្លាំងចលករបាន ២ ដង",
            "ចំណេញកម្លាំងចលករបាន ៤ ដង",
            "មិនចំណេញកម្លាំងចលករទេ គេគ្រាន់តែប្តូរទិសនៃកម្លាំងប៉ុណ្ណោះ (ទាញចុះ បន្ទុកឡើងលើ)",
            "ចំណេញកម្លាំងចលករបាន ១០០%"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៦៖ ក្នុងការប្រើរ៉កនឹង គេគ្រាន់តែប្តូរទិសនៃកម្លាំងប៉ុណ្ណោះ ប៉ុន្តែគេមិនចំណេញកម្លាំងចលករទេ។"
    },
    {
        cat: 'pulley',
        q: "៣៥. ក្នុងការប្រើប្រាស់ «រ៉កចល័ត (រ៉កចំនួន ២)» តើកម្លាំងចលករត្រូវបានគណនាតាមរូបមន្តណា?",
        options: [
            "កម្លាំងចលករ = កម្លាំងទប់ឬទម្ងន់បន្ទុក ÷ ១",
            "កម្លាំងចលករ = (កម្លាំងទប់ឬទម្ងន់បន្ទុក) ÷ ២ (ចំនួនរ៉ក)",
            "កម្លាំងចលករ = (កម្លាំងទប់ឬទម្ងន់បន្ទុក) ÷ ៤ (ចំនួនរ៉ក)",
            "កម្លាំងចលករ = កម្លាំងទប់ឬទម្ងន់បន្ទុក × ២"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៦៖ ការប្រើរ៉កចល័ត(រ៉កចំនួន ២) កម្លាំងចលករ = (កម្លាំងទប់ឬទម្ងន់បន្ទុក) / ២(ចំនួនរ៉ក)។"
    },
    {
        cat: 'pulley',
        q: "៣៦. ក្នុងការប្រើប្រាស់ «ប្រព័ន្ធរ៉ក (រ៉កចំនួន ៤)» តើកម្លាំងចលករមានទំហំស្មើនឹងប៉ុន្មាននៃទម្ងន់បន្ទុក?",
        options: [
            "ស្មើនឹងទម្ងន់បន្ទុកទាំងមូល",
            "ស្មើនឹងពាក់កណ្តាលនៃទម្ងន់បន្ទុក",
            "ស្មើនឹងមួយភាគបួននៃទម្ងន់បន្ទុកដែលត្រូវយោងឡើងទៅលើ (F = បន្ទុក ÷ ៤)",
            "ស្មើនឹងមួយភាគប្រាំបីនៃទម្ងន់បន្ទុក"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៦៖ ការប្រើប្រព័ន្ធរ៉ក(រ៉កចំនួន ៤) កម្លាំងចលករ = (កម្លាំងទប់ឬទម្ងន់បន្ទុក) / ៤(ចំនួនរ៉ក)។"
    },
    {
        cat: 'pulley',
        q: "៣៧. បើយើងត្រូវលើកបន្ទុកទម្ងន់ 800 N ដោយប្រើ «ប្រព័ន្ធរ៉ក (រ៉កចំនួន ៤)» តើយើងត្រូវបញ្ចេញកម្លាំងចលករទាញប៉ុន្មាន?",
        options: [
            "800 N",
            "400 N",
            "200 N",
            "100 N"
        ],
        correct: 2,
        exp: "តាមរូបមន្តទំព័រ ៩៦៖ F = P / 4 = 800 N / 4 = 200 N (ចំណេញកម្លាំង ៤ ដង)។"
    },
    {
        cat: 'pulley',
        q: "៣៨. បើយើងត្រូវលើកបន្ទុកទម្ងន់ 500 N ដោយប្រើ «រ៉កចល័ត (រ៉កចំនួន ២)» តើយើងត្រូវបញ្ចេញកម្លាំងចលករទាញប៉ុន្មាន?",
        options: [
            "500 N",
            "250 N",
            "125 N",
            "1000 N"
        ],
        correct: 1,
        exp: "តាមរូបមន្តទំព័រ ៩៦៖ F = P / 2 = 500 N / 2 = 250 N (ចំណេញកម្លាំង ២ ដង)។"
    },
    {
        cat: 'pulley',
        q: "៣៩. ក្នុងការប្រើប្រាស់រ៉កចល័ត និងប្រព័ន្ធរ៉ក តើគេទទួលបានផលចំណេញ និងការប្រែប្រួលអ្វីខ្លះ?",
        options: [
            "គេចំណេញតែទិសដៅនៃកម្លាំងមួយមុខប៉ុណ្ណោះ ឯល្បឿន និងកម្លាំងមិនប្រែប្រួលទេ",
            "គេចំណេញកម្លាំងចលករ ប្រែប្រួលទិសនៃកម្លាំង និងល្បឿន",
            "គេចំណេញម៉ាសវត្ថុ និងកាត់បន្ថយទំនាញផែនដីជុំវិញបន្ទុក",
            "គេមិនចំណេញកម្លាំងទេ តែចំណេញថាមពលអគ្គិសនី"
        ],
        correct: 1,
        exp: "ទំព័រ ៩៦៖ ក្នុងការប្រើរ៉កចល័ត និងប្រព័ន្ធរ៉ក គេចំណេញកម្លាំងចលករ ប្រែប្រួលទិសនៃកម្លាំង និងល្បឿន។"
    },
    {
        cat: 'pulley',
        q: "៤០. យោងតាមសន្និដ្ឋានចុងក្រោយនៃមេរៀនទី ១៤ (ទំព័រ ៩៦) តើការប្រើប្រាស់រ៉កអាចធ្វើឱ្យប្រែប្រួលអ្វីខ្លះ?",
        options: [
            "ប្រែប្រួលម៉ាស និងទំហំមាឌរបស់អង្គធាតុ",
            "ប្រែប្រួលទំនាញផែនដី និងទម្ងន់ពិតប្រាកដរបស់វត្ថុ",
            "ក្នុងការប្រើរ៉ក គេអាចប្រែប្រួលកម្លាំងចលករ ប្រែប្រួលល្បឿន និងទិសនៃកម្លាំង",
            "ប្រែប្រួលសីតុណ្ហភាព និងសម្ពាធបរិយាកាសជុំវិញ"
        ],
        correct: 2,
        exp: "ទំព័រ ៩៦ សន្និដ្ឋានចុងក្រោយ៖ «ដូចនេះ ក្នុងការប្រើរ៉ក គេអាចប្រែប្រួលកម្លាំងចលករ ប្រែប្រួលល្បឿន និងទិសនៃកម្លាំង។»"
    }
];

const componentSource = `var Rz14 = ({ isOpen: r, onClose: t, onShowToast: s, initialTab: a = "overview" }) => {
  if (!r) return null;

  const [activeTab, setActiveTab] = y.useState(a === "tab-hero" ? "overview" : (a || "overview"));
  const [qcmList] = y.useState(${JSON.stringify(qcmDatabase)});
  const [currentQIndex, setCurrentQIndex] = y.useState(0);
  const [userAnswers, setUserAnswers] = y.useState({});
  
  // New States: Fullscreen & Audio Speech Explanation
  const [isFullscreen, setIsFullscreen] = y.useState(false);
  const [isSpeaking, setIsSpeaking] = y.useState(false);
  const [speakingText, setSpeakingText] = y.useState("");

  // Simulation State
  const [simMode, setSimMode] = y.useState("pulley"); // 'pulley', 'plane', 'lever'
  const [simLoad, setSimLoad] = y.useState(200); // N
  const [pulleyType, setPulleyType] = y.useState(4); // 1 (fixed), 2 (movable), 4 (system)
  const [planeLen, setPlaneLen] = y.useState(4); // meters
  const [leverRatio, setLeverRatio] = y.useState(4); // ratio
  const [animActive, setAnimActive] = y.useState(true);

  const canvasRef = y.useRef(null);

  y.useEffect(() => {
    if (r) {
      document.body.classList.add("qcm-open", "answering-exam");
      return () => {
        document.body.classList.remove("qcm-open", "answering-exam");
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      };
    }
  }, [r]);

  // Audio Speech Synthesis Handler (Khmer TTS)
  const toggleSpeech = (textToRead) => {
    if (isSpeaking) {
      if (window.stopKhmerAudio) window.stopKhmerAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingText("");
      s && s("បានបិទសំឡេងអាន");
      return;
    }
    if (!textToRead) return;
    setIsSpeaking(true);
    setSpeakingText(textToRead);
    s && s("កំពុងអានជាសំឡេងភាសាខ្មែរ...");

    if (window.playKhmerSpeech) {
      window.playKhmerSpeech(
        textToRead,
        () => setIsSpeaking(true),
        () => { setIsSpeaking(false); setSpeakingText(""); },
        () => { setIsSpeaking(false); setSpeakingText(""); }
      );
    } else if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToRead);
        utter.lang = "km-KH";
        utter.rate = 0.88;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => { setIsSpeaking(false); setSpeakingText(""); };
        utter.onerror = () => { setIsSpeaking(false); setSpeakingText(""); };
        window.speechSynthesis.speak(utter);
      } catch (err) {
        setIsSpeaking(false);
        setSpeakingText("");
      }
    } else {
      setIsSpeaking(false);
      setSpeakingText("");
    }
  };

  // Toggle Fullscreen View Mode
  const toggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    if (s) s(nextState ? "បានបើករបៀបបង្ហាញពេញអេក្រង់ (Full Screen)" : "បានចាកចេញពីរបៀបពេញអេក្រង់");
  };

  // Copy helpers
  const copyFullLesson = () => {
    const text = "មេរៀនទី ១៤៖ ម៉ាស៊ីនងាយ (Simple Machines) - សៀវភៅពុម្ពទំព័រ ៩២-៩៦\\n\\n" +
      "១. ឃ្នាស់ (Lever) [ទំព័រ ៩២-៩៣]\\n" +
      "- និយមន័យ៖ ឃ្នាស់ ជាប្រភេទម៉ាស៊ីនងាយម្យ៉ាងដែលធ្វើពីរុក្ខជាតិរឹងមាំដូចជាឈើ ឬលោហៈដែលចល័តជុំវិញ ចំណុចនឹងមួយ ឬអ័ក្សមួយដែលគេហៅថា ចំណុចទ្រ ឬអ័ក្សទ្រ។\\n" +
      "- ផ្នែកសំខាន់ៗ ៣ ៖ កម្លាំងទប់ឬបន្ទុក, កម្លាំងចលករ, ចំណុចទ្រ។\\n" +
      "- ប្រភេទឃ្នាស់ ៣ ៖\\n" +
      "  + ប្រភេទទី ១ (ចំណុចទ្រនៅកណ្តាល) ៖ កន្ត្រៃ, ជើងក្អែក\\n" +
      "  + ប្រភេទទី ២ (បន្ទុកនៅកណ្តាល) ៖ រទេះរុញដៃ\\n" +
      "  + ប្រភេទទី ៣ (កម្លាំងចលករនៅកណ្តាល) ៖ អំបោស, ដង្កៀប\\n\\n" +
      "២. ប្លង់ទេរ (Inclined Plane) [ទំព័រ ៩៣-៩៤]\\n" +
      "- និយមន័យ៖ ជាផ្ទៃរាបមួយ សម្រាប់ប្រើប្រាស់ជាទម្រក្នុងការលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់ឬទីខ្ពស់មកទីទាប។\\n" +
      "- ច្បាប់ទូទៅ៖ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។\\n" +
      "- ឧបករណ៍ច្នៃចេញពីប្លង់ទេរ ៖ ពូថៅ, ជណ្តើរ, ផ្លែស្វាន, កាំបិត, ពន្លាក, រណារ។\\n\\n" +
      "៣. រ៉ក (Pulley) [ទំព័រ ៩៥-៩៦]\\n" +
      "- និយមន័យ៖ ជាចង្អូរម៉្យាងធ្វើពីឈើ ឬលោហៈដែលមានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែពួរ ឬខ្សែលួស និងមានអ័ក្ស។\\n" +
      "- ផ្នែកសំខាន់ៗ ៥ ៖ សម្ពាយ, កង់, អ័ក្ស, ខ្សែ, ចង្អូរ។\\n" +
      "- ប្រភេទ និងរូបមន្ត ៖\\n" +
      "  + រ៉កនឹង (N=1) ៖ F = P ÷ 1 (ប្តូរតែទិសកម្លាំង, មិនចំណេញកម្លាំង)\\n" +
      "  + រ៉កចល័ត (N=2) ៖ F = P ÷ 2 (ចំណេញកម្លាំង ២ ដង)\\n" +
      "  + ប្រព័ន្ធរ៉ក (N=4) ៖ F = P ÷ 4 (ចំណេញកម្លាំង ៤ ដង)\\n" +
      "- សន្និដ្ឋាន ៖ ក្នុងការប្រើរ៉ក គេអាចប្រែប្រួលកម្លាំងចលករ ប្រែប្រួលល្បឿន និងទិសនៃកម្លាំង។";
    navigator.clipboard.writeText(text).then(() => {
      s && s("បានចម្លងខ្លឹមសារមេរៀនទី ១៤ ទាំងស្រុង!");
    }).catch(() => {
      s && s("សូមជ្រើសរើសអត្ថបទដើម្បីចម្លង");
    });
  };

  const copySection = (sec) => {
    let text = "";
    if (sec === "lever") {
      text = "ជំហានទី ១ ៖ ឃ្នាស់ (Lever) - ទំព័រ ៩២-៩៣\\n" +
        "- និយមន័យ ៖ ឃ្នាស់ ជាប្រភេទម៉ាស៊ីនងាយម្យ៉ាងដែលធ្វើពីរុក្ខជាតិរឹងមាំដូចជាឈើ ឬលោហៈដែលចល័តជុំវិញ ចំណុចនឹងមួយ ឬអ័ក្សមួយដែលគេហៅថា ចំណុចទ្រ ឬអ័ក្សទ្រ។\\n" +
        "- ផ្នែកសំខាន់ៗ ៣ ៖ កម្លាំងទប់ឬបន្ទុក (ទម្ងន់វត្ថុ), កម្លាំងចលករ, ចំណុចទ្រ\\n" +
        "- ប្រភេទឃ្នាស់ ៣ ៖\\n" +
        "  + ប្រភេទទី ១ ៖ ចំណុចទ្រនៅចន្លោះ កម្លាំងចលករ និងបន្ទុក (កន្ត្រៃ, ជើងក្អែក)\\n" +
        "  + ប្រភេទទី ២ ៖ បន្ទុកនៅចន្លោះ កម្លាំងចលករ និងចំណុចទ្រ (រទេះរុញដៃ)\\n" +
        "  + ប្រភេទទី ៣ ៖ កម្លាំងចលករនៅចន្លោះ បន្ទុក និងចំណុចទ្រ (អំបោស, ដង្កៀប)";
    } else if (sec === "plane") {
      text = "ជំហានទី ២ ៖ ប្លង់ទេរ (Inclined Plane) - ទំព័រ ៩៣-៩៤\\n" +
        "- និយមន័យ ៖ ជាផ្ទៃរាបមួយ សម្រាប់ប្រើប្រាស់ជាទម្រក្នុងការលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់ឬទីខ្ពស់មកទីទាប។\\n" +
        "- ច្បាប់ទូទៅ ៖ ក្នុងការលើកដាក់វត្ថុតាមប្លង់ទេរ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។\\n" +
        "- ឧបករណ៍ច្នៃ ៖ ពូថៅ, ជណ្តើរ, ផ្លែស្វាន, កាំបិត, ពន្លាក, រណារ។";
    } else if (sec === "pulley") {
      text = "ជំហានទី ៣ ៖ រ៉ក (Pulley) - ទំព័រ ៩៥-៩៦\\n" +
        "- និយមន័យ ៖ ជាចង្អូរម៉្យាងធ្វើពីឈើ ឬលោហៈដែលមានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែពួរ ឬខ្សែលួស និងអ័ក្ស។\\n" +
        "- ផ្នែកសំខាន់ៗ ៥ ៖ សម្ពាយ, កង់, អ័ក្ស, ខ្សែ, ចង្អូរ\\n" +
        "- ប្រភេទ ៣ ៖ រ៉កនឹង (F=P), រ៉កចល័ត (F=P/2), ប្រព័ន្ធរ៉ក (F=P/4)\\n" +
        "- សន្និដ្ឋាន ៖ ក្នុងការប្រើរ៉ក គេអាចប្រែប្រួលកម្លាំងចលករ ប្រែប្រួលល្បឿន និងទិសនៃកម្លាំង។";
    }
    navigator.clipboard.writeText(text).then(() => {
      s && s("បានចម្លងផ្នែក " + sec + " រួចរាល់!");
    });
  };

  // Calculations for Simulation
  const calcEffort = () => {
    if (simMode === 'pulley') {
      return Math.round(simLoad / pulleyType);
    } else if (simMode === 'plane') {
      return Math.round((simLoad * 2) / planeLen);
    } else if (simMode === 'lever') {
      return Math.round(simLoad / leverRatio);
    }
    return simLoad;
  };

  const effortVal = calcEffort();

  // Canvas Drawing Routine in Animation Loop
  y.useEffect(() => {
    if (activeTab !== 'simulation') return;
    let animId;
    let offset = 0;

    const render = () => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      const w = cvs.parentElement ? cvs.parentElement.clientWidth : 600;
      const h = isFullscreen ? 360 : 290;
      if (cvs.width !== w || cvs.height !== h) {
        cvs.width = w;
        cvs.height = h;
      }

      if (animActive) offset += 0.04;

      ctx.clearRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let yPos = 0; yPos < h; yPos += 30) {
        ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(w, yPos); ctx.stroke();
      }

      if (simMode === 'pulley') {
        const cx = w / 2;
        const topY = 55;
        const bob = Math.sin(offset) * 14;

        // Ceiling beam
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx - 110, 10, 220, 10);

        if (pulleyType === 1) {
          // Fixed pulley
          ctx.fillStyle = '#0284c7';
          ctx.beginPath(); ctx.arc(cx, topY, 26, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();
          ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(cx, topY, 6, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, topY); ctx.stroke();

          const loadY = 160 + bob;
          const handY = 170 - bob;
          ctx.strokeStyle = '#d97706'; ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx - 26, loadY);
          ctx.lineTo(cx - 26, topY);
          ctx.arc(cx, topY, 26, Math.PI, 0, false);
          ctx.lineTo(cx + 45, handY);
          ctx.stroke();

          // Weight box
          ctx.fillStyle = '#dc2626';
          ctx.beginPath(); ctx.rect(cx - 52, loadY, 52, 36); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(simLoad + "N", cx - 26, loadY + 18);

          // Arrow
          ctx.strokeStyle = '#059669'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(cx + 45, handY - 25); ctx.lineTo(cx + 45, handY + 25); ctx.stroke();
          ctx.fillStyle = '#059669'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center';
          ctx.fillText("F = " + effortVal + "N", cx + 45, handY - 30);
        } else if (pulleyType === 2) {
          const lowerY = 150 + bob;
          // Upper wheel
          ctx.fillStyle = '#0284c7'; ctx.beginPath(); ctx.arc(cx + 25, topY, 24, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();
          ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(cx + 25, topY, 6, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(cx + 25, 20); ctx.lineTo(cx + 25, topY); ctx.stroke();

          // Lower wheel
          ctx.fillStyle = '#9333ea'; ctx.beginPath(); ctx.arc(cx - 25, lowerY, 22, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();
          ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(cx - 25, lowerY, 6, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = '#d97706'; ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(cx - 47, 20);
          ctx.lineTo(cx - 47, lowerY);
          ctx.arc(cx - 25, lowerY, 22, Math.PI, 0, true);
          ctx.lineTo(cx + 1, topY);
          ctx.arc(cx + 25, topY, 24, Math.PI, 0, false);
          ctx.lineTo(cx + 70, 185 - bob);
          ctx.stroke();

          // Weight box
          ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.rect(cx - 52, lowerY + 26, 54, 34); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(simLoad + "N", cx - 25, lowerY + 43);

          // Arrow
          ctx.strokeStyle = '#059669'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(cx + 70, 150 - bob); ctx.lineTo(cx + 70, 195 - bob); ctx.stroke();
          ctx.fillStyle = '#059669'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center';
          ctx.fillText("F = " + effortVal + "N", cx + 70, 140 - bob);
        } else {
          // System pulley (N=4)
          const lowerY = 145 + bob;
          // Upper wheels
          ctx.fillStyle = '#0284c7'; ctx.beginPath(); ctx.arc(cx - 16, topY, 20, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + 22, topY, 24, 0, Math.PI * 2); ctx.fill();
          // Lower wheels
          ctx.fillStyle = '#9333ea'; ctx.beginPath(); ctx.arc(cx - 16, lowerY, 18, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + 18, lowerY, 22, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = '#d97706'; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - 16, 20); ctx.lineTo(cx - 16, lowerY);
          ctx.arc(cx - 16, lowerY, 18, Math.PI, 0, true);
          ctx.lineTo(cx - 16, topY);
          ctx.arc(cx - 16, topY, 20, Math.PI, 0, false);
          ctx.lineTo(cx + 18, lowerY);
          ctx.arc(cx + 18, lowerY, 22, Math.PI, 0, true);
          ctx.lineTo(cx + 22, topY);
          ctx.arc(cx + 22, topY, 24, Math.PI, 0, false);
          ctx.lineTo(cx + 75, 185 - bob);
          ctx.stroke();

          // Weight box
          ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.rect(cx - 35, lowerY + 26, 70, 36); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(simLoad + "N", cx, lowerY + 44);

          // Arrow
          ctx.strokeStyle = '#059669'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(cx + 75, 140 - bob); ctx.lineTo(cx + 75, 195 - bob); ctx.stroke();
          ctx.fillStyle = '#059669'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center';
          ctx.fillText("F = " + effortVal + "N", cx + 75, 130 - bob);
        }
      } else if (simMode === 'plane') {
        const startX = 60;
        const groundY = h - 50;
        const topY = 70;
        const endX = startX + (planeLen * 28);

        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(20, groundY); ctx.lineTo(w - 20, groundY); ctx.stroke();

        ctx.fillStyle = '#f1f5f9';
        ctx.beginPath(); ctx.moveTo(startX, groundY); ctx.lineTo(endX, groundY); ctx.lineTo(endX, topY); ctx.closePath(); ctx.fill();

        ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(startX, groundY); ctx.lineTo(endX, topY); ctx.stroke();

        const progress = (Math.sin(offset * 0.8) + 1) / 2;
        const boxX = startX + (endX - startX) * progress;
        const boxY = groundY + (topY - groundY) * progress;
        const angle = Math.atan2(topY - groundY, endX - startX);

        ctx.save();
        ctx.translate(boxX, boxY);
        ctx.rotate(angle);
        ctx.fillStyle = '#ea580c'; ctx.fillRect(-22, -30, 44, 28);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px JetBrains Mono'; ctx.textAlign = 'center';
        ctx.fillText(simLoad + "N", 0, -12);
        ctx.restore();

        // Arrow
        ctx.strokeStyle = '#059669'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(boxX, boxY - 20); ctx.lineTo(boxX + 50 * Math.cos(angle), boxY - 20 + 50 * Math.sin(angle)); ctx.stroke();
        ctx.fillStyle = '#059669'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center';
        ctx.fillText("F = " + effortVal + "N", boxX + 25, boxY - 30);
      } else if (simMode === 'lever') {
        const pivotX = w / 2 - 20;
        const cy = h / 2 + 30;
        const tilt = Math.sin(offset * 1.2) * 0.08;

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(pivotX, cy); ctx.lineTo(pivotX - 18, cy + 40); ctx.lineTo(pivotX + 18, cy + 40); ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#0369a1'; ctx.font = '11px Kantumruy Pro'; ctx.textAlign = 'center';
        ctx.fillText("ចំណុចទ្រ", pivotX, cy + 54);

        ctx.save();
        ctx.translate(pivotX, cy);
        ctx.rotate(tilt);

        const dLoad = 90;
        const dEffort = 45 * leverRatio;
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-dLoad, -7, dLoad + dEffort, 14);

        // Weight
        ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.rect(-dLoad - 20, -42, 40, 35); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(simLoad + "N", -dLoad, -24);
        ctx.restore();

        const effortX = pivotX + (dEffort * Math.cos(tilt));
        const effortY = cy + (dEffort * Math.sin(tilt));

        ctx.strokeStyle = '#059669'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(effortX, effortY - 50); ctx.lineTo(effortX, effortY - 5); ctx.stroke();
        ctx.fillStyle = '#059669'; ctx.font = 'bold 11px Kantumruy Pro'; ctx.textAlign = 'center';
        ctx.fillText("F = " + effortVal + "N", effortX, effortY - 55);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeTab, simMode, simLoad, pulleyType, planeLen, leverRatio, animActive, isFullscreen]);

  // Quiz evaluation state
  const currentQ = qcmList[currentQIndex];
  const hasAnswered = userAnswers.hasOwnProperty(currentQIndex);
  const selectedOpt = userAnswers[currentQIndex];

  const handleSelectAnswer = (optIdx) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
  };

  const getScore = () => {
    let score = 0;
    qcmList.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  const currentQAudioText = currentQ ? (
    currentQ.q + "។ ចម្លើយ ៖ " + 
    currentQ.options.map((o, idx) => ['ក', 'ខ', 'គ', 'ឃ'][idx] + ". " + o).join(". ") + 
    (hasAnswered ? "។ " + currentQ.exp : "")
  ) : "";

  return e.jsx("div", {
    className: "fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn",
    children: e.jsxs("div", {
      className: isFullscreen 
        ? "bg-white w-screen h-screen rounded-none border-0 overflow-hidden flex flex-col z-50 text-slate-800 font-khmer selection:bg-emerald-500 selection:text-white"
        : "bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] text-slate-800 font-khmer selection:bg-emerald-500 selection:text-white",
      children: [
        // Header
        e.jsxs("div", {
          className: "sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs px-4 py-3 flex items-center justify-between shrink-0",
          children: [
            e.jsxs("div", {
              className: "flex items-center space-x-3",
              children: [
                e.jsx("div", {
                  className: "w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-100 shrink-0 text-xl",
                  children: "⚛️"
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        e.jsx("span", { className: "text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200", children: "រូបវិទ្យាថ្នាក់ទី ៧-៨" }),
                        e.jsx("span", { className: "text-[10px] text-slate-500 hidden sm:inline", children: "📖 សៀវភៅពុម្ព MoEYS (ទំព័រ ៩២-៩៦)" })
                      ]
                    }),
                    e.jsx("h1", { className: "text-base sm:text-lg font-bold text-slate-900 leading-tight", children: "មេរៀនទី ១៤៖ ម៉ាស៊ីនងាយ (Simple Machines)" })
                  ]
                })
              ]
            }),
            e.jsxs("div", {
              className: "flex items-center space-x-2",
              children: [
                // Global Audio Speech Button
                e.jsxs("button", {
                  type: "button",
                  onClick: () => toggleSpeech(
                    "មេរៀនទី ១៤ ម៉ាស៊ីនងាយ។ ម៉ាស៊ីនងាយ គឺជាឧបករណ៍ដែលជួយសម្រួលដល់ការលើក គាស់ ឬរំកិលវត្ថុធ្ងន់ៗដោយប្រើប្រាស់កម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។ ខ្លឹមសារមេរៀនបែងចែកជា ៣ ផ្នែកគឺ ឃ្នាស់, ប្លង់ទេរ, និងរ៉ក។"
                  ),
                  className: "flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer shadow-xs " + (isSpeaking ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse ring-2 ring-amber-300/50" : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"),
                  children: [
                    e.jsx("span", { children: isSpeaking ? "⏹️" : "🔊" }),
                    e.jsx("span", { className: "hidden md:inline", children: isSpeaking ? "បញ្ឈប់អាន" : "ស្ដាប់ពន្យល់សំឡេង" }),
                    e.jsx("span", { className: "md:hidden", children: "សំឡេង" })
                  ]
                }),

                // Copy Lesson Button
                e.jsxs("button", {
                  type: "button",
                  onClick: copyFullLesson,
                  className: "flex items-center space-x-1.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition border border-slate-300 shadow-xs cursor-pointer",
                  children: [
                    e.jsx("span", { className: "text-emerald-600", children: "📋" }),
                    e.jsx("span", { className: "hidden sm:inline", children: "ចម្លង" })
                  ]
                }),

                // Full Screen Toggle Button
                e.jsxs("button", {
                  type: "button",
                  onClick: toggleFullscreen,
                  className: "flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition border border-slate-300 cursor-pointer shadow-xs",
                  children: [
                    e.jsx("span", { children: isFullscreen ? "🗗" : "⛶" }),
                    e.jsx("span", { className: "hidden sm:inline", children: isFullscreen ? "បង្រួម" : "ពេញអេក្រង់" })
                  ]
                }),

                // Close Button
                e.jsx("button", {
                  type: "button",
                  onClick: t,
                  className: "w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold flex items-center justify-center transition border border-slate-200 cursor-pointer",
                  children: "✕"
                })
              ]
            })
          ]
        }),

        // Navigation Tabs
        e.jsx("nav", {
          className: "bg-slate-50/90 border-b border-slate-200/80 px-4 py-2 flex space-x-2 overflow-x-auto text-xs sm:text-sm shrink-0",
          children: [
            e.jsxs("button", {
              type: "button",
              onClick: () => setActiveTab("overview"),
              className: "py-2 px-3.5 rounded-xl font-semibold flex items-center space-x-2 transition cursor-pointer " + (activeTab === "overview" ? "text-emerald-700 bg-emerald-50 border border-emerald-300 shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"),
              children: [
                e.jsx("span", { children: "🪜" }),
                e.jsx("span", { children: "១. ខ្លឹមសារ ៣ ផ្នែក (Step-by-Step)" })
              ]
            }),
            e.jsxs("button", {
              type: "button",
              onClick: () => setActiveTab("simulation"),
              className: "py-2 px-3.5 rounded-xl font-semibold flex items-center space-x-2 transition cursor-pointer " + (activeTab === "simulation" ? "text-emerald-700 bg-emerald-50 border border-emerald-300 shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"),
              children: [
                e.jsx("span", { children: "🎮" }),
                e.jsx("span", { children: "២. បន្ទប់ពិសោធន៍ (Simulator)" })
              ]
            }),
            e.jsxs("button", {
              type: "button",
              onClick: () => setActiveTab("quiz"),
              className: "py-2 px-3.5 rounded-xl font-semibold flex items-center space-x-2 transition cursor-pointer " + (activeTab === "quiz" ? "text-emerald-700 bg-emerald-50 border border-emerald-300 shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"),
              children: [
                e.jsx("span", { children: "☑️" }),
                e.jsx("span", { children: "៣. សំណួរ QCM (៤០ សំណួរ)" })
              ]
            })
          ]
        }),

        // Main Tab Content
        e.jsxs("main", {
          className: "flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 bg-white",
          children: [
            // TAB 1: OVERVIEW (STEP-BY-STEP LESSON)
            activeTab === "overview" && e.jsxs("section", {
              className: "space-y-6 animate-fadeIn",
              children: [
                // Top banner info
                e.jsx("div", {
                  className: "bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden",
                  children: e.jsxs("div", {
                    className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          e.jsxs("div", {
                            className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold",
                            children: [
                              e.jsx("span", { children: "📖" }),
                              e.jsx("span", { children: "ខ្លឹមសារសៀវភៅពុម្ពក្រសួងអប់រំ (ទំព័រ ៩២ ដល់ ៩៦)" })
                            ]
                          }),
                          e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900", children: "ជំពូកទី ៥ • មេរៀនទី ១៤៖ ម៉ាស៊ីនងាយ" }),
                          e.jsx("p", { className: "text-xs sm:text-sm text-slate-600", children: "ខ្លឹមសារចម្បងបែងចែកជា ៣ ជំហានច្បាស់លាស់ ងាយស្រួលរៀន និងកត់ត្រា" })
                        ]
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsxs("button", {
                            type: "button",
                            onClick: () => toggleSpeech(
                              "ជំពូកទី ៥ មេរៀនទី ១៤ ម៉ាស៊ីនងាយ។ ខ្លឹមសារសៀវភៅពុម្ពក្រសួងអប់រំ ទំព័រ ៩២ ដល់ ៩៦។ ម៉ាស៊ីនងាយ គឺជាឧបករណ៍ដែលជួយសម្រួលដល់ការលើក គាស់ ឬរំកិលវត្ថុធ្ងន់ៗដោយប្រើប្រាស់កម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។"
                            ),
                            className: "bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer",
                            children: [
                              e.jsx("span", { children: "🔊" }),
                              e.jsx("span", { children: "ស្ដាប់សង្ខេបមេរៀន" })
                            ]
                          }),
                          e.jsxs("button", {
                            type: "button",
                            onClick: copyFullLesson,
                            className: "bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer",
                            children: [
                              e.jsx("span", { children: "📋" }),
                              e.jsx("span", { children: "ចម្លងអត្ថបទទាំងអស់" })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),

                // STEP 1: ឃ្នាស់ (LEVER)
                e.jsxs("div", {
                  className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden",
                  children: [
                    e.jsxs("div", {
                      className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center space-x-3",
                          children: [
                            e.jsx("span", { className: "w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-xs", children: "១" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("div", { className: "text-[11px] font-bold text-blue-700 tracking-wider uppercase", children: "ជំហានទី ១ (Step 1)" }),
                                e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "ឃ្នាស់ (Lever) - ទំព័រ ៩២-៩៣" })
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => toggleSpeech(
                                "ជំហានទី ១ ៖ ឃ្នាស់ ជាប្រភេទម៉ាស៊ីនងាយចល័តជុំវិញចំណុចទ្រ។ ផ្នែកសំខាន់ៗនៃឃ្នាស់មាន ៣ គឺ ៖ កម្លាំងទប់ឬបន្ទុក, កម្លាំងចលករ, និងចំណុចទ្រ។ ឃ្នាស់ចែកជា ៣ ប្រភេទ ៖ ប្រភេទទី ១ មានចំណុចទ្រនៅកណ្តាល ដូចជាកន្ត្រៃ។ ប្រភេទទី ២ មានបន្ទុកនៅកណ្តាល ដូចជារទេះរុញដៃ។ ប្រភេទទី ៣ មានកម្លាំងចលករនៅកណ្តាល ដូចជាអំបោស និងដង្កៀប។ ច្បាប់ទូទៅ ៖ បើប្រវែងដៃឃ្នាស់កាន់តែវែង កម្លាំងចលករកាន់តែតូច!"
                              ),
                              className: "text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 cursor-pointer shadow-2xs",
                              children: [
                                e.jsx("span", { children: "🔊" }),
                                e.jsx("span", { children: "ស្ដាប់ពន្យល់" })
                              ]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => copySection("lever"),
                              className: "text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer",
                              children: [
                                e.jsx("span", { children: "📄" }),
                                e.jsx("span", { children: "ចម្លង" })
                              ]
                            })
                          ]
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("h4", {
                              className: "font-bold text-slate-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" }),
                                e.jsx("span", { children: "ក. និយមន័យ" })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800",
                              children: [
                                e.jsx("strong", { children: "ឃ្នាស់" }),
                                " ជាប្រភេទម៉ាស៊ីនងាយម្យ៉ាងដែលធ្វើពីរុក្ខជាតិរឹងមាំដូចជាឈើ ឬលោហៈដែលចល័តជុំវិញ ",
                                e.jsx("strong", { children: "ចំណុចនឹងមួយ ឬអ័ក្សមួយ" }),
                                " ដែលគេហៅថា ",
                                e.jsx("strong", { children: "ចំណុចទ្រ ឬអ័ក្សទ្រ" }),
                                "។"
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx("h4", { className: "font-bold text-slate-900", children: "ផ្នែកសំខាន់ៗនៃឃ្នាស់មាន ៣៖" }),
                            e.jsxs("div", {
                              className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                              children: [
                                e.jsxs("div", {
                                  className: "bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3",
                                  children: [
                                    e.jsx("div", { className: "w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base", children: "📦" }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx("div", { className: "text-[11px] text-slate-500", children: "ធាតុទី ១" }),
                                        e.jsx("div", { className: "font-bold text-slate-900 text-xs sm:text-sm", children: "កម្លាំងទប់ឬបន្ទុក (ទម្ងន់វត្ថុ)" })
                                      ]
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3",
                                  children: [
                                    e.jsx("div", { className: "w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-base", children: "💪" }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx("div", { className: "text-[11px] text-slate-500", children: "ធាតុទី ២" }),
                                        e.jsx("div", { className: "font-bold text-slate-900 text-xs sm:text-sm", children: "កម្លាំងចលករ" })
                                      ]
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3",
                                  children: [
                                    e.jsx("div", { className: "w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-base", children: "▲" }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx("div", { className: "text-[11px] text-slate-500", children: "ធាតុទី ៣" }),
                                        e.jsx("div", { className: "font-bold text-slate-900 text-xs sm:text-sm", children: "ចំណុចទ្រ" })
                                      ]
                                    })
                                  ]
                                })
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("h4", {
                              className: "font-bold text-slate-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" }),
                                e.jsx("span", { children: "ខ. សារប្រយោជន៍នៃការប្រើឃ្នាស់" })
                              ]
                            }),
                            e.jsx("p", { className: "text-slate-700", children: "បើយើងរំកិលឬផ្លាស់ទីវត្ថុមួយ យើងត្រូវប្រើកម្លាំងចលករស្មើឬធំជាងកម្លាំងទប់ ទើបវត្ថុនោះអាចផ្លាស់ទីបាន។ ប៉ុន្តែ បើយើងប្រើឃ្នាស់វិញ នោះយើងប្រើកម្លាំងចលករតូចជាងកម្លាំងទប់ឬបន្ទុក។" }),
                            e.jsxs("div", {
                              className: "p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-950 text-xs",
                              children: [
                                e.jsx("strong", { children: "ℹ️ ច្បាប់ទូទៅ៖ " }),
                                "ក្នុងការប្រើឃ្នាស់ បើប្រវែងដៃឃ្នាស់កាន់តែវែង កម្លាំងចលករកាន់តែតូច។"
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("h4", {
                              className: "font-bold text-slate-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" }),
                                e.jsx("span", { children: "គ. ប្រភេទនៃឃ្នាស់ (៣ ប្រភេទ)" })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "grid grid-cols-1 md:grid-cols-3 gap-3 text-xs",
                              children: [
                                e.jsxs("div", {
                                  className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                                  children: [
                                    e.jsxs("div", {
                                      className: "font-bold text-blue-700 text-sm flex items-center justify-between",
                                      children: [
                                        e.jsx("span", { children: "ឃ្នាស់ប្រភេទទី ១" }),
                                        e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200", children: "កន្ត្រៃ, ជើងក្អែក" })
                                      ]
                                    }),
                                    e.jsxs("p", { className: "text-slate-600", children: [e.jsx("strong", { children: "ចំណុចទ្រ" }), " ស្ថិតនៅចន្លោះ កម្លាំងចលករ និង កម្លាំងទប់ឬបន្ទុក។"] })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                                  children: [
                                    e.jsxs("div", {
                                      className: "font-bold text-emerald-700 text-sm flex items-center justify-between",
                                      children: [
                                        e.jsx("span", { children: "ឃ្នាស់ប្រភេទទី ២" }),
                                        e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200", children: "រទេះរុញដៃ" })
                                      ]
                                    }),
                                    e.jsxs("p", { className: "text-slate-600", children: [e.jsx("strong", { children: "កម្លាំងទប់ឬបន្ទុក" }), " ស្ថិតនៅចន្លោះ កម្លាំងចលករ និង ចំណុចទ្រ។"] })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5",
                                  children: [
                                    e.jsxs("div", {
                                      className: "font-bold text-purple-700 text-sm flex items-center justify-between",
                                      children: [
                                        e.jsx("span", { children: "ឃ្នាស់ប្រភេទទី ៣" }),
                                        e.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200", children: "អំបោស, ដង្កៀប" })
                                      ]
                                    }),
                                    e.jsxs("p", { className: "text-slate-600", children: [e.jsx("strong", { children: "កម្លាំងចលករ" }), " ស្ថិតនៅចន្លោះ កម្លាំងទប់ឬបន្ទុក និង ចំណុចទ្រ។"] })
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

                // STEP 2: ប្លង់ទេរ (INCLINED PLANE)
                e.jsxs("div", {
                  className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden",
                  children: [
                    e.jsxs("div", {
                      className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center space-x-3",
                          children: [
                            e.jsx("span", { className: "w-10 h-10 rounded-2xl bg-teal-600 text-white font-bold text-base flex items-center justify-center shadow-xs", children: "២" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("div", { className: "text-[11px] font-bold text-teal-700 tracking-wider uppercase", children: "ជំហានទី ២ (Step 2)" }),
                                e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "ប្លង់ទេរ (Inclined Plane) - ទំព័រ ៩៣-៩៤" })
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => toggleSpeech(
                                "ជំហានទី ២ ៖ ប្លង់ទេរ ជាផ្ទៃរាបសម្រាប់លើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់។ ក្នុងការលើកដាក់វត្ថុតាមប្លង់ទេរ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។ ឧបករណ៍ច្នៃចេញពីប្លង់ទេរមាន ៖ ពូថៅ, ជណ្តើរ, ផ្លែស្វាន, កាំបិត, ពន្លាក, និងរណារ។"
                              ),
                              className: "text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold px-3 py-1.5 rounded-xl border border-teal-200 flex items-center gap-1.5 cursor-pointer shadow-2xs",
                              children: [
                                e.jsx("span", { children: "🔊" }),
                                e.jsx("span", { children: "ស្ដាប់ពន្យល់" })
                              ]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => copySection("plane"),
                              className: "text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer",
                              children: [
                                e.jsx("span", { children: "📄" }),
                                e.jsx("span", { children: "ចម្លង" })
                              ]
                            })
                          ]
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("h4", {
                              className: "font-bold text-slate-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" }),
                                e.jsx("span", { children: "ក. និយមន័យ" })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800",
                              children: [
                                e.jsx("strong", { children: "ប្លង់ទេរ" }),
                                " ជាផ្ទៃរាបមួយ ដែលជាទូទៅ ធ្វើអំពីបន្ទះឈើឬបន្ទះលោហៈសម្រាប់ប្រើប្រាស់ជាទម្រក្នុងការលើកដាក់វត្ថុពីទីទាបទៅទីខ្ពស់ឬទីខ្ពស់មកទីទាប។"
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("h4", {
                              className: "font-bold text-slate-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" }),
                                e.jsx("span", { children: "ខ. សារប្រយោជន៍នៃការប្រើប្លង់ទេរ" })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "space-y-2 text-xs sm:text-sm",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200",
                                  children: [
                                    e.jsx("span", { className: "text-teal-600 font-bold", children: "➔" }),
                                    e.jsx("span", { children: "បើគេលើកបន្ទុកមួយឡើងទៅលើត្រង់ គេត្រូវបញ្ចេញកម្លាំងចលករស្មើឬធំជាងទម្ងន់បន្ទុក។" })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200",
                                  children: [
                                    e.jsx("span", { className: "text-teal-600 font-bold", children: "➔" }),
                                    e.jsx("span", { children: "បើគេលើកបន្ទុកដដែលនេះឡើងទៅលើតាមប្លង់ទេរ គេបញ្ចេញកម្លាំងចលករតូចជាងទម្ងន់បន្ទុក។" })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200",
                                  children: [
                                    e.jsx("span", { className: "text-teal-600 font-bold", children: "➔" }),
                                    e.jsx("span", { children: "បើគេលើកបន្ទុកដដែលនេះឡើងលើតាមប្លង់ទេរដែលមានប្រវែងវែងជាងមុន គេត្រូវបញ្ចេញកម្លាំងចលករកាន់តែតូចជាងទម្ងន់បន្ទុក។" })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-teal-950 text-xs",
                              children: [
                                e.jsx("strong", { children: "ℹ️ ច្បាប់ទូទៅ៖ " }),
                                "ក្នុងការលើកដាក់វត្ថុតាមប្លង់ទេរ បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។"
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("h4", {
                              className: "font-bold text-slate-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" }),
                                e.jsx("span", { children: "គ. ប្រភេទ និងឧបករណ៍ច្នៃចេញពីប្លង់ទេរ" })
                              ]
                            }),
                            e.jsx("p", { className: "text-xs text-slate-600", children: "គេអាចច្នៃឧបករណ៍ប្រើប្រាស់ផ្សេងៗដែលមានលក្ខណៈជាប្លង់ទេរដូចជា៖" }),
                            e.jsxs("div", {
                              className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs text-center",
                              children: [
                                e.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium", children: [e.jsx("div", { className: "text-lg mb-1", children: "🪓" }), "ពូថៅ"] }),
                                e.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium", children: [e.jsx("div", { className: "text-lg mb-1", children: "🪜" }), "ជណ្តើរ"] }),
                                e.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium", children: [e.jsx("div", { className: "text-lg mb-1", children: "🔩" }), "ផ្លែស្វាន"] }),
                                e.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium", children: [e.jsx("div", { className: "text-lg mb-1", children: "🔪" }), "កាំបិត"] }),
                                e.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium", children: [e.jsx("div", { className: "text-lg mb-1", children: "🔧" }), "ពន្លាក"] }),
                                e.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium", children: [e.jsx("div", { className: "text-lg mb-1", children: "🪚" }), "រណារ"] })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // STEP 3: រ៉ក (PULLEY)
                e.jsxs("div", {
                  className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden",
                  children: [
                    e.jsxs("div", {
                      className: "bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center space-x-3",
                          children: [
                            e.jsx("span", { className: "w-10 h-10 rounded-2xl bg-amber-600 text-white font-bold text-base flex items-center justify-center shadow-xs", children: "៣" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("div", { className: "text-[11px] font-bold text-amber-700 tracking-wider uppercase", children: "ជំហានទី ៣ (Step 3)" }),
                                e.jsx("h3", { className: "font-bold text-slate-900 text-base sm:text-lg", children: "រ៉ក (Pulley) - ទំព័រ ៩៥-៩៦" })
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => toggleSpeech(
                                "ជំហានទី ៣ ៖ រ៉ក ជាកង់មានចង្អូរ និងខ្សែ និងមានអ័ក្ស។ ផ្នែកសំខាន់ៗទាំង ៥ គឺ សម្ពាយ, កង់, អ័ក្ស, ខ្សែ, និងចង្អូរ។ រ៉កមាន ៣ ប្រភេទ ៖ រ៉កនឹង (កម្លាំងស្មើបន្ទុក, ប្តូរតែទិសកម្លាំង), រ៉កចល័ត (កម្លាំងស្មើបន្ទុកចែកពីរ), និងប្រព័ន្ធរ៉ក (កម្លាំងស្មើបន្ទុកចែកបួន)។ សន្និដ្ឋាន ៖ ក្នុងការប្រើរ៉ក គេអាចប្រែប្រួលកម្លាំងចលករ ប្រែប្រួលល្បឿន និងទិសនៃកម្លាំង។"
                              ),
                              className: "text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 cursor-pointer shadow-2xs",
                              children: [
                                e.jsx("span", { children: "🔊" }),
                                e.jsx("span", { children: "ស្ដាប់ពន្យល់" })
                              ]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => copySection("pulley"),
                              className: "text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer",
                              children: [
                                e.jsx("span", { children: "📄" }),
                                e.jsx("span", { children: "ចម្លង" })
                              ]
                            })
                          ]
                        })
                      ]
                    }),
                    e.jsxs("div", {
                      className: "p-6 space-y-6 text-sm text-slate-700 leading-relaxed",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsxs("h4", {
                              className: "font-bold text-slate-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" }),
                                e.jsx("span", { children: "ក. និយមន័យ និងផ្នែកសំខាន់ៗ" })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800",
                              children: [
                                e.jsx("strong", { children: "រ៉ក" }),
                                " គឺជាចង្អូរម៉្យាងធ្វើពីឈើ ឬលោហៈដែលមានចង្អូរជុំវិញសម្រាប់ដាក់ខ្សែពួរ ឬខ្សែលួសនិងមានប្រហោងមួយកាត់តាមផ្ចិតសម្រាប់ដាក់ស្នូលដែលគេហៅថា ",
                                e.jsx("strong", { children: "“អ័ក្ស”" }),
                                "។ អ័ក្សនេះអាចធ្វើឱ្យរ៉កចល័តជុំវិញដោយសេរីបាននិងភ្ជាប់ទៅនឹងដងកាមមួយ។"
                              ]
                            }),
                            e.jsxs("div", {
                              className: "grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs pt-1",
                              children: [
                                e.jsx("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-amber-700", children: "១. សម្ពាយ" }),
                                e.jsx("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-blue-700", children: "២. កង់" }),
                                e.jsx("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-emerald-700", children: "៣. អ័ក្ស" }),
                                e.jsx("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-purple-700", children: "៤. ខ្សែ" }),
                                e.jsx("div", { className: "p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-red-700 col-span-2 sm:col-span-1", children: "៥. ចង្អូរ" })
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("h4", {
                              className: "font-bold text-slate-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" }),
                                e.jsx("span", { children: "ខ. ប្រភេទរ៉ក និងរូបមន្តគណនា (ទំព័រ ៩៦)" })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "grid grid-cols-1 md:grid-cols-3 gap-3",
                              children: [
                                e.jsxs("div", {
                                  className: "bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2",
                                  children: [
                                    e.jsx("div", { className: "text-xs font-bold text-amber-700 uppercase", children: "១. រ៉កនឹង" }),
                                    e.jsx("p", { className: "text-xs text-slate-600", children: "មានរ៉កតែមួយ។ កម្លាំងចលករទាញចុះ ស្មើនឹងទម្ងន់បន្ទុកដែលយោងឡើង។" }),
                                    e.jsx("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-xs font-semibold text-amber-800", children: "កម្លាំងចលករ = ទម្ងន់បន្ទុក ÷ ១" })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2",
                                  children: [
                                    e.jsx("div", { className: "text-xs font-bold text-teal-700 uppercase", children: "២. រ៉កចល័ត (រ៉ក ២)" }),
                                    e.jsx("p", { className: "text-xs text-slate-600", children: "ផ្តុំពីរ៉ក ២ (រ៉កនឹង ១ និងរ៉កចល័ត ១)។ កម្លាំងចលករស្មើពាក់កណ្តាលទម្ងន់បន្ទុក។" }),
                                    e.jsx("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-xs font-semibold text-teal-800", children: "កម្លាំងចលករ = បន្ទុក ÷ ២" })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2",
                                  children: [
                                    e.jsx("div", { className: "text-xs font-bold text-emerald-700 uppercase", children: "៣. ប្រព័ន្ធរ៉ក (រ៉ក ៤)" }),
                                    e.jsx("p", { className: "text-xs text-slate-600", children: "ផ្តុំពីរ៉ក ៤ ឡើងទៅ។ កម្លាំងចលករស្មើមួយភាគបួននៃទម្ងន់បន្ទុក។" }),
                                    e.jsx("div", { className: "p-2.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-xs font-semibold text-emerald-800", children: "កម្លាំងចលករ = បន្ទុក ÷ ៤" })
                                  ]
                                })
                              ]
                            })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-xs sm:text-sm space-y-2",
                          children: [
                            e.jsxs("div", {
                              className: "font-bold text-emerald-900 flex items-center gap-2",
                              children: [
                                e.jsx("span", { children: "🏁" }),
                                e.jsx("span", { children: "សន្និដ្ឋានសំខាន់ចុងក្រោយ៖" })
                              ]
                            }),
                            e.jsxs("ul", {
                              className: "list-disc list-inside space-y-1 text-slate-700 text-xs",
                              children: [
                                e.jsx("li", { children: "ក្នុងការប្រើរ៉កនឹង គេគ្រាន់តែប្តូរទិសនៃកម្លាំងប៉ុណ្ោះ ប៉ុន្តែមិនចំណេញកម្លាំងចលករទេ។" }),
                                e.jsx("li", { children: "ក្នុងការប្រើរ៉កចល័ត និងប្រព័ន្ធរ៉ក គេចំណេញកម្លាំងចលករ ប្រែប្រួលទិសនៃកម្លាំង និងល្បឿន។" }),
                                e.jsx("li", { children: e.jsx("strong", { children: "ដូចនេះ ក្នុងការប្រើរ៉ក គេអាចប្រែប្រួលកម្លាំងចលករ ប្រែប្រួលល្បឿន និងទិសនៃកម្លាំង។" }) })
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

            // TAB 2: SIMULATION LAB
            activeTab === "simulation" && e.jsxs("section", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" }),
                                e.jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-emerald-600", children: "Interactive Physics Simulation" })
                              ]
                            }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-1", children: "ការពិសោធន៍ថាមវន្តម៉ាស៊ីនងាយ" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-500", children: "ផ្លាស់ប្តូរប៉ារ៉ាម៉ែត្រដើម្បីមើលការប្រែប្រួលទិសដៅ និងកម្លាំងជាក់ស្តែង" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-md w-full md:w-auto",
                          children: [
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => setSimMode("lever"),
                              className: "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer " + (simMode === "lever" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"),
                              children: [e.jsx("span", { children: "⚖️" }), e.jsx("span", { children: "១. ឃ្នាស់" })]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => setSimMode("plane"),
                              className: "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer " + (simMode === "plane" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"),
                              children: [e.jsx("span", { children: "📐" }), e.jsx("span", { children: "២. ប្លង់ទេរ" })]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => setSimMode("pulley"),
                              className: "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer " + (simMode === "pulley" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"),
                              children: [e.jsx("span", { children: "⚙️" }), e.jsx("span", { children: "៣. រ៉ក" })]
                            })
                          ]
                        })
                      ]
                    }),

                    // Canvas Container
                    e.jsxs("div", {
                      className: "mt-5 relative bg-slate-50/80 rounded-2xl border border-slate-200 overflow-hidden min-h-[290px]",
                      children: [
                        e.jsx("canvas", { ref: canvasRef, className: "w-full block " + (isFullscreen ? "h-[360px]" : "h-[290px]") }),
                        e.jsx("div", {
                          className: "absolute top-3 left-3 flex flex-wrap gap-2",
                          children: e.jsxs("div", {
                            className: "bg-white/95 border border-slate-200 px-3 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 text-emerald-700 font-semibold shadow-xs",
                            children: [
                              e.jsx("span", { children: "⚡" }),
                              e.jsx("span", {
                                children: simMode === 'pulley'
                                  ? (pulleyType === 1 ? "រ៉កនឹង៖ F = P" : pulleyType === 2 ? "រ៉កចល័ត៖ កម្លាំងថយ ៥០%" : "ប្រព័ន្ធរ៉ក៖ កម្លាំងថយ ៧៥%")
                                  : simMode === 'plane'
                                  ? ("ប្លង់ទេរ៖ L = " + planeLen + "m, H = 2m")
                                  : ("ឃ្នាស់៖ ដៃវែងជាង " + leverRatio + " ដង")
                              })
                            ]
                          })
                        }),
                        e.jsxs("div", {
                          className: "absolute bottom-3 right-3 flex items-center gap-2",
                          children: [
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => toggleSpeech(
                                simMode === 'pulley'
                                  ? ("ការពិសោធន៍រ៉ក។ ទម្ងន់បន្ទុក " + simLoad + " ញូតុន។ ប្រើរ៉កចំនួន " + pulleyType + "។ កម្លាំងចលករត្រូវប្រើគឺ " + effortVal + " ញូតុន។")
                                  : simMode === 'plane'
                                  ? ("ការពិសោធន៍ប្លង់ទេរ។ ទម្ងន់បន្ទុក " + simLoad + " ញូតុន។ ប្រវែងប្លង់ទេរ " + planeLen + " ម៉ែត្រ។ កម្លាំងចលករត្រូវប្រើគឺ " + effortVal + " ញូតុន។")
                                  : ("ការពិសោធន៍ឃ្នាស់។ ទម្ងន់បន្ទុក " + simLoad + " ញូតុន។ ដៃឃ្នាស់វែងជាង " + leverRatio + " ដង។ កម្លាំងចលករត្រូវប្រើគឺ " + effortVal + " ញូតុន។")
                              ),
                              className: "bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer",
                              children: [
                                e.jsx("span", { children: "🔊" }),
                                e.jsx("span", { children: "ស្ដាប់គណនា" })
                              ]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => setAnimActive(!animActive),
                              className: "bg-white/95 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-300 flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer",
                              children: [
                                e.jsx("span", { children: animActive ? "⏸️" : "▶️" }),
                                e.jsx("span", { children: animActive ? "ផ្អាក" : "បន្ត" })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // Sliders & Calculations
                    e.jsxs("div", {
                      className: "mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6",
                      children: [
                        e.jsxs("div", {
                          className: "lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between border-b border-slate-200 pb-2",
                              children: [
                                e.jsxs("h4", {
                                  className: "font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2",
                                  children: [e.jsx("span", { children: "🎛️" }), e.jsx("span", { children: "កែសម្រួលតម្លៃ (Sliders)" })]
                                }),
                                e.jsx("span", { className: "text-[11px] text-slate-500", children: "គិតជា ញូតុន (N)" })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                e.jsxs("div", {
                                  className: "flex justify-between text-xs font-medium text-slate-700",
                                  children: [
                                    e.jsx("span", { children: "ទម្ងន់បន្ទុក / កម្លាំងទប់ (P)៖" }),
                                    e.jsxs("span", { className: "font-mono font-bold text-amber-600 text-sm", children: [simLoad, " N"] })
                                  ]
                                }),
                                e.jsx("input", {
                                  type: "range",
                                  min: 20,
                                  max: 600,
                                  step: 20,
                                  value: simLoad,
                                  onChange: (evt) => setSimLoad(Number(evt.target.value)),
                                  className: "w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                }),
                                e.jsxs("div", {
                                  className: "flex justify-between text-[10px] text-slate-500 font-mono",
                                  children: [e.jsx("span", { children: "20 N (ស្រាល)" }), e.jsx("span", { children: "600 N (ធ្ងន់)" })]
                                })
                              ]
                            }),

                            // Mode Dynamic Control
                            simMode === "pulley" && e.jsxs("div", {
                              className: "space-y-1.5 pt-2 border-t border-slate-200",
                              children: [
                                e.jsxs("div", {
                                  className: "flex justify-between text-xs font-medium text-slate-700",
                                  children: [
                                    e.jsx("span", { children: "ប្រភេទរ៉ក / ចំនួនរ៉ក៖" }),
                                    e.jsx("span", {
                                      className: "font-mono font-bold text-emerald-600 text-sm",
                                      children: pulleyType === 1 ? "រ៉កនឹង (១)" : pulleyType === 2 ? "រ៉កចល័ត (២)" : "ប្រព័ន្ធរ៉ក (៤)"
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "grid grid-cols-3 gap-2 pt-1",
                                  children: [
                                    e.jsx("button", {
                                      type: "button",
                                      onClick: () => setPulleyType(1),
                                      className: "py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer " + (pulleyType === 1 ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"),
                                      children: "រ៉កនឹង (1)"
                                    }),
                                    e.jsx("button", {
                                      type: "button",
                                      onClick: () => setPulleyType(2),
                                      className: "py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer " + (pulleyType === 2 ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"),
                                      children: "រ៉កចល័ត (2)"
                                    }),
                                    e.jsx("button", {
                                      type: "button",
                                      onClick: () => setPulleyType(4),
                                      className: "py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer " + (pulleyType === 4 ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"),
                                      children: "ប្រព័ន្ធរ៉ក (4)"
                                    })
                                  ]
                                })
                              ]
                            }),

                            simMode === "plane" && e.jsxs("div", {
                              className: "space-y-1.5 pt-2 border-t border-slate-200",
                              children: [
                                e.jsxs("div", {
                                  className: "flex justify-between text-xs font-medium text-slate-700",
                                  children: [
                                    e.jsx("span", { children: "ប្រវែងប្លង់ទេរ (L)៖" }),
                                    e.jsxs("span", { className: "font-mono font-bold text-emerald-600 text-sm", children: [planeLen, " ម៉ែត្រ"] })
                                  ]
                                }),
                                e.jsx("input", {
                                  type: "range",
                                  min: 2,
                                  max: 10,
                                  step: 1,
                                  value: planeLen,
                                  onChange: (evt) => setPlaneLen(Number(evt.target.value)),
                                  className: "w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                }),
                                e.jsxs("div", {
                                  className: "flex justify-between text-[10px] text-slate-500 font-mono",
                                  children: [e.jsx("span", { children: "2m (ខ្លី)" }), e.jsx("span", { children: "10m (វែង)" })]
                                })
                              ]
                            }),

                            simMode === "lever" && e.jsxs("div", {
                              className: "space-y-1.5 pt-2 border-t border-slate-200",
                              children: [
                                e.jsxs("div", {
                                  className: "flex justify-between text-xs font-medium text-slate-700",
                                  children: [
                                    e.jsx("span", { children: "សមាមាត្រដៃឃ្នាស់ (ដៃចលករ/ដៃបន្ទុក)៖" }),
                                    e.jsxs("span", { className: "font-mono font-bold text-emerald-600 text-sm", children: [leverRatio, " ដង"] })
                                  ]
                                }),
                                e.jsx("input", {
                                  type: "range",
                                  min: 1,
                                  max: 5,
                                  step: 1,
                                  value: leverRatio,
                                  onChange: (evt) => setLeverRatio(Number(evt.target.value)),
                                  className: "w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                }),
                                e.jsxs("div", {
                                  className: "flex justify-between text-[10px] text-slate-500 font-mono",
                                  children: [e.jsx("span", { children: "1x (ស្មើដៃ)" }), e.jsx("span", { children: "5x (ដៃវែង ៥ ដង)" })]
                                })
                              ]
                            })
                          ]
                        }),

                        // Results Column
                        e.jsxs("div", {
                          className: "lg:col-span-7 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200 flex flex-col justify-between shadow-2xs",
                          children: [
                            e.jsxs("div", {
                              className: "space-y-4",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center justify-between",
                                  children: [
                                    e.jsxs("span", {
                                      className: "text-xs uppercase tracking-widest font-bold text-emerald-800 flex items-center gap-1.5",
                                      children: [e.jsx("span", { children: "🧮" }), e.jsx("span", { children: "ការគណនារូបមន្តជាក់ស្តែង" })]
                                    }),
                                    e.jsx("span", {
                                      className: "text-[11px] font-mono bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md shadow-2xs",
                                      children: simMode === 'pulley' ? "រូបមន្តរ៉ក (ទំព័រ ៩៦)" : simMode === 'plane' ? "រូបមន្តប្លង់ទេរ (ទំព័រ ៩៤)" : "រូបមន្តឃ្នាស់ (ទំព័រ ៩២)"
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "flex flex-wrap items-baseline gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs",
                                  children: [
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx("div", { className: "text-[11px] text-slate-500 mb-0.5", children: "កម្លាំងចលករត្រូវប្រើ (F)៖" }),
                                        e.jsxs("div", { className: "text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600", children: [effortVal, " N"] })
                                      ]
                                    }),
                                    e.jsxs("div", {
                                      className: "border-l border-slate-200 pl-4",
                                      children: [
                                        e.jsx("div", { className: "text-[11px] text-slate-500 mb-0.5", children: "ប្រសិទ្ធភាពចំណេញកម្លាំង៖" }),
                                        e.jsx("div", {
                                          className: "text-sm sm:text-base font-bold text-teal-700",
                                          children: simMode === 'pulley'
                                            ? (pulleyType === 1 ? "មិនចំណេញកម្លាំង (១០០%)" : pulleyType === 2 ? "ចំណេញកម្លាំង ២ ដង (៥០%)" : "ចំណេញកម្លាំង ៤ ដង (២៥%)")
                                            : simMode === 'plane'
                                            ? ("កម្លាំងថយមកសល់ " + Math.round((effortVal / simLoad) * 100) + "%")
                                            : ("ចំណេញកម្លាំង " + leverRatio + " ដង (" + Math.round((effortVal / simLoad) * 100) + "%)")
                                        })
                                      ]
                                    })
                                  ]
                                }),
                                e.jsxs("div", {
                                  className: "bg-white p-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1.5 shadow-2xs",
                                  children: [
                                    e.jsx("div", { className: "text-slate-500 text-[11px]", children: "ដំណើរការគណនា៖" }),
                                    e.jsx("div", {
                                      className: "text-emerald-700 font-semibold text-sm",
                                      children: simMode === 'pulley'
                                        ? ("F = P ÷ " + pulleyType + " (ចំនួនរ៉ក)")
                                        : simMode === 'plane'
                                        ? "F = (P × កម្ពស់ H) ÷ ប្រវែងប្លង់ទេរ L"
                                        : "F = P ÷ (ប្រវែងដៃចលករ / ដៃបន្ទុក)"
                                    }),
                                    e.jsx("div", {
                                      className: "text-slate-600",
                                      children: simMode === 'pulley'
                                        ? ("F = " + simLoad + " N ÷ " + pulleyType + " = " + effortVal + " N")
                                        : simMode === 'plane'
                                        ? ("F = (" + simLoad + " N × 2m) ÷ " + planeLen + "m = " + effortVal + " N")
                                        : ("F = " + simLoad + " N ÷ " + leverRatio + " = " + effortVal + " N")
                                    })
                                  ]
                                })
                              ]
                            }),
                            e.jsxs("div", {
                              className: "mt-4 pt-3 border-t border-emerald-200/60 flex items-start gap-2.5 text-xs text-slate-700",
                              children: [
                                e.jsx("span", { className: "text-emerald-600 font-bold", children: "✓" }),
                                e.jsx("div", {
                                  children: simMode === 'pulley'
                                    ? "ក្នុងការប្រើរ៉ក គេអាចប្រែប្រួលកម្លាំងចលករ ប្រែប្រួលល្បឿន និងទិសនៃកម្លាំង។"
                                    : simMode === 'plane'
                                    ? "បើប្រវែងប្លង់ទេរកាន់តែវែង កម្លាំងចលករកាន់តែតូច។"
                                    : "បើប្រវែងដៃឃ្នាស់កម្លាំងចលករកាន់តែវែង កម្លាំងចលករកាន់តែតូច។"
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

            // TAB 3: COMPLETE 40-QUESTION QCM
            activeTab === "quiz" && e.jsxs("section", {
              className: "space-y-6 animate-fadeIn",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-5",
                  children: [
                    // Header with score & progression
                    e.jsxs("div", {
                      className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" }),
                                e.jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-emerald-700", children: "Step-by-Step QCM (៤០ សំណួរ)" })
                              ]
                            }),
                            e.jsx("h2", { className: "text-xl sm:text-2xl font-bold text-slate-900 mt-1", children: "កម្រងសំណួរពហុជ្រើសរើស ម្ដងមួយសំណួរ" }),
                            e.jsx("p", { className: "text-xs sm:text-sm text-slate-500", children: "ចម្លើយនីមួយៗមានការពន្យល់ក្បោះក្បាយ និងជម្រើសវិភាគស៊ីជម្រៅ" })
                          ]
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 shrink-0",
                          children: [
                            e.jsx("span", { className: "text-2xl", children: "🎓" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("div", { className: "text-[10px] text-slate-500 font-medium", children: "សំណួរទី / ពិន្ទុបច្ចុប្បន្ន" }),
                                e.jsxs("div", {
                                  className: "text-base font-bold font-mono text-slate-900",
                                  children: [
                                    e.jsx("span", { className: "text-emerald-600", children: currentQIndex + 1 }),
                                    " / ៤០ ",
                                    e.jsx("span", { className: "text-slate-300 mx-1", children: "|" }),
                                    " ",
                                    e.jsx("span", { className: "text-xs font-normal text-slate-500", children: "ត្រូវ: " }),
                                    e.jsx("span", { className: "text-emerald-700", children: getScore() })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    // Progress bar
                    e.jsx("div", {
                      className: "w-full bg-slate-100 rounded-full h-2.5 overflow-hidden",
                      children: e.jsx("div", {
                        className: "bg-emerald-600 h-2.5 rounded-full transition-all duration-300",
                        style: { width: ((currentQIndex + 1) / qcmList.length * 100) + "%" }
                      })
                    }),

                    // Current Question Card
                    currentQ && e.jsxs("div", {
                      className: "p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs transition-all",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between gap-2 border-b border-slate-100 pb-3",
                          children: [
                            e.jsx("div", {
                              children: currentQ.cat === 'lever'
                                ? e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200", children: "១. ឃ្នាស់ (ទំព័រ ៩២-៩៣)" })
                                : currentQ.cat === 'plane'
                                ? e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200", children: "២. ប្លង់ទេរ (ទំព័រ ៩៣-៩៤)" })
                                : e.jsx("span", { className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200", children: "៣. រ៉ក (ទំព័រ ៩៥-៩៦)" })
                            }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsxs("button", {
                                  type: "button",
                                  onClick: () => toggleSpeech(currentQAudioText),
                                  className: "text-xs px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 flex items-center gap-1 cursor-pointer transition",
                                  children: [
                                    e.jsx("span", { children: "🔊" }),
                                    e.jsx("span", { children: "ស្ដាប់សំណួរ" })
                                  ]
                                }),
                                e.jsxs("span", { className: "text-xs font-mono font-semibold text-slate-500", children: ["សំណួរ ", currentQIndex + 1, " នៃ ៤០"] })
                              ]
                            })
                          ]
                        }),

                        e.jsx("div", { className: "text-slate-900 font-semibold text-sm sm:text-base leading-relaxed", children: currentQ.q }),

                        e.jsx("div", {
                          className: "space-y-2.5 pt-2",
                          children: currentQ.options.map((optText, optIdx) => {
                            let btnStyle = "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700";
                            let iconState = null;

                            if (hasAnswered) {
                              if (optIdx === currentQ.correct) {
                                btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-400";
                                iconState = e.jsx("span", { className: "text-emerald-600 ml-auto shrink-0 font-bold", children: "✓" });
                              } else if (selectedOpt === optIdx) {
                                btnStyle = "border-rose-400 bg-rose-50 text-rose-950 font-semibold shadow-xs ring-1 ring-rose-300";
                                iconState = e.jsx("span", { className: "text-rose-600 ml-auto shrink-0 font-bold", children: "✕" });
                              } else {
                                btnStyle = "border-slate-200 bg-white text-slate-400 opacity-60";
                              }
                            }

                            return e.jsxs("button", {
                              type: "button",
                              onClick: () => handleSelectAnswer(optIdx),
                              className: "w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition duration-150 active:scale-[0.99] flex items-start gap-3 cursor-pointer " + btnStyle,
                              children: [
                                e.jsx("span", {
                                  className: "font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 shrink-0 text-slate-800",
                                  children: ['ក.', 'ខ.', 'គ.', 'ឃ.'][optIdx]
                                }),
                                e.jsx("span", { className: "flex-grow pt-0.5", children: optText }),
                                iconState
                              ]
                            }, optIdx);
                          })
                        }),

                        // Explanation Box
                        hasAnswered && e.jsx("div", {
                          className: "text-xs sm:text-sm p-4 rounded-xl " + (selectedOpt === currentQ.correct ? "bg-emerald-50 border border-emerald-200 text-emerald-950" : "bg-rose-50 border border-rose-200 text-rose-950"),
                          children: selectedOpt === currentQ.correct
                            ? e.jsxs("div", {
                                className: "flex items-start justify-between gap-2",
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-start gap-2.5",
                                    children: [
                                      e.jsx("span", { className: "text-emerald-600 font-bold text-base", children: "✓" }),
                                      e.jsxs("div", { children: [e.jsx("strong", { children: "ចម្លើយត្រឹមត្រូវ! " }), currentQ.exp] })
                                    ]
                                  }),
                                  e.jsxs("button", {
                                    type: "button",
                                    onClick: () => toggleSpeech("ចម្លើយត្រឹមត្រូវ! " + currentQ.exp),
                                    className: "px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 shrink-0 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                                  })
                                ]
                              })
                            : e.jsxs("div", {
                                className: "flex items-start justify-between gap-2",
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-start gap-2.5",
                                    children: [
                                      e.jsx("span", { className: "text-rose-600 font-bold text-base", children: "✕" }),
                                      e.jsxs("div", { children: [e.jsx("strong", { children: "ចម្លើយមិនទាន់ត្រឹមត្រូវទេ! " }), currentQ.exp] })
                                    ]
                                  }),
                                  e.jsxs("button", {
                                    type: "button",
                                    onClick: () => toggleSpeech("ចម្លើយមិនទាន់ត្រឹមត្រូវទេ! " + currentQ.exp),
                                    className: "px-2 py-1 bg-white hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-300 shrink-0 cursor-pointer",
                                    children: [e.jsx("span", { children: "🔊" }), " ស្ដាប់ពន្យល់"]
                                  })
                                ]
                              })
                        })
                      ]
                    }),

                    // Navigation Controls
                    e.jsxs("div", {
                      className: "pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsxs("button", {
                              type: "button",
                              disabled: currentQIndex === 0,
                              onClick: () => setCurrentQIndex(prev => Math.max(0, prev - 1)),
                              className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
                              children: [e.jsx("span", { children: "◄" }), e.jsx("span", { children: "សំណួរមុន" })]
                            }),
                            e.jsxs("button", {
                              type: "button",
                              disabled: currentQIndex === qcmList.length - 1,
                              onClick: () => setCurrentQIndex(prev => Math.min(qcmList.length - 1, prev + 1)),
                              className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
                              children: [e.jsx("span", { children: "សំណួរបន្ទាប់" }), e.jsx("span", { children: "►" })]
                            })
                          ]
                        }),
                        e.jsx("div", {
                          className: "flex items-center gap-2",
                          children: e.jsxs("button", {
                            type: "button",
                            onClick: () => { setUserAnswers({}); setCurrentQIndex(0); },
                            className: "px-3.5 py-2 bg-white hover:bg-slate-50 active:scale-95 text-rose-600 text-xs font-semibold rounded-xl transition border border-rose-200 flex items-center gap-1.5 shadow-2xs cursor-pointer",
                            children: [e.jsx("span", { children: "🔄" }), e.jsx("span", { children: "ចាប់ផ្តើមឡើងវិញ" })]
                          })
                        })
                      ]
                    }),

                    // Quick Jump Grid 1 - 40
                    e.jsxs("div", {
                      className: "pt-5 border-t border-slate-100 space-y-2",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between",
                          children: [
                            e.jsx("span", { className: "text-xs font-semibold text-slate-600", children: "រំលងទៅកាន់សំណួរជាក់លាក់៖" }),
                            e.jsxs("div", {
                              className: "flex items-center gap-3 text-[11px] text-slate-500",
                              children: [
                                e.jsxs("span", { className: "flex items-center gap-1", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" }), " ត្រូវ"] }),
                                e.jsxs("span", { className: "flex items-center gap-1", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" }), " ខុស"] }),
                                e.jsxs("span", { className: "flex items-center gap-1", children: [e.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" }), " មិនទាន់ឆ្លើយ"] })
                              ]
                            })
                          ]
                        }),
                        e.jsx("div", {
                          className: "grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5",
                          children: qcmList.map((item, idx) => {
                            const ans = userAnswers[idx];
                            let bg = "bg-slate-100 text-slate-700 hover:bg-slate-200";
                            let ring = (idx === currentQIndex) ? "ring-2 ring-emerald-500 font-bold" : "";

                            if (ans !== undefined) {
                              if (ans === item.correct) {
                                bg = "bg-emerald-600 text-white font-semibold";
                              } else {
                                bg = "bg-rose-500 text-white font-semibold";
                              }
                            }

                            return e.jsx("button", {
                              type: "button",
                              onClick: () => setCurrentQIndex(idx),
                              className: "w-full py-1.5 rounded-lg text-xs font-mono transition text-center cursor-pointer " + bg + " " + ring,
                              children: idx + 1
                            }, idx);
                          })
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
};`;

try {
  esbuild.transformSync(componentSource, { loader: "js" });
  console.log("ESBUILD VALIDATION SUCCESS: Rz14 component passes syntax check!");
  fs.writeFileSync('scripts/rz14_component_code.js', componentSource, 'utf8');
  console.log("Written scripts/rz14_component_code.js successfully.");
} catch (err) {
  console.error("Syntax error in componentSource:", err.message);
  process.exit(1);
}
