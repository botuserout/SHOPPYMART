import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { showToast } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
    dispatch(showToast({ message: `Moved ${product.name} to cart!`, type: 'success' }));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="py-20 text-center space-y-6 max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Save items you love to your wishlist and revisit them anytime.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Saved Wishlist</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {wishlistItems.length} Saved Product{wishlistItems.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            dispatch(clearWishlist());
            dispatch(showToast({ message: 'Wishlist cleared', type: 'info' }));
          }}
          className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <motion.div 
            key={product.id}
            layout
            className="glass-card rounded-3xl overflow-hidden flex flex-col group cursor-pointer relative border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm"
          >
            <button
              onClick={() => dispatch(removeFromWishlist(product.id))}
              className="absolute top-3 right-3 z-10 p-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div 
              onClick={() => navigate(`/products/${product.id}`)} 
              className="h-56 overflow-hidden bg-slate-100 dark:bg-slate-800/50"
            >
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">{product.category}</span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base line-clamp-1 mt-0.5">{product.name}</h3>
                <span className="font-extrabold text-base text-slate-900 dark:text-white block mt-1">{formatCurrency(product.price)}</span>
              </div>

              <button
                onClick={() => handleMoveToCart(product)}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default Wishlist;
