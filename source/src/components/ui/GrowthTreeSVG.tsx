import React, { useState, useEffect } from 'react';

interface GrowthTreeSVGProps {
  className?: string;
  size?: number | string;
  animate?: boolean;
}

/**
 * WILDER 六维成长树 SVG 组件
 * 支持分支依次展开动画效果
 */
export const GrowthTreeSVG: React.FC<GrowthTreeSVGProps> = ({ 
  className = '', 
  size = '100%',
  animate = true
}) => {
  const [activeBranch, setActiveBranch] = useState(animate ? -1 : 5);
  
  useEffect(() => {
    if (!animate) return;
    
    // 依次激活每个分支
    const timer = setInterval(() => {
      setActiveBranch(prev => {
        if (prev >= 5) return 0;
        return prev + 1;
      });
    }, 800);
    
    return () => clearInterval(timer);
  }, [animate]);
  
  return (
    <svg
      viewBox="0 0 1200 900"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="treeBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5F9FC" />
          <stop offset="100%" stopColor="#E8F4FC" />
        </linearGradient>
        
        <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="30%" stopColor="#8D6E63" />
          <stop offset="70%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#5D4037" />
        </linearGradient>
        
        <linearGradient id="rootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
        
        <linearGradient id="wonderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        
        <linearGradient id="inquiryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B5FD9" />
          <stop offset="100%" stopColor="#1A237E" />
        </linearGradient>
        
        <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8BC34A" />
          <stop offset="100%" stopColor="#558B2F" />
        </linearGradient>
        
        <linearGradient id="designGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#AD1457" />
        </linearGradient>
        
        <linearGradient id="expressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9C27B0" />
          <stop offset="100%" stopColor="#6A1B9A" />
        </linearGradient>
        
        <linearGradient id="reflectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00BCD4" />
          <stop offset="100%" stopColor="#00838F" />
        </linearGradient>
        
        <linearGradient id="brandBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A6FE3" />
          <stop offset="100%" stopColor="#3B5FD9" />
        </linearGradient>
      </defs>
      
      {/* 背景 */}
      <rect width="1200" height="900" fill="url(#treeBg)" />
      
      {/* 装饰圆圈 */}
      <circle cx="600" cy="400" r="350" fill="none" stroke="#3B5FD9" strokeWidth="1" opacity="0.08" />
      <circle cx="600" cy="400" r="300" fill="none" stroke="#3B5FD9" strokeWidth="1" opacity="0.06" />
      
      {/* 树根 - 科学评估基础 */}
      <g transform="translate(600, 750)">
        <path d="M-30 -30 Q-80 30 -120 80" stroke="url(#rootGradient)" strokeWidth="25" fill="none" strokeLinecap="round" />
        <path d="M30 -30 Q80 30 120 80" stroke="url(#rootGradient)" strokeWidth="25" fill="none" strokeLinecap="round" />
        <path d="M-10 -25 Q-30 40 -50 90" stroke="url(#rootGradient)" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M10 -25 Q30 40 50 90" stroke="url(#rootGradient)" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M0 -20 Q0 50 0 100" stroke="url(#rootGradient)" strokeWidth="15" fill="none" strokeLinecap="round" />
        <rect x="-80" y="95" width="160" height="35" rx="8" fill="url(#brandBlue)" opacity="0.9" />
        <text x="0" y="118" fontSize="14" fill="#FFF" textAnchor="middle" fontWeight="bold">科学评估基础</text>
      </g>
      
      {/* 树干 */}
      <g transform="translate(600, 600)">
        <path d="M-35 -200 Q-45 -100 -30 100 Q-20 150 0 180 Q20 150 30 100 Q45 -100 35 -200 Z" fill="url(#trunkGradient)" />
      </g>
      
      {/* 主树冠 */}
      <g transform="translate(600, 350)">
        <ellipse cx="0" cy="0" rx="180" ry="150" fill="#7CB342" />
        <ellipse cx="-60" cy="30" rx="80" ry="70" fill="#8BC34A" />
        <ellipse cx="60" cy="20" rx="90" ry="75" fill="#9CCC65" />
        <ellipse cx="0" cy="-40" rx="100" ry="80" fill="#AED581" />
      </g>
      
      {/* W - Wonder 好奇心 */}
      <g transform="translate(600, 140)" style={{ opacity: animate ? (activeBranch >= 0 ? 1 : 0.3) : 1, transition: 'opacity 0.5s ease' }}>
        <ellipse cx="0" cy="0" rx="70" ry="55" fill="#C5E1A5" />
        <ellipse cx="-30" cy="20" rx="40" ry="35" fill="#AED581" />
        <g transform="translate(-35, -20)">
          <rect x="0" y="0" width="30" height="18" rx="4" fill="url(#wonderGrad)" />
          <circle cx="8" cy="9" r="6" fill="#FFF" opacity="0.7" />
          <circle cx="22" cy="9" r="6" fill="#FFF" opacity="0.7" />
        </g>
        <rect x="-50" y="50" width="100" height="40" rx="10" fill="url(#wonderGrad)" />
        <text x="0" y="68" fontSize="16" fill="#FFF" textAnchor="middle" fontWeight="bold">W 好奇心</text>
        <text x="0" y="82" fontSize="10" fill="#FFF" textAnchor="middle" opacity="0.8">Wonder</text>
      </g>
      
      {/* I - Inquiry 探究力 */}
      <g transform="translate(820, 220)" style={{ opacity: animate ? (activeBranch >= 1 ? 1 : 0.3) : 1, transition: 'opacity 0.5s ease' }}>
        <ellipse cx="0" cy="0" rx="65" ry="55" fill="#8BC34A" />
        <g transform="translate(-25, -25)">
          <rect x="0" y="0" width="16" height="35" rx="8" fill="none" stroke="url(#inquiryGrad)" strokeWidth="3" />
        </g>
        <rect x="-50" y="50" width="100" height="40" rx="10" fill="url(#inquiryGrad)" />
        <text x="0" y="68" fontSize="16" fill="#FFF" textAnchor="middle" fontWeight="bold">I 探究力</text>
        <text x="0" y="82" fontSize="10" fill="#FFF" textAnchor="middle" opacity="0.8">Inquiry</text>
      </g>
      
      {/* L - Link 连接力 */}
      <g transform="translate(900, 380)" style={{ opacity: animate ? (activeBranch >= 2 ? 1 : 0.3) : 1, transition: 'opacity 0.5s ease' }}>
        <ellipse cx="0" cy="0" rx="60" ry="50" fill="#9CCC65" />
        <g transform="translate(-20, -20)">
          <circle cx="0" cy="0" r="8" fill="url(#linkGrad)" />
          <circle cx="35" cy="-5" r="6" fill="url(#linkGrad)" />
          <line x1="8" y1="0" x2="29" y2="-5" stroke="url(#linkGrad)" strokeWidth="2" />
        </g>
        <rect x="-50" y="45" width="100" height="40" rx="10" fill="url(#linkGrad)" />
        <text x="0" y="63" fontSize="16" fill="#FFF" textAnchor="middle" fontWeight="bold">L 连接力</text>
        <text x="0" y="77" fontSize="10" fill="#FFF" textAnchor="middle" opacity="0.8">Link</text>
      </g>
      
      {/* D - Design 设计力 */}
      <g transform="translate(780, 520)" style={{ opacity: animate ? (activeBranch >= 3 ? 1 : 0.3) : 1, transition: 'opacity 0.5s ease' }}>
        <ellipse cx="0" cy="0" rx="55" ry="48" fill="#AED581" />
        <g transform="translate(-15, -20)">
          <path d="M0 35 L0 10 Q0 0 10 0 Q20 0 20 10 L20 35 Z" fill="url(#designGrad)" opacity="0.8" />
        </g>
        <rect x="-50" y="45" width="100" height="40" rx="10" fill="url(#designGrad)" />
        <text x="0" y="63" fontSize="16" fill="#FFF" textAnchor="middle" fontWeight="bold">D 设计力</text>
        <text x="0" y="77" fontSize="10" fill="#FFF" textAnchor="middle" opacity="0.8">Design</text>
      </g>
      
      {/* E - Expression 表达力 */}
      <g transform="translate(420, 520)" style={{ opacity: animate ? (activeBranch >= 4 ? 1 : 0.3) : 1, transition: 'opacity 0.5s ease' }}>
        <ellipse cx="0" cy="0" rx="55" ry="48" fill="#AED581" />
        <g transform="translate(-20, -15)">
          <circle cx="0" cy="25" r="8" fill="url(#expressGrad)" />
          <rect x="6" y="-5" width="4" height="32" fill="url(#expressGrad)" />
        </g>
        <rect x="-50" y="45" width="100" height="40" rx="10" fill="url(#expressGrad)" />
        <text x="0" y="63" fontSize="16" fill="#FFF" textAnchor="middle" fontWeight="bold">E 表达力</text>
        <text x="0" y="77" fontSize="10" fill="#FFF" textAnchor="middle" opacity="0.8">Expression</text>
      </g>
      
      {/* R - Reflection 反思力 */}
      <g transform="translate(300, 380)" style={{ opacity: animate ? (activeBranch >= 5 ? 1 : 0.3) : 1, transition: 'opacity 0.5s ease' }}>
        <ellipse cx="0" cy="0" rx="60" ry="50" fill="#9CCC65" />
        <g transform="translate(-20, -15)">
          <ellipse cx="12" cy="12" rx="15" ry="20" fill="none" stroke="url(#reflectGrad)" strokeWidth="4" />
        </g>
        <rect x="-50" y="45" width="100" height="40" rx="10" fill="url(#reflectGrad)" />
        <text x="0" y="63" fontSize="16" fill="#FFF" textAnchor="middle" fontWeight="bold">R 反思力</text>
        <text x="0" y="77" fontSize="10" fill="#FFF" textAnchor="middle" opacity="0.8">Reflection</text>
      </g>
      
      {/* 标题 */}
      <g transform="translate(600, 50)">
        <text x="0" y="0" fontSize="28" fill="#3B5FD9" textAnchor="middle" fontWeight="bold">WILDER 六维成长树</text>
        <text x="0" y="25" fontSize="14" fill="#666" textAnchor="middle">WILDER Growth Model</text>
      </g>
      
      {/* 底部说明 */}
      <g transform="translate(600, 880)">
        <text x="0" y="0" fontSize="11" fill="#999" textAnchor="middle">WILDER · 荒野科学潜能评估体系</text>
      </g>
    </svg>
  );
};

export default GrowthTreeSVG;
