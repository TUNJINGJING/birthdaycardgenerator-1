import React from "react";
import { useTranslations } from "next-intl";
import styles from "../birthday-card-v2/styles.module.css";

export default function TopHero_v2(params: {
  multiLanguage: string;
  locale: string;
}) {
  const t = useTranslations(params.multiLanguage);

  return (
    <section className={styles["v2-hero"]}>
      <h1 className={styles["v2-hero-title"]}>
        {t("top.subTitle")}
      </h1>

      <p className={styles["v2-hero-subtitle"]}>
        {t("top.description")}
      </p>

      <div className={styles["v2-hero-divider"]} />

      <ul className={styles["v2-hero-features"]}>
        <li>No design skills needed</li>
        <li>AI-powered generation</li>
        <li>Create in 3 minutes</li>
      </ul>
    </section>
  );
}
