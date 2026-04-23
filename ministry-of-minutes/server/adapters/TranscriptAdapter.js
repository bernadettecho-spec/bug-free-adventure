class TranscriptAdapter {
  static parseVtt(content) {
    const lines = content.split('\n');
    const segments = [];
    let currentSpeaker = null;
    let currentText = [];

    for (const line of lines) {
      if (line.startsWith('WEBVTT') || line.trim() === '') continue;
      if (/^\d+$/.test(line.trim())) continue;
      if (/^\d{2}:\d{2}/.test(line)) continue;

      const speakerMatch = line.match(/^<v ([^>]+)>(.*)$/);
      if (speakerMatch) {
        if (currentSpeaker && currentText.length > 0) {
          segments.push({ speaker: currentSpeaker, text: currentText.join(' ') });
        }
        currentSpeaker = speakerMatch[1];
        currentText = [speakerMatch[2].trim()];
      } else if (currentSpeaker) {
        const cleaned = line.replace(/<[^>]+>/g, '').trim();
        if (cleaned) currentText.push(cleaned);
      }
    }

    if (currentSpeaker && currentText.length > 0) {
      segments.push({ speaker: currentSpeaker, text: currentText.join(' ') });
    }

    return segments.length > 0
      ? segments.map(s => `${s.speaker}: ${s.text}`).join('\n')
      : content;
  }

  static parseTxt(content) {
    return content;
  }

  static parse(content, format) {
    if (format === 'vtt') return TranscriptAdapter.parseVtt(content);
    return TranscriptAdapter.parseTxt(content);
  }

  // Scaffold: POST /api/webhook/genspark
  // Expected payload:
  // {
  //   "meeting_id": number,
  //   "transcript": string,        // full transcript text
  //   "speakers": [{ "name": string, "segments": [{ "start": number, "end": number, "text": string }] }],
  //   "format": "txt" | "vtt"
  // }
  static handleGenspark(payload) {
    const { transcript, format = 'txt' } = payload;
    return TranscriptAdapter.parse(transcript, format);
  }
}

module.exports = TranscriptAdapter;
