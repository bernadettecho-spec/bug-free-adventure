import React from 'react';

export default function NavBar() {
  return (
    <nav style={{
      background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      height: 60,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 6,
          padding: '4px 10px',
          color: 'white',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Singapore Government
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>|</span>
        <span style={{ color: 'white', fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>
          Ministry of Minutes
        </span>
      </div>
      <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
        Secretariat Portal
      </div>
    </nav>
  );
}
