import React from "react";
import { useTranslations } from "next-intl";
import { Cake, Heart, Sparkles } from "lucide-react";

export default function TopHero(params: {
  multiLanguage: string;
  locale: string;
}) {
  const t = useTranslations(params.multiLanguage);

  return (
    <section className="z-20 flex flex-col items-center justify-center px-4">
      {/* Decorative Icons */}
      <div className="flex items-center gap-6 mb-6">
        <Cake className="w-12 h-12 text-pink-500 animate-bounce" style={{animationDelay: '0s'}} />
        <Heart className="w-10 h-10 text-red-500 animate-bounce" style={{animationDelay: '0.2s'}} />
        <Sparkles className="w-12 h-12 text-yellow-500 animate-bounce" style={{animationDelay: '0.4s'}} />
      </div>

      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
          {t("top.subTitle")}
        </h1>
      </div>

      <p className="text-center text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed mb-8">
        {t("top.description")}
      </p>

      {/* Feature Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
          No Design Skills Needed
        </span>
        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
          AI-Powered
        </span>
        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          3-Minute Creation
        </span>
        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
          Free to Start
        </span>
      </div>
    </section>
  );
}
