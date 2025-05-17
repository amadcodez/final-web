// components/testCategoryGrid.tsx

'use client';

import Image from 'next/image';

const categories = [
  {
    title: 'Electronics',
    image: '/images/categories/electronics.jpg',
    link: '/category/electronics',
  },
  {
    title: 'Fashion',
    image: '/images/categories/fashion.jpg',
    link: '/category/fashion',
  },
  {
    title: 'Home & Kitchen',
    image: '/images/categories/home.jpg',
    link: '/category/home-kitchen',
  },
  {
    title: 'Beauty',
    image: '/images/categories/beauty.jpg',
    link: '/category/beauty',
  },
  {
    title: 'Toys',
    image: '/images/categories/toys.jpg',
    link: '/category/toys',
  },
  {
    title: 'Fitness',
    image: '/images/categories/fitness.jpg',
    link: '/category/fitness',
  },
];

export default function TestCategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <a
            href={cat.link}
            key={idx}
            className="group relative rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              width={300}
              height={300}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{cat.title}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
