import { LoginUri } from './loginUri';
import { LoginData } from '../data/loginData';
import { LoginView } from '../view/loginView';
import { CipherString } from './cipherString';
import Domain from './domainBase';
export declare class Login extends Domain {
    uris: LoginUri[];
    username: CipherString;
    password: CipherString;
    passwordRevisionDate?: Date;
    totp: CipherString;
    constructor(obj?: LoginData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<LoginView>;
    toLoginData(): LoginData;
}
