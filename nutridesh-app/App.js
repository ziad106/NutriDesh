import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, rehydrate } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { lightTheme } from './src/theme/lightTheme';
import { darkTheme } from './src/theme/darkTheme';
import { COLORS } from './src/constants/colors';

function ThemedApp() {
  const themeMode = useSelector((s) => s.ui.themeMode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  return (
    <PaperProvider theme={theme}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </PaperProvider>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    rehydrate().finally(() => setReady(true));
  }, []);
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: COLORS.warmCream }} />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <ThemedApp />
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
