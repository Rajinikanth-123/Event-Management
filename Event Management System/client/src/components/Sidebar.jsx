import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const linkClass = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-brand">
        <h2>Dashboard</h2>
        <p>{user?.role?.toUpperCase() || 'USER'}</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end className={linkClass}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/create-event" className={linkClass}>
          Create Event
        </NavLink>
        <NavLink to="/dashboard/registered-events" className={linkClass}>
          Registered Events
        </NavLink>
        <NavLink to="/dashboard/profile" className={linkClass}>
          Profile
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={linkClass}>
            Admin Dashboard
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;