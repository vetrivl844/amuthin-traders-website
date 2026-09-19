import React from 'react';
import { EmptyState } from '../components/ui/EmptyState';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <EmptyState
        title="404 - Page Not Found"
        description="The traditional grain or page you were looking for is not located here. Explore our traditional millet catalogue or return to home."
        actionText="Back to Homepage"
        actionLink="/"
      />
    </div>
  );
};
