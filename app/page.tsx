import Link from "next/link";

const cards = [
  {
    href: "/about",
    title: "About",
    copy: "Who we are and how we support international students across campus.",
  },
  {
    href: "/mission-statement",
    title: "Mission & Statement",
    copy: "Our values, commitments, and advocacy priorities.",
  },
  {
    href: "/calendar",
    title: "Calendar",
    copy: "Upcoming workshops, clinics, and student events.",
  },
  {
    href: "/acknowledgment",
    title: "Sponsor",
    copy: "Acknowledgment of the Buffett Institute's support.",
  },
  {
    href: "/tax-filing",
    title: "Tax Filing",
    copy: "Guidance and resources for annual student tax responsibilities.",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="hero-panel">
        <h1 className="hero-title">International Student Advocacy</h1>
        <p className="hero-subtitle">
          Northwestern-focused support for global students through resources,
          advocacy, and practical guidance.
        </p>
        <div className="cta-row">
          <Link className="cta-button" href="/about">
            Explore Resources
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link className="page-card" key={card.href} href={card.href}>
            <h2 className="text-2xl text-[#4e2a84]">{card.title}</h2>
            <p className="page-copy">{card.copy}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
