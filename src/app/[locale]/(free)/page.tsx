import WorkerOriginalWrapper from "@/components/replicate/text-to-image/worker-original-wraper";
import TopHero from "@/components/landingpage/top";
import How from "@/components/landingpage/how";
import FeatureHero from "@/components/landingpage/feature";
import Faq from "@/components/landingpage/faq";
import Testimonials from "@/components/landingpage/Testimonials/testimonials";
import Cta from "@/components/landingpage/cta";
import { getMetadata } from "@/components/seo/seo";

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
  const multiLanguageOfGenerator = "TextToImage";
  const outputDefaultImage = "/resources/text-to-image.jpg";

  return (
    <main className="flex-grow">
      {/* Hero Section + AI Card Generator */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <TopHero />
          <div className="mt-16">
            <WorkerOriginalWrapper
              effectId={effectId}
              multiLanguage={multiLanguageOfGenerator}
              outputDefaultImage={outputDefaultImage}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#F2F2F2] py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <How multiLanguage="HomePage" />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <FeatureHero multiLanguage="HomePage" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F2F2F2] py-20 overflow-hidden">
        <Testimonials />
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Faq multiLanguage="HomePage" grid={true} />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#F2F2F2] py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-serif mb-4 text-4xl font-bold">Pricing</h2>
              <p className="text-gray-500">Simple tools. Simple pricing.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:col-span-8 md:grid-cols-2">
              {/* Free Plan */}
              <div className="border border-gray-300 bg-white/50 p-8 transition-colors hover:border-black">
                <h3 className="font-serif mb-2 text-xl font-bold">Free</h3>
                <p className="font-serif mb-6 text-4xl font-bold">$0</p>
                <ul className="mb-8 space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-600">
                  <li>• 3 AI cards/month</li>
                  <li>• Web quality (1K resolution)</li>
                </ul>
                <a
                  href={`/${locale}`}
                  className="inline-block border-b border-black pb-1 text-sm font-bold tracking-widest uppercase transition-colors hover:text-gray-600"
                >
                  Try Free
                </a>
              </div>

              {/* Pro Plan */}
              <div className="border border-black bg-black p-8 text-white">
                <h3 className="font-serif mb-2 text-xl font-bold">Pro</h3>
                <p className="font-serif mb-6 text-4xl font-bold italic">$19.9</p>
                <p className="font-serif -mt-4 mb-6 text-sm text-gray-400">per month</p>
                <ul className="mb-8 space-y-3 border-t border-gray-800 pt-6 text-gray-400">
                  <li>• 30 AI cards/month</li>
                  <li>• High-Res PDF export (4K resolution)</li>
                </ul>
                <a
                  href={`/${locale}/pricing`}
                  className="inline-block border-b border-white pb-1 text-sm font-bold tracking-widest uppercase transition-colors hover:border-gray-300 hover:text-gray-300"
                >
                  Get Pro
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Cta multiLanguage="HomePage" />
        </div>
      </section>
    </main>
  );
}
