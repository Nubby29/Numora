// Numora v0.1.0 — WhatsApp prototype backend
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const messages = [
  {
    id: "demo-1",
    direction: "inbound",
    contact: "Juan Santos",
    phone: "+63 917 123 4567",
    body: "Welcome to the Numora prototype.",
    timestamp: new Date().toISOString(),
    status: "delivered"
  }
];

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Numora",
    whatsappConfigured: Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
  });
});

app.get("/api/messages", (_req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const { phone, body } = req.body || {};

  if (!phone || !body?.trim()) {
    return res.status(400).json({ error: "phone and body are required" });
  }

  const message = {
    id: crypto.randomUUID(),
    direction: "outbound",
    contact: phone,
    phone,
    body: body.trim(),
    timestamp: new Date().toISOString(),
    status: "queued"
  };

  messages.push(message);

  // Real WhatsApp sending will be added after Meta credentials are configured.
  res.status(201).json(message);
});

app.post("/webhooks/whatsapp", (req, res) => {
  // Meta webhook verification/processing will be implemented in the next integration step.
  console.log("WhatsApp webhook received:", JSON.stringify(req.body));
  res.sendStatus(200);
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Numora running at http://localhost:${PORT}`);
});
