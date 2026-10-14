import { MathQCMQuestion, MathFormulaSection } from '../mathQcmTypes';

export const LESSON_14_QUESTIONS: MathQCMQuestion[] = [
  {
    "id": 1,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "រូបមន្តល្បឿនមធ្យម",
    "question": "តើរូបមន្តគណនាល្បឿនមធ្យម (v) គឺអ្វី?",
    "options": [
      {
        "text": "v = d × t",
        "isCorrect": false
      },
      {
        "text": "v = d / t (ល្បឿន = ចម្ងាយចរ ÷ រយៈពេល)",
        "isCorrect": true
      },
      {
        "text": "v = t / d",
        "isCorrect": false
      },
      {
        "text": "v = d + t",
        "isCorrect": false
      }
    ],
    "explanation": "រូបមន្តគ្រឹះ ៖ ល្បឿន = ចម្ងាយចរ / រយៈពេល (v = d / t)។",
    "points": 1
  },
  {
    "id": 2,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "រូបមន្តរកចម្ងាយចរ",
    "question": "តើរូបមន្តគណនាចម្ងាយចរ (d) គឺអ្វី?",
    "options": [
      {
        "text": "d = v - t",
        "isCorrect": false
      },
      {
        "text": "d = v / t",
        "isCorrect": false
      },
      {
        "text": "d = t / v",
        "isCorrect": false
      },
      {
        "text": "d = v × t (ចម្ងាយ = ល្បឿន × រយៈពេល)",
        "isCorrect": true
      }
    ],
    "explanation": "ពី v = d / t យើងទាញបាន ចម្ងាយចរ d = v × t។",
    "points": 1
  },
  {
    "id": 3,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "រូបមន្តរករយៈពេល",
    "question": "តើរូបមន្តគណនារយៈពេលធ្វើដំណើរ (t) គឺអ្វី?",
    "options": [
      {
        "text": "t = d / v (រយៈពេល = ចម្ងាយ ÷ ល្បឿន)",
        "isCorrect": true
      },
      {
        "text": "t = d × v",
        "isCorrect": false
      },
      {
        "text": "t = v / d",
        "isCorrect": false
      },
      {
        "text": "t = v + d",
        "isCorrect": false
      }
    ],
    "explanation": "ពី v = d / t យើងទាញបាន រយៈពេល t = d / v។",
    "points": 1
  },
  {
    "id": 4,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "ឯកតាល្បឿន",
    "question": "តើឯកតាស្តង់ដានៃល្បឿនដែលគេនិយមប្រើក្នុងជីវភាពរស់នៅគឺអ្វី?",
    "options": [
      {
        "text": "km/s និង m/h",
        "isCorrect": false
      },
      {
        "text": "km × h និង m × s",
        "isCorrect": false
      },
      {
        "text": "km/h (គីឡូម៉ែត្រក្នុងមួយម៉ោង) និង m/s (ម៉ែត្រក្នុងមួយវិនាទី)",
        "isCorrect": true
      },
      {
        "text": "h/km និង s/m",
        "isCorrect": false
      }
    ],
    "explanation": "ឯកតាល្បឿនទូទៅគឺ km/h ឬ m/s។",
    "points": 1
  },
  {
    "id": 5,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "ការបំប្លែងឯកតា m/s និង km/h",
    "question": "ដឹងថា 1 m/s = 3.6 km/h។ តើល្បឿន 10 m/s ស្មើនឹងប៉ុន្មាន km/h?",
    "options": [
      {
        "text": "18 km/h",
        "isCorrect": false
      },
      {
        "text": "3.6 km/h",
        "isCorrect": false
      },
      {
        "text": "360 km/h",
        "isCorrect": false
      },
      {
        "text": "36 km/h",
        "isCorrect": true
      }
    ],
    "explanation": "10 m/s = 10 × 3.6 = 36 km/h។",
    "points": 1
  },
  {
    "id": 6,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "ការបំប្លែងឯកតា km/h ទៅ m/s",
    "question": "ល្បឿន 72 km/h ស្មើនឹងប៉ុន្មាន m/s?",
    "options": [
      {
        "text": "25 m/s",
        "isCorrect": false
      },
      {
        "text": "20 m/s",
        "isCorrect": true
      },
      {
        "text": "15 m/s",
        "isCorrect": false
      },
      {
        "text": "30 m/s",
        "isCorrect": false
      }
    ],
    "explanation": "72 km/h = 72 ÷ 3.6 = 20 m/s (ឬ (72 × 1000)/3600 = 20 m/s)។",
    "points": 1
  },
  {
    "id": 7,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "ការគណនាល្បឿនសាមញ្ញ",
    "question": "រថយន្តមួយធ្វើដំណើរបានចម្ងាយ 180 km ក្នុងរយៈពេល 3 ម៉ោង។ តើល្បឿនមធ្យមរបស់រថយន្តស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "50 km/h",
        "isCorrect": false
      },
      {
        "text": "60 km/h",
        "isCorrect": true
      },
      {
        "text": "70 km/h",
        "isCorrect": false
      },
      {
        "text": "540 km/h",
        "isCorrect": false
      }
    ],
    "explanation": "v = d / t = 180 / 3 = 60 km/h។",
    "points": 1
  },
  {
    "id": 8,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "ការគណនាចម្ងាយចរ",
    "question": "អ្នកជិះកង់ម្នាក់ជិះដោយល្បឿន 15 km/h ក្នុងរយៈពេល 2 ម៉ោង។ តើគាត់ធ្វើដំណើរបានចម្ងាយប៉ុន្មាន km?",
    "options": [
      {
        "text": "35 km",
        "isCorrect": false
      },
      {
        "text": "7.5 km",
        "isCorrect": false
      },
      {
        "text": "25 km",
        "isCorrect": false
      },
      {
        "text": "30 km",
        "isCorrect": true
      }
    ],
    "explanation": "d = v × t = 15 × 2 = 30 km។",
    "points": 1
  },
  {
    "id": 9,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "ការគណនារយៈពេល",
    "question": "រថភ្លើងមួយរត់ដោយល្បឿន 80 km/h លើចម្ងាយផ្លូវ 240 km។ តើវាចំណាយពេលប៉ុន្មានម៉ោង?",
    "options": [
      {
        "text": "3 ម៉ោង",
        "isCorrect": true
      },
      {
        "text": "4 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "2.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "3.5 ម៉ោង",
        "isCorrect": false
      }
    ],
    "explanation": "t = d / v = 240 / 80 = 3 ម៉ោង។",
    "points": 1
  },
  {
    "id": 10,
    "part": "ផ្នែកទី១ ៖ រូបមន្តល្បឿន ចម្ងាយ និងរយៈពេល",
    "partSubtitle": "ការគណនាល្បឿនគិតជា m/s",
    "question": "កីឡាកររត់ប្រណាំងម្នាក់រត់បានចម្ងាយ 400 m ក្នុងពេល 50 វិនាទី។ តើល្បឿនមធ្យមរបស់គាត់ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "7 m/s",
        "isCorrect": false
      },
      {
        "text": "10 m/s",
        "isCorrect": false
      },
      {
        "text": "8 m/s",
        "isCorrect": true
      },
      {
        "text": "80 m/s",
        "isCorrect": false
      }
    ],
    "explanation": "v = 400 m / 50 s = 8 m/s។",
    "points": 1
  },
  {
    "id": 11,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "បំប្លែងនាទីជាម៉ោងទសភាគ",
    "question": "រយៈពេល 30 នាទី សរសេរជាម៉ោងទសភាគគឺ ៖",
    "options": [
      {
        "text": "0.33 h",
        "isCorrect": false
      },
      {
        "text": "0.3 h",
        "isCorrect": false
      },
      {
        "text": "0.25 h",
        "isCorrect": false
      },
      {
        "text": "0.5 h",
        "isCorrect": true
      }
    ],
    "explanation": "30 នាទី = 30 / 60 = 1/2 = 0.5 h។",
    "points": 1
  },
  {
    "id": 12,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "បំប្លែង 15 នាទីជាម៉ោងទសភាគ",
    "question": "រយៈពេល 1 ម៉ោង 15 នាទី សរសេរជាម៉ោងទសភាគគឺ ៖",
    "options": [
      {
        "text": "1.15 h",
        "isCorrect": false
      },
      {
        "text": "1.25 h",
        "isCorrect": true
      },
      {
        "text": "1.5 h",
        "isCorrect": false
      },
      {
        "text": "1.75 h",
        "isCorrect": false
      }
    ],
    "explanation": "15 នាទី = 15/60 = 0.25 h ដូច្នេះ 1h 15mn = 1.25 h។",
    "points": 1
  },
  {
    "id": 13,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "បំប្លែង 45 នាទីជាម៉ោងទសភាគ",
    "question": "រយៈពេល 2 ម៉ោង 45 នាទី ស្មើនឹងប៉ុន្មានម៉ោងទសភាគ?",
    "options": [
      {
        "text": "2.5 h",
        "isCorrect": false
      },
      {
        "text": "2.45 h",
        "isCorrect": false
      },
      {
        "text": "2.75 h",
        "isCorrect": true
      },
      {
        "text": "2.8 h",
        "isCorrect": false
      }
    ],
    "explanation": "45 នាទី = 45/60 = 0.75 h ដូច្នេះ 2h 45mn = 2.75 h។",
    "points": 1
  },
  {
    "id": 14,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "គណនាចម្ងាយជាមួយម៉ោងនិងនាទី",
    "question": "រថភ្លើងមួយរត់ដោយល្បឿន 54 km/h។ តើក្នុងរយៈពេល 3 ម៉ោង 30 នាទី វាធ្វើដំណើរបានចម្ងាយប៉ុន្មាន km?",
    "options": [
      {
        "text": "189 km",
        "isCorrect": true
      },
      {
        "text": "162 km",
        "isCorrect": false
      },
      {
        "text": "200 km",
        "isCorrect": false
      },
      {
        "text": "180 km",
        "isCorrect": false
      }
    ],
    "explanation": "3h 30mn = 3.5 h។ ចម្ងាយ d = 54 × 3.5 = 189 km។",
    "points": 1
  },
  {
    "id": 15,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "គណនាល្បឿនជាមួយម៉ោងនិងនាទី",
    "question": "ម៉ូតូមួយចរបាន 150 km ក្នុងពេល 2 ម៉ោង 30 នាទី។ តើល្បឿនមធ្យមរបស់វាស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "50 km/h",
        "isCorrect": false
      },
      {
        "text": "65 km/h",
        "isCorrect": false
      },
      {
        "text": "60 km/h",
        "isCorrect": true
      },
      {
        "text": "75 km/h",
        "isCorrect": false
      }
    ],
    "explanation": "2h 30mn = 2.5 h។ ល្បឿន v = 150 / 2.5 = 60 km/h។",
    "points": 1
  },
  {
    "id": 16,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "គណនារយៈពេលចេញជាម៉ោងនិងនាទី",
    "question": "រថយន្តមួយបើកបរលើចម្ងាយ 210 km ដោយល្បឿន 60 km/h។ តើចំណាយពេលប៉ុន្មានម៉ោង និងនាទី?",
    "options": [
      {
        "text": "4 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "3 ម៉ោង 10 នាទី",
        "isCorrect": false
      },
      {
        "text": "3 ម៉ោង 50 នាទី",
        "isCorrect": false
      },
      {
        "text": "3 ម៉ោង 30 នាទី",
        "isCorrect": true
      }
    ],
    "explanation": "t = 210 / 60 = 3.5 h = 3 ម៉ោង 30 នាទី។",
    "points": 1
  },
  {
    "id": 17,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "គណនាចម្ងាយគិតជា m",
    "question": "យន្តហោះមួយហោះដោយល្បឿន 250 m/s។ តើក្នុងរយៈពេល 2 នាទី វាហោះបានចម្ងាយប៉ុន្មាន km?",
    "options": [
      {
        "text": "25 km",
        "isCorrect": false
      },
      {
        "text": "30 km",
        "isCorrect": true
      },
      {
        "text": "500 m",
        "isCorrect": false
      },
      {
        "text": "15 km",
        "isCorrect": false
      }
    ],
    "explanation": "2 នាទី = 120 s។ ចម្ងាយ = 250 × 120 = 30 000 m = 30 km។",
    "points": 1
  },
  {
    "id": 18,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "គណនាពេលគិតជាវិនាទី",
    "question": "សំឡេងធ្វើដំណើរក្នុងខ្យល់ដោយល្បឿន 340 m/s។ បើរន្ទះបាញ់នៅចម្ងាយ 1700 m តើប៉ុន្មានវិនាទីក្រោយទើបយើងឮផ្គរ?",
    "options": [
      {
        "text": "5 វិនាទី",
        "isCorrect": true
      },
      {
        "text": "4 វិនាទី",
        "isCorrect": false
      },
      {
        "text": "6 វិនាទី",
        "isCorrect": false
      },
      {
        "text": "50 វិនាទី",
        "isCorrect": false
      }
    ],
    "explanation": "t = d / v = 1700 / 340 = 5 វិនាទី។",
    "points": 1
  },
  {
    "id": 19,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "គណនាល្បឿនមធ្យមសរុប",
    "question": "អ្នកបើកបរម្នាក់ធ្វើដំណើរ 2 ម៉ោងដំបូងបាន 100 km និង 3 ម៉ោងបន្ទាប់បាន 180 km។ តើល្បឿនមធ្យមលើផ្លូវទាំងមូលស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "50 km/h",
        "isCorrect": false
      },
      {
        "text": "55 km/h",
        "isCorrect": false
      },
      {
        "text": "60 km/h",
        "isCorrect": false
      },
      {
        "text": "56 km/h",
        "isCorrect": true
      }
    ],
    "explanation": "ចម្ងាយសរុប = 100 + 180 = 280 km; ពេលសរុប = 2 + 3 = 5 h។ v = 280 / 5 = 56 km/h។",
    "points": 1
  },
  {
    "id": 20,
    "part": "ផ្នែកទី២ ៖ ការបំប្លែងឯកតារយៈពេល និងការគណនាស្មុគស្មាញ",
    "partSubtitle": "ការប្រៀបធៀបល្បឿន",
    "question": "រថយន្ត A មានល្បឿន 72 km/h និងរថយន្ត B មានល្បឿន 25 m/s។ តើរថយន្តណាមានល្បឿនលឿនជាង?",
    "options": [
      {
        "text": "រថយន្ត B លឿនជាង (25 m/s = 90 km/h)",
        "isCorrect": true
      },
      {
        "text": "រថយន្ត A លឿនជាង",
        "isCorrect": false
      },
      {
        "text": "រថយន្តទាំងពីរមានល្បឿនស្មើគ្នា",
        "isCorrect": false
      },
      {
        "text": "មិនអាចប្រៀបធៀបបានទេ",
        "isCorrect": false
      }
    ],
    "explanation": "ប្តូរ 25 m/s = 25 × 3.6 = 90 km/h > 72 km/h ដូច្នេះរថយន្ត B លឿនជាង។",
    "points": 1
  },
  {
    "id": 21,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "រូបមន្តចលនាច្រាសទិស",
    "question": "យានពីរធ្វើដំណើរចេញដំណើរក្នុងពេលតែមួយឆ្ពោះមករកគ្នា (ចលនាច្រាសទិស)។ តើរូបមន្តរករយៈពេលជួបគ្នា (t) គឺអ្វី?",
    "options": [
      {
        "text": "t = d × (v1 + v2)",
        "isCorrect": false
      },
      {
        "text": "t = d / (v1 - v2)",
        "isCorrect": false
      },
      {
        "text": "t = d / (v1 + v2)",
        "isCorrect": true
      },
      {
        "text": "t = (v1 + v2) / d",
        "isCorrect": false
      }
    ],
    "explanation": "ក្នុងចលនាច្រាសទិស ល្បឿនខិតជិតគ្នាគឺ v1 + v2 ដូច្នេះ រយៈពេលជួបគ្នា t = d / (v1 + v2)។",
    "points": 1
  },
  {
    "id": 22,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "ចំណោទជួបគ្នា",
    "question": "ទីក្រុង A និង B នៅឆ្ងាយពីគ្នា 210 km។ រថយន្តមួយចេញពី A ទៅ B ល្បឿន 40 km/h ហើយរថយន្តមួយទៀតចេញពី B ទៅ A ល្បឿន 30 km/h ក្នុងពេលតែមួយ។ តើប៉ុន្មានម៉ោងក្រោយទើបវាជួបគ្នា?",
    "options": [
      {
        "text": "4 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "3 ម៉ោង",
        "isCorrect": true
      },
      {
        "text": "2.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "3.5 ម៉ោង",
        "isCorrect": false
      }
    ],
    "explanation": "t = 210 / (40 + 30) = 210 / 70 = 3 ម៉ោង។",
    "points": 1
  },
  {
    "id": 23,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "ចម្ងាយពីទីតាំងចេញដំណើរពេលជួបគ្នា",
    "question": "ពីចំណោទទី២២ ខាងលើ តើកន្លែងជួបគ្នានៅឆ្ងាយពីទីក្រុង A ប៉ុន្មាន km?",
    "options": [
      {
        "text": "120 km",
        "isCorrect": true
      },
      {
        "text": "90 km",
        "isCorrect": false
      },
      {
        "text": "100 km",
        "isCorrect": false
      },
      {
        "text": "150 km",
        "isCorrect": false
      }
    ],
    "explanation": "រថយន្តចេញពី A រត់បាន 3 ម៉ោងដោយល្បឿន 40 km/h ៖ d_A = 40 × 3 = 120 km។",
    "points": 1
  },
  {
    "id": 24,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "ចម្ងាយពីទីតាំងចេញដំណើរទី២",
    "question": "ពីចំណោទទី២២ តើកន្លែងជួបគ្នានៅឆ្ងាយពីទីក្រុង B ប៉ុន្មាន km?",
    "options": [
      {
        "text": "120 km",
        "isCorrect": false
      },
      {
        "text": "90 km",
        "isCorrect": true
      },
      {
        "text": "100 km",
        "isCorrect": false
      },
      {
        "text": "80 km",
        "isCorrect": false
      }
    ],
    "explanation": "d_B = 30 × 3 = 90 km (ឬ 210 - 120 = 90 km)។",
    "points": 1
  },
  {
    "id": 25,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "ចំណោទជួបគ្នាជាមួយម៉ោងកំណត់",
    "question": "រថយន្តពីរចេញដំណើរនៅម៉ោង 7:00 ព្រឹកឆ្ពោះរកគ្នាពីចម្ងាយ 300 km ដោយល្បឿន 55 km/h និង 45 km/h។ តើវាជួបគ្នានៅម៉ោងប៉ុន្មាន?",
    "options": [
      {
        "text": "ម៉ោង 11:00 ព្រឹក",
        "isCorrect": false
      },
      {
        "text": "ម៉ោង 9:30 ព្រឹក",
        "isCorrect": false
      },
      {
        "text": "ម៉ោង 10:30 ព្រឹក",
        "isCorrect": false
      },
      {
        "text": "ម៉ោង 10:00 ព្រឹក",
        "isCorrect": true
      }
    ],
    "explanation": "t = 300 / (55 + 45) = 300 / 100 = 3 ម៉ោង។ ម៉ោងជួបគ្នា = 7:00 + 3:00 = 10:00 ព្រឹក។",
    "points": 1
  },
  {
    "id": 26,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "ចំណោទអ្នកថ្មើរជើងជួបគ្នា",
    "question": "មនុស្សពីរនាក់ដើររកគ្នាពីចម្ងាយ 18 km។ ម្នាក់ដើរល្បឿន 5 km/h និងម្នាក់ទៀត 4 km/h។ តើរយៈពេលប៉ុន្មានម៉ោងទើបគាត់ជួបគ្នា?",
    "options": [
      {
        "text": "1.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "3 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "2 ម៉ោង",
        "isCorrect": true
      },
      {
        "text": "2.5 ម៉ោង",
        "isCorrect": false
      }
    ],
    "explanation": "t = 18 / (5 + 4) = 18 / 9 = 2 ម៉ោង។",
    "points": 1
  },
  {
    "id": 27,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "រកចម្ងាយដើម",
    "question": "រថយន្តពីរចេញដំណើរឆ្ពោះរកគ្នាក្នុងពេលតែមួយដោយល្បឿន 50 km/h និង 60 km/h ហើយជួបគ្នាក្រោយពេល 4 ម៉ោង។ រកចម្ងាយដើមរវាងចំណុចទាំងពីរ។",
    "options": [
      {
        "text": "400 km",
        "isCorrect": false
      },
      {
        "text": "440 km",
        "isCorrect": true
      },
      {
        "text": "480 km",
        "isCorrect": false
      },
      {
        "text": "220 km",
        "isCorrect": false
      }
    ],
    "explanation": "d = (v1 + v2) × t = (50 + 60) × 4 = 110 × 4 = 440 km។",
    "points": 1
  },
  {
    "id": 28,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "រកល្បឿនមួយមិនស្គាល់",
    "question": "ទីតាំងពីរនៅឆ្ងាយគ្នា 200 km។ ឡានពីរចេញដំណើររកគ្នា ហើយជួបគ្នាក្រោយពេល 2 ម៉ោង។ បើឡានទី១ មានល្បឿន 55 km/h តើឡានទី២ មានល្បឿនប៉ុន្មាន?",
    "options": [
      {
        "text": "40 km/h",
        "isCorrect": false
      },
      {
        "text": "50 km/h",
        "isCorrect": false
      },
      {
        "text": "45 km/h",
        "isCorrect": true
      },
      {
        "text": "60 km/h",
        "isCorrect": false
      }
    ],
    "explanation": "v1 + v2 = 200 / 2 = 100 km/h => v2 = 100 - 55 = 45 km/h។",
    "points": 1
  },
  {
    "id": 29,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "ជួបគ្នាជាមួយពេលចេញមិនដំណាលគ្នា",
    "question": "ទីតាំង A និង B ឆ្ងាយគ្នា 160 km។ ឡានមួយចេញពី A នៅម៉ោង 6:00 ល្បឿន 40 km/h។ ដល់ម៉ោង 7:00 ឡានមួយទៀតចេញពី B ទៅ A ល្បឿន 60 km/h។ តើជួបគ្នាក្រោយពេលឡានទីពីរចេញដំណើរប៉ុន្មានម៉ោង?",
    "options": [
      {
        "text": "1.2 ម៉ោង (1 ម៉ោង 12 នាទី)",
        "isCorrect": true
      },
      {
        "text": "1.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "2 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "1 ម៉ោង",
        "isCorrect": false
      }
    ],
    "explanation": "នៅម៉ោង 7:00 ឡាន A ដើរបាន 40 km។ ចម្ងាយសល់ = 160 - 40 = 120 km។ t = 120 / (40 + 60) = 1.2 h = 1h 12mn។",
    "points": 1
  },
  {
    "id": 30,
    "part": "ផ្នែកទី៣ ៖ ចលនាច្រាសទិស (ជួបគ្នា)",
    "partSubtitle": "ជួបគ្នានៅពាក់កណ្តាលផ្លូវ",
    "question": "បើឡានពីរចេញពីទីតាំងផ្សេងគ្នាក្នុងពេលតែមួយ ហើយជួបគ្នានៅចំកណ្តាលផ្លូវ តើអាចសន្និដ្ឋានបានយ៉ាងដូចម្តេច?",
    "options": [
      {
        "text": "មិនអាចសន្និដ្ឋានបានទេ",
        "isCorrect": false
      },
      {
        "text": "ឡានទី១ លឿនជាង",
        "isCorrect": false
      },
      {
        "text": "ឡានទី២ លឿនជាង",
        "isCorrect": false
      },
      {
        "text": "ឡានទាំងពីរមានល្បឿនស្មើគ្នា",
        "isCorrect": true
      }
    ],
    "explanation": "ដោយសាររយៈពេលស្មើគ្នា ហើយចម្ងាយធ្វើដំណើរក៏ស្មើគ្នា នោះល្បឿនរបស់ឡានទាំងពីរគឺស្មើគ្នា (v1 = v2)។",
    "points": 1
  },
  {
    "id": 31,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "រូបមន្តចលនាស្របទិស",
    "question": "យានពីរធ្វើដំណើរក្នុងទិសដៅតែមួយដោយមានគម្លាតដំបូង d ហើយ v1 > v2។ តើរយៈពេលដេញទាន់ (t) គណនាតាមរូបមន្តណា?",
    "options": [
      {
        "text": "t = (v1 - v2) / d",
        "isCorrect": false
      },
      {
        "text": "t = d / (v1 + v2)",
        "isCorrect": false
      },
      {
        "text": "t = d / (v1 - v2)",
        "isCorrect": true
      },
      {
        "text": "t = d × (v1 - v2)",
        "isCorrect": false
      }
    ],
    "explanation": "ក្នុងចលនាស្របទិសដេញទាន់ ល្បឿនកាត់បន្ថយគម្លាតគឺ v1 - v2 ដូច្នេះ រយៈពេលដេញទាន់ t = d / (v1 - v2)។",
    "points": 1
  },
  {
    "id": 32,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "ចំណោទដេញទាន់",
    "question": "អ្នកជិះកង់ចេញដំណើរដោយល្បឿន 12 km/h។ ក្រោយមក 2 ម៉ោង ម៉ូតូមួយចេញដំណើរតាមពីក្រោយដោយល្បឿន 36 km/h។ តើប៉ុន្មានម៉ោងក្រោយទើបម៉ូតូដេញទាន់កង់?",
    "options": [
      {
        "text": "1.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "1 ម៉ោង",
        "isCorrect": true
      },
      {
        "text": "2 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "45 នាទី",
        "isCorrect": false
      }
    ],
    "explanation": "គម្លាតដំបូង d = 12 × 2 = 24 km។ រយៈពេលដេញទាន់ t = 24 / (36 - 12) = 24 / 24 = 1 ម៉ោង។",
    "points": 1
  },
  {
    "id": 33,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "ចម្ងាយដេញទាន់",
    "question": "ពីចំណោទទី៣២ ខាងលើ តើកន្លែងដេញទាន់នៅឆ្ងាយពីចំណុចចេញដំណើរប៉ុន្មាន km?",
    "options": [
      {
        "text": "30 km",
        "isCorrect": false
      },
      {
        "text": "24 km",
        "isCorrect": false
      },
      {
        "text": "48 km",
        "isCorrect": false
      },
      {
        "text": "36 km",
        "isCorrect": true
      }
    ],
    "explanation": "ម៉ូតូជិះបាន 1 ម៉ោងដោយល្បឿន 36 km/h ៖ d = 36 × 1 = 36 km។",
    "points": 1
  },
  {
    "id": 34,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "ចំណោទឡានដេញទាន់",
    "question": "ឡានដឹកទំនិញចេញដំណើរល្បឿន 40 km/h។ 1 ម៉ោងកន្លះក្រោយ ឡានទេសចរណ៍ចេញតាមល្បឿន 70 km/h។ តើរយៈពេលប៉ុន្មានទើបឡានទេសចរណ៍ដេញទាន់?",
    "options": [
      {
        "text": "2 ម៉ោង",
        "isCorrect": true
      },
      {
        "text": "2.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "1.5 ម៉ោង",
        "isCorrect": false
      },
      {
        "text": "3 ម៉ោង",
        "isCorrect": false
      }
    ],
    "explanation": "គម្លាត = 40 × 1.5 = 60 km។ t = 60 / (70 - 40) = 60 / 30 = 2 ម៉ោង។",
    "points": 1
  },
  {
    "id": 35,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "ចោរ និងប៉ូលិស",
    "question": "ចោរម្នាក់រត់ចេញដំណើរមុនដោយល្បឿន 6 m/s បានចម្ងាយ 60 m ទើបប៉ូលិសចាប់ផ្តើមរត់ដេញតាមដោយល្បឿន 8 m/s។ តើប៉ូលិសចំណាយពេលប៉ុន្មានវិនាទីដើម្បីដេញទាន់ចោរ?",
    "options": [
      {
        "text": "20 វិនាទី",
        "isCorrect": false
      },
      {
        "text": "30 វិនាទី",
        "isCorrect": true
      },
      {
        "text": "40 វិនាទី",
        "isCorrect": false
      },
      {
        "text": "15 វិនាទី",
        "isCorrect": false
      }
    ],
    "explanation": "t = 60 / (8 - 6) = 60 / 2 = 30 វិនាទី។",
    "points": 1
  },
  {
    "id": 36,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "ពេលវេលាធ្វើដំណើរជាក់ស្តែង",
    "question": "លោក សុខ ចេញពីផ្ទះនៅម៉ោង 8:15 នាទី ហើយទៅដល់កន្លែងធ្វើការនៅម៉ោង 8:55 នាទី ដោយចម្ងាយផ្លូវ 20 km។ តើគាត់បើកបរដោយល្បឿនប៉ុន្មាន km/h?",
    "options": [
      {
        "text": "35 km/h",
        "isCorrect": false
      },
      {
        "text": "25 km/h",
        "isCorrect": false
      },
      {
        "text": "40 km/h",
        "isCorrect": false
      },
      {
        "text": "30 km/h",
        "isCorrect": true
      }
    ],
    "explanation": "រយៈពេល t = 8h 55mn - 8h 15mn = 40 នាទី = 40/60 h = 2/3 h។ v = 20 ÷ (2/3) = 20 × 3/2 = 30 km/h។",
    "points": 1
  },
  {
    "id": 37,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "ការគណនាពេលទៅដល់",
    "question": "គ្រួសារមួយធ្វើដំណើរពីភ្នំពេញទៅកំពង់សោមចម្ងាយ 230 km ដោយល្បឿន 50 km/h។ បើពួកគេចេញដំណើរនៅម៉ោង 6:30 ព្រឹក និងឈប់សម្រាក 30 នាទីនៅតាមផ្លូវ តើពួកគេទៅដល់នៅម៉ោងប៉ុន្មាន?",
    "options": [
      {
        "text": "ម៉ោង 12:00 ថ្ងៃត្រង់",
        "isCorrect": false
      },
      {
        "text": "ម៉ោង 11:06 នាទី",
        "isCorrect": false
      },
      {
        "text": "ម៉ោង 11:36 នាទី",
        "isCorrect": true
      },
      {
        "text": "ម៉ោង 10:45 នាទី",
        "isCorrect": false
      }
    ],
    "explanation": "ពេលបើកបរ = 230 / 50 = 4.6 h = 4 ម៉ោង 36 នាទី។ បូកពេលសម្រាក 30 នាទី = 5 ម៉ោង 06 នាទី។ ម៉ោងទៅដល់ = 6:30 + 5:06 = 11:36 ព្រឹក។",
    "points": 1
  },
  {
    "id": 38,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "គណនាចម្ងាយទឹកហូរ",
    "question": "ទូកមួយបើកបរតាមខ្សែទឹកហូរដោយល្បឿន 24 km/h ក្នុងពេល 1 ម៉ោង 45 នាទី។ តើទូកនោះធ្វើដំណើរបានចម្ងាយប៉ុន្មាន km?",
    "options": [
      {
        "text": "42 km",
        "isCorrect": true
      },
      {
        "text": "36 km",
        "isCorrect": false
      },
      {
        "text": "40 km",
        "isCorrect": false
      },
      {
        "text": "48 km",
        "isCorrect": false
      }
    ],
    "explanation": "1h 45mn = 1.75 h។ d = 24 × 1.75 = 42 km។",
    "points": 1
  },
  {
    "id": 39,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "គណនាល្បឿនដើរ",
    "question": "កុមារម្នាក់ដើរពីផ្ទះទៅសាលារៀនចម្ងាយ 1.2 km ក្នុងរយៈពេល 15 នាទី។ តើល្បឿនដើររបស់គាត់គិតជា km/h ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "5 km/h",
        "isCorrect": false
      },
      {
        "text": "4.5 km/h",
        "isCorrect": false
      },
      {
        "text": "4.8 km/h",
        "isCorrect": true
      },
      {
        "text": "6 km/h",
        "isCorrect": false
      }
    ],
    "explanation": "15 នាទី = 15/60 = 0.25 h។ v = 1.2 / 0.25 = 4.8 km/h។",
    "points": 1
  },
  {
    "id": 40,
    "part": "ផ្នែកទី៤ ៖ ចលនាស្របទិស (ដេញទាន់) និងចំណោទជីវភាព",
    "partSubtitle": "គណនាល្បឿនរថភ្លើង",
    "question": "រថភ្លើងមួយឆ្លងកាត់ស្ពានប្រវែង 500 m ក្នុងពេល 25 វិនាទី។ តើល្បឿនរថភ្លើងគិតជា km/h ស្មើប៉ុន្មាន?",
    "options": [
      {
        "text": "72 km/h",
        "isCorrect": true
      },
      {
        "text": "60 km/h",
        "isCorrect": false
      },
      {
        "text": "50 km/h",
        "isCorrect": false
      },
      {
        "text": "80 km/h",
        "isCorrect": false
      }
    ],
    "explanation": "v = 500 m / 25 s = 20 m/s។ ប្តូរជា km/h ៖ 20 × 3.6 = 72 km/h។",
    "points": 1
  }
];

