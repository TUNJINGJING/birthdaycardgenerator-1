import Price from "@/components/price/app";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "Pricing.seo", "pricing");
}

export default function () {
  return (
    <main className="flex-grow bg-[#F2F2F2]">
      <section className="py-12 md:py-20">
        <Price />
      </section>
    </main>
  );
}
