'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const relRes = await fetch('/api/products');
        const allProducts = await relRes.json();
        const filtered = allProducts.filter((p: any) => p._id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cartItem = {
      id: product._id,
      title: product.itemName,
      price: product.itemPrice,
      image: product.itemImages?.[0],
      quantity: 1,
      storeID: product.storeID,
    };
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));
    router.push('/cart');
  };

  const handleBuyNow = () => {
    const item = {
      id: product._id,
      title: product.itemName,
      price: product.itemPrice,
      image: product.itemImages?.[0],
      quantity: 1,
      storeID: product.storeID,
    };
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const alreadyExists = existingCart.find((i: any) => i.id === item.id);
    if (!alreadyExists) existingCart.push(item);
    localStorage.setItem('cart', JSON.stringify(existingCart));
    router.push('/checkout');
  };

  const handleNext = () => {
    if (product?.itemImages?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.itemImages.length);
    }
  };

  const handlePrev = () => {
    if (product?.itemImages?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.itemImages.length - 1 : prev - 1
      );
    }
  };

  if (!product) return <p className="text-center mt-20">Loading product...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Main Image Carousel */}
        <div>
          <div className="relative group">
            <img
              src={product.itemImages?.[currentImageIndex] || '/images/placeholder.png'}
              alt={`Product image ${currentImageIndex + 1}`}
              className="w-full rounded-lg shadow object-cover h-[500px] transition-all duration-300"
            />
            {/* Left arrow */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 z-10"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            {/* Right arrow */}
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 z-10"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide pr-2">
            {(product.itemImages || []).map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-20 w-20 object-cover rounded border cursor-pointer transition ${
                  currentImageIndex === index ? 'border-pink-500' : 'border-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.itemName}</h1>
          <p className="text-sm text-gray-500 mb-4">Product ID: {product._id}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-pink-600">Rs.{product.itemPrice}</span>
            {product.compareAtPrice && product.compareAtPrice > product.itemPrice && (
              <>
                <span className="text-xl line-through text-gray-400">Rs.{product.compareAtPrice}</span>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  Save {Math.round(((product.compareAtPrice - product.itemPrice) / product.compareAtPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <div className="text-md text-gray-700 leading-relaxed space-y-4 mb-6">
            {product.itemDescription?.split('\n').map((para: string, i: number) => (
              <p key={i}>{para}</p>
            )) || <p>No description available.</p>}
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="bg-pink-600 text-white px-6 py-3 rounded-md shadow hover:bg-pink-700"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="text-pink-600 border border-pink-600 px-6 py-3 rounded-md hover:bg-pink-50"
            >
              Buy Now
            </button>
          </div>

          <ul className="text-sm text-gray-600 space-y-1">
            <li>🚚 Free delivery available</li>
            <li>✅ Return policy: 7-day easy return</li>
            <li>🔒 Secure checkout</li>
          </ul>
        </div>
      </div>

      {/* ✅ Related Products Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
          <Link href="/products" className="text-sm text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedProducts.map((item: any) => (
            <Link key={item._id} href={`/product/${item._id}`}>
              <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
                <img
                  src={item.itemImages?.[0] || '/images/placeholder.png'}
                  alt={item.itemName}
                  className="h-40 w-full object-cover rounded mb-3"
                />
                <h3 className="text-sm font-semibold text-gray-700 truncate">{item.itemName}</h3>
                <p className="text-pink-600 font-bold mt-1">Rs.{item.itemPrice}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
