import React, { useState, useEffect, useRef } from 'react';
import { certifications } from '../data/portfolioData';

export default function Certifications() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // CRITICAL USER INSTRUCTION:
  // "the certification open or out animation must be fade up or fade down."
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
      id="certification" 
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-black text-white overflow-hidden border-t border-white/[0.08] font-mono"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Arlen Carter Header: [04] in GREEN */}
        <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-14 border-b border-white/10 pb-6 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="flex items-baseline gap-3">
            <span className="text-xs text-green-400 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">[04]</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              CERTIFICATIONS
            </h2>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${inView ? 'bg-green-400 animate-ping' : 'bg-gray-600'}`} />
            OFFICIAL CREDENTIALS
          </span>
        </div>

        {/* Editorial Rows with Recognizable Cascading Fade Up / Fade Down Animation */}
        <div className="divide-y divide-white/10 border-t border-b border-white/10">
          {certifications.map((cert, idx) => (
            <div 
              key={idx}
              className={`py-7 sm:py-9 px-3 sm:px-5 group hover:bg-white/[0.02] transition-all duration-700 ease-out flex flex-col md:flex-row md:items-baseline justify-between gap-5 ${
                inView 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-16 scale-[0.97] pointer-events-none'
              }`}
              style={{ transitionDelay: `${idx * 140}ms` }}
            >
              {/* Left: Number & Title */}
              <div className="md:w-1/2 flex items-baseline gap-4">
                <span className="text-xs text-green-400 font-bold">
                  (0{idx + 1})
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-green-300 transition-colors uppercase tracking-tight">
                    {cert.title}
                  </h3>
                  <span className="text-[11px] text-gray-500 uppercase block mt-1.5 flex items-center gap-2">
                    <span>{cert.issuer}</span>
                    <span className="text-gray-700">•</span>
                    <span className="text-green-400 font-semibold">{cert.status}</span>
                  </span>
                </div>
              </div>

              {/* Right: Description & Skills */}
              <div className="md:w-1/2 space-y-2.5">
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">
                  {cert.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skillsCovered.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-[10px] px-2.5 py-0.5 rounded bg-white/[0.03] text-gray-300 border border-white/5 uppercase group-hover:border-green-500/20 transition-colors"
                    >
                      <span className="text-green-400 mr-1 font-bold">✓</span> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
