export const initialCategories = [
  { id: 'electronics', name: 'Electronics', icon: 'Cpu', count: 24, description: 'Cutting-edge gadgets & personal devices' },
  { id: 'fashion', name: 'Fashion & Apparel', icon: 'Shirt', count: 38, description: 'Trendy outfits & lifestyle accessories' },
  { id: 'home', name: 'Home & Living', icon: 'Home', count: 18, description: 'Modern decor, smart home & furniture' },
  { id: 'footwear', name: 'Footwear & Shoes', icon: 'Footprints', count: 15, description: 'Comfortable sneakers, boots & casual shoes' },
  { id: 'accessories', name: 'Accessories & Watches', icon: 'Watch', count: 29, description: 'Luxury timepieces, bags & eyewear' },
];

export const initialProducts = [
  {
    id: 'prod-1',
    name: 'Aura Wireless Noise-Canceling Headphones',
    category: 'electronics',
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewsCount: 142,
    stock: 25,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Experience pure audio immersion with state-of-the-art hybrid noise cancellation, 40-hour battery life, and crystal-clear acoustic drivers.',
    features: ['Active Noise Cancellation', '40H Playtime', 'Fast USB-C Charging', 'Multipoint Bluetooth 5.3'],
    brand: 'AuraSound',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Apex Smart Watch Series X',
    category: 'electronics',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviewsCount: 98,
    stock: 18,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Track your health, workouts, and notifications seamlessly with an Always-On AMOLED Display and 7-day battery life.',
    features: ['AMOLED HD Screen', 'SpO2 & Heart Rate Tracker', '50m Water Resistance', 'GPS Built-in'],
    brand: 'ApexTech',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Minimalist Artisan Leather Backpack',
    category: 'accessories',
    price: 129.50,
    originalPrice: 159.00,
    rating: 4.9,
    reviewsCount: 64,
    stock: 12,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Crafted from full-grain vegetable-tanned leather. Features padded 15-inch laptop compartment and weather-resistant lining.',
    features: ['Full-Grain Genuine Leather', 'Padded 15" Laptop Sleeve', 'YKK Premium Zippers', 'Ergonomic Straps'],
    brand: 'UrbanCraft',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Vortex Mechanical Gaming Keyboard RGB',
    category: 'electronics',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviewsCount: 210,
    stock: 40,
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Hot-swappable tactile switches, per-key RGB backlighting, aircraft-grade aluminum top plate, and detachable braided cable.',
    features: ['Hot-Swappable Switches', 'Per-Key RGB Customization', 'Aluminum Construction', 'N-Key Rollover'],
    brand: 'Vortex',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Velocity Ultra Running Sneakers',
    category: 'footwear',
    price: 139.99,
    originalPrice: 169.99,
    rating: 4.8,
    reviewsCount: 87,
    stock: 30,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Ultra-lightweight mesh upper coupled with high-rebound foam cushioning for maximum performance and stride energy return.',
    features: ['Breathable Prime Knit', 'High Rebound Cushioning', 'Durable Rubber Outsole', 'Reflective Accents'],
    brand: 'Velocity',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Nordic Ceramic Coffee Set with Wood Tray',
    category: 'home',
    price: 49.99,
    originalPrice: 65.00,
    rating: 4.9,
    reviewsCount: 53,
    stock: 15,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Minimalist handmade matte ceramic cups complete with a natural acacia wood serving tray and bamboo spoons.',
    features: ['Handcrafted Ceramic', 'Natural Acacia Wood Tray', 'Microwave Safe', 'Heat Resistant'],
    brand: 'NordicHome',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Urban Tech Water-Resistant Windbreaker Jacket',
    category: 'fashion',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviewsCount: 41,
    stock: 22,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Sleek modern windbreaker designed for urban mobility with water-repellent shell and hidden storm hood.',
    features: ['DWR Coating', 'Concealable Hood', 'Deep Zip Pockets', 'Lightweight & Packable'],
    brand: 'UrbanWear',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Chronos Classic Chronograph Steel Watch',
    category: 'accessories',
    price: 219.00,
    originalPrice: 279.00,
    rating: 4.9,
    reviewsCount: 115,
    stock: 9,
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Timeless chronograph watch featuring sapphire crystal lens, Japanese quartz movement, and 316L stainless steel bracelet.',
    features: ['Sapphire Glass Crystal', '100m Water Resistance', 'Japanese Quartz Movement', 'Stainless Steel Mesh Strap'],
    brand: 'Chronos',
    createdAt: new Date().toISOString()
  }
];

export const sampleUsers = [
  {
    uid: 'admin-123',
    email: 'admin@skymart.com',
    displayName: 'SkyMart Admin',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'user-456',
    email: 'customer@skymart.com',
    displayName: 'Alex Johnson',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    role: 'customer',
    createdAt: new Date().toISOString()
  }
];
