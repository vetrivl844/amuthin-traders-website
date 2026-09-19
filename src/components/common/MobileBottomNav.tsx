import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag, User, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { itemCount, openCartDrawer } = useCart();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Millets', path: '/products/millets-traditional', icon: Sparkles, isHighlight: true },
    { label: 'Categories', path: '/products', icon: Grid },
    { label: 'Account', path: '/account', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive
                  ? 'text-[#166534] font-bold'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    item.isHighlight && !isActive ? 'text-amber-600' : ''
                  }`}
                />
                {item.isHighlight && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart Item that opens Cart Drawer */}
        <button
          type="button"
          onClick={openCartDrawer}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-stone-700 hover:text-[#166534] font-medium cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#166534]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#EA580C] text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold text-[#166534]">Cart</span>
        </button>
      </div>
    </div>
  );
};
