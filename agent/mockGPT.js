// Simulates GPT responses with tool calls for testing offline
async function getMockResponse(task, messages) {
  // Convert task to lowercase for simple matching
  const t = task.toLowerCase();

  const toolCalls = [];

  // Simple rules for mock responses
  if (t.includes("example.com")) {
    toolCalls.push({
      function: {
        name: "navigate",
        arguments: JSON.stringify({ url: "https://example.com" })
      }
    });
    toolCalls.push({
      function: {
        name: "screenshot",
        arguments: "{}"
      }
    });
    toolCalls.push({
      function: {
        name: "close",
        arguments: "{}"
      }
    });
  }

  // Example: simulate click and type on a login form
  if (t.includes("login")) {
    toolCalls.push({
      function: {
        name: "navigate",
        arguments: JSON.stringify({ url: "https://example.com/login" })
      }
    });
    toolCalls.push({
      function: {
        name: "type",
        arguments: JSON.stringify({ selector: "#username", text: "testuser" })
      }
    });
    toolCalls.push({
      function: {
        name: "type",
        arguments: JSON.stringify({ selector: "#password", text: "123456" })
      }
    });
    toolCalls.push({
      function: {
        name: "click",
        arguments: JSON.stringify({ selector: "#loginBtn" })
      }
    });
    toolCalls.push({
      function: {
        name: "screenshot",
        arguments: "{}"
      }
    });
  }

  // Default fallback for unknown tasks
  if (toolCalls.length === 0) {
    return {
      choices: [
        {
          message: {
            tool_calls: [],
            content: "Task Complete (mocked)"
          }
        }
      ]
    };
  }

  return {
    choices: [
      {
        message: {
          tool_calls: toolCalls,
          content: `Task Complete (mocked): ${task}`
        }
      }
    ]
  };
}

module.exports = { getMockResponse };