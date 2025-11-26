import React from "react";
import { useTranslations } from "next-intl";

export default function TopHero(params: {
  multiLanguage: string;
  locale: string;
}) {
  const t = useTranslations(params.multiLanguage);

  return (
    <section className="z-20 flex flex-col items-center justify-center px-4 border-b border-black pb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 items-end w-full max-w-[1400px]">
        <div className="md:col-span-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] font-bold tracking-tight font-serif">
            Make it<br />
            <i className="font-normal text-[#555]">personal.</i>
          </h1>
        </div>
        <div className="md:col-span-4 text-left md:text-right">
          <p className="text-xs uppercase tracking-widest font-bold mb-2 text-gray-500 font-mono">
            Project: 001
          </p>
          <p className="text-base md:text-lg leading-snug font-sans">
            {t("top.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
