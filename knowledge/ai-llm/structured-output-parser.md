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

## Common mistake

Forgetting that adding a Structured Output Parser to an **AI Agent** node also requires enabling "Require Specific Output Format" in the agent's options — without it, the agent may still return plain text and the parser will throw a parsing error. Also, overly complex nested schemas make small/cheaper models fail to comply; keep the schema as flat and simple as the task allows.
