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

## Common mistake

Creating a new credential every time instead of reusing one — this clutters your credentials list and makes key rotation painful. Create one credential per provider account, name it clearly (e.g. "Company OpenAI Key"), and reuse it across all workflows. Also, mixing up which node you dragged in (OpenAI Chat Model vs. a generic "OpenAI" node meant for other OpenAI features) is a frequent source of connection errors — make sure you use the node from the **LangChain / AI** category specifically labeled "Chat Model."
