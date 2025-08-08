export const tokens = {
  light: {
    background: '#ffffff',
    text: '#111111',
    primary: '#4ade80',
  },
  dark: {
    background: '#111111',
    text: '#ffffff',
    primary: '#4ade80',
  },
  emerald: {
    background: '#022c22',
    text: '#a7f3d0',
    primary: '#10b981',
  },
};

export type ThemeName = keyof typeof tokens;

export const useThemeTokens = (mode: ThemeName = 'light') => tokens[mode];
