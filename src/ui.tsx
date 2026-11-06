import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./theme";

// Screen ka background + safe area wrapper.
export function AppScreen({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.bg }, style]}>{children}</SafeAreaView>
  );
}

export function Heading({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[s.h1, { color: colors.text }]}>{children}</Text>;
}

export function Sub({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[s.sub, { color: colors.textSoft }]}>{children}</Text>;
}

export function Field(props: TextInputProps) {
  const { colors } = useTheme();
  return (
    <TextInput
      placeholderTextColor={colors.textFaint}
      {...props}
      style={[
        s.field,
        { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
        props.style,
      ]}
    />
  );
}

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const off = disabled || loading;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={off}
      style={[s.btn, { backgroundColor: colors.accent, opacity: off ? 0.5 : 1 }]}
    >
      {loading ? (
        <ActivityIndicator color="#04201c" />
      ) : (
        <Text style={s.btnText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  sub: { fontSize: 15, marginTop: 6 },
  field: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
  },
  btn: { borderRadius: 12, paddingVertical: 15, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#04201c", fontSize: 16, fontWeight: "700" },
  card: { borderWidth: 1, borderRadius: 14, padding: 16 },
});
