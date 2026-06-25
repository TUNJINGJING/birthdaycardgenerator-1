import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/backend/auth/options";
import { getUserByUuidAndEmail } from "@/backend/service/user";
import { getSubscriptionPlan } from "@/backend/service/subscription_plan";
import { UserSubscriptionStatusEnum } from "@/backend/type/enum/user_subscription_enum";
import { PaymentStatus } from "@/backend/type/enum/payment_status_enum";
import { PaymentHistory, User } from "@/backend/type/type";
import { createPaymentHistory } from "@/backend/service/payment_history";
import { getUserSubscriptionByUserIdAndStatus } from "@/backend/service/user_subscription";

export const maxDuration = 60;

const ONE_TIME_PLAN_IDS = new Set([1, 9, 11]);
const PAY_ONCE_PLAN_IDS = new Set([1, 8, 9]);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as User | undefined;
    if (!sessionUser?.uuid || !sessionUser.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan_id } = await req.json();
    const planId = Number(plan_id);
    if (!Number.isSafeInteger(planId) || planId <= 0) {
      return Response.json({ error: "invalid params" }, { status: 400 });
    }

    const user = await getUserByUuidAndEmail(sessionUser.uuid, sessionUser.email);
    if (!user || user.uuid !== sessionUser.uuid) {
      return Response.json({ error: "user not found" }, { status: 401 });
    }

    const subscriptionPlan = await getSubscriptionPlan(planId);
    if (!subscriptionPlan || subscriptionPlan.is_active === false) {
      return Response.json(
        { error: "subscription plan not found" },
        { status: 404 }
      );
    }

    if (!PAY_ONCE_PLAN_IDS.has(planId)) {
      const userSubscriptions = await getUserSubscriptionByUserIdAndStatus(
        user.uuid,
        [
          UserSubscriptionStatusEnum.ACTIVE,
          UserSubscriptionStatusEnum.CANCELLED,
        ]
      );
      if (userSubscriptions.length > 0) {
        return Response.json(
          { error: "You already have an active subscription" },
          { status: 409 }
        );
      }
    }

    const isOneTimePayment = ONE_TIME_PLAN_IDS.has(planId);
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
    const price = await stripe.prices.retrieve(
      subscriptionPlan.stripe_price_id
    );

    if (!isOneTimePayment && !price.recurring) {
      return Response.json(
        { error: "price must be recurring type" },
        { status: 400 }
      );
    }

    const amount = Math.round(subscriptionPlan.price * 100);
    const createPaymentHistoryRequest: PaymentHistory = {
      id: 0,
      user_id: user.uuid,
      subscription_plans_id: planId,
      stripe_price_id: subscriptionPlan.stripe_price_id,
      stripe_subscription_id: "",
      stripe_customer_id: "",
      stripe_payment_intent_id: "",
      amount,
      currency: "USD",
      status: PaymentStatus.STARTED,
      created_at: new Date(),
    };

    const paymentHistory = await createPaymentHistory(
      createPaymentHistoryRequest
    );
    if (!paymentHistory || paymentHistory.id === 0) {
      return Response.json(
        { error: "create payment history failed" },
        { status: 500 }
      );
    }

    const metadata = {
      project: "ai-video-generator",
      interval: subscriptionPlan.interval,
      userId: String(user.uuid),
      priceId: subscriptionPlan.stripe_price_id,
      quantity: "1",
      paymentHistoryId: String(paymentHistory.id),
      credit: String(subscriptionPlan.credit_per_interval),
      subscriptionPlanId: String(planId),
    };

    const options: Stripe.Checkout.SessionCreateParams = {
      client_reference_id: String(user.id),
      customer_email: user.email,
      line_items: [
        {
          price: subscriptionPlan.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: isOneTimePayment ? "payment" : "subscription",
      payment_method_types: ["card"],
      metadata,
      ...(isOneTimePayment
        ? {}
        : {
            subscription_data: {
              metadata,
            },
          }),
      success_url: `${process.env.WEB_BASE_URI}`,
      cancel_url: `${process.env.WEB_BASE_URI}/pricing`,
    };
    const checkoutSession = await stripe.checkout.sessions.create(options);
    return Response.json({ session: checkoutSession });
  } catch (e) {
    console.error("checkout failed: ", e);
    return Response.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
