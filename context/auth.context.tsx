"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  org: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authApi.me()
      .then((res) => {
        setUser(res.data.user);
        setOrg(res.data.organizations?.[0]?.organization || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setUser(res.data.user);
    setOrg(res.data.organization);
    router.push("/");
    return res;
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    setUser(res.data.user);
    setOrg(res.data.organization);
    router.push("/");
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setOrg(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, org, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);