"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  greetingPresets,
  getGreetingsByCategory,
  type GreetingCategory,
} from "./greetingPresetsData";

interface GreetingPresetsProps {
  onSelectGreeting: (greeting: string) => void;
  selectedGreeting: string;
}

export default function GreetingPresets({
  onSelectGreeting,
  selectedGreeting,
}: GreetingPresetsProps) {
  const t = useTranslations("TextToImage.presets");
  const [selectedCategory, setSelectedCategory] =
    useState<GreetingCategory>("friends");

  const categories: GreetingCategory[] = [
    "friends",
    "family",
    "colleagues",
    "general",
  ];

  const filteredGreetings = getGreetingsByCategory(selectedCategory);

  return (
    <div className="group space-y-2">
      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
        02 / {t("title")}
      </label>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-3 py-1.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors
              ${
                selectedCategory === category
                  ? "bg-black text-white border border-black"
                  : "border border-gray-300 text-gray-500 hover:border-black hover:text-black"
              }
            `}
          >
            {t(`categories.${category}`)}
          </button>
        ))}
      </div>

      {/* Greeting List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredGreetings.map((greeting) => {
          const isSelected = selectedGreeting === greeting.content;

          return (
            <button
              key={greeting.id}
              onClick={() => onSelectGreeting(greeting.content)}
              className={`
                w-full p-3 text-left bg-white transition-colors
                ${
                  isSelected
                    ? "border-2 border-black"
                    : "border border-gray-300 hover:border-black"
                }
              `}
            >
              <p
                className={`text-sm leading-relaxed ${
                  isSelected ? "text-black" : "text-gray-600"
                }`}
              >
                {greeting.content}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
