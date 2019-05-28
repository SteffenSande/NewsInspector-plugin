/**
 * Creates a tag from the input of the findFirstTag function and returns react node
 * @param text
 * @param tag - tuple in array form that represents the answer that finFirstTag returns
 * @param currentIndex is the index you want to create a tag at
 */
import * as React from "react";

export function createTag(text: string, tag: [number, number, string], currentIndex: number) {
    let type: string = tag[2];
    let startIndex: number = tag[0];
    let endIndex: number = tag[1];
    let actualText: string = text.slice(startIndex, endIndex);
    endIndex += currentIndex;


    let res = null;
    switch (type) {
        case 'old':
            // Returns old text
            res = <del className="old" key={endIndex}> {actualText} </del>;
            endIndex += 5;
            break;
        case'new':
            // Returns new text
            res = <ins className="new" key={endIndex}> {actualText} </ins>;
            endIndex += 5;
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
 */
export function findFirstTag(text: string): [number, number, string] {
    let newTag = '|new|';
    let oldTag = '|old|';

    let indexNew = text.indexOf(newTag);
    let indexOld = text.indexOf(oldTag);

    // If indexOld and indexNew are -1 then return the rest of the text as normal text
    if (indexOld === indexNew) {
        return [0, text.length, 'normal'];
    }

    if (indexNew == 0 || indexOld == 0) {
        for (let i = Math.min(indexNew, indexOld) + 5; i < text.length; i++) {
            if (text[i] == '|') {
                if (text.slice(i + 1, i + 4) == 'new') {
                    return [indexNew + 5, i, 'new'];
                }
                if (text.slice(i + 1, i + 4) == 'old') {
                    return [indexOld + 5, i, 'old'];
                }
            }
        }
    }

    if (indexNew == -1) {
        return [0, indexOld, 'normal'];
    } else if (indexOld == -1) {
        return [0, indexNew, 'normal'];
    } else {
        return [0, Math.min(indexNew, indexOld), 'normal'];
    }
}

export function createNodes(text: string) {
    let result = [];
    let currentIndex = 0;
    let tag = null;
    if (text) {
        while (currentIndex < text.length - 1) {
            tag = createTag(text.slice(currentIndex), findFirstTag(text.slice(currentIndex)), currentIndex);
            result.push(tag[0]);
            currentIndex = tag[1];
        }
    }
    return result;
}
