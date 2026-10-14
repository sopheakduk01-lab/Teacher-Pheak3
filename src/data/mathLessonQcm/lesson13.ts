import { MathQCMQuestion, MathFormulaSection } from '../mathQcmTypes';

export const LESSON_13_QUESTIONS: MathQCMQuestion[] = [
  {
    "id": 1,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "និយមន័យសមាមាត្រ",
    "question": "តើអ្វីទៅជាសមាមាត្រ?",
    "options": [
      {
        "text": "សមាមាត្រ គឺជាសមភាពនៃពីរផលធៀប (a/b = c/d)",
        "isCorrect": true
      },
      {
        "text": "សមាមាត្រ គឺជាផលបូកនៃពីរផលធៀប",
        "isCorrect": false
      },
      {
        "text": "សមាមាត្រ គឺជាផលគុណនៃពីរប្រភាគ",
        "isCorrect": false
      },
      {
        "text": "សមាមាត្រ គឺជាផលដកនៃពីរផលធៀប",
        "isCorrect": false
      }
    ],
    "explanation": "និយមន័យ ៖ សមាមាត្រ គឺជាសមភាពនៃពីរផលធៀប ៖ a/b = c/d (ឬ a : b = c : d)។",
    "points": 1
  },
  {
    "id": 2,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "តួចុង និងតួកណ្តាល",
    "question": "ក្នុងសមាមាត្រ a : b = c : d តើអ្វីជាតួចុង និងអ្វីជាតួកណ្តាល?",
    "options": [
      {
        "text": "a និង b ជាតួចុង, c និង d ជាតួកណ្តាល",
        "isCorrect": false
      },
      {
        "text": "a និង d ជាតួចុង, b និង c ជាតួកណ្តាល",
        "isCorrect": true
      },
      {
        "text": "b និង d ជាតួចុង, a និង c ជាតួកណ្តាល",
        "isCorrect": false
      },
      {
        "text": "a និង c ជាតួចុង, b និង d ជាតួកណ្តាល",
        "isCorrect": false
      }
    ],
    "explanation": "ក្នុងសមាមាត្រ a : b = c : d តួ a និង d ស្ថិតនៅសងខាងគេហៅថា «តួចុង (Extremes)» ហើយ b និង c ស្ថិតនៅកណ្តាលហៅថា «តួកណ្តាល (Means)»។",
    "points": 1
  },
  {
    "id": 3,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "លក្ខណៈគ្រឹះ (ផលគុណខ្វែង)",
    "question": "បើ a/b = c/d តើសមភាពណាត្រឹមត្រូវតាមលក្ខណៈគ្រឹះនៃសមាមាត្រ?",
    "options": [
      {
        "text": "a - d = b - c",
        "isCorrect": false
      },
      {
        "text": "a × c = b × d",
        "isCorrect": false
      },
      {
        "text": "a + d = b + c",
        "isCorrect": false
      },
      {
        "text": "a × d = b × c (ផលគុណចុងស្មើផលគុណកណ្តាល)",
        "isCorrect": true
      }
    ],
    "explanation": "លក្ខណៈគ្រឹះនៃសមាមាត្រ (ផលគុណខ្វែង) ៖ a/b = c/d <=> a × d = b × c។",
    "points": 1
  },
  {
    "id": 4,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "ការផ្ទៀងផ្ទាត់សមាមាត្រ",
    "question": "តើគូរនៃផលធៀបណាខាងក្រោមបង្កើតបានជាសមាមាត្រត្រឹមត្រូវ?",
    "options": [
      {
        "text": "2/5 និង 6/15",
        "isCorrect": true
      },
      {
        "text": "3/4 និង 5/8",
        "isCorrect": false
      },
      {
        "text": "1/3 និង 2/9",
        "isCorrect": false
      },
      {
        "text": "4/7 និង 8/15",
        "isCorrect": false
      }
    ],
    "explanation": "2 × 15 = 30 និង 5 × 6 = 30 ដូច្នេះ 2/5 = 6/15 បង្កើតបានជាសមាមាត្រ។",
    "points": 1
  },
  {
    "id": 5,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "ការផ្ទៀងផ្ទាត់សមាមាត្រ",
    "question": "តើគូផលធៀបណាខាងក្រោម មិនមែន ជាសមាមាត្រ?",
    "options": [
      {
        "text": "5/10 និង 1/2",
        "isCorrect": false
      },
      {
        "text": "4/6 និង 2/3",
        "isCorrect": false
      },
      {
        "text": "3/7 និង 6/15",
        "isCorrect": true
      },
      {
        "text": "8/12 និង 2/3",
        "isCorrect": false
      }
    ],
    "explanation": "3 × 15 = 45 ឯ 7 × 6 = 42 (45 ≠ 42) ដូច្នេះ 3/7 និង 6/15 មិនមែនជាសមាមាត្រទេ។",
    "points": 1
  },
  {
    "id": 6,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "សមាមាត្រស្មើគ្នា",
    "question": "បើ 3/4 = 9/12 តើផលគុណខ្វែងស្មើនឹងប៉ុន្មាន?",
    "options": [
      {
        "text": "12",
        "isCorrect": false
      },
      {
        "text": "24",
        "isCorrect": false
      },
      {
        "text": "48",
        "isCorrect": false
      },
      {
        "text": "36",
        "isCorrect": true
      }
    ],
    "explanation": "3 × 12 = 36 និង 4 × 9 = 36។ ផលគុណខ្វែងស្មើ 36។",
    "points": 1
  },
  {
    "id": 7,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "ផលគុណខ្វែង",
    "question": "បើ 5/8 = 15/24 តើ 5 × 24 ស្មើប៉ុន្មាន ហើយ 8 × 15 ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "ស្មើ 100 និង 120",
        "isCorrect": false
      },
      {
        "text": "ទាំងពីរស្មើ 120",
        "isCorrect": true
      },
      {
        "text": "ទាំងពីរស្មើ 140",
        "isCorrect": false
      },
      {
        "text": "ស្មើ 80 និង 120",
        "isCorrect": false
      }
    ],
    "explanation": "5 × 24 = 120 និង 8 × 15 = 120។ ទាំងពីរស្មើ 120។",
    "points": 1
  },
  {
    "id": 8,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "សមាមាត្រសរសេរជាទម្រង់ផ្សេង",
    "question": "ពីសមាមាត្រ a/b = c/d តើសមាមាត្រណាត្រឹមត្រូវផងដែរ?",
    "options": [
      {
        "text": "b/a = c/d",
        "isCorrect": false
      },
      {
        "text": "a/c = b/d (ប្តូរកន្លែងតួកណ្តាល)",
        "isCorrect": true
      },
      {
        "text": "a/d = b/c",
        "isCorrect": false
      },
      {
        "text": "d/b = a/c",
        "isCorrect": false
      }
    ],
    "explanation": "ក្នុងសមាមាត្រ យើងអាចប្តូរកន្លែងតួកណ្តាលបាន ៖ a/c = b/d ព្រោះ ad = bc ដដែល។",
    "points": 1
  },
  {
    "id": 9,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "ត្រឡប់សមាមាត្រ",
    "question": "បើ a/b = c/d តើ b/a ស្មើនឹងអ្វី?",
    "options": [
      {
        "text": "d/a",
        "isCorrect": false
      },
      {
        "text": "c/d",
        "isCorrect": false
      },
      {
        "text": "a/d",
        "isCorrect": false
      },
      {
        "text": "d/c",
        "isCorrect": true
      }
    ],
    "explanation": "ត្រឡប់ប្រភាគទាំងសងខាង ៖ b/a = d/c។",
    "points": 1
  },
  {
    "id": 10,
    "part": "ផ្នែកទី១ ៖ និយមន័យ និងលក្ខណៈគ្រឹះនៃសមាមាត្រ",
    "partSubtitle": "រូបមន្តរកតួមិនស្គាល់",
    "question": "ដើម្បីរកតួមិនស្គាល់ x ក្នុងសមាមាត្រ a/b = c/x តើគេត្រូវគណនាដូចម្តេច?",
    "options": [
      {
        "text": "x = (b × c) / a",
        "isCorrect": true
      },
      {
        "text": "x = (a × b) / c",
        "isCorrect": false
      },
      {
        "text": "x = (a × c) / b",
        "isCorrect": false
      },
      {
        "text": "x = a × b × c",
        "isCorrect": false
      }
    ],
    "explanation": "តាមផលគុណខ្វែង ៖ a × x = b × c => x = (b × c) / a។",
    "points": 1
  },
  {
    "id": 11,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួ x នៅភាគយក",
    "question": "រកតម្លៃ x ក្នុងសមាមាត្រ ៖ 2/3 = x/12",
    "options": [
      {
        "text": "9",
        "isCorrect": false
      },
      {
        "text": "6",
        "isCorrect": false
      },
      {
        "text": "8",
        "isCorrect": true
      },
      {
        "text": "10",
        "isCorrect": false
      }
    ],
    "explanation": "x = (2 × 12) / 3 = 24 / 3 = 8។",
    "points": 1
  },
  {
    "id": 12,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួ x នៅភាគបែង",
    "question": "រកតម្លៃ x ក្នុងសមាមាត្រ ៖ 5/x = 15/21",
    "options": [
      {
        "text": "9",
        "isCorrect": false
      },
      {
        "text": "6",
        "isCorrect": false
      },
      {
        "text": "8",
        "isCorrect": false
      },
      {
        "text": "7",
        "isCorrect": true
      }
    ],
    "explanation": "x = (5 × 21) / 15 = 105 / 15 = 7។",
    "points": 1
  },
  {
    "id": 13,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួ x នៅភាគយក",
    "question": "រកតម្លៃ x ក្នុងសមាមាត្រ ៖ x/8 = 9/24",
    "options": [
      {
        "text": "4",
        "isCorrect": false
      },
      {
        "text": "3",
        "isCorrect": true
      },
      {
        "text": "2",
        "isCorrect": false
      },
      {
        "text": "6",
        "isCorrect": false
      }
    ],
    "explanation": "x = (8 × 9) / 24 = 72 / 24 = 3។",
    "points": 1
  },
  {
    "id": 14,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួ x នៅភាគបែង",
    "question": "រកតម្លៃ x ក្នុងសមាមាត្រ ៖ 7/4 = 35/x",
    "options": [
      {
        "text": "28",
        "isCorrect": false
      },
      {
        "text": "25",
        "isCorrect": false
      },
      {
        "text": "20",
        "isCorrect": true
      },
      {
        "text": "16",
        "isCorrect": false
      }
    ],
    "explanation": "x = (4 × 35) / 7 = 140 / 7 = 20។",
    "points": 1
  },
  {
    "id": 15,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួមិនស្គាល់",
    "question": "រកតម្លៃ y ក្នុងសមាមាត្រ ៖ 6/9 = 10/y",
    "options": [
      {
        "text": "15",
        "isCorrect": true
      },
      {
        "text": "12",
        "isCorrect": false
      },
      {
        "text": "18",
        "isCorrect": false
      },
      {
        "text": "14",
        "isCorrect": false
      }
    ],
    "explanation": "y = (9 × 10) / 6 = 90 / 6 = 15។",
    "points": 1
  },
  {
    "id": 16,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួមិនស្គាល់",
    "question": "រកតម្លៃ m ក្នុងសមាមាត្រ ៖ m/15 = 4/5",
    "options": [
      {
        "text": "14",
        "isCorrect": false
      },
      {
        "text": "10",
        "isCorrect": false
      },
      {
        "text": "12",
        "isCorrect": true
      },
      {
        "text": "9",
        "isCorrect": false
      }
    ],
    "explanation": "m = (15 × 4) / 5 = 60 / 5 = 12។",
    "points": 1
  },
  {
    "id": 17,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួមិនស្គាល់ទសភាគ",
    "question": "រកតម្លៃ x ក្នុងសមាមាត្រ ៖ 1.5 / 3 = x / 6",
    "options": [
      {
        "text": "4.5",
        "isCorrect": false
      },
      {
        "text": "2.5",
        "isCorrect": false
      },
      {
        "text": "4",
        "isCorrect": false
      },
      {
        "text": "3",
        "isCorrect": true
      }
    ],
    "explanation": "x = (1.5 × 6) / 3 = 9 / 3 = 3។",
    "points": 1
  },
  {
    "id": 18,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួមិនស្គាល់",
    "question": "រកតម្លៃ k ក្នុងសមាមាត្រ ៖ 8/k = 24/30",
    "options": [
      {
        "text": "12",
        "isCorrect": false
      },
      {
        "text": "10",
        "isCorrect": true
      },
      {
        "text": "8",
        "isCorrect": false
      },
      {
        "text": "15",
        "isCorrect": false
      }
    ],
    "explanation": "k = (8 × 30) / 24 = 240 / 24 = 10។",
    "points": 1
  },
  {
    "id": 19,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួមិនស្គាល់",
    "question": "រកតម្លៃ a ក្នុងសមាមាត្រ ៖ 11/13 = a/52",
    "options": [
      {
        "text": "44",
        "isCorrect": true
      },
      {
        "text": "33",
        "isCorrect": false
      },
      {
        "text": "55",
        "isCorrect": false
      },
      {
        "text": "48",
        "isCorrect": false
      }
    ],
    "explanation": "a = (11 × 52) / 13 = 11 × 4 = 44។",
    "points": 1
  },
  {
    "id": 20,
    "part": "ផ្នែកទី២ ៖ ការស្វែងរកតួមិនស្គាល់ក្នុងសមាមាត្រ",
    "partSubtitle": "រកតួមិនស្គាល់",
    "question": "រកតម្លៃ n ក្នុងសមាមាត្រ ៖ 25/40 = n/8",
    "options": [
      {
        "text": "8",
        "isCorrect": false
      },
      {
        "text": "4",
        "isCorrect": false
      },
      {
        "text": "6",
        "isCorrect": false
      },
      {
        "text": "5",
        "isCorrect": true
      }
    ],
    "explanation": "n = (25 × 8) / 40 = 200 / 40 = 5។",
    "points": 1
  },
  {
    "id": 21,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "និយមន័យមាត្រដ្ឋាន",
    "question": "តើអ្វីទៅជាមាត្រដ្ឋាន (Scale)?",
    "options": [
      {
        "text": "ផលធៀបរវាងចម្ងាយលើប្លង់ និងចម្ងាយពិតជាក់ស្តែង (d / D)",
        "isCorrect": true
      },
      {
        "text": "ផលគុណរវាងចម្ងាយលើប្លង់ និងចម្ងាយពិត",
        "isCorrect": false
      },
      {
        "text": "ផលធៀបរវាងចម្ងាយពិត និងចម្ងាយលើប្លង់",
        "isCorrect": false
      },
      {
        "text": "ផលបូកចម្ងាយទាំងពីរ",
        "isCorrect": false
      }
    ],
    "explanation": "មាត្រដ្ឋាន = ចម្ងាយលើប្លង់ / ចម្ងាយពិត (Scale = d / D) ដែលឯកតាត្រូវតែដូចគ្នា។",
    "points": 1
  },
  {
    "id": 22,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "អត្ថន័យមាត្រដ្ឋាន",
    "question": "ផែនទីមួយមានមាត្រដ្ឋាន 1 : 100 000។ តើវាមានន័យដូចម្តេច?",
    "options": [
      {
        "text": "1 km លើផែនទីស្មើនឹង 100 km ក្នុងការពិត",
        "isCorrect": false
      },
      {
        "text": "1 m លើផែនទីស្មើនឹង 100 m ក្នុងការពិត",
        "isCorrect": false
      },
      {
        "text": "1 cm លើផែនទីស្មើនឹង 100 000 cm (1 km) ក្នុងការពិត",
        "isCorrect": true
      },
      {
        "text": "ផែនទីនោះពង្រីកទំហំ 100 000 ដង",
        "isCorrect": false
      }
    ],
    "explanation": "មាត្រដ្ឋាន 1 : 100 000 មានន័យថា 1 ឯកតាលើប្លង់ស្មើនឹង 100 000 ឯកតានៅលើទីតាំងពិតជាក់ស្តែង (1 cm = 100 000 cm = 1000 m = 1 km)។",
    "points": 1
  },
  {
    "id": 23,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "គណនាចម្ងាយពិត",
    "question": "លើប្លង់ផែនទីមាត្រដ្ឋាន 1/50 000 ចម្ងាយរវាងភូមិពីរវាស់បាន 6 cm។ តើចម្ងាយពិតស្មើប៉ុន្មាន km?",
    "options": [
      {
        "text": "30 km",
        "isCorrect": false
      },
      {
        "text": "3 km",
        "isCorrect": true
      },
      {
        "text": "0.3 km",
        "isCorrect": false
      },
      {
        "text": "300 km",
        "isCorrect": false
      }
    ],
    "explanation": "ចម្ងាយពិត = 6 cm × 50 000 = 300 000 cm = 3000 m = 3 km។",
    "points": 1
  },
  {
    "id": 24,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "គណនាចម្ងាយពិត",
    "question": "លើប្លង់ផែនទីមាត្រដ្ឋាន 1 : 20 000 ចម្ងាយរវាងសាលារៀន និងវត្តវាស់បាន 4.5 cm។ រកចម្ងាយពិតគិតជាម៉ែត្រ។",
    "options": [
      {
        "text": "900 m",
        "isCorrect": true
      },
      {
        "text": "90 m",
        "isCorrect": false
      },
      {
        "text": "9000 m",
        "isCorrect": false
      },
      {
        "text": "450 m",
        "isCorrect": false
      }
    ],
    "explanation": "ចម្ងាយពិត = 4.5 cm × 20 000 = 90 000 cm = 900 m។",
    "points": 1
  },
  {
    "id": 25,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "គណនាចម្ងាយលើប្លង់",
    "question": "ចម្ងាយពិតរវាងទីក្រុងពីរគឺ 15 km។ បើគេគូសលើផែនទីមាត្រដ្ឋាន 1 : 300 000 តើចម្ងាយលើផែនទីស្មើប៉ុន្មាន cm?",
    "options": [
      {
        "text": "4.5 cm",
        "isCorrect": false
      },
      {
        "text": "5 cm",
        "isCorrect": true
      },
      {
        "text": "6 cm",
        "isCorrect": false
      },
      {
        "text": "2 cm",
        "isCorrect": false
      }
    ],
    "explanation": "15 km = 1 500 000 cm។ ចម្ងាយលើប្លង់ = 1 500 000 / 300 000 = 5 cm។",
    "points": 1
  },
  {
    "id": 26,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "គណនាមាត្រដ្ឋាន",
    "question": "ចម្ងាយលើប្លង់ 4 cm តំណាងឱ្យចម្ងាយពិត 800 m។ តើប្លង់នោះមានមាត្រដ្ឋានប៉ុន្មាន?",
    "options": [
      {
        "text": "1 : 80 000",
        "isCorrect": false
      },
      {
        "text": "1 : 2000",
        "isCorrect": false
      },
      {
        "text": "1 : 200",
        "isCorrect": false
      },
      {
        "text": "1 : 20 000",
        "isCorrect": true
      }
    ],
    "explanation": "800 m = 80 000 cm។ មាត្រដ្ឋាន = 4 / 80 000 = 1 / 20 000។",
    "points": 1
  },
  {
    "id": 27,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "ប្លង់ផ្ទះ",
    "question": "ប្លង់ផ្ទះមួយគូរតាមមាត្រដ្ឋាន 1 : 100។ បើបន្ទប់គេងលើប្លង់មានបណ្តោយ 5 cm និងទទឹង 4 cm តើទំហំពិតនៃបន្ទប់គឺប៉ុន្មាន?",
    "options": [
      {
        "text": "បណ្តោយ 50 cm និង ទទឹង 40 cm",
        "isCorrect": false
      },
      {
        "text": "បណ្តោយ 50 m និង ទទឹង 40 m",
        "isCorrect": false
      },
      {
        "text": "បណ្តោយ 5 m និង ទទឹង 4 m",
        "isCorrect": true
      },
      {
        "text": "បណ្តោយ 2.5 m និង ទទឹង 2 m",
        "isCorrect": false
      }
    ],
    "explanation": "5 cm × 100 = 500 cm = 5 m; 4 cm × 100 = 400 cm = 4 m។",
    "points": 1
  },
  {
    "id": 28,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "គណនាផ្ទៃក្រឡាលើប្លង់",
    "question": "ពីសំណួរទី២៧ តើផ្ទៃក្រឡាពិតនៃបន្ទប់នោះស្មើប៉ុន្មាន m²?",
    "options": [
      {
        "text": "200 m²",
        "isCorrect": false
      },
      {
        "text": "20 m²",
        "isCorrect": true
      },
      {
        "text": "9 m²",
        "isCorrect": false
      },
      {
        "text": "18 m²",
        "isCorrect": false
      }
    ],
    "explanation": "ផ្ទៃក្រឡាពិត = 5 m × 4 m = 20 m²។",
    "points": 1
  },
  {
    "id": 29,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "មាត្រដ្ឋានពង្រីក",
    "question": "គំនូររូបកោសិកាមួយប្រើមាត្រដ្ឋាន 50 : 1។ តើនេះជាមាត្រដ្ឋានប្រភេទណា?",
    "options": [
      {
        "text": "មាត្រដ្ឋានទំហំស្មើគ្នា",
        "isCorrect": false
      },
      {
        "text": "មាត្រដ្ឋានបង្រួម (រូបគំនូរតូចជាងវត្ថុពិត)",
        "isCorrect": false
      },
      {
        "text": "មាត្រដ្ឋានពង្រីក (រូបគំនូរធំជាងវត្ថុពិត 50 ដង)",
        "isCorrect": true
      },
      {
        "text": "មាត្រដ្ឋានកាត់បន្ថយ",
        "isCorrect": false
      }
    ],
    "explanation": "កាលណាភាគយកធំជាងភាគបែង (50 > 1) នោះជាមាត្រដ្ឋានពង្រីក ដើម្បីមើលវត្ថុតូចៗឱ្យច្បាស់។",
    "points": 1
  },
  {
    "id": 30,
    "part": "ផ្នែកទី៣ ៖ មាត្រដ្ឋាន និងប្លង់ផែនទី",
    "partSubtitle": "គណនាប្រវែងពិតក្នុងមាត្រដ្ឋានពង្រីក",
    "question": "សត្វល្អិតមួយគូរលើក្រដាសមានប្រវែង 6 cm ដោយប្រើមាត្រដ្ឋាន 10 : 1។ តើសត្វល្អិតនោះមានប្រវែងពិតប៉ុន្មាន mm?",
    "options": [
      {
        "text": "6 mm",
        "isCorrect": true
      },
      {
        "text": "60 mm",
        "isCorrect": false
      },
      {
        "text": "0.6 mm",
        "isCorrect": false
      },
      {
        "text": "16 mm",
        "isCorrect": false
      }
    ],
    "explanation": "ប្រវែងពិត = 6 cm / 10 = 0.6 cm = 6 mm។",
    "points": 1
  },
  {
    "id": 31,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រស្រប (តម្លៃទំនិញ)",
    "question": "ប៊ិច 3 ដើមតម្លៃ 4500 រៀល។ តើប៊ិច 8 ដើមប្រភេទដដែលនោះតម្លៃប៉ុន្មានរៀល?",
    "options": [
      {
        "text": "11 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "10 500 រៀល",
        "isCorrect": false
      },
      {
        "text": "15 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "12 000 រៀល",
        "isCorrect": true
      }
    ],
    "explanation": "សមាមាត្រស្រប ៖ 3/4500 = 8/x => x = (8 × 4500) / 3 = 12 000 រៀល។",
    "points": 1
  },
  {
    "id": 32,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រស្រប (ទម្ងន់អង្ករ)",
    "question": "អង្ករ 5 kg តម្លៃ 17 500 រៀល។ តើអង្ករ 12 kg តម្លៃប៉ុន្មានរៀល?",
    "options": [
      {
        "text": "40 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "35 000 រៀល",
        "isCorrect": false
      },
      {
        "text": "42 000 រៀល",
        "isCorrect": true
      },
      {
        "text": "45 000 រៀល",
        "isCorrect": false
      }
    ],
    "explanation": "តម្លៃ 1 kg = 17 500 / 5 = 3500 រៀល។ តម្លៃ 12 kg = 12 × 3500 = 42 000 រៀល។",
    "points": 1
  },
  {
    "id": 33,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រស្រប (ចម្ងាយរថយន្ត)",
    "question": "រថយន្តមួយបើកបរ 2 ម៉ោងបានចម្ងាយ 130 km។ ប្រសិនបើល្បឿនថេរ តើ 5 ម៉ោងក្រោយវារត់បានចម្ងាយប៉ុន្មាន km?",
    "options": [
      {
        "text": "300 km",
        "isCorrect": false
      },
      {
        "text": "325 km",
        "isCorrect": true
      },
      {
        "text": "350 km",
        "isCorrect": false
      },
      {
        "text": "260 km",
        "isCorrect": false
      }
    ],
    "explanation": "ចម្ងាយ = (5 × 130) / 2 = 650 / 2 = 325 km។",
    "points": 1
  },
  {
    "id": 34,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រច្រាស (និយមន័យ)",
    "question": "តើស្ថានភាពណាខាងក្រោមជាទំហំសមាមាត្រច្រាស (Inverse Proportion)?",
    "options": [
      {
        "text": "ទម្ងន់បន្លែ និងតម្លៃទិញ",
        "isCorrect": false
      },
      {
        "text": "ចំនួនសៀវភៅ និងតម្លៃប្រាក់ត្រូវបង់",
        "isCorrect": false
      },
      {
        "text": "ចម្ងាយចរ និងរយៈពេលបើកបរក្នុងល្បឿនថេរ",
        "isCorrect": false
      },
      {
        "text": "ចំនួនកម្មករ និងចំនួនថ្ងៃបញ្ចប់ការងារ",
        "isCorrect": true
      }
    ],
    "explanation": "ចំនួនកម្មករកើនឡើង នាំឱ្យចំនួនថ្ងៃធ្វើការថយចុះ ដូច្នេះវាជាទំហំសមាមាត្រច្រាស។",
    "points": 1
  },
  {
    "id": 35,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រច្រាស (កម្មករធ្វើការ)",
    "question": "កម្មករ 4 នាក់ធ្វើការងារមួយហើយក្នុងរយៈពេល 15 ថ្ងៃ។ បើមានកម្មករ 10 នាក់ (សមត្ថភាពស្មើគ្នា) តើធ្វើការងារនោះហើយក្នុងពេលប៉ុន្មានថ្ងៃ?",
    "options": [
      {
        "text": "6 ថ្ងៃ",
        "isCorrect": true
      },
      {
        "text": "8 ថ្ងៃ",
        "isCorrect": false
      },
      {
        "text": "10 ថ្ងៃ",
        "isCorrect": false
      },
      {
        "text": "5 ថ្ងៃ",
        "isCorrect": false
      }
    ],
    "explanation": "សមាមាត្រច្រាស ៖ 4 × 15 = 10 × x => x = (4 × 15) / 10 = 60 / 10 = 6 ថ្ងៃ។",
    "points": 1
  },
  {
    "id": 36,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រច្រាស (ល្បឿន និងរយៈពេល)",
    "question": "បើកបរដោយល្បឿន 60 km/h ត្រូវចំណាយពេល 3 ម៉ោង។ បើបង្កើនល្បឿនដល់ 90 km/h តើចំណាយពេលប៉ុន្មានម៉ោង?",
    "options": [
      {
        "text": "2.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "2 ម៉ោង",
        "isCorrect": true
      },
      {
        "text": "1.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "4 ម៉ោង",
        "isCorrect": false
      }
    ],
    "explanation": "ចម្ងាយផ្លូវ = 60 × 3 = 180 km។ ពេលចំណាយ = 180 / 90 = 2 ម៉ោង។",
    "points": 1
  },
  {
    "id": 37,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រស្រប (រូបមន្តធ្វើនំ)",
    "question": "ដើម្បីធ្វើនំ 12 ចាន គេត្រូវប្រើស្ករ 300 g។ បើចង់ធ្វើនំ 30 ចាន តើត្រូវប្រើស្ករអស់ប៉ុន្មានក្រាម?",
    "options": [
      {
        "text": "900 g",
        "isCorrect": false
      },
      {
        "text": "600 g",
        "isCorrect": false
      },
      {
        "text": "800 g",
        "isCorrect": false
      },
      {
        "text": "750 g",
        "isCorrect": true
      }
    ],
    "explanation": "ស្ករ = (30 × 300) / 12 = 9000 / 12 = 750 g។",
    "points": 1
  },
  {
    "id": 38,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រច្រាស (បំពង់បង្ហូរទឹក)",
    "question": "បំពង់ទឹក 2 បង្ហូរទឹកពេញអាងក្នុងពេល 6 ម៉ោង។ បើប្រើបំពង់ 3 ទំហំដដែល តើបង្ហូរពេញអាងក្នុងពេលប៉ុន្មានម៉ោង?",
    "options": [
      {
        "text": "5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "3 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "4 ម៉ោង",
        "isCorrect": true
      },
      {
        "text": "4.5 ម៉ោង",
        "isCorrect": false
      }
    ],
    "explanation": "សមាមាត្រច្រាស ៖ 2 × 6 = 3 × t => t = 12 / 3 = 4 ម៉ោង។",
    "points": 1
  },
  {
    "id": 39,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រស្រប (ការដាំដើមឈើ)",
    "question": "សិស្ស 6 នាក់ដាំដើមឈើបាន 24 ដើមក្នុងមួយព្រឹក។ បើមានសិស្ស 15 នាក់ តើដាំបានប៉ុន្មានដើម?",
    "options": [
      {
        "text": "60 ដើម",
        "isCorrect": true
      },
      {
        "text": "50 ដើម",
        "isCorrect": false
      },
      {
        "text": "48 ដើម",
        "isCorrect": false
      },
      {
        "text": "72 ដើម",
        "isCorrect": false
      }
    ],
    "explanation": "1 នាក់ដាំបាន = 24 / 6 = 4 ដើម។ 15 នាក់ដាំបាន = 15 × 4 = 60 ដើម។",
    "points": 1
  },
  {
    "id": 40,
    "part": "ផ្នែកទី៤ ៖ ចំណោទសមាមាត្រស្រប និងសមាមាត្រច្រាស",
    "partSubtitle": "សមាមាត្រច្រាស (ចែកស្ករគ្រាប់)",
    "question": "គេចែកស្ករគ្រាប់មួយកញ្ចប់ឱ្យក្មេង 12 នាក់ ដោយម្នាក់ៗទទួលបាន 5 គ្រាប់។ បើចែកឱ្យក្មេងតែ 10 នាក់ស្មើៗគ្នា តើម្នាក់ៗទទួលបានប៉ុន្មានគ្រាប់?",
    "options": [
      {
        "text": "8 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "7 គ្រាប់",
        "isCorrect": false
      },
      {
        "text": "6 គ្រាប់",
        "isCorrect": true
      },
      {
        "text": "5 គ្រាប់",
        "isCorrect": false
      }
    ],
    "explanation": "ស្ករគ្រាប់សរុប = 12 × 5 = 60 គ្រាប់។ ក្មេង 10 នាក់បាន = 60 / 10 = 6 គ្រាប់/នាក់។",
    "points": 1
  }
];

