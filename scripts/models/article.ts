import {IArticleRevision} from "./articleRevision";

export enum ArticleCategory {
    Article = "ARTICLE",
    Feed = "FEED",
    External = "EXTERNAL",
    Video = "VIDEO",
    NoInfo = "NOINFO"
}


export interface IArticle {
    category: ArticleCategory,
    headline: number,
    news_site: number,
    word_cloud: string,
    revisions: IArticleRevision[],
    diffs: string[]
}

