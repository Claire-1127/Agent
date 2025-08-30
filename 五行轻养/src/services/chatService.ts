import { toast } from "sonner";

// 环境变量 - 实际项目中应使用.env文件
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://your-api-domain.com/api";

// 消息类型定义
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// 发送消息到AI服务
export const sendMessageToAI = async (message: string, conversationId?: string): Promise<{ 
  response: string; 
  conversationId: string;
} | null> => {
  try {
     // 无需登录，跳过token验证
     const token = "dummy-token";

    const response = await fetch(`${API_BASE_URL}/chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        conversationId,
      }),
    });

    if (!response.ok) {
      throw new Error("发送消息失败");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("发送消息错误:", error);
    toast.error(error instanceof Error ? error.message : "发送消息失败，请重试");
    return null;
  }
};

// 获取历史对话列表
export const getConversations = async (): Promise<Array<{
  id: string;
  title: string;
  lastUpdated: Date;
}> | null> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("获取对话列表失败");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("获取对话列表错误:", error);
    toast.error(error instanceof Error ? error.message : "获取对话历史失败");
    return null;
  }
};

// 获取特定对话的消息历史
export const getConversationMessages = async (conversationId: string): Promise<Message[] | null> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("获取对话消息失败");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("获取对话消息错误:", error);
    toast.error(error instanceof Error ? error.message : "获取对话历史失败");
    return null;
  }
};