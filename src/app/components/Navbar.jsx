import { Link } from 'react-router';
import { usePortfolio } from '../contexts/PortfolioContext';
import './Navbar.css';

/**
 * Navbar component with navigation and portfolio count
 */
export default function Navbar() {
  const { portfolio } = usePortfolio();
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FinanceHub
        </Link>
        
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="navbar-link">
              Products
            </Link>
          </li>
          <li>
            <Link to="/profile" className="navbar-link">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/recommendations" className="navbar-link">
              Recommendations
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className="navbar-link navbar-portfolio">
              Portfolio
              {portfolio.items.length > 0 && (
                <span className="portfolio-badge">
                  {portfolio.items.length}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
