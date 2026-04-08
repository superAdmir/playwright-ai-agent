#!/usr/bin/env node
require("dotenv").config();
const { runAgent } = require("./agent/agent");
const { generateTest } = require("./agent/testGenerator");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ Usage: node cli.js <task OR generate-test> \"<your input>\"");
  process.exit(1);
}

// Check if user wants to generate test
if (args[0] === "generate-test") {
  const userStory = args.slice(1).join(" ");
  (async () => {
    console.log(`🧪 Generating Playwright test for: "${userStory}"`);
    try {
      const { filePath } = await generateTest(userStory);
      console.log(`✅ Test generated at: ${filePath}`);
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  })();
} else {
  // Default: run AI agent task
  const task = args.join(" ");
  (async () => {
    console.log(`🤖 Running AI Agent for task: "${task}"`);
    try {
      const result = await runAgent(task);
      console.log("\n✅ Task Result:");
      console.log(result);
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  })();
}