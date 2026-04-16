import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number | string;
}

// 共用渐变定义
const SharedDefs = () => (
  <defs>
    <linearGradient id="featureBrandBlue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#4A6FE3" />
      <stop offset="100%" stopColor="#3B5FD9" />
    </linearGradient>
    <linearGradient id="featureWarmYellow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFD54F" />
      <stop offset="100%" stopColor="#FFB800" />
    </linearGradient>
    <linearGradient id="featureTreeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#6B8E23" />
      <stop offset="100%" stopColor="#4A7023" />
    </linearGradient>
    <linearGradient id="featureTrunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#6D4C41" />
      <stop offset="50%" stopColor="#8D6E63" />
      <stop offset="100%" stopColor="#6D4C41" />
    </linearGradient>
  </defs>
);

/**
 * 儿童思考场景 - 孩子坐在树下阅读/思考，头顶浮现知识图谱
 */
export const ChildThinkingIllustration: React.FC<IllustrationProps> = ({ 
  className = '', 
  size = '100%' 
}) => {
  return (
    <svg
      viewBox="0 0 1200 800"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <SharedDefs />
      
      {/* 背景 */}
      <rect width="1200" height="800" fill="#F0F7FF" />
      <rect width="1200" height="800" fill="url(#featureBrandBlue)" opacity="0.02" />
      
      {/* 光斑 */}
      <circle cx="900" cy="150" r="120" fill="#FFB800" opacity="0.1" />
      <circle cx="200" cy="100" r="80" fill="#3B5FD9" opacity="0.08" />
      
      {/* 草地 */}
      <ellipse cx="600" cy="780" rx="800" ry="150" fill="#8BC34A" opacity="0.4" />
      
      {/* 大树 */}
      <g transform="translate(200, 100)">
        <path 
          d="M100 550 Q80 400 90 250 Q95 180 85 120 L145 120 Q135 180 140 250 Q150 400 130 550 Z" 
          fill="url(#featureTrunkGradient)" 
          stroke="#5D4037" 
          strokeWidth="2"
        />
        <ellipse cx="115" cy="80" rx="130" ry="110" fill="url(#featureTreeGradient)" />
        <ellipse cx="80" cy="100" rx="70" ry="60" fill="#7CB342" />
        <ellipse cx="150" cy="90" rx="80" ry="70" fill="#8BC34A" />
      </g>
      
      {/* 孩子坐姿阅读 */}
      <g transform="translate(280, 450)">
        {/* 腿 */}
        <path 
          d="M0 180 Q-30 200 -60 210 Q-80 215 -90 230" 
          stroke="#4A6FE3" 
          strokeWidth="25" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M30 180 Q60 200 90 210 Q110 215 120 230" 
          stroke="#4A6FE3" 
          strokeWidth="25" 
          fill="none" 
          strokeLinecap="round"
        />
        <ellipse cx="-95" cy="235" rx="20" ry="12" fill="#5D4037" />
        <ellipse cx="125" cy="235" rx="20" ry="12" fill="#5D4037" />
        {/* 身体 */}
        <ellipse cx="15" cy="130" rx="55" ry="70" fill="url(#featureBrandBlue)" />
        {/* 手臂 */}
        <path d="M-40 100 Q-60 80 -50 50" stroke="#FFCCBC" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M70 100 Q90 80 100 60" stroke="#FFCCBC" strokeWidth="18" fill="none" strokeLinecap="round" />
        {/* 书本 */}
        <g transform="translate(30, 40)">
          <rect x="-50" y="-5" width="100" height="70" rx="3" fill="#FFF" stroke="#DDD" strokeWidth="1" />
          <line x1="0" y1="-5" x2="0" y2="65" stroke="#DDD" strokeWidth="1" />
        </g>
        {/* 头部 */}
        <circle cx="15" cy="50" r="50" fill="#FFCCBC" />
        <path 
          d="M-35 30 Q-40 0 -15 -10 Q15 -20 40 -10 Q60 0 55 30 Q40 15 15 20 Q-10 15 -35 30" 
          fill="#5D4037"
        />
        {/* 眼睛 - 思考状态向上看 */}
        <ellipse cx="-5" cy="45" rx="8" ry="10" fill="#FFF" />
        <ellipse cx="30" cy="45" rx="8" ry="10" fill="#FFF" />
        <circle cx="-5" cy="42" r="5" fill="#3B5FD9" />
        <circle cx="30" cy="42" r="5" fill="#3B5FD9" />
        <path d="M5 70 Q15 78 25 70" stroke="#8D6E63" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      
      {/* 思维气泡 - 知识图谱 */}
      <g transform="translate(500, 80)">
        <ellipse cx="200" cy="150" rx="280" ry="130" fill="#FFF" stroke="#3B5FD9" strokeWidth="2" opacity="0.9" />
        <circle cx="100" cy="250" r="20" fill="#FFF" stroke="#3B5FD9" strokeWidth="1.5" opacity="0.8" />
        <circle cx="70" cy="290" r="12" fill="#FFF" stroke="#3B5FD9" strokeWidth="1" opacity="0.6" />
        
        {/* 中心问号 */}
        <circle cx="200" cy="150" r="35" fill="url(#featureWarmYellow)" stroke="#FFB800" strokeWidth="2" />
        <text x="200" y="160" fontSize="40" fill="#5D4037" textAnchor="middle" fontWeight="bold">?</text>
        
        {/* 知识节点 */}
        <line x1="200" y1="115" x2="150" y2="70" stroke="#3B5FD9" strokeWidth="2" opacity="0.6" />
        <line x1="200" y1="115" x2="250" y2="70" stroke="#3B5FD9" strokeWidth="2" opacity="0.6" />
        <line x1="165" y1="150" x2="90" y2="130" stroke="#3B5FD9" strokeWidth="2" opacity="0.6" />
        <line x1="235" y1="150" x2="310" y2="130" stroke="#3B5FD9" strokeWidth="2" opacity="0.6" />
        
        {/* 蝴蝶节点 */}
        <circle cx="150" cy="70" r="25" fill="#E3F2FD" stroke="#3B5FD9" strokeWidth="1.5" />
        <path d="M150 60 Q140 70 150 80 Q160 70 150 60" fill="#3B5FD9" />
        
        {/* 叶子节点 */}
        <circle cx="250" cy="70" r="25" fill="#E8F5E9" stroke="#7CB342" strokeWidth="1.5" />
        <path d="M250 55 Q265 70 250 85 Q235 70 250 55" fill="#8BC34A" />
        
        {/* 星星节点 */}
        <circle cx="90" cy="130" r="22" fill="#FFF8E1" stroke="#FFB800" strokeWidth="1.5" />
        <polygon 
          points="90,112 94,124 107,124 97,132 101,145 90,137 79,145 83,132 73,124 86,124" 
          fill="#FFB800" 
        />
        
        {/* 花朵节点 */}
        <circle cx="310" cy="130" r="22" fill="#FFF3E0" stroke="#FF8F00" strokeWidth="1.5" />
        <circle cx="310" cy="122" r="6" fill="#FFB800" />
        <circle cx="302" cy="130" r="5" fill="#FFB800" />
        <circle cx="318" cy="130" r="5" fill="#FFB800" />
      </g>
      
      {/* 装饰 */}
      <g fill="#8BC34A" opacity="0.7">
        <ellipse cx="950" cy="300" rx="15" ry="8" transform="rotate(45, 950, 300)" />
        <ellipse cx="1000" cy="450" rx="12" ry="6" transform="rotate(-30, 1000, 450)" />
      </g>
      
      {/* 边框 */}
      <rect x="15" y="15" width="1170" height="770" fill="none" stroke="#3B5FD9" strokeWidth="2" opacity="0.15" rx="8" />
    </svg>
  );
};

