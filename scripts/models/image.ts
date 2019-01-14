import {IPhotographer} from "./photographer";
export interface IImage {
    id: number,
    url: string,
    text: string,
    photographers: IPhotographer[]
}