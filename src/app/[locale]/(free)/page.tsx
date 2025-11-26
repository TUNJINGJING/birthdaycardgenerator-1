import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";
import TopHero from "@/components/landingpage/top";
import What from "@/components/landingpage/what";
import How from "@/components/landingpage/how";
import Faq from "@/components/landingpage/faq";
import FeatureHero from "@/components/landingpage/feature";
import { getMetadata } from "@/components/seo/seo";
import Cta from "@/components/landingpage/cta";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "HomePage.seo", "");
}

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const effectId = "2";
  const multiLanguage = "HomePage";
  const multiLanguageOfGenerator = "TextToImage";
  const outputDefaultImage = "/resources/text-to-image.jpg";

  return (
    <main className="flex-grow">
      <section id="create" className="py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <TopHero />
          <WorkerWrapper
            effectId={effectId}
            multiLanguage={multiLanguageOfGenerator}
            outputDefaultImage={outputDefaultImage}
          />
        </div>
      </section>

      <div className="pt-20 md:pt-40 w-full">
        <What multiLanguage={multiLanguage} />
      </div>

      <div className="pt-20 md:pt-40 w-full">
        <How multiLanguage={multiLanguage} />
      </div>

      <div className="pt-20 md:pt-40 w-full">
        <FeatureHero multiLanguage={multiLanguage} />
      </div>

      <div className="pt-20 md:pt-40 w-full">
        <Faq multiLanguage={multiLanguage} grid={true} />
      </div>

      <div className="py-20 md:py-40 w-full">
        <Cta multiLanguage={multiLanguage} />
      </div>
    </main>
  );
}
