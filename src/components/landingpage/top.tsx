import React from "react";

export default function TopHero() {
  return (
    <div className="mb-16 grid grid-cols-1 items-end gap-y-8 border-b border-black pb-8 md:grid-cols-12">
      <div className="md:col-span-7">
        <h1 className="font-serif text-6xl leading-[0.95] font-bold tracking-tight md:text-[5.5rem]">
          Craft the<br />
          <i className="font-serif font-normal text-[#555]">perfect moment.</i>
        </h1>
      </div>
      <div className="flex h-full flex-col justify-end pb-2 md:col-span-5 md:pl-10">
        <p className="text-lg leading-relaxed text-gray-600">
          No design skills needed. Perfect for all ages. Make every birthday wish special with personalized cards that truly stand out.
        </p>
      </div>
    </div>
  );
}
