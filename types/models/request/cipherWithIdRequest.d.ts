import { CipherRequest } from './cipherRequest';
import { Cipher } from '../domain/cipher';
export declare class CipherWithIdRequest extends CipherRequest {
    id: string;
    constructor(cipher: Cipher);
}
