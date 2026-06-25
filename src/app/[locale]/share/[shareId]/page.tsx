import { Metadata } from "next";
import ShareCardView from "@/components/share/ShareCardView";

export const revalidate = 0;

interface SharePageProps {
  params: {
    locale: string;
    shareId: string;
  };
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://birthdaycardgenerator.com";
    const data = await fetch(`${baseUrl}/api/share/${params.shareId}`, {
      cache: "no-store",
    }).then((res) => (res.ok ? res.json() : null));

    const imageUrl = data?.prediction?.output;

    return {
      title: "Shared Birthday Card | Birthday Card Generator",
      description: "Check out this personalized birthday card created with AI!",
      openGraph: {
        title: "Shared Birthday Card",
        description: "Check out this personalized birthday card created with AI!",
        images: imageUrl ? [imageUrl] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Shared Birthday Card",
        description: "Check out this personalized birthday card created with AI!",
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching shared card for metadata:", error);
    return {
      title: "Birthday Card | Birthday Card Generator",
      description: "Check out this personalized birthday card!",
    };
  }
}

export default function SharePage({ params }: SharePageProps) {
  const { shareId } = params;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-4xl">
        <ShareCardView shareId={shareId} />
      </div>
    </main>
  );
}
