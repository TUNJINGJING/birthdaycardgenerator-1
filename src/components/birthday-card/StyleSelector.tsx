"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Heart, Briefcase, Smile } from "lucide-react";

export type CardStyle = "warm" | "funny" | "formal" | "cute";

interface StyleSelectorProps {
  selectedStyle: CardStyle;
  onStyleChange: (style: CardStyle) => void;
}

const styles: Array<{
  id: CardStyle;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}> = [
  {
    id: "warm",
    icon: Heart,
    gradient: "from-pink-200 via-orange-200 to-yellow-200",
  },
  {
    id: "funny",
    icon: Smile,
    gradient: "from-red-200 via-yellow-200 via-cyan-200 to-purple-200",
  },
  {
    id: "formal",
    icon: Briefcase,
    gradient: "from-indigo-300 to-purple-400",
  },
  {
    id: "cute",
    icon: Sparkles,
    gradient: "from-pink-200 to-purple-200",
  },
];

export default function StyleSelector({
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  const t = useTranslations("TextToImage.styles");

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {t("title")}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;

          return (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className={`
                relative p-6 rounded-xl transition-all duration-300
                ${
                  isSelected
                    ? "ring-4 ring-blue-500 shadow-xl scale-105"
                    : "ring-2 ring-gray-200 hover:ring-blue-300 hover:shadow-lg"
                }
              `}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-xl opacity-50`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <Icon className={`w-12 h-12 ${isSelected ? 'text-blue-600' : 'text-gray-700'}`} />
                <div className="text-center">
                  <p className="font-bold text-gray-800 text-lg">
                    {t(`${style.id}.title`)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 hidden md:block">
                    {t(`${style.id}.description`)}
                  </p>
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
