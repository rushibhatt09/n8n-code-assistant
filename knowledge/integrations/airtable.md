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

**Common mistake:** Using field names that don't exactly match the column names in Airtable (including spelling and capitalization) — the node will silently fail to set that field or throw an "unknown field" error. Copy field names directly from the Airtable table header.
