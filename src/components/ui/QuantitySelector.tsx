import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-11 text-base',
  };

  const btnSizes = {
    sm: 'w-7 h-8',
    md: 'w-8 h-9',
    lg: 'w-10 h-11',
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div
      className={`inline-flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs ${sizeClasses[size]}`}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={`flex items-center justify-center text-stone-600 hover:bg-amber-50 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer ${btnSizes[size]}`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="px-3 min-w-[2.2rem] text-center font-bold text-stone-800 select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={`flex items-center justify-center text-stone-600 hover:bg-amber-50 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer ${btnSizes[size]}`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
