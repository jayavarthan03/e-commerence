import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { Plus, Minus, Trash2, ArrowRight, Ticket } from 'lucide-react';

const Cart = () => {
  const { user } = useAuth();
  const {
    cartItems,
    subtotal,
    discount,
    shipping,
    total,
    couponCode,
    applyCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  // Handle coupon submission
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyCoupon(promoInput);
    if (res.success) {
      toast(res.message, 'success');
      setPromoInput('');
    } else {
      toast(res.message, 'error');
    }
  };

  // Forward to checkout
  const handleCheckout = () => {
    if (!user) {
      toast('Please log in or sign up to complete your checkout.', 'info');
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-4xl">
          🛒
        </div>
        <div>
          <h1 className="text-3xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
            Your Cart is Empty
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
            You haven't added any cutting-edge tech gear to your workstation yet. Let's browse the catalog!
          </p>
        </div>
        <Link
          to="/shop"
          className="btn-gradient px-8 py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase mt-4"
        >
          EXPLORE TECH GEAR
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
          SHOPPING CART
        </h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
          Configure and review your selected hardware items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cart items table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                
                {/* Product meta detail */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
                  />
                  <div className="overflow-hidden">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase tracking-widest">
                      {item.product.category}
                    </span>
                    <Link to={`/product/${item.product._id}`} className="block mt-1">
                      <h3 className="font-bold text-sm text-slate-850 dark:text-slate-100 hover:text-primary-500 transition-colors truncate uppercase max-w-[200px] sm:max-w-none">
                        {item.product.title}
                      </h3>
                    </Link>
                    <p className="text-xs font-bold text-slate-450 dark:text-slate-500 mt-1">
                      Unit price: ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Right: Quantity selector & pricing */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  
                  {/* -/+ Quantity adjustment */}
                  <div className="flex items-center gap-3 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      aria-label="Decrease Quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      aria-label="Increase Quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Calculated subtotal line */}
                  <div className="flex flex-col text-right min-w-[70px]">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => {
                      removeFromCart(item.product._id);
                      toast(`${item.product.title} removed from cart.`, 'info');
                    }}
                    className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all"
                    aria-label="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            ))}
          </div>

          {/* Sweep clean button */}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                clearCart();
                toast('Shopping cart cleared.', 'info');
              }}
              className="text-xs font-bold text-rose-500 hover:underline uppercase tracking-wider"
            >
              Clear Shopping Cart
            </button>
          </div>

        </div>

        {/* Right Column: Order Summary & Coupon inputs */}
        <div className="flex flex-col gap-6">
          
          {/* Coupon discount panel */}
          <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-5 backdrop-blur-md flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary-500" />
              PROMO COUPON CODE
            </h3>

            {couponCode ? (
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span>⚡ SAVINGS ACTIVE: SAVE20</span>
                <span>-20%</span>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  APPLY
                </button>
              </form>
            )}
            
            <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 italic">
              💡 Tip: Enter coupon code "SAVE20" to receive 20% discount on checkout.
            </p>
          </div>

          {/* Pricing calculations details */}
          <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-6 backdrop-blur-md flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
              ORDER SUMMARY
            </h3>

            <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-650 dark:text-slate-350">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-slate-800 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>DISCOUNT (20%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>SHIPPING FEE</span>
                <span className="text-slate-800 dark:text-white">
                  {shipping === 0 ? 'FREE DELIVERY' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase tracking-wide">
                  💡 Tip: Add ${(250 - subtotal).toFixed(2)} more to qualify for Free Shipping!
                </span>
              )}
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-2" />

            <div className="flex justify-between text-sm font-bold text-slate-800 dark:text-white">
              <span className="uppercase tracking-wider">ESTIMATED NET TOTAL</span>
              <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-violet-500 glow-text">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-gradient w-full py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase mt-4 flex items-center justify-center gap-2 group"
            >
              PROCEED TO SECURE CHECKOUT
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
