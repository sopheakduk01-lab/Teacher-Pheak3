import { MathQCMQuestion, MathFormulaSection } from '../mathQcmTypes';

export const LESSON_6_QUESTIONS: MathQCMQuestion[] = [
  {
    "id": 1,
    "part": "ផ្នែកទី១ ៖ និយមន័យបរិមាត្រ",
    "partSubtitle": "និយមន័យ",
    "question": "តើអ្វីជាបរិមាត្រនៃរូបធរណីមាត្រមួយ?",
    "options": [
      {
        "text": "កម្ពស់នៃរូប",
        "isCorrect": false
      },
      {
        "text": "ផ្ទៃខាងក្នុងនៃរូប",
        "isCorrect": false
      },
      {
        "text": "មាឌនៃរូប",
        "isCorrect": false
      },
      {
        "text": "ប្រវែងជុំវិញនៃរូបនោះ",
        "isCorrect": true
      }
    ],
    "explanation": "បរិមាត្រ គឺជាប្រវែងជុំវិញនៃរូបធរណីមាត្របិទជិតមួយ។",
    "points": 1
  },
  {
    "id": 2,
    "part": "ផ្នែកទី១ ៖ និយមន័យបរិមាត្រ",
    "partSubtitle": "បរិមាត្រពហុកោណ",
    "question": "ពហុកោណមួយមានជ្រុង 2cm, 3cm, 3cm, 3cm, 4.5cm។ រកបរិមាត្រ ៖",
    "options": [
      {
        "text": "15.5 cm",
        "isCorrect": true
      },
      {
        "text": "14.5 cm",
        "isCorrect": false
      },
      {
        "text": "16.5 cm",
        "isCorrect": false
      },
      {
        "text": "15 cm",
        "isCorrect": false
      }
    ],
    "explanation": "P = 2 + 3 + 3 + 3 + 4.5 = 15.5 cm។",
    "points": 1
  },
  {
    "id": 3,
    "part": "ផ្នែកទី១ ៖ និយមន័យបរិមាត្រ",
    "partSubtitle": "បរិមាត្រត្រីកោណ",
    "question": "ត្រីកោណមួយមានជ្រុង 3.2m, 4.3m និង 4.7m។ រកបរិមាត្រ ៖",
    "options": [
      {
        "text": "11.2 m",
        "isCorrect": false
      },
      {
        "text": "12.2 m",
        "isCorrect": true
      },
      {
        "text": "12 m",
        "isCorrect": false
      },
      {
        "text": "13.2 m",
        "isCorrect": false
      }
    ],
    "explanation": "P = 3.2 + 4.3 + 4.7 = 12.2 m។",
    "points": 1
  },
  {
    "id": 4,
    "part": "ផ្នែកទី១ ៖ និយមន័យបរិមាត្រ",
    "partSubtitle": "បរិមាត្រត្រីកោណសម័ង្ស",
    "question": "ត្រីកោណសម័ង្សមួយមានជ្រុង 6.5cm។ រកបរិមាត្រ ៖",
    "options": [
      {
        "text": "18.5 cm",
        "isCorrect": false
      },
      {
        "text": "13 cm",
        "isCorrect": false
      },
      {
        "text": "26 cm",
        "isCorrect": false
      },
      {
        "text": "19.5 cm",
        "isCorrect": true
      }
    ],
    "explanation": "P = 3 × 6.5 = 19.5 cm។",
    "points": 1
  },
  {
    "id": 5,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង និងការេ",
    "partSubtitle": "រូបមន្តបរិមាត្រចតុកោណកែង",
    "question": "បើ a ជាទទឹង និង b ជាបណ្តោយ រូបមន្តបរិមាត្រចតុកោណកែងគឺ ៖",
    "options": [
      {
        "text": "P = 4a",
        "isCorrect": false
      },
      {
        "text": "P = a × b",
        "isCorrect": false
      },
      {
        "text": "P = (a + b) × 2",
        "isCorrect": true
      },
      {
        "text": "P = a + b",
        "isCorrect": false
      }
    ],
    "explanation": "P = (បណ្តោយ + ទទឹង) × 2 ឬ P = 2a + 2b។",
    "points": 1
  },
  {
    "id": 6,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង និងការេ",
    "partSubtitle": "គណនាបរិមាត្រចតុកោណកែង",
    "question": "ចតុកោណកែងមួយមានបណ្តោយ 18dm និងទទឹង 11dm។ រកបរិមាត្រ ៖",
    "options": [
      {
        "text": "58 dm",
        "isCorrect": true
      },
      {
        "text": "29 dm",
        "isCorrect": false
      },
      {
        "text": "198 dm",
        "isCorrect": false
      },
      {
        "text": "60 dm",
        "isCorrect": false
      }
    ],
    "explanation": "P = (18 + 11) × 2 = 29 × 2 = 58 dm។",
    "points": 1
  },
  {
    "id": 7,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង និងការេ",
    "partSubtitle": "គណនាបរិមាត្រចតុកោណកែង",
    "question": "បន្ទប់មួយមានបណ្តោយ 6m និងទទឹង 4.5m។ រកបរិមាត្រ ៖",
    "options": [
      {
        "text": "27 m",
        "isCorrect": false
      },
      {
        "text": "10.5 m",
        "isCorrect": false
      },
      {
        "text": "21 m",
        "isCorrect": true
      },
      {
        "text": "20 m",
        "isCorrect": false
      }
    ],
    "explanation": "P = (6 + 4.5) × 2 = 10.5 × 2 = 21 m។",
    "points": 1
  },
  {
    "id": 8,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង និងការេ",
    "partSubtitle": "រូបមន្តបរិមាត្រការេ",
    "question": "បើ a ជាជ្រុងនៃការេ រូបមន្តបរិមាត្រការេគឺ ៖",
    "options": [
      {
        "text": "P = a × 4",
        "isCorrect": true
      },
      {
        "text": "P = a × a",
        "isCorrect": false
      },
      {
        "text": "P = a + 4",
        "isCorrect": false
      },
      {
        "text": "P = 2a",
        "isCorrect": false
      }
    ],
    "explanation": "P = ជ្រុង × 4 = 4a។",
    "points": 1
  },
  {
    "id": 9,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង និងការេ",
    "partSubtitle": "គណនាបរិមាត្រការេ",
    "question": "ការេមួយមានជ្រុង 8cm។ រកបរិមាត្រ ៖",
    "options": [
      {
        "text": "64 cm",
        "isCorrect": false
      },
      {
        "text": "32 cm",
        "isCorrect": true
      },
      {
        "text": "16 cm",
        "isCorrect": false
      },
      {
        "text": "24 cm",
        "isCorrect": false
      }
    ],
    "explanation": "P = 8 × 4 = 32 cm។",
    "points": 1
  },
  {
    "id": 10,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង និងការេ",
    "partSubtitle": "គណនាបរិមាត្រការេ",
    "question": "ការេមួយមានជ្រុង 12.5m។ រកបរិមាត្រ ៖",
    "options": [
      {
        "text": "100 m",
        "isCorrect": false
      },
      {
        "text": "25 m",
        "isCorrect": false
      },
      {
        "text": "48 m",
        "isCorrect": false
      },
      {
        "text": "50 m",
        "isCorrect": true
      }
    ],
    "explanation": "P = 12.5 × 4 = 50 m។",
    "points": 1
  },
  {
    "id": 11,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង និងការេ",
    "partSubtitle": "រកជ្រុងពីបរិមាត្រ",
    "question": "ការេមួយមានបរិមាត្រ 36cm។ រកប្រវែងជ្រុងនៃការេ ៖",
    "options": [
      {
        "text": "9 cm",
        "isCorrect": true
      },
      {
        "text": "6 cm",
        "isCorrect": false
      },
      {
        "text": "12 cm",
        "isCorrect": false
      },
      {
        "text": "18 cm",
        "isCorrect": false
      }
    ],
    "explanation": "ជ្រុង = P ÷ 4 = 36 ÷ 4 = 9 cm។",
    "points": 1
  },
  {
    "id": 12,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង និងការេ",
    "partSubtitle": "រកបណ្តោយពីបរិមាត្រ",
    "question": "ចតុកោណកែងមានបរិមាត្រ 40m និងទទឹង 8m។ រកបណ្តោយ ៖",
    "options": [
      {
        "text": "24 m",
        "isCorrect": false
      },
      {
        "text": "16 m",
        "isCorrect": false
      },
      {
        "text": "12 m",
        "isCorrect": true
      },
      {
        "text": "10 m",
        "isCorrect": false
      }
    ],
    "explanation": "កន្លះបរិមាត្រ = 40 ÷ 2 = 20m ➔ បណ្តោយ = 20 - 8 = 12 m។",
    "points": 1
  },
  {
    "id": 13,
    "part": "ផ្នែកទី៣ ៖ បរិមាត្ររង្វង់",
    "partSubtitle": "រូបមន្តបរិមាត្ររង្វង់តាមអង្កត់ផ្ចិត",
    "question": "បើ D ជាអង្កត់ផ្ចិត រូបមន្តបរិមាត្ររង្វង់គឺ ៖",
    "options": [
      {
        "text": "P = D ÷ π",
        "isCorrect": false
      },
      {
        "text": "P = D × 4",
        "isCorrect": false
      },
      {
        "text": "P = D² × π",
        "isCorrect": false
      },
      {
        "text": "P = D × π",
        "isCorrect": true
      }
    ],
    "explanation": "P = D × π (π ≈ 3.14)។",
    "points": 1
  },
  {
    "id": 14,
    "part": "ផ្នែកទី៣ ៖ បរិមាត្ររង្វង់",
    "partSubtitle": "រូបមន្តបរិមាត្ររង្វង់តាមកាំ",
    "question": "បើ R ជាកាំនៃរង្វង់ រូបមន្តបរិមាត្ររង្វង់គឺ ៖",
    "options": [
      {
        "text": "P = R × π",
        "isCorrect": false
      },
      {
        "text": "P = 2 × R × π",
        "isCorrect": true
      },
      {
        "text": "P = R² × π",
        "isCorrect": false
      },
      {
        "text": "P = 4 × R × π",
        "isCorrect": false
      }
    ],
    "explanation": "P = 2 × π × R (ព្រោះ D = 2R)។",
    "points": 1
  },
  {
    "id": 15,
    "part": "ផ្នែកទី៣ ៖ បរិមាត្ររង្វង់",
    "partSubtitle": "តម្លៃប្រហែលនៃ π",
    "question": "ជាទូទៅគេយកតម្លៃប្រហែលនៃ π ស្មើនឹង ៖",
    "options": [
      {
        "text": "3.41",
        "isCorrect": false
      },
      {
        "text": "3.14 ឬ 22/7",
        "isCorrect": true
      },
      {
        "text": "3.12",
        "isCorrect": false
      },
      {
        "text": "3.04",
        "isCorrect": false
      }
    ],
    "explanation": "π ≈ 3.14 ឬ 22/7។",
    "points": 1
  },
  {
    "id": 16,
    "part": "ផ្នែកទី៣ ៖ បរិមាត្ររង្វង់",
    "partSubtitle": "គណនាបរិមាត្ររង្វង់",
    "question": "រង្វង់មួយមានអង្កត់ផ្ចិត D = 10cm។ រកបរិមាត្រ (យក π = 3.14) ៖",
    "options": [
      {
        "text": "62.8 cm",
        "isCorrect": false
      },
      {
        "text": "314 cm",
        "isCorrect": false
      },
      {
        "text": "15.7 cm",
        "isCorrect": false
      },
      {
        "text": "31.4 cm",
        "isCorrect": true
      }
    ],
    "explanation": "P = 10 × 3.14 = 31.4 cm។",
    "points": 1
  },
  {
    "id": 17,
    "part": "ផ្នែកទី៣ ៖ បរិមាត្ររង្វង់",
    "partSubtitle": "គណនាបរិមាត្ររង្វង់",
    "question": "រង្វង់មួយមានកាំ R = 5m។ រកបរិមាត្រ (យក π = 3.14) ៖",
    "options": [
      {
        "text": "31.4 m",
        "isCorrect": true
      },
      {
        "text": "15.7 m",
        "isCorrect": false
      },
      {
        "text": "78.5 m",
        "isCorrect": false
      },
      {
        "text": "62.8 m",
        "isCorrect": false
      }
    ],
    "explanation": "P = 2 × 3.14 × 5 = 31.4 m។",
    "points": 1
  },
  {
    "id": 18,
    "part": "ផ្នែកទី៣ ៖ បរិមាត្ររង្វង់",
    "partSubtitle": "គណនាបរិមាត្ររង្វង់",
    "question": "រង្វង់មួយមានកាំ R = 4cm។ រកបរិមាត្រ (យក π = 3.14) ៖",
    "options": [
      {
        "text": "50.24 cm",
        "isCorrect": false
      },
      {
        "text": "12.56 cm",
        "isCorrect": false
      },
      {
        "text": "25.12 cm",
        "isCorrect": true
      },
      {
        "text": "24 cm",
        "isCorrect": false
      }
    ],
    "explanation": "P = 2 × 3.14 × 4 = 25.12 cm។",
    "points": 1
  },
  {
    "id": 19,
    "part": "ផ្នែកទី៣ ៖ បរិមាត្ររង្វង់",
    "partSubtitle": "រកកាំពីរង្វង់",
    "question": "រង្វង់មួយមានបរិមាត្រ 13.188m។ រកប្រវែងកាំនៃរង្វង់ (យក π = 3.14) ៖",
    "options": [
      {
        "text": "3.14 m",
        "isCorrect": false
      },
      {
        "text": "4.2 m",
        "isCorrect": false
      },
      {
        "text": "1.5 m",
        "isCorrect": false
      },
      {
        "text": "2.1 m",
        "isCorrect": true
      }
    ],
    "explanation": "R = P ÷ (2 × π) = 13.188 ÷ 6.28 = 2.1 m។",
    "points": 1
  },
  {
    "id": 20,
    "part": "ផ្នែកទី៣ ៖ បរិមាត្ររង្វង់",
    "partSubtitle": "រកអង្កត់ផ្ចិត",
    "question": "រង្វង់មួយមានបរិមាត្រ 62.8cm។ រកអង្កត់ផ្ចិត (យក π = 3.14) ៖",
    "options": [
      {
        "text": "10 cm",
        "isCorrect": false
      },
      {
        "text": "20 cm",
        "isCorrect": true
      },
      {
        "text": "40 cm",
        "isCorrect": false
      },
      {
        "text": "15 cm",
        "isCorrect": false
      }
    ],
    "explanation": "D = P ÷ π = 62.8 ÷ 3.14 = 20 cm។",
    "points": 1
  },
  {
    "id": 21,
    "part": "ផ្នែកទី៤ ៖ បរិមាត្ររូបផ្គុំ",
    "partSubtitle": "រូបផ្គុំចតុកោណ និងកន្លះរង្វង់",
    "question": "ទ្វារមួយមានរាងចតុកោណកែងទទឹង 4m កម្ពស់ 3m ខាងលើមានកន្លះរង្វង់ (D=4m)។ រកបរិមាត្រទ្វារ ៖",
    "options": [
      {
        "text": "18.28 m",
        "isCorrect": false
      },
      {
        "text": "14 m",
        "isCorrect": false
      },
      {
        "text": "16.28 m",
        "isCorrect": true
      },
      {
        "text": "20 m",
        "isCorrect": false
      }
    ],
    "explanation": "កន្លះបរិមាត្ររង្វង់ = (4 × 3.14) ÷ 2 = 6.28m; ជ្រុង ៣ នៃចតុកោណ = 3 + 4 + 3 = 10m ➔ P = 10 + 6.28 = 16.28 m (ឬ 12.28m បើមិនគិតបាត)។",
    "points": 1
  },
  {
    "id": 22,
    "part": "ផ្នែកទី៤ ៖ បរិមាត្ររូបផ្គុំ",
    "partSubtitle": "រូបកាំជណ្តើរ",
    "question": "រូបរាងអក្សរ L មានជ្រុង 10m, 15m, 5m, 11m, 18m... បរិមាត្រស្មើនឹង ៖",
    "options": [
      {
        "text": "ផលបូកជ្រុងខាងក្រៅទាំងអស់",
        "isCorrect": true
      },
      {
        "text": "ផលគុណជ្រុង",
        "isCorrect": false
      },
      {
        "text": "ផ្ទៃក្រឡា",
        "isCorrect": false
      },
      {
        "text": "កន្លះបរិមាត្រ",
        "isCorrect": false
      }
    ],
    "explanation": "បរិមាត្រនៃរូបផ្គុំ គឺជាផលបូកប្រវែងជ្រុងខាងក្រៅទាំងអស់ដែលព័ទ្ធជុំវិញរូប។",
    "points": 1
  },
  {
    "id": 23,
    "part": "ផ្នែកទី៤ ៖ បរិមាត្ររូបផ្គុំ",
    "partSubtitle": "កន្លះរង្វង់",
    "question": "កន្លះរង្វង់មានកាំ R = 7cm (យក π = 22/7)។ រកប្រវែងធ្នូកន្លះរង្វង់ ៖",
    "options": [
      {
        "text": "14 cm",
        "isCorrect": false
      },
      {
        "text": "44 cm",
        "isCorrect": false
      },
      {
        "text": "22 cm",
        "isCorrect": true
      },
      {
        "text": "36 cm",
        "isCorrect": false
      }
    ],
    "explanation": "ប្រវែងធ្នូ = π × R = (22/7) × 7 = 22 cm។",
    "points": 1
  },
  {
    "id": 24,
    "part": "ផ្នែកទី៤ ៖ បរិមាត្ររូបផ្គុំ",
    "partSubtitle": "បរិមាត្រកន្លះរង្វង់បិទជិត",
    "question": "កន្លះរង្វង់បិទជិតមានកាំ R = 7cm (យក π = 22/7)។ រកបរិមាត្រសរុប ៖",
    "options": [
      {
        "text": "29 cm",
        "isCorrect": false
      },
      {
        "text": "22 cm",
        "isCorrect": false
      },
      {
        "text": "44 cm",
        "isCorrect": false
      },
      {
        "text": "36 cm",
        "isCorrect": true
      }
    ],
    "explanation": "P = ធ្នូ + អង្កត់ផ្ចិត = 22 + 14 = 36 cm។",
    "points": 1
  },
  {
    "id": 25,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "រង្វះរបងព័ទ្ធជុំវិញ",
    "question": "ដីចតុកោណកែងមួយមានបណ្តោយ 25m និងទទឹង 15m។ គេចង់ធ្វើរបងព័ទ្ធជុំវិញ។ តើរបងមានប្រវែងប៉ុន្មាន?",
    "options": [
      {
        "text": "40 m",
        "isCorrect": false
      },
      {
        "text": "80 m",
        "isCorrect": true
      },
      {
        "text": "375 m",
        "isCorrect": false
      },
      {
        "text": "75 m",
        "isCorrect": false
      }
    ],
    "explanation": "P = (25 + 15) × 2 = 40 × 2 = 80 m។",
    "points": 1
  },
  {
    "id": 26,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទលួសបន្លា",
    "question": "ចតុកោណកែងមានបណ្តោយ 4m ទទឹង 2m។ គេមានខ្សែលួស 84m។ តើអាចព័ទ្ធជុំវិញបានប៉ុន្មានជុំ?",
    "options": [
      {
        "text": "7 ជុំ",
        "isCorrect": true
      },
      {
        "text": "6 ជុំ",
        "isCorrect": false
      },
      {
        "text": "8 ជុំ",
        "isCorrect": false
      },
      {
        "text": "14 ជុំ",
        "isCorrect": false
      }
    ],
    "explanation": "បរិមាត្រ ១ ជុំ = (4 + 2) × 2 = 12m ➔ ចំនួនជុំ = 84 ÷ 12 = 7 ជុំ។",
    "points": 1
  },
  {
    "id": 27,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "កង់រទេះរមៀល",
    "question": "កង់រទេះមួយមានកាំ R = 0.5m (យក π = 3.14)។ រកចម្ងាយដែលកង់រមៀលបាន ១ ជុំ ៖",
    "options": [
      {
        "text": "0.785 m",
        "isCorrect": false
      },
      {
        "text": "1.57 m",
        "isCorrect": false
      },
      {
        "text": "6.28 m",
        "isCorrect": false
      },
      {
        "text": "3.14 m",
        "isCorrect": true
      }
    ],
    "explanation": "ចម្ងាយ ១ ជុំ = បរិមាត្រ = 2 × 3.14 × 0.5 = 3.14 m។",
    "points": 1
  },
  {
    "id": 28,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "កង់កង់វិល",
    "question": "កង់ A មានកាំ 3cm វិលបាន 7 ជុំក្នុង 1mn។ កង់ B មានកាំ 5cm វិលបាន 4 ជុំក្នុង 1mn។ តើកង់ណាវិលបានចម្ងាយវែងជាង?",
    "options": [
      {
        "text": "កង់ A (131.88cm > 125.6cm)",
        "isCorrect": true
      },
      {
        "text": "កង់ B",
        "isCorrect": false
      },
      {
        "text": "ស្មើគ្នា",
        "isCorrect": false
      },
      {
        "text": "មិនអាចប្រៀបធៀបបាន",
        "isCorrect": false
      }
    ],
    "explanation": "កង់ A = 2 × 3.14 × 3 × 7 = 131.88cm; កង់ B = 2 × 3.14 × 5 × 4 = 125.6cm ➔ កង់ A វែងជាង។",
    "points": 1
  },
  {
    "id": 29,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "រុំខ្សែលើស៊ីឡាំង",
    "question": "គេមានខ្សែប្រវែង 3 140cm រុំលើបំពង់ស៊ីឡាំងមានអង្កត់ផ្ចិត 10cm (យក π = 3.14)។ តើរុំបានប៉ុន្មានជុំ?",
    "options": [
      {
        "text": "31.4 ជុំ",
        "isCorrect": false
      },
      {
        "text": "50 ជុំ",
        "isCorrect": false
      },
      {
        "text": "100 ជុំ",
        "isCorrect": true
      },
      {
        "text": "10 ជុំ",
        "isCorrect": false
      }
    ],
    "explanation": "បរិមាត្រ ១ ជុំ = 10 × 3.14 = 31.4cm ➔ ចំនួនជុំ = 3140 ÷ 31.4 = 100 ជុំ។",
    "points": 1
  },
  {
    "id": 30,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទរបងទុកច្រកទ្វារ",
    "question": "ដីចតុកោណកែងបណ្តោយ 30m ទទឹង 20m គេធ្វើរបងព័ទ្ធជុំវិញដោយទុកច្រកទ្វារ 4m។ រកប្រវែងរបង ៖",
    "options": [
      {
        "text": "100 m",
        "isCorrect": false
      },
      {
        "text": "96 m",
        "isCorrect": true
      },
      {
        "text": "98 m",
        "isCorrect": false
      },
      {
        "text": "92 m",
        "isCorrect": false
      }
    ],
    "explanation": "បរិមាត្រ = (30 + 20) × 2 = 100m ➔ ប្រវែងរបង = 100 - 4 = 96 m។",
    "points": 1
  },
  {
    "id": 31,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "រត់ជុំវិញតារាងបាល់",
    "question": "តារាងបាល់ទាត់បណ្តោយ 105m ទទឹង 68m។ សិស្សម្នាក់រត់ ៣ ជុំ។ តើគាត់រត់បានចម្ងាយសរុបប៉ុន្មាន?",
    "options": [
      {
        "text": "1 038 m",
        "isCorrect": true
      },
      {
        "text": "346 m",
        "isCorrect": false
      },
      {
        "text": "692 m",
        "isCorrect": false
      },
      {
        "text": "1 200 m",
        "isCorrect": false
      }
    ],
    "explanation": "បរិមាត្រ ១ ជុំ = (105 + 68) × 2 = 346m ➔ ៣ ជុំ = 346 × 3 = 1038 m។",
    "points": 1
  },
  {
    "id": 32,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ដីការេដាំផ្កា",
    "question": "សួនផ្ការាងការេមានបរិមាត្រ 48m។ រកប្រវែងជ្រុងសួន ៖",
    "options": [
      {
        "text": "24 m",
        "isCorrect": false
      },
      {
        "text": "12 m",
        "isCorrect": true
      },
      {
        "text": "16 m",
        "isCorrect": false
      },
      {
        "text": "8 m",
        "isCorrect": false
      }
    ],
    "explanation": "ជ្រុង = 48 ÷ 4 = 12 m។",
    "points": 1
  },
  {
    "id": 33,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណាយធ្វើរបង",
    "question": "ដីចតុកោណកែងបណ្តោយ 18m ទទឹង 12m។ ថ្លៃធ្វើរបង 1m អស់ 15$។ តើត្រូវចំណាយសរុបប៉ុន្មាន?",
    "options": [
      {
        "text": "600 $",
        "isCorrect": false
      },
      {
        "text": "450 $",
        "isCorrect": false
      },
      {
        "text": "300 $",
        "isCorrect": false
      },
      {
        "text": "900 $",
        "isCorrect": true
      }
    ],
    "explanation": "P = (18 + 12) × 2 = 60m ➔ ចំណាយ = 60 × 15$ = 900 $។",
    "points": 1
  },
  {
    "id": 34,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "កង់ម៉ូតូ",
    "question": "កង់ម៉ូតូមានអង្កត់ផ្ចិត 60cm (យក π = 3.14)។ ពេលកង់វិលបាន 500 ជុំ តើម៉ូតូធ្វើដំណើរបានចម្ងាយប៉ុន្មាន?",
    "options": [
      {
        "text": "94.2 m",
        "isCorrect": false
      },
      {
        "text": "188.4 m",
        "isCorrect": false
      },
      {
        "text": "942 m",
        "isCorrect": true
      },
      {
        "text": "1 884 m",
        "isCorrect": false
      }
    ],
    "explanation": "P = 0.60m × 3.14 = 1.884m ➔ 500 ជុំ = 1.884 × 500 = 942 m។",
    "points": 1
  },
  {
    "id": 35,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ស៊ុមរូបថត",
    "question": "ស៊ុមរូបថតរាងចតុកោណកែងមានទំហំ 20cm × 30cm។ រកប្រវែងបន្ទះឈើសម្រាប់ធ្វើស៊ុម ៖",
    "options": [
      {
        "text": "50 cm",
        "isCorrect": false
      },
      {
        "text": "100 cm",
        "isCorrect": true
      },
      {
        "text": "600 cm",
        "isCorrect": false
      },
      {
        "text": "120 cm",
        "isCorrect": false
      }
    ],
    "explanation": "P = (30 + 20) × 2 = 100 cm = 1 m។",
    "points": 1
  },
  {
    "id": 36,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "អណ្តូងទឹក",
    "question": "មាត់អណ្តូងរាងរង្វង់មានកាំ 0.7m (យក π = 22/7)។ រកបរិមាត្រមាត់អណ្តូង ៖",
    "options": [
      {
        "text": "1.54 m",
        "isCorrect": false
      },
      {
        "text": "2.2 m",
        "isCorrect": false
      },
      {
        "text": "4.4 m",
        "isCorrect": true
      },
      {
        "text": "8.8 m",
        "isCorrect": false
      }
    ],
    "explanation": "P = 2 × (22/7) × 0.7 = 4.4 m។",
    "points": 1
  },
  {
    "id": 37,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ដីរាងត្រីកោណ",
    "question": "ដីមួយមានរាងត្រីកោណជ្រុង 15m, 20m, 25m។ រកបរិមាត្រដី ៖",
    "options": [
      {
        "text": "60 m",
        "isCorrect": true
      },
      {
        "text": "50 m",
        "isCorrect": false
      },
      {
        "text": "70 m",
        "isCorrect": false
      },
      {
        "text": "55 m",
        "isCorrect": false
      }
    ],
    "explanation": "P = 15 + 20 + 25 = 60 m។",
    "points": 1
  },
  {
    "id": 38,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ប្រៀបធៀបបរិមាត្រ",
    "question": "ការេជ្រុង 6cm និងចតុកោណកែង 8cm × 4cm។ តើរូបណាមានបរិមាត្រធំជាង?",
    "options": [
      {
        "text": "មិនអាចប្រៀបធៀបបាន",
        "isCorrect": false
      },
      {
        "text": "ការេធំជាង",
        "isCorrect": false
      },
      {
        "text": "ចតុកោណកែងធំជាង",
        "isCorrect": false
      },
      {
        "text": "ស្មើគ្នា (24 cm)",
        "isCorrect": true
      }
    ],
    "explanation": "ការេ P = 6 × 4 = 24cm; ចតុកោណកែង P = (8 + 4) × 2 = 24cm ➔ ស្មើគ្នា។",
    "points": 1
  },
  {
    "id": 39,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ខ្សែចងប្រអប់",
    "question": "ប្រអប់មួយបណ្តោយ 40cm ទទឹង 30cm។ គេចងខ្សែព័ទ្ធជុំវិញ ១ ជុំ និងទុកក្បាលចង 15cm។ តើត្រូវប្រើខ្សែប្រវែងប៉ុន្មាន?",
    "options": [
      {
        "text": "120 cm",
        "isCorrect": false
      },
      {
        "text": "140 cm",
        "isCorrect": false
      },
      {
        "text": "155 cm",
        "isCorrect": true
      },
      {
        "text": "170 cm",
        "isCorrect": false
      }
    ],
    "explanation": "P = (40 + 30) × 2 = 140cm; ខ្សែសរុប = 140 + 15 = 155 cm។",
    "points": 1
  },
  {
    "id": 40,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ទំហំកង់ឡាន",
    "question": "កង់ឡានមានកាំ 35cm (យក π = 22/7)។ រកបរិមាត្រកង់ ៖",
    "options": [
      {
        "text": "110 cm",
        "isCorrect": false
      },
      {
        "text": "220 cm",
        "isCorrect": true
      },
      {
        "text": "440 cm",
        "isCorrect": false
      },
      {
        "text": "70 cm",
        "isCorrect": false
      }
    ],
    "explanation": "P = 2 × (22/7) × 35 = 220 cm = 2.2 m។",
    "points": 1
  }
];

export const LESSON_6_FORMULAS: MathFormulaSection[] = [
  {
    "title": "១. បរិមាត្រចតុកោណកែង និងការេ",
    "description": "រូបមន្តគណនា",
    "details": [
      "ចតុកោណកែង ៖ P = (បណ្តោយ + ទទឹង) × 2 = (a + b) × 2",
      "ការេ ៖ P = ជ្រុង × 4 = 4a"
    ]
  },
  {
    "title": "២. បរិមាត្ររង្វង់ (Circumference)",
    "description": "រូបមន្តគណនា",
    "details": [
      "P = D × π (តាមអង្កត់ផ្ចិត)",
      "P = 2 × π × R (តាមកាំ)",
      "តម្លៃប្រហែល π ≈ 3.14 ឬ 22/7"
    ]
  },
  {
    "title": "៣. គន្លឹះដោះស្រាយចំណោទ",
    "description": "ការអនុវត្ត",
    "details": [
      "ចម្ងាយកង់រមៀល N ជុំ = N × បរិមាត្រកង់",
      "ប្រវែងរបង = បរិមាត្រដី - ទំហំច្រកទ្វារ"
    ]
  }
];
