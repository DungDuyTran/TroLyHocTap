"use client";

import { usePathname } from "next/navigation";
import MainLayout from "./MainLayout";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return isLandingPage ? <>{children}</> : <MainLayout>{children}</MainLayout>;
}
