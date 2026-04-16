import React from 'react';

interface HeroIllustrationProps {
  className?: string;
  size?: number | string;
}

/**
 * Hero 主插图 - 儿童在自然中探索发现的场景
 * 博物学手绘质感，品牌蓝 #3B5FD9 + 暖黄 #FFB800 配色
 */
export const HeroIllustration: React.FC<HeroIllustrationProps> = ({ 
  className = '', 
  size = '100%' 
}) => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heroSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8F4FC" />
          <stop offset="50%" stopColor="#F5F9FC" />
          <stop offset="100%" stopColor="#FEFEF8" />
        </linearGradient>
        <linearGradient id="heroBrandBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A6FE3" />
          <stop offset="100%" stopColor="#3B5FD9" />
        </linearGradient>
        <linearGradient id="heroWarmYellow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFB800" />
        </linearGradient>
        <linearGradient id="heroTreeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B8E23" />
          <stop offset="100%" stopColor="#4A7023" />
        </linearGradient>
      </defs>
      
      {/* 背景 */}
      <rect width="1920" height="1080" fill="url(#heroSkyGradient)" />
      
      {/* 远山 */}
      <path 
        d="M0 600 Q200 450 400 520 Q600 480 800 450 Q1000 400 1200 480 Q1400 420 1600 500 Q1800 460 1920 520 L1920 1080 L0 1080 Z" 
        fill="#C5E1A5" 
        opacity="0.4"
      />
      <path 
        d="M0 700 Q300 550 600 620 Q900 580 1200 650 Q1500 600 1920 680 L1920 1080 L0 1080 Z" 
        fill="#8BC34A" 
        opacity="0.3"
      />
      
      {/* 草地 */}
      <ellipse cx="960" cy="950" rx="1100" ry="200" fill="#8BC34A" opacity="0.6" />
      <ellipse cx="960" cy="980" rx="1050" ry="150" fill="#7CB342" opacity="0.7" />
      
      {/* 大树 - 左侧 */}
      <g transform="translate(200, 300)">
        <path 
          d="M80 400 Q70 300 90 200 Q95 150 80 100 L120 100 Q105 150 110 200 Q130 300 120 400 Z" 
          fill="#8D6E63" 
          stroke="#5D4037" 
          strokeWidth="2"
        />
        <ellipse cx="100" cy="80" rx="120" ry="100" fill="url(#heroTreeGradient)" />
        <ellipse cx="60" cy="100" rx="60" ry="50" fill="#7CB342" />
        <ellipse cx="140" cy="90" rx="70" ry="60" fill="#8BC34A" />
      </g>
      
      {/* 大树 - 右侧 */}
      <g transform="translate(1600, 350)">
        <path 
          d="M80 350 Q70 250 90 150 L120 150 Q100 250 120 350 Z" 
          fill="#8D6E63" 
          stroke="#5D4037" 
          strokeWidth="2"
        />
        <ellipse cx="100" cy="80" rx="100" ry="90" fill="url(#heroTreeGradient)" />
        <ellipse cx="60" cy="90" rx="50" ry="45" fill="#7CB342" />
        <ellipse cx="140" cy="85" rx="55" ry="50" fill="#8BC34A" />
      </g>
      
      {/* 蝴蝶 - 主角上方 */}
      <g transform="translate(950, 280)">
        <path 
          d="M0 0 Q-40 -30 -50 10 Q-40 40 0 20 Q-10 10 0 0" 
          fill="url(#heroBrandBlue)" 
          stroke="#3B5FD9" 
          strokeWidth="1.5" 
          opacity="0.9"
        />
        <path 
          d="M0 0 Q40 -30 50 10 Q40 40 0 20 Q10 10 0 0" 
          fill="url(#heroBrandBlue)" 
          stroke="#3B5FD9" 
          strokeWidth="1.5" 
          opacity="0.9"
        />
        <circle cx="-25" cy="5" r="8" fill="#FFB800" opacity="0.7" />
        <circle cx="25" cy="5" r="8" fill="#FFB800" opacity="0.7" />
        <ellipse cx="0" cy="15" rx="4" ry="20" fill="#2D3A4A" />
        <path d="M-2 -5 Q-10 -20 -8 -25" stroke="#2D3A4A" strokeWidth="1.5" fill="none" />
        <path d="M2 -5 Q10 -20 8 -25" stroke="#2D3A4A" strokeWidth="1.5" fill="none" />
      </g>
      
      {/* 孩子 - 主角 */}
      <g transform="translate(850, 550)">
        {/* 身体 */}
        <ellipse cx="0" cy="200" rx="45" ry="60" fill="url(#heroBrandBlue)" />
        {/* 腿 */}
        <path d="M-20 250 Q-30 300 -25 350 L-5 350 L0 280" fill="#4A6FE3" />
        <path d="M20 250 Q30 300 25 350 L5 350 L0 280" fill="#4A6FE3" />
        <ellipse cx="-15" cy="355" rx="18" ry="10" fill="#5D4037" />
        <ellipse cx="15" cy="355" rx="18" ry="10" fill="#5D4037" />
        {/* 手臂 */}
        <path 
          d="M-45 180 Q-80 160 -100 140" 
          stroke="#FFCCBC" 
          strokeWidth="16" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M45 180 Q60 150 80 130" 
          stroke="#FFCCBC" 
          strokeWidth="16" 
          fill="none" 
          strokeLinecap="round"
        />
        {/* 头部 */}
        <circle cx="0" cy="120" r="55" fill="#FFCCBC" />
        {/* 头发 */}
        <path 
          d="M-45 100 Q-50 70 -30 60 Q0 50 30 60 Q50 70 45 100 Q30 85 0 90 Q-30 85 -45 100" 
          fill="#5D4037"
        />
        {/* 眼睛 */}
        <ellipse cx="-18" cy="115" rx="8" ry="10" fill="#FFF" />
        <ellipse cx="18" cy="115" rx="8" ry="10" fill="#FFF" />
        <circle cx="-18" cy="117" r="5" fill="#3B5FD9" />
        <circle cx="18" cy="117" r="5" fill="#3B5FD9" />
        <circle cx="-16" cy="115" r="2" fill="#FFF" />
        <circle cx="20" cy="115" r="2" fill="#FFF" />
        {/* 微笑 */}
        <path 
          d="M-12 140 Q0 155 12 140" 
          stroke="#8D6E63" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
        />
        {/* 腮红 */}
        <ellipse cx="-35" cy="130" rx="10" ry="6" fill="#FFAB91" opacity="0.5" />
        <ellipse cx="35" cy="130" rx="10" ry="6" fill="#FFAB91" opacity="0.5" />
      </g>
      
      {/* 放大镜 - 孩子手中 */}
      <g transform="translate(720, 680)">
        <rect x="60" y="60" width="50" height="14" rx="7" fill="#8D6E63" transform="rotate(45, 60, 67)" />
        <circle cx="35" cy="35" r="50" fill="none" stroke="#5D4037" strokeWidth="10" />
        <circle cx="35" cy="35" r="42" fill="#E3F2FD" opacity="0.6" />
        <ellipse cx="20" cy="25" rx="15" ry="8" fill="#FFF" opacity="0.7" />
      </g>
      
      {/* 小鸟 */}
      <g transform="translate(1300, 200)">
        <ellipse cx="0" cy="0" rx="25" ry="15" fill="url(#heroWarmYellow)" />
        <circle cx="20" cy="-5" r="12" fill="#FFD54F" />
        <polygon points="32,-5 42,-3 32,0" fill="#FF8F00" />
        <circle cx="25" cy="-7" r="3" fill="#2D3A4A" />
      </g>
      
      <g transform="translate(400, 300)">
        <ellipse cx="0" cy="0" rx="20" ry="12" fill="url(#heroBrandBlue)" />
        <circle cx="15" cy="-3" r="10" fill="#4A6FE3" />
        <polygon points="25,-3 33,-1 25,1" fill="url(#heroWarmYellow)" />
        <circle cx="19" cy="-5" r="2.5" fill="#2D3A4A" />
      </g>
      
      {/* 花朵装饰 */}
      <g fill="url(#heroWarmYellow)">
        <circle cx="500" cy="880" r="8" />
        <circle cx="520" cy="870" r="6" />
        <circle cx="480" cy="875" r="5" />
      </g>
      
      {/* 光斑效果 */}
      <circle cx="200" cy="200" r="80" fill="#FFB800" opacity="0.08" />
      <circle cx="1700" cy="150" r="60" fill="#FFB800" opacity="0.06" />
      <circle cx="1000" cy="100" r="100" fill="#FFF" opacity="0.1" />
      
      {/* 品牌装饰带 */}
      <rect x="0" y="1020" width="1920" height="60" fill="url(#heroBrandBlue)" opacity="0.1" />
    </svg>
  );
};

export default HeroIllustration;
