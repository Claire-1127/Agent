import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
  import { cn } from "@/lib/utils";
  import { calculateConstitution, ConstitutionResult, FiveElementsData } from "@/services/constitutionService";

const generateHourOptions = () => {
    const options = [];

    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const hourStr = hour.toString().padStart(2, "0");
            const minuteStr = minute.toString().padStart(2, "0");
            options.push(`${hourStr}:${minuteStr}`);
        }
    }

    return options;
};

const regionOptions = [
    "北京",
    "上海",
    "广州",
    "深圳",
    "杭州",
    "南京",
    "成都",
    "重庆",
    "武汉",
    "西安",
    "沈阳",
    "大连",
    "天津",
    "青岛",
    "济南",
    "哈尔滨",
    "长春",
    "石家庄",
    "郑州",
    "长沙",
    "福州",
    "厦门",
    "南宁",
    "昆明",
    "贵阳",
    "兰州",
    "太原",
    "合肥",
    "南昌",
    "苏州",
    "无锡",
    "宁波",
    "温州",
    "佛山",
    "东莞",
    "珠海",
    "中山",
    "惠州",
    "汕头",
    "湛江"
];

/**
 * 根据体质结果生成个性化调理建议
 */
const generateRecommendations = (result: ConstitutionResult): {
  diet: string[];
  sleep: string[];
  exercise: string[];
} => {
  const { weaknesses, fiveElementsData } = result;
  const weakestElement = Object.entries(fiveElementsData).sort((a, b) => a[1] - b[1])[0][0] as keyof FiveElementsData;
  
  // 根据不同虚弱元素提供针对性建议
  switch (weakestElement) {
    case 'wood':
      return {
        diet: ["多吃绿色食物如菠菜、芹菜", "适量食用酸味食物如乌梅、山楂", "避免过多食用甜食"],
        sleep: ["保证充足睡眠，23点前入睡", "睡前放松心情，避免情绪激动", "可尝试冥想或深呼吸练习"],
        exercise: ["适合散步、太极拳等温和运动", "避免剧烈运动和过度疲劳", "每天保持适量户外活动"]
      };
      
    case 'fire':
      return {
        diet: ["多吃红色食物如红豆、红枣", "适量食用苦味食物如苦瓜、莲子", "减少辛辣刺激性食物"],
        sleep: ["保证规律作息，避免熬夜", "睡前避免情绪兴奋", "可尝试温水泡脚"],
        exercise: ["适合游泳、瑜伽等清凉运动", "避免高温环境下运动", "运动后及时补充水分"]
      };
      
    case 'earth':
      return {
        diet: ["多吃黄色食物如南瓜、小米", "适量食用甜味食物如蜂蜜、山药", "避免生冷油腻食物"],
        sleep: ["保持规律作息，午间可小憩", "睡前避免进食过多", "保证睡眠环境安静舒适"],
        exercise: ["适合慢跑、快走等中等强度运动", "避免久坐不动", "饭后适当散步"]
      };
      
    case 'metal':
      return {
        diet: ["多吃白色食物如梨、白萝卜", "适量食用辛味食物如生姜、葱", "避免过咸食物"],
        sleep: ["保证充足睡眠，注意保暖", "睡前避免过度思考", "保持卧室空气流通"],
        exercise: ["适合有氧运动如快走、慢跑", "避免过度劳累", "注意呼吸道防护"]
      };
      
    case 'water':
    default:
      return {
        diet: ["多吃黑色食物，如黑豆、黑芝麻、黑木耳", "适量食用核桃、板栗等坚果", "减少生冷食物摄入"],
        sleep: ["保证23点前入睡，有利于肾脏修复", "睡前避免剧烈运动和使用电子产品", "可尝试睡前泡脚10-15分钟"],
        exercise: ["适合温和的运动，如太极拳、八段锦", "避免过度出汗的剧烈运动", "每天坚持散步30分钟"]
      };
  }
};

