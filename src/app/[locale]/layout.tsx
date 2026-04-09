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
