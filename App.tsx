import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/theme";
import { I18nProvider } from "./src/i18n";
import { AuthProvider } from "./src/store/auth";
import Navigation from "./src/navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            {/* Dark theme default -> status bar text light */}
            <StatusBar style="light" />
            <Navigation />
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
