import Log from "../util/debug";
import {ISubmission} from "../models/submission";
import {createMessage, messageTypes} from "../config/messageTypes";
import {getHtmlTemplate} from "../util/util";

class Modal {

    protected _overlay: HTMLElement;
    protected _modal: HTMLElement;
    protected _close: HTMLElement;
    protected _loading: HTMLElement;
    protected _templateName: string;
    protected _classPrefix: string;

    private static _instance: Modal = new Modal();


    public static getInstance(): Modal
    {
        return Modal._instance;
    }

    protected constructor() {
        if(Modal._instance){
            throw new Error("Error: Instantiation failed: Use modal.getInstance() instead of new.");
        }
        Modal._instance = this;

        this._templateName = "modal.html";
        this._classPrefix = "news-enhancer-modal";

        this.createElements();

    }

    setHtmlContent(data: any) {
        this.clear();
        this._modal.innerHTML = data.html;
        this._modal.querySelector("div").appendChild(this._close);

        this.setSubmissionCallback(data.submission);
    }

    private setSubmissionCallback(submission: ISubmission) {
        if (typeof submission === "undefined" || submission === null)
            return;

        let form = <HTMLElement>this._modal.querySelector(`#${submission.formId}`);
        let quit = <HTMLButtonElement>form.querySelector("#news-enhancer-submission-quit-button");
        if (quit != null)
            quit.onclick = () => this.close();

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let newSubmission = Object.assign({}, submission);

            let f = <HTMLElement>e.target;
            for(let element of f.childNodes) {
                let elm =  <HTMLElement>element;

                if (typeof elm.tagName !== "undefined" && (elm.tagName.toLowerCase() === "input" || elm.tagName.toLowerCase() === "textarea")) {
                    let name = elm.getAttribute("name");
                    if (name !== null && name.length !== 0)
                        newSubmission.payload[name] = (<HTMLFormElement>elm).value;
                }
            }

            chrome.runtime.sendMessage(createMessage(messageTypes.SUBMIT, newSubmission));
            this.close();
        });
    }

    clear() {
        while (this._modal.hasChildNodes()) {
            this._modal.removeChild(this._modal.lastChild);
        }
    }

    setTextContent(content: string) {
        this._modal.innerText = content;
    }

    open() {
        this.toggle(true);
    }

    close() {
        this.toggle(false);
    }

    startLoadingSequence() {
        this.setHtmlContent({html: this._loading.outerHTML});
        this.open();
    }

    private toggle(open: boolean) {
        let display = open ? "flex" : "none";
        this._overlay.style.display = display;
        this._modal.style.display = display;
    }

    private createElements() {
        getHtmlTemplate(this._templateName)
            .then((html: HTMLElement) => {
                this._loading = <HTMLElement>html.querySelector(`.${this._classPrefix}-loading`);
                this._close = <HTMLElement>html.querySelector(`.${this._classPrefix}-close`);
                this._overlay = <HTMLElement>html.querySelector(`.${this._classPrefix}-overlay`);
                this._modal = <HTMLElement>html.querySelector(`.${this._classPrefix}`);

                // Append elements to dom
                document.body.appendChild(<Node>this._overlay);
                document.body.appendChild(<Node>this._modal);

                // Event listeners for closing the modal
                this._close.onclick = this.close.bind(this);
                this._overlay.onclick = this.close.bind(this);

                this.close();
            });
    }
}

export default Modal;