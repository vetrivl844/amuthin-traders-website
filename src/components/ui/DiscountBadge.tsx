import React from 'react';

interface DiscountBadgeProps {
  discount: number;
  className?: string;
  size?: 'sm' | 'md';
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  discount,
  className = '',
  size = 'sm',
}) => {
  if (!discount || discount <= 0) return null;

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-bold tracking-tight rounded-md bg-[#F97316] text-white shadow-xs ${sizeClasses} ${className}`}
    >
      {discount}% OFF
    </span>
  );
};
