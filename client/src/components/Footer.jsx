import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-shell">
      <div>
        <h3>EventFlow</h3>
        <p>Plan, promote, and manage events with a modern workflow built for speed and clarity.</p>
      </div>
      <div>
        <h4>Navigation</h4>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div>
        <h4>Support</h4>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/search">Explore</Link>
      </div>
    </footer>
  );
};

export default Footer;