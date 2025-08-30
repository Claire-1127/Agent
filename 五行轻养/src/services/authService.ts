import { toast } from "sonner";

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// 存储用户数据的键名
const USERS_STORAGE_KEY = 'registered_users';
const CURRENT_USER_KEY = 'current_user';

// 生成唯一ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// 获取所有注册用户
const getRegisteredUsers = (): Record<string, User & { password: string }> => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : {};
};

// 保存用户到本地存储
const saveUsers = (users: Record<string, User & { password: string }>) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// 注册新用户
export const registerUser = async (username: string, email: string, password: string): Promise<{ user: User } | null> => {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getRegisteredUsers();
    
    // 检查用户名是否已存在
    if (Object.values(users).some(user => user.username === username)) {
      throw new Error('用户名已被占用');
    }
    
    // 检查邮箱是否已存在
    if (Object.values(users).some(user => user.email === email)) {
      throw new Error('邮箱已被注册');
    }
    
    // 创建新用户
    const newUser: User & { password: string } = {
      id: generateId(),
      username,
      email,
      password, // 在实际应用中应该存储加密后的密码
      createdAt: new Date().toISOString(),
      avatar: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20${username}&sign=8c55d328775be38303a7b0e4f727f45b`
    };
    
    // 保存用户
    users[newUser.id] = newUser;
    saveUsers(users);
    
    // 返回不包含密码的用户信息
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  } catch (error) {
    console.error("注册错误:", error);
    throw error;
  }
};

// 使用账号密码登录
export const loginWithCredentials = async (username: string, password: string): Promise<{ token: string; user: User } | null> => {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getRegisteredUsers();
    const user = Object.values(users).find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('用户名或密码错误');
    }
    
    // 生成模拟token
    const token = `user-${user.id}-${Date.now()}`;
    
    // 存储当前登录用户和token
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    localStorage.setItem("authToken", token);
    
    return {
      token,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error("登录错误:", error);
    throw error;
  }
};

// 获取当前登录用户信息
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
    return currentUserJson ? JSON.parse(currentUserJson) : null;
  } catch (error) {
    console.error("获取用户信息错误:", error);
    logout();
    return null;
  }
};

// 登出
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem(CURRENT_USER_KEY);
};