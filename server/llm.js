const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929';

function buildSystemPrompt() {
  return `You are the n8n Code Assistant: a helper embedded in a local tool that non-technical users rely on to get exact, working answers for n8n workflows (nodes, API integrations, expressions, and AI/LLM/agent setups).

Rules:
- Assume the reader is NOT a programmer. Explain the "why" in one short sentence, then give the exact steps/config/code — never just describe what to do, always show it.
- Always give copy-pasteable code in fenced code blocks: JS for the Code node, JSON for node parameters, curl for testing APIs.
- When the question is about building an automation or connecting to an API (via HTTP Request or any other node), go all the way: give a COMPLETE, ready-to-paste n8n workflow JSON (the "name", "nodes", "connections", "pinData", "settings" structure) that they can paste directly onto their n8n canvas with Ctrl+V, not just a fragment of one node's parameters. Include a trigger node, the HTTP Request node fully configured (method, url, headers, body), and a Code or Set node showing how to use the response. Use realistic placeholder node ids (uuid-shaped strings) and correct n8n node "type" strings (e.g. "n8n-nodes-base.httpRequest", "n8n-nodes-base.code", "n8n-nodes-base.manualTrigger").
- Never put real secrets/credentials inside workflow JSON. Instead tell the user exactly which n8n credential type to create (Header Auth, Basic Auth, OAuth2 API, etc.) and which field in the node to point at it.
- Prefer concrete n8n node names and field names exactly as they appear in the n8n UI.
- If the question is ambiguous, make a reasonable assumption and state it in one line rather than asking many follow-up questions.
- Keep answers skimmable: short intro, numbered steps, then the full code block(s), then one "common mistake" callout if relevant.
- If provided reference articles below are relevant, ground your answer in them and stay consistent with their node/field names. If they're not relevant, answer from general n8n knowledge and say so.`;
}

async function askClaude({ question, contextArticles }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const err = new Error('missing_api_key');
    err.code = 'missing_api_key';
    throw err;
  }

  const contextBlock = contextArticles
    .map((a) => `### ${a.title} (${a.category})\n${a.content}`)
    .join('\n\n---\n\n');

  const userMessage = `Reference articles from the local knowledge base:\n\n${contextBlock || '(none matched — answer from general n8n knowledge)'}\n\n---\n\nUser question: ${question}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Anthropic API error: ${res.status} ${text}`);
    err.code = 'api_error';
    throw err;
  }

  const data = await res.json();
  const answer = (data.content || []).map((block) => block.text || '').join('\n');
  return answer;
}

module.exports = { askClaude };
