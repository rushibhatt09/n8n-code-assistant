---
title: Aggregate Node
category: nodes
tags: [aggregate, combine, array, summarize]
summary: Combine many separate items into a single item containing a list (array) of their values.
---

The Aggregate node takes many items flowing through your workflow and merges them into one single item, usually as a list (array) of values or of full objects. Use it when you need to send a batch of records as one payload, e.g. emailing a summary list or posting an array to an API in one request.

## How to set it up

1. Add the **Aggregate** node after the items you want to combine.
2. Choose **Aggregate**: "Aggregate All Item Data" (bundle whole items) or "Aggregate Individual Fields" (pull out and combine specific fields).
3. For "Aggregate Individual Fields," click **Add Field to Aggregate** and enter the field name, e.g. `email` — this produces one item with an `email` array containing every item's email.
4. For "Aggregate All Item Data," set the **Destination Field Name** (e.g. `orders`) — this produces one item with an `orders` array, where each entry is a full original item.
5. Optionally enable **Include Binary Data** if you're aggregating file attachments as well.
6. Execute the node and confirm you now have exactly one output item containing everything.

```json
{
  "aggregate": "aggregateAllItemData",
  "destinationFieldName": "orders",
  "options": {}
}
```

```json
{
  "aggregate": "aggregateIndividualFields",
  "fieldsToAggregate": {
    "fieldToAggregate": [
      { "fieldToAggregate": "email", "renameField": false }
    ]
  }
}
```

Common mistake: expecting Aggregate to "summarize" data with sums or averages, like a spreadsheet total. Aggregate only bundles items into an array — it doesn't do math. To calculate sums, counts, or averages, use a Code node or the Summarize node instead.
