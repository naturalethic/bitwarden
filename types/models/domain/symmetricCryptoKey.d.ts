import { EncryptionType } from '../../enums/encryptionType';
export declare class SymmetricCryptoKey {
    key: ArrayBuffer;
    encKey?: ArrayBuffer;
    macKey?: ArrayBuffer;
    encType: EncryptionType;
    keyB64: string;
    encKeyB64: string;
    macKeyB64: string;
    meta: any;
    constructor(key: ArrayBuffer, encType?: EncryptionType);
}
