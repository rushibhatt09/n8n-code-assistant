const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const KB_ROOT = path.join(__dirname, '..', 'knowledge');

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function loadArticles() {
  const files = walk(KB_ROOT);
  return files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const relative = path.relative(KB_ROOT, filePath).replace(/\\/g, '/');
    const category = relative.split('/')[0];
    const slug = relative.replace(/\.md$/, '');
    return {
      slug,
      category,
      title: data.title || slug,
      tags: data.tags || [],
      summary: data.summary || content.trim().split('\n')[0].slice(0, 160),
      content: content.trim(),
    };
  });
}

module.exports = { loadArticles };
