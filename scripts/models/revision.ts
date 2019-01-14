import Journalist, {IJournalist} from "./journalist";
import {IImage} from "./image";
import {printDateTime} from "../util/util";
export interface IRevision {
    id: number,
    images: IImage[],
    journalists: IJournalist[],
    timestamp: string,
    version: number,
    title: string,
    sub_title: string,
    words: number
    subscription: boolean,
}



class Revision implements IRevision {
    public version: number;
    public id: number;
    public words: number;
    public journalists: Journalist[];
    public images: IImage[];
    public subscription: boolean;
    public title: string;
    public sub_title: string;
    private _timestamp: string;

    set timestamp(timestamp: string) {
        this._timestamp = timestamp;
    }

    public printJournalists = (): string => {
        let journalists = "";
        for(let i = 0; i < this.journalists.length; i++) {
            journalists += `${this.journalists[i].print()}`;
            if (i + 1 < this.journalists.length)
                journalists += ", ";
        }
        return journalists;
    };

    get timestamp(): string {
        return printDateTime(this._timestamp);
    }

    public fromJSON(revision: IRevision) {

        this.id = revision.id;
        this.words = revision.words;

        let journalists: Journalist[] = [];
        for(let j of revision.journalists) {
            let journalist = new Journalist();
            journalist.fromJSON(j);
            journalists.push(journalist);
        }
        this.journalists = journalists;
        this.version = revision.version;
        this._timestamp = revision.timestamp;
        this.images = revision.images;
        this.title = revision.title;
        this.sub_title = revision.sub_title;
        this.subscription = revision.subscription;
    }
}

export default Revision;