import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getCachedProducts } from '../utils/api';
import { getFeaturedProducts } from '../utils/financial';
import ProductCard from '../components/ProductCard';
import './Home.css';

/**
 * Home Page - Platform overview and featured products
 */
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, categories: 4 });
  
  useEffect(() => {
    loadFeaturedProducts();
  }, []);
  
  const loadFeaturedProducts = async () => {
    try {
      const products = await getCachedProducts();
      const featured = getFeaturedProducts(products);
      setFeaturedProducts(featured);
      setStats({ total: products.length, categories: 4 });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    { name: 'Savings', icon: '💰', desc: 'Secure your money with guaranteed returns' },
    { name: 'Investment', icon: '📈', desc: 'Grow wealth with diversified portfolios' },
    { name: 'Insurance', icon: '🛡️', desc: 'Protect yourself and your loved ones' },
    { name: 'Crypto', icon: '₿', desc: 'Explore digital asset opportunities' }
  ];
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Financial Products Built for Your Goals
          </h1>
          <p className="hero-subtitle">
            FinanceHub helps you explore, compare, and select financial instruments
            tailored to your risk profile, investment horizon, and financial objectives.
          </p>
          <Link to="/profile" className="btn-cta">
            Create Your Financial Profile
          </Link>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Financial Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.categories}</div>
          <div className="stat-label">Product Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">Transparent Information</div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Explore by Category</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link
              key={category.name}
              to={`/products?category=${category.name.toLowerCase()}`}
              className="category-card"
            >
              <div className="category-icon">{category.icon}</div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-desc">{category.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">
          Top performing products across each category
        </p>
        
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="featured-cta">
          <Link to="/products" className="btn-secondary">
            View All Products
          </Link>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How FinanceHub Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Create Your Profile</h3>
            <p className="step-desc">
              Tell us about your risk tolerance, investment goals, and financial capacity
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Get Recommendations</h3>
            <p className="step-desc">
              Our algorithm matches you with suitable financial products
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Build Your Portfolio</h3>
            <p className="step-desc">
              Add products to your portfolio and track risk distribution
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
