import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CozeChatWidget from "./page"; // nếu dùng
import Footer from "@/components/ui/Footer";
import RightPanel from "@/components/ui/RightPanel";
import MainLayout from "./components/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trợ Lý Học Tập",
  description: "My Next.js App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
        <CozeChatWidget />
      </body>
    </html>
  );
}
