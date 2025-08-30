import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

// 导入五行计算服务中的类型定义
import { FiveElementsData } from "@/services/constitutionService";

const FIVE_ELEMENTS_COLORS = {
    wood: "#4CAF50",  // 木-绿色
    fire: "#F44336",  // 火-红色
    earth: "#E6A157", // 土-土黄色
    metal: "#FF9800", // 金-橙黄色
    water: "#2196F3"  // 水-蓝色
};

const ELEMENT_NAMES = {
    wood: "木",
    fire: "火",
    earth: "土",
    metal: "金",
    water: "水"
};

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        fiveElementsData,
        constitutionConclusion,
        recommendations
    } = location.state || {};

    if (!fiveElementsData || !constitutionConclusion || !recommendations) {
        navigate("/assessment");
        return null;
    }

    const chartData = [{
        name: ELEMENT_NAMES.wood,
        value: fiveElementsData.wood,
        color: FIVE_ELEMENTS_COLORS.wood
    }, {
        name: ELEMENT_NAMES.fire,
        value: fiveElementsData.fire,
        color: FIVE_ELEMENTS_COLORS.fire
    }, {
        name: ELEMENT_NAMES.earth,
        value: fiveElementsData.earth,
        color: FIVE_ELEMENTS_COLORS.earth
    }, {
        name: ELEMENT_NAMES.metal,
        value: fiveElementsData.metal,
        color: FIVE_ELEMENTS_COLORS.metal
    }, {
        name: ELEMENT_NAMES.water,
        value: fiveElementsData.water,
        color: FIVE_ELEMENTS_COLORS.water
    }];

    const [elementCondition, organCondition, symptoms] = constitutionConclusion.split("→");

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col">
            {}
            <header
                className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center"
                            style={{
                                backgroundRepeat: "no-repeat",
                                backgroundImage: "url(https://space-static.coze.cn/coze_space/7544012942905000228/upload/%E5%A4%B4%E5%83%8F_1010x1002.png?sign=1759150920-8e805c0088-0-dc911977c02c0e90501f1225eb9cfbc4676396a4516b1b8f34fa4bb8232654ef)",
                                backgroundSize: "cover",
                                backgroundPosition: "50% 50%"
                            }}>
                            <></>
                        </div>
                        <h1 className="text-2xl font-bold text-amber-800">五行轻养</h1>
                    </div>
                     <div className="flex space-x-4">
                         <button
                             onClick={() => navigate("/")}
                             className="text-gray-600 hover:text-amber-600 transition-colors">
                             <i class="fa-solid fa-home mr-1"></i>首页
                                                                     </button>
                         <button
                             onClick={() => navigate("/assessment")}
                             className="text-gray-600 hover:text-amber-600 transition-colors">
                             <i class="fa-solid fa-redo-alt mr-1"></i>重新查询
                                                                     </button>
                     </div>
                </div>
            </header>
            {}
            <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">您的五行体质分析</h2>
                        <p className="text-gray-600">基于您提供的信息生成的个性化体质报告</p>
                    </div>
                    {}
                    <div
                        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-10 border border-green-100"
                        style={{
                            borderColor: "#FDE68A"
                        }}>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">五行能量分布</h3>
                        <div className="flex flex-col md:flex-row items-center">
                            {}
                            <div className="w-full md:w-1/2 h-64 md:h-80 mb-6 md:mb-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart
                                        style={{
                                            backgroundImage: "none"
                                        }}>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={110}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={(
                                                {
                                                    name,
                                                    percent
                                                }
                                            ) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            animationBegin={0}
                                            animationDuration={1500}
                                            animationEasing="ease-in-out"
                                            activeShape={(
                                                {
                                                    cx,
                                                    cy,
                                                    innerRadius,
                                                    outerRadius,
                                                    startAngle,
                                                    endAngle,
                                                    fill,
                                                    name,
                                                    percent
                                                }
                                            ) => <g>
                                                <path
                                                    d={`M ${cx},${cy} L ${cx + innerRadius * Math.cos((startAngle + endAngle) / 2)},${cy + innerRadius * Math.sin((startAngle + endAngle) / 2)} L ${cx + outerRadius * Math.cos((startAngle + endAngle) / 2)},${cy + outerRadius * Math.sin((startAngle + endAngle) / 2)} Z`}
                                                    fill="#fff"
                                                    stroke="#ddd" />
                                                <Pie
                                                    cx={cx}
                                                    cy={cy}
                                                    innerRadius={innerRadius * 1.05}
                                                    outerRadius={outerRadius * 1.05}
                                                    startAngle={startAngle}
                                                    endAngle={endAngle}
                                                    dataKey="value"
                                                    fill={fill} />
                                                <text
                                                    x={cx + (outerRadius + 20) * Math.cos((startAngle + endAngle) / 2)}
                                                    y={cy + (outerRadius + 20) * Math.sin((startAngle + endAngle) / 2)}
                                                    textAnchor={(startAngle + endAngle) / 2 > Math.PI ? "end" : "start"}
                                                    fill="#333"
                                                    fontWeight="bold">
                                                    {name} {Math.round(percent * 100)}%
                                                                                                                                </text>
                                            </g>}
                                            labelLine={false}>
                                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {}
                            <div className="w-full md:w-1/2 md:pl-8">
                                <div
                                    className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100 h-full"
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        backgroundImage: "none",
                                        borderColor: "#FDE68A"
                                    }}>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">体质结论</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div
                                                className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                                                <i class="fa-solid fa-exclamation text-red-500"></i>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">五行状况</p>
                                                <p className="font-medium text-gray-800">{elementCondition}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div
                                                className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                                                <i class="fa-solid fa-heartbeat text-yellow-500"></i>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">脏腑状况</p>
                                                <p className="font-medium text-gray-800">{organCondition}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div
                                                className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                                <i class="fa-solid fa-stethoscope text-blue-500"></i>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">常见表现</p>
                                                <p className="font-medium text-gray-800">{symptoms}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="flex justify-center space-x-4 mb-16">
                        <button
                            onClick={() => navigate("/assessment")}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                            <i class="fa-solid fa-redo-alt mr-2"></i>重新分析
                                                                    </button>
                        <button
                            onClick={() => navigate("/chat", { 
                                state: { 
                                    initialMessage: `根据您的体质分析结果：${constitutionConclusion}。我将为您提供针对性的调理建议。` 
                                } 
                            })}
                            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 shadow-md hover:shadow-lg transition-all duration-300">查看调理建议
                            <i class="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                    </div>
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