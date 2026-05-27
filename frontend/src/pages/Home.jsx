import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Laptop, Headphones, Smartphone, Watch, Monitor, ShieldCheck, Zap, Truck, HeadphonesIcon } from 'lucide-react';
import { api } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/api/products?pageSize=4');
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Laptops', icon: <Laptop className="w-6 h-6" />, count: '2 items', desc: 'Workstations & Notebooks' },
    { name: 'Audio', icon: <Headphones className="w-6 h-6" />, count: '1 item', desc: 'Noise Cancelling Headsets' },
    { name: 'Accessories', icon: <Zap className="w-6 h-6" />, count: '3 items', desc: 'Keyboards, Mice & Banks' },
    { name: 'Wearables', icon: <Watch className="w-6 h-6" />, count: '1 item', desc: 'Smartwatches & Fitness' },
    { name: 'Monitors', icon: <Monitor className="w-6 h-6" />, count: '1 item', desc: 'Curved OLED Displays' },
    { name: 'Smartphones', icon: <Smartphone className="w-6 h-6" />, count: '1 item', desc: 'Flagship Mobile Gear' },
  ];

  return (
    <div className="flex flex-col min-h-screen gap-16 pb-12">
      
      {/* 1. Hero banner Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center border-b border-slate-200/50 dark:border-slate-800/60 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-cyber-dark dark:via-slate-950 dark:to-cyber-dark py-20">
        
        {/* Futuristic glowing particle backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-500 text-xs font-bold tracking-widest uppercase mb-4"
          >
            🚀 NEXT GENERATION HARDWARE HAS ARRIVED
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
          >
            ELEVATE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-500 glow-text">
              DIGITAL WORKSPACE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-xl font-medium text-slate-500 dark:text-slate-400 max-w-2xl"
          >
            Aura curates premium tech, customized mechanical keyboards, Curved OLED displays, and elite laptop setups for developers, creators, and engineers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4"
          >
            <Link
              to="/shop"
              className="btn-gradient px-8 py-3.5 rounded-2xl text-sm font-bold tracking-wider flex items-center gap-2 group w-full sm:w-auto"
            >
              EXPLORE GEAR
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link
              to="/shop?category=Laptops"
              className="btn-gradient-secondary px-8 py-3.5 rounded-2xl text-sm font-bold tracking-wider w-full sm:w-auto text-center"
            >
              VIEW WORKSTATIONS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Core Qualities / Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md">
            <div className="p-3.5 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center h-fit">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-slate-100">HYPER SPEED SHIPPING</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Complimentary priority delivery on all store orders exceeding $250.00.</p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md">
            <div className="p-3.5 bg-violet-500/10 text-violet-500 rounded-xl flex items-center justify-center h-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-slate-100">AURA ELITE WARRANTY</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Every tech device sold is backed by our fully inclusive 2-year hardware warranty.</p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center h-fit">
              <HeadphonesIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-slate-100">24/7 EXPERT CHAT</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Direct Slack and ticket integration to specialized tech staff who speak coding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Grids Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Browse by Category
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Filter your gear selection instantly based on custom categories.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={`/shop?category=${cat.name}`}
              className="flex flex-col gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/20 text-center items-center hover:border-primary-500/40 hover:shadow-primary-500/5 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-colors">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase">{cat.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Feature Featured Products grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Trending Releases
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Curated hardware that represents the absolute peak of modern specifications.</p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors group h-fit w-fit"
          >
            VIEW ENTIRE SHOP
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Special discount promo card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/50 dark:border-white/10 glass-panel-heavy p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent opacity-50"></div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tight">
            GET 20% DISCOUNT ON YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-500 glow-text-purple">FIRST PURCHASE</span>
          </h2>
          <p className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400 max-w-xl">
            Type code <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-350 dark:border-slate-850 text-primary-500 font-extrabold select-all">SAVE20</span> inside your shopping cart to deduct 20% from your order!
          </p>
          <Link
            to="/shop"
            className="btn-gradient px-8 py-3.5 rounded-2xl text-xs font-extrabold tracking-wider mt-4"
          >
            ACTIVATE SAVINGS NOW
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
