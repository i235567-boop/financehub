import { createContext, useContext, useState, useEffect } from 'react';
import { calculateWeightedReturn, calculateRiskDistribution, calculateCategoryDistribution } from '../utils/financial';

// Create context
const PortfolioContext = createContext();

/**
 * PortfolioProvider manages portfolio state globally
 * Handles adding, removing, updating products and calculations
 */
export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState({
    items: [],
    totalInvested: 0,
    weightedReturn: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 },
    categoryDistribution: {}
  });
  
  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      try {
        const parsed = JSON.parse(savedPortfolio);
        setPortfolio(parsed);
      } catch (error) {
        console.error('Error loading portfolio:', error);
      }
    }
  }, []);
  
  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);
  
  /**
   * Adds a product to portfolio or updates amount if already exists
   */
  const addToPortfolio = (product, amount) => {
    setPortfolio(prev => {
      // Check if product already exists
      const existingIndex = prev.items.findIndex(item => item.product.id === product.id);
      
      let newItems;
      if (existingIndex >= 0) {
        // Update existing item amount
        newItems = [...prev.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          amount: newItems[existingIndex].amount + amount
        };
      } else {
        // Add new item
        newItems = [...prev.items, { product, amount }];
      }
      
      return calculatePortfolioStats(newItems);
    });
  };
  
  /**
   * Removes a product from portfolio
   */
  const removeFromPortfolio = (productId) => {
    setPortfolio(prev => {
      const newItems = prev.items.filter(item => item.product.id !== productId);
      return calculatePortfolioStats(newItems);
    });
  };
  
  /**
   * Updates allocation amount for a product
   */
  const updateAllocation = (productId, newAmount) => {
    setPortfolio(prev => {
      const newItems = prev.items.map(item => {
        if (item.product.id === productId) {
          return { ...item, amount: newAmount };
        }
        return item;
      });
      return calculatePortfolioStats(newItems);
    });
  };
  
  /**
   * Checks if product is in portfolio
   */
  const isInPortfolio = (productId) => {
    return portfolio.items.some(item => item.product.id === productId);
  };
  
  /**
   * Clears entire portfolio
   */
  const clearPortfolio = () => {
    setPortfolio({
      items: [],
      totalInvested: 0,
      weightedReturn: 0,
      riskDistribution: { low: 0, medium: 0, high: 0 },
      categoryDistribution: {}
    });
  };
  
  /**
   * Calculates all portfolio statistics
   */
  const calculatePortfolioStats = (items) => {
    const totalInvested = items.reduce((sum, item) => sum + item.amount, 0);
    const weightedReturn = calculateWeightedReturn(items);
    const riskDistribution = calculateRiskDistribution(items);
    const categoryDistribution = calculateCategoryDistribution(items);
    
    return {
      items,
      totalInvested,
      weightedReturn,
      riskDistribution,
      categoryDistribution
    };
  };
  
  const value = {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    updateAllocation,
    isInPortfolio,
    clearPortfolio
  };
  
  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

/**
 * Custom hook to use portfolio context
 */
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
}
