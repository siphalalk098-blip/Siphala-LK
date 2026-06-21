const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object === 'whatsapp_business_account') {
    const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (msg && msg.type === 'text') {
      const from = msg.from;
      const text = msg.text.body.toLowerCase();
      let replyText = `*Kosgoda Beach Cafe 🏖️*\nWelcome! මොකක්ද ඕන?\n\n1️⃣ Menu බලන්න\n2️⃣ Room Booking\n3️⃣ Location\n4️⃣ Staff කෙනෙක් එක්ක කතා කරන්න\n\nNumber එක Type කරන්න 👇`;

      if (text === '1') replyText = `*අපේ Menu එක 🍽️*\n\n*Seafood*\n- Prawns Curry - Rs. 1800\n- Fish & Chips - Rs. 2200\n*Drinks*\n- King Coconut - Rs. 300\n- Beer - Rs. 800\n\nOrder කරන්න 4 ඔබන්න.`;
      else if (text === '2') replyText = `*Room Booking 🛏️*\n\nSea View Room - $80/Night\nGarden Room - $50/Night\n\nBooking වලට +94 714749893 ට කතා කරන්න.`;
      else if (text === '3') replyText = `*Location 📍*\nKosgoda Beach Cafe\nGalle Road, Kosgoda`;
      else if (text === '4') replyText = `හරි, අපේ කෙනෙක් ඉක්මනට ඔයාව Contact කරයි. කෝල් එකක් දාන්න: +94 714749893`;

      await axios.post(`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`, {
        messaging_product: 'whatsapp', to: from, text: { body: replyText }
      }, { headers: { Authorization: `Bearer ${TOKEN}` } });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Bot Live!'));
