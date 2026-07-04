---
title: Complete API Integration Walkthrough (Copy-Paste Workflow)
category: integrations
tags: [http-request, api, code-node, workflow-json, walkthrough, full-example]
summary: A full working automation you can paste directly into n8n, from calling an API to using its response.
---

This is the "give me the whole thing" version: a complete, working mini-automation that calls a real API, gets data back, and reshapes it for the next step — with actual code you paste in, not just a description.

## The proper way to build any API integration (do this every time)

1. **Test the API outside n8n first**, with curl or a tool like Postman. If it doesn't work there, it won't work in n8n either, and testing outside is faster to debug.
2. **Build the HTTP Request node** with the exact method, URL, headers, and body the API needs.
3. **Run just that one node** ("Execute step") and look at its output before adding anything after it.
4. **Add a Code node (or Set node) after it** to pull out only the fields you actually need, in a shape that's easy to use later.
5. Only after steps 1–4 work, connect the rest of your automation (Slack, email, a database, etc.).

Skipping straight to a 10-node workflow before step 3 works is the #1 reason automations "mysteriously" fail — you can't tell which of the 10 nodes broke.

## Full copy-paste example

This example calls a public test API (no login needed) and reshapes the response. Copy the whole JSON block below, click on an empty spot on your n8n canvas, and paste (Ctrl+V / Cmd+V) — n8n will build all three nodes for you, already connected.

```json
{
  "name": "Example: Call an API and Use the Response",
  "nodes": [
    {
      "parameters": {},
      "id": "b1a1a1a1-0000-4000-8000-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "https://jsonplaceholder.typicode.com/users",
        "options": {}
      },
      "id": "b1a1a1a1-0000-4000-8000-000000000002",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "return items.map(item => {\n  return {\n    json: {\n      name: item.json.name,\n      email: item.json.email,\n      city: item.json.address.city\n    }\n  };\n});"
      },
      "id": "b1a1a1a1-0000-4000-8000-000000000003",
      "name": "Shape the Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [[{ "node": "HTTP Request", "type": "main", "index": 0 }]]
    },
    "HTTP Request": {
      "main": [[{ "node": "Shape the Data", "type": "main", "index": 0 }]]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

Click **Execute workflow** and you'll see a clean list of `{ name, email, city }` for each user — that's the pattern for "call an API, then only keep what I need."

## Adapting it to YOUR API

You almost never need to write this from scratch — take the JSON above and change three things:

1. **In the HTTP Request node**, change `method` and `url` to your API's endpoint. For `POST`/`PUT`/`PATCH`, also add:

```json
"sendBody": true,
"contentType": "json",
"jsonBody": "{\n  \"customerId\": \"{{ $json.customerId }}\",\n  \"action\": \"sync\"\n}"
```

2. **If the API needs authentication**, n8n will not let secrets travel inside pasted JSON (for your safety) — after pasting, open the HTTP Request node, set **Authentication** to `Generic Credential Type`, and create a credential:
   - API key in a header → **Header Auth**
   - Bearer token → **Header Auth** with Name `Authorization`, Value `Bearer YOUR_TOKEN`
   - Username/password → **Basic Auth**
   - Full login flow → **OAuth2 API**

3. **In the Code node**, change the `jsCode` field to match the actual shape of your API's response. Log it first to see what you're working with:

```js
console.log(JSON.stringify(items[0].json, null, 2));
return items;
```

Run it once, check the **Execute step** output/console, then write your real mapping.

## Full example with a Bearer token and error handling

```json
{
  "method": "POST",
  "url": "https://api.example.com/v1/sync",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendBody": true,
  "contentType": "json",
  "jsonBody": "{\n  \"customerId\": \"{{ $json.customerId }}\",\n  \"action\": \"sync\"\n}",
  "options": {
    "response": { "response": { "neverError": false } },
    "timeout": 10000
  },
  "retryOnFail": true,
  "maxTries": 3,
  "waitBetweenTries": 1000
}
```

`retryOnFail` + `maxTries` means a flaky API (timeout, brief outage) gets retried automatically instead of failing your whole workflow on the first hiccup.

**Common mistake:** building the full multi-node automation before confirming the HTTP Request node itself works. Always get one green checkmark on the API call alone first — everything downstream depends on knowing exactly what shape of data you're getting back.
