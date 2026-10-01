import React, { useState, useEffect, useRef } from 'react';
import { experience } from '../data/portfolioData';

export default function Experience() {
  const currentExp = experience[0];
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // CRITICAL USER INSTRUCTION:
  // "all the animations must work when scrolling up or down every time. make all the animations recognizable, upgrade it and make it better."
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="experience" 
      ref={sectionRef}
      className="relative py-20 sm:py-28 bg-black text-white overflow-hidden border-t border-white/[0.08] font-mono"
    >
      {/* Smaller, compact editorial container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Arlen Carter Header: [02] in GREEN */}
        <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10 border-b border-white/10 pb-5 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="flex items-baseline gap-3">
            <span className="text-xs text-green-400 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">[02]</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              DENTAL BILLING EXPERIENCE
            </h2>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${inView ? 'bg-green-400 animate-ping' : 'bg-gray-600'}`} />
            CAREER TIMELINE
          </span>
        </div>

        {/* Smaller, Compact Experience Box with Smooth Fade-In Animation */}
        <div 
          className={`border border-white/10 p-5 sm:p-7 bg-white/[0.01] hover:bg-white/[0.02] rounded-lg transition-all duration-800 ease-out ${
            inView 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-[0.96] translate-y-8 pointer-events-none'
          }`}
        >
          
          {/* Top Line Meta */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] text-green-400 font-bold block mb-0.5">
                01 / PRIMARY EXPERIENCE
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight uppercase">
                {currentExp.role}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 uppercase">
                {currentExp.company} • {currentExp.location}
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs sm:text-sm font-bold text-green-400 block drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                {currentExp.period}
              </span>
              <span className="text-[11px] text-gray-500 uppercase">
                {currentExp.duration} • Full-Time
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="py-4 space-y-2.5">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">
              KEY RESPONSIBILITIES & ACCOMPLISHMENTS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentExp.highlights.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 text-xs sm:text-[13px] text-gray-300 leading-relaxed font-normal transition-all duration-500 ${
                    inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                  }`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <span className="text-green-400 font-bold shrink-0 mt-0.5">→</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Competency Tags */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
            {currentExp.skillsUsed.map((skill, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-0.5 rounded text-[11px] bg-white/[0.03] border border-white/10 hover:border-green-500/50 text-gray-300 hover:text-green-300 uppercase tracking-wider transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
