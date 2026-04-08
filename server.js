require("dotenv").config();
const express = require("express");
const { runAgent } = require("./agent/agent");
const { generateTest } = require("./agent/testGenerator");

const app = express();
app.use(express.json());

// ======= Run AI Agent Task =======
app.post("/run-task", async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "Task is required" });

  try {
    console.log("🤖 Running AI Agent for task:", task);
    const result = await runAgent(task);
    res.json({ status: "success", result });
  } catch (err) {
    console.error("❌ Error running agent:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ======= Generate Playwright Test =======
app.post("/generate-test", async (req, res) => {
  const { userStory } = req.body;
  if (!userStory) return res.status(400).json({ error: "userStory is required" });

  try {
    console.log("🧪 Generating Playwright test for:", userStory);
    const { filePath, testCode } = await generateTest(userStory);
    res.json({ status: "success", filePath, testCode });
  } catch (err) {
    console.error("❌ Error generating test:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ======= Start Server =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 AI Agent API running at http://localhost:${PORT}`);
});