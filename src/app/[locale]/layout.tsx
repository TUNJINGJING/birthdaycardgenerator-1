import "../globals.css";
import { Providers } from "@/app/[locale]/providers";
import { AppContextProvider } from "@/contexts/app";
import { NextAuthSessionProvider } from "@/providers/session";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";


export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/logo.jpeg" />
        <meta name="theme-color" content="#111111" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Birthday Card Generator",
              "url": "https://birthdaycardgenerator.com",
              "description": "Create personalized AI birthday cards in minutes. Choose a style, add your message, and download instantly. No design skills needed.",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "Web",
              "offers": [
                {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "3 free AI birthday cards per month"
                },
                {
                  "@type": "Offer",
                  "price": "19.9",
                  "priceCurrency": "USD",
                  "description": "30 AI birthday cards per month"
                }
              ]
            })
          }}
        />
      </head>

      <body className="flex min-h-screen flex-col border-t-8 border-[#111] bg-[#F2F2F2] text-[#111]">
        <AppContextProvider>
          <Providers>
            <NextAuthSessionProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
            </NextAuthSessionProvider>
          </Providers>
        </AppContextProvider>
      </body>
    </html>
  );
}
