import { useState } from 'react';
import { Link } from 'react-router';
import { usePortfolio } from '../contexts/PortfolioContext';
import { formatCurrency } from '../utils/financial';
import './Portfolio.css';

/**
 * Portfolio Page - Manage portfolio and view statistics
 */
export default function Portfolio() {
  const { portfolio, removeFromPortfolio, updateAllocation } = usePortfolio();
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  
  const handleEditClick = (item) => {
    setEditingId(item.product.id);
    setEditAmount(item.amount.toString());
  };
  
  const handleSaveEdit = (productId) => {
    const amount = parseFloat(editAmount);
    if (amount > 0) {
      updateAllocation(productId, amount);
    }
    setEditingId(null);
    setEditAmount('');
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
  };
  
  const getRiskColor = (riskLevel) => {
    const colors = {
      low: '#10b981',
      medium: '#fbbf24',
      high: '#ef4444'
    };
    return colors[riskLevel];
  };
  
  const hasHighRiskWarning = () => {
    return portfolio.riskDistribution.high > 70;
  };
  
  if (portfolio.items.length === 0) {
    return (
      <div className="portfolio-page">
        <div className="empty-portfolio">
          <div className="empty-icon">📁</div>
          <h2>Your Portfolio is Empty</h2>
          <p>
            Start building your investment portfolio by adding financial products
            that match your goals and risk tolerance.
          </p>
          <div className="empty-actions">
            <Link to="/recommendations" className="btn-recommendations">
              View Recommendations
            </Link>
            <Link to="/products" className="btn-browse">
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="portfolio-page">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h1>My Portfolio</h1>
          <p>Track your investments and manage allocations</p>
        </div>
        
        {/* High Risk Warning */}
        {hasHighRiskWarning() && (
          <div className="risk-warning">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <strong>High Risk Concentration</strong>
              <p>
                Your portfolio has {portfolio.riskDistribution.high}% allocated to high-risk products.
                Consider diversifying for better risk management.
              </p>
            </div>
          </div>
        )}
        
        {/* Portfolio Summary */}
        <div className="portfolio-summary">
          <h2>Portfolio Summary</h2>
          <div className="summary-stats">
            <div className="stat-box stat-primary">
              <div className="stat-label">Total Invested</div>
              <div className="stat-value">{formatCurrency(portfolio.totalInvested)}</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-label">Weighted Expected Return</div>
              <div className="stat-value">{portfolio.weightedReturn}%</div>
              <div className="stat-hint">Annual average</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-label">Products in Portfolio</div>
              <div className="stat-value">{portfolio.items.length}</div>
            </div>
          </div>
        </div>
        
        {/* Risk Distribution */}
        <div className="portfolio-section">
          <h2>Risk Distribution</h2>
          <div className="risk-distribution">
            <div className="risk-bar-full">
              {portfolio.riskDistribution.low > 0 && (
                <div
                  className="risk-segment risk-low"
                  style={{ width: `${portfolio.riskDistribution.low}%` }}
                >
                  {portfolio.riskDistribution.low}%
                </div>
              )}
              {portfolio.riskDistribution.medium > 0 && (
                <div
                  className="risk-segment risk-medium"
                  style={{ width: `${portfolio.riskDistribution.medium}%` }}
                >
                  {portfolio.riskDistribution.medium}%
                </div>
              )}
              {portfolio.riskDistribution.high > 0 && (
                <div
                  className="risk-segment risk-high"
                  style={{ width: `${portfolio.riskDistribution.high}%` }}
                >
                  {portfolio.riskDistribution.high}%
                </div>
              )}
            </div>
            
            <div className="risk-legend">
              <div className="legend-item">
                <div className="legend-color risk-low-bg"></div>
                <span>Low Risk ({portfolio.riskDistribution.low}%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color risk-medium-bg"></div>
                <span>Medium Risk ({portfolio.riskDistribution.medium}%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color risk-high-bg"></div>
                <span>High Risk ({portfolio.riskDistribution.high}%)</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Distribution */}
        {Object.keys(portfolio.categoryDistribution).length > 0 && (
          <div className="portfolio-section">
            <h2>Category Distribution</h2>
            <div className="category-distribution">
              {Object.entries(portfolio.categoryDistribution).map(([category, percentage]) => (
                <div key={category} className="category-item">
                  <div className="category-header">
                    <span className="category-name capitalize">{category}</span>
                    <span className="category-percentage">{percentage}%</span>
                  </div>
                  <div className="category-bar">
                    <div
                      className="category-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Portfolio Items */}
        <div className="portfolio-section">
          <h2>Your Investments</h2>
          <div className="portfolio-items">
            {portfolio.items.map(item => (
              <div key={item.product.id} className="portfolio-item">
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                
                <div className="item-info">
                  <Link to={`/product/${item.product.id}`} className="item-name">
                    {item.product.name}
                  </Link>
                  <div className="item-meta">
                    <span className="item-category capitalize">{item.product.category}</span>
                    <span className="item-divider">•</span>
                    <span className="item-return">{item.product.expectedReturn}% return</span>
                    <span className="item-divider">•</span>
                    <span
                      className="item-risk capitalize"
                      style={{ color: getRiskColor(item.product.riskLevel) }}
                    >
                      {item.product.riskLevel} risk
                    </span>
                  </div>
                </div>
                
                <div className="item-amount">
                  {editingId === item.product.id ? (
                    <div className="edit-amount">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="amount-input"
                        min={item.product.minInvestment}
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => handleSaveEdit(item.product.id)}
                          className="btn-save"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="amount-value">{formatCurrency(item.amount)}</div>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => removeFromPortfolio(item.product.id)}
                  className="btn-remove"
                  title="Remove from portfolio"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}