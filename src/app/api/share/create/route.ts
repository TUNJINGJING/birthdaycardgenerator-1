import { NextRequest, NextResponse } from "next/server";
import { genUniSeq } from "@/backend/utils";

export async function POST(request: NextRequest) {
  try {
    const { prediction_id } = await request.json();

    if (!prediction_id) {
      return NextResponse.json(
        { error: "prediction_id is required" },
        { status: 400 }
      );
    }

    // 生成唯一分享 ID
    const shareId = genUniSeq();

    // 这里可以选择将分享信息存储到数据库
    // 暂时使用 prediction_id 直接作为查询参数

    return NextResponse.json({
      shareId: shareId,
      shareUrl: `/share/${shareId}?prediction_id=${prediction_id}`,
    });
  } catch (error) {
    console.error("Share creation error:", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}
