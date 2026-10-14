import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  Plus,
  Trash2,
  Edit3,
  Scissors,
  Sparkles,
  Layers,
  Palette,
  RotateCcw,
  Check,
  Info,
  Sliders,
  Maximize2
} from 'lucide-react';
import { TeacherProfile } from '../types';
import {
  getActiveCustomFontFamily,
  getActiveCustomBackgroundTheme,
  getThemeBackgroundCss,
  getKhmerGoogleFontsLinkHtml,
} from '../utils/customPrintFont';

export interface DecorationCardItem {
  id: string;
  themeColor: 'blue' | 'pink' | 'purple' | 'teal' | 'orange' | 'indigo';
  badgeText: string;
  badgeEmoji?: string;
  title: string;
  subtitleMiddle?: string;
  description: string;
  highlightWords?: string;
}

export const DEFAULT_FOOD_SAFETY_CARDS: DecorationCardItem[] = [
  {
    id: 'card-0',
    themeColor: 'blue',
    badgeText: 'អនាម័យ & សុខភាព',
    badgeEmoji: '🌟',
    title: 'គន្លឹះ ៥ យ៉ាង',
    subtitleMiddle: 'ដើម្បី',
    description: 'សុវត្ថិភាព ចំណីអាហារ',
    highlightWords: 'ចំណីអាហារ'
  },
  {
    id: 'card-1',
    themeColor: 'pink',
    badgeText: 'គន្លឹះទី ១',
    title: 'រក្សាភាពស្អាត ជានិច្ច',
    description: 'លាងដៃ ជាមួយសាប៊ូឱ្យបានញឹកញាប់ និងសម្អាតឧបករណ៍ផ្ទះបាយជានិច្ច',
    highlightWords: 'លាងដៃ'
  },
  {
    id: 'card-2',
    themeColor: 'purple',
    badgeText: 'គន្លឹះទី ២',
    title: 'ញែកអាហារឆៅ និងឆ្អិនដាច់ពីគ្នា',
    description: 'កុំទុក សាច់ឆៅ ប៉ះពាល់ជាមួយ អាហារឆ្អិន ឱ្យសោះ',
    highlightWords: 'សាច់ឆៅ, អាហារឆ្អិន'
  },
  {
    id: 'card-3',
    themeColor: 'teal',
    badgeText: 'គន្លឹះទី ៣',
    title: 'ចម្អិនអាហារ ឱ្យបានឆ្អិនល្អ',
    description: 'ចម្អិនឱ្យឆ្អិនសព្វ ជាពិសេស សាច់ ស៊ុត និងគ្រឿងសមុទ្រ',
    highlightWords: 'សាច់ ស៊ុត និងគ្រឿងសមុទ្រ'
  },
  {
    id: 'card-4',
    themeColor: 'orange',
    badgeText: 'គន្លឹះទី ៤',
    title: 'រក្សាទុកក្នុង សីតុណ្ហភាពសុវត្ថិភាព',
    description: 'កុំទុកអាហារនៅក្រៅលើសពី ២ម៉ោង និងក្លាសេឱ្យបានត្រឹមត្រូវ',
    highlightWords: '២ម៉ោង'
  },
  {
    id: 'card-5',
    themeColor: 'indigo',
    badgeText: 'គន្លឹះទី ៥',
    title: 'ប្រើទឹក & វត្ថុធាតុដើម មានសុវត្ថិភាព',
    description: 'ប្រើ ទឹកស្អាត លាងបន្លែផ្លែឈើ និងជ្រើសរើសអាហារស្រស់មានប្រភពច្បាស់លាស់',
    highlightWords: 'ទឹកស្អាត'
  }
];

