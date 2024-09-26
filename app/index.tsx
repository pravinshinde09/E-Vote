import React from "react";
import { AppwriteContextProvider } from "./appwrite/AppwriteContext";
import Router from "./routes/Router";
import { ThemeProvider } from "./context/ThemeProvider";
import { LanguageContextProvider } from "./context/LocalizationContext";
import { AppLockProvider } from "./context/ScreenLockContext";
import { CurrencyProvider } from "./context/CurrencyProvider";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AppLockProvider>
        <CurrencyProvider>
          <LanguageContextProvider>
            <ThemeProvider>
              <AppwriteContextProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <Router />
                </GestureHandlerRootView>
              </AppwriteContextProvider>
            </ThemeProvider>
          </LanguageContextProvider>
        </CurrencyProvider>
      </AppLockProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
