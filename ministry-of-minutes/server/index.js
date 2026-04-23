require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/email', require('./routes/email'));
app.use('/api/transcript', require('./routes/transcript'));
app.use('/api/minutes', require('./routes/minutes'));

// Genspark webhook (also mounted here for clarity)
app.post('/api/webhook/genspark', (req, res) => {
  req.url = '/webhook/genspark';
  require('./routes/transcript')(req, res);
});

const publicDir = path.join(__dirname, 'public');
const fs = require('fs');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ministry of Minutes server running on port ${PORT}`);
});
