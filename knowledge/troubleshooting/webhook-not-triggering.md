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

## Drop-in fix

Paste this as the first node after your Webhook trigger — it logs exactly what n8n received (method, path, headers, body) so you can immediately tell whether the external service is even reaching n8n, and whether it's hitting the right method/path.

```javascript
// Code node: confirm the webhook actually fired and log what arrived
const req = $input.first().json;

const diagnostics = {
  receivedAt: new Date().toISOString(),
  method: $execution?.mode ?? "unknown",
  hasBody: req?.body !== undefined,
  bodyPreview: JSON.stringify(req?.body ?? req).slice(0, 300),
  headers: req?.headers ?? {},
  query: req?.query ?? {},
};

console.log("WEBHOOK RECEIVED:", JSON.stringify(diagnostics, null, 2));

return [{ json: { ...req, __diagnostics: diagnostics } }];
```

Before relying on that, run through this checklist against the Webhook node itself:

```text
Webhook activation checklist:
1. Workflow toggle (top-right) is set to "Active", not just saved.
2. External service is configured with the PRODUCTION URL:
   https://<YOUR_N8N_DOMAIN>/webhook/<YOUR_WEBHOOK_PATH>
   — NOT the test URL (/webhook-test/...).
3. HTTP Method on the Webhook node matches exactly what the sender uses (GET vs POST).
4. Path field has no typos and isn't reused by another active workflow.
5. If self-hosted on localhost, a public tunnel (e.g. ngrok) or reachable domain is set up —
   external services cannot reach "localhost" on your machine.
6. After sending a real test event, the Executions tab shows a new run (even a failed one).
```

Replace `<YOUR_N8N_DOMAIN>` and `<YOUR_WEBHOOK_PATH>` with your actual n8n instance domain and the path shown on the Webhook node.

### Common mistake

Testing successfully with "Listen for test event," then forgetting to switch the external service over to the Production URL and activate the workflow before going live — the test URL simply stops working once you navigate away from the canvas.
