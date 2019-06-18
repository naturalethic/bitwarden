import { SymmetricCryptoKey } from './symmetricCryptoKey';
export declare class EncryptedObject {
    iv: ArrayBuffer;
    data: ArrayBuffer;
    mac: ArrayBuffer;
    key: SymmetricCryptoKey;
}
