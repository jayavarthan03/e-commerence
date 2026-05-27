import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Rating from '../components/Rating';
import { ProductDetailsSkeleton } from '../components/LoadingSkeleton';
import { toast } from '../components/Toast';
import { ShoppingCart, Heart, Plus, Minus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch product detail
  const fetchProductDetails = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast('Product not found.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <p className="text-lg font-bold text-slate-500">PRODUCT NOT FOUND</p>
        <Link to="/shop" className="btn-gradient px-6 py-2 rounded-xl text-xs font-bold uppercase">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isStarred = isInWishlist(product._id);
  const outOfStock = product.stock === 0;

  // Manage Qty modifications
  const handleQtyChange = (val) => {
    setQty(Math.max(1, Math.min(val, product.stock)));
  };

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, qty);
    toast(`${qty}x ${product.title} added to shopping cart!`, 'success');
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (!isStarred) {
      toast(`${product.title} bookmarked in Wishlist!`, 'info');
    } else {
      toast(`${product.title} removed from Wishlist.`, 'info');
    }
  };

  // Submit product review comment
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast('Please write a review comment.', 'warning');
      return;
    }

    setSubmitLoading(true);
    try {
      await api.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      toast('Review submitted successfully!', 'success');
      setReviewComment('');
      setReviewRating(5);
      
      // Reload details to display new review
      fetchProductDetails();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review.';
      toast(message, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-12">
      
      {/* Back button */}
      <div>
        <Link to="/shop" className="text-xs font-bold hover:text-primary-500 transition-colors uppercase tracking-widest text-slate-400 dark:text-slate-500">
          ← BACK TO SHOPPING CATALOG
        </Link>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left: Product Image with Zoom hover effect */}
        <div className="relative rounded-3xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/10 uppercase tracking-widest">
            {product.category}
          </span>
        </div>

        {/* Right: Meta Details */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white uppercase tracking-wide">
              {product.title}
            </h1>
            <Rating value={product.ratings} text={`${product.ratings.toFixed(1)} stars from ${product.numReviews} review counts`} />
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              ${product.price.toFixed(2)}
            </span>
            
            {/* Stock pill indicator */}
            {outOfStock ? (
              <span className="px-3 py-1 rounded-xl text-xs font-bold border border-rose-500/20 bg-rose-500/10 text-rose-400 uppercase tracking-wider">
                OUT OF STOCK
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl text-xs font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">
                IN STOCK ({product.stock} units left)
              </span>
            )}
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">PRODUCT SUMMARY</h3>
            <p className="text-sm font-medium text-slate-650 dark:text-slate-350 leading-relaxed">
              {product.description}
            </p>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Qty & Checkout actions row */}
          {!outOfStock && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Custom -/+ Quantity Selector */}
              <div className="flex items-center gap-3 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md">
                <button
                  onClick={() => handleQtyChange(qty - 1)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300"
                  aria-label="Decrease Quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-extrabold w-8 text-center">{qty}</span>
                <button
                  onClick={() => handleQtyChange(qty + 1)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300"
                  aria-label="Increase Quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="btn-gradient px-8 py-3.5 rounded-xl text-xs font-bold tracking-widest flex items-center justify-center gap-2 flex-1 w-full"
              >
                <ShoppingCart className="w-4 h-4" />
                ADD TO CART
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={handleWishlistToggle}
                className={`p-3.5 rounded-xl border transition-all active:scale-95 shadow-sm ${
                  isStarred
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Review Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        
        {/* Left Col: Customer reviews stack */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
            CUSTOMER REVIEWS ({product.reviews.length})
          </h2>

          {product.reviews.length === 0 ? (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">NO REVIEWS POSTED YET. BE THE FIRST TO WRITE AN OPINION!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
              {product.reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                      {rev.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Rating value={rev.rating} />
                  
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Write review form */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
            WRITE A CUSTOMER REVIEW
          </h2>

          {user ? (
            <form
              onSubmit={handleReviewSubmit}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/15 backdrop-blur-md flex flex-col gap-5"
            >
              
              {/* Star selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Gear Rating Selection
                </label>
                <div className="flex items-center gap-2">
                  <Rating
                    value={reviewRating}
                    onSelect={(i) => setReviewRating(i)}
                    color="text-amber-400"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    ({reviewRating} out of 5 stars)
                  </span>
                </div>
              </div>

              {/* Review Text comment */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Review Comment Text
                </label>
                <textarea
                  rows="4"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience using this professional gear..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500 transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="btn-gradient w-full py-3 rounded-xl text-xs font-bold tracking-widest uppercase disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : 'SUBMIT PRODUCT REVIEW'}
              </button>

            </form>
          ) : (
            <div className="p-6 rounded-2xl border border-slate-250 dark:border-slate-850 bg-slate-100/50 dark:bg-slate-900/10 flex flex-col items-center justify-center text-center gap-3">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">YOU MUST SIGN IN TO SHARE A PRODUCT REVIEW COMMENT.</p>
              <Link
                to="/login"
                className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase"
              >
                SIGN IN NOW
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
