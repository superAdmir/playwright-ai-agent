const tools = require('./tools');

tools.forEach(tool => {
  console.log(`${tool.name} → ${tool.description}`);
  console.log("Parameters:", tool.parameters);
  console.log('------------------------');
});