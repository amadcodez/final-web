'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Step 1

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter(); // ✅ Step 2

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleQuantityChange = (index: number, type: 'increase' | 'decrease') => {
    const updated = [...cartItems];
    if (type === 'increase') {
      updated[index].quantity += 1;
    } else if (type === 'decrease' && updated[index].quantity > 1) {
      updated[index].quantity -= 1;
    }
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleRemove = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({cartItems.length} items)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">No items in cart.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-6 border-b pb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 rounded border"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm">Rs.{item.price.toFixed(2)}</p>
                </div>

                {/* ✅ Clean Quantity Controls */}
                <div className="flex items-center border border-gray-400 rounded overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(index, 'decrease')}
                    className="px-4 py-2 text-lg font-semibold text-black bg-white hover:bg-gray-200 focus:outline-none"
                    style={{ backgroundColor: 'white' }}
                  >
                    –
                  </button>
                  <span className="px-5 text-base font-medium text-black bg-white">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(index, 'increase')}
                    className="px-4 py-2 text-lg font-semibold text-black bg-white hover:bg-gray-200 focus:outline-none"
                    style={{ backgroundColor: 'white' }}
                  >
                    +
                  </button>
                </div>

                <div className="w-20 text-right font-bold">
                  Rs.{(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-800 text-xl font-bold p-1 rounded transition-all"
                  style={{ backgroundColor: 'transparent' }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Summary */}
        <div className="bg-gray-50 p-6 rounded shadow-md space-y-4 text-gray-800">
          <div className="flex justify-between text-lg font-medium">
            <span>Subtotal:</span>
            <span>Rs.{subtotal.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-xl font-bold">
            <span>Grand Total:</span>
            <span>Rs.{subtotal.toFixed(2)}</span>
          </div>

          {/* ✅ Check out navigation added here */}
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            Check out
          </button>
        </div>
      </div>
    </div>
  );
}
