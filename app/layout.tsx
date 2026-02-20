import type { Metadata } from "next";
import Link from "next/link";
import { Lora, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "International Student Advancement and Advocacy",
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
      <body className={`${nunito.variable} ${lora.variable} antialiased`}>
        <header className="site-header">
          <div className="site-container nav-wrap">
            <Link className="brand" href="/">
              International Student Advancement
            </Link>
            <nav className="main-nav" aria-label="Primary">
              <Link href="/about">About</Link>
              <Link href="/mission-statement">Mission & Statement</Link>
              <Link href="/calendar">Calendar</Link>
              <Link href="/acknowledgment">Sponsor</Link>
              <Link href="/tax-filing">Tax Filing</Link>
            </nav>
          </div>
        </header>
        <main className="site-container page-shell">{children}</main>
      </body>
    </html>
  );
}
