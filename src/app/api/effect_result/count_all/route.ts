import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/backend/auth/options";
import { countEffectResultsByUserId } from "@/backend/service/effect_result";
import { User } from "@/backend/type/type";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;
  if (!user?.uuid) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const count = await countEffectResultsByUserId(user.uuid);
  if (count > 100) {
    return NextResponse.json({ count: 100 });
  }
  return NextResponse.json({ count });
}
