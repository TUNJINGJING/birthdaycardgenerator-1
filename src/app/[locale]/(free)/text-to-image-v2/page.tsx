import React from "react";
import TopHero_v2 from "@/components/landingpage-v2/top_v2";
import Worker_v2 from "@/components/birthday-card-v2/worker_v2";
import { getEffectById } from "@/backend/service/effect";
import { Effect } from "@/backend/type/type";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(
    params?.locale || "",
    "TextToImage.seo",
    "text-to-image-v2"
  );
}

export default async function TextToImageV2({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const effectId = "2";
  const multiLanguage = "TextToImage";
  const outputDefaultImage = "/resources/text-to-image.jpg";

  const effect: Effect | null = await getEffectById(Number(effectId));

  if (!effect) {
    return <div>Effect not found</div>;
  }

  return (
    <main className="flex flex-col items-center px-3 md:px-0">
      <div className="pt-10">
        <TopHero_v2 multiLanguage={multiLanguage} locale={locale} />
      </div>
      <div className="w-full flex justify-center items-center pt-3 pb-10">
        <div className="flex flex-col w-full max-w-7xl">
          <Worker_v2
            model={effect.model}
            effect_link_name={effect.link_name}
            version={effect.version}
            credit={effect.credit}
            defaultImage={outputDefaultImage}
            lang={multiLanguage}
          />
        </div>
      </div>

      {/* 设计说明 */}
      <div style={{
        maxWidth: "1200px",
        width: "100%",
        padding: "64px 24px",
        borderTop: "1px solid #E0E0E0",
        marginTop: "64px"
      }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: 600,
          marginBottom: "24px",
          color: "#1A1A1A"
        }}>
          Design v2
        </h2>
        <p style={{
          fontSize: "16px",
          lineHeight: 1.6,
          color: "#666666",
          marginBottom: "16px"
        }}>
          这是基于 <strong>Dieter Rams</strong>（极简工业设计）和 <strong>Josef Müller-Brockmann</strong>（瑞士网格系统）设计理念的改造版本。
        </p>
        <ul style={{
          fontSize: "16px",
          lineHeight: 1.8,
          color: "#666666",
          paddingLeft: "24px"
        }}>
          <li>移除装饰性元素（渐变、弹跳动画、多余阴影）</li>
          <li>使用严格的 8px 网格系统</li>
          <li>颜色从 5 种减少到 3 种主色</li>
          <li>左对齐排版，清晰的信息层次</li>
          <li>功能优先，每个元素都有明确用途</li>
        </ul>

        <div style={{ marginTop: "32px" }}>
          <a
            href={`/${locale}/text-to-image`}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#0066FF",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 500
            }}
          >
            查看原版设计
          </a>
        </div>
      </div>
    </main>
  );
}
