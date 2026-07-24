const About = () => {
  return (
    <section className="page-panel compact-panel">
      <span className="eyebrow">About</span>
      <h1>Built for modern event operations</h1>
      <p>
        EventFlow helps organizers publish events, manage registrations, issue QR-based tickets, and monitor attendance in one
        clean workflow.
      </p>
      <div className="info-grid">
        <div>
          <h3>Reliable</h3>
          <p>JWT auth, validation, rate limiting, and secure APIs.</p>
        </div>
        <div>
          <h3>Fast</h3>
          <p>Reusable React components with responsive layouts and simple interactions.</p>
        </div>
        <div>
          <h3>Ready to ship</h3>
          <p>Configured for Vercel, Render, Railway, and MongoDB Atlas.</p>
        </div>
      </div>
    </section>
  );
};

export default About;