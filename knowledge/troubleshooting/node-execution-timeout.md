---
title: Node or Workflow Execution Timeout
category: troubleshooting
tags: [timeout, performance, http-request, workflow-settings]
summary: Fix "execution timed out" errors by raising timeout settings and reducing what a single node has to process at once.
---

## "Workflow did not finish, timeout reached" / "ETIMEDOUT" / node hangs and never completes

n8n (and the services it calls) will only wait so long for a response before giving up. This happens when a single node — often an **HTTP Request** to a slow API, a **Code** node doing heavy processing, or a database query — takes longer than the allowed time. It can also happen at the whole-workflow level if n8n's own execution timeout setting is reached before everything finishes.

### How to fix it

1. Look at the error message to see whether it names a specific node or the whole workflow — that tells you where to focus.
2. For a slow **HTTP Request** node, open it, go to **Options** > **Timeout**, and increase the value (in milliseconds) — e.g. from the 10-second default to 60000 (60 seconds).
3. For the whole workflow, go to the workflow's **Settings** (three-dot menu top right) and increase **Timeout Workflow** / **Timeout After**.
4. If a **Code** node is slow, check for loops processing thousands of items at once — split the work using **Split In Batches** so each run handles a smaller chunk.
5. If calling an external API, check if it offers a faster/paginated endpoint instead of one huge request.
6. Add retry logic so a slow-but-eventually-successful call doesn't just fail outright.

```json
// HTTP Request node > Options
{
  "timeout": 60000,
  "retry": {
    "maxTries": 3,
    "waitBetween": 2000
  }
}
```

7. Re-run and watch the **Executions** tab to confirm the node now finishes within the new limit.

### Common mistake

Increasing only the node's timeout but not the overall workflow timeout (or vice versa) — both limits apply, so the shorter one still cuts execution off. Also common: trying to process a huge dataset (e.g. 10,000 rows) in one Code node run instead of batching it.
