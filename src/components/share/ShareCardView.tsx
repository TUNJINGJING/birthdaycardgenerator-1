"use client";

import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import Link from "next/link";

interface ShareCardViewProps {
  predictionId: string;
  shareId: string;
}

export default function ShareCardView({
  predictionId,
  shareId,
}: ShareCardViewProps) {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrediction();
  }, [predictionId]);

  const fetchPrediction = async () => {
    try {
      const response = await fetch(`/api/predictions/${predictionId}`);

      if (!response.ok) {
        throw new Error("Failed to load card");
      }

      const data = await response.json();

      if (data.status === "succeeded" && data.output) {
        setPrediction(data);
      } else if (data.status === "failed") {
        setError("This card failed to generate");
      } else {
        setError("This card is not ready yet");
      }
    } catch (err) {
      console.error("Error fetching prediction:", err);
      setError("Failed to load this birthday card");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/share/${shareId}?prediction_id=${predictionId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDownload = () => {
    if (!prediction?.output) return;

    const imageUrl = Array.isArray(prediction.output) && prediction.output.length > 1
      ? prediction.output[1]
      : prediction.output;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.setAttribute("download", "birthday-card.png");
    link.setAttribute("target", "_blank");
    link.click();
  };

  const handleSocialShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/share/${shareId}?prediction_id=${predictionId}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const text = encodeURIComponent("Check out this birthday card!");

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CircularProgress
          color="primary"
          aria-label="Loading card..."
          classNames={{
            svg: "text-blue-600",
          }}
        />
        <p className="mt-4 text-gray-600">Loading birthday card...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Icon icon="mdi:alert-circle" className="text-red-500" width={64} />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">{error}</h2>
        <p className="mt-2 text-gray-600">
          The card you're looking for might have been removed or doesn't exist.
        </p>
        <Link href="/">
          <Button color="primary" className="mt-6">
            Create Your Own Card
          </Button>
        </Link>
      </div>
    );
  }

  const imageUrl = Array.isArray(prediction.output) && prediction.output.length > 1
    ? prediction.output[1]
    : prediction.output;

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Shared Birthday Card
        </h1>
        <p className="text-gray-600">
          Created with Birthday Card Generator
        </p>
      </div>

      {/* Card Image */}
      <div className="relative group w-full max-w-2xl mb-8">
        <img
          src={imageUrl}
          alt="Birthday Card"
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        {/* Download Button */}
        <Button
          color="primary"
          size="lg"
          onPress={handleDownload}
          startContent={<Icon icon="mdi:download" width={24} />}
          className="w-full"
        >
          Download Card
        </Button>

        {/* Copy Link Button */}
        <Button
          variant="flat"
          size="lg"
          onPress={handleCopyLink}
          startContent={<Icon icon="mdi:link-variant" width={24} />}
          className="w-full"
        >
          Copy Link
        </Button>

        {/* Social Share Buttons */}
        <div className="flex gap-3 mt-2">
          <Button
            size="lg"
            variant="flat"
            isIconOnly
            onPress={() => handleSocialShare("twitter")}
            className="bg-blue-400 text-white hover:bg-blue-500"
          >
            <Icon icon="mdi:twitter" width={24} />
          </Button>
          <Button
            size="lg"
            variant="flat"
            isIconOnly
            onPress={() => handleSocialShare("facebook")}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Icon icon="mdi:facebook" width={24} />
          </Button>
          <Button
            size="lg"
            variant="flat"
            isIconOnly
            onPress={() => handleSocialShare("whatsapp")}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            <Icon icon="mdi:whatsapp" width={24} />
          </Button>
        </div>

        {/* Create Your Own CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-3">Want to create your own?</p>
          <Link href="/">
            <Button color="primary" variant="shadow" size="lg">
              Create Your Birthday Card
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
