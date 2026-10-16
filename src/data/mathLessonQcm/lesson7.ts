import { MathQCMQuestion, MathFormulaSection } from '../mathQcmTypes';

export const LESSON_7_QUESTIONS: MathQCMQuestion[] = [
  {
    "id": 1,
    "part": "ផ្នែកទី១ ៖ ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "partSubtitle": "និយមន័យ 1cm²",
    "question": "តើ 1cm² ជាអ្វី?",
    "options": [
      {
        "text": "ជាផ្ទៃក្រឡានៃការេដែលមានរង្វាស់ជ្រុងស្មើនឹង 1cm",
        "isCorrect": true
      },
      {
        "text": "ជាប្រវែង 1cm",
        "isCorrect": false
      },
      {
        "text": "ជាមាឌ 1cm³",
        "isCorrect": false
      },
      {
        "text": "ជាផ្ទៃរង្វង់",
        "isCorrect": false
      }
    ],
    "explanation": "1cm² គឺជាផ្ទៃក្រឡានៃការេដែលមានជ្រុង 1cm (1cm × 1cm = 1cm²)។",
    "points": 1
  },
  {
    "id": 2,
    "part": "ផ្នែកទី១ ៖ ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "partSubtitle": "ឯកតា 1ca (សង់ទីអា)",
    "question": "1ca ស្មើនឹងប៉ុន្មានម៉ែត្រការ៉េ?",
    "options": [
      {
        "text": "10 m²",
        "isCorrect": false
      },
      {
        "text": "1 m²",
        "isCorrect": true
      },
      {
        "text": "100 m²",
        "isCorrect": false
      },
      {
        "text": "0.1 m²",
        "isCorrect": false
      }
    ],
    "explanation": "1ca (សង់ទីអា) = 1m² (ការេជ្រុង 1m)។",
    "points": 1
  },
  {
    "id": 3,
    "part": "ផ្នែកទី១ ៖ ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "partSubtitle": "ឯកតា 1a (អា)",
    "question": "1a (មួយអា) ស្មើនឹងប៉ុន្មានម៉ែត្រការ៉េ?",
    "options": [
      {
        "text": "10 000 m²",
        "isCorrect": false
      },
      {
        "text": "10 m²",
        "isCorrect": false
      },
      {
        "text": "1 000 m²",
        "isCorrect": false
      },
      {
        "text": "100 m²",
        "isCorrect": true
      }
    ],
    "explanation": "1a = 10m × 10m = 100 m²។",
    "points": 1
  },
  {
    "id": 4,
    "part": "ផ្នែកទី១ ៖ ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "partSubtitle": "ឯកតា 1ha (ហិកតា)",
    "question": "1ha (មួយហិកតា) ស្មើនឹងប៉ុន្មានម៉ែត្រការ៉េ?",
    "options": [
      {
        "text": "100 000 m²",
        "isCorrect": false
      },
      {
        "text": "1 000 m²",
        "isCorrect": false
      },
      {
        "text": "10 000 m²",
        "isCorrect": true
      },
      {
        "text": "100 m²",
        "isCorrect": false
      }
    ],
    "explanation": "1ha = 100m × 100m = 10 000 m² = 100 a។",
    "points": 1
  },
  {
    "id": 5,
    "part": "ផ្នែកទី១ ៖ ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "partSubtitle": "ប្តូរឯកតា km² ទៅ m²",
    "question": "1km² ស្មើនឹងប៉ុន្មានម៉ែត្រការ៉េ?",
    "options": [
      {
        "text": "1 000 000 m²",
        "isCorrect": true
      },
      {
        "text": "100 000 m²",
        "isCorrect": false
      },
      {
        "text": "10 000 m²",
        "isCorrect": false
      },
      {
        "text": "100 m²",
        "isCorrect": false
      }
    ],
    "explanation": "1km² = 1000m × 1000m = 1 000 000 m² = 100 ha។",
    "points": 1
  },
  {
    "id": 6,
    "part": "ផ្នែកទី១ ៖ ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "partSubtitle": "ប្តូរឯកតា km² ទៅ ha",
    "question": "1km² ស្មើនឹងប៉ុន្មានហិកតា?",
    "options": [
      {
        "text": "1 000 ha",
        "isCorrect": false
      },
      {
        "text": "10 ha",
        "isCorrect": false
      },
      {
        "text": "100 ha",
        "isCorrect": true
      },
      {
        "text": "10 000 ha",
        "isCorrect": false
      }
    ],
    "explanation": "1km² = 100 ha។",
    "points": 1
  },
  {
    "id": 7,
    "part": "ផ្នែកទី១ ៖ ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "partSubtitle": "ប្តូរឯកតា",
    "question": "3ha 25a 7ca ស្មើនឹងប៉ុន្មានម៉ែត្រការ៉េ?",
    "options": [
      {
        "text": "32 507 m²",
        "isCorrect": true
      },
      {
        "text": "3 257 m²",
        "isCorrect": false
      },
      {
        "text": "325 007 m²",
        "isCorrect": false
      },
      {
        "text": "32 570 m²",
        "isCorrect": false
      }
    ],
    "explanation": "3ha = 30000m², 25a = 2500m², 7ca = 7m² ➔ 32 507 m²។",
    "points": 1
  },
  {
    "id": 8,
    "part": "ផ្នែកទី១ ៖ ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "partSubtitle": "ប្តូរឯកតា a ទៅ m²",
    "question": "37.75a ស្មើនឹងប៉ុន្មានម៉ែត្រការ៉េ?",
    "options": [
      {
        "text": "377.5 m²",
        "isCorrect": false
      },
      {
        "text": "3 775 m²",
        "isCorrect": true
      },
      {
        "text": "37 750 m²",
        "isCorrect": false
      },
      {
        "text": "375 m²",
        "isCorrect": false
      }
    ],
    "explanation": "37.75 × 100 = 3 775 m²។",
    "points": 1
  },
  {
    "id": 9,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង ការេ និងត្រីកោណ",
    "partSubtitle": "រូបមន្តផ្ទៃក្រឡាចតុកោណកែង",
    "question": "បើ a ជាទទឹង និង b ជាបណ្តោយ រូបមន្តផ្ទៃក្រឡាចតុកោណកែងគឺ ៖",
    "options": [
      {
        "text": "A = (a × b) ÷ 2",
        "isCorrect": false
      },
      {
        "text": "A = (a + b) × 2",
        "isCorrect": false
      },
      {
        "text": "A = a²",
        "isCorrect": false
      },
      {
        "text": "A = a × b",
        "isCorrect": true
      }
    ],
    "explanation": "ផ្ទៃក្រឡាចតុកោណកែង A = ទទឹង × បណ្តោយ = a × b។",
    "points": 1
  },
  {
    "id": 10,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង ការេ និងត្រីកោណ",
    "partSubtitle": "គណនាផ្ទៃក្រឡាចតុកោណកែង",
    "question": "ចតុកោណកែងមួយមានបណ្តោយ 4cm និងទទឹង 3cm។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "12 cm²",
        "isCorrect": true
      },
      {
        "text": "14 cm²",
        "isCorrect": false
      },
      {
        "text": "7 cm²",
        "isCorrect": false
      },
      {
        "text": "24 cm²",
        "isCorrect": false
      }
    ],
    "explanation": "A = 4 × 3 = 12 cm²។",
    "points": 1
  },
  {
    "id": 11,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង ការេ និងត្រីកោណ",
    "partSubtitle": "រូបមន្តផ្ទៃក្រឡាការេ",
    "question": "បើ a ជាជ្រុងនៃការេ រូបមន្តផ្ទៃក្រឡាការេគឺ ៖",
    "options": [
      {
        "text": "A = 2a",
        "isCorrect": false
      },
      {
        "text": "A = 4a",
        "isCorrect": false
      },
      {
        "text": "A = a × a (ឬ a²)",
        "isCorrect": true
      },
      {
        "text": "A = a² ÷ 2",
        "isCorrect": false
      }
    ],
    "explanation": "A = ជ្រុង × ជ្រុង = a²។",
    "points": 1
  },
  {
    "id": 12,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង ការេ និងត្រីកោណ",
    "partSubtitle": "គណនាផ្ទៃក្រឡាការេ",
    "question": "ការេមួយមានជ្រុង 5m។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "50 m²",
        "isCorrect": false
      },
      {
        "text": "20 m²",
        "isCorrect": false
      },
      {
        "text": "10 m²",
        "isCorrect": false
      },
      {
        "text": "25 m²",
        "isCorrect": true
      }
    ],
    "explanation": "A = 5 × 5 = 25 m²។",
    "points": 1
  },
  {
    "id": 13,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង ការេ និងត្រីកោណ",
    "partSubtitle": "រូបមន្តផ្ទៃក្រឡាត្រីកោណ",
    "question": "បើ a ជាបាត និង h ជាកម្ពស់ រូបមន្តផ្ទៃក្រឡាត្រីកោណគឺ ៖",
    "options": [
      {
        "text": "A = a × h",
        "isCorrect": false
      },
      {
        "text": "A = (a × h) ÷ 2",
        "isCorrect": true
      },
      {
        "text": "A = a + h",
        "isCorrect": false
      },
      {
        "text": "A = 2 × a × h",
        "isCorrect": false
      }
    ],
    "explanation": "A = (បាត × កម្ពស់) ÷ 2។",
    "points": 1
  },
  {
    "id": 14,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង ការេ និងត្រីកោណ",
    "partSubtitle": "គណនាផ្ទៃក្រឡាត្រីកោណ",
    "question": "ត្រីកោណមួយមានបាត 4cm និងកម្ពស់ 3cm។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "12 cm²",
        "isCorrect": false
      },
      {
        "text": "6 cm²",
        "isCorrect": true
      },
      {
        "text": "7 cm²",
        "isCorrect": false
      },
      {
        "text": "14 cm²",
        "isCorrect": false
      }
    ],
    "explanation": "A = (4 × 3) ÷ 2 = 6 cm²។",
    "points": 1
  },
  {
    "id": 15,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង ការេ និងត្រីកោណ",
    "partSubtitle": "ផ្ទៃក្រឡាត្រីកោណកែង",
    "question": "ត្រីកោណកែងមួយមានជ្រុងកែង 5cm និង 4.2cm។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "12.5 cm²",
        "isCorrect": false
      },
      {
        "text": "21 cm²",
        "isCorrect": false
      },
      {
        "text": "9.2 cm²",
        "isCorrect": false
      },
      {
        "text": "10.5 cm²",
        "isCorrect": true
      }
    ],
    "explanation": "A = (5 × 4.2) ÷ 2 = 10.5 cm²។",
    "points": 1
  },
  {
    "id": 16,
    "part": "ផ្នែកទី២ ៖ ចតុកោណកែង ការេ និងត្រីកោណ",
    "partSubtitle": "គណនាផ្ទៃត្រីកោណ",
    "question": "ត្រីកោណមានបាត 10cm និងកម្ពស់ 8cm។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "40 cm²",
        "isCorrect": true
      },
      {
        "text": "80 cm²",
        "isCorrect": false
      },
      {
        "text": "18 cm²",
        "isCorrect": false
      },
      {
        "text": "20 cm²",
        "isCorrect": false
      }
    ],
    "explanation": "A = (10 × 8) ÷ 2 = 40 cm²។",
    "points": 1
  },
  {
    "id": 17,
    "part": "ផ្នែកទី៣ ៖ ប្រលេឡូក្រាម និងចតុកោណព្នាយ",
    "partSubtitle": "រូបមន្តផ្ទៃក្រឡាប្រលេឡូក្រាម",
    "question": "បើ a ជាបាត និង h ជាកម្ពស់ រូបមន្តផ្ទៃប្រលេឡូក្រាមគឺ ៖",
    "options": [
      {
        "text": "A = 2(a + h)",
        "isCorrect": false
      },
      {
        "text": "A = (a × h) ÷ 2",
        "isCorrect": false
      },
      {
        "text": "A = a × h",
        "isCorrect": true
      },
      {
        "text": "A = a² × h",
        "isCorrect": false
      }
    ],
    "explanation": "ផ្ទៃក្រឡាប្រលេឡូក្រាម A = បាត × កម្ពស់ = a × h។",
    "points": 1
  },
  {
    "id": 18,
    "part": "ផ្នែកទី៣ ៖ ប្រលេឡូក្រាម និងចតុកោណព្នាយ",
    "partSubtitle": "គណនាផ្ទៃប្រលេឡូក្រាម",
    "question": "ប្រលេឡូក្រាមមួយមានបាត 5cm និងកម្ពស់ 3cm។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "16 cm²",
        "isCorrect": false
      },
      {
        "text": "8 cm²",
        "isCorrect": false
      },
      {
        "text": "7.5 cm²",
        "isCorrect": false
      },
      {
        "text": "15 cm²",
        "isCorrect": true
      }
    ],
    "explanation": "A = 5 × 3 = 15 cm²។",
    "points": 1
  },
  {
    "id": 19,
    "part": "ផ្នែកទី៣ ៖ ប្រលេឡូក្រាម និងចតុកោណព្នាយ",
    "partSubtitle": "គណនាផ្ទៃប្រលេឡូក្រាម",
    "question": "ប្រលេឡូក្រាមមួយមានបាត 4.2m និងកម្ពស់ 2.5m។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "21 m²",
        "isCorrect": false
      },
      {
        "text": "10.5 m²",
        "isCorrect": true
      },
      {
        "text": "6.7 m²",
        "isCorrect": false
      },
      {
        "text": "13.4 m²",
        "isCorrect": false
      }
    ],
    "explanation": "A = 4.2 × 2.5 = 10.5 m²។",
    "points": 1
  },
  {
    "id": 20,
    "part": "ផ្នែកទី៣ ៖ ប្រលេឡូក្រាម និងចតុកោណព្នាយ",
    "partSubtitle": "រូបមន្តផ្ទៃក្រឡាចតុកោណព្នាយ",
    "question": "បើ a ជាបាតតូច, b ជាបាតធំ, និង h ជាកម្ពស់ រូបមន្តចតុកោណព្នាយគឺ ៖",
    "options": [
      {
        "text": "A = a × b × h",
        "isCorrect": false
      },
      {
        "text": "A = (a + b) × h",
        "isCorrect": false
      },
      {
        "text": "A = ((a + b) × h) ÷ 2",
        "isCorrect": true
      },
      {
        "text": "A = (a × b) ÷ 2",
        "isCorrect": false
      }
    ],
    "explanation": "A = ((បាតតូច + បាតធំ) × កម្ពស់) ÷ 2។",
    "points": 1
  },
  {
    "id": 21,
    "part": "ផ្នែកទី៣ ៖ ប្រលេឡូក្រាម និងចតុកោណព្នាយ",
    "partSubtitle": "គណនាផ្ទៃចតុកោណព្នាយ",
    "question": "ចតុកោណព្នាយមួយមានបាតតូច 2m, បាតធំ 5m និងកម្ពស់ 3m។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "10.5 m²",
        "isCorrect": true
      },
      {
        "text": "21 m²",
        "isCorrect": false
      },
      {
        "text": "15 m²",
        "isCorrect": false
      },
      {
        "text": "7 m²",
        "isCorrect": false
      }
    ],
    "explanation": "A = ((2 + 5) × 3) ÷ 2 = 21 ÷ 2 = 10.5 m²។",
    "points": 1
  },
  {
    "id": 22,
    "part": "ផ្នែកទី៣ ៖ ប្រលេឡូក្រាម និងចតុកោណព្នាយ",
    "partSubtitle": "គណនាផ្ទៃចតុកោណព្នាយ",
    "question": "ចតុកោណព្នាយមានបាតតូច 4m, បាតធំ 5m និងកម្ពស់ 2.8m។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "14 m²",
        "isCorrect": false
      },
      {
        "text": "25.2 m²",
        "isCorrect": false
      },
      {
        "text": "12.6 m²",
        "isCorrect": true
      },
      {
        "text": "11.2 m²",
        "isCorrect": false
      }
    ],
    "explanation": "A = ((4 + 5) × 2.8) ÷ 2 = (9 × 2.8) ÷ 2 = 12.6 m²។",
    "points": 1
  },
  {
    "id": 23,
    "part": "ផ្នែកទី៣ ៖ ប្រលេឡូក្រាម និងចតុកោណព្នាយ",
    "partSubtitle": "រកកម្ពស់ចតុកោណព្នាយ",
    "question": "ចតុកោណព្នាយមានផ្ទៃ 8m², បាតតូច 3m និងបាតធំ 5m។ រកកម្ពស់ ៖",
    "options": [
      {
        "text": "3 m",
        "isCorrect": false
      },
      {
        "text": "4 m",
        "isCorrect": false
      },
      {
        "text": "1 m",
        "isCorrect": false
      },
      {
        "text": "2 m",
        "isCorrect": true
      }
    ],
    "explanation": "h = (2 × A) ÷ (a + b) = (2 × 8) ÷ (3 + 5) = 16 ÷ 8 = 2 m។",
    "points": 1
  },
  {
    "id": 24,
    "part": "ផ្នែកទី៤ ៖ ផ្ទៃក្រឡារង្វង់",
    "partSubtitle": "រូបមន្តផ្ទៃក្រឡារង្វង់",
    "question": "បើ R ជាកាំនៃរង្វង់ រូបមន្តផ្ទៃក្រឡារង្វង់គឺ ៖",
    "options": [
      {
        "text": "A = 2 × π × R",
        "isCorrect": false
      },
      {
        "text": "A = π × R²",
        "isCorrect": true
      },
      {
        "text": "A = π × D",
        "isCorrect": false
      },
      {
        "text": "A = (π × R) ÷ 2",
        "isCorrect": false
      }
    ],
    "explanation": "A = π × R² = π × R × R (π ≈ 3.14)។",
    "points": 1
  },
  {
    "id": 25,
    "part": "ផ្នែកទី៤ ៖ ផ្ទៃក្រឡារង្វង់",
    "partSubtitle": "គណនាផ្ទៃក្រឡារង្វង់",
    "question": "រង្វង់មួយមានកាំ R = 3cm (យក π = 3.14)។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "28.26 cm²",
        "isCorrect": true
      },
      {
        "text": "18.84 cm²",
        "isCorrect": false
      },
      {
        "text": "9.42 cm²",
        "isCorrect": false
      },
      {
        "text": "56.52 cm²",
        "isCorrect": false
      }
    ],
    "explanation": "A = 3.14 × 3 × 3 = 28.26 cm²។",
    "points": 1
  },
  {
    "id": 26,
    "part": "ផ្នែកទី៤ ៖ ផ្ទៃក្រឡារង្វង់",
    "partSubtitle": "គណនាផ្ទៃក្រឡារង្វង់",
    "question": "រង្វង់មួយមានកាំ R = 10m (យក π = 3.14)។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "157 m²",
        "isCorrect": false
      },
      {
        "text": "62.8 m²",
        "isCorrect": false
      },
      {
        "text": "31.4 m²",
        "isCorrect": false
      },
      {
        "text": "314 m²",
        "isCorrect": true
      }
    ],
    "explanation": "A = 3.14 × 10² = 314 m²។",
    "points": 1
  },
  {
    "id": 27,
    "part": "ផ្នែកទី៤ ៖ ផ្ទៃក្រឡារង្វង់",
    "partSubtitle": "គណនាផ្ទៃតាមអង្កត់ផ្ចិត",
    "question": "រង្វង់មួយមានអង្កត់ផ្ចិត D = 14m (យក π = 22/7)។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "154 m²",
        "isCorrect": true
      },
      {
        "text": "44 m²",
        "isCorrect": false
      },
      {
        "text": "616 m²",
        "isCorrect": false
      },
      {
        "text": "77 m²",
        "isCorrect": false
      }
    ],
    "explanation": "កាំ R = 7m ➔ A = (22/7) × 7 × 7 = 154 m²។",
    "points": 1
  },
  {
    "id": 28,
    "part": "ផ្នែកទី៤ ៖ ផ្ទៃក្រឡារង្វង់",
    "partSubtitle": "កន្លះរង្វង់",
    "question": "កន្លះរង្វង់មានកាំ R = 2cm (យក π = 3.14)។ រកផ្ទៃក្រឡា ៖",
    "options": [
      {
        "text": "3.14 cm²",
        "isCorrect": false
      },
      {
        "text": "12.56 cm²",
        "isCorrect": false
      },
      {
        "text": "6.28 cm²",
        "isCorrect": true
      },
      {
        "text": "4 cm²",
        "isCorrect": false
      }
    ],
    "explanation": "A = (3.14 × 2²) ÷ 2 = 12.56 ÷ 2 = 6.28 cm²។",
    "points": 1
  },
  {
    "id": 29,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ផ្ទៃក្រឡាកងរង្វង់",
    "question": "កងរង្វង់មានកាំធំ R = 5m និងកាំតូច r = 3m (យក π = 3.14)។ រកផ្ទៃកងរង្វង់ ៖",
    "options": [
      {
        "text": "78.5 m²",
        "isCorrect": false
      },
      {
        "text": "50.24 m²",
        "isCorrect": true
      },
      {
        "text": "28.26 m²",
        "isCorrect": false
      },
      {
        "text": "25 m²",
        "isCorrect": false
      }
    ],
    "explanation": "A = π(R² - r²) = 3.14 × (25 - 9) = 3.14 × 16 = 50.24 m²។",
    "points": 1
  },
  {
    "id": 30,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ផ្ទៃក្រឡារូបផ្គុំអក្សរ L",
    "question": "រូបរាងអក្សរ L បំបែកជាចតុកោណកែងពីរ 6m × 12m និង 14m × 5m។ រកផ្ទៃសរុប ៖",
    "options": [
      {
        "text": "142 m²",
        "isCorrect": true
      },
      {
        "text": "132 m²",
        "isCorrect": false
      },
      {
        "text": "152 m²",
        "isCorrect": false
      },
      {
        "text": "120 m²",
        "isCorrect": false
      }
    ],
    "explanation": "A = (6 × 12) + (14 × 5) = 72 + 70 = 142 m²។",
    "points": 1
  },
  {
    "id": 31,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ចំណោទដីស្រែ",
    "question": "ដីស្រែរាងចតុកោណព្នាយបាតតូច 65m, បាតធំ 102m, កម្ពស់ 40m។ ដី 1m² ផ្តល់ស្រូវ 0.25kg។ រកផលស្រូវសរុប ៖",
    "options": [
      {
        "text": "3 340 kg",
        "isCorrect": false
      },
      {
        "text": "835 kg",
        "isCorrect": true
      },
      {
        "text": "1 670 kg",
        "isCorrect": false
      },
      {
        "text": "417.5 kg",
        "isCorrect": false
      }
    ],
    "explanation": "ផ្ទៃក្រឡា = ((65 + 102) × 40) ÷ 2 = 3 340 m² ➔ ផលស្រូវ = 3340 × 0.25 = 835 kg។",
    "points": 1
  },
  {
    "id": 32,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ចំណោទកម្រាលឥដ្ឋ",
    "question": "បន្ទប់មួយទំហំ 6m × 4m គេក្រាលការ៉ូការេជ្រុង 40cm (0.4m)។ តើត្រូវការការ៉ូប៉ុន្មានសន្លឹក?",
    "options": [
      {
        "text": "240 សន្លឹក",
        "isCorrect": false
      },
      {
        "text": "120 សន្លឹក",
        "isCorrect": false
      },
      {
        "text": "60 សន្លឹក",
        "isCorrect": false
      },
      {
        "text": "150 សន្លឹក",
        "isCorrect": true
      }
    ],
    "explanation": "ផ្ទៃបន្ទប់ = 24m²; ផ្ទៃការ៉ូ ១ = 0.16m² ➔ ចំនួនការ៉ូ = 24 ÷ 0.16 = 150 សន្លឹក។",
    "points": 1
  },
  {
    "id": 33,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ចំណោទលាបថ្នាំជញ្ជាំង",
    "question": "ជញ្ជាំងមួយទំហំ 18m × 2.2m មានផ្ទៃក្រឡាស្មើនឹង ៖",
    "options": [
      {
        "text": "36 m²",
        "isCorrect": false
      },
      {
        "text": "40.4 m²",
        "isCorrect": false
      },
      {
        "text": "39.6 m²",
        "isCorrect": true
      },
      {
        "text": "20.2 m²",
        "isCorrect": false
      }
    ],
    "explanation": "A = 18 × 2.2 = 39.6 m²។",
    "points": 1
  },
  {
    "id": 34,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ចំណោទឥដ្ឋសាងសង់",
    "question": "ជញ្ជាំងផ្ទៃ 39.6m² បើ 1m² ប្រើឥដ្ឋ 50 ដុំ តើត្រូវការឥដ្ឋសរុបប៉ុន្មានដុំ?",
    "options": [
      {
        "text": "1 500 ដុំ",
        "isCorrect": false
      },
      {
        "text": "1 980 ដុំ",
        "isCorrect": true
      },
      {
        "text": "2 000 ដុំ",
        "isCorrect": false
      },
      {
        "text": "1 800 ដុំ",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនឥដ្ឋ = 39.6 × 50 = 1 980 ដុំ។",
    "points": 1
  },
  {
    "id": 35,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "អាងហែលទឹក",
    "question": "អាងហែលទឹករាងចតុកោណកែង 50m × 42m មានកន្លះរង្វង់សងខាង (D=42m, យក π = 22/7)។ រកផ្ទៃបាតអាង ៖",
    "options": [
      {
        "text": "1 386 m²",
        "isCorrect": false
      },
      {
        "text": "2 100 m²",
        "isCorrect": false
      },
      {
        "text": "3 486 m²",
        "isCorrect": true
      },
      {
        "text": "4 872 m²",
        "isCorrect": false
      }
    ],
    "explanation": "ផ្ទៃចតុកោណ = 50 × 42 = 2100m²; កន្លះរង្វង់ ២ = រង្វង់ ១ (R=21m) ➔ A = (22/7) × 21² = 1386m² ➔ សរុប = 2100 + 1386 = 3 486 m²។",
    "points": 1
  },
  {
    "id": 36,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ដំបូលផ្ទះ",
    "question": "ដំបូលផ្ទះមានផ្ទៃ 120m² គេប្រក់ក្បឿង 50 សន្លឹកក្នុង 1m²។ រកចំនួនក្បឿងសរុប ៖",
    "options": [
      {
        "text": "6 000 សន្លឹក",
        "isCorrect": true
      },
      {
        "text": "5 000 សន្លឹក",
        "isCorrect": false
      },
      {
        "text": "1 200 សន្លឹក",
        "isCorrect": false
      },
      {
        "text": "600 សន្លឹក",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនក្បឿង = 120 × 50 = 6 000 សន្លឹក។",
    "points": 1
  },
  {
    "id": 37,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ដីចតុកោណកែងរកបណ្តោយ",
    "question": "ដីមានផ្ទៃ 450m² និងទទឹង 15m។ រកប្រវែងបណ្តោយ ៖",
    "options": [
      {
        "text": "20 m",
        "isCorrect": false
      },
      {
        "text": "25 m",
        "isCorrect": false
      },
      {
        "text": "35 m",
        "isCorrect": false
      },
      {
        "text": "30 m",
        "isCorrect": true
      }
    ],
    "explanation": "បណ្តោយ = ផ្ទៃក្រឡា ÷ ទទឹង = 450 ÷ 15 = 30 m។",
    "points": 1
  },
  {
    "id": 38,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ផ្លូវដើរជុំវិញសួន",
    "question": "សួនច្បារការេ 20m × 20m មានផ្លូវដើរទទឹង 2m ព័ទ្ធជុំវិញខាងក្រៅ។ រកផ្ទៃផ្លូវដើរ ៖",
    "options": [
      {
        "text": "576 m²",
        "isCorrect": false
      },
      {
        "text": "400 m²",
        "isCorrect": false
      },
      {
        "text": "176 m²",
        "isCorrect": true
      },
      {
        "text": "96 m²",
        "isCorrect": false
      }
    ],
    "explanation": "ការេធំ = 24m × 24m = 576m²; ការេតូច = 400m² ➔ ផ្ទៃផ្លូវ = 576 - 400 = 176 m²។",
    "points": 1
  },
  {
    "id": 39,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ដីកសិកម្មគិតជាហិកតា",
    "question": "ដីស្រែបណ្តោយ 400m និងទទឹង 250m។ រកផ្ទៃក្រឡាដីគិតជាហិកតា (ha) ៖",
    "options": [
      {
        "text": "100 ha",
        "isCorrect": false
      },
      {
        "text": "10 ha",
        "isCorrect": true
      },
      {
        "text": "1 ha",
        "isCorrect": false
      },
      {
        "text": "5 ha",
        "isCorrect": false
      }
    ],
    "explanation": "A = 400 × 250 = 100 000 m² = 10 ha (1ha = 10 000 m²)។",
    "points": 1
  },
  {
    "id": 40,
    "part": "ផ្នែកទី៥ ៖ រូបផ្គុំ និងចំណោទ",
    "partSubtitle": "ផ្ទៃត្រីកោណក្នុងចតុកោណកែង",
    "question": "ចតុកោណកែងមួយមានផ្ទៃ 60cm²។ អង្កត់ទ្រូងចែកវាជាពីរត្រីកោណស្មើគ្នា។ រកផ្ទៃត្រីកោណនីមួយៗ ៖",
    "options": [
      {
        "text": "45 cm²",
        "isCorrect": false
      },
      {
        "text": "60 cm²",
        "isCorrect": false
      },
      {
        "text": "15 cm²",
        "isCorrect": false
      },
      {
        "text": "30 cm²",
        "isCorrect": true
      }
    ],
    "explanation": "A = 60 ÷ 2 = 30 cm²។",
    "points": 1
  }
];

export const LESSON_7_FORMULAS: MathFormulaSection[] = [
  {
    "title": "១. ឯកតារង្វាស់ផ្ទៃក្រឡា",
    "description": "ទំនាក់ទំនងឯកតា",
    "details": [
      "1a = 100 m²",
      "1ha = 10 000 m² = 100 a",
      "1km² = 1 000 000 m² = 100 ha"
    ]
  },
  {
    "title": "២. រូបមន្តផ្ទៃក្រឡាពហុកោណ",
    "description": "រូបមន្តសំខាន់ៗ",
    "details": [
      "ចតុកោណកែង ៖ A = a × b",
      "ការេ ៖ A = a²",
      "ត្រីកោណ ៖ A = (a × h) ÷ 2",
      "ប្រលេឡូក្រាម ៖ A = a × h",
      "ចតុកោណព្នាយ ៖ A = ((a + b) × h) ÷ 2"
    ]
  },
  {
    "title": "៣. ផ្ទៃក្រឡារង្វង់",
    "description": "រូបមន្តរង្វង់",
    "details": [
      "A = π × R² (R ជាកាំ, π ≈ 3.14)",
      "បើស្គាល់អង្កត់ផ្ចិត D ៖ R = D ÷ 2"
    ]
  }
];
