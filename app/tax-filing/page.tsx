export default function TaxFilingPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-12">
        <div className="text-center">
          <h1 className="text-[2.8rem] font-extrabold text-[#2f2147] md:text-[3.5rem]">
            Tax Filing Resources
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-xl leading-relaxed text-[#5b4b78] md:text-2xl">
            Understanding U.S. taxes as an international student can be
            complex. We&apos;re here to help guide you to the right resources.
          </p>
        </div>

        <aside className="mt-10 rounded-3xl border border-[#d4c7e9] bg-[#f1ecf8] p-6 shadow-sm">
          <div className="flex items-start gap-3 text-[#5b4b78]">
            <AlertIcon />
            <div>
              <h2 className="text-2xl font-extrabold">Disclaimer</h2>
              <p className="mt-2 text-lg leading-relaxed md:text-xl">
                UISAC provides general information only. We are not tax
                professionals or attorneys. Please consult a qualified tax
                advisor for your specific situation.
              </p>
            </div>
          </div>
        </aside>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e9e2f3] text-[#4e2a84]">
              <CalendarIcon />
            </div>
            <h2 className="mt-6 text-[2rem] font-extrabold text-[#2f2147] md:text-[2.4rem]">
              Important Dates
            </h2>
            <ul className="mt-5 space-y-4 text-lg leading-relaxed text-[#5b4b78] md:text-xl">
              <li className="flex gap-3">
                <CheckIcon />
                <span>
                  <strong>April 15:</strong> Deadline to file federal tax
                  returns.
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span>
                  <strong>June 15:</strong> Deadline for Form 8843 if you have
                  no U.S. income.
                </span>
              </li>
            </ul>
          </article>

          <article className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e9e2f3] text-[#6f58a8]">
              <FileIcon />
            </div>
            <h2 className="mt-6 text-[2rem] font-extrabold text-[#2f2147] md:text-[2.4rem]">
              Common Forms
            </h2>
            <ul className="mt-5 space-y-4 text-lg leading-relaxed text-[#5b4b78] md:text-xl">
              <li className="flex gap-3">
                <CheckIcon />
                <span>
                  <strong>Form 8843:</strong> Required for all F-1/J-1
                  students, even with no income.
                </span>
              </li>
              <li className="flex gap-3">
                <CheckIcon />
                <span>
                  <strong>1040-NR:</strong> Non-Resident Alien Income Tax
                  Return.
                </span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-1 h-8 w-8 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-1 h-7 w-7 shrink-0 text-[#6f58a8]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.4 2.5L15.5 10" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}
