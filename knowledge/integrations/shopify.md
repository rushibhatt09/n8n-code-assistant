---
title: Shopify
category: integrations
tags: [shopify, ecommerce, orders, webhook]
summary: Trigger workflows on new Shopify orders or products, and manage store data from n8n.
---

Shopify powers online stores. The **Shopify node** in n8n can create/read orders, products, and customers, while the **Shopify Trigger** node fires your workflow automatically when events like a new order happen.

## How to connect it

1. In your Shopify Admin, go to **Settings > Apps and sales channels > Develop apps**, create an app, and configure **Admin API access scopes** (e.g. `read_orders`, `write_products`).
2. Install the app to your store and copy the generated **Admin API access token**.
3. In n8n, create a new credential of type **Shopify API** (Access Token method), enter your **Shop Subdomain** (the part before `.myshopify.com`) and paste the **Access Token**.
4. Save the credential.

## Example use case: alert on every new order

1. Add a **Shopify Trigger** node as the workflow's start.
2. Select your credential and set **Topic** to `orders/create`.
3. Activate the workflow — n8n registers a webhook with Shopify automatically.
4. Add a **Slack** or **Google Sheets** node afterward to log or notify the order details.

```
New order #{{ $json.order_number }}: {{ $json.total_price }} {{ $json.currency }}
```

To fetch products manually, use the **Shopify node** with **Resource** `Product`, **Operation** `Get All`:

```json
{
  "limit": 50,
  "status": "active"
}
```

Test the connection with curl:

```bash
curl "https://your-shop.myshopify.com/admin/api/2024-01/orders.json" \
  -H "X-Shopify-Access-Token: shpat_yourtoken"
```

## Quick copy-paste version (no credential setup)

This approach puts your Shopify Admin API access token directly in the HTTP Request node instead of using n8n's Credential system — simplest for personal or local use, but anyone who can open this workflow can see the token, so don't share the workflow file with the token still in it.

```json
{
  "method": "GET",
  "url": "https://your-shop.myshopify.com/admin/api/2024-01/orders.json",
  "sendHeaders": true,
  "headerParameters": {
    "X-Shopify-Access-Token": "<YOUR_SHOPIFY_ACCESS_TOKEN>"
  }
}
```

Test it directly with curl before building the node:

```bash
curl "https://your-shop.myshopify.com/admin/api/2024-01/orders.json" \
  -H "X-Shopify-Access-Token: <YOUR_SHOPIFY_ACCESS_TOKEN>"
```

**Common mistake:** Requesting API scopes at app creation time that don't cover what your workflow needs later (e.g. forgetting `read_orders`). If a node returns a 403/permission error, go back into the custom app's configuration, add the missing scope, and reinstall the app.
