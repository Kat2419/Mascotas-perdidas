import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mascotas Perdidas Colombia — Terremoto 2026",
  description:
    "Publica y busca mascotas perdidas o encontradas tras el terremoto en Chocó, Antioquia, Valle del Cauca, Cauca, Risaralda, Quindío y Caldas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 dark:border-white/10 py-6 text-center text-xs opacity-60">
          Iniciativa comunitaria para ayudar a reunir mascotas con sus familias tras el terremoto. No afiliada a ninguna entidad gubernamental.
        </footer>
      </body>
    </html>
  );
}
