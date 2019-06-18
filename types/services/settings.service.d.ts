import { SettingsService as SettingsServiceAbstraction } from '../abstractions/settings.service';
import { StorageService } from '../abstractions/storage.service';
import { UserService } from '../abstractions/user.service';
export declare class SettingsService implements SettingsServiceAbstraction {
    private userService;
    private storageService;
    private settingsCache;
    constructor(userService: UserService, storageService: StorageService);
    clearCache(): void;
    getEquivalentDomains(): Promise<any>;
    setEquivalentDomains(equivalentDomains: string[][]): Promise<void>;
    clear(userId: string): Promise<void>;
    private getSettings;
    private getSettingsKey;
    private setSettingsKey;
}
