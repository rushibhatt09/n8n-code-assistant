---
title: HTTP Request Node
category: nodes
tags: [http-request, api, authentication, json]
summary: Send data to or fetch data from any web API using the HTTP Request node.
---

The HTTP Request node lets your workflow talk to any external website or API — for example, calling a weather service, posting a message to a webhook, or pulling records from a CRM. Use it whenever you need to send or receive data over the internet and there isn't a dedicated n8n node for that service.

## How to set it up

1. Add the **HTTP Request** node.
2. Set **Method** to the action you need: `GET` (read data), `POST` (create), `PUT`/`PATCH` (update), or `DELETE` (remove).
3. Enter the **URL** of the API endpoint, e.g. `https://api.example.com/v1/customers`.
4. If the API needs a key or login, set **Authentication** to "Generic Credential Type" or a predefined type (like "Header Auth" or "OAuth2"), then create/select a credential.
5. To add custom headers, turn on **Send Headers** and add name/value pairs (e.g. `Content-Type: application/json`).
6. To send data in the request, turn on **Send Body**, choose **Body Content Type** as `JSON`, and enter your fields.
7. To add URL parameters like `?status=active`, turn on **Send Query Parameters** and add name/value pairs.
8. Click **Execute step** to test and check the output panel.

```json
{
  "method": "POST",
  "url": "https://api.example.com/v1/customers",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "Content-Type", "value": "application/json" },
      { "name": "Authorization", "value": "Bearer {{ $json.apiToken }}" }
    ]
  },
  "sendBody": true,
  "contentType": "json",
  "jsonBody": "{\n  \"name\": \"{{ $json.customerName }}\",\n  \"email\": \"{{ $json.email }}\"\n}"
}
```

Test the same call from a terminal first to confirm it works outside n8n:

```bash
curl -X POST "https://api.example.com/v1/customers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

Common mistake: forgetting to turn on **Send Body** or **Send Headers** toggles. In n8n, filling in the fields below these toggles does nothing if the toggle itself is off — the node will silently send the request without your body or headers, and you'll wonder why the API rejects it or returns unexpected results.
