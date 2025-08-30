import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/authContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { sendMessageToAI, getConversations, getConversationMessages } from "@/services/chatService";

interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    lastUpdated: Date;
}

import { useLocation } from "react-router-dom";

export default function Chat() {
    const location = useLocation();

    const {
        initialMessage
    } = location.state || {};

    const navigate = useNavigate();

    const {
        isAuthenticated
    } = useContext(AuthContext);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const savedConversations = localStorage.getItem("fiveElementsConversations");

        if (savedConversations) {
            try {
                const parsedConversations = JSON.parse(savedConversations).map((conv: any) => ({
                    ...conv,
                    lastUpdated: new Date(conv.lastUpdated),

                    messages: conv.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                }));

                setConversations(parsedConversations);

                if (parsedConversations.length > 0) {
                    setActiveConversationId(parsedConversations[0].id);
                } else {
                    createNewConversation();
                }
            } catch (error) {
                console.error("Failed to parse conversations:", error);
                createNewConversation();
            }
        } else {
            createNewConversation();
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem("fiveElementsConversations", JSON.stringify(conversations));
        }
    }, [conversations]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [activeConversationId, conversations]);

    const activeConversation = conversations.find(conv => conv.id === activeConversationId);

    const loadConversations = async () => {
        setIsLoading(true);

        try {
            const convs = await getConversations();

            if (convs && convs.length > 0) {
                const conversationsWithMessages = await Promise.all(convs.map(async conv => {
                    const messages = await getConversationMessages(conv.id);

                    return {
                        ...conv,
                        messages: messages || []
                    };
                }));

                setConversations(conversationsWithMessages);
                setActiveConversationId(convs[0].id);
            } else {
                createNewConversation();
            }
        } catch (error) {
            console.error("加载对话失败:", error);
            toast.error("加载对话历史失败");
            createNewConversation();
        } finally {
            setIsLoading(false);
        }
    };

    const createNewConversation = async () => {
        const newConv: Conversation = {
            id: "temp-" + Date.now().toString(),
            title: "新对话",

            messages: [{
                id: "welcome",
                content: initialMessage || "您好！我是五行轻养智能养生顾问。很高兴为您提供中医养生建议。请问有什么可以帮助您的吗？",
                sender: "ai",
                timestamp: new Date()
            }],

            lastUpdated: new Date()
        };

        const updatedConversations = [newConv, ...conversations];
        setConversations(updatedConversations);
        setActiveConversationId(newConv.id);
        return newConv.id;
    };

    useEffect(() => {
        loadConversations();
    }, []);

    const switchConversation = (convId: string) => {
        setActiveConversationId(convId);
    };

    const deleteConversation = (convId: string) => {
        if (activeConversationId === convId) {
            const remainingConversations = conversations.filter(conv => conv.id !== convId);
            setConversations(remainingConversations);

            if (remainingConversations.length > 0) {
                setActiveConversationId(remainingConversations[0].id);
            } else {
                createNewConversation();
            }
        } else {
            setConversations(conversations.filter(conv => conv.id !== convId));
        }

        toast.success("对话已删除");
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeConversationId || isLoading)
            return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: newMessage.trim(),
            sender: "user",
            timestamp: new Date()
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === activeConversationId) {
                const updatedMessages = [...conv.messages, userMessage];
                const isFirstUserMessage = conv.messages.filter(m => m.sender === "user").length === 0;

                return {
                    ...conv,
                    messages: updatedMessages,
                    title: isFirstUserMessage ? userMessage.content.substring(0, 20) + "..." : conv.title,
                    lastUpdated: new Date()
                };
            }

            return conv;
        }));

        setNewMessage("");
        setIsLoading(true);

        try {
            await sendMessageToAIService(userMessage.content);
        } catch (error) {
            console.error("发送消息失败:", error);
            toast.error("发送消息失败，请重试");
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessageToAIService = async (userMessage: string) => {
        return new Promise<void>(resolve => {
            sendMessageToAI(userMessage, activeConversationId).then(result => {
                if (result) {
                    const aiMessage: Message = {
                        id: `ai-${Date.now()}`,
                        content: result.response,
                        sender: "ai",
                        timestamp: new Date()
                    };

                    setConversations(prev => prev.map(conv => {
                        if (conv.id === activeConversationId) {
                            const conversationId = result.conversationId;

                            return {
                                ...conv,
                                id: conversationId,
                                messages: [...conv.messages, aiMessage],
                                lastUpdated: new Date()
                            };
                        }

                        return conv;
                    }));

                    if (activeConversationId?.startsWith("temp-")) {
                        setActiveConversationId(result.conversationId);
                    }
                }

                resolve();
            }).catch(error => {
                console.error("AI消息发送失败:", error);
                toast.error("消息发送失败，请重试");
                resolve();
            });
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("zh-CN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    };

    const formatConversationDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "今天";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "昨天";
        } else if (date.getFullYear() === today.getFullYear()) {
            return new Intl.DateTimeFormat("zh-CN", {
                month: "short",
                day: "numeric"
            }).format(date);
        } else {
            return new Intl.DateTimeFormat("zh-CN", {
                year: "numeric",
                month: "short",
                day: "numeric"
            }).format(date);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {}
            <div
                className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
                {}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src="https://lf-code-agent.coze.cn/obj/x-ai-cn/272886127106/attachment/头像_20250830154017.png"
                                    alt="五行轻养"
                                    className="w-full h-full object-contain" />
                            </div>
                            <h1 className="text-xl font-bold text-amber-800">五行轻养</h1>
                        </div>
                        <button
                            onClick={() => toast.info("设置功能即将上线")}
                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                            <i className="fa-solid fa-cog text-sm"></i>
                        </button>
                    </div>
                    {}
                    <button
                        onClick={createNewConversation}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 flex items-center justify-center shadow-sm">
                        <i className="fa-solid fa-plus mr-2"></i>开启新对话
                                  </button>
                </div>
                {}
                <div className="flex-1 overflow-y-auto p-2">
                    <div
                        className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">最近对话
                                  </div>
                    {conversations.length > 0 ? <ul className="space-y-1">
                        {conversations.map(conversation => <li key={conversation.id}>
                            <button
                                onClick={() => switchConversation(conversation.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg flex flex-col items-start hover:bg-gray-50 transition-colors",
                                    activeConversationId === conversation.id ? "bg-amber-50 border-l-4 border-amber-500" : ""
                                )}>
                                <div className="flex justify-between items-start w-full">
                                    <span className="font-medium text-gray-800 truncate max-w-[160px]">
                                        {conversation.title}
                                    </span>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            deleteConversation(conversation.id);
                                        }}
                                        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <i className="fa-solid fa-trash-o text-xs"></i>
                                    </button>
                                </div>
                                <div className="flex items-center mt-1 w-full">
                                    <span className="text-xs text-gray-500 truncate max-w-[140px]">
                                        {conversation.messages[conversation.messages.length - 1].content.substring(0, 25)}
                                        {conversation.messages[conversation.messages.length - 1].content.length > 25 ? "..." : ""}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-auto">
                                        {formatConversationDate(conversation.lastUpdated)}
                                    </span>
                                </div>
                            </button>
                        </li>)}
                    </ul> : <div className="text-center py-10 text-gray-400">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
                            <i className="fa-solid fa-comments text-2xl"></i>
                        </div>
                        <p>暂无对话记录</p>
                        <p className="text-xs mt-1">点击"开启新对话"开始</p>
                    </div>}
                </div>
            </div>
            {}
            <div
                className="flex-1 flex flex-col bg-gradient-to-b from-green-50 to-white overflow-hidden">
                {}
                <div
                    className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
                            <img
                                src="https://lf-code-agent.coze.cn/obj/x-ai-cn/272886127106/attachment/头像_20250830154017.png"
                                alt="五行轻养智能顾问"
                                className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">五行轻养智能顾问</h2>
                            <p className="text-xs text-green-500 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>在线，响应时间&lt;1分钟
                                              </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => toast.info("功能开发中")}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                            <i className="fa-solid fa-history"></i>
                        </button>
                        <button
                            onClick={() => toast.info("功能开发中")}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                            <i className="fa-solid fa-star-o"></i>
                        </button>
                    </div>
                </div>
                {}
                <div className="flex-1 overflow-y-auto p-6 bg-amber-50">
                    {activeConversation ? <div className="max-w-3xl mx-auto space-y-6">
                        {}
                        <div className="text-center py-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">欢迎使用五行轻养智能顾问</h3>
                            <p className="text-gray-600 max-w-md mx-auto">我可以为您提供中医五行养生建议，包括体质分析、饮食调理、作息建议等。请问有什么可以帮助您的吗？
                                                </p>
                        </div>
                        {}
                        <div className="space-y-4">
                            {activeConversation.messages.map(message => <div
                                key={message.id}
                                className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
                                <div
                                    className={cn(
                                        "max-w-[75%] p-4 rounded-lg shadow-sm",
                                        message.sender === "user" ? "bg-gradient-to-r from-amber-100 to-amber-200 text-gray-800 rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                                    )}>
                                    <div className="prose prose-sm max-w-none">
                                        {message.content.split("\n").map(
                                            (line, index) => <p key={index} className={index > 0 ? "mt-2" : ""}>{line}</p>
                                        )}
                                    </div>
                                    <div
                                        className={cn(
                                            "text-xs mt-2 flex justify-end",
                                            message.sender === "user" ? "text-green-100" : "text-gray-400"
                                        )}
                                        style={{
                                            backgroundImage: "none",
                                            color: "#B6BBCC"
                                        }}>
                                        {formatDate(message.timestamp)}
                                    </div>
                                </div>
                            </div>)}
                            {}
                            {isLoading && <div className="flex justify-start">
                                <div
                                    className="bg-white p-4 rounded-lg shadow-sm rounded-tl-none border border-gray-100 max-w-[75%]">
                                    <div className="flex space-x-1">
                                        <div
                                            className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div
                                            className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>}
                            {}
                            <div ref={messagesEndRef} />
                        </div>
                    </div> : <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div
                                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                                <i className="fa-solid fa-comments text-3xl text-gray-400"></i>
                            </div>
                            <h3 className="text-lg font-medium text-gray-500">未选择对话</h3>
                            <p className="text-sm text-gray-400 mt-1">请从左侧选择一个对话或创建新对话</p>
                        </div>
                    </div>}
                </div>
                {}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-end space-x-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <textarea
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="请输入您的养生问题..."
                                        className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all duration-300 min-h-[50px] max-h-[200px]" />
                                    <div className="absolute bottom-3 right-3 flex space-x-1">
                                        <button
                                            onClick={() => toast.info("功能开发中")}
                                            className="p-1.5 text-gray-500 hover:text-amber-700 rounded-full hover:bg-gray-100 transition-colors">
                                            <i className="fa-solid fa-paperclip"></i>
                                        </button>
                                        <button
                                            onClick={() => toast.info("功能开发中")}
                                            className="p-1.5 text-gray-500 hover:text-amber-700 rounded-full hover:bg-gray-100 transition-colors">
                                            <i className="fa-solid fa-face-smile"></i>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">五行轻养智能顾问提供的建议仅供参考，不能替代专业医疗诊断
                                                    </p>
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim() || isLoading}
                                className={cn(
                                    "p-3 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center",
                                    newMessage.trim() && !isLoading ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 hover:shadow" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                )}>
                                {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}