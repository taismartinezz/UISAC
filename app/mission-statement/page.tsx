export default function MissionStatementPage() {
  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-[#3d285f]">
        <img
          src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=80"
          alt="Student speaking at an event"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#3d285f]/75" />
        <div className="relative mx-auto max-w-[1440px] px-4 py-24 text-center text-white lg:px-12 lg:py-32">
          <h1 className="text-[2.7rem] font-extrabold md:text-[3.8rem]">
            Our Mission &amp; Vision
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-xl leading-relaxed text-[#ede5fa] md:text-[2rem]">
            Guiding our every step is a commitment to the success and well-being
            of every international student.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] space-y-10 px-4 py-16 lg:px-12">
        <article className="grid gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm lg:grid-cols-[170px_1fr] lg:items-start">
          <div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e9e2f3] text-[#4e2a84]">
              <TargetIcon />
            </div>
            <h2 className="mt-5 text-[2rem] font-extrabold text-[#2f2147] md:text-[2.4rem]">
              Our Mission
            </h2>
          </div>
          <p className="text-xl leading-relaxed text-[#5b4b78] md:text-2xl">
            To empower international students by providing comprehensive support
            services, advocating for their rights and needs within the
            university system, and fostering a welcoming, inclusive community
            where diversity is celebrated as a core strength.
          </p>
        </article>

        <article className="grid gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm lg:grid-cols-[170px_1fr] lg:items-start">
          <div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#efe7fb] text-[#6f58a8]">
              <VisionIcon />
            </div>
            <h2 className="mt-5 text-[2rem] font-extrabold text-[#2f2147] md:text-[2.4rem]">
              Our Vision
            </h2>
          </div>
          <p className="text-xl leading-relaxed text-[#5b4b78] md:text-2xl">
            A university environment where international students not only
            succeed academically but also feel secure, represented, and fully
            connected to campus life and opportunity.
          </p>
        </article>
      </section>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M3 12s3-5 9-5 9 5 9 5-3 5-9 5-9-5-9-5Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
