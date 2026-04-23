import React, { useState, useEffect } from 'react';
import TranscriptUpload from './TranscriptUpload.jsx';
import TranscriptViewer from './TranscriptViewer.jsx';
import AISummary from './AISummary.jsx';

export default function Stage2Container({ meeting, onBack, onNext, showToast }) {
  const [transcript, setTranscript] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [summarising, setSummarising] = useState(false);
  const [mode, setMode] = useState('upload');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!meeting?.id) return;
    fetch(`/api/transcript/${meeting.id}`)
      .then(async r => {
        if (r.ok) {
          const data = await r.json();
          setTranscript(data);
          if (data.ai_summary) setAiSummary(data.ai_summary);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [meeting?.id]);

  async function handleUpload(file) {
    const formData = new FormData();
    formData.append('transcript', file);
    const res = await fetch(`/api/transcript/upload/${meeting.id}`, {
      method: 'POST', body: formData,
    });
    if (!res.ok) { showToast('Upload failed', 'error'); return; }
    const data = await fetch(`/api/transcript/${meeting.id}`).then(r => r.json());
    setTranscript(data);
    showToast('Transcript uploaded successfully');
  }

  async function summarise() {
    setSummarising(true);
    const res = await fetch(`/api/transcript/summarise/${meeting.id}`, { method: 'POST' });
    const data = await res.json();
    setSummarising(false);
    if (!res.ok) { showToast(data.error || 'Summarisation failed', 'error'); return; }
    setAiSummary(data);
    showToast('AI summary generated');
  }

  function proceedToStage3() {
    onNext({ ...meeting, aiSummary });
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--color-grey)',
          cursor: 'pointer', fontSize: 22, padding: 0,
        }}>←</button>
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: 'var(--color-dark-grey)' }}>
            Stage 2: Transcript Review
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--color-grey)', fontSize: 14 }}>
            Upload and review the meeting transcript, then generate an AI summary
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E0E0E0', marginBottom: 24 }}>
        {[['upload', 'Upload Transcript'], ['webhook', 'Genspark Webhook']].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{
            padding: '10px 20px', border: 'none', background: 'none',
            fontWeight: mode === id ? 700 : 400,
            color: mode === id ? 'var(--color-cyan)' : 'var(--color-grey)',
            borderBottom: mode === id ? '2px solid var(--color-cyan)' : '2px solid transparent',
            marginBottom: -2, cursor: 'pointer', fontSize: 14,
          }}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'webhook' ? (
        <div style={{
          background: 'white', borderRadius: 10, padding: 32,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🔗</div>
          <h3 style={{ color: 'var(--color-dark-grey)', marginBottom: 8 }}>Genspark Webhook</h3>
          <p style={{ color: 'var(--color-grey)', marginBottom: 16 }}>
            Configure Genspark to send transcripts automatically via webhook.
          </p>
          <div style={{
            background: '#F7F7F7', borderRadius: 8, padding: 16,
            fontFamily: 'monospace', fontSize: 13, textAlign: 'left',
            border: '1px solid #E0E0E0',
          }}>
            <div style={{ color: 'var(--color-grey)', marginBottom: 8 }}>Webhook endpoint:</div>
            <div style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>POST /api/webhook/genspark</div>
            <div style={{ color: 'var(--color-grey)', marginTop: 12, marginBottom: 4 }}>Payload:</div>
            <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify({
              meeting_id: meeting?.id,
              transcript: "string — full transcript text",
              speakers: [{ name: "string", segments: [] }],
              format: "txt | vtt"
            }, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            {!transcript ? (
              <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <TranscriptUpload onUpload={handleUpload} loading={loading} />
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Transcript</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                      background: '#E6F9FF', color: '#00C0F3',
                    }}>
                      .{transcript.format}
                    </span>
                    <button onClick={() => setTranscript(null)} style={{
                      background: 'none', border: '1px solid #E0E0E0', color: 'var(--color-grey)',
                      padding: '3px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                    }}>
                      Replace
                    </button>
                  </div>
                </div>
                <TranscriptViewer content={transcript.content} />
                <button
                  onClick={summarise}
                  disabled={summarising}
                  style={{
                    marginTop: 16, width: '100%', padding: '12px',
                    background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)',
                    color: 'white', border: 'none', borderRadius: 8,
                    fontWeight: 700, fontSize: 14, cursor: summarising ? 'not-allowed' : 'pointer',
                    opacity: summarising ? 0.7 : 1,
                  }}
                >
                  {summarising ? '⏳ Summarising with Claude AI...' : '✨ Summarise with AI'}
                </button>
              </div>
            )}
          </div>

          <div>
            <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <AISummary summary={aiSummary} onChange={setAiSummary} />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={onBack} style={{
          border: '2px solid #E0E0E0', background: 'white', color: 'var(--color-grey)',
          padding: '11px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14,
        }}>
          ← Back to Stage 1
        </button>
        <button onClick={proceedToStage3} style={{
          background: 'linear-gradient(135deg, #00C0F3, #BA2FA2)', color: 'white',
          border: 'none', padding: '12px 28px', borderRadius: 8,
          fontWeight: 700, cursor: 'pointer', fontSize: 14,
        }}>
          Next: Minutes Distribution →
        </button>
      </div>
    </div>
  );
}
