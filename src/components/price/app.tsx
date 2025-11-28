"use client";

import React from "react";
import { Icon } from "@iconify/react";

import { FrequencyEnum } from "@/components/price/pricing-types";
import { frequencies, tiers } from "@/components/price/pricing-tiers";
import { useAppContext } from "@/contexts/app";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const [selectedFrequency, setSelectedFrequency] = React.useState(
    frequencies.find((f) => f.key === FrequencyEnum.Yearly) || frequencies[0]
  );
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFrequencyChange = (selectedKey: FrequencyEnum) => {
    const frequencyIndex = frequencies.findIndex((f) => f.key === selectedKey);
    setSelectedFrequency(frequencies[frequencyIndex]);
  };

  const handleCheckout = async (
    plan_id: number,
    amount: number,
    interval: string
  ) => {
    try {
      setLoading(true);

      const params = {
        plan_id: plan_id,
        amount: amount,
        interval: interval,
        user_uuid: user?.uuid,
        user_email: user?.email,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error("Please sign in to purchase");
        return;
      }

      if (response.status === 500) {
        const errorMessage = data.error || "Checkout failed. Please try again.";
        toast.error(errorMessage);
        return;
      }

      if (!data || !data.session?.url) {
        toast.error("Invalid response from server");
        return;
      }

      router.push(data.session.url);
    } catch (e) {
      console.error("Checkout failed:", e);
      toast.error("Checkout failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
      {/* Header Section */}
      <div className="border-b border-black pb-8 mb-16">
        <h1 className="font-serif text-6xl font-bold leading-tight tracking-tight">
          Pricing
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Simple tools. Simple pricing. Choose the plan that fits your needs.
        </p>
      </div>

      {/* Frequency Selector - Hidden since we have separate tiers now */}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className={`
              relative bg-white transition-colors
              ${
                tier.mostPopular
                  ? "border-2 border-black"
                  : "border border-gray-300 hover:border-black"
              }
            `}
          >
            {/* Most Popular Badge */}
            {tier.mostPopular && (
              <div className="absolute -top-3 left-6 bg-black px-4 py-1">
                <span className="text-xs font-bold tracking-widest text-white uppercase">
                  Most Popular
                </span>
              </div>
            )}

            {/* Card Content */}
            <div className="p-8">
              {/* Title */}
              <h3 className="font-serif text-2xl font-bold mb-6 border-b border-gray-300 pb-4">
                {tier.title}
              </h3>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  {typeof tier.price !== "string" &&
                    tier.previousPrice?.[selectedFrequency.key] && (
                      <span className="text-xl line-through text-gray-400">
                        {tier.previousPrice[selectedFrequency.key]}
                      </span>
                    )}
                </div>
                <p className="font-serif text-5xl font-bold">
                  {typeof tier.price === "string"
                    ? tier.price
                    : tier.price[selectedFrequency.key]}
                </p>
                {typeof tier.price !== "string" && (
                  <p className="mt-2 text-sm text-gray-500">
                    {tier.priceSuffix
                      ? `per ${tier.priceSuffix} / ${selectedFrequency.priceSuffix}`
                      : `per ${selectedFrequency.priceSuffix}`}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 border-t border-gray-300 pt-6">
                {tier.features?.[selectedFrequency.key].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Icon
                      className="text-black mt-0.5 flex-shrink-0"
                      icon="ci:check"
                      width={20}
                    />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Purchase Button */}
              {loading ? (
                <button
                  disabled
                  className="w-full bg-gray-800 text-white py-4 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 opacity-75 cursor-not-allowed"
                >
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Loading...
                </button>
              ) : (
                <button
                  onClick={() =>
                    tier.buttonText !== "Coming Soon" &&
                    handleCheckout(
                      tier.id[selectedFrequency.key],
                      tier.amount[selectedFrequency.key],
                      tier.interval[selectedFrequency.key]
                    )
                  }
                  disabled={tier.buttonText === "Coming Soon"}
                  className={`
                    w-full py-4 text-sm font-bold tracking-widest uppercase transition-colors
                    ${
                      tier.buttonText === "Coming Soon"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : tier.mostPopular
                        ? "bg-black text-white hover:bg-gray-800"
                        : "border border-gray-300 bg-white text-black hover:border-black"
                    }
                  `}
                >
                  {tier.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
