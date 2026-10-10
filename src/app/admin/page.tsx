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
    const controller = new AbortController();

    getAdminSession(controller.signal)
      .then((existingSession) => {
        if (mounted) {
          setUser(existingSession);
        }
      })
      .catch(() => {
        // Fall back gracefully to login screen
        if (mounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-600/20 mb-4 animate-pulse">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-emerald-700 font-black text-lg">
            NG
          </div>
        </div>
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-500 font-semibold tracking-wider uppercase">
          Süper Admin Masası Başlatılıyor...
        </p>
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
