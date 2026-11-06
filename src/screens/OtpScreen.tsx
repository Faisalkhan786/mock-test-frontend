import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { AppScreen, Heading, Sub, Field, PrimaryButton } from "../ui";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";
import { api, apiError } from "../api/client";
import { useAuth } from "../store/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Otp">;

export default function OtpScreen({ route }: Props) {
  const { phone, demoOtp } = route.params;
  const { colors } = useTheme();
  const { t } = useI18n();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState(demoOtp ?? "");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (otp.length !== 6) {
      Alert.alert(t("error"), "6-digit OTP daalo");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { phone, otp });
      // Token + user save -> app apne aap Home pe chala jayega (navigation gate).
      await signIn(data.token, data.user);
    } catch (e) {
      Alert.alert(t("error"), apiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <View style={st.body}>
        <Heading>{t("otp_title")}</Heading>
        <Sub>
          {t("otp_sub")} — {phone}
        </Sub>
        {demoOtp ? (
          <Text style={{ color: colors.amber, marginTop: 10 }}>
            {t("demo_otp_hint")}: {demoOtp}
          </Text>
        ) : null}
        <View style={{ height: 24 }} />
        <Field
          value={otp}
          onChangeText={(v) => setOtp(v.replace(/[^0-9]/g, ""))}
          placeholder={t("otp_placeholder")}
          keyboardType="number-pad"
          maxLength={6}
          style={{ letterSpacing: 8, textAlign: "center", fontSize: 22 }}
        />
        <View style={{ height: 16 }} />
        <PrimaryButton title={t("verify")} onPress={verify} loading={loading} />
      </View>
    </AppScreen>
  );
}

const st = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 24, justifyContent: "center", marginTop: -60 },
});
