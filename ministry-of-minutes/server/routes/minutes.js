const express = require('express');
const router = express.Router();
const {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType,
  ShadingType, convertInchesToTwip,
} = require('docx');
const db = require('../db/db');

const CYAN_HEX = '00C0F3';
const DARK_GREY_HEX = '3D3D3D';

function heading(text, level = HeadingLevel.HEADING_2) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, color: CYAN_HEX, bold: true, font: 'Lato' })],
    spacing: { before: 240, after: 120 },
  });
}

function bodyParagraph(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Lato', color: DARK_GREY_HEX, size: 22 })],
    spacing: { after: 120 },
  });
}

function cell(text, isHeader = false) {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({
        text: String(text || ''),
        bold: isHeader,
        color: isHeader ? 'FFFFFF' : DARK_GREY_HEX,
        font: 'Lato',
        size: 20,
      })],
    })],
    shading: isHeader
      ? { type: ShadingType.SOLID, color: '00C0F3', fill: '00C0F3' }
      : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  });
}

router.post('/generate/:meetingId', async (req, res) => {
  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.meetingId);
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

  const attendees = db.prepare('SELECT * FROM attendees WHERE meeting_id = ? ORDER BY type, name').all(req.params.meetingId);
  const agendaItems = db.prepare('SELECT * FROM agenda_items WHERE meeting_id = ? ORDER BY item_number').all(req.params.meetingId);
  const actionItems = db.prepare('SELECT * FROM action_items WHERE meeting_id = ? ORDER BY id').all(req.params.meetingId);
  const { discussionNotes } = req.body;

  const dateStr = new Date(meeting.date_time).toLocaleString('en-SG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const fileDateStr = new Date(meeting.date_time).toISOString().split('T')[0].replace(/-/g, '');
  const safeTitle = meeting.title.replace(/[^a-zA-Z0-9]/g, '_');

  const attendeeRows = [
    new TableRow({ children: ['Name', 'Role', 'Ministry', 'Type'].map(h => cell(h, true)) }),
    ...attendees.map(a => new TableRow({
      children: [a.name, a.role || '', a.ministry || '', a.type].map(t => cell(t)),
    })),
  ];

  const actionRows = [
    new TableRow({ children: ['#', 'Action', 'Owner', 'Deadline', 'Status'].map(h => cell(h, true)) }),
    ...actionItems.map((a, i) => new TableRow({
      children: [String(i + 1), a.action, a.owner || 'TBC', a.deadline || 'TBC', a.status].map(t => cell(t)),
    })),
  ];

  const agendaSections = agendaItems.flatMap((item, idx) => {
    const notes = (discussionNotes && discussionNotes[item.id]) || '';
    return [
      new Paragraph({
        children: [new TextRun({ text: `${item.item_number}. ${item.title}`, bold: true, color: CYAN_HEX, font: 'Lato', size: 24 })],
        spacing: { before: 240, after: 80 },
      }),
      item.presenter ? bodyParagraph(`Presenter: ${item.presenter}`) : null,
      bodyParagraph(notes || '(No discussion notes recorded)'),
    ].filter(Boolean);
  });

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'MINUTES OF MEETING', bold: true, size: 36, font: 'Lato', color: DARK_GREY_HEX })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        heading('Meeting Details', HeadingLevel.HEADING_2),
        bodyParagraph(`Meeting: ${meeting.title}`),
        bodyParagraph(`Date & Time: ${dateStr}`),
        bodyParagraph(`Venue: ${meeting.venue || 'TBC'}`),
        new Paragraph({ text: '', spacing: { after: 200 } }),

        heading('Attendees', HeadingLevel.HEADING_2),
        new Table({
          rows: attendeeRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
        new Paragraph({ text: '', spacing: { after: 200 } }),

        heading('Agenda & Discussion', HeadingLevel.HEADING_2),
        ...agendaSections,
        new Paragraph({ text: '', spacing: { after: 200 } }),

        heading('Action Items', HeadingLevel.HEADING_2),
        actionItems.length > 0
          ? new Table({ rows: actionRows, width: { size: 100, type: WidthType.PERCENTAGE } })
          : bodyParagraph('No action items recorded.'),
        new Paragraph({ text: '', spacing: { after: 400 } }),

        new Paragraph({
          children: [new TextRun({
            text: `Prepared by ${meeting.secretariat_name || 'Secretariat'} | ${meeting.ministry || ''} | OFFICIAL`,
            size: 18, color: 'ADADAD', font: 'Lato', italics: true,
          })],
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'ADADAD' } },
          spacing: { before: 200 },
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const base64 = buffer.toString('base64');

  res.json({
    filename: `Minutes_${safeTitle}_${fileDateStr}.docx`,
    base64,
  });
});

module.exports = router;
