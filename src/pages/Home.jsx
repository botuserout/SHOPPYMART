import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProductsThunk, fetchCategoriesThunk, setSelectedCategory } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';
import { showToast, setCartDrawerOpen } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Star, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Shirt, 
  Home as HomeIcon, 
  Footprints, 
  Watch,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Cpu: Cpu,
  Shirt: Shirt,
  Home: HomeIcon,
  Footprints: Footprints,
  Watch: Watch
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isInWishlist = useSelector(selectIsInWishlist(product.id));

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(showToast({ message: `Added ${product.name} to cart!`, type: 'success' }));
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    dispatch(showToast({ 
      message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!', 
      type: isInWishlist ? 'info' : 'success' 
    }));
  };

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="glass-card rounded-3xl overflow-hidden flex flex-col group cursor-pointer relative border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="px-2.5 py-1 bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-md">
            Save ${(product.originalPrice - product.price).toFixed(0)}
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1">
            <Zap className="w-3 h-3 fill-white" /> Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-2xl backdrop-blur-md transition-transform active:scale-95 ${
          isInWishlist 
            ? 'bg-rose-500 text-white shadow-md' 
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800/50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-0.5">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, categories, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);

  const handleCategoryClick = (catId) => {
    dispatch(setSelectedCategory(catId));
    navigate('/products');
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> New Season Arrival
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-indigo-200">Next-Gen</span> Everyday Gear.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Explore curated tech, fashion, & lifestyle products with instant delivery, secure Firebase authentication, and seamless Razorpay test checkout.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-2xl shadow-glow transition-all hover:scale-105 flex items-center gap-2"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products?category=electronics"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold text-sm rounded-2xl transition-all"
            >
              View Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Shop by Category</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pick a category to browse customized products</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Cpu;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="p-6 rounded-3xl glass-card text-center flex flex-col items-center justify-center gap-3 cursor-pointer group hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 transition-all duration-300"
              >
                <div className="p-4 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <IconComp className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-white transition-colors">{cat.name}</h3>
                  <span className="text-xs text-slate-400 group-hover:text-brand-100 transition-colors">{cat.count || 12}+ Items</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> Featured Highlights
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Handpicked top-rated products for you</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-80 rounded-3xl skeleton-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 to-brand-700 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 text-center md:text-left">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md">
            Limited Time Offer
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Get 20% Off Your First Order</h2>
          <p className="text-slate-200 text-sm max-w-md">
            Use code <span className="font-mono font-bold text-amber-300 underline">SKY20</span> at checkout to unlock instant test savings.
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-4 bg-white text-brand-900 font-extrabold text-sm rounded-2xl shadow-lg hover:bg-slate-100 transition-all whitespace-nowrap active:scale-95"
        >
          Claim Discount Now
        </button>
      </section>

      {/* Trending Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Trending Right Now</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Most popular items bought by users this week</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
