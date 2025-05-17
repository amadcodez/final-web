"use client";

import React, { useEffect, useState } from "react";

export default function TestDealOfWeek() {
  const [timeLeft, setTimeLeft] = useState("");

  // Set countdown to 3 days from now
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / 1000 / 60) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-yellow-50 py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div className="w-full">
          <img
            src="https://images.unsplash.com/photo-1606813902762-6f6a7f17c7ec"
            alt="Deal of the Week"
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-[#0F6466]">Deal of the Week</h2>
          <p className="text-gray-700">
            Grab this high-quality product at a special discounted price. Limited stock available – hurry up before the deal ends!
          </p>

          {/* Price */}
          <div className="flex items-center gap-4 text-2xl font-semibold">
            <span className="text-red-600">Rs. 2,999</span>
            <span className="line-through text-gray-400 text-lg">Rs. 4,999</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">Save 40%</span>
          </div>

          {/* Countdown */}
          <div className="text-lg font-medium text-gray-800">
            ⏰ Ends in: <span className="text-[#0F6466]">{timeLeft}</span>
          </div>

          <button className="bg-[#0F6466] hover:bg-[#0d4f50] text-white px-6 py-3 mt-4 rounded-md font-medium transition">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
