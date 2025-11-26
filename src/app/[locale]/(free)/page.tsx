import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";
import TopHero from "@/components/landingpage/top";
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
  const multiLanguage = "HomePage";
  const multiLanguageOfGenerator = "TextToImage";
  const outputDefaultImage = "/resources/text-to-image.jpg";

  return (
    <main className="flex-grow">
      {/* Create Card Section */}
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

      {/* Style Gallery Section */}
      <section className="border-y border-gray-300 bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-serif mb-4 text-4xl leading-tight font-bold md:text-5xl">
              Not just one style. <br />
              <i className="text-gray-400">Yours.</i>
            </h2>
            <p className="mt-4 text-gray-500">
              While our interface is clean, your cards don't have to be. Choose from our curated library of aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* The Minimalist */}
            <div className="group cursor-pointer">
              <div className="relative mb-6 flex aspect-[4/5] items-center justify-center overflow-hidden border border-gray-200 bg-[#F3F4F6] transition-colors hover:border-black">
                <span className="font-serif text-4xl text-gray-800">Classic</span>
              </div>
              <h3 className="font-serif text-lg font-bold">The Minimalist</h3>
              <p className="mt-2 text-sm text-gray-500">Timeless typography focused on the message.</p>
            </div>

            {/* The Pop */}
            <div className="group cursor-pointer">
              <div className="relative mb-6 flex aspect-[4/5] items-center justify-center overflow-hidden border border-gray-200 bg-[#FFEFD5] transition-colors hover:border-black">
                <span className="rotate-[-5deg] font-sans text-4xl font-black text-[#FF4500] uppercase">Bold!</span>
              </div>
              <h3 className="font-serif text-lg font-bold">The Pop</h3>
              <p className="mt-2 text-sm text-gray-500">Vibrant colors and bold fonts for high energy.</p>
            </div>

            {/* The Midnight */}
            <div className="group cursor-pointer">
              <div className="relative mb-6 flex aspect-[4/5] items-center justify-center overflow-hidden border border-gray-200 bg-[#1a1a1a] transition-colors hover:border-gray-500">
                <span className="font-serif text-4xl font-light text-white italic">Elegant</span>
              </div>
              <h3 className="font-serif text-lg font-bold">The Midnight</h3>
              <p className="mt-2 text-sm text-gray-500">Dark mode aesthetic for a premium feel.</p>
            </div>
          </div>
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
              {/* Basic Plan */}
              <div className="border border-gray-300 bg-white/50 p-8 transition-colors hover:border-black">
                <h3 className="font-serif mb-2 text-xl font-bold">Basic</h3>
                <p className="font-serif mb-6 text-4xl font-bold">$0</p>
                <ul className="mb-8 space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-600">
                  <li>• Watermarked downloads</li>
                  <li>• Standard styles</li>
                  <li>• Web quality</li>
                </ul>
                <button className="border-b border-black pb-1 text-sm font-bold tracking-widest uppercase">
                  Start Free
                </button>
              </div>

              {/* Pro Plan */}
              <div className="border border-black bg-black p-8 text-white">
                <h3 className="font-serif mb-2 text-xl font-bold">Pro Pass</h3>
                <p className="font-serif mb-6 text-4xl font-bold italic">$4.99</p>
                <ul className="mb-8 space-y-3 border-t border-gray-800 pt-6 text-gray-400">
                  <li>• No watermarks</li>
                  <li>• High-Res Print Ready (PDF)</li>
                  <li>• All premium fonts</li>
                </ul>
                <button className="border-b border-white pb-1 text-sm font-bold tracking-widest uppercase transition-colors hover:border-gray-300 hover:text-gray-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
