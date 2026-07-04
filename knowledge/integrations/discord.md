---
title: Discord
category: integrations
tags: [discord, webhook, messaging, bot]
summary: Send messages to a Discord channel from n8n using the Discord node or a webhook URL.
---

Discord is a chat platform popular with communities and teams. n8n can post messages to a Discord channel either with the dedicated **Discord node** (using a bot) or with a simple **Discord webhook URL** via the HTTP Request node.

## How to connect it

**Option A — Discord node (bot):**
1. Go to discord.com/developers/applications, create a **New Application**, then open the **Bot** tab and click **Reset Token** to get a bot token.
2. Invite the bot to your server using the OAuth2 URL generator (scopes: `bot`; permissions: `Send Messages`).
3. In n8n, create a credential of type **Discord Bot API**, paste the **Bot Token**, and save.

**Option B — Webhook (simplest, no bot needed):**
1. In Discord, go to the target channel's **Settings > Integrations > Webhooks**, and create a new webhook. Copy the **Webhook URL**.
2. In n8n, no credential is needed — just use an **HTTP Request** node pointed at that URL.

## Example use case: post a notification via webhook

1. Add a **Webhook** or **Schedule Trigger** node to start the workflow.
2. Add an **HTTP Request** node, set **Method** to `POST`, **URL** to your Discord webhook URL.
3. Set **Body Content Type** to `JSON` and provide the message body.

```json
{
  "content": "New order received: #{{ $json.orderId }} for ${{ $json.total }}"
}
```

If using the **Discord node** instead, set **Resource** to `Message`, **Operation** to `Send`, choose the **Guild** (server) and **Channel**, then set the **Content** field the same way.

```bash
curl -X POST "https://discord.com/api/webhooks/xxxx/yyyy" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message from n8n"}'
```

**Common mistake:** Forgetting that Discord webhook messages are limited to 2000 characters and will fail silently or error if the `content` field is empty — always include at least some text, even if you're mainly sending an embed.
