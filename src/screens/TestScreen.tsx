import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { AppScreen, Card } from "../ui";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";
import { api, apiError } from "../api/client";

type Props = NativeStackScreenProps<RootStackParamList, "Test">;
type Q = { id: number; question: string; options: string[] };

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function TestScreen({ route, navigation }: Props) {
  const { testId } = route.params;
  const { colors } = useTheme();
  const { t, lang } = useI18n();

  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Timer ke andar hamesha latest answers milein, isliye ref.
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const submittedRef = useRef(false);

  // Test start: credit debit + questions (bina correct answer ke).
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post(`/tests/${testId}/start?lang=${lang}`);
        setAttemptId(data.attemptId);
        setQuestions(data.questions);
        setTimeLeft(data.durationMin * 60);
      } catch (e) {
        Alert.alert(t("error"), apiError(e));
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doSubmit = useCallback(async () => {
    if (submittedRef.current || attemptId == null) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/tests/attempt/${attemptId}/submit?lang=${lang}`, {
        answers: answersRef.current,
      });
      navigation.replace("Result", { result: data });
    } catch (e) {
      submittedRef.current = false;
      setSubmitting(false);
      Alert.alert(t("error"), apiError(e));
    }
  }, [attemptId, lang, navigation, t]);

  // Har second timer ghatega; 0 hote hi auto-submit.
  useEffect(() => {
    if (loading || submittedRef.current) return;
    if (timeLeft <= 0) {
      doSubmit();
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, loading, doSubmit]);

  if (loading) {
    return (
      <AppScreen>
        <View style={st.center}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={{ color: colors.textFaint, marginTop: 12 }}>{t("loading")}</Text>
        </View>
      </AppScreen>
    );
  }

  const q = questions[index];
  const chosen = answers[q.id];
  const low = timeLeft <= 30;

  return (
    <AppScreen>
      {/* Top bar: progress + timer */}
      <View style={st.bar}>
        <Text style={{ color: colors.textSoft }}>
          {t("question")} {index + 1} {t("of")} {questions.length}
        </Text>
        <View style={[st.timer, { backgroundColor: (low ? colors.danger : colors.accent) + "22" }]}>
          <Text style={{ color: low ? colors.danger : colors.accent, fontWeight: "700" }}>
            ⏱ {fmt(timeLeft)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600", lineHeight: 26 }}>
            {q.question}
          </Text>
        </Card>

        <View style={{ height: 16 }} />
        {q.options.map((opt, i) => {
          const active = chosen === i;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.85}
              onPress={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
              style={[
                st.opt,
                {
                  backgroundColor: active ? colors.accent + "1e" : colors.card,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <View style={[st.dot, { borderColor: active ? colors.accent : colors.textFaint }]}>
                {active ? <View style={[st.dotIn, { backgroundColor: colors.accent }]} /> : null}
              </View>
              <Text style={{ color: colors.text, fontSize: 16, flex: 1 }}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom nav */}
      <View style={[st.nav, { borderColor: colors.border }]}>
        <TouchableOpacity
          disabled={index === 0}
          onPress={() => setIndex((i) => i - 1)}
          style={[st.navBtn, { opacity: index === 0 ? 0.4 : 1 }]}
        >
          <Text style={{ color: colors.textSoft, fontWeight: "600" }}>← {t("prev")}</Text>
        </TouchableOpacity>

        {index < questions.length - 1 ? (
          <TouchableOpacity
            onPress={() => setIndex((i) => i + 1)}
            style={[st.navBtn, { backgroundColor: colors.card }]}
          >
            <Text style={{ color: colors.text, fontWeight: "600" }}>{t("next")} →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={doSubmit}
            disabled={submitting}
            style={[st.navBtn, { backgroundColor: colors.accent }]}
          >
            {submitting ? (
              <ActivityIndicator color="#04201c" />
            ) : (
              <Text style={{ color: "#04201c", fontWeight: "700" }}>{t("submit")}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </AppScreen>
  );
}

const st = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timer: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  opt: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  dotIn: { width: 10, height: 10, borderRadius: 5 },
  nav: { flexDirection: "row", gap: 12, padding: 16, borderTopWidth: 1 },
  navBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
});
