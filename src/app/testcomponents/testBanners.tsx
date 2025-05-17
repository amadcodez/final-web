"use client";
import Image from "next/image";
import Link from "next/link";

export default function TestBanners() {
  const banners = [
    {
      title: "Men’s Fashion",
      subtitle: "Up to 50% Off",
      image: "/images/banners/banner1.jpg",
      link: "/shop?category=mens-fashion",
    },
    {
      title: "New Arrivals",
      subtitle: "Latest Collection",
      image: "/images/banners/banner2.jpg",
      link: "/shop?category=new-arrivals",
    },
    {
      title: "Accessories",
      subtitle: "Trendy Picks",
      image: "/images/banners/banner3.jpg",
      link: "/shop?category=accessories",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner, index) => (
          <Link href={banner.link} key={index}>
            <div className="relative group overflow-hidden rounded-lg shadow hover:shadow-lg transition duration-300">
              <Image
                src={banner.image}
                alt={banner.title}
                width={600}
                height={300}
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-semibold">{banner.title}</h3>
                <p className="text-white text-sm">{banner.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
