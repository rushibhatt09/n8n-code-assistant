---
title: Calling Sub-Workflows with Execute Workflow
category: concepts
tags: [sub-workflow, execute-workflow, reusability, modular]
summary: How to call one n8n workflow from another to reuse logic and keep large workflows organized.
---

A "sub-workflow" is a separate workflow that another workflow calls, like calling a function in programming. This lets you build a piece of logic once (e.g., "send a Slack alert") and reuse it from many parent workflows instead of duplicating nodes everywhere.

## How to set it up

1. Build the sub-workflow first. Start it with an **Execute Workflow Trigger** node (instead of a Webhook or Manual trigger) — this defines what input data the sub-workflow expects.
2. In the sub-workflow, use the incoming data via `$json` just like any normal trigger, and end it with whatever output you want returned (the last node's output becomes the result).
3. In the parent workflow, add an **Execute Workflow** node where you want to call it.
4. In that node, choose **Source** (usually "Database" to pick a saved workflow by name) and select your sub-workflow.
5. Under **Workflow Inputs**, map the fields the sub-workflow expects to values from the parent.
6. Run the parent — the sub-workflow executes, and its final output flows back into the parent as this node's output.

## Example: parent node configuration

```
Execute Workflow node:
  Source: Database
  Workflow: "Send Slack Alert"
  Workflow Inputs:
    message: {{ $json.errorMessage }}
    channel: "#alerts"
```

## Example: reading inputs inside the sub-workflow

```javascript
// Code node right after the Execute Workflow Trigger
const { message, channel } = $json;
return [{ json: { text: `[ALERT] ${message}`, channel } }];
```

## Ready-to-paste example

This pair of workflows shows a parent calling a sub-workflow via Execute Workflow — import both, then in the parent's Execute Workflow node re-select the sub-workflow by name since IDs won't match after import.

Parent workflow:

```json
{
  "name": "Parent - Send Alert",
  "nodes": [
    {
      "parameters": {},
      "id": "7f3b182a-7777-4a2b-8c3d-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "source": "database",
        "workflowId": {
          "__rl": true,
          "value": "<SUB_WORKFLOW_ID>",
          "mode": "list",
          "cachedResultName": "Send Slack Alert"
        },
        "workflowInputs": {
          "value": {
            "message": "={{ $json.errorMessage }}",
            "channel": "#alerts"
          }
        }
      },
      "id": "7f3b182a-7777-4a2b-8c3d-000000000002",
      "name": "Execute Workflow",
      "type": "n8n-nodes-base.executeWorkflow",
      "typeVersion": 1.2,
      "position": [460, 300]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "Execute Workflow", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

Sub-workflow ("Send Slack Alert"):

```json
{
  "name": "Send Slack Alert",
  "nodes": [
    {
      "parameters": {
        "workflowInputs": {
          "values": [
            { "name": "message" },
            { "name": "channel" }
          ]
        }
      },
      "id": "7f3b182a-7777-4a2b-8c3d-000000000003",
      "name": "When Executed by Another Workflow",
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "const { message, channel } = $json;\nreturn [{ json: { text: `[ALERT] ${message}`, channel } }];"
      },
      "id": "7f3b182a-7777-4a2b-8c3d-000000000004",
      "name": "Format Alert",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    }
  ],
  "connections": {
    "When Executed by Another Workflow": {
      "main": [
        [
          { "node": "Format Alert", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

## Common mistake

Assuming the sub-workflow automatically has access to the parent's credentials or variables — it doesn't. A sub-workflow only receives the exact data you map into it through **Workflow Inputs**; anything else (like a credential the parent used earlier) must be configured separately inside the sub-workflow itself.
