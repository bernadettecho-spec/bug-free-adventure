import React from 'react';

export default function MinutesEditor({ meeting, agendaItems, attendees, discussionNotes, onNotesChange, nextMeetingDate, onNextMeetingDateChange }) {
  const dateStr = meeting?.date_time
    ? new Date(meeting.date_time).toLocaleString('en-SG', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'TBC';

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)',
        borderRadius: '8px 8px 0 0', padding: '20px 24px',
        color: 'white',
      }}>
        <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>
          Singapore Government — Minutes of Meeting
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{meeting?.title || 'Meeting Title'}</h2>
        <div style={{ opacity: 0.85, marginTop: 6, fontSize: 14 }}>{dateStr}</div>
        {meeting?.venue && <div style={{ opacity: 0.85, fontSize: 14 }}>📍 {meeting.venue}</div>}
      </div>

      <div style={{ border: '1px solid #E0E0E0', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 24 }}>
        <section style={{ marginBottom: 24 }}>
          <SectionHeading>Attendees</SectionHeading>
          {attendees.length === 0 ? (
            <p style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: 14 }}>No attendees recorded</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#F7F7F7' }}>
                  {['Name', 'Email', 'Role', 'Ministry', 'Type'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-grey)', fontWeight: 700, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendees.map((a, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={tdStyle}>{a.name}</td>
                    <td style={tdStyle}>{a.email}</td>
                    <td style={tdStyle}>{a.role}</td>
                    <td style={tdStyle}>{a.ministry}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                        background: a.type === 'standing' ? '#E6F9FF' : '#F9E8F6',
                        color: a.type === 'standing' ? '#00C0F3' : '#BA2FA2',
                      }}>
                        {a.type === 'standing' ? 'Standing' : 'Ad-hoc'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section style={{ marginBottom: 24 }}>
          <SectionHeading>Discussion Notes</SectionHeading>
          {agendaItems.length === 0 ? (
            <p style={{ color: 'var(--color-grey)', fontStyle: 'italic', fontSize: 14 }}>No agenda items</p>
          ) : (
            agendaItems.map(item => (
              <div key={item.id} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-cyan)', marginBottom: 6, fontSize: 15 }}>
                  {item.item_number}. {item.title}
                  {item.presenter && <span style={{ fontWeight: 400, color: 'var(--color-grey)', fontSize: 13, marginLeft: 8 }}>— {item.presenter}</span>}
                </div>
                <textarea
                  value={discussionNotes[item.id] || ''}
                  onChange={e => onNotesChange(item.id, e.target.value)}
                  placeholder="Enter discussion notes, decisions, and outcomes for this agenda item..."
                  rows={4}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 6,
                    border: '1.5px solid #E0E0E0', fontSize: 14, outline: 'none',
                    fontFamily: 'Lato, sans-serif', resize: 'vertical', lineHeight: 1.6,
                  }}
                />
              </div>
            ))
          )}
        </section>

        <section>
          <SectionHeading>Next Meeting</SectionHeading>
          <input
            type="date"
            value={nextMeetingDate || ''}
            onChange={e => onNextMeetingDateChange(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 6, border: '1.5px solid #E0E0E0',
              fontSize: 14, fontFamily: 'Lato, sans-serif', outline: 'none',
            }}
          />
          <span style={{ marginLeft: 10, color: 'var(--color-grey)', fontSize: 13 }}>(optional)</span>
        </section>

        <div style={{
          marginTop: 24, paddingTop: 16, borderTop: '1px solid #F0F0F0',
          fontSize: 12, color: 'var(--color-grey)', textAlign: 'center',
        }}>
          Prepared by {meeting?.secretariat_name || 'Secretariat'} | {meeting?.ministry || ''} | OFFICIAL
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 style={{
      margin: '0 0 12px', color: 'var(--color-cyan)', fontSize: 14,
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
      borderBottom: '1px solid #F0F0F0', paddingBottom: 8,
    }}>
      {children}
    </h3>
  );
}

const tdStyle = { padding: '8px 12px', color: 'var(--color-dark-grey)', fontSize: 14 };
