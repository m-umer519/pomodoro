'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    // Client-side validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      if (isNewUser) {
        // Sign up - Supabase will auto-confirm if email confirmation is disabled in dashboard
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;
        
        // Check if user was auto-confirmed (when email confirmation is disabled)
        if (data.user && data.session) {
          // Session is set, redirect immediately
          window.location.replace('/');
        } else {
          setError('Please check your email to confirm your account before signing in.');
          setLoading(false);
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (data.session) {
          // Session is set, redirect immediately
          window.location.replace('/');
        } else {
          throw new Error('No session returned');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl w-full">
      <div className="card-body">
        <form onSubmit={handleAuth}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <label className="label">
              <span className="label-text-alt">Minimum 6 characters</span>
            </label>
          </div>
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                isNewUser ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </div>
        </form>

        {error && <div className="alert alert-error mt-4">{error}</div>}
        {message && <div className="alert alert-success mt-4">{message}</div>}

        <div className="divider">OR</div>

        <div className="flex flex-col gap-2">
          <button onClick={() => handleOAuth('google')} className="btn btn-outline">
            Continue with Google
          </button>
          <button onClick={() => handleOAuth('github')} className="btn btn-outline">
            Continue with GitHub
          </button>
        </div>

        <div className="text-center mt-4">
          <a
            href="#"
            className="link"
            onClick={(e) => {
              e.preventDefault();
              setIsNewUser(!isNewUser);
              setError(null);
              setMessage(null);
            }}
          >
            {isNewUser ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </a>
        </div>
      </div>
    </div>
  );
}