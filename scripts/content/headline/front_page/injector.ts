import {INewsSite} from "../../../models/newsSite";
import HeadlineInjector from "../injector";
import Log from "../../../util/debug";
import {IHeadline} from "../../../models/headline";
import {find_headline_id, trimUrlGetParams, trimUrlToHostname, trimUrlToPath} from "../../../util/util";


class FrontpageInjector extends HeadlineInjector{

        injectOnHeadlineLists = () => {
        let site = this.currentSite();
        if (site === null)
            return;

        for(let index = 0; index < site.headlineTemplate.list.length; index++) {
            let nodes = document.querySelectorAll(site.headlineTemplate.list[index]);
            this.injectIntoNodes(nodes);
        }
    };

    /**
     * Injects a headline id on each a element
     * @param {Element} htmlHeadline
     * @param {number} id
     */
    injectHeadlineIdOnEachLink(htmlHeadline: Element, id: number) {
        let links = htmlHeadline.querySelectorAll('a');


        for(let i = 0; i < links.length; i++) {
            links[i].setAttribute(`${this._rootElementName}-id`, id.toString());

            for(let j = 0; j < links[i].children.length; j++) {
                links[i].children[j].setAttribute(`${this._rootElementName}-id`, id.toString());
            }
        }

        htmlHeadline.setAttribute(`${this._rootElementName}-id`, id.toString());
    }

    getDataForNode(elm: HTMLLinkElement): IHeadline {
        let site = this.currentSite();
        if(site === null)
            return null;

        elm = <HTMLLinkElement>elm.querySelector(site.headlineTemplate.url);


        if (elm === null || typeof elm === "undefined")
            return null;

        if (typeof this._sites[0] === "undefined" || this._sites[0] === null)
            return null;

        if (typeof elm.href === "undefined" || elm.href.length === 0 || elm.href.indexOf("#") > 0 )
            return null;

        let hostname = trimUrlToHostname(elm.href);
        let trimmedUrl = trimUrlToPath(elm.href);
        trimmedUrl = trimUrlGetParams(trimmedUrl);

        for(let site of this._sites) {
            let elmUrl = find_headline_id(elm.href, site.urlTemplates);
            for (let headline of site.headlines) {

                let headline_url = trimUrlToPath(headline.url);
                headline_url = trimUrlGetParams(headline_url);

                if ((headline.url_id.length > 0 && headline.url_id === elmUrl) || headline_url === trimmedUrl) {
                    return headline;
                }
            }
        }
        return null;
    }

    injectIntoNode(node: HTMLElement, data: IHeadline) {
        super.injectIntoNode(node, data);
        this.injectHeadlineIdOnEachLink(node, data.id);
    }


    currentSite = (): INewsSite => {
        let site = this._sites[0];
        if (typeof site === "undefined" || site === null)
            return null;
        return site;
    };

    inject() {
        super.inject();
        this.injectOnHeadlineLists();

        Log.info("Front-pageInjector injecting")
    }

    findAllNodes = (): NodeList => {
        let site = this.currentSite();
        if (site === null)
            return null;

        return document.querySelectorAll(site.headlineTemplate.headline);
    }

}

export default FrontpageInjector;