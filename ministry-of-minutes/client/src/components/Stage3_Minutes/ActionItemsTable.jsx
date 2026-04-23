import React from 'react';

const STATUS_OPTIONS = ['pending', 'in_progress', 'completed'];

export default function ActionItemsTable({ items, onChange }) {
  function update(idx, field, val) {
    onChange(items.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  }

  function add() {
    onChange([...items, { action: '', owner: '', deadline: '', status: 'pending' }]);
  }

  function remove(idx) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Action Items</h3>
        <button onClick={add} style={{
          background: 'none', border: '2px solid var(--color-cyan)',
          color: 'var(--color-cyan)', padding: '6px 16px', borderRadius: 6,
          fontWeight: 700, cursor: 'pointer', fontSize: 13,
        }}>
          + Add Action
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', border: '2px dashed #E0E0E0', borderRadius: 8, color: 'var(--color-grey)' }}>
          No action items. Click "+ Add Action" to add.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)' }}>
                {['#', 'Action', 'Owner', 'Deadline', 'Status', ''].map(h => (
                  <th key={h} style={{ color: 'white', padding: '10px 12px', textAlign: 'left', fontWeight: 700, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? 'white' : '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '8px 12px', color: 'var(--color-grey)', fontWeight: 700 }}>{idx + 1}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <input
                      value={item.action}
                      onChange={e => update(idx, 'action', e.target.value)}
                      placeholder="Action description"
                      style={inputStyle}
                    />
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <input
                      value={item.owner}
                      onChange={e => update(idx, 'owner', e.target.value)}
                      placeholder="Owner"
                      style={inputStyle}
                    />
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <input
                      value={item.deadline}
                      onChange={e => update(idx, 'deadline', e.target.value)}
                      placeholder="e.g. 30 Jun 2026"
                      style={inputStyle}
                    />
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <select
                      value={item.status}
                      onChange={e => update(idx, 'status', e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '8px 12px' }}>
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
  width: '100%', padding: '6px 8px', borderRadius: 5,
  border: '1.5px solid #E0E0E0', fontSize: 13, outline: 'none',
  fontFamily: 'Lato, sans-serif', background: 'white',
};
