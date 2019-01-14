import {getHtmlTemplate} from "../util/util";
import Log from "../util/debug";
import {CLASS_PREFIX} from "../config/constants";
import {createConnection} from "net";
import {createMessage, messageTypes} from "../config/messageTypes";
import elements = chrome.devtools.panels.elements;

class BaseOverlay {
    protected _rootElementName: string;
    protected _element: HTMLElement;
    protected _contentNode: HTMLElement;
    protected _templateName: string;
    protected _templateClass: string;

    public isHoveringOverlay: boolean;

    constructor(rootElm: string = "") {
        this.isHoveringOverlay = false;
        this._templateName = "";
        this._contentNode = null;
        this._element = null;
        this._rootElementName = `${CLASS_PREFIX}${rootElm}`;
        this._templateClass = `.${this._rootElementName}`;
    }

    /**
     * Loads all templates
     */
    init() {
        getHtmlTemplate(this._templateName, this._templateClass)
            .then((html: HTMLElement) => {
                this.onTemplateLoaded(html);
            });
    }

    onTemplateLoaded(html: HTMLElement) {}


    setBaseElement(html: HTMLElement) {
        if (this._element !== null) {
            this._element.remove();
        }

        this._element = html;
        let node = <Node>this._element;

        // Here is the place that adds information about the article to the page in the form of an overlay.
        // This is clearly where i should instead hook it up to the developer tool page!
        // The probem is that i cannot send messages between the background and the dev tools yet, but the information is sendt to the bakground
        Log.info("I will log that the child node should have been created and that the information will follow:")
        this._element.onmouseout = () => this.isHoveringOverlay = false;
    }






    /**
     * Updates the content of the overlay based on the article category;
     Log.info(this._element.innerText);
     chrome.runtime.sendMessage(createMessage(messageTypes.NOTIFY_DEV, this._element));
     document.body.appendChild(node);






     this._element.onmouseover = () => this.isHoveringOverlay = true;
     * @param data
     */
    updateContent(data: any): void {}

    show() {
        this._element.style.display = "block";
    }

    /**
     * Hides the overlay
     */
    hide(): void {
        this._element.style.display = "none";
    }
}

export default BaseOverlay;