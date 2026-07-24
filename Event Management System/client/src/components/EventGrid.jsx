import EventCard from './EventCard';

const EventGrid = ({ events, onRegister }) => {
  if (!events.length) {
    return <div className="empty-state">No events found.</div>;
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event._id || event.id} event={event} onRegister={onRegister} />
      ))}
    </div>
  );
};

export default EventGrid;