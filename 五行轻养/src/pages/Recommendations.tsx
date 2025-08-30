import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 从路由状态中获取数据
  const { recommendations, constitutionConclusion } = location.state || {};
  
  // 如果没有数据，重定向到评估页面
  if (!recommendations || !constitutionConclusion) {
    navigate('/assessment');
    return null;
  }
  
  // 解析体质结论
  const [elementCondition] = constitutionConclusion.split('→');
  
  return (
  <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col">
      {/* 导航栏 */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center">
              <span className="text-white font-bold text-xl">五</span>
            </div>
            <h1 className="text-2xl font-bold text-green-800">五行轻养</h1>
          </div>
          
           <div className="flex space-x-4">
             <button 
               onClick={() => navigate('/')}
               className="text-gray-600 hover:text-amber-600 transition-colors"
             >
               <i class="fa-solid fa-home mr-1"></i> 首页
             </button>
             <button 
               onClick={() => navigate('/results')}
               className="text-gray-600 hover:text-amber-600 transition-colors"
             >
               <i class="fa-solid fa-chart-pie mr-1"></i> 体质报告
             </button>
           </div>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">个性化调理建议</h2>
            <p className="text-gray-600">针对 <span className="font-medium text-green-600">{elementCondition}</span> 的体质调理方案</p>
          </div>
          
          {/* 调理建议卡片 */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 饮食建议 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                  <i class="fa-solid fa-utensils text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold">饮食调理</h3>
                <p className="text-white/90 text-sm">合理饮食，滋养五行</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-4">
                  {recommendations.diet.map((item, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-green-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center">
                      <i class="fa-solid fa-lightbulb mr-2"></i> 饮食小贴士
                    </h4>
                    <p className="text-sm text-green-700">
                      饮食宜温凉适中，五味均衡，避免过食辛辣、生冷食物，根据季节调整饮食结构。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 作息建议 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                  <i class="fa-solid fa-moon text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold">作息调理</h3>
                <p className="text-white/90 text-sm">规律作息，平衡阴阳</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-4">
                  {recommendations.sleep.map((item, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <i class="fa-solid fa-lightbulb mr-2"></i> 作息小贴士
                    </h4>
                    <p className="text-sm text-blue-700">
                      顺应自然规律，日出而作，日落而息，养成规律的作息习惯，有助于恢复身体机能。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 运动建议 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                  <i class="fa-solid fa-running text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold">运动调理</h3>
                <p className="text-white/90 text-sm">适度运动，气血畅通</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-4">
                  {recommendations.exercise.map((item, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-amber-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                      <i class="fa-solid fa-lightbulb mr-2"></i> 运动小贴士
                    </h4>
                    <p className="text-sm text-amber-700">
                      运动宜循序渐进，以微微出汗为宜，避免剧烈运动和过度疲劳，运动后及时补充水分。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 温馨提示 */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100 mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <i class="fa-solid fa-info-circle text-green-600 mr-2"></i>
              温馨提示
            </h3>
            <p className="text-gray-700">
              本调理建议基于中医五行理论和您的体质特征生成，仅供养生参考，不能替代专业医疗建议。如身体不适，请及时咨询专业医师。建议坚持调理1-3个月，再进行体质复查。
            </p>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/assessment')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
            >
              <i class="fa-solid fa-redo-alt mr-2"></i>
              重新分析体质
            </button>
            
            <button
              onClick={() => {
                // 模拟分享功能
                alert('分享功能已触发，实际项目中可集成分享API');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <i class="fa-solid fa-share-alt mr-2"></i>
              分享调理方案
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <i class="fa-solid fa-home mr-2"></i>
              返回首页
            </button>
          </div>
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© 2025 五行轻养 版权所有 | 中医养生参考，不能替代专业医疗建议</p>
        </div>
      </footer>
    </div>
  );
}