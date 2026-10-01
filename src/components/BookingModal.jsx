import React, { useState } from 'react';
import { X, Calendar, Clock, Check, PhoneCall, Sparkles } from 'lucide-react';
import { personalData } from '../data/portfolioData';

export default function BookingModal({ isOpen, onClose, onPlaySound }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timeSlot: 'Morning (EST / PST)',
    topic: 'Full-Cycle Dental Billing Support'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaySound?.();
    setSubmitted(true);
    const subject = encodeURIComponent(`Consultation Booking Request: ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Hussein,\n\nI would like to book a consultation.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nPreferred Time: ${formData.timeSlot}\nDiscussion Topic: ${formData.topic}`
    );
    window.open(`mailto:${personalData.email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-dark-900 border border-cyan-400/30 p-8 shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Booking Initiated!</h3>
            <p className="text-sm text-gray-300">
              Your consultation request email has been opened. Hussein will reply promptly to confirm your preferred call slot.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-cyan-950/50 border border-cyan-400/30 text-cyan-300 mb-2">
                <Sparkles size={12} />
                <span>Schedule a 1-on-1 Call</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Book a Practice Consultation
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Discuss how Hussein can eliminate claims delays and accelerate your cash flow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                  Name / Clinic Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Smith / Apex Dental Care"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 text-white text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@practice.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 text-white text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 text-white text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 focus:border-cyan-400 text-white text-sm outline-none"
                >
                  <option value="Morning (EST / PST)">Morning (EST / PST)</option>
                  <option value="Afternoon (EST / PST)">Afternoon (EST / PST)</option>
                  <option value="Evening (EST / PST)">Evening (EST / PST)</option>
                  <option value="Flexible / Immediate Availability">Flexible / As Soon as Possible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5">
                  Primary Area of Interest
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-850 border border-white/10 focus:border-cyan-400 text-white text-sm outline-none"
                >
                  <option value="Full-Cycle Dental Billing Support">Full-Cycle Dental Billing Support</option>
                  <option value="Insurance Breakdown & Eligibility Verification">Insurance Breakdown & Eligibility Verification</option>
                  <option value="Aging A/R (30/60/90+ Day) Recovery">Aging A/R (30/60/90+ Day) Recovery</option>
                  <option value="Dental Claims Resubmission & Appeals">Dental Claims Resubmission & Appeals</option>
                  <option value="Full-Time / Part-Time VA Placement">Full-Time / Part-Time VA Placement</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 rounded-xl bg-white hover:bg-cyan-300 text-black font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2"
              >
                <PhoneCall size={15} />
                <span>Confirm Consultation Request</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
