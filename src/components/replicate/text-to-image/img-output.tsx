"use client";

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
    <div className="bg-white p-12 shadow-xl min-h-[600px] flex flex-col justify-between relative overflow-hidden">
      {/* Top Meta Bar */}
      <div className="w-full border-b border-gray-100 pb-4 mb-4 flex justify-between text-xs text-gray-400 uppercase tracking-widest font-mono">
        <span>Canvas</span>
        <span>1024 x 1024 px</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center relative z-10">
        {error && error !== "" && (
          <div className="text-red-500 text-center font-mono text-sm">{error}</div>
        )}

        {prediction ? (
          <>
            {prediction.output ? (
              <div className="flex flex-col items-center w-full gap-8">
                {/* Generated Image */}
                <div className="relative w-full flex items-center justify-center">
                  <img
                    src={
                      showImage
                        ? showImage
                        : Array.isArray(prediction.output) &&
                          prediction.output.length > 1
                        ? prediction.output[1]
                        : prediction.output
                    }
                    alt="Generated Card"
                    className="object-contain max-w-full max-h-[400px]"
                  />
                </div>

                {/* Action Buttons - Minimalist style */}
                <div className="flex gap-6 items-center">
                  <button
                    onClick={handleDownload}
                    className="group flex items-center gap-3 text-base font-bold hover:gap-4 transition-all"
                  >
                    <span className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors text-lg">
                      ↓
                    </span>
                    <span className="text-sm uppercase tracking-wider">Download</span>
                  </button>

                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="group flex items-center gap-3 text-base font-bold hover:gap-4 transition-all disabled:opacity-50"
                  >
                    <span className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors text-lg">
                      ↗
                    </span>
                    <span className="text-sm uppercase tracking-wider">
                      {isSharing ? "Sharing..." : "Share"}
                    </span>
                  </button>
                </div>

                {/* Social Share Icons - Only show when share URL is available */}
                {shareUrl && (
                  <div className="flex gap-2 items-center pt-2 border-t border-gray-100 w-full justify-center">
                    <button
                      onClick={() => handleSocialShare("twitter")}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Icon icon="mdi:twitter" width={18} />
                    </button>
                    <button
                      onClick={() => handleSocialShare("facebook")}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Icon icon="mdi:facebook" width={18} />
                    </button>
                    <button
                      onClick={() => handleSocialShare("whatsapp")}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-colors"
                      aria-label="Share on WhatsApp"
                    >
                      <Icon icon="mdi:whatsapp" width={18} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Loading State
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                <span className="text-gray-400 font-mono text-sm uppercase tracking-widest">
                  {prediction.status || "processing"}
                </span>
              </div>
            )}
          </>
        ) : (
          // Empty State - Placeholder
          <div className="text-center px-8">
            <h2 className="text-4xl md:text-5xl italic text-gray-300 font-serif leading-tight">
              "The generated design<br />will appear here."
            </h2>
          </div>
        )}
      </div>

      {/* Bottom Meta Bar */}
      <div className="w-full border-t border-gray-100 pt-4 mt-4 flex justify-between text-xs text-gray-400 font-mono">
        <span>x: 0</span>
        <span>y: 0</span>
      </div>

      {/* Background Decoration - Large "Aa" */}
      <div className="absolute -bottom-10 -right-10 text-[12rem] font-serif text-gray-50 opacity-50 pointer-events-none select-none leading-none">
        Aa
      </div>
    </div>
  );
}
