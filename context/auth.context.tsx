"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../lib/api";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setLoggedUser } from "../store/slice/Base";

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
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: any) => state.base.user);
  const reduxToken = useSelector((state: any) => state.base.token);

  const [user, setUser] = useState<any>(reduxUser);
  const [org, setOrg] = useState<any>(null); // Optionally add org to Redux if needed
  const [loading, setLoading] = useState(false); // No longer loading initially since we use Redux
  const router = useRouter();

  useEffect(() => {
    // If Redux has the user, sync local state
    if (reduxUser) {
      setUser(reduxUser);
    }
  }, [reduxUser]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });

    // Store in Redux instead of fetching /me later
    dispatch(setToken(res.data.token));
    dispatch(setLoggedUser(res.data.user));

    setUser(res.data.user);
    setOrg(res.data.organization);
    router.push("/");
    return res;
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    dispatch(setToken(res.data.token));
    dispatch(setLoggedUser(res.data.user));
    setUser(res.data.user);
    setOrg(res.data.organization);
    router.push("/");
  };

  const logout = async () => {
    await authApi.logout();
    dispatch(setToken(null));
    dispatch(setLoggedUser(null));
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