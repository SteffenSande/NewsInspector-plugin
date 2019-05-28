import {messageTypes} from "../config/messageTypes";
import {Overlay} from "./overlay";

let overlay = null;

function onMessageDo(request) {
    console.log(request);
    switch (request.type) {
        case messageTypes.INIT: {
            console.log(request);
            let site = request.payload.site;
            let _class = request.payload._class;
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
        }
    }
}

chrome.runtime.onMessage.addListener(onMessageDo);
chrome.runtime.sendMessage({type: messageTypes.IS_SITE_SUPPORTED, payload: {}});

