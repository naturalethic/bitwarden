import { BaseResponse } from './baseResponse';
export declare class TwoFactorEmailResponse extends BaseResponse {
    enabled: boolean;
    email: string;
    constructor(response: any);
}
