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
  // Pay Once
  {
    key: TiersEnum.PayOnce,
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
  // Pro Monthly
  {
    key: TiersEnum.ProMonthly,
    id: {
      [FrequencyEnum.Monthly]: 2,
      [FrequencyEnum.Yearly]: 2,
      [FrequencyEnum.OneTime]: 2,
    },
    amount: {
      [FrequencyEnum.Monthly]: 1990,
      [FrequencyEnum.Yearly]: 1990,
      [FrequencyEnum.OneTime]: 1990,
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Pro Monthly",
    price: "$19.9",
    priceSuffix: "per month",
    href: "#",
    featured: false,
    mostPopular: true,
    description: "Best for regular card creators",
    features: {
      yearly: ["30 AI cards/month (4K)", "No watermarks", "High-Res PDF export", "Typography Tool (no watermark)"],
      monthly: ["30 AI cards/month (4K)", "No watermarks", "High-Res PDF export", "Typography Tool (no watermark)"],
      onetime: ["30 AI cards/month (4K)", "No watermarks", "High-Res PDF export", "Typography Tool (no watermark)"],
    },
    buttonText: "Subscribe",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  // Pro Yearly
  {
    key: TiersEnum.ProYearly,
    id: {
      [FrequencyEnum.Monthly]: 5,
      [FrequencyEnum.Yearly]: 5,
      [FrequencyEnum.OneTime]: 5,
    },
    amount: {
      [FrequencyEnum.Monthly]: 18900,
      [FrequencyEnum.Yearly]: 18900,
      [FrequencyEnum.OneTime]: 18900,
    },
    interval: {
      [FrequencyEnum.Monthly]: "year",
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.OneTime]: "year",
    },
    title: "Pro Yearly",
    price: "$189",
    priceSuffix: "per year",
    href: "#",
    featured: true,
    mostPopular: false,
    description: "Best value for power users",
    features: {
      yearly: ["360 AI cards/year (4K)", "No watermarks", "High-Res PDF export", "Priority support"],
      monthly: ["360 AI cards/year (4K)", "No watermarks", "High-Res PDF export", "Priority support"],
      onetime: ["360 AI cards/year (4K)", "No watermarks", "High-Res PDF export", "Priority support"],
    },
    buttonText: "Subscribe",
    buttonColor: "default",
    buttonVariant: "flat",
  },
];
