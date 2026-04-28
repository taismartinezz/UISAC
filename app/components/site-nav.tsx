"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <GlobeIcon /> },
  { href: "/about", label: "About", icon: <InfoIcon /> },
  { href: "/mission-statement", label: "Mission", icon: <HeartIcon /> },
  { href: "/calendar", label: "Calendar", icon: <CalendarIcon /> },
  { href: "/acknowledgment", label: "Acknowledgment", icon: <AwardIcon /> },
  { href: "/tax-filing", label: "Tax Filing", icon: <FileIcon /> },
  { href: "/discussions", label: "Discussions", icon: <ChatBubbleIcon /> },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-4 lg:px-12">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid h-12 w-12 overflow-hidden rounded-2xl bg-accent">
            <img
              src="/images/logo.jpg"
              alt="UISAC logo"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-[#2f2147] md:text-4xl">
            UISAC
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-5 py-3 text-lg font-semibold transition",
                  active
                    ? "bg-accent text-[#4e2a84] shadow-[0_2px_10px_rgba(78,42,132,0.2)]"
                    : "text-[#5b4b78] hover:bg-accent/70 hover:text-[#4e2a84]",
                ].join(" ")}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <nav
        aria-label="Primary mobile"
        className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden"
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                active
                  ? "bg-accent text-[#4e2a84]"
                  : "text-[#5b4b78] hover:bg-accent/70 hover:text-[#4e2a84]",
              ].join(" ")}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function GlobeIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </IconBase>
  );
}

function InfoIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </IconBase>
  );
}

function HeartIcon() {
  return (
    <IconBase>
      <path d="M20.8 8.6a5 5 0 0 0-7.1 0L12 10.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 23l8.8-7.3a5 5 0 0 0 0-7.1z" />
    </IconBase>
  );
}

function CalendarIcon() {
  return (
    <IconBase>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </IconBase>
  );
}

function AwardIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="8" r="4" />
      <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
    </IconBase>
  );
}

function FileIcon() {
  return (
    <IconBase>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </IconBase>
  );
}

function ChatBubbleIcon() {
  return (
    <IconBase>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </IconBase>
  );
}
