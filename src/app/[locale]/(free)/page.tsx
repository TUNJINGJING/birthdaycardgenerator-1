import WorkerOriginalWrapper from "@/components/replicate/text-to-image/worker-original-wraper";
import TopHero from "@/components/landingpage/top";
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
      {/* Hero + AI Card Generator */}
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
      <section className="border-y border-gray-300 bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-16 border-b border-black pb-8">
            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              How it works.
            </h2>
            <p className="mt-4 text-gray-500">Three steps. Under three minutes.</p>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <p className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">01</p>
              <h3 className="font-serif text-2xl font-bold mb-3">Choose Your Style</h3>
              <p className="text-gray-500 leading-relaxed">Pick from Warm, Funny, Formal, or Cute. Each style guides the AI to create the right mood for your recipient.</p>
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">02</p>
              <h3 className="font-serif text-2xl font-bold mb-3">Add Your Message</h3>
              <p className="text-gray-500 leading-relaxed">Select from 40+ preset birthday wishes by category, or type your own. The AI weaves your words into the design.</p>
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">03</p>
              <h3 className="font-serif text-2xl font-bold mb-3">Download & Share</h3>
              <p className="text-gray-500 leading-relaxed">Your card is generated in seconds at 1024×1024px. Download the PNG and share it instantly anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#F2F2F2] py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-16 border-b border-black pb-8">
            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              What you get.
            </h2>
            <p className="mt-4 text-gray-500">Everything you need. Nothing you don't.</p>
          </div>
          <div className="grid grid-cols-1 gap-px border border-gray-300 bg-gray-300 md:grid-cols-3">
            {[
              { n: "01", title: "AI-Powered Design", desc: "Every card is uniquely generated—no two are ever the same." },
              { n: "02", title: "4 Beautiful Styles", desc: "Warm, Funny, Formal, or Cute. A style for every personality." },
              { n: "03", title: "50+ Preset Messages", desc: "Carefully crafted birthday wishes by relationship category." },
              { n: "04", title: "3-Minute Creation", desc: "From blank page to finished card in under three minutes." },
              { n: "05", title: "Instant Download", desc: "High-res PNG, ready to print or share on any platform." },
              { n: "06", title: "Privacy First", desc: "Your messages stay yours. We never share your content." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-white p-8">
                <p className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">{n}</p>
                <h3 className="font-serif text-xl font-bold mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 mb-16">
          <div className="border-b border-black pb-8">
            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              What people say.
            </h2>
          </div>
        </div>
        <Testimonials />
      </section>

      {/* FAQ */}
      <section className="bg-[#F2F2F2] py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-16 border-b border-black pb-8">
            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              Questions.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-16">
            {[
              { q: "How do I create my first card?", a: "Choose a style, add your message (or pick from our preset greetings), and click Generate. Your unique card is ready in about 30 seconds." },
              { q: "Is it really free?", a: "Yes. Sign up and get 3 free cards per month. For more creations, check out our Pro plan." },
              { q: "Do I need design skills?", a: "Not at all. If you can type a message, you can create a card. The AI handles everything else." },
              { q: "Can I use the cards commercially?", a: "Free cards are for personal use. Pro subscribers get commercial usage rights. See our Terms of Service for details." },
              { q: "What image quality do I get?", a: "All cards are generated at 1024×1024px—perfect for sharing on social media or printing at home." },
              { q: "Can I save my created cards?", a: "Yes. Sign in to access your card history and re-download any card you've created from your dashboard." },
            ].map(({ q, a }, i) => (
              <details
                key={i}
                className="group border-b border-gray-300 py-6"
              >
                <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold list-none">
                  {q}
                  <span className="ml-4 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-16 border-b border-black pb-8">
            <h2 className="font-serif text-4xl font-bold md:text-5xl">Pricing.</h2>
            <p className="mt-4 text-gray-500">Simple tools. Simple pricing.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-3xl">
            <div className="border border-gray-300 p-8 transition-colors hover:border-black">
              <h3 className="font-serif mb-2 text-xl font-bold">Free</h3>
              <p className="font-serif mb-6 text-4xl font-bold">$0</p>
              <ul className="mb-8 space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-600">
                <li>• 3 AI cards/month</li>
                <li>• 1K resolution PNG</li>
              </ul>
              <a
                href={`/${locale}`}
                className="inline-block border-b border-black pb-1 text-sm font-bold tracking-widest uppercase transition-colors hover:text-gray-600"
              >
                Try Free
              </a>
            </div>
            <div className="border border-black bg-black p-8 text-white">
              <h3 className="font-serif mb-2 text-xl font-bold">Pro</h3>
              <p className="font-serif mb-2 text-4xl font-bold italic">$19.9</p>
              <p className="font-serif mb-6 text-sm text-gray-400">per month</p>
              <ul className="mb-8 space-y-3 border-t border-gray-800 pt-6 text-gray-400">
                <li>• 30 AI cards/month</li>
                <li>• 4K resolution PNG</li>
                <li>• No watermark</li>
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
      </section>

      {/* CTA */}
      <section className="bg-[#F2F2F2] py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Cta multiLanguage="HomePage" />
        </div>
      </section>
    </main>
  );
}
