---
title: Error Handling and Retries in n8n
category: concepts
tags: [error-handling, retries, error-workflow, reliability]
summary: How to make n8n workflows recover from failures using retries, Continue On Fail, and an Error Workflow.
---

Things go wrong — an API times out, a website is briefly down. n8n gives you three tools to handle failures gracefully: retrying a node automatically, letting a workflow continue past a failed node, and running a separate "Error Workflow" whenever any workflow fails.

## Setting retry on a node

1. Click the node that might fail (e.g., an HTTP Request node calling a flaky API).
2. Open the node's **Settings** tab (gear icon or the "Settings" panel within the node).
3. Turn on **Retry On Fail**.
4. Set **Max Tries** (e.g., 3) and **Wait Between Tries** in milliseconds (e.g., 2000 for 2 seconds).

## Letting the workflow continue past an error

1. In the same node **Settings** tab, find **On Error** (older versions call this "Continue On Fail").
2. Choose:
   - **Stop Workflow** (default) — the whole execution halts.
   - **Continue** — the workflow keeps going to the next node, and the failed item gets an `error` field instead of its normal output.
   - **Continue Using Error Output** — sends failed items down a separate red error connector so you can route them differently (e.g., log them to a sheet).

## Setting a workflow-level Error Workflow

1. Open the workflow you want to protect, click the three-dot menu, then **Settings**.
2. Under **Error Workflow**, pick another workflow that should run automatically whenever this one fails.
3. Build that target workflow starting with an **Error Trigger** node — it receives details about which workflow failed and why.

```
Error Trigger node output example:
{
  "execution": { "id": "123", "url": "https://your-n8n/execution/123" },
  "workflow": { "id": "45", "name": "Sync Orders" },
  "trigger": { "error": { "message": "Timeout of 5000ms exceeded" } }
}
```

## Ready-to-paste example

This complete workflow calls an API with retry-on-fail enabled, routes failed items to an error output, and logs them with a Code node instead of stopping the whole run — import it and just change the URL.

```json
{
  "name": "HTTP Call With Retry and Error Handling",
  "nodes": [
    {
      "parameters": {},
      "id": "3b7d5e2c-3333-4a2b-8c3d-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "<API_ENDPOINT_URL>",
        "options": {}
      },
      "id": "3b7d5e2c-3333-4a2b-8c3d-000000000002",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300],
      "retryOnFail": true,
      "maxTries": 3,
      "waitBetweenTries": 2000,
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "jsCode": "return [{ json: { loggedError: $json.error?.message || 'Unknown error', at: new Date().toISOString() } }];"
      },
      "id": "3b7d5e2c-3333-4a2b-8c3d-000000000003",
      "name": "Log Error",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 420]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "HTTP Request", "type": "main", "index": 0 }
        ]
      ]
    },
    "HTTP Request": {
      "main": [
        [],
        [
          { "node": "Log Error", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

## Common mistake

Turning on "Retry On Fail" for a node that fails because of bad data (like a missing field) rather than a temporary issue. Retries only help with transient problems (timeouts, rate limits); retrying a logic error just repeats the same failure and wastes time. Use Continue On Fail or fix the data instead.
