import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, Clock3, MapPinned, Share2, Ticket, Users, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import CountdownTimer from '../components/CountdownTimer';
import SocialShareButtons from '../components/SocialShareButtons';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventService.getEventById(id);
        setEvent(data.event);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const { data } = await registrationService.registerEvent(id);
      setRegistration(data.registration);
      setEvent((current) => ({
        ...current,
        registeredCount: (current.registeredCount || 0) + 1,
        availableSeats: Math.max((current.availableSeats || current.capacity) - 1, 0)
      }));
      toast.success(data.message || 'Registration complete');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Loader label="Loading event details" />;
  if (!event) return <div className="empty-state">Event not found.</div>;

  const remainingSeats = event.availableSeats ?? Math.max((event.capacity || 0) - (event.registeredCount || 0), 0);
  const shareUrl = window.location.href;

  return (
    <section className="event-details">
      <div className="event-hero">
        <img src={event.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80'} alt={event.title} />
      </div>
      <div className="event-details-grid">
        <div className="page-panel">
          <span className="eyebrow">{event.category}</span>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <div className="event-meta detail-meta">
            <span><CalendarDays size={16} /> {formatDate(event.date)}</span>
            <span><Clock3 size={16} /> {event.time}</span>
            <span><MapPinned size={16} /> {event.venue}, {event.city}</span>
            <span><Ticket size={16} /> {formatCurrency(event.price)}</span>
            <span><Users size={16} /> Remaining seats: {remainingSeats}</span>
          </div>
          <div className="panel-block">
            <h3>Organizer</h3>
            <p>{event.organizer?.name}</p>
            <p>{event.organizer?.email}</p>
          </div>
          <div className="panel-block">
            <h3>Countdown</h3>
            <CountdownTimer targetDate={event.date} />
          </div>
          <div className="action-row">
            <button type="button" className="primary-button" onClick={handleRegister} disabled={!isAuthenticated || registering || remainingSeats <= 0}>
              {registering ? 'Registering...' : 'Register'}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigator.share ? navigator.share({ title: event.title, url: shareUrl }) : toast.success('Copy the URL to share this event')}
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
        <div className="page-panel">
          <h2>Location</h2>
          <p>{event.venue}, {event.city}</p>
          <div className="map-placeholder">Google Maps integration point</div>
          {registration && (
            <div className="ticket-panel">
              <h3>Your Ticket</h3>
              <p>Ticket Number: {registration.ticketNumber}</p>
              <div className="qr-holder">
                <img src={registration.qrCode} alt="QR code ticket" />
              </div>
              <button type="button" className="text-button" onClick={() => window.print()}>
                <QrCode size={16} /> Download Ticket PDF
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="page-panel">
        <h3>Share event</h3>
        <SocialShareButtons url={shareUrl} title={event.title} />
      </div>
    </section>
  );
};

export default EventDetails;