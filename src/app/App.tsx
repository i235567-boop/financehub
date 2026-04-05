import { RouterProvider } from 'react-router';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { router } from './routes';
import './App.css';

/**
 * Main App component
 * Provides context and routing for the entire application
 */
export default function App() {
  return (
    <UserProfileProvider>
      <PortfolioProvider>
        <RouterProvider router={router} />
      </PortfolioProvider>
    </UserProfileProvider>
  );
}