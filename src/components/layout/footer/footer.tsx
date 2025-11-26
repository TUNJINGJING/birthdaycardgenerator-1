"use client";

import React from "react";
import { useLocale } from "next-intl";

export default function Footer() {
  const locale = useLocale();

  return (
    <footer className="bg-[#111] py-20 text-white">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-12 grid grid-cols-1 gap-12 border-b border-gray-800 pb-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-serif mb-6 text-5xl">Start creating.</h2>
            <p className="max-w-sm text-gray-400">
              Designing meaningful greetings shouldn't be complicated.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-6 text-xs font-bold tracking-widest text-gray-500 uppercase">
              Legal
            </h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>
                <a href={`/${locale}/legal/terms-of-service`} className="transition-colors hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href={`/${locale}/legal/privacy-policy`} className="transition-colors hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-6 text-xs font-bold tracking-widest text-gray-500 uppercase">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>
                <a
                  href="mailto:support@birthdaycardgenerator.com"
                  className="transition-colors hover:text-white"
                >
                  support@birthdaycardgenerator.com
                </a>
              </li>
              <li className="flex items-center gap-2 pt-4 text-gray-500">
                <span>🌏</span> Multiple Languages
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between font-mono text-xs text-gray-500 md:flex-row">
          <div>
            &copy; 2024 BirthdayCardGenerator.com
            <br />
            All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">Designed with minimalism in mind.</div>
        </div>
      </div>
    </footer>
  );
}
