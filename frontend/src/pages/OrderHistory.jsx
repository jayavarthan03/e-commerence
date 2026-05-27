import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { ChevronDown, ChevronUp, ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch user orders
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/myorders');
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const toggleExpandOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
      case 'Shipped':
        return 'border-sky-500/20 bg-sky-500/10 text-sky-400';
      case 'Processing':
        return 'border-purple-500/20 bg-purple-500/10 text-purple-400';
      case 'Pending':
      default:
        return 'border-amber-500/20 bg-amber-500/10 text-amber-400';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold uppercase">ORDER HISTORY</h1>
        <TableSkeleton rows={4} cols={5} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
          ORDER LOGS HISTORY
        </h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
          Monitor your tech gear shipping logs and transactions receipts
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-4xl">
            📦
          </div>
          <div>
            <h2 className="text-2xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
              No Orders Found
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              You haven't ordered any hardware sets from Aura yet. Make your first purchase using coupon code!
            </p>
          </div>
        </div>
      ) : (
        /* Orders list table container */
        <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/20">
                  <th className="p-4 pl-6">ORDER ID</th>
                  <th className="p-4">TRANSACTION DATE</th>
                  <th className="p-4">BILLING TOTAL</th>
                  <th className="p-4">LOGISTICS STATUS</th>
                  <th className="p-4">PAYMENT STATUS</th>
                  <th className="p-4 pr-6 text-right">DETAILS</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold">
                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order._id;
                  return (
                    <React.Fragment key={order._id}>
                      <tr className="border-b border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100/30 dark:hover:bg-slate-900/20 transition-all select-none">
                        
                        {/* ID */}
                        <td className="p-4 pl-6 font-mono text-[10px] text-primary-500 uppercase font-bold max-w-[120px] truncate">
                          {order._id}
                        </td>
                        
                        {/* Date */}
                        <td className="p-4 text-slate-600 dark:text-slate-350">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        
                        {/* Price */}
                        <td className="p-4 font-bold text-slate-850 dark:text-slate-100">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        
                        {/* Status */}
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                            {order.paymentStatus}
                          </span>
                        </td>

                        {/* Expand Trigger */}
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => toggleExpandOrder(order._id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                            aria-label="Expand Order details"
                          >
                            {isExpanded ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                          </button>
                        </td>

                      </tr>

                      {/* Collapsible Details Row */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="p-0">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4"
                              >
                                <div className="flex flex-col md:flex-row gap-8 justify-between">
                                  {/* Delivery address details */}
                                  <div className="flex flex-col gap-2">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                      Shipping Delivery Destination
                                    </h4>
                                    <div className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                                      <p>{order.shippingAddress.address}</p>
                                      <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                      <p>{order.shippingAddress.country}</p>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mt-2">
                                      Payment Method: {order.paymentMethod}
                                    </div>
                                  </div>

                                  {/* List of items purchased */}
                                  <div className="flex-1 max-w-md flex flex-col gap-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                      Ordered Line Items
                                    </h4>
                                    <div className="flex flex-col gap-2.5">
                                      {order.products.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center gap-4 text-xs">
                                          <div className="flex items-center gap-2.5">
                                            <img src={item.image} alt={item.title} className="w-8 h-8 object-cover rounded-lg border border-slate-200 dark:border-slate-850" />
                                            <div className="overflow-hidden">
                                              <p className="font-bold truncate max-w-[150px] uppercase text-slate-800 dark:text-slate-100">{item.title}</p>
                                              <p className="text-[10px] text-slate-400">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                                            </div>
                                          </div>
                                          <span className="font-extrabold text-slate-800 dark:text-slate-200">
                                            ${(item.price * item.quantity).toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderHistory;
