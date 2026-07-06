---
title: Prompt Engineering Basics for n8n
category: ai-llm
tags: [prompt-engineering, system-message, best-practices]
summary: Plain-English tips for writing system prompts and messages that get reliable results from n8n's AI nodes.
---

The **System Message** field (found in AI Agent, Basic LLM Chain, and Chat Model options) sets the AI's role, tone, and rules before it sees any user input. Getting this right is the single biggest lever for reliable AI behavior in your workflows — better than switching models or tweaking temperature.

## Setup steps

1. Open the **Options** section of your AI Agent or Basic LLM Chain node and find **System Message**.
2. State the role clearly: "You are a [role] that does [task] for [audience]."
3. List concrete rules or constraints as short bullet-style sentences (tone, length limits, what NOT to do).
4. If the output feeds into another system, specify the exact format expected (or better, use a **Structured Output Parser** — see that topic).
5. Give 1–2 examples of good input/output pairs if the task is nuanced (this is called "few-shot" prompting).
6. Keep the user-facing **Prompt** field focused only on the actual request/data — put stable instructions in the System Message, not repeated in every prompt.
7. Test with edge cases (empty input, rude input, off-topic questions) and adjust the system message to handle them.

```
You are a customer support assistant for Dermatouch, a skincare brand.

Rules:
- Only answer questions about orders, shipping, and product ingredients.
- If asked about anything else, politely say you can only help with those topics.
- Keep replies under 4 sentences.
- Never invent an order status — always use the order lookup tool.
- If you are not confident in an answer, say "Let me check with the team" instead of guessing.
```

## Ready-to-paste example

This workflow runs a Basic LLM Chain with a detailed, rule-based system prompt so replies stay on-topic and consistently formatted.

```json
{
  "name": "Support Reply With Detailed System Prompt",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-0110-4890-abcd-ef1234567890",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [220, 300]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.customerMessage }}",
        "options": {
          "systemMessage": "You are a customer support assistant for Dermatouch, a skincare brand.\n\nRules:\n- Only answer questions about orders, shipping, and product ingredients.\n- If asked about anything else, politely say you can only help with those topics.\n- Keep replies under 4 sentences.\n- Never invent an order status — always use the order lookup tool.\n- <PLACEHOLDER: add any brand-specific tone or escalation rules here>"
        }
      },
      "id": "b2c3d4e5-0121-4901-bcde-f12345678901",
      "name": "Basic LLM Chain",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.5,
      "position": [440, 300]
    },
    {
      "parameters": {
        "model": "gpt-4o-mini",
        "options": {
          "temperature": 0.4
        }
      },
      "id": "c3d4e5f6-0132-4012-cdef-123456789012",
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [440, 500],
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "OpenAi account"
        }
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "Basic LLM Chain", "type": "main", "index": 0 }]]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "Basic LLM Chain", "type": "ai_languageModel", "index": 0 }]]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common mistake

Writing a system message that's too long or crams in unrelated instructions — models tend to follow the first and last few rules best and can "forget" rules buried in the middle of a huge block of text. Keep system messages focused, use short bullet points, and put your most important rule first and your most important formatting instruction last.
