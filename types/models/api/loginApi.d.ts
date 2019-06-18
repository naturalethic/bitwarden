import { BaseResponse } from '../response/baseResponse';
import { LoginUriApi } from './loginUriApi';
export declare class LoginApi extends BaseResponse {
    uris: LoginUriApi[];
    username: string;
    password: string;
    passwordRevisionDate: string;
    totp: string;
    constructor(data?: any);
}
