import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getCachedProducts } from '../utils/api';
import { generateDecisionInsight, calculateProjectedReturns, formatCurrency } from '../utils/financial';
import { usePortfolio } from '../contexts/PortfolioContext';
import RiskBadge from '../components/RiskBadge';
import './ProductDetail.css';

/**
 * ProductDetail Page - Shows detailed product information
 * Dynamic route: /product/:id
 */
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [projections, setProjections] = useState([]);
  const { addToPortfolio, isInPortfolio } = usePortfolio();
  
  useEffect(() => {
    loadProduct();
  }, [id]);
  
  useEffect(() => {
    if (product && investmentAmount) {
      const amount = parseFloat(investmentAmount);
      if (amount > 0) {
        const results = calculateProjectedReturns(amount, product.expectedReturn, 5);
        setProjections(results);
      } else {
        setProjections([]);
      }
    }
  }, [investmentAmount, product]);
  
  const loadProduct = async () => {
    try {
      const products = await getCachedProducts();
      const found = products.find(p => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        setInvestmentAmount(found.minInvestment.toString());
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToPortfolio = () => {
    const amount = parseFloat(investmentAmount) || product.minInvestment;
    addToPortfolio(product, amount);
  };
  
  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-back">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  const insight = generateDecisionInsight(product);
  const inPortfolio = isInPortfolio(product.id);
  
  return (
    <div className="product-detail-page">
      <div className="detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products">Products</Link>
          <span className="breadcrumb-separator">/</span>
          <span>{product.name}</span>
        </nav>
        
        {/* Main Product Info */}
        <div className="product-main-section">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} className="product-detail-image" />
          </div>
          
          <div className="product-info-section">
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-badges">
              <span className="category-badge-large">
                {product.category}
              </span>
              <RiskBadge riskLevel={product.riskLevel} size="large" />
            </div>
            
            <div className="product-key-metrics">
              <div className="metric-card metric-return">
                <div className="metric-label">Expected Return</div>
                <div className="metric-value">{product.expectedReturn}%</div>
                <div className="metric-sub">Annual</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-label">Minimum Investment</div>
                <div className="metric-value-small">{formatCurrency(product.minInvestment)}</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-label">Liquidity</div>
                <div className="metric-value-small capitalize">{product.liquidity}</div>
              </div>
              
              <div className="metric-card">
                <div className="metric-label">Time Horizon</div>
                <div className="metric-value-small capitalize">{product.timeHorizon}-term</div>
              </div>
            </div>
            
            <div className="product-actions">
              <button
                onClick={handleAddToPortfolio}
                className={`btn-add-large ${inPortfolio ? 'btn-added' : ''}`}
                disabled={inPortfolio}
              >
                {inPortfolio ? '✓ Already in Portfolio' : 'Add to Portfolio'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Risk Visualization */}
        <div className="section-card">
          <h2 className="section-title">Risk Assessment</h2>
          <div className="risk-visualization">
            <div className="risk-bar-container">
              <div className="risk-bar">
                <div 
                  className={`risk-indicator risk-indicator-${product.riskLevel}`}
                  style={{
                    left: product.riskLevel === 'low' ? '16%' :
                          product.riskLevel === 'medium' ? '50%' : '84%'
                  }}
                ></div>
              </div>
              <div className="risk-labels">
                <span>Low Risk</span>
                <span>Medium Risk</span>
                <span>High Risk</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decision Insight */}
        <div className="section-card insight-card">
          <h2 className="section-title">Who is this product for?</h2>
          <p className="insight-text">{insight}</p>
        </div>
        
        {/* Description */}
        <div className="section-card">
          <h2 className="section-title">Product Description</h2>
          <p className="product-description">{product.description}</p>
        </div>
        
        {/* Return Calculator */}
        <div className="section-card">
          <h2 className="section-title">Return Projection Calculator</h2>
          <div className="calculator-section">
            <div className="calculator-input">
              <label htmlFor="investment-input">Investment Amount (PKR)</label>
              <input
                id="investment-input"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="Enter amount"
                min={product.minInvestment}
                className="calculator-input-field"
              />
              <small className="calculator-hint">
                Minimum: {formatCurrency(product.minInvestment)}
              </small>
            </div>
            
            {projections.length > 0 && (
              <div className="projections-table">
                <table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Total Value</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projections.map(proj => (
                      <tr key={proj.year}>
                        <td>Year {proj.year}</td>
                        <td>{formatCurrency(proj.amount)}</td>
                        <td className="profit-cell">+{formatCurrency(proj.profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Financial Attributes Explained */}
        <div className="section-card">
          <h2 className="section-title">Understanding Financial Metrics</h2>
          <div className="attributes-grid">
            <div className="attribute-explanation">
              <h4>Expected Return</h4>
              <p>The anticipated annual percentage gain on your investment based on historical performance and market conditions.</p>
            </div>
            <div className="attribute-explanation">
              <h4>Risk Level</h4>
              <p>Indicates the volatility and potential for loss. Low risk products are stable but offer lower returns; high risk products offer higher potential returns but with greater uncertainty.</p>
            </div>
            <div className="attribute-explanation">
              <h4>Liquidity</h4>
              <p>How quickly you can access your funds. Easy liquidity means you can withdraw anytime; locked means funds are committed for a specific period.</p>
            </div>
            <div className="attribute-explanation">
              <h4>Time Horizon</h4>
              <p>The recommended investment duration to maximize returns. Short-term (1-2 years), medium-term (3-5 years), or long-term (5+ years).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
