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

**Common mistake:** Using your normal Gmail password with the SMTP credential — Google blocks this. You must generate an **App Password** in your Google Account security settings (requires 2-Step Verification enabled) and use that instead.