export const HYGIENE_HABITS_CARDS: DecorationCardItem[] = [
  {
    id: 'hyg-0',
    themeColor: 'teal',
    badgeText: 'សុខភាព & អនាម័យ',
    badgeEmoji: '🧼',
    title: 'ទម្លាប់ល្អ ៥ យ៉ាង',
    subtitleMiddle: 'ដើម្បី',
    description: 'សុខភាពរឹងមាំ សិក្សាពូកែ',
    highlightWords: 'សុខភាពរឹងមាំ'
  },
  {
    id: 'hyg-1',
    themeColor: 'blue',
    badgeText: 'ទម្លាប់ទី ១',
    title: 'លាងសម្អាតដៃ ឱ្យបានត្រឹមត្រូវ',
    description: 'លាងដៃនឹងសាប៊ូមុនញ៉ាំអាហារ និងក្រោយចេញពីបន្ទប់ទឹកជានិច្ច',
    highlightWords: 'លាងដៃនឹងសាប៊ូ'
  },
  {
    id: 'hyg-2',
    themeColor: 'pink',
    badgeText: 'ទម្លាប់ទី ២',
    title: 'ដុសធ្មេញ យ៉ាងតិច ២ ដង',
    description: 'ដុសធ្មេញពេលព្រឹក និងមុនពេលចូលគេងជាប្រចាំ',
    highlightWords: '២ ដង'
  },
  {
    id: 'hyg-3',
    themeColor: 'purple',
    badgeText: 'ទម្លាប់ទី ៣',
    title: 'កាត់ក្រចកដៃ និងងូតទឹកស្អាត',
    description: 'កាត់ក្រចកឱ្យខ្លីស្អាត និងស្លៀកពាក់ឯកសណ្ឋានមានអនាម័យ',
    highlightWords: 'កាត់ក្រចក'
  },
  {
    id: 'hyg-4',
    themeColor: 'orange',
    badgeText: 'ទម្លាប់ទី ៤',
    title: 'ពិសាទឹកដាំឆ្អិន និងអាហារមានជីវជាតិ',
    description: 'ញ៉ាំបន្លែ ផ្លែឈើ និងពិសាទឹកស្អាតយ៉ាងតិច ១.៥ លីត្រក្នុងមួយថ្ងៃ',
    highlightWords: 'ទឹកដាំឆ្អិន'
  },
  {
    id: 'hyg-5',
    themeColor: 'indigo',
    badgeText: 'ទម្លាប់ទី ៥',
    title: 'គេងឱ្យបានគ្រប់គ្រាន់ ៨ ម៉ោង',
    description: 'ចូលគេងឱ្យបានលឿន និងក្រោកពីព្រលឹមដើម្បីស្មារតីស្រស់ថ្លា',
    highlightWords: '៨ ម៉ោង'
  }
];

interface ClassroomDecorationPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: TeacherProfile;
}

