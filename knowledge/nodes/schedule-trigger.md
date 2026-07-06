---
title: Schedule Trigger
category: nodes
tags: [schedule, cron, trigger, automation]
summary: Start a workflow automatically at a set time, interval, or using a cron expression.
---

The Schedule Trigger node starts your workflow on a timer — every hour, every day at 9am, every Monday, or on a custom cron schedule. Use it for recurring tasks like daily reports, nightly data syncs, or weekly reminders, where nothing external needs to "trigger" the run.

## How to set it up

1. Add the **Schedule Trigger** node — it must be the first node in the workflow.
2. Click **Add Trigger Rule**.
3. Choose a **Trigger Interval**: Seconds, Minutes, Hours, Days, Weeks, Months, or Cron Expression.
4. For simple schedules, e.g. "Days," set **Days Between Triggers** to `1` and **Trigger at Hour**/**Minute** for the time of day.
5. For full control, choose "Cron Expression" and enter a standard 5-field cron string, e.g. `0 9 * * 1-5` (9:00 AM, Monday–Friday).
6. You can add multiple trigger rules to the same node if you need more than one schedule (e.g. both daily and hourly).
7. **Activate** the workflow (top-right toggle) — schedule triggers only run when the workflow is active, not while just open in the editor.

```json
{
  "rule": {
    "interval": [
      {
        "field": "cronExpression",
        "expression": "0 9 * * 1-5"
      }
    ]
  }
}
```

## Ready-to-paste example

Pasting this creates a workflow that runs automatically at 9:00 AM every weekday and posts a "daily report" message via HTTP Request — remember to flip the Active toggle after pasting.

```json
{
  "name": "Weekday 9AM Report Example",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * 1-5"
            }
          ]
        }
      },
      "id": "b2c3d4e5-0001-4b88-8c88-000000000001",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "<YOUR_API_URL>",
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { \"text\": \"Daily report generated at \" + $now.toISO() } }}",
        "options": {}
      },
      "id": "b2c3d4e5-0002-4b88-8c88-000000000002",
      "name": "Send Daily Report",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [680, 300]
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          { "node": "Send Daily Report", "type": "main", "index": 0 }
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

Common mistake: building and testing the workflow, then forgetting to flip the **Active** toggle on. A Schedule Trigger does nothing on its own timeline unless the workflow is activated — testing it manually with "Execute workflow" only runs it once immediately and proves the logic works, it doesn't set up the recurring schedule.
