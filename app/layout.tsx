import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AppConfigGate } from "./components/AppConfigGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stonks Economy",
    template: "%s · Stonks Economy",
  },
  description:
    "Organize o mês a partir do salário: contas, lazer e investimentos no lugar certo.",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* Configuração de runtime (gerada pelo container em produção); precisa carregar antes do app. */}
        <Script src="/config.js" strategy="beforeInteractive" />
        <AppConfigGate>{children}</AppConfigGate>
      </body>
    </html>
  );
}
