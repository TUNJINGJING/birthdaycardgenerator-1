"use client";

import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import Link from "next/link";

interface ShareCardViewProps {
  shareId: string;
}

interface SharedPrediction {
  id: string;
  status: string;
  output: string | null;
}

export default function ShareCardView({ shareId }: ShareCardViewProps) {
  const [prediction, setPrediction] = useState<SharedPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSharedCard();
  }, [shareId]);

  const fetchSharedCard = async () => {
    try {
      const response = await fetch(`/api/share/${shareId}`);

      if (!response.ok) {
        throw new Error("Failed to load card");
      }

      const data = await response.json();
      const sharedPrediction = data.prediction as SharedPrediction | undefined;

      if (sharedPrediction?.status === "succeeded" && sharedPrediction.output) {
        setPrediction(sharedPrediction);
      } else if (sharedPrediction?.status === "failed") {
        setError("This card failed to generate");
      } else {
        setError("This card is not ready yet");
      }
    } catch (err) {
      console.error("Error fetching shared card:", err);
      setError("Failed to load this birthday card");
    } finally {
      setLoading(false);
    }
  };

  const getShareUrl = () => `${window.location.origin}/share/${shareId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDownload = () => {
    if (!prediction?.output) return;

    const link = document.createElement("a");
    link.href = prediction.output;
    link.setAttribute("download", "birthday-card.png");
    link.setAttribute("target", "_blank");
    link.click();
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(getShareUrl());
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

  if (!prediction?.output) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Shared Birthday Card
        </h1>
        <p className="text-gray-600">
          Created with Birthday Card Generator
        </p>
      </div>

      <div className="relative group w-full max-w-2xl mb-8">
        <img
          src={prediction.output}
          alt="Birthday Card"
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <Button
          color="primary"
          size="lg"
          onPress={handleDownload}
          startContent={<Icon icon="mdi:download" width={24} />}
          className="w-full"
        >
          Download Card
        </Button>

        <Button
          variant="flat"
          size="lg"
          onPress={handleCopyLink}
          startContent={<Icon icon="mdi:link-variant" width={24} />}
          className="w-full"
        >
          Copy Link
        </Button>

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
