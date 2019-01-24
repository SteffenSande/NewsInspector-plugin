import Storage from "../background/storage/storage";
import * as ReactDOM from "react-dom";
import React from "react";

/**
 * Create a connection to the background script
 *
 */
// Create a connection to the background page
let backgroundPageConnection = chrome.runtime.connect({
  name: "panel"
});

backgroundPageConnection.postMessage({
  name: "init",
  tabId: chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(function(message) {
  // Data has arrived in devtools page!!
  // for now i will print the message to the dev page so we know what we are dealing with
  console.log(message);

  console.log(Storage.getInstance());
});

ReactDOM.render(<h1>Hello, world!</h1>, document.getElementById("root"));
