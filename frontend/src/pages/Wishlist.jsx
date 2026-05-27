import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-4xl">
          ❤️
        </div>
        <div>
          <h1 className="text-3xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
            Your Wishlist is Empty
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
            Bookmark premium tech gear that you plan to add to your workstation later!
          </p>
        </div>
        <Link
          to="/shop"
          className="btn-gradient px-8 py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase mt-4"
        >
          GO BROWSE CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
          MY WISHLIST
        </h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
          Review your bookmarked tech hardware and gaming gear
        </p>
      </div>

      {/* Grid of Wishlisted items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

    </div>
  );
};

export default Wishlist;
