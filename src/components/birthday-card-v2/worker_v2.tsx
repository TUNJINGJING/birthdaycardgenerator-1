"use client";

import React, { useState, useEffect } from "react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import { useTranslations } from "next-intl";
import StyleSelector_v2, { type CardStyle } from "./StyleSelector_v2";
import GreetingPresets_v2 from "./GreetingPresets_v2";
import styles from "./styles.module.css";
import { Download } from "lucide-react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Style-specific prompt prefixes
const stylePrompts = {
  warm: "warm and cozy birthday celebration with soft colors, heartwarming atmosphere, gentle lighting, family-friendly, tender and affectionate mood, ",
  funny: "funny and playful birthday card with cartoon style, bright cheerful colors, humorous elements, joyful and energetic vibe, ",
  formal: "elegant and formal birthday design with sophisticated colors and typography, professional and refined aesthetic, classy celebration, ",
  cute: "cute and adorable birthday theme with pastel colors and charming elements, sweet and lovely atmosphere, kawaii style, ",
};

export default function Worker_v2(props: {
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
        toast.warning("No credit left");
        return;
      }
    }

    if (prompt.length === 0) {
      toast.warning("Please enter a birthday message");
      return;
    }

    // Combine style prefix with user's message
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
          aspect_ratio: "custom",
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
        original_image_url: "",
        object_key: newPrediction.id.substring(0, 8),
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  const handleDownload = async () => {
    if (!prediction?.output?.[0]) return;

    const imageUrl = prediction.output[0];
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `birthday-card-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className={`${styles["v2-container"]} ${styles["v2-main-container"]}`}>
      {/* 左侧：输入区 */}
      <div className={styles["v2-input-section"]}>
        <h2 className={styles["v2-section-title"]}>
          {t("input.title")}
        </h2>

        {/* Credit Info */}
        <div className={styles["v2-credit-info"]} style={{ marginBottom: "var(--space-4)" }}>
          <span>Credits:</span>
          <span>{userSubscriptionInfo?.remain_count ?? "—"}</span>
        </div>

        {/* Step 1: 样式选择 */}
        <StyleSelector_v2
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
        />

        {/* Step 2: 祝福语选择 */}
        <GreetingPresets_v2
          onSelectGreeting={handleSelectGreeting}
          selectedGreeting={prompt}
        />

        {/* Step 3: 自定义输入 */}
        <div className={styles["v2-section-spacing"]}>
          <label className={styles["v2-section-label"]} htmlFor="message-input">
            Your Message
          </label>
          <textarea
            id="message-input"
            className={styles["v2-textarea"]}
            placeholder={props.promptTips || "Enter your birthday message here"}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={200}
          />
          <div className={styles["v2-character-count"]}>
            {prompt.length}/200
          </div>
        </div>

        {/* 生成按钮 */}
        <button
          className={styles["v2-button"]}
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <>
              <div className={styles["v2-button-spinner"]} />
              <span>
                {prediction
                  ? prediction.status === "succeeded"
                    ? "Finishing up..."
                    : `Generating... (${prediction.status})`
                  : "Creating your card..."}
              </span>
            </>
          ) : (
            <span>Generate Birthday Card (1 credit)</span>
          )}
        </button>
      </div>

      {/* 分割线 */}
      <div className={styles["v2-divider-vertical"]} />

      {/* 右侧：输出区 */}
      <div className={styles["v2-output-section"]}>
        <div className={styles["v2-output-container"]}>
          {prediction?.output?.[0] ? (
            <>
              <img
                src={prediction.output[0]}
                alt="Generated birthday card"
                className={styles["v2-output-image"]}
              />
              <button
                className={styles["v2-download-button"]}
                onClick={handleDownload}
                aria-label="Download image"
              >
                <Download size={20} />
              </button>
            </>
          ) : props.defaultImage ? (
            <img
              src={props.defaultImage}
              alt="Example birthday card"
              className={styles["v2-output-image"]}
            />
          ) : (
            <p className={styles["v2-output-placeholder"]}>
              Your birthday card will appear here
            </p>
          )}

          {error && (
            <p className={styles["v2-output-placeholder"]} style={{ color: "var(--primary)" }}>
              Error: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
