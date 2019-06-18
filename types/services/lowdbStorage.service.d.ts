import { StorageService } from '../abstractions/storage.service';
export declare class LowdbStorageService implements StorageService {
    private allowCache;
    private db;
    private defaults;
    private dataFilePath;
    constructor(defaults?: any, dir?: string, allowCache?: boolean);
    init(): void;
    get<T>(key: string): Promise<T>;
    save(key: string, obj: any): Promise<any>;
    remove(key: string): Promise<any>;
    private readForNoCache;
}
