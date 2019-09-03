import * as React from "react";
import HeadlineRevision from './HeadlineRevision';
import NavBar from "./NavBar";
import {messageTypes} from "../config/messageTypes";
import ArticleRevision from "./ArticleRevision";
import {IArticle} from "../models/article";
import {IHeadline} from "../models/headline";

export interface IAppProps {
}

export interface IAppState {
    selected: number;
    frontPage: boolean;
    headlines: IHeadline[];
    articles: IArticle[];
    exclude: string;
}

export default class App extends React.Component<IAppProps, IAppState> {
    private backgroundPageConnection;

    constructor(props: IAppProps) {
        super(props);
        //@ts-ignore
        chrome.devtools.inspectedWindow.reload();
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
            tabId: chrome.devtools.inspectedWindow.tabId,
            payload: {}
        });

        document.onkeydown = (event) => {
            switch (event.key) {
                case 's': {
                    this.backgroundPageConnection.postMessage({
                        type: messageTypes.TURN_HOOVER_SELECT_OFF,
                        tabId: chrome.devtools.inspectedWindow.tabId,
                        payload: {}
                    });
                    console.log('Hoover off and selected is: ' + this.state.selected);

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
                    let exclude = message.payload.exclude;
                    let selected = 0;
                    let headlineId = 0;
                    if (!exclude) {
                        exclude = "something that will never be a part of a headline so make it superlong sansddfasdhjghsdakjd fldsah g3weh qaj";
                    }

                    console.log(urlId);
                    // First find the headline id
                    let found = false;
                    for (let i = 0; i < headlines.length; i++) {
                        let headline = headlines[i];
                        if (headline.url_id == urlId && urlId != "") {
                            if (!(headline.url.includes(exclude))) {
                                headlineId = i;
                                found = true;
                            }
                        }
                    }

                    if (!found) {
                        selected = -1;
                    } else {
                        // Then the correct article that is linked to the headline
                        for (let i = 0; i < articles.length; i++) {
                            let article = articles[i];
                            if (article.headline == headlines[headlineId].id) {
                                found = true;
                                selected = i;
                            }
                        }
                    }

                    console.log("The selected headline is indexed at: " + selected);

                    this.setState({
                        ...this.state,
                        headlines,
                        articles,
                        selected,
                        frontPage,
                        exclude,
                    });
                    break;
                }

                case messageTypes.SELECT: {
                    let urlId = message.payload.selected;
                    console.log('Received message that: ' + urlId + ' is selected.');
                    let found = false;

                    for (let i = 0; i < this.state.headlines.length; i++) {
                        let headline = this.state.headlines[i];
                        if (headline.url_id == urlId && urlId != "") {
                            if (!(headline.url.includes(this.state.exclude))) {
                                found = true;
                                this.setState({
                                    ...this.state,
                                    selected: i,
                                });
                            }
                        }
                    }
                    if (!found) {
                        console.log(urlId);
                        this.setState({
                            ...this.state,
                            selected: -1,
                        });
                    }
                    console.log(this.state.selected);
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
                if (this.state.selected == -1) {
                    return (
                        <div className="App">
                            <NavBar/>
                            <h2>Programmet kjenner ikke igjen denne saken</h2>
                            <button onClick={(event) => {
                                this.backgroundPageConnection.postMessage({
                                    type: messageTypes.TURN_HOOVER_SELECT_ON,
                                    tabId: chrome.devtools.inspectedWindow.tabId,
                                    payload: {}
                                })
                            }
                            }> Velg en annen artikkel
                            </button>
                            <p> Hint: Når du beveger musen over en artikkel du vil titte nærmere på, klikk s på
                                tastaturet for å fukusere på saken!</p>
                        </div>)
                } else {
                    return (
                        <div className="App">
                            <NavBar/>
                            <HeadlineRevision
                                diffs={this.state.headlines[this.state.selected].diffs}
                                revisions={this.state.headlines[this.state.selected].revisions}
                            />
                            <button onClick={(event) => {
                                this.backgroundPageConnection.postMessage({
                                    type: messageTypes.TURN_HOOVER_SELECT_ON,
                                    tabId: chrome.devtools.inspectedWindow.tabId,
                                    payload: {}
                                });
                                console.log('Turn hoover mode on.')
                            }
                            }> Velg en annen artikkel
                            </button>
                            <p> Hint: Når du beveger musen over en artikkel du vil titte nærmere på, klikk s på
                                tastaturet for å fukusere på saken!</p>
                            <button onClick={(event) => {
                                console.log('Go to article with change');
                                let longest = 0;
                                let articleSelected = null;
                                for (let article of this.state.articles) {
                                    if (article.revisions.length > longest) {
                                        for (let headline of this.state.headlines) {
                                            if (headline.id == article.headline) {
                                                articleSelected = article;
                                                longest = article.revisions.length
                                            }
                                        }
                                    }
                                }

                                console.log(articleSelected);
                                if (articleSelected) {
                                    this.backgroundPageConnection.postMessage({
                                        type: messageTypes.REDIRECT_TO,
                                        tabId: chrome.devtools.inspectedWindow.tabId,
                                        payload: {
                                            address: articleSelected.url
                                        }
                                    });
                                }

                            }}>Press here to go to an article that has been changed
                            </button>
                        </div>
                    )
                }
            } else {
                if (this.state.selected == -1) {
                    return <h1>Det er ikke støtte for denne siden.</h1>
                } else {
                    return <ArticleRevision connection={this.backgroundPageConnection} article={this.state.articles[this.state.selected]}/>
                }
            }
        }
    }
}
