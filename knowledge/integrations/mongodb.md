---
title: MongoDB
category: integrations
tags: [mongodb, database, nosql, documents]
summary: Find, insert, and update documents in a MongoDB collection from n8n.
---

MongoDB stores data as flexible JSON-like "documents" instead of rows and columns. The **MongoDB node** in n8n lets you query, insert, and update these documents directly.

## How to connect it

1. Get your MongoDB **Connection String** — from MongoDB Atlas, go to **Connect > Drivers**, and copy the URI (looks like `mongodb+srv://user:password@cluster.mongodb.net`).
2. In n8n, create a new credential of type **MongoDB**.
3. Choose **Connection String** as the configuration type and paste the URI (or fill in **Host**, **Port**, **Database**, **User**, **Password** individually if not using Atlas).
4. Save — n8n will verify it can reach the database.

## Example use case: insert a new event document

1. Add a **Webhook** node to receive event data.
2. Add a **MongoDB** node, select your credential, set **Operation** to `Insert`.
3. Set **Collection** to the target collection name (e.g. `events`).
4. Provide the fields to insert, either via the UI field mapper or as raw JSON in **Fields**.

```json
{
  "eventType": "signup",
  "userId": "{{ $json.userId }}",
  "timestamp": "{{ $now.toISO() }}"
}
```

To find documents, use **Operation** `Find` with a query:

```json
{
  "status": "active"
}
```

To update a document, use **Operation** `Update`, with a query to match the document and an update object:

```json
{ "query": { "_id": "{{ $json.id }}" }, "update": { "$set": { "status": "closed" } } }
```

## Quick copy-paste version (connection string method)

MongoDB needs connection details (host, port, database name, user, password) rather than a single API key, and the fastest way to fill them in is a single connection string — copy the block below and swap in your real values.

```text
# Option A: MongoDB Atlas (recommended) — single connection string
mongodb+srv://<YOUR_DB_USER>:<YOUR_DB_PASSWORD>@<YOUR_CLUSTER_HOST>/<YOUR_DB_NAME>

# Option B: self-hosted MongoDB — individual fields
Host:     <YOUR_DB_HOST>
Port:     <YOUR_DB_PORT>       (default: 27017)
Database: <YOUR_DB_NAME>
User:     <YOUR_DB_USER>
Password: <YOUR_DB_PASSWORD>
```

Once connected, here's a realistic example find query:

```json
{
  "status": "active",
  "createdAt": { "$gte": "2026-06-01T00:00:00Z" }
}
```

**Common mistake:** Forgetting that MongoDB document IDs (`_id`) are `ObjectId` values, not plain strings. When matching by ID, ensure the node's query correctly interprets the string as an ObjectId — otherwise the Find/Update will return zero matches even though the record exists.
