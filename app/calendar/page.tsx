const events = [
  {
    date: "March 12, 2026",
    title: "Student Resource Orientation",
    copy: "A welcome session covering campus services, advising pathways, and support channels.",
  },
  {
    date: "April 9, 2026",
    title: "Advocacy Listening Session",
    copy: "Open forum for international students to raise concerns and propose improvements.",
  },
  {
    date: "May 21, 2026",
    title: "Tax Filing Support Clinic",
    copy: "Hands-on preparation support for annual forms, documents, and filing deadlines.",
  },
];

export default function CalendarPage() {
  return (
    <section className="page-card">
      <h1 className="page-title">Calendar</h1>
      <p className="page-copy">
        Upcoming programming for international student support and community
        engagement.
      </p>
      <div className="calendar-list">
        {events.map((event) => (
          <article className="event-card" key={event.title}>
            <p className="event-date">{event.date}</p>
            <h2 className="event-title">{event.title}</h2>
            <p className="event-copy">{event.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
