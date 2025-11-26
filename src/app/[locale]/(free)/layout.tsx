import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer/footer";
import { Toaster } from "sonner";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <Toaster richColors position="top-center" theme="light" duration={3000} />
    </>
  );
}