export const LESSON_14_FORMULAS: MathFormulaSection[] = [
  {
    "title": "១. រូបមន្តគ្រឹះនៃល្បឿន ចម្ងាយ និងរយៈពេល",
    "description": "ទំនាក់ទំនងត្រីកោណ v - d - t",
    "details": [
      "ល្បឿនមធ្យម ៖ v = d / t (Speed = Distance / Time)",
      "ចម្ងាយចរ ៖ d = v × t (Distance = Speed × Time)",
      "រយៈពេល ៖ t = d / v (Time = Distance / Speed)",
      "បំប្លែងឯកតា ៖ 1 m/s = 3.6 km/h ; 1 km/h = 1/3.6 m/s"
    ]
  },
  {
    "title": "២. ការបំប្លែងឯកតារយៈពេល",
    "description": "បំប្លែងនាទីជាម៉ោងទសភាគ",
    "details": [
      "15 នាទី = 15/60 h = 1/4 h = 0.25 h",
      "30 នាទី = 30/60 h = 1/2 h = 0.5 h",
      "45 នាទី = 45/60 h = 3/4 h = 0.75 h",
      "n នាទី = n/60 ម៉ោង"
    ]
  },
  {
    "title": "៣. ចលនាច្រាសទិស (ជួបគ្នា)",
    "description": "យានពីរធ្វើដំណើរឆ្ពោះរកគ្នា",
    "details": [
      "ល្បឿនរួម (ខិតជិតគ្នា) ៖ v_chhet = v1 + v2",
      "រយៈពេលជួបគ្នា ៖ t = d / (v1 + v2)",
      "ទីតាំងជួបគ្នាពីចំណុចទី១ ៖ d1 = v1 × t",
      "ទីតាំងជួបគ្នាពីចំណុចទី២ ៖ d2 = v2 × t"
    ]
  },
  {
    "title": "៤. ចលនាស្របទិស (ដេញទាន់)",
    "description": "យានមួយដេញតាមពីក្រោយយានមួយទៀត (v1 > v2)",
    "details": [
      "គម្លាតដំបូង ៖ d = v2 × t_moun (ចម្ងាយយានមុខចេញមុន)",
      "ល្បឿនដេញទាន់ (ល្បឿនលើស) ៖ v_denh = v1 - v2",
      "រយៈពេលដេញទាន់ ៖ t = d / (v1 - v2)",
      "ចម្ងាយពីចំណុចចេញដំណើរ ៖ d_total = v1 × t"
    ]
  }
];
