import { CipherRequest } from './cipherRequest';
import { FolderRequest } from './folderRequest';
import { KvpRequest } from './kvpRequest';
export declare class ImportCiphersRequest {
    ciphers: CipherRequest[];
    folders: FolderRequest[];
    folderRelationships: Array<KvpRequest<number, number>>;
}
