import { LoginApi } from '../api/loginApi';
import { LoginUriData } from './loginUriData';
export declare class LoginData {
    uris: LoginUriData[];
    username: string;
    password: string;
    passwordRevisionDate: string;
    totp: string;
    constructor(data?: LoginApi);
}
