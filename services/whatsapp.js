// Numora v0.1.0 — WhatsApp Cloud API adapter
const API_VERSION = "v23.0";

function getConfig() {
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID
  };
}

async function sendTextMessage({ to, body }) {
  const { accessToken, phoneNumberId } = getConfig();

  if (!accessToken || !phoneNumberId) {
    throw new Error("WhatsApp Cloud API credentials are not configured.");
  }

  const response = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: false, body }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.error?.message || "WhatsApp API request failed.");
    error.details = data;
    throw error;
  }

  return data;
}

module.exports = { sendTextMessage };
