"use client";

import React, { useState, useEffect } from "react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import Output from "@/components/replicate/text-to-image/img-output";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import CreditInfo from "@/components/landingpage/credit-info";
import { useTranslations } from "next-intl";
import StyleSelector, { type CardStyle } from "@/components/birthday-card/StyleSelector";
import GreetingPresets from "@/components/birthday-card/GreetingPresets";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Style-specific prompt prefixes to enhance AI generation
const stylePrompts = {
  warm: "warm and cozy birthday celebration with soft colors, heartwarming atmosphere, gentle lighting, family-friendly, tender and affectionate mood, ",
  funny: "funny and playful birthday card with cartoon style, bright cheerful colors, humorous elements, joyful and energetic vibe, ",
  formal: "elegant and formal birthday design with sophisticated colors and typography, professional and refined aesthetic, classy celebration, ",
  cute: "cute and adorable birthday theme with pastel colors and charming elements, sweet and lovely atmosphere, kawaii style, "
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
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>("warm");
  const [generating, setGenerating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const width = 1024;
  const height = 1024;
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
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
    setIsSubscribed(userSubscriptionInfo.subscription_status === "active");
  };

  const handleSelectGreeting = (greeting: string) => {
    setPrompt(greeting);
  };

  const handleGenerate = async () => {
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

    if (prompt.length === 0) {
      toast.warning(t("errors.emptyMessage"));
      return;
    }

    // Combine style prefix with user's message for better AI generation
    const enhancedPrompt = `${stylePrompts[selectedStyle]}birthday card with text: "${prompt}", creative typography, celebration theme, high quality design`;

    // step1: create prediction
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

    // step2: wait for prediction to be succeeded or failed
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
    // update effect result
    const runningTime =
      (newPrediction.created_at
        ? new Date().getTime() - new Date(newPrediction.created_at).getTime()
        : -1) / 1000;

    // 获取生成的图片URL
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
        original_image_url: imageUrl, // 传递正确的图片URL
        object_key: newPrediction.id.substring(0, 8),
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  return (
    <section className="min-h-screen py-12 md:py-20 border-t-8 border-gray-300">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Side - Input Section */}
          <div className="md:col-span-5 lg:col-span-4 space-y-12">
            {/* Style Selection */}
            <div className="space-y-3 group">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                01 / Style
              </label>
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
              />
            </div>

            {/* Greeting Presets */}
            <div className="space-y-3 group">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                02 / Templates
              </label>
              <GreetingPresets
                onSelectGreeting={handleSelectGreeting}
                selectedGreeting={prompt}
              />
            </div>

            {/* Message Input */}
            <div className="space-y-3 group">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                03 / Message
              </label>
              <textarea
                className="w-full bg-transparent text-xl font-serif border-b border-gray-300 py-2 focus:border-black focus:outline-none rounded-none min-h-[100px] resize-none placeholder-gray-300 leading-relaxed"
                placeholder="Type your wish..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400 font-mono">
                  {prompt.length} characters
                </p>
                <CreditInfo
                  credit={userSubscriptionInfo?.remain_count?.toString() || ""}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-8">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="group flex items-center gap-4 text-xl font-bold hover:gap-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors group-disabled:bg-gray-300 group-disabled:border-gray-300">
                  →
                </span>
                {generating ? "Processing..." : "Generate Card"}
              </button>
            </div>
          </div>

          {/* Right Side - Output Section */}
          <div className="md:col-span-7 lg:col-span-8">
            <Output
              error={error || ""}
              prediction={prediction}
              defaultImage={props.defaultImage || ""}
              showImage={null}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