/**
 * 户外探索场景 - 孩子们进行自然观察、PBL项目式学习
 */
export const OutdoorDiscoveryIllustration: React.FC<IllustrationProps> = ({ 
  className = '', 
  size = '100%' 
}) => {
  return (
    <svg
      viewBox="0 0 1200 800"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <SharedDefs />
      
      {/* 天空背景 */}
      <defs>
        <linearGradient id="outdoorSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="60%" stopColor="#B0E0E6" />
          <stop offset="100%" stopColor="#E8F5E9" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#outdoorSky)" />
      
      {/* 太阳 */}
      <circle cx="1050" cy="100" r="60" fill="#FFB800" opacity="0.8" />
      <circle cx="1050" cy="100" r="50" fill="#FFD54F" />
      
      {/* 远山 */}
      <path 
        d="M0 450 Q150 350 300 400 Q450 320 600 380 Q750 300 900 360 Q1050 320 1200 400 L1200 800 L0 800 Z" 
        fill="#81C784" 
        opacity="0.4"
      />
      <path 
        d="M0 550 Q200 450 400 500 Q600 430 800 480 Q1000 440 1200 500 L1200 800 L0 800 Z" 
        fill="#81C784" 
        opacity="0.5"
      />
      
      {/* 草地 */}
      <ellipse cx="600" cy="750" rx="800" ry="180" fill="#8BC34A" />
      <ellipse cx="600" cy="780" rx="750" ry="120" fill="#7CB342" />
      
      {/* 孩子1 - 观鸟者 */}
      <g transform="translate(200, 480)">
        <ellipse cx="0" cy="150" rx="40" ry="55" fill="url(#featureBrandBlue)" />
        <path d="M-15 195 Q-20 230 -15 260 L5 260 L0 200" fill="#5D4037" />
        <path d="M15 195 Q20 230 15 260 L-5 260 L0 200" fill="#5D4037" />
        <path d="M-40 130 Q-60 100 -50 70" stroke="#FFCCBC" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M40 130 Q60 100 50 70" stroke="#FFCCBC" strokeWidth="16" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="90" r="45" fill="#FFCCBC" />
        {/* 帽子 */}
        <ellipse cx="0" cy="55" rx="55" ry="20" fill="#FFB800" />
        <ellipse cx="0" cy="45" rx="35" ry="25" fill="#FFB800" />
        <path d="M-30 70 Q-35 55 -20 50 Q0 45 20 50 Q35 55 30 70" fill="#5D4037" />
        <ellipse cx="-12" cy="85" rx="6" ry="8" fill="#FFF" />
        <ellipse cx="12" cy="85" rx="6" ry="8" fill="#FFF" />
        <circle cx="-12" cy="87" r="4" fill="#3B5FD9" />
        <circle cx="12" cy="87" r="4" fill="#3B5FD9" />
        <path d="M-8 105 Q0 115 8 105" stroke="#8D6E63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* 双筒望远镜 */}
        <g transform="translate(0, 55)">
          <rect x="-25" y="-20" width="20" height="35" rx="5" fill="#333" />
          <rect x="5" y="-20" width="20" height="35" rx="5" fill="#333" />
          <circle cx="-15" cy="-15" r="8" fill="#1A1A1A" />
          <circle cx="15" cy="-15" r="8" fill="#1A1A1A" />
        </g>
      </g>
      
      {/* 树上的鸟 */}
      <g transform="translate(200, 280)">
        <ellipse cx="0" cy="0" rx="18" ry="12" fill="#E53935" />
        <circle cx="15" cy="-3" r="9" fill="#EF5350" />
        <polygon points="24,-3 32,0 24,3" fill="#FF8F00" />
        <circle cx="18" cy="-5" r="2.5" fill="#1A1A1A" />
      </g>
      <path d="M150 300 Q180 290 250 295" stroke="#8D6E63" strokeWidth="6" fill="none" />
      
      {/* 孩子2 - 记录者 */}
      <g transform="translate(550, 500)">
        <ellipse cx="0" cy="130" rx="45" ry="50" fill="#FFB800" />
        <path 
          d="M-20 160 Q-50 180 -60 200 Q-65 215 -50 220" 
          stroke="#5D4037" 
          strokeWidth="22" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M20 160 Q50 180 60 200 Q65 215 50 220" 
          stroke="#5D4037" 
          strokeWidth="22" 
          fill="none" 
          strokeLinecap="round"
        />
        <circle cx="0" cy="70" r="42" fill="#FFCCBC" />
        {/* 女孩发型 */}
        <path d="M-35 55 Q-40 35 -25 25 Q0 15 25 25 Q40 35 35 55 Q20 45 0 50 Q-20 45 -35 55" fill="#5D4037" />
        <ellipse cx="38" cy="45" rx="15" ry="25" fill="#5D4037" transform="rotate(20, 38, 45)" />
        <ellipse cx="35" cy="35" rx="8" ry="5" fill="#FFB800" />
        <ellipse cx="-10" cy="68" rx="6" ry="8" fill="#FFF" />
        <ellipse cx="10" cy="68" rx="6" ry="8" fill="#FFF" />
        <circle cx="-10" cy="70" r="4" fill="#3B5FD9" />
        <circle cx="10" cy="70" r="4" fill="#3B5FD9" />
        {/* 笔记本 */}
        <g transform="translate(70, 75)">
          <rect x="-30" y="-35" width="60" height="80" rx="3" fill="#FFF" stroke="#DDD" strokeWidth="1" />
          <line x1="-25" y1="-20" x2="25" y2="-20" stroke="#3B5FD9" strokeWidth="1" opacity="0.5" />
        </g>
      </g>
      
      {/* 孩子3 - 标本收集 */}
      <g transform="translate(850, 490)">
        <ellipse cx="0" cy="145" rx="38" ry="52" fill="#8BC34A" />
        <path d="M-12 190 Q-15 220 -10 250 L10 250 L12 190" fill="#5D4037" />
        <ellipse cx="0" cy="255" rx="20" ry="10" fill="#3E2723" />
        <circle cx="0" cy="85" r="40" fill="#FFCCBC" />
        {/* 探险帽 */}
        <ellipse cx="0" cy="55" rx="48" ry="18" fill="#8D6E63" />
        <ellipse cx="0" cy="45" rx="30" ry="22" fill="#A1887F" />
        <path d="M-25 65 Q-28 50 -15 45 Q0 40 15 45 Q28 50 25 65" fill="#4E342E" />
        <ellipse cx="-10" cy="82" rx="5" ry="7" fill="#FFF" />
        <ellipse cx="10" cy="82" rx="5" ry="7" fill="#FFF" />
        <circle cx="-10" cy="84" r="3.5" fill="#3B5FD9" />
        <circle cx="10" cy="84" r="3.5" fill="#3B5FD9" />
        {/* 放大镜 */}
        <g transform="translate(-60, 70)">
          <circle cx="0" cy="0" r="20" fill="#E3F2FD" opacity="0.6" stroke="#5D4037" strokeWidth="4" />
          <rect x="15" y="15" width="25" height="8" rx="4" fill="#8D6E63" transform="rotate(45, 15, 15)" />
        </g>
      </g>
      
      {/* 蝴蝶装饰 */}
      <g transform="translate(400, 350)">
        <path d="M0 0 Q-25 -20 -30 8 Q-25 25 0 12" fill="#3B5FD9" opacity="0.8" />
        <path d="M0 0 Q25 -20 30 8 Q25 25 0 12" fill="#3B5FD9" opacity="0.8" />
        <circle cx="-15" cy="5" r="5" fill="#FFB800" opacity="0.7" />
        <circle cx="15" cy="5" r="5" fill="#FFB800" opacity="0.7" />
      </g>
      
      {/* PBL 标志 */}
      <g transform="translate(50, 50)">
        <rect x="-30" y="-15" width="60" height="30" rx="5" fill="#3B5FD9" opacity="0.15" />
        <text x="0" y="6" fontSize="18" fill="#3B5FD9" textAnchor="middle" fontWeight="bold" opacity="0.7">PBL</text>
      </g>
      
      {/* 边框 */}
      <rect x="10" y="10" width="1180" height="780" fill="none" stroke="#3B5FD9" strokeWidth="2" opacity="0.12" rx="8" />
    </svg>
  );
};

