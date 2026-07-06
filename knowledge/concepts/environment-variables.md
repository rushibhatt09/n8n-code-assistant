---
title: Using Environment Variables in Self-Hosted n8n
category: concepts
tags: [environment-variables, self-hosted, config, secrets]
summary: How to set and use environment variables in self-hosted n8n to store config values outside your workflows.
---

Environment variables are settings or secret values you configure outside of n8n (in your server, Docker setup, or `.env` file) that your workflows can read at run time. They're useful for values that change between environments (like "staging" vs "production") or for anything you don't want hardcoded into a workflow.

## How to set them up

1. On a self-hosted n8n instance, define environment variables where you start n8n — for example, in a `.env` file used by Docker Compose, or exported in your shell before running `n8n start`.
2. Restart n8n so it picks up the new variables.
3. In any node or expression inside a workflow, read the variable using `$env`.
4. Note: environment variable access can be restricted by the `N8N_BLOCK_ENV_ACCESS_IN_NODE` setting — if your admin has disabled it, `$env` won't be available inside the Code node for security reasons.

## Example

In your `.env` file or docker-compose environment section:

```
API_BASE_URL=https://api.example.com
DEFAULT_REGION=us-east-1
```

Then inside an n8n expression field:

```
{{ $env.API_BASE_URL }}/v1/customers
```

Or inside a Code node:

```javascript
const region = $env.DEFAULT_REGION;
return [{ json: { region } }];
```

## Ready-to-paste example

This is a complete `.env` file you can save next to your `docker-compose.yml` (or source in your shell), plus the matching expression syntax to read one of its values inside a workflow.

```
# .env
API_BASE_URL=<YOUR_API_BASE_URL>
DEFAULT_REGION=<YOUR_DEFAULT_REGION>
N8N_ENCRYPTION_KEY=<YOUR_ENCRYPTION_KEY>
GENERIC_TIMEZONE=<YOUR_TIMEZONE>
```

Read it from any expression field in a node:

```
{{ $env.API_BASE_URL }}/v1/customers
```

Or from inside a Code node:

```javascript
const region = $env.DEFAULT_REGION;
return [{ json: { region } }];
```

## Common mistake

Expecting environment variables to update instantly after editing the `.env` file. n8n only reads environment variables when it starts up — you must restart the n8n service (e.g., `docker compose restart n8n`) for changes to take effect. Editing the file alone does nothing until n8n reloads.
