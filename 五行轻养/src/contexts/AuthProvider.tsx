import { useState, useEffect, ReactNode } from "react";
import { AuthContext, User } from "./authContext";
import { getCurrentUser, logout as authLogout } from "@/services/authService";

// AuthProvider组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: 'default',
    username: 'guest',
    email: 'guest@example.com',
    createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  // 登录
  const login = (userData: User) => {
    setUser(userData);
  };

  // 登出
  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};