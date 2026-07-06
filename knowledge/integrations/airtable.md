---
title: Airtable
category: integrations
tags: [airtable, database, records, api-key]
summary: Read, create, and update records in Airtable bases and tables from n8n.
---

Airtable is a spreadsheet-database hybrid organized into **bases** (like a project), **tables** (like sheets), and **records** (like rows). The **Airtable node** in n8n lets you automate reading and writing that data.

## How to connect it

1. In Airtable, go to your account's **Developer Hub** (or create a **Personal Access Token** at airtable.com/create/tokens).
2. Give the token access (scopes) to `data.records:read` and `data.records:write`, and add the specific bases it should access.
3. In n8n, create a new credential of type **Airtable Personal Access Token API** (previously "Airtable API" with an API key — tokens are the current method).
4. Paste the token into the **Access Token** field and save.

## Example use case: log a new customer record

1. Add a **Webhook** node to receive customer signup data.
2. Add an **Airtable** node, select your credential.
3. Set **Base** by choosing it from the dropdown, then set **Table** the same way.
4. Set **Operation** to `Create`, and map fields: e.g. `Name` = `{{ $json.name }}`, `Email` = `{{ $json.email }}`.
5. Run the workflow — a new record appears in the Airtable table.

To search/read records, use **Operation** `Search`, with a **Filter By Formula** like:

```
{Email} = "{{ $json.email }}"
```

To update a record, use **Operation** `Update` and supply the **Record ID** (obtained from a prior Search or List operation).

Example field mapping as JSON:

```json
{
  "Name": "Jane Doe",
  "Email": "jane@example.com",
  "Status": "New"
}
```

## Quick copy-paste version (no credential setup)

If you'd rather not use n8n's Credential system, you can hardcode your Airtable Personal Access Token directly into an **HTTP Request** node's headers — simplest for personal/local use, but anyone who opens this workflow file can read the token in plain text, so don't share or upload it while the real token is still in there.

```json
{
  "method": "POST",
  "url": "https://api.airtable.com/v0/<YOUR_BASE_ID>/<YOUR_TABLE_NAME>",
  "authentication": "none",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "Authorization", "value": "Bearer <YOUR_AIRTABLE_TOKEN>" },
      { "name": "Content-Type", "value": "application/json" }
    ]
  },
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": {
    "fields": {
      "Name": "Jane Doe",
      "Email": "jane@example.com",
      "Status": "New"
    }
  }
}
```

Test it from a terminal first to confirm the token, base ID, and table name work before building the node:

```bash
curl -X POST "https://api.airtable.com/v0/<YOUR_BASE_ID>/<YOUR_TABLE_NAME>" \
  -H "Authorization: Bearer <YOUR_AIRTABLE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"Name": "Jane Doe", "Email": "jane@example.com", "Status": "New"}}'
```

**Common mistake:** Using field names that don't exactly match the column names in Airtable (including spelling and capitalization) — the node will silently fail to set that field or throw an "unknown field" error. Copy field names directly from the Airtable table header.
