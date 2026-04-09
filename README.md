# Playwright AI Agent

A complete framework that combines **Playwright**, **AI-assisted test generation**, and **self-healing locators** for automated browser testing. This project allows you to generate tests automatically, handle broken selectors, and execute tasks programmatically or via API.

---

## Table of Contents

1. Step 1 — Setup Project  
2. Step 2 — Install Dependencies  
3. Step 3 — Configure OpenAI / Mock GPT  
4. Step 4 — Basic Agent Execution  
5. Step 5 — Screenshot Example  
6. Step 6 — API Server  
7. Step 7 — CLI Tool  
8. Step 8 — AI Test Generator  
9. Step 9 — Self-Healing Locator  
10. Project Structure  

---

## Step 1 — Setup Project

```bash
mkdir playwright-ai-agent
cd playwright-ai-agent
npm init -y
mkdir agent tools tests tmp
```

---

## Step 2 — Install Dependencies

```bash
npm install playwright openai dotenv
npm install @playwright/test
```

---

## Step 3 — Configure OpenAI / Mock GPT

Create `.env` file:

```
OPENAI_API_KEY=sk-xxxxxxx
```

Mock GPT example:

```javascript
function getMockResponse(task, messages) {
  return {
    choices: [
      {
        message: {
          content: `Task Complete (mocked): ${task}`,
          tool_calls: []
        }
      }
    ]
  };
}
module.exports = { getMockResponse };
```

---

## Step 4 — Basic Agent Execution

```javascript
const { runAgent } = require('./agent');

(async () => {
  await runAgent("Go to example.com and take a screenshot");
})();
```

---

## Step 5 — Screenshot Example

Screenshots are saved in `/tmp`:

```javascript
await page.screenshot({ path: `tmp/screenshot-${Date.now()}.png` });
```

---

## Step 6 — API Server

```javascript
const express = require('express');
const { runAgent } = require('./agent/runAgent');

const app = express();
app.use(express.json());

app.post('/run-task', async (req, res) => {
  const { task } = req.body;
  const result = await runAgent(task);
  res.json({ result });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Step 7 — CLI Tool

```javascript
#!/usr/bin/env node
const { runAgent } = require('./agent/runAgent');

const task = process.argv.slice(2).join(' ');

if (!task) {
  console.error("Usage: node cli.js <task>");
  process.exit(1);
}

runAgent(task);
```

---

## Step 8 — AI Test Generator

```javascript
const { generateTestFile } = require('./tools/testGeneratorTool');

generateTestFile({
  task: "Test login page",
  output: "tests/generatedTest.js"
});
```

Run tests:

```bash
npx playwright test
```

---

## Step 9 — Self-Healing Locator

```javascript
async function findElement(selector, options = {}) {
  const { alternatives = [] } = options;

  if (await page.locator(selector).count() > 0) return page.locator(selector);

  for (const alt of alternatives) {
    if (await page.locator(alt).count() > 0) {
      console.warn(`Using alternative selector "${alt}"`);
      return page.locator(alt);
    }
  }

  const textLocator = page.locator(`text=${selector}`);
  if (await textLocator.count() > 0) return textLocator;

  throw new Error(`Element not found: ${selector}`);
}
```

---

## Project Structure

```
playwright-ai-agent/
├─ agent/
├─ tools/
├─ tests/
├─ tmp/
├─ server.js
├─ cli.js
├─ package.json
└─ .env
```

---

## Summary

- AI-powered automation  
- Self-healing locators  
- CLI + API execution  
- Screenshot support  
