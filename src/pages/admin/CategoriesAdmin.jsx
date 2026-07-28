import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCategoryThunk } from '../../redux/slices/productSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { Layers, Plus, Tag } from 'lucide-react';

const CategoriesAdmin = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.products.categories);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Cpu');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await dispatch(addCategoryThunk({
      name,
      description,
      icon
    }));

    dispatch(showToast({ message: `Category "${name}" created!`, type: 'success' }));
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Categories Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Organize product catalog taxonomies & department listings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Category Form */}
        <form onSubmit={handleAddCategory} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 h-fit">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-brand-500" /> Create New Category
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category Name</label>
            <input
              type="text"
              placeholder="Smart Gadgets"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
            <input
              type="text"
              placeholder="Innovative personal hardware"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Icon Style</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm"
            >
              <option value="Cpu">Electronics (Cpu)</option>
              <option value="Shirt">Fashion (Shirt)</option>
              <option value="Home">Home (Home)</option>
              <option value="Footprints">Footwear (Footprints)</option>
              <option value="Watch">Accessories (Watch)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Create Category
          </button>
        </form>

        {/* Existing Categories List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Active Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</h4>
                  <p className="text-xs text-slate-400">{cat.description || 'Standard product collection'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CategoriesAdmin;
