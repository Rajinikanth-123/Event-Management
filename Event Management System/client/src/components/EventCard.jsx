import { Bookmark, MapPin, Clock3, CalendarDays, Ticket, User, Eye, BadgePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, formatSeats, formatTime } from '../utils/formatters';
import useBookmarks from '../hooks/useBookmarks';

const EventCard = ({ event, onRegister }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const availableSeats = event.availableSeats ?? formatSeats(event.capacity, event.registeredCount || event.registeredUsers?.length || 0);
  const bookmarked = isBookmarked(event._id || event.id);

  return (
    <article className="event-card">
      <div className="event-image-wrap">
        <img src={event.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'} alt={event.title} />
        <span className="event-badge">{event.category}</span>
      </div>
      <div className="event-card-body">
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>
        <div className="event-meta">
          <span><CalendarDays size={14} /> {formatDate(event.date)}</span>
          <span><Clock3 size={14} /> {formatTime(event.time)}</span>
          <span><MapPin size={14} /> {event.venue}, {event.city}</span>
          <span><Ticket size={14} /> {formatCurrency(event.price)}</span>
          <span><User size={14} /> {event.organizer?.name || event.organizer?.email || 'Organizer'}</span>
          <span><BadgePlus size={14} /> Seats left: {availableSeats}</span>
        </div>
        <div className="event-card-actions">
          <Link to={`/events/${event._id || event.id}`} className="secondary-button inline-button">
            <Eye size={16} /> View Details
          </Link>
          <button type="button" className="primary-button inline-button" onClick={() => onRegister(event)}>
            <BadgePlus size={16} /> Register
          </button>
          <button type="button" className={`ghost-button inline-button ${bookmarked ? 'active' : ''}`} onClick={() => toggleBookmark(event._id || event.id)}>
            <Bookmark size={16} /> {bookmarked ? 'Saved' : 'Bookmark'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;