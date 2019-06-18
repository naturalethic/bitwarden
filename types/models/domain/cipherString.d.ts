import { EncryptionType } from '../../enums/encryptionType';
export declare class CipherString {
    encryptedString?: string;
    encryptionType?: EncryptionType;
    decryptedValue?: string;
    data?: string;
    iv?: string;
    mac?: string;
    constructor(encryptedStringOrType: string | EncryptionType, data?: string, iv?: string, mac?: string);
    decrypt(orgId: string): Promise<string>;
}
