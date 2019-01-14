import {ArticleCategory} from "./article";
import {IRevision} from "./revision";
import {printDateTime} from "../util/util";
import Revision from "./revision";
import {IHeadlineSummary} from "./headlineSummary";
import {IHeadlineReport} from "./headlineReport";
import {IHeadlineRevision} from "./headlineRevision";
import {IHeadlineDiff} from "./headlineDiff";

export interface IHeadline {
    id: number,
    news_site: number
    url: string,
    summary: IHeadlineSummary,
    info: IHeadlineInfo,
    reports: IHeadlineReport[],
    revision: IHeadlineRevision,
    url_id: string,
    diffs: IHeadlineDiff[]
}


export interface IHeadlineInfo {
    revision: IRevision,
    category: ArticleCategory
    published: string,
    updated: string
}

class HeadlineInfo implements IHeadlineInfo {
    public revision: Revision;
    public category: ArticleCategory;
    private _updated: string;
    private _published: string;
    
    set updated(updated: string) {
        this._updated = updated;
    }
    set published(published: string) {
        this._published = published;
    }

    get updated(): string {
        return printDateTime(this._updated);
    }
    get published(): string {
        return printDateTime(this._published);
    }
    fromJSON(info: IHeadlineInfo) {

        this._updated = info.updated;
        this._published = info.published;
        this.category = info.category;

        this.revision = new Revision();
        this.revision.fromJSON(info.revision);
    }
}

export default HeadlineInfo;