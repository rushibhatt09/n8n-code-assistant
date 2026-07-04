---
title: Webhook Node
category: nodes
tags: [webhook, trigger, http, api]
summary: Receive incoming data from other apps by giving them a URL your workflow listens to.
---

The Webhook node gives your workflow its own web address (URL). When another app or website sends a request to that URL, the workflow starts automatically. Use it to receive form submissions, alerts from other tools, or data pushed from any system that can call a URL.

## How to set it up

1. Add the **Webhook** node — it must be the first node (the trigger) in your workflow.
2. Set **HTTP Method** to match what the sender will use (usually `POST`, sometimes `GET`).
3. Set **Path** to a unique word, e.g. `new-order`. This becomes part of your URL.
4. Copy the **Test URL** while building — this only works while you have the workflow open and click "Listen for test event" (or "Execute workflow").
5. Once you Activate the workflow (top-right toggle), switch to using the **Production URL** shown in the node — this works at all times, even when you're not watching.
6. To send a reply back to the caller, set **Respond** to "Using 'Respond to Webhook' Node" (add that node later in the flow) or "Immediately" with a fixed response.
7. Under **Response**, choose **Response Code** and **Response Data** if replying immediately.

```json
{
  "httpMethod": "POST",
  "path": "new-order",
  "responseMode": "onReceived",
  "responseData": "allEntries",
  "options": {}
}
```

Test it with curl once the workflow is active:

```bash
curl -X POST "https://your-n8n-domain.com/webhook/new-order" \
  -H "Content-Type: application/json" \
  -d '{"orderId": 1023, "customer": "Jane Doe"}'
```

Incoming data appears in later nodes as `{{ $json.body.orderId }}` (n8n nests the payload under `body`).

Common mistake: testing with the **Test URL**, confirming it works, then wondering why nothing happens once real traffic hits it. The Test URL only fires once per "Listen for test event" click and stops working after that single call — you must switch to the **Production URL** and Activate the workflow for it to keep working continuously.
