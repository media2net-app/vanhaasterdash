'use client';

import { useAuth } from '@/lib/auth-context';
import { LoginForm } from '@/components/LoginForm';
import { CRMDashboard } from '@/components/CRMDashboard';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E2017A] mx-auto"></div>
          <p className="mt-4 text-[#E2017A]">Laden...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <CRMDashboard /> : <LoginForm />;
}
