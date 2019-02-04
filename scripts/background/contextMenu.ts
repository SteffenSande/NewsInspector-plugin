import Storage from "./storage/storage";
import {createMessage, messageTypes} from "../config/messageTypes";
import {createSubmissionForm} from "../util/util";
import {ISubmission} from "../models/submission";
import Wordcloud from "./wordcloud";
import Notification from "../models/notification";

class ContextMenu {
    private _storage: Storage = Storage.getInstance();
    public contextMenuElementNewsEnhancerId: number = -1;
    private _wordCloud: Wordcloud;

    constructor(cloud: Wordcloud){
        this._wordCloud = cloud;
    }

    reload = () => {
        chrome.contextMenus.removeAll();
        this.createContextMenuWordcloud();
    };

    createContextMenuSubmission = (submission: ISubmission, textareaName: string, formTitle: string) => {
        chrome.contextMenus.create({
            title: submission.notification.title,
            contexts:["link"],
            onclick: (info, tab) => {
                createSubmissionForm(submission, textareaName, formTitle)
                    .then((data) => chrome.tabs.sendMessage(tab.id,  createMessage(messageTypes.SHOW_IN_MODAL,data)));
            }
        });
    };

    createContextMenuWordcloud = () => {
        chrome.contextMenus.create({
            title: "Wordcloud",
            contexts:["link"],
            onclick: (info, tab) => {
                if (this.contextMenuElementNewsEnhancerId === -1)
                    Notification.notifyUser({title: "Wordcloud error", message: "Did not click a supported headline or article"});
                else
                    this._wordCloud.showWordCloudForId(this.contextMenuElementNewsEnhancerId, tab);
            }
        });
    };
}

export default ContextMenu;
