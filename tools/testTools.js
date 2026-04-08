const tools = require('./playwrightTools');

(async () => {
  await tools.init();
  console.log(await tools.navigate({ url: 'https://example.com' }));
  console.log(await tools.click({ selector: 'h1' }));
  console.log(await tools.type({ selector: 'input[name="q"]', text: 'playwright' }).catch(()=>{}));
  console.log(await tools.getDOM());
  console.log(await tools.screenshot());
  await tools.close();
})();