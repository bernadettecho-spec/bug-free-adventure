import React, { useState, useEffect } from 'react';
import MeetingForm from './MeetingForm.jsx';
import AgendaItems from './AgendaItems.jsx';
import AttendeeManager from './AttendeeManager.jsx';
import AgendaPreview from './AgendaPreview.jsx';

export default function Stage1Container({ meeting: initialMeeting, onBack, onNext, showToast }) {
  const [meetingData, setMeetingData] = useState({
    title: '', date_time: '', venue: '', aob_enabled: false,
    secretariat_name: '', ministry: '',
    ...initialMeeting,
  });
  const [agendaItems, setAgendaItems] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    if (initialMeeting?.id) {
      fetch(`/api/meetings/${initialMeeting.id}`)
        .then(r => r.json())
        .then(data => {
          setMeetingData({
            title: data.title, date_time: data.date_time, venue: data.venue,
            aob_enabled: !!data.aob_enabled, secretariat_name: data.secretariat_name || '',
            ministry: data.ministry || '', id: data.id, status: data.status,
          });
          setAgendaItems(data.agendaItems || []);
          setAttendees(data.attendees || []);
        });
    }
  }, [initialMeeting?.id]);

  async function save() {
    setSaving(true);
    const body = { ...meetingData, agendaItems, attendees };
    let res;
    if (meetingData.id) {
      res = await fetch(`/api/meetings/${meetingData.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
    } else {
      res = await fetch('/api/meetings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
    }
    const saved = await res.json();
    setMeetingData(d => ({ ...d, id: saved.id, status: saved.status }));
    setSaving(false);
    showToast('Meeting saved');
    return saved;
  }

  async function circulateAgenda() {
    if (!meetingData.title || !meetingData.date_time) {
      showToast('Please fill in meeting title and date', 'error'); return;
    }
    if (attendees.length === 0) {
      showToast('Please add at least one attendee', 'error'); return;
    }
    if (agendaItems.length === 0) {
      showToast('Please add at least one agenda item', 'error'); return;
    }
    setSending(true);
    const saved = await save();
    const res = await fetch(`/api/email/agenda/${saved.id}`, { method: 'POST' });
    const result = await res.json();
    setSending(false);
    if (!res.ok) { showToast(result.error || 'Failed to send email', 'error'); return; }
    showToast(`Agenda circulated to ${result.recipientCount} recipients via Opus`);
    setMeetingData(d => ({ ...d, status: 'agenda_sent' }));
  }

  const tabs = [
    { id: 'form', label: 'Meeting Details' },
    { id: 'agenda', label: 'Agenda Items' },
    { id: 'attendees', label: 'Attendees' },
    { id: 'preview', label: 'Preview' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--color-grey)',
          cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 0,
        }}>←</button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: 'var(--color-dark-grey)' }}>
              Stage 1: Agenda Setup & Circulation
            </h2>
            {meetingData.status && meetingData.status !== 'draft' && (
              <span style={{
                padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: '#E6F9FF', color: '#00C0F3',
              }}>
                {meetingData.status === 'agenda_sent' ? 'Agenda Sent' : meetingData.status}
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--color-grey)', fontSize: 14 }}>
            Configure your meeting details, agenda, and attendees
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E0E0E0', marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '10px 20px', border: 'none', background: 'none',
            fontWeight: activeTab === tab.id ? 700 : 400,
            color: activeTab === tab.id ? 'var(--color-cyan)' : 'var(--color-grey)',
            borderBottom: activeTab === tab.id ? '2px solid var(--color-cyan)' : '2px solid transparent',
            marginBottom: -2, cursor: 'pointer', fontSize: 14,
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {activeTab === 'form' && (
          <MeetingForm data={meetingData} onChange={setMeetingData} />
        )}
        {activeTab === 'agenda' && (
          <AgendaItems items={agendaItems} onChange={setAgendaItems} />
        )}
        {activeTab === 'attendees' && (
          <AttendeeManager attendees={attendees} onChange={setAttendees} />
        )}
        {activeTab === 'preview' && (
          <AgendaPreview meeting={meetingData} agendaItems={agendaItems} attendees={attendees} />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={save} disabled={saving} style={{
          border: '2px solid var(--color-cyan)', background: 'white',
          color: 'var(--color-cyan)', padding: '11px 24px', borderRadius: 8,
          fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14,
          opacity: saving ? 0.7 : 1,
        }}>
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={circulateAgenda} disabled={sending} style={{
            background: 'var(--color-cyan)', color: 'white', border: 'none',
            padding: '12px 28px', borderRadius: 8, fontWeight: 700,
            cursor: sending ? 'not-allowed' : 'pointer', fontSize: 14,
            opacity: sending ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(0,192,243,0.3)',
          }}>
            {sending ? 'Sending...' : '📧 Circulate Agenda'}
          </button>
          <button onClick={async () => { const s = await save(); onNext({ ...s, agendaItems, attendees }); }} style={{
            background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)', color: 'white',
            border: 'none', padding: '12px 28px', borderRadius: 8,
            fontWeight: 700, cursor: 'pointer', fontSize: 14,
          }}>
            Next: Transcript Review →
          </button>
        </div>
      </div>
    </div>
  );
}
