import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { loginAccount, registerAccount } from "../services/auth";

const AUTH_STORAGE_KEY = "sky-mart-auth";

function readSavedAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) ?? { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(readSavedAuth);

  const saveAuth = (result) => {
    const nextAuth = { token: result.token, user: result.user };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  };

  const value = useMemo(() => ({
    ...auth,
    isAuthenticated: Boolean(auth.token),
    register: async (credentials) => {
      const result = await registerAccount(credentials);
      saveAuth(result);
      return result.user;
    },
    login: async (credentials) => {
      const result = await loginAccount(credentials);
      saveAuth(result);
      return result.user;
    },
    logout: () => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setAuth({ token: null, user: null });
    },
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
