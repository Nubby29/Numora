// Numora v0.1.0 — WhatsApp prototype backend
require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const path = require("path");
const { sendTextMessage } = require("./services/whatsapp");

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
    whatsappConfigured: Boolean(
      process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID
    )
  });
});

app.get("/api/messages", (_req, res) => {
  res.json(messages);
});

app.post("/api/messages", async (req, res) => {
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

  try {
    if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      const result = await sendTextMessage({ to: phone, body: body.trim() });
      message.status = "sent";
      message.providerId = result?.messages?.[0]?.id || null;
    }

    messages.push(message);
    res.status(201).json(message);
  } catch (error) {
    console.error("WhatsApp send failed:", error);
    res.status(502).json({
      error: "WhatsApp message could not be sent.",
      details: error.message
    });
  }
});

app.post("/webhooks/whatsapp", (req, res) => {
  console.log("WhatsApp webhook received:", JSON.stringify(req.body));
  res.sendStatus(200);
});

// Express 5-compatible SPA fallback.
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Numora running at http://localhost:${PORT}`);
});
