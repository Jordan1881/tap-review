import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "TapReview — הקישו לביקורת בגוגל",
  description:
    "כרטיסי NFC ו-QR שמפנים לקוחות ישירות לביקורת בגוגל. פשוט, מהיר, ותקין.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
