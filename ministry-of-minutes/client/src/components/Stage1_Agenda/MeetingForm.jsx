import React from 'react';

export default function MeetingForm({ data, onChange }) {
  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div>
      <h3 style={{ margin: '0 0 20px', color: 'var(--color-dark-grey)', fontWeight: 700, fontSize: 17 }}>
        Meeting Details
      </h3>
      <div style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={labelStyle}>Meeting Title *</label>
          <input
            value={data.title || ''}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Q2 Inter-Agency Coordination Meeting"
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Date & Time *</label>
            <input
              type="datetime-local"
              value={data.date_time ? data.date_time.slice(0, 16) : ''}
              onChange={e => set('date_time', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Venue / Video Link</label>
            <input
              value={data.venue || ''}
              onChange={e => set('venue', e.target.value)}
              placeholder="e.g. MOM Building, Level 8 Boardroom"
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Secretariat Name</label>
            <input
              value={data.secretariat_name || ''}
              onChange={e => set('secretariat_name', e.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Ministry / Agency</label>
            <input
              value={data.ministry || ''}
              onChange={e => set('ministry', e.target.value)}
              placeholder="e.g. Ministry of Manpower"
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="checkbox"
            id="aob"
            checked={!!data.aob_enabled}
            onChange={e => set('aob_enabled', e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--color-cyan)', cursor: 'pointer' }}
          />
          <label htmlFor="aob" style={{ cursor: 'pointer', fontWeight: 400, color: 'var(--color-dark-grey)' }}>
            Include AOB (Any Other Business) at end of agenda
          </label>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', marginBottom: 6,
  fontSize: 13, fontWeight: 700, color: 'var(--color-dark-grey)',
};

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 6,
  border: '1.5px solid #E0E0E0', fontSize: 14, outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'Lato, sans-serif',
};
