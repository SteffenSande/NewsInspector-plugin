import React, {Component} from "react";
import {createNodes} from "../util/diff";

export interface ISubtitleProps {
    hasSubtitle: boolean,
    subtitle: any
}

export interface ISubtitleState {
}

export default class Subtitle extends Component<ISubtitleProps, ISubtitleState> {
    constructor(props: ISubtitleProps) {
        super(props);
        this.state = {};
    }

    public render() {
        if (this.props.hasSubtitle){
            return <div>
                <p id={'subtitle'}>
                    <strong> Underoverskrift: </strong>
                    {createNodes(this.props.subtitle)}
                </p>
            </div>
        }
        else return null;
    }
}
