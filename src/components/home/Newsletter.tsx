import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { newsletterService } from '../../services/newsletterService';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await newsletterService.subscribe(email);
      setFeedback(res);
      if (res.success) setEmail('');
    } catch {
      setFeedback({ success: false, message: 'Could not subscribe right now. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#166534] to-[#14532D] text-white py-8 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-auto max-w-7xl shadow-md my-7 relative overflow-hidden">
      {/* Decorative leaf/grain visual */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FACC15]">
          Stay Nourished &amp; Informed
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Get Healthy Food Deals in Your Inbox
        </h2>
        <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
          Subscribe to receive new product launches, millet recipes and special offers.
        </p>

        <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 bg-white/10 p-1.5 rounded-2xl sm:rounded-full border border-white/20">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2.5 bg-transparent text-white placeholder:text-stone-300 text-xs sm:text-sm outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl sm:rounded-full bg-[#EAB308] hover:bg-[#CA8A04] text-stone-950 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Subscribing...' : 'SUBSCRIBE'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {feedback && (
            <div
              className={`mt-3 text-xs flex items-center justify-center gap-1.5 ${
                feedback.success ? 'text-amber-300' : 'text-rose-300'
              }`}
            >
              {feedback.success && <CheckCircle2 className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
