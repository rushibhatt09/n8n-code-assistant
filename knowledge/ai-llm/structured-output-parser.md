---
title: Structured Output Parser
category: ai-llm
tags: [structured-output, json-schema, parser, langchain]
summary: Forces an AI node's reply into valid JSON matching a schema you define, instead of free-form text.
---

By default, AI models reply with plain text, which is hard to use reliably in later workflow steps (e.g. an IF node checking a field). The **Structured Output Parser** node forces the model to return JSON that matches a shape you specify, so downstream nodes can read fields like `{{ $json.output.category }}` reliably every time.

## Setup steps

1. Add a **Structured Output Parser** node.
2. Connect it to the **Output Parser** input of your **Basic LLM Chain** or **AI Agent** node.
3. In the Structured Output Parser, choose **Define below (JSON Schema)** or **Generate from JSON Example** — the example option is easier for non-technical users.
4. Paste a sample JSON object showing the exact shape you want back.
5. In your AI Agent/Chain node, make sure the prompt or system message tells the model it must return data matching that structure (n8n appends parsing instructions automatically, but a clear prompt helps).
6. Run the node and check that `output` in the result is a real JSON object, not a string.

```json
{
  "parameters": {
    "jsonSchemaExample": "{\n  \"category\": \"billing\",\n  \"urgent\": true,\n  \"summary\": \"Customer wants a refund for order #1234\"\n}"
  },
  "type": "@n8n/n8n-nodes-langchain.outputParserStructured",
  "typeVersion": 1.2
}
```

Example system prompt to pair with it:

```
You are a support ticket classifier. Read the customer message and
respond with the category, whether it is urgent, and a one-sentence summary.
```

## Ready-to-paste example

This workflow classifies an incoming support message into a fixed JSON shape (category, urgency, summary) using a Basic LLM Chain and a Structured Output Parser.

```json
{
  "name": "Classify Support Ticket",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-0011-4890-abcd-ef1234567890",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [220, 300]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=You are a support ticket classifier. Read this customer message and classify it: {{ $json.customerMessage }}",
        "options": {
          "systemMessage": "You are a support ticket classifier. Read the customer message and respond with the category, whether it is urgent, and a one-sentence summary.",
          "hasOutputParser": true
        }
      },
      "id": "b2c3d4e5-0022-4901-bcde-f12345678901",
      "name": "Basic LLM Chain",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.5,
      "position": [440, 300]
    },
    {
      "parameters": {
        "model": "gpt-4o-mini",
        "options": {
          "temperature": 0.2
        }
      },
      "id": "c3d4e5f6-0033-4012-cdef-123456789012",
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [340, 500],
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "jsonSchemaExample": "{\n  \"category\": \"billing\",\n  \"urgent\": true,\n  \"summary\": \"Customer wants a refund for order #1234\"\n}"
      },
      "id": "d4e5f6a7-0044-4123-def0-234567890123",
      "name": "Structured Output Parser",
      "type": "@n8n/n8n-nodes-langchain.outputParserStructured",
      "typeVersion": 1.2,
      "position": [540, 500]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "Basic LLM Chain", "type": "main", "index": 0 }]]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "Basic LLM Chain", "type": "ai_languageModel", "index": 0 }]]
    },
    "Structured Output Parser": {
      "ai_outputParser": [[{ "node": "Basic LLM Chain", "type": "ai_outputParser", "index": 0 }]]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common mistake

Forgetting that adding a Structured Output Parser to an **AI Agent** node also requires enabling "Require Specific Output Format" in the agent's options — without it, the agent may still return plain text and the parser will throw a parsing error. Also, overly complex nested schemas make small/cheaper models fail to comply; keep the schema as flat and simple as the task allows.
