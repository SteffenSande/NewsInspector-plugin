import {CLASS_PREFIX, HTML_FILES} from "../../config/constants";
import Log from "../../util/debug";
import {IReportCategory} from "../../models/reportCategory";
import BaseModeOverlay from "./baseMode";
import {createSubmissionForm} from "../../util/util";
import {createReportSubmission} from "../../models/submission";
import Modal from "../modal";

class ReportModeOverlay extends BaseModeOverlay {

    private _reportCategories: IReportCategory[];

    constructor() {
        super("-report");
        this._templateName = HTML_FILES.templates.article;
        this._site = null;
        this._article = null;
    }

    report_button_click(e) {
        let categoryId = e.target.getAttribute("categoryId");
        let category = this._reportCategories.find((elm) => elm.id.toString() === categoryId);

        let submission = createReportSubmission(category, this._article.headline);
        createSubmissionForm(submission, "explanation", `Why report this article as a ${category.category}?`)
            .then((data) => {
                let modal = Modal.getInstance();
                modal.setHtmlContent(data);
                modal.open();
            });

    }

    onTemplateLoaded(html: HTMLElement) {
        let container = html.querySelector(`.${CLASS_PREFIX}-article-menu`);

        for(let category of this._reportCategories) {
            let button = <HTMLButtonElement>document.createElement("button");
            button.setAttribute("categoryId", category.id.toString());
            button.innerText = `Report as ${category.category}`;
            button.onclick = this.report_button_click.bind(this);
            container.appendChild(button);
        }

        super.onTemplateLoaded(html);
    }

    inject(data) {
        this._reportCategories = data.reportCategories;
        super.inject(data);
    }
}

export default ReportModeOverlay;