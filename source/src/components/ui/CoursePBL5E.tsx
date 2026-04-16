import React, { useState, useEffect } from 'react';

interface CoursePBL5EProps {
  className?: string;
  size?: number | string;
  animate?: boolean;
}

/**
 * PBL + 5E 课程体系 SVG 图
 * 环形结构，5E 环节围绕中心
 * 支持动画效果
 */
export const CoursePBL5E: React.FC<CoursePBL5EProps> = ({ 
  className = '', 
  size = '100%',
  animate = true
}) => {
  const [activeStep, setActiveStep] = useState(animate ? -1 : 4);
  
  useEffect(() => {
    if (!animate) return;
    
    const timer = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= 4) return 0;
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [animate]);
  
  // 课程主题数据
  const topics = [
    { name: '自然观察', color: '#8BC34A', x: 500, y: 80 },
    { name: '生态探索', color: '#66BB6A', x: 780, y: 200 },
    { name: '科学实验', color: '#3B5FD9', x: 880, y: 500 },
    { name: '户外考察', color: '#7CB342', x: 780, y: 800 },
    { name: '项目创作', color: '#9C27B0', x: 500, y: 920 },
    { name: '团队协作', color: '#FFB800', x: 220, y: 800 },
    { name: '成果展示', color: '#E91E63', x: 120, y: 500 },
    { name: '思维训练', color: '#00BCD4', x: 220, y: 200 },
  ];

  return (
    <svg
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 5E 渐变 */}
        <linearGradient id="engageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        
        <linearGradient id="exploreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        
        <linearGradient id="explainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B5FD9" />
          <stop offset="100%" stopColor="#1A237E" />
        </linearGradient>
        
        <linearGradient id="elaborateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9C27B0" />
          <stop offset="100%" stopColor="#6A1B9A" />
        </linearGradient>
        
        <linearGradient id="evaluateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00BCD4" />
          <stop offset="100%" stopColor="#00838F" />
        </linearGradient>
        
        <linearGradient id="centerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B5FD9" />
          <stop offset="50%" stopColor="#4A6FE3" />
          <stop offset="100%" stopColor="#3B5FD9" />
        </linearGradient>
      </defs>
      
      {/* 背景 */}
      <rect width="1000" height="1000" fill="#F5F9FC" />
      
      {/* 装饰圆环 */}
      <circle cx="500" cy="500" r="420" fill="none" stroke="#E3F2FD" strokeWidth="40" />
      <circle cx="500" cy="500" r="320" fill="none" stroke="#E8F5E9" strokeWidth="30" />
      <circle cx="500" cy="500" r="220" fill="none" stroke="#FFF8E1" strokeWidth="20" />
      
      {/* 外围课程主题 */}
      {topics.map((topic, index) => (
        <g key={index} transform={`translate(${topic.x}, ${topic.y})`}>
          <ellipse cx="0" cy="0" rx="75" ry="32" fill={topic.color} opacity="0.9" />
          <text x="0" y="5" fontSize="13" fill="#FFF" textAnchor="middle" fontWeight="bold">{topic.name}</text>
        </g>
      ))}
      
      {/* 中心 - 荒野科学课程体系 */}
      <g transform="translate(500, 500)">
        <circle cx="0" cy="0" r="120" fill="url(#centerGrad)" />
        <circle cx="0" cy="0" r="100" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.3" />
        <text x="0" y="-20" fontSize="18" fill="#FFF" textAnchor="middle" fontWeight="bold">荒野科学</text>
        <text x="0" y="5" fontSize="16" fill="#FFF" textAnchor="middle">课程体系</text>
        <text x="0" y="35" fontSize="12" fill="#FFF" textAnchor="middle" opacity="0.8">PBL + 5E</text>
      </g>
      
      {/* Engage 激趣 - 顶部 */}
      <g 
        transform="translate(500, 260)"
        style={{
          opacity: animate ? (activeStep >= 0 ? 1 : 0.4) : 1,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transform: animate && activeStep === 0 ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <line x1="0" y1="40" x2="0" y2="120" stroke="url(#engageGrad)" strokeWidth="3" strokeDasharray="5,3" />
        <circle cx="0" cy="0" r="50" fill="url(#engageGrad)" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
        {/* 灯泡图标 */}
        <g transform="translate(-12, -18)">
          <ellipse cx="12" cy="8" rx="10" ry="12" fill="#FFF" opacity="0.9" />
          <rect x="8" y="20" width="8" height="6" fill="#FFF" opacity="0.7" />
        </g>
        <text x="0" y="28" fontSize="10" fill="#FFF" textAnchor="middle" fontWeight="bold">Engage</text>
        <rect x="-35" y="55" width="70" height="24" rx="6" fill="#FFF" stroke="url(#engageGrad)" strokeWidth="2" />
        <text x="0" y="71" fontSize="11" fill="#FF8F00" textAnchor="middle" fontWeight="bold">激趣</text>
      </g>
      
      {/* Explore 探索 - 右上 */}
      <g 
        transform="translate(690, 380)"
        style={{
          opacity: animate ? (activeStep >= 1 ? 1 : 0.4) : 1,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transform: animate && activeStep === 1 ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <line x1="-35" y1="25" x2="-100" y2="70" stroke="url(#exploreGrad)" strokeWidth="3" strokeDasharray="5,3" />
        <circle cx="0" cy="0" r="50" fill="url(#exploreGrad)" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
        {/* 放大镜图标 */}
        <g transform="translate(-12, -15)">
          <circle cx="8" cy="8" r="10" fill="none" stroke="#FFF" strokeWidth="3" />
          <line x1="15" y1="15" x2="25" y2="25" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
        </g>
        <text x="0" y="28" fontSize="10" fill="#FFF" textAnchor="middle" fontWeight="bold">Explore</text>
        <rect x="-35" y="55" width="70" height="24" rx="6" fill="#FFF" stroke="url(#exploreGrad)" strokeWidth="2" />
        <text x="0" y="71" fontSize="11" fill="#2E7D32" textAnchor="middle" fontWeight="bold">探索</text>
      </g>
      
      {/* Explain 解释 - 右下 */}
      <g 
        transform="translate(690, 620)"
        style={{
          opacity: animate ? (activeStep >= 2 ? 1 : 0.4) : 1,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transform: animate && activeStep === 2 ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <line x1="-35" y1="-25" x2="-100" y2="-70" stroke="url(#explainGrad)" strokeWidth="3" strokeDasharray="5,3" />
        <circle cx="0" cy="0" r="50" fill="url(#explainGrad)" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
        {/* 对话气泡图标 */}
        <g transform="translate(-15, -15)">
          <rect x="0" y="0" width="30" height="22" rx="5" fill="#FFF" opacity="0.9" />
          <polygon points="10,22 15,30 20,22" fill="#FFF" opacity="0.9" />
        </g>
        <text x="0" y="28" fontSize="10" fill="#FFF" textAnchor="middle" fontWeight="bold">Explain</text>
        <rect x="-35" y="55" width="70" height="24" rx="6" fill="#FFF" stroke="url(#explainGrad)" strokeWidth="2" />
        <text x="0" y="71" fontSize="11" fill="#1A237E" textAnchor="middle" fontWeight="bold">解释</text>
      </g>
      
      {/* Elaborate 拓展 - 左下 */}
      <g 
        transform="translate(310, 620)"
        style={{
          opacity: animate ? (activeStep >= 3 ? 1 : 0.4) : 1,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transform: animate && activeStep === 3 ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <line x1="35" y1="-25" x2="100" y2="-70" stroke="url(#elaborateGrad)" strokeWidth="3" strokeDasharray="5,3" />
        <circle cx="0" cy="0" r="50" fill="url(#elaborateGrad)" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
        {/* 扩展箭头图标 */}
        <g transform="translate(-15, -15)">
          <line x1="15" y1="15" x2="5" y2="5" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="15" x2="25" y2="5" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="15" x2="5" y2="25" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="15" x2="25" y2="25" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="15" cy="15" r="4" fill="#FFF" />
        </g>
        <text x="0" y="28" fontSize="10" fill="#FFF" textAnchor="middle" fontWeight="bold">Elaborate</text>
        <rect x="-35" y="55" width="70" height="24" rx="6" fill="#FFF" stroke="url(#elaborateGrad)" strokeWidth="2" />
        <text x="0" y="71" fontSize="11" fill="#6A1B9A" textAnchor="middle" fontWeight="bold">拓展</text>
      </g>
      
      {/* Evaluate 评价 - 左上 */}
      <g 
        transform="translate(310, 380)"
        style={{
          opacity: animate ? (activeStep >= 4 ? 1 : 0.4) : 1,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transform: animate && activeStep === 4 ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <line x1="35" y1="25" x2="100" y2="70" stroke="url(#evaluateGrad)" strokeWidth="3" strokeDasharray="5,3" />
        <circle cx="0" cy="0" r="50" fill="url(#evaluateGrad)" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
        {/* 星星图标 */}
        <g transform="translate(-12, -15)">
          <polygon 
            points="12,0 15,8 24,9 17,15 19,24 12,19 5,24 7,15 0,9 9,8" 
            fill="#FFF" 
            opacity="0.9" 
          />
        </g>
        <text x="0" y="28" fontSize="10" fill="#FFF" textAnchor="middle" fontWeight="bold">Evaluate</text>
        <rect x="-35" y="55" width="70" height="24" rx="6" fill="#FFF" stroke="url(#evaluateGrad)" strokeWidth="2" />
        <text x="0" y="71" fontSize="11" fill="#00838F" textAnchor="middle" fontWeight="bold">评价</text>
      </g>
      
      {/* 连接弧线 */}
      <g stroke="#CCC" strokeWidth="2" fill="none" strokeDasharray="8,4" opacity="0.4">
        <path d="M500 310 Q600 350 640 380" />
        <path d="M640 420 Q680 500 640 580" />
        <path d="M640 620 Q600 650 500 690" />
        <path d="M500 690 Q400 650 360 620" />
        <path d="M360 580 Q320 500 360 420" />
        <path d="M360 380 Q400 350 500 310" />
      </g>
      
      {/* 标题 */}
      <text x="500" y="50" fontSize="24" fill="#3B5FD9" textAnchor="middle" fontWeight="bold">PBL + 5E 课程体系</text>
      <text x="500" y="75" fontSize="12" fill="#666" textAnchor="middle">Project-Based Learning with 5E Instructional Model</text>
      
      {/* 装饰 */}
      <g fill="#FFB800" opacity="0.3">
        <circle cx="50" cy="50" r="5" />
        <circle cx="950" cy="50" r="4" />
        <circle cx="50" cy="950" r="6" />
        <circle cx="950" cy="950" r="5" />
      </g>
      
      {/* 边框 */}
      <rect x="10" y="10" width="980" height="980" fill="none" stroke="#3B5FD9" strokeWidth="2" opacity="0.1" rx="15" />
      
      {/* 底部说明 */}
      <text x="500" y="970" fontSize="11" fill="#999" textAnchor="middle">荒野科学 WILDER Education Model</text>
    </svg>
  );
};

export default CoursePBL5E;
