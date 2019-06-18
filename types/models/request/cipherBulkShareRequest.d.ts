import { CipherWithIdRequest } from './cipherWithIdRequest';
import { Cipher } from '../domain/cipher';
export declare class CipherBulkShareRequest {
    ciphers: CipherWithIdRequest[];
    collectionIds: string[];
    constructor(ciphers: Cipher[], collectionIds: string[]);
}
