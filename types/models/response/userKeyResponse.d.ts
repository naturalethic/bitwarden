import { BaseResponse } from './baseResponse';
export declare class UserKeyResponse extends BaseResponse {
    userId: string;
    publicKey: string;
    constructor(response: any);
}
