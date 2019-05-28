import {INewsSite} from "../models/newsSite";
import {find_headline_id} from "../util/util";
import {messageTypes} from "../config/messageTypes";
import Log from "../util/debug";

export class Overlay {
    private tagClass: string;
    private headlines: any;
    private site: INewsSite;
    private selected: number;
    private hooverOn: boolean;

    constructor(site: INewsSite, tagClass: string) {
        this.site = site;
        this.tagClass = tagClass;
        this.headlines = document.getElementsByClassName(tagClass);
        this.hooverOn = false;

        document.onkeydown = (event) => {
            switch (event.key) {
                case 'i': {
                    this.turnOnHooverMode();

                    break;
                }
            }
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case 'i': {
                    this.turnOffHooverMode();
                    break;
                }

            }
        };
        for (let i = 0; i < this.headlines.length; i++) {
            let headline = this.headlines[i];
            headline.onmouseover = (event) => {
                if (this.hooverOn) {
                    let id = this.findHeadlineId(headline);
                    console.log(this.selected);
                    if (this.selected != i) {
                        this.selected = i;
                        chrome.runtime.sendMessage(
                            {
                                type: messageTypes.SELECT,
                                payload: {
                                    selected: id
                                }
                            });
                        if (id) {
                            console.log('Identitet: ' + id + ' og index: ' + i);
                        } else {
                            console.log("reklame");
                        }
                    }
                }
            };
        }
    }

    findHeadlineId(headline) {
        return find_headline_id(headline.getElementsByTagName('a')[0].href, this.site.urlTemplates);
    }

    turnOnHooverMode() {
        this.hooverOn = true;
    }

    turnOffHooverMode() {
        this.hooverOn = false;
    }
}
