import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
      {/* Custom Trailing Glowing Cursor */}
      <CustomCursor />

      {/* Centered Minimalist Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        {/* Home / Hero Section: 3D Hanging Lanyard Card & Download CV on Right, No Globe, One-line HUSSEIN HASSAN */}
        <Hero />

        {/* About Section: Smaller title, Core Specializations, Compact Stats & Education */}
        <About />

        {/* Experience Section: Smaller box, neutral monochrome line, Dental Billing VA */}
        <Experience />

        {/* Skills Section: Smaller 3D cards, compact layout */}
        <Skills />

        {/* Certification Section: Compact HIPAA and NC II credentials */}
        <Certifications />

        {/* Contact Section: Compact direct cards & practice inquiry form */}
        <Contact />
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
