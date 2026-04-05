import { Outlet } from 'react-router';
import Navbar from './components/Navbar';

/**
 * Root Layout component with persistent navigation
 */
export default function RootLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
