'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function TestRegister() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userEmail');
    if (stored) {
      setUserEmail(stored);
      setLoggedIn(true);
    }
    if (window.location.hash === '#register') {
      setActiveTab('register');
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { email, password };

    try {
      if (activeTab === 'register') {
        const res = await fetch('/api/testRegister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Registration failed');
        } else {
          alert('Registered! Please sign in.');
          setActiveTab('login');
          setEmail('');
          setPassword('');
        }
      } else {
        const res = await fetch('/api/testLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Login failed');
        } else {
          localStorage.setItem('userEmail', data.email);
          setUserEmail(data.email);
          setLoggedIn(true);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Network or server error');
    }
  };

  if (loggedIn && userEmail) {
    return (
      <div className="min-h-screen bg-white text-gray-800 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {userEmail.split('@')[0]}</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <aside className="border-r p-6 space-y-4 bg-gray-50">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">
                  {userEmail[0].toUpperCase()}
                </div>
                <p className="mt-2 font-medium text-gray-700">{userEmail.split('@')[0]}</p>
              </div>
              <nav className="space-y-2">
                <a href="#orders" className="block text-gray-700 hover:text-black font-medium">
                  🛍️ Orders History
                </a>
                <a href="#wishlist" className="block text-gray-700 hover:text-black font-medium">
                  ❤️ Wishlist
                </a>
              </nav>
            </aside>

            <main className="col-span-2 p-6 space-y-10">
              <section id="orders">
                <h2 className="text-xl font-semibold mb-2 text-black">Your Orders</h2>
                <p className="text-gray-600">No orders yet.</p>
              </section>

              <section id="wishlist">
                <h2 className="text-xl font-semibold mb-2 text-black">Your Wishlist</h2>
                <p className="text-gray-600">No items in wishlist.</p>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-100 flex justify-center space-x-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-2 font-medium ${
              activeTab === 'login' ? 'text-black border-b-2 border-black' : 'text-gray-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2 font-medium ${
              activeTab === 'register' ? 'text-black border-b-2 border-black' : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-9 right-3 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition"
          >
            {activeTab === 'register' ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="px-6 py-4 text-center text-sm text-gray-500">
          {activeTab === 'login' ? (
            <>
              New here?{' '}
              <button onClick={() => setActiveTab('register')} className="text-black underline">
                Create account
              </button>
            </>
          ) : (
            <>
              Already a member?{' '}
              <button onClick={() => setActiveTab('login')} className="text-black underline">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
