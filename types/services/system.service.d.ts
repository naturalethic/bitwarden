import { LockService } from '../abstractions/lock.service';
import { MessagingService } from '../abstractions/messaging.service';
import { PlatformUtilsService } from '../abstractions/platformUtils.service';
import { StorageService } from '../abstractions/storage.service';
import { SystemService as SystemServiceAbstraction } from '../abstractions/system.service';
export declare class SystemService implements SystemServiceAbstraction {
    private storageService;
    private lockService;
    private messagingService;
    private platformUtilsService;
    private reloadCallback;
    private reloadInterval;
    private clearClipboardTimeout;
    private clearClipboardTimeoutFunction;
    constructor(storageService: StorageService, lockService: LockService, messagingService: MessagingService, platformUtilsService: PlatformUtilsService, reloadCallback?: () => Promise<void>);
    startProcessReload(): void;
    cancelProcessReload(): void;
    clearClipboard(clipboardValue: string, timeoutMs?: number): void;
    clearPendingClipboard(): Promise<void>;
}
