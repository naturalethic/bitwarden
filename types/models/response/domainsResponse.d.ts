import { BaseResponse } from './baseResponse';
import { GlobalDomainResponse } from './globalDomainResponse';
export declare class DomainsResponse extends BaseResponse {
    equivalentDomains: string[][];
    globalEquivalentDomains: GlobalDomainResponse[];
    constructor(response: any);
}
