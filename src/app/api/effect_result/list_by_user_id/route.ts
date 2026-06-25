import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/auth/options";
import { pageListEffectResultsByUserId } from "@/backend/service/effect_result";
import { User } from "@/backend/type/type";

export const maxDuration = 60;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;
  if (!user?.uuid) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("page_size") || "10");

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 50
  ) {
    return Response.json({ detail: "Invalid pagination params" }, { status: 400 });
  }

  const results = await pageListEffectResultsByUserId(user.uuid, page, pageSize);
  return Response.json(results);
}
