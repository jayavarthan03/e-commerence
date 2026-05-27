import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Rating from './Rating';
import { toast } from './Toast';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isStarred = isInWishlist(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) {
      toast(`Sorry, ${product.title} is currently out of stock.`, 'warning');
      return;
    }
    addToCart(product, 1);
    toast(`${product.title} added to shopping cart!`, 'success');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (!isStarred) {
      toast(`${product.title} bookmarked in Wishlist!`, 'info');
    } else {
      toast(`${product.title} removed from Wishlist.`, 'info');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-2xl glass-card overflow-hidden flex flex-col h-full bg-white dark:bg-slate-900/30"
    >
      
      {/* Product Image Section */}
      <Link to={`/product/${product._id}`} className="relative block aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900/60">
        
        {/* Main Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Category floating tag */}
        <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-900/70 text-slate-100 backdrop-blur-md uppercase border border-white/10">
          {product.category}
        </span>

        {/* Stock Alert overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-2 border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold text-xs tracking-wider rounded-xl uppercase">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Heart Bookmark button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95 transition-all z-20 shadow-md bg-white/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-950"
          aria-label="Wishlist Bookmark"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isStarred ? 'text-rose-500 fill-rose-500' : 'text-slate-500 dark:text-slate-300'
            }`}
          />
        </button>

      </Link>

      {/* Product Detail Content Section */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        
        <div className="flex flex-col gap-2">
          {/* Product Title */}
          <Link to={`/product/${product._id}`} className="block">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-primary-500 transition-colors line-clamp-1 uppercase">
              {product.title}
            </h3>
          </Link>

          {/* Star rating component */}
          <Rating value={product.ratings} text={`(${product.numReviews})`} />
        </div>

        {/* Row for price and buy actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">PRICE</span>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`p-2.5 rounded-xl border flex items-center justify-center active:scale-95 hover:scale-105 transition-all shadow-md ${
              outOfStock
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 cursor-not-allowed'
                : 'btn-gradient border-transparent'
            }`}
            aria-label="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>

    </motion.div>
  );
};

export default ProductCard;
