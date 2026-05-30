import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";

export default function PageSlider({ sliders = [], fallbackImage = "/images/about-us.jpg" }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasSliders = sliders.length > 0;

  useEffect(() => {
    if (!hasSliders || sliders.length === 1) return;

    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(id);
  }, [hasSliders, sliders]);

  if (!hasSliders) return null;

  const slide = sliders[currentSlide];
  const imageSrc = slide.image_path?.startsWith("http")
    ? slide.image_path
    : `/storage/${slide.image_path}`;

  return (
    <section className="relative overflow-hidden bg-black">
      <div className="relative h-[260px] md:h-[420px] lg:h-[520px]">
        <img
          src={imageSrc}
          alt={slide.title}
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />

        <div className="relative flex h-full items-center px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl text-white">
            {slide.subtitle && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                {slide.subtitle}
              </p>
            )}
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              {slide.title}
            </h1>
            {slide.button_text && slide.button_link && (
              <Link
                href={slide.button_link}
                className="mt-6 inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                {slide.button_text}
              </Link>
            )}
          </div>
        </div>

        {sliders.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {sliders.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 w-2.5 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/45"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
