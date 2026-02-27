export default function AcknowledgmentPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center lg:px-12">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#efe7fb] text-[#6f58a8]">
          <AwardIcon />
        </div>
        <h1 className="mt-6 text-[2.8rem] font-extrabold text-[#2f2147] md:text-[3.5rem]">
          With Gratitude
        </h1>
        <p className="mx-auto mt-6 max-w-4xl text-xl leading-relaxed text-[#5b4b78] md:text-2xl">
          We extend our deepest appreciation to our primary sponsor for their
          unwavering support and commitment to international education.
        </p>

        <div className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-border bg-[#f5f1fa] p-6 shadow-sm lg:p-10">
          <div className="mx-auto max-w-[560px] rounded-3xl border border-[#d9cfeb] bg-white p-8 shadow-sm">
            <p className="text-center text-[1.8rem] font-extrabold tracking-wide text-[#352553] md:text-[2.2rem]">
              BUFFETT INSTITUTE
            </p>
          </div>
          <h2 className="mt-8 text-[2rem] font-extrabold text-[#2f2147] md:text-[2.8rem]">
            The Buffett Institute for Global Affairs
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-xl leading-relaxed text-[#5b4b78] md:text-2xl">
            Their generous contribution has enabled us to launch critical
            advocacy initiatives, host community-building events, and provide
            essential resources to students from around the globe.
          </p>
        </div>
      </div>
    </section>
  );
}

function AwardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-10 w-10"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
    </svg>
  );
}
