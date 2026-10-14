import React from 'react';

export type HealthTopicType =
  | 'food_pyramid'
  | 'growth_scale'
  | 'diet_disease'
  | 'food_safety'
  | 'water_f_diagram'
  | 'home_hygiene'
  | 'dental_vision'
  | 'parasites_rabies'
  | 'peer_pressure'
  | 'adolescent_relations'
  | 'cyber_safety'
  | 'anti_harassment'
  | 'puberty_delay'
  | 'health_rights'
  | 'hiv_aids_awareness'
  | 'six_step_goals'
  | 'first_aid'
  | 'air_pollution'
  | 'noise_pollution'
  | 'general_health';

interface HealthTopicIllustrationProps {
  topic: HealthTopicType;
  size?: 'hero' | 'card' | 'thumbnail';
  className?: string;
  showCaption?: boolean;
}

/**
 * Maps lesson number (1-18) to illustration topic
 */
export function getLessonTopicType(lessonNumber: number): HealthTopicType {
  switch (lessonNumber) {
    case 1:
      return 'food_pyramid';
    case 2:
      return 'growth_scale';
    case 3:
      return 'diet_disease';
    case 4:
      return 'food_safety';
    case 5:
      return 'water_f_diagram';
    case 6:
      return 'home_hygiene';
    case 7:
      return 'dental_vision';
    case 8:
      return 'parasites_rabies';
    case 9:
      return 'peer_pressure';
    case 10:
      return 'adolescent_relations';
    case 11:
      return 'cyber_safety';
    case 12:
      return 'anti_harassment';
    case 13:
      return 'puberty_delay';
    case 14:
      return 'health_rights';
    case 15:
      return 'hiv_aids_awareness';
    case 16:
      return 'six_step_goals';
    case 17:
      return 'first_aid';
    case 18:
      return 'air_pollution';
    default:
      return 'general_health';
  }
}

/**
 * Maps question details (part, partSubtitle, question text, or id) to illustration topic
 */
export function getQuestionTopicType(
  part?: string | number,
  partSubtitle?: string,
  questionText?: string,
  lessonNumber?: number
): HealthTopicType {
  const combined = `${part || ''} ${partSubtitle || ''} ${questionText || ''}`.toLowerCase();

  if (combined.includes('ពីរ៉ាមីត') || combined.includes('តុល្យភាពអាហារ') || combined.includes('ក្រុមអាហារ')) {
    return 'food_pyramid';
  }
  if (combined.includes('ថ្លឹង') || combined.includes('ទម្ងន់') || combined.includes('កម្ពស់') || combined.includes('ជញ្ជីង')) {
    return 'growth_scale';
  }
  if (combined.includes('ជំងឺមិនឆ្លង') || combined.includes('ទឹកនោមផ្អែម') || combined.includes('លើសឈាម') || combined.includes('ប្រៃ') || combined.includes('ផ្អែមខ្លាំង')) {
    return 'diet_disease';
  }
  if (combined.includes('កូនសោគន្លឹះ') || combined.includes('សុវត្ថិភាពចំណី') || combined.includes('សីតុណ្ហភាព') || combined.includes('danger zone') || combined.includes('ឆៅ និងឆ្អិន')) {
    return 'food_safety';
  }
  if (combined.includes('f-diagram') || combined.includes('ទឹកសុវត្ថិភាព') || combined.includes('ដាំពុះ') || combined.includes('sodis') || combined.includes('ចម្រោះ')) {
    return 'water_f_diagram';
  }
  if (combined.includes('បង្គន់') || combined.includes('ចង្ក្រាន') || combined.includes('បន្ទប់គេង') || combined.includes('អនាម័យនៅផ្ទះ') || combined.includes('dust mites')) {
    return 'home_hygiene';
  }
  if (combined.includes('ធ្មេញ') || combined.includes('ភ្នែក') || combined.includes('ម្ញូប') || combined.includes('២០-២០-២០') || combined.includes('កំណុំរូបភាព')) {
    return 'dental_vision';
  }
  if (combined.includes('ឆ្កែឆ្កួត') || combined.includes('rabies') || combined.includes('ព្រូន') || combined.includes('វ៉ាក់សាំង') || combined.includes('hydrophobia')) {
    return 'parasites_rabies';
  }
  if (combined.includes('សម្ពាធ') || combined.includes('មិត្តភក្តិ') || combined.includes('និយាយថា') || combined.includes('ចង្កឹះ') || combined.includes('តានតឹង') || combined.includes('ខឹង')) {
    return 'peer_pressure';
  }
  if (combined.includes('ពេញវ័យ') || combined.includes('ទំនាក់ទំនង') || combined.includes('គ្រួសារ') || combined.includes('ស្តាប់') || combined.includes('មិត្តភេទផ្ទុយ')) {
    return 'adolescent_relations';
  }
  if (combined.includes('អ៊ីនធឺណិត') || combined.includes('បណ្តាញសង្គម') || combined.includes('អនឡាញ') || combined.includes('ហ្គេម') || combined.includes('កាមេរ៉ា') || combined.includes('cyber')) {
    return 'cyber_safety';
  }
  if (combined.includes('បៀតបៀន') || combined.includes('ហិង្សា') || combined.includes('ព្រំដែន') || combined.includes('រាយការណ៍') || combined.includes('ប៉ះពាល់')) {
    return 'anti_harassment';
  }
  if (combined.includes('ចំណង់ផ្លូវភេទ') || combined.includes('ពន្យារពេល') || combined.includes('សម្រេចចំណង់') || combined.includes('ជំទង់')) {
    return 'puberty_delay';
  }
  if (combined.includes('សិទ្ធិទាំង') || combined.includes('អនាម័យស្រី') || combined.includes('អនាម័យប្រុស') || combined.includes('ទ្វារមាស') || combined.includes('ជូតពីមុខទៅក្រោយ')) {
    return 'health_rights';
  }
  if (combined.includes('អេដស៍') || combined.includes('hiv') || combined.includes('aids') || combined.includes('កាមរោគ') || combined.includes('stis') || combined.includes('ស្រោមអនាម័យ')) {
    return 'hiv_aids_awareness';
  }
  if (combined.includes('គោលដៅ') || combined.includes('ផែនការ') || combined.includes('៦ ជំហាន') || combined.includes('ក្តីសុបិន')) {
    return 'six_step_goals';
  }
  if (combined.includes('សង្គ្រោះបឋម') || combined.includes('first aid') || combined.includes('រលាក') || combined.includes('ឈាមច្រមុះ') || combined.includes('ស្លាក់') || combined.includes('heimlich') || combined.includes('មុត')) {
    return 'first_aid';
  }
  if (combined.includes('ខ្យល់') || combined.includes('ផ្សែង') || combined.includes('ដុតសំរាម') || combined.includes('ដើមឈើ') || combined.includes('pm2.5')) {
    return 'air_pollution';
  }
  if (combined.includes('សំឡេង') || combined.includes('ដេស៊ីបែល') || combined.includes('db') || combined.includes('ហឺត') || combined.includes('hz') || combined.includes('ថ្លង់') || combined.includes('ត្រចៀក')) {
    return 'noise_pollution';
  }

  if (lessonNumber) {
    return getLessonTopicType(lessonNumber);
  }

  return 'general_health';
}

