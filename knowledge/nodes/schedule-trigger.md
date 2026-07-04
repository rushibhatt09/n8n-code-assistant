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

Common mistake: building and testing the workflow, then forgetting to flip the **Active** toggle on. A Schedule Trigger does nothing on its own timeline unless the workflow is activated — testing it manually with "Execute workflow" only runs it once immediately and proves the logic works, it doesn't set up the recurring schedule.
