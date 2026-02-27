const events = [
  {
    month: "February",
    day: "26",
    title: "UISAC | Finance Career Panel",
    copy: "Join us for Finance Panel!",
    time: "3:00 PM - 5:30 PM",
    place: "Roberta Buffett Institute",
    type: "Social",
  },
  {
    month: "February",
    day: "27",
    title: "KINSCO x UISAC | International Study Cafe",
    copy: "KINSCO and UISAC are hosting an International Study Cafe! Join us for a cozy study session with free coffee and snacks.",
    time: "2:30 PM - 6:00 PM",
    place: "Roberta Buffett Institute",
    type: "Academic",
  },
];

export default function CalendarPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12">
        <div className="text-center">
          <h1 className="text-[2.8rem] font-extrabold text-[#2f2147] md:text-[3.6rem]">
            Upcoming Events
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-[#5b4b78] md:text-2xl">
            Stay connected and involved with our community events.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm">
          {events.map((event) => (
            <article
              className="grid gap-6 border-b border-border p-6 last:border-b-0 lg:grid-cols-[140px_1fr_auto] lg:items-start"
              key={event.title}
            >
              <div className="grid h-[130px] w-[130px] place-items-center rounded-3xl border border-[#d6cce7] bg-[#eee8f7] text-center">
                <p className="text-sm font-bold uppercase tracking-wide text-[#4e2a84]">
                  {event.month}
                </p>
                <p className="text-5xl font-extrabold text-[#2f2147]">
                  {event.day}
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-[#2f2147] md:text-[2rem]">
                  {event.title}
                </h2>
                <p className="mt-2 text-lg leading-relaxed text-[#5b4b78] md:text-xl">
                  {event.copy}
                </p>
                <div className="mt-4 flex flex-wrap gap-6 text-lg text-[#6b5b89] md:text-xl">
                  <p className="inline-flex items-center gap-2">
                    <ClockIcon />
                    {event.time}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <LocationIcon />
                    {event.place}
                  </p>
                </div>
              </div>
              <p className="inline-flex h-fit rounded-full bg-[#ece8f5] px-4 py-2 text-base font-semibold text-[#4f3f6f]">
                {event.type}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
