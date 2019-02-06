import * as React from "react";
import * as Api from "../util/api";
import {EndPoints} from "../util/enums";
import {headline} from "../models/headline";
import HeadlineRevision from './HeadlineRevision';
import NavBar from "./NavBar";

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
        let headline = Api.get(EndPoints.SITE + "4/" + EndPoints.HEADLINE);
        headline.then((h: headline[]) => {
            this.setState({...this.state, headlines: h, selected: 75, diffNr: 0});
            this.setState({...this.state,})
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
        console.log(this.state);
        return this.state === null ? (
            <div className="App">
                <NavBar/>
                <div className="loader"></div>
            </div>
        ) : (
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
            </div>
        );
    }
}
