import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { AppScreen, Heading, Sub, Field, PrimaryButton } from "../ui";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";
import { api, apiError } from "../api/client";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang, setLang } = useI18n();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert(t("error"), "Sahi 10-digit number daalo");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/send-otp", { phone });
      // Demo mode me backend OTP wapas bhejta hai — agli screen pe dikha denge.
      navigation.navigate("Otp", { phone, demoOtp: data.otp });
    } catch (e) {
      Alert.alert(t("error"), apiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <View style={st.top}>
        <TouchableOpacity onPress={() => setLang(lang === "hi" ? "en" : "hi")}>
          <Text style={{ color: colors.accent, fontWeight: "600" }}>{t("lang_toggle")}</Text>
        </TouchableOpacity>
      </View>
      <View style={st.body}>
        <Heading>{t("login_title")}</Heading>
        <Sub>{t("login_sub")}</Sub>
        <View style={{ height: 28 }} />
        <Field
          value={phone}
          onChangeText={(v) => setPhone(v.replace(/[^0-9]/g, ""))}
          placeholder={t("phone_placeholder")}
          keyboardType="number-pad"
          maxLength={10}
        />
        <View style={{ height: 16 }} />
        <PrimaryButton title={t("send_otp")} onPress={sendOtp} loading={loading} />
      </View>
    </AppScreen>
  );
}

const st = StyleSheet.create({
  top: { flexDirection: "row", justifyContent: "flex-end", padding: 16 },
  body: { flex: 1, paddingHorizontal: 24, justifyContent: "center", marginTop: -60 },
});
