const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Proxy endpoint for API requests
app.post('/proxy/anthropic', async (req, res) => {
  const { apiKey, prompt } = req.body;

  if (!apiKey || !prompt) {
    return res.status(400).json({ error: 'Missing apiKey or prompt' });
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error making request to Anthropic API:', error);
    res.status(500).json({ error: 'Failed to connect to Anthropic API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
