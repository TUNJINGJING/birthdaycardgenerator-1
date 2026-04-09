"use client";

import React, { useState, useEffect } from "react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import OutputOriginal from "@/components/replicate/text-to-image/img-output-original";
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

export default function WorkerOriginal(props: {
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
        original_image_url: imageUrl,
        object_key: newPrediction.id.substring(0, 8),
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 bg-white border border-gray-300 p-8 md:p-12">
        {/* Left Side - Input Section */}
        <div className="space-y-10 md:col-span-5 md:border-r md:border-gray-300 md:pr-12">
          {/* Header */}
          <div className="border-b border-gray-300 pb-6">
            <div className="flex items-baseline justify-between">
              <h1 className="font-serif text-4xl font-bold leading-tight">
                Create Your Card
              </h1>
              <div className="flex items-center gap-2">
                <CreditInfo
                  credit={userSubscriptionInfo?.remain_count?.toString() || ""}
                />
              </div>
            </div>
          </div>

          {/* Step 1: Style Selection */}
          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
          />

          {/* Step 2: Greeting Selection */}
          <GreetingPresets
            onSelectGreeting={handleSelectGreeting}
            selectedGreeting={prompt}
          />

          {/* Step 3: Custom Message Input */}
          <div className="group space-y-2">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
              03 / Your Message
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("input.placeholder")}
              className="w-full resize-none bg-transparent py-2 text-lg leading-relaxed placeholder-gray-300 border-b border-gray-300 focus:border-black focus:outline-none transition-colors"
              rows={4}
              aria-label="Birthday Message"
            />
            <div className="flex items-center justify-between pt-2">
              <p className="font-mono text-xs text-gray-400">
                {prompt.length} characters
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            {!user ? (
              // Not logged in — show sign-in prompt
              <div className="space-y-3">
                <a
                  href="/api/auth/signin"
                  className="block w-full bg-black text-white py-4 text-sm font-bold tracking-widest uppercase text-center transition-colors hover:bg-gray-800"
                >
                  Sign In to Create Free Cards
                </a>
                <p className="text-center text-xs text-gray-400">
                  3 free cards included · No credit card required
                </p>
              </div>
            ) : generating ? (
              <button
                disabled
                className="w-full bg-gray-800 text-white py-4 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 opacity-75 cursor-not-allowed"
              >
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {prediction
                  ? prediction.status === "succeeded"
                    ? "Finishing up..."
                    : `Generating... (${prediction.status})`
                  : "Creating your card..."}
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                className="group w-full bg-black text-white py-4 text-sm font-bold tracking-widest uppercase transition-colors hover:bg-gray-800"
              >
                Generate Card (1 Card)
              </button>
            )}
          </div>
        </div>

        {/* Right Side - Output Section */}
        <div className="md:col-span-7">
          <OutputOriginal
            error={error || ""}
            prediction={prediction}
            defaultImage={props.defaultImage || ""}
            showImage={null}
          />
        </div>
      </div>
    </>
  );
}
