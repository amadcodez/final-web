// app/components/testFeaturedCategories.tsx
"use client";

import React from "react";
import Link from "next/link";

const categories = [
  {
    title: "Electronics",
    image: "/images/categories/electronics.jpg",
    slug: "electronics",
  },
  {
    title: "Fashion",
    image: "/images/categories/fashion.jpg",
    slug: "fashion",
  },
  {
    title: "Home & Kitchen",
    image: "/images/categories/home-kitchen.jpg",
    slug: "home-kitchen",
  },
  {
    title: "Sports",
    image: "/images/categories/sports.jpg",
    slug: "sports",
  },
  {
    title: "Beauty",
    image: "/images/categories/beauty.jpg",
    slug: "beauty",
  },
  {
    title: "Toys",
    image: "/images/categories/toys.jpg",
    slug: "toys",
  },
];

export default function TestFeaturedCategories() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">{cat.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
