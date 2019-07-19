import * as React from "react";
import NavBar from "./NavBar";
import {createNodes} from "../util/diff";
import {getLocalTime} from "../util/util";

export interface IArticleRevisionProps {
    article: any
}

export interface IArticleRevisionState {
    title: string,
    ingress: string,
    words: string [],
    selected: number,
}

export default class ArticleRevision extends React.Component<IArticleRevisionProps,
    IArticleRevisionState> {

    constructor(props: IArticleRevisionProps) {
        super(props);
        this.state = {
            title: 'Plass holder',
            ingress: 'Plass holder',
            words: [],
            selected: 1,
        }
    }

    static replaceWord(text, word) {
        let wordsInText = text.split(' ');
        let result = [];
        for (let wordInText of wordsInText) {
            if (wordInText != word) {
                result.push(wordInText);
            }
        }
        return result.join(' ');
    }

    componentDidMount(): void {
        if (this.props.article) {
            let title = this.props.article.revisions[0].title;
            let ingress = this.props.article.revisions[0].sub_title;
            let words = [];

            fetch(chrome.runtime.getURL('norwegian_stop_words.txt'))
                .then(file => {
                    return file.text()
                })

                .then(text => {
                    let everyWord = text.split('\n');
                    for (let word of everyWord) {
                        let temp = ArticleRevision.replaceWord(title, word);
                        if (temp != title) {
                            // @ts-ignore
                            if (!words.includes(word)) {
                                words.push(word);
                            }
                            title = temp;
                        }
                        temp = ArticleRevision.replaceWord(ingress, word);
                        if (temp != ingress) {
                            // @ts-ignore
                            if (!words.includes(word)) {
                                words.push(word);
                            }

                            ingress = temp;
                        }
                        this.setState({...this.state, title, ingress, words})
                    }
                });
        }
    }

    change_list() {
        let result = [];
        result = result.concat(this.create_multiple_nodes());
        return result.map((node) => <li key={node.toString()}>{node}</li>);
    }

    create_multiple_nodes() {
        let result = [];
        for (let diff of this.props.article.revisions[this.state.selected].diffs) {
            result.push(createNodes(diff.changes))
        }
        return result
    }

    chooseNext() {
        if (this.state.selected < this.props.article.revisions.length - 1) {
            this.setState({
                ...this.state,
                selected: this.state.selected + 1,
            });
        } else {
            this.setState({...this.state, selected: 1});
        }
    }

    choosePrevious() {
        if (this.state.selected > 1) {
            this.setState({
                ...this.state,
                selected: this.state.selected - 1,
            });
        } else {
            this.setState({
                ...this.state, selected: this.props.article.revisions.length - 1,
            });
        }
    }

    dynamicForwardButtonText() {
        if (this.state.selected == this.props.article.revisions.length - 1) {
            return "Gå til første endring";
        } else {
            return "Neste endring";
        }
    }

    dynamicBackButtonText() {
        if (this.state.selected == 1) {
            return "Gå til siste endring";
        } else {
            return "Forrige endring";
        }
    }

    render() {
        if (!this.props) {
            return <div> Not ready yet, still loading the data </div>
        } else if (this.props.article == undefined) {
            return <div> The article is not loaded correctly contact the developer </div>
        } else {
            if (this.props.article.revisions.length != 0) {
                if (this.props.article.revisions.length == 1) {
                    return (
                        <div>
                            <NavBar/>
                            <h1> Det er enda ikke gjort noen endringer på denne artikkelen </h1>
                        </div>);
                } else {
                    if (this.props.article.revisions.length == 2) {
                        return (
                            <div>
                                <NavBar/>
                                <h1> Endringer: </h1>
                                <h3>{getLocalTime(this.props.article.revisions[this.state.selected].timestamp).format('HH:mm')}</h3>
                                <ul>
                                    {this.change_list()}
                                </ul>
                            </div>);
                    } else {
                        return (
                            <div>
                                <NavBar/>
                                <h1> Endringer: </h1>
                                <h3>{getLocalTime(this.props.article.revisions[this.state.selected].timestamp).format('HH:mm')}</h3>
                                <button className={'btn btn-light'}
                                        onClick={() => this.choosePrevious()}
                                >{this.dynamicBackButtonText()}
                                </button>
                                <button className={'btn btn-dark'}
                                        onClick={() => this.chooseNext()}
                                > {this.dynamicForwardButtonText()}
                                </button>
                                <h4> Endring {this.state.selected} av {this.props.article.revisions.length - 1} </h4>
                                <ul>
                                    {this.change_list()}
                                </ul>
                            </div>);
                    }
                }
            } else {
                return <div>
                    <NavBar/>
                    <h1> 0 endringer på artikkelen med Tittel: </h1>
                    <h2> {this.state.title}</h2>
                    <h3> Ingress: </h3>
                    <h4> {this.state.ingress}</h4>
                    <h3> Tok vekk følgende ord: </h3>
                    {this.state.words.map(word => <p> {word} </p>)}
                </div>
            }
        }
    }

}
