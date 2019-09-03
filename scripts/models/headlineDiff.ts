export interface IChange {
    id:number,
    text:string,
    type_of_change: number,
    pos: number,
    title:boolean,
}

export interface IHeadlineDiff {
    id: number,
    title_changes: IChange[],
    sub_title_changes: IChange[],
}