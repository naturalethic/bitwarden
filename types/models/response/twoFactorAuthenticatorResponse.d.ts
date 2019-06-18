import { BaseResponse } from './baseResponse';
export declare class TwoFactorAuthenticatorResponse extends BaseResponse {
    enabled: boolean;
    key: string;
    constructor(response: any);
}
