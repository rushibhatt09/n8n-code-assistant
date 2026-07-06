---
title: Postgres & MySQL
category: integrations
tags: [postgres, mysql, database, sql]
summary: Run safe, parameterized SQL queries against Postgres or MySQL databases from n8n.
---

n8n has dedicated **Postgres** and **MySQL** nodes for running SQL queries directly against your database — useful for reading records, inserting data, or updating rows without needing an intermediate API.

## How to connect it

1. Create a new credential of type **Postgres** or **MySQL** (match your database type).
2. Fill in **Host**, **Database**, **User**, **Password**, and **Port** (default `5432` for Postgres, `3306` for MySQL).
3. If your database requires it, enable **SSL** and choose the appropriate SSL mode.
4. Save — n8n will test the connection automatically.

## Example use case: insert a new customer record safely

1. Add a **Webhook** node to receive new customer data.
2. Add a **Postgres** (or **MySQL**) node, set **Operation** to `Execute Query`.
3. Write your SQL using **parameterized query syntax** — never paste user input directly into the query string, since that risks SQL injection.

```sql
INSERT INTO customers (name, email, created_at)
VALUES ($1, $2, NOW())
```

With **Query Parameters** set to:

```
{{ $json.name }}, {{ $json.email }}
```

(For MySQL, use `?` placeholders instead of `$1`, `$2` in the same order as your parameters.)

To read rows, you can also use the node's **Select** operation with a table picker, or run:

```sql
SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC LIMIT 20
```

## Quick copy-paste version (connection string method)

Database nodes need a set of connection details (host, port, database name, user, password) instead of a single API key — fill in the fields below with your real values and you're connected, no need to look up separate setup steps.

```text
Host:     <YOUR_DB_HOST>
Port:     <YOUR_DB_PORT>       (Postgres default: 5432, MySQL default: 3306)
Database: <YOUR_DB_NAME>
User:     <YOUR_DB_USER>
Password: <YOUR_DB_PASSWORD>
SSL:      enable if your provider requires it
```

Once connected, here's a realistic example query you can drop straight into the node:

```sql
SELECT customer_id, name, email
FROM customers
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

**Common mistake:** Building the SQL string manually with expressions like `WHERE email = '{{ $json.email }}'` instead of using parameters. This is vulnerable to SQL injection and can break if the value contains a quote character — always use the node's **Query Parameters** field for any user-supplied values.
