'use client';

import React, { useState, useEffect } from 'react';
import { getAdminSession, AdminUser } from '@/lib/adminAuth';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (!mounted) return;
      const existingSession = getAdminSession();
      if (existingSession) {
        setUser(existingSession);
      }
      setIsInitializing(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-black mb-4 shadow-sm animate-pulse">
          NG
        </div>
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-500 font-semibold">Süper Admin Oturumu Doğrulanıyor...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <AdminDashboard 
      user={user} 
      onLogout={() => setUser(null)} 
    />
  );
}
