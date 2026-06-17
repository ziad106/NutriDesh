import { MD3DarkTheme } from 'react-native-paper';
import { COLORS } from '../constants/colors';

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 16,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.lightGreen,
    onPrimary: '#FFFFFF',
    primaryContainer: '#1B5E20',
    secondary: COLORS.clayOrange,
    background: COLORS.darkBg,
    surface: COLORS.darkSurface,
    onSurface: COLORS.textOnDark,
    error: COLORS.alertRed,
    outline: '#333',
  },
};

export default darkTheme;
