import * as React from "react";
import NavBar from "./NavBar";
import {createNodes} from "../util/diff";

export interface IArticleRevisionProps {
  article: any
}

export interface IArticleRevisionState {
  title: string,
  ingress: string,
  words: string []
}

export default class ArticleRevision extends React.Component<
  IArticleRevisionProps,
  IArticleRevisionState
> {

  constructor(props: IArticleRevisionProps) {
    super(props);
    this.state = {
      title: 'plassholder',
      ingress: 'placeholder',
      words: []
    }
  }

  static replaceWord(text, word) {
    let wordsInText = text.split(' ');
    let result = [];
    for (let wordInText of wordsInText) {
      if (wordInText != word) {
        result.push(wordInText);
      }
    }
    return result.join(' ');
  }

  componentDidMount(): void {

    if (!this.props.article.diffs) {
      let title = this.props.article.revisions[0].title;
      let ingress = this.props.article.revisions[0].sub_title;
      let words = [];

      fetch(chrome.runtime.getURL('norwegian_stop_words.txt'))
          .then(file => {
            return file.text()

          })
          .then(text => {
            let everyWord = text.split('\n');
            for (let word of everyWord) {
              let temp = ArticleRevision.replaceWord(title, word);
              if (temp != title) {
                // @ts-ignore
                if (!words.includes(word)) {
                  words.push(word);
                }
                title = temp;
              }
              temp = ArticleRevision.replaceWord(ingress, word);
              if (temp != ingress) {
                // @ts-ignore
                if (!words.includes(word)) {
                  words.push(word);
                }

                ingress = temp;
              }
              this.setState({title, ingress, words})
            }
          });
    }
  }

  change_list() {
      let result = [];
      for (let diff of this.props.article.diffs){
        result.push([createNodes(diff)]);
      }
      return result.map((nodes) => <li>{nodes}</li>);
  }
  render() {
    if (this.props == null) {
      return <div> Not ready yet </div>
    } else {
      if (this.props.article.diffs) {
        return <div>
          <NavBar/>
          <h1> Endringer: </h1>
          <ul>
            {this.change_list()}
          </ul>
        </div>;
      } else {
        return <div>
          <NavBar/>
          <h1> 0 endringer på artikkelen med Tittel: </h1>
          <h2> {this.state.title}</h2>
          <h3> Ingress: </h3>
          <h4> {this.state.ingress}</h4>
          <h3> Tok vekk følgende ord: </h3>
          {this.state.words.map(word => <p> {word} </p>)}
        </div>
      }
    }
  }
}
