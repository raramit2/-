const express = require('express');
const app = express();

app.use(express.json());

// 1. WEBHOOK VERIFICATION (GET route required by Meta)
app.get('/api/webhook', (req, res) => {
  const VERIFY_TOKEN = "my_custom_secret_token_123"; // Change this to any secret password you want

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      // Respond with the challenge token from the request
      return res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
});

// 2. RECEIVING MESSAGES (POST route)
app.post('/api/webhook', (req, res) => {
  const eventData = req.body;
  
  console.log('--- NEW WHATSAPP WEBHOOK EVENT ---');
  console.log(JSON.stringify(eventData, null, 2));

  // Acknowledge receipt to Meta immediately with a 200 OK
  return res.status(200).json({ status: 'success' });
});

app.get('/', (req, res) => {
  res.send('Webhook server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
