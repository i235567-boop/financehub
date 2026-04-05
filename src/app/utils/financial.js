// Financial logic utility functions

/**
 * Calculates weighted expected return for a portfolio
 * Formula: sum((allocation / total) * product.expectedReturn)
 */
export function calculateWeightedReturn(portfolioItems) {
  if (portfolioItems.length === 0) return 0;
  
  const totalInvested = portfolioItems.reduce((sum, item) => sum + item.amount, 0);
  
  if (totalInvested === 0) return 0;
  
  const weightedSum = portfolioItems.reduce((sum, item) => {
    const weight = item.amount / totalInvested;
    return sum + (weight * item.product.expectedReturn);
  }, 0);
  
  return parseFloat(weightedSum.toFixed(2));
}

/**
 * Calculates risk distribution in portfolio
 * Returns percentage of each risk level
 */
export function calculateRiskDistribution(portfolioItems) {
  if (portfolioItems.length === 0) {
    return { low: 0, medium: 0, high: 0 };
  }
  
  const totalInvested = portfolioItems.reduce((sum, item) => sum + item.amount, 0);
  
  if (totalInvested === 0) {
    return { low: 0, medium: 0, high: 0 };
  }
  
  const distribution = portfolioItems.reduce((dist, item) => {
    const riskLevel = item.product.riskLevel;
    dist[riskLevel] = (dist[riskLevel] || 0) + item.amount;
    return dist;
  }, { low: 0, medium: 0, high: 0 });
  
  // Convert to percentages
  return {
    low: parseFloat(((distribution.low / totalInvested) * 100).toFixed(1)),
    medium: parseFloat(((distribution.medium / totalInvested) * 100).toFixed(1)),
    high: parseFloat(((distribution.high / totalInvested) * 100).toFixed(1))
  };
}

/**
 * Calculates category distribution in portfolio
 */
export function calculateCategoryDistribution(portfolioItems) {
  if (portfolioItems.length === 0) {
    return {};
  }
  
  const totalInvested = portfolioItems.reduce((sum, item) => sum + item.amount, 0);
  
  if (totalInvested === 0) return {};
  
  const distribution = portfolioItems.reduce((dist, item) => {
    const category = item.product.category;
    dist[category] = (dist[category] || 0) + item.amount;
    return dist;
  }, {});
  
  // Convert to percentages
  Object.keys(distribution).forEach(key => {
    distribution[key] = parseFloat(((distribution[key] / totalInvested) * 100).toFixed(1));
  });
  
  return distribution;
}

/**
 * Generates recommendation insights for a product
 * Based on risk, liquidity, and time horizon
 */
export function generateDecisionInsight(product) {
  const insights = [];
  
  // Risk-based insights
  if (product.riskLevel === 'low') {
    insights.push("Suitable for conservative investors prioritizing capital preservation.");
  } else if (product.riskLevel === 'medium') {
    insights.push("Balanced option for moderate investors seeking steady growth.");
  } else if (product.riskLevel === 'high') {
    insights.push("Best for aggressive investors comfortable with significant volatility.");
  }
  
  // Liquidity insights
  if (product.liquidity === 'easy') {
    insights.push("Funds can be accessed quickly when needed.");
  } else if (product.liquidity === 'moderate') {
    insights.push("Some flexibility in accessing funds, may have minor restrictions.");
  } else if (product.liquidity === 'locked') {
    insights.push("Requires commitment; early withdrawal may incur penalties.");
  }
  
  // Time horizon insights
  if (product.timeHorizon === 'short') {
    insights.push("Ideal for short-term goals (1-2 years).");
  } else if (product.timeHorizon === 'medium') {
    insights.push("Best suited for medium-term planning (3-5 years).");
  } else if (product.timeHorizon === 'long') {
    insights.push("Optimal when held for 5+ years to maximize returns.");
  }
  
  // Return-based insight
  if (product.expectedReturn < 5) {
    insights.push("Offers stable, predictable returns.");
  } else if (product.expectedReturn < 10) {
    insights.push("Provides balanced growth potential.");
  } else {
    insights.push("High return potential with corresponding risk.");
  }
  
  return insights.join(" ");
}

/**
 * Filters products based on user profile
 * Returns products that match user's risk tolerance, horizon, liquidity, and budget
 */
export function getRecommendations(products, userProfile) {
  if (!userProfile || !products || products.length === 0) {
    return [];
  }
  
  // Step 1: Map user risk tolerance to allowed product risk levels
  const riskMapping = {
    'conservative': ['low'],
    'moderate': ['low', 'medium'],
    'aggressive': ['low', 'medium', 'high']
  };
  
  const allowedRisk = riskMapping[userProfile.riskTolerance] || ['low'];
  
  // Step 2: Map user investment horizon to allowed product horizons
  const horizonMapping = {
    'short': ['short'],
    'medium': ['short', 'medium'],
    'long': ['short', 'medium', 'long']
  };
  
  const allowedHorizon = horizonMapping[userProfile.investmentHorizon] || ['short'];
  
  // Step 3: Map user liquidity preference to allowed product liquidity
  const liquidityMapping = {
    'easy': ['easy'],
    'moderate': ['easy', 'moderate'],
    'locked': ['easy', 'moderate', 'locked']
  };
  
  const allowedLiquidity = liquidityMapping[userProfile.liquidityPreference] || ['easy'];
  
  // Step 4: Filter by budget - only show products user can afford
  const affordableProducts = products.filter(p => 
    p.minInvestment <= userProfile.monthlyCapacity
  );
  
  // Step 5: Apply all filters together
  const recommended = affordableProducts.filter(p =>
    allowedRisk.includes(p.riskLevel) &&
    allowedHorizon.includes(p.timeHorizon) &&
    allowedLiquidity.includes(p.liquidity)
  );
  
  // Step 6: Sort based on user's risk tolerance
  // Conservative users see lowest risk first
  // Aggressive users see highest return first
  if (userProfile.riskTolerance === 'conservative') {
    return recommended.sort((a, b) => {
      // First by risk (low first)
      const riskOrder = { low: 1, medium: 2, high: 3 };
      if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      }
      // Then by return (higher first within same risk)
      return b.expectedReturn - a.expectedReturn;
    });
  } else {
    // Moderate and aggressive users see highest return first
    return recommended.sort((a, b) => b.expectedReturn - a.expectedReturn);
  }
}

/**
 * Calculates projected returns over time
 * Uses compound interest formula: A = P(1 + r)^t
 */
export function calculateProjectedReturns(principal, annualRate, years) {
  const returns = [];
  const rate = annualRate / 100;
  
  for (let year = 1; year <= years; year++) {
    const amount = principal * Math.pow(1 + rate, year);
    const profit = amount - principal;
    returns.push({
      year,
      amount: parseFloat(amount.toFixed(2)),
      profit: parseFloat(profit.toFixed(2))
    });
  }
  
  return returns;
}

/**
 * Formats currency values
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Gets featured products (highest return in each category)
 */
export function getFeaturedProducts(products) {
  if (!products || products.length === 0) return [];
  
  const categories = ['savings', 'investment', 'insurance', 'crypto'];
  const featured = [];
  
  categories.forEach(category => {
    const categoryProducts = products.filter(p => p.category === category);
    if (categoryProducts.length > 0) {
      // Get highest return product in this category
      const best = categoryProducts.reduce((max, p) => 
        p.expectedReturn > max.expectedReturn ? p : max
      );
      featured.push(best);
    }
  });
  
  return featured;
}
