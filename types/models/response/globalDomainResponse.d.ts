import { BaseResponse } from './baseResponse';
export declare class GlobalDomainResponse extends BaseResponse {
    type: number;
    domains: string[];
    excluded: boolean;
    constructor(response: any);
}
