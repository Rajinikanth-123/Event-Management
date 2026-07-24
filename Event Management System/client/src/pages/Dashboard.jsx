import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { registrationService } from '../services/registrationService';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [myEventsResponse, ownEventsResponse] = await Promise.all([
          registrationService.getMyEvents(),
          eventService.getEvents({ mine: true, organizer: 'me', limit: 100 })
        ]);
        setRegistrations(myEventsResponse.data.registrations || []);
        setEvents(ownEventsResponse.data.events || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <Loader label="Loading dashboard" />;
  }

  return (
    <div className="dashboard-grid">
      <div className="page-panel">
        <span className="eyebrow">Dashboard</span>
        <h1>Welcome back, {user?.name}</h1>
        <p>Track your events, registrations, and profile activity from one place.</p>
        <div className="dashboard-cards">
          <DashboardCard title="My Events" value={events.length} subtitle="Events created" action={<Link to="/dashboard/create-event">Create new</Link>} />
          <DashboardCard title="Registrations" value={registrations.length} subtitle="Tickets received" action={<Link to="/dashboard/registered-events">View list</Link>} />
          <DashboardCard title="Profile" value={user?.role?.toUpperCase() || 'USER'} subtitle="Current role" action={<Link to="/dashboard/profile">Update profile</Link>} />
          <DashboardCard title="Quick Actions" value="Ready" subtitle="Create or manage events" action={<Link to="/search">Explore</Link>} />
        </div>
      </div>
      <div className="page-panel">
        <h2>Recent registrations</h2>
        <div className="compact-list">
          {registrations.slice(0, 5).map((registration) => (
            <div className="compact-item" key={registration._id}>
              <div>
                <strong>{registration.eventId?.title}</strong>
                <p>{registration.ticketNumber}</p>
              </div>
            </div>
          ))}
          {!registrations.length && <div className="empty-state">No registrations yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;