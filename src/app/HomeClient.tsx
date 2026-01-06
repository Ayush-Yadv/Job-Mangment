'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobLandingWithData } from '@/components/JobLandingWithData';
import { AdminLogin } from '@/components/AdminLogin';
import { Job } from '@/components/JobLanding';

interface HomeClientProps {
  initialJobs: Job[];
  serverError: string | null;
}

export default function HomeClient({ initialJobs, serverError }: HomeClientProps) {
  const router = useRouter();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminLogin = () => {
    router.push('/admin/jobs');
  };

  if (showAdminLogin) {
    return (
      <AdminLogin
        onClose={() => setShowAdminLogin(false)}
        onLogin={handleAdminLogin}
      />
    );
  }

  return (
    <JobLandingWithData 
      initialJobs={initialJobs} 
      serverError={serverError}
      onAdminClick={() => setShowAdminLogin(true)} 
    />
  );
}
