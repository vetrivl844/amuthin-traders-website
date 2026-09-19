import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#14532D] via-[#166534] to-[#14532D] text-white pt-5 sm:pt-7 pb-6 sm:pb-8 lg:pb-9">
      {/* Background Subtle Organic Textures & Grain Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FACC15_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Floating Millet Grain Dots Animation */}
      <div className="absolute top-6 left-12 w-2.5 h-2.5 rounded-full bg-amber-400/50 blur-[1px] animate-bounce duration-1000" />
      <div className="absolute top-16 right-20 w-2 h-2 rounded-full bg-amber-300/40 blur-[1px] animate-pulse" />
      <div className="absolute bottom-8 left-1/4 w-2.5 h-2.5 rounded-full bg-yellow-400/40 blur-[1px] animate-bounce" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 text-center lg:text-left">
            {/* Traditional Tamil Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-amber-400/40 text-amber-300 text-[11px] font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>தமிழர் பாரம்பரியம் • 100% Native Tamil Grains</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Healthy Millets. <br className="hidden sm:inline" />
              <span className="text-[#FACC15]">Traditional Goodness.</span>
            </h1>

            {/* Subheading */}
            <p className="text-stone-200 text-xs sm:text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Bring the goodness of traditional Tamil millets to your everyday kitchen. Naturally unpolished, fiber-rich, and directly sourced from sustainable farmer collectives.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 pt-1">
              <Link
                to="/products/millets-traditional"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] text-stone-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>SHOP MILLETS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/products"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>EXPLORE ALL PRODUCTS</span>
              </Link>
            </div>

            {/* Value Trust Badges */}
            <div className="pt-3.5 border-t border-emerald-700/60 grid grid-cols-3 gap-2 text-left">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white">Traditional</h4>
                  <p className="text-[9px] text-stone-300">Native Grains</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white">Quality</h4>
                  <p className="text-[9px] text-stone-300">100% Tested</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white">Doorstep</h4>
                  <p className="text-[9px] text-stone-300">Fast Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Decorative golden halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-2xl blur-lg opacity-25" />
              
              {/* Main Card with Real Millet Grain Showcase */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 shadow-xl bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&auto=format&fit=crop&q=80"
                  alt="Traditional Tamil Millets and Black Kavuni Rice"
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Product Highlight Overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-stone-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-amber-400/30 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#FACC15]">
                      Featured Harvest
                    </span>
                    <h3 className="text-xs font-bold text-white leading-tight">
                      Black Kavuni &amp; Positive Millets
                    </h3>
                  </div>
                  <Link
                    to="/products/millets-traditional"
                    className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[10px] shrink-0"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
