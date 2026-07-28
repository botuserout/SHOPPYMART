import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchProductsThunk, 
  fetchCategoriesThunk, 
  setSelectedCategory, 
  setPriceRange, 
  setMinRating, 
  setInStockOnly, 
  setSortBy, 
  setCurrentPage, 
  resetFilters,
  setSearchQuery
} from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';
import { showToast } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Star, 
  ShoppingBag, 
  Heart, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isInWishlist = useSelector(selectIsInWishlist(product.id));

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="glass-card rounded-3xl overflow-hidden flex flex-col group cursor-pointer relative border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="px-2.5 py-1 bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-md">
            Save ${(product.originalPrice - product.price).toFixed(0)}
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(toggleWishlist(product));
          dispatch(showToast({ 
            message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!', 
            type: isInWishlist ? 'info' : 'success' 
          }));
        }}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-2xl backdrop-blur-md transition-transform active:scale-95 ${
          isInWishlist 
            ? 'bg-rose-500 text-white shadow-md' 
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
      </button>

      <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800/50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-0.5">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart({ product, quantity: 1 }));
              dispatch(showToast({ message: `Added ${product.name} to cart!`, type: 'success' }));
            }}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const dispatch = useDispatch();

  const {
    items: products,
    categories,
    isLoading,
    searchQuery,
    selectedCategory,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
    currentPage,
    itemsPerPage
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchCategory = product.category.toLowerCase().includes(query);
        const matchBrand = product.brand?.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchBrand) return false;
      }

      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Price Range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Min Rating
      if (product.rating < minRating) {
        return false;
      }

      // In Stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [products, searchQuery, selectedCategory, priceRange, minRating, inStockOnly, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Product Catalog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse through our full collection of high quality products
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filter Controls */}
        <aside className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-500" /> Filters
            </h3>
            <button
              onClick={() => dispatch(resetFilters())}
              className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => dispatch(setSelectedCategory('all'))}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Categories
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => dispatch(setSelectedCategory(cat.id))}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Price Range
              </label>
              <span className="font-bold text-brand-600 dark:text-brand-400">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange[1]}
              onChange={(e) => dispatch(setPriceRange([priceRange[0], Number(e.target.value)]))}
              className="w-full accent-brand-600"
            />
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Minimum Rating
            </label>
            <div className="space-y-1">
              {[0, 4, 4.5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => dispatch(setMinRating(stars))}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                    minRating === stars
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {stars === 0 ? 'All Ratings' : `${stars}+ Stars`}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              In Stock Only
            </span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => dispatch(setInStockOnly(e.target.checked))}
              className="w-4 h-4 rounded text-brand-600 accent-brand-600 cursor-pointer"
            />
          </div>

        </aside>

        {/* Main Catalog View */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-900 dark:text-white font-extrabold">{filteredProducts.length}</span> Products
            </span>

            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-80 rounded-3xl skeleton-shimmer" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">No products found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to find what you are looking for.
              </p>
              <button
                onClick={() => dispatch(resetFilters())}
                className="mt-4 px-6 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(setCurrentPage(page))}
                  className={`w-9 h-9 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === page
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default Products;
