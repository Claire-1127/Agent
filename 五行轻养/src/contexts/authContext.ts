import { createContext } from "react";

// 用户信息类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  [key: string]: any; // 其他用户属性
}

// AuthContext类型定义
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});