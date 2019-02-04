import HeadlineInjector from "../injector";
import Log from "../../../util/debug";
import {createMessage, messageTypes} from "../../../config/messageTypes";
import {headline} from "../../../models/headline";
import HeadlineOverlay from "../overlay";


class LinkInjector extends HeadlineInjector {

    protected _linkToHeadlineMap: Map<string, headline>;

    constructor(overlay: HeadlineOverlay) {
        super(overlay);
        this._linkToHeadlineMap = new Map<string, headline>();
    }

    findAllNodes = (): NodeList => {
        return document.querySelectorAll("a");
    };

    inject() {
        super.inject();
        Log.info("LinkInjector injecting")
    }

    injectIntoNodes (nodes: NodeList): void {
        let messageData = [];

        for(let node of nodes) {
            let link = <HTMLLinkElement>node;
            if (link !== null){
                let href = link.href;
                if (href.indexOf("#") === -1) {
                    messageData.push(href);
                }
            }
        }
        let message = createMessage(messageTypes.FETCH_INFO_FOR_LINKS, messageData);

        chrome.runtime.sendMessage(message, (data) => {
            for (let item in data.info) {
                this._linkToHeadlineMap.set(item, data.info[item])
            }
            super.injectIntoNodes(nodes);
        });
    }
    getDataForNode(elm: HTMLLinkElement): headline {
        if (elm === null || elm.href.length === 0)
            return null;

        if (this._linkToHeadlineMap.has(elm.href)) {
            return this._linkToHeadlineMap.get(elm.href);
        }
        return null;
    }
}

export default LinkInjector;