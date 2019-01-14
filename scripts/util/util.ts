import {ILimit, Limits} from "../models/limit";
import * as moment from '../../node_modules/moment/min/moment-with-locales.min.js';
import Log from "./debug";
import {ISubmission} from "../models/submission";
import {IArticleUrlTemplates} from "../models/ArticleUrlTemplates";

/**
 * Prints a datetime or a empty string
 * @param dateString
 * @returns string
 */
export function printDateTime(dateString: string): string {
    if (dateString === undefined || dateString === null || dateString.length === 0)
        return "";

    try {
        let then = moment(dateString);
        let now = moment();
        return `${moment.duration(then.diff(now)).humanize(true)}`;
    }catch(e){
        return "";
    }
}

/**
 * Trims get params off url
 * @param url
 * @returns {string}
 */
export function trimUrl(url): string {
    if (url === undefined || url.length === 0)
        return '';

    return url
        .split('?')[0] // Removes get parameters
        .split('#')[0]; // Removes anchors
}


/**
 * Retrieves the limit which is closets to the number of reports.
 * If no limits are found, the ignore limit is returned
 * @param limits
 * @param reportCount
 * @returns {null}
 */
export function getNearestLimitWithValue(limits: ILimit[], reportCount: number): ILimit {
    let lessOrEqualLimitsInDescending = limits
        .filter((limit: ILimit) => limit.value <= reportCount)
        .sort((a: ILimit, b: ILimit) => b.value - a.value);

    if (lessOrEqualLimitsInDescending.length > 0)
        return lessOrEqualLimitsInDescending[0];
    return {key: Limits.Ignore, value: 0};
}


/**
 * Parses a downloaded image to base64 string
 * @param blob
 * @returns {Promise<T>}
 */
export function imageToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = (e) => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob)
    });
}

/**
 * Retrieves html from e specific template
 * @param templatePath
 * @param templateSection
 * @returns {Promise<T>}
 */
export function getHtmlTemplate(templatePath: string, templateSection: string = null) {
    return new Promise((resolve, reject) => fetch(chrome.extension.getURL(`html/templates/${templatePath}`))
        .then(response => {
            response.text()
                .then((html) => {
                    let parser = new DOMParser();
                    let htmlDoc = parser.parseFromString(html, "text/html");

                    if (templateSection === null)
                        return resolve(htmlDoc);

                    resolve(<HTMLElement>htmlDoc.querySelector(templateSection));
                });
        }));
}

/**
 * Retrieves the specific resource
 * @param path
 */
export function getResource(path: string) {
    return chrome.extension.getURL(path);
}

/**
 * Trims a url https://www.something.no/heua/ to something.no
 * @param {string} url
 * @returns {string}
 */
export function trimUrlToHostname(url: string) {
    try{
        return trimUrlHttpProtocol(url).replace("www.", "").split('/')[0];
    }catch(e){
        return trimUrlHttpProtocol(url);
    }
}

/**
 * Trims a url https://www.something.no/heua/ to heua/
 * @param {string} url
 * @returns {string}
 */
export function trimUrlToPath(url: string) {
    try{
        return trimUrlHttpProtocol(url).split("/").slice(1).join("/");
    }catch(e){
        return trimUrlHttpProtocol(url);
    }
}

/**
 * Trims a url https://www.something.no/heua/?ad=s to https://www.something.no/heua
 * @param {string} url
 * @returns {string}
 */
export function trimUrlGetParams(url: string) {
    try{
        let question = url.split("?")[0];
        let hash = question.split("#")[0];
        if (hash.endsWith("/"))
            return hash.slice(0, -1);
        return hash;
    }catch(e){
        return url;
    }
}

/**
 * Removes http, https and :// from the url
 * @param {string} url
 * @returns {string}
 */
export function trimUrlHttpProtocol(url: string) {
    try{
        return url
            .replace("https", "")
            .replace("http", "")
            .replace("://", "");
    }catch(e){
        return url;
    }
}


/**
 * Retrieves the current tab
 */
export function currentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            resolve(tabs[0]);
        });
    });
}

/**
 * Creates a html element from a string
 * @param htmlString
 * @returns {Node}
 */
export function htmlStringToElement(htmlString): Node {
    let template = document.createElement('template');
    template.innerHTML = htmlString;
    return template.content.firstChild;
}

/**
 * Calculate time in minutes to read x words.
 * Use 130 words per minute as measurement.
 * @param {number} words
 * @returns {string} x min. I.E for 130 words would this return 1 min.
 */
export function wordsToReadingTimeInMinutes(words: number): string {
    let wordsPerMinute = 130;
    let min = Math.round(words / wordsPerMinute);
    return min > 0 ? `${min} min` : "";
}

/**
 * Creates a submission form in html
 * Additional payload can be added within ISubmission payload field
 * @param {ISubmission} submission The submission to be sent
 * @param {string} textareaName Name of the text area
 * @param {string} formTitle The title showing over the form
 * @returns {Promise<any>}
 */
export function createSubmissionForm(submission: ISubmission, textareaName: string, formTitle: string): Promise<any> {
    return new Promise((resolve, reject) => getHtmlTemplate("submissionForm.html", "body")
        .then((template: HTMLElement) => {
            let html = <HTMLElement>template.cloneNode(true);

            let textarea = <HTMLElement>html.querySelector('textarea');
            textarea.setAttribute("name", textareaName);

            let title = <HTMLElement>html.querySelector("#news-enhancer-submission-form-title");
            title.innerText = formTitle;

            let data = {
                html: html.innerHTML, submission: submission
            };
            resolve(data)
        })
    );
}

export function find_headline_id(headlineUrl: string, urlTemplates: IArticleUrlTemplates[]): string {
    let url = headlineUrl.split('/');

    for (let url_template of urlTemplates) { let url_id = url[url.length + url_template.id_position];

        if (url_template.id_separator.length > 0) {
            let splitted_url_id = url_id.split(url_template.id_separator);
            url_id = splitted_url_id[splitted_url_id.length - 1];
        }

        if (url_id.length === url_template.id_length)
            return url_id
    }
    return "";
}