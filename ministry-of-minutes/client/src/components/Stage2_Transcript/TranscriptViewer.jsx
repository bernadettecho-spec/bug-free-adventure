import React from 'react';

export default function TranscriptViewer({ content }) {
  const lines = (content || '').split('\n').filter(l => l.trim());

  return (
    <div style={{
      maxHeight: 320, overflowY: 'auto', border: '1px solid #F0F0F0',
      borderRadius: 6, padding: '12px 16px', background: '#FAFAFA',
      fontSize: 13, lineHeight: 1.7,
    }}>
      {lines.map((line, idx) => {
        const speakerMatch = line.match(/^([^:]+):\s*(.+)$/);
        if (speakerMatch) {
          return (
            <div key={idx} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: 'var(--color-magenta)', marginRight: 6 }}>
                {speakerMatch[1]}:
              </span>
              <span style={{ color: 'var(--color-dark-grey)' }}>{speakerMatch[2]}</span>
            </div>
          );
        }
        return (
          <div key={idx} style={{ color: 'var(--color-dark-grey)', marginBottom: 4 }}>{line}</div>
        );
      })}
    </div>
  );
}
