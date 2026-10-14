import { MathQCMQuestion, MathFormulaSection } from '../mathQcmTypes';

export const LESSON_9_QUESTIONS: MathQCMQuestion[] = [
  {
    "id": 1,
    "part": "ផ្នែកទី១ ៖ កត្តា និងចំនួនបឋម",
    "partSubtitle": "កត្តានៃចំនួន",
    "question": "តើតួចែក (កត្តា) ទាំងអស់នៃចំនួន 15 មានអ្វីខ្លះ?",
    "options": [
      {
        "text": "1, 3, 5, 10, 15",
        "isCorrect": false
      },
      {
        "text": "3, 5",
        "isCorrect": false
      },
      {
        "text": "1, 15",
        "isCorrect": false
      },
      {
        "text": "1, 3, 5, 15",
        "isCorrect": true
      }
    ],
    "explanation": "15 = 1 × 15 = 3 × 5 ➔ កត្តាមាន 1, 3, 5, 15។",
    "points": 1
  },
  {
    "id": 2,
    "part": "ផ្នែកទី១ ៖ កត្តា និងចំនួនបឋម",
    "partSubtitle": "កត្តានៃចំនួន",
    "question": "តើ 5 ជាកត្តានៃ 35 ឬទេ? ព្រោះអ្វី?",
    "options": [
      {
        "text": "ជាកត្តា ព្រោះ 5 < 35",
        "isCorrect": false
      },
      {
        "text": "មិនមែនទេ",
        "isCorrect": false
      },
      {
        "text": "ជាកត្តា ព្រោះ 35 ចែកដាច់នឹង 5 (35 = 5 × 7)",
        "isCorrect": true
      },
      {
        "text": "ជាពហុគុណ",
        "isCorrect": false
      }
    ],
    "explanation": "5 ជាកត្តានៃ 35 ព្រោះ 35 ÷ 5 = 7 (ចែកដាច់)។",
    "points": 1
  },
  {
    "id": 3,
    "part": "ផ្នែកទី១ ៖ កត្តា និងចំនួនបឋម",
    "partSubtitle": "កត្តានៃចំនួន",
    "question": "តើ 8 ជាកត្តានៃ 58 ឬទេ?",
    "options": [
      {
        "text": "មិនមែនទេ ព្រោះ 58 ចែកមិនដាច់នឹង 8",
        "isCorrect": true
      },
      {
        "text": "ជាកត្តា",
        "isCorrect": false
      },
      {
        "text": "ជាចំនួនបឋម",
        "isCorrect": false
      },
      {
        "text": "ជាពហុគុណ",
        "isCorrect": false
      }
    ],
    "explanation": "58 ÷ 8 = 7 សល់ 2 (ចែកមិនដាច់) ដូច្នេះ 8 មិនមែនជាកត្តាទេ។",
    "points": 1
  },
  {
    "id": 4,
    "part": "ផ្នែកទី១ ៖ កត្តា និងចំនួនបឋម",
    "partSubtitle": "និយមន័យចំនួនបឋម",
    "question": "តើអ្វីជាចំនួនបឋម (Prime Number)?",
    "options": [
      {
        "text": "ជាចំនួនគូទាំងអស់",
        "isCorrect": false
      },
      {
        "text": "ជាចំនួនសេសទាំងអស់",
        "isCorrect": false
      },
      {
        "text": "ជាចំនួនគត់ធំជាង ១ ដែលមានកត្តាតែពីរគត់គឺ ១ និងខ្លួនវា",
        "isCorrect": true
      },
      {
        "text": "ជាចំនួនតូចជាង ១០",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនបឋម ជាចំនួនគត់ធំជាង ១ ដែលមានកត្តាតែពីរគត់ គឺ ១ និងខ្លួនវា។",
    "points": 1
  },
  {
    "id": 5,
    "part": "ផ្នែកទី១ ៖ កត្តា និងចំនួនបឋម",
    "partSubtitle": "ស្គាល់ចំនួនបឋម",
    "question": "ក្នុងចំណោមចំនួន {2, 3, 4, 5, 6, 7, 8, 9, 10} តើចំនួនណាខ្លះជាចំនួនបឋម?",
    "options": [
      {
        "text": "2, 3, 5, 7",
        "isCorrect": true
      },
      {
        "text": "1, 3, 5, 7, 9",
        "isCorrect": false
      },
      {
        "text": "2, 4, 6, 8",
        "isCorrect": false
      },
      {
        "text": "3, 5, 7, 9",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនបឋមពី 1 ដល់ 10 គឺ 2, 3, 5, 7 (2 ជាចំនួនគូបឋមតែមួយគត់)។",
    "points": 1
  },
  {
    "id": 6,
    "part": "ផ្នែកទី១ ៖ កត្តា និងចំនួនបឋម",
    "partSubtitle": "ចំនួនមិនបឋម (ចំនួនសមាស)",
    "question": "ហេតុអ្វីបានជាចំនួន 4, 6, 8, 9 មិនមែនជាចំនួនបឋម?",
    "options": [
      {
        "text": "ព្រោះវាជាចំនួនគូ",
        "isCorrect": false
      },
      {
        "text": "ព្រោះវាមានកត្តាលើសពីពីរ",
        "isCorrect": true
      },
      {
        "text": "ព្រោះវាធំជាង ៣",
        "isCorrect": false
      },
      {
        "text": "ព្រោះវាតូចជាង ១០",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនមិនបឋម មានកត្តាច្រើនជាងពីរ (ឧ. 4 មានកត្តា 1, 2, 4)។",
    "points": 1
  },
  {
    "id": 7,
    "part": "ផ្នែកទី១ ៖ កត្តា និងចំនួនបឋម",
    "partSubtitle": "ចំនួនបឋមពី 1 ដល់ 20",
    "question": "តើចំនួនបឋមទាំងអស់ពី 1 ដល់ 20 មានប៉ុន្មាន?",
    "options": [
      {
        "text": "9 ចំនួន",
        "isCorrect": false
      },
      {
        "text": "10 ចំនួន",
        "isCorrect": false
      },
      {
        "text": "7 ចំនួន",
        "isCorrect": false
      },
      {
        "text": "8 ចំនួន (2, 3, 5, 7, 11, 13, 17, 19)",
        "isCorrect": true
      }
    ],
    "explanation": "មាន ៨ ចំនួន ៖ 2, 3, 5, 7, 11, 13, 17, 19។",
    "points": 1
  },
  {
    "id": 8,
    "part": "ផ្នែកទី១ ៖ កត្តា និងចំនួនបឋម",
    "partSubtitle": "ពិនិត្យចំនួនបឋម",
    "question": "តើចំនួនណាជាចំនួនបឋម?",
    "options": [
      {
        "text": "71",
        "isCorrect": true
      },
      {
        "text": "69",
        "isCorrect": false
      },
      {
        "text": "91",
        "isCorrect": false
      },
      {
        "text": "125",
        "isCorrect": false
      }
    ],
    "explanation": "71 ជាចំនួនបឋម; 69=3×23, 91=7×13, 125=5×25។",
    "points": 1
  },
  {
    "id": 9,
    "part": "ផ្នែកទី២ ៖ ផលគុណកត្តាបឋម",
    "partSubtitle": "បំបែកជាកត្តាបឋម",
    "question": "សរសេរចំនួន 24 ជាផលគុណកត្តាបឋម ៖",
    "options": [
      {
        "text": "2 × 12",
        "isCorrect": false
      },
      {
        "text": "4 × 6",
        "isCorrect": false
      },
      {
        "text": "2 × 2 × 2 × 3 (ឬ 2³ × 3)",
        "isCorrect": true
      },
      {
        "text": "3 × 8",
        "isCorrect": false
      }
    ],
    "explanation": "24 = 2 × 2 × 2 × 3 = 2³ × 3។",
    "points": 1
  },
  {
    "id": 10,
    "part": "ផ្នែកទី២ ៖ ផលគុណកត្តាបឋម",
    "partSubtitle": "បំបែកជាកត្តាបឋម",
    "question": "សរសេរចំនួន 36 ជាផលគុណកត្តាបឋម ៖",
    "options": [
      {
        "text": "2 × 18",
        "isCorrect": false
      },
      {
        "text": "4 × 9",
        "isCorrect": false
      },
      {
        "text": "6 × 6",
        "isCorrect": false
      },
      {
        "text": "2 × 2 × 3 × 3",
        "isCorrect": true
      }
    ],
    "explanation": "36 = 2² × 3² = 2 × 2 × 3 × 3។",
    "points": 1
  },
  {
    "id": 11,
    "part": "ផ្នែកទី២ ៖ ផលគុណកត្តាបឋម",
    "partSubtitle": "បំបែកជាកត្តាបឋម",
    "question": "សរសេរចំនួន 45 ជាផលគុណកត្តាបឋម ៖",
    "options": [
      {
        "text": "5 × 9",
        "isCorrect": false
      },
      {
        "text": "3 × 3 × 5",
        "isCorrect": true
      },
      {
        "text": "3 × 15",
        "isCorrect": false
      },
      {
        "text": "1 × 45",
        "isCorrect": false
      }
    ],
    "explanation": "45 = 3² × 5 = 3 × 3 × 5។",
    "points": 1
  },
  {
    "id": 12,
    "part": "ផ្នែកទី២ ៖ ផលគុណកត្តាបឋម",
    "partSubtitle": "បំបែកជាកត្តាបឋម",
    "question": "សរសេរចំនួន 54 ជាផលគុណកត្តាបឋម ៖",
    "options": [
      {
        "text": "6 × 9",
        "isCorrect": false
      },
      {
        "text": "2 × 3 × 3 × 3",
        "isCorrect": true
      },
      {
        "text": "2 × 27",
        "isCorrect": false
      },
      {
        "text": "3 × 18",
        "isCorrect": false
      }
    ],
    "explanation": "54 = 2 × 3³ = 2 × 3 × 3 × 3។",
    "points": 1
  },
  {
    "id": 13,
    "part": "ផ្នែកទី៣ ៖ តួចែករួមធំបំផុត (ត.រ.ធ)",
    "partSubtitle": "និយមន័យ ត.រ.ធ",
    "question": "តើអ្វីជាតួចែករួមធំបំផុត (ត.រ.ធ)?",
    "options": [
      {
        "text": "ជាផលបូកកត្តា",
        "isCorrect": false
      },
      {
        "text": "ជាផលគុណនៃចំនួនទាំងពីរ",
        "isCorrect": false
      },
      {
        "text": "ជាតួចែកតូចបំផុត",
        "isCorrect": false
      },
      {
        "text": "ជាតួចែករួមដែលមានតម្លៃធំជាងគេនៃពីរ ឬច្រើនចំនួន",
        "isCorrect": true
      }
    ],
    "explanation": "ត.រ.ធ គឺជាតួចែករួមដែលមានតម្លៃធំជាងគេបំផុត។",
    "points": 1
  },
  {
    "id": 14,
    "part": "ផ្នែកទី៣ ៖ តួចែករួមធំបំផុត (ត.រ.ធ)",
    "partSubtitle": "រក ត.រ.ធ តាមការរាយកត្តា",
    "question": "តួចែក 18 គឺ {1, 2, 3, 6, 9, 18} និង 24 គឺ {1, 2, 3, 4, 6, 8, 12, 24}។ រក ត(18; 24) ៖",
    "options": [
      {
        "text": "6",
        "isCorrect": true
      },
      {
        "text": "3",
        "isCorrect": false
      },
      {
        "text": "2",
        "isCorrect": false
      },
      {
        "text": "12",
        "isCorrect": false
      }
    ],
    "explanation": "តួចែករួមគឺ {1, 2, 3, 6} ➔ តួចែករួមធំបំផុតគឺ 6។",
    "points": 1
  },
  {
    "id": 15,
    "part": "ផ្នែកទី៣ ៖ តួចែករួមធំបំផុត (ត.រ.ធ)",
    "partSubtitle": "រក ត.រ.ធ",
    "question": "រក ត.រ.ធ នៃ 16, 32 និង 40 ៖",
    "options": [
      {
        "text": "16",
        "isCorrect": false
      },
      {
        "text": "4",
        "isCorrect": false
      },
      {
        "text": "8",
        "isCorrect": true
      },
      {
        "text": "2",
        "isCorrect": false
      }
    ],
    "explanation": "16=2⁴, 32=2⁵, 40=2³×5 ➔ ត.រ.ធ = 2³ = 8។",
    "points": 1
  },
  {
    "id": 16,
    "part": "ផ្នែកទី៣ ៖ តួចែករួមធំបំផុត (ត.រ.ធ)",
    "partSubtitle": "រក ត.រ.ធ តាមកត្តាបឋម",
    "question": "រក ត(18; 30) ដោយដឹងថា 18 = 2 × 3² និង 30 = 2 × 3 × 5 ៖",
    "options": [
      {
        "text": "90",
        "isCorrect": false
      },
      {
        "text": "3",
        "isCorrect": false
      },
      {
        "text": "2",
        "isCorrect": false
      },
      {
        "text": "6",
        "isCorrect": true
      }
    ],
    "explanation": "ត.រ.ធ = 2 × 3 = 6 (យកកត្តារួមស្វ័យគុណតូច)។",
    "points": 1
  },
  {
    "id": 17,
    "part": "ផ្នែកទី៣ ៖ តួចែករួមធំបំផុត (ត.រ.ធ)",
    "partSubtitle": "រក ត.រ.ធ",
    "question": "រក ត(6; 9; 12) ៖",
    "options": [
      {
        "text": "6",
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
        "text": "1",
        "isCorrect": false
      }
    ],
    "explanation": "6=2×3, 9=3², 12=2²×3 ➔ កត្តារួមតែមួយគត់គឺ 3 ➔ ត.រ.ធ = 3។",
    "points": 1
  },
  {
    "id": 18,
    "part": "ផ្នែកទី៣ ៖ តួចែករួមធំបំផុត (ត.រ.ធ)",
    "partSubtitle": "រក ត.រ.ធ",
    "question": "រក ត(12; 18) ៖",
    "options": [
      {
        "text": "4",
        "isCorrect": false
      },
      {
        "text": "3",
        "isCorrect": false
      },
      {
        "text": "6",
        "isCorrect": true
      },
      {
        "text": "2",
        "isCorrect": false
      }
    ],
    "explanation": "12=2²×3, 18=2×3² ➔ ត.រ.ធ = 2 × 3 = 6។",
    "points": 1
  },
  {
    "id": 19,
    "part": "ផ្នែកទី៣ ៖ តួចែករួមធំបំផុត (ត.រ.ធ)",
    "partSubtitle": "រក ត.រ.ធ",
    "question": "រក ត(15; 35) ៖",
    "options": [
      {
        "text": "5",
        "isCorrect": true
      },
      {
        "text": "3",
        "isCorrect": false
      },
      {
        "text": "7",
        "isCorrect": false
      },
      {
        "text": "1",
        "isCorrect": false
      }
    ],
    "explanation": "15=3×5, 35=5×7 ➔ ត.រ.ធ = 5។",
    "points": 1
  },
  {
    "id": 20,
    "part": "ផ្នែកទី៣ ៖ តួចែករួមធំបំផុត (ត.រ.ធ)",
    "partSubtitle": "ចំនួនបឋមរវាងគ្នា",
    "question": "បើ ត(a; b) = 1 នោះគេហៅ a និង b ថាជាអ្វី?",
    "options": [
      {
        "text": "ចំនួនស្មើគ្នា",
        "isCorrect": false
      },
      {
        "text": "ចំនួនបឋម",
        "isCorrect": false
      },
      {
        "text": "ចំនួនបឋមរវាងគ្នា (Coprime)",
        "isCorrect": true
      },
      {
        "text": "ចំនួនគត់ជាប់គ្នា",
        "isCorrect": false
      }
    ],
    "explanation": "ចំនួនពីរដែលមាន ត.រ.ធ ស្មើ ១ ហៅថាចំនួនបឋមរវាងគ្នា (ឧ. 8 និង 9)។",
    "points": 1
  },
  {
    "id": 21,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "និយមន័យពហុគុណ",
    "question": "ពហុគុណនៃមួយចំនួន គឺជា ៖",
    "options": [
      {
        "text": "ចំនួនសេស",
        "isCorrect": false
      },
      {
        "text": "កត្តានៃចំនួននោះ",
        "isCorrect": false
      },
      {
        "text": "ផលចែកនៃចំនួននោះ",
        "isCorrect": false
      },
      {
        "text": "ផលគុណនៃចំនួននោះនឹងចំនួនគត់មិនសូន្យ",
        "isCorrect": true
      }
    ],
    "explanation": "ពហុគុណនៃ a គឺ a × 1, a × 2, a × 3, a × 4...។",
    "points": 1
  },
  {
    "id": 22,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "ពហុគុណនៃ 2",
    "question": "ពហុគុណ ៥ តំបូងនៃ 2 គឺ ៖",
    "options": [
      {
        "text": "1, 2, 3, 4, 5",
        "isCorrect": false
      },
      {
        "text": "2, 4, 6, 8, 10",
        "isCorrect": true
      },
      {
        "text": "2, 3, 5, 7, 11",
        "isCorrect": false
      },
      {
        "text": "4, 6, 8, 10, 12",
        "isCorrect": false
      }
    ],
    "explanation": "2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10។",
    "points": 1
  },
  {
    "id": 23,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "ពហុគុណនៃ 5",
    "question": "ពហុគុណ ៥ តំបូងនៃ 5 គឺ ៖",
    "options": [
      {
        "text": "5, 10, 15, 20, 25",
        "isCorrect": true
      },
      {
        "text": "1, 5, 10, 15, 20",
        "isCorrect": false
      },
      {
        "text": "5, 15, 25, 35, 45",
        "isCorrect": false
      },
      {
        "text": "10, 20, 30, 40, 50",
        "isCorrect": false
      }
    ],
    "explanation": "5, 10, 15, 20, 25។",
    "points": 1
  },
  {
    "id": 24,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "និយមន័យ ព.រ.ត",
    "question": "តើអ្វីជាពហុគុណរួមតូចបំផុត (ព.រ.ត)?",
    "options": [
      {
        "text": "ជាផលបូកពហុគុណ",
        "isCorrect": false
      },
      {
        "text": "ជាពហុគុណធំបំផុត",
        "isCorrect": false
      },
      {
        "text": "ជាកត្តារួម",
        "isCorrect": false
      },
      {
        "text": "ជាពហុគុណរួមមិនសូន្យដែលមានតម្លៃតូចជាងគេ",
        "isCorrect": true
      }
    ],
    "explanation": "ព.រ.ត គឺជាពហុគុណរួមមិនសូន្យដែលមានតម្លៃតូចជាងគេបង្អស់។",
    "points": 1
  },
  {
    "id": 25,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "រក ព.រ.ត តាមការរាយ",
    "question": "ពហុគុណនៃ 4 គឺ {4, 8, 12, 16, 20...} និង 6 គឺ {6, 12, 18...}។ រក ព(4; 6) ៖",
    "options": [
      {
        "text": "12",
        "isCorrect": true
      },
      {
        "text": "24",
        "isCorrect": false
      },
      {
        "text": "6",
        "isCorrect": false
      },
      {
        "text": "4",
        "isCorrect": false
      }
    ],
    "explanation": "ពហុគុណរួមតូចបំផុតគឺ 12។",
    "points": 1
  },
  {
    "id": 26,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "រក ព.រ.ត តាមកត្តាបឋម",
    "question": "រក ព(8; 12) ដោយដឹងថា 8 = 2³ និង 12 = 2² × 3 ៖",
    "options": [
      {
        "text": "48",
        "isCorrect": false
      },
      {
        "text": "12",
        "isCorrect": false
      },
      {
        "text": "24",
        "isCorrect": true
      },
      {
        "text": "96",
        "isCorrect": false
      }
    ],
    "explanation": "ព.រ.ត = 2³ × 3 = 8 × 3 = 24 (យកកត្តារួម និងមិនរួមស្វ័យគុណធំ)។",
    "points": 1
  },
  {
    "id": 27,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "រក ព.រ.ត នៃបីចំនួន",
    "question": "រក ព(2; 3; 4) ៖",
    "options": [
      {
        "text": "24",
        "isCorrect": false
      },
      {
        "text": "12",
        "isCorrect": true
      },
      {
        "text": "6",
        "isCorrect": false
      },
      {
        "text": "8",
        "isCorrect": false
      }
    ],
    "explanation": "ព(2; 3; 4) = 12។",
    "points": 1
  },
  {
    "id": 28,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "រក ព.រ.ត នៃបីចំនួន",
    "question": "រក ព(6; 12; 36) ៖",
    "options": [
      {
        "text": "36",
        "isCorrect": true
      },
      {
        "text": "12",
        "isCorrect": false
      },
      {
        "text": "72",
        "isCorrect": false
      },
      {
        "text": "6",
        "isCorrect": false
      }
    ],
    "explanation": "ដោយសារ 36 ចែកដាច់នឹង 6 និង 12 នាំឱ្យ ព.រ.ត = 36។",
    "points": 1
  },
  {
    "id": 29,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "រក ព.រ.ត",
    "question": "រក ព(6; 8) ៖",
    "options": [
      {
        "text": "48",
        "isCorrect": false
      },
      {
        "text": "24",
        "isCorrect": true
      },
      {
        "text": "12",
        "isCorrect": false
      },
      {
        "text": "18",
        "isCorrect": false
      }
    ],
    "explanation": "6=2×3, 8=2³ ➔ ព.រ.ត = 2³ × 3 = 24។",
    "points": 1
  },
  {
    "id": 30,
    "part": "ផ្នែកទី៤ ៖ ពហុគុណរួមតូចបំផុត (ព.រ.ត)",
    "partSubtitle": "ទំនាក់ទំនងរវាង ត.រ.ធ និង ព.រ.ត",
    "question": "ចំពោះពីរចំនួន a និង b តើទំនាក់ទំនងណាត្រឹមត្រូវ?",
    "options": [
      {
        "text": "គ្មានទំនាក់ទំនង",
        "isCorrect": false
      },
      {
        "text": "a + b = ត(a;b) + ព(a;b)",
        "isCorrect": false
      },
      {
        "text": "a × b = ត(a;b) ÷ ព(a;b)",
        "isCorrect": false
      },
      {
        "text": "a × b = ត(a;b) × ព(a;b)",
        "isCorrect": true
      }
    ],
    "explanation": "ផលគុណពីរចំនួន = ត.រ.ធ × ព.រ.ត ៖ a × b = GCD(a,b) × LCM(a,b)។",
    "points": 1
  },
  {
    "id": 31,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទចែកសម្ភារៈ (ត.រ.ធ)",
    "question": "គេមានប៊ិច 24 ដើម និងសៀវភៅ 18 ក្បាល ចែកឱ្យសិស្សស្មើៗគ្នា។ តើអាចចែកបានសិស្សច្រើនបំផុតប៉ុន្មាននាក់?",
    "options": [
      {
        "text": "12 នាក់",
        "isCorrect": false
      },
      {
        "text": "8 នាក់",
        "isCorrect": false
      },
      {
        "text": "6 នាក់",
        "isCorrect": true
      },
      {
        "text": "3 នាក់",
        "isCorrect": false
      }
    ],
    "explanation": "រក ត(24; 18) = 6 នាក់ (ម្នាក់បានប៊ិច 4 ដើម, សៀវភៅ 3 ក្បាល)។",
    "points": 1
  },
  {
    "id": 32,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទរៀបផ្លែឈើ (ត.រ.ធ)",
    "question": "នារីមានផ្កាកុលាប 16 ទង និងផ្កាអ័រគីដេ 24 ទង។ គាត់រៀបជាបាច់ស្មើៗគ្នា។ តើរៀបបានច្រើនបំផុតប៉ុន្មានបាច់?",
    "options": [
      {
        "text": "4 បាច់",
        "isCorrect": false
      },
      {
        "text": "8 បាច់",
        "isCorrect": true
      },
      {
        "text": "6 បាច់",
        "isCorrect": false
      },
      {
        "text": "12 បាច់",
        "isCorrect": false
      }
    ],
    "explanation": "រក ត(16; 24) = 8 បាច់ (១ បាច់មានកុលាប 2 ទង, អ័រគីដេ 3 ទង)។",
    "points": 1
  },
  {
    "id": 33,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទចែកក្រុមកម្មករ (ត.រ.ធ)",
    "question": "សហគ្រាសមានកម្មករប្រុស 48 នាក់ និងស្រី 72 នាក់ បែងចែកជាក្រុមស្មើៗគ្នា។ តើបង្កើតបានច្រើនបំផុតប៉ុន្មានក្រុម?",
    "options": [
      {
        "text": "16 ក្រុម",
        "isCorrect": false
      },
      {
        "text": "12 ក្រុម",
        "isCorrect": false
      },
      {
        "text": "24 ក្រុម",
        "isCorrect": true
      },
      {
        "text": "8 ក្រុម",
        "isCorrect": false
      }
    ],
    "explanation": "រក ត(48; 72) = 24 ក្រុម (១ ក្រុមមានប្រុស 2 នាក់, ស្រី 3 នាក់)។",
    "points": 1
  },
  {
    "id": 34,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទជួបគ្នាឡើងវិញ (ព.រ.ត)",
    "question": "បុប្ផាបោសថ្នាក់រាល់ 4 ថ្ងៃម្តង ចិត្រាបោសរាល់ 6 ថ្ងៃម្តង។ ថ្ងៃនេះគេបោសជាមួយគ្នា។ តើប៉ុន្មានថ្ងៃទៀតទើបគេបោសជាមួយគ្នាម្តងទៀត?",
    "options": [
      {
        "text": "12 ថ្ងៃទៀត",
        "isCorrect": true
      },
      {
        "text": "24 ថ្ងៃទៀត",
        "isCorrect": false
      },
      {
        "text": "10 ថ្ងៃទៀត",
        "isCorrect": false
      },
      {
        "text": "8 ថ្ងៃទៀត",
        "isCorrect": false
      }
    ],
    "explanation": "រក ព(4; 6) = 12 ថ្ងៃទៀត។",
    "points": 1
  },
  {
    "id": 35,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទរត់ជុំវិញទីលាន (ព.រ.ត)",
    "question": "សិស្ស A រត់ ១ ជុំអស់ 6mn សិស្ស B រត់ ១ ជុំអស់ 8mn ចេញដំណើរព្រមគ្នា។ តើរយៈពេលប៉ុន្មាននាទីទើបគេជួបគ្នានៅចំណុចចេញដំណើរសាជាថ្មី?",
    "options": [
      {
        "text": "12 នាទី",
        "isCorrect": false
      },
      {
        "text": "48 នាទី",
        "isCorrect": false
      },
      {
        "text": "14 នាទី",
        "isCorrect": false
      },
      {
        "text": "24 នាទី",
        "isCorrect": true
      }
    ],
    "explanation": "រក ព(6; 8) = 24 នាទី (A រត់បាន 4 ជុំ, B រត់បាន 3 ជុំ)។",
    "points": 1
  },
  {
    "id": 36,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទរោទិ៍នាឡិកា (ព.រ.ត)",
    "question": "នាឡិកាបីរោទិ៍រៀងរាល់ 10 នាទី, 15 នាទី និង 20 នាទីម្តង។ បើរោទិ៍ព្រមគ្នានៅម៉ោង ៧:០០ តើម៉ោងប៉ុន្មានទើបរោទិ៍ព្រមគ្នាម្តងទៀត?",
    "options": [
      {
        "text": "ម៉ោង ៨:៣០",
        "isCorrect": false
      },
      {
        "text": "ម៉ោង ៧:៣០",
        "isCorrect": false
      },
      {
        "text": "ម៉ោង ៨:០០ (ក្រោយ 60 នាទី)",
        "isCorrect": true
      },
      {
        "text": "ម៉ោង ៩:០០",
        "isCorrect": false
      }
    ],
    "explanation": "រក ព(10; 15; 20) = 60 នាទី = 1 ម៉ោង ➔ ៧:០០ + ១ ម៉ោង = ម៉ោង ៨:០០។",
    "points": 1
  },
  {
    "id": 37,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទឡានក្រុងចេញដំណើរ",
    "question": "ឡានក្រុងខ្សែទី១ ចេញរាល់ 12mn ឡានខ្សែទី២ ចេញរាល់ 18mn។ តើប៉ុន្មាននាទីទើបឡានទាំងពីរចេញព្រមគ្នាម្តងទៀត?",
    "options": [
      {
        "text": "72 នាទី",
        "isCorrect": false
      },
      {
        "text": "36 នាទី",
        "isCorrect": true
      },
      {
        "text": "30 នាទី",
        "isCorrect": false
      },
      {
        "text": "24 នាទី",
        "isCorrect": false
      }
    ],
    "explanation": "រក ព(12; 18) = 36 នាទី។",
    "points": 1
  },
  {
    "id": 38,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទផ្លែឈើដាក់ចាន",
    "question": "សារីមានស្វាយ 24 ផ្លែ និងក្រូច 32 ផ្លែ រៀបដាក់ចានស្មើៗគ្នា។ តើគាត់ត្រូវការចានច្រើនបំផុតប៉ុន្មាន?",
    "options": [
      {
        "text": "12 ចាន",
        "isCorrect": false
      },
      {
        "text": "6 ចាន",
        "isCorrect": false
      },
      {
        "text": "4 ចាន",
        "isCorrect": false
      },
      {
        "text": "8 ចាន",
        "isCorrect": true
      }
    ],
    "explanation": "រក ត(24; 32) = 8 ចាន (១ ចានមានស្វាយ 3 ផ្លែ, ក្រូច 4 ផ្លែ)។",
    "points": 1
  },
  {
    "id": 39,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទចែកនំកញ្ចប់",
    "question": "នំកញ្ចប់ 30 នំ និងស្ករគ្រាប់ 45 គ្រាប់ ចែកឱ្យកុមារស្មើៗគ្នា។ តើកុមារច្រើនបំផុតមានប៉ុន្មាននាក់?",
    "options": [
      {
        "text": "15 នាក់",
        "isCorrect": true
      },
      {
        "text": "5 នាក់",
        "isCorrect": false
      },
      {
        "text": "10 នាក់",
        "isCorrect": false
      },
      {
        "text": "3 នាក់",
        "isCorrect": false
      }
    ],
    "explanation": "រក ត(30; 45) = 15 នាក់ (ម្នាក់បាននំ 2, ស្ករគ្រាប់ 3)។",
    "points": 1
  },
  {
    "id": 40,
    "part": "ផ្នែកទី៥ ៖ ចំណោទអនុវត្ត",
    "partSubtitle": "ចំណោទកាត់ការ៉ូពីក្រដាស",
    "question": "ក្រដាសរាងចតុកោណកែងទំហំ 20cm × 30cm កាត់ជាការ៉ូប៉ុនៗគ្នាធំបំផុតដោយមិនសល់កម្ទេច។ រកជ្រុងការ៉ូនោះ ៖",
    "options": [
      {
        "text": "5 cm",
        "isCorrect": false
      },
      {
        "text": "10 cm",
        "isCorrect": true
      },
      {
        "text": "4 cm",
        "isCorrect": false
      },
      {
        "text": "2 cm",
        "isCorrect": false
      }
    ],
    "explanation": "រក ត(20; 30) = 10 cm (កាត់បាន 6 ការ៉ូ)។",
    "points": 1
  }
];

export const LESSON_9_FORMULAS: MathFormulaSection[] = [
  {
    "title": "១. ចំនួនបឋម និងការបំបែកជាកត្តាបឋម",
    "description": "មូលដ្ឋានគ្រឹះ",
    "details": [
      "ចំនួនបឋម ៖ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...",
      "បំបែកចំនួនជាផលគុណកត្តាបឋមដោយវិធីចែកបន្តបន្ទាប់"
    ]
  },
  {
    "title": "២. តួចែករួមធំបំផុត (ត.រ.ធ - GCD)",
    "description": "ក្បួនគណនា",
    "details": [
      "យកកត្តាបឋមរួម លើកជាស្វ័យគុណតូចជាងគេ រួចគុណបញ្ចូលគ្នា",
      "ប្រើសម្រាប់ចំណោទចែករំលែកឱ្យបានច្រើនបំផុត ឬកាត់បំណែកធំបំផុត"
    ]
  },
  {
    "title": "៣. ពហុគុណរួមតូចបំផុត (ព.រ.ត - LCM)",
    "description": "ក្បួនគណនា",
    "details": [
      "យកកត្តាបឋមរួម និងមិនរួម លើកជាស្វ័យគុណធំជាងគេ រួចគុណបញ្ចូលគ្នា",
      "ប្រើសម្រាប់ចំណោទជួបគ្នាឡើងវិញ ចេញដំណើរព្រមគ្នា ឬតម្រូវភាគបែងប្រភាគ"
    ]
  }
];
