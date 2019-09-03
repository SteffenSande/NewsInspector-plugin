import {IHeadlineRevision} from "./headlineRevision";
import {IHeadlineDiff} from "./headlineDiff";
import {ArticleCategory} from "./article";

export interface IHeadline {
    id: number,
    revisions: IHeadlineRevision[],
    diffs: IHeadlineDiff[]
    category: ArticleCategory,
    url_id: string,
    url: string,
    news_site: number
}


