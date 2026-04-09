import { getTranslations } from "next-intl/server";
import { getDomain } from "@/config/domain";

export async function getMetadata(
  locale: string,
  dir: string,
  canonicalTail: string
) {
  const t = await getTranslations(dir);
  const baseUrl = getDomain();
  let canonical = `${baseUrl}/${locale}`;
  if (locale === "" || locale === "en") {
    canonical = `${baseUrl}` + "/";
  }
  if (canonicalTail !== "") {
    canonical = canonical + canonicalTail;
  }
  return {
    title: t("title"),
    description: t("description"),
    icons: {
      rel: "icon",
      icon: "/logo.jpeg",
    },
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonical,
      siteName: "Birthday Card Generator",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}
