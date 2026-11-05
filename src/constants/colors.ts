/**
 * Палитра приложения для использования в JSX/TSX.
 * Синхронизирована с CSS-переменными в src/index.css.
 *
 * В CSS используй var(--color-*).
 * В TSX (style={{ color: ... }}, getResultColor, elementColors и т.п.) — COLORS.*.
 */
export const COLORS = {
    // Brand / Semantic
    primary: '#34d399',
    primaryDark: '#059669',

    danger: '#ef4444',
    dangerDark: '#dc2626',

    warning: '#fbbf24',
    warningDark: '#f59e0b',

    info: '#60a5fa',
    infoDark: '#3b82f6',
    infoMid: '#2563eb',

    success: '#22c55e',
    successDark: '#15803d',
    successMid: '#16a34a',

    orange: '#f97316',
    orangeDark: '#ea580c',

    purple: '#a855f7',
    purpleMid: '#9333ea',
    purpleDark: '#7e22ce',

    pink: '#ec4899',
    pinkDark: '#db2777',

    teal: '#14b8a6',
    tealLight: '#2dd4bf',
    tealMid: '#0d9488',

    cyan: '#06b6d4',
    cyanDark: '#0891b2',

    // Backgrounds
    bgBody: '#1a1a1a',
    bgDarkest: '#0f0f0f',
    bgDark1: '#111827',
    bgCard: '#1f2937',
    bgHover: '#2d3748',
    bgMid: '#374151',

    // Borders
    borderSubtle: '#2a3747',
    borderDefault: '#374957',
    borderStrong: '#4b5563',

    // Text
    textPrimary: '#ffffff',
    textSecondary: '#d1d5db',
    textSecondaryAlt: '#e5e7eb',
    textMuted: '#9ca3af',
    textHint: '#6b7280',
} as const;

export type ColorKey = keyof typeof COLORS;