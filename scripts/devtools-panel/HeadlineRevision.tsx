import * as React from 'react';
import Log from "../util/debug";
import Subtitle from "./Subtitle";
import {createNodes} from "../util/diff";


export interface IHeadlineRevisionProps {
    diffs: any[];
}

export interface IHeadlineRevisionState {
    selected: number;
}

export default class HeadlineRevision extends React.Component<IHeadlineRevisionProps,
    IHeadlineRevisionState> {
    constructor(props: IHeadlineRevisionProps) {
        super(props);
        this.state = {
            selected: 0
        };
    }

    chooseNext() {
        Log.info('This is the state and selected is: ' + this.state.selected);
        if (this.state.selected < this.props.diffs.length - 1) {
            this.setState({...this.state, selected: this.state.selected + 1});
        } else {
            this.setState({...this.state, selected: 0});
        }
    }

    choosePrevious() {
        if (this.state.selected > 0) {
            this.setState({...this.state, selected: this.state.selected - 1});
        } else {
            this.setState({...this.state, selected: this.props.diffs.length - 1});
        }
    }

    render() {
        if (!this.props.diffs) {
            return (
                <div>
                    <p id={'title'}>
                        <strong> Tittel: </strong>
                        Reklame
                    </p>
                </div>
            );
        } else {

            if (this.props.diffs.length == 1) {
                return (
                    <div>
                        <p id={'title'}>
                            <strong> Tittel: </strong>
                            {createNodes(this.props.diffs[this.state.selected][0])}
                        </p>
                        <Subtitle hasSubtitle={this.props.diffs[this.state.selected][1]}
                                  subtitle={this.props.diffs[this.state.selected][1]}/>
                    </div>
                );
            } else {
                return (
                    <div>
                        <p id={'title'}>
                            <strong> Tittel: </strong>
                            {createNodes(this.props.diffs[this.state.selected][0])}
                        </p>
                        <Subtitle hasSubtitle={this.props.diffs[this.state.selected][1]}
                                  subtitle={this.props.diffs[this.state.selected][1]}/>

                        <button className={'btn btn-light'}
                                onClick={() => this.choosePrevious()}
                        > Forrige endring
                        </button>
                        <button className={'btn btn-dark'}
                                onClick={() => this.chooseNext()}
                        > Neste endring
                        </button>
                    </div>
                );
            }

        }
    }
}
