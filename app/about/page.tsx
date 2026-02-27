export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="bg-[#ebe4f5]">
        <div className="mx-auto max-w-[1440px] px-4 py-24 text-center lg:px-12 lg:py-28">
          <h1 className="text-[2.6rem] font-extrabold text-[#2f2147] md:text-[3.6rem]">
            About UISAC
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-xl leading-relaxed text-[#5b4b78] md:text-[2rem]">
            The International Student Advancement and Advocacy Project (UISAC)
            is a student-led organization dedicated to supporting international
            students.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-12">
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm">
            <img
              src="./images/about.jpg"
              alt="University library interior"
              className="h-[420px] w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-[2.3rem] font-extrabold text-[#2f2147] md:text-[2.8rem]">
              Who We Are
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-[#5b4b78] md:text-2xl">
              Founded in 2025, UISAC has grown into a vibrant community hub. We
              understand the complexities of moving to a new country for
              education, and we strive to make that transition as smooth as
              possible.
            </p>
            <p className="mt-5 text-xl leading-relaxed text-[#5b4b78] md:text-2xl">
              Our team consists of students from over 30 different countries,
              bringing a wealth of diverse perspectives and experiences to our
              advocacy work.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
