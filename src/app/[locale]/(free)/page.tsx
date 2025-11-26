import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";
import TopHero from "@/components/landingpage/top";
import What from "@/components/landingpage/what";
import How from "@/components/landingpage/how";
import Faq from "@/components/landingpage/faq";
import FeatureHero from "@/components/landingpage/feature";
import { getMetadata } from "@/components/seo/seo";
import UserExample from "@/components/landingpage/example";
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
  const effectId = "2";  // 改为使用 text-to-image 的 effect ID
  const multiLanguage = "HomePage";
  const multiLanguageOfGenerator = "TextToImage";  // 使用 TextToImage 的翻译
  const outputDefaultImage = "/resources/text-to-image.jpg";

  return (
    <main className="flex flex-col items-center bg-[#F2F2F2] text-[#111]">
      <div className="py-16 w-full">
        <TopHero multiLanguage={multiLanguage} locale={locale} />
      </div>
      <div className="w-full flex justify-center items-center">
        <WorkerWrapper
          effectId={effectId}
          multiLanguage={multiLanguageOfGenerator}
          outputDefaultImage={outputDefaultImage}
        />
      </div>
      {/* 暂时隐藏示例区域 - 等待真实生日卡片示例
      <div className="pt-20 md:pt-40">
        <UserExample multiLanguage={multiLanguage} images={images} />
      </div>
      */}

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
