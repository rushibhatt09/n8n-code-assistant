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

## Ready-to-paste example

This complete workflow shows how an HTTP Request node references a saved credential by name and ID (the way it looks when you export a workflow) — import it, then in the n8n UI reselect or recreate the credential named below since the actual secret value is never stored in this file.

```json
{
  "name": "Call API Using Saved Credential",
  "nodes": [
    {
      "parameters": {},
      "id": "2a8c7d4b-2222-4a2b-8c3d-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "https://api.example.com/v1/customers",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "httpHeaderAuth"
      },
      "id": "2a8c7d4b-2222-4a2b-8c3d-000000000002",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300],
      "credentials": {
        "httpHeaderAuth": {
          "id": "<YOUR_CREDENTIAL_ID>",
          "name": "<YOUR_SAVED_CREDENTIAL_NAME>"
        }
      }
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "HTTP Request", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

Note: n8n encrypts credential secrets at rest and deliberately excludes the actual key/password value from workflow JSON exports — only the credential's name/ID reference is included, so importing this workflow elsewhere will show the credential field as unset until you pick or recreate one with real values.

## Common mistake

Pasting an API key or password directly into a node's text field (like the URL or a header value) instead of saving it as a credential. This exposes the secret in plain text in your workflow JSON, in execution logs, and to anyone who can view or export the workflow. Always store secrets as credentials, not as literal text.
