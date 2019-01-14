import IStorageItem from "../background/storage/storageItem";

export interface ITabData {
    sites: IStorageItem[],
    limits: IStorageItem[]
}