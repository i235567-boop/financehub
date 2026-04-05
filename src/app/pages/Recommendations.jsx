import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useUserProfile } from '../contexts/UserProfileContext';
import { getCachedProducts } from '../utils/api';
import { getRecommendations } from '../utils/financial';
import ProductCard from '../components/ProductCard';
import './Recommendations.css';

/**
 * Recommendations Page - Shows personalized product recommendations
 * based on user profile
 */
export default function Recommendations() {
  const { profile, isProfileComplete } = useUserProfile();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRecommendations();
  }, [profile]);
  
  const loadRecommendations = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }
    
    try {
      const products = await getCachedProducts();
      const recommended = getRecommendations(products, profile);
      setRecommendations(recommended);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Show message if no profile
  if (!profile || !isProfileComplete()) {
    return (
      <div className="recommendations-page">
        <div className="no-profile-message">
          <div className="message-icon">📊</div>
          <h2>Create Your Profile First</h2>
          <p>
            To get personalized recommendations, we need to understand your
            investment preferences and financial goals.
          </p>
          <Link to="/profile" className="btn-create-profile">
            Create Financial Profile
          </Link>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your profile and finding suitable products...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="recommendations-page">
      <div className="recommendations-container">
        {/* Profile Summary Card */}
        <div className="profile-card">
          <h2>Your Profile</h2>
          <div className="profile-details">
            <div className="profile-detail">
              <span className="detail-icon">⚖️</span>
              <div>
                <div className="detail-label">Risk Tolerance</div>
                <div className="detail-value capitalize">{profile.riskTolerance}</div>
              </div>
            </div>
            
            <div className="profile-detail">
              <span className="detail-icon">⏱️</span>
              <div>
                <div className="detail-label">Investment Horizon</div>
                <div className="detail-value capitalize">{profile.investmentHorizon}-term</div>
              </div>
            </div>
            
            <div className="profile-detail">
              <span className="detail-icon">💵</span>
              <div>
                <div className="detail-label">Monthly Capacity</div>
                <div className="detail-value">PKR {profile.monthlyCapacity.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="profile-detail">
              <span className="detail-icon">💧</span>
              <div>
                <div className="detail-label">Liquidity Preference</div>
                <div className="detail-value capitalize">{profile.liquidityPreference}</div>
              </div>
            </div>
          </div>
          
          <Link to="/profile" className="btn-edit-profile">
            Edit Profile
          </Link>
        </div>
        
        {/* Recommendations Header */}
        <div className="recommendations-header">
          <h1>Your Personalized Recommendations</h1>
          <p>
            Based on your profile, we found <strong>{recommendations.length} products</strong> that match your
            investment preferences and financial capacity.
          </p>
        </div>
        
        {/* Recommendations Info */}
        <div className="recommendation-info">
          <h3>Why these products?</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">✓</div>
              <div className="info-text">
                <strong>Risk-Aligned:</strong> Matches your {profile.riskTolerance} risk tolerance
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">✓</div>
              <div className="info-text">
                <strong>Time-Appropriate:</strong> Suitable for {profile.investmentHorizon}-term investment
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">✓</div>
              <div className="info-text">
                <strong>Affordable:</strong> Within your PKR {profile.monthlyCapacity.toLocaleString()} budget
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">✓</div>
              <div className="info-text">
                <strong>Liquidity-Matched:</strong> Aligns with your {profile.liquidityPreference} liquidity needs
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations Grid */}
        {recommendations.length === 0 ? (
          <div className="no-recommendations">
            <div className="no-rec-icon">😔</div>
            <h3>No matching products found</h3>
            <p>
              We couldn't find products that match all your criteria.
              Try adjusting your profile preferences.
            </p>
            <Link to="/profile" className="btn-adjust-profile">
              Adjust Profile
            </Link>
          </div>
        ) : (
          <div className="recommendations-grid">
            {recommendations.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {/* Additional Actions */}
        {recommendations.length > 0 && (
          <div className="additional-actions">
            <p>Want to see more options?</p>
            <Link to="/products" className="btn-view-all">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
