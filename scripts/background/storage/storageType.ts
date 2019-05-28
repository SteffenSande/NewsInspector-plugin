import IStorageItem from "./storageItem";

class StorageType {
    private storage: IStorageItem[] = [];

    public add(item: IStorageItem): void {
        this.storage.push(item);
    }

    public exists(key: string): boolean {
        return this.find_index_of(key) !== -1;
    }

    public get(key: string): IStorageItem {
        let index = this.find_index_of(key);
        if (index > -1) {

            return this.storage[index];
        }
        return null;
    }

    public update(item: IStorageItem) {
        let index = this.find_index_of(item.key);

        if (index > -1)
            this.storage[index] = item;
    }

    public delete(key: string):void {
        let index = this.find_index_of(key);
        if (index > -1) {
            this.storage.splice(index, 1);
        }
    }

    public count(): number {
        return this.storage.length;
    }

    public at(index: number): any {
        if (index > this.count())
            return null;
        return this.storage[index];
    }

    public all(): IStorageItem[] {
        return this.storage;
    }

    private find_index_of(key: string): number {
        if (key === undefined)
            return -1;

        return this.storage.findIndex((item) => key.indexOf(item.key) !== -1 );
    }
}

export default StorageType;