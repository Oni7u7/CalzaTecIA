// Sistema de colores CalzaTec_IA con Contraste Garantizado

export const theme = {
  // ============================================
  // COLORES DE TEXTO - MÁXIMA LEGIBILIDAD
  // ============================================
  text: {
    // Modo Claro
    light: {
      primary: '#111827',      // Casi negro para texto principal
      secondary: '#374151',    // Gris oscuro para texto secundario
      tertiary: '#6B7280',     // Gris medio para texto terciario
      muted: '#9CA3AF',        // Gris claro para texto menos importante
      inverse: '#FFFFFF',      // Blanco para fondos oscuros
    },
    // Modo Oscuro
    dark: {
      primary: '#F9FAFB',      // Casi blanco para texto principal
      secondary: '#E5E7EB',    // Gris claro para texto secundario
      tertiary: '#D1D5DB',     // Gris medio para texto terciario
      muted: '#9CA3AF',        // Gris oscuro para texto menos importante
      inverse: '#111827',      // Negro para fondos claros
    }
  },

  // Colores Primarios (Azul Tecnológico)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    // Versiones con contraste garantizado
    contrast: {
      onLight: '#1E40AF',  // Azul oscuro en fondo claro
      onDark: '#93C5FD',   // Azul claro en fondo oscuro
    }
  },

  // Colores Secundarios (Verde Éxito)
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    contrast: {
      onLight: '#166534',  // Verde oscuro en fondo claro
      onDark: '#86EFAC',   // Verde claro en fondo oscuro
    }
  },

  // Colores de Acento (Morado IA)
  accent: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
    contrast: {
      onLight: '#6B21A8',  // Morado oscuro en fondo claro
      onDark: '#D8B4FE',   // Morado claro en fondo oscuro
    }
  },

  // Colores de Estado
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Grises (Tema Claro)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // ============================================
  // FONDOS CON CONTRASTE
  // ============================================
  background: {
    // Modo Claro
    light: {
      primary: '#FFFFFF',      // Fondo principal
      secondary: '#F9FAFB',    // Fondo secundario
      tertiary: '#F3F4F6',     // Fondo terciario
      elevated: '#FFFFFF',     // Cards elevados
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    // Modo Oscuro
    dark: {
      primary: '#0F172A',      // Fondo principal
      secondary: '#1E293B',    // Fondo secundario
      tertiary: '#334155',     // Fondo terciario
      elevated: '#1E293B',     // Cards elevados
      overlay: 'rgba(0, 0, 0, 0.8)',
    }
  },

  // ============================================
  // BORDES CON BUEN CONTRASTE
  // ============================================
  border: {
    light: {
      default: '#E5E7EB',      // Borde normal
      strong: '#D1D5DB',       // Borde más visible
      subtle: '#F3F4F6',       // Borde sutil
    },
    dark: {
      default: '#374151',      // Borde normal
      strong: '#4B5563',       // Borde más visible
      subtle: '#1F2937',       // Borde sutil
    }
  },

  // Tema Oscuro (compatibilidad)
  dark: {
    bg: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      tertiary: '#D1D5DB',
    },
    border: '#374151',
  },

  // ============================================
  // GRADIENTES VIBRANTES
  // ============================================
  gradients: {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    tech: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
    brand: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    dark: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
  },

  // ============================================
  // SOMBRAS CON PROFUNDIDAD
  // ============================================
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    colored: {
      blue: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
      purple: '0 10px 25px -5px rgba(168, 85, 247, 0.4)',
      green: '0 10px 25px -5px rgba(34, 197, 94, 0.4)',
    }
  },
}

export const typography = {
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
    display: "'Poppins', 'Inter', sans-serif",
  },

  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },

  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
}

