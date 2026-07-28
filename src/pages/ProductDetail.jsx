import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';
import { showToast, setCartDrawerOpen } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Check, 
  Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.products.items);
  const product = products.find(p => p.id === id) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isInWishlist = useSelector(selectIsInWishlist(product?.id));

  // Reviews mock state
  const [reviews, setReviews] = useState([
    { id: 1, name: 'David M.', rating: 5, date: '2 days ago', comment: 'Exceptional build quality and sound experience! Highly recommended.' },
    { id: 2, name: 'Sarah L.', rating: 4, date: '1 week ago', comment: 'Super comfy for long hours, fast shipping as well!' }
  ]);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link to="/products" className="text-brand-600 hover:underline">Back to Catalog</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    dispatch(showToast({ message: `Added ${quantity} x ${product.name} to cart!`, type: 'success' }));
    dispatch(setCartDrawerOpen(true));
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    setReviews([
      { id: Date.now(), name: 'You', rating: newReviewRating, date: 'Just now', comment: newReviewComment },
      ...reviews
    ]);
    setNewReviewComment('');
    dispatch(showToast({ message: 'Review submitted successfully!', type: 'success' }));
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg">
                SAVE ${(product.originalPrice - product.price).toFixed(0)}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? 'border-brand-600 ring-2 ring-brand-500/20' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase">Brand: {product.brand || 'SkyMart'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
              <span className="text-xs text-slate-400">• {reviews.length} Verified Reviews</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> In Stock ({product.stock} units left)
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Features */}
          {product.features && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Key Highlights</h4>
              <ul className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="pt-4 space-y-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-slate-900 dark:text-slate-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  dispatch(toggleWishlist(product));
                  dispatch(showToast({ 
                    message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!', 
                    type: isInWishlist ? 'info' : 'success' 
                  }));
                }}
                className={`p-3.5 rounded-xl border transition-all ${
                  isInWishlist 
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-white' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Cart — {formatCurrency(product.price * quantity)}
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-slate-200 dark:border-slate-800 text-slate-500">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-brand-500" />
              <span className="text-[11px] font-semibold">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[11px] font-semibold">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-5 h-5 text-purple-500" />
              <span className="text-[11px] font-semibold">Easy Returns</span>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Customer Reviews</h3>

        {/* Add Review */}
        <form onSubmit={handleAddReview} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Write a Customer Review</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewReviewRating(star)}
                className="p-1"
              >
                <Star className={`w-5 h-5 ${star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            rows="3"
            placeholder="Share your thoughts about this product..."
            value={newReviewComment}
            onChange={(e) => setNewReviewComment(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-md"
          >
            Submit Review
          </button>
        </form>

        {/* Review list */}
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.name}</span>
                <span className="text-xs text-slate-400">{rev.date}</span>
              </div>
              <div className="flex text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ProductDetail;
