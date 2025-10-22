import React from "react";
import { useTranslations } from "next-intl";
import "../birthday-card-v2/styles.css";

export default function TopHero_v2(params: {
  multiLanguage: string;
  locale: string;
}) {
  const t = useTranslations(params.multiLanguage);

  return (
    <section className="v2-hero">
      <h1 className="v2-hero-title">
        {t("top.subTitle")}
      </h1>

      <p className="v2-hero-subtitle">
        {t("top.description")}
      </p>

      <div className="v2-hero-divider" />

      <ul className="v2-hero-features">
        <li>No design skills needed</li>
        <li>AI-powered generation</li>
        <li>Create in 3 minutes</li>
      </ul>
    </section>
  );
}
