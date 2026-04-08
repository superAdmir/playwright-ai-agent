require("dotenv").config();
const OpenAI = require("openai");
const toolsLib = require("../tools/playwrightTools");
const tools = require("./tools");

// ======= OPENAI CLIENT =======
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ======= MOCK GPT (for offline testing) =======
const { getMockResponse } = require("./mockGPT"); 

// Toggle: true = use mock, false = use real API
const USE_MOCK = true;

async function runAgent(task) {
  await toolsLib.init(); // Launch browser

  let messages = [
    {
      role: "system",
      content: `
You are an advanced Playwright AI agent.
Rules:
- Always use the provided tools to interact with the browser
- If selector unknown → call get_dom to retrieve page DOM
- Prefer text or CSS selectors
- Retry on failure
`
    },
    { role: "user", content: task }
  ];

  while (true) {
    let response;
    
    try {
      if (USE_MOCK) {
        // ======= USE MOCK GPT =======
        response = await getMockResponse(task, messages);
      } else {
        // ======= USE REAL OPENAI =======
        response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          tools
        });
      }
    } catch (err) {
      if (err.code === "insufficient_quota" || err.status === 429) {
        console.warn("⚠️ Rate limit / quota hit. Retrying in 5 seconds...");
        await new Promise(r => setTimeout(r, 5000)); // wait 5s
        continue; // retry
      } else {
        console.error("❌ GPT Error:", err.message);
        await toolsLib.close();
        throw err;
      }
    }

    const msg = response.choices[0].message;

    // If GPT gives no tool calls, assume task is complete
    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      console.log("✅ Task Complete:", msg.content);
      await toolsLib.close();
      return msg.content;
    }

    // Execute tool calls
    for (const call of msg.tool_calls) {
      const name = call.function.name;
      const args = JSON.parse(call.function.arguments || "{}");

      let result;

      try {
        switch (name) {
          case "navigate":
            result = await toolsLib.navigate(args);
            break;
          case "click":
            result = await toolsLib.click(args);
            break;
          case "type":
            result = await toolsLib.type(args);
            break;
          case "get_dom":
            result = await toolsLib.getDOM();
            break;
          case "screenshot":
            result = await toolsLib.screenshot();
            break;
          case "close":
            result = await toolsLib.close();
            break;
          default:
            result = `ERROR: Unknown tool ${name}`;
        }
      } catch (e) {
        result = `ERROR executing ${name}: ${e.message}`;
      }

      // Send result back to GPT
      messages.push({
        role: "tool",
        name,
        content: result
      });
    }
  }
}

module.exports = { runAgent };