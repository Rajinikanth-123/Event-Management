import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="page-panel compact-panel center-panel">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The page you were looking for does not exist or has been moved.</p>
      <Link to="/" className="primary-button">
        Go home
      </Link>
    </section>
  );
};

export default NotFound;