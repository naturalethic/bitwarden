import { ApiService } from '../abstractions/api.service';
import { EnvironmentService as EnvironmentServiceAbstraction } from '../abstractions/environment.service';
import { NotificationsService } from '../abstractions/notifications.service';
import { StorageService } from '../abstractions/storage.service';
export declare class EnvironmentService implements EnvironmentServiceAbstraction {
    private apiService;
    private storageService;
    private notificationsService;
    baseUrl: string;
    webVaultUrl: string;
    apiUrl: string;
    identityUrl: string;
    iconsUrl: string;
    notificationsUrl: string;
    constructor(apiService: ApiService, storageService: StorageService, notificationsService: NotificationsService);
    getWebVaultUrl(): string;
    setUrlsFromStorage(): Promise<void>;
    setUrls(urls: any): Promise<any>;
    private formatUrl;
}
