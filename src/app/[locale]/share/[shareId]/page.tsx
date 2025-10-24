import { Metadata } from "next";
import { notFound } from "next/navigation";
import ShareCardView from "@/components/share/ShareCardView";

export const revalidate = 0;

interface SharePageProps {
  params: {
    locale: string;
    shareId: string;
  };
  searchParams: {
    prediction_id?: string;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: SharePageProps): Promise<Metadata> {
  const predictionId = searchParams.prediction_id;

  if (!predictionId) {
    return {
      title: "Birthday Card | Birthday Card Generator",
      description: "Check out this personalized birthday card!",
    };
  }

  // Fetch prediction to get the image URL for Open Graph
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://birthdaycardgenerator.com";
    const prediction = await fetch(
      `${baseUrl}/api/predictions/${predictionId}`,
      { cache: "no-store" }
    ).then((res) => res.json());

    const imageUrl = Array.isArray(prediction.output) && prediction.output.length > 1
      ? prediction.output[1]
      : prediction.output;

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
    console.error("Error fetching prediction for metadata:", error);
    return {
      title: "Birthday Card | Birthday Card Generator",
      description: "Check out this personalized birthday card!",
    };
  }
}

export default function SharePage({ params, searchParams }: SharePageProps) {
  const { shareId } = params;
  const predictionId = searchParams.prediction_id;

  if (!predictionId) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-4xl">
        <ShareCardView predictionId={predictionId} shareId={shareId} />
      </div>
    </main>
  );
}
