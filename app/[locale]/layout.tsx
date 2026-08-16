import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LA Group Official",
  description:
    "Premium vehicle rental and tour packages across Indonesia",

  icons: {
    icon: [
      {
        url: "/images/LOGO LA GROUP 2.png",
        type: "image/png",
      },
    ],
    shortcut: "/images//images/LOGO LA GROUP 2.png",
    apple: "/images//images/LOGO LA GROUP 2.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as "en" | "id")) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <div className="min-h-screen flex flex-col">
 
           {/* Content */}
          <main className="flex-1">
            {children}
          </main>

        </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}