import {INotification} from "./notification";
import {IReportCategory} from "./reportCategory";
import {EndPoints} from "../util/enums";

export interface ISubmission {
    formId: string,
    url: string,
    payload?: any,
    notification: INotification
}

export function createSummarySubmission(id: number) {
    let notification: INotification =  {
        title: "Submit oneline summary",
        message: "Thanks! A moderator is reviewing your submission."
    };
    return  <ISubmission>{
        formId: "news-enhancer-headline-submission-form",
        url: EndPoints.SUBMIT_SUMMARY,
        notification: notification,
        payload: {headline: id}
    };
}

export function createReportSubmission(category: IReportCategory, id: number) {
    let notification: INotification =  {
        title: `Report as ${category.category}`,
        message: `A ${category.category} report has been dispatched`
    };
    return <ISubmission> {
        formId: "news-enhancer-headline-submission-form",
        url: EndPoints.REPORT,
        notification: notification,
        payload: {id: id, category: category.id}
    };
}