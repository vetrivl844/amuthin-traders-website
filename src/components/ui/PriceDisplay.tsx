import React from 'react';

interface PriceDisplayProps {
  salePrice: number;
  mrp?: number;
  weight?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  salePrice,
  mrp,
  weight,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { current: 'text-sm font-bold', mrp: 'text-xs', unit: 'text-xs' },
    md: { current: 'text-base sm:text-lg font-bold', mrp: 'text-xs sm:text-sm', unit: 'text-xs' },
    lg: { current: 'text-xl sm:text-2xl font-extrabold', mrp: 'text-sm sm:text-base', unit: 'text-sm' },
    xl: { current: 'text-2xl sm:text-3xl font-extrabold', mrp: 'text-base sm:text-lg', unit: 'text-sm' },
  };

  const styling = sizeMap[size];

  return (
    <div className={`inline-flex items-baseline flex-wrap gap-1.5 ${className}`}>
      <span className={`text-[#14532D] tracking-tight ${styling.current}`}>
        ₹{salePrice}
      </span>
      {mrp && mrp > salePrice && (
        <span className={`text-stone-600 line-through ${styling.mrp}`}>
          ₹{mrp}
        </span>
      )}
      {weight && (
        <span className={`text-stone-600 font-normal ${styling.unit}`}>
          / {weight}
        </span>
      )}
    </div>
  );
};
