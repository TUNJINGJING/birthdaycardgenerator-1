"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  greetingPresets,
  getGreetingsByCategory,
  type GreetingCategory,
} from "../birthday-card/greetingPresetsData";
import "./styles.css";

interface GreetingPresetsProps {
  onSelectGreeting: (greeting: string) => void;
  selectedGreeting: string;
}

export default function GreetingPresets_v2({
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
    <div className="v2-section-spacing">
      <label className="v2-section-label">
        {t("title")}
      </label>

      {/* 分类标签 */}
      <div className="v2-greeting-tabs">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`v2-greeting-tab ${selectedCategory === category ? "active" : ""}`}
            aria-pressed={selectedCategory === category}
          >
            {t(`categories.${category}`)}
          </button>
        ))}
      </div>

      {/* 祝福语列表 */}
      <div className="v2-greeting-list">
        {filteredGreetings.map((greeting) => {
          const isSelected = selectedGreeting === greeting.content;

          return (
            <button
              key={greeting.id}
              onClick={() => onSelectGreeting(greeting.content)}
              className={`v2-greeting-item ${isSelected ? "selected" : ""}`}
              aria-pressed={isSelected}
            >
              {greeting.content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
