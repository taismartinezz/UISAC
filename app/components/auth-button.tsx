"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function AuthButton() {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return (
      <div className="h-10 w-24 animate-pulse rounded-full bg-[#e9e2f3]" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={signIn}
        className="inline-flex items-center gap-2 rounded-full border border-[#cfc2e5] bg-white px-5 py-2.5 text-base font-semibold text-[#4e2a84] shadow-sm transition hover:bg-[#f3eefb]"
        type="button"
      >
        <GoogleIcon />
        Sign in
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[#cfc2e5] bg-white py-1 pl-2 pr-4 shadow-sm transition hover:bg-[#f3eefb]"
        type="button"
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? "User"}
            width={32}
            height={32}
            className="rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#4e2a84] text-sm font-bold text-white">
            {user.displayName?.[0] ?? user.email?.[0] ?? "?"}
          </span>
        )}
        <span className="max-w-[120px] truncate text-sm font-semibold text-[#2f2147]">
          {user.displayName ?? user.email}
        </span>
        {isAdmin && (
          <span className="rounded-full bg-[#4e2a84] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Admin
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-[#e0d7f0] bg-white shadow-lg">
          <div className="border-b border-[#f0eaf8] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#2f2147]">
              {user.displayName}
            </p>
            <p className="truncate text-xs text-[#5b4b78]">{user.email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); signOut(); }}
            className="w-full px-4 py-3 text-left text-sm font-semibold text-[#d4183d] transition hover:bg-[#fdf2f4]"
            type="button"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
