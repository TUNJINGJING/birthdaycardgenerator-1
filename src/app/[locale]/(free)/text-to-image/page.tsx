import React from "react";
import TopHero from "@/components/landingpage/top";
import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(
    params?.locale || "",
    "TextToImage.seo",
    "text-to-image"
  );
}

export default function TextToImage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const effectId = "2";
  const multiLanguage = "TextToImage";
  const outputDefaultImage = "/resources/text-to-image.jpg";

  return (
    <main className="flex-grow">
      <section id="create" className="py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <TopHero />
          <WorkerWrapper
            effectId={effectId}
            multiLanguage={multiLanguage}
            outputDefaultImage={outputDefaultImage}
          />
        </div>
      </section>
    </main>
  );
}
