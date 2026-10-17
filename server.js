const express = require('express');
const app = express();

app.use(express.json());

// 1. WEBHOOK VERIFICATION (GET route required by Meta)
app.get('/api/webhook', (req, res) => {
  // Define the verify token directly inside the route so it's guaranteed to work
  const VERIFY_TOKEN = "hello_whatsapp_123";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log("Incoming verification request from Meta:");
  console.log("Mode:", mode);
  console.log("Token received:", token);

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED SUCCESSFULLY!');
      return res.status(200).send(challenge);
    } else {
      console.log('Verification failed: Tokens do not match.');
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

  return res.status(200).json({ status: 'success' });
});

app.get('/', (req, res) => {
  res.send('Webhook server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
