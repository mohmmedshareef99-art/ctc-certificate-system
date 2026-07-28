import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#002B49",
};

export const metadata: Metadata = {
  title: "Continental Training Center S.A. | CTC Panamá Maritime Training",
  description: "Official Maritime Training Center & STCW Certificate Verification Portal - Continental Training Center S.A., Panama (AMP Accredited).",
  keywords: ["CTC Panama", "Continental Training Center", "Maritime Training Panama", "STCW Certification", "Seafarer Verification", "Autoridad Maritima de Panama"],
  authors: [{ name: "Continental Training Center S.A." }],
  icons: {
    icon: "/ctc-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-[#0088CC] selection:text-white`}>
        <LanguageProvider>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
