import { toast } from "sonner";

// 五行类型定义
export interface FiveElementsData {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

// 体质结论类型
export interface ConstitutionResult {
  fiveElementsData: FiveElementsData;
  constitutionConclusion: string;
  strengths: string[];
  weaknesses: string[];
}

/**
 * 根据出生日期、时间和地区计算五行分布
 * @param birthDate 出生日期
 * @param birthTime 出生时间
 * @param region 出生地区
 * @returns 五行分布和体质结论
 */
export const calculateConstitution = async (
  birthDate: string,
  birthTime: string,
  region: string
): Promise<ConstitutionResult> => {
  try {
    // 这里实现真实的五行计算逻辑
    // 实际应用中，这可能需要调用专业的中医体质分析API
    // 以下是基于出生日期和时间的简化计算模型
    
    const date = new Date(birthDate);
    const [hours, minutes] = birthTime.split(':').map(Number);
    
    // 基于农历和节气的五行计算（简化版）
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 计算年柱五行
    const yearElement = calculateYearElement(year);
    // 计算月柱五行
    const monthElement = calculateMonthElement(month);
    // 计算日柱五行
    const dayElement = calculateDayElement(year, month, day);
    // 计算时柱五行
    const hourElement = calculateHourElement(hours);
    
    // 综合计算五行分布
    const fiveElementsData = {
      wood: calculateElementValue(yearElement, monthElement, dayElement, hourElement, 'wood'),
      fire: calculateElementValue(yearElement, monthElement, dayElement, hourElement, 'fire'),
      earth: calculateElementValue(yearElement, monthElement, dayElement, hourElement, 'earth'),
      metal: calculateElementValue(yearElement, monthElement, dayElement, hourElement, 'metal'),
      water: calculateElementValue(yearElement, monthElement, dayElement, hourElement, 'water')
    };
    
    // 分析体质结论
    const { constitutionConclusion, strengths, weaknesses } = analyzeConstitution(fiveElementsData);
    
    return {
      fiveElementsData,
      constitutionConclusion,
      strengths,
      weaknesses
    };
  } catch (error) {
    console.error('五行体质计算失败:', error);
    toast.error('体质分析失败，请重试');
    throw error;
  }
};

// 根据年份计算年柱五行
const calculateYearElement = (year: number): string => {
  // 真实应用中应基于干支纪年法计算
  const yearCycle = (year - 1900) % 10;
  const elements = ['metal', 'metal', 'water', 'water', 'wood', 'wood', 'fire', 'fire', 'earth', 'earth'];
  return elements[yearCycle];
};

// 根据月份计算月柱五行
const calculateMonthElement = (month: number): string => {
  // 基于节气的月份五行计算
  const elements = ['earth', 'wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water', 'earth'];
  return elements[month - 1];
};

// 根据日期计算日柱五行
const calculateDayElement = (year: number, month: number, day: number): string => {
  // 简化计算，实际应基于干支历法
  const totalDays = (year - 2000) * 365 + month * 30 + day;
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
  return elements[totalDays % 5];
};

// 根据时辰计算时柱五行
const calculateHourElement = (hour: number): string => {
  const hourPeriod = Math.floor(hour / 2);
  const elements = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water', 'wood', 'wood'];
  return elements[hourPeriod];
};

// 计算五行元素值
const calculateElementValue = (
  yearElement: string, 
  monthElement: string, 
  dayElement: string, 
  hourElement: string, 
  targetElement: string
): number => {
  let value = 20; // 基础值
  
  // 根据四柱五行增加相应元素的值
  if (yearElement === targetElement) value += 10;
  if (monthElement === targetElement) value += 15;
  if (dayElement === targetElement) value += 20;
  if (hourElement === targetElement) value += 15;
  
  // 根据五行相生相克关系调整
  value = adjustByElementRelationships(yearElement, monthElement, dayElement, hourElement, targetElement, value);
  
  // 确保值在合理范围内
  return Math.max(5, Math.min(40, value));
};

// 根据五行相生相克关系调整值
const adjustByElementRelationships = (
  yearElement: string, 
  monthElement: string, 
  dayElement: string, 
  hourElement: string, 
  targetElement: string, 
  value: number
): number => {
  const generating = {
    wood: 'fire',
    fire: 'earth',
    earth: 'metal',
    metal: 'water',
    water: 'wood'
  };
  
  const overcoming = {
    wood: 'earth',
    fire: 'metal',
    earth: 'water',
    metal: 'wood',
    water: 'fire'
  };
  
  const elements = [yearElement, monthElement, dayElement, hourElement];
  
  // 相生关系增加数值
  elements.forEach(element => {
    if (generating[element as keyof typeof generating] === targetElement) {
      value += 5;
    }
  });
  
  // 相克关系减少数值
  elements.forEach(element => {
    if (overcoming[element as keyof typeof overcoming] === targetElement) {
      value -= 5;
    }
  });
  
  return value;
};

// 分析体质结论
const analyzeConstitution = (fiveElementsData: FiveElementsData): {
  constitutionConclusion: string;
  strengths: string[];
  weaknesses: string[];
} => {
  const elements = Object.entries(fiveElementsData);
  const sortedElements = [...elements].sort((a, b) => b[1] - a[1]);
  const strongestElement = sortedElements[0];
  const weakestElement = sortedElements[4];
  
  // 五行对应的脏腑和体质特征
  const elementAttributes = {
    wood: { organ: '肝', characteristics: '易怒、情绪波动大、眼睛易疲劳' },
    fire: { organ: '心', characteristics: '易失眠、心悸、口舌生疮' },
    earth: { organ: '脾', characteristics: '消化不良、腹胀、疲劳乏力' },
    metal: { organ: '肺', characteristics: '易感冒、皮肤干燥、咳嗽' },
    water: { organ: '肾', characteristics: '腰酸、记性差、头发早白' }
  };
  
  // 最强和最弱元素分析
  const strengths = [`${getElementName(strongestElement[0])}偏强→${elementAttributes[strongestElement[0] as keyof typeof elementAttributes].organ}气盛`];
  const weaknesses = [`${getElementName(weakestElement[0])}偏弱→${elementAttributes[weakestElement[0] as keyof typeof elementAttributes].organ}气虚→易${elementAttributes[weakestElement[0] as keyof typeof elementAttributes].characteristics}`];
  
  // 综合体质结论
  const constitutionConclusion = `${getElementName(weakestElement[0])}偏弱→${elementAttributes[weakestElement[0] as keyof typeof elementAttributes].organ}气虚→易${elementAttributes[weakestElement[0] as keyof typeof elementAttributes].characteristics}`;
  
  return {
    constitutionConclusion,
    strengths,
    weaknesses
  };
};

// 获取五行元素中文名称
const getElementName = (element: string): string => {
  const names = {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水'
  };
  return names[element as keyof typeof names] || element;
};