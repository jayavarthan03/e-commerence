import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { ShieldCheck, CreditCard, Landmark, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cartItems, total, clearCart, subtotal, discount, shipping } = useCart();
  const navigate = useNavigate();

  // 1. Shipping Form State
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // 2. Fake Credit Card State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);

  // Validate and submit order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Check shipping details
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      toast('Please enter all shipping details.', 'warning');
      return;
    }

    // Check fake card details
    const { number, name, expiry, cvv } = cardDetails;
    if (!number || !name || !expiry || !cvv) {
      toast('Please enter all credit card details.', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Map frontend cart items to schema products format
      const products = cartItems.map((item) => ({
        product: item.product._id,
        title: item.product.title,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const orderData = {
        products,
        shippingAddress,
        totalPrice: total,
        paymentResult: {
          id: 'fake_tx_' + Math.random().toString(36).substr(2, 9),
        },
      };

      const { data } = await api.post('/api/orders', orderData);
      
      toast('Payment Approved! Order placed successfully.', 'success');
      
      // Clear shopping cart
      await clearCart();
      
      // Forward to success splash
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Transaction declined. Try again.';
      toast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Sync shipping inputs
  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // Sync Card inputs
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'number') {
      // Format number to grouped 4 digits
      val = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
      val = val.substring(0, 19); // Cap length
    } else if (name === 'expiry') {
      val = value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim();
      if (val.endsWith('/')) val = val.substring(0, val.length - 1);
      val = val.substring(0, 5); // MM/YY
    } else if (name === 'cvv') {
      val = value.replace(/\D/g, '').substring(0, 3);
    }
    setCardDetails({ ...cardDetails, [name]: val });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 relative">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full spinner-slow mb-4"></div>
          <h2 className="text-xl font-extrabold text-white tracking-wider uppercase">AUTHENTICATING SECURE TRANSACTION</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Verifying funds with banking server...</p>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
          SECURE CHECKOUT
        </h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
          Complete your purchase details under cryptographic encryption
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Forms */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Form */}
          <form onSubmit={handleSubmitOrder} className="flex flex-col gap-8">
            
            {/* 1. Shipping details */}
            <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-6 backdrop-blur-md flex flex-col gap-5">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-850 pb-3.5">
                <Truck className="w-4.5 h-4.5 text-primary-500" />
                1. Delivery Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shippingAddress.address}
                    onChange={handleShippingChange}
                    placeholder="123 Developer Parkway"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    placeholder="San Francisco"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    placeholder="94103"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={shippingAddress.country}
                    onChange={handleShippingChange}
                    placeholder="United States"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Interactive Fake Credit Card payment */}
            <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-6 backdrop-blur-md flex flex-col gap-6">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-850 pb-3.5">
                <CreditCard className="w-4.5 h-4.5 text-primary-500" />
                2. Credit Card Fake Payment Gateway
              </h3>

              {/* Grid with visual card and input form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Visual Glassmorphic Card Mockup */}
                <div className="relative rounded-2xl w-full aspect-[1.6/1] bg-gradient-to-tr from-slate-900 via-primary-950 to-indigo-950 border border-white/10 shadow-2xl p-6 flex flex-col justify-between text-white overflow-hidden select-none">
                  {/* Glowing background circles */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary-500/20 blur-xl"></div>
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-violet-500/20 blur-xl"></div>

                  <div className="flex justify-between items-start z-10">
                    <span className="font-bold text-lg tracking-widest text-primary-400">AURA CARD</span>
                    <Landmark className="w-6 h-6 text-slate-400" />
                  </div>

                  {/* Card Chip graphic */}
                  <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-400 to-amber-200/80 mt-2 shadow-inner"></div>

                  {/* Card Number display */}
                  <div className="font-sans font-bold text-lg sm:text-xl tracking-widest mt-4 text-slate-100 drop-shadow-sm font-mono truncate">
                    {cardDetails.number || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between items-end mt-2 z-10">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Card Holder</span>
                      <span className="text-[10px] font-bold tracking-wider truncate max-w-[120px] uppercase">
                        {cardDetails.name || 'JOHN DOE'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 text-right">
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Expires</span>
                      <span className="text-[10px] font-mono font-bold tracking-widest">
                        {cardDetails.expiry || 'MM/YY'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card input forms */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={cardDetails.name}
                      onChange={handleCardChange}
                      placeholder="JOHN DOE"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Card Number</label>
                    <input
                      type="text"
                      name="number"
                      required
                      value={cardDetails.number}
                      onChange={handleCardChange}
                      placeholder="4000 1234 5678 9010"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Expiration Date</label>
                      <input
                        type="text"
                        name="expiry"
                        required
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Security CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        required
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        placeholder="•••"
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Encryption assurance alert */}
              <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 text-sky-400 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <p className="text-[10px] font-semibold leading-relaxed uppercase tracking-wider">
                  CRYPTOGRAPHIC TRANSPARENCY: Card inputs are processed locally on sandbox servers. Credit information is neither stored nor logged in permanent databases.
                </p>
              </div>

              <button
                type="submit"
                className="btn-gradient w-full py-4 rounded-2xl text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4.5 h-4.5" />
                AUTHORIZE SECURE TRANSACTION & ORDER
              </button>

            </div>

          </form>

        </div>

        {/* Right Column: Order summary overview */}
        <div className="flex flex-col gap-6">
          
          <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-6 backdrop-blur-md flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
              ITEMS ORDER OVERVIEW
            </h3>

            {/* List of items */}
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.title} className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-850" />
                    <div className="overflow-hidden">
                      <h4 className="text-[11px] font-bold truncate text-slate-850 dark:text-slate-200 uppercase max-w-[120px]">{item.product.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-1" />

            {/* Calculations summaries */}
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-650 dark:text-slate-400">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-slate-800 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>DISCOUNT</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>DELIVERY FEE</span>
                <span className="text-slate-800 dark:text-white">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-2" />

            <div className="flex justify-between text-sm font-bold text-slate-800 dark:text-white">
              <span className="uppercase tracking-wider">NET CHARGE TOTAL</span>
              <span className="text-base text-primary-500 font-extrabold">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="text-center mt-2">
              <Link to="/cart" className="text-[10px] font-bold text-slate-400 hover:underline uppercase tracking-wider">
                ← Return to edit Shopping Cart
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
