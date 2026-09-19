import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Award, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { initialSiteConfig } from '../data/initialData';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-[#166534] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>தமிழர் பாரம்பரியம் • OUR HERITAGE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
          Bringing Traditional Tamil Wisdom to Modern Dining
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Amuthin Traders was founded in Dindigul, Tamil Nadu with a clear purpose: to bridge the timeless nutrition of native millets and heritage grains with the fast-paced lives of today&apos;s conscious families.
        </p>
      </div>

      {/* Story Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Why Millets Matter
          </h2>
          <p>
            Ancient Sangam literature celebrated <strong className="text-[#166534]">Thinai (Foxtail Millet)</strong>, <strong className="text-[#166534]">Saamai (Little Millet)</strong>, <strong className="text-[#166534]">Varagu (Kodo Millet)</strong>, and <strong className="text-[#166534]">Kavuni Rice</strong> as the cornerstone of vitality and resilience.
          </p>
          <p>
            With the advent of heavily polished white rice and processed flour, modern lifestyles have lost the wholesome dietary fiber and slow-digesting complex carbohydrates that kept our ancestors free from metabolic ailments.
          </p>
          <p>
            At Amuthin Traders, our grains are 100% unpolished, preserving the rich aleurone layer and germ that contain critical micronutrients, iron, calcium, and plant proteins.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80"
            alt="Tamil Nadu farm millets"
            className="w-full h-80 object-cover"
          />
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 space-y-2">
          <Leaf className="w-6 h-6 text-[#166534]" />
          <h3 className="font-bold text-stone-900 text-sm sm:text-base">Direct From Farmers</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We partner directly with sustainable smallholder farmers across Tamil Nadu, eliminating broker margins and ensuring fair wages.
          </p>
        </div>

        <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 space-y-2">
          <Award className="w-6 h-6 text-[#166534]" />
          <h3 className="font-bold text-stone-900 text-sm sm:text-base">Triple-Graded Purity</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every harvest undergoes state-of-the-art gravity separation, destoning, and magnetic cleaning so you receive ready-to-cook grains.
          </p>
        </div>

        <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 space-y-2">
          <ShieldCheck className="w-6 h-6 text-[#166534]" />
          <h3 className="font-bold text-stone-900 text-sm sm:text-base">FSSAI Certified</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Tested for zero pesticide residues and 100% compliant with government food safety standards.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#14532D] text-white p-8 sm:p-10 rounded-3xl text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Join the Traditional Living Movement
        </h2>
        <p className="text-stone-200 text-xs sm:text-sm max-w-xl mx-auto">
          Start your family&apos;s wellness journey with our pure unpolished positive millets today.
        </p>
        <Link
          to="/products/millets-traditional"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FACC15] text-stone-950 font-bold text-xs sm:text-sm hover:bg-yellow-400 transition-colors"
        >
          <span>Explore Millet Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
