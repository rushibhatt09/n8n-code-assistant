---
title: Notion
category: integrations
tags: [notion, database, pages, api-key]
summary: Create and update Notion pages or database items automatically from n8n workflows.
---

Notion is a workspace/notes tool with databases that act like flexible spreadsheets. The **Notion node** in n8n can create new pages, update existing database items, or search your workspace.

## How to connect it

1. Go to notion.so/my-integrations and create a new **internal integration** to get an **Internal Integration Secret** (API key).
2. In Notion, open the specific database or page you want to automate, click **Share** (or **...** menu), and **Connect** your integration to it — n8n cannot see anything not explicitly shared with the integration.
3. In n8n, create a new credential of type **Notion API**.
4. Paste the Internal Integration Secret into the **API Key** field.
5. Save the credential.

## Example use case: create a new task in a Notion database

1. Add a **Webhook** or **Form Trigger** node to capture task details.
2. Add a **Notion** node, set **Resource** to `Database Page`, **Operation** to `Create`.
3. Choose the **Database** from the dropdown (only databases you shared with the integration appear).
4. Map each property: e.g. set the `Name` (title) property to `{{ $json.taskName }}` and a `Status` select property to `Not Started`.
5. Run the workflow — a new row/page appears in your Notion database.

Example property mapping expression:

```
Name (title): {{ $json.taskName }}
Due Date: {{ $json.dueDate }}
Priority (select): High
```

To update an existing page, use **Operation** `Update` and provide the **Page ID**, often obtained from a prior **Search** or **Get Many** operation.

**Common mistake:** Creating the integration but forgetting to click **Connect to integration** on the actual Notion page or database. Without this step, the Notion node will return an empty list or a "not found" error even though the API key is valid.
