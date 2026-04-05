import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUserProfile } from '../contexts/UserProfileContext';
import { getCachedProducts } from '../utils/api';
import { getRecommendations } from '../utils/financial';
import './UserProfile.css';

/**
 * UserProfile Page - Form to collect user financial profile
 */
export default function UserProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const [products, setProducts] = useState([]);
  const [matchingCount, setMatchingCount] = useState(0);
  
  const [formData, setFormData] = useState({
    riskTolerance: profile?.riskTolerance || '',
    investmentHorizon: profile?.investmentHorizon || '',
    monthlyCapacity: profile?.monthlyCapacity || '',
    liquidityPreference: profile?.liquidityPreference || '',
    investmentGoal: profile?.investmentGoal || ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  useEffect(() => {
    // Update matching count when form changes
    if (isFormValid() && products.length > 0) {
      const recommendations = getRecommendations(products, formData);
      setMatchingCount(recommendations.length);
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  }, [formData, products]);
  
  const loadProducts = async () => {
    try {
      const data = await getCachedProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.riskTolerance) {
      newErrors.riskTolerance = 'Please select your risk tolerance';
    }
    
    if (!formData.investmentHorizon) {
      newErrors.investmentHorizon = 'Please select your investment horizon';
    }
    
    if (!formData.monthlyCapacity || parseFloat(formData.monthlyCapacity) < 1000) {
      newErrors.monthlyCapacity = 'Please enter a valid amount (minimum 1000 PKR)';
    }
    
    if (!formData.liquidityPreference) {
      newErrors.liquidityPreference = 'Please select your liquidity preference';
    }
    
    if (!formData.investmentGoal) {
      newErrors.investmentGoal = 'Please select your investment goal';
    }
    
    return newErrors;
  };
  
  const isFormValid = () => {
    return (
      formData.riskTolerance &&
      formData.investmentHorizon &&
      formData.monthlyCapacity >= 1000 &&
      formData.liquidityPreference &&
      formData.investmentGoal
    );
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Convert monthlyCapacity to number
    const profileData = {
      ...formData,
      monthlyCapacity: parseFloat(formData.monthlyCapacity)
    };
    
    updateProfile(profileData);
    
    // Navigate to recommendations
    navigate('/recommendations');
  };
  
  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Build Your Financial Profile</h1>
          <p>Help us understand your investment preferences to provide personalized recommendations</p>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Risk Tolerance */}
          <div className="form-section">
            <label className="form-label required">
              Risk Tolerance
              <span className="label-hint">How comfortable are you with investment risk?</span>
            </label>
            <div className="radio-group">
              <label className={`radio-card ${formData.riskTolerance === 'conservative' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="riskTolerance"
                  value="conservative"
                  checked={formData.riskTolerance === 'conservative'}
                  onChange={(e) => handleChange('riskTolerance', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Conservative</div>
                  <div className="radio-desc">Prioritize capital preservation over returns</div>
                </div>
              </label>
              
              <label className={`radio-card ${formData.riskTolerance === 'moderate' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="riskTolerance"
                  value="moderate"
                  checked={formData.riskTolerance === 'moderate'}
                  onChange={(e) => handleChange('riskTolerance', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Moderate</div>
                  <div className="radio-desc">Balance between risk and return</div>
                </div>
              </label>
              
              <label className={`radio-card ${formData.riskTolerance === 'aggressive' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="riskTolerance"
                  value="aggressive"
                  checked={formData.riskTolerance === 'aggressive'}
                  onChange={(e) => handleChange('riskTolerance', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Aggressive</div>
                  <div className="radio-desc">Seek maximum returns, accept higher risk</div>
                </div>
              </label>
            </div>
            {errors.riskTolerance && <span className="error-message">{errors.riskTolerance}</span>}
          </div>
          
          {/* Investment Horizon */}
          <div className="form-section">
            <label className="form-label required">
              Investment Horizon
              <span className="label-hint">How long do you plan to invest?</span>
            </label>
            <div className="radio-group">
              <label className={`radio-card ${formData.investmentHorizon === 'short' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="investmentHorizon"
                  value="short"
                  checked={formData.investmentHorizon === 'short'}
                  onChange={(e) => handleChange('investmentHorizon', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Short-term (1-2 years)</div>
                  <div className="radio-desc">Quick access to funds</div>
                </div>
              </label>
              
              <label className={`radio-card ${formData.investmentHorizon === 'medium' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="investmentHorizon"
                  value="medium"
                  checked={formData.investmentHorizon === 'medium'}
                  onChange={(e) => handleChange('investmentHorizon', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Medium-term (3-5 years)</div>
                  <div className="radio-desc">Balanced planning</div>
                </div>
              </label>
              
              <label className={`radio-card ${formData.investmentHorizon === 'long' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="investmentHorizon"
                  value="long"
                  checked={formData.investmentHorizon === 'long'}
                  onChange={(e) => handleChange('investmentHorizon', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Long-term (5+ years)</div>
                  <div className="radio-desc">Maximum growth potential</div>
                </div>
              </label>
            </div>
            {errors.investmentHorizon && <span className="error-message">{errors.investmentHorizon}</span>}
          </div>
          
          {/* Monthly Investment Capacity */}
          <div className="form-section">
            <label htmlFor="monthlyCapacity" className="form-label required">
              Monthly Investment Capacity (PKR)
              <span className="label-hint">How much can you invest monthly?</span>
            </label>
            <input
              id="monthlyCapacity"
              type="number"
              value={formData.monthlyCapacity}
              onChange={(e) => handleChange('monthlyCapacity', e.target.value)}
              className="form-input"
              placeholder="Enter amount (minimum 1000)"
              min="1000"
            />
            {errors.monthlyCapacity && <span className="error-message">{errors.monthlyCapacity}</span>}
          </div>
          
          {/* Liquidity Preference */}
          <div className="form-section">
            <label htmlFor="liquidityPreference" className="form-label required">
              Liquidity Preference
              <span className="label-hint">How important is quick access to your funds?</span>
            </label>
            <select
              id="liquidityPreference"
              value={formData.liquidityPreference}
              onChange={(e) => handleChange('liquidityPreference', e.target.value)}
              className="form-select"
            >
              <option value="">Select preference</option>
              <option value="easy">Need quick access</option>
              <option value="moderate">Some flexibility is fine</option>
              <option value="locked">Can lock funds for better returns</option>
            </select>
            {errors.liquidityPreference && <span className="error-message">{errors.liquidityPreference}</span>}
          </div>
          
          {/* Investment Goal */}
          <div className="form-section">
            <label htmlFor="investmentGoal" className="form-label required">
              Primary Investment Goal
              <span className="label-hint">What are you investing for?</span>
            </label>
            <select
              id="investmentGoal"
              value={formData.investmentGoal}
              onChange={(e) => handleChange('investmentGoal', e.target.value)}
              className="form-select"
            >
              <option value="">Select goal</option>
              <option value="wealth-building">Wealth Building</option>
              <option value="retirement">Retirement Planning</option>
              <option value="emergency-fund">Emergency Fund</option>
              <option value="specific-purchase">Specific Purchase (house, car, etc.)</option>
              <option value="education">Education</option>
              <option value="diversification">Portfolio Diversification</option>
            </select>
            {errors.investmentGoal && <span className="error-message">{errors.investmentGoal}</span>}
          </div>
          
          {/* Recommendation Preview */}
          {showPreview && (
            <div className="recommendation-preview">
              <div className="preview-icon">✓</div>
              <div className="preview-content">
                <h3>Great! We found {matchingCount} products that match your profile</h3>
                <p>Save your profile to view personalized recommendations</p>
              </div>
            </div>
          )}
          
          {/* Current Profile Summary (if exists) */}
          {profile && (
            <div className="profile-summary">
              <h3>Current Profile Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Risk Tolerance:</span>
                  <span className="summary-value capitalize">{profile.riskTolerance}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Investment Horizon:</span>
                  <span className="summary-value capitalize">{profile.investmentHorizon}-term</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Monthly Capacity:</span>
                  <span className="summary-value">PKR {profile.monthlyCapacity?.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Liquidity:</span>
                  <span className="summary-value capitalize">{profile.liquidityPreference}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {profile ? 'Update Profile & View Recommendations' : 'Save Profile & Get Recommendations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
