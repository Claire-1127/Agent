import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { cn } from '@/lib/utils';

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* 导航栏 */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center">
              <span className="text-white font-bold text-xl">五</span>
            </div>
            <h1 className="text-2xl font-bold text-green-800">五行轻养</h1>
          </div>
          
           <div className="flex items-center space-x-4">
             <Link 
               to="/assessment"
               className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors duration-300"
             >
               开始体质分析
             </Link>
             
             <Link 
               to="/chat"
               className="text-gray-600 hover:text-amber-600 transition-colors flex items-center"
             >
               <i className="fa-solid fa-comments mr-1"></i> 智能咨询
             </Link>
           </div>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        {/* 英雄区域 */}
        <section className="py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
                基于中医五行理论的<br />
                <span className="text-green-600">个性化养生方案</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                通过传统中医智慧与现代科技结合，为您提供精准的体质分析和个性化养生建议，平衡五行，调和身心。
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/assessment"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg text-center"
                >
                  立即开始体质测试
                </Link>
                <Link
                  to="/recommendations"
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300 text-center"
                >
                  了解养生方案
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-green-100 rounded-full filter blur-3xl opacity-70"></div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-teal-100 rounded-full filter blur-3xl opacity-70"></div>
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Chinese%20traditional%20medicine%20health%20illustration%20with%20five%20elements%20concept%20in%20soft%20green%20tones&sign=d6ec7d4e9369fffc1f3e36d593753963" 
                  alt="中医五行养生" 
                  className="relative z-10 rounded-2xl shadow-xl w-full object-cover h-[400px]"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* 功能特点 */}
        <section className="py-16 bg-white rounded-3xl shadow-inner mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">核心功能</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* 体质分析 */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-heart-pulse text-2xl text-green-600"></i>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">五行体质分析</h4>
              <p className="text-gray-600 mb-4">
                通过您的出生信息，结合中医五行理论，精准分析您的体质特征和五行分布。
              </p>
              <Link 
                to="/assessment"
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                开始分析 <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>
            
            {/* 养生建议 */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-leaf text-2xl text-green-600"></i>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">个性化调理方案</h4>
              <p className="text-gray-600 mb-4">
                根据您的体质特点，提供针对性的饮食建议、作息调整和运动指导，平衡五行能量。
              </p>
              <Link 
                to="/recommendations"
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                查看建议 <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>
            
            {/* 智能咨询 */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-comments text-2xl text-green-600"></i>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">智能养生咨询</h4>
              <p className="text-gray-600 mb-4">
                与五行轻养智能顾问对话，解答您的养生疑问，提供专业的中医健康指导。
              </p>
              <Link 
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium flex items-center"
              >
                开始咨询 <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
        
        {/* 五行理论简介 */}
        <section className="py-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">什么是五行理论？</h3>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8 text-center">
              五行学说是中医理论的核心组成部分，认为宇宙万物由木、火、土、金、水五种基本物质构成，五种元素之间相互资生、相互制约，维持动态平衡。
            </p>
            
            <div className="grid grid-cols-5 gap-4 mb-10">
              {/* 木 */}
              <div className="bg-green-100 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">木</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">肝</h4>
                <p className="text-sm text-gray-600">主疏泄</p>
              </div>
              
              {/* 火 */}
              <div className="bg-red-100 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">火</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">心</h4>
                <p className="text-sm text-gray-600">主血脉</p>
              </div>
              
              {/* 土 */}
              <div className="bg-yellow-100 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">土</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">脾</h4>
                <p className="text-sm text-gray-600">主运化</p>
              </div>
              
              {/* 金 */}
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">金</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">肺</h4>
                <p className="text-sm text-gray-600">主气</p>
              </div>
              
              {/* 水 */}
              <div className="bg-blue-100 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">水</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">肾</h4>
                <p className="text-sm text-gray-600">主藏精</p>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                to="/assessment"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
              >
                了解您的五行体质
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">五</span>
              </div>
              <h2 className="text-2xl font-bold text-white">五行轻养</h2>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fa-brands fa-weixin text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fa-brands fa-weibo text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fa-solid fa-envelope text-xl"></i>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 五行轻养 版权所有
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">服务条款</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">隐私政策</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">关于我们</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}