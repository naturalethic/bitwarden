import { CipherRequest } from './cipherRequest';
import { Cipher } from '../domain/cipher';
export declare class CipherCreateRequest {
    cipher: CipherRequest;
    collectionIds: string[];
    constructor(cipher: Cipher);
}
