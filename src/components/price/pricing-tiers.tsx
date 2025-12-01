import type { Frequency, Tier } from "./pricing-types";

import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies: Array<Frequency> = [
  {
    key: FrequencyEnum.Monthly,
    label: "Pay Monthly",
    priceSuffix: "per month",
  },
  { key: FrequencyEnum.Yearly, label: "Pay Yearly", priceSuffix: "per month" },
  {
    key: FrequencyEnum.OneTime,
    label: "Pay One Time",
    priceSuffix: "one time",
  },
];

export const tiers: Array<Tier> = [
  // Free
  {
    key: TiersEnum.PayOnce, // 使用 PayOnce 作为 key，因为 TiersEnum 里没有 Free
    id: {
      [FrequencyEnum.Monthly]: 0,
      [FrequencyEnum.Yearly]: 0,
      [FrequencyEnum.OneTime]: 0,
    },
    amount: {
      [FrequencyEnum.Monthly]: 0,
      [FrequencyEnum.Yearly]: 0,
      [FrequencyEnum.OneTime]: 0,
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Free",
    price: "$0",
    href: "#",
    featured: false,
    mostPopular: false,
    description: "Try it out",
    features: {
      yearly: ["Typography Tool (watermarked)", "3 AI cards/month (watermarked)", "Web quality (1K resolution)"],
      monthly: ["Typography Tool (watermarked)", "3 AI cards/month (watermarked)", "Web quality (1K resolution)"],
      onetime: ["Typography Tool (watermarked)", "3 AI cards/month (watermarked)", "Web quality (1K resolution)"],
    },
    buttonText: "Get Started",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  // Pay Once
  {
    key: TiersEnum.ProMonthly, // 临时使用
    id: {
      [FrequencyEnum.Monthly]: 1,
      [FrequencyEnum.Yearly]: 1,
      [FrequencyEnum.OneTime]: 1,
    },
    amount: {
      [FrequencyEnum.Monthly]: 499,
      [FrequencyEnum.Yearly]: 499,
      [FrequencyEnum.OneTime]: 499,
    },
    interval: {
      [FrequencyEnum.Monthly]: "one_time",
      [FrequencyEnum.Yearly]: "one_time",
      [FrequencyEnum.OneTime]: "one_time",
    },
    title: "Pay Once",
    price: "$4.99",
    href: "#",
    featured: false,
    mostPopular: false,
    description: "Perfect for a special occasion",
    features: {
      yearly: ["5 AI cards (4K)", "No watermarks", "High-Res export", "Forever yours"],
      monthly: ["5 AI cards (4K)", "No watermarks", "High-Res export", "Forever yours"],
      onetime: ["5 AI cards (4K)", "No watermarks", "High-Res export", "Forever yours"],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  // Pro (with Monthly/Yearly toggle)
  {
    key: TiersEnum.ProYearly, // 临时使用
    id: {
      [FrequencyEnum.Monthly]: 2,
      [FrequencyEnum.Yearly]: 5,
      [FrequencyEnum.OneTime]: 2,
    },
    amount: {
      [FrequencyEnum.Monthly]: 1990,
      [FrequencyEnum.Yearly]: 18900,
      [FrequencyEnum.OneTime]: 1990,
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Pro",
    price: {
      monthly: "$19.9",
      yearly: "$189",
      onetime: "$19.9",
    },
    priceSuffix: {
      monthly: "per month",
      yearly: "per year",
      onetime: "per month",
    },
    href: "#",
    featured: true,
    mostPopular: true,
    description: "Best for regular card creators",
    features: {
      monthly: ["30 AI cards/month (4K)", "No watermarks", "High-Res PDF export", "Typography Tool (no watermark)"],
      yearly: ["360 AI cards/year (4K)", "No watermarks", "High-Res PDF export", "Priority support"],
      onetime: ["30 AI cards/month (4K)", "No watermarks", "High-Res PDF export", "Typography Tool (no watermark)"],
    },
    buttonText: "Subscribe",
    buttonColor: "default",
    buttonVariant: "flat",
    // 标记这是可切换的 Pro tier
    isToggleable: true,
    savingsPercent: 21, // ($19.9 * 12 - $189) / ($19.9 * 12) * 100 ≈ 21%
  },
];
