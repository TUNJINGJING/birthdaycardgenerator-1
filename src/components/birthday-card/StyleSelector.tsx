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
}> = [
  {
    id: "warm",
    icon: Heart,
  },
  {
    id: "funny",
    icon: Smile,
  },
  {
    id: "formal",
    icon: Briefcase,
  },
  {
    id: "cute",
    icon: Sparkles,
  },
];

export default function StyleSelector({
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  const t = useTranslations("TextToImage.styles");

  return (
    <div className="group space-y-2">
      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
        01 / {t("title")}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;

          return (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className={`
                relative p-4 bg-white transition-colors
                ${
                  isSelected
                    ? "border-2 border-black"
                    : "border border-gray-300 hover:border-black"
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className={`w-8 h-8 ${isSelected ? 'text-black' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-black' : 'text-gray-600'}`}>
                    {t(`${style.id}.title`)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
