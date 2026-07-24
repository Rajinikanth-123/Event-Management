import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BarChart3, Users, CalendarRange, Banknote, FileDown } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import { adminService } from '../services/adminService';
import { SimpleBarChart, SimplePieChart } from '../components/Charts';
import { formatCurrency, formatDate } from '../utils/formatters';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminService.getDashboard();
        setDashboard(data.dashboard);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loader label="Loading admin dashboard" />;
  if (!dashboard) return <div className="empty-state">No dashboard data available.</div>;

  return (
    <section className="page-panel">
      <span className="eyebrow">Admin Dashboard</span>
      <h1>Operations center</h1>
      <div className="dashboard-cards">
        <DashboardCard title="Total Users" value={dashboard.totalUsers} subtitle="Registered accounts" action={<Users size={16} />} />
        <DashboardCard title="Total Events" value={dashboard.totalEvents} subtitle="Published events" action={<CalendarRange size={16} />} />
        <DashboardCard title="Total Registrations" value={dashboard.totalRegistrations} subtitle="Confirmed tickets" action={<BarChart3 size={16} />} />
        <DashboardCard title="Revenue" value={formatCurrency(dashboard.revenue)} subtitle="Event revenue" action={<Banknote size={16} />} />
      </div>

      <div className="admin-charts">
        <div className="chart-card">
          <h3>Users by Role</h3>
          <SimplePieChart data={dashboard.usersByRole || []} />
        </div>
        <div className="chart-card">
          <h3>Events by City</h3>
          <SimpleBarChart data={dashboard.eventsByCity || []} />
        </div>
      </div>

      <div className="two-column-grid">
        <div className="page-panel nested-panel">
          <div className="section-header">
            <h2>Recent Registrations</h2>
            <button type="button" className="text-button">
              <FileDown size={16} /> Export CSV
            </button>
          </div>
          <div className="compact-list">
            {(dashboard.recentRegistrations || []).map((registration) => (
              <div className="compact-item" key={registration._id}>
                <div>
                  <strong>{registration.userId?.name}</strong>
                  <p>{registration.eventId?.title}</p>
                  <span>{formatDate(registration.registrationDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="page-panel nested-panel">
          <h2>Recent Events</h2>
          <div className="compact-list">
            {(dashboard.recentEvents || []).map((event) => (
              <div className="compact-item" key={event._id}>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;