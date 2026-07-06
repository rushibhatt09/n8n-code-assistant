---
title: Handling Binary Data and Files in n8n
category: concepts
tags: [binary-data, files, upload, download]
summary: How n8n passes files (images, PDFs, CSVs) between nodes as binary data alongside regular JSON.
---

Besides regular JSON data, n8n items can also carry "binary data" — actual files like images, PDFs, or spreadsheets. Binary data travels alongside the JSON on the same item, under a separate `binary` property, so a node can process the file itself, not just its metadata.

## How to work with files in the UI

1. To bring a file into a workflow, use a node that produces binary output, such as **HTTP Request** (downloading a file), **Read/Write Files from Disk**, or a trigger like **Webhook** (receiving an uploaded file) or **Google Drive**.
2. In the HTTP Request node, set **Response Format** to "File" (under Options) so the response is saved as binary data instead of being parsed as JSON.
3. Give the binary data a **Property Name** (default is `data`) — this is how later nodes will refer to it.
4. To send that file onward (e.g., attach it to an email, upload it to Slack, or write it to disk), select the same binary property name in the destination node's file field.
5. Use the **Move Binary Data** node to convert binary data to a JSON base64 string, or convert JSON/text into binary data.

## Example: referencing a binary file's info in an expression

```
{{ $binary.data.fileName }}
{{ $binary.data.mimeType }}
```

## Example: using the Code node with binary data

```javascript
const item = $input.first();

// Get the binary buffer for a property named "data"
const buffer = await this.helpers.getBinaryDataBuffer(0, 'data');

// Convert to text (e.g., for a CSV file)
const text = buffer.toString('utf-8');

return [{ json: { preview: text.slice(0, 200) }, binary: item.binary }];
```

## Ready-to-paste example

This complete workflow downloads a file from a URL as binary data and writes it to disk — import it via the n8n menu (three dots → Import from File/URL), then edit the URL and file path.

```json
{
  "name": "Download File and Save to Disk",
  "nodes": [
    {
      "parameters": {},
      "id": "1f9b6e3a-1111-4a2b-8c3d-000000000001",
      "name": "When clicking 'Execute workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "<FILE_DOWNLOAD_URL>",
        "options": {
          "response": {
            "response": {
              "responseFormat": "file",
              "outputPropertyName": "data"
            }
          }
        }
      },
      "id": "1f9b6e3a-1111-4a2b-8c3d-000000000002",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "operation": "write",
        "fileName": "<C:\\path\\to\\save\\downloaded-file.pdf>",
        "dataPropertyName": "data"
      },
      "id": "1f9b6e3a-1111-4a2b-8c3d-000000000003",
      "name": "Read/Write Files from Disk",
      "type": "n8n-nodes-base.readWriteFile",
      "typeVersion": 1,
      "position": [680, 300]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
      "main": [
        [
          { "node": "HTTP Request", "type": "main", "index": 0 }
        ]
      ]
    },
    "HTTP Request": {
      "main": [
        [
          { "node": "Read/Write Files from Disk", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": { "executionOrder": "v1" }
}
```

## Common mistake

Losing the binary data when passing items through a Code node. If you build a new return array and forget to copy over `binary: item.binary`, the file attachment disappears from that item going forward, even though the JSON still looks fine. Always explicitly carry the `binary` key forward when you touch an item in code.
