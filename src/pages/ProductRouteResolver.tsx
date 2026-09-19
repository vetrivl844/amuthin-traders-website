import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductListingPage } from './ProductListingPage';
import { ProductDetailsPage } from './ProductDetailsPage';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ProductRouteResolver: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [routeType, setRouteType] = useState<'product' | 'category' | 'loading'>('loading');

  useEffect(() => {
    const resolve = async () => {
      if (!id) {
        setRouteType('category');
        return;
      }

      // If id begins with 'prod-', it's definitely a product
      if (id.startsWith('prod-')) {
        setRouteType('product');
        return;
      }

      // Check if it's a known category
      const categories = await categoryService.getCategories();
      const isCategory = categories.some((c) => c.id === id);
      if (isCategory) {
        setRouteType('category');
        return;
      }

      // Otherwise check if it's a product
      const product = await productService.getProductById(id);
      if (product) {
        setRouteType('product');
      } else {
        setRouteType('category');
      }
    };

    resolve();
  }, [id]);

  if (routeType === 'loading') {
    return (
      <div className="py-24">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  if (routeType === 'product') {
    return <ProductDetailsPage />;
  }

  return <ProductListingPage />;
};
