import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target;
      const clickable = target.closest('button, a, input, select, textarea, [role="button"]');
      setIsHovered(!!clickable);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let frameId;
    const updateTrail = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      frameId = requestAnimationFrame(updateTrail);
    };
    frameId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(frameId);
    };
  }, [pos.x, pos.y, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[100] w-2 h-2 rounded-full bg-green-400 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 shadow-[0_0_12px_#22c55e]"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      />

      {/* Trailing Luminous Halo Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[99] rounded-full border border-green-400/40 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out ${
          isHovered 
            ? 'w-12 h-12 bg-green-400/10 border-green-400 scale-125' 
            : 'w-8 h-8'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x - (isHovered ? 24 : 16)}px, ${trailingPos.y - (isHovered ? 24 : 16)}px, 0)`,
        }}
      />
    </>
  );
}
