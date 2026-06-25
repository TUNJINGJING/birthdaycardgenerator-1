import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { getEffectResultByOriginalId } from "@/backend/service/effect_result";
import { verifyShareToken } from "@/backend/utils/share-token";

export const revalidate = 0;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

function pickPredictionOutput(output: unknown) {
  if (Array.isArray(output)) {
    return output.length > 1 ? output[1] : output[0];
  }
  if (output && typeof output === "object" && "images" in output) {
    const images = (output as { images?: unknown[] }).images;
    return Array.isArray(images) ? images[0] : null;
  }
  if (output && typeof output === "object" && "image" in output) {
    return (output as { image?: unknown }).image;
  }
  return output;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const payload = verifyShareToken(params.shareId);
    if (!payload) {
      return NextResponse.json({ error: "Invalid share link" }, { status: 404 });
    }

    const effectResult = await getEffectResultByOriginalId(payload.prediction_id);
    if (!effectResult) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    let status = effectResult.status;
    let output: unknown = effectResult.url || null;

    if (!output && process.env.REPLICATE_API_TOKEN) {
      const prediction = await replicate.predictions.get(effectResult.original_id);
      status = prediction.status || status;
      output = pickPredictionOutput(prediction.output);
    }

    return NextResponse.json({
      shareId: params.shareId,
      prediction: {
        id: effectResult.original_id,
        status,
        output: typeof output === "string" ? output : null,
        created_at: effectResult.created_at,
      },
    });
  } catch (error) {
    console.error("Share fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load share link" },
      { status: 500 }
    );
  }
}
