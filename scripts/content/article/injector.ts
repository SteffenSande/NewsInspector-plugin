import Log from "../../util/debug";
import BaseInjector from "../baseInjector";
import {createSubmissionForm, getResource} from "../../util/util";
import ArticleOverlay from "./overlay";
import {HTML_FILES, RESOURCES} from "../../config/constants";
import {ArticleCategory, IArticle} from "../../models/article";
import {createMessage, messageTypes} from "../../config/messageTypes";
import Modal from "../modal";
import RevisionModeOverlay from "./revision-mode";
import {createSummarySubmission} from "../../models/submission";
import ReportModeOverlay from "./report";
import {IReportCategory} from "../../models/reportCategory";
import HeadlineOverlay from "../headline/overlay";
import {headline} from "../../models/headline";

class ArticleInjector extends BaseInjector {

    private _element: HTMLElement;
    private _showMenu: boolean;
    private _menu: HTMLElement;
    private _article: IArticle;
    private _revision_mode: RevisionModeOverlay;
    private _report_mode: ReportModeOverlay;
    private _reportCategories: IReportCategory[];
    private _infoOverlay: HeadlineOverlay;

    constructor(infoOverlay: HeadlineOverlay) {
        super("-article");
        this._templateName = HTML_FILES.templates.article;
        this._overlay = new ArticleOverlay();
        this._showMenu = true;
        this._menu = null;
        this._article = null;
        this._revision_mode = new RevisionModeOverlay();
        this._report_mode = new ReportModeOverlay();
        this._infoOverlay = infoOverlay;
    }

    generateWordCloud = () => {
        Modal
            .getInstance()
            .startLoadingSequence();

        let messageData = {word_cloud_link: this._article.word_cloud};
        chrome.runtime.sendMessage(createMessage(messageTypes.WORDCLOUD_FOR_ARTICLE, messageData));
        this.closeMenu();
    }

    revisionMode(){
        this._revision_mode.show();
        this.closeMenu();
    }

    reportMode(){
        this._report_mode.show();
        this.closeMenu();
    }

    showMetaInfo(){
        // @ts-ignore
        let headline: headline = this._sites[0].headlines.find(x => x.id === this._article.headline);
        if (headline === null) {
            return;
        }
        this._infoOverlay.updateContent(headline);
        this._infoOverlay.show();
        this.closeMenu();
    }

    showRelatedArticles(){
        Modal
            .getInstance()
            .startLoadingSequence();

        Log.info("We are all related...")
        this.closeMenu();
    }

    closeMenu() {
        this._showMenu = false;
        this._menu.style.display = "none";
    }

    openMenu() {
        this._showMenu = true;
        this._menu.style.display = "flex";
    }

    toggleMenu = () => {
        this._revision_mode.hide();
        this._report_mode.hide();

        if (this._showMenu)
            this.closeMenu();
        else
            this.openMenu();
    }

    submitSummary() {
        let submission = createSummarySubmission(this._article.headline);
        createSubmissionForm(submission, "one_line",  "Enter a one line summary for the headline")
            .then((data) => {
                let modal = Modal.getInstance();
                modal.setHtmlContent(data);
                modal.open();
            })
    }


    onIconClick() {
        this.toggleMenu();

        let wordcloudButton = <HTMLButtonElement>this._menu
            .querySelector(`#${this._rootElementName}-wordcloud-generate`);
        let revisionModeButton = <HTMLButtonElement>this._menu
            .querySelector(`#${this._rootElementName}-revision-mode`);
        let metaInfoButton = <HTMLButtonElement>this._menu
            .querySelector(`#${this._rootElementName}-meta-info`);
        let relatedArticlesButton = <HTMLButtonElement>this._menu
            .querySelector(`#${this._rootElementName}-related-articles`);
        let summaryButton = <HTMLButtonElement>this._menu
            .querySelector(`#${this._rootElementName}-short-summary`);
        let reportButton = <HTMLButtonElement>this._menu
            .querySelector(`#${this._rootElementName}-report`);

        wordcloudButton.onclick = this.generateWordCloud.bind(this);
        revisionModeButton.onclick = this.revisionMode.bind(this);
        metaInfoButton.onclick =  this.showMetaInfo.bind(this);
        relatedArticlesButton.onclick =  this.showRelatedArticles.bind(this);
        relatedArticlesButton.style.display = "none";
        summaryButton.onclick =  this.submitSummary.bind(this);
        reportButton.onclick =  this.reportMode.bind(this);
    }

    onTemplateLoaded(html: HTMLElement) {
        if (this._element !== null && typeof this._element !== "undefined")
            this._element.remove();

        this._element = html;

        let img = <HTMLImageElement>this._element.querySelector(`#${this._rootElementName}-icon`);
        img.src =  getResource(RESOURCES.icons.logo);
        img.onclick = this.onIconClick.bind(this);

        this._menu = <HTMLElement>this._element.querySelector(`.${this._rootElementName}-menu`);

        if (this._article.diffs.length === 0)
            (<HTMLElement>this._menu.querySelector(`#${this._rootElementName}-revision-mode`)).style.display = "none";

        this.closeMenu();
        this._revision_mode.inject({site: this._sites[0], article: this._article});
        this._report_mode.inject({site: this._sites[0], article: this._article, reportCategories: this._reportCategories});
        super.onTemplateLoaded(html);
    }

    inject() {
        super.inject();
        Log.info("ArticleInjector injecting")

        document.body.appendChild(this._element);
    }

    setValuesFromData(data) {
        super.setValuesFromData(data);

        if (typeof data !== "undefined" || data !== null) {
            this._article = data.article;
            this._reportCategories = data.reportCategories;
        }
    }
}

export default ArticleInjector;