import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { AppScreen, Card } from "../ui";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";
import { api, apiError } from "../api/client";
import { useAuth } from "../store/auth";
import { subjectMeta } from "../subjects";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
type SubjectRow = { subject: string; count: number };

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { signOut } = useAuth();
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [subRes, walletRes] = await Promise.all([
        api.get("/tests/subjects?class=10&type=mock"),
        api.get("/wallet"),
      ]);
      setSubjects(subRes.data.subjects);
      setCredits(walletRes.data.credits);
    } catch (e) {
      Alert.alert(t("error"), apiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const getDemoCredits = async () => {
    try {
      const { data } = await api.post("/wallet/buy", { packId: "starter" });
      setCredits(data.credits);
      Alert.alert("✅", `${data.credits} credits mil gaye!`);
    } catch (e) {
      Alert.alert(t("error"), apiError(e));
    }
  };

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* ---- Header ---- */}
        <View style={st.header}>
          <View style={{ flex: 1 }}>
            <Text style={[st.greeting, { color: colors.text }]}>{t("greeting")}</Text>
            <Text style={{ color: colors.textFaint, marginTop: 2 }}>{t("home_sub")}</Text>
          </View>
          <View style={st.headerRight}>
            <TouchableOpacity
              onPress={() => setLang(lang === "hi" ? "en" : "hi")}
              style={[st.pill, { borderColor: colors.accent }]}
            >
              <Text style={{ color: colors.accent, fontWeight: "600", fontSize: 13 }}>
                {t("lang_toggle")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} style={[st.pill, { borderColor: colors.danger }]}>
              <Text style={{ color: colors.danger, fontWeight: "600", fontSize: 13 }}>
                {t("logout")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Credits banner ---- */}
        <Card style={[st.creditCard, { backgroundColor: colors.accent + "14", borderColor: colors.accent + "40" }]}>
          <View>
            <Text style={{ color: colors.textFaint, fontSize: 12 }}>{t("credits")}</Text>
            <Text style={{ color: colors.accent, fontSize: 30, fontWeight: "800" }}>{credits}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={getDemoCredits} style={[st.creditBtn, { backgroundColor: colors.accent }]}>
            <Text style={{ color: "#04201c", fontWeight: "700", fontSize: 13 }}>
              + {t("get_demo_credits")}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* ---- Subjects ---- */}
        <Text style={[st.sectionTitle, { color: colors.text }]}>{t("choose_subject")}</Text>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        ) : subjects.length === 0 ? (
          <Text style={{ color: colors.textFaint, textAlign: "center", marginTop: 40 }}>
            {t("no_tests")}
          </Text>
        ) : (
          <View style={st.grid}>
            {subjects.map((s) => {
              const meta = subjectMeta(s.subject);
              return (
                <TouchableOpacity
                  key={s.subject}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("SubjectTests", { subject: s.subject, label: s.subject })}
                  style={[st.subCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={[st.iconCircle, { backgroundColor: meta.color + "22" }]}>
                    <Text style={{ fontSize: 26 }}>{meta.emoji}</Text>
                  </View>
                  <Text style={[st.subName, { color: colors.text }]} numberOfLines={1}>
                    {s.subject}
                  </Text>
                  <Text style={{ color: colors.textFaint, fontSize: 12, marginTop: 2 }}>
                    {s.count} {t("tests_count")}
                  </Text>
                  {/* colored accent strip */}
                  <View style={[st.accentStrip, { backgroundColor: meta.color }]} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}

const st = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 10,
  },
  greeting: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  pill: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 11, paddingVertical: 6 },
  creditCard: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginTop: 18 },
  creditBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
  },
  subCard: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 3,
    overflow: "hidden",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  subName: { fontSize: 16, fontWeight: "700" },
  accentStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});
