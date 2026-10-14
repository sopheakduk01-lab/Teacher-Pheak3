/**
 * Helper to generate instant, reliable, beautiful vector SVG avatars for Cambodian students.
 * Guaranteed to work 100% offline, in iFrames, across print and html-to-image canvas exports
 * without any CORS or external network failures.
 */

export function generateDefaultStudentAvatarSvg(
  gender: 'ប្រុស' | 'ស្រី' = 'ប្រុស',
  variantIndex: number = 0
): string {
  const isGirl = gender === 'ស្រី';

  // Palette variants for distinct visual look
  const bgGradients = isGirl
    ? [
        { from: '#fce7f3', to: '#fbcfe8', border: '#ec4899', accent: '#db2777' }, // Pink
        { from: '#ede9fe', to: '#ddd6fe', border: '#8b5cf6', accent: '#7c3aed' }, // Purple
        { from: '#fef3c7', to: '#fde68a', border: '#f59e0b', accent: '#d97706' }, // Amber
      ]
    : [
        { from: '#e0f2fe', to: '#bae6fd', border: '#0284c7', accent: '#0369a1' }, // Sky Blue
        { from: '#dcfce7', to: '#bbf7d0', border: '#16a34a', accent: '#15803d' }, // Emerald
        { from: '#e0e7ff', to: '#c7d2fe', border: '#6366f1', accent: '#4f46e5' }, // Indigo
      ];

  const theme = bgGradients[variantIndex % bgGradients.length];

  const svgContent = isGirl
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${theme.from}"/>
            <stop offset="100%" stop-color="${theme.to}"/>
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fed7aa"/>
            <stop offset="100%" stop-color="#fdba74"/>
          </linearGradient>
        </defs>
        <!-- Background -->
        <rect width="200" height="240" rx="16" fill="url(#bgGrad)" />
        <rect x="2" y="2" width="196" height="236" rx="14" fill="none" stroke="${theme.border}" stroke-width="3" opacity="0.4" />
        
        <!-- Hair Back / Ponytail -->
        <circle cx="100" cy="75" r="50" fill="#1e293b" />
        <path d="M50 85 C35 120 40 160 55 180 C60 150 65 110 60 85 Z" fill="#1e293b" />
        <path d="M150 85 C165 120 160 160 145 180 C140 150 135 110 140 85 Z" fill="#1e293b" />
        <circle cx="55" cy="85" r="10" fill="${theme.accent}" />
        <circle cx="145" cy="85" r="10" fill="${theme.accent}" />

        <!-- Body / Uniform (White Shirt with Blue Collar) -->
        <path d="M40 240 L40 205 C40 180 70 170 100 170 C130 170 160 180 160 205 L160 240 Z" fill="#ffffff" />
        <!-- Blue Uniform Neckline -->
        <path d="M78 172 L100 210 L122 172 C115 178 85 178 78 172 Z" fill="#1e3a8a" />
        <!-- School Badge -->
        <circle cx="135" cy="205" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />

        <!-- Neck -->
        <rect x="86" y="145" width="28" height="30" rx="6" fill="#fdba74" />

        <!-- Head / Face -->
        <ellipse cx="100" cy="115" rx="38" ry="42" fill="url(#skinGrad)" />
        <!-- Ears -->
        <circle cx="62" cy="115" r="8" fill="#fdba74" />
        <circle cx="138" cy="115" r="8" fill="#fdba74" />

        <!-- Front Hair / Bangs -->
        <path d="M62 105 C75 75 125 75 138 105 C125 90 115 90 100 92 C85 90 75 90 62 105 Z" fill="#0f172a" />
        <path d="M62 105 Q58 125 65 135 Q68 115 65 105 Z" fill="#0f172a" />
        <path d="M138 105 Q142 125 135 135 Q132 115 135 105 Z" fill="#0f172a" />

        <!-- Eyes -->
        <ellipse cx="85" cy="115" rx="4" ry="5.5" fill="#0f172a" />
        <circle cx="86.5" cy="113" r="1.5" fill="#ffffff" />
        <ellipse cx="115" cy="115" rx="4" ry="5.5" fill="#0f172a" />
        <circle cx="116.5" cy="113" r="1.5" fill="#ffffff" />

        <!-- Cheeks -->
        <circle cx="76" cy="126" r="6" fill="#f43f5e" opacity="0.3" />
        <circle cx="124" cy="126" r="6" fill="#f43f5e" opacity="0.3" />

        <!-- Smile -->
        <path d="M91 130 Q100 140 109 130" fill="none" stroke="#9a3412" stroke-width="2.5" stroke-linecap="round" />
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
        <defs>
          <linearGradient id="bgGradBoy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${theme.from}"/>
            <stop offset="100%" stop-color="${theme.to}"/>
          </linearGradient>
          <linearGradient id="skinGradBoy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fed7aa"/>
            <stop offset="100%" stop-color="#fdba74"/>
          </linearGradient>
        </defs>
        <!-- Background -->
        <rect width="200" height="240" rx="16" fill="url(#bgGradBoy)" />
        <rect x="2" y="2" width="196" height="236" rx="14" fill="none" stroke="${theme.border}" stroke-width="3" opacity="0.4" />

        <!-- Body / Uniform (White Shirt with Blue Tie) -->
        <path d="M36 240 L36 205 C36 178 68 168 100 168 C132 168 164 178 164 205 L164 240 Z" fill="#ffffff" />
        <!-- Uniform Collar -->
        <path d="M74 172 L100 195 L88 170 Z" fill="#1e3a8a" />
        <path d="M126 172 L100 195 L112 170 Z" fill="#1e3a8a" />
        <path d="M96 190 L104 190 L106 225 L100 235 L94 225 Z" fill="#1e3a8a" />
        <!-- School Badge -->
        <circle cx="138" cy="205" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />

        <!-- Neck -->
        <rect x="85" y="145" width="30" height="30" rx="6" fill="#fdba74" />

        <!-- Head / Face -->
        <ellipse cx="100" cy="115" rx="38" ry="42" fill="url(#skinGradBoy)" />
        <!-- Ears -->
        <circle cx="62" cy="115" r="8" fill="#fdba74" />
        <circle cx="138" cy="115" r="8" fill="#fdba74" />

        <!-- Boy Hair (Neat Short Crop) -->
        <path d="M60 108 C58 75 75 65 100 65 C125 65 142 75 140 108 C135 90 120 86 100 86 C80 86 65 90 60 108 Z" fill="#0f172a" />
        <path d="M62 90 Q80 75 115 82 Q95 72 62 90 Z" fill="#1e293b" />

        <!-- Eyes -->
        <ellipse cx="85" cy="115" rx="4" ry="5.5" fill="#0f172a" />
        <circle cx="86.5" cy="113" r="1.5" fill="#ffffff" />
        <ellipse cx="115" cy="115" rx="4" ry="5.5" fill="#0f172a" />
        <circle cx="116.5" cy="113" r="1.5" fill="#ffffff" />

        <!-- Cheeks -->
        <circle cx="76" cy="126" r="6" fill="#f43f5e" opacity="0.25" />
        <circle cx="124" cy="126" r="6" fill="#f43f5e" opacity="0.25" />

        <!-- Smile -->
        <path d="M90 130 Q100 142 110 130" fill="none" stroke="#9a3412" stroke-width="2.5" stroke-linecap="round" />
      </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

/**
 * Returns a guaranteed valid image string for any student.
 */
export function getSafeStudentAvatar(
  avatar?: string | null,
  gender: 'ប្រុស' | 'ស្រី' = 'ប្រុស',
  index: number = 0
): string {
  if (avatar && typeof avatar === 'string') {
    const trimmed = avatar.trim();
    if (
      trimmed.startsWith('data:image') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('/')
    ) {
      return trimmed;
    }
  }

  // Generate crisp vector Cambodian student avatar SVG
  return generateDefaultStudentAvatarSvg(gender, index);
}
