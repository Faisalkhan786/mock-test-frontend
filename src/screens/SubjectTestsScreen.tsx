import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { AppScreen, Card } from "../ui";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";
import { api, apiError } from "../api/client";
import { subjectMeta } from "../subjects";

type Props = NativeStackScreenProps<RootStackParamList, "SubjectTests">;
type TestItem = {
  id: number;
  title: string;
  subject: string;
  durationMin: number;
  totalMarks: number;
  isFree: boolean;
};

export default function SubjectTestsScreen({ route, navigation }: Props) {
  const { subject } = route.params;
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const meta = subjectMeta(subject);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/tests?class=10&type=mock&lang=${lang}&subject=${encodeURIComponent(subject)}`
      );
      setTests(data.tests);
    } catch (e) {
      Alert.alert(t("error"), apiError(e));
    } finally {
      setLoading(false);
    }
  }, [lang, subject]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <AppScreen>
      {/* Subject banner */}
      <View style={st.banner}>
        <View style={[st.iconCircle, { backgroundColor: meta.color + "22" }]}>
          <Text style={{ fontSize: 24 }}>{meta.emoji}</Text>
        </View>
        <View>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{subject}</Text>
          <Text style={{ color: colors.textFaint, fontSize: 13 }}>
            {tests.length} {t("tests_count")}
          </Text>
        </View>
      </View>

      <FlatList
        data={tests}
        keyExtractor={(x) => String(x.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ color: colors.textFaint, textAlign: "center", marginTop: 40 }}>
              {t("no_tests")}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Test", { testId: item.id, title: item.title })}
          >
            <Card>
              <View style={st.testRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: colors.textFaint, marginTop: 4 }}>
                    {item.durationMin} min · {item.totalMarks} marks
                  </Text>
                </View>
                {item.isFree ? (
                  <View style={[st.badge, { backgroundColor: colors.success + "22" }]}>
                    <Text style={{ color: colors.success, fontSize: 11, fontWeight: "700" }}>
                      {t("free")}
                    </Text>
                  </View>
                ) : (
                  <View style={[st.badge, { backgroundColor: colors.amber + "22" }]}>
                    <Text style={{ color: colors.amber, fontSize: 11, fontWeight: "700" }}>
                      1 credit
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </AppScreen>
  );
}

const st = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  testRow: { flexDirection: "row", alignItems: "center" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});
