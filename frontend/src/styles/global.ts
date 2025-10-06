// src/styles/global.ts

interface ColorShade {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface StateColor {
  light: string;
  DEFAULT: string;
  dark: string;
  text: string;
}

interface Colors {
  primary: ColorShade;
  secondary: ColorShade;
  success: StateColor;
  warning: StateColor;
  danger: StateColor;
  info: StateColor;
  gray: ColorShade;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

interface Layout {
  container: string;
  containerFluid: string;
  section: string;
  sectionSmall: string;
}

interface HeaderStyles {
  container: string;
  wrapper: string;
  flex: string;
  title: {
    h1: string;
    subtitle: string;
  };
  actions: {
    container: string;
    button: string;
    buttonPrimary: string;
  };
  notifications: {
    button: string;
    badge: string;
  };
}

interface Styles {
  colors: Colors;
  layout: Layout;
  header: HeaderStyles;
  filters: {
    container: string;
    wrapper: string;
    icon: string;
    select: string;
    counter: string;
  };
  alerts: {
    container: string;
    wrapper: string;
    types: {
      danger: string;
      warning: string;
      info: string;
      success: string;
    };
    content: {
      flex: string;
      icon: string;
      body: string;
      title: string;
      item: string;
    };
  };
  dashboard: {
    container: string;
    grid: {
      base: string;
      cols: string;
      responsive: string;
    };
    column: {
      base: string;
      header: string;
      badge: string;
      list: string;
    };
  };
  card: {
    base: string;
    estados: {
      verde: string;
      amarillo: string;
      rojo: string;
    };
    header: {
      flex: string;
      codigo: string;
      badge: string;
    };
    badges: {
      basico: string;
      intermedio: string;
      mayor: string;
    };
    content: {
      title: string;
      subtitle: string;
      info: string;
    };
    footer: {
      flex: string;
      dias: string;
      diasNormal: string;
      diasWarning: string;
      diasDanger: string;
    };
    progress: {
      container: string;
      bar: string;
      colors: {
        high: string;
        medium: string;
        low: string;
      };
    };
  };
  modal: {
    overlay: string;
    container: string;
    sizes: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    header: {
      container: string;
      flex: string;
      title: string;
      subtitle: string;
      close: string;
    };
    body: {
      container: string;
    };
  };
  form: {
    container: string;
    field: {
      wrapper: string;
      label: string;
      required: string;
      hint: string;
    };
    input: {
      base: string;
      normal: string;
      error: string;
      disabled: string;
    };
    select: {
      base: string;
    };
    textarea: {
      base: string;
    };
    checkbox: {
      wrapper: string;
      input: string;
      label: string;
    };
    error: string;
    infoBox: {
      base: string;
      success: string;
      info: string;
      warning: string;
      text: string;
    };
  };
  button: {
    base: string;
    variants: {
      primary: string;
      secondary: string;
      success: string;
      danger: string;
      warning: string;
      ghost: string;
      outline: string;
    };
    sizes: {
      sm: string;
      md: string;
      lg: string;
    };
    icon: {
      only: string;
      left: string;
      right: string;
    };
  };
  detail: {
    grid: string;
    infoCard: {
      container: string;
      item: string;
      icon: string;
      label: string;
    };
    statCard: {
      base: string;
      success: string;
      info: string;
      warning: string;
      danger: string;
      label: string;
      value: string;
      subtext: string;
    };
    section: {
      container: string;
      header: string;
      title: string;
    };
    phase: {
      base: string;
      completed: string;
      pending: string;
      content: string;
      checkbox: string;
      info: string;
      title: string;
      dates: string;
      icon: string;
    };
  };
  utils: {
    divider: string;
    dividerThick: string;
    shadow: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    rounded: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    text: {
      truncate: string;
      clamp1: string;
      clamp2: string;
      clamp3: string;
    };
  };
  animations: {
    fadeIn: string;
    slideUp: string;
    slideDown: string;
    pulse: string;
    spin: string;
    bounce: string;
  };
}

const styles: Styles = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    success: {
      light: '#d1fae5',
      DEFAULT: '#10b981',
      dark: '#059669',
      text: '#065f46',
    },
    warning: {
      light: '#fef3c7',
      DEFAULT: '#f59e0b',
      dark: '#d97706',
      text: '#92400e',
    },
    danger: {
      light: '#fee2e2',
      DEFAULT: '#ef4444',
      dark: '#dc2626',
      text: '#991b1b',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
      text: '#1e40af',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      primary: '#f9fafb',
      secondary: '#ffffff',
      tertiary: '#f3f4f6',
    },
  },
  layout: {
    container: 'container mx-auto px-4 sm:px-6 lg:px-8',
    containerFluid: 'w-full px-4 sm:px-6 lg:px-8',
    section: 'py-8 sm:py-12 lg:py-16',
    sectionSmall: 'py-4 sm:py-6 lg:py-8',
  },
  header: {
    container: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg',
    wrapper: 'container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6',
    flex: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4',
    title: {
      h1: 'text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight',
      subtitle: 'text-blue-100 text-xs sm:text-sm mt-1',
    },
    actions: {
      container: 'flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4',
      button: 'p-2 hover:bg-blue-700 rounded-lg transition-all duration-200 hover:scale-105',
      buttonPrimary: 'bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2 transition-all duration-200 hover:shadow-md text-sm sm:text-base',
    },
    notifications: {
      button: 'p-2 hover:bg-blue-700 rounded-lg relative transition-all duration-200',
      badge: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse',
    },
  },
  filters: {
    container: 'bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6',
    wrapper: 'flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center',
    icon: 'text-gray-500 hidden sm:block',
    select: 'flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
    counter: 'ml-auto text-sm sm:text-base text-gray-600 font-medium whitespace-nowrap',
  },
  alerts: {
    container: 'container mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6',
    wrapper: 'rounded-xl p-4 sm:p-5 border-l-4 shadow-md',
    types: {
      danger: 'bg-red-50 border-red-500',
      warning: 'bg-yellow-50 border-yellow-500',
      info: 'bg-blue-50 border-blue-500',
      success: 'bg-green-50 border-green-500',
    },
    content: {
      flex: 'flex items-start gap-3',
      icon: 'flex-shrink-0 mt-0.5',
      body: 'flex-1',
      title: 'font-semibold text-sm sm:text-base mb-2',
      item: 'text-xs sm:text-sm mb-1',
    },
  },
  dashboard: {
    container: 'container mx-auto px-4 sm:px-6 lg:px-8 pb-8',
    grid: {
      base: 'grid gap-3 sm:gap-4 lg:gap-6',
      cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 auto-rows-fr',
    },
    column: {
      base: 'bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 min-h-[200px] transition-all duration-200 hover:shadow-lg',
      header: 'font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base',
      badge: 'bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full font-semibold',
      list: 'space-y-2 sm:space-y-3',
    },
  },
  card: {
    base: 'border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    estados: {
      verde: 'bg-gradient-to-br from-green-50 to-green-100 border-green-400 hover:from-green-100 hover:to-green-200',
      amarillo: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400 hover:from-yellow-100 hover:to-yellow-200',
      rojo: 'bg-gradient-to-br from-red-50 to-red-100 border-red-400 hover:from-red-100 hover:to-red-200',
    },
    header: {
      flex: 'flex justify-between items-start mb-2 sm:mb-3',
      codigo: 'text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded',
      badge: 'text-xs px-2 py-1 rounded-full font-semibold',
    },
    badges: {
      basico: 'bg-blue-200 text-blue-800',
      intermedio: 'bg-yellow-200 text-yellow-800',
      mayor: 'bg-purple-200 text-purple-800',
    },
    content: {
      title: 'font-bold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2',
      subtitle: 'text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1',
      info: 'flex items-center gap-2 text-xs text-gray-600 mb-2 sm:mb-3',
    },
    footer: {
      flex: 'flex justify-between items-center text-xs sm:text-sm mb-2',
      dias: 'font-bold',
      diasNormal: 'text-gray-700',
      diasWarning: 'text-orange-600',
      diasDanger: 'text-red-600',
    },
    progress: {
      container: 'bg-gray-200 rounded-full h-2 overflow-hidden',
      bar: 'h-2 rounded-full transition-all duration-500',
      colors: {
        high: 'bg-gradient-to-r from-green-500 to-green-600',
        medium: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        low: 'bg-gradient-to-r from-blue-500 to-blue-600',
      },
    },
  },
  modal: {
    overlay: 'fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn',
    container: 'bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp',
    sizes: {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
    },
    header: {
      container: 'p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10',
      flex: 'flex justify-between items-start gap-4',
      title: 'text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800',
      subtitle: 'text-sm sm:text-base text-gray-600 mt-1',
      close: 'text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg',
    },
    body: {
      container: 'p-4 sm:p-6 lg:p-8',
    },
  },
  form: {
    container: 'space-y-4 sm:space-y-6',
    field: {
      wrapper: 'space-y-2',
      label: 'block text-sm font-semibold text-gray-700',
      required: 'text-red-500 ml-1',
      hint: 'text-xs sm:text-sm text-gray-500 mt-1',
    },
    input: {
      base: 'w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      normal: 'border-gray-300 bg-white',
      error: 'border-red-500 bg-red-50',
      disabled: 'bg-gray-100 cursor-not-allowed',
    },
    select: {
      base: 'w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white',
    },
    textarea: {
      base: 'w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[100px]',
    },
    checkbox: {
      wrapper: 'flex items-start gap-3',
      input: 'w-5 h-5 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-500 rounded',
      label: 'text-sm text-gray-700 cursor-pointer',
    },
    error: 'text-red-600 text-xs sm:text-sm mt-1 flex items-center gap-1',
    infoBox: {
      base: 'mt-3 p-3 sm:p-4 rounded-lg border-2',
      success: 'bg-green-50 border-green-200',
      info: 'bg-blue-50 border-blue-200',
      warning: 'bg-yellow-50 border-yellow-200',
      text: 'text-sm flex items-center gap-2',
    },
  },
  button: {
    base: 'px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed',
    variants: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
      secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-md',
      success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg',
      warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800 hover:shadow-lg',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      outline: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
    },
    sizes: {
      sm: 'px-3 py-1.5 text-xs sm:text-sm',
      md: 'px-4 py-2 text-sm sm:text-base',
      lg: 'px-6 py-3 text-base sm:text-lg',
    },
    icon: {
      only: 'p-2 sm:p-3 rounded-lg',
      left: 'mr-2',
      right: 'ml-2',
    },
  },
  detail: {
    grid: 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6',
    infoCard: {
      container: 'space-y-3',
      item: 'flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-700',
      icon: 'text-gray-500 flex-shrink-0',
      label: 'font-semibold',
    },
    statCard: {
      base: 'p-4 sm:p-6 rounded-xl border-2',
      success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300',
      info: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300',
      warning: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300',
      danger: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300',
      label: 'text-xs sm:text-sm text-gray-600 mb-1 font-medium',
      value: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
      subtext: 'text-xs text-gray-500 mt-1',
    },
    section: {
      container: 'border-t pt-6 mt-6',
      header: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4',
      title: 'text-lg sm:text-xl font-bold text-gray-800',
    },
    phase: {
      base: 'p-3 sm:p-4 border-2 rounded-xl transition-all duration-200',
      completed: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:shadow-md',
      pending: 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm',
      content: 'flex items-start gap-3',
      checkbox: 'mt-1 w-5 h-5 cursor-pointer accent-green-600',
      info: 'flex-1',
      title: 'font-semibold text-sm sm:text-base',
      dates: 'text-xs sm:text-sm text-gray-600 mt-1',
      icon: 'flex-shrink-0',
    },
  },
  utils: {
    divider: 'border-t border-gray-200 my-4 sm:my-6',
    dividerThick: 'border-t-2 border-gray-300 my-6 sm:my-8',
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
    },
    rounded: {
      sm: 'rounded',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
      full: 'rounded-full',
    },
    text: {
      truncate: 'truncate',
      clamp1: 'line-clamp-1',
      clamp2: 'line-clamp-2',
      clamp3: 'line-clamp-3',
    },
  },
  animations: {
    fadeIn: 'animate-fadeIn',
    slideUp: 'animate-slideUp',
    slideDown: 'animate-slideDown',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
  },
};

// Funciones helper con tipos
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Helper para obtener color según tipo de proyecto
export const getProyectoColor = (tipo: 'Básico' | 'Intermedio' | 'Mayor'): string => {
  const colors: Record<string, string> = {
    'Básico': styles.card.badges.basico,
    'Intermedio': styles.card.badges.intermedio,
    'Mayor': styles.card.badges.mayor,
  };
  return colors[tipo] || styles.card.badges.basico;
};

// Helper para obtener color de estado según días
export const getDiasColor = (dias: number): string => {
  if (dias < 0) return styles.card.footer.diasDanger;
  if (dias <= 5) return styles.card.footer.diasWarning;
  return styles.card.footer.diasNormal;
};

// Helper para obtener color de progreso
export const getProgressColor = (avance: number): string => {
  if (avance >= 80) return styles.card.progress.colors.high;
  if (avance >= 50) return styles.card.progress.colors.medium;
  return styles.card.progress.colors.low;
};

// Helper para obtener estilo de tarjeta según estado
export const getCardEstado = (desviacion: number): string => {
  if (desviacion >= 0) return styles.card.estados.verde;
  if (desviacion >= -15) return styles.card.estados.amarillo;
  return styles.card.estados.rojo;
};

export default styles;