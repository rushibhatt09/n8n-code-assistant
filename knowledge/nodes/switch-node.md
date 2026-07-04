---
title: Switch Node
category: nodes
tags: [switch, routing, branching, multi-path]
summary: Route data down one of several paths based on matching a value, like a multi-way IF.
---

The Switch node routes each item to one of several outputs depending on its value — think of it as an IF node with more than two branches. Use it when you have categories like order status ("new," "shipped," "cancelled") and want a separate path of nodes to handle each one.

## How to set it up

1. Add the **Switch** node after your data source.
2. Choose **Mode**: "Rules" (define conditions per output) or "Expression" (calculate an output index/name with one expression).
3. In Rules mode, click **Add Routing Rule** for each branch you need, give each one an **Output Name** (e.g. "New," "Shipped," "Cancelled"), and set a condition, e.g. `{{ $json.status }}` equals `shipped`.
4. Turn on **Fallback Output** if you want a catch-all path for items that don't match any rule (name it something like "Other").
5. Connect each numbered/named output to its own branch of downstream nodes.

```json
{
  "mode": "rules",
  "rules": {
    "values": [
      {
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.status }}",
              "rightValue": "shipped",
              "operator": { "type": "string", "operation": "equals" }
            }
          ],
          "combinator": "and"
        },
        "outputKey": "Shipped"
      },
      {
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.status }}",
              "rightValue": "cancelled",
              "operator": { "type": "string", "operation": "equals" }
            }
          ],
          "combinator": "and"
        },
        "outputKey": "Cancelled"
      }
    ]
  },
  "options": {
    "fallbackOutput": "extra"
  }
}
```

Common mistake: not enabling **Fallback Output**, so any item that doesn't exactly match a rule (e.g. unexpected status like "returned") simply disappears from the workflow with no error and no trace. Always add a fallback branch, even if it just logs or alerts on unmatched items.
