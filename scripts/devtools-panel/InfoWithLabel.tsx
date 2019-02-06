import * as React from 'react';

export interface IInfoWithLabelProps {
  label: string;
  value: string;
}

export interface IInfoWithLabelState {
  oldText: string[];
  newText: string[];
}

export default class InfoWithLabel extends React.Component<
  IInfoWithLabelProps,
  IInfoWithLabelState
> {
  constructor(props: IInfoWithLabelProps) {
    super(props);

    let allText: string[] = InfoWithLabel.scrapeTextFromDiff(props.value);
    let oldText: string[] = [];
    let newText: string[] = [];

    console.log(allText);
    for (let i: number = 0; i < allText.length; i++) {
      if (i % 2 == 0) {
        oldText.push(allText[i]);
      } else {
        newText.push(allText[i]);
      }
    }
    this.state = {
      oldText, newText
    };
    console.log(this.state);
  }

  static stringToHtml(html: string): any {
    let template = document.createElement('div');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template;
  }

  static scrapeTextFromDiff(diff: string): string[] {
    let allText: string[] = [];
    let temp = InfoWithLabel.stringToHtml(diff);
    let spans = temp.getElementsByTagName('span');
    for (let i = 0; i < spans.length; i++) {
      allText.push(spans.item(i).innerText.toString());
    }
    console.log(allText);
    return allText;
  }

  render() {
    return (
      <div>
        <strong> {this.props.label} </strong>: <small className={'lead'}> Old:</small> {this.state.oldText} -> <small
          className={'lead'}> New: </small>{this.state.newText}
      </div>
    );
  }
}
