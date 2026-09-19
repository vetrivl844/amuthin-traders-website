import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { initialSiteConfig } from '../../data/initialData';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, openAuthModal } = useAuth();
  return (
    <footer className="bg-[#14532D] text-stone-200 pt-8 pb-20 lg:pb-8 border-t border-emerald-900">
      {/* Top Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 border-b border-emerald-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center shrink-0">
              <Leaf className="w-4.5 h-4.5 text-[#FACC15]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">100% Traditional</h4>
              <p className="text-[11px] text-stone-300">Unpolished positive Tamil millets</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center shrink-0">
              <Truck className="w-4.5 h-4.5 text-[#FACC15]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Doorstep Delivery</h4>
              <p className="text-[11px] text-stone-300">Free shipping above ₹499</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5 text-[#FACC15]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Quality Assured</h4>
              <p className="text-[11px] text-stone-300">Directly from trusted farmers</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5 text-[#FACC15]" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Tamil Heritage</h4>
              <p className="text-[11px] text-stone-300">Preserving our ancient diet wellness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="Amuthin Traders Logo"
                className="w-11 h-11 rounded-xl bg-amber-50 p-0.5 object-cover"
              />
              <div>
                <h3 className="font-extrabold text-lg tracking-wide text-white">
                  AMUTHIN TRADERS
                </h3>
                <p className="text-xs text-[#FACC15] font-semibold">
                  தமிழர் பாரம்பரியம் • Traditional Healthy Foods
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Bringing traditional Tamil heritage millets, nutrient-dense native rice, cold-pressed oils and everyday wholesome lifestyle goods directly from Indian farms to modern family kitchens.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={initialSiteConfig.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-800 hover:bg-emerald-700 text-amber-300 flex items-center justify-center text-xs font-bold transition-all"
                aria-label="WhatsApp"
              >
                WA
              </a>
              <a
                href={initialSiteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-800 hover:bg-emerald-700 text-amber-300 flex items-center justify-center text-xs font-bold transition-all"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href={initialSiteConfig.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-800 hover:bg-emerald-700 text-amber-300 flex items-center justify-center text-xs font-bold transition-all"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href={initialSiteConfig.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-800 hover:bg-emerald-700 text-amber-300 flex items-center justify-center text-xs font-bold transition-all"
                aria-label="YouTube"
              >
                YT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3.5">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-amber-300 transition-colors">
                  Offers & Deals
                </Link>
              </li>
              <li>
                <Link to="/orders/ord-1001" className="hover:text-amber-300 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="hover:text-amber-300 transition-colors font-bold text-amber-300 flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal('admin', () => navigate('/admin'))}
                    className="hover:text-amber-300 transition-colors font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3.5">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link
                  to="/products/millets-traditional"
                  className="text-amber-300 font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Millets & Heritage Foods</span>
                </Link>
              </li>
              <li>
                <Link to="/products/dress-fashion" className="hover:text-amber-300 transition-colors">
                  Dress & Fashion
                </Link>
              </li>
              <li>
                <Link to="/products/toys" className="hover:text-amber-300 transition-colors">
                  Wooden Toys & Crafts
                </Link>
              </li>
              <li>
                <Link to="/products/home-appliances" className="hover:text-amber-300 transition-colors">
                  Home Appliances
                </Link>
              </li>
              <li>
                <Link to="/products/kitchen-accessories" className="hover:text-amber-300 transition-colors">
                  Kitchen & Cast Iron
                </Link>
              </li>
              <li>
                <Link to="/products/mobile-accessories" className="hover:text-amber-300 transition-colors">
                  Mobile Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3.5">
              Store & Support
            </h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{initialSiteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${initialSiteConfig.phone.replace(/\s+/g, '')}`} className="hover:text-amber-300">
                  {initialSiteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${initialSiteConfig.email}`} className="hover:text-amber-300">
                  {initialSiteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{initialSiteConfig.operatingHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-300 gap-3">
        <p>© {new Date().getFullYear()} Amuthin Traders. All rights reserved. Made with love for Tamil Nadu Traditional Living.</p>
        <div className="flex items-center gap-4">
          <span>Secure Payments</span>
          <span>•</span>
          <span>100% Genuine Farm Produce</span>
          <span>•</span>
          <span>FSSAI Certified</span>
        </div>
      </div>
    </footer>
  );
};
