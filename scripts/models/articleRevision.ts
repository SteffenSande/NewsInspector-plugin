import {IJournalist} from "./journalist";
import {IImage} from "./image";
import {IChange} from "./headlineDiff";

export interface IArticleDiff{
    id:number,
    changes: IChange[],
}
export interface IArticleRevision {
    id: number,
    diffs: IArticleDiff[],
    images: IImage[],
    journalists: IJournalist[],
    timestamp: string,
    version: number,
    title: string,
    sub_title: string,
    words: number,
    subscription: boolean
}