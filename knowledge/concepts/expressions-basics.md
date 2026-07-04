---
title: n8n Expressions Basics
category: concepts
tags: [expressions, json, variables, basics]
summary: How to use n8n's {{ }} expression syntax to pull data from previous nodes into any field.
---

An "expression" is a small piece of code you type inside `{{ }}` in any n8n field. It lets a field show data from earlier in your workflow instead of typing it in by hand.

## How to use it in the n8n UI

1. Click into any node field (like a URL, message body, or parameter).
2. Click the small expression icon (looks like "fx" or an equals sign) next to the field, or just start typing `{{`.
3. Inside the curly braces, write a reference to the data you want.
4. n8n shows a live preview below the field so you can see the actual value before running the workflow.
5. Press outside the field to save.

## Key variables you'll use constantly

- `$json` — the JSON data of the item currently being processed, coming from the node right before this one.
- `$node["Node Name"].json` — data from any specific earlier node, by name.
- `$now` — the current date/time.
- `$input.item.json` — another way to reference the current item's data.

```
{{ $json.email }}
```

```
{{ $node["HTTP Request"].json.data[0].id }}
```

```
{{ $now.toFormat('yyyy-MM-dd') }}
```

You can also mix plain text with expressions:

```
Hello {{ $json.firstName }}, your order #{{ $json.orderId }} shipped on {{ $now.toFormat('dd LLL yyyy') }}.
```

## Common mistake

Forgetting the double curly braces, or only using one `{`. If you type `$json.email` without `{{ }}`, n8n treats it as plain text, not a live reference — the field will literally show `$json.email` instead of the actual email address. Always wrap expressions in `{{ }}`.
