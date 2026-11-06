import React, { createContext, useContext, useMemo, useState } from "react";

// Palette matches the architecture blueprint: slate-ink ground, teal accent, amber.
const dark = {
  bg: "#0c1119",
  card: "#131b26",
  card2: "#0f1621",
  text: "#e8eef4",
  textSoft: "#a7b4c2",
  textFaint: "#6d7d8e",
  border: "#263341",
  accent: "#38d9c4",
  amber: "#f5b544",
  danger: "#ef4757",
  success: "#22c55e",
};

const light = {
  bg: "#eef2f6",
  card: "#ffffff",
  card2: "#f5f8fb",
  text: "#0f1720",
  textSoft: "#3a4756",
  textFaint: "#6a7788",
  border: "#d5dde6",
  accent: "#0d9488",
  amber: "#b9770a",
  danger: "#e11d48",
  success: "#16a34a",
};

export type Colors = typeof dark;
type Mode = "dark" | "light";

const ThemeContext = createContext<{
  mode: Mode;
  colors: Colors;
  toggle: () => void;
}>({ mode: "dark", colors: dark, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Dark mode by default (jaisa user ne kaha).
  const [mode, setMode] = useState<Mode>("dark");
  const value = useMemo(
    () => ({
      mode,
      colors: mode === "dark" ? dark : light,
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    }),
    [mode]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
