"use client";

import React, { useState, useEffect } from "react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import Output from "@/components/replicate/text-to-image/img-output";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import { useTranslations } from "next-intl";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const stylePrompts = {
  minimalist: "minimalist clean modern birthday card with simple typography, neutral colors, elegant spacing, contemporary aesthetic, ",
  playful: "playful fun energetic birthday card with vibrant colors, dynamic composition, joyful elements, cheerful vibe, ",
  elegant: "elegant sophisticated birthday card with refined typography, premium feel, luxurious aesthetic, classy celebration, "
};

export default function Worker(props: {
  model: string;
  effect_link_name: string;
  version: string | null;
  credit: number;
  promptTips?: string;
  defaultImage?: string;
  lang?: string;
}) {
  const [recipientName, setRecipientName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof stylePrompts>("minimalist");
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const width = 1024;
  const height = 1024;
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const { user } = useAppContext();
  const router = useRouter();
  const t = useTranslations(props.lang || "index");

  useEffect(() => {
    if (user?.uuid) {
      fetchUserSubscriptionInfo();
    }
  }, [user?.uuid]);

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    const userSubscriptionInfo = await fetch(
      "/api/user/get_user_subscription_info",
      {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
      }
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user subscription info");
      return res.json();
    });
    setUserSubscriptionInfo(userSubscriptionInfo);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    let newPrediction: Prediction;
    if (props.credit > 0) {
      if (
        typeof userSubscriptionInfo?.remain_count === "number" &&
        userSubscriptionInfo.remain_count < props.credit
      ) {
        toast.warning(t("errors.noCredit"));
        return;
      }
    }

    if (message.length === 0) {
      toast.warning("Please enter a birthday message");
      return;
    }

    const nameText = recipientName ? `for ${recipientName}` : "";
    const enhancedPrompt = `${stylePrompts[selectedStyle]}birthday card ${nameText} with text: "${message}", creative typography, celebration theme, high quality design`;

    try {
      setGenerating(true);
      const response = await fetch("/api/predictions/text_to_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: props.model,
          version: props.version,
          prompt: enhancedPrompt,
          width,
          height,
          output_format: "png",
          aspect_ratio: "1:1",
          user_id: user?.uuid,
          user_email: user?.email,
          effect_link_name: props.effect_link_name,
          credit: props.credit,
        }),
      });

      newPrediction = await response.json();
      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });
      if (!canContinue) {
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    } catch (error) {
      console.error("Error generating card:", error);
      toast.error("An error occurred while generating the card.");
      setGenerating(false);
      return;
    }

    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(1500);
      const response = await fetch("/api/predictions/" + newPrediction.id);
      newPrediction = await response.json();
      if (response.status !== 200) {
        setError(newPrediction.detail);
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    }

    const runningTime =
      (newPrediction.created_at
        ? new Date().getTime() - new Date(newPrediction.created_at).getTime()
        : -1) / 1000;

    const imageUrl = Array.isArray(newPrediction.output) && newPrediction.output.length > 1
      ? newPrediction.output[1]
      : newPrediction.output || "";

    fetch("/api/effect_result/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_id: newPrediction.id,
        status: newPrediction.status,
        running_time: runningTime,
        updated_at: new Date(),
        original_image_url: imageUrl,
        object_key: newPrediction.id.substring(0, 8),
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
      {/* Left Side - Form */}
      <div className="space-y-12 pt-4 md:col-span-5 lg:col-span-4">
        <form onSubmit={handleGenerate} className="space-y-10">
          {/* 01 / Who is it for? */}
          <div className="group space-y-2">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
              01 / Who is it for?
            </label>
            <input
              type="text"
              className="font-serif w-full bg-transparent py-2 text-3xl font-bold placeholder-gray-300 border-b border-gray-300 focus:border-black focus:outline-none"
              placeholder="Name Here"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          {/* 02 / Style Vibe */}
          <div className="group space-y-2">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
              02 / Style Vibe
            </label>
            <div className="relative">
              <select
                className="font-serif w-full cursor-pointer appearance-none bg-transparent py-2 text-3xl font-bold border-b border-gray-300 focus:border-black focus:outline-none"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as keyof typeof stylePrompts)}
              >
                <option value="minimalist">Minimalist</option>
                <option value="playful">Playful</option>
                <option value="elegant">Elegant</option>
              </select>
              <div className="pointer-events-none absolute top-4 right-0 text-xs">▼</div>
            </div>
          </div>

          {/* 03 / Message */}
          <div className="group space-y-2">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
              03 / Message
            </label>
            <textarea
              className="min-h-[120px] w-full resize-none bg-transparent py-2 text-xl leading-relaxed placeholder-gray-300 border-b border-gray-300 focus:border-black focus:outline-none"
              placeholder="Type your wish..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={generating}
              className="group flex items-center gap-4 text-xl font-bold transition-all hover:gap-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black transition-colors group-hover:bg-black group-hover:text-white group-disabled:bg-gray-300 group-disabled:border-gray-300">
                →
              </span>
              {generating ? "Processing..." : "Generate Card"}
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Output Canvas */}
      <div className="md:col-span-7 lg:col-span-8">
        <Output
          error={error || ""}
          prediction={prediction}
          defaultImage={props.defaultImage || ""}
          showImage={null}
          generating={generating}
        />
      </div>
    </div>
  );
}
