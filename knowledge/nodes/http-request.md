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

## Ready-to-paste example

Pasting this creates a Manual Trigger connected to an HTTP Request node that POSTs a new customer record to an API with headers and a JSON body already configured.

```json
{
  "name": "HTTP Request Create Customer Example",
  "nodes": [
    {
      "parameters": {},
      "id": "e1f2a3b4-0001-4e55-8f55-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "mode": "manual",
        "duplicateItem": false,
        "assignments": {
          "assignments": [
            { "name": "customerName", "type": "string", "value": "Jane Doe" },
            { "name": "email", "type": "string", "value": "jane@example.com" }
          ]
        },
        "options": {}
      },
      "id": "e1f2a3b4-0002-4e55-8f55-000000000002",
      "name": "Sample Customer",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "<YOUR_API_URL>/v1/customers",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "Content-Type", "value": "application/json" },
            { "name": "Authorization", "value": "Bearer <YOUR_API_TOKEN>" }
          ]
        },
        "sendBody": true,
        "contentType": "json",
        "jsonBody": "={{ { \"name\": $json.customerName, \"email\": $json.email } }}",
        "options": {}
      },
      "id": "e1f2a3b4-0003-4e55-8f55-000000000003",
      "name": "Create Customer",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [900, 300]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "Sample Customer", "type": "main", "index": 0 }
        ]
      ]
    },
    "Sample Customer": {
      "main": [
        [
          { "node": "Create Customer", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

Common mistake: forgetting to turn on **Send Body** or **Send Headers** toggles. In n8n, filling in the fields below these toggles does nothing if the toggle itself is off — the node will silently send the request without your body or headers, and you'll wonder why the API rejects it or returns unexpected results.
