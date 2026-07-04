---
title: Workflow Running Slow or Hanging with Large Loops
category: troubleshooting
tags: [performance, split-in-batches, loops, large-data]
summary: Speed up slow n8n workflows by batching large item sets and avoiding unnecessary per-item API calls.
---

## Workflow takes forever, appears frozen, or the browser tab becomes unresponsive

This usually isn't n8n breaking — it's a workflow doing more work than it needs to per item, multiplied across hundreds or thousands of items. Common culprits: calling an external API once per item instead of in bulk, using **Split In Batches** with a batch size of 1 on a huge dataset, or a Code node holding the entire dataset in memory while doing expensive operations. The n8n editor itself can also feel like it's hanging just from trying to render execution data for thousands of items.

### How to fix it

1. Check the **Executions** view (not the live canvas) for a large run — it's lighter on the browser than watching a huge run live.
2. If you're calling an API once per item, check whether that API supports **bulk/batch endpoints** (send 50-100 records in one call instead of one call each).
3. If using **Split In Batches**, increase **Batch Size** from 1 to something like 50-100, so the loop runs far fewer times.
4. Add a short delay only if the target API needs rate limiting — don't add delays for no reason, they add up fast across many items.
5. In Code nodes, avoid nested loops over large arrays; use built-in array methods instead of repeatedly scanning the same data.
6. Turn off **"Save Manual Executions"** or reduce logged data in workflow settings if execution history itself is what's slow to load.

```javascript
// Instead of one API call per item, batch them
const items = $input.all();
const batchSize = 50;
const batches = [];
for (let i = 0; i < items.length; i += batchSize) {
  batches.push(items.slice(i, i + batchSize));
}
return batches.map(batch => ({ json: { ids: batch.map(b => b.json.id) } }));
```

7. Re-run with the new batch size and compare total execution time in the Executions tab.

### Common mistake

Leaving **Split In Batches** at its default batch size of 1 when processing thousands of rows — this forces the workflow to loop thousands of times instead of tens of times, which is almost always the real source of the slowdown, not n8n itself.
