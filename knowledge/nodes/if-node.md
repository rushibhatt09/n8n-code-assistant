---
title: IF Node
category: nodes
tags: [if, conditional, branching, logic]
summary: Split your workflow into two paths (true/false) based on a condition you define.
---

The IF node checks a condition on each item of data and sends it down one of two paths: **true** or **false**. Use it whenever a workflow needs to behave differently depending on a value — for example, sending a different email to VIP customers versus regular ones.

## How to set it up

1. Add the **IF** node after the data you want to check.
2. Under **Conditions**, click **Add Condition**.
3. Choose the data type (String, Number, Boolean, Date, Array).
4. Set the **Value 1** field to the value you're testing, e.g. `{{ $json.totalSpend }}`.
5. Pick an **Operator**, e.g. "is greater than," "equals," "contains."
6. Enter **Value 2** to compare against, e.g. `1000`.
7. If you add multiple conditions, choose **Combinator**: "AND" (all must be true) or "OR" (any can be true).
8. Connect the **true** output to one branch of nodes and the **false** output to another.

```json
{
  "conditions": {
    "options": {
      "caseSensitive": true,
      "leftValue": "",
      "typeValidation": "strict"
    },
    "conditions": [
      {
        "leftValue": "={{ $json.totalSpend }}",
        "rightValue": 1000,
        "operator": {
          "type": "number",
          "operation": "gt"
        }
      }
    ],
    "combinator": "and"
  }
}
```

Common mistake: comparing a number field against a text value (or vice versa) and getting unexpected results, e.g. `"10" > "9"` evaluating as string comparison instead of numeric. Always double-check the data **type** dropdown on each condition matches the actual type of the value coming in — use the Set node earlier to force a field to Number if you're not sure.
