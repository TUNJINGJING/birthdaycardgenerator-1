import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/auth/options";
import { getUserSubscriptionInfoByUserId } from "@/backend/service/user_subscription";
import { User } from "@/backend/type/type";

export async function POST() {
  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;
  if (!user?.uuid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userSubscriptionInfo = await getUserSubscriptionInfoByUserId(user.uuid);
  return Response.json(userSubscriptionInfo);
}
