import Api from "../util/api";
import {getHtmlTemplate, imageToBase64} from "../util/util";
import {createMessage, messageTypes} from "../config/messageTypes";
import Log from "../util/debug";
import Tab = chrome.tabs.Tab;
import {HTML_FILES} from "../config/constants";
import Notification from "../models/notification";
import {ITabData} from "../models/tabData";

class Wordcloud {
    private _api: Api = new Api();

    private _classPrefix = ".news-enhancer-wordcloud";

    showWordCloudForId(id: number, tab: Tab) {

        this._api.get(`${Api.endpoints.WORDCLOUD_GENERATOR_ARTICLE}${id}`)
            .then((data) => {
                if (typeof data.error === "undefined")
                    this.showWordCloudForLink({word_cloud_link: data.link, tab: tab});
                else
                    Notification.notifyUser({ title: "Wordcloud error",
                        message: data.error})

             })
            .catch(() => Notification.notifyUser({ title: "Wordcloud error",
            message: "Could not retrive wordcloud"}))
    }

    showWordCloudForLink(data) {
        let link = `${this._api.BaseUrl}${data.word_cloud_link}`;
        if (data.word_cloud_link.startsWith("/"))
            link = `${this._api.BaseUrl}${data.word_cloud_link.substring(1, data.word_cloud_link.length)}`;

        this._api.image(link)
            .then((imageData) => {
                imageToBase64(imageData)
                    .then((img: string) => {
                        this.showWordcloud(img, data.tab);
                    })
            })
    }

    /**
     * Sends a message to the content script to show this wordcloud
     * @param {string} img
     * @param {chrome.tabs.Tab} tab to show wordcloud in
     */
    showWordcloud(img: string,tab: Tab) {
        getHtmlTemplate(HTML_FILES.templates.wordcloud, this._classPrefix)
            .then((html: HTMLElement) => {

                let wordcloud = <HTMLElement>html.cloneNode(true);
                wordcloud.querySelector(`${this._classPrefix}-image`).setAttribute("src", img);

                let message = createMessage(messageTypes.SHOW_IN_MODAL,{html: wordcloud.outerHTML});
                chrome.tabs.sendMessage(tab.id, message);
            });
    }
}



export default Wordcloud;