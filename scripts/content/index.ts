import {messageTypes} from "../config/messageTypes";
import {Overlay} from "./overlay";

let overlay = null;

function onMessageDo(message) {
    console.log(message);
    switch (message.type) {
        case messageTypes.INIT: {
            console.log("Creating overlay");
            let site = message.payload.site;
            let _class = message.payload._class;
            overlay = new Overlay(site, _class);
            // Overlay created;
            // Will run again when we access a new page though
            // Is connected to the panel that is inspecting so it is the correct functionality
            break;
        }

        case messageTypes.TURN_HOOVER_SELECT_ON: {
            console.log('Hoover on');
            if (overlay) {
                overlay.turnOnHooverMode();
            } else {
                // ToDo
                // add a queue for the comands that should run when possible.
                console.log('not fixed yet')
            }
            break;
        }

        case messageTypes.TURN_HOOVER_SELECT_OFF: {
            console.log('Hoover off');
            if (overlay) {
                overlay.turnOffHooverMode();
            } else {
                // ToDo
                // add a queue for the comands that should run when possible.
                console.log('not fixed yet')
            }
            break;
        }

        case messageTypes.REDIRECT_TO: {
            console.log('Redirecting to ' + message.payload.address);
            window.location.href = message.payload.address;
            break;
        }

        case messageTypes.FIND_TEXT:
            console.log('Find text.');
            //@ts-ignore
            if (window.find(message.payload.text, 0, 0, 1)) {
                console.log(message.payload.text);
            } else {
                console.log('Couldn\'t find ' + message.payload.text);
            }
    }
}

chrome.runtime.onMessage.addListener(onMessageDo);
chrome.runtime.sendMessage({type: messageTypes.IS_SITE_SUPPORTED, payload: {}});

