import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { loginWithCredentials, registerUser } from '@/services/authService';

export default function Login() {
  // 表单模式：login 或 register
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // 切换登录/注册模式
  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    // 重置表单
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (mode === 'login') {
      if (!username) {
        toast.error('请输入用户名');
        return false;
      }
      if (!password) {
        toast.error('请输入密码');
        return false;
      }
      return true;
    } else {
      // 注册表单验证
      if (!username) {
        toast.error('请输入用户名');
        return false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error('请输入有效的邮箱地址');
        return false;
      }
      if (!password || password.length < 6) {
        toast.error('密码长度不能少于6位');
        return false;
      }
      if (password !== confirmPassword) {
        toast.error('两次输入的密码不一致');
        return false;
      }
      return true;
    }
  };

  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await loginWithCredentials(username, password);
      if (result) {
        login(result.user);
        toast.success('登录成功');
        navigate('/assessment');
      }
    } catch (error) {
      console.error('登录错误:', error);
      toast.error('用户名或密码错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await registerUser(username, email, password);
      if (result) {
        toast.success('注册成功，请登录');
        setMode('login');
      }
    } catch (error) {
      console.error('注册错误:', error);
      toast.error(error instanceof Error ? error.message : '注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* 导航栏 */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <div className="w-10 h-10 rounded-full overflow-hidden">
               <img src="https://lf-code-agent.coze.cn/obj/x-ai-cn/272886127106/attachment/头像_20250830152537.png" alt="五行轻养" className="w-full h-full object-contain" />
             </div>
            <h1 className="text-2xl font-bold text-amber-700">五行轻养</h1>
          </div>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {mode === 'login' ? '账号登录' : '用户注册'}
              </h2>
              <button 
                onClick={toggleMode}
                className="text-amber-600 text-sm mt-1 hover:underline"
              >
                {mode === 'login' 
                  ? '还没有账号？立即注册' 
                  : '已有账号？立即登录'}
              </button>
            </div>
            
            <div className="space-y-6">
              {/* 用户名输入 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-user text-amber-600"></i>
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* 邮箱输入 - 仅注册模式显示 */}
              {mode === 'register' && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱地址
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-envelope text-amber-600"></i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入邮箱地址"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              )}
              
              {/* 密码输入 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock text-amber-600"></i>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'login' ? "请输入密码" : "请设置密码（至少6位）"}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* 确认密码 - 仅注册模式显示 */}
              {mode === 'register' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    确认密码
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-lock text-amber-600"></i>
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="请再次输入密码"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              )}
              
              {/* 登录/注册按钮 */}
              <button
                onClick={mode === 'login' ? handleLogin : handleRegister}
                disabled={isLoading}
                className={cn(
                  "w-full py-3 rounded-lg font-medium transition-all duration-300",
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg"
                )}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                    {mode === 'login' ? "登录中..." : "注册中..."}
                  </>
                ) : (
                  mode === 'login' ? "登录" : "注册"
                )}
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-500">
              {mode === 'login' ? '登录' : '注册'}即表示同意我们的
              <a href="#" className="text-amber-700 hover:underline mx-1">服务条款</a>
              和
              <a href="#" className="text-amber-700 hover:underline mx-1">隐私政策</a>
            </p>
          </div>
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© 2025 五行轻养 版权所有 | 中医养生参考，不能替代专业医疗建议</p>
        </div>
      </footer>
    </div>
  );
}