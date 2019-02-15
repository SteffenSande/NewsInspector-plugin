import * as React from 'react';

export interface IInfoWithLabelProps {
  label: string;
  value: string;
}

export interface IInfoWithLabelState {
}

export default class InfoWithLabel extends React.Component<
  IInfoWithLabelProps,
  IInfoWithLabelState
> {
  constructor(props: IInfoWithLabelProps) {
    super(props);
  }
  render(){
    return (
      <div>
          <strong> {this.props.label} : </strong> {this.props.value}
      </div>
    );
  }
}
