---
title: Credentials Management in n8n
category: concepts
tags: [credentials, security, authentication, secrets]
summary: How n8n securely stores login details and API keys so you can reuse them across many workflows.
---

"Credentials" are the login details, API keys, or tokens a node needs to connect to another service (like Google Sheets, Slack, or a database). n8n stores them once, encrypted, and lets you reuse the same credential in as many workflows as you like without retyping it.

## How to set up and use credentials

1. Open any node that needs a connection (e.g., the Gmail node) and find the "Credential" dropdown.
2. Click "Create New Credential."
3. Fill in the fields the service asks for — this could be a username/password, an API key, or an OAuth login (where you click "Connect my account" and log in through a popup).
4. Click "Save." n8n encrypts this data at rest using an internal encryption key and stores it separately from your workflow data.
5. From now on, that saved credential appears in the dropdown of any node that uses the same service type — just select it, no re-entry needed.
6. You can manage all credentials centrally under **Settings > Credentials** (or the sidebar "Credentials" tab), including renaming, testing, or deleting them.

## Example: referencing a credential is automatic

You never write the credential value in an expression. You simply pick it from the dropdown, for example in an HTTP Request node:

```
Authentication: Predefined Credential Type
Credential Type: Header Auth
Credential: "My API Key" (selected from dropdown)
```

If a service isn't built-in, use the **HTTP Request** node with a "Generic Credential Type" like Header Auth, and store the secret value there instead of pasting it directly into the URL or body fields.

## Common mistake

Pasting an API key or password directly into a node's text field (like the URL or a header value) instead of saving it as a credential. This exposes the secret in plain text in your workflow JSON, in execution logs, and to anyone who can view or export the workflow. Always store secrets as credentials, not as literal text.
