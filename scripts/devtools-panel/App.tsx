import * as React from "react";
import * as Api from "../util/api";
import {EndPoints} from "../util/enums";
import {headline} from "../models/headline";
import HeadlineRevision from './HeadlineRevision';

export interface IAppProps {
}

export interface IAppState {
    selected: number;
    headlines: headline[];
}

export default class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);
        this.state = {
            selected: 1,
            headlines: []
        }
    }

    componentDidMount() {
        // Information needed from the content script is what
        // and what headline is currently selected.
        let headline = Api.get(EndPoints.SITE + "4/" + EndPoints.HEADLINE);
        headline.then((h: headline[]) => {
            this.setState({...this.state, headlines: h});
        });
        this.setState({...this.state, selected:0})
    }

    chooseNext() {
        if (this.state.selected < this.state.headlines.length - 1) {
            this.setState({...this.state, selected: this.state.selected + 1});
        } else {
            this.setState({...this.state, selected: 0});
        }
    }

    render() {
        return this.state.headlines.length == 0 ? (
            <div className="App">
                <div className="loader"/>
            </div>
        ) : (
            <div className="App">
                <HeadlineRevision
                    title={this.state.headlines[this.state.selected].revision.title}
                />
                <button onClick={() => this.chooseNext()}> Next headline</button>
            </div>
        );
    }
}
