'use client';

import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: '',
    uid: '',
    proofImage: '',
  });

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Updated Base64 handleProofUpload
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          proofImage: reader.result as string, // Base64 ✅
        }));
      };
      reader.readAsDataURL(file); // ⭐ Converts image to Base64
    }
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com)$/;
    const phoneRegex = /^(0\d{10}|\+92\d{10})$/;
    const transactionIdRegex = /^\d{12}$/;

    if (!nameRegex.test(formData.firstName)) {
      alert('First name should only contain letters and spaces.');
      return false;
    }
    if (formData.lastName && !nameRegex.test(formData.lastName)) {
      alert('Last name should only contain letters and spaces if entered.');
      return false;
    }
    if (!formData.address.trim()) {
      alert('Address is required.');
      return false;
    }
    if (!formData.city.trim()) {
      alert('City is required.');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert('Only Gmail, Hotmail, or Yahoo emails are allowed.');
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      alert('Phone number must start with 0 or +92 and be valid.');
      return false;
    }
    if (paymentMethod === 'online') {
      if (!transactionIdRegex.test(formData.uid)) {
        alert('Transaction UID must be exactly 12 digits.');
        return false;
      }
      if (!formData.proofImage) {
        alert('Please upload payment proof image.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const order = {
      ...formData,
      cartItems,
      total,
      paymentMethod,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await res.json();
      if (data.success) {
        alert('Order placed successfully!');
        localStorage.setItem('orderID', data.orderID);
        localStorage.removeItem('cart');
        window.location.href = '/thank-you';
      } else {
        alert('Failed to save order.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              required
              className="w-full px-4 py-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last Name (optional)"
              className="w-full px-4 py-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <input
            name="address"
            placeholder="Address"
            required
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="city"
              placeholder="City"
              required
              className="w-full px-4 py-2 border rounded"
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone (0xxxxxxxxxx or +92xxxxxxxxxx)"
              required
              className="w-full px-4 py-2 border rounded"
              onChange={handleChange}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="font-semibold">Payment Method</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                /> Cash on Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                /> Online Payment
              </label>
            </div>
          </div>

          {/* Online Payment Details */}
          {paymentMethod === 'online' && (
            <>
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded space-y-3">
                <h3 className="text-lg font-bold text-gray-700">Bank Details:</h3>
                <p><strong>Easypaisa:</strong> 03438125041 - Amad ur Rehman</p>
                <p><strong>JazzCash:</strong> 03056290022 - Amad ur Rehman</p>
                <p><strong>Meezan Bank:</strong> Gujrat Branch</p>
                <p><strong>Account No:</strong> 40010105752254</p>
                <p><strong>IBAN:</strong> PK74MEZN0040010105752254</p>
                <p><strong>Swift Code:</strong> MEZNPKKA</p>
                <p className="text-red-500 text-xs">Please pay and upload proof below.</p>
              </div>

              <input
                name="uid"
                placeholder="Transaction UID (12 digits)"
                className="w-full px-4 py-2 border rounded mt-4"
                onChange={handleChange}
                required={paymentMethod === 'online'}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProofUpload}
                className="w-full mt-2"
              />
              {formData.proofImage && (
                <img
                  src={formData.proofImage}
                  alt="Proof"
                  className="mt-2 w-32 h-32 object-cover border rounded"
                />
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-900"
          >
            Place Order
          </button>
        </form>

        {/* Right Order Summary */}
        <div className="bg-gray-50 p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold mb-4">Your Order</h2>
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between items-center gap-4 border-b pb-2">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-sm text-gray-600">{item.quantity} × Rs.{item.price}</p>
              </div>
              <div className="font-bold">Rs.{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>Total:</span>
            <span>Rs.{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
