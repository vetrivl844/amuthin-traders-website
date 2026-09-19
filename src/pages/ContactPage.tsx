import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { initialSiteConfig } from '../data/initialData';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Get in Touch With Amuthin Traders
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Have questions about millet cooking recipes, bulk orders, or your current shipment? Our team in Dindigul is delighted to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
            <h3 className="font-extrabold text-base text-stone-900 pb-2 border-b border-stone-100">
              Customer Support Center
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Phone / WhatsApp</h4>
                  <a href={`tel:${initialSiteConfig.phone.replace(/\s+/g, '')}`} className="text-[#166534] font-semibold hover:underline block mt-0.5">
                    {initialSiteConfig.phone}
                  </a>
                  <span className="text-[11px] text-stone-500">Direct helpline &amp; WhatsApp chat</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Email Address</h4>
                  <a href={`mailto:${initialSiteConfig.email}`} className="text-[#166534] font-semibold hover:underline block mt-0.5">
                    {initialSiteConfig.email}
                  </a>
                  <span className="text-[11px] text-stone-500">Responses within 4-6 business hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Registered Office &amp; Store</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    {initialSiteConfig.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Operating Hours</h4>
                  <p className="text-stone-600 mt-0.5">
                    {initialSiteConfig.operatingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#166534]" />
            <h2 className="font-extrabold text-base sm:text-lg text-stone-900">
              Send Us a Message
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Senthil Kumar"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98421 00000"
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="senthil@gmail.com"
                className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Your Message or Recipe Query *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about bulk grain orders, cold-pressed oil queries, or recipe guidance..."
                className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl outline-none focus:ring-1 focus:ring-[#166534]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </button>

            {submitted && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nandri! Your message has been sent to our customer care team. We will respond shortly.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
