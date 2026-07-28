import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProductsThunk, fetchCategoriesThunk, setSelectedCategory } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';
import { showToast } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Star, 
  ShieldCheck, 
  Zap, 
  Gamepad2,
  Cpu, 
  Shirt, 
  Home as HomeIcon, 
  Footprints, 
  Watch,
  Check,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Gamepad2: Gamepad2,
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
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex flex-col cursor-pointer transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-850">
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-2.5 py-1 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-[9px] uppercase tracking-wider rounded-lg shadow-sm border border-slate-800 dark:border-slate-200">
              Save {((1 - product.price / product.originalPrice) * 100).toFixed(0)}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 bg-amber-500 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1 border border-amber-600">
              <Zap className="w-2.5 h-2.5 fill-white" /> Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all active:scale-95 shadow-sm border ${
            isInWishlist 
              ? 'bg-rose-500 border-rose-600 text-white' 
              : 'bg-white/95 dark:bg-slate-900/95 border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:scale-105'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
          loading="lazy"
        />
      </div>

      {/* Card Details */}
      <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            {product.category}
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] font-semibold text-slate-400">({product.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-semibold">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-3 py-1.5 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
          >
            <ShoppingBag className="w-3 h-3" /> Add
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
    <div className="space-y-16 pb-12 max-w-7xl mx-auto">
      
      {/* 1. Stripe/Apple Style Carbon Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 dark:bg-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-xl">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        {/* Glowing background gradient accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> New Season Drop
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
            Discover <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Next-Gen</span> Everyday Gear.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg font-medium">
            Explore curated tech, fashion, and lifestyle products built for the modern consumer. Free shipping, instant fallback local validation, and 100% simulated secure checkouts.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="px-6 py-3.5 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.01] flex items-center gap-2"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products?category=electronics"
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-all"
            >
              View Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-100 dark:border-slate-900 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">Shop by Category</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pick a category to browse customized products</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Cpu;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-brand-500/50 dark:hover:border-brand-400/50 group"
              >
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 group-hover:bg-brand-500/10 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">{cat.name}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{cat.count || 12}+ Items</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Highlights */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-100 dark:border-slate-900 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5.5 h-5.5 text-amber-500 fill-amber-500" /> Featured Highlights
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Handpicked top-rated products for you</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All Items <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="aspect-[3/4] rounded-2xl skeleton-shimmer" />
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

      {/* 4. Minimalist Promo Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 dark:bg-slate-900/60 border border-slate-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
        {/* Soft glowing accent blob */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="space-y-3 text-center md:text-left z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            <Tag className="w-3 h-3" /> Special Promo
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Get 20% Off Your First Purchase</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md">
            Use simulated coupon code <span className="font-mono font-bold text-amber-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">SKY20</span> during payment checkout for instant discount savings.
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3.5 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap z-10"
        >
          Claim Discount Now
        </button>
      </section>

      {/* 5. Trending Products */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-100 dark:border-slate-900 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">Trending Right Now</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Most popular items bought by users this week</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            Explore All <ArrowRight className="w-3.5 h-3.5" />
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
