const express = require('express');
const app = express();

// This allows your app to read incoming JSON payloads
app.use(express.json());

// Your webhook endpoint route
app.post('/api/webhook', (req, res) => {
  const eventData = req.body;
  
  console.log('Webhook received successfully!');
  console.log(JSON.stringify(eventData, null, 2));

  // Always reply with a 200 OK immediately so the provider knows it arrived
  return res.status(200).json({ status: 'success' });
});

// A simple home route to check if server is live
app.get('/', (req, res) => {
  res.send('Webhook server is running!');
});

// Render provides a dynamic port via process.env.PORT, fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
