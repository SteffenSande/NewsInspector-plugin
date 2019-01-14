import HeadlineInfo, {IHeadline} from "../../models/headline";
import {HTML_FILES} from "../../config/constants";
import {ArticleCategory} from "../../models/article";
import BaseOverlay from "../baseOverlay";
import {printDateTime, trimUrlGetParams, trimUrlToHostname, wordsToReadingTimeInMinutes} from "../../util/util";
import {IHeadlineReport} from "../../models/headlineReport";
import {IHeadlineDiff} from "../../models/headlineDiff";
import Log from "../../util/debug";

class HeadlineOverlay extends BaseOverlay {
    private _articleTemplate: HTMLElement;
    private _feedTemplate: HTMLElement;
    private _videoTemplate: HTMLElement;
    private _externalTemplate: HTMLElement;
    private _noInfoTemplate: HTMLElement;
    private _reportTemplate: HTMLElement;
    private _closeButton: HTMLElement;
    private _info: HeadlineInfo;
    private _currentHeadlineInOverlay: IHeadline;

    // Revision props
    private _progress: HTMLElement;
    private _next_diff_button: HTMLButtonElement;
    private _previous_diff_button: HTMLButtonElement;
    private _current_index: number;

    constructor() {
        super("-headline");
        this._info = new HeadlineInfo();
        this._currentHeadlineInOverlay = null;
        this._closeButton = null;
        this._templateName = HTML_FILES.templates.headline;
        this._templateClass = null;
        this._current_index = 0;
    }

    onTemplateLoaded(html: HTMLElement) {
        super.onTemplateLoaded(html);

        let class_prefix = `.${this._rootElementName}-overlay`;

        this.setBaseElement(<HTMLElement>html.querySelector(class_prefix));

        this._articleTemplate = <HTMLElement>html.querySelector(`${class_prefix}-article-category-article`);
        this._noInfoTemplate = <HTMLElement>html.querySelector(`${class_prefix}article-category-noInfo`);
        this._feedTemplate = <HTMLElement>html.querySelector(`${class_prefix}-article-category-feed`);
        this._videoTemplate = <HTMLElement>html.querySelector(`${class_prefix}-article-category-video`);
        this._externalTemplate = <HTMLElement>html.querySelector(`${class_prefix}-article-category-external`);
        this._reportTemplate = <HTMLElement>html.querySelector(`.${this._rootElementName}-report`);
        this._closeButton = <HTMLElement>html.querySelector(`${class_prefix}-close`);
        this._closeButton.onclick = this.hide.bind(this);

        this._contentNode = <HTMLElement>this._element.querySelector(`${class_prefix}-content`);
    }


    /**
     * Sets the article content in the overlay
     */
    private article(headline: IHeadline) {
        let template = <HTMLElement>this._articleTemplate.cloneNode(true);
        this._currentHeadlineInOverlay = headline;

        this._info.fromJSON(headline.info);

        let summary = headline.summary !== null ? headline.summary.one_line : "";
        let tags = <HTMLElement>template.querySelector(`.${this._rootElementName}-overlay-tags`);
        if (this._info.revision.subscription)
            tags.innerHTML = "<i class='fas fa-money-bill-alt'></i>";
        else
            tags.style.display = "none";


        this.showTextOrHideLine(template, 'title', this._info.revision.title);
        this.showTextOrHideLine(template, 'created', this._info.published);
        this.showTextOrHideLine(template, 'updated', this._info.updated);
        this.showTextOrHideLine(template, 'words', wordsToReadingTimeInMinutes(this._info.revision.words));
        this.showTextOrHideLine(template, 'author', this._info.revision.printJournalists());
        this.showTextOrHideLine(template, 'sub-title', headline.revision.sub_title);
        this.showTextOrHideLine(template, 'summary', summary);

        this.setReports(template, headline.reports);
        this.setContent(template, "Article");
        this.setHeadlineDiffs(template, headline);
    }

    setHeadlineDiffs = (template: HTMLElement, headline: IHeadline) => {
        let diff = <HTMLElement>template.querySelector(`.${this._rootElementName}-overlay-revision-mode`);
        if (headline.diffs.length === 0) {
            diff.style.display = "none";
            return;
        }

        let class_prefix = `.${this._rootElementName}-overlay-revision-mode`;

        this._next_diff_button = <HTMLButtonElement>template.querySelector(`${class_prefix}-navigation-forward`);
        this._progress = <HTMLElement>template.querySelector(`${class_prefix}-navigation-progress`);
        this._previous_diff_button = <HTMLButtonElement>template.querySelector(`${class_prefix}-navigation-backward`);

        this._next_diff_button.onclick = this.forward_button_click.bind(this);
        this._previous_diff_button.onclick =  this.backward_button_click.bind(this);

        this.replace_content_with(this._currentHeadlineInOverlay.diffs[0]);

        if (this._currentHeadlineInOverlay.diffs.length == 1){
            this._previous_diff_button.disabled = true;
            this._next_diff_button.disabled = true;
        }

        this.updateProgress();

        this._current_index = 1;
    }

