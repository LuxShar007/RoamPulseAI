import React, { useState } from 'react';
import { Settings, PiggyBank, Download, ChevronRight, LogOut, Siren } from 'lucide-react';

export default function UserProfile({ user, onOpenSettings, onOpenBudget, onOpenOfflineMaps, onOpenPoliceHelp, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div style={{ padding: '44px 20px 20px 20px', background: 'var(--bg-dark)', minHeight: '100%', position: 'relative' }}>
      {/* Profile Header */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--accent-cyan)', margin: '0 auto 12px auto' }}
        />
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{user.name}</h2>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '12px',
          background: 'var(--border-subtle)',
          color: 'var(--accent-cyan)',
          fontSize: '12px',
          fontWeight: '800',
          marginTop: '6px'
        }}>
          <span>{user.travelType}</span>
        </div>
      </div>

      {/* Menu Cards Wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {/* AI Budget Optimizer */}
        <div
          onClick={onOpenBudget}
          className="glass-card"
          style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PiggyBank size={22} color="var(--accent-cyan)" />
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>AI Budget Optimizer</div>
              <div style={{ fontSize: '12px', color: '#22C55E', fontWeight: '800' }}>Saved ₹{user.savedAmount} so far</div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* Offline Maps Manager */}
        <div
          onClick={onOpenOfflineMaps}
          className="glass-card"
          style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Download size={22} color="var(--accent-purple)" />
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>Offline Maps Manager</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>2 Map packs downloaded</div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* Settings & Preferences */}
        <div
          onClick={onOpenSettings}
          className="glass-card"
          style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Settings size={22} color="var(--accent-amber)" />
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>Settings & Preferences</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Currency, privacy & theme</div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* Police Assistance */}
        <div
          className="glass-card glass-card--emergency"
          onClick={onOpenPoliceHelp}
          style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Siren size={22} color="#EF4444" />
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>
                Police Assistance
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Find police stations or get emergency help
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>
      </div>

      {/* Log Out Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        style={{
          width: '100%',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#EF4444',
          fontWeight: '800',
          padding: '14px',
          borderRadius: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '8px'
        }}
      >
        <LogOut size={18} />
        <span>Log Out</span>
      </button>

      {/* Logout Modal - Bound within mobile viewport */}
      {showLogoutConfirm && (
        <div style={{
          position: 'absolute',
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: 'rgba(6, 11, 18, 0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 300,
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justify: 'center'
        }}>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid #EF4444', width: '100%', maxWidth: '340px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Log Out of RoamPulse AI?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Are you sure you want to log out? Your offline safety radar packs will remain saved.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: '800',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                style={{
                  flex: 1,
                  background: '#EF4444',
                  border: 'none',
                  color: '#FFF',
                  fontWeight: '800',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}