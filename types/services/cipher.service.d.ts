import { CipherType } from '../enums/cipherType';
import { CipherData } from '../models/data/cipherData';
import { Attachment } from '../models/domain/attachment';
import { Cipher } from '../models/domain/cipher';
import { Field } from '../models/domain/field';
import { Password } from '../models/domain/password';
import { SymmetricCryptoKey } from '../models/domain/symmetricCryptoKey';
import { AttachmentView } from '../models/view/attachmentView';
import { CipherView } from '../models/view/cipherView';
import { FieldView } from '../models/view/fieldView';
import { PasswordHistoryView } from '../models/view/passwordHistoryView';
import { ApiService } from '../abstractions/api.service';
import { CipherService as CipherServiceAbstraction } from '../abstractions/cipher.service';
import { CryptoService } from '../abstractions/crypto.service';
import { I18nService } from '../abstractions/i18n.service';
import { SearchService } from '../abstractions/search.service';
import { SettingsService } from '../abstractions/settings.service';
import { StorageService } from '../abstractions/storage.service';
import { UserService } from '../abstractions/user.service';
export declare class CipherService implements CipherServiceAbstraction {
    private cryptoService;
    private userService;
    private settingsService;
    private apiService;
    private storageService;
    private i18nService;
    private searchService;
    _decryptedCipherCache: CipherView[];
    constructor(cryptoService: CryptoService, userService: UserService, settingsService: SettingsService, apiService: ApiService, storageService: StorageService, i18nService: I18nService, searchService: () => SearchService);
    decryptedCipherCache: CipherView[];
    clearCache(): void;
    encrypt(model: CipherView, key?: SymmetricCryptoKey, originalCipher?: Cipher): Promise<Cipher>;
    encryptAttachments(attachmentsModel: AttachmentView[], key: SymmetricCryptoKey): Promise<Attachment[]>;
    encryptFields(fieldsModel: FieldView[], key: SymmetricCryptoKey): Promise<Field[]>;
    encryptField(fieldModel: FieldView, key: SymmetricCryptoKey): Promise<Field>;
    encryptPasswordHistories(phModels: PasswordHistoryView[], key: SymmetricCryptoKey): Promise<Password[]>;
    encryptPasswordHistory(phModel: PasswordHistoryView, key: SymmetricCryptoKey): Promise<Password>;
    get(id: string): Promise<Cipher>;
    getAll(): Promise<Cipher[]>;
    getAllDecrypted(): Promise<CipherView[]>;
    getAllDecryptedForGrouping(groupingId: string, folder?: boolean): Promise<CipherView[]>;
    getAllDecryptedForUrl(url: string, includeOtherTypes?: CipherType[]): Promise<CipherView[]>;
    getAllFromApiForOrganization(organizationId: string): Promise<CipherView[]>;
    getLastUsedForUrl(url: string): Promise<CipherView>;
    updateLastUsedDate(id: string): Promise<void>;
    saveNeverDomain(domain: string): Promise<void>;
    saveWithServer(cipher: Cipher): Promise<any>;
    shareWithServer(cipher: CipherView, organizationId: string, collectionIds: string[]): Promise<any>;
    shareManyWithServer(ciphers: CipherView[], organizationId: string, collectionIds: string[]): Promise<any>;
    saveAttachmentWithServer(cipher: Cipher, unencryptedFile: any, admin?: boolean): Promise<Cipher>;
    saveAttachmentRawWithServer(cipher: Cipher, filename: string, data: ArrayBuffer, admin?: boolean): Promise<Cipher>;
    saveCollectionsWithServer(cipher: Cipher): Promise<any>;
    upsert(cipher: CipherData | CipherData[]): Promise<any>;
    replace(ciphers: {
        [id: string]: CipherData;
    }): Promise<any>;
    clear(userId: string): Promise<any>;
    moveManyWithServer(ids: string[], folderId: string): Promise<any>;
    delete(id: string | string[]): Promise<any>;
    deleteWithServer(id: string): Promise<any>;
    deleteManyWithServer(ids: string[]): Promise<any>;
    deleteAttachment(id: string, attachmentId: string): Promise<void>;
    deleteAttachmentWithServer(id: string, attachmentId: string): Promise<void>;
    sortCiphersByLastUsed(a: CipherView, b: CipherView): number;
    sortCiphersByLastUsedThenName(a: CipherView, b: CipherView): number;
    getLocaleSortingFunction(): (a: CipherView, b: CipherView) => number;
    private shareAttachmentWithServer;
    private encryptObjProperty;
    private encryptCipherData;
}
