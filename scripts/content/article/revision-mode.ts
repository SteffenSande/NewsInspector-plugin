import {CLASS_PREFIX, HTML_FILES} from "../../config/constants";
import Log from "../../util/debug";
import BaseModeOverlay from "./baseMode";

class RevisionModeOverlay extends BaseModeOverlay {

    private _progress: HTMLElement;
    private _next_diff_button: HTMLButtonElement;
    private _previous_diff_button: HTMLButtonElement;
    private _actual_content: HTMLElement;
    private _current_index: number;

    constructor() {
        super("-revision");
        this._templateName = HTML_FILES.templates.article;
        this._current_index = 0;
        this._actual_content = null;
    }

    updateProgress() {
        this._progress.innerText = `${this._article.diffs.length - this._current_index}/${this._article.diffs.length}`
    }

    navigateButton(button: HTMLButtonElement, other_button: HTMLButtonElement, increment_index: number, limit: number) {
        if (this._current_index == limit){
            return;
        }

        other_button.disabled = false;
        this._current_index += increment_index;

        this.replace_content_with(this._article.diffs[this._current_index]);
        this.updateProgress();

        if (this._current_index == limit){
            button.disabled = true;
        }
    }

    forward_button_click() {
        this.navigateButton(this._next_diff_button, this._previous_diff_button, -1, 0);
    }
    backward_button_click() {
        let limit = this._article.diffs.length - 1;
        this.navigateButton(this._previous_diff_button, this._next_diff_button, 1, limit);
    }

    quit_button_click() {
        super.quit_button_click();
        this.replace_content_with(this._actual_content.outerHTML);
    }

    replace_content_with(newContent: string) {
        document.querySelector(this._site.articleTemplate.selector).outerHTML = newContent;
    }

    onTemplateLoaded(html: HTMLElement) {
        super.onTemplateLoaded(html);

        this._next_diff_button = <HTMLButtonElement>html.querySelector(`#${this._rootElementName}-navigation-forward`);
        this._progress = <HTMLElement>html.querySelector(`#${this._rootElementName}-navigation-progress`);
        this._previous_diff_button = <HTMLButtonElement>html.querySelector(`#${this._rootElementName}-navigation-backward`);

        this._next_diff_button.onclick = this.forward_button_click.bind(this);
        this._previous_diff_button.onclick =  this.backward_button_click.bind(this);

        if (this._article.diffs.length == 1){
            this._previous_diff_button.disabled = true;
        }

        this.updateProgress();
    }

    show() {
        super.show();
        if (this._actual_content === null) {
            this._actual_content = <HTMLElement>document.querySelector(this._site.articleTemplate.selector).cloneNode(true);
            this._next_diff_button.disabled = true;
        }
        this.replace_content_with(this._article.diffs[this._current_index]);
    }
}

export default RevisionModeOverlay;