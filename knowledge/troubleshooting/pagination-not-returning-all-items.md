---
title: HTTP Request Pagination Only Returns the First Page
category: troubleshooting
tags: [pagination, http-request, api-limits, loops]
summary: Fix HTTP Request pagination that stops after page one by correctly configuring the node's Pagination options.
---

## Only getting the first page / first 10-100 results, even though the API has more

Most APIs cap how many records they return in a single call (a "page") and expect you to ask for more using something like a `page` number, an `offset`, or a `cursor`/`next_token` value from the previous response. If the **HTTP Request** node's Pagination settings aren't configured — or aren't configured for how *this specific* API paginates — n8n just makes one request, gets page one, and stops, because nothing told it to keep going.

### How to fix it

1. Open the **HTTP Request** node and check the API's documentation for how it paginates: query parameter (`?page=2`), offset (`?offset=100`), or a cursor/token returned in the response body.
2. In the node, enable **Options > Pagination**.
3. Set **Pagination Mode**:
   - "Update a Parameter in Each Request" for page/offset-based APIs.
   - "Response Contains Next URL" if the API gives you a full next-page link.
4. Set the **Continue** condition — usually "Until a field is empty" (e.g. stop when `next_cursor` is null) or a fixed number of pages.
5. Map the parameter that needs to increment or update, using an expression that reads the previous response.

```json
// Example: offset-based pagination
{
  "parameters": {
    "offset": "={{ $pageCount * 100 }}"
  },
  "paginationCompleteWhen": "responseIsEmpty"
}
```

```json
// Example: cursor-based pagination
{
  "parameters": {
    "cursor": "={{ $response.body.next_cursor }}"
  },
  "paginationCompleteWhen": "expression",
  "completeExpression": "={{ $response.body.next_cursor === null }}"
}
```

6. Test with "Execute step" and confirm the **Items** count in the output matches the total the API reports, not just one page's worth.

### Common mistake

Leaving Pagination turned off entirely and instead trying to loop the whole node manually with Split In Batches — this usually only re-sends the same first-page request instead of advancing the page/offset value, since nothing updates the parameter between calls.
