import React, { useState, useEffect, useRef } from 'react';
import { stats, education } from '../data/portfolioData';

export default function About() {
  const fullText = `I am a hardworking, reliable, and adaptable professional with experience in customer service, hotel reservations, food service, and dental billing. I am comfortable working with customers, handling administrative tasks, managing payments and records, and working in a fast-paced environment. I am detail-oriented, easy to work with, and willing to learn new skills. I always do my best to provide good service, complete my responsibilities accurately, and contribute positively to the team.`;

  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // CRITICAL USER INSTRUCTION:
  // "all the animations must work when scrolling up or down every time. make all the animations recognizable, upgrade it and make it better."
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            // Reset state so animations re-trigger every single time scrolling up or down!
            setInView(false);
            setDisplayedText('');
            setIsTypingDone(false);
          }
        });
      },
      { threshold: 0.18 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // CRITICAL USER INSTRUCTION:
  // "make the typing animation of description in About page slower."
  useEffect(() => {
    if (!inView) {
      setDisplayedText('');
      setIsTypingDone(false);
      return;
    }

    let currentIndex = 0;
    // Slower, deliberate typewriter rhythm (1 char every 28ms)
    const intervalTime = 28;

    const timer = setInterval(() => {
      currentIndex += 1;
      if (currentIndex >= fullText.length) {
        setDisplayedText(fullText);
        setIsTypingDone(true);
        clearInterval(timer);
      } else {
        setDisplayedText(fullText.slice(0, currentIndex));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [inView, fullText]);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-black text-white overflow-hidden border-t border-white/[0.08] font-mono"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Arlen Carter Header: [01] in GREEN with subtle glow */}
        <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-14 border-b border-white/10 pb-6 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="flex items-baseline gap-3">
            <span className="text-xs text-green-400 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">[01]</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              ABOUT HUSSEIN
            </h2>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${inView ? 'bg-green-400 animate-ping' : 'bg-gray-600'}`} />
            PROFILE & ACADEMICS
          </span>
        </div>

        {/* Bio Text From Resume - Slower Typing Animation & Smaller Font */}
        <div className="mb-16 max-w-4xl min-h-[110px] sm:min-h-[85px]">
          <p className="text-xs sm:text-[13px] md:text-sm text-gray-300 leading-relaxed font-normal">
            "{displayedText}"
            {!isTypingDone && inView && (
              <span className="inline-block w-2 h-4 ml-1 bg-green-400 animate-pulse align-middle shadow-[0_0_8px_#22c55e]" />
            )}
          </p>
        </div>

        {/* Key Metrics & Education Rows - Upgraded Recognizable Fade Up Animation */}
        <div 
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 transition-all duration-700 ease-out ${
            inView 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-12 scale-[0.98] pointer-events-none'
          }`}
        >
          
          {/* Left: Practice Metrics (Solid White Numbers like 4+, Green Accents) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-widest pb-2 border-b border-white/10 flex items-center justify-between">
              <span>PRACTICE METRICS</span>
              <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                VERIFIED
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className={`py-4 flex items-baseline justify-between group hover:bg-white/[0.02] px-2 rounded transition-all duration-500 delay-[${idx * 100}ms]`}
                >
                  <div>
                    <span className="text-xs text-green-400 mr-2 font-bold">0{idx + 1} /</span>
                    <span className="text-xs font-semibold text-white tracking-wide uppercase">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    {/* CRITICAL: Text numbers (4+, 98.5%, etc.) must be solid WHITE */}
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
                      {stat.value}
                    </span>
                    <span className="block text-[10px] text-gray-500 font-normal">{stat.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Academic Background */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-widest pb-2 border-b border-white/10 flex items-center justify-between">
              <span>ACADEMIC BACKGROUND</span>
              <span className="text-[10px] text-green-400 font-semibold">EDUCATION</span>
            </div>
            <div className="divide-y divide-white/10">
              {education.map((edu, idx) => (
                <div key={idx} className="py-4 space-y-1.5 group hover:bg-white/[0.02] px-2 rounded transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase">{edu.institution}</span>
                    <span className="text-[10px] text-green-400/90 font-medium">{edu.period}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {edu.degree} — {edu.field}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
