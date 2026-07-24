import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, MapPinned, Users, ShieldCheck, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import EventGrid from '../components/EventGrid';
import StatisticsCard from '../components/StatisticsCard';
import Loader from '../components/Loader';
import { eventService } from '../services/eventService';
import { categories } from '../utils/constants';
import toast from 'react-hot-toast';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEvents: 0, cities: 0, organizers: 0, users: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventService.getEvents({ limit: 8, sortBy: 'popular' });
        setEvents(data.events || []);
        setStats({
          totalEvents: data.pagination?.total || 0,
          cities: new Set((data.events || []).map((event) => event.city)).size,
          organizers: new Set((data.events || []).map((event) => event.organizer?._id || event.organizer?.id)).size,
          users: data.events?.reduce((count, event) => count + (event.registeredCount || 0), 0) || 0
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load events');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleRegister = (event) => navigate(`/events/${event._id || event.id}`);

  return (
    <div className="page-stack">
      <Hero />

      <section className="stats-strip">
        <StatisticsCard label="Total Events" value={stats.totalEvents} icon={<CalendarDays size={20} />} tone="primary" />
        <StatisticsCard label="Registered Users" value={stats.users} icon={<Users size={20} />} tone="accent" />
        <StatisticsCard label="Cities" value={stats.cities} icon={<MapPinned size={20} />} tone="warning" />
        <StatisticsCard label="Organizers" value={stats.organizers} icon={<ShieldCheck size={20} />} tone="success" />
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Featured Events</span>
            <h2>Trending events worth your attention</h2>
          </div>
          <button type="button" className="text-button" onClick={() => navigate('/search')}>
            View all events
          </button>
        </div>
        {loading ? <Loader label="Loading featured events" /> : <EventGrid events={events.slice(0, 4)} onRegister={handleRegister} />}
      </section>

      <section className="content-section categories-panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">Categories</span>
            <h2>Find the right experience</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category} to={`/search?category=${encodeURIComponent(category)}`} className="category-chip">
              <Sparkles size={16} /> {category}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;