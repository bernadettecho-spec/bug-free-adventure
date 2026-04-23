const express = require('express');
const router = express.Router();
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const db = require('../db/db');
const TranscriptAdapter = require('../adapters/TranscriptAdapter');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/upload/:meetingId', upload.single('transcript'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filename = req.file.originalname;
  const format = filename.endsWith('.vtt') ? 'vtt' : 'txt';
  const rawContent = req.file.buffer.toString('utf8');
  const parsedContent = TranscriptAdapter.parse(rawContent, format);

  const existing = db.prepare('SELECT id FROM transcripts WHERE meeting_id = ?').get(req.params.meetingId);
  if (existing) {
    db.prepare('UPDATE transcripts SET filename=?, content=?, format=?, ai_summary=NULL WHERE meeting_id=?')
      .run(filename, parsedContent, format, req.params.meetingId);
  } else {
    db.prepare('INSERT INTO transcripts (meeting_id, filename, content, format) VALUES (?,?,?,?)')
      .run(req.params.meetingId, filename, parsedContent, format);
  }

  db.prepare("UPDATE meetings SET status='transcript_received', updated_at=datetime('now') WHERE id=? AND status='agenda_sent'")
    .run(req.params.meetingId);

  res.json({ success: true, format, length: parsedContent.length });
});

router.post('/summarise/:meetingId', async (req, res) => {
  const transcript = db.prepare('SELECT * FROM transcripts WHERE meeting_id = ?').get(req.params.meetingId);
  if (!transcript) return res.status(404).json({ error: 'No transcript found' });

  const prompt = `You are a government secretariat assistant. Analyse the following meeting transcript and extract structured information.

Return ONLY valid JSON in this exact format:
{
  "key_decisions": ["decision 1", "decision 2"],
  "action_items": [{"action": "...", "owner": "...", "deadline": "..."}],
  "follow_up_items": ["item 1", "item 2"]
}

TRANSCRIPT:
${transcript.content}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in AI response');

    const summary = JSON.parse(jsonMatch[0]);

    db.prepare('UPDATE transcripts SET ai_summary=? WHERE meeting_id=?')
      .run(JSON.stringify(summary), req.params.meetingId);

    res.json(summary);
  } catch (err) {
    console.error('AI summarisation error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:meetingId', (req, res) => {
  const transcript = db.prepare('SELECT * FROM transcripts WHERE meeting_id = ?').get(req.params.meetingId);
  if (!transcript) return res.status(404).json({ error: 'No transcript found' });

  const result = { ...transcript };
  if (result.ai_summary) {
    try { result.ai_summary = JSON.parse(result.ai_summary); } catch (_) {}
  }
  res.json(result);
});

// Genspark inbound webhook scaffold
// Expected payload: { meeting_id, transcript, speakers, format }
router.post('/webhook/genspark', (req, res) => {
  const { meeting_id, transcript, format = 'txt' } = req.body;
  if (!meeting_id || !transcript) {
    return res.status(400).json({ error: 'meeting_id and transcript are required' });
  }

  const meeting = db.prepare('SELECT id FROM meetings WHERE id = ?').get(meeting_id);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

  const parsedContent = TranscriptAdapter.handleGenspark({ transcript, format });

  const existing = db.prepare('SELECT id FROM transcripts WHERE meeting_id = ?').get(meeting_id);
  if (existing) {
    db.prepare('UPDATE transcripts SET content=?, format=?, filename=?, ai_summary=NULL WHERE meeting_id=?')
      .run(parsedContent, format, 'genspark_transcript.' + format, meeting_id);
  } else {
    db.prepare('INSERT INTO transcripts (meeting_id, filename, content, format) VALUES (?,?,?,?)')
      .run(meeting_id, 'genspark_transcript.' + format, parsedContent, format);
  }

  db.prepare("UPDATE meetings SET status='transcript_received', updated_at=datetime('now') WHERE id=? AND status='agenda_sent'")
    .run(meeting_id);

  res.json({ success: true });
});

module.exports = router;
