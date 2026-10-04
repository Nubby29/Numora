# Numora

Numora is a prototype for a digital communications platform that will eventually provide virtual phone numbers and messaging without requiring customers to own a physical SIM.

## Phase 1 — WhatsApp prototype

This first version provides:

- A polished communications dashboard
- Conversation UI
- Backend message API
- WhatsApp webhook endpoint placeholder
- Environment configuration for Meta WhatsApp Cloud API
- Provider-agnostic architecture for future SMS and voice

The current message composer is intentionally a local prototype. It does **not** pretend to send WhatsApp messages until real Meta credentials are configured.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Next integration

Configure the Meta WhatsApp Business Platform and add:

- WHATSAPP_ACCESS_TOKEN
- WHATSAPP_PHONE_NUMBER_ID
- WHATSAPP_BUSINESS_ACCOUNT_ID
- WHATSAPP_VERIFY_TOKEN

Then implement Meta webhook verification and the Cloud API send-message endpoint.

## Product direction

Numora should remain provider-agnostic:

```
Numora UI
  ↓
Communication Service
  ↓
Provider Adapter
  ├── WhatsApp
  ├── SMS
  └── Voice
```

This keeps the prototype from becoming locked to WhatsApp and allows the eventual virtual-number product to grow independently.
