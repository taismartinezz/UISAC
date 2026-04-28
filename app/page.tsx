import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-[calc(100vh-86px)] bg-[#f5f1fa]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-4 py-14 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-[#cfc2e5] bg-[#e9e2f3] px-5 py-2 text-base font-bold text-[#4e2a84] md:text-xl">
            Welcome to UISAC
          </p>
          <h1 className="mt-8 text-[3rem] font-extrabold leading-[1.05] text-[#2f2147] md:text-[4.8rem]">
            Empowering
            <br />
            <span className="bg-gradient-to-r from-[#836eaa] to-[#6f58a8] bg-clip-text text-transparent">
              International
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#6f58a8] to-[#4e2a84] bg-clip-text text-transparent">
              Students
            </span>{" "}
            for
            <br />
            Success
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-[#5b4b78] md:text-4xl">
            We advocate for international student rights, provide essential
            resources, and build a welcoming community for everyone.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              className="rounded-2xl bg-[#4e2a84] px-9 py-4 text-2xl font-bold text-white shadow-[0_8px_24px_rgba(78,42,132,0.35)] transition hover:bg-[#3f216d] sm:text-xl"
              href="/about"
            >
              Learn More
            </Link>
            <Link
              className="rounded-2xl border border-border bg-card px-9 py-4 text-2xl font-semibold text-[#4b3b67] shadow-sm transition hover:bg-accent/30"
              href="/mission-statement"
            >
              Our Mission
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border-4 border-white bg-white p-2 shadow-[0_24px_50px_rgba(28,44,70,0.18)]">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
            alt="International students celebrating outdoors"
            className="h-[460px] w-full rounded-[1.6rem] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
