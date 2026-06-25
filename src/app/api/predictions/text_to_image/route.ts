import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Replicate from "replicate";
import { authOptions } from "@/backend/auth/options";
import { createEffectResult } from "@/backend/service/effect_result";
import { getEffectById } from "@/backend/service/effect";
import { genEffectResultId } from "@/backend/utils/genId";
import {
  increasePeriodRemainCountByUserId,
  reducePeriodRemainCountByUserId,
} from "@/backend/service/credit_usage";
import { User } from "@/backend/type/type";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_HOST = process.env.REPLICATE_URL;
const GENERATION_INPUT = {
  width: 1024,
  height: 1024,
  output_format: "png",
  aspect_ratio: "1:1",
};

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { detail: "Image generation is not configured." },
      { status: 503 }
    );
  }

  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;
  if (!user?.uuid) {
    return NextResponse.json({ detail: "Please login first." }, { status: 401 });
  }

  let requestBody: { effect_id?: unknown; prompt?: unknown };
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  const effectId = Number(requestBody.effect_id);
  const prompt =
    typeof requestBody.prompt === "string" ? requestBody.prompt.trim() : "";
  if (!Number.isSafeInteger(effectId) || effectId <= 0 || !prompt) {
    return NextResponse.json({ detail: "Invalid generation request." }, { status: 400 });
  }

  const effect = await getEffectById(effectId);
  if (!effect || effect.is_open !== 1 || !effect.model) {
    return NextResponse.json({ detail: "Generation effect is unavailable." }, { status: 404 });
  }

  const credit = Number(effect.credit);
  if (!Number.isSafeInteger(credit) || credit <= 0) {
    console.error("Invalid effect credit configuration:", effect.id);
    return NextResponse.json({ detail: "Generation effect is unavailable." }, { status: 500 });
  }

  const deducted = await reducePeriodRemainCountByUserId(user.uuid, credit);
  if (!deducted) {
    return NextResponse.json(
      { detail: "Your credit is not enough, please purchase credits or subscribe." },
      { status: 402 }
    );
  }

  const options = {
    version: effect.version,
    model: effect.model,
    input: { prompt, ...GENERATION_INPUT },
    webhook: WEBHOOK_HOST ? `${WEBHOOK_HOST}/api/webhook/replicate` : undefined,
    webhook_events_filter: WEBHOOK_HOST ? (["completed"] as const) : undefined,
  };

  let prediction;
  try {
    prediction = await replicate.predictions.create(options as any);
  } catch (error) {
    await increasePeriodRemainCountByUserId(user.uuid, credit);
    console.error("Failed to create prediction:", error);
    return NextResponse.json({ detail: "Image generation failed to start." }, { status: 502 });
  }

  if (prediction?.error) {
    await increasePeriodRemainCountByUserId(user.uuid, credit);
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }

  try {
    await createEffectResult({
      result_id: genEffectResultId(),
      user_id: user.uuid,
      original_id: prediction.id,
      effect_id: effect.id,
      effect_name: effect.link_name,
      prompt,
      url: "",
      status: "pending",
      original_url: "",
      storage_type: "S3",
      running_time: -1,
      credit,
      request_params: JSON.stringify({ effect_id: effect.id, prompt, ...GENERATION_INPUT }),
      created_at: new Date(),
    });
  } catch (error) {
    await increasePeriodRemainCountByUserId(user.uuid, credit);
    console.error("Failed to record prediction:", error);
    return NextResponse.json({ detail: "Image generation could not be recorded." }, { status: 500 });
  }

  return NextResponse.json(prediction, { status: 201 });
}
