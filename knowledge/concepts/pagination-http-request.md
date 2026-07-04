---
title: Handling Pagination with the HTTP Request Node
category: concepts
tags: [http-request, pagination, api, loops]
summary: How to fetch every page of results from an API using the HTTP Request node's built-in pagination options.
---

Many APIs only return a limited number of results per call (e.g., 50 items) and expect you to request more "pages" to get the rest. The HTTP Request node has a built-in **Pagination** feature that automates this so you don't have to build a manual loop.

## Using built-in pagination

1. Add an HTTP Request node and set up your request as normal (URL, method, authentication).
2. Open **Options** and add the **Pagination** option.
3. Choose a pagination type:
   - **Update a Parameter in Each Request** — for APIs using a page number or offset/cursor in the query string.
   - **Response Contains Next URL** — for APIs that return a "next page" link directly in the response.
4. Set **Pagination Complete When** to define the stop condition, such as "the response body is empty" or "a specific field is empty/false."
5. Optionally set **Limit Pages Fetched** as a safety cap so it can't loop forever.
6. Turn on **Interval Between Requests** if the API needs a small delay between page fetches.

## Example: offset-based pagination

```
Query Parameters:
  limit: 50
  offset: {{ $pageCount * 50 }}

Pagination:
  Type: Update a Parameter in Each Request
  Parameter Name: offset
  Value: {{ $pageCount * 50 }}
  Pagination Complete When: Response body is empty array
```

## Example: manual loop alternative (when built-in pagination doesn't fit)

Use a **Loop Over Items (Split in Batches)** node combined with an **IF** node checking whether a "has more" flag is true, looping back to the HTTP Request node until it's false.

```javascript
// Code node: check if there's a next page
return [{ json: { hasMore: $json.next_cursor !== null } }];
```

## Common mistake

Forgetting to set **Pagination Complete When**, which can cause n8n to keep requesting pages forever (or until it hits an error) because it never knows when to stop. Always define a clear stop condition, and add a page limit as a backup safety net.
