'use client';

import React from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#001524]">
      <AdminLoginForm
        onSuccess={() => {
          router.push('/admin');
          router.refresh();
        }}
      />
    </main>
  );
}
