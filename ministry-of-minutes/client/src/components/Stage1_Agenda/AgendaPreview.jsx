import React from 'react';

export default function AgendaPreview({ meeting, agendaItems, attendees }) {
  const dateStr = meeting.date_time
    ? new Date(meeting.date_time).toLocaleString('en-SG', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'Date TBC';

  return (
    <div style={{
      border: '1px solid #E0E0E0', borderRadius: 8,
      overflow: 'hidden', background: 'white', fontSize: 14,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)',
        padding: '20px 24px',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
          Singapore Government
        </div>
        <h2 style={{ color: 'white', margin: 0, fontSize: 18, fontWeight: 900 }}>
          {meeting.title || 'Meeting Title'}
        </h2>
        <div style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6, fontSize: 13 }}>{dateStr}</div>
        {meeting.venue && (
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>📍 {meeting.venue}</div>
        )}
      </div>

      <div style={{ padding: '20px 24px' }}>
        <div style={{
          fontWeight: 700, fontSize: 13, color: 'var(--color-dark-grey)',
          borderBottom: '2px solid var(--color-cyan)', paddingBottom: 8, marginBottom: 16,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Agenda
        </div>

        {agendaItems.length === 0 ? (
          <div style={{ color: 'var(--color-grey)', fontStyle: 'italic' }}>No agenda items added yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {agendaItems.map(item => (
              <div key={item.id || item.item_number} style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  minWidth: 28, height: 28, borderRadius: '50%',
                  background: 'var(--color-cyan)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 13, flexShrink: 0,
                }}>
                  {item.item_number}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-dark-grey)' }}>{item.title || 'Untitled item'}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-grey)', marginTop: 2 }}>
                    {item.presenter && <span>Presenter: {item.presenter}</span>}
                    {item.presenter && item.duration_minutes ? ' · ' : ''}
                    {item.duration_minutes ? <span>{item.duration_minutes} min</span> : null}
                  </div>
                </div>
              </div>
            ))}
            {meeting.aob_enabled && (
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  minWidth: 28, height: 28, borderRadius: '50%',
                  background: 'var(--color-grey)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 11, flexShrink: 0,
                }}>AOB</div>
                <div style={{ fontWeight: 700, color: 'var(--color-dark-grey)', display: 'flex', alignItems: 'center' }}>
                  Any Other Business
                </div>
              </div>
            )}
          </div>
        )}

        {attendees.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F0F0F0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-grey)', marginBottom: 8, textTransform: 'uppercase' }}>
              Attendees ({attendees.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {attendees.map((a, i) => (
                <span key={i} style={{
                  padding: '3px 10px', borderRadius: 12, fontSize: 12,
                  background: a.type === 'standing' ? '#E6F9FF' : '#F9E8F6',
                  color: a.type === 'standing' ? '#00C0F3' : '#BA2FA2',
                  fontWeight: 600,
                }}>
                  {a.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
