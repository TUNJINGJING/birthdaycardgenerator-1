"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function LoginButton() {
  const t = useTranslations("Nav");
  return (
    <button
      onClick={() => signIn("google")}
      className="border border-black px-6 py-2 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-black hover:text-white"
    >
      {t("login")}
    </button>
  );
}
