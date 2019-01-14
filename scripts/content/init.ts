import Modal from "./modal";
import {createMessage, messageTypes} from "../config/messageTypes";
import FrontpageInjector from "./headline/front_page/injector";
import Log from "../util/debug";
import LinkInjector from "./headline/link/injector";
import {trimUrlGetParams, trimUrlToPath} from "../util/util";
import ArticleInjector from "./article/injector";
import FindAttributeOnElementInHtmlTree from "./contextMenuListener"
import HeadlineOverlay from "./headline/overlay";


let modal = Modal.getInstance();
let headlineInfoOverlay = new HeadlineOverlay();
let frontPageInjector = new FrontpageInjector(headlineInfoOverlay);
let linkInjector = new LinkInjector(headlineInfoOverlay);
let articleInjector = new ArticleInjector(headlineInfoOverlay);

let passDataToArticleInjector = (data, callback) => {
    for (let storageItem of data.sites) {
        let site = storageItem.data;

        if (location.hostname.indexOf(site.base_url) > -1) {
            let messageData = {url: location.href, siteId: site.id};
            let articleMessage = createMessage(messageTypes.FETCH_ARTICLE, messageData);
            chrome.runtime.sendMessage(articleMessage, (articleData) => {
                if (articleData.article !== null)
                    callback.call(articleInjector, Object.assign(data, articleData));
            });
        }
    }
};
let passDataToInjectors = (frontPageInjectorCallback, linkInjectorCallback,articleInjectorCallback) => {
    let url = location.origin + location.pathname;
    let initData = createMessage(messageTypes.IS_SITE_SUPPORTED, url);

    chrome.runtime.sendMessage(initData, (data) => {
        if (data.sites == 0)
            return;

        let isFrontPage = data.sites.length === 1 && trimUrlGetParams(trimUrlToPath(url)).length === 0;
        let isArticle = data.sites.length === 1 && trimUrlGetParams(trimUrlToPath(url)).length > 0;

        if (isFrontPage)
            frontPageInjectorCallback.call(frontPageInjector, data);
        else {
            linkInjectorCallback.call(linkInjector, data);
            if (isArticle){
                passDataToArticleInjector(data,articleInjectorCallback);
            }
        }
    });
};

passDataToInjectors(frontPageInjector.init, linkInjector.init, articleInjector.init);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        Log.info("Message to contentscript", request);
        switch (request.type) {
            case messageTypes.SITES_UPDATED:
                passDataToInjectors(frontPageInjector.update, linkInjector.update, articleInjector.update);
                break;
            case messageTypes.SHOW_IN_MODAL:
                modal.setHtmlContent(request.data);
                modal.open();
                break;
        }
        return true;
    }
);


window.addEventListener('contextmenu', (e) => {
    let action = (id) => chrome.runtime.sendMessage(createMessage(messageTypes.TOGGLE_CONTEXT_MENU, id));
    let finder = new FindAttributeOnElementInHtmlTree(action);

    if(!finder.findAttr(<HTMLElement>e.target, 0, 10, "down"))
        finder.findAttr(<HTMLElement>e.target, 0, 10, "up");

}, false);
