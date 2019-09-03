import * as React from 'react';
import TypeAndChange from "./typeAndChange";
import {getLocalTime} from "../util/util";
import {IHeadlineRevision} from "../models/headlineRevision";
import {IHeadlineDiff} from "../models/headlineDiff";
import moment from "moment-timezone/moment-timezone";

export interface IHeadlineRevisionProps {
    diffs: IHeadlineDiff[];
    revisions: IHeadlineRevision[];
}

export interface IHeadlineRevisionState {
    selected: number;
    time: moment.Moment;
}

export default class HeadlineRevision extends React.Component<IHeadlineRevisionProps,
    IHeadlineRevisionState> {
    constructor(props: IHeadlineRevisionProps) {
        super(props);
        this.state = {
            selected: 0,
            time: getLocalTime(props.revisions[0].timestamp)
        };
    }

    componentWillReceiveProps(nextProps: Readonly<IHeadlineRevisionProps>, nextContext: any): void {
        if (this.props.revisions) {
            this.setState({selected: 0, time: getLocalTime(this.props.revisions[0].timestamp)});
        }
    }

    chooseNext() {
        if (this.state.selected < this.props.diffs.length - 1) {
            this.setState({
                ...this.state,
                selected: this.state.selected + 1,
                time: getLocalTime(this.props.revisions[this.state.selected + 1].timestamp)
            });
        }else{
            this.setState({
                ...this.state,
                selected: 0,
                time: getLocalTime(this.props.revisions[0].timestamp)
            });
        }
    }

    choosePrevious() {
        if (this.state.selected > 0) {
            this.setState({
                ...this.state,
                selected: this.state.selected - 1,
                time: getLocalTime(this.props.revisions[this.state.selected - 1].timestamp)
            });
        } else {
            this.setState({
                ...this.state, selected: this.props.diffs.length - 1,
                time: getLocalTime(this.props.revisions[this.props.diffs.length - 1].timestamp)
            });
        }
    }

    get_previous_title() {
        if (this.state.selected > 0) {
            return this.props.revisions[this.state.selected - 1].title
        } else {
            return this.props.revisions[this.props.diffs.length - 1].title
        }
    }

    get_previous_sub_title() {
        if (this.state.selected > 0) {
            return this.props.revisions[this.state.selected - 1].sub_title
        } else {
            return this.props.revisions[this.props.diffs.length - 1].sub_title
        }
    }


    get_date() {
        let dager: string[] = [
            'søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'
        ];
        let dag = dager[this.state.time.day()];
        return dag
    }

    dynamicForwardButtonText() {
        if (this.state.selected == this.props.diffs.length - 1) {
            return "Gå til første endring";
        } else {
            return "Neste endring";
        }
    }

    dynamicBackButtonText() {
        if (this.state.selected == 0) {
            return "Gå til siste endring";
        } else {
            return "Forrige endring";
        }
    }

    render() {
        if (this.props.revisions.length == 1) {
            return (
                <div>
                    <p>
                        <strong>Tidspunkt: </strong> Klokken {this.state.time.format('HH:mm')} på {this.get_date()} den {this.state.time.format('DD/MM/YYYY')}
                    </p>
                    <TypeAndChange
                        render={this.props.revisions[this.state.selected].title != "" && this.props.diffs[this.state.selected].title_changes.length > 0}
                        onlyShowChange={this.state.selected == 0 || this.props.diffs[this.state.selected].title_changes.length == 1}
                        old={this.get_previous_title()}
                        new={this.props.revisions[this.state.selected].title} type={'Overskrift'}
                        changes={this.props.diffs[this.state.selected].title_changes}/>
                    <TypeAndChange
                        render={this.props.revisions[this.state.selected].sub_title != "" && this.props.diffs[this.state.selected].sub_title_changes.length > 0}
                        onlyShowChange={this.state.selected == 0 || this.props.diffs[this.state.selected].sub_title_changes.length == 1}
                        old={this.get_previous_sub_title()}
                        new={this.props.revisions[this.state.selected].sub_title} type={'Underoverskrift'}
                        changes={this.props.diffs[this.state.selected].sub_title_changes}/>
                    <p>
                        <strong>Det er ingen endringer gjort</strong>
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <p>
                        <strong>Tidspunkt: </strong> Klokken {this.state.time.format('HH:mm')} på {this.get_date()} den {this.state.time.format('DD/MM/YYYY')}
                    </p>
                    <TypeAndChange
                        render={this.props.revisions[this.state.selected].title != "" && this.props.diffs[this.state.selected].title_changes.length > 0}
                        onlyShowChange={this.state.selected == 0 || this.props.diffs[this.state.selected].title_changes.length == 1}
                        old={this.get_previous_title()}
                        new={this.props.revisions[this.state.selected].title} type={'Overskrift'}
                        changes={this.props.diffs[this.state.selected].title_changes}/>
                    <TypeAndChange
                        render={this.props.revisions[this.state.selected].sub_title != "" && this.props.diffs[this.state.selected].sub_title_changes.length > 0}
                        onlyShowChange={this.state.selected == 0 || this.props.diffs[this.state.selected].sub_title_changes.length == 1}
                        old={this.get_previous_sub_title()}
                        new={this.props.revisions[this.state.selected].sub_title} type={'Underoverskrift'}
                        changes={this.props.diffs[this.state.selected].sub_title_changes}/>
                    <p>
                        Endring {this.state.selected + 1} av {this.props.diffs.length}
                    </p>
                    <button className={'btn btn-light'}
                            onClick={() => this.choosePrevious()}
                    >{this.dynamicBackButtonText()}
                    </button>
                    <button className={'btn btn-dark'}
                            onClick={() => this.chooseNext()}
                    > {this.dynamicForwardButtonText()}
                    </button>
                </div>
            );
        }
    }
}
