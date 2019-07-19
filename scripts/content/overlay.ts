import {INewsSite} from "../models/newsSite";
import {find_headline_id} from "../util/util";
import {messageTypes} from "../config/messageTypes";
export class Overlay {
    private tagClass: string;
    private headlines: any;
    private site: INewsSite;
    private selected: number;
    private hooverOn: boolean;

    constructor(site: INewsSite, tagClass: string) {
        this.site = site;
        this.tagClass = tagClass;
        this.headlines = document.querySelectorAll(tagClass);
        this.hooverOn = false;
        console.log(this.headlines);

        document.onkeydown = (event) => {
            // Used switch in case we wanted more buttons to do stuff
            switch (event.key) {
                case 'i': {
                    this.turnOnHooverMode();
                    break;
                }
            }
        };

        document.onkeyup = (event) => {
            // Used switch in case we wanted more buttons to do stuff
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
                    console.log('The selected headline is: ' + id);
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
