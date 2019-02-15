import * as React from 'react';
import Log from "../util/debug";


export interface IHeadlineRevisionProps {
    title: string;
}

export interface IHeadlineRevisionState {
    diffs: string[];
    selected: number;
}

export default class HeadlineRevision extends React.Component<IHeadlineRevisionProps,
    IHeadlineRevisionState> {
    constructor(props: IHeadlineRevisionProps) {
        super(props);
        this.state = {
            diffs: [
                "Dette er noe er noe annet",
                "Dette er <old>noe<old/><new>annet<new/> er det ikke?",
                "Dette er <old>annet<old/> er det ikke?",
                "Dette er <old>er<old/>det ikke?",
            ]
            ,
            selected: 0
        };
    }

    /**
     * Creates a tag from the input of the findFirstTag function and returns react node
     * @param text
     * @param tag - tuple in array form that represents the answer that finFirstTag returns
     */
    static createTag(text: string, tag: [number, number, string]) {
        let type: string = tag[2];
        let startIndex: number = tag[0];
        let endIndex: number = tag[1];
        let actualText: string = text.slice(startIndex, endIndex);
        console.log(actualText);
        let res = null;
        switch (type) {
            case 'old':
                // Returns old text
                res = <del className="old" key={endIndex}> {actualText} </del>;
                endIndex += 6;
                break;
            case'new':
                // Returns new text
                res = <ins className="new" key={endIndex}> {actualText} </ins>;
                endIndex += 6;
                break;
            default:
                // Returns normal text
                res = <span className="normal" key={endIndex}> {actualText} </span>;
        }
        return [res, endIndex];
    }

    /**
     * Finds first occurrence of the tags old or new in a string
     * @param text the searchable text
     * @param currentIndex is the current index of our search for new nodes
     */
    static findFirstTag(text: string, currentIndex: number): [number, number, string] {
        let newTag = '<new>';
        let oldTag = '<old>';

        let indexNew = text.indexOf(newTag);
        let indexOld = text.indexOf(oldTag);


        Log.info('Index new: ', indexNew);
        Log.info('Index old: ', indexOld);
        Log.info('Index current: ', currentIndex);
        if (indexOld === indexNew) {
            return [0, text.length, 'normal'];
        } else  if (currentIndex < indexNew || currentIndex < indexOld ) {
            if( indexNew == -1)
                return [0,indexOld, 'normal'];
            else if (indexOld == -1)
                return [0,indexNew, 'normal'];
            else
                return [0, Math.min(indexOld, indexNew), 'normal'];
        } else {
            for (let i = Math.min(indexNew, indexOld) + 5; i < text.length; i++) {
                if (text[i] == '<') {
                    if (text.slice(i + 1, i + 4) == 'new') {
                        return [indexNew + 5, i, 'new'];
                    }
                    if (text.slice(i + 1, i + 4) == 'old') {
                        return [indexOld + 5, i, 'old'];
                    }
                }
            }
        }
    }

    createNodes(text: string) {
        console.log(text);
        let result = [];
        let currentIndex = 0;
        let tag;

        while (currentIndex < text.length - 1) {
            tag = HeadlineRevision.createTag(text.slice(currentIndex), HeadlineRevision.findFirstTag(text.slice(currentIndex), currentIndex));
            result.push(tag[0]);
            currentIndex += tag[1];
        }
        return result;
    }

    chooseNext() {
        if (this.state.selected < this.state.diffs.length - 1) {
            this.setState({...this.state, selected: this.state.selected + 1});
        } else {
            this.setState({...this.state, selected: 0});
        }
    }

    choosePrevious() {
        if (this.state.selected > 0) {
            this.setState({...this.state, selected: this.state.selected - 1});
        } else {
            this.setState({...this.state, selected: this.state.diffs.length - 1});
        }
    }

    render() {
        return (
            <div>
                <p id={'title'}>
                    <strong> Title:</strong>
                    {this.createNodes(this.state.diffs[this.state.selected])}
                </p>
                <button className={'btn btn-light'}
                        onClick={(e) => {
                            e.preventDefault();
                            this.choosePrevious();
                            document.getElementById('title').focus(); // Fungerer ikke
                        }}
                > Previous diff
                </button>
                <button className={'btn btn-dark'}
                        onClick={(e) => {
                            e.preventDefault();
                            this.chooseNext();
                            document.getElementById('title').focus(); // Fungerer ikke
                        }}
                > Next diff
                </button>
            </div>
        );
    }
}
