import { useState, useEffect } from 'react';
import { fetchFinancialProducts, getCachedProducts } from '../utils/api';

/**
 * API Test Page - Verifies API and mock data fallback functionality
 * Useful for debugging and demonstration
 */
export default function ApiTest() {
  const [status, setStatus] = useState('idle');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [useCache, setUseCache] = useState(true);

  const testApi = async () => {
    setStatus('loading');
    setError(null);

    try {
      // Clear cache if not using cache
      if (!useCache) {
        localStorage.removeItem('financialProducts');
        localStorage.removeItem('productsCacheTime');
      }

      const data = useCache
        ? await getCachedProducts()
        : await fetchFinancialProducts();

      setProducts(data);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const clearCache = () => {
    localStorage.removeItem('financialProducts');
    localStorage.removeItem('productsCacheTime');
    setProducts([]);
    setStatus('idle');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>API Test Page</h1>
      <p>This page helps verify the API and mock data fallback functionality.</p>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Test Controls</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={useCache}
              onChange={(e) => setUseCache(e.target.checked)}
            />
            {' '}Use Cache (getCachedProducts)
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={testApi}
            disabled={status === 'loading'}
            style={{
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer'
            }}
          >
            {status === 'loading' ? 'Testing...' : 'Test API'}
          </button>

          <button
            onClick={clearCache}
            style={{
              padding: '0.5rem 1rem',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Cache
          </button>
        </div>
      </div>

      {status === 'success' && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#d4edda', borderRadius: '8px' }}>
          <h3 style={{ color: '#155724' }}>✓ Success!</h3>
          <p>Loaded {products.length} products</p>

          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              View Sample Products (showing first 3)
            </summary>
            <div style={{ marginTop: '1rem' }}>
              {products.slice(0, 3).map(product => (
                <div
                  key={product.id}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <h4>{product.name}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <strong>Category:</strong> <span>{product.category}</span>
                    <strong>Risk Level:</strong> <span>{product.riskLevel}</span>
                    <strong>Expected Return:</strong> <span>{product.expectedReturn}%</span>
                    <strong>Liquidity:</strong> <span>{product.liquidity}</span>
                    <strong>Time Horizon:</strong> <span>{product.timeHorizon}</span>
                    <strong>Min Investment:</strong> <span>₹{product.minInvestment.toLocaleString()}</span>
                  </div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                    {product.description}
                  </p>
                </div>
              ))}
            </div>
          </details>

          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              View Category Distribution
            </summary>
            <div style={{ marginTop: '1rem' }}>
              {Object.entries(
                products.reduce((acc, p) => {
                  acc[p.category] = (acc[p.category] || 0) + 1;
                  return acc;
                }, {})
              ).map(([category, count]) => (
                <div key={category} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <strong>{category}:</strong>
                  <span>{count} products</span>
                </div>
              ))}
            </div>
          </details>

          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              View Risk Distribution
            </summary>
            <div style={{ marginTop: '1rem' }}>
              {Object.entries(
                products.reduce((acc, p) => {
                  acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
                  return acc;
                }, {})
              ).map(([risk, count]) => (
                <div key={risk} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <strong>{risk}:</strong>
                  <span>{count} products</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {status === 'error' && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8d7da', borderRadius: '8px' }}>
          <h3 style={{ color: '#721c24' }}>✗ Error</h3>
          <p>{error}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e7f3ff', borderRadius: '8px' }}>
        <h3>How It Works</h3>
        <ol>
          <li><strong>Try Real API First:</strong> Attempts to fetch from fakestoreapi.com with 5-second timeout</li>
          <li><strong>Fallback to Mock Data:</strong> If API fails, automatically uses 20 built-in mock products</li>
          <li><strong>Data Transformation:</strong> Both sources go through same transformation logic</li>
          <li><strong>Caching:</strong> getCachedProducts() stores data in localStorage for 1 hour</li>
        </ol>

        <h4 style={{ marginTop: '1rem' }}>Expected Behavior:</h4>
        <ul>
          <li>Console shows "Successfully fetched from Fake Store API" OR "API unavailable, using mock data"</li>
          <li>Application always loads 20 products regardless of API status</li>
          <li>All financial logic (risk, returns, liquidity) works consistently</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
        <h3>Open Browser Console</h3>
        <p>Check the browser console (F12) to see API status messages:</p>
        <ul>
          <li>"Successfully fetched from Fake Store API" - Real API is working</li>
          <li>"API unavailable, using mock data" - Fallback is being used</li>
        </ul>
      </div>
    </div>
  );
}
