import { PasswordHistoryData } from '../data/passwordHistoryData';
import { CipherString } from './cipherString';
import Domain from './domainBase';
import { PasswordHistoryView } from '../view/passwordHistoryView';
export declare class Password extends Domain {
    password: CipherString;
    lastUsedDate: Date;
    constructor(obj?: PasswordHistoryData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<PasswordHistoryView>;
    toPasswordHistoryData(): PasswordHistoryData;
}
