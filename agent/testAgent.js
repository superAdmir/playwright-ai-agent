const { runAgent } = require('./agent');

(async () => {
  await runAgent("Go to https://example.com and take a screenshot");
})();