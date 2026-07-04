---
title: Google Sheets
category: integrations
tags: [google-sheets, spreadsheet, database, oauth]
summary: Read, append, and update rows in a Google Sheet using n8n's Google Sheets node.
---

The **Google Sheets node** lets n8n treat a spreadsheet like a simple database — great for logging form submissions, tracking orders, or reading a list of data to loop through.

## How to connect it

1. Create a new credential of type **Google Sheets OAuth2 API**.
2. Click **Sign in with Google** and grant access to your Google account (requires Google Cloud OAuth credentials to already be set up in n8n).
3. Save the credential — it will now appear as an option in the Google Sheets node.

## Example use case: append a new row when an order comes in

1. Add a **Webhook** node to receive order data.
2. Add a **Google Sheets** node, select your saved credential.
3. Set **Resource** to `Sheet within Document`, **Operation** to `Append Row`.
4. Choose the **Document** (spreadsheet) from the dropdown or paste its URL/ID, then choose the **Sheet** (tab name).
5. Map each column to a value using expressions, e.g. Column `Name` = `{{ $json.customerName }}`.
6. Run the workflow — a new row appears in the sheet.

To **read** rows instead, set **Operation** to `Get Row(s)`, and optionally add a filter:

```
Column: Status
Value: {{ "Pending" }}
```

To **update** a row, set **Operation** to `Update Row`, and specify the matching column (e.g. `Order ID`) so n8n knows which row to overwrite.

Example expression to build a row object dynamically:

```json
{
  "Order ID": "{{ $json.id }}",
  "Customer": "{{ $json.customer.name }}",
  "Total": "{{ $json.total }}"
}
```

**Common mistake:** Selecting the wrong **Sheet** (tab) — a Google Sheets file can have multiple tabs, and the node only reads/writes to the one tab you select, not the whole spreadsheet. Double-check the tab name matches exactly, including capitalization.
