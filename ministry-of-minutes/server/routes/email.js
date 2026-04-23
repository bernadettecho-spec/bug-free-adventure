const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { sendToOpusTrigger, sendToAttendees } = require('../services/emailService');

function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

function buildAgendaText(meeting, agendaItems) {
  const lines = [
    `MEETING AGENDA`,
    `==============`,
    `Meeting: ${meeting.title}`,
    `Date & Time: ${new Date(meeting.date_time).toLocaleString('en-SG')}`,
    `Venue: ${meeting.venue || 'TBC'}`,
    ``,
    `AGENDA ITEMS`,
    `------------`,
  ];
  agendaItems.forEach(item => {
    lines.push(`${item.item_number}. ${item.title}`);
    if (item.presenter) lines.push(`   Presenter: ${item.presenter}`);
    if (item.duration_minutes) lines.push(`   Duration: ${item.duration_minutes} minutes`);
    lines.push('');
  });
  if (meeting.aob_enabled) lines.push('AOB — Any Other Business');
  return lines.join('\n');
}

function buildAgendaHtml(meeting, agendaItems, attendees) {
  const dateStr = new Date(meeting.date_time).toLocaleString('en-SG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const itemsHtml = agendaItems.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:bold;color:#00C0F3;width:40px">${item.item_number}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">
        <strong>${item.title}</strong>
        ${item.presenter ? `<br><span style="color:#ADADAD;font-size:13px">Presenter: ${item.presenter}</span>` : ''}
        ${item.duration_minutes ? `<span style="color:#ADADAD;font-size:13px"> | ${item.duration_minutes} min</span>` : ''}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;color:#3D3D3D;margin:0;padding:0;background:#F7F7F7}</style></head>
    <body>
      <div style="max-width:680px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:linear-gradient(135deg,#00C0F3,#BA2FA2);padding:28px 32px">
          <div style="color:white;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Singapore Government</div>
          <h1 style="color:white;margin:0;font-size:22px">${meeting.title}</h1>
          <div style="color:rgba(255,255,255,0.85);margin-top:8px;font-size:14px">${dateStr}</div>
          ${meeting.venue ? `<div style="color:rgba(255,255,255,0.85);font-size:14px">📍 ${meeting.venue}</div>` : ''}
        </div>
        <div style="padding:32px">
          <h2 style="color:#3D3D3D;font-size:16px;border-bottom:2px solid #00C0F3;padding-bottom:8px">Meeting Agenda</h2>
          <table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
          ${meeting.aob_enabled ? '<p style="margin-top:16px"><strong>AOB</strong> — Any Other Business</p>' : ''}
          <div style="margin-top:32px;padding:16px;background:#F7F7F7;border-radius:4px;font-size:13px;color:#ADADAD">
            This is an official government communication. Please do not reply to this email.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

router.post('/agenda/:meetingId', async (req, res) => {
  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.meetingId);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

  const agendaItems = db.prepare('SELECT * FROM agenda_items WHERE meeting_id = ? ORDER BY item_number').all(req.params.meetingId);
  const attendees = db.prepare('SELECT * FROM attendees WHERE meeting_id = ?').all(req.params.meetingId);

  const agendaText = buildAgendaText(meeting, agendaItems);
  const agendaHtml = buildAgendaHtml(meeting, agendaItems, attendees);
  const dateStr = formatDate(meeting.date_time);
  const safeTitle = meeting.title.replace(/[^a-zA-Z0-9]/g, '_');

  const htmlAttachment = {
    filename: `agenda_${safeTitle}_${dateStr}.html`,
    content: agendaHtml,
    contentType: 'text/html',
  };

  const opusAddress = process.env.OPUS_AGENDA_TRIGGER_EMAIL;
  if (!opusAddress) {
    return res.status(500).json({ error: 'OPUS_AGENDA_TRIGGER_EMAIL not configured' });
  }

  const recipientEmails = attendees.map(a => a.email);
  if (recipientEmails.length === 0) {
    return res.status(400).json({ error: 'No attendees to send to' });
  }

  try {
    await sendToOpusTrigger(
      opusAddress,
      `[AGENDA] ${meeting.title} — ${dateStr}`,
      agendaText,
      [htmlAttachment]
    );

    await sendToAttendees(
      recipientEmails,
      `Agenda: ${meeting.title} — ${dateStr}`,
      agendaHtml,
      [htmlAttachment]
    );

    db.prepare("UPDATE meetings SET status='agenda_sent', updated_at=datetime('now') WHERE id=?").run(req.params.meetingId);

    res.json({ success: true, recipientCount: recipientEmails.length });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/minutes/:meetingId', async (req, res) => {
  const { docxBase64, actionItemsSummary } = req.body;
  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.meetingId);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

  const attendees = db.prepare('SELECT * FROM attendees WHERE meeting_id = ?').all(req.params.meetingId);
  const actionItems = db.prepare('SELECT * FROM action_items WHERE meeting_id = ? ORDER BY id').all(req.params.meetingId);

  const dateStr = formatDate(meeting.date_time);
  const safeTitle = meeting.title.replace(/[^a-zA-Z0-9]/g, '_');

  const summaryText = actionItemsSummary || actionItems.map((a, i) =>
    `${i + 1}. ${a.action} | Owner: ${a.owner || 'TBC'} | Deadline: ${a.deadline || 'TBC'}`
  ).join('\n');

  const actionTableHtml = `
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      <thead>
        <tr style="background:linear-gradient(135deg,#00C0F3,#BA2FA2)">
          <th style="color:white;padding:10px 12px;text-align:left">#</th>
          <th style="color:white;padding:10px 12px;text-align:left">Action</th>
          <th style="color:white;padding:10px 12px;text-align:left">Owner</th>
          <th style="color:white;padding:10px 12px;text-align:left">Deadline</th>
          <th style="color:white;padding:10px 12px;text-align:left">Status</th>
        </tr>
      </thead>
      <tbody>
        ${actionItems.map((a, i) => `
          <tr style="background:${i % 2 === 0 ? '#fff' : '#F7F7F7'}">
            <td style="padding:8px 12px;border-bottom:1px solid #eee">${i + 1}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee">${a.action}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee">${a.owner || 'TBC'}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee">${a.deadline || 'TBC'}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee">${a.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const minutesHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;color:#3D3D3D;margin:0;padding:0;background:#F7F7F7}</style></head>
    <body>
      <div style="max-width:680px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:linear-gradient(135deg,#00C0F3,#BA2FA2);padding:28px 32px">
          <div style="color:white;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Singapore Government — Minutes</div>
          <h1 style="color:white;margin:0;font-size:22px">${meeting.title}</h1>
          <div style="color:rgba(255,255,255,0.85);margin-top:8px;font-size:14px">${new Date(meeting.date_time).toLocaleString('en-SG')}</div>
        </div>
        <div style="padding:32px">
          <h2 style="color:#3D3D3D;font-size:16px;border-bottom:2px solid #00C0F3;padding-bottom:8px">Action Items</h2>
          ${actionTableHtml}
          <div style="margin-top:32px;padding:16px;background:#F7F7F7;border-radius:4px;font-size:13px;color:#ADADAD">
            Minutes prepared by ${meeting.secretariat_name || 'Secretariat'} | ${meeting.ministry || ''} | OFFICIAL<br>
            Please see attached .docx for full meeting minutes.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const opusAddress = process.env.OPUS_MINUTES_TRIGGER_EMAIL;
  if (!opusAddress) {
    return res.status(500).json({ error: 'OPUS_MINUTES_TRIGGER_EMAIL not configured' });
  }

  const recipientEmails = attendees.map(a => a.email);
  if (recipientEmails.length === 0) {
    return res.status(400).json({ error: 'No attendees to send to' });
  }

  const attachments = [];
  if (docxBase64) {
    attachments.push({
      filename: `Minutes_${safeTitle}_${dateStr.replace(/-/g, '')}.docx`,
      content: Buffer.from(docxBase64, 'base64'),
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }

  try {
    await sendToOpusTrigger(
      opusAddress,
      `[MINUTES] ${meeting.title} — ${dateStr}`,
      summaryText,
      attachments
    );

    await sendToAttendees(
      recipientEmails,
      `Minutes & Action Points: ${meeting.title} — ${dateStr}`,
      minutesHtml,
      attachments
    );

    db.prepare("UPDATE meetings SET status='minutes_sent', updated_at=datetime('now') WHERE id=?").run(req.params.meetingId);

    res.json({ success: true, recipientCount: recipientEmails.length });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
