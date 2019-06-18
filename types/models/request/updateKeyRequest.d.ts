import { CipherWithIdRequest } from './cipherWithIdRequest';
import { FolderWithIdRequest } from './folderWithIdRequest';
export declare class UpdateKeyRequest {
    ciphers: CipherWithIdRequest[];
    folders: FolderWithIdRequest[];
    masterPasswordHash: string;
    privateKey: string;
    key: string;
}
