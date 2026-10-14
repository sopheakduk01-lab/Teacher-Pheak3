import { MathQCMQuestion, MathFormulaSection } from '../mathQcmTypes';

export const LESSON_12_QUESTIONS: MathQCMQuestion[] = [
  {
    "id": 1,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "និយមន័យផលធៀប",
    "question": "ផលធៀបនៃពីរចំនួន a និង b (ដែល b ≠ 0) អាចសរសេរជា ៖",
    "options": [
      {
        "text": "a - b ឬ b - a",
        "isCorrect": false
      },
      {
        "text": "a × b ឬ a + b",
        "isCorrect": false
      },
      {
        "text": "a/b ឬ a : b (អានថា a ធៀបនឹង b)",
        "isCorrect": true
      },
      {
        "text": "a + b / 2",
        "isCorrect": false
      }
    ],
    "explanation": "និយមន័យ ៖ ផលធៀបនៃពីរចំនួន a និង b (b ≠ 0) គឺ a/b ឬ a : b (អានថា a ធៀបនឹង b)។",
    "points": 1
  },
  {
    "id": 2,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "ការសរសេរផលធៀបវត្ថុ",
    "question": "ក្នុងបន្ទប់មួយមានតុ 1 សម្រាប់សិស្ស 2 នាក់។ តើផលធៀបតុធៀបនឹងសិស្សគឺប៉ុន្មាន?",
    "options": [
      {
        "text": "1 : 2 ឬ 1/2",
        "isCorrect": true
      },
      {
        "text": "2 : 1 ឬ 2/1",
        "isCorrect": false
      },
      {
        "text": "1 : 3 ឬ 1/3",
        "isCorrect": false
      },
      {
        "text": "2 : 3",
        "isCorrect": false
      }
    ],
    "explanation": "ផលធៀបចំនួនតុធៀបនឹងចំនួនសិស្ស គឺ 1/2 ឬ 1 : 2។",
    "points": 1
  },
  {
    "id": 3,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "ការសរសេរផលធៀបសិស្ស",
    "question": "ក្នុងថ្នាក់មួយមានសិស្សស្រី 24 នាក់ និងសិស្សប្រុស 16 នាក់។ ផលធៀបសិស្សស្រីធៀបនឹងសិស្សប្រុសសម្រួលរួចគឺ ៖",
    "options": [
      {
        "text": "2/3 ឬ 2 : 3",
        "isCorrect": false
      },
      {
        "text": "3/2 ឬ 3 : 2",
        "isCorrect": true
      },
      {
        "text": "4/3 ឬ 4 : 3",
        "isCorrect": false
      },
      {
        "text": "24/16",
        "isCorrect": false
      }
    ],
    "explanation": "ផលធៀបសិស្សស្រីធៀបនឹងសិស្សប្រុស គឺ 24/16 = (24÷8)/(16÷8) = 3/2 ឬ 3 : 2។",
    "points": 1
  },
  {
    "id": 4,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "ផលធៀបសិស្សធៀបនឹងសរុប",
    "question": "ពីសំណួរទី៣ ខាងលើ តើផលធៀបសិស្សស្រីធៀបនឹងសិស្សសរុបក្នុងថ្នាក់ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "24/40",
        "isCorrect": false
      },
      {
        "text": "2/5",
        "isCorrect": false
      },
      {
        "text": "3/2",
        "isCorrect": false
      },
      {
        "text": "3/5",
        "isCorrect": true
      }
    ],
    "explanation": "សិស្សសរុប = 24 + 16 = 40 នាក់។ ផលធៀបស្រីធៀបនឹងសរុប គឺ 24/40 = 3/5 (សម្រួលនឹង 8)។",
    "points": 1
  },
  {
    "id": 5,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "ផលធៀបសិស្សប្រុសធៀបនឹងសរុប",
    "question": "ពីសំណួរទី៣ តើផលធៀបសិស្សប្រុសធៀបនឹងសិស្សសរុបក្នុងថ្នាក់ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "2/5",
        "isCorrect": true
      },
      {
        "text": "3/5",
        "isCorrect": false
      },
      {
        "text": "2/3",
        "isCorrect": false
      },
      {
        "text": "16/40",
        "isCorrect": false
      }
    ],
    "explanation": "ផលធៀបប្រុសធៀបនឹងសរុប គឺ 16/40 = 2/5 (សម្រួលនឹង 8)។",
    "points": 1
  },
  {
    "id": 6,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "អំណានផលធៀប",
    "question": "កន្សោម «4 : 7» អានថាដូចម្តេច?",
    "options": [
      {
        "text": "ប្រាំពីរធៀបនឹងបួន",
        "isCorrect": false
      },
      {
        "text": "បួនចែកនឹងប្រាំពីរ",
        "isCorrect": false
      },
      {
        "text": "បួនធៀបនឹងប្រាំពីរ",
        "isCorrect": true
      },
      {
        "text": "បួនភាគប្រាំពីរគត់",
        "isCorrect": false
      }
    ],
    "explanation": "និមិត្តសញ្ញា «a : b» អានថា «a ធៀបនឹង b» ដូច្នេះ 4 : 7 អានថា «បួនធៀបនឹងប្រាំពីរ»។",
    "points": 1
  },
  {
    "id": 7,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "ផលធៀបស្មើគ្នា",
    "question": "តើផលធៀបណាស្មើនឹងផលធៀប 3 : 5?",
    "options": [
      {
        "text": "12 : 15",
        "isCorrect": false
      },
      {
        "text": "5 : 3",
        "isCorrect": false
      },
      {
        "text": "9 : 20",
        "isCorrect": false
      },
      {
        "text": "6 : 10",
        "isCorrect": true
      }
    ],
    "explanation": "3/5 = (3 × 2) / (5 × 2) = 6/10 ដូច្នេះ 3 : 5 = 6 : 10។",
    "points": 1
  },
  {
    "id": 8,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "ផលធៀបស្មើគ្នា",
    "question": "តើផលធៀបណាស្មើនឹង 12 : 18?",
    "options": [
      {
        "text": "3 : 2",
        "isCorrect": false
      },
      {
        "text": "2 : 3",
        "isCorrect": true
      },
      {
        "text": "4 : 5",
        "isCorrect": false
      },
      {
        "text": "6 : 8",
        "isCorrect": false
      }
    ],
    "explanation": "12/18 = (12 ÷ 6) / (18 ÷ 6) = 2/3 ឬ 2 : 3។",
    "points": 1
  },
  {
    "id": 9,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "តួនៃផលធៀប",
    "question": "ក្នុងផលធៀប a : b តើ a ហៅថាអ្វី ហើយ b ហៅថាអ្វី?",
    "options": [
      {
        "text": "a ជាភាគបែង និង b ជាភាគយក",
        "isCorrect": false
      },
      {
        "text": "a ជាតួទី១ (Antecedent) និង b ជាតួទី២ (Consequent)",
        "isCorrect": true
      },
      {
        "text": "a ជាផលចែក និង b ជាតួចែក",
        "isCorrect": false
      },
      {
        "text": "a ជាមេគុណ និង b ជាសំណល់",
        "isCorrect": false
      }
    ],
    "explanation": "ក្នុងផលធៀប a : b ឬ a/b ចំនួន a ហៅថា តួទី១ ហើយ b ហៅថា តួទី២។",
    "points": 1
  },
  {
    "id": 10,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការសរសេរផលធៀប",
    "partSubtitle": "លក្ខណៈឯកតានៃផលធៀប",
    "question": "នៅពេលគណនាផលធៀបរវាងទំហំពីរដែលមានឯកតាដូចគ្នា តើផលធៀបនោះមានឯកតាដែរឬទេ?",
    "options": [
      {
        "text": "អាស្រ័យលើទំហំធំ ឬតូច",
        "isCorrect": false
      },
      {
        "text": "មានឯកតាដដែល",
        "isCorrect": false
      },
      {
        "text": "មានឯកតាការេ",
        "isCorrect": false
      },
      {
        "text": "គ្មានឯកតាទេ ព្រោះឯកតាសម្រួលអស់",
        "isCorrect": true
      }
    ],
    "explanation": "ផលធៀបរវាងទំហំមានឯកតាដូចគ្នា គឺគ្មានឯកតាទេ ពីព្រោះឯកតាទាំងពីរត្រូវបានសម្រួលអស់។",
    "points": 1
  },
  {
    "id": 11,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបរង្វាស់ប្រវែង cm",
    "question": "ផលធៀបសម្រួលរួចរវាង 15 cm និង 25 cm គឺ ៖",
    "options": [
      {
        "text": "3/5",
        "isCorrect": true
      },
      {
        "text": "5/3",
        "isCorrect": false
      },
      {
        "text": "3/5 cm",
        "isCorrect": false
      },
      {
        "text": "15/25",
        "isCorrect": false
      }
    ],
    "explanation": "15 cm / 25 cm = 15/25 = 3/5 (សម្រួលនឹង 5) គ្មានឯកតាទេ។",
    "points": 1
  },
  {
    "id": 12,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបរង្វាស់ពេល នាទី និង ម៉ោង",
    "question": "ផលធៀបរវាង 40 នាទី និង 2 ម៉ោង សម្រួលរួចគឺ ៖",
    "options": [
      {
        "text": "40/2",
        "isCorrect": false
      },
      {
        "text": "20/1",
        "isCorrect": false
      },
      {
        "text": "1/3",
        "isCorrect": true
      },
      {
        "text": "1/2",
        "isCorrect": false
      }
    ],
    "explanation": "ត្រូវប្តូរ 2 ម៉ោង = 120 នាទី។ ផលធៀប = 40 នាទី / 120 នាទី = 40/120 = 1/3។",
    "points": 1
  },
  {
    "id": 13,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបម៉ាស g និង kg",
    "question": "ផលធៀបរវាង 500 g និង 2 kg សម្រួលរួចគឺ ៖",
    "options": [
      {
        "text": "1/5",
        "isCorrect": false
      },
      {
        "text": "250/1",
        "isCorrect": false
      },
      {
        "text": "1/2",
        "isCorrect": false
      },
      {
        "text": "1/4",
        "isCorrect": true
      }
    ],
    "explanation": "2 kg = 2000 g។ ផលធៀប = 500 g / 2000 g = 500/2000 = 1/4។",
    "points": 1
  },
  {
    "id": 14,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបប្រវែង m និង km",
    "question": "ផលធៀបរវាង 250 m និង 1.5 km សម្រួលរួចគឺ ៖",
    "options": [
      {
        "text": "1/5",
        "isCorrect": false
      },
      {
        "text": "1/6",
        "isCorrect": true
      },
      {
        "text": "25/15",
        "isCorrect": false
      },
      {
        "text": "5/3",
        "isCorrect": false
      }
    ],
    "explanation": "1.5 km = 1500 m។ ផលធៀប = 250 / 1500 = 25/150 = 1/6។",
    "points": 1
  },
  {
    "id": 15,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបចំណុះ ml និង l",
    "question": "ផលធៀបរវាង 750 ml និង 1 លីត្រ ស្មើនឹង ៖",
    "options": [
      {
        "text": "1/2",
        "isCorrect": false
      },
      {
        "text": "75/10",
        "isCorrect": false
      },
      {
        "text": "3/4",
        "isCorrect": true
      },
      {
        "text": "2/3",
        "isCorrect": false
      }
    ],
    "explanation": "1 លីត្រ = 1000 ml។ ផលធៀប = 750 / 1000 = 3/4។",
    "points": 1
  },
  {
    "id": 16,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបរង្វាស់ប្រាក់",
    "question": "ផលធៀបរវាង 1500 រៀល និង 6000 រៀល សម្រួលរួចគឺ ៖",
    "options": [
      {
        "text": "1/4",
        "isCorrect": true
      },
      {
        "text": "1/3",
        "isCorrect": false
      },
      {
        "text": "1/5",
        "isCorrect": false
      },
      {
        "text": "15/60",
        "isCorrect": false
      }
    ],
    "explanation": "1500 / 6000 = 15/60 = 1/4។",
    "points": 1
  },
  {
    "id": 17,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបប្រវែង dm និង m",
    "question": "ផលធៀបរវាង 8 dm និង 2 m គឺ ៖",
    "options": [
      {
        "text": "1/2",
        "isCorrect": false
      },
      {
        "text": "4/1",
        "isCorrect": false
      },
      {
        "text": "2/5",
        "isCorrect": true
      },
      {
        "text": "4/5",
        "isCorrect": false
      }
    ],
    "explanation": "2 m = 20 dm។ ផលធៀប = 8 / 20 = 2/5 (សម្រួលនឹង 4)។",
    "points": 1
  },
  {
    "id": 18,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបវិនាទី និង នាទី",
    "question": "ផលធៀបរវាង 45 វិនាទី និង 3 នាទី គឺ ៖",
    "options": [
      {
        "text": "3/4",
        "isCorrect": false
      },
      {
        "text": "15/1",
        "isCorrect": false
      },
      {
        "text": "1/3",
        "isCorrect": false
      },
      {
        "text": "1/4",
        "isCorrect": true
      }
    ],
    "explanation": "3 នាទី = 180 វិនាទី។ ផលធៀប = 45 / 180 = 1/4 (សម្រួលនឹង 45)។",
    "points": 1
  },
  {
    "id": 19,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបទម្ងន់ kg និង t (តោន)",
    "question": "ផលធៀបរវាង 200 kg និង 1 តោន គឺ ៖",
    "options": [
      {
        "text": "200/1",
        "isCorrect": false
      },
      {
        "text": "1/5",
        "isCorrect": true
      },
      {
        "text": "1/4",
        "isCorrect": false
      },
      {
        "text": "1/10",
        "isCorrect": false
      }
    ],
    "explanation": "1 តោន = 1000 kg។ ផលធៀប = 200 / 1000 = 1/5។",
    "points": 1
  },
  {
    "id": 20,
    "part": "ផ្នែកទី២ ៖ ផលធៀបនៃទំហំមានឯកតាដូចគ្នា (សម្រួលឯកតា)",
    "partSubtitle": "ផលធៀបចំនួនថ្ងៃ និង សប្តាហ៍",
    "question": "ផលធៀបរវាង 3 ថ្ងៃ និង 2 សប្តាហ៍ គឺ ៖",
    "options": [
      {
        "text": "3/14",
        "isCorrect": true
      },
      {
        "text": "3/2",
        "isCorrect": false
      },
      {
        "text": "1/7",
        "isCorrect": false
      },
      {
        "text": "3/7",
        "isCorrect": false
      }
    ],
    "explanation": "2 សប្តាហ៍ = 14 ថ្ងៃ។ ផលធៀប = 3 / 14។",
    "points": 1
  },
  {
    "id": 21,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "និយមន័យផលធៀបឯកតាខុសគ្នា",
    "question": "នៅពេលគណនាផលធៀបរវាងទំហំពីរដែលមានឯកតាខុសគ្នា តើផលធៀបនោះមានលក្ខណៈដូចម្តេច?",
    "options": [
      {
        "text": "ត្រូវតែមានឯកតាជាភាគរយ",
        "isCorrect": false
      },
      {
        "text": "ផលធៀបគ្មានឯកតាទេ",
        "isCorrect": false
      },
      {
        "text": "មិនអាចគណនាបានដាច់ខាត",
        "isCorrect": false
      },
      {
        "text": "ផលធៀបមានឯកតាផ្សំ (ឧ. km/h, នាក់/km²)",
        "isCorrect": true
      }
    ],
    "explanation": "ផលធៀបនៃទំហំមានឯកតាខុសគ្នា បង្កើតបានជាទំហំថ្មីដែលមាន «ឯកតាផ្សំ» ដូចជា ល្បឿន (km/h) ឬដង់ស៊ីតេ (នាក់/km²)។",
    "points": 1
  },
  {
    "id": 22,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "គណនាល្បឿនមធ្យម",
    "question": "ម៉ូតូមួយជិះបានចម្ងាយ 90 km ក្នុងពេល 2 ម៉ោង។ តើផលធៀបចម្ងាយធៀបនឹងពេលស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "45 km/h",
        "isCorrect": true
      },
      {
        "text": "90 km/h",
        "isCorrect": false
      },
      {
        "text": "180 km/h",
        "isCorrect": false
      },
      {
        "text": "45",
        "isCorrect": false
      }
    ],
    "explanation": "ផលធៀប = 90 km / 2 h = 45 km/h (ជាល្បឿនមធ្យម)។",
    "points": 1
  },
  {
    "id": 23,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "គណនាដង់ស៊ីតេប្រជាជន",
    "question": "ស្រុកមួយមានប្រជាជន 60 000 នាក់ រស់នៅលើផ្ទៃដី 120 km²។ តើដង់ស៊ីតេប្រជាជនស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "5000 នាក់/km²",
        "isCorrect": false
      },
      {
        "text": "50 នាក់/km²",
        "isCorrect": false
      },
      {
        "text": "500 នាក់/km²",
        "isCorrect": true
      },
      {
        "text": "200 នាក់/km²",
        "isCorrect": false
      }
    ],
    "explanation": "ដង់ស៊ីតេ = 60 000 នាក់ / 120 km² = 500 នាក់/km²។",
    "points": 1
  },
  {
    "id": 24,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "គណនាតម្លៃឯកតា",
    "question": "ទិញសៀវភៅ 5 ក្បាលអស់ប្រាក់ 15 000 រៀល។ តើតម្លៃឯកតាក្នុងមួយក្បាលគឺប៉ុន្មាន?",
    "options": [
      {
        "text": "2500 រៀល/ក្បាល",
        "isCorrect": false
      },
      {
        "text": "3000 រៀល/ក្បាល",
        "isCorrect": true
      },
      {
        "text": "3500 រៀល/ក្បាល",
        "isCorrect": false
      },
      {
        "text": "75 000 រៀល/ក្បាល",
        "isCorrect": false
      }
    ],
    "explanation": "តម្លៃឯកតា = 15 000 រៀល / 5 ក្បាល = 3000 រៀល/ក្បាល។",
    "points": 1
  },
  {
    "id": 25,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "គណនាទិន្នផលស្រូវ",
    "question": "ដីស្រែទំហំ 2 ហិកតា (ha) ប្រមូលផលស្រូវបាន 8 តោន។ តើទិន្នផលស្រូវគិតជាតោន/ha ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "4 តោន/ha",
        "isCorrect": true
      },
      {
        "text": "16 តោន/ha",
        "isCorrect": false
      },
      {
        "text": "2 តោន/ha",
        "isCorrect": false
      },
      {
        "text": "6 តោន/ha",
        "isCorrect": false
      }
    ],
    "explanation": "ទិន្នផល = 8 តោន / 2 ha = 4 តោន/ha។",
    "points": 1
  },
  {
    "id": 26,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "អត្រាប្រើប្រាស់ប្រេងឥន្ធនៈ",
    "question": "រថយន្តមួយបើកបរបានចម្ងាយ 300 km ដោយប្រើប្រេងអស់ 25 លីត្រ។ តើអត្រាប្រើប្រាស់ប្រេងគិតជា km/l ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "10 km/l",
        "isCorrect": false
      },
      {
        "text": "12 km/l",
        "isCorrect": true
      },
      {
        "text": "15 km/l",
        "isCorrect": false
      },
      {
        "text": "8 km/l",
        "isCorrect": false
      }
    ],
    "explanation": "អត្រា = 300 km / 25 l = 12 km/l។",
    "points": 1
  },
  {
    "id": 27,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "ប្រាក់ឈ្នួលពលកម្ម",
    "question": "ជាងសំណង់ម្នាក់ធ្វើការ 8 ម៉ោង ទទួលបានប្រាក់ឈ្នួល 64 000 រៀល។ តើប្រាក់ឈ្នួលក្នុង 1 ម៉ោងស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "6400 រៀល/ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "7000 រៀល/ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "9000 រៀល/ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "8000 រៀល/ម៉ោង",
        "isCorrect": true
      }
    ],
    "explanation": "ប្រាក់ឈ្នួល = 64 000 រៀល / 8 ម៉ោង = 8000 រៀល/ម៉ោង។",
    "points": 1
  },
  {
    "id": 28,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "ល្បឿនបូមទឹក",
    "question": "ម៉ាស៊ីនបូមទឹកមួយអាចបូមទឹកបាន 1800 លីត្រ ក្នុងរយៈពេល 30 នាទី។ តើល្បឿនបូមគិតជាលីត្រ/នាទី ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "600 លីត្រ/នាទី",
        "isCorrect": false
      },
      {
        "text": "50 លីត្រ/នាទី",
        "isCorrect": false
      },
      {
        "text": "60 លីត្រ/នាទី",
        "isCorrect": true
      },
      {
        "text": "90 លីត្រ/នាទី",
        "isCorrect": false
      }
    ],
    "explanation": "ល្បឿន = 1800 លីត្រ / 30 នាទី = 60 លីត្រ/នាទី។",
    "points": 1
  },
  {
    "id": 29,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "ល្បឿនវាយអត្ថបទ",
    "question": "កញ្ញាម្នាក់វាយពាក្យបាន 450 ពាក្យក្នុងរយៈពេល 10 នាទី។ តើល្បឿនវាយគិតជាពាក្យ/នាទី ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "40 ពាក្យ/នាទី",
        "isCorrect": false
      },
      {
        "text": "45 ពាក្យ/នាទី",
        "isCorrect": true
      },
      {
        "text": "50 ពាក្យ/នាទី",
        "isCorrect": false
      },
      {
        "text": "450 ពាក្យ/នាទី",
        "isCorrect": false
      }
    ],
    "explanation": "ល្បឿនវាយ = 450 ពាក្យ / 10 នាទី = 45 ពាក្យ/នាទី។",
    "points": 1
  },
  {
    "id": 30,
    "part": "ផ្នែកទី៣ ៖ ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "partSubtitle": "អត្រាបេះដូងលោត",
    "question": "បេះដូងមនុស្សម្នាក់លោតបាន 216 ដងក្នុង 3 នាទី។ តើអត្រាបេះដូងលោតគិតជាដង/នាទី ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "75 ដង/នាទី",
        "isCorrect": false
      },
      {
        "text": "68 ដង/នាទី",
        "isCorrect": false
      },
      {
        "text": "72 ដង/នាទី",
        "isCorrect": true
      },
      {
        "text": "80 ដង/នាទី",
        "isCorrect": false
      }
    ],
    "explanation": "អត្រា = 216 ដង / 3 នាទី = 72 ដង/នាទី។",
    "points": 1
  },
  {
    "id": 31,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ចែកប្រាក់តាមផលធៀប",
    "question": "គេចែកប្រាក់ 100 000 រៀល ឱ្យកូនពីរនាក់តាមផលធៀប 2 : 3។ តើកូនទីមួយទទួលបានប្រាក់ប៉ុន្មានរៀល?",
    "options": [
      {
        "text": "40 000 រៀល",
        "isCorrect": true
      },
      {
        "text": "60 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "50 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "30 000 រៀល",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនភាគសរុប = 2 + 3 = 5 ភាគ។ តម្លៃ 1 ភាគ = 100 000 / 5 = 20 000 រៀល។ កូនទីមួយទទួលបាន 2 × 20 000 = 40 000 រៀល។",
    "points": 1
  },
  {
    "id": 32,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ចែកប្រាក់តាមផលធៀប",
    "question": "ពីចំណោទទី៣១ ខាងលើ តើកូនទីពីរទទួលបានប្រាក់ប៉ុន្មានរៀល?",
    "options": [
      {
        "text": "50 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "40 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "70 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "60 000 រៀល",
        "isCorrect": true
      }
    ],
    "explanation": "កូនទីពីរទទួលបាន 3 ភាគ = 3 × 20 000 = 60 000 រៀល (ឬ 100 000 - 40 000 = 60 000 រៀល)។",
    "points": 1
  },
  {
    "id": 33,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ផលធៀបប្រវែង និងទទឹង",
    "question": "ចតុកោណកែងមួយមានផលធៀបរវាងទទឹង និងបណ្តោយគឺ 3 : 5។ បើទទឹងមានរង្វាស់ 15 m តើបណ្តោយមានរង្វាស់ប៉ុន្មានម៉ែត្រ?",
    "options": [
      {
        "text": "30 m",
        "isCorrect": false
      },
      {
        "text": "20 m",
        "isCorrect": false
      },
      {
        "text": "25 m",
        "isCorrect": true
      },
      {
        "text": "35 m",
        "isCorrect": false
      }
    ],
    "explanation": "ទទឹង / បណ្តោយ = 3/5 => 15 / បណ្តោយ = 3/5 => បណ្តោយ = (15 × 5)/3 = 25 m។",
    "points": 1
  },
  {
    "id": 34,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ផលធៀបអាយុ",
    "question": "ផលធៀបអាយុរវាងកូន និងឪពុកគឺ 1 : 4។ បើកូនមានអាយុ 10 ឆ្នាំ តើឪពុកមានអាយុប៉ុន្មានឆ្នាំ?",
    "options": [
      {
        "text": "35 ឆ្នាំ",
        "isCorrect": false
      },
      {
        "text": "40 ឆ្នាំ",
        "isCorrect": true
      },
      {
        "text": "45 ឆ្នាំ",
        "isCorrect": false
      },
      {
        "text": "50 ឆ្នាំ",
        "isCorrect": false
      }
    ],
    "explanation": "អាយុកូន / អាយុឪពុក = 1/4 => 10 / អាយុឪពុក = 1/4 => អាយុឪពុក = 10 × 4 = 40 ឆ្នាំ។",
    "points": 1
  },
  {
    "id": 35,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ល្បាយស៊ីម៉ងត៍ និងខ្សាច់",
    "question": "ជាងសំណង់លាយស៊ីម៉ងត៍ និងខ្សាច់តាមផលធៀប 1 : 3។ បើគាត់ប្រើស៊ីម៉ងត៍ 5 បាវ តើគាត់ត្រូវប្រើខ្សាច់ប៉ុន្មានបាវ?",
    "options": [
      {
        "text": "8 បាវ",
        "isCorrect": false
      },
      {
        "text": "10 បាវ",
        "isCorrect": false
      },
      {
        "text": "12 បាវ",
        "isCorrect": false
      },
      {
        "text": "15 បាវ",
        "isCorrect": true
      }
    ],
    "explanation": "ស៊ីម៉ងត៍ / ខ្សាច់ = 1/3 => 5 / ខ្សាច់ = 1/3 => ខ្សាច់ = 5 × 3 = 15 បាវ។",
    "points": 1
  },
  {
    "id": 36,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ផលធៀបបាល់ទាត់",
    "question": "ក្នុងកន្ត្រកមួយមានបាល់ក្រហម និងបាល់ខៀវសរុប 48 គ្រាប់។ ផលធៀបបាល់ក្រហមធៀបនឹងបាល់ខៀវគឺ 5 : 3។ តើមានបាល់ក្រហមប៉ុន្មានគ្រាប់?",
    "options": [
      {
        "text": "30 គ្រាប់",
        "isCorrect": true
      },
      {
        "text": "18 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "24 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "32 គ្រាប់",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនភាគសរុប = 5 + 3 = 8 ភាគ។ តម្លៃ 1 ភាគ = 48 / 8 = 6 គ្រាប់។ បាល់ក្រហម = 5 × 6 = 30 គ្រាប់។",
    "points": 1
  },
  {
    "id": 37,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ផលធៀបបាល់ខៀវ",
    "question": "ពីចំណោទទី៣៦ ខាងលើ តើមានបាល់ខៀវប៉ុន្មានគ្រាប់?",
    "options": [
      {
        "text": "30 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "18 គ្រាប់",
        "isCorrect": true
      },
      {
        "text": "16 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "20 គ្រាប់",
        "isCorrect": false
      }
    ],
    "explanation": "បាល់ខៀវ = 3 × 6 = 18 គ្រាប់ (ឬ 48 - 30 = 18 គ្រាប់)។",
    "points": 1
  },
  {
    "id": 38,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ផលធៀបមុំត្រីកោណ",
    "question": "មុំទាំងបីនៃត្រីកោណមួយមានផលធៀប 1 : 2 : 3។ ដឹងថាផលបូកមុំក្នុងត្រីកោណស្មើ 180°។ តើមុំធំជាងគេមានរង្វាស់ប៉ុន្មានដឺក្រេ?",
    "options": [
      {
        "text": "100°",
        "isCorrect": false
      },
      {
        "text": "60°",
        "isCorrect": false
      },
      {
        "text": "30°",
        "isCorrect": false
      },
      {
        "text": "90°",
        "isCorrect": true
      }
    ],
    "explanation": "ចំនួនភាគ = 1 + 2 + 3 = 6 ភាគ។ 1 ភាគ = 180° / 6 = 30°។ មុំធំជាងគេ (3 ភាគ) = 3 × 30° = 90°។",
    "points": 1
  },
  {
    "id": 39,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ផលធៀបទម្ងន់បន្លែ",
    "question": "កសិករម្នាក់លក់ស្ពៃ និងការ៉ុតបានទម្ងន់សរុប 70 kg ដោយផលធៀបទម្ងន់ស្ពៃធៀបនឹងការ៉ុតគឺ 4 : 3។ តើគាត់លក់ស្ពៃបានប៉ុន្មាន kg?",
    "options": [
      {
        "text": "35 kg",
        "isCorrect": false
      },
      {
        "text": "30 kg",
        "isCorrect": false
      },
      {
        "text": "40 kg",
        "isCorrect": true
      },
      {
        "text": "45 kg",
        "isCorrect": false
      }
    ],
    "explanation": "ភាគសរុប = 4 + 3 = 7 ភាគ។ 1 ភាគ = 70 / 7 = 10 kg។ ស្ពៃ = 4 × 10 = 40 kg។",
    "points": 1
  },
  {
    "id": 40,
    "part": "ផ្នែកទី៤ ៖ ចំណោទអនុវត្តផលធៀប និងការបែងចែកសមាមាត្រ",
    "partSubtitle": "ផលធៀបប្រាក់ចំណេញ",
    "question": "ដៃគូវិនិយោគពីរនាក់ A និង B ចែកប្រាក់ចំណេញ $12 000 តាមផលធៀប 5 : 7។ តើដៃគូ B ទទួលបានប្រាក់ចំណេញប៉ុន្មានដុល្លារ?",
    "options": [
      {
        "text": "$7000",
        "isCorrect": true
      },
      {
        "text": "$5000",
        "isCorrect": false
      },
      {
        "text": "$6000",
        "isCorrect": false
      },
      {
        "text": "$8000",
        "isCorrect": false
      }
    ],
    "explanation": "ភាគសរុប = 5 + 7 = 12 ភាគ។ 1 ភាគ = 12 000 / 12 = $1000។ ដៃគូ B (7 ភាគ) = 7 × $1000 = $7000។",
    "points": 1
  }
];

export const LESSON_12_FORMULAS: MathFormulaSection[] = [
  {
    "title": "១. និយមន័យផលធៀប (Definition of Ratio)",
    "description": "មូលដ្ឋានគ្រឹះនៃផលធៀប",
    "details": [
      "ផលធៀបនៃពីរចំនួន a និង b (b ≠ 0) គឺ a/b ឬ a : b",
      "អានថា ៖ «a ធៀបនឹង b»",
      "a ជាតួទី១ (Antecedent) និង b ជាតួទី២ (Consequent)",
      "ផលធៀបស្មើគ្នា ៖ a/b = (a × k) / (b × k) = (a ÷ k) / (b ÷ k)"
    ]
  },
  {
    "title": "២. ផលធៀបនៃទំហំមានឯកតាដូចគ្នា",
    "description": "ក្បួនគណនាគ្មានឯកតា",
    "details": [
      "ត្រូវបំប្លែងទំហំទាំងពីរឱ្យមានឯកតាដូចគ្នាមុននឹងគណនា",
      "ផលធៀបនៃទំហំមានឯកតាដូចគ្នា គ្មានឯកតាទេ (ឯកតាសម្រួលអស់)",
      "ឧទាហរណ៍ ៖ 40 នាទី / 2 ម៉ោង = 40 នាទី / 120 នាទី = 1/3"
    ]
  },
  {
    "title": "៣. ផលធៀបនៃទំហំមានឯកតាខុសគ្នា (ឯកតាផ្សំ)",
    "description": "ទំហំថ្មីបង្កើតពីផលធៀប",
    "details": [
      "ផលធៀបមានឯកតាផ្សំពីឯកតាទាំងពីរ",
      "ល្បឿនមធ្យម ៖ v = ចម្ងាយ / ពេល (km/h ឬ m/s)",
      "ដង់ស៊ីតេប្រជាជន ៖ ដង់ស៊ីតេ = ចំនួនមនុស្ស / ផ្ទៃដី (នាក់/km²)",
      "តម្លៃឯកតា ៖ តម្លៃ / ចំនួន (រៀល/ក្បាល, $/kg)"
    ]
  },
  {
    "title": "៤. ការបែងចែកតាមផលធៀប (Proportional Division)",
    "description": "វិធីដោះស្រាយចំណោទចែកភាគ",
    "details": [
      "ជំហានទី១ ៖ រកចំនួនភាគសរុប = a + b",
      "ជំហានទី២ ៖ រកតម្លៃក្នុង ១ ភាគ = បរិមាណសរុប ÷ ចំនួនភាគសរុប",
      "ជំហានទី៣ ៖ រកតម្លៃផ្នែកនីមួយៗ = តម្លៃ ១ ភាគ × ចំនួនភាគរៀងខ្លួន"
    ]
  }
];
