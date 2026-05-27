import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { TableSkeleton } from '../components/LoadingSkeleton';
import Rating from '../components/Rating';
import {
  LayoutDashboard, ShoppingBag, ClipboardList, Users, Plus, Edit2, Trash2, ArrowRight,
  TrendingUp, CircleDollarSign, PackageCheck, ShieldCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'products', 'orders', 'users'

  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: '',
  });

  // Fetch admin directory data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const pRes = await api.get('/api/products?pageSize=50');
      setProducts(pRes.data.products || []);

      const oRes = await api.get('/api/orders');
      setOrders(oRes.data || []);

      const uRes = await api.get('/api/auth/users');
      setUsers(uRes.data || []);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      toast('Failed to sync administrative directories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 1. PRODUCTS Tab Operations
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setProductForm({
      title: '',
      price: '',
      description: '',
      image: '',
      category: '',
      stock: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setModalMode('edit');
    setSelectedProductId(p._id);
    setProductForm({
      title: p.title || '',
      price: p.price || '',
      description: p.description || '',
      image: p.image || '',
      category: p.category || '',
      stock: p.stock || '',
    });
    setModalOpen(true);
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };

      if (modalMode === 'create') {
        await api.post('/api/products', payload);
        toast(`Product "${payload.title}" created successfully!`, 'success');
      } else {
        await api.put(`/api/products/${selectedProductId}`, payload);
        toast(`Product "${payload.title}" updated successfully!`, 'success');
      }

      setModalOpen(false);
      loadDashboardData();
    } catch (error) {
      toast(error.response?.data?.message || 'Error processing product form.', 'error');
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete product: "${title}"?`)) {
      try {
        await api.delete(`/api/products/${id}`);
        toast(`Product "${title}" removed from catalog.`, 'info');
        loadDashboardData();
      } catch (error) {
        toast('Failed to delete product.', 'error');
      }
    }
  };

  // 2. ORDERS Tab Operations
  const handleUpdateOrderStatus = async (id, currentStatus) => {
    let nextStatus = 'Pending';
    if (currentStatus === 'Pending') nextStatus = 'Processing';
    else if (currentStatus === 'Processing') nextStatus = 'Shipped';
    else if (currentStatus === 'Shipped') nextStatus = 'Delivered';
    else {
      toast('Order already fully delivered.', 'info');
      return;
    }

    try {
      await api.put(`/api/orders/${id}/status`, { orderStatus: nextStatus });
      toast(`Order logistics progressed to: ${nextStatus}`, 'success');
      loadDashboardData();
    } catch (error) {
      toast('Failed to update order status.', 'error');
    }
  };

  // 3. ANALYTICS Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
      case 'Shipped': return 'border-sky-500/20 bg-sky-500/10 text-sky-400';
      case 'Processing': return 'border-purple-500/20 bg-purple-500/10 text-purple-400';
      default: return 'border-amber-500/20 bg-amber-500/10 text-amber-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 relative">
      
      {/* 1. Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
            ADMINISTRATOR DASHBOARD
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
            Control shop inventory, manage client orders and review store metrics
          </p>
        </div>

        {/* Action reload */}
        <button
          onClick={loadDashboardData}
          className="btn-gradient-secondary px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider h-fit"
        >
          Refresh Directories
        </button>
      </div>

      {/* 2. Tab Navigation Selectors */}
      <div className="flex flex-wrap gap-2.5 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md w-fit">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'analytics' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          Store Analytics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'products' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          Products Catalog
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'orders' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}
        >
          <ClipboardList className="w-4.5 h-4.5" />
          Logistics Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'users' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}
        >
          <Users className="w-4.5 h-4.5" />
          Store Users
        </button>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        /* Tab Renders */
        <div>
          
          {/* TAB 1: ANALYTICS OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-8">
              
              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Revenue Card */}
                <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">STORE SALES REVENUE</span>
                    <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1">
                      ${totalRevenue.toFixed(2)}
                    </h3>
                  </div>
                  <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <CircleDollarSign className="w-6 h-6" />
                  </div>
                </div>

                {/* Orders count Card */}
                <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TRANSACTION ORDERS</span>
                    <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1">
                      {orders.length} orders
                    </h3>
                  </div>
                  <div className="p-3.5 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                </div>

                {/* Products count Card */}
                <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CATALOG ITEMS</span>
                    <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1">
                      {products.length} products
                    </h3>
                  </div>
                  <div className="p-3.5 bg-violet-500/10 text-violet-500 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                {/* Users count Card */}
                <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">REGISTERED CLIENTS</span>
                    <h3 className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1">
                      {users.length} clients
                    </h3>
                  </div>
                  <div className="p-3.5 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Graphic performance visualizer */}
              <div className="p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white dark:bg-slate-950/20 backdrop-blur-md relative overflow-hidden flex flex-col gap-6">
                <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-primary-500/5 blur-2xl"></div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-white uppercase tracking-wide">
                    Sales Growth Simulation
                  </h3>
                  <p className="text-xs font-semibold text-slate-450 dark:text-slate-500 mt-1 uppercase tracking-widest">
                    Operational analytics logs
                  </p>
                </div>
                
                {/* Horizontal metrics bars */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-550 dark:text-slate-400">
                      <span>Laptops & Workstations (Sales allocation)</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-900">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-550 dark:text-slate-400">
                      <span>High-End Audio sets</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-900">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-550 dark:text-slate-400">
                      <span>Custom Accessories & Keys</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-900">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG MANAGER */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-4">
              
              {/* Product create trigger button */}
              <div className="flex justify-end">
                <button
                  onClick={handleOpenCreateModal}
                  className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4.5 h-4.5" /> Add New Product
                </button>
              </div>

              {/* Grid spreadsheets */}
              <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/20">
                        <th className="p-4 pl-6">IMAGE</th>
                        <th className="p-4">PRODUCT TITLE</th>
                        <th className="p-4">CATEGORY</th>
                        <th className="p-4">UNIT PRICE</th>
                        <th className="p-4">INVENTORY STOCK</th>
                        <th className="p-4 pr-6 text-right">CATALOG ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {products.map((p) => (
                        <tr key={p._id} className="border-b border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100/30 dark:hover:bg-slate-900/20 transition-all">
                          <td className="p-4 pl-6">
                            <img src={p.image} alt={p.title} className="w-9 h-9 object-cover rounded-lg border border-slate-200 dark:border-slate-850" />
                          </td>
                          <td className="p-4 uppercase truncate max-w-[200px] font-bold text-slate-800 dark:text-white">{p.title}</td>
                          <td className="p-4 uppercase text-slate-500 text-[10px] tracking-wider">{p.category}</td>
                          <td className="p-4 font-bold text-slate-800 dark:text-white">${p.price.toFixed(2)}</td>
                          <td className="p-4">
                            {p.stock === 0 ? (
                              <span className="text-rose-400 font-extrabold uppercase">SOLD OUT</span>
                            ) : (
                              <span className="font-bold">{p.stock} units</span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400"
                                aria-label="Edit Catalog item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.title)}
                                className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10"
                                aria-label="Delete Catalog item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: LOGISTICS ORDERS */}
          {activeTab === 'orders' && (
            <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/20">
                      <th className="p-4 pl-6">ORDER ID</th>
                      <th className="p-4">CLIENT USER</th>
                      <th className="p-4">TRANSACTION PRICE</th>
                      <th className="p-4">PAYMENT STATE</th>
                      <th className="p-4">SHIPPING STATE</th>
                      <th className="p-4 pr-6 text-right">PROGRESS DELIVERY</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {orders.map((o) => (
                      <tr key={o._id} className="border-b border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100/30 dark:hover:bg-slate-900/20 transition-all">
                        <td className="p-4 pl-6 font-mono text-[10px] text-primary-500 font-bold uppercase">{o._id}</td>
                        <td className="p-4">{o.user?.email || 'N/A'}</td>
                        <td className="p-4 font-bold text-slate-800 dark:text-white">${o.totalPrice.toFixed(2)}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getOrderStatusColor(o.orderStatus)}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          {o.orderStatus !== 'Delivered' ? (
                            <button
                              onClick={() => handleUpdateOrderStatus(o._id, o.orderStatus)}
                              className="text-[10px] font-bold text-primary-500 hover:underline uppercase tracking-wider flex items-center gap-1 ml-auto"
                            >
                              Cycle Status <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">COMPLETED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: STORE USERS */}
          {activeTab === 'users' && (
            <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/20">
                      <th className="p-4 pl-6">USER ID</th>
                      <th className="p-4">NAME</th>
                      <th className="p-4">EMAIL</th>
                      <th className="p-4 pr-6 text-right">MEMBERSHIP ROLE</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100/30 dark:hover:bg-slate-900/20 transition-all">
                        <td className="p-4 pl-6 font-mono text-[10px] text-slate-400 uppercase">{u._id}</td>
                        <td className="p-4 uppercase font-bold text-slate-800 dark:text-white">{u.name}</td>
                        <td className="p-4 lowercase">{u.email}</td>
                        <td className="p-4 pr-6 text-right">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${u.role === 'admin' ? 'border-primary-500/20 bg-primary-500/10 text-primary-500' : 'border-slate-350 dark:border-slate-700 text-slate-450 dark:text-slate-400'} uppercase tracking-widest`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. PRODUCT CRUD MODAL OVERLAY */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
                  {modalMode === 'create' ? 'Add New Catalog Product' : 'Modify Product Fields'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleProductFormSubmit} className="flex flex-col gap-4 text-xs font-semibold">
                
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="e.g. Apex Mechanical Keyboard"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g. 149.99"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Inventory Stock</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="e.g. 15"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Category</label>
                    <input
                      type="text"
                      required
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      placeholder="e.g. Accessories"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Image URL</label>
                    <input
                      type="text"
                      required
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="e.g. https://unsplash.com/..."
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Product Description</label>
                  <textarea
                    rows="3"
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Provide realistic tech-specs..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn-gradient w-full py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 mt-4 shadow-md"
                >
                  <ShieldCheck className="w-4.5 h-4.5" />
                  {modalMode === 'create' ? 'ADD NEW PRODUCT' : 'COMMIT CATALOG CHANGES'}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
