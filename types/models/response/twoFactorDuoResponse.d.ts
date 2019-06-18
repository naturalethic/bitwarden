import { BaseResponse } from './baseResponse';
export declare class TwoFactorDuoResponse extends BaseResponse {
    enabled: boolean;
    host: string;
    secretKey: string;
    integrationKey: string;
    constructor(response: any);
}
