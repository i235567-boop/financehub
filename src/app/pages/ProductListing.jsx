import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { getCachedProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import './ProductListing.css';

/**
 * ProductListing Page - Shows all products with comprehensive filtering
 */
export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('return-desc');
  
  const [filters, setFilters] = useState({
    riskLevel: [],
    minReturn: 0,
    maxReturn: 100,
    category: [],
    liquidity: 'all',
    timeHorizon: 'all',
    maxMinInvestment: 1000000
  });
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  // Apply category filter from URL if present
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && !filters.category.includes(categoryParam)) {
      setFilters(prev => ({
        ...prev,
        category: [categoryParam]
      }));
    }
  }, [searchParams]);
  
  // Apply filters and search whenever they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [products, filters, searchQuery, sortBy]);
  
  const loadProducts = async () => {
    try {
      const data = await getCachedProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const applyFiltersAndSearch = () => {
    let result = [...products];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    // Apply risk level filter (OR logic within risk levels)
    if (filters.riskLevel.length > 0) {
      result = result.filter(p => filters.riskLevel.includes(p.riskLevel));
    }
    
    // Apply return range filter
    result = result.filter(p =>
      p.expectedReturn >= filters.minReturn &&
      p.expectedReturn <= filters.maxReturn
    );
    
    // Apply category filter (OR logic within categories)
    if (filters.category.length > 0) {
      result = result.filter(p => filters.category.includes(p.category));
    }
    
    // Apply liquidity filter
    if (filters.liquidity !== 'all') {
      result = result.filter(p => p.liquidity === filters.liquidity);
    }
    
    // Apply time horizon filter
    if (filters.timeHorizon !== 'all') {
      result = result.filter(p => p.timeHorizon === filters.timeHorizon);
    }
    
    // Apply minimum investment filter
    result = result.filter(p => p.minInvestment <= filters.maxMinInvestment);
    
    // Apply sorting
    result = sortProducts(result, sortBy);
    
    setFilteredProducts(result);
  };
  
  const sortProducts = (productList, sortOption) => {
    const sorted = [...productList];
    
    switch (sortOption) {
      case 'return-desc':
        return sorted.sort((a, b) => b.expectedReturn - a.expectedReturn);
      case 'return-asc':
        return sorted.sort((a, b) => a.expectedReturn - b.expectedReturn);
      case 'risk-asc':
        const riskOrder = { low: 1, medium: 2, high: 3 };
        return sorted.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
      case 'risk-desc':
        const riskOrderDesc = { low: 3, medium: 2, high: 1 };
        return sorted.sort((a, b) => riskOrderDesc[a.riskLevel] - riskOrderDesc[b.riskLevel]);
      case 'investment-asc':
        return sorted.sort((a, b) => a.minInvestment - b.minInvestment);
      case 'investment-desc':
        return sorted.sort((a, b) => b.minInvestment - a.minInvestment);
      default:
        return sorted;
    }
  };
  
  if (loading) {
    return (
      <div className="product-listing-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading financial products...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="product-listing-page">
      <div className="listing-header">
        <h1>Financial Products</h1>
        <p>Explore our complete range of financial instruments</p>
      </div>
      
      {/* Search and Sort Bar */}
      <div className="search-sort-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products by name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-box">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="return-desc">Highest Return</option>
            <option value="return-asc">Lowest Return</option>
            <option value="risk-asc">Lowest Risk</option>
            <option value="risk-desc">Highest Risk</option>
            <option value="investment-asc">Lowest Investment</option>
            <option value="investment-desc">Highest Investment</option>
          </select>
        </div>
      </div>
      
      <div className="listing-content">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            productCount={filteredProducts.length}
          />
        </aside>
        
        {/* Products Grid */}
        <main className="products-main">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
