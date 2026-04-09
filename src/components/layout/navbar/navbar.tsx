"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/contexts/app";
import Locales from "../../locales";
import LoginButton from "@/components/button/login-button";
import UserButton from "../../button/user-button";

export default function BasicNavbar() {
  const { data: session } = useSession();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useAppContext();
  const [activeTag, setActiveTag] = useState("home");
  const pathname = usePathname();
  const t = useTranslations("Nav");

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }
    if (pathname.endsWith("/")) {
      setActiveTag("home");
    } else if (pathname.includes("pricing")) {
      setActiveTag("pricing");
    } else if (pathname.includes("dashboard")) {
      setActiveTag("dashboard");
    }
  }, [pathname, session, setUser]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-[#F2F2F2]/95 backdrop-blur-sm transition-all">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <a
          href={`/${locale}`}
          className="font-serif text-xl font-bold tracking-tight transition-all hover:italic md:text-2xl"
        >
          BirthdayCardGenerator<span className="text-gray-400">.com</span>
        </a>

        <div className="flex items-center gap-8 md:gap-12">
          {/* Desktop Navigation */}
          <nav className="hidden gap-8 text-xs font-bold tracking-widest text-gray-500 uppercase md:flex">
            <a
              href={`/${locale}`}
              className={activeTag === "home" ? "text-black" : "transition-colors hover:text-black"}
            >
              {t("home")}
            </a>
            <a
              href={`/${locale}/pricing`}
              className={activeTag === "pricing" ? "text-black" : "transition-colors hover:text-black"}
            >
              {t("pricing")}
            </a>
            {user && (
              <a
                href={`/${locale}/dashboard`}
                className={activeTag === "dashboard" ? "text-black" : "transition-colors hover:text-black"}
              >
                My Cards
              </a>
            )}
          </nav>

          {/* Language & Auth */}
          <div className="flex items-center gap-6 text-xs font-bold tracking-widest uppercase">
            <div className="hidden md:block">
              <Locales />
            </div>

            {user ? (
              <UserButton />
            ) : (
              <LoginButton />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="block h-0.5 w-6 bg-black"></span>
            <span className="block h-0.5 w-6 bg-black"></span>
            <span className="block h-0.5 w-6 bg-black"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-300 bg-[#F2F2F2] md:hidden">
          <nav className="flex flex-col gap-4 px-6 py-6 text-sm font-bold uppercase">
            <a
              href={`/${locale}`}
              className={activeTag === "home" ? "text-black" : "text-gray-500"}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("home")}
            </a>
            <a
              href={`/${locale}/pricing`}
              className={activeTag === "pricing" ? "text-black" : "text-gray-500"}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("pricing")}
            </a>
            {user && (
              <a
                href={`/${locale}/dashboard`}
                className={activeTag === "dashboard" ? "text-black" : "text-gray-500"}
                onClick={() => setIsMenuOpen(false)}
              >
                My Cards
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
