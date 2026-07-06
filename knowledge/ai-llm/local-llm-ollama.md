---
title: Local LLM with Ollama
category: ai-llm
tags: [ollama, local-model, free, self-hosted]
summary: Run a free, local AI model with Ollama and connect it to n8n instead of paying for OpenAI or Anthropic.
---

**Ollama** is a free tool that runs open-source AI models (like Llama or Mistral) directly on your own computer or server — no per-request cost, no data leaving your machine. n8n has a dedicated **Ollama Chat Model** node so you can plug a local model into an AI Agent or Basic LLM Chain exactly like you would OpenAI or Anthropic. Good for testing, privacy-sensitive data, or cutting API costs, though local models are typically less capable than top paid models.

## Setup steps

1. Install Ollama on a machine (ollama.com) — this can be your own PC or a server n8n can reach over the network.
2. Pull a model from the command line, e.g. `ollama pull llama3.1`.
3. Confirm Ollama is running and listening (default `http://localhost:11434`).
4. In n8n, add an **Ollama Chat Model** node.
5. Create a credential pointing to your Ollama instance's **Base URL** (e.g. `http://localhost:11434`, or your server's address if n8n runs elsewhere/in the cloud).
6. Select the model name you pulled (must match exactly, e.g. `llama3.1`).
7. Connect it to the **Chat Model** input of an AI Agent or Basic LLM Chain node, same as any other provider.

```json
{
  "parameters": {
    "model": "llama3.1"
  },
  "type": "@n8n/n8n-nodes-langchain.lmChatOllama",
  "typeVersion": 1,
  "credentials": {
    "ollamaApi": {
      "id": "3",
      "name": "Local Ollama"
    }
  }
}
```

## Ready-to-paste example

This workflow sends a manual prompt to a locally-running Llama 3.1 model via Ollama through a Basic LLM Chain. Pull and start the model first:

```bash
ollama pull llama3.1
ollama serve
```

```json
{
  "name": "Local LLM Chain With Ollama",
  "nodes": [
    {
      "parameters": {},
      "id": "a1b2c3d4-00dd-4890-abcd-ef1234567890",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [220, 300]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.prompt }}",
        "options": {
          "systemMessage": "You are a helpful assistant running locally."
        }
      },
      "id": "b2c3d4e5-00ee-4901-bcde-f12345678901",
      "name": "Basic LLM Chain",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.5,
      "position": [440, 300]
    },
    {
      "parameters": {
        "baseUrl": "http://localhost:11434",
        "model": "llama3.1",
        "options": {
          "temperature": 0.5
        }
      },
      "id": "c3d4e5f6-00ff-4012-cdef-123456789012",
      "name": "Ollama Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOllama",
      "typeVersion": 1,
      "position": [440, 500],
      "credentials": {
        "ollamaApi": {
          "id": "3",
          "name": "Local Ollama"
        }
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "Basic LLM Chain", "type": "main", "index": 0 }]]
    },
    "Ollama Chat Model": {
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

Running n8n in the cloud (e.g. n8n.cloud) while Ollama only runs on your local laptop — the cloud instance cannot reach `localhost` on your machine, so the connection will fail. Ollama needs to be reachable at a network address n8n can actually access; for cloud n8n, that usually means hosting Ollama on a server with a public or VPN-accessible address.
