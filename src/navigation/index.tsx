import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { useAuth } from "../store/auth";
import { useTheme } from "../theme";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";
import HomeScreen from "../screens/HomeScreen";
import SubjectTestsScreen from "../screens/SubjectTestsScreen";
import TestScreen from "../screens/TestScreen";
import ResultScreen from "../screens/ResultScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { ready, token } = useAuth();
  const { colors, mode } = useTheme();

  // Token load hone tak splash-jaisa loader.
  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const base = mode === "dark" ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.bg,
      card: colors.bg,
      text: colors.text,
      border: colors.border,
      primary: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="SubjectTests"
              component={SubjectTestsScreen}
              options={({ route }) => ({ title: route.params.label })}
            />
            <Stack.Screen
              name="Test"
              component={TestScreen}
              options={({ route }) => ({ title: route.params.title, headerBackVisible: false })}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{ title: "Result", headerBackVisible: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Otp" component={OtpScreen} options={{ title: "" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
