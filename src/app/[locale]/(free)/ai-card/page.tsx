import WorkerOriginalWrapper from "@/components/replicate/text-to-image/worker-original-wraper";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "HomePage.seo", "");
}

export default function AICardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const effectId = "2";
  const multiLanguageOfGenerator = "TextToImage";
  const outputDefaultImage = "/resources/text-to-image.jpg";

  return (
    <main className="flex-grow bg-[#F2F2F2]">
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-12">
            <h1 className="font-serif text-5xl font-bold leading-tight md:text-6xl">
              AI Card <i className="text-gray-400">Generator</i>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Create personalized birthday cards with AI in seconds.
            </p>
          </div>
          <WorkerOriginalWrapper
            effectId={effectId}
            multiLanguage={multiLanguageOfGenerator}
            outputDefaultImage={outputDefaultImage}
          />
        </div>
      </section>
    </main>
  );
}
