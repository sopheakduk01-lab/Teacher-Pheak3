import { MathQCMQuestion, MathFormulaSection } from '../mathQcmTypes';

export const LESSON_16_QUESTIONS: MathQCMQuestion[] = [
  {
    "id": 1,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "និយមន័យភាគរយ",
    "question": "តើភាគរយ (Percentage) គឺជាអ្វី?",
    "options": [
      {
        "text": "ផលធៀបដែលមានភាគបែងស្មើនឹង 100 (និមិត្តសញ្ញា %)",
        "isCorrect": true
      },
      {
        "text": "ផលបូកនៃលេខ 100",
        "isCorrect": false
      },
      {
        "text": "ប្រភាគដែលមានភាគយកស្មើ 100",
        "isCorrect": false
      },
      {
        "text": "ចំនួនទសភាគដែលមានលេខ ០ ខាងក្រោយ",
        "isCorrect": false
      }
    ],
    "explanation": "និយមន័យ ៖ ភាគរយ គឺជាផលធៀបដែលមានភាគបែងស្មើនឹង 100។ គេតាងដោយនិមិត្តសញ្ញា «%» (ឧ. 25% = 25/100 = 0.25)។",
    "points": 1
  },
  {
    "id": 2,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរប្រភាគជាភាគរយ",
    "question": "ប្រភាគ 3/4 សរសេរជាភាគរយគឺ ៖",
    "options": [
      {
        "text": "50%",
        "isCorrect": false
      },
      {
        "text": "34%",
        "isCorrect": false
      },
      {
        "text": "75%",
        "isCorrect": true
      },
      {
        "text": "80%",
        "isCorrect": false
      }
    ],
    "explanation": "3/4 = (3 × 25) / (4 × 25) = 75/100 = 75% (ឬ 3/4 × 100% = 75%)។",
    "points": 1
  },
  {
    "id": 3,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរប្រភាគជាភាគរយ",
    "question": "ប្រភាគ 4/5 សរសេរជាភាគរយគឺ ៖",
    "options": [
      {
        "text": "85%",
        "isCorrect": false
      },
      {
        "text": "45%",
        "isCorrect": false
      },
      {
        "text": "75%",
        "isCorrect": false
      },
      {
        "text": "80%",
        "isCorrect": true
      }
    ],
    "explanation": "4/5 = (4 × 20) / (5 × 20) = 80/100 = 80%។",
    "points": 1
  },
  {
    "id": 4,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរប្រភាគជាភាគរយ",
    "question": "ប្រភាគ 7/10 សរសេរជាភាគរយគឺ ៖",
    "options": [
      {
        "text": "7%",
        "isCorrect": false
      },
      {
        "text": "70%",
        "isCorrect": true
      },
      {
        "text": "77%",
        "isCorrect": false
      },
      {
        "text": "17%",
        "isCorrect": false
      }
    ],
    "explanation": "7/10 = 70/100 = 70%។",
    "points": 1
  },
  {
    "id": 5,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរទសភាគជាភាគរយ",
    "question": "ចំនួនទសភាគ 0.35 សរសេរជាភាគរយគឺ ៖",
    "options": [
      {
        "text": "3.5%",
        "isCorrect": false
      },
      {
        "text": "35%",
        "isCorrect": true
      },
      {
        "text": "350%",
        "isCorrect": false
      },
      {
        "text": "0.35%",
        "isCorrect": false
      }
    ],
    "explanation": "0.35 = 35/100 = 35% (រំកិលចំណុចទសភាគទៅស្តាំ ២ ខ្ទង់)។",
    "points": 1
  },
  {
    "id": 6,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរទសភាគជាភាគរយ",
    "question": "ចំនួនទសភាគ 0.08 សរសេរជាភាគរយគឺ ៖",
    "options": [
      {
        "text": "88%",
        "isCorrect": false
      },
      {
        "text": "80%",
        "isCorrect": false
      },
      {
        "text": "0.8%",
        "isCorrect": false
      },
      {
        "text": "8%",
        "isCorrect": true
      }
    ],
    "explanation": "0.08 = 8/100 = 8%។",
    "points": 1
  },
  {
    "id": 7,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរទសភាគលើសពី ១ ជាភាគរយ",
    "question": "ចំនួនទសភាគ 1.25 សរសេរជាភាគរយគឺ ៖",
    "options": [
      {
        "text": "125%",
        "isCorrect": true
      },
      {
        "text": "12.5%",
        "isCorrect": false
      },
      {
        "text": "1.25%",
        "isCorrect": false
      },
      {
        "text": "25%",
        "isCorrect": false
      }
    ],
    "explanation": "1.25 × 100% = 125%។",
    "points": 1
  },
  {
    "id": 8,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរភាគរយជាប្រភាគសម្រួលរួច",
    "question": "ភាគរយ 20% សរសេរជាប្រភាគសម្រួលរួចគឺ ៖",
    "options": [
      {
        "text": "1/4",
        "isCorrect": false
      },
      {
        "text": "2/10",
        "isCorrect": false
      },
      {
        "text": "1/5",
        "isCorrect": true
      },
      {
        "text": "20/100",
        "isCorrect": false
      }
    ],
    "explanation": "20% = 20/100 = 1/5 (សម្រួលនឹង 20)។",
    "points": 1
  },
  {
    "id": 9,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរភាគរយជាប្រភាគសម្រួលរួច",
    "question": "ភាគរយ 45% សរសេរជាប្រភាគសម្រួលរួចគឺ ៖",
    "options": [
      {
        "text": "45/100",
        "isCorrect": false
      },
      {
        "text": "4/5",
        "isCorrect": false
      },
      {
        "text": "9/10",
        "isCorrect": false
      },
      {
        "text": "9/20",
        "isCorrect": true
      }
    ],
    "explanation": "45% = 45/100 = 9/20 (សម្រួលនឹង 5)។",
    "points": 1
  },
  {
    "id": 10,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងការបំប្លែងភាគរយ",
    "partSubtitle": "ប្តូរភាគរយជាទសភាគ",
    "question": "ភាគរយ 6.5% សរសេរជាចំនួនទសភាគគឺ ៖",
    "options": [
      {
        "text": "0.65",
        "isCorrect": false
      },
      {
        "text": "0.065",
        "isCorrect": true
      },
      {
        "text": "6.5",
        "isCorrect": false
      },
      {
        "text": "0.0065",
        "isCorrect": false
      }
    ],
    "explanation": "6.5% = 6.5 / 100 = 0.065 (រំកិលក្បៀសទៅឆ្វេង ២ ខ្ទង់)។",
    "points": 1
  },
  {
    "id": 11,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកភាគរយនៃចំនួនមួយ",
    "question": "តើ 20% នៃ 150 000 រៀល ស្មើនឹងប៉ុន្មានរៀល?",
    "options": [
      {
        "text": "25 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "15 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "30 000 រៀល",
        "isCorrect": true
      },
      {
        "text": "35 000 រៀល",
        "isCorrect": false
      }
    ],
    "explanation": "150 000 × 20/100 = 1500 × 20 = 30 000 រៀល។",
    "points": 1
  },
  {
    "id": 12,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកភាគរយនៃម៉ាស",
    "question": "តើ 15% នៃ 200 kg ស្មើនឹងប៉ុន្មានគីឡូក្រាម?",
    "options": [
      {
        "text": "30 kg",
        "isCorrect": true
      },
      {
        "text": "15 kg",
        "isCorrect": false
      },
      {
        "text": "25 kg",
        "isCorrect": false
      },
      {
        "text": "35 kg",
        "isCorrect": false
      }
    ],
    "explanation": "200 × 15/100 = 2 × 15 = 30 kg។",
    "points": 1
  },
  {
    "id": 13,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកភាគរយនៃប្រាក់",
    "question": "តើ 25% នៃ 800 000 រៀល ស្មើនឹងប៉ុន្មានរៀល?",
    "options": [
      {
        "text": "150 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "250 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "200 000 រៀល",
        "isCorrect": true
      },
      {
        "text": "300 000 រៀល",
        "isCorrect": false
      }
    ],
    "explanation": "800 000 × 25/100 = 800 000 / 4 = 200 000 រៀល។",
    "points": 1
  },
  {
    "id": 14,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកភាគរយនៃប្រវែង",
    "question": "តើ 10% នៃ 45 m ស្មើនឹងប៉ុន្មានម៉ែត្រ?",
    "options": [
      {
        "text": "4 m",
        "isCorrect": false
      },
      {
        "text": "45 m",
        "isCorrect": false
      },
      {
        "text": "0.45 m",
        "isCorrect": false
      },
      {
        "text": "4.5 m",
        "isCorrect": true
      }
    ],
    "explanation": "45 × 10/100 = 4.5 m។",
    "points": 1
  },
  {
    "id": 15,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកភាគរយធៀបនឹងចំនួនសរុប",
    "question": "ក្នុងចំណោមសិស្ស 50 នាក់ មានសិស្សស្រី 30 នាក់។ តើសិស្សស្រីស្មើនឹងប៉ុន្មានភាគរយ?",
    "options": [
      {
        "text": "30%",
        "isCorrect": false
      },
      {
        "text": "60%",
        "isCorrect": true
      },
      {
        "text": "50%",
        "isCorrect": false
      },
      {
        "text": "40%",
        "isCorrect": false
      }
    ],
    "explanation": "(30 / 50) × 100% = 3/5 × 100% = 60%។",
    "points": 1
  },
  {
    "id": 16,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកភាគរយសិស្សប្រុស",
    "question": "ពីសំណួរទី១៥ ខាងលើ តើសិស្សប្រុសស្មើនឹងប៉ុន្មានភាគរយនៃសិស្សទាំងអស់?",
    "options": [
      {
        "text": "40%",
        "isCorrect": true
      },
      {
        "text": "20%",
        "isCorrect": false
      },
      {
        "text": "50%",
        "isCorrect": false
      },
      {
        "text": "60%",
        "isCorrect": false
      }
    ],
    "explanation": "100% - 60% = 40% (ឬ 20/50 × 100% = 40%)។",
    "points": 1
  },
  {
    "id": 17,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកចំនួនដើមពីភាគរយ",
    "question": "ដឹងថា 15% នៃចំនួនមួយស្មើនឹង 45។ តើចំនួនដើមនោះស្មើនឹងប៉ុន្មាន?",
    "options": [
      {
        "text": "450",
        "isCorrect": false
      },
      {
        "text": "250",
        "isCorrect": false
      },
      {
        "text": "350",
        "isCorrect": false
      },
      {
        "text": "300",
        "isCorrect": true
      }
    ],
    "explanation": "ចំនួនដើម = (45 × 100) / 15 = 4500 / 15 = 300។",
    "points": 1
  },
  {
    "id": 18,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកចំនួនដើមពី 50%",
    "question": "បើ 50% នៃប្រាក់សន្សំគឺ $240 តើប្រាក់សន្សំសរុបស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "$480",
        "isCorrect": true
      },
      {
        "text": "$120",
        "isCorrect": false
      },
      {
        "text": "$360",
        "isCorrect": false
      },
      {
        "text": "$500",
        "isCorrect": false
      }
    ],
    "explanation": "50% = 1/2 ដូច្នេះប្រាក់សរុប = $240 × 2 = $480។",
    "points": 1
  },
  {
    "id": 19,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "រកចំនួនដើមពី 75%",
    "question": "ដឹងថា 75% នៃទម្ងន់បាវមួយគឺ 60 kg។ តើទម្ងន់ពេញរបស់បាវស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "90 kg",
        "isCorrect": false
      },
      {
        "text": "75 kg",
        "isCorrect": false
      },
      {
        "text": "80 kg",
        "isCorrect": true
      },
      {
        "text": "100 kg",
        "isCorrect": false
      }
    ],
    "explanation": "ទម្ងន់ពេញ = (60 × 100) / 75 = 6000 / 75 = 80 kg (ឬ 60 ÷ 3/4 = 80)។",
    "points": 1
  },
  {
    "id": 20,
    "part": "ផ្នែកទី២ ៖ ការគណនាតម្លៃភាគរយ និងប្រភាគភាគរយ",
    "partSubtitle": "ភាគរយលើសពី 100%",
    "question": "តើ 120% នៃ 50 ស្មើនឹងប៉ុន្មាន?",
    "options": [
      {
        "text": "55",
        "isCorrect": false
      },
      {
        "text": "60",
        "isCorrect": true
      },
      {
        "text": "65",
        "isCorrect": false
      },
      {
        "text": "70",
        "isCorrect": false
      }
    ],
    "explanation": "50 × 120/100 = 50 × 1.2 = 60។",
    "points": 1
  },
  {
    "id": 21,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "ចំណោទបញ្ចុះតម្លៃទូរស័ព្ទ",
    "question": "ទូរស័ព្ទមួយគ្រឿងតម្លៃ $250។ ហាងបញ្ចុះតម្លៃ 15%។ តើប្រាក់ដែលបានបញ្ចុះស្មើប៉ុន្មានដុល្លារ?",
    "options": [
      {
        "text": "$37.5",
        "isCorrect": true
      },
      {
        "text": "$25",
        "isCorrect": false
      },
      {
        "text": "$35",
        "isCorrect": false
      },
      {
        "text": "$40",
        "isCorrect": false
      }
    ],
    "explanation": "ប្រាក់បញ្ចុះ = 250 × 15/100 = 37.5 ដុល្លារ ($37.5)។",
    "points": 1
  },
  {
    "id": 22,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "តម្លៃទូរស័ព្ទក្រោយបញ្ចុះ",
    "question": "ពីចំណោទទី២១ ខាងលើ តើអ្នកទិញត្រូវបង់ប្រាក់ពិតប្រាកដប៉ុន្មានដុល្លារ?",
    "options": [
      {
        "text": "$220",
        "isCorrect": false
      },
      {
        "text": "$212.5",
        "isCorrect": true
      },
      {
        "text": "$215",
        "isCorrect": false
      },
      {
        "text": "$200",
        "isCorrect": false
      }
    ],
    "explanation": "តម្លៃត្រូវបង់ = 250 - 37.5 = $212.5 (ឬ 250 × 85% = $212.5)។",
    "points": 1
  },
  {
    "id": 23,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "ចំណោទបញ្ចុះតម្លៃសម្លៀកបំពាក់",
    "question": "ខោខូវប៊យមួយតម្លៃ 80 000 រៀល។ ហាងបញ្ចុះតម្លៃ 20%។ តើតម្លៃលក់ថ្មីស្មើប៉ុន្មានរៀល?",
    "options": [
      {
        "text": "16 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "60 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "70 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "64 000 រៀល",
        "isCorrect": true
      }
    ],
    "explanation": "ប្រាក់បញ្ចុះ = 80 000 × 20% = 16 000 រៀល។ តម្លៃថ្មី = 80 000 - 16 000 = 64 000 រៀល។",
    "points": 1
  },
  {
    "id": 24,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "ចំណោទដំឡើងថ្លៃទំនិញ",
    "question": "សាំងមួយលីត្រតម្លៃ 4000 រៀល។ នៅខែបន្ទាប់ តម្លៃសាំងឡើងថ្លៃ 5%។ តើសាំងឡើងថ្លៃប៉ុន្មានរៀលក្នុងមួយលីត្រ?",
    "options": [
      {
        "text": "150 រៀល",
        "isCorrect": false
      },
      {
        "text": "400 រៀល",
        "isCorrect": false
      },
      {
        "text": "200 រៀល",
        "isCorrect": true
      },
      {
        "text": "250 រៀល",
        "isCorrect": false
      }
    ],
    "explanation": "ប្រាក់ដំឡើង = 4000 × 5/100 = 200 រៀល។",
    "points": 1
  },
  {
    "id": 25,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "តម្លៃសាំងថ្មី",
    "question": "ពីចំណោទទី២៤ ខាងលើ តើតម្លៃសាំងថ្មីក្នុងមួយលីត្រស្មើប៉ុន្មានរៀល?",
    "options": [
      {
        "text": "4100 រៀល",
        "isCorrect": false
      },
      {
        "text": "4200 រៀល",
        "isCorrect": true
      },
      {
        "text": "4500 រៀល",
        "isCorrect": false
      },
      {
        "text": "4050 រៀល",
        "isCorrect": false
      }
    ],
    "explanation": "តម្លៃថ្មី = 4000 + 200 = 4200 រៀល។",
    "points": 1
  },
  {
    "id": 26,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "រកភាគរយបញ្ចុះតម្លៃ",
    "question": "កាតាបមួយដើមឡើយតម្លៃ 50 000 រៀល តែពេលនេះលក់ត្រឹមតែ 40 000 រៀល។ តើហាងបានបញ្ចុះតម្លៃប៉ុន្មានភាគរយ?",
    "options": [
      {
        "text": "25%",
        "isCorrect": false
      },
      {
        "text": "10%",
        "isCorrect": false
      },
      {
        "text": "20%",
        "isCorrect": true
      },
      {
        "text": "15%",
        "isCorrect": false
      }
    ],
    "explanation": "ប្រាក់បញ្ចុះ = 50 000 - 40 000 = 10 000 រៀល។ ភាគរយបញ្ចុះ = (10 000 / 50 000) × 100% = 20%។",
    "points": 1
  },
  {
    "id": 27,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "រកភាគរយចំណេញ",
    "question": "អាជីវករម្នាក់ទិញទំនិញតម្លៃ $80 រួចលក់ចេញវិញបាន $100។ តើគាត់ចំណេញបានប៉ុន្មានភាគរយ?",
    "options": [
      {
        "text": "25%",
        "isCorrect": true
      },
      {
        "text": "20%",
        "isCorrect": false
      },
      {
        "text": "15%",
        "isCorrect": false
      },
      {
        "text": "30%",
        "isCorrect": false
      }
    ],
    "explanation": "ប្រាក់ចំណេញ = 100 - 80 = $20។ ភាគរយចំណេញ = (20 / 80) × 100% = 1/4 × 100% = 25%។",
    "points": 1
  },
  {
    "id": 28,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "រកភាគរយខាត",
    "question": "អ្នកលក់ម្នាក់ទិញផ្លែឈើតម្លៃ 200 000 រៀល ដោយសារខូចខ្លះគាត់លក់បានតែ 170 000 រៀល។ តើគាត់ខាតប៉ុន្មានភាគរយ?",
    "options": [
      {
        "text": "30%",
        "isCorrect": false
      },
      {
        "text": "10%",
        "isCorrect": false
      },
      {
        "text": "20%",
        "isCorrect": false
      },
      {
        "text": "15%",
        "isCorrect": true
      }
    ],
    "explanation": "ប្រាក់ខាត = 200 000 - 170 000 = 30 000 រៀល។ ភាគរយខាត = (30 000 / 200 000) × 100% = 15%។",
    "points": 1
  },
  {
    "id": 29,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "ចំណោទពន្ធលើតម្លៃបន្ថែម (VAT)",
    "question": "អាហារមួយពេលតម្លៃ $40 ដោយត្រូវគិតពន្ធលើតម្លៃបន្ថែម 10% (VAT)។ តើត្រូវបង់ប្រាក់សរុបប៉ុន្មានដុល្លារ?",
    "options": [
      {
        "text": "$40.4",
        "isCorrect": false
      },
      {
        "text": "$42",
        "isCorrect": false
      },
      {
        "text": "$44",
        "isCorrect": true
      },
      {
        "text": "$45",
        "isCorrect": false
      }
    ],
    "explanation": "ប្រាក់ពន្ធ = $40 × 10% = $4។ ប្រាក់សរុប = 40 + 4 = $44។",
    "points": 1
  },
  {
    "id": 30,
    "part": "ផ្នែកទី៣ ៖ ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "partSubtitle": "ចំណោទថ្លៃសេវា",
    "question": "វិក្កយបត្រសណ្ឋាគារតម្លៃ $150 បូកបន្ថែមថ្លៃសេវា 5%។ តើថ្លៃសេវាស្មើប៉ុន្មានដុល្លារ?",
    "options": [
      {
        "text": "$5",
        "isCorrect": false
      },
      {
        "text": "$7.5",
        "isCorrect": true
      },
      {
        "text": "$15",
        "isCorrect": false
      },
      {
        "text": "$10",
        "isCorrect": false
      }
    ],
    "explanation": "ថ្លៃសេវា = $150 × 5/100 = $7.5។",
    "points": 1
  },
  {
    "id": 31,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "ចំណោទអវត្តមានសិស្ស",
    "question": "ក្នុងថ្នាក់រៀនមួយមានសិស្ស 40 នាក់។ ថ្ងៃនេះមានសិស្សអវត្តមាន 5%។ តើមានសិស្សអវត្តមានប៉ុន្មាននាក់?",
    "options": [
      {
        "text": "1 នាក់",
        "isCorrect": false
      },
      {
        "text": "4 នាក់",
        "isCorrect": false
      },
      {
        "text": "5 នាក់",
        "isCorrect": false
      },
      {
        "text": "2 នាក់",
        "isCorrect": true
      }
    ],
    "explanation": "សិស្សអវត្តមាន = 40 × 5/100 = 200/100 = 2 នាក់។",
    "points": 1
  },
  {
    "id": 32,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "សិស្សវត្តមាន",
    "question": "ពីចំណោទទី៣១ ខាងលើ តើមានសិស្សវត្តមានប៉ុន្មាននាក់?",
    "options": [
      {
        "text": "38 នាក់",
        "isCorrect": true
      },
      {
        "text": "35 នាក់",
        "isCorrect": false
      },
      {
        "text": "36 នាក់",
        "isCorrect": false
      },
      {
        "text": "39 នាក់",
        "isCorrect": false
      }
    ],
    "explanation": "សិស្សវត្តមាន = 40 - 2 = 38 នាក់ (ឬ 40 × 95% = 38 នាក់)។",
    "points": 1
  },
  {
    "id": 33,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "ចំណោទពិន្ទុប្រឡង",
    "question": "វិញ្ញាសាប្រឡងមួយមាន 80 ពិន្ទុ។ សិស្សម្នាក់ទទួលបាន 90% នៃពិន្ទុសរុប។ តើគាត់ទទួលបានប៉ុន្មានពិន្ទុ?",
    "options": [
      {
        "text": "70 ពិន្ទុ",
        "isCorrect": false
      },
      {
        "text": "72 ពិន្ទុ",
        "isCorrect": true
      },
      {
        "text": "75 ពិន្ទុ",
        "isCorrect": false
      },
      {
        "text": "68 ពិន្ទុ",
        "isCorrect": false
      }
    ],
    "explanation": "ពិន្ទុ = 80 × 90/100 = 72 ពិន្ទុ។",
    "points": 1
  },
  {
    "id": 34,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "ចំណោទគ្រាប់ពូជដំណុះ",
    "question": "កសិករម្នាក់សាបគ្រាប់ពូជ 500 គ្រាប់ ហើយវាដុះបាន 96%។ តើគ្រាប់ពូជដុះបានចំនួនប៉ុន្មានគ្រាប់?",
    "options": [
      {
        "text": "460 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "450 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "490 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "480 គ្រាប់",
        "isCorrect": true
      }
    ],
    "explanation": "គ្រាប់ដុះ = 500 × 96/100 = 5 × 96 = 480 គ្រាប់។",
    "points": 1
  },
  {
    "id": 35,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "គ្រាប់ពូជមិនដុះ",
    "question": "ពីចំណោទទី៣៤ តើមានគ្រាប់ពូជខូចមិនដុះប៉ុន្មានគ្រាប់?",
    "options": [
      {
        "text": "15 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "25 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "20 គ្រាប់",
        "isCorrect": true
      },
      {
        "text": "30 គ្រាប់",
        "isCorrect": false
      }
    ],
    "explanation": "គ្រាប់មិនដុះ = 500 - 480 = 20 គ្រាប់ (ឬ 500 × 4% = 20 គ្រាប់)។",
    "points": 1
  },
  {
    "id": 36,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "ចំណោទការកើនឡើងប្រជាជន",
    "question": "ភូមិមួយមានប្រជាជន 2000 នាក់។ ក្នុងមួយឆ្នាំប្រជាជនកើនឡើង 3%។ តើប្រជាជនកើនឡើងចំនួនប៉ុន្មាននាក់ក្នុងមួយឆ្នាំ?",
    "options": [
      {
        "text": "60 នាក់",
        "isCorrect": true
      },
      {
        "text": "30 នាក់",
        "isCorrect": false
      },
      {
        "text": "50 នាក់",
        "isCorrect": false
      },
      {
        "text": "100 នាក់",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនកើនឡើង = 2000 × 3/100 = 60 នាក់។",
    "points": 1
  },
  {
    "id": 37,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "ចំណោទការសន្សំប្រាក់",
    "question": "បុគ្គលិកម្នាក់មានប្រាក់ខែ 1 200 000 រៀល។ គាត់សន្សំទុក 25% នៃប្រាក់ខែជារៀងរាល់ខែ។ តើគាត់សន្សំបានប៉ុន្មានរៀលក្នុងមួយខែ?",
    "options": [
      {
        "text": "400 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "250 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "300 000 រៀល",
        "isCorrect": true
      },
      {
        "text": "350 000 រៀល",
        "isCorrect": false
      }
    ],
    "explanation": "ប្រាក់សន្សំ = 1 200 000 × 25/100 = 1 200 000 / 4 = 300 000 រៀល។",
    "points": 1
  },
  {
    "id": 38,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "ចំណោទបរិមាណទឹកក្នុងរាងកាយ",
    "question": "ទឹកមានបរិមាណប្រហែល 70% នៃទម្ងន់ខ្លួនមនុស្ស។ បើមនុស្សម្នាក់មានទម្ងន់ 60 kg តើទឹកក្នុងខ្លួនគាត់មានទម្ងន់ប្រហែលប៉ុន្មាន kg?",
    "options": [
      {
        "text": "42 kg",
        "isCorrect": true
      },
      {
        "text": "40 kg",
        "isCorrect": false
      },
      {
        "text": "45 kg",
        "isCorrect": false
      },
      {
        "text": "35 kg",
        "isCorrect": false
      }
    ],
    "explanation": "ទម្ងន់ទឹក = 60 × 70/100 = 42 kg។",
    "points": 1
  },
  {
    "id": 39,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "ចំណោទផ្ទៃដីដាំដុះ",
    "question": "កសិដ្ឋានមួយមានផ្ទៃដីសរុប 10 ហិកតា។ គេដាំស្រូវ 60%, ដាំបន្លែ 25% និងដីនៅសល់ជីកស្រះ។ តើដីស្រះមានផ្ទៃដីប៉ុន្មានហិកតា?",
    "options": [
      {
        "text": "2 ហិកតា",
        "isCorrect": false
      },
      {
        "text": "1.5 ហិកតា",
        "isCorrect": true
      },
      {
        "text": "1 ហិកតា",
        "isCorrect": false
      },
      {
        "text": "2.5 ហិកតា",
        "isCorrect": false
      }
    ],
    "explanation": "ភាគរយស្រះ = 100% - (60% + 25%) = 15%។ ផ្ទៃដីស្រះ = 10 × 15% = 1.5 ហិកតា។",
    "points": 1
  },
  {
    "id": 40,
    "part": "ផ្នែកទី៤ ៖ ចំណោទជីវភាព និងស្ថិតិភាគរយ",
    "partSubtitle": "ចំណោទការបញ្ចុះតម្លៃពីរដង",
    "question": "ទំនិញមួយតម្លៃ $100 បញ្ចុះតម្លៃលើកទីមួយ 10% ហើយតម្លៃថ្មីនោះបញ្ចុះបន្ថែម 10% ទៀត។ តើតម្លៃចុងក្រោយស្មើប៉ុន្មានដុល្លារ?",
    "options": [
      {
        "text": "$90",
        "isCorrect": false
      },
      {
        "text": "$80",
        "isCorrect": false
      },
      {
        "text": "$85",
        "isCorrect": false
      },
      {
        "text": "$81",
        "isCorrect": true
      }
    ],
    "explanation": "លើកទី១ ៖ $100 - 10% = $90។ លើកទី២ ៖ $90 - (10% នៃ $90 = $9) = $81។",
    "points": 1
  }
];

export const LESSON_16_FORMULAS: MathFormulaSection[] = [
  {
    "title": "១. និយមន័យ និងការបំប្លែងភាគរយ (Percentage Conversions)",
    "description": "មូលដ្ឋានគ្រឹះនៃភាគរយ",
    "details": [
      "ភាគរយ (%) គឺជាផលធៀបដែលមានភាគបែងស្មើ 100 ៖ P% = P/100",
      "ប្តូរប្រភាគទៅភាគរយ ៖ គុណនឹង 100% (a/b × 100%)",
      "ប្តូរទសភាគទៅភាគរយ ៖ គុណនឹង 100 (រំកិលក្បៀសស្តាំ ២ ខ្ទង់)",
      "ប្តូរភាគរយទៅទសភាគ ៖ ចែកនឹង 100 (រំកិលក្បៀសឆ្វេង ២ ខ្ទង់)"
    ]
  },
  {
    "title": "២. ការគណនាតម្លៃនៃភាគរយ",
    "description": "រូបមន្តគណនាភាគរយ",
    "details": [
      "រក P% នៃចំនួន A ៖ តម្លៃ = A × (P / 100)",
      "រកភាគរយនៃ A ធៀបនឹង B ៖ P% = (A / B) × 100%",
      "រកចំនួនដើមដឹង P% ស្មើ X ៖ ចំនួនដើម = (X × 100) / P"
    ]
  },
  {
    "title": "៣. ចំណោទបញ្ចុះតម្លៃ និងដំឡើងថ្លៃ",
    "description": "ការអនុវត្តក្នុងអាជីវកម្ម",
    "details": [
      "ប្រាក់បញ្ចុះតម្លៃ = តម្លៃដើម × អត្រាបញ្ចុះ (%)",
      "តម្លៃលក់ថ្មី (ក្រោយបញ្ចុះ) = តម្លៃដើម - ប្រាក់បញ្ចុះ",
      "ប្រាក់ដំឡើងថ្លៃ = តម្លៃដើម × អត្រាដំឡើង (%)",
      "តម្លៃលក់ថ្មី (ក្រោយដំឡើង) = តម្លៃដើម + ប្រាក់ដំឡើង"
    ]
  },
  {
    "title": "៤. ភាគរយចំណេញ និងខាត (Profit & Loss)",
    "description": "គណនាលើតម្លៃដើមទិញចូល",
    "details": [
      "ភាគរយចំណេញ = (ប្រាក់ចំណេញ / តម្លៃដើម) × 100%",
      "ភាគរយខាត = (ប្រាក់ខាត / តម្លៃដើម) × 100%",
      "ប្រាក់ចំណេញ = តម្លៃលក់ - តម្លៃដើម",
      "ប្រាក់ខាត = តម្លៃដើម - តម្លៃលក់"
    ]
  }
];
