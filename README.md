# Numora

Numora is a prototype for a digital communications platform that will eventually provide virtual phone numbers and messaging without requiring customers to own a physical SIM.

## Phase 2 — SIM gateway prototype

This phase adds a provider-neutral SIM gateway layer for testing SMS routing before connecting real GSM hardware or a wholesale virtual-number provider.

It provides:

- SIM/device inventory
- SMS outbound routing through a gateway adapter
- Simulated inbound SMS
- Device status and signal display
- A communications UI that can select SMS/SIM or WhatsApp
- REST endpoints that a future GSM modem adapter can replace without changing the dashboard

The current SIM gateway is **simulation only**. It does not access a physical SIM card, modem, phone, or carrier network.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Test the SIM gateway

1. Select a test SIM in the left sidebar.
2. Choose **SMS / SIM**.
3. Enter a destination number.
4. Send a message. It will be recorded as a gateway event.
5. Click **Simulate inbound SMS** to test the inbound path.

API endpoints:

- `GET /api/sim-gateway/devices`
- `GET /api/sim-gateway/events`
- `POST /api/sim-gateway/inbound`

The inbound endpoint is deliberately a development-only simulation endpoint. Authentication and carrier-facing webhook security will be added before production use.

## Architecture

```
Numora UI
   ↓
Communication Service
   ├── WhatsApp adapter
   └── SIM gateway adapter
          ↓
      Prototype mode
          ↓
   Future GSM modem adapter
          ↓
      Physical SIM
          ↓
     Mobile network
```

The same abstraction can later support:

```
Communication Service
   ├── WhatsApp
   ├── SMS / GSM gateway
   ├── Wholesale virtual numbers
   └── Voice
```

The goal is to validate the Numora product experience first, then replace the prototype transport with legitimate carrier/communications infrastructure.

## Important

Do not commit real credentials, SIM PINs, API tokens, or customer message data to GitHub.
