---
title: Incoming Webhooks from Third-Party Services
category: integrations
tags: [webhook, security, hmac, signature-verification]
summary: Receive and securely verify webhooks sent to n8n from services like Stripe, Typeform, or GitHub.
---

Many services (Stripe, Typeform, GitHub, etc.) can send data to n8n the moment something happens on their end — a payment, a form submission, a code push. n8n receives these via the **Webhook node**, which gives you a unique URL to paste into that service's settings.

## How to connect it

1. Add a **Webhook** node to a new workflow. Set **HTTP Method** to whatever the service sends (usually `POST`).
2. Copy the **Test URL** (for trying it out) or the **Production URL** (shown once the workflow is Active) shown in the node.
3. Paste that URL into the third-party service's webhook settings (e.g. Stripe Dashboard > Developers > Webhooks, or GitHub repo > Settings > Webhooks).
4. Many services also give you a **Signing Secret** — save this in an n8n credential or a workflow variable, because you'll need it to verify authenticity (see below).

## Example use case: verify a GitHub webhook signature

1. In GitHub's webhook settings, set a **Secret** value and copy it.
2. In your n8n workflow, after the **Webhook** node, add a **Code** node to verify the `X-Hub-Signature-256` header matches an HMAC-SHA256 hash of the raw request body using your secret.

```javascript
const crypto = require('crypto');
const secret = 'your-github-webhook-secret';
const signature = $input.item.json.headers['x-hub-signature-256'];
const body = JSON.stringify($input.item.json.body);
const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');

if (signature !== expected) {
  throw new Error('Invalid webhook signature');
}
return $input.item;
```

3. Only continue the workflow (e.g. to an IF node) if verification passes.

For Stripe specifically, the signature arrives in the `Stripe-Signature` header and follows a slightly different format (`t=timestamp,v1=hash`) — Stripe's docs describe the exact string to hash.

**Common mistake:** Trusting webhook data without verifying its signature. Anyone who guesses or finds your webhook URL can send fake requests — always verify the signature (or at minimum check a shared secret token) before acting on incoming webhook data, especially for payment-related events.
