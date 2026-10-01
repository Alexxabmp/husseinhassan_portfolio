import React from 'react';
import HeroRays3D from './HeroRays3D';
import LanyardCard3D from './LanyardCard3D';

export default function Hero() {
  return (
    <section 
      id="hero" 
      className="relative h-screen max-h-screen w-full bg-black text-white overflow-hidden select-none"
    >
      {/* Dynamic 3D WebGL Colored Rays - Arlen Carter Style */}
      <HeroRays3D />

      {/* Full-Screen 3D Interactive Canvas: Lanyard hangs from top edge of screen, draggable across entire home page */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <LanyardCard3D className="w-full h-full" />
      </div>

      {/* Bottom Name: HUSSEIN HASSAN - Stretched Exactly End-to-End of Screen (No green background/glow) */}
      <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-20 overflow-hidden leading-none pb-0">
        <svg 
          viewBox="0 0 1000 120" 
          preserveAspectRatio="none" 
          className="w-full h-[12vh] sm:h-[16vh] md:h-[20vh] block select-none"
        >
          <text
            x="0"
            y="104"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="fill-white uppercase"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: '124px',
              letterSpacing: '-0.02em',
              textShadow: '0 10px 40px rgba(0,0,0,0.95)'
            }}
          >
            HUSSEIN HASSAN
          </text>
        </svg>
      </div>
    </section>
  );
}
