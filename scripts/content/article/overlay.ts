import BaseOverlay from "../baseOverlay";
import {CLASS_PREFIX, HTML_FILES} from "../../config/constants";

class ArticleOverlay extends BaseOverlay {

    constructor() {
        super("-article-overlay");
        this._templateName = HTML_FILES.templates.article;
    }

    onTemplateLoaded(html: HTMLElement) {
        super.onTemplateLoaded(html);
        this.setBaseElement(html);
    }
}

export default ArticleOverlay;