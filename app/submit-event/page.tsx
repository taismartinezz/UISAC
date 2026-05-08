"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SubmitEventForm from "@/app/components/submit-event-form";

export default function SubmitEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <section className="bg-background">
        <div className="mx-auto max-w-[1440px] px-4 py-24 text-center lg:px-12">
          <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-[#e9e2f3]" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[860px] px-4 py-16 lg:px-12">
        <div className="mb-10 text-center">
          <h1 className="text-[2.8rem] font-extrabold text-[#2f2147] md:text-[3.5rem]">
            Submit an Event
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-[#5b4b78] md:text-2xl">
            Fill in the details below. Your event will be reviewed by an admin before appearing on the calendar.
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm lg:p-12">
          <SubmitEventForm />
        </div>
      </div>
    </section>
  );
}
