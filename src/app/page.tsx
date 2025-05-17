// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Chatbot from './Components/chatbot/Chatbot';
import TestNavbar from './testcomponents/TestNavbar';
import TestHeroBanner from './testcomponents/testHeroBanner';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async (category = '') => {
    try {
      setLoading(true);
      const url = category
        ? `/api/products?category=${encodeURIComponent(category)}`
        : '/api/products';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  // ProductCard component
  const ProductCard = ({ item }: { item: any }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const hasImages = Array.isArray(item.itemImages) && item.itemImages.length > 0;

    const handleNext = (e: React.MouseEvent) => {
      e.preventDefault();
      if (hasImages) setCurrentImage(prev => (prev + 1) % item.itemImages.length);
    };
    const handlePrev = (e: React.MouseEvent) => {
      e.preventDefault();
      if (hasImages) setCurrentImage(prev => prev === 0 ? item.itemImages.length - 1 : prev - 1);
    };

    const discount = item.compareAtPrice && item.compareAtPrice > item.itemPrice
      ? Math.round(((item.compareAtPrice - item.itemPrice) / item.compareAtPrice) * 100)
      : null;

    return (
      <Link href={`/product/${item._id}`}>  
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col h-full">
          <div className="relative h-56 bg-white flex items-center justify-center">
            <img
              src={hasImages ? item.itemImages[currentImage] : '/images/placeholder.png'}
              alt={item.itemName || 'Product'}
              className="w-full h-full object-contain p-4"
            />
            {hasImages && item.itemImages.length > 1 && (
              <>  
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 text-sm"
                >◀</button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 text-sm"
                >▶</button>
              </>
            )}
            {discount && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                {discount}% OFF
              </span>
            )}
          </div>
          <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.itemName}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{item.itemDescription}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[#e91e63] font-bold text-sm">Rs.{item.itemPrice}</span>
              {item.compareAtPrice && item.compareAtPrice > item.itemPrice && (
                <span className="text-gray-400 line-through text-xs">{item.compareAtPrice}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Custom in-page navbar */}
      <TestNavbar />

      {/* Custom hero banner */}
      <TestHeroBanner />

      <main className="bg-white font-[Inter] px-6 md:px-16">
        {/* Category Filters */}
        <section className="py-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Product Categories</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Electronics',
              'Fashion',
              'Home & Kitchen',
              'Beauty & Personal Care',
              'Sports',
              'Furniture'
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full shadow text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#0F6466] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="ml-4 text-sm text-[#0F6466] underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-10 bg-[#fffafd]">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {products.map(item => <ProductCard key={item._id} item={item} />)}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6 md:px-20">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
    {/* Brand */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Covo</h3>
      <p className="text-sm">
        Your one-stop shop for all vendor products, best deals and fast delivery.
      </p>
    </div>

    {/* Explore */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">Explore</h4>
      <ul className="space-y-2">
        {['Shop', 'Sell with Us', 'Deals', 'Vendors'].map((item) => (
          <li key={item}>
            <a href="#" className="hover:text-white transition-colors">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Support */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
      <ul className="space-y-2">
        {['Help Center', 'Shipping', 'Returns', 'Privacy'].map((item) => (
          <li key={item}>
            <a href="#" className="hover:text-white transition-colors">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Connect */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
      <ul className="space-y-2">
        {['Instagram', 'Facebook', 'Twitter', 'YouTube'].map((item) => (
          <li key={item}>
            <a href="#" className="hover:text-white transition-colors">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>

  <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
    &copy; 2025 Covo. All rights reserved.
  </div>
</footer>

      </main>

      {/* Floating ChatBot */}
      <Chatbot />
    </>
  );
}
