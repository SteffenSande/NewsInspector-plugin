import * as React from 'react';

export interface IInfoWithLabelProps {
  label: string;
  value: string;
}
export interface IInfoWithLabelState {}

export default class InfoWithLabel extends React.Component<
  IInfoWithLabelProps,
  IInfoWithLabelState
> {
  constructor(props: IInfoWithLabelProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.label}: {this.props.value}
      </div>
    );
  }
}
