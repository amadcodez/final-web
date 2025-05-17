// components/HeroBanner.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    subtitle: "FURNITURE",
    title: "Simple Style",
    desc: "Dining, living, and desk areas serve their purposes in total harmony of style.",
    image: "/images/homev3-slider3.jpg",
    buttonText: "Shop Now",
  },
  {
    id: 2,
    subtitle: "IMAC",
    title: "Abracadabra.",
    desc: "A perfectly poised stand. And blazingly fast Thunderbolt ports.",
    image: "/images/homev3-slider2.jpg",
    buttonText: "Shop Now",
  },
  {
    id: 3,
    subtitle: "SMART DEVICES",
    title: "Enjoy Smart Living",
    desc: "Upgrade your home with intelligent tech essentials for a seamless life.",
    image: "/images/homev3-slider1.jpg",
    buttonText: "Shop Now",
  },
];

const sideBanners = [
  {
    subtitle: "NEW ARRIVALS",
    title: "Stay Comfy",
    desc: "A collection of premium organic pieces.",
    image: "/images/stay-comfy.avif",
    buttonText: "Shop Now",
  },
  {
    subtitle: "FEATURED",
    title: "Smart Toothbrush",
    desc: "A brush that knows you. An app that shows you.",
    image: "/images/kitchen-category.jpg",
    buttonText: "Shop Now",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  // auto‐rotate
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const prev = () => setCurrent((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setCurrent((i) => (i + 1) % slides.length);

  return (
    <section className="px-4 py-8 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ——— MAIN SLIDER ——— */}
        <div className="relative col-span-2 h-[450px] rounded-2xl overflow-hidden shadow-lg">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* full‐bleed background image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={i === 0}
              />

              {/* dark overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-25" />

              {/* text */}
              <div className="absolute top-1/4 left-8 max-w-lg space-y-4 text-white">
                <p className="text-xs uppercase tracking-widest font-bold">
                  {slide.subtitle}
                </p>
                <h2 className="text-4xl font-bold">{slide.title}</h2>
                <p className="text-lg">{slide.desc}</p>
                <Link href="/Shoppage">
                  <button className="mt-4 bg-[#FB7701] text-white px-6 py-3 rounded-md font-medium hover:text-white hover:bg-[#FB8114] transition">
                    {slide.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}

          {/* nav arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >
            ›
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === current ? "bg-[#ffffff]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ——— SIDE BANNERS ——— */}
        <div className="space-y-10">
          {sideBanners.map((b, idx) => (
            <div
              key={idx}
              className="relative h-[200px] rounded-2xl overflow-hidden shadow-lg"
            >
              {/* background */}
              <Image
                src={b.image}
                alt={b.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25" />

              {/* overlay text */}
              <div className="absolute bottom-4 left-4 space-y-1 text-white">
                <p className="text-xs uppercase tracking-wide font-bold">
                  {b.subtitle}
                </p>
                <h3 className="text-lg font-semibold">{b.title}</h3>
                <p className="text-sm">{b.desc}</p>
                <Link href="/Shoppage" className="text-sm font-medium underline">
                  {b.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
