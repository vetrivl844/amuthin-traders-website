import React from 'react';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No products found',
  description = 'Try adjusting your search terms or filters to find what you are looking for.',
  actionText = 'Explore All Millets',
  actionLink = '/products/millets-traditional',
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-stone-200/80 shadow-xs max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-[#166534] flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-8 h-8 text-[#4D7C0F]" />}
      </div>
      <h3 className="text-lg font-bold text-stone-800">{title}</h3>
      <p className="text-sm text-stone-600 mt-1 mb-6 leading-relaxed">{description}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold transition-all shadow-xs"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};
