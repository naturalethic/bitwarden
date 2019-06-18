import { BaseResponse } from './baseResponse';
export declare class KeysResponse extends BaseResponse {
    privateKey: string;
    publicKey: string;
    constructor(response: any);
}
