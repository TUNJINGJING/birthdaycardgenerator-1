import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/backend/auth/options";
import { generatePresignedUrl } from "@/backend/lib/r2";
import { User } from "@/backend/type/type";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
]);
const ALLOWED_BUCKET_FOLDERS = new Set(["images", "videos", "uploads"]);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;
    if (!user?.uuid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucketFolder = formData.get("bucketFolder") as string | null;
    const fileName = formData.get("fileName") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json({ error: "File is too large" }, { status: 413 });
    }

    if (!bucketFolder || !ALLOWED_BUCKET_FOLDERS.has(bucketFolder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    const safeFileName = (fileName || file.name || "upload")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 120);

    const { presignedUrl, objectKey } = await generatePresignedUrl(
      file.type,
      bucketFolder,
      safeFileName
    );

    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    if (!uploadResponse.ok) {
      throw new Error("Failed to upload to R2");
    }

    const publicUrl = `${process.env.R2_ENDPOINT}/${objectKey}`;

    return NextResponse.json({ uploadedFileUrl: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("R2 upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload to R2" },
      { status: 500 }
    );
  }
}
