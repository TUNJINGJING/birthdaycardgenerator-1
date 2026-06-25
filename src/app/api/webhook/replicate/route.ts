import { validateWebhook } from "replicate";
import {
  failEffectResultAndRefundCreditOnce,
  getEffectResultByOriginalId,
  updateEffectResult,
} from "@/backend/service/effect_result";

export const maxDuration = 60;

const MAX_WEBHOOK_AGE_SECONDS = 5 * 60;

export async function POST(req: Request) {
  const webhookSecret = process.env.REPLICATE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("REPLICATE_WEBHOOK_SECRET is not configured");
    return Response.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const timestamp = Number(req.headers.get("webhook-timestamp"));
  const now = Math.floor(Date.now() / 1000);
  if (
    !Number.isSafeInteger(timestamp) ||
    Math.abs(now - timestamp) > MAX_WEBHOOK_AGE_SECONDS
  ) {
    return Response.json({ error: "Invalid webhook timestamp" }, { status: 401 });
  }

  try {
    const webhookIsValid = await validateWebhook(req.clone(), webhookSecret);
    if (!webhookIsValid) {
      return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  } catch {
    return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  try {
    const webhookData = await req.json();
    const effectResult = await getEffectResultByOriginalId(webhookData.id);
    if (!effectResult) {
      return Response.json({ error: "Effect result not found" }, { status: 500 });
    }

    const runningTime =
      (webhookData.completed_at
        ? new Date(webhookData.completed_at).getTime() -
          new Date(webhookData.created_at).getTime()
        : -1) / 1000;

    if (webhookData.status === "succeeded") {
      const output = processWebhookOutput(
        webhookData.output,
        effectResult.effect_name
      );

      if (effectResult.status !== "succeeded" || !effectResult.url) {
        await updateEffectResult(
          effectResult.original_id,
          webhookData.status,
          runningTime,
          new Date(),
          output
        );
      }
    } else if (webhookData.status === "failed") {
      const refunded = await failEffectResultAndRefundCreditOnce(
        effectResult.original_id,
        new Date()
      );
      if (refunded) {
        console.error("Generation failed; credit refunded:", webhookData.error);
      }
    }

    return Response.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function processWebhookOutput(output: any, effect_name: string) {
  if (output && typeof output === "object" && "images" in output) {
    return output.images[0];
  }

  if (output && typeof output === "object" && "image" in output) {
    return output.image;
  }

  if (Array.isArray(output)) {
    if (effect_name === "face-to-sticker") {
      return output[1];
    }
    if (
      effect_name === "flux-canny-pro" ||
      effect_name === "flux-canny-dev" ||
      effect_name === "flux-depth-pro"
    ) {
      return output[0];
    }
    if (effect_name === "chat-with-images") {
      return formatArticleFromWords(output);
    }
    return output[0];
  }

  return output;
}

function formatArticleFromWords(words: string[]): string {
  if (!Array.isArray(words) || words.length === 0) {
    return "";
  }

  const text = words.join("").replace(/\s+/g, " ").trim();
  const formattedText = text.replace(/(^\w|\.\s+\w)/g, (letter) =>
    letter.toUpperCase()
  );

  return formattedText
    .split(". ")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .join(".\n\n");
}
