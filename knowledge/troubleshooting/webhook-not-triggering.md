---
title: Webhook Not Triggering When External Service Calls It
category: troubleshooting
tags: [webhook, trigger, workflow-activation, testing]
summary: Fix a webhook that never fires by activating the workflow and using the production URL instead of the test URL.
---

## Webhook URL doesn't fire / nothing happens when the external service calls it

The **Webhook** node in n8n actually creates two different URLs: a **Test URL** and a **Production URL**. The test one only listens while you have the workflow open and have clicked "Listen for test event" — it goes dead the moment you close the editor or the listening window times out. If you gave the external service the test URL, or you never activated the workflow, the call goes nowhere and n8n never even sees it.

### How to fix it

1. Open the workflow and click the **Webhook** node.
2. Note there are two URLs shown: **Test URL** and **Production URL**.
3. Make sure the workflow is **Active** (toggle in the top-right corner of the editor). Webhooks only listen in production mode when the workflow is active.
4. Copy the **Production URL** and update the external service (Stripe, Shopify, Typeform, etc.) to send to that URL, not the test one.
5. Confirm the **HTTP Method** field on the Webhook node (GET, POST, etc.) matches exactly what the external service sends — a mismatch causes silent failures or 404s.
6. Check the **Path** field for typos or duplicate paths used by another workflow.
7. Trigger a real event from the external service and check the **Executions** tab in n8n to see if a run appears at all.

```text
Test URL:       https://your-instance.app.n8n.cloud/webhook-test/abc123
Production URL: https://your-instance.app.n8n.cloud/webhook/abc123
```

8. If executions still don't appear, check whether your n8n instance is reachable from the internet (self-hosted instances behind a firewall or on `localhost` need a tunnel like ngrok, or a proper public domain).

### Common mistake

Testing successfully with "Listen for test event," then forgetting to switch the external service over to the Production URL and activate the workflow before going live — the test URL simply stops working once you navigate away from the canvas.
