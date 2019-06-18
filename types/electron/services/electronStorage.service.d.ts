import { StorageService } from '../../abstractions/storage.service';
export declare class ElectronStorageService implements StorageService {
    private store;
    constructor(dir: string, defaults?: {});
    get<T>(key: string): Promise<T>;
    save(key: string, obj: any): Promise<any>;
    remove(key: string): Promise<any>;
}
