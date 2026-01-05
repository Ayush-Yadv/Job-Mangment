'use client';

import { useState } from 'react';
import { JobLanding } from '@/components/JobLanding';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';

export default function Home() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  if (showAdminLogin) {
    return (
      <AdminLogin
        onClose={() => setShowAdminLogin(false)}
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  return <JobLanding onAdminClick={() => setShowAdminLogin(true)} />;
}
