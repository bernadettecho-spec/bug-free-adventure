import React, { useState, useEffect } from 'react';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: '#ADADAD', bg: '#F7F7F7' },
  agenda_sent: { label: 'Agenda Sent', color: '#00C0F3', bg: '#E6F9FF' },
  transcript_received: { label: 'Transcript Received', color: '#BA2FA2', bg: '#F9E8F6' },
  minutes_sent: { label: 'Minutes Sent', color: '#3D3D3D', bg: '#EEF7EE' },
};

function stageForStatus(status) {
  if (status === 'transcript_received') return 'stage2';
  if (status === 'minutes_sent') return 'stage3';
  if (status === 'agenda_sent') return 'stage2';
  return 'stage1';
}

export default function Dashboard({ onOpenMeeting, showToast }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function fetchMeetings() {
    const res = await fetch('/api/meetings');
    const data = await res.json();
    setMeetings(data);
    setLoading(false);
  }

  useEffect(() => { fetchMeetings(); }, []);

  async function newMeeting() {
    setCreating(true);
    const res = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Meeting',
        date_time: new Date().toISOString(),
        venue: '',
        aob_enabled: false,
      }),
    });
    const meeting = await res.json();
    setCreating(false);
    onOpenMeeting(meeting, 'stage1');
  }

  async function deleteMeeting(e, id) {
    e.stopPropagation();
    if (!confirm('Delete this meeting?')) return;
    await fetch(`/api/meetings/${id}`, { method: 'DELETE' });
    setMeetings(m => m.filter(x => x.id !== id));
    showToast('Meeting deleted');
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--color-grey)' }}>
        Loading meetings...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: 'var(--color-dark-grey)' }}>
            Meetings Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--color-grey)', fontSize: 14 }}>
            Manage secretariat workflows for government meetings
          </p>
        </div>
        <button
          onClick={newMeeting}
          disabled={creating}
          style={{
            background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)',
            color: 'white', border: 'none', padding: '12px 24px',
            borderRadius: 8, fontWeight: 700, fontSize: 15,
            cursor: creating ? 'not-allowed' : 'pointer',
            opacity: creating ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(0,192,243,0.3)',
          }}
        >
          {creating ? 'Creating...' : '+ New Meeting'}
        </button>
      </div>

      {meetings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          background: 'white', borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-dark-grey)', marginBottom: 8 }}>
            No meetings yet
          </div>
          <div style={{ color: 'var(--color-grey)', marginBottom: 24 }}>
            Create your first meeting to get started
          </div>
          <button
            onClick={newMeeting}
            style={{
              background: 'var(--color-cyan)', color: 'white',
              border: 'none', padding: '12px 28px', borderRadius: 8,
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >
            + New Meeting
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {meetings.map(m => {
            const status = STATUS_CONFIG[m.status] || STATUS_CONFIG.draft;
            return (
              <div
                key={m.id}
                onClick={() => onOpenMeeting(m, stageForStatus(m.status))}
                style={{
                  background: 'white', borderRadius: 10,
                  padding: '20px 24px', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 20,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#00C0F3'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-dark-grey)', marginBottom: 4 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-grey)', display: 'flex', gap: 16 }}>
                    <span>📅 {new Date(m.date_time).toLocaleString('en-SG', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    {m.venue && <span>📍 {m.venue}</span>}
                    {m.attendee_count > 0 && <span>👥 {m.attendee_count} attendees</span>}
                    {m.agenda_count > 0 && <span>📌 {m.agenda_count} agenda items</span>}
                  </div>
                </div>
                <div style={{
                  padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  color: status.color, background: status.bg, whiteSpace: 'nowrap',
                }}>
                  {status.label}
                </div>
                <button
                  onClick={(e) => deleteMeeting(e, m.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-grey)', fontSize: 18, padding: 4,
                  }}
                  title="Delete meeting"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
