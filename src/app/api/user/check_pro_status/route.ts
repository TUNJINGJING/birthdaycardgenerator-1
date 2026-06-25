import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/auth/options";
import { checkUserHasSuccessfulPayment } from "@/backend/service/payment_history";
import { User } from "@/backend/type/type";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;
    if (!user?.uuid) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasSuccessfulPayment = await checkUserHasSuccessfulPayment(user.uuid);

    return Response.json({
      isPro: hasSuccessfulPayment,
      user_id: user.uuid,
    });
  } catch (error) {
    console.error("Error checking pro status:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
