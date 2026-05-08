"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export type PendingEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: "Social" | "Academic" | "Advocacy" | "Career";
  submitterEmail: string;
  submitterName: string;
  submittedAt: string | null;
};

type Props = {
  event: PendingEvent;
  onResolved: (id: string) => void;
};

export default function PendingEventCard({ event, onResolved }: Props) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  async function handle(action: "approve" | "reject") {
    setStatus("loading");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      if (res.ok) onResolved(event.id);
      else setStatus("idle");
    } catch {
      setStatus("idle");
    }
  }

  const [month, day] = formatDate(event.date);

  return (
    <article className="grid gap-6 border-b border-border p-6 last:border-b-0 lg:grid-cols-[120px_1fr_auto] lg:items-start">
      {/* Date badge */}
      <div className="grid h-[110px] w-[110px] place-items-center rounded-3xl border border-[#d6cce7] bg-[#eee8f7] text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-[#4e2a84]">{month}</p>
        <p className="text-4xl font-extrabold text-[#2f2147]">{day}</p>
      </div>

      {/* Details */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-extrabold text-[#2f2147]">{event.title}</h2>
          <span className="rounded-full bg-[#ece8f5] px-3 py-1 text-sm font-semibold text-[#4f3f6f]">
            {event.type}
          </span>
        </div>
        <p className="mt-2 text-base leading-relaxed text-[#5b4b78]">{event.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#6b5b89]">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon />
            {fmt12(event.startTime)} – {fmt12(event.endTime)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LocationIcon />
            {event.location}
          </span>
        </div>
        <p className="mt-2 text-xs text-[#9b88b6]">
          Submitted by <strong>{event.submitterName || event.submitterEmail}</strong>
          {event.submittedAt ? ` · ${new Date(event.submittedAt).toLocaleDateString()}` : ""}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 lg:flex-col">
        <button
          onClick={() => handle("approve")}
          disabled={status === "loading"}
          className="rounded-full bg-[#4e2a84] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#3f216d] disabled:opacity-50"
          type="button"
        >
          Approve
        </button>
        <button
          onClick={() => handle("reject")}
          disabled={status === "loading"}
          className="rounded-full border border-[#d4183d] px-5 py-2.5 text-sm font-bold text-[#d4183d] transition hover:bg-[#fdf2f4] disabled:opacity-50"
          type="button"
        >
          Reject
        </button>
      </div>
    </article>
  );
}

function formatDate(dateStr: string): [string, string] {
  const [, _, day] = dateStr.split("-");
  const monthName = new Date(`${dateStr}T12:00:00`).toLocaleString("en-US", { month: "short" });
  return [monthName, String(parseInt(day, 10))];
}

function fmt12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
