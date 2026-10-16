import React from 'react';

export type EnglishTopicType =
  | 'greetings_intro'
  | 'telling_time'
  | 'daily_routine_happy'
  | 'days_of_week'
  | 'months_year'
  | 'my_head_body'
  | 'body_care_safety'
  | 'my_hometown_market'
  | 'pets_animals'
  | 'dangerous_animals'
  | 'folk_tales_hen_chicks'
  | 'folk_tales_bear_bees'
  | 'grammar_to_be'
  | 'grammar_prepositions'
  | 'grammar_past_simple'
  | 'general_english';

interface EnglishTopicIllustrationProps {
  topic: EnglishTopicType;
  size?: 'hero' | 'card' | 'thumbnail';
  className?: string;
  showCaption?: boolean;
}

/**
 * Maps unit ID or number to illustration topic
 */
export function getEnglishUnitTopicType(unitIdOrNumber: string | number): EnglishTopicType {
  const idStr = String(unitIdOrNumber).toLowerCase();
  if (idStr.includes('u1') && idStr.includes('ch1')) return 'greetings_intro';
  if (idStr.includes('u2') && idStr.includes('ch1')) return 'telling_time';
  if (idStr.includes('u3') && idStr.includes('ch1')) return 'daily_routine_happy';
  if (idStr.includes('ch2')) return 'days_of_week';
  if (idStr.includes('ch3')) return 'my_head_body';
  if (idStr.includes('ch4')) return 'my_hometown_market';
  if (idStr.includes('ch5')) return 'pets_animals';
  if (idStr.includes('ch6')) return 'folk_tales_hen_chicks';

  const num = Number(unitIdOrNumber);
  switch (num) {
    case 1:
      return 'greetings_intro';
    case 2:
      return 'telling_time';
    case 3:
      return 'daily_routine_happy';
    case 4:
      return 'days_of_week';
    case 5:
      return 'my_head_body';
    case 6:
      return 'pets_animals';
    case 7:
      return 'folk_tales_hen_chicks';
    default:
      return 'general_english';
  }
}

/**
 * Maps exam question category or text to illustration topic
 */
export function getEnglishQuestionTopicType(
  category?: string,
  questionText?: string,
  id?: number | string
): EnglishTopicType {
  const combined = `${category || ''} ${questionText || ''}`.toLowerCase();

  if (combined.includes('greet') || combined.includes('morning') || combined.includes('afternoon') || combined.includes('evening') || combined.includes('name is') || combined.includes('name’s')) {
    return 'greetings_intro';
  }
  if (combined.includes('time') || combined.includes("o'clock") || combined.includes('quarter') || combined.includes('half past') || combined.includes('7:15') || combined.includes('11:30') || combined.includes('8:45')) {
    return 'telling_time';
  }
  if (combined.includes('day') || combined.includes('monday') || combined.includes('tuesday') || combined.includes('wednesday') || combined.includes('thursday') || combined.includes('friday') || combined.includes('saturday') || combined.includes('sunday')) {
    return 'days_of_week';
  }
  if (combined.includes('month') || combined.includes('january') || combined.includes('april') || combined.includes('khmer new year') || combined.includes('december') || combined.includes('national reading day')) {
    return 'months_year';
  }
  if (combined.includes('nose') || combined.includes('eye') || combined.includes('ear') || combined.includes('mouth') || combined.includes('head') || combined.includes('finger') || combined.includes('feet') || combined.includes('smell') || combined.includes('see')) {
    return 'my_head_body';
  }
  if (combined.includes('helmet') || combined.includes('pullover') || combined.includes('bicycle') || combined.includes('wear') || combined.includes('should')) {
    return 'body_care_safety';
  }
  if (combined.includes('market') || combined.includes('food') || combined.includes('vegetable') || combined.includes('near') || combined.includes('restaurant') || combined.includes('village')) {
    return 'my_hometown_market';
  }
  if (combined.includes('cobra') || combined.includes('mosquito') || combined.includes('dangerous') || combined.includes('crocodile') || combined.includes('dengue')) {
    return 'dangerous_animals';
  }
  if (combined.includes('pet') || combined.includes('dog') || combined.includes('cat') || combined.includes('rabbit') || combined.includes('parrot') || combined.includes('whale') || combined.includes('shark') || combined.includes('feed')) {
    return 'pets_animals';
  }
  if (combined.includes('hen') || combined.includes('chick') || combined.includes('eagle') || combined.includes('wing') || combined.includes('nest') || combined.includes('folk tale')) {
    return 'folk_tales_hen_chicks';
  }
  if (combined.includes('walked') || combined.includes('saw') || combined.includes('past simple') || combined.includes('irregular') || combined.includes('yesterday')) {
    return 'grammar_past_simple';
  }
  if (combined.includes('on / at') || combined.includes('preposition') || combined.includes('on foot') || combined.includes('in monday')) {
    return 'grammar_prepositions';
  }
  if (combined.includes('to be') || combined.includes('is') || combined.includes('am') || combined.includes('are') || combined.includes('she ___ a student')) {
    return 'grammar_to_be';
  }

  const numId = typeof id === 'number' ? id : Number(id);
  if (!isNaN(numId) && numId >= 1 && numId <= 40) {
    if (numId <= 3) return 'telling_time';
    if (numId <= 5) return 'days_of_week';
    if (numId <= 7) return 'my_head_body';
    if (numId <= 9) return 'pets_animals';
    if (numId === 10) return 'folk_tales_hen_chicks';
    if (numId === 11) return 'greetings_intro';
    if (numId === 12) return 'telling_time';
    if (numId <= 15) return 'months_year';
    if (numId <= 17) return 'body_care_safety';
    if (numId <= 19) return 'dangerous_animals';
    if (numId === 20) return 'folk_tales_hen_chicks';
    if (numId <= 22) return 'grammar_to_be';
    if (numId === 23) return 'grammar_prepositions';
    if (numId <= 27) return 'my_head_body';
    if (numId <= 30) return 'grammar_past_simple';
    if (numId === 31) return 'greetings_intro';
    if (numId <= 33) return 'telling_time';
    if (numId <= 35) return 'months_year';
    if (numId === 36) return 'my_head_body';
    if (numId === 37) return 'my_hometown_market';
    if (numId === 38) return 'pets_animals';
    if (numId <= 40) return 'folk_tales_hen_chicks';
  }

  return 'general_english';
}

