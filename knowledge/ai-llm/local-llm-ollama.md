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

## Common mistake

Running n8n in the cloud (e.g. n8n.cloud) while Ollama only runs on your local laptop — the cloud instance cannot reach `localhost` on your machine, so the connection will fail. Ollama needs to be reachable at a network address n8n can actually access; for cloud n8n, that usually means hosting Ollama on a server with a public or VPN-accessible address.
