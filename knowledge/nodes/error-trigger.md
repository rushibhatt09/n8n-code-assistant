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

Common mistake: adding the Error Trigger node directly inside the same workflow that might fail, expecting it to catch errors locally. Error Trigger only works as the starting node of a **separate** workflow that's been linked via that workflow's Settings > Error Workflow option — it cannot catch errors within its own workflow.
