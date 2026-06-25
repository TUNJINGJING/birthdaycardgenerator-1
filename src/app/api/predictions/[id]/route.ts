import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { authOptions } from "@/backend/auth/options";
import { getEffectResultByOriginalId } from "@/backend/service/effect_result";
import { User } from "@/backend/type/type";

export const revalidate = 0;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;
  if (!user?.uuid) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const effectResult = await getEffectResultByOriginalId(id);
  if (!effectResult || effectResult.user_id !== user.uuid) {
    return NextResponse.json({ detail: "Prediction not found" }, { status: 404 });
  }

  const prediction = await replicate.predictions.get(id);

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }

  return NextResponse.json(prediction);
}
