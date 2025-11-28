// Modern Dark & Artistic Color Palette
export const colors = {
    // Core backgrounds - Deep, sophisticated blacks and grays
    background: '#0A0A0B', // Pure dark background
    backgroundElevated: '#111113', // Slightly elevated surfaces
    backgroundCard: '#18181B', // Card/container background

    // Primary accent - Subtle teal/cyan for key actions
    primary: '#2DD4BF', // Teal - modern, calming
    primaryDark: '#14B8A6',
    primaryLight: '#5EEAD4',
    primaryMuted: '#134E4A', // For backgrounds/subtle elements

    // Secondary accent - Muted slate blue
    secondary: '#64748B', // Slate gray - professional
    secondaryDark: '#475569',
    secondaryLight: '#94A3B8',

    // Accent colors - Minimal, purposeful
    accent1: '#A78BFA', // Soft purple - for highlights
    accent2: '#34D399', // Emerald - for success states
    accent3: '#F87171', // Soft red - for important alerts
    accent4: '#60A5FA', // Sky blue - for informational elements

    // Neutral spectrum - Rich blacks and grays
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray850: '#18181B', // Extra dark for depth
    gray900: '#111113',
    gray950: '#0A0A0B',

    // Text colors - Optimized for dark backgrounds
    textPrimary: '#F9FAFB', // Near white for main text
    textSecondary: '#9CA3AF', // Medium gray for secondary text
    textMuted: '#6B7280', // Subtle text
    textAccent: '#2DD4BF', // Teal for emphasis

    // Border colors - Subtle separators
    border: '#27272A',
    borderLight: '#3F3F46',
    borderAccent: '#2DD4BF',

    // Status colors - Muted but recognizable
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
};

export const gradients = {
    // Subtle dark gradients for backgrounds
    dark: ['#0A0A0B', '#111113', '#18181B'],
    darkElevated: ['#111113', '#18181B', '#27272A'],

    // Accent gradients - minimal and sophisticated
    teal: ['#134E4A', '#115E59', '#0F766E'],
    purple: ['#581C87', '#6B21A8', '#7C3AED'],
    slate: ['#1E293B', '#334155', '#475569'],

    // Subtle color transitions
    ocean: ['#0A0A0B', '#0C4A6E', '#075985'],
    midnight: ['#0A0A0B', '#1E1B4B', '#312E81'],
};

export const shadows = {
    // Subtle shadows for dark theme
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    // Glow effect for accents
    glow: (color) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    }),
};

export const typography = {
    // Refined typography for modern dark UI
    h1: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.8,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: -0.5,
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: -0.3,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: 0,
    },
    bodyBold: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        letterSpacing: 0,
    },
    caption: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    small: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        letterSpacing: 0.2,
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

