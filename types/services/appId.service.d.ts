import { AppIdService as AppIdServiceAbstraction } from '../abstractions/appId.service';
import { StorageService } from '../abstractions/storage.service';
export declare class AppIdService implements AppIdServiceAbstraction {
    private storageService;
    constructor(storageService: StorageService);
    getAppId(): Promise<string>;
    getAnonymousAppId(): Promise<string>;
    private makeAndGetAppId;
}
