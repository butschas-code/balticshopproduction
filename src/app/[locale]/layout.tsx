import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1 relative z-0">{children}</main>
      <Footer />
    </>
  );
}