export const HealthTopicIllustration: React.FC<HealthTopicIllustrationProps> = ({
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
      case 'food_pyramid':
        return (
          <g>
            <defs>
              <linearGradient id="pyrBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ecfdf5" />
                <stop offset="100%" stopColor="#ccfbf1" />
              </linearGradient>
              <linearGradient id="tier1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
              <linearGradient id="tier2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="tier3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="tier4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#pyrBg)" />
            {/* Pyramid Base: Grains (Rice/Bread) */}
            <polygon points="120,165 300,165 270,125 150,125" fill="url(#tier4)" opacity="0.95" />
            <text x="210" y="148" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
              បាយ ម្សៅ ទឹក (បរិភោគច្រើនបំផុត)
            </text>
            {/* Tier 2: Veggies & Fruits */}
            <polygon points="152,123 268,123 248,85 172,85" fill="url(#tier3)" opacity="0.95" />
            <text x="210" y="107" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              បន្លែ ផ្លែឈើ (បរិភោគច្រើន)
            </text>
            {/* Tier 3: Meat, Fish, Milk, Eggs */}
            <polygon points="174,83 246,83 232,50 188,50" fill="url(#tier2)" opacity="0.95" />
            <text x="210" y="70" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              សាច់ ត្រី ស៊ុត ទឹកដោះគោ
            </text>
            {/* Tier 4: Top - Oil, Sugar, Salt */}
            <polygon points="190,48 230,48 210,18" fill="url(#tier1)" opacity="0.95" />
            <text x="210" y="36" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              ខ្លាញ់ ស្ករ អំបិល (តិចបំផុត)
            </text>
            {/* Healthy Icons on side */}
            <g transform="translate(325, 30)">
              <rect width="80" height="32" rx="8" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
              <text x="40" y="20" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="bold">
                🥗 តុល្យភាព
              </text>
              <rect y="42" width="80" height="32" rx="8" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="40" y="62" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">
                💧 ទឹកស្អាត
              </text>
              <rect y="84" width="80" height="32" rx="8" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="40" y="104" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="bold">
                🏃 កីឡាប្រចាំថ្ងៃ
              </text>
            </g>
          </g>
        );

      case 'growth_scale':
        return (
          <g>
            <defs>
              <linearGradient id="growthBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#growthBg)" />
            {/* Stadiometer Height Ruler */}
            <rect x="70" y="25" width="24" height="135" rx="4" fill="#1e293b" />
            <line x1="82" y1="35" x2="90" y2="35" stroke="#38bdf8" strokeWidth="2" />
            <line x1="82" y1="55" x2="88" y2="55" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="82" y1="75" x2="90" y2="75" stroke="#38bdf8" strokeWidth="2" />
            <line x1="82" y1="95" x2="88" y2="95" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="82" y1="115" x2="90" y2="115" stroke="#38bdf8" strokeWidth="2" />
            <line x1="82" y1="135" x2="88" y2="135" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="82" y="153" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">cm</text>

            {/* Weighing Scale */}
            <circle cx="210" cy="115" r="48" fill="#ffffff" stroke="#10b981" strokeWidth="4" />
            <circle cx="210" cy="115" r="38" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            {/* Gauge marks */}
            <line x1="210" y1="82" x2="210" y2="88" stroke="#047857" strokeWidth="2" />
            <line x1="180" y1="115" x2="186" y2="115" stroke="#047857" strokeWidth="2" />
            <line x1="240" y1="115" x2="234" y2="115" stroke="#047857" strokeWidth="2" />
            {/* Needle at healthy weight */}
            <line x1="210" y1="115" x2="218" y2="90" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <circle cx="210" cy="115" r="4" fill="#1e293b" />
            <text x="210" y="132" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="bold">kg</text>

            {/* Badges */}
            <g transform="translate(285, 35)">
              <rect width="115" height="34" rx="8" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
              <text x="57" y="16" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">
                ⚖️ ថ្លឹងទម្ងន់
              </text>
              <text x="57" y="28" textAnchor="middle" fill="#64748b" fontSize="8">
                ១ ដង / ក្នុងមួយខែ
              </text>
              <rect y="44" width="115" height="34" rx="8" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="57" y="60" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
                📏 វាស់កម្ពស់
              </text>
              <text x="57" y="72" textAnchor="middle" fill="#64748b" fontSize="8">
                ២ ដង / ក្នុងមួយឆ្នាំ
              </text>
            </g>
          </g>
        );

      case 'diet_disease':
        return (
          <g>
            <defs>
              <linearGradient id="dietBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="100%" stopColor="#ffe4e6" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#dietBg)" />
            {/* Safe Heart */}
            <path
              d="M110,65 C110,45 85,35 70,55 C55,35 30,45 30,65 C30,95 70,120 70,120 C70,120 110,95 110,65 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="2"
            />
            <text x="70" y="80" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              បេះដូងរឹងមាំ
            </text>
            <text x="70" y="142" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="bold">
              ✅ បន្លែ ផ្លែឈើ ទឹកស្អាត
            </text>

            {/* Warning Shield */}
            <circle cx="210" cy="85" r="38" fill="#ef4444" opacity="0.1" stroke="#f43f5e" strokeWidth="2" />
            <text x="210" y="78" textAnchor="middle" fill="#be123c" fontSize="22">⚠️</text>
            <text x="210" y="100" textAnchor="middle" fill="#be123c" fontSize="10" fontWeight="bold">
              កាត់បន្ថយ!
            </text>

            {/* Danger foods list */}
            <g transform="translate(265, 30)">
              <rect width="135" height="34" rx="8" fill="#ffffff" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="12" y="21" fill="#be123c" fontSize="10" fontWeight="bold">
                🧂 ប្រៃខ្លាំង ➔ លើសឈាម
              </text>
              <rect y="42" width="135" height="34" rx="8" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="12" y="63" fill="#b45309" fontSize="10" fontWeight="bold">
                🍬 ផ្អែមខ្លាំង ➔ ទឹកនោមផ្អែម
              </text>
              <rect y="84" width="135" height="34" rx="8" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
              <text x="12" y="105" fill="#334155" fontSize="10" fontWeight="bold">
                🍟 ខ្លាញ់ច្រើន ➔ ស្ទះបេះដូង
              </text>
            </g>
          </g>
        );

      case 'food_safety':
        return (
          <g>
            <defs>
              <linearGradient id="fsBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdfa" />
                <stop offset="100%" stopColor="#ccfbf1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#fsBg)" />
            {/* WHO 5 Keys Circular Graphic */}
            <circle cx="95" cy="90" r="50" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="95" y="80" textAnchor="middle" fill="#0f766e" fontSize="20" fontWeight="bold">5</text>
            <text x="95" y="98" textAnchor="middle" fill="#0f766e" fontSize="9" fontWeight="bold">កូនសោគន្លឹះ</text>
            <text x="95" y="112" textAnchor="middle" fill="#14b8a6" fontSize="8" fontWeight="bold">WHO</text>

            {/* Keys 1 to 5 badges */}
            <g transform="translate(170, 20)">
              <rect width="230" height="24" rx="6" fill="#ffffff" stroke="#0d9488" strokeWidth="1" />
              <text x="10" y="16" fill="#134e4a" fontSize="9" fontWeight="bold">
                ១. រក្សាភាពស្អាត (លាងដៃជាមួយសាប៊ូ)
              </text>

              <rect y="30" width="230" height="24" rx="6" fill="#ffffff" stroke="#0d9488" strokeWidth="1" />
              <text x="10" y="46" fill="#134e4a" fontSize="9" fontWeight="bold">
                ២. ទុកដាក់អាហារឆៅ & ឆ្អិនដាច់ដោយឡែក
              </text>

              <rect y="60" width="230" height="24" rx="6" fill="#ffffff" stroke="#0d9488" strokeWidth="1" />
              <text x="10" y="76" fill="#134e4a" fontSize="9" fontWeight="bold">
                ៣. ចម្អិនឱ្យបានឆ្អិនល្អ (≥ ៧០°C)
              </text>

              <rect y="90" width="230" height="24" rx="6" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
              <text x="10" y="106" fill="#9f1239" fontSize="9" fontWeight="bold">
                ៤. សីតុណ្ហភាពសុវត្ថិភាព (&lt;៥°C ឬ &gt;៦០°C)
              </text>

              <rect y="120" width="230" height="24" rx="6" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
              <text x="10" y="136" fill="#0369a1" fontSize="9" fontWeight="bold">
                ៥. ប្រើប្រាស់ទឹកស្អាត & វត្ថុធាតុដើមល្អ
              </text>
            </g>
          </g>
        );

      case 'water_f_diagram':
        return (
          <g>
            <defs>
              <linearGradient id="waterBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0f9ff" />
                <stop offset="100%" stopColor="#e0f2fe" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#waterBg)" />
            {/* Water Drop Big */}
            <path
              d="M75,35 C75,35 45,85 45,110 C45,130 60,145 75,145 C90,145 105,130 105,110 C105,85 75,35 75,35 Z"
              fill="#0ea5e9"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <text x="75" y="112" textAnchor="middle" fill="#ffffff" fontSize="18">💧</text>
            <text x="75" y="162" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
              ទឹកសុវត្ថិភាព
            </text>

            {/* F-Diagram Protective Barriers */}
            <g transform="translate(140, 25)">
              <rect width="125" height="42" rx="8" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
              <text x="62" y="20" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">
                🔥 ដាំទឹកឱ្យពុះ ១០០°C
              </text>
              <text x="62" y="34" textAnchor="middle" fill="#64748b" fontSize="8">
                សម្លាប់មេរោគ ១០០%
              </text>

              <rect x="135" width="125" height="42" rx="8" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="197" y="20" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
                🧴 សាប៊ូលាងដៃ
              </text>
              <text x="197" y="34" textAnchor="middle" fill="#64748b" fontSize="8">
                កាត់ផ្តាច់មេរោគពីម្រាមដៃ
              </text>

              <rect y="52" width="125" height="42" rx="8" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="62" y="72" textAnchor="middle" fill="#6d28d9" fontSize="10" fontWeight="bold">
                🚽 បង្គន់អនាម័យ
              </text>
              <text x="62" y="86" textAnchor="middle" fill="#64748b" fontSize="8">
                ទប់ស្កាត់ការចម្លងពីលាមក
              </text>

              <rect x="135" y="52" width="125" height="42" rx="8" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="197" y="72" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                🥘 គ្របចំណីអាហារ
              </text>
              <text x="197" y="86" textAnchor="middle" fill="#64748b" fontSize="8">
                ការពារសត្វរុយទំ
              </text>

              <rect y="104" width="260" height="24" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <text x="130" y="120" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">
                🛡️ របាំងរារាំង ៤ យ៉ាងនៃ F-Diagram
              </text>
            </g>
          </g>
        );

      case 'home_hygiene':
        return (
          <g>
            <defs>
              <linearGradient id="homeBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#homeBg)" />
            {/* Zone 1: Kitchen */}
            <g transform="translate(25, 30)">
              <rect width="110" height="110" rx="12" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="55" cy="40" r="22" fill="#fef3c7" />
              <text x="55" y="47" textAnchor="middle" fill="#b45309" fontSize="20">🍳</text>
              <text x="55" y="78" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">
                ចង្ក្រានបាយ
              </text>
              <text x="55" y="94" textAnchor="middle" fill="#64748b" fontSize="8">
                ស្អាត គ្មានជាតិខ្លាញ់
              </text>
            </g>
            {/* Zone 2: Toilet */}
            <g transform="translate(155, 30)">
              <rect width="110" height="110" rx="12" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
              <circle cx="55" cy="40" r="22" fill="#e0f2fe" />
              <text x="55" y="47" textAnchor="middle" fill="#0369a1" fontSize="20">🚽</text>
              <text x="55" y="78" textAnchor="middle" fill="#075985" fontSize="10" fontWeight="bold">
                បង្គន់អនាម័យ
              </text>
              <text x="55" y="94" textAnchor="middle" fill="#64748b" fontSize="8">
                គ្មានក្លិន ចាក់ទឹកលាង
              </text>
            </g>
            {/* Zone 3: Bedroom */}
            <g transform="translate(285, 30)">
              <rect width="110" height="110" rx="12" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
              <circle cx="55" cy="40" r="22" fill="#ede9fe" />
              <text x="55" y="47" textAnchor="middle" fill="#6d28d9" fontSize="20">🛏️</text>
              <text x="55" y="78" textAnchor="middle" fill="#5b21b6" fontSize="10" fontWeight="bold">
                បន្ទប់គេង
              </text>
              <text x="55" y="94" textAnchor="middle" fill="#64748b" fontSize="8">
                ខ្យល់ពន្លឺ ហាលពូកខ្នើយ
              </text>
            </g>
          </g>
        );

      case 'dental_vision':
        return (
          <g>
            <defs>
              <linearGradient id="dvBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf4ff" />
                <stop offset="100%" stopColor="#fae8ff" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#dvBg)" />
            {/* Tooth */}
            <g transform="translate(40, 30)">
              <rect width="140" height="120" rx="12" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
              <circle cx="70" cy="45" r="25" fill="#f3e8ff" />
              <text x="70" y="54" textAnchor="middle" fill="#9333ea" fontSize="24">🦷</text>
              <text x="70" y="85" textAnchor="middle" fill="#7e22ce" fontSize="11" fontWeight="bold">
                សុខភាពធ្មេញ
              </text>
              <text x="70" y="102" textAnchor="middle" fill="#64748b" fontSize="8">
                ដុស ២ ដង/ថ្ងៃ ក្រោយអាហារ
              </text>
            </g>

            {/* Vision Eye & 20-20-20 */}
            <g transform="translate(210, 30)">
              <rect width="170" height="120" rx="12" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="85" cy="45" r="25" fill="#dbeafe" />
              <text x="85" y="54" textAnchor="middle" fill="#2563eb" fontSize="24">👁️</text>
              <text x="85" y="82" textAnchor="middle" fill="#1d4ed8" fontSize="11" fontWeight="bold">
                ច្បាប់ ២០-២០-២០
              </text>
              <text x="85" y="97" textAnchor="middle" fill="#475569" fontSize="8">
                មើល ២០នាទី សម្រាក ២០វិនាទី
              </text>
              <text x="85" y="110" textAnchor="middle" fill="#2563eb" fontSize="8" fontWeight="bold">
                សម្លឹងចម្ងាយ ២០ ហ្វីត (៦ ម៉ែត្រ)
              </text>
            </g>
          </g>
        );

      case 'parasites_rabies':
        return (
          <g>
            <defs>
              <linearGradient id="prBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff7ed" />
                <stop offset="100%" stopColor="#ffedd5" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#prBg)" />
            {/* Rabies Warning */}
            <g transform="translate(30, 25)">
              <rect width="160" height="125" rx="12" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
              <text x="80" y="45" textAnchor="middle" fill="#c2410c" fontSize="28">🐕</text>
              <text x="80" y="75" textAnchor="middle" fill="#9a3412" fontSize="11" fontWeight="bold">
                ជំងឺឆ្កែឆ្កួត (Rabies)
              </text>
              <text x="80" y="93" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">
                លាងទឹកសាប៊ូហូរ ១៥ នាទី
              </text>
              <text x="80" y="110" textAnchor="middle" fill="#15803d" fontSize="9" fontWeight="bold">
                💉 ចាក់វ៉ាក់សាំងបន្ទាន់!
              </text>
            </g>

            {/* Parasites & Worms */}
            <g transform="translate(210, 25)">
              <rect width="180" height="125" rx="12" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
              <text x="90" y="45" textAnchor="middle" fill="#15803d" fontSize="28">👟</text>
              <text x="90" y="75" textAnchor="middle" fill="#14532d" fontSize="11" fontWeight="bold">
                ការពារដង្កូវព្រូន
              </text>
              <text x="90" y="93" textAnchor="middle" fill="#475569" fontSize="9">
                • ពាក់ស្បែកជើងជានិច្ច
              </text>
              <text x="90" y="108" textAnchor="middle" fill="#475569" fontSize="9">
                • ហូបសាច់ឆ្អិន & លាងបន្លែ
              </text>
              <text x="90" y="123" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="bold">
                លេបថ្នាំទម្លាក់ព្រូន ៦ខែម្តង
              </text>
            </g>
          </g>
        );

      case 'peer_pressure':
        return (
          <g>
            <defs>
              <linearGradient id="ppBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eef2ff" />
                <stop offset="100%" stopColor="#e0e7ff" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#ppBg)" />
            {/* Say NO Shield */}
            <g transform="translate(35, 25)">
              <rect width="150" height="130" rx="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <circle cx="75" cy="45" r="24" fill="#fee2e2" />
              <text x="75" y="53" textAnchor="middle" fill="#dc2626" fontSize="18" fontWeight="bold">
                «ទេ»
              </text>
              <text x="75" y="85" textAnchor="middle" fill="#312e81" fontSize="11" fontWeight="bold">
                ក្លាហាននិយាយថា «ទេ»
              </text>
              <text x="75" y="102" textAnchor="middle" fill="#64748b" fontSize="8">
                ចំពោះគ្រឿងញៀន បារី ស្រា
              </text>
              <text x="75" y="116" textAnchor="middle" fill="#4f46e5" fontSize="8" fontWeight="bold">
                និងទង្វើខុសច្បាប់
              </text>
            </g>

            {/* Chopsticks Proverb */}
            <g transform="translate(205, 25)">
              <rect width="180" height="130" rx="14" fill="#ffffff" stroke="#059669" strokeWidth="2" />
              <text x="90" y="45" textAnchor="middle" fill="#047857" fontSize="24">🥢</text>
              <text x="90" y="75" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="bold">
                «ចង្កឹះមួយបាច់កាច់មិនបាក់»
              </text>
              <text x="90" y="93" textAnchor="middle" fill="#475569" fontSize="8">
                ចងសម្ព័ន្ធភាពជាមួយមិត្តល្អ
              </text>
              <text x="90" y="108" textAnchor="middle" fill="#475569" fontSize="8">
                ជួយរៀនសូត្រ កីឡា វិជ្ជមាន
              </text>
              <text x="90" y="122" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="bold">
                ទប់ទល់នឹងសម្ពាធអវិជ្ជមាន
              </text>
            </g>
          </g>
        );

      case 'adolescent_relations':
        return (
          <g>
            <defs>
              <linearGradient id="arBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#faf5ff" />
                <stop offset="100%" stopColor="#f3e8ff" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#arBg)" />
            {/* Mutual Respect handshake */}
            <g transform="translate(40, 25)">
              <rect width="150" height="130" rx="14" fill="#ffffff" stroke="#9333ea" strokeWidth="2" />
              <text x="75" y="50" textAnchor="middle" fill="#7e22ce" fontSize="28">🤝</text>
              <text x="75" y="80" textAnchor="middle" fill="#581c87" fontSize="11" fontWeight="bold">
                ការគោរពគ្នាទៅវិញទៅមក
              </text>
              <text x="75" y="98" textAnchor="middle" fill="#64748b" fontSize="8">
                «សូមអធ្យាស្រ័យ» & «អរគុណ»
              </text>
              <text x="75" y="114" textAnchor="middle" fill="#9333ea" fontSize="8" fontWeight="bold">
                ទំនាក់ទំនងដោយសន្តិវិធី
              </text>
            </g>

            {/* Active Listening Ear */}
            <g transform="translate(210, 25)">
              <rect width="170" height="130" rx="14" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="85" y="50" textAnchor="middle" fill="#1d4ed8" fontSize="28">👂</text>
              <text x="85" y="80" textAnchor="middle" fill="#1e3a8a" fontSize="11" fontWeight="bold">
                ការស្តាប់ដោយយកចិត្តទុកដាក់
              </text>
              <text x="85" y="98" textAnchor="middle" fill="#475569" fontSize="8">
                • មើលភ្នែកដៃគូសន្ទនា
              </text>
              <text x="85" y="112" textAnchor="middle" fill="#475569" fontSize="8">
                • មិនកាត់សម្តីអ្នកដទៃ
              </text>
            </g>
          </g>
        );

      case 'cyber_safety':
        return (
          <g>
            <defs>
              <linearGradient id="csBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#csBg)" />
            {/* Shield Phone */}
            <g transform="translate(40, 25)">
              <rect width="140" height="130" rx="14" fill="#ffffff" stroke="#059669" strokeWidth="2" />
              <text x="70" y="50" textAnchor="middle" fill="#047857" fontSize="28">🛡️</text>
              <text x="70" y="80" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="bold">
                សុវត្ថិភាពអនឡាញ
              </text>
              <text x="70" y="98" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">
                ហាមផ្ញើរូបភាពអាក្រាត
              </text>
              <text x="70" y="114" textAnchor="middle" fill="#64748b" fontSize="8">
                រក្សាការសម្ងាត់គណនី
              </text>
            </g>

            {/* Smart Rules */}
            <g transform="translate(200, 25)">
              <rect width="180" height="130" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              <text x="90" y="45" textAnchor="middle" fill="#0369a1" fontSize="24">📱</text>
              <text x="90" y="70" textAnchor="middle" fill="#075985" fontSize="10" fontWeight="bold">
                វិធានការការពារខ្លួន
              </text>
              <text x="90" y="88" textAnchor="middle" fill="#475569" fontSize="8">
                • កុំជួបជនមិនស្គាល់មុខស្ងាត់ៗ
              </text>
              <text x="90" y="103" textAnchor="middle" fill="#475569" fontSize="8">
                • រាយការណ៍ជូនឪពុកម្តាយភ្លាម
              </text>
              <text x="90" y="118" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="bold">
                ពេលមានការគំរាមកំហែង
              </text>
            </g>
          </g>
        );

      case 'anti_harassment':
        return (
          <g>
            <defs>
              <linearGradient id="ahBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="100%" stopColor="#ffe4e6" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#ahBg)" />
            {/* STOP Palm */}
            <g transform="translate(35, 25)">
              <rect width="145" height="130" rx="14" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
              <circle cx="72" cy="45" r="22" fill="#ffe4e6" />
              <text x="72" y="53" textAnchor="middle" fill="#be123c" fontSize="22">✋</text>
              <text x="72" y="82" textAnchor="middle" fill="#9f1239" fontSize="11" fontWeight="bold">
                «បញ្ឈប់! ខ្ញុំមិនព្រម»
              </text>
              <text x="72" y="100" textAnchor="middle" fill="#64748b" fontSize="8">
                កំណត់ព្រំដែនរាងកាយ
              </text>
              <text x="72" y="116" textAnchor="middle" fill="#e11d48" fontSize="8" fontWeight="bold">
                គ្មានអ្នកណាមានសិទ្ធិប៉ះពាល់
              </text>
            </g>

            {/* Reporting Triangle */}
            <g transform="translate(200, 25)">
              <rect width="185" height="130" rx="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
              <text x="92" y="45" textAnchor="middle" fill="#4338ca" fontSize="24">📢</text>
              <text x="92" y="70" textAnchor="middle" fill="#312e81" fontSize="10" fontWeight="bold">
                ៣ កន្លែងស្វែងរកជំនួយ
              </text>
              <text x="92" y="88" textAnchor="middle" fill="#475569" fontSize="8">
                ១. ឪពុកម្តាយ និងអាណាព្យាបាល
              </text>
              <text x="92" y="103" textAnchor="middle" fill="#475569" fontSize="8">
                ២. គ្រូបង្រៀន / នាយកសាលា
              </text>
              <text x="92" y="118" textAnchor="middle" fill="#4338ca" fontSize="8" fontWeight="bold">
                ៣. អាជ្ញាធរមានសមត្ថកិច្ច
              </text>
            </g>
          </g>
        );

      case 'puberty_delay':
        return (
          <g>
            <defs>
              <linearGradient id="pdBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf4ff" />
                <stop offset="100%" stopColor="#fae8ff" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#pdBg)" />
            {/* Future Growth Tree */}
            <g transform="translate(35, 25)">
              <rect width="150" height="130" rx="14" fill="#ffffff" stroke="#c026d3" strokeWidth="2" />
              <text x="75" y="48" textAnchor="middle" fill="#a21caf" fontSize="28">🌱</text>
              <text x="75" y="78" textAnchor="middle" fill="#701a75" fontSize="11" fontWeight="bold">
                ពន្យារពេលរួមភេទ
              </text>
              <text x="75" y="96" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="bold">
                • មិនឆ្លងជំងឺកាមរោគ / អេដស៍
              </text>
              <text x="75" y="112" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="bold">
                • មិនមានផ្ទៃពោះដោយមិនចង់បាន
              </text>
            </g>

            {/* Focus on Success */}
            <g transform="translate(205, 25)">
              <rect width="175" height="130" rx="14" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x="87" y="48" textAnchor="middle" fill="#1d4ed8" fontSize="26">📚</text>
              <text x="87" y="76" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="bold">
                ផ្តោតលើការអភិវឌ្ឍខ្លួន
              </text>
              <text x="87" y="94" textAnchor="middle" fill="#475569" fontSize="8">
                • ការសិក្សាស្រាវជ្រាវ
              </text>
              <text x="87" y="108" textAnchor="middle" fill="#475569" fontSize="8">
                • លេងកីឡា & សកម្មភាពសង្គម
              </text>
              <text x="87" y="122" textAnchor="middle" fill="#2563eb" fontSize="8" fontWeight="bold">
                កសាងអនាគតភ្លឺស្វាង
              </text>
            </g>
          </g>
        );

      case 'health_rights':
        return (
          <g>
            <defs>
              <linearGradient id="hrBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#hrBg)" />
            {/* 10 Rights Wheel */}
            <g transform="translate(35, 25)">
              <rect width="150" height="130" rx="14" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
              <circle cx="75" cy="45" r="22" fill="#dcfce7" />
              <text x="75" y="52" textAnchor="middle" fill="#15803d" fontSize="18" fontWeight="bold">10</text>
              <text x="75" y="80" textAnchor="middle" fill="#14532d" fontSize="11" fontWeight="bold">
                សិទ្ធិសុខភាពផ្លូវភេទ
              </text>
              <text x="75" y="98" textAnchor="middle" fill="#475569" fontSize="8">
                សិទ្ធិស្មើភាព មិនរើសអើង
              </text>
              <text x="75" y="112" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold">
                សិទ្ធិទទួលបានការអប់រំ
              </text>
            </g>

            {/* Hygiene Best Practice */}
            <g transform="translate(205, 25)">
              <rect width="175" height="130" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              <text x="87" y="45" textAnchor="middle" fill="#0369a1" fontSize="24">🧼</text>
              <text x="87" y="72" textAnchor="middle" fill="#075985" fontSize="10" fontWeight="bold">
                អនាម័យត្រឹមត្រូវ
              </text>
              <text x="87" y="90" textAnchor="middle" fill="#0369a1" fontSize="8" fontWeight="bold">
                • ជូតពីមុខទៅក្រោយជានិច្ច
              </text>
              <text x="87" y="104" textAnchor="middle" fill="#475569" fontSize="8">
                • លាងតែខាងក្រៅ កុំលាងខាងក្នុង
              </text>
              <text x="87" y="118" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="bold">
                ជៀសវាងការឆ្លងមេរោគ
              </text>
            </g>
          </g>
        );

      case 'hiv_aids_awareness':
        return (
          <g>
            <defs>
              <linearGradient id="hivBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="100%" stopColor="#ffe4e6" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#hivBg)" />
            {/* Red Ribbon */}
            <g transform="translate(30, 25)">
              <rect width="145" height="130" rx="14" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
              <text x="72" y="48" textAnchor="middle" fill="#be123c" fontSize="28">🎗️</text>
              <text x="72" y="76" textAnchor="middle" fill="#9f1239" fontSize="11" fontWeight="bold">
                មេរោគអេដស៍ (HIV)
              </text>
              <text x="72" y="94" textAnchor="middle" fill="#475569" fontSize="8">
                ៣ ផ្លូវចម្លង ៖
              </text>
              <text x="72" y="107" textAnchor="middle" fill="#e11d48" fontSize="8" fontWeight="bold">
                រួមភេទ • ឈាម/ម្ជុល • ម្តាយទៅកូន
              </text>
            </g>

            {/* No Stigma Shield */}
            <g transform="translate(195, 25)">
              <rect width="190" height="130" rx="14" fill="#ffffff" stroke="#059669" strokeWidth="2" />
              <text x="95" y="46" textAnchor="middle" fill="#047857" fontSize="24">🤗</text>
              <text x="95" y="72" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="bold">
                មិនឆ្លងតាម ៖
              </text>
              <text x="95" y="90" textAnchor="middle" fill="#475569" fontSize="8">
                កាន់ដៃ • ឱប • ញ៉ាំបាយរួម • មូសខាំ
              </text>
              <text x="95" y="105" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="bold">
                ❤️ លុបបំបាត់ការរើសអើង
              </text>
              <text x="95" y="120" textAnchor="middle" fill="#475569" fontSize="8">
                ផ្តល់ក្តីស្រឡាញ់ និងការគាំទ្រ
              </text>
            </g>
          </g>
        );

      case 'six_step_goals':
        return (
          <g>
            <defs>
              <linearGradient id="goalsBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fefce8" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#goalsBg)" />
            {/* 6 Steps Staircase */}
            <polygon points="40,140 90,140 90,120 140,120 140,100 190,100 190,80 240,80 240,60 290,60 290,40 340,40 340,140" fill="#f59e0b" opacity="0.3" />
            <text x="65" y="134" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">១.គោលដៅ</text>
            <text x="115" y="114" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">២.កាលបរិច្ឆេទ</text>
            <text x="165" y="94" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">៣.ផែនការ</text>
            <text x="215" y="74" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">៤.ឧបសគ្គ</text>
            <text x="265" y="54" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">៥.ដំណោះស្រាយ</text>
            <text x="315" y="34" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">៦.ធនធាន</text>

            <g transform="translate(355, 30)">
              <rect width="50" height="50" rx="10" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
              <text x="25" y="32" textAnchor="middle" fill="#b45309" fontSize="24">🎯</text>
              <text x="25" y="65" textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="bold">
                សម្រេចក្តីសុបិន
              </text>
            </g>
          </g>
        );

      case 'first_aid':
        return (
          <g>
            <defs>
              <linearGradient id="faBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#bbf7d0" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#faBg)" />
            {/* First Aid Kit Box */}
            <g transform="translate(30, 25)">
              <rect width="100" height="125" rx="14" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
              <circle cx="50" cy="45" r="22" fill="#fee2e2" />
              <rect x="44" y="30" width="12" height="30" rx="3" fill="#dc2626" />
              <rect x="35" y="39" width="30" height="12" rx="3" fill="#dc2626" />
              <text x="50" y="85" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="bold">
                សង្គ្រោះបឋម
              </text>
              <text x="50" y="100" textAnchor="middle" fill="#64748b" fontSize="8">
                First Aid Kit
              </text>
              <text x="50" y="115" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">
                ☎️ 119
              </text>
            </g>

            {/* Quick Actions Guide */}
            <g transform="translate(145, 25)">
              <rect width="125" height="58" rx="10" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1.5" />
              <text x="12" y="20" fill="#0369a1" fontSize="9" fontWeight="bold">
                🔥 រលាកភ្លើង
              </text>
              <text x="12" y="34" fill="#475569" fontSize="8">
                • បង្ហូរទឹកត្រជាក់ភ្លាមៗ
              </text>
              <text x="12" y="47" fill="#dc2626" fontSize="8" fontWeight="bold">
                • ហាមបែកពងទឹក
              </text>

              <rect x="135" width="125" height="58" rx="10" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="147" y="20" fill="#b45309" fontSize="9" fontWeight="bold">
                👃 ឈាមច្រមុះ
              </text>
              <text x="147" y="34" fill="#475569" fontSize="8">
                • ឱនទៅមុខ ច្របាច់ច្រមុះ
              </text>
              <text x="147" y="47" fill="#dc2626" fontSize="8" fontWeight="bold">
                • ហាមងើយទៅក្រោយ!
              </text>

              <rect y="66" width="260" height="58" rx="10" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" />
              <text x="12" y="84" fill="#15803d" fontSize="9" fontWeight="bold">
                🥖 ស្លាក់អាហារ (Heimlich) &bull; មុតរបួស
              </text>
              <text x="12" y="98" fill="#475569" fontSize="8">
                • ទះខ្នង ៥ ដង / សង្កត់ពោះ &bull; លាងទឹកសាប៊ូ រុំបង់ស្អាត
              </text>
              <text x="12" y="112" fill="#15803d" fontSize="8" fontWeight="bold">
                • ចាក់ថ្នាំតេតាណូសការពារមេរោគ
              </text>
            </g>
          </g>
        );

      case 'air_pollution':
        return (
          <g>
            <defs>
              <linearGradient id="apBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#apBg)" />
            {/* Clean Air Green Side */}
            <g transform="translate(30, 25)">
              <rect width="165" height="130" rx="14" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
              <text x="82" y="48" textAnchor="middle" fill="#15803d" fontSize="28">🌳</text>
              <text x="82" y="78" textAnchor="middle" fill="#14532d" fontSize="11" fontWeight="bold">
                ខ្យល់អាកាសបរិសុទ្ធ
              </text>
              <text x="82" y="96" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold">
                • ដាំដើមឈើជុំវិញផ្ទះ
              </text>
              <text x="82" y="110" textAnchor="middle" fill="#475569" fontSize="8">
                • ធ្វើជីកំប៉ុស ជំនួសដុតសំរាម
              </text>
              <text x="82" y="124" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold">
                • ប្រើចង្ក្រានជីវឧស្ម័ន / ហ្គាស
              </text>
            </g>

            {/* Toxic Air Side */}
            <g transform="translate(215, 25)">
              <rect width="175" height="130" rx="14" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
              <text x="87" y="48" textAnchor="middle" fill="#b91c1c" fontSize="28">🏭</text>
              <text x="87" y="78" textAnchor="middle" fill="#7f1d1d" fontSize="11" fontWeight="bold">
                ប្រភពខ្យល់ពុល (PM2.5)
              </text>
              <text x="87" y="96" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">
                • ផ្សែងឡាន ម៉ូតូ រោងចក្រ
              </text>
              <text x="87" y="110" textAnchor="middle" fill="#475569" fontSize="8">
                • ដុតសំរាម ព្រៃ ធ្យូង អុស
              </text>
              <text x="87" y="124" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">
                • ផ្សែងបារី ➔ មហារីកសួត
              </text>
            </g>
          </g>
        );

      case 'noise_pollution':
        return (
          <g>
            <defs>
              <linearGradient id="npBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#npBg)" />
            {/* Decibel Meter Dial */}
            <g transform="translate(30, 25)">
              <rect width="150" height="130" rx="14" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
              <text x="75" y="48" textAnchor="middle" fill="#b45309" fontSize="26">📢</text>
              <text x="75" y="76" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="bold">
                កម្រិតសំឡេង (dB)
              </text>
              <text x="75" y="94" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="bold">
                ៤៥ - ៦៥ dB ៖ ស្រួលស្តាប់
              </text>
              <text x="75" y="108" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">
                &gt; ៦៥ dB ៖ សំឡេងឮខ្លាំង
              </text>
              <text x="75" y="122" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">
                &gt; ៨៥ dB ៖ គ្រោះថ្នាក់ដល់ត្រចៀក
              </text>
            </g>

            {/* Health impact & solutions */}
            <g transform="translate(200, 25)">
              <rect width="190" height="130" rx="14" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
              <text x="95" y="48" textAnchor="middle" fill="#b91c1c" fontSize="26">🎧</text>
              <text x="95" y="76" textAnchor="middle" fill="#7f1d1d" fontSize="11" fontWeight="bold">
                ផលប៉ះពាល់ និងដំណោះស្រាយ
              </text>
              <text x="95" y="94" textAnchor="middle" fill="#475569" fontSize="8">
                • ថយចុះសោតវិញ្ញាណ ឈឺក្បាល
              </text>
              <text x="95" y="108" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="bold">
                • បន្ថយសំឡេងបាស &bull; ពាក់កាសការពារ
              </text>
              <text x="95" y="122" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold">
                • ដាំដើមឈើទប់រំញ័រសំឡេង
              </text>
            </g>
          </g>
        );

      case 'general_health':
      default:
        return (
          <g>
            <defs>
              <linearGradient id="ghBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ecfdf5" />
                <stop offset="100%" stopColor="#d1fae5" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="16" fill="url(#ghBg)" />
            <circle cx="80" cy="90" r="45" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
            <text x="80" y="98" textAnchor="middle" fill="#059669" fontSize="34">🏥</text>

            <g transform="translate(150, 35)">
              <rect width="240" height="110" rx="14" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
              <text x="120" y="32" textAnchor="middle" fill="#065f46" fontSize="13" fontWeight="bold">
                អប់រំសុខភាព ថ្នាក់ទី ៦
              </text>
              <text x="120" y="54" textAnchor="middle" fill="#047857" fontSize="10">
                ចំណេះដឹងសុខភាព ៤ សមាសភាគពេញលេញ
              </text>
              <text x="120" y="74" textAnchor="middle" fill="#64748b" fontSize="9">
                អាហារូបត្ថម្ភ • ផ្លូវចិត្ត • បន្តពូជ • បរិស្ថាន
              </text>
              <text x="120" y="94" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
                ស្តង់ដារកម្មវិធីសិក្សា MoEYS
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
          <span>🎨 រូបភាពគរុកោសល្យ</span>
        </div>
      )}
    </div>
  );
};
