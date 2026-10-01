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
          // Re-triggers every time user scrolls up or down!
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
      className="relative py-24 sm:py-32 bg-black text-white overflow-hidden border-t border-white/[0.08] font-mono"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Arlen Carter Header: [02] in GREEN */}
        <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-14 border-b border-white/10 pb-6 transition-all duration-700 ${
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

        {/* Experience Card with Smooth Fade-In Animation (Re-triggers every scroll) */}
        <div 
          className={`border border-white/10 p-8 sm:p-12 bg-white/[0.01] hover:bg-white/[0.02] rounded transition-all duration-800 ease-out ${
            inView 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-[0.96] translate-y-10 pointer-events-none'
          }`}
        >
          
          {/* Top Line Meta */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-8 border-b border-white/10">
            <div>
              <span className="text-xs text-green-400 font-bold block mb-1">
                01 / PRIMARY EXPERIENCE
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                {currentExp.role}
              </h3>
              <p className="text-sm text-gray-400 mt-1 uppercase">
                {currentExp.company} • {currentExp.location}
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-sm font-bold text-green-400 block drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                {currentExp.period}
              </span>
              <span className="text-xs text-gray-500 uppercase">
                {currentExp.duration} • Full-Time
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="py-8 space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">
              KEY RESPONSIBILITIES & ACCOMPLISHMENTS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentExp.highlights.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3 text-xs sm:text-sm text-gray-300 leading-relaxed font-normal transition-all duration-500 ${
                    inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  <span className="text-green-400 font-bold shrink-0 mt-0.5">→</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Competency Tags */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
            {currentExp.skillsUsed.map((skill, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded text-xs bg-white/[0.03] border border-white/10 hover:border-green-500/50 text-gray-300 hover:text-green-300 uppercase tracking-wider transition-colors"
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
