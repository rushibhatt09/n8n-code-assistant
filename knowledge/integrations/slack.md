---
title: Slack
category: integrations
tags: [slack, messaging, notifications, oauth]
summary: Send and manage Slack messages from n8n using the Slack node and OAuth2 login.
---

Slack is a team chat app. In n8n, the **Slack node** lets your workflow post messages, upload files, or update channels automatically — for example, sending an alert whenever something happens in another system.

## How to connect it

1. In n8n, create a new credential of type **Slack API**.
2. Choose **OAuth2** as the authentication method (recommended) — this opens a Slack login popup where you approve the app for your workspace.
3. Alternatively, choose **Access Token** if you already have a Slack Bot User OAuth Token (starts with `xoxb-`) from a Slack app you created at api.slack.com/apps.
4. If using your own Slack app, make sure it has the `chat:write` scope (and `channels:read` if you want to pick channels by name).
5. Save the credential — n8n will confirm the connection is valid.

## Example use case: post a message when a form is submitted

1. Add a **Form Trigger** (or Webhook) node as the workflow's starting point.
2. Add a **Slack** node, set **Resource** to `Message`, **Operation** to `Post`.
3. Select the credential you created, choose the **Channel** (e.g. `#sales-leads`), and set the **Text** field using an expression to pull in form data.
4. Test the workflow — the message should appear in Slack within seconds.

```
New lead: {{ $json["Full Name"] }} ({{ $json["Email"] }})
```

You can also send raw JSON via the HTTP Request node if you need more control:

```json
{
  "channel": "#sales-leads",
  "text": "New lead: Jane Doe (jane@example.com)"
}
```

**Common mistake:** Forgetting to invite the Slack bot into the channel first. If the bot isn't a member of the channel, message posts will fail with a `not_in_channel` error — invite it with `/invite @YourBotName` in Slack before running the workflow.
