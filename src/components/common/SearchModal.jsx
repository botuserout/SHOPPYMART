import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchModalOpen } from '../../redux/slices/uiSlice';
import { setSearchQuery } from '../../redux/slices/productSlice';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.isSearchModalOpen);
  const products = useSelector((state) => state.products.items);
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setSearchModalOpen(false));
    setQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchQuery(query.trim()));
      handleClose();
      navigate('/products');
    }
  };

  const filteredSuggestions = query.trim()
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const popularKeywords = ['Headphones', 'Smart Watch', 'Backpack', 'Gaming Keyboard', 'Sneakers'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Input Header */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center p-4 border-b border-slate-200 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input
              type="text"
              autoFocus
              placeholder="Search products, categories, brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 text-lg bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          {/* Body content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {query.trim() ? (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Matching Products</h4>
                {filteredSuggestions.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSuggestions.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          handleClose();
                          navigate(`/products/${prod.id}`);
                        }}
                        className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{prod.name}</h5>
                          <span className="text-xs text-brand-600 dark:text-brand-400 font-medium capitalize">{prod.category}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">${prod.price.toFixed(2)}</span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full mt-3 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      See all results for "{query}" <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No products found matching "{query}".
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-500" /> Popular Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        setQuery(kw);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;