/**
 * 亲子互动场景 - 家长和孩子一起探索自然
 */
export const ParentChildIllustration: React.FC<IllustrationProps> = ({ 
  className = '', 
  size = '100%' 
}) => {
  return (
    <svg
      viewBox="0 0 1200 800"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <SharedDefs />
      
      {/* 夜空背景 */}
      <defs>
        <linearGradient id="eveningSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A237E" />
          <stop offset="30%" stopColor="#303F9F" />
          <stop offset="60%" stopColor="#5C6BC0" />
          <stop offset="100%" stopColor="#9FA8DA" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <rect width="1200" height="800" fill="url(#eveningSky)" />
      
      {/* 星星 */}
      <g fill="#FFF">
        <circle cx="100" cy="80" r="2" filter="url(#glow)" opacity="0.9" />
        <circle cx="250" cy="120" r="2.5" filter="url(#glow)" opacity="0.85" />
        <circle cx="400" cy="60" r="2" filter="url(#glow)" opacity="0.9" />
        <circle cx="700" cy="80" r="2.2" filter="url(#glow)" opacity="0.9" />
        <circle cx="1000" cy="70" r="2.5" filter="url(#glow)" opacity="0.9" />
        <circle cx="150" cy="180" r="1" opacity="0.6" />
        <circle cx="350" cy="90" r="1.2" opacity="0.7" />
        <circle cx="620" cy="50" r="1.2" opacity="0.6" />
        <circle cx="920" cy="45" r="1.2" opacity="0.6" />
      </g>
      
      {/* 月亮 */}
      <circle cx="1050" cy="120" r="50" fill="#FFF8E1" />
      <circle cx="1070" cy="110" r="45" fill="url(#eveningSky)" />
      <circle cx="1050" cy="120" r="60" fill="none" stroke="#FFF8E1" strokeWidth="2" opacity="0.3" />
      
      {/* 流星 */}
      <g opacity="0.7">
        <line x1="200" y1="100" x2="250" y2="130" stroke="url(#featureWarmYellow)" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* 草地 */}
      <ellipse cx="600" cy="750" rx="800" ry="180" fill="#2E7D32" />
      <ellipse cx="600" cy="780" rx="750" ry="120" fill="#2E7D32" opacity="0.8" />
      
      {/* 萤火虫 */}
      <g fill="#FFB800" filter="url(#glow)">
        <circle cx="300" cy="500" r="3" opacity="0.8" />
        <circle cx="400" cy="450" r="2.5" opacity="0.7" />
        <circle cx="800" cy="480" r="3" opacity="0.8" />
        <circle cx="900" cy="520" r="2.5" opacity="0.7" />
      </g>
      
      {/* 野餐毯 */}
      <g transform="translate(500, 580)">
        <path d="M0 0 L250 0 L280 120 L-30 120 Z" fill="#3B5FD9" opacity="0.8" />
        <path d="M0 0 L250 0 L280 120 L-30 120 Z" fill="none" stroke="#2D4DB8" strokeWidth="2" />
        <line x1="50" y1="0" x2="30" y2="120" stroke="#FFF" strokeWidth="1" opacity="0.2" />
        <line x1="100" y1="0" x2="80" y2="120" stroke="#FFF" strokeWidth="1" opacity="0.2" />
        <line x1="150" y1="0" x2="130" y2="120" stroke="#FFF" strokeWidth="1" opacity="0.2" />
      </g>
      
      {/* 望远镜 */}
      <g transform="translate(850, 400)">
        <line x1="0" y1="50" x2="-40" y2="180" stroke="#5D4037" strokeWidth="6" />
        <line x1="0" y1="50" x2="40" y2="180" stroke="#5D4037" strokeWidth="6" />
        <line x1="0" y1="50" x2="0" y2="190" stroke="#5D4037" strokeWidth="6" />
        <ellipse cx="0" cy="30" rx="25" ry="50" fill="#37474F" />
        <ellipse cx="0" cy="-15" rx="20" ry="15" fill="#455A64" />
        <circle cx="0" cy="-15" r="18" fill="#263238" />
      </g>
      
      {/* 家长 */}
      <g transform="translate(520, 480)">
        <ellipse cx="0" cy="120" rx="50" ry="65" fill="#5D4037" />
        <path 
          d="M-30 175 Q-50 200 -60 220 Q-65 235 -50 240" 
          stroke="#4A6FE3" 
          strokeWidth="28" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M30 175 Q50 200 60 220 Q65 235 50 240" 
          stroke="#4A6FE3" 
          strokeWidth="28" 
          fill="none" 
          strokeLinecap="round"
        />
        <path d="M-50 100 Q-70 80 -60 50" stroke="#FFCCBC" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M50 100 Q80 70 100 40" stroke="#FFCCBC" strokeWidth="18" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="60" r="50" fill="#FFCCBC" />
        <path d="M-40 40 Q-45 10 -25 0 Q0 -10 25 0 Q45 10 40 40 Q25 30 0 35 Q-25 30 -40 40" fill="#3E2723" />
        <ellipse cx="-15" cy="55" rx="7" ry="9" fill="#FFF" />
        <ellipse cx="15" cy="55" rx="7" ry="9" fill="#FFF" />
        <circle cx="-15" cy="57" r="5" fill="#3B5FD9" />
        <circle cx="15" cy="57" r="5" fill="#3B5FD9" />
        <path d="M-12 80 Q0 92 12 80" stroke="#8D6E63" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      
      {/* 孩子 */}
      <g transform="translate(680, 520)">
        <ellipse cx="0" cy="100" rx="35" ry="50" fill="#FFB800" />
        <path d="M-15 145 Q-25 170 -30 190" stroke="#5D4037" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M15 145 Q25 170 35 185" stroke="#5D4037" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M35 80 Q50 70 55 90" stroke="#FFCCBC" strokeWidth="14" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="45" r="40" fill="#FFCCBC" />
        <path d="M-30 28 Q-35 10 -20 5 Q0 -2 20 5 Q35 10 30 28 Q18 20 0 22 Q-18 20 -30 28" fill="#5D4037" />
        <ellipse cx="-10" cy="42" rx="6" ry="8" fill="#FFF" />
        <ellipse cx="10" cy="42" rx="6" ry="8" fill="#FFF" />
        <circle cx="-10" cy="40" r="4" fill="#3B5FD9" />
        <circle cx="10" cy="40" r="4" fill="#3B5FD9" />
        <path d="M-8 60 Q0 70 8 60" stroke="#8D6E63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* 星图 */}
        <g transform="translate(60, 80)">
          <rect x="-25" y="-30" width="50" height="60" rx="3" fill="#FFF" stroke="#DDD" strokeWidth="1" />
          <circle cx="0" cy="-10" r="3" fill="#FFB800" />
          <circle cx="-10" cy="0" r="2.5" fill="#FFB800" />
          <circle cx="10" cy="5" r="2" fill="#FFB800" />
          <line x1="0" y1="-10" x2="-10" y2="0" stroke="#3B5FD9" strokeWidth="1" opacity="0.6" />
          <line x1="-10" y1="0" x2="10" y2="5" stroke="#3B5FD9" strokeWidth="1" opacity="0.6" />
        </g>
      </g>
      
      {/* 北斗七星 */}
      <g transform="translate(400, 200)">
        <circle cx="0" cy="0" r="4" fill="#FFF" filter="url(#glow)" />
        <circle cx="50" cy="20" r="3.5" fill="#FFF" filter="url(#glow)" />
        <circle cx="100" cy="15" r="4" fill="#FFF" filter="url(#glow)" />
        <circle cx="150" cy="30" r="3.5" fill="#FFF" filter="url(#glow)" />
        <circle cx="180" cy="70" r="4" fill="#FFF" filter="url(#glow)" />
        <circle cx="160" cy="120" r="3.5" fill="#FFF" filter="url(#glow)" />
        <circle cx="200" cy="150" r="4" fill="#FFF" filter="url(#glow)" />
        <polyline 
          points="0,0 50,20 100,15 150,30 180,70 160,120 200,150" 
          stroke="#FFB800" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.5"
        />
      </g>
      
      {/* 指示线 */}
      <path 
        d="M620 480 Q550 400 480 300 Q460 260 420 230" 
        stroke="#FFF" 
        strokeWidth="1.5" 
        fill="none" 
        strokeDasharray="8,4" 
        opacity="0.4"
      />
      
      {/* 心形装饰 */}
      <g transform="translate(600, 350)" opacity="0.15">
        <path d="M0 10 Q-15 -5 -15 -15 Q-15 -25 0 -20 Q15 -25 15 -15 Q15 -5 0 10" fill="#FFB800" />
      </g>
      
      {/* 品牌标语 */}
      <g transform="translate(60, 750)">
        <text fontSize="14" fill="#FFF" opacity="0.5" fontStyle="italic">陪伴成长 · 共同发现</text>
      </g>
      
      {/* 边框 */}
      <rect x="10" y="10" width="1180" height="780" fill="none" stroke="#FFB800" strokeWidth="2" opacity="0.15" rx="8" />
    </svg>
  );
};

export default {
  ChildThinkingIllustration,
  OutdoorDiscoveryIllustration,
  ParentChildIllustration,
};
