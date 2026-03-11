'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store minimal user info for UI (optional, Firebase keeps its own state)
      localStorage.setItem('user', JSON.stringify({
        id: user.uid,
        email: user.email,
        name: user.displayName || 'Admin'
      }));

      router.push('/admin');
    } catch (err: any) {
      console.error('Login Error:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-alt)'
    }}>
      <div className="login-card reveal visible" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: 'var(--bg)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo" style={{ fontSize: '24px', fontWeight: '900', color: '#ff4500' }}>
            DASH <span style={{ color: 'var(--text)' }}>DELIVERY</span>
          </div>
          <div style={{ fontSize: '14px', opacity: 0.6, marginTop: '8px' }}>Admin Control Center</div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 69, 0, 0.1)',
            color: '#ff4500',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 69, 0, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', opacity: 0.8 }}>Email Address</label>
            <input
              type="email"
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', opacity: 0.8 }}>Password</label>
            <input
              type="password"
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#ff4500',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
