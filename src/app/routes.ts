import { createBrowserRouter } from 'react-router';
import RootLayout from './RootLayout';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import UserProfile from './pages/UserProfile';
import Portfolio from './pages/Portfolio';
import Recommendations from './pages/Recommendations';
import ApiTest from './pages/ApiTest';
import NotFound from './pages/NotFound';

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'products',
        Component: ProductListing
      },
      {
        path: 'product/:id',
        Component: ProductDetail
      },
      {
        path: 'profile',
        Component: UserProfile
      },
      {
        path: 'portfolio',
        Component: Portfolio
      },
      {
        path: 'recommendations',
        Component: Recommendations
      },
      {
        path: 'api-test',
        Component: ApiTest
      },
      {
        path: '*',
        Component: NotFound
      }
    ]
  }
]);
