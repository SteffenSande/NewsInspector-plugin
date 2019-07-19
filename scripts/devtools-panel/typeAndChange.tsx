import React, {Component} from "react";
import {createNodes} from "../util/diff";

export interface IChangeProps {
    render: boolean,
    onlyShowChange: boolean,
    old: string,
    new: string,
    type: string,
    changes: any[],
}

export interface IChangeState {
}

export default class TypeAndChange extends Component<IChangeProps, IChangeState> {
    constructor(props: IChangeProps) {
        super(props);
        this.state = {};
    }

    ifOldTitleIsNothing() {
        let old = this.props.type.toLowerCase();
        if (old) {
            return old;
        } else {
            return "Tidligere var det ingen " + this.props.type.toLowerCase();
        }
    }

    ifNewTitleIsNothing() {
        let newer = this.props.type.toLowerCase();
        if (newer) {
            return newer;
        } else {
            return "Det er ikke lenger en " + this.props.type.toLowerCase();
        }
    }

    dynamicTextForAddedOrRemoved(type: number, change: string) {
        if (type == -1) {
            return this.props.type + " ble tatt vekk";
        } else if (type == 1) {
            return this.props.type + " ble lagt til"
        } else {
            return this.props.type
        }
    }

    public render() {
        if (this.props.render) {
            if (this.props.onlyShowChange) {
                return (
                    <div>
                        <h2> {this.dynamicTextForAddedOrRemoved(this.props.changes[0].type_of_change, this.props.changes[0].text)} </h2>
                        <p>
                            {createNodes(this.props.changes)}
                        </p>
                    </div>);
            } else {
                return (
                    <div>
                        <h3> {this.props.type} </h3>
                        <p>
                            <strong> Gammel {this.ifOldTitleIsNothing()}: </strong>
                            {this.props.old}
                        </p>
                        <p>
                            <strong> Ny {this.ifNewTitleIsNothing()}: </strong>
                            {this.props.new}
                        </p>
                        <p>
                            <strong> Endring i {this.props.type.toLowerCase()}: </strong>
                            {createNodes(this.props.changes)}
                        </p>
                    </div>
                );
            }
        } else {
            return null
        }
    }
}

