"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/images/banner-4.png",
    objectPosition: "center",
  },
  {
    src: "/images/banner-5.png",
    objectPosition: "center",
  },
  {
    src: "/images/banner-6.png",
    objectPosition: "center",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="bg-(--primary)/95 pt-24 pb-8">
      <div className="relative w-full max-w-7xl mx-auto h-[250px] md:h-[700px] overflow-hidden shadow-2xl">

        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={slide.src}
              alt={`slide-${index}`}
              fill
              priority={index === 0}
              className="object-cover"
              style={{
                objectPosition: slide.objectPosition,
              }}
            />
          </div>
        ))}

        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="
    absolute left-2 md:left-4 top-1/2 -translate-y-1/2
    p-2 md:p-3
    rounded-full
    bg-white/10 backdrop-blur-md
    border border-white/20
    hover:bg-white/20 hover:scale-105
    active:scale-95
    transition-all duration-300
    shadow-lg
    flex items-center justify-center
    z-10
  "
        >
          <ChevronLeft className="w-4 h-4 md:w-8 md:h-8 text-white" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="
    absolute right-2 md:right-4 top-1/2 -translate-y-1/2
    p-2 md:p-3
    rounded-full
    bg-white/10 backdrop-blur-md
    border border-white/20
    hover:bg-white/20 hover:scale-105
    active:scale-95
    transition-all duration-300
    shadow-lg
    flex items-center justify-center
    z-10
  "
        >
          <ChevronRight className="w-4 h-4 md:w-8 md:h-8 text-white" />
        </button>
        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-3 w-3 rounded-full transition-all ${i === current
                  ? "bg-yellow-400 scale-110"
                  : "bg-white/60"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}