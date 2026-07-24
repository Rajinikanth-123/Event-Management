import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { registrationService } from '../services/registrationService';
import { formatDate } from '../utils/formatters';

const RegisteredEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await registrationService.getMyEvents();
        setRegistrations(data.registrations || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load registrations');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loader label="Loading registrations" />;

  return (
    <section className="page-panel">
      <span className="eyebrow">Registered Events</span>
      <h1>Your tickets</h1>
      <div className="table-list">
        {registrations.map((registration) => (
          <article className="table-row" key={registration._id}>
            <div>
              <h3>{registration.eventId?.title}</h3>
              <p>{registration.eventId?.venue}, {registration.eventId?.city}</p>
            </div>
            <div>
              <strong>{registration.ticketNumber}</strong>
              <p>{formatDate(registration.registrationDate)}</p>
            </div>
          </article>
        ))}
        {!registrations.length && <div className="empty-state">No registered events yet.</div>}
      </div>
    </section>
  );
};

export default RegisteredEvents;