export const ClassroomDecorationPrintModal: React.FC<ClassroomDecorationPrintModalProps> = ({
  isOpen,
  onClose,
  teacher
}) => {
  const [cards, setCards] = useState<DecorationCardItem[]>(() => {
    const saved = localStorage.getItem('custom_classroom_decor_cards');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_FOOD_SAFETY_CARDS;
      }
    }
    return DEFAULT_FOOD_SAFETY_CARDS;
  });

  const [layoutMode, setLayoutMode] = useState<'1-per-page' | '2-per-page' | '4-per-page'>('2-per-page');
  const [textStyle, setTextStyle] = useState<'gradient' | '3d' | 'classic'>('gradient');
  const [showCutGuides, setShowCutGuides] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<'food_safety' | 'hygiene'>('food_safety');

  useEffect(() => {
    localStorage.setItem('custom_classroom_decor_cards', JSON.stringify(cards));
  }, [cards]);

  if (!isOpen) return null;

  const handleUpdateCard = (id: string, field: keyof DecorationCardItem, value: any) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAddNewCard = () => {
    const colors: Array<DecorationCardItem['themeColor']> = ['blue', 'pink', 'purple', 'teal', 'orange', 'indigo'];
    const nextColor = colors[cards.length % colors.length];
    const newCard: DecorationCardItem = {
      id: `card-${Date.now()}`,
      themeColor: nextColor,
      badgeText: `ចំណុចទី ${cards.length}`,
      title: 'ចំណងជើងថ្មី',
      description: 'សូមបញ្ចូលការពិពណ៌នា ឬខ្លឹមសារអប់រំនៅត្រង់នេះ...',
      highlightWords: ''
    };
    setCards([...cards, newCard]);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm('តើអ្នកពិតជាចង់លុបផ្ទាំងនេះមែនទេ?')) {
      setCards((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleResetDefaults = (preset: 'food_safety' | 'hygiene') => {
    setActivePreset(preset);
    if (preset === 'food_safety') {
      setCards(DEFAULT_FOOD_SAFETY_CARDS);
    } else {
      setCards(HYGIENE_HABITS_CARDS);
    }
  };

  const triggerDirectPrint = () => {
    // Generate clean self-contained print window to guarantee zero clutter and perfect vector sizing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const cardsHtml = cards
      .map((card, idx) => {
        const svgColor =
          card.themeColor === 'blue'
            ? { primary: '#0284c7', light: '#38bdf8', dark: '#0369a1', deep: '#0c4a6e', innerBg: '#e0f2fe', stroke: '#0099ff', innerStroke: '#0077cc' }
            : card.themeColor === 'pink'
            ? { primary: '#db2777', light: '#f472b6', dark: '#9d174d', deep: '#881337', innerBg: '#fce7f3', stroke: '#f43f5e', innerStroke: '#e11d48' }
            : card.themeColor === 'purple'
            ? { primary: '#9333ea', light: '#c084fc', dark: '#6b21a8', deep: '#581c87', innerBg: '#f3e8ff', stroke: '#a855f7', innerStroke: '#7e22ce' }
            : card.themeColor === 'teal'
            ? { primary: '#0d9488', light: '#2dd4bf', dark: '#115e59', deep: '#134e4a', innerBg: '#ccfbf1', stroke: '#06b6d4', innerStroke: '#0891b2' }
            : card.themeColor === 'orange'
            ? { primary: '#ea580c', light: '#fb923c', dark: '#9a3412', deep: '#7c2d12', innerBg: '#ffedd5', stroke: '#f97316', innerStroke: '#c2410c' }
            : { primary: '#4f46e5', light: '#818cf8', dark: '#3730a3', deep: '#1e1b4b', innerBg: '#e0e7ff', stroke: '#6366f1', innerStroke: '#4338ca' };

        const badgeClass =
          card.themeColor === 'blue'
            ? 'background: linear-gradient(135deg, #0284c7, #38bdf8); color: white;'
            : card.themeColor === 'pink'
            ? 'background: #f43f5e; color: white;'
            : card.themeColor === 'purple'
            ? 'background: #9333ea; color: white;'
            : card.themeColor === 'teal'
            ? 'background: #0d9488; color: white;'
            : card.themeColor === 'orange'
            ? 'background: #ea580c; color: white;'
            : 'background: #4f46e5; color: white;';

        const isTitleCard = idx === 0 && card.subtitleMiddle;

        return `
        <div class="classroom-card card-${card.themeColor} ${showCutGuides ? 'cut-guide' : ''}">
          <svg viewBox="0 0 400 500" class="card-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="bfGradPrint_${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${svgColor.light}" />
                <stop offset="50%" stop-color="${svgColor.primary}" />
                <stop offset="100%" stop-color="${svgColor.dark}" />
              </linearGradient>
              <filter id="shadowPrint_${idx}" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.25"/>
              </filter>
            </defs>
            <path d="M 45,25 
                     Q 80,10 115,25 Q 150,40 185,25 Q 220,10 255,25 Q 290,40 325,25 Q 360,10 375,45
                     Q 390,80 375,115 Q 360,150 375,185 Q 390,220 375,255 Q 360,290 375,325 Q 390,360 375,395 Q 360,430 375,455
                     Q 360,490 325,475 Q 290,460 255,475 Q 220,490 185,475 Q 150,460 115,475 Q 80,490 45,475 Q 10,460 25,425
                     Q 40,390 25,355 Q 10,320 25,285 Q 40,250 25,215 Q 10,180 25,145 Q 40,110 25,75 Q 10,40 45,25 Z"
                  fill="none" stroke="${svgColor.stroke}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round" />
            <path d="M 45,25 
                     Q 80,10 115,25 Q 150,40 185,25 Q 220,10 255,25 Q 290,40 325,25 Q 360,10 375,45
                     Q 390,80 375,115 Q 360,150 375,185 Q 390,220 375,255 Q 360,290 375,325 Q 390,360 375,395 Q 360,430 375,455
                     Q 360,490 325,475 Q 290,460 255,475 Q 220,490 185,475 Q 150,460 115,475 Q 80,490 45,475 Q 10,460 25,425
                     Q 40,390 25,355 Q 10,320 25,285 Q 40,250 25,215 Q 10,180 25,145 Q 40,110 25,75 Q 10,40 45,25 Z"
                  fill="none" stroke="${svgColor.innerStroke}" stroke-width="3" stroke-linejoin="round" />
            <path d="M 60,48 
                     Q 90,36 120,48 Q 150,60 180,48 Q 210,36 240,48 Q 270,60 300,48 Q 330,36 350,65
                     Q 365,95 350,125 Q 335,155 350,185 Q 365,215 350,245 Q 335,275 350,305 Q 365,335 350,365 Q 335,395 350,430
                     Q 330,458 300,446 Q 270,434 240,446 Q 210,458 180,446 Q 150,434 120,446 Q 90,458 60,446 Q 38,432 50,400
                     Q 62,370 50,340 Q 38,310 50,280 Q 62,250 50,220 Q 38,190 50,160 Q 62,130 50,100 Q 38,70 60,48 Z"
                  fill="none" stroke="${svgColor.stroke}" stroke-width="2.8" stroke-dasharray="6,6" stroke-linecap="round" />
            <g transform="translate(295, 30) rotate(15) scale(0.72)" filter="url(#shadowPrint_${idx})">
              <path d="M50,50 C20,10 -10,-10 10,-35 C35,-50 90,-10 65,35 Z" fill="url(#bfGradPrint_${idx})" stroke="${svgColor.deep}" stroke-width="3"/>
              <path d="M55,50 C85,10 115,-10 95,-35 C70,-50 15,-10 40,35 Z" fill="url(#bfGradPrint_${idx})" stroke="${svgColor.deep}" stroke-width="3"/>
              <path d="M30,-15 Q50,-30 65,-10 Q45,15 30,-15 Z" fill="${svgColor.innerBg}" opacity="0.85"/>
              <path d="M75,-15 Q55,-30 40,-10 Q60,15 75,-15 Z" fill="${svgColor.innerBg}" opacity="0.85"/>
              <path d="M48,50 C20,60 0,90 20,110 C45,120 70,85 55,55 Z" fill="url(#bfGradPrint_${idx})" stroke="${svgColor.deep}" stroke-width="3"/>
              <path d="M56,50 C84,60 104,90 84,110 C59,120 34,85 49,55 Z" fill="url(#bfGradPrint_${idx})" stroke="${svgColor.deep}" stroke-width="3"/>
              <circle cx="22" cy="100" r="3.5" fill="#ffffff"/>
              <circle cx="82" cy="100" r="3.5" fill="#ffffff"/>
              <circle cx="20" cy="-25" r="4.5" fill="#ffffff"/>
              <circle cx="84" cy="-25" r="4.5" fill="#ffffff"/>
              <ellipse cx="52" cy="50" rx="6" ry="32" fill="#0f172a"/>
              <path d="M50,22 Q40,5 30,0" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="30" cy="0" r="2" fill="#0f172a"/>
              <path d="M54,22 Q64,5 74,0" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="74" cy="0" r="2" fill="#0f172a"/>
            </g>
          </svg>

          <div class="card-inner">
            <div class="card-top">
              <span class="card-badge" style="${badgeClass}">
                ${card.badgeEmoji ? `${card.badgeEmoji} ` : ''}${card.badgeText}
              </span>
            </div>

            <div class="card-body-content">
              <h2 class="card-title">${card.title}</h2>
              ${
                isTitleCard
                  ? `
                <div class="title-sub-row">
                  <span class="line"></span>
                  <span class="sub-txt">${card.subtitleMiddle}</span>
                  <span class="line"></span>
                </div>
                <p class="card-desc title-highlight">${card.description}</p>
              `
                  : `
                <p class="card-desc">${card.description}</p>
              `
              }
            </div>

            <div class="card-bottom">
              <div class="dot-line"></div>
              <svg class="heart-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <div class="dot-line"></div>
            </div>
          </div>
        </div>
      `;
      })
      .join('');

    const activeFont = getActiveCustomFontFamily();
    const activeTheme = getActiveCustomBackgroundTheme();
    const docBackgroundCss = getThemeBackgroundCss(activeTheme);

    const htmlDoc = `
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="UTF-8">
        <title>សន្លឹកតុបតែងថ្នាក់ - បោះពុម្ព (Print Ready)</title>
        ${getKhmerGoogleFontsLinkHtml()}
        <style>
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          body {
            font-family: '${activeFont}', 'Kantumruy Pro', 'Battambang', 'Siemreap', sans-serif;
            margin: 0;
            padding: 10mm;
            background: #ffffff !important;
            background-color: #ffffff !important;
            background-image: none !important;
            color: #0f172a;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          .grid-container {
            display: grid;
            width: 100%;
            gap: 12mm;
            justify-content: center;
          }
          .classroom-card {
            position: relative;
            background: #ffffff;
            border-radius: 28px;
            aspect-ratio: 1 / 1.28;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .cut-guide {
            outline: 1.5px dashed #94a3b8 !important;
            outline-offset: 5px !important;
          }
          .card-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
          .card-inner {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 24px 28px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .card-badge {
            display: inline-block;
            padding: 4px 14px;
            border-radius: 9999px;
            font-size: 11pt;
            font-weight: 800;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .card-title {
            font-family: 'Koulen', sans-serif;
            margin: 8px 0;
            line-height: 1.2;
          }
          .card-desc {
            font-weight: 700;
            line-height: 1.5;
            margin: 6px 0;
          }
          .card-bottom {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .dot-line {
            width: 32px;
            height: 4px;
            border-radius: 9999px;
            background: currentColor;
            opacity: 0.5;
          }
          .heart-icon {
            width: 22px;
            height: 22px;
            fill: currentColor;
            opacity: 0.8;
          }

          /* Text Styles */
          ${
            textStyle === 'gradient'
              ? `
            .card-blue .card-title { color: #0284c7; }
            .card-pink .card-title { color: #e11d48; }
            .card-purple .card-title { color: #7e22ce; }
            .card-teal .card-title { color: #0f766e; }
            .card-orange .card-title { color: #ea580c; }
            .card-indigo .card-title { color: #4338ca; }
          `
              : textStyle === '3d'
              ? `
            .card-title {
              text-shadow: 2px 2px 0px rgba(0,0,0,0.15), 3px 3px 6px rgba(0,0,0,0.08);
            }
            .card-blue .card-title { color: #0284c7; }
            .card-pink .card-title { color: #e11d48; }
            .card-purple .card-title { color: #7e22ce; }
            .card-teal .card-title { color: #0f766e; }
            .card-orange .card-title { color: #ea580c; }
            .card-indigo .card-title { color: #4338ca; }
          `
              : `
            .card-title {
              color: #0f172a !important;
              text-shadow: none !important;
            }
            .card-desc {
              color: #1e293b !important;
            }
          `
          }

          /* Mode 1 per page */
          ${
            layoutMode === '1-per-page'
              ? `
            .grid-container { display: block; }
            .classroom-card {
              width: 175mm;
              height: 245mm;
              margin: 0 auto 20mm auto;
              page-break-after: always;
              break-after: page;
            }
            .card-title { font-size: 46pt; }
            .card-desc { font-size: 19pt; }
            .card-badge { font-size: 15pt; padding: 6px 20px; }
          `
              : layoutMode === '2-per-page'
              ? `
            .grid-container { grid-template-columns: 1fr; gap: 14mm; }
            .classroom-card {
              width: 150mm;
              max-height: 125mm;
              margin: 0 auto;
            }
            .classroom-card:nth-child(2n) {
              page-break-after: always;
              break-after: page;
            }
            .card-title { font-size: 26pt; }
            .card-desc { font-size: 13pt; }
          `
              : `
            .grid-container { grid-template-columns: repeat(2, 1fr); gap: 8mm; }
            .classroom-card {
              width: 90mm;
            }
            .classroom-card:nth-child(4n) {
              page-break-after: always;
              break-after: page;
            }
            .card-title { font-size: 17pt; }
            .card-desc { font-size: 9.5pt; }
          `
          }
        </style>
      </head>
      <body>
        <div class="grid-container">
          ${cardsHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlDoc);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Toolbar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-md">
              🦋
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>សន្លឹកតុបតែងថ្នាក់រៀន (Classroom Decoration Posters)</span>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-2 py-0.5 rounded-full">
                  A4 Print Ready
                </span>
              </h3>
              <p className="text-xs text-slate-500">រចនាបថគែមរលកផ្កា មេអំបៅ 3D និងពណ៌អក្សរចម្រុះសម្រាប់បិទតុបតែងជញ្ជាំងថ្នាក់</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Presets & Add */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-bold text-slate-500 px-2">📋 កម្រងគំរូ:</span>
              <button
                onClick={() => handleResetDefaults('food_safety')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  activePreset === 'food_safety'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                🥗 ៥ នៃសុវត្ថិភាពចំណីអាហារ
              </button>
              <button
                onClick={() => handleResetDefaults('hygiene')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  activePreset === 'hygiene'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                🧼 ទម្លាប់អនាម័យ ៥ យ៉ាង
              </button>
            </div>

            <button
              onClick={handleAddNewCard}
              className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>បន្ថែមផ្ទាំងថ្មី</span>
            </button>
          </div>

          {/* Layout, Style & Print Trigger */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Layout Mode */}
            <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-bold text-slate-500 px-2">📄 ប្លង់:</span>
              <button
                onClick={() => setLayoutMode('1-per-page')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  layoutMode === '1-per-page'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                ១ សន្លឹកធំ
              </button>
              <button
                onClick={() => setLayoutMode('2-per-page')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  layoutMode === '2-per-page'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                ២ ក្នុង ១ទំព័រ
              </button>
              <button
                onClick={() => setLayoutMode('4-per-page')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  layoutMode === '4-per-page'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                ៤ តូចៗ
              </button>
            </div>

            {/* Text Color Style */}
            <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="font-bold text-slate-500 px-2">🎨 ពណ៌:</span>
              <button
                onClick={() => setTextStyle('gradient')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  textStyle === 'gradient'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Gradient
              </button>
              <button
                onClick={() => setTextStyle('3d')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  textStyle === '3d'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                3D Pop
              </button>
              <button
                onClick={() => setTextStyle('classic')}
                className={`px-2 py-1 rounded-lg font-bold transition ${
                  textStyle === 'classic'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                ដិតច្បាស់
              </button>
            </div>

            {/* Cut Guide */}
            <button
              onClick={() => setShowCutGuides(!showCutGuides)}
              className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 ${
                showCutGuides
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>បន្ទាត់កាត់: {showCutGuides ? 'បើក' : 'បិទ'}</span>
            </button>

            {/* Print / PDF Trigger */}
            <button
              onClick={triggerDirectPrint}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព (Print / PDF)</span>
            </button>
          </div>
        </div>

        {/* Tip Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🖨️</span>
            <span>
              <strong>គន្លឹះបោះពុម្ព៖</strong> ពេលផ្ទាំង Print បង្ហាញឡើង សូមបើក <strong>«Background graphics»</strong> (ក្រាហ្វិកផ្ទៃខាងក្រោយ) ដើម្បីឱ្យពណ៌ស៊ុម និងមេអំបៅចេញមកពេញលេញ ១០០%!
            </span>
          </div>
          <span className="px-2.5 py-0.5 bg-white text-emerald-800 font-bold rounded-lg border border-emerald-200 shrink-0">
            ✍️ ចុចកែអក្សរផ្ទាល់លើផ្ទាំងនីមួយៗបាន
          </span>
        </div>

        {/* Main Content Area - Cards Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(94vh-190px)] bg-slate-100 dark:bg-slate-950">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-5xl mx-auto">
            {cards.map((card, idx) => {
              const isEditing = editingCardId === card.id;
              const isTitleCard = idx === 0 && card.subtitleMiddle;

              // Color configs
              const colors =
                card.themeColor === 'blue'
                  ? {
                      badge: 'bg-gradient-to-r from-blue-500 to-sky-400 text-white',
                      title: 'text-sky-600',
                      desc: 'text-sky-900',
                      strokeOuter: '#0099ff',
                      strokeInner: '#0077cc',
                      gradStart: '#38bdf8',
                      gradMid: '#0284c7',
                      gradEnd: '#0369a1',
                      borderDeep: '#0c4a6e',
                      innerBg: '#e0f2fe'
                    }
                  : card.themeColor === 'pink'
                  ? {
                      badge: 'bg-rose-500 text-white',
                      title: 'text-rose-600',
                      desc: 'text-rose-950',
                      strokeOuter: '#f43f5e',
                      strokeInner: '#e11d48',
                      gradStart: '#f472b6',
                      gradMid: '#db2777',
                      gradEnd: '#9d174d',
                      borderDeep: '#881337',
                      innerBg: '#fce7f3'
                    }
                  : card.themeColor === 'purple'
                  ? {
                      badge: 'bg-purple-600 text-white',
                      title: 'text-purple-600',
                      desc: 'text-purple-950',
                      strokeOuter: '#a855f7',
                      strokeInner: '#7e22ce',
                      gradStart: '#c084fc',
                      gradMid: '#9333ea',
                      gradEnd: '#6b21a8',
                      borderDeep: '#581c87',
                      innerBg: '#f3e8ff'
                    }
                  : card.themeColor === 'teal'
                  ? {
                      badge: 'bg-teal-600 text-white',
                      title: 'text-teal-700',
                      desc: 'text-teal-950',
                      strokeOuter: '#06b6d4',
                      strokeInner: '#0891b2',
                      gradStart: '#2dd4bf',
                      gradMid: '#0d9488',
                      gradEnd: '#115e59',
                      borderDeep: '#134e4a',
                      innerBg: '#ccfbf1'
                    }
                  : card.themeColor === 'orange'
                  ? {
                      badge: 'bg-orange-600 text-white',
                      title: 'text-orange-600',
                      desc: 'text-amber-950',
                      strokeOuter: '#f97316',
                      strokeInner: '#c2410c',
                      gradStart: '#fb923c',
                      gradMid: '#ea580c',
                      gradEnd: '#9a3412',
                      borderDeep: '#7c2d12',
                      innerBg: '#ffedd5'
                    }
                  : {
                      badge: 'bg-indigo-600 text-white',
                      title: 'text-indigo-600',
                      desc: 'text-indigo-950',
                      strokeOuter: '#6366f1',
                      strokeInner: '#4338ca',
                      gradStart: '#818cf8',
                      gradMid: '#4f46e5',
                      gradEnd: '#3730a3',
                      borderDeep: '#1e1b4b',
                      innerBg: '#e0e7ff'
                    };

              return (
                <div
                  key={card.id}
                  className={`relative w-full max-w-[340px] bg-white rounded-3xl p-2 shadow-lg border border-slate-100 flex flex-col items-center justify-between aspect-[1/1.28] transition hover:shadow-xl group overflow-hidden ${
                    showCutGuides ? 'outline-2 outline-dashed outline-slate-400 outline-offset-4' : ''
                  }`}
                >
                  {/* Butterfly & Wave SVG Border */}
                  <svg
                    viewBox="0 0 400 500"
                    className="w-full h-full absolute inset-0 pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`bfGrad_${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors.gradStart} />
                        <stop offset="50%" stopColor={colors.gradMid} />
                        <stop offset="100%" stopColor={colors.gradEnd} />
                      </linearGradient>
                      <filter id={`shadow_${card.id}`} x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.25" />
                      </filter>
                    </defs>
                    <path
                      d="M 45,25 
                         Q 80,10 115,25 Q 150,40 185,25 Q 220,10 255,25 Q 290,40 325,25 Q 360,10 375,45
                         Q 390,80 375,115 Q 360,150 375,185 Q 390,220 375,255 Q 360,290 375,325 Q 390,360 375,395 Q 360,430 375,455
                         Q 360,490 325,475 Q 290,460 255,475 Q 220,490 185,475 Q 150,460 115,475 Q 80,490 45,475 Q 10,460 25,425
                         Q 40,390 25,355 Q 10,320 25,285 Q 40,250 25,215 Q 10,180 25,145 Q 40,110 25,75 Q 10,40 45,25 Z"
                      fill="none"
                      stroke={colors.strokeOuter}
                      strokeWidth="22"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 45,25 
                         Q 80,10 115,25 Q 150,40 185,25 Q 220,10 255,25 Q 290,40 325,25 Q 360,10 375,45
                         Q 390,80 375,115 Q 360,150 375,185 Q 390,220 375,255 Q 360,290 375,325 Q 390,360 375,395 Q 360,430 375,455
                         Q 360,490 325,475 Q 290,460 255,475 Q 220,490 185,475 Q 150,460 115,475 Q 80,490 45,475 Q 10,460 25,425
                         Q 40,390 25,355 Q 10,320 25,285 Q 40,250 25,215 Q 10,180 25,145 Q 40,110 25,75 Q 10,40 45,25 Z"
                      fill="none"
                      stroke={colors.strokeInner}
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 60,48 
                         Q 90,36 120,48 Q 150,60 180,48 Q 210,36 240,48 Q 270,60 300,48 Q 330,36 350,65
                         Q 365,95 350,125 Q 335,155 350,185 Q 365,215 350,245 Q 335,275 350,305 Q 365,335 350,365 Q 335,395 350,430
                         Q 330,458 300,446 Q 270,434 240,446 Q 210,458 180,446 Q 150,434 120,446 Q 90,458 60,446 Q 38,432 50,400
                         Q 62,370 50,340 Q 38,310 50,280 Q 62,250 50,220 Q 38,190 50,160 Q 62,130 50,100 Q 38,70 60,48 Z"
                      fill="none"
                      stroke={colors.strokeOuter}
                      strokeWidth="2.8"
                      strokeDasharray="6,6"
                      strokeLinecap="round"
                    />
                    <g transform="translate(295, 30) rotate(15) scale(0.72)" filter={`url(#shadow_${card.id})`}>
                      <path d="M50,50 C20,10 -10,-10 10,-35 C35,-50 90,-10 65,35 Z" fill={`url(#bfGrad_${card.id})`} stroke={colors.borderDeep} strokeWidth="3"/>
                      <path d="M55,50 C85,10 115,-10 95,-35 C70,-50 15,-10 40,35 Z" fill={`url(#bfGrad_${card.id})`} stroke={colors.borderDeep} strokeWidth="3"/>
                      <path d="M30,-15 Q50,-30 65,-10 Q45,15 30,-15 Z" fill={colors.innerBg} opacity="0.85"/>
                      <path d="M75,-15 Q55,-30 40,-10 Q60,15 75,-15 Z" fill={colors.innerBg} opacity="0.85"/>
                      <path d="M48,50 C20,60 0,90 20,110 C45,120 70,85 55,55 Z" fill={`url(#bfGrad_${card.id})`} stroke={colors.borderDeep} strokeWidth="3"/>
                      <path d="M56,50 C84,60 104,90 84,110 C59,120 34,85 49,55 Z" fill={`url(#bfGrad_${card.id})`} stroke={colors.borderDeep} strokeWidth="3"/>
                      <circle cx="22" cy="100" r="3.5" fill="#ffffff"/>
                      <circle cx="82" cy="100" r="3.5" fill="#ffffff"/>
                      <circle cx="20" cy="-25" r="4.5" fill="#ffffff"/>
                      <circle cx="84" cy="-25" r="4.5" fill="#ffffff"/>
                      <ellipse cx="52" cy="50" rx="6" ry="32" fill="#0f172a"/>
                      <path d="M50,22 Q40,5 30,0" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="30" cy="0" r="2" fill="#0f172a"/>
                      <path d="M54,22 Q64,5 74,0" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="74" cy="0" r="2" fill="#0f172a"/>
                    </g>
                  </svg>

                  {/* Card Content */}
                  <div className="relative z-10 text-center px-6 py-5 w-full flex flex-col justify-between h-full">
                    {/* Top Badge */}
                    <div className="pt-4 flex justify-between items-center">
                      <span className={`card-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide shadow-xs ${colors.badge}`}>
                        {card.badgeEmoji && <span>{card.badgeEmoji}</span>}
                        <input
                          type="text"
                          value={card.badgeText}
                          onChange={(e) => handleUpdateCard(card.id, 'badgeText', e.target.value)}
                          className="bg-transparent border-none text-center outline-none w-24 font-bold text-white placeholder-white/70"
                        />
                      </span>

                      <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        <select
                          value={card.themeColor}
                          onChange={(e) => handleUpdateCard(card.id, 'themeColor', e.target.value)}
                          className="text-[10px] p-1 bg-white/90 border border-slate-300 rounded shadow-xs"
                        >
                          <option value="blue">ខៀវ (Blue)</option>
                          <option value="pink">ផ្កាឈូក (Pink)</option>
                          <option value="purple">ស្វាយ (Purple)</option>
                          <option value="teal">ត្បូងមរកត (Teal)</option>
                          <option value="orange">ទឹកក្រូច (Orange)</option>
                          <option value="indigo">ឥណ្ឌីហ្គោ (Indigo)</option>
                        </select>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="លុប"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Content */}
                    <div className="my-auto space-y-2">
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleUpdateCard(card.id, 'title', e.target.value)}
                        className={`w-full font-koulen text-3xl sm:text-4xl text-center bg-transparent border-none outline-none leading-tight ${
                          textStyle === '3d'
                            ? `drop-shadow-[2px_2px_0px_rgba(0,0,0,0.12)] ${colors.title}`
                            : textStyle === 'classic'
                            ? 'text-slate-900'
                            : colors.title
                        }`}
                      />

                      {isTitleCard && (
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-0.5 w-6 bg-sky-300"></span>
                          <span className="text-sky-600 text-xs font-bold">{card.subtitleMiddle}</span>
                          <span className="h-0.5 w-6 bg-sky-300"></span>
                        </div>
                      )}

                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => handleUpdateCard(card.id, 'description', e.target.value)}
                        className={`w-full text-center bg-transparent border-none outline-none text-sm font-bold resize-none leading-relaxed ${
                          textStyle === 'classic' ? 'text-slate-800' : colors.desc
                        }`}
                      />
                    </div>

                    {/* Bottom Accents */}
                    <div className="pb-3 flex items-center justify-center gap-2">
                      <div className="w-8 h-1 bg-current opacity-40 rounded-full"></div>
                      <svg className="w-5 h-5 fill-current opacity-70 drop-shadow-xs" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <div className="w-8 h-1 bg-current opacity-40 rounded-full"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 flex items-center gap-2">
            <span>ចំនួនផ្ទាំងសរុប៖ <strong>{cards.length}</strong> ផ្ទាំង</span>
            <span>•</span>
            <span>អាចព្រីនជា A4 Poster ឬកាត់ជាបណ្ណតូចៗបាន</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition"
            >
              បិទ
            </button>
            <button
              onClick={triggerDirectPrint}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ពឥឡូវនេះ (A4 Print / PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