export default function ConstitutionAssessment() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        birthday: "",
        birthTime: "",
        birthTimeEnd: "",
        region: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const hourOptions = generateHourOptions();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {
            name,
            value
        } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = {
                    ...prev
                };

                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.birthday) {
            newErrors.birthday = "请选择出生日期";
        }

        if (!formData.birthTime) {
            newErrors.birthTime = "请选择出生开始时间";
        }

        if (!formData.birthTimeEnd) {
            newErrors.birthTimeEnd = "请选择出生结束时间";
        } else if (formData.birthTime && formData.birthTimeEnd <= formData.birthTime) {
            newErrors.birthTimeEnd = "结束时间必须晚于开始时间";
        }

        if (!formData.region) {
            newErrors.region = "请选择出生地区";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

    try {
      console.log("提交的体质查询数据:", formData);
      
      // 调用五行体质计算服务
      const constitutionResult = await calculateConstitution(
        formData.birthday,
        formData.birthTime,
        formData.region
      );
      
      // 基于五行结果生成个性化建议
      const recommendations = generateRecommendations(constitutionResult);

      navigate("/results", {
        state: {
          formData,
          ...constitutionResult,
          recommendations
        }
      });
        } catch (error) {
            console.error("体质查询失败:", error);
            alert("体质查询失败，请稍后重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col"
            style={{
                backgroundColor: "#FFFFFF",
                backgroundImage: "none"
            }}>
            {}
            <header
                className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                                src="https://lf-code-agent.coze.cn/obj/x-ai-cn/272886127106/attachment/头像_20250830161544.png"
                                alt="五行轻养"
                                className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-amber-800">五行轻养</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-600 hover:text-amber-600 transition-colors">
                            <i class="fa-solid fa-home mr-1"></i>首页
                                                                                                                             </button>
                    </div>
                </div>
            </header>
            {}
            <main
                className="flex-1 container mx-auto px-4 pt-24 pb-16 bg-amber-50"
                style={{
                    backgroundColor: "transparent"
                }}>
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-amber-800 mb-3">五行体质查询</h2>
                        <p className="text-gray-600">请输入以下信息，我们将为您分析五行体质</p>
                    </div>
                    <div
                        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-10 border border-amber-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {}
                            <div>
                                <label
                                    htmlFor="birthday"
                                    className="block text-sm font-medium text-gray-700 mb-2">公历生日 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fa-solid fa-calendar text-amber-600"></i>
                                    </div>
                                    <input
                                        type="date"
                                        id="birthday"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleInputChange}
                                        className={cn(
                                            "block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300",
                                            errors.birthday ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-amber-500"
                                        )} />
                                </div>
                                {errors.birthday && <p className="mt-1 text-sm text-red-500">{errors.birthday}</p>}
                            </div>
                            {}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">出生时段 <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="fa-solid fa-clock text-amber-600"></i>
                                        </div>
                                        <select
                                            name="birthTime"
                                            value={formData.birthTime}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 appearance-none bg-white",
                                                errors.birthTime ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-amber-500"
                                            )}>
                                            <option value="">开始时间</option>
                                            {hourOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i class="fa-solid fa-clock text-amber-600"></i>
                                        </div>
                                        <select
                                            name="birthTimeEnd"
                                            value={formData.birthTimeEnd}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 appearance-none bg-white",
                                                errors.birthTimeEnd ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-amber-500"
                                            )}>
                                            <option value="">结束时间</option>
                                            {hourOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                {errors.birthTime && <p className="mt-1 text-sm text-red-500">{errors.birthTime}</p>}
                                {errors.birthTimeEnd && <p className="mt-1 text-sm text-red-500">{errors.birthTimeEnd}</p>}
                            </div>
                            {}
                            <div>
                                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">出生地区 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fa-solid fa-map-marker-alt text-amber-600"></i>
                                    </div>
                                    <select
                                        id="region"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        className={cn(
                                            "block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 appearance-none bg-white",
                                            errors.region ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-amber-500"
                                        )}>
                                        <option value="">请选择地区</option>
                                        {regionOptions.map(region => <option key={region} value={region}>{region}</option>)}
                                    </select>
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                    </div>
                                </div>
                                {errors.region && <p className="mt-1 text-sm text-red-500">{errors.region}</p>}
                            </div>
                            {}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-all duration-300",
                                        isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg"
                                    )}>
                                    {isSubmitting ? <>
                                        <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>分析中...
                                                                                                                                                                                    </> : <>生成五行体质报告
                                                                                                                                                                                      <i class="fa-solid fa-arrow-right ml-2"></i>
                                    </>}
                                </button>
                                <p className="mt-3 text-xs text-gray-500 text-center">提交即表示同意我们根据您的信息生成体质报告
                                                                                                                                                                </p>
                            </div>
                        </form>
                    </div>
                    {}
                    <></>
                </div>
            </main>
            {}
            <footer className="bg-gray-800 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-gray-400">
                    <p>© 2025 五行轻养 版权所有 | 中医养生参考，不能替代专业医疗建议</p>
                </div>
            </footer>
        </div>
    );
}