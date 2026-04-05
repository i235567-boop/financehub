// API service for fetching and transforming financial products

// Mock data for reliable demo and testing (structured like Fake Store API)
const MOCK_PRODUCTS = [
  { id: 1, title: "Premium Bond Fund", category: "electronics", price: 109.95, description: "Conservative investment with steady returns. Ideal for risk-averse investors seeking stable income with minimal volatility.", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500" },
  { id: 2, title: "Tech Growth ETF", category: "electronics", price: 22.3, description: "High-growth technology sector investment. Perfect for long-term investors willing to accept higher volatility for superior returns.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500" },
  { id: 3, title: "Gold Savings Account", category: "jewelery", price: 55.99, description: "Secure gold-backed savings with easy liquidity. Protects against inflation while providing stable returns.", image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=500" },
  { id: 4, title: "Fixed Deposit Plus", category: "jewelery", price: 15.99, description: "Traditional fixed deposit with competitive rates. Guaranteed returns with complete capital protection.", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500" },
  { id: 5, title: "Life Insurance Pro", category: "men's clothing", price: 695, description: "Comprehensive life insurance with investment component. Combines protection with long-term wealth creation.", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500" },
  { id: 6, title: "Health Shield Insurance", category: "men's clothing", price: 168, description: "Complete health coverage with cashless hospitalization. Protects your family's financial stability.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500" },
  { id: 7, title: "Bitcoin Investment Fund", category: "women's clothing", price: 9.99, description: "Cryptocurrency exposure through managed fund. High-risk, high-reward digital asset investment.", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500" },
  { id: 8, title: "Ethereum Staking Pool", category: "women's clothing", price: 10.99, description: "Earn passive income through ETH staking. Decentralized finance opportunity with attractive yields.", image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=500" },
  { id: 9, title: "Real Estate Fund", category: "electronics", price: 64, description: "Diversified real estate investment trust. Provides rental income and property appreciation potential.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500" },
  { id: 10, title: "International Equity Fund", category: "electronics", price: 109, description: "Global market exposure across developed economies. Reduces country-specific risk through diversification.", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500" },
  { id: 11, title: "High-Yield Savings", category: "jewelery", price: 109, description: "Premium savings account with superior interest rates. Instant liquidity with better returns than standard accounts.", image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=500" },
  { id: 12, title: "Municipal Bond Fund", category: "jewelery", price: 114, description: "Tax-efficient bond investment in government projects. Low risk with tax advantages for high-income earners.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500" },
  { id: 13, title: "Term Insurance Plus", category: "men's clothing", price: 599, description: "Pure protection term life insurance. Maximum coverage at lowest premium for family security.", image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500" },
  { id: 14, title: "Auto Insurance Comprehensive", category: "men's clothing", price: 999.99, description: "Complete vehicle protection including theft and damage. Peace of mind for your automotive investment.", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500" },
  { id: 15, title: "DeFi Yield Farming", category: "women's clothing", price: 56.99, description: "Decentralized finance liquidity provision. Earn high yields through smart contract protocols.", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500" },
  { id: 16, title: "Altcoin Diversified Portfolio", category: "women's clothing", price: 29.95, description: "Exposure to emerging cryptocurrencies. High-risk portfolio targeting exponential growth potential.", image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=500" },
  { id: 17, title: "Dividend Aristocrats Fund", category: "electronics", price: 39.99, description: "Blue-chip stocks with consistent dividend history. Reliable income with capital appreciation.", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500" },
  { id: 18, title: "Small Cap Growth Fund", category: "electronics", price: 9.85, description: "Investment in emerging companies with high growth potential. Higher risk for potentially superior returns.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500" },
  { id: 19, title: "Senior Citizen Savings", category: "jewelery", price: 7.95, description: "Government-backed savings scheme for retirees. Higher interest rates with complete security.", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500" },
  { id: 20, title: "Child Education Fund", category: "jewelery", price: 12.99, description: "Long-term savings for children's education. Combines investment growth with insurance protection.", image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=500" }
];

interface ApiProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

interface FinancialProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  expectedReturn: number;
  riskLevel: string;
  liquidity: string;
  timeHorizon: string;
  minInvestment: number;
  image: string;
}

/**
 * Fetches products from Fake Store API and transforms them into financial products
 * Falls back to mock data if API is unavailable
 * Uses deterministic mapping to ensure consistency
 */
export async function fetchFinancialProducts(): Promise<FinancialProduct[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('https://fakestoreapi.com/products', {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const apiProducts = await response.json();
    console.log('Successfully fetched from Fake Store API');
    return apiProducts.map(transformToFinancialProduct);
  } catch (error) {
    console.info('ℹ️ External API unavailable - Using built-in mock data (20 products)');
    console.info('   This is expected behavior and the app will work normally');
    // Use mock data as fallback
    return MOCK_PRODUCTS.map(transformToFinancialProduct);
  }
}

/**
 * Transforms a Fake Store API product into a financial product
 * Uses deterministic logic based on product attributes
 */
function transformToFinancialProduct(apiProduct: ApiProduct): FinancialProduct {
  // Map API categories to financial categories
  const categoryMapping: Record<string, string> = {
    'electronics': 'investment',
    'jewelery': 'savings',
    "men's clothing": 'insurance',
    "women's clothing": 'crypto'
  };

  const category = categoryMapping[apiProduct.category] || 'investment';

  // Assign risk level based on category (deterministic)
  const riskMapping: Record<string, string> = {
    'savings': 'low',
    'insurance': 'low',
    'investment': 'medium',
    'crypto': 'high'
  };

  const riskLevel = riskMapping[category];

  // Assign expected return based on risk level (consistent ranges)
  const returnMapping: Record<string, () => number> = {
    'low': () => {
      // Low risk: 3-7% returns
      // Use product ID to generate deterministic value
      const seed = apiProduct.id % 40;
      return 3 + (seed / 10);
    },
    'medium': () => {
      // Medium risk: 7-12% returns
      const seed = apiProduct.id % 50;
      return 7 + (seed / 10);
    },
    'high': () => {
      // High risk: 12-27% returns
      const seed = apiProduct.id % 150;
      return 12 + (seed / 10);
    }
  };

  // Assign liquidity based on category and risk
  const liquidityMapping: Record<string, string> = {
    'savings': 'easy',
    'crypto': 'easy',
    'investment': 'moderate',
    'insurance': 'locked'
  };

  const liquidity = liquidityMapping[category];

  // Assign time horizon based on risk level
  const timeHorizonMapping: Record<string, string> = {
    'low': 'short',
    'medium': 'medium',
    'high': 'long'
  };

  const timeHorizon = timeHorizonMapping[riskLevel];

  // Scale price to minimum investment (deterministic)
  const minInvestment = Math.round(apiProduct.price * 1000);

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    category: category,
    description: apiProduct.description,
    expectedReturn: parseFloat(returnMapping[riskLevel]().toFixed(2)),
    riskLevel: riskLevel,
    liquidity: liquidity,
    timeHorizon: timeHorizon,
    minInvestment: minInvestment,
    image: apiProduct.image
  };
}

/**
 * Gets products from localStorage cache or fetches from API
 * This ensures consistency and reduces API calls
 */
export async function getCachedProducts(): Promise<FinancialProduct[]> {
  const cached = localStorage.getItem('financialProducts');
  const cacheTime = localStorage.getItem('productsCacheTime');

  // Cache for 1 hour
  const ONE_HOUR = 60 * 60 * 1000;
  const now = Date.now();

  if (cached && cacheTime && (now - parseInt(cacheTime)) < ONE_HOUR) {
    return JSON.parse(cached);
  }

  // Fetch fresh data
  const products = await fetchFinancialProducts();
  console.log(`✅ Loaded ${products.length} financial products successfully`);
  localStorage.setItem('financialProducts', JSON.stringify(products));
  localStorage.setItem('productsCacheTime', now.toString());

  return products;
}
