// src/app/Shoppage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

// ① Import TestNavbar
import TestNavbar from '../testcomponents/TestNavbar';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports',
    'Furniture'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = '';
      if (selectedCategory) query += `category=${encodeURIComponent(selectedCategory)}&`;
      if (sortOption)       query += `sort=${encodeURIComponent(sortOption)}&`;

      const res  = await fetch(`/api/shop-products?${query}`);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortOption]);

  const handleAddToCart = (item: any) => {
    const cartItem = {
      id:       item._id,
      title:    item.itemName,
      price:    item.itemPrice,
      image:    item.itemImages?.[0],
      quantity: 1,
      storeID:  item.storeID,
    };
    const existing = JSON.parse(localStorage.getItem('cart') || '[]');
    existing.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existing));
    router.push('/cart');
  };

  return (
    <>
      {/* ② Render TestNavbar on Shoppage */}
      <TestNavbar />

      <main className="min-h-screen bg-gray-100 p-6 pt-4 md:pt-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Shop All Products
        </h1>

        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-1/4 bg-white rounded-lg shadow p-6 space-y-8">
            {/* Category Filter */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-[#0F6466]">Categories</h2>
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-4 py-2 rounded ${
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
                    className="text-sm text-[#0F6466] underline mt-2"
                  >
                    Clear Category
                  </button>
                )}
              </div>
            </div>

            {/* Price Sorting Filter */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-[#0F6466]">Sort By Price</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSortOption('price-asc')}
                  className="block w-full text-left px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortOption('price-desc')}
                  className="block w-full text-left px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Price: High to Low
                </button>
                {sortOption && (
                  <button
                    onClick={() => setSortOption('')}
                    className="text-sm text-[#0F6466] underline mt-2"
                  >
                    Clear Sort
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <section className="w-full md:w-3/4">
            {loading ? (
              <p className="text-center text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-500">No products found.</p>
            ) : (
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col"
                  >
                    <Link href={`/product/${item._id}`} className="flex flex-col flex-1">
                      <img
                        src={item.itemImages?.[0] || '/images/placeholder.png'}
                        alt={item.itemName}
                        className="h-40 w-full object-contain mb-4 rounded"
                      />
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                        {item.itemName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {item.itemDescription}
                      </p>
                    </Link>

                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[#e91e63] font-bold text-sm">
                        Rs. {item.itemPrice}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center gap-1 bg-[#0F6466] text-white px-3 py-1 rounded-full text-xs hover:bg-[#0d4f50]"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
