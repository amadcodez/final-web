'use client';
import ProductAnalytics from '@/app/admincomponents/admin/ProductAnalytics';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  itemImages: string[];
  storeID: string;
  vendorName: string;
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'outofstock'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      const res = await fetch('/api/admin/delete-product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (result.success) {
        alert('Product deleted!');
        router.refresh();
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Something went wrong.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      if (activeTab === 'active') return product.quantity > 0;
      if (activeTab === 'outofstock') return product.quantity <= 0;
      return true;
    })
    .filter((product) =>
      product.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const headers = ['Item Name', 'Vendor Name', 'Status', 'Price', 'Quantity'];
    const rows = filteredProducts.map(item => [
      item.itemName,
      item.vendorName,
      item.quantity > 0 ? 'Active' : 'Out of Stock',
      `Rs. ${item.itemPrice}`,
      item.quantity
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.csv';
    link.click();
  };

  return (
    <div className="p-6">
      {/* Move analytics here */}
      <ProductAnalytics />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">All Products</h1>
          <p className="text-sm text-gray-500">Manage your products and view performance</p>
        </div>
        <button onClick={exportCSV} className="bg-black text-white px-4 py-2 rounded-md text-sm">
          Export as CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search product..."
          className="px-4 py-2 border rounded-md text-sm w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="flex gap-2">
          {['all', 'active', 'outofstock'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-1 rounded-full text-sm ${
                activeTab === tab
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveTab(tab as 'all' | 'active' | 'outofstock');
                setCurrentPage(1);
              }}
            >
              {tab === 'all' ? 'All' : tab === 'active' ? 'Active' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Vendor</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Quantity</th>
              <th className="text-left p-4">View</th>
              <th className="text-left p-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-sm text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={item.itemImages?.[0] || '/placeholder.png'}
                      alt="product"
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-medium">{item.itemName}</td>
                  <td className="p-4">{item.vendorName}</td>
                  <td className="p-4">
                    {item.quantity > 0 ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Active</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Out of Stock</span>
                    )}
                  </td>
                  <td className="p-4">Rs. {item.itemPrice}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">
                    <Link
                      href={`/product/${item._id}`}
                      className="text-blue-600 hover:underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </Link>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
