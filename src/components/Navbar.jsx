import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'CERTIFICATION', href: '#certification' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'experience', 'skills', 'certification', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-mono ${
        scrolled 
          ? 'py-3.5 bg-black/85 backdrop-blur-xl border-b border-white/[0.08]' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-end relative">
        
        {/* Desktop Nav Links + White CONTACT Button */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                className={`text-xs tracking-[0.16em] uppercase font-semibold transition-all duration-200 relative py-1 ${
                  isActive 
                    ? 'text-green-400 font-bold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            );
          })}

          {/* CRITICAL USER INSTRUCTION: Change Contact button's background to white and font color to black */}
          <a
            href="#contact"
            className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-gray-200 rounded transition-all duration-200 shadow-md hover:scale-105 active:scale-95 ml-2"
          >
            CONTACT
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black bg-white rounded"
          >
            CONTACT
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 transition-all text-center">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold tracking-widest uppercase text-gray-300 hover:text-green-400 py-2 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 rounded transition-colors"
            >
              CONTACT
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
