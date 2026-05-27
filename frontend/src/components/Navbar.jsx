import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Sun, Moon, Search, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth, api } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Calculate total items in cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const { data } = await api.get(`/api/products?search=${searchQuery}&pageSize=5`);
          setSuggestions(data.products || []);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle suggestion click
  const handleSuggestionClick = (id) => {
    setSearchQuery('');
    setSuggestions([]);
    navigate(`/product/${id}`);
  };

  // Submit search query
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSuggestions([]);
      setSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-cyber-dark/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-violet-500 hover:opacity-90">
            <span>⚡ AURA</span>
          </Link>

          {/* Core Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-semibold tracking-wide hover:text-primary-500 transition-colors ${location.pathname === '/' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300'}`}>
              HOME
            </Link>
            <Link to="/shop" className={`text-sm font-semibold tracking-wide hover:text-primary-500 transition-colors ${location.pathname === '/shop' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300'}`}>
              SHOP
            </Link>
          </div>

          {/* Search suggestions input box */}
          <div ref={searchRef} className="hidden md:block relative w-full max-w-xs mx-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
                />
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </form>

            {/* Suggestions Overlay Dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-full glass-panel-heavy rounded-2xl overflow-hidden shadow-2xl p-1 z-50"
                >
                  {suggestions.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSuggestionClick(item._id)}
                      className="flex items-center gap-3 w-full p-2 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded-xl text-left transition-colors"
                    >
                      <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-100">{item.title}</p>
                        <p className="text-xs font-medium text-primary-500">${item.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Icons Actions Row */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Wishlist Bookmarks */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-cyber-dark animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart count */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-cyber-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth User Menu Dropdown */}
            <div ref={dropdownRef} className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold font-sans uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase truncate max-w-[80px]">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 glass-panel-heavy rounded-2xl shadow-2xl p-1 z-50"
                      >
                        <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-800/80 mb-1">
                          <p className="text-xs font-bold text-slate-400">LOGGED IN AS</p>
                          <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{user.email}</p>
                        </div>

                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-primary-500 transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            DASHBOARD
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-primary-500 transition-all"
                        >
                          <User className="w-4 h-4" />
                          PROFILE
                        </Link>
                        
                        <Link
                          to="/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-primary-500 transition-all"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          ORDERS
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          LOG OUT
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn-gradient px-4 py-1.5 rounded-full text-xs font-bold tracking-wider"
                >
                  LOG IN
                </Link>
              )}
            </div>

          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            
            <Link to="/cart" className="relative p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300">
              <ShoppingCart className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Routing Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-dark px-4 py-4 space-y-3 shadow-lg"
          >
            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            </form>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                HOME
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                SHOP
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 flex justify-between items-center"
              >
                <span>WISHLIST</span>
                {wishlistItems.length > 0 && <span className="bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">{wishlistItems.length}</span>}
              </Link>

              <hr className="border-slate-200 dark:border-slate-850" />

              {user ? (
                <>
                  <div className="px-3 py-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">LOGGED IN AS</p>
                    <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{user.email}</p>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                      ADMIN DASHBOARD
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    MY PROFILE
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    ORDER HISTORY
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 text-left w-full"
                  >
                    LOG OUT
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gradient py-2 rounded-xl text-sm text-center font-bold tracking-wider"
                >
                  LOG IN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