    setReports = (template: HTMLElement, reports: IHeadlineReport[]): void => {
        for(let i = 0; i < reports.length; i++) {
            let currentReport = reports[i];

            let reportTemplate = <HTMLElement>this._reportTemplate.cloneNode(true);
            let titleNode = <HTMLHeadingElement>reportTemplate.querySelector(".news-enhancer-headline-report-title");
            titleNode.textContent = `${currentReport.category.category} reports`;

            let table = <HTMLElement>reportTemplate.querySelector(".news-enhancer-table-data");
            let reasonTr = document.createElement("tr");
            let reportedTr = document.createElement("tr");

            for(let j = 0; j < currentReport.reports.length; j++)  {
                let reasonTd = document.createElement("td");
                let reportedTd = document.createElement("td");

                reasonTd.textContent = currentReport.reports[j].explanation;
                reportedTd.textContent = printDateTime(currentReport.reports[j].created);

                reasonTr.appendChild(reasonTd);
                reportedTr.appendChild(reportedTd);
            }

            table.appendChild(reasonTr);
            table.appendChild(reportedTr);

            template.appendChild(reportTemplate);
        }
    };

    /**
     * Displays content if there is any. Else hides this line in the overlay.
     * @param {HTMLElement} template Retrieves the position of the text
     * @param {string} selector Css class for the position in the template
     * @param {string} data To to put into the node.
     * @param {boolean} isHtml If it is text or html to put into the node. Defaults to text (isHtml = false).
     */
    showTextOrHideLine(template: HTMLElement, selector: string, data: string, isHtml: boolean = false) {
        let node = <HTMLElement>template.querySelector(`.${this._rootElementName}-${selector}`);
        if (data.length == 0) {
            (<HTMLElement>node.parentNode).style.display = "none";
            return;
        }
        if (isHtml) {
            node.innerHTML = data;
        } else {
            node.style.display = "inline-block";
            node.textContent = data;
        }
    }

    /**
     * Sets the external content in the overlay
     */
    private external(headline: IHeadline) {
        let template = <HTMLElement>this._externalTemplate.cloneNode(true);
        // Display location and link and header as name of the site

        let summary = headline.summary !== null ? headline.summary.one_line : "";
        this.showTextOrHideLine(template, 'summary', summary);
        this.showTextOrHideLine(template, 'source', trimUrlGetParams(headline.url));

        this.setContent(template, `External site ${trimUrlToHostname(headline.url)}`);
    }

    /**
     * Sets the feed content in the overlay
     */
    private feed(headline: IHeadline) {
        let template = <HTMLElement>this._feedTemplate.cloneNode(true);
        let summary = headline.summary !== null ? headline.summary.one_line : "";
        this.showTextOrHideLine(template, 'summary', summary);
        this.setContent(template, "Not a article");
    }

    /**
     * Sets the video content in the overlay
     */
    private video(headline: IHeadline) {
        // Display location and link

        let template = <HTMLElement>this._videoTemplate.cloneNode(true);
        let summary = headline.summary !== null ? headline.summary.one_line : "";
        this.showTextOrHideLine(template, 'summary', summary);
        this.setContent(template, "Video");
    }

    /**
     * Sets the no info content in the overlay
     */
    private noInfo(headline: IHeadline) {
        let template = <HTMLElement>this._noInfoTemplate.cloneNode(true);
        let summary = headline.summary !== null ? headline.summary.one_line : "";
        this.showTextOrHideLine(template, 'summary', summary);
        this.setContent(template, "No info");
    }

    /**
     * Replaces all content in overlay
     * @param content New content in overlay
     * @param title Title for the overlay
     */
    setContent = (content: HTMLElement, title: string): void => {
        let titleElement = <HTMLElement>this._element.querySelector(`.${this._rootElementName}-overlay-title`);
        titleElement.innerText = title;

        this._contentNode.innerHTML = "";
        this._contentNode.appendChild(content);
        this._contentNode.appendChild(this._closeButton);
    };


    /**
     * Updates the content of the overlay based on the article category
     * @param headline
     */
    updateContent(headline: IHeadline): void {
        super.updateContent(headline);

        switch (headline.info.category) {
            case ArticleCategory.Article:
                this.article(headline);
                break;
            case ArticleCategory.External:
                this.external(headline);
                break;
            case ArticleCategory.Video:
                this.video(headline);
                break;
            case ArticleCategory.Feed:
                this.feed(headline);
                break;
            default:
            case ArticleCategory.NoInfo:
                this.noInfo(headline);
                break;
        }
    }







    /** Revision methods **/
    updateProgress() {
        this._progress.innerText = `${this._currentHeadlineInOverlay.diffs.length - this._current_index}/${this._currentHeadlineInOverlay.diffs.length}`
    }

    navigateButton(button: HTMLButtonElement, other_button: HTMLButtonElement, increment_index: number, limit: number) {
        if (this._current_index == limit){
            return;
        }

        other_button.disabled = false;
        this._current_index += increment_index;

        this.replace_content_with(this._currentHeadlineInOverlay.diffs[this._current_index]);
        this.updateProgress();

        if (this._current_index == limit){
            button.disabled = true;
        }
    }

    forward_button_click() {
        this.navigateButton(this._next_diff_button, this._previous_diff_button, -1, 0);
    }
    backward_button_click() {
        let limit = this._currentHeadlineInOverlay.diffs.length - 1;
        this.navigateButton(this._previous_diff_button, this._next_diff_button, 1, limit);
    }

    replace_content_with(diff: IHeadlineDiff) {
        let selector = `overlay-revision-mode`;
        this.showTextOrHideLine(document.body, `${selector}-title`, diff.title, true);
        this.showTextOrHideLine(document.body, `${selector}-sub-title`, diff.sub_title, true);
    }
}

export default HeadlineOverlay;