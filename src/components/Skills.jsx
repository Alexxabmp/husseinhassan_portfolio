import React, { useState, useEffect, useRef } from 'react';
import { dentalSkills } from '../data/portfolioData';

function Skill3DBox({ skill, index, inView }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: inView 
          ? `perspective(700px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
              isHovered ? 'translateZ(12px) scale(1.02)' : 'translateZ(0px) scale(1)'
            }`
          : 'perspective(700px) rotateX(15deg) translateY(24px) scale(0.92)',
        transition: isHovered 
          ? 'transform 0.1s ease-out' 
          : `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease`,
        transitionDelay: isHovered ? '0ms' : `${index * 50}ms`,
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-lg p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 bg-black border ${
        inView ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${
        isHovered 
          ? 'border-green-500/70 shadow-[0_10px_25px_rgba(34,197,94,0.2)]' 
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top Number & Category */}
      <div>
        <div className="flex items-center justify-between text-[10px] mb-2">
          <span className="text-green-400 font-bold font-mono drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
            (0{index + 1})
          </span>
          <span className="text-gray-500 uppercase tracking-wider text-[9px]">
            {skill.category}
          </span>
        </div>

        {/* Full Skill Title - Whole title displayed, no truncation */}
        <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-tight uppercase leading-snug mb-3 group-hover:text-green-400 transition-colors">
          {skill.title}
        </h3>
      </div>

      {/* Bottom Mastery & Tags */}
      <div className="pt-2 border-t border-white/10">
        {/* Proficiency bar */}
        <div className="flex items-center justify-between text-[9.5px] mb-1 font-mono">
          <span className="text-gray-400">Mastery</span>
          <span className="text-green-400 font-bold">{skill.proficiency}%</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_#22c55e]"
            style={{ 
              width: inView ? `${skill.proficiency}%` : '0%',
              transitionDelay: `${index * 60 + 150}ms`
            }}
          />
        </div>

        {/* Compact Tags */}
        <div className="flex flex-wrap gap-1">
          {skill.tags.slice(0, 3).map((tag, tIdx) => (
            <span 
              key={tIdx}
              className="text-[8.5px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-300 border border-white/5 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-black text-white overflow-hidden border-t border-white/[0.08] font-mono"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Arlen Carter Header: [03] in GREEN - matched width and spacing to About & Contact */}
        <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-14 border-b border-white/10 pb-6 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="flex items-baseline gap-3">
            <span className="text-xs text-green-400 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">[03]</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              DENTAL BILLING SKILLS
            </h2>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${inView ? 'bg-green-400 animate-ping' : 'bg-gray-600'}`} />
            3D SPECIALIZATION TILES
          </span>
        </div>

        {/* Smaller 3D Boxes Grid (8 Tiles) with Staggered Cascading Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {dentalSkills.map((skill, idx) => (
            <Skill3DBox key={idx} skill={skill} index={idx} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
}
