import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export type User = {
  id: number;
  phone: string;
  name: string | null;
  language: "hi" | "en";
  credits: number;
};

type AuthState = {
  ready: boolean; // token load ho chuka?
  token: string | null;
  user: User | null;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // App khulte hi purana token load karo (taaki dobara login na karna pade).
  useEffect(() => {
    (async () => {
      const t = await SecureStore.getItemAsync("token");
      const u = await SecureStore.getItemAsync("user");
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
      setReady(true);
    })();
  }, []);

  const signIn = async (t: string, u: User) => {
    await SecureStore.setItemAsync("token", t);
    await SecureStore.setItemAsync("user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ ready, token, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
