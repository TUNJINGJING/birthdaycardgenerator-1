"use client";

import { Button } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export default function Output({
  error,
  prediction,
  defaultImage,
  showImage,
}: {
  error: string;
  prediction: any;
  defaultImage: string;
  showImage: string | null;
}) {
  const t = useTranslations("PhotoToCartoon.generator");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!prediction?.id) return;

    setIsSharing(true);
    try {
      const response = await fetch("/api/share/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prediction_id: prediction.id }),
      });

      const data = await response.json();

      if (data.shareUrl) {
        const fullUrl = `${window.location.origin}/share/${data.shareId}`;
        setShareUrl(fullUrl);

        // 复制到剪贴板
        await navigator.clipboard.writeText(fullUrl);
        toast.success("Share link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to create share link");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSocialShare = (platform: string) => {
    if (!shareUrl) return;

    const encodedUrl = encodeURIComponent(shareUrl);
    const text = encodeURIComponent("Check out my birthday card!");

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 px-4 mt-8 md:mt-0">
      {error && error !== "" && (
        <div className="flex justify-center items-center text-red-500 mb-4">
          {error}
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        {prediction ? (
          <>
            {prediction.output ? (
              <div className="flex flex-col items-center w-full">
                <div className="flex justify-center items-center relative group rounded-lg w-full">
                  <img
                    src={
                      showImage
                        ? showImage
                        : Array.isArray(prediction.output) &&
                          prediction.output.length > 1
                        ? prediction.output[1]
                        : prediction.output
                    }
                    alt="Result"
                    className="object-contain max-w-full max-h-[420px] rounded-lg"
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      className="bg-black text-white"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = showImage
                          ? showImage
                          : Array.isArray(prediction.output) &&
                            prediction.output.length > 1
                          ? prediction.output[1]
                          : prediction.output;
                        link.setAttribute("download", "birthday-card.png");
                        link.setAttribute("target", "_blank");
                        link.click();
                      }}
                    >
                      {t("output.downloadButton")}
                    </Button>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-4 flex flex-col items-center gap-3 w-full">
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={handleShare}
                    isLoading={isSharing}
                    startContent={<Icon icon="mdi:share-variant" width={20} />}
                    className="w-full max-w-xs"
                  >
                    Share Card
                  </Button>

                  {shareUrl && (
                    <div className="flex gap-2 items-center">
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => handleSocialShare("twitter")}
                        className="bg-blue-400 text-white"
                      >
                        <Icon icon="mdi:twitter" width={20} />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => handleSocialShare("facebook")}
                        className="bg-blue-600 text-white"
                      >
                        <Icon icon="mdi:facebook" width={20} />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => handleSocialShare("whatsapp")}
                        className="bg-green-500 text-white"
                      >
                        <Icon icon="mdi:whatsapp" width={20} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-gray-200 border-2 border-dashed animate-pulse rounded-lg">
                <CircularProgress
                  color="primary"
                  aria-label="Loading..."
                  classNames={{
                    svg: "text-black",
                  }}
                />
                <span className="text-black font-semibold">
                  {prediction.status}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full border-2 border-dashed rounded-lg">
            <img
              src={defaultImage}
              className="object-contain max-w-full max-h-[420px] rounded-lg py-6"
            />
          </div>
        )}
      </div>
    </div>
  );
}
