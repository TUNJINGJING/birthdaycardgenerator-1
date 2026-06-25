import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/backend/auth/options";
import { getEffectResultByOriginalId } from "@/backend/service/effect_result";
import { User } from "@/backend/type/type";
import { createShareToken } from "@/backend/utils/share-token";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;
    if (!user?.uuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prediction_id } = await request.json();
    if (!prediction_id || typeof prediction_id !== "string") {
      return NextResponse.json(
        { error: "prediction_id is required" },
        { status: 400 }
      );
    }

    const effectResult = await getEffectResultByOriginalId(prediction_id);
    if (!effectResult || effectResult.user_id !== user.uuid) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const shareId = createShareToken({
      prediction_id,
      created_at: Date.now(),
    });

    return NextResponse.json({
      shareId,
      shareUrl: `/share/${shareId}`,
    });
  } catch (error) {
    console.error("Share creation error:", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}
