import Background from "./background";
import {messageTypes} from "../config/messageTypes";
import {url} from "inspector";

let background = new Background();

background.init();


/**
 * Connections is a list of all the chrome development panels that have a long lived connection to the background script and
 * can be used as a means of communication with the content of that particular tab
 */

let connections = {};
chrome.runtime.onConnect.addListener(function (port) {
    let extensionListener = function (message, sender, sendResponse) {
        if (message.type == messageTypes.INIT) {
            connections[message.payload.tabId] = port;
        }

        if (message.type == messageTypes.TURN_HOOVER_SELECT_ON) {
            chrome.tabs.query(
                {
                    active: true,
                },
                (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: messageTypes.TURN_HOOVER_SELECT_ON,
                        payload: {}
                    })
                });
        }
        if (message.type == messageTypes.TURN_HOOVER_SELECT_OFF) {
            chrome.tabs.query(
                {
                    active: true,
                },
                (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: messageTypes.TURN_HOOVER_SELECT_OFF,
                        payload: {}
                    })
                });
        }
    };

    // Listen to messages sent from the DevTools page
    // @ts-ignore
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function (port) {
        // @ts-ignore
        port.onMessage.removeListener(extensionListener);
        let tabs = Object.keys(connections);
        for (let i = 0, len = tabs.length; i < len; i++) {
            if (connections[tabs[i]] == port) {
                delete connections[tabs[i]];
                break;
            }
        }
    });
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    switch (message.type) {
        case messageTypes.SITES_UPDATED:
            break;

        case messageTypes.IS_SITE_SUPPORTED:
            let frontPage = background.frontPage(sender.url);
            let urlId = '';

            if (!frontPage) {
                urlId = background.getArticleUrl(sender.url);
            }

            chrome.tabs.query(
                {
                    active: true,
                },
                (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: messageTypes.INIT,
                        payload:{
                            site: background.getSite(sender.url),
                            _class: 'preview'
                        }
                    })
            });

            sendMessageToDevPanelIfConnectionExists({
                type: messageTypes.INIT,
                payload: {
                    frontPage,
                    headlines: background.getHeadlines(sender.url),
                    articles: background.getArticles(sender.url),
                    urlId
                }
            }, sender.tab.id);
            break;

        case messageTypes.SELECT:
            sendMessageToDevPanelIfConnectionExists(message, sender.tab.id);
            break;
    }
});


/**
 * This is a method to simplify the messaging between the devtools panel from the content script.
 * This is just a utility function that was used multiple places and therefore refactored out to
 * its own method.
 * @param message: a json object containing the message data and type
 * @param tabId: What tab is sending this message and is there a connection open to the developer tools window
 */
function sendMessageToDevPanelIfConnectionExists(message, tabId) {
    if (tabId) {
        if (tabId in connections) {
            connections[tabId].postMessage(message);
        } else {
            console.log("Tab not found in connection list.");
        }
    } else {
        console.log("sender.tab not defined.");
    }
}