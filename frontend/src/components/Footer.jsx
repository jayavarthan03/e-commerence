import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Twitter, Linkedin, Facebook, Send } from 'lucide-react';
import { toast } from './Toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast('Thank you for subscribing! Check your inbox soon.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-dark text-slate-600 dark:text-slate-400 mt-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="font-bold text-xl tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
              ⚡ AURA
            </Link>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              The premier digital playground for cutting-edge gadgets and professional workstations. Curated hardware, premium build standards.
            </p>
            <div className="flex items-center gap-3 mt-2 text-slate-400 dark:text-slate-500">
              <a href="#" className="hover:text-primary-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h4 className="text-slate-800 dark:text-white text-sm font-bold tracking-wider mb-4 uppercase">Categories</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/shop?category=Laptops" className="hover:text-primary-500 hover:underline transition-colors">Laptops & Workstations</Link></li>
              <li><Link to="/shop?category=Audio" className="hover:text-primary-500 hover:underline transition-colors">High-End Audio</Link></li>
              <li><Link to="/shop?category=Wearables" className="hover:text-primary-500 hover:underline transition-colors">Wearable Tech</Link></li>
              <li><Link to="/shop?category=Monitors" className="hover:text-primary-500 hover:underline transition-colors">Displays & Monitors</Link></li>
            </ul>
          </div>

          {/* Corporate Support Links */}
          <div>
            <h4 className="text-slate-800 dark:text-white text-sm font-bold tracking-wider mb-4 uppercase">Support</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/profile" className="hover:text-primary-500 hover:underline transition-colors">User Profile Account</Link></li>
              <li><Link to="/orders" className="hover:text-primary-500 hover:underline transition-colors">Shipping Tracker</Link></li>
              <li><a href="#" className="hover:text-primary-500 hover:underline transition-colors">Warranty & Returns</a></li>
              <li><a href="#" className="hover:text-primary-500 hover:underline transition-colors">Developer REST APIs</a></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-800 dark:text-white text-sm font-bold tracking-wider uppercase">Stay Updated</h4>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Subscribe to unlock early-bird release warnings and active member coupon codes.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="developer@aura.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500/50"
              />
              <button
                type="submit"
                className="btn-gradient p-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        <hr className="border-slate-200 dark:border-slate-800 my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} AURA TECHNOLOGIES INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-500">Privacy Policy</a>
            <a href="#" className="hover:text-primary-500">Terms of Service</a>
            <a href="#" className="hover:text-primary-500">Cookie Preferences</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
