import { FolderData } from '../models/data/folderData';
import { Folder } from '../models/domain/folder';
import { SymmetricCryptoKey } from '../models/domain/symmetricCryptoKey';
import { TreeNode } from '../models/domain/treeNode';
import { FolderView } from '../models/view/folderView';
import { ApiService } from '../abstractions/api.service';
import { CipherService } from '../abstractions/cipher.service';
import { CryptoService } from '../abstractions/crypto.service';
import { FolderService as FolderServiceAbstraction } from '../abstractions/folder.service';
import { I18nService } from '../abstractions/i18n.service';
import { StorageService } from '../abstractions/storage.service';
import { UserService } from '../abstractions/user.service';
export declare class FolderService implements FolderServiceAbstraction {
    private cryptoService;
    private userService;
    private apiService;
    private storageService;
    private i18nService;
    private cipherService;
    decryptedFolderCache: FolderView[];
    constructor(cryptoService: CryptoService, userService: UserService, apiService: ApiService, storageService: StorageService, i18nService: I18nService, cipherService: CipherService);
    clearCache(): void;
    encrypt(model: FolderView, key?: SymmetricCryptoKey): Promise<Folder>;
    get(id: string): Promise<Folder>;
    getAll(): Promise<Folder[]>;
    getAllDecrypted(): Promise<FolderView[]>;
    getAllNested(): Promise<Array<TreeNode<FolderView>>>;
    getNested(id: string): Promise<TreeNode<FolderView>>;
    saveWithServer(folder: Folder): Promise<any>;
    upsert(folder: FolderData | FolderData[]): Promise<any>;
    replace(folders: {
        [id: string]: FolderData;
    }): Promise<any>;
    clear(userId: string): Promise<any>;
    delete(id: string | string[]): Promise<any>;
    deleteWithServer(id: string): Promise<any>;
}
