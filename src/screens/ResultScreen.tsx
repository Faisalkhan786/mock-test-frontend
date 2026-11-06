import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { AppScreen, Card, PrimaryButton } from "../ui";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const { result } = route.params;
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Score summary */}
        <Card style={{ alignItems: "center", paddingVertical: 28 }}>
          <Text style={{ color: colors.textFaint, fontSize: 13 }}>{t("your_score")}</Text>
          <Text style={{ color: colors.accent, fontSize: 46, fontWeight: "800" }}>
            {result.score}
          </Text>
          <View style={st.stats}>
            <Stat label={t("correct")} value={`${result.correctCount}/${result.total}`} color={colors.success} />
            {result.rank != null ? (
              <Stat label={t("rank")} value={`#${result.rank}`} color={colors.amber} />
            ) : null}
          </View>
        </Card>

        {/* Question-wise review with solutions */}
        {result.review.map((r, qi) => (
          <Card key={r.id}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
              {qi + 1}. {r.question}
            </Text>
            {r.options.map((opt, i) => {
              const isCorrect = i === r.correctIndex;
              const isChosenWrong = i === r.chosen && !r.isCorrect;
              const bg = isCorrect
                ? colors.success + "1e"
                : isChosenWrong
                ? colors.danger + "1e"
                : "transparent";
              const bc = isCorrect ? colors.success : isChosenWrong ? colors.danger : colors.border;
              return (
                <View key={i} style={[st.opt, { backgroundColor: bg, borderColor: bc }]}>
                  <Text style={{ color: colors.text, flex: 1 }}>{opt}</Text>
                  {isCorrect ? <Text style={{ color: colors.success }}>✓</Text> : null}
                  {isChosenWrong ? <Text style={{ color: colors.danger }}>✕</Text> : null}
                </View>
              );
            })}
            {r.solution ? (
              <View style={[st.sol, { borderColor: colors.border }]}>
                <Text style={{ color: colors.textFaint, fontSize: 12, marginBottom: 2 }}>
                  {t("solution")}
                </Text>
                <Text style={{ color: colors.textSoft, lineHeight: 20 }}>{r.solution}</Text>
              </View>
            ) : null}
          </Card>
        ))}

        <View style={{ height: 8 }} />
        <PrimaryButton title={t("back_home")} onPress={() => navigation.popToTop()} />
        <View style={{ height: 20 }} />
      </ScrollView>
    </AppScreen>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ color, fontSize: 20, fontWeight: "700" }}>{value}</Text>
      <Text style={{ color: colors.textFaint, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  stats: { flexDirection: "row", gap: 36, marginTop: 16 },
  opt: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  sol: { borderTopWidth: 1, marginTop: 6, paddingTop: 10 },
});
