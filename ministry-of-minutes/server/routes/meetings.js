const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  const meetings = db.prepare(`
    SELECT m.*,
      (SELECT COUNT(*) FROM attendees WHERE meeting_id = m.id) AS attendee_count,
      (SELECT COUNT(*) FROM agenda_items WHERE meeting_id = m.id) AS agenda_count
    FROM meetings m
    ORDER BY m.created_at DESC
  `).all();
  res.json(meetings);
});

router.get('/:id', (req, res) => {
  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.id);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

  const attendees = db.prepare('SELECT * FROM attendees WHERE meeting_id = ? ORDER BY type, name').all(req.params.id);
  const agendaItems = db.prepare('SELECT * FROM agenda_items WHERE meeting_id = ? ORDER BY item_number').all(req.params.id);
  const actionItems = db.prepare('SELECT * FROM action_items WHERE meeting_id = ? ORDER BY id').all(req.params.id);
  const transcript = db.prepare('SELECT * FROM transcripts WHERE meeting_id = ? ORDER BY created_at DESC LIMIT 1').get(req.params.id);

  res.json({ ...meeting, attendees, agendaItems, actionItems, transcript: transcript || null });
});

router.post('/', (req, res) => {
  const { title, date_time, venue, aob_enabled, secretariat_name, ministry, agendaItems, attendees } = req.body;

  const result = db.prepare(`
    INSERT INTO meetings (title, date_time, venue, aob_enabled, secretariat_name, ministry)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, date_time, venue || '', aob_enabled ? 1 : 0, secretariat_name || '', ministry || '');

  const meetingId = result.lastInsertRowid;

  if (agendaItems && agendaItems.length > 0) {
    const insertItem = db.prepare(`
      INSERT INTO agenda_items (meeting_id, item_number, title, presenter, duration_minutes)
      VALUES (?, ?, ?, ?, ?)
    `);
    agendaItems.forEach((item, idx) => {
      insertItem.run(meetingId, item.item_number || idx + 1, item.title, item.presenter || '', item.duration_minutes || 0);
    });
  }

  if (attendees && attendees.length > 0) {
    const insertAttendee = db.prepare(`
      INSERT INTO attendees (meeting_id, name, email, role, ministry, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    attendees.forEach(a => {
      insertAttendee.run(meetingId, a.name, a.email, a.role || '', a.ministry || '', a.type || 'standing');
    });
  }

  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(meetingId);
  res.status(201).json(meeting);
});

router.put('/:id', (req, res) => {
  const { title, date_time, venue, aob_enabled, secretariat_name, ministry, agendaItems, attendees, status } = req.body;

  db.prepare(`
    UPDATE meetings SET title=?, date_time=?, venue=?, aob_enabled=?, secretariat_name=?, ministry=?, status=COALESCE(?,status), updated_at=datetime('now')
    WHERE id=?
  `).run(title, date_time, venue || '', aob_enabled ? 1 : 0, secretariat_name || '', ministry || '', status || null, req.params.id);

  if (agendaItems) {
    db.prepare('DELETE FROM agenda_items WHERE meeting_id = ?').run(req.params.id);
    const insertItem = db.prepare(`
      INSERT INTO agenda_items (meeting_id, item_number, title, presenter, duration_minutes)
      VALUES (?, ?, ?, ?, ?)
    `);
    agendaItems.forEach((item, idx) => {
      insertItem.run(req.params.id, item.item_number || idx + 1, item.title, item.presenter || '', item.duration_minutes || 0);
    });
  }

  if (attendees) {
    db.prepare('DELETE FROM attendees WHERE meeting_id = ?').run(req.params.id);
    const insertAttendee = db.prepare(`
      INSERT INTO attendees (meeting_id, name, email, role, ministry, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    attendees.forEach(a => {
      insertAttendee.run(req.params.id, a.name, a.email, a.role || '', a.ministry || '', a.type || 'standing');
    });
  }

  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.id);
  res.json(meeting);
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE meetings SET status=?, updated_at=datetime('now') WHERE id=?").run(status, req.params.id);
  res.json({ success: true });
});

router.put('/:id/action-items', (req, res) => {
  const { actionItems } = req.body;
  db.prepare('DELETE FROM action_items WHERE meeting_id = ?').run(req.params.id);
  const insert = db.prepare('INSERT INTO action_items (meeting_id, action, owner, deadline, status) VALUES (?,?,?,?,?)');
  actionItems.forEach(a => insert.run(req.params.id, a.action, a.owner || '', a.deadline || '', a.status || 'pending'));
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM meetings WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
