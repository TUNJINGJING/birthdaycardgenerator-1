"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export default function Output({
  error,
  prediction,
  defaultImage,
  showImage,
  generating,
}: {
  error: string;
  prediction: any;
  defaultImage: string;
  showImage: string | null;
  generating: boolean;
}) {
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

  const getStatus = () => {
    if (generating || (prediction && !prediction.output)) {
      return `Status: ${prediction?.status || "Processing"}...`;
    }
    if (prediction && prediction.output) {
      return "Status: Complete";
    }
    return "Status: Waiting for input";
  };

  return (
    <div className="relative flex min-h-[650px] flex-col justify-between overflow-hidden bg-white p-10 shadow-2xl md:p-12">
      {/* Top Meta Bar */}
      <div className="mb-4 flex w-full justify-between border-b border-gray-100 pb-4 font-mono text-xs tracking-widest text-gray-400 uppercase">
        <span>Canvas — Preview</span>
        <span>1080 x 1350 px (4:5)</span>
      </div>

      {/* Main Canvas Area */}
      {prediction && prediction.output ? (
        // Generated Image
        <div className="relative z-10 flex flex-grow flex-col items-center justify-center gap-8">
          <img
            src={
              showImage
                ? showImage
                : Array.isArray(prediction.output) && prediction.output.length > 1
                ? prediction.output[1]
                : prediction.output
            }
            alt="Generated Card"
            className="max-h-[450px] w-auto object-contain"
          />

          {/* Action Buttons */}
          <div className="flex gap-6 items-center">
            <button
              onClick={handleDownload}
              className="group flex items-center gap-3 text-base font-bold transition-all hover:gap-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black transition-colors group-hover:bg-black group-hover:text-white">
                ↓
              </span>
              <span className="text-sm uppercase tracking-wider">Download</span>
            </button>

            <button
              onClick={handleShare}
              disabled={isSharing}
              className="group flex items-center gap-3 text-base font-bold transition-all hover:gap-4 disabled:opacity-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black transition-colors group-hover:bg-black group-hover:text-white">
                ↗
              </span>
              <span className="text-sm uppercase tracking-wider">
                {isSharing ? "Sharing..." : "Share"}
              </span>
            </button>
          </div>

          {/* Social Share Buttons */}
          {shareUrl && (
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleSocialShare("twitter")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                <Icon icon="mdi:twitter" width={18} />
              </button>
              <button
                onClick={() => handleSocialShare("facebook")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                <Icon icon="mdi:facebook" width={18} />
              </button>
              <button
                onClick={() => handleSocialShare("whatsapp")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                <Icon icon="mdi:whatsapp" width={18} />
              </button>
            </div>
          )}
        </div>
      ) : generating || (prediction && !prediction.output) ? (
        // Loading State
        <div className="relative z-10 m-2 flex flex-grow items-center justify-center border border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            <span className="font-mono text-sm uppercase tracking-widest text-gray-400">
              {prediction?.status || "Processing"}
            </span>
          </div>
        </div>
      ) : (
        // Empty State with Dashed Border
        <div className="relative z-10 m-2 flex flex-grow items-center justify-center border border-dashed border-gray-200">
          <h2 className="font-serif px-8 text-center text-5xl leading-tight text-gray-300 italic md:text-6xl">
            "Your typographic<br />masterpiece loads here."
          </h2>
        </div>
      )}

      {/* Bottom Meta Bar */}
      <div className="mt-4 flex w-full justify-between border-t border-gray-100 pt-4 font-mono text-xs text-gray-400">
        <span>{getStatus()}</span>
        <span>Output: PNG / PDF</span>
      </div>

      {/* Error Display */}
      {error && error !== "" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-red-50 border border-red-200 px-6 py-4 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Background Decoration - Large "Aa" */}
      <div className="font-serif pointer-events-none absolute -right-12 -bottom-12 text-[14rem] text-gray-50 italic opacity-60 select-none leading-none">
        Aa
      </div>
    </div>
  );
}
