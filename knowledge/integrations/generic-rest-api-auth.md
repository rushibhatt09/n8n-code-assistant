---
title: Generic REST API Authentication
category: integrations
tags: [http-request, api-key, oauth2, basic-auth, bearer-token]
summary: Connect n8n to any REST API not covered by a dedicated node, using the HTTP Request node.
---

Not every service has a built-in n8n node. For anything else, the **HTTP Request node** can call any REST API directly, as long as you configure the right authentication method.

## How to connect it

n8n's HTTP Request node supports four common auth styles, each set up as a **Generic Credential Type**:

1. **API Key** — Create a credential of type **Query Auth** or **Header Auth** (depending on whether the API wants the key in the URL or a header). For Header Auth, set **Name** to the header the API expects (e.g. `X-API-Key`) and **Value** to your key.
2. **Bearer Token** — Create a credential of type **Header Auth**, set **Name** to `Authorization` and **Value** to `Bearer YOUR_TOKEN`.
3. **Basic Auth** — Create a credential of type **Basic Auth**, enter **User** and **Password**; n8n encodes it automatically.
4. **OAuth2 (Generic)** — Create a credential of type **OAuth2 API**, fill in **Grant Type** (e.g. `Authorization Code` or `Client Credentials`), **Authorization URL**, **Access Token URL**, **Client ID**, **Client Secret**, and **Scope** per the API's docs.

## Example use case: call a custom API with a Bearer token

1. Add a **Trigger** node to start the workflow (Webhook, Schedule, etc.).
2. Add an **HTTP Request** node, set **Authentication** to `Generic Credential Type`, then choose **Header Auth**, and select your saved credential.
3. Set **Method** to `POST`, **URL** to the endpoint, **Body Content Type** to `JSON`.

```json
{
  "customerId": "{{ $json.customerId }}",
  "action": "sync"
}
```

Test the same call with curl first to confirm the API works before building the node:

```bash
curl -X POST "https://api.example.com/v1/sync" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customerId": "123", "action": "sync"}'
```

## Quick copy-paste template (any REST API)

This is the universal template for connecting to almost any REST API — just swap in the real API URL and key for whichever auth style the API documentation asks for, and it will work.

```json
{
  "_comment": "Style 1: Header auth with a Bearer token",
  "url": "<YOUR_API_URL>",
  "headers": {
    "Authorization": "Bearer <YOUR_API_KEY>"
  },

  "_comment_2": "Style 2: Custom header key (common name is X-API-Key, but check the API's docs)",
  "url_2": "<YOUR_API_URL>",
  "headers_2": {
    "X-API-Key": "<YOUR_API_KEY>"
  },

  "_comment_3": "Style 3: Query-parameter key appended directly to the URL",
  "url_3": "<YOUR_API_URL>?api_key=<YOUR_API_KEY>"
}
```

The same three styles as curl commands, so you can test them from a terminal before building the node:

```bash
# Style 1: Bearer token in the Authorization header
curl "<YOUR_API_URL>" \
  -H "Authorization: Bearer <YOUR_API_KEY>"

# Style 2: Custom header key
curl "<YOUR_API_URL>" \
  -H "X-API-Key: <YOUR_API_KEY>"

# Style 3: Key as a query parameter in the URL
curl "<YOUR_API_URL>?api_key=<YOUR_API_KEY>"
```

**Common mistake:** Selecting **Predefined Credential Type** instead of **Generic Credential Type** when no dedicated n8n integration exists for the service — Predefined only works for services n8n already has built-in support for. For everything else, always use Generic Credential Type with Header/Query/Basic/OAuth2 Auth.