export const EnglishTopicIllustration: React.FC<EnglishTopicIllustrationProps> = ({
  topic,
  size = 'card',
  className = '',
  showCaption = true,
}) => {
  const isHero = size === 'hero';
  const isThumb = size === 'thumbnail';

  const viewBox = isHero ? '0 0 600 240' : isThumb ? '0 0 100 80' : '0 0 420 180';
  const heightClass = isHero ? 'h-48 sm:h-60' : isThumb ? 'h-16 w-20' : 'h-36 sm:h-44';

  const renderContent = () => {
    switch (topic) {
      case 'greetings_intro':
        return (
          <g>
            <defs>
              <linearGradient id="greetBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eff6ff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#greetBg)" />
            {/* Morning Sun */}
            <circle cx="80" cy="80" r="38" fill="#f59e0b" opacity="0.9" />
            <circle cx="80" cy="80" r="28" fill="#fbbf24" />
            <text x="80" y="140" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="bold">
              Good morning!
            </text>

            {/* Dialog speech bubbles */}
            <g transform="translate(145, 25)">
              {/* Bol bubble */}
              <rect width="245" height="52" rx="12" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="12" y="24" fill="#1d4ed8" fontSize="11" fontWeight="bold">
                👦 Bol: "Good morning! My name’s Bol."
              </text>
              <text x="12" y="40" fill="#64748b" fontSize="9">
                "I am 12 years old. I'm in Grade 6."
              </text>

              {/* Nita bubble */}
              <rect y="64" width="245" height="52" rx="12" fill="#ffffff" stroke="#ec4899" strokeWidth="1.5" />
              <text x="12" y="88" fill="#be185d" fontSize="11" fontWeight="bold">
                👧 Nita: "Good morning! I’m Nita."
              </text>
              <text x="12" y="104" fill="#64748b" fontSize="9">
                "I'm fine, thank you. And you?"
              </text>
            </g>
          </g>
        );

      case 'telling_time':
        return (
          <g>
            <defs>
              <linearGradient id="timeBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#timeBg)" />
            {/* Clock Face 1: 7:15 (Quarter past 7) */}
            <g transform="translate(25, 25)">
              <circle cx="55" cy="55" r="48" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />
              <circle cx="55" cy="55" r="4" fill="#15803d" />
              {/* Hour hand pointing at 7 */}
              <line x1="55" y1="55" x2="40" y2="75" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
              {/* Minute hand pointing at 3 (15 mins) */}
              <line x1="55" y1="55" x2="88" y2="55" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
              <text x="55" y="122" textAnchor="middle" fill="#14532d" fontSize="9" fontWeight="bold">
                7:15 (quarter past)
              </text>
            </g>

            {/* Clock Face 2: 11:30 (Half past 11) */}
            <g transform="translate(155, 25)">
              <circle cx="55" cy="55" r="48" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" />
              <circle cx="55" cy="55" r="4" fill="#0369a1" />
              {/* Hour hand pointing between 11 and 12 */}
              <line x1="55" y1="55" x2="43" y2="35" stroke="#0369a1" strokeWidth="3.5" strokeLinecap="round" />
              {/* Minute hand pointing at 6 (30 mins) */}
              <line x1="55" y1="55" x2="55" y2="90" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
              <text x="55" y="122" textAnchor="middle" fill="#075985" fontSize="9" fontWeight="bold">
                11:30 (half past)
              </text>
            </g>

            {/* Clock Face 3: 8:45 (Quarter to 9) */}
            <g transform="translate(285, 25)">
              <circle cx="55" cy="55" r="48" fill="#ffffff" stroke="#8b5cf6" strokeWidth="3" />
              <circle cx="55" cy="55" r="4" fill="#6d28d9" />
              {/* Hour hand pointing near 9 */}
              <line x1="55" y1="55" x2="35" y2="50" stroke="#6d28d9" strokeWidth="3.5" strokeLinecap="round" />
              {/* Minute hand pointing at 9 (45 mins) */}
              <line x1="55" y1="55" x2="20" y2="55" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
              <text x="55" y="122" textAnchor="middle" fill="#5b21b6" fontSize="9" fontWeight="bold">
                8:45 (quarter to 9)
              </text>
            </g>
          </g>
        );

      case 'daily_routine_happy':
        return (
          <g>
            <defs>
              <linearGradient id="drBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#drBg)" />
            {/* Card 1: School */}
            <g transform="translate(30, 25)">
              <rect width="105" height="125" rx="12" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
              <text x="52" y="45" textAnchor="middle" fontSize="28">🏫</text>
              <text x="52" y="78" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                Go to school
              </text>
              <text x="52" y="96" textAnchor="middle" fill="#64748b" fontSize="8">
                on foot / by bike
              </text>
              <text x="52" y="112" textAnchor="middle" fill="#d97706" fontSize="8" fontWeight="bold">
                at 6:30 AM
              </text>
            </g>

            {/* Card 2: Sports & Badminton */}
            <g transform="translate(155, 25)">
              <rect width="105" height="125" rx="12" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" />
              <text x="52" y="45" textAnchor="middle" fontSize="28">🏸</text>
              <text x="52" y="78" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="bold">
                Play sports
              </text>
              <text x="52" y="96" textAnchor="middle" fill="#64748b" fontSize="8">
                with friends
              </text>
              <text x="52" y="112" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold">
                at 4:30 PM
              </text>
            </g>

            {/* Card 3: Watch TV / Study */}
            <g transform="translate(280, 25)">
              <rect width="105" height="125" rx="12" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
              <text x="52" y="45" textAnchor="middle" fontSize="28">📺</text>
              <text x="52" y="78" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="bold">
                Watch TV
              </text>
              <text x="52" y="96" textAnchor="middle" fill="#64748b" fontSize="8">
                after dinner
              </text>
              <text x="52" y="112" textAnchor="middle" fill="#2563eb" fontSize="8" fontWeight="bold">
                Feeling happy!
              </text>
            </g>
          </g>
        );

      case 'days_of_week':
        return (
          <g>
            <defs>
              <linearGradient id="daysBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ecfdf5" />
                <stop offset="100%" stopColor="#ccfbf1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#daysBg)" />
            {/* Days Train engine & wagons */}
            <g transform="translate(20, 30)">
              <rect width="380" height="36" rx="8" fill="#1e293b" />
              <text x="190" y="24" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                🚂 Days of the Week: Use "on" (on Monday, on Friday...)
              </text>
            </g>

            {/* 7 Days Pills */}
            <g transform="translate(15, 80)">
              {[
                { name: 'Mon', color: '#3b82f6', day: 'Monday' },
                { name: 'Tue', color: '#10b981', day: 'Tuesday' },
                { name: 'Wed', color: '#f59e0b', day: 'Wednesday' },
                { name: 'Thu', color: '#8b5cf6', day: 'Thursday' },
                { name: 'Fri', color: '#ec4899', day: 'Friday' },
                { name: 'Sat', color: '#06b6d4', day: 'Saturday' },
                { name: 'Sun', color: '#ef4444', day: 'Sunday' },
              ].map((d, idx) => (
                <g key={d.name} transform={`translate(${idx * 55}, 0)`}>
                  <rect width="50" height="52" rx="10" fill="#ffffff" stroke={d.color} strokeWidth="1.5" />
                  <text x="25" y="24" textAnchor="middle" fill={d.color} fontSize="11" fontWeight="bold">
                    {d.name}
                  </text>
                  <text x="25" y="42" textAnchor="middle" fill="#64748b" fontSize="7">
                    on {d.name}
                  </text>
                </g>
              ))}
            </g>

            <text x="210" y="160" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">
              "We study English on Monday and Friday at 8 o’clock."
            </text>
          </g>
        );

      case 'months_year':
        return (
          <g>
            <defs>
              <linearGradient id="monBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#faf5ff" />
                <stop offset="100%" stopColor="#f3e8ff" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#monBg)" />
            {/* Header */}
            <rect x="25" y="20" width="370" height="30" rx="8" fill="#7e22ce" />
            <text x="210" y="40" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              📅 12 Months in a Year: Use "in" (in April, in January...)
            </text>

            {/* Special event badges */}
            <g transform="translate(35, 65)">
              <rect width="165" height="85" rx="12" fill="#ffffff" stroke="#ec4899" strokeWidth="1.5" />
              <text x="82" y="32" textAnchor="middle" fill="#be185d" fontSize="20">🇰🇭</text>
              <text x="82" y="55" textAnchor="middle" fill="#9d174d" fontSize="10" fontWeight="bold">
                Khmer New Year
              </text>
              <text x="82" y="72" textAnchor="middle" fill="#db2777" fontSize="9" fontWeight="bold">
                in April
              </text>
            </g>

            <g transform="translate(220, 65)">
              <rect width="165" height="85" rx="12" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="82" y="32" textAnchor="middle" fill="#1d4ed8" fontSize="20">📚</text>
              <text x="82" y="55" textAnchor="middle" fill="#1e40af" fontSize="10" fontWeight="bold">
                National Reading Day
              </text>
              <text x="82" y="72" textAnchor="middle" fill="#2563eb" fontSize="9" fontWeight="bold">
                on March 11th
              </text>
            </g>
          </g>
        );

      case 'my_head_body':
        return (
          <g>
            <defs>
              <linearGradient id="bodyBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff7ed" />
                <stop offset="100%" stopColor="#ffedd5" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#bodyBg)" />
            {/* Face Center Graphic */}
            <g transform="translate(40, 25)">
              <circle cx="65" cy="65" r="50" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              {/* Eyes */}
              <circle cx="50" cy="55" r="5" fill="#1e293b" />
              <circle cx="80" cy="55" r="5" fill="#1e293b" />
              {/* Nose */}
              <path d="M65,60 L62,72 L68,72 Z" fill="#c2410c" />
              {/* Smile Mouth */}
              <path d="M52,82 Q65,96 78,82" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Ears */}
              <circle cx="12" cy="65" r="9" fill="#fed7aa" stroke="#ea580c" />
              <circle cx="118" cy="65" r="9" fill="#fed7aa" stroke="#ea580c" />
              <text x="65" y="138" textAnchor="middle" fill="#9a3412" fontSize="10" fontWeight="bold">
                My Head
              </text>
            </g>

            {/* Labels and grammar */}
            <g transform="translate(185, 25)">
              <rect width="205" height="34" rx="8" fill="#ffffff" stroke="#ea580c" strokeWidth="1" />
              <text x="12" y="22" fill="#c2410c" fontSize="9" fontWeight="bold">
                👁️ Two eyes ➔ My eyes can see.
              </text>

              <rect y="42" width="205" height="34" rx="8" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
              <text x="12" y="64" fill="#0369a1" fontSize="9" fontWeight="bold">
                👃 One nose ➔ My nose can smell.
              </text>

              <rect y="84" width="205" height="34" rx="8" fill="#ffffff" stroke="#16a34a" strokeWidth="1" />
              <text x="12" y="106" fill="#15803d" fontSize="9" fontWeight="bold">
                👂 Two ears ➔ My ears can hear.
              </text>
            </g>
          </g>
        );

      case 'body_care_safety':
        return (
          <g>
            <defs>
              <linearGradient id="careBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#careBg)" />
            {/* Safe Riding with Helmet */}
            <g transform="translate(35, 25)">
              <rect width="160" height="125" rx="14" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
              <text x="80" y="48" textAnchor="middle" fontSize="30">🪖</text>
              <text x="80" y="78" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="bold">
                Wear a Helmet
              </text>
              <text x="80" y="96" textAnchor="middle" fill="#64748b" fontSize="8">
                when riding a bike / moto
              </text>
              <text x="80" y="112" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold">
                To be safe & healthy!
              </text>
            </g>

            {/* Cold Weather Pullover */}
            <g transform="translate(220, 25)">
              <rect width="165" height="125" rx="14" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="82" y="48" textAnchor="middle" fontSize="30">🧥</text>
              <text x="82" y="78" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="bold">
                Wear a Pullover
              </text>
              <text x="82" y="96" textAnchor="middle" fill="#64748b" fontSize="8">
                when it is cold outside
              </text>
              <text x="82" y="112" textAnchor="middle" fill="#2563eb" fontSize="8" fontWeight="bold">
                Gloves and socks too
              </text>
            </g>
          </g>
        );

      case 'my_hometown_market':
        return (
          <g>
            <defs>
              <linearGradient id="townBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdfa" />
                <stop offset="100%" stopColor="#ccfbf1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#townBg)" />
            {/* Market Scene */}
            <g transform="translate(35, 25)">
              <rect width="160" height="125" rx="14" fill="#ffffff" stroke="#0d9488" strokeWidth="2" />
              <text x="80" y="48" textAnchor="middle" fontSize="30">🛒</text>
              <text x="80" y="78" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="bold">
                Village Market
              </text>
              <text x="80" y="96" textAnchor="middle" fill="#64748b" fontSize="8">
                Buy meat, fish & fruit
              </text>
              <text x="80" y="112" textAnchor="middle" fill="#0d9488" fontSize="8" fontWeight="bold">
                Fresh food at fair price
              </text>
            </g>

            {/* Location & Directions */}
            <g transform="translate(220, 25)">
              <rect width="165" height="125" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              <text x="82" y="48" textAnchor="middle" fontSize="28">🧭</text>
              <text x="82" y="76" textAnchor="middle" fill="#075985" fontSize="10" fontWeight="bold">
                Giving Directions
              </text>
              <text x="82" y="94" textAnchor="middle" fill="#64748b" fontSize="8">
                • Near the restaurant
              </text>
              <text x="82" y="108" textAnchor="middle" fill="#64748b" fontSize="8">
                • Opposite the pagoda
              </text>
              <text x="82" y="122" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="bold">
                Go straight ahead!
              </text>
            </g>
          </g>
        );

      case 'pets_animals':
        return (
          <g>
            <defs>
              <linearGradient id="petBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf4ff" />
                <stop offset="100%" stopColor="#fae8ff" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#petBg)" />
            {/* Dogs */}
            <g transform="translate(35, 25)">
              <rect width="160" height="125" rx="14" fill="#ffffff" stroke="#c026d3" strokeWidth="2" />
              <text x="80" y="48" textAnchor="middle" fontSize="30">🐶</text>
              <text x="80" y="78" textAnchor="middle" fill="#a21caf" fontSize="11" fontWeight="bold">
                Jimmy & Dicky
              </text>
              <text x="80" y="96" textAnchor="middle" fill="#64748b" fontSize="8">
                Friendly & smart pets
              </text>
              <text x="80" y="112" textAnchor="middle" fill="#c026d3" fontSize="8" fontWeight="bold">
                "I like dogs very much!"
              </text>
            </g>

            {/* Other Pets */}
            <g transform="translate(220, 25)">
              <rect width="165" height="125" rx="14" fill="#ffffff" stroke="#059669" strokeWidth="2" />
              <text x="82" y="48" textAnchor="middle" fontSize="28">🐱 🦜 🐟</text>
              <text x="82" y="76" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">
                Pets in Cambodia
              </text>
              <text x="82" y="94" textAnchor="middle" fill="#64748b" fontSize="8">
                Cats, parrots, doves, fish
              </text>
              <text x="82" y="110" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="bold">
                Like / Do not like
              </text>
            </g>
          </g>
        );

      case 'dangerous_animals':
        return (
          <g>
            <defs>
              <linearGradient id="dangBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="100%" stopColor="#ffe4e6" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#dangBg)" />
            <g transform="translate(35, 25)">
              <rect width="160" height="125" rx="14" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
              <text x="80" y="48" textAnchor="middle" fontSize="30">🐍</text>
              <text x="80" y="78" textAnchor="middle" fill="#9f1239" fontSize="11" fontWeight="bold">
                Cobra Snake
              </text>
              <text x="80" y="96" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">
                Dangerous & poisonous!
              </text>
              <text x="80" y="112" textAnchor="middle" fill="#64748b" fontSize="8">
                Stay far away!
              </text>
            </g>

            <g transform="translate(220, 25)">
              <rect width="165" height="125" rx="14" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
              <text x="82" y="48" textAnchor="middle" fontSize="30">🦟</text>
              <text x="82" y="78" textAnchor="middle" fill="#9f1239" fontSize="11" fontWeight="bold">
                Mosquito
              </text>
              <text x="82" y="96" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">
                Causes dengue fever!
              </text>
              <text x="82" y="112" textAnchor="middle" fill="#64748b" fontSize="8">
                Sleep inside mosquito nets
              </text>
            </g>
          </g>
        );

      case 'folk_tales_hen_chicks':
        return (
          <g>
            <defs>
              <linearGradient id="folkBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fefce8" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#folkBg)" />
            {/* Hen & Chicks */}
            <g transform="translate(35, 25)">
              <rect width="160" height="125" rx="14" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
              <text x="80" y="46" textAnchor="middle" fontSize="28">🐔 🐥🐥</text>
              <text x="80" y="76" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                The Hen & The Chicks
              </text>
              <text x="80" y="94" textAnchor="middle" fill="#64748b" fontSize="8">
                There was one hen.
              </text>
              <text x="80" y="110" textAnchor="middle" fill="#d97706" fontSize="8" fontWeight="bold">
                There were ten chicks.
              </text>
            </g>

            {/* Soaring Eagle */}
            <g transform="translate(220, 25)">
              <rect width="165" height="125" rx="14" fill="#ffffff" stroke="#475569" strokeWidth="2" />
              <text x="82" y="46" textAnchor="middle" fontSize="28">🦅</text>
              <text x="82" y="76" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
                The Eagle Above
              </text>
              <text x="82" y="94" textAnchor="middle" fill="#64748b" fontSize="8">
                Chicks hid under wings
              </text>
              <text x="82" y="110" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="bold">
                Mothers protect their babies
              </text>
            </g>
          </g>
        );

      case 'grammar_to_be':
      case 'grammar_prepositions':
      case 'grammar_past_simple':
      case 'general_english':
      default:
        return (
          <g>
            <defs>
              <linearGradient id="engBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eff6ff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#engBg)" />
            <circle cx="80" cy="90" r="45" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
            <text x="80" y="98" textAnchor="middle" fill="#1d4ed8" fontSize="34">🔤</text>

            <g transform="translate(150, 35)">
              <rect width="240" height="110" rx="14" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="120" y="32" textAnchor="middle" fill="#1e3a8a" fontSize="13" fontWeight="bold">
                English Grade 6 • MoEYS
              </text>
              <text x="120" y="54" textAnchor="middle" fill="#2563eb" fontSize="10">
                Student’s Book Official Curriculum
              </text>
              <text x="120" y="74" textAnchor="middle" fill="#64748b" fontSize="9">
                Vocab • Spell • Dialog • Grammar • Read • Speak • Write
              </text>
              <text x="120" y="94" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
                ៤០ សំណួរ QCM & Grammar Review
              </text>
            </g>
          </g>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <svg
        viewBox={viewBox}
        className={`w-full ${heightClass} object-contain transition-transform duration-300 hover:scale-[1.01]`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderContent()}
      </svg>
      {showCaption && !isThumb && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/60 backdrop-blur-xs text-[9px] font-bold text-white flex items-center gap-1 shadow-xs pointer-events-none">
          <span>🎨 រូបភាពគរុកោសល្យ MoEYS</span>
        </div>
      )}
    </div>
  );
};
