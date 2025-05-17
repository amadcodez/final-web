// components/Testcomponent/TestNavbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Search as SearchIcon,
  User,
  Heart,
  ShoppingBag,
  X,
  LogIn,
  UserPlus,
  ArrowLeftRight,
  Package as PackageIcon,
  HelpCircle,
  LogOut,
} from 'lucide-react';

const categories = [
  'All',
  'Home & Garden',
  'Electronics',
  'Toys & Games',
  'Automobiles',
  'Art',
];

export default function TestNavbar() {
  const router = useRouter();
  const [showCats, setShowCats] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // on mount, read auth state
  useEffect(() => {
    const stored = localStorage.getItem('userEmail');
    setUserEmail(stored);
    // listen for changes in other tabs
    const handler = () => setUserEmail(localStorage.getItem('userEmail'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/Shoppage?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    setShowAccount(false);
    router.push('/');
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 py-2 px-4 flex items-center">
        {/* Logo */}
        <div className="text-xl font-semi-bold">
          <a href="/">Best for Shopping</a>
        </div>
        {/* Category dropdown */}
        <div className="relative ml-6">
          <button
            onClick={() => setShowCats(v => !v)}
            className="flex items-center h-10 px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-150"
          >
            <span>All</span>
            <ChevronDown className="ml-1 w-4 h-4 text-gray-600" />
          </button>
          {showCats && (
            <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <ul>
                {categories.map(cat => (
                  <li key={cat}>
                    <Link
                      href={`/Shoppage?category=${encodeURIComponent(cat)}`}
                      onClick={() => setShowCats(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="flex-1 mx-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search for anything"
              className="w-full h-10 pl-4 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-150"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <SearchIcon size={18} className="text-green-600" />
            </button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAccount(true)}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-gray-600"
          >
            <User size={20} />
          </button>
          <Link
            href="/wishlist"
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-gray-600"
          >
            <Heart size={20} />
          </Link>
          <Link
            href="/cart"
            className="flex items-center h-10 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150"
          >
            <ShoppingBag size={18} className="mr-1" />
            <span>Cart</span>
          </Link>
        </div>
      </nav>

      {/* Account Slide-Over */}
      <div className="fixed inset-0 z-50 flex pointer-events-none">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${
            showAccount ? 'opacity-100 pointer-events-auto' : 'opacity-0'
          }`}
          onClick={() => setShowAccount(false)}
        />

        {/* Panel */}
        <div
          className={`relative ml-auto w-full max-w-xs bg-white shadow-xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out ${
            showAccount ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            {userEmail ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                  <User size={20} />
                </div>
                <span className="text-lg font-medium text-gray-800">
                  {userEmail.split('@')[0]}
                </span>
              </div>
            ) : (
              <h2 className="text-lg font-medium text-gray-800">Account</h2>
            )}
            <button
              onClick={() => setShowAccount(false)}
              className="text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {userEmail ? (
              <>
                <Link
                  href="/testregister"
                  className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-gray-100"
                >
                  <User size={20} />
                  <span>My Account</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-gray-100"
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/compare"
                  className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeftRight size={20} />
                  <span>Compare</span>
                </Link>
                <Link
                  href="/track-order"
                  className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-gray-100"
                >
                  <PackageIcon size={20} />
                  <span>Track Order</span>
                </Link>
                <Link
                  href="/help-center"
                  className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-gray-100"
                >
                  <HelpCircle size={20} />
                  <span>Help Center</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 px-2 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/testregister"
                  className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-gray-100"
                >
                  <LogIn size={20} />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/testregister#register"
                  className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-gray-100"
                >
                  <UserPlus size={20} />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
