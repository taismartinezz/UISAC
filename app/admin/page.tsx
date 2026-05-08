"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import PendingEventCard, { type PendingEvent } from "@/app/components/pending-event-card";
import { auth } from "@/lib/firebase";

type Tab = "approvals";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("approvals");
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [user, isAdmin, loading, router]);

  const fetchPending = useCallback(async () => {
    if (!auth.currentUser) return;
    setFetching(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && user && isAdmin) fetchPending();
  }, [loading, user, isAdmin, fetchPending]);

  function handleResolved(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  if (loading || !user || !isAdmin) {
    return (
      <section className="bg-background">
        <div className="mx-auto max-w-360 px-4 py-24 text-center lg:px-12">
          <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-[#e9e2f3]" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-360 px-4 py-16 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cfc2e5] bg-[#e9e2f3] px-4 py-1.5 text-sm font-bold text-[#4e2a84]">
            <ShieldIcon />
            Admin Dashboard
          </div>
          <h1 className="mt-4 text-[2.4rem] font-extrabold text-[#2f2147] md:text-[3rem]">
            Admin Panel
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-border">
          <TabButton
            active={tab === "approvals"}
            onClick={() => setTab("approvals")}
            badge={!fetching && events.length > 0 ? events.length : undefined}
          >
            <ClipboardIcon />
            Event Approvals
          </TabButton>
        </div>

        {/* Tab: Event Approvals */}
        {tab === "approvals" && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-lg text-[#5b4b78]">
                Review and approve or reject submitted events before they appear on the calendar.
              </p>
              <button
                onClick={fetchPending}
                className="rounded-full border border-[#cfc2e5] px-5 py-2 text-sm font-semibold text-[#4e2a84] transition hover:bg-[#f3eefb]"
                type="button"
              >
                Refresh
              </button>
            </div>

            {fetching ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-36 animate-pulse rounded-2xl bg-[#f3eefb]" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-4xl border border-border bg-card p-16 text-center shadow-sm">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#efe7fb] text-[#6f58a8]">
                  <CheckCircleIcon />
                </div>
                <h2 className="text-2xl font-extrabold text-[#2f2147]">All caught up!</h2>
                <p className="mt-2 text-lg text-[#5b4b78]">No events are waiting for review.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm">
                {events.map((event) => (
                  <PendingEventCard key={event.id} event={event} onResolved={handleResolved} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  badge,
  children,
}: {
  active: boolean;
  onClick: () => void;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={[
        "relative inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition",
        active
          ? "border-[#4e2a84] text-[#4e2a84]"
          : "border-transparent text-[#5b4b78] hover:text-[#4e2a84]",
      ].join(" ")}
    >
      {children}
      {badge !== undefined && (
        <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#4e2a84] px-1.5 text-[11px] font-extrabold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2 3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.4 2.5L15.5 10" />
    </svg>
  );
}
