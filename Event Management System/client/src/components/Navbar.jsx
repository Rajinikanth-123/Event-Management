import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, MoonStar, SunMedium, Search, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="navbar-shell">
      <div className="navbar-brand">
        <Link to="/" className="brand-mark">
          <Ticket size={20} />
          <span>EventFlow</span>
        </Link>
      </div>

      <button type="button" className="icon-button mobile-toggle" onClick={() => setMobileOpen((value) => !value)}>
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
        <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>
          About
        </NavLink>
        <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileOpen(false)}>
          Contact
        </NavLink>
        <NavLink to="/search" className={navLinkClass} onClick={() => setMobileOpen(false)}>
          <Search size={16} /> Search
        </NavLink>
      </nav>

      <div className={`navbar-actions ${mobileOpen ? 'open' : ''}`}>
        <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <MoonStar size={18} /> : <SunMedium size={18} />}
        </button>
        {isAuthenticated ? (
          <>
            <button type="button" className="text-button" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button type="button" className="primary-button" onClick={handleLogout}>
              Logout
            </button>
            <button type="button" className="avatar-chip" onClick={() => navigate('/dashboard/profile')}>
              {user?.name?.slice(0, 1).toUpperCase()}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="text-button" onClick={() => navigate('/login')}>
              Login
            </button>
            <button type="button" className="primary-button" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;