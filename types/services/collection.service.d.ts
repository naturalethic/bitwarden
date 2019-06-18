import { CollectionData } from '../models/data/collectionData';
import { Collection } from '../models/domain/collection';
import { TreeNode } from '../models/domain/treeNode';
import { CollectionView } from '../models/view/collectionView';
import { CollectionService as CollectionServiceAbstraction } from '../abstractions/collection.service';
import { CryptoService } from '../abstractions/crypto.service';
import { I18nService } from '../abstractions/i18n.service';
import { StorageService } from '../abstractions/storage.service';
import { UserService } from '../abstractions/user.service';
export declare class CollectionService implements CollectionServiceAbstraction {
    private cryptoService;
    private userService;
    private storageService;
    private i18nService;
    decryptedCollectionCache: CollectionView[];
    constructor(cryptoService: CryptoService, userService: UserService, storageService: StorageService, i18nService: I18nService);
    clearCache(): void;
    encrypt(model: CollectionView): Promise<Collection>;
    decryptMany(collections: Collection[]): Promise<CollectionView[]>;
    get(id: string): Promise<Collection>;
    getAll(): Promise<Collection[]>;
    getAllDecrypted(): Promise<CollectionView[]>;
    getAllNested(collections?: CollectionView[]): Promise<Array<TreeNode<CollectionView>>>;
    getNested(id: string): Promise<TreeNode<CollectionView>>;
    upsert(collection: CollectionData | CollectionData[]): Promise<any>;
    replace(collections: {
        [id: string]: CollectionData;
    }): Promise<any>;
    clear(userId: string): Promise<any>;
    delete(id: string | string[]): Promise<any>;
}
