"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export default function OutputOriginal({
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = showImage
      ? showImage
      : Array.isArray(prediction.output) && prediction.output.length > 1
      ? prediction.output[1]
      : prediction.output;
    link.setAttribute("download", "birthday-card.png");
    link.setAttribute("target", "_blank");
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Error Message */}
      {error && error !== "" && (
        <div className="mb-4 border border-red-300 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Output Container with Meta Bars */}
      <div className="relative flex min-h-[500px] flex-col justify-between bg-white border border-gray-300 p-8">
        {/* Top Meta Bar */}
        <div className="mb-4 flex w-full justify-between border-b border-gray-200 pb-3 font-mono text-xs tracking-widest text-gray-400 uppercase">
          <span>Output — Preview</span>
          <span>1024 × 1024 px</span>
        </div>

        {/* Main Output Area */}
        <div className="flex-grow flex items-center justify-center">
          {prediction ? (
            <>
              {prediction.output ? (
                <div className="flex flex-col items-center w-full gap-6">
                  {/* Image Display */}
                  <div className="flex justify-center items-center w-full">
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
                      className="object-contain max-w-full max-h-[420px]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                      onClick={handleDownload}
                      className="w-full bg-black text-white py-3 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-gray-800"
                    >
                      {t("output.downloadButton")}
                    </button>

                    <button
                      onClick={handleShare}
                      disabled={isSharing}
                      className="w-full border border-gray-300 bg-white text-black py-3 text-xs font-bold tracking-widest uppercase transition-colors hover:border-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSharing ? (
                        <>
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:share-variant" width={16} />
                          Share Card
                        </>
                      )}
                    </button>

                    {/* Social Share Buttons */}
                    {shareUrl && (
                      <div className="flex gap-2 justify-center pt-2">
                        <button
                          onClick={() => handleSocialShare("twitter")}
                          className="p-2 border border-gray-300 hover:border-black transition-colors"
                          aria-label="Share on Twitter"
                        >
                          <Icon icon="mdi:twitter" width={20} />
                        </button>
                        <button
                          onClick={() => handleSocialShare("facebook")}
                          className="p-2 border border-gray-300 hover:border-black transition-colors"
                          aria-label="Share on Facebook"
                        >
                          <Icon icon="mdi:facebook" width={20} />
                        </button>
                        <button
                          onClick={() => handleSocialShare("whatsapp")}
                          className="p-2 border border-gray-300 hover:border-black transition-colors"
                          aria-label="Share on WhatsApp"
                        >
                          <Icon icon="mdi:whatsapp" width={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Loading State
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
                  <span className="font-mono text-xs tracking-widest text-gray-600 uppercase">
                    {prediction.status}
                  </span>
                </div>
              )}
            </>
          ) : (
            // Default Image (No prediction yet)
            <div className="flex items-center justify-center w-full">
              <img
                src={defaultImage}
                alt="Default preview"
                className="object-contain max-w-full max-h-[420px] opacity-30"
              />
            </div>
          )}
        </div>

        {/* Bottom Meta Bar */}
        <div className="mt-4 flex w-full justify-between border-t border-gray-200 pt-3 font-mono text-xs text-gray-400">
          <span>
            Status: {prediction ? (prediction.output ? "Complete" : prediction.status) : "Awaiting input"}
          </span>
          <span>Format: PNG</span>
        </div>
      </div>
    </div>
  );
}