export const LESSON_13_FORMULAS: MathFormulaSection[] = [
  {
    "title": "១. និយមន័យ និងលក្ខណៈគ្រឹះសមាមាត្រ (Proportions)",
    "description": "សមភាពនៃពីរផលធៀប",
    "details": [
      "សមាមាត្រ ៖ a/b = c/d ឬ a : b = c : d",
      "a និង d ជាតួចុង, b និង c ជាតួកណ្តាល",
      "លក្ខណៈគ្រឹះ (ផលគុណខ្វែង) ៖ a/b = c/d <=> a × d = b × c",
      "រកតួមិនស្គាល់ ៖ x = (b × c) / a"
    ]
  },
  {
    "title": "២. មាត្រដ្ឋាន (Scale & Map Blueprint)",
    "description": "រូបមន្តគណនាមាត្រដ្ឋាន",
    "details": [
      "មាត្រដ្ឋាន = ចម្ងាយលើប្លង់ / ចម្ងាយពិត (ឯកតាដូចគ្នា)",
      "ចម្ងាយពិត = ចម្ងាយលើប្លង់ × ភាគបែងមាត្រដ្ឋាន",
      "ចម្ងាយលើប្លង់ = ចម្ងាយពិត ÷ ភាគបែងមាត្រដ្ឋាន",
      "មាត្រដ្ឋានបង្រួម (1 : N) និង មាត្រដ្ឋានពង្រីក (N : 1)"
    ]
  },
  {
    "title": "៣. សមាមាត្រស្រប (Direct Proportion)",
    "description": "កាលណាទំហំមួយកើន ទំហំមួយទៀតកើនតាម",
    "details": [
      "សមភាពផលធៀប ៖ y1 / x1 = y2 / x2 = k (ថេរ)",
      "រូបមន្តរក x ៖ x = (តម្លៃប្រៀបធៀប × បរិមាណថ្មី) ÷ បរិមាណដើម",
      "ឧទាហរណ៍ ៖ ទំនិញ និងតម្លៃ, ចម្ងាយ និងពេលក្នុងល្បឿនថេរ"
    ]
  },
  {
    "title": "៤. សមាមាត្រច្រាស (Inverse Proportion)",
    "description": "កាលណាទំហំមួយកើន ទំហំមួយទៀតថយចុះ",
    "details": [
      "ផលគុណថេរ ៖ x1 × y1 = x2 × y2 = k",
      "រូបមន្តរក y2 ៖ y2 = (x1 × y1) / x2",
      "ឧទាហរណ៍ ៖ ចំនួនកម្មករ និងចំនួនថ្ងៃ, ល្បឿន និងរយៈពេលធ្វើដំណើរ"
    ]
  }
];
