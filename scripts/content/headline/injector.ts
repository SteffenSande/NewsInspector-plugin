import {IHeadline} from "../../models/headline";
import { Limits} from "../../models/limit";
import {CLASS_PREFIX, HTML_FILES} from "../../config/constants";
import {getNearestLimitWithValue} from "../../util/util";
import {IHeadlineReport} from "../../models/headlineReport";
import BaseInjector from "../baseInjector";
import HeadlineOverlay from "./overlay";
import {ITabData} from "../../models/tabData";
import Log from "../../util/debug";

class HeadlineInjector extends BaseInjector {
    protected _headlines: Map<number, IHeadline>;
    protected _markTemplate: HTMLElement;
    protected _isInsideHeadline: boolean;
    protected _currentHeadline: IHeadline;

    constructor(overlay: HeadlineOverlay) {
        super("-headline");
        this._headlines = new Map<number, IHeadline>();
        this._isInsideHeadline = false;
        this._templateName = HTML_FILES.templates.headline;
        this._overlay = overlay;
        this._currentHeadline = null;
    }

    onTemplateLoaded(html: HTMLElement) {
        this._markTemplate = html;

        super.onTemplateLoaded(html);
    }

    /**
     * Creates a symbol mark on head headline,
     * @returns {Element} The container for the html mark
     */
    createMarking = (node: HTMLElement, id: number) => {
        let container = <HTMLElement>this._markTemplate.cloneNode(true);
        let icon = <HTMLElement>container.querySelector(`.${CLASS_PREFIX}-icon`);
        container.id = `${this._rootElementName}-${id}`;

        let markingClass = `${CLASS_PREFIX}-info`;
        let reportCount = this.getDataForNode(node as HTMLLinkElement).reports
            .map((elm: IHeadlineReport) => elm.reports.length)
            .reduce((a: number, b: number): number => a + b, 0);

        switch(getNearestLimitWithValue(this._limits, reportCount).key) {
            case Limits.Ignore:
                break;
            case Limits.Low:
                markingClass = `${CLASS_PREFIX}-low`;
                break;
            case Limits.Mid:
                markingClass = `${CLASS_PREFIX}-mid`;
                break;
            case Limits.High:
                markingClass = `${CLASS_PREFIX}-high`;
                break;
        }

        icon.classList.add(markingClass);
        this._injectedDomElements.push(container);
        return container;
    };

    clear() {
        // Removes all elements from dom
        for (let elm of this._injectedDomElements) {
            elm.remove();
        }
    };

    injectIntoNode(node: HTMLElement, data: IHeadline) {
        let id = parseInt(data.id.toString());

        let marking = this.createMarking(node, id);
        node.appendChild(marking);

        // Computes padding for icon
        // TODO set padding on marking. Should be on newssite
        this.setOverlayOnNode(node, id);
    }

    setOverlayOnNode = (node: HTMLElement, id: number): void => {
        node.onmouseover = () => {
            if (!this._headlines.has(id))
                return;
            this._currentHeadline = this._headlines.get(id);
            this._overlay.updateContent(this._currentHeadline);

            this._overlay.show();
            this._isInsideHeadline = true;
        };
        node.onmouseout = () => this._isInsideHeadline = false;
    };

    update(data: ITabData) {
        super.update(data);
        this.inject();
        if (this._currentHeadline == null)
            return;

        this._currentHeadline = this._headlines.get(this._currentHeadline.id);
        this._overlay.updateContent(this._currentHeadline);
    }

    inject(){
        super.inject();

        let nodes = this.findAllNodes();
        if (nodes === null)
            return;
        this.injectIntoNodes(nodes);
    }

    injectIntoNodes (nodes: NodeList): void  {
        for(let node of nodes) {

            let elm = <HTMLElement>node;
            let data = this.getDataForNode(elm as HTMLLinkElement);
            if (data === null || typeof data === "undefined") {
                continue;
            }

            this._headlines.set(data.id, data);
            this.injectIntoNode(elm, data);
        }
    }
    getDataForNode(elm: HTMLLinkElement): IHeadline {return null;}


    findAllNodes = (): NodeList => {
        return null;
    }
}

export default HeadlineInjector;