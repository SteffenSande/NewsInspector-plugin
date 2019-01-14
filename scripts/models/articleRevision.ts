import {IJournalist} from "./journalist";
import {IImage} from "./image";

export interface IArticleRevision {
    id: number,
    images: IImage[],
    journalists: IJournalist[],
    timestamp: string,
    version: number,
    title: string,
    sub_title: string,
    words: number,
    subscription: boolean
}