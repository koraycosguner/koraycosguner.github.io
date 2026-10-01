import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "Yusuf's 7th Grade Quizzes",
    description: "A growing multi-subject library of focused 7th-grade practice quizzes.",
    openGraph: {
      title: "Yusuf's 7th Grade Quizzes",
      description: "Quiz, learn, and level up across every 7th-grade subject.",
      url: origin,
      siteName: "Yusuf's 7th Grade Quizzes",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Yusuf's 7th Grade Quizzes",
      description: "A growing multi-subject library of focused 7th-grade practice quizzes.",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
