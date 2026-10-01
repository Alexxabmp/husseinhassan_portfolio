import React, { useState, useEffect, useRef } from 'react';
import { Send, Check, Copy, Loader2 } from 'lucide-react';
import { personalData } from '../data/portfolioData';

export default function Contact() {
  const [copiedItem, setCopiedItem] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    practice: '',
    pms: 'Dentrix',
    message: ''
  });
  const [mailUrls, setMailUrls] = useState({ gmailUrl: '', mailtoUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  // Option 1: 1-Click "Open in Gmail Web" (100% Reliable, Zero Setup, Opens directly to Hussein)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = `Dental Billing Inquiry from ${formState.name} (${formState.practice})`;
    const body = `Dear Hussein,\n\nMy name is ${formState.name} from ${formState.practice}.\nPrimary PMS Software: ${formState.pms}\nPractice Email: ${formState.email}\n\nPractice Requirements / Inquiry:\n${formState.message}\n\nLooking forward to your response.\n\nBest regards,\n${formState.name}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalData.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(personalData.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setMailUrls({ gmailUrl, mailtoUrl });

    // Open Gmail directly in new window / tab
    window.open(gmailUrl, '_blank');

    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-black text-white overflow-hidden border-t border-white/[0.08] font-mono"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Arlen Carter Header: [05] in GREEN */}
        <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-14 border-b border-white/10 pb-6 transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="flex items-baseline gap-3">
            <span className="text-xs text-green-400 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">[05]</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              GET IN TOUCH
            </h2>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${inView ? 'bg-green-400 animate-ping' : 'bg-gray-600'}`} />
            DIRECT INQUIRIES
          </span>
        </div>

        {/* Minimalist Split Layout with Repeatable Scroll Entrance */}
        <div 
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-start transition-all duration-800 ease-out ${
            inView 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-12 scale-[0.97] pointer-events-none'
          }`}
        >
          
          {/* Left Column: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              AVAILABLE FOR US DENTAL PRACTICES
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              Direct communication for full-time or part-time dental billing virtual assistance, claims backlog cleanup, and aging A/R recovery.
            </p>

            <div className="divide-y divide-white/10 pt-2 border-t border-b border-white/10">
              {/* Email */}
              <div className="py-4 flex items-center justify-between group">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">EMAIL</span>
                  <a href={`mailto:${personalData.email}`} className="text-xs sm:text-sm font-bold text-white hover:text-green-400 transition-colors">
                    {personalData.email}
                  </a>
                </div>
                <button
                  onClick={() => handleCopy(personalData.email, 'email')}
                  className="p-1.5 rounded bg-white/[0.04] hover:bg-green-500/20 text-gray-400 hover:text-green-400 border border-white/10 transition-colors"
                  title="Copy Email"
                >
                  {copiedItem === 'email' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Phone */}
              <div className="py-4 flex items-center justify-between group">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">PHONE</span>
                  <a href={`tel:${personalData.phone}`} className="text-xs sm:text-sm font-bold text-white hover:text-green-400 transition-colors">
                    {personalData.formattedPhone}
                  </a>
                </div>
                <button
                  onClick={() => handleCopy(personalData.phone, 'phone')}
                  className="p-1.5 rounded bg-white/[0.04] hover:bg-green-500/20 text-gray-400 hover:text-green-400 border border-white/10 transition-colors"
                  title="Copy Phone"
                >
                  {copiedItem === 'phone' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Facebook */}
              <div className="py-4 flex items-center justify-between group">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">FACEBOOK</span>
                  <a 
                    href={personalData.facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs sm:text-sm font-bold text-white hover:text-green-400 transition-colors"
                  >
                    facebook.com/share/1EyUfsQU1q ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Minimalist Direct Gmail Submission Form */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 p-6 sm:p-8 bg-white/[0.01] rounded hover:border-green-500/30 transition-colors">
              <div className="mb-6 pb-3 border-b border-white/10 flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase">SEND DIRECT MESSAGE</span>
                <span className="text-[10px] text-green-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  STATUS: OPEN
                </span>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <Check size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-tight">GMAIL DRAFT OPENED</h4>
                    <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                      A new tab has opened in <span className="text-white font-semibold">Gmail</span> pre-filled with your message to <span className="text-green-400 font-semibold">{personalData.email}</span>. Simply click <span className="text-white font-bold">"Send"</span>!
                    </p>
                  </div>

                  {/* Fallback Direct Action Links */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto">
                    <a
                      href={mailUrls.gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 rounded bg-white text-black font-bold uppercase text-[11px] tracking-wider hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Send size={12} />
                      <span>Open in Gmail Web</span>
                    </a>
                    <a
                      href={mailUrls.mailtoUrl}
                      className="w-full sm:w-auto px-4 py-2.5 rounded bg-white/[0.05] border border-white/10 hover:border-white/25 text-white font-bold uppercase text-[11px] tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Default Mail App</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: '', email: '', practice: '', pms: 'Dentrix', message: '' });
                    }}
                    className="text-xs text-green-400 hover:underline pt-2 uppercase block mx-auto font-bold"
                  >
                    ← Write Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1.5">
                        DOCTOR / PRACTICE NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Dr. John Smith"
                        className="w-full px-3.5 py-2.5 rounded bg-white/[0.03] border border-white/10 focus:border-green-400 text-white text-xs outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1.5">
                        PRACTICE EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="doctor@clinic.com"
                        className="w-full px-3.5 py-2.5 rounded bg-white/[0.03] border border-white/10 focus:border-green-400 text-white text-xs outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1.5">
                        CLINIC LOCATION
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.practice}
                        onChange={(e) => setFormState({ ...formState, practice: e.target.value })}
                        placeholder="California, USA"
                        className="w-full px-3.5 py-2.5 rounded bg-white/[0.03] border border-white/10 focus:border-green-400 text-white text-xs outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 mb-1.5">
                        PRIMARY SOFTWARE (PMS)
                      </label>
                      <select
                        value={formState.pms}
                        onChange={(e) => setFormState({ ...formState, pms: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-[#0a0d14] border border-white/10 focus:border-green-400 text-white text-xs outline-none transition-colors cursor-pointer"
                      >
                        <option value="Dentrix">Dentrix</option>
                        <option value="Eaglesoft">Eaglesoft</option>
                        <option value="Open Dental">Open Dental</option>
                        <option value="SoftDent">SoftDent</option>
                        <option value="Curve Dental">Curve Dental</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 mb-1.5">
                      PRACTICE REQUIREMENTS
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Share your requirements: claims backlog, insurance verification, aging A/R..."
                      className="w-full px-3.5 py-2.5 rounded bg-white/[0.03] border border-white/10 focus:border-green-400 text-white text-xs outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded bg-white text-black hover:bg-gray-200 disabled:opacity-50 font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-md mt-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Send size={13} />
                    <span>OPEN PRE-FILLED IN GMAIL</span>
                  </button>
                  <p className="text-[10px] text-gray-500 text-center mt-2 font-normal">
                    * Opens pre-filled inquiry directly in Gmail addressed to <span className="text-gray-300 font-semibold">{personalData.email}</span>.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
