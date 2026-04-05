import { Link } from 'react-router';
import { usePortfolio } from '../contexts/PortfolioContext';
import RiskBadge from './RiskBadge';
import { formatCurrency } from '../utils/financial';
import './ProductCard.css';

/**
 * ProductCard component displays product summary
 * Props:
 * - product: Financial product object
 */
export default function ProductCard({ product }) {
  const { addToPortfolio, isInPortfolio } = usePortfolio();
  const inPortfolio = isInPortfolio(product.id);
  
  const handleAddToPortfolio = (e) => {
    e.preventDefault(); // Prevent link navigation
    addToPortfolio(product, product.minInvestment);
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      'savings': '💰',
      'investment': '📈',
      'insurance': '🛡️',
      'crypto': '₿'
    };
    return icons[category] || '💼';
  };
  
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-card-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-card-content">
          <div className="product-card-header">
            <h3 className="product-card-title">{product.name}</h3>
            <span className="product-category-badge">
              {getCategoryIcon(product.category)} {product.category}
            </span>
          </div>
          
          <div className="product-card-return">
            <span className="return-label">Expected Return</span>
            <span className="return-value">{product.expectedReturn}%</span>
          </div>
          
          <div className="product-card-details">
            <div className="detail-item">
              <RiskBadge riskLevel={product.riskLevel} size="small" />
            </div>
            <div className="detail-item">
              <span className="detail-label">Liquidity:</span>
              <span className="detail-value">{product.liquidity}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Min Investment:</span>
              <span className="detail-value">{formatCurrency(product.minInvestment)}</span>
            </div>
          </div>
        </div>
        
        {/* Hover overlay with additional details */}
        <div className="product-card-overlay">
          <div className="overlay-content">
            <p className="overlay-horizon">
              <strong>Time Horizon:</strong> {product.timeHorizon}-term
            </p>
            <p className="overlay-description">
              {product.description.substring(0, 100)}...
            </p>
          </div>
        </div>
      </Link>
      
      <div className="product-card-actions">
        <button
          onClick={handleAddToPortfolio}
          className={`btn-add-portfolio ${inPortfolio ? 'btn-added' : ''}`}
          disabled={inPortfolio}
        >
          {inPortfolio ? '✓ In Portfolio' : 'Add to Portfolio'}
        </button>
      </div>
    </div>
  );
}
