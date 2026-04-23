import React from 'react';

const STAGES = [
  { num: 1, label: 'Agenda Setup & Circulation' },
  { num: 2, label: 'Transcript Review' },
  { num: 3, label: 'Minutes Distribution' },
];

export default function PipelineProgress({ currentStage, meeting }) {
  return (
    <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: 0 }}>
      {meeting && (
        <div style={{ marginRight: 24, fontSize: 13, color: 'var(--color-grey)', minWidth: 120 }}>
          <div style={{ fontWeight: 700, color: 'var(--color-dark-grey)', fontSize: 14 }}>{meeting.title}</div>
          <div>{meeting.date_time ? new Date(meeting.date_time).toLocaleDateString('en-SG') : ''}</div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {STAGES.map((stage, idx) => {
          const isActive = stage.num === currentStage;
          const isDone = stage.num < currentStage;
          return (
            <React.Fragment key={stage.num}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 14,
                  background: isDone ? 'var(--color-cyan)' : isActive
                    ? 'linear-gradient(135deg, #00C0F3, #BA2FA2)' : 'white',
                  color: isDone || isActive ? 'white' : 'var(--color-grey)',
                  border: isDone || isActive ? 'none' : '2px solid var(--color-grey)',
                  boxShadow: isActive ? '0 2px 8px rgba(0,192,243,0.4)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {isDone ? '✓' : stage.num}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: isActive ? 700 : 400,
                  color: isActive ? 'var(--color-dark-grey)' : 'var(--color-grey)',
                  textAlign: 'center', maxWidth: 90, lineHeight: 1.2,
                }}>
                  {stage.label}
                </div>
              </div>
              {idx < STAGES.length - 1 && (
                <div style={{
                  flex: 1, height: 2, margin: '0 8px', marginBottom: 18,
                  background: isDone ? 'var(--color-cyan)' : '#E5E5E5',
                  transition: 'background 0.3s',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
