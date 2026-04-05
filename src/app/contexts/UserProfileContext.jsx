import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const UserProfileContext = createContext();

/**
 * UserProfileProvider manages user financial profile state globally
 * Stores profile in localStorage for persistence
 */
export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    setIsLoading(false);
  }, []);
  
  /**
   * Updates user profile and saves to localStorage
   */
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };
  
  /**
   * Clears user profile
   */
  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('userProfile');
  };
  
  /**
   * Checks if profile is complete (all fields filled)
   */
  const isProfileComplete = () => {
    if (!profile) return false;
    
    return (
      profile.riskTolerance &&
      profile.investmentHorizon &&
      profile.monthlyCapacity > 0 &&
      profile.liquidityPreference &&
      profile.investmentGoal
    );
  };
  
  const value = {
    profile,
    updateProfile,
    clearProfile,
    isProfileComplete,
    isLoading
  };
  
  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

/**
 * Custom hook to use profile context
 */
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
}
