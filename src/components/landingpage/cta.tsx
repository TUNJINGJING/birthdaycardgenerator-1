"use client";
import { useTranslations } from "next-intl";

export default function Cta(params: { multiLanguage: string }) {
  const t = useTranslations(params.multiLanguage);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="border-b border-black pb-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-end">
        <div className="md:col-span-8">
          <h2 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
            {t("cta.title")}
          </h2>
          <p className="mt-6 text-lg text-gray-500 max-w-xl leading-relaxed">
            {t("cta.description")}
          </p>
        </div>
        <div className="md:col-span-4 flex md:justify-end">
          <button
            onClick={scrollToTop}
            className="inline-block border-b-2 border-black pb-1 text-sm font-bold tracking-widest uppercase transition-colors hover:text-gray-600"
          >
            {t("cta.cta")} ↑
          </button>
        </div>
      </div>
    </div>
  );
}
