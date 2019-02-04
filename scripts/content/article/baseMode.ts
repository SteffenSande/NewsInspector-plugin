import BaseOverlay from "../baseOverlay";
import {HTML_FILES} from "../../config/constants";
import Log from "../../util/debug";
import {INewsSite} from "../../models/newsSite";
import {IArticle} from "../../models/article";

class BaseModeOverlay extends BaseOverlay {

    protected _quit_mode_button: HTMLElement;
    protected _site: INewsSite;
    protected _article: IArticle;

    constructor(rootElm: string = "") {
        super(`-article-mode${rootElm}`);
        this._templateName = HTML_FILES.templates.article;
        this._site = null;
        this._article = null;
    }

    quit_button_click() {
        this.hide();
    }

    onTemplateLoaded(html: HTMLElement) {
        super.onTemplateLoaded(html);
        this.setBaseElement(html);
        this._quit_mode_button = <HTMLButtonElement>html.querySelector(`#${this._rootElementName}-quit`);
        this._quit_mode_button.onclick = this.quit_button_click.bind(this);

        this.hide();
    }

    inject(data) {
        super.init();
        this._site = data.site;
        this._article = data.article;
    }
}

export default BaseModeOverlay;
