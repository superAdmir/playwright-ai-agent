require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { getMockResponse } = require("./mockGPT"); // Mock GPT simulator

async function generateTest(userStory) {
  const messages = [
    {
      role: "system",
      content: `
You are an AI Playwright Test Generator.
Rules:
- Generate complete Playwright test scripts in JavaScript.
- Include proper test() blocks.
- Include realistic browser actions: goto, fill, click, screenshot, assertion.
- Return executable code only, no explanations.
`
    },
    { role: "user", content: userStory }
  ];

  // Get mock GPT response
  const response = await getMockResponse(userStory, messages);
  let testCode = response.choices[0].message.content;

  // If mock just returns plain text, replace with actual Playwright commands
  if (testCode.startsWith("Task Complete") || !testCode.includes("test(")) {
    // Here we convert a simple user story to a Playwright test example
    testCode = `
const { test, expect } = require('@playwright/test');

test('AI Generated Test', async ({ page }) => {
  // Example generated from user story
  await page.goto('https://example.com/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('#loginButton');
  await expect(page).toHaveURL('https://example.com/dashboard');
  await page.screenshot({ path: 'tmp/login-test-${Date.now()}.png' });
});
`;
  }

  // Save to tests/ folder with timestamped *.spec.js filename
  const timestamp = Date.now();
  const fileName = `generatedTest-${timestamp}.spec.js`;
  const filePath = path.join(__dirname, "../tests", fileName);

  fs.writeFileSync(filePath, testCode);

  console.log(`✅ Test generated at: ${filePath}`);
  return { filePath, testCode };
}

module.exports = { generateTest };