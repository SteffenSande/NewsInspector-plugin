import Background from "./background";
import {messageTypes} from "../config/messageTypes";
import Log from "../util/debug";
import Notification from "../models/notification";
import Wordcloud from "./wordcloud";
import {ISubmission} from "../models/submission";
import tabId = chrome.devtools.inspectedWindow.tabId;

let wordcloud = new Wordcloud();
let background = new Background(wordcloud);
background.init();

// background.js
let connections = {};

chrome.runtime.onConnect.addListener(function (port) {

    let extensionListener = function (message, sender, sendResponse) {

        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
        if (message.name == "init") {
            connections[message.tabId] = port;
            Log.info("init");
            return;
        }
        // other message handling
        Log.info("something else lol");


    }

    port.postMessage('f yeah');

    // Listen to messages sent from the DevTools page
    // @ts-ignore
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function(port) {
        // @ts-ignore
        port.onMessage.removeListener(extensionListener);

        let tabs = Object.keys(connections);
        for (let i=0, len=tabs.length; i < len; i++) {
            if (connections[tabs[i]] == port) {
                delete connections[tabs[i]]
                break;
            }
        }
    });
});

chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
    Log.info("Message to background", request.type, request.data);
    if (request != "init"){
        switch (request.type) {
            case messageTypes.TAB_LOADED_URL:
                background.siteIsSupported(request.data, sendResponse);
                break;
            case messageTypes.GENERATE_WORDCLOUD_FOR_SITE:
                wordcloud.showWordCloudForLink(request.data);
                break;
            case messageTypes.NOTIFY_USER:
                Notification.notifyUser(request.data);
                break;
            case messageTypes.IS_SITE_SUPPORTED:
                background.siteIsSupported(request.data, sendResponse);
                break;
            case messageTypes.TOGGLE_CONTEXT_MENU:
                background.contextMenu.contextMenuElementNewsEnhancerId = request.data;
                break;
            case messageTypes.SUBMIT:
                let submissionData: ISubmission = request.data;
                background.submit(submissionData);
                break;
            case messageTypes.FETCH_ARTICLE:
                background.fetchArticle(request.data, sendResponse);
                break;
            case messageTypes.WORDCLOUD_FOR_ARTICLE:
                wordcloud.showWordCloudForLink(Object.assign(request.data, {tab: sender.tab}));
                break;
            case messageTypes.FETCH_INFO_FOR_LINKS:
                background.fetchHeadlineDataForLinks(request.data, sendResponse);
                break;
            case messageTypes.NOTIFY_DEV:
                if (sender.tab) {
                    Log.info("gets here");
                    let tabId = sender.tab.id;
                    if (tabId in connections) {
                        Log.info("Sending message to the dev tool " + request.data + "to tab id " + tabId);
                        connections[tabId].postMessage(request.data);
                    } else {
                        console.log("Tab not found in connection list.");
                    }
                } else {
                    console.log("sender.tab not defined.");
                }
                break;
        }
    }
    return true;
});

