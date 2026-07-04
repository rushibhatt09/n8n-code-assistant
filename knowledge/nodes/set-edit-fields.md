---
title: Set / Edit Fields Node
category: nodes
tags: [set, edit-fields, transform, mapping]
summary: Add, rename, or change field values on your data as it flows through the workflow.
---

The Set node (labeled "Edit Fields" in the node picker) lets you create new fields, rename existing ones, or overwrite values — like a spreadsheet formula for your workflow data. Use it whenever you need to reshape data before sending it somewhere else, such as combining a first and last name or adding a status flag.

## How to set it up

1. Add the **Edit Fields (Set)** node after the node whose data you want to change.
2. Choose **Mode**: "Manual Mapping" (add fields one by one in the UI) or "JSON" (write the whole output as JSON).
3. In Manual Mapping, click **Add Field**, give it a **Name**, pick a **Type** (String, Number, Boolean, Array, Object), and enter the **Value** — you can type an expression using `{{ }}` to pull from earlier nodes.
4. Turn on **Include Other Input Fields** if you want to keep the original data alongside your new/changed fields (off by default in newer versions — it replaces everything unless you enable this).
5. Click **Execute step** to check the output matches what you expect.

```json
{
  "mode": "manual",
  "duplicateItem": false,
  "assignments": {
    "assignments": [
      {
        "name": "fullName",
        "type": "string",
        "value": "={{ $json.firstName }} {{ $json.lastName }}"
      },
      {
        "name": "isVip",
        "type": "boolean",
        "value": "={{ $json.totalSpend > 1000 }}"
      }
    ]
  },
  "options": {
    "includeOtherFields": true
  }
}
```

Common mistake: leaving **Include Other Fields** (or "Keep Only Set" in older versions) in its default state and then losing all the other data fields you needed later in the workflow. Always check this setting when the next node complains that a field "doesn't exist" — it was probably dropped here.
