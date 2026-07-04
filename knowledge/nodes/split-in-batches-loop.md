---
title: Split In Batches / Loop Over Items
category: nodes
tags: [loop, batches, pagination, large-lists]
summary: Process a long list of items in smaller chunks or one at a time instead of all at once.
---

The "Loop Over Items (Split in Batches)" node breaks a large list into smaller groups (or single items) and loops your workflow over them repeatedly. Use it when calling an API that has rate limits, or when a downstream step needs to run individually per item rather than on the whole batch at once.

## How to set it up

1. Add the **Loop Over Items (Split in Batches)** node after the node producing your list of items.
2. Set **Batch Size** to how many items you want processed per loop (use `1` to handle items one at a time).
3. Connect the node's **loop** output to the nodes that should run per batch.
4. At the end of that branch, connect the last node back to the **input** of the Loop node itself — this creates the loop that keeps pulling the next batch.
5. Connect the node's **done** output to whatever should run after all batches finish.
6. n8n automatically tracks progress and stops looping once every item has been processed.

```json
{
  "batchSize": 1,
  "options": {}
}
```

Example use: looping through 500 leads and calling an API once per lead with a small delay, using a Wait node inside the loop to respect a rate limit of 1 request per second.

Common mistake: forgetting to wire the last node in the loop branch back to the Loop node's input. Without that return connection, the node only processes a single batch and then stops — it looks like it's "not looping" when really the loop was never closed.
