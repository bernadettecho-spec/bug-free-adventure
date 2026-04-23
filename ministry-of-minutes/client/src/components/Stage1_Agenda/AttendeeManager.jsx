import React, { useRef, useState } from 'react';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/['"]/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    const obj = {};
    header.forEach((h, i) => { obj[h] = values[i] || ''; });
    return {
      name: obj.name || '',
      email: obj.email || '',
      role: obj.role || '',
      ministry: obj.ministry || '',
      type: 'standing',
    };
  }).filter(a => a.name && a.email);
}

const emptyPresenter = { name: '', email: '', role: '', ministry: '', type: 'adhoc' };

export default function AttendeeManager({ attendees, onChange }) {
  const fileRef = useRef();
  const [newPresenter, setNewPresenter] = useState({ ...emptyPresenter });
  const [showForm, setShowForm] = useState(false);

  function handleCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const parsed = parseCSV(evt.target.result);
      const existing = attendees.filter(a => a.type !== 'standing');
      onChange([...parsed, ...existing]);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function addPresenter() {
    if (!newPresenter.name || !newPresenter.email) return;
    onChange([...attendees, { ...newPresenter, type: 'adhoc' }]);
    setNewPresenter({ ...emptyPresenter });
    setShowForm(false);
  }

  function remove(idx) {
    onChange(attendees.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: 'var(--color-dark-grey)', fontWeight: 700, fontSize: 17 }}>
          Attendees
        </h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => fileRef.current.click()}
            style={{
              background: 'none', border: '2px solid var(--color-cyan)',
              color: 'var(--color-cyan)', padding: '6px 16px', borderRadius: 6,
              fontWeight: 700, cursor: 'pointer', fontSize: 13,
            }}
          >
            Upload CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'var(--color-magenta)', border: 'none',
              color: 'white', padding: '6px 16px', borderRadius: 6,
              fontWeight: 700, cursor: 'pointer', fontSize: 13,
            }}
          >
            + Add Presenter
          </button>
        </div>
      </div>

      <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSV} />

      {showForm && (
        <div style={{
          background: '#FFF8FE', border: '1px solid #BA2FA2', borderRadius: 8,
          padding: 16, marginBottom: 16,
        }}>
          <div style={{ fontWeight: 700, color: 'var(--color-magenta)', marginBottom: 12 }}>Add Ad-hoc Presenter</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[['name','Name *'], ['email','Email *'], ['role','Role'], ['ministry','Ministry']].map(([f, ph]) => (
              <input
                key={f}
                value={newPresenter[f]}
                onChange={e => setNewPresenter(p => ({ ...p, [f]: e.target.value }))}
                placeholder={ph}
                style={inputStyle}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={addPresenter} style={{
              background: 'var(--color-magenta)', color: 'white',
              border: 'none', padding: '8px 18px', borderRadius: 6,
              fontWeight: 700, cursor: 'pointer',
            }}>
              Add
            </button>
            <button onClick={() => setShowForm(false)} style={{
              background: 'none', border: '1px solid #ccc', padding: '8px 18px',
              borderRadius: 6, cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {attendees.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '32px', border: '2px dashed #E0E0E0',
          borderRadius: 8, color: 'var(--color-grey)',
        }}>
          No attendees yet. Upload a CSV or add presenters manually.
          <div style={{ fontSize: 12, marginTop: 8 }}>CSV format: Name, Email, Role, Ministry</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F7F7F7' }}>
                {['Name', 'Email', 'Role', 'Ministry', 'Type', ''].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-grey)', fontWeight: 700, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendees.map((a, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={tdStyle}>{a.name}</td>
                  <td style={tdStyle}>{a.email}</td>
                  <td style={tdStyle}>{a.role}</td>
                  <td style={tdStyle}>{a.ministry}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                      background: a.type === 'standing' ? '#E6F9FF' : '#F9E8F6',
                      color: a.type === 'standing' ? '#00C0F3' : '#BA2FA2',
                    }}>
                      {a.type === 'standing' ? 'Standing' : 'Ad-hoc'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => remove(idx)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--color-grey)', fontSize: 18,
                    }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: 6,
  border: '1.5px solid #E0E0E0', fontSize: 14, outline: 'none',
  fontFamily: 'Lato, sans-serif',
};

const tdStyle = { padding: '10px 12px', color: 'var(--color-dark-grey)' };
