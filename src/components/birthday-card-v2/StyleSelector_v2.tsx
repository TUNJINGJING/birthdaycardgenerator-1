"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Heart, Smile, Briefcase, Sparkles } from "lucide-react";
import styles from "./styles.module.css";

export type CardStyle = "warm" | "funny" | "formal" | "cute";

interface StyleSelectorProps {
  selectedStyle: CardStyle;
  onStyleChange: (style: CardStyle) => void;
}

const styleConfigs: Array<{
  id: CardStyle;
  icon: React.ComponentType<{ className?: string; size?: number }>;
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
    <div className={styles["v2-section-spacing"]}>
      <label className={styles["v2-section-label"]}>
        {t("title")}
      </label>
      <div className={styles["v2-style-grid"]}>
        {styleConfigs.map((config) => {
          const Icon = config.icon;
          const isSelected = selectedStyle === config.id;

          return (
            <button
              key={config.id}
              onClick={() => onStyleChange(config.id)}
              className={`
                ${styles["v2-style-card"]}
                ${isSelected ? styles.selected : ""}
                ${isSelected ? styles[`selected-${config.id}`] : ""}
              `}
              aria-pressed={isSelected}
            >
              {/* 选中指示器 */}
              {isSelected && (
                <span
                  className={`${styles["v2-style-indicator"]} ${styles[config.id]}`}
                  aria-hidden="true"
                />
              )}

              {/* 图标 */}
              <Icon
                size={32}
                className={`${styles["v2-style-icon"]} ${isSelected ? styles[config.id] : ""}`}
              />

              {/* 文字内容 */}
              <div>
                <p className={styles["v2-style-title"]}>
                  {t(`${config.id}.title`)}
                </p>
                <p className={styles["v2-style-description"]}>
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
