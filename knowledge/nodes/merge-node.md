---
title: Merge Node
category: nodes
tags: [merge, combine, join, branches]
summary: Combine data coming from two or more separate branches back into one stream.
---

The Merge node takes two (or more) input branches and combines their data into a single output — the counterpart to IF/Switch, which split branches apart. Use it to join results from two API calls, combine a main list with lookup data, or simply reunite branches after conditional logic.

## How to set it up

1. Add the **Merge** node where your branches need to come back together.
2. Drag connections from both upstream branches into **Input 1** and **Input 2** (drag onto the node to add more inputs if needed).
3. Choose **Mode**:
   - **Append**: stacks all items from both inputs one after another.
   - **Combine**: joins items together field-by-field, matching by position or by a shared key (choose "Combine By Fields" and set the matching field, e.g. `id`).
   - **SQL Query**: write a SQL-like query across both inputs (advanced).
   - **Choose Branch**: keep only one input's data, useful for picking a fallback.
4. If using "Combine By Fields," set **Fields to Match On** for Input 1 and Input 2, e.g. both set to `customerId`.
5. Execute the node and confirm the combined output has the fields you expect from both sides.

```json
{
  "mode": "combine",
  "combineBy": "combineByFields",
  "fieldsToMatchString": "customerId",
  "options": {
    "joinMode": "keepMatches"
  }
}
```

Common mistake: using **Append** mode when you actually wanted to join matching records side-by-side. Append just stacks items — item 1 from Input 1 and item 1 from Input 2 remain as two separate items rather than becoming one item with combined fields. If you need one row per matching pair (like joining orders to customers), use "Combine By Fields" instead.
