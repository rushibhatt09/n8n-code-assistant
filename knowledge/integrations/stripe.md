---
title: Stripe
category: integrations
tags: [stripe, payments, webhook, api-key]
summary: Listen for Stripe payment events and create charges or customers from n8n.
---

Stripe handles online payments. In n8n, the **Stripe node** can create charges, customers, or subscriptions, while the **Stripe Trigger** node listens for events like successful payments or failed charges in real time.

## How to connect it

1. In your Stripe Dashboard, go to **Developers > API keys** and copy your **Secret Key** (starts with `sk_live_` or `sk_test_` for testing).
2. In n8n, create a new credential of type **Stripe API**.
3. Paste the key into the **Secret Key** field and save.

## Example use case: notify your team when a payment succeeds

1. Add a **Stripe Trigger** node as the starting point of your workflow.
2. Select your Stripe credential, and set **Events** to `charge.succeeded` (or `payment_intent.succeeded`).
3. Activate the workflow — n8n automatically registers a webhook with Stripe using the trigger's unique URL.
4. Add a **Slack** or **Email** node afterward to notify your team, using expression data from the event.

```
Payment received: ${{ $json.data.object.amount / 100 }} from {{ $json.data.object.receipt_email }}
```

To create a charge manually (less common now that Payment Intents are standard), use the **Stripe node** with **Resource** `Charge`, **Operation** `Create`:

```json
{
  "amount": 2000,
  "currency": "usd",
  "customer": "cus_ABC123",
  "description": "Order #1042"
}
```

Test with curl:

```bash
curl https://api.stripe.com/v1/charges \
  -u sk_test_yourkey: \
  -d amount=2000 -d currency=usd -d customer=cus_ABC123
```

## Quick copy-paste version (no credential setup)

This approach puts your Stripe Secret Key directly in the HTTP Request node instead of using n8n's Credential system — simplest for personal or local use, but anyone who can open this workflow can see the key, so don't share the workflow file with the key still in it.

```json
{
  "method": "POST",
  "url": "https://api.stripe.com/v1/customers",
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": {
    "Authorization": "Bearer <YOUR_STRIPE_SECRET_KEY>"
  },
  "sendBody": true,
  "contentType": "form-urlencoded",
  "bodyParameters": {
    "email": "customer@example.com",
    "name": "Jane Doe"
  }
}
```

Test it directly with curl before building the node:

```bash
curl https://api.stripe.com/v1/customers \
  -u <YOUR_STRIPE_SECRET_KEY>: \
  -d email=customer@example.com \
  -d name="Jane Doe"
```

**Common mistake:** Testing with a live Secret Key instead of a test key (`sk_test_...`), which creates real charges. Always develop and test workflows using Stripe's Test Mode keys and test card numbers before switching to live keys.
