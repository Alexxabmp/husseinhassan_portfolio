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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Send directly to Hussein's Gmail via FormSubmit AJAX API
      const response = await fetch('https://formsubmit.co/ajax/vinzhassan0114@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Dental Practice Inquiry from ${formState.name} (${formState.practice})`,
          name: formState.name,
          email: formState.email,
          practiceLocation: formState.practice,
          pmsSoftware: formState.pms,
          message: formState.message,
          _template: 'table'
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: '', email: '', practice: '', pms: 'Dentrix', message: '' });
      } else {
        throw new Error('Network response not ok');
      }
    } catch (err) {
      // Fallback: Open mail client if network request fails
      const subject = encodeURIComponent(`Dental Billing Inquiry from ${formState.name} (${formState.practice})`);
      const body = encodeURIComponent(
        `Hello Hussein,\n\nName: ${formState.name}\nPractice: ${formState.practice}\nPMS System: ${formState.pms}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
      );
      window.open(`mailto:${personalData.email}?subject=${subject}&body=${body}`, '_blank');
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white uppercase">MESSAGE SENT SUCCESSFULLY</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Your message has been delivered directly to <span className="text-green-400 font-semibold">{personalData.email}</span>. Hussein will reply promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-green-400 hover:underline pt-3 uppercase block mx-auto font-bold"
                  >
                    ← Send Another Message
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
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-black" />
                        <span>TRANSMITTING DIRECTLY TO HUSSEIN...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>SEND MESSAGE TO GMAIL</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
