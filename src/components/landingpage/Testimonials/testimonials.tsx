"use client";

import React from "react";
import ScrollingBanner from "./scrolling-banner";
import UserReview from "./user-review";
import { testimonials } from "./data";

export default function Testimonials() {
  const topRow = testimonials.slice(0, 10);
  const bottomRow = testimonials.slice(10, 20);

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <ScrollingBanner
          isVertical={false}
          duration={100}
          shouldPauseOnHover={false}
          className="w-full"
        >
          {topRow.map((testimonial, index) => (
            <UserReview
              key={`top-${testimonial.name}-${index}`}
              {...testimonial}
              className="w-[300px] h-[160px]"
            />
          ))}
        </ScrollingBanner>

        <ScrollingBanner
          isVertical={false}
          duration={100}
          shouldPauseOnHover={false}
          className="w-full"
          isReverse
        >
          {bottomRow.map((testimonial, index) => (
            <UserReview
              key={`bottom-${testimonial.name}-${index}`}
              {...testimonial}
              className="w-[300px] h-[160px]"
            />
          ))}
        </ScrollingBanner>
      </div>
    </section>
  );
}
