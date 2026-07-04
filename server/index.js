require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const Fuse = require('fuse.js');

const { loadArticles } = require('./knowledgeBase');
const { askClaude } = require('./llm');

const app = express();
const PORT = process.env.PORT || 4477;

app.use(cors());
app.use(express.json());
app.use(
  express.static(path.join(__dirname, '..', 'public'), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => res.setHeader('Cache-Control', 'no-store'),
  })
);

let articles = loadArticles();
let fuse = buildIndex(articles);

function buildIndex(list) {
  return new Fuse(list, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'tags', weight: 0.3 },
      { name: 'content', weight: 0.2 },
    ],
    threshold: 0.38,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

function reload() {
  articles = loadArticles();
  fuse = buildIndex(articles);
}

app.get('/api/categories', (req, res) => {
  const counts = {};
  for (const a of articles) counts[a.category] = (counts[a.category] || 0) + 1;
  res.json(counts);
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim();
  const category = req.query.category;

  let results;
  if (!q) {
    results = articles;
  } else {
    results = fuse.search(q).map((r) => r.item);
  }
  if (category) {
    results = results.filter((a) => a.category === category);
  }

  res.json(
    results.slice(0, 40).map((a) => ({
      slug: a.slug,
      category: a.category,
      title: a.title,
      tags: a.tags,
      summary: a.summary,
    }))
  );
});

app.get('/api/article/:slug(*)', (req, res) => {
  const article = articles.find((a) => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: 'not_found' });
  res.json(article);
});

app.post('/api/ask', async (req, res) => {
  const question = (req.body.question || '').trim();
  if (!question) return res.status(400).json({ error: 'missing_question' });

  const contextArticles = fuse.search(question).slice(0, 5).map((r) => r.item);

  try {
    const answer = await askClaude({ question, contextArticles });
    res.json({
      answer,
      sources: contextArticles.map((a) => ({ slug: a.slug, title: a.title, category: a.category })),
    });
  } catch (err) {
    if (err.code === 'missing_api_key') {
      return res.status(400).json({
        error: 'missing_api_key',
        message:
          'No Anthropic API key configured. Add ANTHROPIC_API_KEY to your .env file to enable Ask AI. You can still use search below.',
      });
    }
    console.error(err);
    res.status(500).json({ error: 'server_error', message: 'Something went wrong asking the AI. Check the server logs.' });
  }
});

app.post('/api/reload', (req, res) => {
  reload();
  res.json({ ok: true, count: articles.length });
});

app.listen(PORT, () => {
  console.log(`n8n Code Assistant running at http://localhost:${PORT}`);
  console.log(`Loaded ${articles.length} knowledge base articles.`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('NOTE: ANTHROPIC_API_KEY not set — Ask AI will be disabled until you add one to .env');
  }
});
