import Background from "./background";
import {messageTypes} from "../config/messageTypes";

let background = new Background();

background.init();


/**
 * Connections is a list of all the chrome development panels that have a long lived connection to the background script and
 * can be used as a means of communication with the content of that particular tab
 */

let connections = {};
chrome.runtime.onConnect.addListener(function (port) {
    // Needs tabId in message header
    let extensionListener = function (message, sender, sendResponse) {
        switch(message.type){
            case messageTypes.INIT:
                connections[message.tabId] = port;
                break;

            case messageTypes.TURN_HOOVER_SELECT_ON:
                chrome.tabs.sendMessage(message.tabId, {
                            type: messageTypes.TURN_HOOVER_SELECT_ON,
                            payload: {}
                });
                console.log('Turn hoover on');
                break;

            case messageTypes.TURN_HOOVER_SELECT_OFF:
                chrome.tabs.sendMessage(message.tabId, {
                    type: messageTypes.TURN_HOOVER_SELECT_OFF,
                    payload: {}
                });
                console.log('Turn hoover off');
                break;

            case messageTypes.REDIRECT_TO:
                chrome.tabs.sendMessage(message.tabId, {
                    type: messageTypes.REDIRECT_TO,
                    payload: {
                        address: message.payload.address
                    }
                });
                console.log('Redirecting to ' + message.payload.address);
                break;

            case messageTypes.FIND_TEXT:
                console.log('sender.tab.id');
                console.log(message);
                chrome.tabs.sendMessage(message.tabId, message);
                break;
            }
    }
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
    // This is for sending messages to the content script.
    switch (message.type) {
        case messageTypes.SITES_UPDATED:
            //ToDo
            break;

        case messageTypes.IS_SITE_SUPPORTED:
            // If the site is not supported do nothing
            if(!background.siteIsSupported(sender.url)) break;

            let frontPage = background.frontPage(sender.url);
            let urlId = background.getArticleUrl(sender.url);

            if (frontPage) {
                // If frontpage then initialize the overlay to enable hover-selection of headlines on the frontpage.
                let responseMessage = {
                    type: messageTypes.INIT,
                    payload: {
                        site: background.getSite(sender.url),
                        _class: background.getSite(sender.url).headlineTemplate.headline
                    }
                };
                // Make the overlay that supports hoovering
                chrome.tabs.sendMessage(sender.tab.id, responseMessage);
            }

            // Make the devtool panel download the data for this newspaper
            sendMessageToDevPanelIfConnectionExists({
                type: messageTypes.INIT,
                payload: {
                    frontPage,
                    headlines: background.getHeadlines(sender.url),
                    articles: background.getArticles(sender.url),
                    exclude: background.getSite(sender.url).headlineTemplate.feed,
                    urlId
                }
            }, sender.tab.id);
            break;

        case messageTypes.SELECT:
            console.log('Select:' + message.payload.selected);
            console.log(message);
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