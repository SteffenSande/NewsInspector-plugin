import StorageType from "./storageType";

class Storage {
    private static _instance: Storage = new Storage();
    public sites: StorageType = new StorageType();
    public limits: StorageType = new StorageType();
    public reportCategory: StorageType = new StorageType();

    private constructor() {
        if(Storage._instance){
            throw new Error("Error: Instantiation failed: Use StorageContainer.getInstance() instead of new.");
        }
        Storage._instance = this;
    }

    public static getInstance(): Storage
    {
        return Storage._instance;
    }
}

export default Storage;
