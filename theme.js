// Modern Artistic Color Palette & Theme
export const colors = {
    // Primary vibrant colors
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    
    // Secondary colors
    secondary: '#EC4899', // Pink
    secondaryDark: '#DB2777',
    secondaryLight: '#F472B6',
    
    // Accent colors
    accent1: '#F59E0B', // Amber
    accent2: '#10B981', // Emerald
    accent3: '#8B5CF6', // Purple
    accent4: '#06B6D4', // Cyan
    
    // Background gradients
    gradientStart: '#667EEA', // Purple-blue
    gradientMiddle: '#764BA2', // Purple
    gradientEnd: '#F093FB', // Pink
    
    // Alternative gradients
    gradientAlt1: '#FF6B6B', // Coral
    gradientAlt2: '#4ECDC4', // Teal
    gradientAlt3: '#FFE66D', // Yellow
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#0F172A',
    gray50: '#F8FAFC',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
    gray900: '#0F172A',
    
    // Text colors
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textLight: '#94A3B8',
    textWhite: '#FFFFFF',
    
    // Status colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
};

export const gradients = {
    primary: ['#667EEA', '#764BA2', '#F093FB'],
    secondary: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
    dark: ['#1E293B', '#334155', '#475569'],
    vibrant: ['#6366F1', '#EC4899', '#F59E0B'],
    ocean: ['#06B6D4', '#3B82F6', '#8B5CF6'],
    sunset: ['#F093FB', '#F5576C', '#F59E0B'],
};

export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    colored: (color) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    }),
};

export const typography = {
    h1: {
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    bodyBold: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },
    small: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
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

