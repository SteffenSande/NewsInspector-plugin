import * as React from "react";
import {IChange} from "../models/headlineDiff";

export function createTag(type_of_change: number, text) {
    //  Type of change -1: old, 0: no change and 1: new

    let res = null;
    switch (type_of_change) {
        case -1:
            // Returns old text
            res = <del className="old" key={text}> {text} </del>;
            break;
        case 1:
            // Returns new text
            res = <ins className="new" key={text}> {text} </ins>;
            break;
        default:
            // Returns normal text
            res = <span className="normal" key={text}> {text} </span>;
    }
    return res
}

export function createNodes(changes: IChange[]) {
    changes.sort((a, b) => a.pos - b.pos);
    return  changes.map(change => createTag(change.type_of_change, change.text));
}
