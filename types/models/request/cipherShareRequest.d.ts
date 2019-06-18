import { CipherRequest } from './cipherRequest';
import { Cipher } from '../domain/cipher';
export declare class CipherShareRequest {
    cipher: CipherRequest;
    collectionIds: string[];
    constructor(cipher: Cipher);
}
