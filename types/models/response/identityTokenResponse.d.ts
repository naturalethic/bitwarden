import { BaseResponse } from './baseResponse';
export declare class IdentityTokenResponse extends BaseResponse {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    tokenType: string;
    privateKey: string;
    key: string;
    twoFactorToken: string;
    constructor(response: any);
}
