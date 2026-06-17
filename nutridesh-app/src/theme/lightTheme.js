import { MD3LightTheme } from 'react-native-paper';
import { COLORS } from '../constants/colors';

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.forestGreen,
    onPrimary: '#FFFFFF',
    primaryContainer: '#E8F5E9',
    secondary: COLORS.clayOrange,
    background: COLORS.warmCream,
    surface: COLORS.cardSurface,
    onSurface: COLORS.textPrimary,
    error: COLORS.alertRed,
    outline: COLORS.border,
  },
};

export default lightTheme;
