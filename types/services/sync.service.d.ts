import { ApiService } from '../abstractions/api.service';
import { CipherService } from '../abstractions/cipher.service';
import { CollectionService } from '../abstractions/collection.service';
import { CryptoService } from '../abstractions/crypto.service';
import { FolderService } from '../abstractions/folder.service';
import { MessagingService } from '../abstractions/messaging.service';
import { SettingsService } from '../abstractions/settings.service';
import { StorageService } from '../abstractions/storage.service';
import { SyncService as SyncServiceAbstraction } from '../abstractions/sync.service';
import { UserService } from '../abstractions/user.service';
import { SyncCipherNotification, SyncFolderNotification } from '../models/response/notificationResponse';
export declare class SyncService implements SyncServiceAbstraction {
    private userService;
    private apiService;
    private settingsService;
    private folderService;
    private cipherService;
    private cryptoService;
    private collectionService;
    private storageService;
    private messagingService;
    private logoutCallback;
    syncInProgress: boolean;
    constructor(userService: UserService, apiService: ApiService, settingsService: SettingsService, folderService: FolderService, cipherService: CipherService, cryptoService: CryptoService, collectionService: CollectionService, storageService: StorageService, messagingService: MessagingService, logoutCallback: (expired: boolean) => Promise<void>);
    getLastSync(): Promise<Date>;
    setLastSync(date: Date): Promise<any>;
    fullSync(forceSync: boolean): Promise<boolean>;
    syncUpsertFolder(notification: SyncFolderNotification, isEdit: boolean): Promise<boolean>;
    syncDeleteFolder(notification: SyncFolderNotification): Promise<boolean>;
    syncUpsertCipher(notification: SyncCipherNotification, isEdit: boolean): Promise<boolean>;
    syncDeleteCipher(notification: SyncCipherNotification): Promise<boolean>;
    private syncStarted;
    private syncCompleted;
    private needsSyncing;
    private syncProfile;
    private syncFolders;
    private syncCollections;
    private syncCiphers;
    private syncSettings;
}
