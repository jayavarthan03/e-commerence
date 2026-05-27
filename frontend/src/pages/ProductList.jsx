import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Pagination & counts
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters read from URL or defaulted
  const searchVal = searchParams.get('search') || '';
  const categoryVal = searchParams.get('category') || 'All';
  const sortVal = searchParams.get('sort') || 'newest';
  const pageVal = Number(searchParams.get('page')) || 1;
  const priceMaxVal = Number(searchParams.get('priceMax')) || 2000;

  // Track local states before submitting
  const [localSearch, setLocalSearch] = useState(searchVal);
  const [localPriceMax, setLocalPriceMax] = useState(priceMaxVal);
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync search input with URL param changes
  useEffect(() => {
    setLocalSearch(searchVal);
  }, [searchVal]);

  // Fetch products matching filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = `/api/products?page=${pageVal}&category=${categoryVal}&sort=${sortVal}&search=${searchVal}`;
        const { data } = await api.get(query);
        
        // Filter locally by price max to simulate client-side/flexible price thresholds
        let items = data.products || [];
        if (priceMaxVal) {
          items = items.filter(p => p.price <= priceMaxVal);
        }

        setProducts(items);
        setPages(data.pages || 1);
        setTotalProducts(items.length);
        
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(['Laptops', 'Audio', 'Accessories', 'Wearables', 'Monitors', 'Smartphones']);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Helper to update specific search parameter and keep others
  const updateParam = (key, value) => {
    const updated = new URLSearchParams(searchParams);
    if (value === 'All' || value === '' || (key === 'priceMax' && value === 2000)) {
      updated.delete(key);
    } else {
      updated.set(key, value);
    }
    // Always reset page to 1 when filters modify
    if (key !== 'page') {
      updated.delete('page');
    }
    setSearchParams(updated);
  };

  // Submit Search filter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', localSearch);
  };

  // Submit price filter
  const applyPriceFilter = () => {
    updateParam('priceMax', localPriceMax);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* 1. Header and title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
            HARDWARE CATALOG
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
            Showing {totalProducts} products of total items
          </p>
        </div>

        {/* Search bar and filter toggle */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search store..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          </form>

          {/* Toggle filter sidebar on mobile */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200"
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* 2. Page Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar filters */}
        <div className={`lg:flex flex-col gap-6 lg:static fixed inset-y-0 left-0 z-40 w-72 lg:w-auto p-6 lg:p-0 bg-white dark:bg-cyber-dark lg:bg-transparent border-r lg:border-r-0 border-slate-200 dark:border-slate-800 transition-transform duration-300 transform lg:translate-x-0 ${filterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white uppercase">FILTERS</h2>
            <button onClick={() => setFilterOpen(false)} className="text-slate-500 font-bold">Close</button>
          </div>

          {/* Category checklist */}
          <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-5 backdrop-blur-md">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Categories</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { updateParam('category', 'All'); setFilterOpen(false); }}
                className={`text-left px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${categoryVal === 'All' ? 'bg-primary-500 text-white shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-400'}`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => { updateParam('category', c); setFilterOpen(false); }}
                  className={`text-left px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${categoryVal === c ? 'bg-primary-500 text-white shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-400'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price max slider */}
          <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-5 backdrop-blur-md">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Price Range</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>$0</span>
                <span className="text-primary-500 font-bold">${localPriceMax}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <button
                onClick={() => { applyPriceFilter(); setFilterOpen(false); }}
                className="btn-gradient w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Apply Price
              </button>
            </div>
          </div>

        </div>

        {/* Products Grid area */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Sorting controls bar */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:block uppercase">
              Sorting results
            </span>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortVal}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="text-xs font-bold bg-transparent text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="newest" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Newest Releases</option>
                <option value="price-asc" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Price: Low to High</option>
                <option value="price-desc" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Price: High to Low</option>
                <option value="rating" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Grid render */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <p className="text-lg font-bold text-slate-500 dark:text-slate-400">NO HARDWARE MATCHES YOUR SELECTION</p>
              <button
                onClick={() => setSearchParams({})}
                className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination bar */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => updateParam('page', Math.max(1, pageVal - 1))}
                disabled={pageVal === 1}
                className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${pageVal === 1 ? 'border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed' : 'border-slate-350 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-95'}`}
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                PAGE {pageVal} OF {pages}
              </span>

              <button
                onClick={() => updateParam('page', Math.min(pages, pageVal + 1))}
                disabled={pageVal === pages}
                className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${pageVal === pages ? 'border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed' : 'border-slate-350 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-95'}`}
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ProductList;
