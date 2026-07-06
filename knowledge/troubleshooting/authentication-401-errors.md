---
title: 401 / 403 Unauthorized Errors from HTTP Request Node
category: troubleshooting
tags: [http-request, authentication, api-credentials, error-401]
summary: Fix 401/403 Unauthorized errors in n8n's HTTP Request node by correcting credentials, headers, or token scope.
---

## "401 Unauthorized" or "403 Forbidden"

This means the API you're calling doesn't recognize you as a valid, allowed caller. A 401 usually means your credentials are missing, wrong, or expired. A 403 usually means you *are* recognized, but you don't have permission to do that specific action (wrong scope, wrong plan, wrong account). Either way, n8n is sending the request correctly — the API is rejecting what's inside it.

### How to fix it

1. Open the **HTTP Request** node and check the **Authentication** field. It should be set to match how the API expects credentials (e.g. "Generic Credential Type" with Header Auth, or a pre-built credential like "OAuth2").
2. Click into **Credentials** and re-select or re-create the credential — API keys and tokens can expire or get revoked.
3. If the API needs a header like `Authorization: Bearer <token>`, confirm it's actually being sent: open **Headers** under "Send Headers" and check the exact header name (case matters for some APIs) and value.
4. Test the same token outside n8n first (e.g. in the API's own docs/playground) to confirm the token itself is valid before blaming the workflow.
5. If using OAuth2 credentials, click **Reconnect** on the credential to refresh the token, since access tokens often expire after a set time.
6. Check the URL for typos — hitting the wrong endpoint or wrong account ID can also return 401/403 even with a good token.

Example manual header auth setup in the HTTP Request node's headers:

```json
{
  "Authorization": "Bearer {{ $credentials.apiToken }}",
  "Content-Type": "application/json"
}
```

## Drop-in fix

Paste this into the HTTP Request node's JSON parameters (or recreate the equivalent settings in the UI) to send a clean, correctly-formatted Bearer token with no trailing whitespace and a fallback error if the credential is missing.

```json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "=Bearer {{ ($credentials.apiToken || '').trim() }}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "options": {
    "response": {
      "response": {
        "neverError": false
      }
    }
  }
}
```

If you'd rather validate the token before every call, add a small **Code** node right before the HTTP Request node:

```javascript
// Code node: fail fast with a clear message if the token is missing/malformed
for (const item of $input.all()) {
  const token = $credentials?.apiToken ?? item.json.apiToken;
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    throw new Error(
      "Missing or empty API token. Check the credential named '<YOUR_CREDENTIAL_NAME>' and re-save it."
    );
  }
  item.json.authToken = token.trim();
}
return $input.all();
```

Replace `<YOUR_CREDENTIAL_NAME>` with the actual credential name, and swap `apiToken` for whatever field your API's docs call the key/token.

### Common mistake

Pasting an API key that has trailing spaces or is missing the `Bearer ` prefix the API expects. Also common: reusing a credential created for a different environment (sandbox vs. production), which looks valid but is rejected because it points at the wrong account.
