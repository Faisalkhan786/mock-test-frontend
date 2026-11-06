import React, { createContext, useContext, useMemo, useState } from "react";

// Bilingual: Hinglish (default) + English. Backend ko bhi ?lang= isi se bhejenge.
const strings = {
  hi: {
    appName: "Mock Test",
    login_title: "Login karo",
    login_sub: "Apna mobile number daalo",
    phone_placeholder: "10-digit mobile number",
    send_otp: "OTP bhejo",
    otp_title: "OTP daalo",
    otp_sub: "Tumhare number pe bheja gaya OTP",
    otp_placeholder: "6-digit OTP",
    demo_otp_hint: "Demo OTP",
    verify: "Verify karo",
    home_title: "Mock Tests",
    greeting: "Namaste 👋",
    home_sub: "Class 10 · Apna subject chuno",
    choose_subject: "Subject chuno",
    tests_count: "tests",
    credits: "Credits",
    get_demo_credits: "20 Free Credits lo",
    no_tests: "Abhi koi test nahi hai",
    free: "FREE",
    start_test: "Test shuru karo",
    time_left: "Bacha time",
    question: "Sawaal",
    of: "me se",
    prev: "Pichla",
    next: "Agla",
    submit: "Jama karo",
    result_title: "Result",
    your_score: "Tumhara score",
    rank: "Rank",
    correct: "Sahi",
    solution: "Solution",
    back_home: "Home pe wapas",
    loading: "Ruko...",
    error: "Kuch gadbad hui",
    lang_toggle: "English",
    logout: "Logout",
  },
  en: {
    appName: "Mock Test",
    login_title: "Login",
    login_sub: "Enter your mobile number",
    phone_placeholder: "10-digit mobile number",
    send_otp: "Send OTP",
    otp_title: "Enter OTP",
    otp_sub: "OTP sent to your number",
    otp_placeholder: "6-digit OTP",
    demo_otp_hint: "Demo OTP",
    verify: "Verify",
    home_title: "Mock Tests",
    greeting: "Hello 👋",
    home_sub: "Class 10 · Pick your subject",
    choose_subject: "Choose a subject",
    tests_count: "tests",
    credits: "Credits",
    get_demo_credits: "Get 20 Free Credits",
    no_tests: "No tests yet",
    free: "FREE",
    start_test: "Start Test",
    time_left: "Time left",
    question: "Question",
    of: "of",
    prev: "Prev",
    next: "Next",
    submit: "Submit",
    result_title: "Result",
    your_score: "Your score",
    rank: "Rank",
    correct: "Correct",
    solution: "Solution",
    back_home: "Back to Home",
    loading: "Loading...",
    error: "Something went wrong",
    lang_toggle: "हिंग्लिश",
    logout: "Logout",
  },
};

export type Lang = "hi" | "en";
type Key = keyof typeof strings.hi;

const I18nContext = createContext<{
  lang: Lang;
  t: (k: Key) => string;
  setLang: (l: Lang) => void;
}>({ lang: "hi", t: (k) => k, setLang: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("hi"); // Hinglish default
  const value = useMemo(
    () => ({ lang, setLang, t: (k: Key) => strings[lang][k] ?? k }),
    [lang]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
