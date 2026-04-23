import React, { useState, useEffect } from 'react';
import MinutesEditor from './MinutesEditor.jsx';
import ActionItemsTable from './ActionItemsTable.jsx';

export default function Stage3Container({ meeting, onBack, onDone, showToast }) {
  const [fullMeeting, setFullMeeting] = useState(null);
  const [discussionNotes, setDiscussionNotes] = useState({});
  const [actionItems, setActionItems] = useState([]);
  const [nextMeetingDate, setNextMeetingDate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [docxData, setDocxData] = useState(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!meeting?.id) return;
    fetch(`/api/meetings/${meeting.id}`)
      .then(r => r.json())
      .then(data => {
        setFullMeeting(data);
        if (data.actionItems && data.actionItems.length > 0) {
          setActionItems(data.actionItems);
        } else if (meeting.aiSummary?.action_items) {
          setActionItems(meeting.aiSummary.action_items.map(a => ({
            action: a.action, owner: a.owner || '', deadline: a.deadline || '', status: 'pending',
          })));
        }
      });
  }, [meeting?.id]);

  function updateNote(itemId, val) {
    setDiscussionNotes(n => ({ ...n, [itemId]: val }));
  }

  async function saveActionItems() {
    await fetch(`/api/meetings/${meeting.id}/action-items`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionItems }),
    });
  }

  async function generateDocx() {
    setGenerating(true);
    await saveActionItems();
    const res = await fetch(`/api/minutes/generate/${meeting.id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discussionNotes }),
    });
    const data = await res.json();
    setGenerating(false);
    if (!res.ok) { showToast(data.error || 'Generation failed', 'error'); return; }
    setDocxData(data);
    showToast('Minutes generated successfully');

    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.base64}`;
    link.download = data.filename;
    link.click();
  }

  async function circulateMinutes() {
    if (!docxData) { showToast('Please generate minutes first', 'error'); return; }
    setSending(true);
    const res = await fetch(`/api/email/minutes/${meeting.id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docxBase64: docxData.base64,
        actionItemsSummary: actionItems.map((a, i) =>
          `${i + 1}. ${a.action} | Owner: ${a.owner || 'TBC'} | Deadline: ${a.deadline || 'TBC'}`
        ).join('\n'),
      }),
    });
    const result = await res.json();
    setSending(false);
    if (!res.ok) { showToast(result.error || 'Failed to send minutes', 'error'); return; }
    showToast(`Minutes circulated to ${result.recipientCount} recipients via Opus`);
    setComplete(true);
  }

  if (complete) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '0 auto 24px',
        }}>
          ✓
        </div>
        <h2 style={{ fontWeight: 900, fontSize: 26, color: 'var(--color-dark-grey)', marginBottom: 8 }}>
          Workflow Complete!
        </h2>
        <p style={{ color: 'var(--color-grey)', fontSize: 16, marginBottom: 32 }}>
          Minutes have been circulated to all attendees. The secretariat workflow is complete.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            onClick={() => { setComplete(false); }}
            style={{
              border: '2px solid var(--color-cyan)', background: 'white', color: 'var(--color-cyan)',
              padding: '11px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Back to Minutes
          </button>
          <button
            onClick={onDone}
            style={{
              background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)', color: 'white',
              border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const agendaItems = fullMeeting?.agendaItems || [];
  const attendees = fullMeeting?.attendees || [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--color-grey)',
          cursor: 'pointer', fontSize: 22, padding: 0,
        }}>←</button>
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: 'var(--color-dark-grey)' }}>
            Stage 3: Minutes & Action Points Distribution
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--color-grey)', fontSize: 14 }}>
            Review and finalise minutes, then distribute to all attendees
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <MinutesEditor
            meeting={fullMeeting || meeting}
            agendaItems={agendaItems}
            attendees={attendees}
            discussionNotes={discussionNotes}
            onNotesChange={updateNote}
            nextMeetingDate={nextMeetingDate}
            onNextMeetingDateChange={setNextMeetingDate}
          />
        </div>

        <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <ActionItemsTable items={actionItems} onChange={setActionItems} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
        <button onClick={onBack} style={{
          border: '2px solid #E0E0E0', background: 'white', color: 'var(--color-grey)',
          padding: '11px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer',
        }}>
          ← Back to Stage 2
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={generateDocx}
            disabled={generating}
            style={{
              background: 'var(--color-dark-grey)', color: 'white', border: 'none',
              padding: '12px 24px', borderRadius: 8, fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer',
              opacity: generating ? 0.7 : 1, fontSize: 14,
            }}
          >
            {generating ? 'Generating...' : '📄 Generate Minutes (.docx)'}
          </button>
          <button
            onClick={circulateMinutes}
            disabled={sending || !docxData}
            style={{
              background: docxData ? 'var(--color-cyan)' : '#E0E0E0',
              color: 'white', border: 'none', padding: '12px 28px', borderRadius: 8,
              fontWeight: 700, cursor: (sending || !docxData) ? 'not-allowed' : 'pointer',
              opacity: sending ? 0.7 : 1, fontSize: 14,
              boxShadow: docxData ? '0 2px 8px rgba(0,192,243,0.3)' : 'none',
            }}
          >
            {sending ? 'Sending...' : '📧 Circulate Minutes'}
          </button>
        </div>
      </div>
    </div>
  );
}
