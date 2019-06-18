import { UriMatchType } from '../../enums/uriMatchType';
import { LoginUriData } from '../data/loginUriData';
import { LoginUriView } from '../view/loginUriView';
import { CipherString } from './cipherString';
import Domain from './domainBase';
export declare class LoginUri extends Domain {
    uri: CipherString;
    match: UriMatchType;
    constructor(obj?: LoginUriData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<LoginUriView>;
    toLoginUriData(): LoginUriData;
}
