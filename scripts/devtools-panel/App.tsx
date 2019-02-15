import * as React from "react";
import * as Api from "../util/api";
import {EndPoints} from "../util/enums";
import {headline} from "../models/headline";
import HeadlineRevision from './HeadlineRevision';
import NavBar from "./NavBar";
import Log from '../util/debug';

export interface IAppProps {
}

export interface IAppState {
    selected: number;
    headlines: headline[];
    diffNr: number;
}

export default class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);
    }

    componentDidMount() {
        // Information needed from the content script is what
        // and what headline is currently selected.
        let headline = Api.get(EndPoints.SITE + "3/" + EndPoints.HEADLINE);
        headline
            .then((h: headline[]) => {
                Log.info(headline);
                let indexOfElementThatHasDiffs = 1;
                for (let i = 0; i < h.length; i++) {
                    if (h[i].diffs.length > 0) {
                        indexOfElementThatHasDiffs = i;
                    }
                }
                this.setState({...this.state, headlines: h, selected: indexOfElementThatHasDiffs, diffNr: 0});
                this.setState({...this.state,});
            })
            .catch(error => {
                Log.error(error);
            });
    }

    chooseNext() {
        if (this.state.diffNr < this.state.headlines[this.state.selected].diffs.length - 1) {
            this.setState({...this.state, diffNr: this.state.diffNr + 1});
        } else {
            this.setState({...this.state, diffNr: 0});
        }
    }

    choosePrevious() {
        if (this.state.diffNr > 0) {
            this.setState({...this.state, diffNr: this.state.diffNr - 1});
        } else {
            this.setState({...this.state, diffNr: this.state.headlines[this.state.selected].diffs.length - 1});
        }
    }

    render() {
        if (this.state === null) {
            return (
                <div className="App">
                    <NavBar/>
                    <div className="loader"/>
                </div>)
        } else {
            if (this.state.headlines[this.state.selected].diffs.length == 0) {
                return (
                    <div className="App">
                        <NavBar/>
                        <HeadlineRevision
                            title={this.state.headlines[this.state.selected].info.revision.title}
                        />
                    </div>)

            } else {
                return (
                    <div className="App">
                        <NavBar/>
                        <HeadlineRevision
                            title={this.state.headlines[this.state.selected].diffs[this.state.diffNr].title}
                        />
                        <button className={'btn btn-light'}
                                onClick={() => {
                                    this.choosePrevious();
                                }}
                        > Previous diff
                        </button>
                        <button className={'btn btn-dark'}
                                onClick={() => {
                                    this.chooseNext();
                                }}
                        > Next diff
                        </button>
                    </div>)
            }
        }
    }
}
