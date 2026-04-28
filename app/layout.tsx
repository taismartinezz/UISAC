import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import SiteNav from "./components/site-nav";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UISAC",
  description:
    "Resource hub for international student support, advocacy, events, sponsor acknowledgment, and tax filing guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
