import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  as: Component = 'span', 
  className = '', 
  intensity = 'medium' 
}) => {
  return (
    <Component className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 -ml-[2px] text-red-600 opacity-0 group-hover:opacity-70 animate-pulse"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px)' }}
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 ml-[2px] text-cyan-600 opacity-0 group-hover:opacity-70 animate-pulse"
        style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)', transform: 'translate(2px)' }}
      >
        {text}
      </span>
    </Component>
  );
};