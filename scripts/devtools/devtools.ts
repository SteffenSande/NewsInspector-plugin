chrome.devtools.panels.create(
  "Nyhets inspeksjon",
  "icons/icon.jpg",
  "html/panel.html",
  function(panel) {
    console.log("panel created");
  }
);

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

  console.log("hello from devtools");

  console.log(document.getElementById("container").innerHTML);
  console.log(document.getElementById("content").innerHTML);

  document.getElementById("content").innerHTML =
    "Helle message from  the dev script that was activated upon a message";
});
