import React from 'react';

function emptyItem(num) {
  return { id: Date.now() + Math.random(), item_number: num, title: '', presenter: '', duration_minutes: '' };
}

export default function AgendaItems({ items, onChange }) {
  function add() {
    onChange([...items, emptyItem(items.length + 1)]);
  }

  function remove(idx) {
    const updated = items.filter((_, i) => i !== idx).map((item, i) => ({ ...item, item_number: i + 1 }));
    onChange(updated);
  }

  function update(idx, field, value) {
    const updated = items.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    onChange(updated);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: 'var(--color-dark-grey)', fontWeight: 700, fontSize: 17 }}>
          Agenda Items
        </h3>
        <button onClick={add} style={{
          background: 'none', border: '2px solid var(--color-cyan)',
          color: 'var(--color-cyan)', padding: '6px 16px', borderRadius: 6,
          fontWeight: 700, cursor: 'pointer', fontSize: 13,
        }}>
          + Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '32px', border: '2px dashed #E0E0E0',
          borderRadius: 8, color: 'var(--color-grey)',
        }}>
          No agenda items yet. Click "+ Add Item" to begin.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((item, idx) => (
            <div key={item.id || idx} style={{
              display: 'grid', gridTemplateColumns: '40px 1fr 1fr 80px 36px',
              gap: 10, alignItems: 'center',
              padding: '12px 16px', background: '#FAFAFA', borderRadius: 8,
              border: '1px solid #EEEEEE',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--color-cyan)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 14,
              }}>
                {item.item_number}
              </div>
              <input
                value={item.title}
                onChange={e => update(idx, 'title', e.target.value)}
                placeholder="Agenda item title *"
                style={inputStyle}
              />
              <input
                value={item.presenter}
                onChange={e => update(idx, 'presenter', e.target.value)}
                placeholder="Presenter name"
                style={inputStyle}
              />
              <input
                type="number"
                value={item.duration_minutes}
                onChange={e => update(idx, 'duration_minutes', e.target.value)}
                placeholder="Min"
                min={0}
                style={{ ...inputStyle, textAlign: 'center' }}
              />
              <button
                onClick={() => remove(idx)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-grey)', fontSize: 20, lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {items.length > 0 && (
        <p style={{ fontSize: 12, color: 'var(--color-grey)', marginTop: 8 }}>
          Columns: Item # | Title | Presenter | Duration (min)
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: 6,
  border: '1.5px solid #E0E0E0', fontSize: 14, outline: 'none',
  fontFamily: 'Lato, sans-serif',
};
