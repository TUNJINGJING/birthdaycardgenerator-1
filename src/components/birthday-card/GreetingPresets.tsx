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
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{t("title")}</h3>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200
              ${
                selectedCategory === category
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                w-full p-4 text-left rounded-lg transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-50 border-2 border-blue-500 shadow-md"
                    : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }
              `}
            >
              <p
                className={`text-sm leading-relaxed ${
                  isSelected ? "text-blue-900 font-medium" : "text-gray-700"
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
