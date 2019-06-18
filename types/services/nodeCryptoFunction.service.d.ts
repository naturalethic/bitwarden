import { CryptoFunctionService } from '../abstractions/cryptoFunction.service';
import { DecryptParameters } from '../models/domain/decryptParameters';
import { SymmetricCryptoKey } from '../models/domain/symmetricCryptoKey';
export declare class NodeCryptoFunctionService implements CryptoFunctionService {
    pbkdf2(password: string | ArrayBuffer, salt: string | ArrayBuffer, algorithm: 'sha256' | 'sha512', iterations: number): Promise<ArrayBuffer>;
    hash(value: string | ArrayBuffer, algorithm: 'sha1' | 'sha256' | 'sha512' | 'md5'): Promise<ArrayBuffer>;
    hmac(value: ArrayBuffer, key: ArrayBuffer, algorithm: 'sha1' | 'sha256' | 'sha512'): Promise<ArrayBuffer>;
    compare(a: ArrayBuffer, b: ArrayBuffer): Promise<boolean>;
    hmacFast(value: ArrayBuffer, key: ArrayBuffer, algorithm: 'sha1' | 'sha256' | 'sha512'): Promise<ArrayBuffer>;
    compareFast(a: ArrayBuffer, b: ArrayBuffer): Promise<boolean>;
    aesEncrypt(data: ArrayBuffer, iv: ArrayBuffer, key: ArrayBuffer): Promise<ArrayBuffer>;
    aesDecryptFastParameters(data: string, iv: string, mac: string, key: SymmetricCryptoKey): DecryptParameters<ArrayBuffer>;
    aesDecryptFast(parameters: DecryptParameters<ArrayBuffer>): Promise<string>;
    aesDecrypt(data: ArrayBuffer, iv: ArrayBuffer, key: ArrayBuffer): Promise<ArrayBuffer>;
    rsaEncrypt(data: ArrayBuffer, publicKey: ArrayBuffer, algorithm: 'sha1' | 'sha256'): Promise<ArrayBuffer>;
    rsaDecrypt(data: ArrayBuffer, privateKey: ArrayBuffer, algorithm: 'sha1' | 'sha256'): Promise<ArrayBuffer>;
    rsaExtractPublicKey(privateKey: ArrayBuffer): Promise<ArrayBuffer>;
    rsaGenerateKeyPair(length: 1024 | 2048 | 4096): Promise<[ArrayBuffer, ArrayBuffer]>;
    randomBytes(length: number): Promise<ArrayBuffer>;
    private toNodeValue;
    private toNodeBuffer;
    private toArrayBuffer;
    private toPemPrivateKey;
    private toPemPublicKey;
}
