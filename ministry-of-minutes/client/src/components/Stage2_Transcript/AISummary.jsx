import React from 'react';

export default function AISummary({ summary, onChange }) {
  if (!summary) {
    return (
      <div>
        <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16 }}>AI Summary</h3>
        <div style={{
          textAlign: 'center', padding: '40px 24px',
          border: '2px dashed #E0E0E0', borderRadius: 8,
          color: 'var(--color-grey)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>No summary yet</div>
          <div style={{ fontSize: 13 }}>Upload a transcript and click "Summarise with AI"</div>
        </div>
      </div>
    );
  }

  function updateDecision(idx, val) {
    const updated = { ...summary, key_decisions: summary.key_decisions.map((d, i) => i === idx ? val : d) };
    onChange(updated);
  }

  function addDecision() {
    onChange({ ...summary, key_decisions: [...(summary.key_decisions || []), ''] });
  }

  function removeDecision(idx) {
    onChange({ ...summary, key_decisions: summary.key_decisions.filter((_, i) => i !== idx) });
  }

  function updateActionItem(idx, field, val) {
    const updated = { ...summary, action_items: summary.action_items.map((a, i) => i === idx ? { ...a, [field]: val } : a) };
    onChange(updated);
  }

  function addActionItem() {
    onChange({ ...summary, action_items: [...(summary.action_items || []), { action: '', owner: '', deadline: '' }] });
  }

  function removeActionItem(idx) {
    onChange({ ...summary, action_items: summary.action_items.filter((_, i) => i !== idx) });
  }

  function updateFollowUp(idx, val) {
    const updated = { ...summary, follow_up_items: summary.follow_up_items.map((f, i) => i === idx ? val : f) };
    onChange(updated);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>AI Summary</h3>
        <span style={{
          padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
          background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)', color: 'white',
        }}>
          Claude AI
        </span>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h4 style={{ margin: 0, color: 'var(--color-cyan)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
            Key Decisions
          </h4>
          <button onClick={addDecision} style={addBtnStyle}>+ Add</button>
        </div>
        {(summary.key_decisions || []).map((d, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input
              value={d}
              onChange={e => updateDecision(idx, e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={() => removeDecision(idx)} style={removeBtnStyle}>×</button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h4 style={{ margin: 0, color: 'var(--color-magenta)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
            Action Items
          </h4>
          <button onClick={addActionItem} style={addBtnStyle}>+ Add</button>
        </div>
        {(summary.action_items || []).map((a, idx) => (
          <div key={idx} style={{ background: '#F7F7F7', borderRadius: 6, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-grey)' }}>#{idx + 1}</span>
              <button onClick={() => removeActionItem(idx)} style={removeBtnStyle}>×</button>
            </div>
            <input
              value={a.action}
              onChange={e => updateActionItem(idx, 'action', e.target.value)}
              placeholder="Action"
              style={{ ...inputStyle, marginBottom: 6 }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <input
                value={a.owner}
                onChange={e => updateActionItem(idx, 'owner', e.target.value)}
                placeholder="Owner"
                style={inputStyle}
              />
              <input
                value={a.deadline}
                onChange={e => updateActionItem(idx, 'deadline', e.target.value)}
                placeholder="Deadline"
                style={inputStyle}
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px', color: 'var(--color-dark-grey)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
          Follow-up Items
        </h4>
        {(summary.follow_up_items || []).map((f, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input
              value={f}
              onChange={e => updateFollowUp(idx, e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '7px 10px', borderRadius: 6,
  border: '1.5px solid #E0E0E0', fontSize: 13, outline: 'none',
  fontFamily: 'Lato, sans-serif',
};

const addBtnStyle = {
  background: 'none', border: '1px solid #E0E0E0', color: 'var(--color-grey)',
  padding: '3px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
};

const removeBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--color-grey)', fontSize: 18, padding: '0 4px', lineHeight: 1,
};
