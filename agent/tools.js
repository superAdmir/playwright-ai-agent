module.exports = [
  {
    name: "navigate",
    description: "Navigate to a URL in the browser",
    parameters: {
      url: "string (the URL to navigate to)"
    }
  },
  {
    name: "click",
    description: "Click an element on the page by CSS selector",
    parameters: {
      selector: "string (CSS or text selector of the element to click)"
    }
  },
  {
    name: "type",
    description: "Type text into an input element by selector",
    parameters: {
      selector: "string (CSS or text selector of the input field)",
      text: "string (text to type into the input)"
    }
  },
  {
    name: "get_dom",
    description: "Get the full HTML DOM of the current page",
    parameters: {}
  },
  {
    name: "screenshot",
    description: "Take a screenshot of the current page",
    parameters: {}
  },
  {
    name: "close",
    description: "Close the browser",
    parameters: {}
  }
];