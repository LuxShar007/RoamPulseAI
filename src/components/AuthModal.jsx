import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, Activity } from 'lucide-react';

export default function AuthModal({ onLogin, onGuest }) {
  const [email, setEmail] = useState('sharv@roampulse.ai');
  const [password, setPassword] = useState('••••••••');

  return (
    <div style={{
      padding: '36px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      background: '#0D2322'
    }}>
      <div>
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(0, 229, 192, 0.15)',
            border: '1px solid #00E5C0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#00E5C0'
          }}>
            <Activity size={30} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#FFF' }}>Welcome to RoamPulse</h2>
          <p style={{ color: '#8AA8A5', fontSize: '13px' }}>AI-powered safety, convenience & amenity radar.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#8AA8A5', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Email Address</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#152E2E',
              border: '1px solid rgba(0, 229, 192, 0.2)',
              borderRadius: '14px',
              padding: '14px 16px',
              color: '#FFF'
            }}>
              <Mail size={18} color="#6B8B88" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#FFF', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#8AA8A5', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Password</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#152E2E',
              border: '1px solid rgba(0, 229, 192, 0.2)',
              borderRadius: '14px',
              padding: '14px 16px',
              color: '#FFF'
            }}>
              <Lock size={18} color="#6B8B88" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#FFF', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              />
            </div>
          </div>
        </div>

        <button onClick={onLogin} className="btn-primary" style={{ marginBottom: '14px' }}>
          <LogIn size={18} />
          <span>Sign In</span>
        </button>

        <button
          onClick={onLogin}
          style={{
            width: '100%',
            background: '#152E2E',
            border: '1px solid rgba(0, 229, 192, 0.2)',
            borderRadius: '14px',
            padding: '14px',
            color: '#FFF',
            fontWeight: '700',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google" />
          <span>Sign in with Google</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '12px' }}>
        <button
          onClick={onGuest}
          style={{ background: 'none', border: 'none', color: '#00E5C0', fontWeight: '700', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>Continue as Guest</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
