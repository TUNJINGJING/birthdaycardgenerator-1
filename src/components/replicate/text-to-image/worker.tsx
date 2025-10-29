"use client";

import React, { useState, useEffect } from "react";
import { Button, Textarea } from "@nextui-org/react";
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
    <>
      <div
        className="container mx-auto flex flex-col lg:flex-row my-4 px-4 py-8 rounded-2xl shadow-xl bg-white border-2 border-pink-200"
        style={{
          boxShadow:
            "0 0 30px rgba(255, 107, 157, 0.2), 0 0 60px rgba(255, 107, 157, 0.1)",
        }}
      >
        {/* Left Side - Input Section */}
        <div className="w-full lg:w-1/2 lg:px-6 lg:border-r border-divider border-gray-200 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {t("input.title")}
            </h2>
            <div className="flex items-center gap-3">
              <CreditInfo
                credit={userSubscriptionInfo?.remain_count?.toString() || ""}
              />
            </div>
          </div>

          {/* Step 1: Style Selection */}
          <div>
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
          </div>

          {/* Step 2: Greeting Selection */}
          <div>
            <GreetingPresets
              onSelectGreeting={handleSelectGreeting}
              selectedGreeting={prompt}
            />
          </div>

          {/* Step 3: Custom Message Input */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Your Message
            </label>
            <Textarea
              className="w-full"
              minRows={4}
              placeholder={t("input.placeholder")}
              radius="lg"
              variant="bordered"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Birthday Message"
              classNames={{
                input: "text-lg",
                inputWrapper: "border-2 border-gray-300 hover:border-pink-400 focus:border-pink-500"
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                {t("input.characterCount").replace("{count}", prompt.length.toString())}
              </p>
              {prompt.length < 50 && (
                <p className="text-sm text-blue-600">
                  {t("input.characterHint")}
                </p>
              )}
            </div>
          </div>

          {/* Generate Button */}
          {generating ? (
            <Button
              isLoading
              size="lg"
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg py-7 shadow-lg"
            >
              {prediction
                ? prediction.status === "succeeded"
                  ? "Finishing up..."
                  : `Generating... (${prediction.status})`
                : "Creating your card..."}
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg py-7 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleGenerate}
            >
              Generate Birthday Card (1 credit)
            </Button>
          )}
        </div>

        {/* Right Side - Output Section */}
        <Output
          error={error || ""}
          prediction={prediction}
          defaultImage={props.defaultImage || ""}
          showImage={null}
        />
      </div>
    </>
  );
}
