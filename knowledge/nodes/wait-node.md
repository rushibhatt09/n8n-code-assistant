---
title: Wait Node
category: nodes
tags: [wait, delay, pause, rate-limit]
summary: Pause a workflow for a set time, until a specific date, or until an external webhook call resumes it.
---

The Wait node pauses your workflow before continuing to the next step. Use it to space out API calls to respect rate limits, delay a follow-up message, or pause until a specific date/time or until an external system calls back to resume the flow.

## How to set it up

1. Add the **Wait** node where you want the pause to happen.
2. Choose **Resume**: "After Time Interval," "At Specified Time," or "On Webhook Call."
3. For "After Time Interval," set the **Wait Amount** and **Unit** (seconds, minutes, hours, days).
4. For "At Specified Time," pick the exact **Date and Time** to resume.
5. For "On Webhook Call," n8n generates a unique URL — the workflow pauses until that URL receives a request (useful for approval steps, e.g. "click this link to approve").
6. Note: workflows paused longer than a few minutes are stored on disk (not kept in memory), so this works even after a server restart, as long as n8n stays running/deployed.

```json
{
  "resume": "timeInterval",
  "amount": 1,
  "unit": "seconds"
}
```

```json
{
  "resume": "webhook",
  "options": {
    "webhookSuffix": "approve-order"
  }
}
```

Common mistake: adding a Wait node inside a loop to slow down API calls, but setting the amount too low (or forgetting it entirely) and still hitting the API's rate limit — resulting in failed requests further down the workflow. Check the target API's documented rate limit and set the Wait duration with some safety margin, not the bare minimum.
