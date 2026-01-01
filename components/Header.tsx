'use client';

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link

type HeaderProps = {
  email: string | undefined;
};

export default function Header({ email }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // This will re-trigger the middleware
  };

  return (
    <header className="bg-base-100 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-primary">Pomodoro</Link>
            <Link href="/analytics" className="link link-hover">Analytics</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">{email}</span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}