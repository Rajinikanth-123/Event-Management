import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">Modern Event Operations</span>
        <h1>Manage Events Smarter</h1>
        <p>
          Create, promote, register, and track events in one responsive platform built for organizers, attendees, and administrators.
        </p>
        <div className="hero-actions">
          <button type="button" className="primary-button" onClick={() => navigate('/search')}>
            Explore Events
          </button>
          <button type="button" className="secondary-button" onClick={() => navigate('/dashboard/create-event')}>
            Create Event
          </button>
        </div>
      </div>
      <div className="hero-panel">
        <div className="hero-glass">
          <h3>Live Operations</h3>
          <p>Ticketing, reminders, approvals, and attendance tracking with a polished workflow.</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;