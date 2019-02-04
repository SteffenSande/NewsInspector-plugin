import {createMessage, messageTypes} from "../config/messageTypes";
import Tab = chrome.tabs.Tab;
import {currentTab} from '../util/util';
import {INewsSite} from "../models/newsSite";

class Popup {

    private _currentSite: INewsSite;

    constructor() {
        this._currentSite = null;
        currentTab()
            .then((tab: Tab) => chrome.runtime.sendMessage(
                createMessage(messageTypes.IS_SITE_SUPPORTED, tab.url), this.init.bind(this)));
    }

    init(data = null) {
        let button = <HTMLElement>document.getElementById("generate-wordcloud-button");
        if (data != null) {
            if (data.sites[0] !== "undefined")
                this._currentSite = data.sites[0].data;

            button.addEventListener("click", this.wordcloudButton.bind(this));
        } else {
            button.style.display = "none";
        }
    }

    wordcloudButton() {
        currentTab()
            .then((tab: Tab) => {
                let messageData = {word_cloud_link: this._currentSite.word_cloud, tab: {id: tab.id}};
                chrome.runtime.sendMessage(createMessage(messageTypes.GENERATE_WORDCLOUD_FOR_SITE, messageData));
            });

        window.close();
    }
}

export default Popup;