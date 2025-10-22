"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Heart, Smile, Briefcase, Sparkles, type LucideIcon } from "lucide-react";
import "./styles.css";

export type CardStyle = "warm" | "funny" | "formal" | "cute";

interface StyleSelectorProps {
  selectedStyle: CardStyle;
  onStyleChange: (style: CardStyle) => void;
}

const styleConfigs: Array<{
  id: CardStyle;
  icon: LucideIcon;
}> = [
  { id: "warm", icon: Heart },
  { id: "funny", icon: Smile },
  { id: "formal", icon: Briefcase },
  { id: "cute", icon: Sparkles },
];

export default function StyleSelector_v2({
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  const t = useTranslations("TextToImage.styles");

  return (
    <div className="v2-section-spacing">
      <label className="v2-section-label">
        {t("title")}
      </label>
      <div className="v2-style-grid">
        {styleConfigs.map((config) => {
          const Icon = config.icon;
          const isSelected = selectedStyle === config.id;

          return (
            <button
              key={config.id}
              onClick={() => onStyleChange(config.id)}
              className={`v2-style-card ${isSelected ? "selected" : ""} ${isSelected ? `selected-${config.id}` : ""}`}
              aria-pressed={isSelected}
            >
              {/* 选中指示器 */}
              {isSelected && (
                <span
                  className={`v2-style-indicator ${config.id}`}
                  aria-hidden="true"
                />
              )}

              {/* 图标 */}
              <Icon
                size={32}
                className={`v2-style-icon ${isSelected ? config.id : ""}`}
              />

              {/* 文字内容 */}
              <div>
                <p className="v2-style-title">
                  {t(`${config.id}.title`)}
                </p>
                <p className="v2-style-description">
                  {t(`${config.id}.description`)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
