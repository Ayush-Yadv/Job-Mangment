import { useState } from 'react';
import { JobLanding } from './components/JobLanding';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminLogin = (success: boolean) => {
    setIsAdmin(success);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => setShowAdminLogin(false)} />;
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <JobLanding onAdminClick={() => setShowAdminLogin(true)} />;
}
