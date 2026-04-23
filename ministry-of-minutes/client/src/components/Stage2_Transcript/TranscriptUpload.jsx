import React, { useRef, useState } from 'react';

export default function TranscriptUpload({ onUpload, loading }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.vtt')) {
      alert('Please upload a .txt or .vtt file');
      return;
    }
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  }

  if (loading) {
    return <div style={{ textAlign: 'center', color: 'var(--color-grey)', padding: 40 }}>Loading...</div>;
  }

  return (
    <div>
      <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16 }}>Upload Transcript</h3>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? '#00C0F3' : '#E0E0E0'}`,
          borderRadius: 8, padding: '40px 24px', textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: dragging ? '#E6F9FF' : '#FAFAFA',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
        <div style={{ fontWeight: 700, color: 'var(--color-dark-grey)', marginBottom: 4 }}>
          {uploading ? 'Uploading...' : 'Drop transcript here or click to browse'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-grey)' }}>
          Supports .txt and .vtt (WebVTT with speaker labels)
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.vtt"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--color-grey)' }}>
        <strong>.vtt files</strong> preserve speaker labels from video conferencing tools (Zoom, Teams).<br />
        <strong>.txt files</strong> can be pasted plain transcript content.
      </div>
    </div>
  );
}
