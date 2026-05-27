import React from 'react';

// Single pulsing product card placeholder
export const ProductCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 p-4 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
      
      {/* Category Skeleton */}
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-2"></div>
      
      {/* Title Skeleton */}
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
      
      {/* Stars Skeleton */}
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
      
      {/* Price & Action Skeleton */}
      <div className="flex justify-between items-center mt-2">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-10"></div>
      </div>
    </div>
  );
};

// Full product details page loading placeholder
export const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Large Product Image Skeleton */}
        <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        
        {/* Product Meta details Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <hr className="border-slate-200 dark:border-slate-800" />
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// List/Spreadsheet tabular loading placeholder
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  const rowArr = Array(rows).fill(0);
  const colArr = Array(cols).fill(0);

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 p-4 animate-pulse">
      {/* Table Header skeleton */}
      <div className="flex gap-4 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        {colArr.map((_, i) => (
          <div key={i} className="h-6 bg-slate-200 dark:bg-slate-800 rounded flex-1"></div>
        ))}
      </div>
      
      {/* Table Body rows */}
      <div className="flex flex-col gap-3">
        {rowArr.map((_, ri) => (
          <div key={ri} className="flex gap-4 items-center">
            {colArr.map((_, ci) => (
              <div key={ci} className="h-10 bg-slate-200/60 dark:bg-slate-800/60 rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
