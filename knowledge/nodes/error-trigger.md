---
title: Error Trigger Node
category: nodes
tags: [error-trigger, error-handling, alerts, monitoring]
summary: Automatically run a separate workflow whenever your main workflow fails, so you can get alerted.
---

The Error Trigger node starts a workflow whenever another workflow throws an error — for example, an API call fails or a node crashes. Use it to build a "safety net" workflow that sends you a Slack message or email whenever something goes wrong elsewhere, so failures don't go unnoticed.

## How to set it up

1. Create a **new, separate workflow** dedicated to error handling (don't put this in the same workflow that might fail).
2. Add the **Error Trigger** node as the first node of this new workflow.
3. In the workflow(s) you want monitored, open **Workflow Settings** (three-dot menu, top right) and set **Error Workflow** to the name of your error-handling workflow.
4. Back in the error workflow, after the Error Trigger node, add whatever you want to happen — e.g. a Slack node or Send Email node — using data from the trigger like `{{ $json.workflow.name }}` and `{{ $json.execution.error.message }}`.
5. Activate both the main workflow and the error-handling workflow.

```json
{
  "parameters": {}
}
```

Example expression to build an alert message:

```js
`Workflow "${$json.workflow.name}" failed.\nError: ${$json.execution.error.message}\nNode: ${$json.execution.lastNodeExecuted}`
```

## Ready-to-paste example

Pasting this creates a complete, separate error-handling workflow: an Error Trigger that formats the failure details and posts them to a Slack-style webhook URL — set this workflow's name as the "Error Workflow" in your main workflow's Settings.

```json
{
  "name": "Error Handler Workflow",
  "nodes": [
    {
      "parameters": {},
      "id": "c1d2e3f4-0001-4c33-8d33-000000000001",
      "name": "Error Trigger",
      "type": "n8n-nodes-base.errorTrigger",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "mode": "manual",
        "duplicateItem": false,
        "assignments": {
          "assignments": [
            {
              "name": "alertMessage",
              "type": "string",
              "value": "=Workflow \"{{ $json.workflow.name }}\" failed.\nError: {{ $json.execution.error.message }}\nNode: {{ $json.execution.lastNodeExecuted }}"
            }
          ]
        },
        "options": {}
      },
      "id": "c1d2e3f4-0002-4c33-8d33-000000000002",
      "name": "Format Alert",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "<YOUR_ALERT_WEBHOOK_URL>",
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { \"text\": $json.alertMessage } }}",
        "options": {}
      },
      "id": "c1d2e3f4-0003-4c33-8d33-000000000003",
      "name": "Send Alert",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [900, 300]
    }
  ],
  "connections": {
    "Error Trigger": {
      "main": [
        [
          { "node": "Format Alert", "type": "main", "index": 0 }
        ]
      ]
    },
    "Format Alert": {
      "main": [
        [
          { "node": "Send Alert", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

Common mistake: adding the Error Trigger node directly inside the same workflow that might fail, expecting it to catch errors locally. Error Trigger only works as the starting node of a **separate** workflow that's been linked via that workflow's Settings > Error Workflow option — it cannot catch errors within its own workflow.
