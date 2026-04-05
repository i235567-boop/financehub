import { Link } from 'react-router';
import './NotFound.css';

/**
 * NotFound Page - 404 error page
 */
export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-home">
            Go Home
          </Link>
          <Link to="/products" className="btn-products">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
