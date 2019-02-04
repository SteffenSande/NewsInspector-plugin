import * as React from 'react';

import InfoWithLabel from "./InfoWithLabel";

export interface IHeadlineRevisionProps {
  title: string;
}

export interface IHeadlineRevisionState {}

export default class HeadlineRevision extends React.Component<
  IHeadlineRevisionProps,
  IHeadlineRevisionState
> {
  constructor(props: IHeadlineRevisionProps) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <InfoWithLabel label="Title" value={this.props.title} />
      </div>
    );
  }
}
