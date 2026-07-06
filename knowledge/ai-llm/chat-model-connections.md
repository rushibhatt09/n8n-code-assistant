---
title: Chat Model Connections (OpenAI vs Anthropic vs Others)
category: ai-llm
tags: [chat-model, openai, anthropic, credentials, api-key]
summary: How to pick and connect a Chat Model node (OpenAI, Anthropic, etc.) and set up its API key credential.
---

Every AI Agent or Basic LLM Chain needs a "brain" plugged into its Chat Model input. n8n offers separate nodes per provider — **OpenAI Chat Model**, **Anthropic Chat Model**, and others like Google Gemini or Azure OpenAI Chat Model. They all do the same job (generate text) but use different providers, models, and pricing, so pick based on which API key/account you have.

## Setup steps

1. Decide which provider you have an account and API key for (OpenAI, Anthropic, etc.).
2. Drag the matching node onto the canvas: **OpenAI Chat Model** or **Anthropic Chat Model**.
3. Connect it to the **Chat Model** input of your AI Agent or Basic LLM Chain node.
4. Click the node's **Credential** dropdown and choose **Create New Credential**.
5. Paste your API key (from platform.openai.com or console.anthropic.com) into the credential form and save.
6. In the node's **Model** dropdown, pick the specific model, e.g. `gpt-4o-mini` or `claude-sonnet-4-5`.
7. Adjust **Temperature** (lower = more predictable, higher = more creative) and **Max Tokens** if needed.

```json
{
  "parameters": {
    "model": "claude-sonnet-4-5",
    "options": {
      "temperature": 0.3
    }
  },
  "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
  "typeVersion": 1,
  "credentials": {
    "anthropicApi": {
      "id": "1",
      "name": "Anthropic account"
    }
  }
}
```

## Ready-to-paste example

This workflow shows an AI Agent wired to an Anthropic Chat Model — swap the "Chat Model" connection to the OpenAI node instead if you'd rather use that provider (both nodes are included so you can compare).

```json
{
  "name": "Chat Model Comparison",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-4444-4890-abcd-ef1234567890",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [220, 300]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.chatInput }}",
        "options": {
          "systemMessage": "You are a helpful assistant."
        }
      },
      "id": "b2c3d4e5-5555-4901-bcde-f12345678901",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [440, 300]
    },
    {
      "parameters": {
        "model": "claude-sonnet-4-5",
        "options": {
          "temperature": 0.3
        }
      },
      "id": "c3d4e5f6-6666-4012-cdef-123456789012",
      "name": "Anthropic Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "typeVersion": 1,
      "position": [340, 500],
      "credentials": {
        "anthropicApi": {
          "id": "1",
          "name": "Anthropic account"
        }
      }
    },
    {
      "parameters": {
        "model": "gpt-4o-mini",
        "options": {
          "temperature": 0.3
        }
      },
      "id": "d4e5f6a7-7777-4123-def0-234567890123",
      "name": "OpenAI Chat Model (alternative, not connected)",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.2,
      "position": [540, 500],
      "credentials": {
        "openAiApi": {
          "id": "2",
          "name": "OpenAi account"
        }
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "Anthropic Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Common mistake

Creating a new credential every time instead of reusing one — this clutters your credentials list and makes key rotation painful. Create one credential per provider account, name it clearly (e.g. "Company OpenAI Key"), and reuse it across all workflows. Also, mixing up which node you dragged in (OpenAI Chat Model vs. a generic "OpenAI" node meant for other OpenAI features) is a frequent source of connection errors — make sure you use the node from the **LangChain / AI** category specifically labeled "Chat Model."
