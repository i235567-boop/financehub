import { useState } from 'react';
import './FilterPanel.css';

/**
 * FilterPanel component for filtering products
 * Props:
 * - filters: Current filter state
 * - onFilterChange: Callback when filters change
 * - productCount: Number of products matching filters
 */
export default function FilterPanel({ filters, onFilterChange, productCount }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleRiskChange = (risk) => {
    const newRisk = filters.riskLevel.includes(risk)
      ? filters.riskLevel.filter(r => r !== risk)
      : [...filters.riskLevel, risk];
    onFilterChange({ ...filters, riskLevel: newRisk });
  };
  
  const handleCategoryChange = (category) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    onFilterChange({ ...filters, category: newCategories });
  };
  
  const handleReturnChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value === '' ? 0 : parseFloat(value)
    });
  };
  
  const handleReset = () => {
    onFilterChange({
      riskLevel: [],
      minReturn: 0,
      maxReturn: 100,
      category: [],
      liquidity: 'all',
      timeHorizon: 'all',
      maxMinInvestment: 1000000
    });
  };
  
  const activeFilterCount = () => {
    let count = 0;
    if (filters.riskLevel.length > 0) count++;
    if (filters.category.length > 0) count++;
    if (filters.minReturn > 0 || filters.maxReturn < 100) count++;
    if (filters.liquidity !== 'all') count++;
    if (filters.timeHorizon !== 'all') count++;
    if (filters.maxMinInvestment < 1000000) count++;
    return count;
  };
  
  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      <div className="filter-results">
        <span className="results-count">{productCount} products found</span>
        {activeFilterCount() > 0 && (
          <button className="btn-reset" onClick={handleReset}>
            Reset All
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="filter-content">
          {/* Risk Level Filter */}
          <div className="filter-section">
            <label className="filter-label">Risk Level</label>
            <div className="filter-options">
              {['low', 'medium', 'high'].map(risk => (
                <label key={risk} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.riskLevel.includes(risk)}
                    onChange={() => handleRiskChange(risk)}
                  />
                  <span className="checkbox-text">{risk}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Return Range Filter */}
          <div className="filter-section">
            <label className="filter-label">Expected Return (%)</label>
            <div className="filter-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minReturn || ''}
                onChange={(e) => handleReturnChange('minReturn', e.target.value)}
                className="filter-input"
                min="0"
                max="100"
              />
              <span className="range-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxReturn === 100 ? '' : filters.maxReturn}
                onChange={(e) => handleReturnChange('maxReturn', e.target.value)}
                className="filter-input"
                min="0"
                max="100"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="filter-section">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              {['savings', 'investment', 'insurance', 'crypto'].map(cat => (
                <label key={cat} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <span className="checkbox-text">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Liquidity Filter */}
          <div className="filter-section">
            <label className="filter-label">Liquidity</label>
            <select
              value={filters.liquidity}
              onChange={(e) => onFilterChange({ ...filters, liquidity: e.target.value })}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="locked">Locked</option>
            </select>
          </div>
          
          {/* Time Horizon Filter */}
          <div className="filter-section">
            <label className="filter-label">Time Horizon</label>
            <select
              value={filters.timeHorizon}
              onChange={(e) => onFilterChange({ ...filters, timeHorizon: e.target.value })}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="short">Short-term</option>
              <option value="medium">Medium-term</option>
              <option value="long">Long-term</option>
            </select>
          </div>
          
          {/* Min Investment Filter */}
          <div className="filter-section">
            <label className="filter-label">Maximum Min Investment</label>
            <input
              type="number"
              value={filters.maxMinInvestment}
              onChange={(e) => onFilterChange({ ...filters, maxMinInvestment: parseInt(e.target.value) || 1000000 })}
              className="filter-input"
              placeholder="Enter amount"
            />
            <small className="filter-hint">Only show products you can afford</small>
          </div>
        </div>
      )}
    </div>
  );
}
