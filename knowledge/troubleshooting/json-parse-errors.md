---
title: Unexpected Token / Invalid JSON Parse Errors
category: troubleshooting
tags: [json, parsing, http-request, code-node]
summary: Fix "Unexpected token" JSON errors by checking whether the API actually returned JSON before parsing it.
---

## "Unexpected token < in JSON at position 0" / "Unexpected token 'undefined' is not valid JSON"

This error means something tried to parse text as JSON, but the text wasn't valid JSON. The classic cause: an API returned an HTML error page (starting with `<html>` or `<!DOCTYPE>`) instead of the JSON you expected — often because of an auth failure, a wrong URL, or a server error — and n8n (or your Code node) tried to `JSON.parse()` that HTML anyway. It can also happen with genuinely broken/truncated JSON, or empty responses.

### How to fix it

1. Check the actual response first: in the **HTTP Request** node, run it and look at the raw output in the results panel — is it really JSON, or an HTML/plain-text error page?
2. If it's an error page, the real issue is upstream (auth, wrong endpoint, rate limit) — fix that first, not the parsing.
3. In the HTTP Request node, set **Response Format** to "JSON" under Options so n8n handles conversion for you instead of you parsing manually in a Code node.
4. If you must parse manually in a **Code** node, wrap it in a try/catch so one bad response doesn't kill the whole run.
5. Log the raw text when parsing fails so you can see exactly what came back.

```javascript
for (const item of $input.all()) {
  try {
    item.json.parsed = JSON.parse(item.json.rawBody);
  } catch (err) {
    item.json.parseError = true;
    item.json.rawPreview = String(item.json.rawBody).slice(0, 200);
  }
}
return $input.all();
```

6. Re-run and inspect any items flagged with `parseError` to see what the API actually sent back.

## Drop-in fix

Paste this over your Code node's parsing logic — it safely handles JSON, HTML error pages, empty bodies, and already-parsed objects, and attaches a clear, human-readable error message instead of crashing.

```javascript
// Drop-in Code node: safe JSON parsing with helpful error messages
const results = [];

for (const item of $input.all()) {
  const raw = item.json.rawBody ?? item.json.data ?? item.json.body ?? item.json;

  // Already an object? Nothing to parse.
  if (raw && typeof raw === "object") {
    results.push({ json: { ...item.json, parsed: raw, parseError: null } });
    continue;
  }

  const text = raw == null ? "" : String(raw);

  if (text.trim().length === 0) {
    results.push({
      json: {
        ...item.json,
        parsed: null,
        parseError: "Response body was empty — check the API call that produced it.",
      },
    });
    continue;
  }

  if (text.trim().startsWith("<")) {
    results.push({
      json: {
        ...item.json,
        parsed: null,
        parseError: "Received HTML instead of JSON — likely an auth failure, wrong URL, or server error page.",
        rawPreview: text.slice(0, 300),
      },
    });
    continue;
  }

  try {
    const parsed = JSON.parse(text);
    results.push({ json: { ...item.json, parsed, parseError: null } });
  } catch (err) {
    results.push({
      json: {
        ...item.json,
        parsed: null,
        parseError: `Invalid JSON: ${err.message}`,
        rawPreview: text.slice(0, 300),
      },
    });
  }
}

return results;
```

Add a **Filter** node after this that keeps only items where `parseError` is `null`, and send the rest to a separate branch (e.g. Slack/email alert showing `rawPreview`) so bad responses are visible instead of silently breaking the workflow.

### Common mistake

Assuming an API always returns JSON, even on errors. Many APIs return HTML error pages for 500s, or plain-text messages for rate limits — parsing those as JSON is what triggers "Unexpected token," not a problem with your JSON.parse code itself.
