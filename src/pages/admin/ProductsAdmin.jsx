import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../schemas/productSchema';
import { 
  fetchProductsThunk, 
  addProductThunk, 
  updateProductThunk, 
  deleteProductThunk 
} from '../../redux/slices/productSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit2, Trash2, X, Package, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsAdmin = () => {
  const dispatch = useDispatch();
  const { items: products, categories, isLoading } = useSelector((state) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    dispatch(fetchProductsThunk());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    reset({
      name: '',
      category: categories[0]?.id || 'electronics',
      price: 99.99,
      originalPrice: 129.99,
      stock: 20,
      brand: 'SkyMart',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      isFeatured: false,
      isTrending: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('category', product.category);
    setValue('price', product.price);
    setValue('originalPrice', product.originalPrice || product.price);
    setValue('stock', product.stock);
    setValue('brand', product.brand || 'SkyMart');
    setValue('description', product.description);
    setValue('imageUrl', product.images[0]);
    setValue('isFeatured', Boolean(product.isFeatured));
    setValue('isTrending', Boolean(product.isTrending));
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      category: data.category,
      price: data.price,
      originalPrice: data.originalPrice,
      stock: data.stock,
      brand: data.brand,
      description: data.description,
      images: [data.imageUrl],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      isFeatured: data.isFeatured,
      isTrending: data.isTrending
    };

    if (editingProduct) {
      await dispatch(updateProductThunk({ id: editingProduct.id, data: payload }));
      dispatch(showToast({ message: 'Product updated successfully!', type: 'success' }));
    } else {
      await dispatch(addProductThunk(payload));
      dispatch(showToast({ message: 'New product added to catalog!', type: 'success' }));
    }

    setIsModalOpen(false);
    reset();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await dispatch(deleteProductThunk(id));
      dispatch(showToast({ message: 'Product removed', type: 'info' }));
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Products Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Add new products, update prices, manage stock quantities & catalog items
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{product.name}</h4>
                      <span className="text-[10px] text-slate-400">ID: {product.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 uppercase font-bold text-brand-600 dark:text-brand-400">{product.category}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{formatCurrency(product.price)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      product.stock > 10 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
                  <select
                    {...register('category')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Brand</label>
                  <input
                    type="text"
                    {...register('brand')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                  />
                  {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('originalPrice')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    {...register('stock')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                  />
                  {errors.stock && <p className="text-xs text-rose-500 mt-1">{errors.stock.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  {...register('imageUrl')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                />
                {errors.imageUrl && <p className="text-xs text-rose-500 mt-1">{errors.imageUrl.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  {...register('description')}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
                />
                {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded accent-brand-600" /> Featured Product
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input type="checkbox" {...register('isTrending')} className="w-4 h-4 rounded accent-brand-600" /> Trending Product
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {editingProduct ? 'Save Product Changes' : 'Create Product'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsAdmin;
