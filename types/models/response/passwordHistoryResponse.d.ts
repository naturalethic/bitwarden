import { BaseResponse } from './baseResponse';
export declare class PasswordHistoryResponse extends BaseResponse {
    password: string;
    lastUsedDate: string;
    constructor(response: any);
}
