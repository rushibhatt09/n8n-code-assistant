---
title: Telegram
category: integrations
tags: [telegram, bot, messaging, chat]
summary: Send and receive Telegram messages from n8n using a Telegram Bot token.
---

Telegram is a messaging app, and n8n's **Telegram node** can send messages through a bot, while the **Telegram Trigger** node listens for incoming messages sent to that bot — useful for chat-based notifications or simple bots.

## How to connect it

1. In Telegram, message **@BotFather** and send `/newbot`, following the prompts to name your bot.
2. BotFather gives you an **API token** (looks like `123456789:ABCdefGhIJKlmNoPQRstuVwxYZ`).
3. In n8n, create a new credential of type **Telegram API**.
4. Paste the token into the **Access Token** field and save.

## Example use case: send an alert message to yourself or a group

1. Start a chat with your bot (search its username in Telegram) or add it to a group, and send it any message first — this lets you retrieve the **Chat ID**.
2. To find the Chat ID, temporarily add a **Telegram Trigger** node, activate the workflow, send a message to the bot, then check the execution data for `chat.id`.
3. Add a **Telegram** node, set **Resource** to `Message`, **Operation** to `Send Message`.
4. Set **Chat ID** to the ID you found, and **Text** to your message content.

```
Alert: Server CPU usage is at {{ $json.cpuPercent }}%
```

To build a bot that responds to incoming messages, use the **Telegram Trigger** node as your workflow's starting point — it fires every time someone messages your bot — and set **Updates** to `message`.

```json
{
  "chat_id": "123456789",
  "text": "Order #{{ $json.orderId }} has shipped!"
}
```

## Quick copy-paste version (no credential setup)

Telegram's bot token is actually part of the URL itself, not a header, so you can skip n8n's Credential system entirely and hardcode it straight into an **HTTP Request** node — simplest for personal/local use, but anyone who opens this workflow file can read the token in plain text, so don't share or upload it while the real token is still in there.

```json
{
  "method": "POST",
  "url": "https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/sendMessage",
  "authentication": "none",
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": {
    "chat_id": "123456789",
    "text": "Order #{{ $json.orderId }} has shipped!"
  }
}
```

Test it from a terminal first to confirm the token and chat ID work before building the node:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "123456789", "text": "Order #12345 has shipped!"}'
```

**Common mistake:** Using the bot's own username or ID instead of the **Chat ID** of the person or group you're messaging. The Chat ID is unique per conversation and must be captured from an actual incoming message — it's not visible anywhere in Telegram's UI directly.
