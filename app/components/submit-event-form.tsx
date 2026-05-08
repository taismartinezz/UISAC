"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase";

type FormData = {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: "Social" | "Academic" | "Advocacy" | "Career" | "";
};

const INITIAL: FormData = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  type: "",
};

export default function SubmitEventForm() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !auth.currentUser) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("/api/submit-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let message = "Submission failed";
        try {
          const data = await res.json();
          message = data.error ?? message;
        } catch {}
        throw new Error(message);
      }

      setStatus("success");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-[#c3e6cb] bg-[#f0faf3] p-10 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#d4edda] text-[#2d6a4f]">
          <CheckCircleIcon />
        </div>
        <h2 className="text-2xl font-extrabold text-[#2f2147]">Event Submitted!</h2>
        <p className="mt-3 text-lg text-[#5b4b78]">
          Your event is pending admin review and will appear on the calendar once approved.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full bg-[#4e2a84] px-8 py-3 font-bold text-white transition hover:bg-[#3f216d]"
          type="button"
        >
          Submit another event
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Event Title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. International Study Cafe"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Event Type" required>
          <select
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            required
            className={inputClass}
          >
            <option value="" disabled>Select a type…</option>
            <option value="Social">Social</option>
            <option value="Academic">Academic</option>
            <option value="Advocacy">Advocacy</option>
            <option value="Career">Career</option>
          </select>
        </Field>
      </div>

      <Field label="Description" required>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Tell students what this event is about…"
          required
          rows={4}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Date" required>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Start Time" required>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => update("startTime", e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="End Time" required>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => update("endTime", e.target.value)}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Location" required>
        <input
          type="text"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="e.g. Roberta Buffett Institute, Room 101"
          required
          className={inputClass}
        />
      </Field>

      {status === "error" && (
        <p className="rounded-xl border border-[#f5c6cb] bg-[#fdf2f4] px-4 py-3 text-sm font-semibold text-[#d4183d]">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-2xl bg-[#4e2a84] py-4 text-lg font-bold text-white shadow-[0_8px_24px_rgba(78,42,132,0.3)] transition hover:bg-[#3f216d] disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Submit Event for Review"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#d6cce7] bg-[#f8f5fc] px-4 py-3 text-[#2f2147] placeholder-[#a89bc2] outline-none transition focus:border-[#4e2a84] focus:ring-2 focus:ring-[#4e2a84]/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-[#2f2147]">
        {label}
        {required && <span className="ml-1 text-[#d4183d]">*</span>}
      </label>
      {children}
    </div>
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
