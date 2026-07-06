---
title: Gmail & Email (SMTP)
category: integrations
tags: [gmail, email, smtp, oauth]
summary: Send and read emails from n8n using the Gmail node or a generic SMTP Send Email node.
---

n8n can send or read emails two ways: the **Gmail node** (connects directly to a Google account) or the **Send Email** node (works with any mail provider via SMTP, like Outlook or a hosting provider's mail server).

## How to connect it

**Option A — Gmail node:**
1. Create a new credential of type **Gmail OAuth2 API**.
2. Click **Sign in with Google** and approve access — n8n needs a Google Cloud OAuth Client ID/Secret configured first (your n8n admin usually sets this up once).
3. Save the credential.

**Option B — Send Email (SMTP) node:**
1. Create a new credential of type **SMTP**.
2. Fill in **User** (your email address), **Password** (or app-specific password), **Host** (e.g. `smtp.gmail.com`), **Port** (`465` for SSL or `587` for TLS), and toggle **SSL/TLS**.
3. Save and test the connection.

## Example use case: email a daily summary report

1. Add a **Schedule Trigger** node set to run once a day.
2. Add whatever nodes gather your data (e.g. Google Sheets read).
3. Add a **Gmail** node (or **Send Email** node), set **To Email**, **Subject**, and **Message**/**Text** fields.
4. Use expressions to insert dynamic content into the subject or body.

```
Subject: Daily Sales Summary - {{ $today.format('yyyy-MM-dd') }}
Message: Total orders today: {{ $json["orderCount"] }}
```

Testing via curl against your own SMTP relay (if applicable):

```bash
curl --url "smtp://smtp.gmail.com:587" --ssl-reqd \
  --mail-from "you@gmail.com" --mail-rcpt "recipient@example.com" \
  --user "you@gmail.com:app-password" -T email.txt
```

## Quick copy-paste version (no credential setup)

**Gmail is honestly not a good fit for this "just paste a key" approach.** Gmail's real REST API (`gmail.googleapis.com`) requires a full OAuth2 flow (Client ID, Client Secret, and a refresh token you have to generate through Google's consent screen) — there's no simple static API key you can drop into a header like with Slack or Notion. Any code claiming otherwise would be fake, so here are two honest alternatives instead:

**Option 1 — Simplest copy-paste option: Send Email (SMTP) node with your Gmail App Password.** This isn't an HTTP Request/API call, but it's the closest thing to a "one field to replace" setup and it does bypass n8n's separate Credential UI screen since you type the password straight into the node's parameters:

```json
{
  "fromEmail": "you@gmail.com",
  "toEmail": "recipient@example.com",
  "subject": "Daily Sales Summary",
  "text": "Total orders today: {{ $json.orderCount }}",
  "options": {
    "smtpHost": "smtp.gmail.com",
    "smtpPort": 587,
    "smtpUser": "you@gmail.com",
    "smtpPassword": "<YOUR_GMAIL_APP_PASSWORD>",
    "smtpSecure": false
  }
}
```

You still need a Google **App Password** (Google Account → Security → 2-Step Verification → App Passwords) — your normal Gmail password will not work here.

**Option 2 — If you want a true copy-paste static API key, switch providers.** Transactional email APIs like Resend or SendGrid issue a real static API key with no OAuth dance. Example with Resend:

```json
{
  "method": "POST",
  "url": "https://api.resend.com/emails",
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "Authorization", "value": "Bearer <YOUR_API_KEY>" },
      { "name": "Content-Type", "value": "application/json" }
    ]
  },
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": {
    "from": "you@yourdomain.com",
    "to": "recipient@example.com",
    "subject": "Daily Sales Summary",
    "text": "Total orders today: {{ $json.orderCount }}"
  }
}
```

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"from": "you@yourdomain.com", "to": "recipient@example.com", "subject": "Daily Sales Summary", "text": "Total orders today: 42"}'
```

**Common mistake:** Using your normal Gmail password with the SMTP credential — Google blocks this. You must generate an **App Password** in your Google Account security settings (requires 2-Step Verification enabled) and use that instead.
