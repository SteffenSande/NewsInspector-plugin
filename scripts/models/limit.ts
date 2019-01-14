
export enum Limits {
    Ignore = 'IGNORE',
    Low = 'LOW',
    Mid = 'MID',
    High = 'HIGH'
}

export interface ILimit {
    value: number,
    key: Limits
}
