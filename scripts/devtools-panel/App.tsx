import * as React from "react";
import HeadlineRevision from './HeadlineRevision';
import NavBar from "./NavBar";
import {messageTypes} from "../config/messageTypes";
import Log from "../util/debug";
import ArticleRevision from "./ArticleRevision";

export interface IAppProps {
}

export interface IAppState {
    selected: number;
    frontPage: boolean;
    headlines: any[];
    articles: any[];
}

export default class App extends React.Component<IAppProps, IAppState> {
    private backgroundPageConnection;

    constructor(props: IAppProps) {
        super(props);
    }

    componentDidMount() {
        // The communication to the api happens in the background script so all we really need here is a way to
        // Get information from the background script.
        // Information needed from the content script is what
        // and what headline is currently selected.
        // Create a connection to the background page
        this.backgroundPageConnection = chrome.runtime.connect({
            name: "panel"
        });

        this.backgroundPageConnection.postMessage({
            type: messageTypes.INIT,
            payload: {
                tabId: chrome.devtools.inspectedWindow.tabId
            }
        });
        document.onkeydown = (event) => {
            switch (event.key) {
                case 's': {
                    this.backgroundPageConnection.postMessage({
                        type: messageTypes.TURN_HOOVER_SELECT_OFF,
                        payload: {}
                    })
                }
            }
        };

        this.backgroundPageConnection.onMessage.addListener((message) => {
            switch (message.type) {
                case messageTypes.INIT: {
                    let headlines = message.payload.headlines;
                    let articles = message.payload.articles;
                    let frontPage = message.payload.frontPage;
                    let urlId = message.payload.urlId;
                    let selected = 0;
                    let headlineId = -1;

                    // First find the headline id
                    for (let i = 0; i < headlines.length; i++) {
                        let headline = headlines[i];
                        if (headline.url_id == urlId) {
                                headlineId = i;
                        }
                    }

                    // Then the correct article that is linked to the headline
                    for (let i = 0; i < articles.length; i++){
                        let article = articles[i];
                        if ( article.headline == headlines[headlineId].id){
                            selected = i;
                        }
                    }

                    this.setState({
                        ...this.state,
                        headlines,
                        articles,
                        selected,
                        frontPage,
                    });
                    break;
                }

                case messageTypes.SELECT: {
                    let urlId = message.payload.selected;
                    for (let i = 0; i < this.state.headlines.length; i++) {
                        let headline = this.state.headlines[i];
                        if (headline.url_id == urlId) {
                            this.setState({
                                ...this.state,
                                selected: i,
                            });
                        }
                    }
                    break;
                }
            }
        })
    }

    render() {
        if (this.state === null || this.state.headlines.length == 0) {
            return (
                <div className="App">
                    <NavBar/>
                    <div className="loader"/>
                </div>)
        } else {
            if (this.state.frontPage) {
                if (!this.state.headlines[this.state.selected].diffs) {

                    Log.warning('State is not null, but diff is null');

                    return (
                        <div className="App">
                            <NavBar/>
                            <HeadlineRevision
                                diffs={null}
                            />
                            <button onClick={(event) => {
                                this.backgroundPageConnection.postMessage({
                                    type: messageTypes.TURN_HOOVER_SELECT_ON,
                                    payload: {}
                                })
                            }
                            }> Velg en annen artikkel
                            </button>
                            <p> Hint: Når du beveger musen over en artikkel du vil titte nærmere på, klikk s på tastaturet for å fukusere på saken!</p>
                        </div>)
                } else {
                    return (
                        <div className="App">
                            <NavBar/>
                            <HeadlineRevision
                                diffs={this.state.headlines[this.state.selected].diffs}
                            />
                            <button onClick={(event) => {
                                this.backgroundPageConnection.postMessage({
                                    type: messageTypes.TURN_HOOVER_SELECT_ON,
                                    payload: {}
                                })
                            }
                            }> Velg en annen artikkel
                            </button>
                            <p> Hint: Når du beveger musen over en artikkel du vil titte nærmere på, klikk s på tastaturet for å fukusere på saken!</p>
                        </div>
                    )
                }
            } else {
                return <ArticleRevision article={this.state.articles[this.state.selected]}/>
            }
        }
    }
}
